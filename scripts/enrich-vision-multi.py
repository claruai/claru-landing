#!/usr/bin/env python3
"""
Multi-provider vision enrichment for clips without ai_caption.

Runs 4 parallel workers, each using a different vision API:
  W1: Gemini direct (GEMINI_API_KEY)
  W2: FAL → Gemini (FAL_KEY → google/gemini-2.5-flash)
  W3: FAL → GPT-4o-mini (FAL_KEY → openai/gpt-4o-mini)
  W4: OpenAI direct (OPENAI_API_KEY → gpt-4o-mini)

Each worker claims clips by key range to avoid conflicts.
Writes ai_caption + ai_enrichment_source on clips table.
Sets caption_rebuilt_at = NULL so rebuild script re-embeds.

Usage:
  python3 scripts/enrich-vision-multi.py [--limit 100] [--dry-run]
"""

import argparse
import json
import os
import sys
import subprocess
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import boto3
import httpx

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
FAL_KEY = os.environ.get("FAL_KEY", "")
BUCKET = "moonvalley-annotation-platform"

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Missing SUPABASE env vars", file=sys.stderr)
    sys.exit(1)

parser = argparse.ArgumentParser()
parser.add_argument("--limit", type=int, default=None)
parser.add_argument("--dry-run", action="store_true")
parser.add_argument("--concurrency", type=int, default=4)
args = parser.parse_args()

s3 = boto3.client("s3", region_name="us-east-1")
http = httpx.Client(timeout=120)

PROMPT = """These are 3 frames from a video (start, middle, end). Describe the complete scene for a search index. Include:
- The environment/setting (indoor/outdoor, specific location type like kitchen, workshop, factory, street)
- People and their actions throughout the video (what they are doing, how they move)
- Key objects visible and how they're used
- Camera perspective (first-person/egocentric, overhead, third-person, etc.)
Write 2-4 sentences that capture what happens across all frames. Be specific, not generic."""

PROMPT_SINGLE = """Describe this video frame in detail for a search index. Include:
- The environment/setting (indoor/outdoor, specific location type)
- People and their actions
- Key objects visible
- Camera perspective (first-person, overhead, etc.)
Keep it to 2-3 sentences. Be specific about the scene, not generic."""


# ---------------------------------------------------------------------------
# Vision providers
# ---------------------------------------------------------------------------

def enrich_gemini_direct(frame_paths: list[str]) -> str | None:
    """Gemini 2.5 Flash via direct API — accepts multiple frame file paths."""
    if not GEMINI_KEY:
        return None
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")
    parts = [PROMPT if len(frame_paths) > 1 else PROMPT_SINGLE]
    for fp in frame_paths:
        with open(fp, "rb") as f:
            parts.append({"mime_type": "image/jpeg", "data": f.read()})
    response = model.generate_content(parts)
    return response.text.strip() if response.text else None


def _fal_openrouter(model: str, data_urls: list[str]) -> str | None:
    """Call FAL OpenRouter with one or more base64 image URLs."""
    if not FAL_KEY:
        return None
    content = [{"type": "text", "text": PROMPT if len(data_urls) > 1 else PROMPT_SINGLE}]
    for url in data_urls:
        content.append({"type": "image_url", "image_url": {"url": url}})
    resp = http.post(
        "https://fal.run/openrouter/router/openai/v1/chat/completions",
        headers={"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"},
        json={"model": model, "messages": [{"role": "user", "content": content}], "temperature": 0.3},
        timeout=90,
    )
    if resp.status_code == 200:
        return resp.json()["choices"][0]["message"]["content"].strip()
    return None


def enrich_fal_gemini(data_urls: list[str]) -> str | None:
    """Gemini via FAL OpenRouter."""
    return _fal_openrouter("google/gemini-2.5-flash", data_urls)


def enrich_fal_gpt4o(data_urls: list[str]) -> str | None:
    """GPT-4o-mini via FAL OpenRouter."""
    return _fal_openrouter("openai/gpt-4o-mini", data_urls)


def enrich_openai_direct(data_urls: list[str]) -> str | None:
    """GPT-4o-mini via OpenAI direct."""
    if not OPENAI_KEY:
        return None
    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_KEY)
    content = [{"type": "text", "text": PROMPT if len(data_urls) > 1 else PROMPT_SINGLE}]
    for url in data_urls:
        content.append({"type": "image_url", "image_url": {"url": url}})
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": content}],
        temperature=0.3,
        max_tokens=400,
    )
    return response.choices[0].message.content.strip() if response.choices else None


# Provider list — each worker gets one
PROVIDERS = [
    ("gemini_direct", enrich_gemini_direct, "gemini_frame", True),   # needs local file
    ("fal_gemini", enrich_fal_gemini, "gemini_frame_fal", False),     # needs URL
    ("fal_gpt4o", enrich_fal_gpt4o, "gpt4o_mini_fal", False),        # needs URL
    ("openai_direct", enrich_openai_direct, "gpt4o_mini", False),     # needs URL
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_clips_needing_enrichment(limit: int | None = None) -> list[dict]:
    """Fetch clips without ai_caption from annotation-platform bucket."""
    params = {
        "select": "id,s3_bucket,s3_key",
        "s3_bucket": f"eq.{BUCKET}",
        "ai_caption": "is.null",
        "order": "s3_key.asc",
        "limit": str(limit or 10000),
    }
    resp = http.get(f"{SUPABASE_URL}/rest/v1/clips", headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }, params=params)
    return resp.json() if resp.status_code == 200 else []


def extract_frames(s3_key: str, count: int = 3) -> list[str]:
    """Download video from S3 and extract frames at start/middle/end as JPEGs.

    Returns list of frame file paths (caller must delete).
    Extracts at 10%, 50%, 90% of video duration for better coverage.
    """
    try:
        tmp_video = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
        tmp_video.close()
        s3.download_file(BUCKET, s3_key, tmp_video.name)

        # Get duration
        probe = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", tmp_video.name],
            capture_output=True, text=True, timeout=15,
        )
        duration = float(probe.stdout.strip()) if probe.stdout.strip() else 10.0

        # Extract frames at 10%, 50%, 90%
        positions = [duration * p for p in [0.1, 0.5, 0.9]]
        frame_paths = []

        for i, pos in enumerate(positions[:count]):
            tmp_frame = tempfile.NamedTemporaryFile(suffix=f"_f{i}.jpg", delete=False)
            tmp_frame.close()
            subprocess.run([
                "ffmpeg", "-y", "-ss", str(pos), "-i", tmp_video.name,
                "-frames:v", "1", "-q:v", "2", tmp_frame.name,
            ], capture_output=True, timeout=15)
            if os.path.getsize(tmp_frame.name) > 100:
                frame_paths.append(tmp_frame.name)
            else:
                os.unlink(tmp_frame.name)

        os.unlink(tmp_video.name)

        # Fallback: if no frames extracted, try keyframe
        if not frame_paths:
            tmp_video2 = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
            tmp_frame2 = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
            tmp_video2.close()
            tmp_frame2.close()
            s3.download_file(BUCKET, s3_key, tmp_video2.name)
            subprocess.run([
                "ffmpeg", "-y", "-i", tmp_video2.name,
                "-vf", r"select=eq(pict_type\,I)",
                "-frames:v", "1", "-q:v", "2", tmp_frame2.name,
            ], capture_output=True, timeout=30)
            os.unlink(tmp_video2.name)
            if os.path.getsize(tmp_frame2.name) > 100:
                frame_paths.append(tmp_frame2.name)
            else:
                os.unlink(tmp_frame2.name)

        return frame_paths
    except Exception:
        return []


def get_frame_data_url(frame_path: str) -> str:
    """Convert a local JPEG file to a base64 data URL."""
    import base64
    with open(frame_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return f"data:image/jpeg;base64,{b64}"


def update_clip(clip_id: str, caption: str, source: str):
    """Update clip's ai_caption and flag for rebuild."""
    resp = http.patch(
        f"{SUPABASE_URL}/rest/v1/clips",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        params={"id": f"eq.{clip_id}"},
        json={
            "ai_caption": caption,
            "ai_enrichment_source": source,
            "caption_rebuilt_at": None,
        },
    )
    return resp.status_code in (200, 204)


def process_clip(clip: dict, provider_name: str, provider_fn, source_tag: str, needs_file: bool) -> dict:
    """Process a single clip with the assigned provider. Extracts 3 frames (start/mid/end)."""
    clip_id = clip["id"]
    s3_key = clip["s3_key"]

    try:
        # Extract 3 frames (10%, 50%, 90% of video)
        frame_paths = extract_frames(s3_key, count=3)
        if not frame_paths:
            return {"id": clip_id, "status": "error", "error": "frame extraction failed"}

        try:
            if needs_file:
                # Pass file paths directly (Gemini direct)
                caption = provider_fn(frame_paths)
            else:
                # Convert all frames to base64 data URLs
                data_urls = [get_frame_data_url(fp) for fp in frame_paths]
                caption = provider_fn(data_urls)
        finally:
            for fp in frame_paths:
                try:
                    os.unlink(fp)
                except OSError:
                    pass

        if not caption:
            return {"id": clip_id, "status": "error", "error": "empty response"}

        if not args.dry_run:
            update_clip(clip_id, caption, source_tag)

        n_frames = len(frame_paths)
        return {"id": clip_id, "status": "ok", "provider": provider_name, "frames": n_frames, "caption": caption[:80]}

    except Exception as e:
        return {"id": clip_id, "status": "error", "error": str(e)[:80]}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    clips = get_clips_needing_enrichment(args.limit)
    print(f"Found {len(clips)} clips needing vision enrichment")

    if not clips:
        print("Nothing to do!")
        return

    if args.dry_run:
        for c in clips[:5]:
            print(f"  [dry-run] {c['id'][:8]} | {c['s3_key'][-50:]}")
        return

    # Filter providers to those with available keys
    available = []
    if GEMINI_KEY:
        available.append(PROVIDERS[0])
    if FAL_KEY:
        available.append(PROVIDERS[1])
        available.append(PROVIDERS[2])
    if OPENAI_KEY:
        available.append(PROVIDERS[3])

    if not available:
        print("No API keys available!", file=sys.stderr)
        sys.exit(1)

    print(f"Using {len(available)} providers: {[p[0] for p in available]}")

    # Distribute clips across providers round-robin
    ok = 0
    failed = 0

    with ThreadPoolExecutor(max_workers=min(args.concurrency, len(available))) as pool:
        futures = {}
        for i, clip in enumerate(clips):
            provider = available[i % len(available)]
            name, fn, tag, needs_file = provider
            future = pool.submit(process_clip, clip, name, fn, tag, needs_file)
            futures[future] = clip

        for future in as_completed(futures):
            result = future.result()
            if result["status"] == "ok":
                ok += 1
                print(f"  [{result['id'][:8]}] ✓ ({result['provider']}) {result['caption']}")
            else:
                failed += 1
                print(f"  [{result['id'][:8]}] ✗ {result['error']}", file=sys.stderr)

            if (ok + failed) % 50 == 0:
                print(f"  [progress] {ok} ok / {failed} failed / {ok + failed} total")

    print(f"\nDone. OK: {ok} / Failed: {failed} / Total: {ok + failed}")


if __name__ == "__main__":
    main()
