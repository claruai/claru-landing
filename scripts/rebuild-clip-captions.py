#!/usr/bin/env python3
"""
Rebuild caption_text and embedding for clips that need it.

Selects clips WHERE caption_rebuilt_at IS NULL, builds a combined caption_text
from all source columns (ann_metadata, tech specs, ai_caption), generates a
768-dim embedding via OpenAI text-embedding-3-small, and updates the clip.

This is the ONLY script that writes to caption_text, embedding, and
caption_rebuilt_at. Loader scripts set caption_rebuilt_at = NULL to flag
rows for rebuild.

Handles varying ann_metadata shapes:
  - annotation-platform: {category, subcategory, activities, generalData: {mainCategory, subcategory, activities}}
  - troveo: {category, main_category, subcategory, quality}
  - cobry: may not have ann_metadata at all (only ai_caption)

Usage:
  python3 scripts/rebuild-clip-captions.py [--limit 1000] [--batch-size 100] [--dry-run]

Requires: Python 3.10+, openai, httpx
Env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Dependency checks
# ---------------------------------------------------------------------------

_MISSING: list[str] = []
try:
    from openai import OpenAI
except ImportError:
    _MISSING.append("openai")
try:
    import httpx
except ImportError:
    _MISSING.append("httpx")

if _MISSING:
    print(f"Missing: {', '.join(_MISSING)}. pip install {' '.join(_MISSING)}", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY or not OPENAI_API_KEY:
    print("Missing env vars. Source .env.local first.", file=sys.stderr)
    sys.exit(1)


def make_headers() -> dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }


# ---------------------------------------------------------------------------
# Caption building
# ---------------------------------------------------------------------------

def extract_category_from_metadata(ann_metadata: dict | None) -> str | None:
    """Extract category from varying ann_metadata shapes.

    Handles:
      - annotation-platform: {category, generalData: {mainCategory, flow}}
      - troveo: {category, main_category}
      - plain: {category}
    """
    if not ann_metadata:
        return None

    # Try generalData first (annotation-platform shape)
    gd = ann_metadata.get("generalData", {})
    if isinstance(gd, dict):
        cat = gd.get("mainCategory") or gd.get("flow")
        if cat:
            return str(cat)

    # Try top-level fields
    cat = ann_metadata.get("category") or ann_metadata.get("main_category")
    if cat:
        return str(cat)

    return None


def extract_subcategory_from_metadata(ann_metadata: dict | None) -> str | None:
    """Extract subcategory from varying ann_metadata shapes."""
    if not ann_metadata:
        return None

    # Try generalData first
    gd = ann_metadata.get("generalData", {})
    if isinstance(gd, dict):
        sub = gd.get("subcategory")
        if sub:
            return str(sub)

    # Try top-level
    sub = ann_metadata.get("subcategory")
    if sub:
        return str(sub)

    return None


def extract_activities_from_metadata(ann_metadata: dict | None) -> list[str]:
    """Extract activities list from varying ann_metadata shapes."""
    if not ann_metadata:
        return []

    # Try generalData first
    gd = ann_metadata.get("generalData", {})
    if isinstance(gd, dict):
        acts = gd.get("activities", [])
        if acts and isinstance(acts, list):
            return [str(a) for a in acts]

    # Try top-level
    acts = ann_metadata.get("activities", [])
    if acts and isinstance(acts, list):
        return [str(a) for a in acts]

    return []


def extract_project_info(ann_metadata: dict | None) -> tuple[str | None, str | None]:
    """Extract project_type and project_tag from ann_metadata."""
    if not ann_metadata:
        return None, None
    return ann_metadata.get("project_type"), ann_metadata.get("project_tag")


def build_caption(clip: dict) -> str:
    """Build a rich caption combining all source columns.

    Combines:
    1. ann_metadata: category, subcategory, activities, project info
    2. tech specs: resolution, fps, duration
    3. ai_caption: scene description

    Produces an embedding-friendly text that captures everything
    a researcher or data engineer would search for.
    """
    parts: list[str] = []

    # --- Annotation metadata ---
    ann = clip.get("ann_metadata")
    if isinstance(ann, str):
        try:
            ann = json.loads(ann)
        except (json.JSONDecodeError, TypeError):
            ann = None

    cat = extract_category_from_metadata(ann)
    if cat:
        parts.append(f"Category: {cat}.")

    subcat = extract_subcategory_from_metadata(ann)
    if subcat:
        parts.append(f"Action: {subcat}.")

    activities = extract_activities_from_metadata(ann)
    if activities:
        parts.append(f"Activities: {', '.join(activities)}.")

    project_type, project_tag = extract_project_info(ann)
    if project_type:
        label = project_type.replace("_", " ").title()
        parts.append(f"Capture type: {label}.")
    if project_tag:
        parts.append(f"Dataset: {project_tag}.")

    # Quality info (troveo-style)
    if ann and ann.get("quality"):
        parts.append(f"Quality: {ann['quality']}.")

    # --- Technical specifications ---
    specs: list[str] = []
    w = clip.get("tech_resolution_width")
    h = clip.get("tech_resolution_height")
    if w and h:
        specs.append(f"{w}x{h}")
        try:
            h_int = int(h)
            if h_int >= 2160:
                specs.append("4K UHD")
            elif h_int >= 1080:
                specs.append("1080p Full HD")
            elif h_int >= 720:
                specs.append("720p HD")
        except (ValueError, TypeError):
            pass

    fps = clip.get("tech_fps")
    if fps:
        specs.append(f"{fps}fps")

    codec = clip.get("tech_codec")
    if codec:
        specs.append(str(codec))

    duration = clip.get("tech_duration_seconds")
    if duration:
        try:
            dur_s = float(duration)
            if dur_s >= 60:
                specs.append(f"{dur_s / 60:.1f}min")
            else:
                specs.append(f"{dur_s:.0f}s")
        except (ValueError, TypeError):
            pass

    file_size = clip.get("tech_file_size_bytes")
    if file_size:
        try:
            mb = int(file_size) / (1024 * 1024)
            if mb >= 1024:
                specs.append(f"{mb / 1024:.1f}GB")
            else:
                specs.append(f"{mb:.0f}MB")
        except (ValueError, TypeError):
            pass

    if specs:
        parts.append(f"Technical: {', '.join(specs)}.")

    # --- AI caption (scene description) ---
    ai_caption = clip.get("ai_caption")
    if ai_caption and isinstance(ai_caption, str) and ai_caption.strip():
        parts.append(f"Scene: {ai_caption.strip()}")

    return " ".join(parts)


# ---------------------------------------------------------------------------
# Embedding
# ---------------------------------------------------------------------------

def embed_batch(client: OpenAI, texts: list[str]) -> list[list[float] | None]:
    """Embed texts at 768 dimensions using text-embedding-3-small."""
    results: list[list[float] | None] = [None] * len(texts)
    # Filter out empty texts
    valid_indices = [i for i, t in enumerate(texts) if t.strip()]
    valid_texts = [texts[i] for i in valid_indices]

    if not valid_texts:
        return results

    try:
        resp = client.embeddings.create(
            model="text-embedding-3-small",
            input=valid_texts,
            dimensions=768,
        )
        for item in resp.data:
            original_idx = valid_indices[item.index]
            results[original_idx] = item.embedding
    except Exception as e:
        print(f"  [warn] embedding batch failed: {e}", file=sys.stderr)

    return results


# ---------------------------------------------------------------------------
# Database operations
# ---------------------------------------------------------------------------

def fetch_clips_needing_rebuild(
    http_client: httpx.Client, limit: int, offset: int = 0
) -> list[dict]:
    """Fetch clips where caption_rebuilt_at IS NULL.

    Returns clips with all source columns needed for caption building.
    """
    url = f"{SUPABASE_URL}/rest/v1/clips"
    headers = make_headers()
    headers["Range"] = f"{offset}-{offset + limit - 1}"
    headers["Prefer"] = "count=exact"

    resp = http_client.get(
        url,
        headers=headers,
        params={
            "select": (
                "id,s3_bucket,s3_key,"
                "ann_metadata,"
                "tech_resolution_width,tech_resolution_height,tech_fps,"
                "tech_duration_seconds,tech_codec,tech_file_size_bytes,"
                "ai_caption,ai_enrichment_source"
            ),
            "caption_rebuilt_at": "is.null",
            "order": "created_at.asc",
        },
        timeout=60,
    )
    if resp.status_code in (200, 206):
        return resp.json()
    raise RuntimeError(f"Fetch error {resp.status_code}: {resp.text[:200]}")


def update_clip(http_client: httpx.Client, clip_id: str, body: dict) -> bool:
    """Update a single clip row."""
    url = f"{SUPABASE_URL}/rest/v1/clips?id=eq.{clip_id}"
    resp = http_client.patch(url, headers=make_headers(), json=body, timeout=30)
    return resp.status_code in (200, 204)


def update_clips_batch(http_client: httpx.Client, updates: list[dict]) -> tuple[int, int]:
    """Update multiple clips. Returns (success_count, fail_count).

    PostgREST doesn't support batch PATCH, so we update one by one.
    """
    ok = 0
    fail = 0
    for upd in updates:
        clip_id = upd.pop("id")
        if update_clip(http_client, clip_id, upd):
            ok += 1
        else:
            fail += 1
    return ok, fail


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Rebuild clip captions and embeddings")
    parser.add_argument("--limit", type=int, default=0, help="Max clips to process (0 = all)")
    parser.add_argument("--batch-size", type=int, default=100, help="Batch size for fetching and embedding")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without writing")
    args = parser.parse_args()

    print(f"[rebuild-captions] limit={args.limit or 'all'} batch_size={args.batch_size} dry_run={args.dry_run}")

    oai = OpenAI(api_key=OPENAI_API_KEY)
    http_client = httpx.Client()

    total_rebuilt = 0
    total_skipped = 0
    total_failed = 0
    offset = 0

    try:
        while True:
            # Check limit
            if args.limit > 0 and total_rebuilt >= args.limit:
                print(f"[rebuild-captions] Reached limit of {args.limit}")
                break

            fetch_limit = args.batch_size
            if args.limit > 0:
                fetch_limit = min(fetch_limit, args.limit - total_rebuilt)

            # Fetch batch of clips needing rebuild
            clips = fetch_clips_needing_rebuild(http_client, fetch_limit, offset=0)
            if not clips:
                print("[rebuild-captions] No more clips needing rebuild.")
                break

            print(f"[rebuild-captions] Fetched {len(clips)} clips needing rebuild")

            # Build captions for the batch
            captions: list[str] = []
            clip_ids: list[str] = []
            for clip in clips:
                caption = build_caption(clip)
                if not caption.strip():
                    # No source data to build from -- skip but still mark as rebuilt
                    # to prevent infinite re-fetching
                    total_skipped += 1
                    if not args.dry_run:
                        update_clip(http_client, clip["id"], {
                            "caption_rebuilt_at": datetime.now(timezone.utc).isoformat(),
                        })
                    continue
                captions.append(caption)
                clip_ids.append(clip["id"])

            if not captions:
                # All clips in this batch had no data; continue to next batch
                continue

            if args.dry_run:
                for cid, cap in zip(clip_ids[:5], captions[:5]):
                    print(f"  [dry-run] {cid[:8]} -> \"{cap[:100]}...\"")
                if len(clip_ids) > 5:
                    print(f"  ... and {len(clip_ids) - 5} more")
                total_rebuilt += len(clip_ids)
                continue

            # Generate embeddings for the batch
            embeddings = embed_batch(oai, captions)

            # Build update payloads
            now = datetime.now(timezone.utc).isoformat()
            updates: list[dict] = []
            for clip_id, caption, emb in zip(clip_ids, captions, embeddings):
                if emb is None:
                    total_failed += 1
                    # Leave caption_rebuilt_at = NULL so it gets retried
                    continue
                updates.append({
                    "id": clip_id,
                    "caption_text": caption,
                    "embedding": json.dumps(emb),
                    "caption_rebuilt_at": now,
                })

            if not updates:
                continue

            # Apply updates
            ok, fail = update_clips_batch(http_client, updates)
            total_rebuilt += ok
            total_failed += fail

            print(f"  [progress] rebuilt: {total_rebuilt}, skipped: {total_skipped}, failed: {total_failed}")

            # Throttle between batches
            time.sleep(0.2)

    finally:
        http_client.close()

    print(f"\n[rebuild-captions] Done. Rebuilt: {total_rebuilt}, Skipped: {total_skipped}, Failed: {total_failed}")


if __name__ == "__main__":
    main()
