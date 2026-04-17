#!/usr/bin/env python3
"""
Fast CS2 clip indexer — registers clips from S3 listing without downloading parquets.

Phase 1: Index all mp4s with their S3 keys + derive parquet annotation key.
Phase 2 (separate script, on EC2): Backfill parquet metadata into ann_metadata/ai_enrichment_json.

Usage:
  python3 index-cs2-clips-fast.py [--dry-run] [--batch-size 500]

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
import re
import sys
import time
from typing import Any

import boto3
from supabase import create_client, Client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("index-cs2-fast")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
BUCKET = "counterstrike-data"
DATASET_ID = "54f95ff5-da7d-45b5-8247-bb7a171cee93"
RENDER_PREFIX = "renders-v3/"

if not SUPABASE_URL or not SUPABASE_KEY:
    log.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars.")
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Fast CS2 clip indexer from S3 listing")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--batch-size", type=int, default=500, help="Clips per DB insert batch")
    args = parser.parse_args()

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    s3 = boto3.client("s3", region_name="us-east-1")

    # Check how many clips already exist for this dataset
    existing = sb.table("dataset_clips").select("clip_id", count="exact").eq(
        "dataset_id", DATASET_ID
    ).limit(1).execute()
    existing_count = existing.count or 0
    log.info("Existing clips in dataset: %d", existing_count)

    # If we already have clips, collect their s3_keys to skip duplicates
    existing_keys: set[str] = set()
    if existing_count > 0:
        log.info("Loading existing s3_keys to skip duplicates...")
        offset = 0
        while True:
            resp = (
                sb.table("clips")
                .select("s3_key, dataset_clips!inner(dataset_id)")
                .eq("dataset_clips.dataset_id", DATASET_ID)
                .range(offset, offset + 999)
                .execute()
            )
            if not resp.data:
                break
            for row in resp.data:
                existing_keys.add(row["s3_key"])
            offset += len(resp.data)
            if len(resp.data) < 1000:
                break
        log.info("Loaded %d existing s3_keys", len(existing_keys))

    # List all mp4s from S3
    log.info("Listing mp4s from s3://%s/%s ...", BUCKET, RENDER_PREFIX)
    paginator = s3.get_paginator("list_objects_v2")

    batch: list[dict] = []
    total_listed = 0
    total_inserted = 0
    total_skipped = 0
    total_failed = 0
    start_time = time.monotonic()

    for page in paginator.paginate(Bucket=BUCKET, Prefix=RENDER_PREFIX):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if not key.endswith(".mp4"):
                continue

            total_listed += 1

            # Skip if already indexed
            if key in existing_keys:
                total_skipped += 1
                continue

            # Derive parquet key: payload/uuid.mp4 → metadata/uuid.parquet
            filename = key.split("/")[-1]
            uuid_stem = filename.replace(".mp4", "")
            parquet_key = key.replace(f"payload/{filename}", f"metadata/{uuid_stem}.parquet")

            # Extract match folder name from key
            # renders-v3/100601-legacy-vs-nrg-m1-mirage-p1/deliveries/...
            parts = key.split("/")
            match_folder = parts[1] if len(parts) > 1 else "unknown"

            clip = {
                "s3_bucket": BUCKET,
                "s3_key": key,
                "mime_type": "video/mp4",
                "filename": filename,
                "ann_annotation_key": parquet_key,
                "tech_file_size_bytes": obj["Size"],
                "ai_enrichment_source": "cs2_index_v3",
                "ann_metadata": {
                    "category": "gaming",
                    "match_folder": match_folder,
                    "render_version": "v3",
                },
            }

            batch.append(clip)

            if len(batch) >= args.batch_size:
                if not args.dry_run:
                    inserted, failed = flush_batch(sb, batch)
                    total_inserted += inserted
                    total_failed += failed
                else:
                    total_inserted += len(batch)
                batch = []

                elapsed = time.monotonic() - start_time
                rate = total_inserted / elapsed if elapsed > 0 else 0
                log.info(
                    "Progress: %d listed, %d inserted, %d skipped, %d failed | %.1f/sec",
                    total_listed, total_inserted, total_skipped, total_failed, rate,
                )

    # Flush remaining
    if batch:
        if not args.dry_run:
            inserted, failed = flush_batch(sb, batch)
            total_inserted += inserted
            total_failed += failed
        else:
            total_inserted += len(batch)

    elapsed = time.monotonic() - start_time
    log.info(
        "Done. Listed: %d, Inserted: %d, Skipped: %d, Failed: %d | %.1fs",
        total_listed, total_inserted, total_skipped, total_failed, elapsed,
    )


def flush_batch(sb: Client, batch: list[dict]) -> tuple[int, int]:
    """Insert a batch of clips and link them to the dataset. Returns (inserted, failed)."""
    try:
        # Bulk insert clips
        resp = sb.table("clips").insert(batch).execute()
        clip_ids = [row["id"] for row in resp.data]

        # Bulk insert dataset_clips links
        links = [{"dataset_id": DATASET_ID, "clip_id": cid} for cid in clip_ids]
        sb.table("dataset_clips").insert(links).execute()

        return (len(clip_ids), 0)
    except Exception as exc:
        log.warning("Batch insert failed (%d clips): %s", len(batch), str(exc)[:200])
        # Fall back to one-by-one
        inserted = 0
        failed = 0
        for clip in batch:
            try:
                resp = sb.table("clips").insert(clip).execute()
                clip_id = resp.data[0]["id"]
                sb.table("dataset_clips").insert({
                    "dataset_id": DATASET_ID,
                    "clip_id": clip_id,
                }).execute()
                inserted += 1
            except Exception:
                failed += 1
        return (inserted, failed)


if __name__ == "__main__":
    main()
