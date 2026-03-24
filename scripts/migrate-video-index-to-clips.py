#!/usr/bin/env python3
"""
Migrate video_index rows into the unified clips table.

Mapping:
  s3_bucket        -> s3_bucket
  s3_key           -> s3_key
  caption_text     -> ai_caption AND caption_text
  enrichment_source -> ai_enrichment_source
  embedding        -> embedding
  indexed_at       -> created_at
  (rows with embedding) -> caption_rebuilt_at = NOW()

Usage:
  python3 scripts/migrate-video-index-to-clips.py [--dry-run] [--limit N]

Requires: httpx
Env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import os
import sys
import time

# ---------------------------------------------------------------------------
# Dependency check
# ---------------------------------------------------------------------------

try:
    import httpx
except ImportError:
    print("ERROR: Missing httpx. Install with: pip install httpx", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

BATCH_SIZE = 500
THROTTLE_SECONDS = 0.1


def make_headers() -> dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }


# ---------------------------------------------------------------------------
# Fetch video_index rows in batches using range pagination
# ---------------------------------------------------------------------------

def fetch_video_index_batch(
    http: httpx.Client, offset: int, limit: int
) -> list[dict]:
    """Fetch a batch of video_index rows."""
    url = f"{SUPABASE_URL}/rest/v1/video_index"
    headers = make_headers()
    headers["Range"] = f"{offset}-{offset + limit - 1}"
    headers["Prefer"] = "count=exact"
    resp = http.get(
        url,
        headers=headers,
        params={
            "select": "id,s3_bucket,s3_key,caption_text,embedding,enrichment_source,indexed_at",
            "order": "indexed_at.asc",
        },
        timeout=60,
    )
    if resp.status_code in (200, 206):
        return resp.json()
    raise RuntimeError(f"Fetch error {resp.status_code}: {resp.text}")


def get_video_index_count(http: httpx.Client) -> int:
    """Get total video_index row count."""
    url = f"{SUPABASE_URL}/rest/v1/video_index"
    headers = make_headers()
    headers["Prefer"] = "count=exact"
    headers["Range"] = "0-0"
    resp = http.head(url, headers=headers, timeout=30)
    content_range = resp.headers.get("content-range", "")
    # Format: "0-0/12345"
    if "/" in content_range:
        return int(content_range.split("/")[1])
    return 0


# ---------------------------------------------------------------------------
# Upsert into clips
# ---------------------------------------------------------------------------

def upsert_clips_batch(
    http: httpx.Client, rows: list[dict], dry_run: bool = False
) -> tuple[int, int]:
    """Upsert mapped rows into clips. Returns (inserted, skipped)."""
    mapped = []
    for r in rows:
        has_embedding = r.get("embedding") is not None
        clip = {
            "s3_bucket": r["s3_bucket"],
            "s3_key": r["s3_key"],
            "ai_caption": r.get("caption_text"),
            "caption_text": r.get("caption_text"),
            "ai_enrichment_source": r.get("enrichment_source"),
            "embedding": r.get("embedding"),
            "created_at": r.get("indexed_at"),
        }
        if has_embedding:
            clip["caption_rebuilt_at"] = datetime.now(timezone.utc).isoformat()
        mapped.append(clip)

    if dry_run:
        print(f"  [dry-run] Would upsert {len(mapped)} rows")
        return len(mapped), 0

    url = f"{SUPABASE_URL}/rest/v1/clips"
    headers = make_headers()
    headers["Prefer"] = "resolution=ignore-duplicates,return=minimal"
    resp = http.post(
        url,
        headers=headers,
        json=mapped,
        params={"on_conflict": "s3_bucket,s3_key"},
        timeout=60,
    )
    if resp.status_code in (200, 201):
        return len(mapped), 0
    if resp.status_code == 409:
        return 0, len(mapped)
    raise RuntimeError(f"Upsert error {resp.status_code}: {resp.text}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Migrate video_index → clips")
    parser.add_argument("--dry-run", action="store_true", help="Don't write to DB")
    parser.add_argument("--limit", type=int, default=0, help="Limit rows (0 = all)")
    args = parser.parse_args()

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY", file=sys.stderr)
        sys.exit(1)

    http = httpx.Client()

    total_count = get_video_index_count(http)
    if args.limit > 0:
        total_count = min(total_count, args.limit)
    print(f"Migrating {total_count} video_index rows to clips (batch={BATCH_SIZE})")

    total_inserted = 0
    total_skipped = 0
    offset = 0

    while offset < total_count:
        batch_limit = min(BATCH_SIZE, total_count - offset)
        rows = fetch_video_index_batch(http, offset, batch_limit)
        if not rows:
            break

        inserted, skipped = upsert_clips_batch(http, rows, dry_run=args.dry_run)
        total_inserted += inserted
        total_skipped += skipped
        offset += len(rows)

        pct = (offset / total_count * 100) if total_count else 0
        print(f"  [{offset}/{total_count}] {pct:.1f}% — inserted: {total_inserted}, skipped: {total_skipped}")

        time.sleep(THROTTLE_SECONDS)

    print(f"\nDone. Inserted: {total_inserted}, Skipped: {total_skipped}")
    http.close()


if __name__ == "__main__":
    main()
