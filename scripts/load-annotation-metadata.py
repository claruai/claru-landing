#!/usr/bin/env python3
"""
Load annotation-data.json metadata from moonvalley-annotation-platform S3 bucket.

For each video folder:
1. Read annotation-data.json to extract structured metadata
2. Combine with existing Gemini caption (if any) for richer embeddings
3. Upsert to video_index with combined caption + embedding

Handles two prefixes:
  - video_capture/completed/          (16.4k — already indexed, backfill metadata)
  - video-capture-activities/completed/ (11.7k — new, index from scratch)

Usage:
  python3 scripts/load-annotation-metadata.py [--prefix video_capture] [--limit 100] [--dry-run]
"""

import argparse
import json
import os
import sys
import time

_MISSING = []
try:
    import boto3
except ImportError:
    _MISSING.append("boto3")
try:
    import httpx
except ImportError:
    _MISSING.append("httpx")
try:
    from openai import OpenAI
except ImportError:
    _MISSING.append("openai")

if _MISSING:
    print(f"Missing: {', '.join(_MISSING)}. pip install {' '.join(_MISSING)}", file=sys.stderr)
    sys.exit(1)

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
BUCKET = "moonvalley-annotation-platform"

if not SUPABASE_URL or not SUPABASE_KEY or not OPENAI_API_KEY:
    print("Missing env vars. Source .env.local first.", file=sys.stderr)
    sys.exit(1)

parser = argparse.ArgumentParser()
parser.add_argument("--prefix", default="all", help="'video_capture', 'video-capture-activities', or 'all'")
parser.add_argument("--limit", type=int, default=None)
parser.add_argument("--dry-run", action="store_true")
parser.add_argument("--batch-size", type=int, default=50)
args = parser.parse_args()

s3 = boto3.client("s3", region_name="us-east-1")
oai = OpenAI(api_key=OPENAI_API_KEY)
http = httpx.Client(timeout=60)


def read_annotation_json(folder_prefix: str) -> dict | None:
    """Read annotation-data.json from an S3 folder."""
    key = folder_prefix + "annotation-data.json"
    try:
        obj = s3.get_object(Bucket=BUCKET, Key=key)
        return json.loads(obj["Body"].read())
    except Exception:
        return None


def find_video_key(folder_prefix: str) -> str | None:
    """Find the video file in a folder."""
    resp = s3.list_objects_v2(Bucket=BUCKET, Prefix=folder_prefix, MaxKeys=20)
    for obj in resp.get("Contents", []):
        k = obj["Key"].lower()
        if k.endswith((".mp4", ".mov", ".webm")):
            return obj["Key"]
    return None


def extract_structured_fields(annotation: dict) -> dict:
    """Extract structured metadata from annotation JSON."""
    fields = {}

    # generalData has the richest info
    gd = annotation.get("generalData", {})
    if isinstance(gd, dict):
        fields["main_category"] = gd.get("mainCategory") or gd.get("flow") or None
        fields["activities"] = gd.get("activities", [])
        fields["subcategory_action"] = gd.get("subcategory") or None

    # Top-level fields
    fields["category"] = annotation.get("category") or None
    fields["subcategory"] = annotation.get("subcategory") or None

    # Project info
    project = annotation.get("project", {})
    if isinstance(project, dict):
        fields["project_tag"] = project.get("tag") or None
        fields["project_type"] = project.get("type") or None

    # File metadata (resolution, duration, fps)
    files = annotation.get("files", [])
    if files and isinstance(files, list):
        f = files[0]
        attrs = f.get("attributes") or {}
        media = attrs.get("media") or {}
        tracks = media.get("track", [])
        for track in tracks:
            if track.get("@type") == "General":
                fields["file_size"] = track.get("FileSize")
                fields["duration"] = track.get("Duration")
            if track.get("@type") == "Video":
                fields["width"] = track.get("Width")
                fields["height"] = track.get("Height")
                fields["fps"] = track.get("FrameRate")
                if not fields.get("duration"):
                    fields["duration"] = track.get("Duration")
                fields["codec"] = track.get("Format")
                fields["bit_depth"] = track.get("BitDepth")
                fields["color_space"] = track.get("ColorSpace")
                fields["bit_rate"] = track.get("BitRate")

    return fields


def build_caption(fields: dict, existing_caption: str | None = None) -> str:
    """Build a rich caption combining annotation metadata + existing Gemini description.

    Designed to produce an embedding-friendly text that captures everything
    a researcher or data engineer would search for.
    """
    parts = []

    # Semantic content: what is happening
    cat = fields.get("main_category") or fields.get("category")
    if cat:
        parts.append(f"Category: {cat}.")

    subcat = fields.get("subcategory_action") or fields.get("subcategory")
    if subcat:
        parts.append(f"Action: {subcat}.")

    activities = fields.get("activities", [])
    if activities:
        parts.append(f"Activities: {', '.join(activities)}.")

    # Capture methodology
    proj_type = fields.get("project_type")
    proj_tag = fields.get("project_tag")
    if proj_type:
        label = proj_type.replace("_", " ").title()
        parts.append(f"Capture type: {label}.")
    if proj_tag:
        parts.append(f"Dataset: {proj_tag}.")

    # Technical specifications — searchable by resolution, fps, duration, codec
    specs = []
    w, h = fields.get("width"), fields.get("height")
    if w and h:
        specs.append(f"{w}x{h}")
        # Add human-readable resolution label
        if int(h) >= 2160:
            specs.append("4K UHD")
        elif int(h) >= 1080:
            specs.append("1080p Full HD")
        elif int(h) >= 720:
            specs.append("720p HD")

    fps = fields.get("fps")
    if fps:
        specs.append(f"{fps}fps")

    codec = fields.get("codec")
    if codec:
        specs.append(codec)

    duration = fields.get("duration")
    if duration:
        dur_s = float(duration)
        if dur_s >= 60:
            specs.append(f"{dur_s / 60:.1f}min")
        else:
            specs.append(f"{dur_s:.0f}s")

    file_size = fields.get("file_size")
    if file_size:
        mb = int(file_size) / (1024 * 1024)
        if mb >= 1024:
            specs.append(f"{mb / 1024:.1f}GB")
        else:
            specs.append(f"{mb:.0f}MB")

    if specs:
        parts.append(f"Technical: {', '.join(specs)}.")

    # Existing Gemini scene description (skip sparse annotation-only captions)
    if existing_caption and not existing_caption.startswith("Subcategory:") and not existing_caption.startswith("Category:"):
        parts.append(f"Scene: {existing_caption}")

    return " ".join(parts)


def embed_batch(texts: list[str]) -> list[list[float] | None]:
    """Embed texts at 768 dimensions."""
    results: list[list[float] | None] = [None] * len(texts)
    try:
        resp = oai.embeddings.create(
            model="text-embedding-3-small",
            input=texts,
            dimensions=768,
        )
        for item in resp.data:
            results[item.index] = item.embedding
    except Exception as e:
        print(f"  [warn] embedding failed: {e}", file=sys.stderr)
    return results


def upsert_rows(rows: list[dict]) -> int:
    """Upsert to video_index via PostgREST."""
    url = f"{SUPABASE_URL}/rest/v1/video_index"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates,return=minimal",  # DO NOTHING — no bloat
    }
    resp = http.post(url, headers=headers, json=rows, params={"on_conflict": "s3_bucket,s3_key"})
    if resp.status_code in (200, 201):
        return len(rows)
    raise RuntimeError(f"PostgREST error {resp.status_code}: {resp.text[:200]}")


def get_existing_captions(s3_keys: list[str]) -> dict[str, str]:
    """Fetch existing caption_text for s3_keys from video_index."""
    url = f"{SUPABASE_URL}/rest/v1/video_index"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    result = {}
    # Batch in groups of 50
    for i in range(0, len(s3_keys), 50):
        batch = s3_keys[i:i + 50]
        key_filter = ",".join(batch)
        resp = http.get(url, headers=headers, params={
            "select": "s3_key,caption_text",
            "s3_bucket": f"eq.{BUCKET}",
            "s3_key": f"in.({key_filter})",
        })
        if resp.status_code == 200:
            for row in resp.json():
                if row.get("caption_text"):
                    result[row["s3_key"]] = row["caption_text"]
    return result


def process_prefix(prefix: str):
    """Process all folders under a prefix."""
    print(f"\n=== Processing {prefix} ===")

    paginator = s3.get_paginator("list_objects_v2")
    folders = []
    for page in paginator.paginate(Bucket=BUCKET, Prefix=prefix, Delimiter="/"):
        for cp in page.get("CommonPrefixes", []):
            folders.append(cp["Prefix"])

    print(f"Found {len(folders)} folders")

    if args.limit:
        folders = folders[:args.limit]
        print(f"Limited to {len(folders)}")

    batch = []
    total_ok = 0
    total_skip = 0
    total_fail = 0

    for i, folder in enumerate(folders):
        # Read annotation JSON
        annotation = read_annotation_json(folder)
        if not annotation:
            total_skip += 1
            continue

        # Find video file
        video_key = find_video_key(folder)
        if not video_key:
            total_skip += 1
            continue

        # Extract structured fields
        fields = extract_structured_fields(annotation)

        batch.append({
            "video_key": video_key,
            "fields": fields,
            "folder": folder,
        })

        if len(batch) >= args.batch_size:
            ok, fail = flush_batch(batch)
            total_ok += ok
            total_fail += fail
            batch = []

            if (i + 1) % 200 == 0:
                print(f"  [progress] {i + 1}/{len(folders)} folders | {total_ok} ok, {total_skip} skip, {total_fail} fail")

    # Flush remaining
    if batch:
        ok, fail = flush_batch(batch)
        total_ok += ok
        total_fail += fail

    print(f"\n=== {prefix} done: {total_ok} ok, {total_skip} skip, {total_fail} fail ===")


def flush_batch(batch: list[dict]) -> tuple[int, int]:
    """Process and upsert a batch."""
    if args.dry_run:
        for item in batch[:3]:
            f = item["fields"]
            print(f"  [dry-run] {item['video_key'][-50:]}")
            print(f"    cat={f.get('main_category')} sub={f.get('subcategory_action')} acts={f.get('activities', [])}")
        return len(batch), 0

    # Fetch existing captions for these keys (to merge with Gemini descriptions)
    video_keys = [b["video_key"] for b in batch]
    existing = get_existing_captions(video_keys)

    # Build combined captions
    captions = []
    for item in batch:
        existing_caption = existing.get(item["video_key"])
        caption = build_caption(item["fields"], existing_caption)
        captions.append(caption)

    # Embed
    embeddings = embed_batch(captions)

    # Build upsert rows
    rows = []
    for item, caption, emb in zip(batch, captions, embeddings):
        if not emb:
            continue
        rows.append({
            "s3_bucket": BUCKET,
            "s3_key": item["video_key"],
            "caption_text": caption,
            "embedding": json.dumps(emb),
            "enrichment_source": "annotation_json_structured",
        })

    if not rows:
        return 0, len(batch)

    try:
        upserted = upsert_rows(rows)
        time.sleep(0.1)  # Brief throttle
        return upserted, 0
    except Exception as e:
        print(f"  [error] upsert: {e}", file=sys.stderr)
        return 0, len(rows)


def main():
    prefixes = []
    if args.prefix == "all":
        prefixes = ["video_capture/completed/", "video-capture-activities/completed/"]
    elif args.prefix == "video_capture":
        prefixes = ["video_capture/completed/"]
    elif args.prefix == "video-capture-activities":
        prefixes = ["video-capture-activities/completed/"]
    else:
        prefixes = [args.prefix]

    print(f"Annotation metadata loader | prefixes={[p for p in prefixes]} batch_size={args.batch_size} limit={args.limit} dry_run={args.dry_run}")

    for prefix in prefixes:
        process_prefix(prefix)

    print("\nAll done!")


if __name__ == "__main__":
    main()
