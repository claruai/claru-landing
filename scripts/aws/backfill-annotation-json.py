#!/usr/bin/env python3
"""
Backfill ai_enrichment_json from annotation JSON files stored in S3.

Reads annotation-data.json files referenced by ann_annotation_key in the clips
table and writes their parsed contents into the ai_enrichment_json column.
Also extracts structured fields into ann_metadata if not already populated.

Designed to run on an EC2 instance in us-east-1 (same region as the S3 bucket)
for maximum throughput and zero egress cost.

Usage:
  python3 backfill-annotation-json.py [--dry-run] [--limit 5000] [--workers 16] [--batch-size 500]

Env vars:
  SUPABASE_URL            - Supabase project URL
  SUPABASE_SERVICE_KEY    - Supabase service role key
  AWS_ACCESS_KEY_ID       - (optional if using IAM role)
  AWS_SECRET_ACCESS_KEY   - (optional if using IAM role)
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from typing import Any

import boto3
from botocore.exceptions import ClientError
from supabase import create_client, Client

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("backfill-annotation-json")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
BUCKET = "moonvalley-annotation-platform"

if not SUPABASE_URL or not SUPABASE_KEY:
    log.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars.")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Supabase helpers
# ---------------------------------------------------------------------------


def create_supabase_client() -> Client:
    """Create a Supabase client with the service role key."""
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_clips_batch(
    sb: Client,
    batch_size: int,
    offset: int,
) -> list[dict]:
    """Fetch a batch of clips needing annotation JSON backfill.

    Criteria: ann_annotation_key IS NOT NULL AND ai_enrichment_json IS NULL
    """
    resp = (
        sb.table("clips")
        .select("id, ann_annotation_key, ann_metadata")
        .not_.is_("ann_annotation_key", "null")
        .is_("ai_enrichment_json", "null")
        .order("created_at")
        .range(offset, offset + batch_size - 1)
        .execute()
    )
    return resp.data or []


def update_clip(sb: Client, clip_id: str, payload: dict[str, Any]) -> bool:
    """Update a single clip row. Returns True on success."""
    try:
        sb.table("clips").update(payload).eq("id", clip_id).execute()
        return True
    except Exception as exc:
        log.warning("Failed to update clip %s: %s", clip_id[:12], exc)
        return False


# ---------------------------------------------------------------------------
# S3 helpers
# ---------------------------------------------------------------------------


def create_s3_client() -> Any:
    """Create a boto3 S3 client.

    Uses IAM role credentials when running on EC2, or explicit env vars
    (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) otherwise.
    """
    return boto3.client("s3", region_name="us-east-1")


def download_json_from_s3(s3_client: Any, key: str) -> dict | None:
    """Download and parse a JSON file from S3. Returns None on failure."""
    try:
        resp = s3_client.get_object(Bucket=BUCKET, Key=key)
        body = resp["Body"].read()
        return json.loads(body)
    except ClientError as exc:
        error_code = exc.response.get("Error", {}).get("Code", "")
        if error_code in ("NoSuchKey", "AccessDenied"):
            log.debug("S3 key not found or access denied: %s", key[:80])
        else:
            log.warning("S3 error for %s: %s", key[:80], exc)
        return None
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        log.warning("Malformed JSON at %s: %s", key[:80], exc)
        return None


# ---------------------------------------------------------------------------
# Extraction logic
# ---------------------------------------------------------------------------


def extract_ann_metadata(annotation_json: dict) -> dict[str, Any] | None:
    """Extract structured ann_metadata fields from the raw annotation JSON.

    Handles common shapes from the annotation platform:
      - {generalData: {mainCategory, subcategory, activities, flow}}
      - {category, subcategory, activities}
      - {category, main_category, quality}  (troveo shape)

    Returns a cleaned dict suitable for the ann_metadata JSONB column,
    or None if nothing meaningful was extracted.
    """
    metadata: dict[str, Any] = {}

    # Try generalData shape first (annotation-platform)
    gd = annotation_json.get("generalData")
    if isinstance(gd, dict):
        if gd.get("mainCategory"):
            metadata["category"] = gd["mainCategory"]
        if gd.get("subcategory"):
            metadata["subcategory"] = gd["subcategory"]
        if gd.get("activities") and isinstance(gd["activities"], list):
            metadata["activities"] = gd["activities"]
        if gd.get("flow"):
            metadata["flow"] = gd["flow"]

    # Try top-level fields
    if not metadata.get("category"):
        cat = annotation_json.get("category") or annotation_json.get("main_category")
        if cat:
            metadata["category"] = cat

    if not metadata.get("subcategory"):
        sub = annotation_json.get("subcategory")
        if sub:
            metadata["subcategory"] = sub

    if not metadata.get("activities"):
        acts = annotation_json.get("activities")
        if isinstance(acts, list) and acts:
            metadata["activities"] = acts

    # Additional fields that are useful
    for field in ("quality", "project_type", "project_tag", "source", "annotator_id"):
        val = annotation_json.get(field)
        if val is not None:
            metadata[field] = val

    return metadata if metadata else None


# ---------------------------------------------------------------------------
# Worker
# ---------------------------------------------------------------------------


def process_clip(
    s3_client: Any,
    sb: Client,
    clip: dict,
    dry_run: bool,
) -> tuple[str, bool, str]:
    """Process a single clip: download JSON, extract metadata, write to DB.

    Returns (clip_id, success, message).
    """
    clip_id: str = clip["id"]
    ann_key: str = clip["ann_annotation_key"]
    existing_metadata = clip.get("ann_metadata")

    # Download the annotation JSON from S3
    annotation_json = download_json_from_s3(s3_client, ann_key)
    if annotation_json is None:
        return (clip_id, False, "s3_download_failed")

    # Build the update payload
    payload: dict[str, Any] = {
        "ai_enrichment_json": annotation_json,
    }

    # Extract ann_metadata if not already populated
    if not existing_metadata:
        extracted = extract_ann_metadata(annotation_json)
        if extracted:
            payload["ann_metadata"] = extracted

    if dry_run:
        keys_preview = list(annotation_json.keys())[:5]
        return (clip_id, True, f"dry_run keys={keys_preview}")

    # Write to database
    success = update_clip(sb, clip_id, payload)
    if success:
        return (clip_id, True, "updated")
    return (clip_id, False, "db_update_failed")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Backfill ai_enrichment_json from S3 annotation JSONs"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview what would be done without writing to the database",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Maximum number of clips to process (0 = all)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=16,
        help="Number of parallel workers (default: 16)",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=500,
        help="Number of clips to fetch per batch (default: 500)",
    )
    args = parser.parse_args()

    log.info(
        "Starting backfill: limit=%s, workers=%d, batch_size=%d, dry_run=%s",
        args.limit or "all",
        args.workers,
        args.batch_size,
        args.dry_run,
    )

    sb = create_supabase_client()
    s3 = create_s3_client()

    total_processed = 0
    total_success = 0
    total_failed = 0
    total_skipped = 0
    offset = 0
    start_time = time.monotonic()

    try:
        while True:
            # Check limit
            remaining = args.limit - total_processed if args.limit > 0 else args.batch_size
            if args.limit > 0 and total_processed >= args.limit:
                log.info("Reached limit of %d clips.", args.limit)
                break

            fetch_size = min(args.batch_size, remaining) if args.limit > 0 else args.batch_size

            # Fetch batch
            clips = fetch_clips_batch(sb, fetch_size, offset=0)
            if not clips:
                log.info("No more clips to process.")
                break

            log.info("Fetched %d clips (total processed so far: %d)", len(clips), total_processed)

            # Process in parallel
            with ThreadPoolExecutor(max_workers=args.workers) as executor:
                futures = {
                    executor.submit(process_clip, s3, sb, clip, args.dry_run): clip["id"]
                    for clip in clips
                }

                for future in as_completed(futures):
                    clip_id = futures[future]
                    try:
                        _cid, success, message = future.result()
                        if success:
                            total_success += 1
                        else:
                            total_failed += 1
                            if message == "s3_download_failed":
                                total_skipped += 1
                    except Exception as exc:
                        log.error("Unhandled error for clip %s: %s", clip_id[:12], exc)
                        total_failed += 1

            total_processed += len(clips)

            # Progress logging every 1000 clips
            if total_processed % 1000 < args.batch_size:
                elapsed = time.monotonic() - start_time
                rate = total_processed / elapsed if elapsed > 0 else 0
                log.info(
                    "Progress: %d processed, %d success, %d failed, %d skipped | %.1f clips/sec",
                    total_processed,
                    total_success,
                    total_failed,
                    total_skipped,
                    rate,
                )

            # Small pause between batches to avoid hammering Supabase
            time.sleep(0.1)

    except KeyboardInterrupt:
        log.info("Interrupted by user.")

    elapsed = time.monotonic() - start_time
    log.info(
        "Done. Processed: %d, Success: %d, Failed: %d, Skipped: %d | Total time: %.1fs",
        total_processed,
        total_success,
        total_failed,
        total_skipped,
        elapsed,
    )


if __name__ == "__main__":
    main()
