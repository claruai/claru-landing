#!/usr/bin/env python3
"""
Turbo vision enrichment — async multi-provider parallel processing.

Spreads requests across 4 independent API endpoints for maximum throughput:
  1. Gemini direct (GEMINI_API_KEY)
  2. FAL → Gemini 2.5 Flash (FAL_KEY)
  3. FAL → GPT-4o-mini (FAL_KEY)
  4. OpenAI direct (OPENAI_API_KEY)

Each provider has independent rate limits, so using all 4 multiplies throughput.
Clips are round-robin distributed across available providers.

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
OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
FAL_KEY = os.environ.get("FAL_KEY", "")
BUCKET = "moonvalley-annotation-platform"

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Missing SUPABASE env vars", file=sys.stderr)
    sys.exit(1)

parser = argparse.ArgumentParser()
parser.add_argument("--offset", type=int, default=0)
parser.add_argument("--limit", type=int, default=10000)
parser.add_argument("--concurrency", type=int, default=20,
                    help="Max concurrent requests PER PROVIDER (default 20)")
parser.add_argument("--worker-id", type=str, default="0")
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()

s3 = boto3.client("s3", region_name="us-east-1")

PROMPT = """Describe this video frame in detail for a search index. Include:
- The environment/setting (indoor/outdoor, specific location type like kitchen, workshop, factory, street)
- People and their actions
- Key objects visible and how they're used
- Camera perspective (first-person/egocentric, overhead, third-person, etc.)
Keep it to 2-3 sentences. Be specific about the scene, not generic."""


# ---------------------------------------------------------------------------
# Providers
# ---------------------------------------------------------------------------

class Provider:
    """Base class for vision API providers."""
    name: str
    source_tag: str

    async def describe(self, image_bytes: bytes) -> str | None:
        raise NotImplementedError


class GeminiDirect(Provider):
    name = "gemini"
    source_tag = "gemini_turbo"

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_KEY)

    async def describe(self, image_bytes: bytes) -> str | None:
        response = await asyncio.to_thread(
            self.client.models.generate_content,
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
        return response.text.strip() if response.text else None


class FALProvider(Provider):
    """FAL OpenRouter — routes to different models."""

    def __init__(self, model: str, name: str, source_tag: str):
        self.model = model
        self.name = name
        self.source_tag = source_tag
        self.http = httpx.AsyncClient(timeout=90)

    async def describe(self, image_bytes: bytes) -> str | None:
        data_url = f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode()}"
        content = [
            {"type": "text", "text": PROMPT},
            {"type": "image_url", "image_url": {"url": data_url}},
        ]
        resp = await self.http.post(
            "https://fal.run/openrouter/router/openai/v1/chat/completions",
            headers={"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"},
            json={"model": self.model, "messages": [{"role": "user", "content": content}], "temperature": 0.3},
        )
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
        if resp.status_code == 429:
            raise Exception("429 rate limited")
        return None


class OpenAIDirect(Provider):
    name = "openai"
    source_tag = "gpt4o_mini_turbo"

    def __init__(self):
        from openai import AsyncOpenAI
        self.client = AsyncOpenAI(api_key=OPENAI_KEY)

    async def describe(self, image_bytes: bytes) -> str | None:
        data_url = f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode()}"
        content = [
            {"type": "text", "text": PROMPT},
            {"type": "image_url", "image_url": {"url": data_url}},
        ]
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": content}],
            temperature=0.3,
            max_tokens=300,
        )
        return response.choices[0].message.content.strip() if response.choices else None


def build_providers() -> list[Provider]:
    """Build list of available providers based on env vars."""
    providers: list[Provider] = []
    if GEMINI_KEY:
        providers.append(GeminiDirect())
    if FAL_KEY:
        providers.append(FALProvider("google/gemini-2.5-flash", "fal_gemini", "gemini_fal_turbo"))
        providers.append(FALProvider("openai/gpt-4o-mini", "fal_gpt4o", "gpt4o_mini_fal_turbo"))
    if OPENAI_KEY:
        providers.append(OpenAIDirect())
    return providers


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
                break

    return all_clips


def extract_frame(presigned_url: str) -> bytes | None:
    """Extract single frame via ffmpeg from presigned URL. Returns JPEG bytes."""
    tf = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    tf.close()
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", presigned_url, "-frames:v", "1", "-q:v", "3", tf.name],
            capture_output=True, timeout=25,
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


async def update_clip_async(http: httpx.AsyncClient, clip_id: str, caption: str, source_tag: str):
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
            "ai_enrichment_source": source_tag,
            "caption_rebuilt_at": None,
        },
    )


# ---------------------------------------------------------------------------
# Rate limiter (per provider)
# ---------------------------------------------------------------------------

class AdaptiveRateLimiter:
    """Per-provider semaphore with backoff."""

    def __init__(self, initial: int):
        self.sem = asyncio.Semaphore(initial)
        self.backoff_until = 0.0

    async def acquire(self):
        await self.sem.acquire()
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
    provider: Provider,
    stats: dict,
):
    """Process a single clip with a specific provider."""
    await limiter.acquire()
    try:
        clip_id = clip["id"]
        s3_key = clip["s3_key"]

        # Step 1: Extract frame
        url = get_presigned_url(s3_key)
        image_bytes = await asyncio.to_thread(extract_frame, url)
        if not image_bytes:
            stats["fail"] += 1
            return

        # Step 2: Call provider with retries
        caption = None
        for attempt in range(4):
            try:
                caption = await provider.describe(image_bytes)
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
                await update_clip_async(http, clip_id, caption, provider.source_tag)
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
    providers = build_providers()
    if not providers:
        print("No API keys available! Set GEMINI_API_KEY, FAL_KEY, or OPENAI_API_KEY", file=sys.stderr)
        sys.exit(1)

    clips = fetch_clips_sync()
    print(f"[W{args.worker_id}] {len(clips)} clips at offset {args.offset}, "
          f"concurrency={args.concurrency}/provider, "
          f"providers={[p.name for p in providers]} ({len(providers)}x parallel)")

    if not clips:
        print(f"[W{args.worker_id}] Nothing to do!")
        return

    if args.dry_run:
        for c in clips[:5]:
            print(f"  [dry-run] {c['s3_key'][-60:]}")
        print(f"\n  Would process {len(clips)} clips across {len(providers)} providers")
        return

    # Each provider gets its own rate limiter
    limiters = {p.name: AdaptiveRateLimiter(args.concurrency) for p in providers}
    stats = {"ok": 0, "fail": 0, "total": len(clips), "start": time.time()}

    async with httpx.AsyncClient(timeout=30) as http:
        tasks = []
        for i, clip in enumerate(clips):
            provider = providers[i % len(providers)]
            limiter = limiters[provider.name]
            tasks.append(process_clip(limiter, http, clip, provider, stats))
        await asyncio.gather(*tasks)

    elapsed = time.time() - stats["start"]
    rate = (stats["ok"] + stats["fail"]) / elapsed * 60 if elapsed > 0 else 0
    print(f"\n[W{args.worker_id}] Done. {stats['ok']} ok / {stats['fail']} fail "
          f"| {elapsed:.0f}s | {rate:.0f}/min")


if __name__ == "__main__":
    asyncio.run(main())
