#!/usr/bin/env python3
"""
Load troveo per-video metadata JSONs from mv-troveo S3 bucket into the clips table.

For each metadata JSON in mv-troveo/{tranche}/{delivery}/metadata/{id}.json:
1. Derive the matching clip's s3_key (payload path)
2. PATCH the existing clip with:
   - ann_metadata: {category, main_category, subcategory, quality, original_video_details, channel_details}
   - tech_resolution_width, tech_resolution_height, tech_fps, tech_duration_seconds,
     tech_file_size_bytes, tech_codec
   - ai_enrichment_json: full clip_annotations blob
3. Set caption_rebuilt_at = NULL so the rebuild script re-embeds with the new data

Does NOT insert new rows -- only updates existing clips loaded by the cobry loader.
Does NOT generate embeddings -- that is the rebuild script's job.

Usage:
  source .env.local
  python3 scripts/load-troveo-metadata-to-clips.py [--limit 5] [--dry-run]

Requires: Python 3.10+, boto3, httpx
Env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AWS_REGION (optional)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# Runtime dependency checks
# ---------------------------------------------------------------------------

def _check_python_version() -> None:
    if sys.version_info < (3, 10):
        print(f"ERROR: Python 3.10+ required, got {sys.version}", file=sys.stderr)
        sys.exit(1)

_check_python_version()

_MISSING: list[str] = []
try:
    import boto3  # noqa: F401
except ImportError:
    _MISSING.append("boto3")
try:
    import httpx  # noqa: F401
except ImportError:
    _MISSING.append("httpx")

if _MISSING:
    print(f"ERROR: Missing dependencies: {', '.join(_MISSING)}", file=sys.stderr)
    print(f"  pip install {' '.join(_MISSING)}", file=sys.stderr)
    sys.exit(1)

import boto3
import httpx

# ---------------------------------------------------------------------------
# Env vars (auto-load .env.local if present)
# ---------------------------------------------------------------------------

def _load_dotenv() -> None:
    """Load .env.local from project root (handles simple KEY=VALUE lines only)."""
    import re
    env_path = Path(__file__).resolve().parent.parent / ".env.local"
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)", line)
        if m and m.group(1) not in os.environ:
            os.environ[m.group(1)] = m.group(2)

_load_dotenv()

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
BUCKET = "mv-troveo"

CHECKPOINT_PATH = Path(__file__).parent / ".troveo_metadata_checkpoint.json"

# ---------------------------------------------------------------------------
# Checkpoint helpers (crash recovery)
# ---------------------------------------------------------------------------

def load_checkpoint() -> dict:
    if CHECKPOINT_PATH.exists():
        return json.loads(CHECKPOINT_PATH.read_text())
    return {"completed_tranches": [], "total_updated": 0, "total_skipped": 0, "total_failed": 0}


def save_checkpoint(state: dict) -> None:
    CHECKPOINT_PATH.write_text(json.dumps(state, indent=2))

# ---------------------------------------------------------------------------
# S3 helpers
# ---------------------------------------------------------------------------

def list_prefixes(s3_client, prefix: str) -> list[str]:
    """List common prefixes (subdirectories) under a prefix."""
    prefixes: list[str] = []
    paginator = s3_client.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET, Prefix=prefix, Delimiter="/"):
        for cp in page.get("CommonPrefixes", []):
            prefixes.append(cp["Prefix"])
    return prefixes


def list_objects(s3_client, prefix: str, extension: str = ".json") -> list[str]:
    """List all object keys with a given extension under a prefix."""
    keys: list[str] = []
    paginator = s3_client.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET, Prefix=prefix):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if key.endswith(extension):
                keys.append(key)
    return keys


def read_json_from_s3(s3_client, key: str) -> dict | None:
    """Read and parse a JSON file from S3."""
    try:
        obj = s3_client.get_object(Bucket=BUCKET, Key=key)
        return json.loads(obj["Body"].read())
    except Exception:
        return None

# ---------------------------------------------------------------------------
# Key derivation (troveo deliverable path -> payload filename)
# ---------------------------------------------------------------------------

def derive_payload_filename(aws_path: str) -> str:
    """Derive the payload filename from the troveo-deliverable S3 path.

    Input:  s3://troveo-deliverable/dt=2024-10-21-22-41/318/clips/PAzABiWs_clip_15.mp4
    Output: dt_2024_10_21_22_41_318_clips_pazabiws_clip_15.mp4
    """
    # Strip s3://bucket/ prefix
    stripped = re.sub(r"^s3://[^/]+/", "", aws_path)
    return re.sub(r"[/=\-]", "_", stripped).lower()

# ---------------------------------------------------------------------------
# Metadata extraction
# ---------------------------------------------------------------------------

def extract_ann_metadata(meta: dict) -> dict:
    """Extract annotation metadata from troveo JSON for ann_metadata column."""
    result: dict = {}

    if meta.get("category"):
        result["category"] = meta["category"]
    if meta.get("main_category"):
        result["main_category"] = meta["main_category"]
    if meta.get("subcategory"):
        result["subcategory"] = meta["subcategory"]
    if meta.get("quality"):
        result["quality"] = meta["quality"]

    # Original video details (troveo source info)
    video_details: dict = {}
    for field in ("id", "video_id", "aws_s3_video_file_path", "format_note"):
        if meta.get(field) is not None:
            video_details[field] = meta[field]
    if video_details:
        result["original_video_details"] = video_details

    # Channel details (some troveo JSONs include channel info)
    channel_details: dict = {}
    for field in ("channel_name", "channel_id", "channel_url"):
        if meta.get(field) is not None:
            channel_details[field] = meta[field]
    if channel_details:
        result["channel_details"] = channel_details

    return result


def extract_enrichment_json(meta: dict) -> dict | None:
    """Extract the full clip_annotations blob for ai_enrichment_json."""
    clip_annotations = meta.get("clip_annotations")
    if clip_annotations and isinstance(clip_annotations, dict):
        # Filter out empty strings and None values
        return {k: v for k, v in clip_annotations.items() if v is not None and v != ""}
    return None

# ---------------------------------------------------------------------------
# Safe type helpers
# ---------------------------------------------------------------------------

def safe_int(val) -> int | None:
    if val is None:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


def safe_float(val) -> float | None:
    if val is None:
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None

# ---------------------------------------------------------------------------
# Supabase REST PATCH (update existing clips)
# ---------------------------------------------------------------------------

def patch_clip(
    http_client: httpx.Client,
    s3_key: str,
    payload: dict,
) -> bool:
    """PATCH a single clip by s3_bucket + s3_key. Returns True on success."""
    url = f"{SUPABASE_URL}/rest/v1/clips"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    params = {
        "s3_bucket": f"eq.{BUCKET}",
        "s3_key": f"eq.{s3_key}",
    }
    resp = http_client.patch(url, headers=headers, json=payload, params=params, timeout=30)
    if resp.status_code in (200, 204):
        return True
    if resp.status_code == 404:
        return False
    raise RuntimeError(f"PATCH error {resp.status_code}: {resp.text[:300]}")


def batch_patch_clips(
    http_client: httpx.Client,
    updates: list[dict],
    dry_run: bool = False,
) -> tuple[int, int, int]:
    """Patch clips one at a time. Returns (updated, skipped, failed).

    We must use individual PATCHes because each clip has a different s3_key
    filter. PostgREST does not support batch PATCH with per-row filters.
    """
    updated = 0
    skipped = 0
    failed = 0

    for item in updates:
        s3_key = item.pop("_s3_key")
        if dry_run:
            print(f"  [dry-run] PATCH {s3_key[-55:]}")
            print(f"    tech: {item.get('tech_resolution_width')}x{item.get('tech_resolution_height')} "
                  f"{item.get('tech_fps')}fps {item.get('tech_codec')} "
                  f"{item.get('tech_duration_seconds')}s {item.get('tech_file_size_bytes')}B")
            enrichment = item.get("ai_enrichment_json")
            if enrichment:
                ej = json.loads(enrichment) if isinstance(enrichment, str) else enrichment
                keys = list(ej.keys())[:5]
                print(f"    enrichment keys: {keys}")
            updated += 1
            continue

        for attempt in range(3):
            try:
                ok = patch_clip(http_client, s3_key, item)
                if ok:
                    updated += 1
                else:
                    skipped += 1  # No matching clip found
                break
            except Exception as exc:
                if attempt < 2 and ("57014" in str(exc) or "timeout" in str(exc).lower()):
                    time.sleep(2 * (attempt + 1))
                    continue
                print(f"  [error] PATCH {s3_key[-40:]}: {exc}", file=sys.stderr)
                failed += 1

        # Brief throttle to avoid hammering the API
        if not dry_run:
            time.sleep(0.05)

    return updated, skipped, failed

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Load troveo metadata into clips table")
    parser.add_argument("--limit", type=int, default=None, help="Max clips to process")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be done")
    parser.add_argument("--tranche", default=None, help="Process only this tranche (e.g. 2024_11_04_tranche1)")
    parser.add_argument("--batch-size", type=int, default=20, help="Batch size for S3 reads")
    args = parser.parse_args()

    if not args.dry_run:
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", file=sys.stderr)
            print("  Run: source .env.local", file=sys.stderr)
            sys.exit(1)

    print(f"[load-troveo-clips] bucket={BUCKET} limit={args.limit or 'all'} "
          f"dry_run={args.dry_run} tranche={args.tranche or 'all'}")

    # Load checkpoint for crash recovery
    checkpoint = load_checkpoint()
    completed_tranches: list[str] = checkpoint.get("completed_tranches", [])
    total_updated = checkpoint.get("total_updated", 0)
    total_skipped = checkpoint.get("total_skipped", 0)
    total_failed = checkpoint.get("total_failed", 0)

    s3 = boto3.client("s3", region_name=AWS_REGION)
    http = httpx.Client() if not args.dry_run else None

    try:
        # Discover all tranches
        top_dirs = list_prefixes(s3, "")
        tranche_dirs = sorted([d for d in top_dirs if "tranche" in d])
        print(f"[load-troveo-clips] Found {len(tranche_dirs)} tranches: {[t.rstrip('/') for t in tranche_dirs]}")

        if args.tranche:
            tranche_dirs = [d for d in tranche_dirs if args.tranche in d]
            if not tranche_dirs:
                print(f"ERROR: Tranche '{args.tranche}' not found", file=sys.stderr)
                sys.exit(1)

        for tranche_dir in tranche_dirs:
            if args.limit and total_updated >= args.limit:
                break

            tranche_name = tranche_dir.rstrip("/")

            # Discover deliveries within each tranche
            delivery_dirs = sorted([d for d in list_prefixes(s3, tranche_dir) if "delivery" in d])
            print(f"\n[load-troveo-clips] {tranche_name} -- {len(delivery_dirs)} deliveries")

            for delivery_dir in delivery_dirs:
                if args.limit and total_updated >= args.limit:
                    break

                delivery_key = delivery_dir.rstrip("/")
                if delivery_key in completed_tranches:
                    print(f"  [skip] {delivery_key} (already in checkpoint)")
                    continue

                # List metadata JSONs
                metadata_prefix = f"{delivery_dir}metadata/"
                meta_keys = list_objects(s3, metadata_prefix, ".json")
                print(f"  {delivery_dir} -- {len(meta_keys)} metadata JSONs")

                if not meta_keys:
                    completed_tranches.append(delivery_key)
                    continue

                # Derive the payload prefix for this delivery
                payload_prefix = f"{delivery_dir}payload/"

                # Process in batches
                batch_updates: list[dict] = []

                for j, meta_key in enumerate(meta_keys):
                    if args.limit and total_updated + len(batch_updates) >= args.limit:
                        break

                    meta = read_json_from_s3(s3, meta_key)
                    if not meta:
                        total_failed += 1
                        continue

                    # Derive the s3_key for the clip (payload path)
                    aws_path = meta.get("aws_s3_video_file_path")
                    if not aws_path:
                        total_skipped += 1
                        continue

                    payload_filename = derive_payload_filename(aws_path)
                    s3_key = f"{payload_prefix}{payload_filename}"

                    # Build update payload
                    update: dict = {"_s3_key": s3_key}

                    # ann_metadata
                    ann_meta = extract_ann_metadata(meta)
                    if ann_meta:
                        update["ann_metadata"] = json.dumps(ann_meta)

                    # Technical fields
                    w = safe_int(meta.get("width"))
                    h = safe_int(meta.get("height"))
                    if w:
                        update["tech_resolution_width"] = w
                    if h:
                        update["tech_resolution_height"] = h
                    fps = safe_float(meta.get("frame_rate"))
                    if fps:
                        update["tech_fps"] = fps
                    duration = safe_float(meta.get("clip_duration"))
                    if duration:
                        update["tech_duration_seconds"] = duration
                    file_size = safe_int(meta.get("file_size_bytes"))
                    if file_size:
                        update["tech_file_size_bytes"] = file_size
                    codec = meta.get("vcodec")
                    if codec:
                        update["tech_codec"] = str(codec)

                    # ai_enrichment_json (full clip_annotations blob)
                    enrichment = extract_enrichment_json(meta)
                    if enrichment:
                        update["ai_enrichment_json"] = json.dumps(enrichment)
                        update["ai_enrichment_source"] = "troveo_metadata"

                    # Flag for caption + embedding rebuild
                    update["caption_rebuilt_at"] = None

                    batch_updates.append(update)

                    # Flush batch
                    if len(batch_updates) >= args.batch_size:
                        ok, skip, fail = batch_patch_clips(http, batch_updates, dry_run=args.dry_run)
                        total_updated += ok
                        total_skipped += skip
                        total_failed += fail
                        batch_updates = []

                        # Progress logging
                        if total_updated % 100 < args.batch_size:
                            print(f"  [progress] {total_updated} updated, {total_skipped} skipped, {total_failed} failed")

                # Flush remaining
                if batch_updates:
                    ok, skip, fail = batch_patch_clips(http, batch_updates, dry_run=args.dry_run)
                    total_updated += ok
                    total_skipped += skip
                    total_failed += fail

                # Mark delivery as completed
                completed_tranches.append(delivery_key)
                save_checkpoint({
                    "completed_tranches": completed_tranches,
                    "total_updated": total_updated,
                    "total_skipped": total_skipped,
                    "total_failed": total_failed,
                })

    finally:
        if http:
            http.close()

    print(f"\n[load-troveo-clips] Done. Updated {total_updated} / skipped {total_skipped} / failed {total_failed}")


if __name__ == "__main__":
    main()
