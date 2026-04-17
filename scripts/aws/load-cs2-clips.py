#!/usr/bin/env python3
"""
Load CS2 action-annotated gameplay clips from S3 into the Claru clips table.

Walks renders-v3/ in the counterstrike-data bucket. Each delivery folder
contains one mp4 (payload) and one parquet (metadata). Creates a clip row
per delivery, links it to the CS2 dataset, and extracts tech metadata +
annotation summary from the parquet.

Usage:
  python3 load-cs2-clips.py [--dry-run] [--limit 100] [--workers 8] [--batch-size 200]

Env vars:
  SUPABASE_URL            - Supabase project URL
  SUPABASE_SERVICE_KEY    - Supabase service role key
  AWS_ACCESS_KEY_ID       - (optional if using IAM role)
  AWS_SECRET_ACCESS_KEY   - (optional if using IAM role)
"""

from __future__ import annotations

import argparse
import io
import json
import logging
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any

import boto3
import pyarrow.parquet as pq
from supabase import create_client, Client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("load-cs2-clips")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
BUCKET = "counterstrike-data"
DATASET_ID = "54f95ff5-da7d-45b5-8247-bb7a171cee93"
RENDER_PREFIX = "renders-v3/"

if not SUPABASE_URL or not SUPABASE_KEY:
    log.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars.")
    sys.exit(1)


def create_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def create_s3_client() -> Any:
    return boto3.client("s3", region_name="us-east-1")


def list_match_folders(s3_client: Any) -> list[str]:
    """List all match folder prefixes under renders-v3/."""
    folders = []
    paginator = s3_client.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET, Prefix=RENDER_PREFIX, Delimiter="/"):
        for prefix in page.get("CommonPrefixes", []):
            folders.append(prefix["Prefix"])
    return folders


def list_deliveries(s3_client: Any, match_prefix: str) -> list[dict]:
    """List all delivery folders for a match, returning mp4 key + parquet key pairs."""
    deliveries = []
    video_prefix = f"{match_prefix}deliveries/videos/"

    paginator = s3_client.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET, Prefix=video_prefix, Delimiter="/"):
        for dp in page.get("CommonPrefixes", []):
            delivery_prefix = dp["Prefix"]  # e.g. renders-v3/.../deliveries/videos/delivery0/
            deliveries.append(delivery_prefix)

    results = []
    for dp in deliveries:
        mp4_key = None
        parquet_key = None

        for page in paginator.paginate(Bucket=BUCKET, Prefix=dp):
            for obj in page.get("Contents", []):
                key = obj["Key"]
                size = obj["Size"]
                if key.endswith(".mp4"):
                    mp4_key = key
                    mp4_size = size
                elif key.endswith(".parquet"):
                    parquet_key = key

        if mp4_key and parquet_key:
            results.append({
                "mp4_key": mp4_key,
                "parquet_key": parquet_key,
                "mp4_size": mp4_size,
            })

    return results


def parse_match_name(match_prefix: str) -> dict:
    """Extract match info from folder name like renders-v3/100601-legacy-vs-nrg-m1-mirage-p1/."""
    folder = match_prefix.rstrip("/").split("/")[-1]
    parts = folder.split("-vs-")
    match_id = folder.split("-")[0] if folder[0].isdigit() else None

    return {
        "folder_name": folder,
        "match_id": match_id,
    }


def read_parquet_from_s3(s3_client: Any, key: str) -> dict | None:
    """Download and parse a parquet file from S3, return the first row as dict."""
    try:
        resp = s3_client.get_object(Bucket=BUCKET, Key=key)
        body = resp["Body"].read()
        table = pq.read_table(io.BytesIO(body))
        df = table.to_pandas()
        if len(df) == 0:
            return None

        row = df.iloc[0]
        result = {}
        for col in df.columns:
            val = row[col]
            if col == "frame_data":
                # Don't store full frame data in DB — just summary stats
                frames = val
                result["num_frames_actual"] = len(frames)
                # Compute action distribution
                action_counts: dict[str, int] = {}
                has_extrinsics = 0
                for f in frames:
                    for c in f.get("actions", ""):
                        if c != "-":
                            action_counts[c] = action_counts.get(c, 0) + 1
                    if f.get("camera_extrinsics_defined"):
                        has_extrinsics += 1
                result["action_distribution"] = action_counts
                result["frames_with_extrinsics"] = has_extrinsics
            else:
                # Convert numpy types to Python natives
                if hasattr(val, "item"):
                    val = val.item()
                result[col] = val

        return result
    except Exception as exc:
        log.warning("Failed to read parquet %s: %s", key[:80], exc)
        return None


def build_clip_payload(delivery: dict, parquet_data: dict | None, match_info: dict) -> dict:
    """Build the clip row payload from delivery info + parsed parquet."""
    mp4_key = delivery["mp4_key"]
    filename = mp4_key.split("/")[-1]

    payload: dict[str, Any] = {
        "s3_bucket": BUCKET,
        "s3_key": mp4_key,
        "mime_type": "video/mp4",
        "filename": filename,
        "ann_annotation_key": delivery["parquet_key"],
        "tech_file_size_bytes": delivery["mp4_size"],
    }

    if parquet_data:
        # Tech metadata from parquet
        if "fps" in parquet_data:
            payload["tech_fps"] = parquet_data["fps"]
        if "width" in parquet_data:
            payload["tech_resolution_width"] = parquet_data["width"]
        if "height" in parquet_data:
            payload["tech_resolution_height"] = parquet_data["height"]
        if "total_time" in parquet_data:
            payload["tech_duration_seconds"] = round(parquet_data["total_time"], 3)

        # Build ann_metadata from parquet top-level fields
        ann_meta: dict[str, Any] = {
            "category": parquet_data.get("category", "gaming"),
            "match_name": parquet_data.get("match_name"),
            "match_folder": match_info.get("folder_name"),
            "fov": parquet_data.get("fov"),
            "aspect_ratio": parquet_data.get("aspect_ratio"),
        }
        # V3 extras
        if "steam_id" in parquet_data:
            ann_meta["steam_id"] = parquet_data["steam_id"]
        if "round_number" in parquet_data:
            ann_meta["round_number"] = parquet_data["round_number"]
        if "team" in parquet_data:
            ann_meta["team"] = parquet_data["team"]

        payload["ann_metadata"] = ann_meta

        # Build ai_enrichment_json with action stats
        enrichment: dict[str, Any] = {
            "source": "cs2_demo_render",
            "version": "v3",
            "num_frames": parquet_data.get("num_frames"),
            "fps": parquet_data.get("fps"),
            "fov": parquet_data.get("fov"),
            "resolution": f"{parquet_data.get('width')}x{parquet_data.get('height')}",
        }
        if "action_distribution" in parquet_data:
            enrichment["action_distribution"] = parquet_data["action_distribution"]
        if "frames_with_extrinsics" in parquet_data:
            enrichment["frames_with_extrinsics"] = parquet_data["frames_with_extrinsics"]
            enrichment["extrinsics_coverage"] = (
                parquet_data["frames_with_extrinsics"] / max(parquet_data.get("num_frames", 1), 1)
            )
        if "match_name" in parquet_data:
            enrichment["match_name"] = parquet_data["match_name"]
        if "steam_id" in parquet_data:
            enrichment["steam_id"] = parquet_data["steam_id"]

        payload["ai_enrichment_json"] = enrichment
        payload["ai_enrichment_source"] = "cs2_parquet_v3"

        # Build a caption from the metadata
        match_name = parquet_data.get("match_name", "unknown")
        duration = parquet_data.get("total_time", 0)
        actions = parquet_data.get("action_distribution", {})
        top_actions = sorted(actions.items(), key=lambda x: -x[1])[:5]
        action_str = ", ".join(f"{k}={v}" for k, v in top_actions) if top_actions else "none"

        caption = (
            f"CS2 first-person gameplay clip from {match_name}. "
            f"{duration:.0f}s at {parquet_data.get('fps', 48)}fps, "
            f"{parquet_data.get('width', 1280)}x{parquet_data.get('height', 720)}. "
            f"Top actions: {action_str}."
        )
        if "round_number" in parquet_data:
            caption += f" Round {parquet_data['round_number']}."

        payload["ai_caption"] = caption
        payload["caption_text"] = caption

    return payload


def process_match(
    s3_client: Any,
    sb: Client,
    match_prefix: str,
    dry_run: bool,
) -> tuple[int, int]:
    """Process all deliveries in a match folder. Returns (success, failed)."""
    match_info = parse_match_name(match_prefix)
    deliveries = list_deliveries(s3_client, match_prefix)

    if not deliveries:
        return (0, 0)

    success = 0
    failed = 0

    for delivery in deliveries:
        try:
            parquet_data = read_parquet_from_s3(s3_client, delivery["parquet_key"])
            payload = build_clip_payload(delivery, parquet_data, match_info)

            if dry_run:
                log.debug("DRY RUN: %s", payload.get("filename"))
                success += 1
                continue

            # Insert clip
            resp = sb.table("clips").insert(payload).execute()
            clip_id = resp.data[0]["id"]

            # Link to dataset
            sb.table("dataset_clips").insert({
                "dataset_id": DATASET_ID,
                "clip_id": clip_id,
            }).execute()

            success += 1

        except Exception as exc:
            log.warning("Failed delivery %s: %s", delivery["mp4_key"][:80], str(exc)[:200])
            failed += 1

    return (success, failed)


def main() -> None:
    parser = argparse.ArgumentParser(description="Load CS2 clips into Claru")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0, help="Max matches to process (0=all)")
    parser.add_argument("--workers", type=int, default=4, help="Parallel match workers")
    parser.add_argument("--batch-size", type=int, default=50, help="Matches per progress log")
    args = parser.parse_args()

    log.info("Starting CS2 clip loader: limit=%s, workers=%d, dry_run=%s",
             args.limit or "all", args.workers, args.dry_run)

    s3 = create_s3_client()
    sb = create_supabase_client()

    log.info("Listing match folders...")
    matches = list_match_folders(s3)
    log.info("Found %d match folders in %s", len(matches), RENDER_PREFIX)

    if args.limit > 0:
        matches = matches[:args.limit]
        log.info("Limited to %d matches", len(matches))

    total_success = 0
    total_failed = 0
    total_matches = 0
    start_time = time.monotonic()

    # Process matches — each match has multiple deliveries
    # Using workers for match-level parallelism
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(process_match, s3, sb, match, args.dry_run): match
            for match in matches
        }

        for future in as_completed(futures):
            match = futures[future]
            try:
                s, f = future.result()
                total_success += s
                total_failed += f
            except Exception as exc:
                log.error("Match %s crashed: %s", match[:60], exc)
                total_failed += 1

            total_matches += 1

            if total_matches % args.batch_size == 0 or total_matches == len(matches):
                elapsed = time.monotonic() - start_time
                rate = total_success / elapsed if elapsed > 0 else 0
                log.info(
                    "Progress: %d/%d matches, %d clips ok, %d failed | %.1f clips/sec | %.0fs",
                    total_matches, len(matches), total_success, total_failed, rate, elapsed,
                )

    elapsed = time.monotonic() - start_time
    log.info(
        "Done. Matches: %d, Clips: %d ok / %d failed | %.1fs",
        total_matches, total_success, total_failed, elapsed,
    )


if __name__ == "__main__":
    main()
