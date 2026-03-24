#!/usr/bin/env python3
"""
Turbo vision enrichment — async parallel processing with Gemini 2.5 Flash.

Key optimizations over enrich-vision-fast.py:
  1. Async concurrency — 20+ clips processed in parallel (vs sequential)
  2. Uses google-genai SDK (new) with inline image data
  3. Automatic rate-limit backoff
  4. Progress tracking with ETA

Speed: ~200-400 clips/min (vs ~3 clips/min per fast worker)

Usage:
  python3 scripts/enrich-vision-turbo.py --concurrency 20 --limit 10000 --worker-id 1
  python3 scripts/enrich-vision-turbo.py --offset 0 --limit 50000 --concurrency 30 --dry-run
"""

from __future__ import annotations

import argparse
import asyncio
import base64
import os
import subprocess
import sys
import tempfile
import time

# ---------------------------------------------------------------------------
# Dependency checks
# ---------------------------------------------------------------------------
_MISSING: list[str] = []
try:
    import boto3
except ImportError:
    _MISSING.append("boto3")
try:
    import httpx
except ImportError:
    _MISSING.append("httpx")
try:
    import google.genai as genai
except ImportError:
    _MISSING.append("google-genai")

if _MISSING:
    print(f"Missing: {', '.join(_MISSING)}", file=sys.stderr)
    sys.exit(1)

import google.genai as genai
from google.genai import types

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
BUCKET = "moonvalley-annotation-platform"

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Missing SUPABASE env vars", file=sys.stderr)
    sys.exit(1)
if not GEMINI_KEY:
    print("Missing GEMINI_API_KEY", file=sys.stderr)
    sys.exit(1)

parser = argparse.ArgumentParser()
parser.add_argument("--offset", type=int, default=0)
parser.add_argument("--limit", type=int, default=10000)
parser.add_argument("--concurrency", type=int, default=20,
                    help="Max concurrent Gemini requests (default 20)")
parser.add_argument("--worker-id", type=str, default="0")
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()

s3 = boto3.client("s3", region_name="us-east-1")
gclient = genai.Client(api_key=GEMINI_KEY)

PROMPT = """Describe this video frame in detail for a search index. Include:
- The environment/setting (indoor/outdoor, specific location type like kitchen, workshop, factory, street)
- People and their actions
- Key objects visible and how they're used
- Camera perspective (first-person/egocentric, overhead, third-person, etc.)
Keep it to 2-3 sentences. Be specific about the scene, not generic."""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_presigned_url(s3_key: str) -> str:
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET, "Key": s3_key},
        ExpiresIn=600,
    )


def fetch_clips_sync() -> list[dict]:
    """Fetch clips needing enrichment via PostgREST with pagination."""
    PAGE_SIZE = 1000
    all_clips: list[dict] = []
    offset = args.offset
    remaining = args.limit

    with httpx.Client(timeout=30) as http:
        while remaining > 0:
            batch_size = min(PAGE_SIZE, remaining)
            r = http.get(f"{SUPABASE_URL}/rest/v1/clips", headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
            }, params={
                "select": "id,s3_key",
                "s3_bucket": f"eq.{BUCKET}",
                "ai_caption": "is.null",
                "order": "s3_key.asc",
                "offset": str(offset),
                "limit": str(batch_size),
            })
            batch = r.json() if r.status_code == 200 else []
            if not batch:
                break
            all_clips.extend(batch)
            remaining -= len(batch)
            offset += len(batch)
            if len(batch) < batch_size:
                break  # no more rows

    return all_clips


def extract_frame(presigned_url: str) -> bytes | None:
    """Extract single frame via ffmpeg from presigned URL. Returns JPEG bytes."""
    tf = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    tf.close()
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", presigned_url, "-frames:v", "1", "-q:v", "3", tf.name],
            capture_output=True, timeout=20,
        )
        if os.path.getsize(tf.name) > 100:
            with open(tf.name, "rb") as f:
                data = f.read()
            os.unlink(tf.name)
            return data
        os.unlink(tf.name)
        return None
    except Exception:
        try:
            os.unlink(tf.name)
        except OSError:
            pass
        return None


async def call_gemini(image_bytes: bytes) -> str | None:
    """Call Gemini 2.5 Flash with inline image data."""
    try:
        response = await asyncio.to_thread(
            gclient.models.generate_content,
            model="gemini-2.5-flash",
            contents=[
                PROMPT,
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
            ],
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=300,
            ),
        )
        if response.text:
            return response.text.strip()
        return None
    except Exception as e:
        err = str(e)[:200]
        if "429" in err or "RESOURCE_EXHAUSTED" in err:
            raise
        return None


async def update_clip_async(http: httpx.AsyncClient, clip_id: str, caption: str):
    """Update clip's ai_caption and flag for rebuild."""
    await http.patch(
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
            "ai_enrichment_source": "gemini_turbo",
            "caption_rebuilt_at": None,
        },
    )


# ---------------------------------------------------------------------------
# Rate limiter
# ---------------------------------------------------------------------------

class AdaptiveRateLimiter:
    """Adjusts concurrency based on rate limit responses."""

    def __init__(self, initial: int):
        self.sem = asyncio.Semaphore(initial)
        self.max_concurrent = initial
        self.backoff_until = 0.0

    async def acquire(self):
        await self.sem.acquire()
        # If we're in backoff, add a small delay
        now = time.time()
        if now < self.backoff_until:
            await asyncio.sleep(self.backoff_until - now)

    def release(self):
        self.sem.release()

    def backoff(self, seconds: float):
        self.backoff_until = time.time() + seconds


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

async def process_clip(
    limiter: AdaptiveRateLimiter,
    http: httpx.AsyncClient,
    clip: dict,
    stats: dict,
):
    """Process a single clip with rate-limited concurrency."""
    await limiter.acquire()
    try:
        clip_id = clip["id"]
        s3_key = clip["s3_key"]

        # Step 1: Extract frame (run in thread to not block event loop)
        url = get_presigned_url(s3_key)
        image_bytes = await asyncio.to_thread(extract_frame, url)
        if not image_bytes:
            stats["fail"] += 1
            return

        # Step 2: Call Gemini with retries
        caption = None
        for attempt in range(4):
            try:
                caption = await call_gemini(image_bytes)
                break
            except Exception as e:
                if attempt < 3 and ("429" in str(e) or "RESOURCE_EXHAUSTED" in str(e)):
                    wait = 2 ** attempt + 1
                    limiter.backoff(wait)
                    await asyncio.sleep(wait)
                    continue
                break

        if caption:
            if not args.dry_run:
                await update_clip_async(http, clip_id, caption)
            stats["ok"] += 1
        else:
            stats["fail"] += 1

        total = stats["ok"] + stats["fail"]
        if total % 50 == 0 and total > 0:
            elapsed = time.time() - stats["start"]
            rate = total / elapsed * 60 if elapsed > 0 else 0
            remaining = stats["total"] - total
            eta_min = remaining / rate if rate > 0 else 0
            print(f"[W{args.worker_id}] {stats['ok']} ok / {stats['fail']} fail "
                  f"| {rate:.0f}/min | {total}/{stats['total']} "
                  f"| ETA {eta_min:.0f}min")

    except Exception:
        stats["fail"] += 1
    finally:
        limiter.release()


async def main():
    clips = fetch_clips_sync()
    print(f"[W{args.worker_id}] {len(clips)} clips at offset {args.offset}, "
          f"concurrency={args.concurrency}")

    if not clips:
        print(f"[W{args.worker_id}] Nothing to do!")
        return

    if args.dry_run:
        for c in clips[:5]:
            print(f"  [dry-run] {c['s3_key'][-60:]}")
        print(f"\n  Would process {len(clips)} clips with Gemini turbo")
        return

    limiter = AdaptiveRateLimiter(args.concurrency)
    stats = {"ok": 0, "fail": 0, "total": len(clips), "start": time.time()}

    async with httpx.AsyncClient(timeout=30) as http:
        tasks = [process_clip(limiter, http, clip, stats) for clip in clips]
        await asyncio.gather(*tasks)

    elapsed = time.time() - stats["start"]
    rate = (stats["ok"] + stats["fail"]) / elapsed * 60 if elapsed > 0 else 0
    print(f"\n[W{args.worker_id}] Done. {stats['ok']} ok / {stats['fail']} fail "
          f"| {elapsed:.0f}s | {rate:.0f}/min")


if __name__ == "__main__":
    asyncio.run(main())
