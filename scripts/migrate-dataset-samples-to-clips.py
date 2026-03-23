#!/usr/bin/env python3
"""
Migrate dataset_samples rows into clips + dataset_clips.

Steps:
  1. Fetch all dataset_samples (skip 20 rows with NULL s3_object_key)
  2. GROUP BY (s3_bucket, s3_object_key) → one clips row per unique key
  3. Re-embed caption text at 768 dims using OpenAI
  4. Upsert into clips (ON CONFLICT DO NOTHING)
  5. Look up clip IDs by s3_bucket + s3_key
  6. Insert dataset_clips rows preserving dataset_id + lead_id

Usage:
  python3 scripts/migrate-dataset-samples-to-clips.py [--dry-run] [--limit N]

Requires: httpx, openai
Env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
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

_MISSING: list[str] = []
try:
    import httpx
except ImportError:
    _MISSING.append("httpx")
try:
    from openai import OpenAI
except ImportError:
    _MISSING.append("openai")

if _MISSING:
    print(f"ERROR: Missing: {', '.join(_MISSING)}. pip install {' '.join(_MISSING)}", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

EMBED_BATCH_SIZE = 50
UPSERT_BATCH_SIZE = 100


def make_headers() -> dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }


# ---------------------------------------------------------------------------
# Fetch dataset_samples
# ---------------------------------------------------------------------------

def fetch_all_samples(http: httpx.Client) -> list[dict]:
    """Fetch all dataset_samples, paginating with range headers."""
    all_rows: list[dict] = []
    offset = 0
    batch = 500
    while True:
        headers = make_headers()
        headers["Range"] = f"{offset}-{offset + batch - 1}"
        resp = http.get(
            f"{SUPABASE_URL}/rest/v1/dataset_samples",
            headers=headers,
            params={
                "select": "id,dataset_id,s3_bucket,s3_object_key,filename,mime_type,"
                          "file_size_bytes,duration_seconds,resolution_width,resolution_height,"
                          "fps,metadata_json,s3_annotation_key,s3_specs_key,"
                          "enrichment_json,agent_context,lead_id,added_by,created_at",
                "order": "created_at.asc",
            },
            timeout=60,
        )
        if resp.status_code not in (200, 206):
            raise RuntimeError(f"Fetch error {resp.status_code}: {resp.text}")
        rows = resp.json()
        if not rows:
            break
        all_rows.extend(rows)
        if len(rows) < batch:
            break
        offset += len(rows)
    return all_rows


# ---------------------------------------------------------------------------
# Embedding
# ---------------------------------------------------------------------------

def build_caption_text(sample: dict) -> str:
    """Build caption text from agent_context and enrichment_json."""
    parts: list[str] = []
    ac = sample.get("agent_context") or {}
    if isinstance(ac, dict) and ac.get("caption"):
        parts.append(str(ac["caption"]))
    ej = sample.get("enrichment_json") or {}
    if isinstance(ej, dict):
        if ej.get("description"):
            parts.append(str(ej["description"]))
        if ej.get("visual_description"):
            parts.append(str(ej["visual_description"]))
    return " ".join(parts).strip() if parts else ""


def embed_texts(client: OpenAI, texts: list[str]) -> list[list[float] | None]:
    """Embed texts at 768 dims. Returns list aligned with input."""
    results: list[list[float] | None] = [None] * len(texts)
    valid_indices = [i for i, t in enumerate(texts) if t]
    valid_texts = [texts[i] for i in valid_indices]

    if not valid_texts:
        return results

    for batch_start in range(0, len(valid_texts), EMBED_BATCH_SIZE):
        batch_texts = valid_texts[batch_start:batch_start + EMBED_BATCH_SIZE]
        batch_indices = valid_indices[batch_start:batch_start + EMBED_BATCH_SIZE]
        try:
            resp = client.embeddings.create(
                model="text-embedding-3-small",
                input=batch_texts,
                dimensions=768,
            )
            for item in resp.data:
                original_idx = batch_indices[item.index]
                results[original_idx] = item.embedding
        except Exception as exc:
            print(f"  [warn] embedding batch failed: {exc}", file=sys.stderr)
        time.sleep(0.1)

    return results


# ---------------------------------------------------------------------------
# Upsert clips + dataset_clips
# ---------------------------------------------------------------------------

def upsert_clips(
    http: httpx.Client, clips: list[dict], dry_run: bool = False
) -> int:
    """Upsert into clips. Returns count upserted."""
    if dry_run:
        print(f"  [dry-run] Would upsert {len(clips)} clips")
        return len(clips)

    inserted = 0
    for i in range(0, len(clips), UPSERT_BATCH_SIZE):
        batch = clips[i:i + UPSERT_BATCH_SIZE]
        headers = make_headers()
        headers["Prefer"] = "resolution=ignore-duplicates,return=minimal"
        resp = http.post(
            f"{SUPABASE_URL}/rest/v1/clips",
            headers=headers,
            json=batch,
            params={"on_conflict": "s3_bucket,s3_key"},
            timeout=60,
        )
        if resp.status_code not in (200, 201):
            print(f"  [warn] clips upsert error {resp.status_code}: {resp.text}", file=sys.stderr)
        else:
            inserted += len(batch)
        time.sleep(0.1)
    return inserted


def lookup_clip_ids(http: httpx.Client, keys: list[tuple[str, str]]) -> dict[tuple[str, str], str]:
    """Look up clip IDs by (s3_bucket, s3_key). Returns mapping."""
    result: dict[tuple[str, str], str] = {}
    # Fetch all clips with matching keys
    for i in range(0, len(keys), 200):
        batch_keys = keys[i:i + 200]
        # Build OR filter
        or_parts = []
        for bucket, key in batch_keys:
            or_parts.append(f"and(s3_bucket.eq.{bucket},s3_key.eq.{key})")
        or_filter = ",".join(or_parts)
        headers = make_headers()
        resp = http.get(
            f"{SUPABASE_URL}/rest/v1/clips",
            headers=headers,
            params={
                "select": "id,s3_bucket,s3_key",
                "or": f"({or_filter})",
                "limit": "1000",
            },
            timeout=60,
        )
        if resp.status_code == 200:
            for row in resp.json():
                result[(row["s3_bucket"], row["s3_key"])] = row["id"]
        else:
            print(f"  [warn] clip lookup error {resp.status_code}: {resp.text}", file=sys.stderr)
    return result


def insert_dataset_clips(
    http: httpx.Client, rows: list[dict], dry_run: bool = False
) -> int:
    """Insert dataset_clips rows. Returns count inserted."""
    if dry_run:
        print(f"  [dry-run] Would insert {len(rows)} dataset_clips")
        return len(rows)

    inserted = 0
    for i in range(0, len(rows), UPSERT_BATCH_SIZE):
        batch = rows[i:i + UPSERT_BATCH_SIZE]
        headers = make_headers()
        headers["Prefer"] = "resolution=ignore-duplicates,return=minimal"
        resp = http.post(
            f"{SUPABASE_URL}/rest/v1/dataset_clips",
            headers=headers,
            json=batch,
            timeout=60,
        )
        if resp.status_code not in (200, 201):
            print(f"  [warn] dataset_clips insert error {resp.status_code}: {resp.text}", file=sys.stderr)
        else:
            inserted += len(batch)
        time.sleep(0.1)
    return inserted


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Migrate dataset_samples → clips + dataset_clips")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY", file=sys.stderr)
        sys.exit(1)
    if not OPENAI_API_KEY:
        print("ERROR: Set OPENAI_API_KEY for re-embedding", file=sys.stderr)
        sys.exit(1)

    http = httpx.Client()
    oai = OpenAI(api_key=OPENAI_API_KEY)

    # Step 1: Fetch all samples
    print("Fetching dataset_samples...")
    all_samples = fetch_all_samples(http)
    print(f"  Fetched {len(all_samples)} rows")

    # Filter out NULL s3_object_key
    skipped_null = [s for s in all_samples if not s.get("s3_object_key")]
    valid = [s for s in all_samples if s.get("s3_object_key")]
    print(f"  Skipping {len(skipped_null)} rows with NULL s3_object_key")
    for s in skipped_null:
        print(f"    - id={s['id']} dataset_id={s['dataset_id']} filename={s.get('filename')}")

    if args.limit > 0:
        valid = valid[:args.limit]

    # Step 2: Deduplicate by (s3_bucket, s3_object_key)
    # Keep first occurrence, collect all dataset_id/lead_id for dataset_clips
    clip_map: dict[tuple[str, str], dict] = {}  # (bucket, key) -> clip data
    dc_rows: list[dict] = []  # dataset_clips rows to create

    for s in valid:
        key = (s["s3_bucket"], s["s3_object_key"])
        if key not in clip_map:
            clip_map[key] = {
                "s3_bucket": s["s3_bucket"],
                "s3_key": s["s3_object_key"],
                "filename": s.get("filename"),
                "mime_type": s.get("mime_type"),
                "ann_metadata": s.get("metadata_json"),
                "ann_annotation_key": s.get("s3_annotation_key"),
                "ann_specs_key": s.get("s3_specs_key"),
                "ai_enrichment_json": s.get("enrichment_json"),
                "ai_agent_context": s.get("agent_context"),
                "tech_file_size_bytes": s.get("file_size_bytes"),
                "tech_duration_seconds": s.get("duration_seconds"),
                "tech_resolution_width": s.get("resolution_width"),
                "tech_resolution_height": s.get("resolution_height"),
                "tech_fps": s.get("fps"),
                "_caption_text": build_caption_text(s),
            }
        # Always create a dataset_clips entry
        dc_rows.append({
            "_s3_key": key,
            "dataset_id": s["dataset_id"],
            "lead_id": s.get("lead_id"),
            "added_by": s.get("added_by"),
        })

    print(f"  {len(clip_map)} unique clips, {len(dc_rows)} dataset_clips rows")

    # Step 3: Re-embed at 768 dims
    keys_list = list(clip_map.keys())
    captions = [clip_map[k]["_caption_text"] for k in keys_list]
    need_embed = sum(1 for c in captions if c)
    print(f"  Embedding {need_embed} clips at 768 dims...")

    if not args.dry_run:
        embeddings = embed_texts(oai, captions)
    else:
        embeddings = [None] * len(captions)
        print(f"  [dry-run] Skipping embedding")

    now_ts = datetime.now(timezone.utc).isoformat()
    clips_to_upsert = []
    for i, key in enumerate(keys_list):
        clip = clip_map[key]
        row = {
            "s3_bucket": clip["s3_bucket"],
            "s3_key": clip["s3_key"],
            "filename": clip["filename"],
            "mime_type": clip["mime_type"],
            "ann_metadata": clip["ann_metadata"],
            "ann_annotation_key": clip["ann_annotation_key"],
            "ann_specs_key": clip["ann_specs_key"],
            "ai_enrichment_json": clip["ai_enrichment_json"],
            "ai_agent_context": clip["ai_agent_context"],
            "tech_file_size_bytes": clip["tech_file_size_bytes"],
            "tech_duration_seconds": float(clip["tech_duration_seconds"]) if clip["tech_duration_seconds"] else None,
            "tech_resolution_width": clip["tech_resolution_width"],
            "tech_resolution_height": clip["tech_resolution_height"],
            "tech_fps": float(clip["tech_fps"]) if clip["tech_fps"] else None,
            "caption_text": clip["_caption_text"] or None,
        }
        if embeddings[i]:
            row["embedding"] = embeddings[i]
            row["caption_rebuilt_at"] = now_ts
        clips_to_upsert.append(row)

    # Step 4: Upsert clips
    print(f"  Upserting {len(clips_to_upsert)} clips...")
    upserted = upsert_clips(http, clips_to_upsert, dry_run=args.dry_run)
    print(f"  Upserted: {upserted}")

    # Step 5: Look up clip IDs
    print("  Looking up clip IDs...")
    if not args.dry_run:
        clip_ids = lookup_clip_ids(http, keys_list)
        print(f"  Found {len(clip_ids)} clip IDs")
    else:
        clip_ids = {}

    # Step 6: Insert dataset_clips
    dc_to_insert = []
    missing_clips = 0
    for dc in dc_rows:
        clip_id = clip_ids.get(dc["_s3_key"])
        if not clip_id and not args.dry_run:
            missing_clips += 1
            continue
        row = {
            "dataset_id": dc["dataset_id"],
            "clip_id": clip_id or "00000000-0000-0000-0000-000000000000",
            "added_by": dc.get("added_by"),
        }
        if dc.get("lead_id"):
            row["lead_id"] = dc["lead_id"]
        dc_to_insert.append(row)

    if missing_clips:
        print(f"  [warn] {missing_clips} dataset_clips skipped — clip not found")

    print(f"  Inserting {len(dc_to_insert)} dataset_clips...")
    dc_inserted = insert_dataset_clips(http, dc_to_insert, dry_run=args.dry_run)
    print(f"  Inserted: {dc_inserted}")

    print(f"\nDone. Clips: {upserted}, Dataset_clips: {dc_inserted}")
    http.close()


if __name__ == "__main__":
    main()
