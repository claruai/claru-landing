#!/usr/bin/env python3
"""
Load cobry caption parquets from S3 into video_index with 768-dim embeddings.

Usage:
  python3 scripts/load_cobry_captions.py --bucket mv-abaka-external --delivery delivery1 [--limit 100] [--dry-run]

Requires: Python 3.10+, pyarrow, openai, httpx, boto3
Env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY, AWS_REGION (optional)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
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
    import pyarrow.parquet as pq  # noqa: F401
except ImportError:
    _MISSING.append("pyarrow")
try:
    import openai  # noqa: F401
except ImportError:
    _MISSING.append("openai")
try:
    import httpx  # noqa: F401
except ImportError:
    _MISSING.append("httpx")
try:
    import boto3  # noqa: F401
except ImportError:
    _MISSING.append("boto3")

if _MISSING:
    print(f"ERROR: Missing dependencies: {', '.join(_MISSING)}", file=sys.stderr)
    print(f"  pip install {' '.join(_MISSING)}", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Now safe to import
# ---------------------------------------------------------------------------

import pyarrow.parquet as pq
from openai import OpenAI
import httpx
import boto3

# ---------------------------------------------------------------------------
# Env vars
# ---------------------------------------------------------------------------

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

CHECKPOINT_PATH = Path(__file__).parent / ".cobry_checkpoint.json"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_checkpoint() -> dict:
    if CHECKPOINT_PATH.exists():
        return json.loads(CHECKPOINT_PATH.read_text())
    return {"completed_parquets": [], "total_inserted": 0, "total_skipped": 0, "total_failed": 0}


def save_checkpoint(state: dict) -> None:
    CHECKPOINT_PATH.write_text(json.dumps(state, indent=2))


def embed_batch(client: OpenAI, texts: list[str]) -> list[list[float] | None]:
    """Embed a batch of texts using OpenAI text-embedding-3-small at 768 dims."""
    results: list[list[float] | None] = [None] * len(texts)
    # OpenAI batch endpoint supports up to 2048 inputs but we keep batches small
    try:
        resp = client.embeddings.create(
            model="text-embedding-3-small",
            input=texts,
            dimensions=768,
        )
        for item in resp.data:
            results[item.index] = item.embedding
    except Exception as exc:
        print(f"  [warn] embedding batch failed: {exc}", file=sys.stderr)
    return results


def upsert_rows(
    http: httpx.Client,
    supabase_url: str,
    supabase_key: str,
    rows: list[dict],
) -> tuple[int, int]:
    """Upsert rows via PostgREST. Returns (inserted, skipped)."""
    url = f"{supabase_url}/rest/v1/video_index"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates,return=minimal",
    }
    resp = http.post(
        url,
        headers=headers,
        json=rows,
        params={"on_conflict": "s3_bucket,s3_key"},
        timeout=60,
    )
    if resp.status_code in (200, 201):
        return len(rows), 0
    if resp.status_code == 409:
        return 0, len(rows)
    raise RuntimeError(f"PostgREST error {resp.status_code}: {resp.text}")


def extract_caption(row_dict: dict, idx: int) -> str:
    """Build caption from text_short + text columns."""
    text_short = ""
    text_full = ""
    if "text_short" in row_dict:
        val = row_dict["text_short"][idx]
        text_short = str(val) if val is not None else ""
    if "text" in row_dict:
        val = row_dict["text"][idx]
        text_full = str(val) if val is not None else ""

    if text_short and text_full and text_short != text_full:
        caption = f"{text_short}. {text_full}"
    else:
        caption = text_full or text_short
    return caption[:1000]


def extract_s3_key(row_dict: dict, idx: int) -> str:
    """Extract s3_key from clip_storage_key, stripping s3://bucket/ prefix."""
    key = ""
    if "clip_storage_key" in row_dict:
        val = row_dict["clip_storage_key"][idx]
        key = str(val) if val is not None else ""
    if not key and "orig_clip_storage_key" in row_dict:
        val = row_dict["orig_clip_storage_key"][idx]
        key = str(val) if val is not None else ""

    # Strip s3://bucket/ prefix
    if key.startswith("s3://"):
        parts = key.split("/", 3)
        key = parts[3] if len(parts) > 3 else ""
    return key


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Load cobry captions into video_index")
    parser.add_argument("--bucket", default="mv-abaka-external", help="S3 bucket name")
    parser.add_argument("--delivery", default="delivery1", help="Delivery folder name")
    parser.add_argument("--limit", type=int, default=None, help="Max rows to process")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be done")
    args = parser.parse_args()

    if not args.dry_run:
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", file=sys.stderr)
            sys.exit(1)
        if not OPENAI_API_KEY:
            print("ERROR: Missing OPENAI_API_KEY", file=sys.stderr)
            sys.exit(1)

    print(f"[load-cobry] bucket={args.bucket} delivery={args.delivery} "
          f"limit={args.limit or 'all'} dry_run={args.dry_run}")

    # Load checkpoint for crash recovery
    checkpoint = load_checkpoint()
    completed_parquets: list[str] = checkpoint.get("completed_parquets", [])
    total_inserted = checkpoint.get("total_inserted", 0)
    total_skipped = checkpoint.get("total_skipped", 0)
    total_failed = checkpoint.get("total_failed", 0)

    # List parquet files from S3 using paginator
    s3 = boto3.client("s3", region_name=AWS_REGION)
    prefix = f"silver/cobry/deliveries/videos/{args.delivery}/captions/"
    paginator = s3.get_paginator("list_objects_v2")

    parquet_keys: list[str] = []
    for page in paginator.paginate(Bucket=args.bucket, Prefix=prefix):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if key.endswith(".parquet"):
                parquet_keys.append(key)

    print(f"[load-cobry] Found {len(parquet_keys)} caption parquet files")
    print(f"[load-cobry] Already completed: {len(completed_parquets)} parquets from checkpoint")

    oai = OpenAI(api_key=OPENAI_API_KEY) if not args.dry_run else None
    http = httpx.Client() if not args.dry_run else None

    try:
        for pq_key in parquet_keys:
            if pq_key in completed_parquets:
                print(f"  [skip] {pq_key} (already in checkpoint)")
                continue

            if args.limit and total_inserted >= args.limit:
                print(f"[load-cobry] Reached limit of {args.limit}")
                break

            tmp_file = None
            try:
                # Download parquet to temp file
                tmp_fd, tmp_file = tempfile.mkstemp(suffix=".parquet", prefix="cobry-")
                os.close(tmp_fd)

                print(f"[load-cobry] Downloading {pq_key}...")
                s3.download_file(args.bucket, pq_key, tmp_file)

                # Read parquet using row groups (streaming — never load entire file)
                pq_file = pq.ParquetFile(tmp_file)
                num_row_groups = pq_file.metadata.num_row_groups
                print(f"  {num_row_groups} row group(s), {pq_file.metadata.num_rows} total rows")

                for rg_idx in range(num_row_groups):
                    table = pq_file.read_row_group(rg_idx)
                    row_dict = table.to_pydict()
                    num_rows = table.num_rows

                    # Process in batches of 20
                    batch_size = 20
                    for batch_start in range(0, num_rows, batch_size):
                        if args.limit and total_inserted >= args.limit:
                            break

                        batch_end = min(batch_start + batch_size, num_rows)
                        batch_texts: list[str] = []
                        batch_keys: list[str] = []

                        for i in range(batch_start, batch_end):
                            s3_key = extract_s3_key(row_dict, i)
                            caption = extract_caption(row_dict, i)
                            if s3_key and caption:
                                batch_keys.append(s3_key)
                                batch_texts.append(caption)

                        if not batch_keys:
                            continue

                        if args.dry_run:
                            for k, t in zip(batch_keys, batch_texts):
                                print(f"  [dry-run] {k[:60]} → \"{t[:80]}...\"")
                            total_inserted += len(batch_keys)
                            continue

                        # Generate embeddings
                        assert oai is not None
                        embeddings = embed_batch(oai, batch_texts)

                        # Build upsert rows (only those with successful embeddings)
                        rows_to_insert: list[dict] = []
                        for j, (key, text, emb) in enumerate(zip(batch_keys, batch_texts, embeddings)):
                            if emb is None:
                                total_failed += 1
                                continue
                            rows_to_insert.append({
                                "s3_bucket": args.bucket,
                                "s3_key": key,
                                "caption_text": text,
                                "embedding": json.dumps(emb),
                                "enrichment_source": "cobry_caption",
                            })

                        if not rows_to_insert:
                            continue

                        try:
                            assert http is not None
                            inserted, skipped = upsert_rows(http, SUPABASE_URL, SUPABASE_KEY, rows_to_insert)
                            total_inserted += inserted
                            total_skipped += skipped
                        except Exception as exc:
                            print(f"  [error] upsert failed: {exc}", file=sys.stderr)
                            total_failed += len(rows_to_insert)

                        # Progress every 200 rows
                        if total_inserted % 200 < batch_size:
                            print(f"  [progress] {total_inserted} inserted, {total_skipped} skipped, {total_failed} failed")

                    # Free row group memory
                    del table, row_dict

                # Mark parquet as completed in checkpoint
                completed_parquets.append(pq_key)
                save_checkpoint({
                    "completed_parquets": completed_parquets,
                    "total_inserted": total_inserted,
                    "total_skipped": total_skipped,
                    "total_failed": total_failed,
                })

            finally:
                if tmp_file and os.path.exists(tmp_file):
                    os.unlink(tmp_file)

    finally:
        if http:
            http.close()

    print(f"\n[load-cobry] Done. Inserted {total_inserted} / skipped {total_skipped} / failed {total_failed}")


if __name__ == "__main__":
    main()
