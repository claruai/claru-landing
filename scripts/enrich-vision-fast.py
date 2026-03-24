#!/usr/bin/env python3
"""
Fast vision enrichment — extracts single frame via presigned URL (no full download).

Usage:
  python3 scripts/enrich-vision-fast.py --offset 0 --limit 10000 --provider gemini --worker-id 1
"""

import argparse
import base64
import os
import subprocess
import sys
import tempfile
import time

import boto3
import httpx

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
FAL_KEY = os.environ.get("FAL_KEY", "")
BUCKET = "moonvalley-annotation-platform"

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Missing env vars", file=sys.stderr)
    sys.exit(1)

parser = argparse.ArgumentParser()
parser.add_argument("--offset", type=int, default=0)
parser.add_argument("--limit", type=int, default=10000)
parser.add_argument("--provider", default="fal_gemini", choices=["gemini", "fal_gemini", "fal_gpt4o", "openai"])
parser.add_argument("--worker-id", type=str, default="0")
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()

s3 = boto3.client("s3", region_name="us-east-1")
http = httpx.Client(timeout=120)

PROMPT = """Describe this video frame in detail for a search index. Include:
- The environment/setting (indoor/outdoor, specific location type)
- People and their actions
- Key objects visible
- Camera perspective (first-person, overhead, etc.)
Keep it to 2-3 sentences. Be specific about the scene, not generic."""


def get_presigned_url(s3_key: str) -> str:
    return s3.generate_presigned_url("get_object", Params={"Bucket": BUCKET, "Key": s3_key}, ExpiresIn=300)


def extract_frame_from_url(presigned_url: str) -> str | None:
    """Extract single frame from presigned URL without downloading full video."""
    tf = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    tf.close()
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", presigned_url, "-frames:v", "1", "-q:v", "3", tf.name],
            capture_output=True, timeout=20,
        )
        if os.path.getsize(tf.name) > 100:
            return tf.name
        os.unlink(tf.name)
        return None
    except Exception:
        try:
            os.unlink(tf.name)
        except OSError:
            pass
        return None


def frame_to_data_url(frame_path: str) -> str:
    with open(frame_path, "rb") as f:
        return f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode()}"


def call_vision(data_url: str, provider: str) -> str | None:
    content = [
        {"type": "text", "text": PROMPT},
        {"type": "image_url", "image_url": {"url": data_url}},
    ]

    if provider == "gemini":
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        img_b64 = data_url.split(",")[1]
        resp = model.generate_content([PROMPT, {"mime_type": "image/jpeg", "data": base64.b64decode(img_b64)}])
        return resp.text.strip() if resp.text else None

    elif provider in ("fal_gemini", "fal_gpt4o"):
        model = "google/gemini-2.5-flash" if provider == "fal_gemini" else "openai/gpt-4o-mini"
        r = http.post(
            "https://fal.run/openrouter/router/openai/v1/chat/completions",
            headers={"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"},
            json={"model": model, "messages": [{"role": "user", "content": content}], "temperature": 0.3},
            timeout=60,
        )
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"].strip()
        return None

    elif provider == "openai":
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_KEY)
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": content}],
            temperature=0.3, max_tokens=300,
        )
        return resp.choices[0].message.content.strip() if resp.choices else None

    return None


def update_clip(clip_id: str, caption: str):
    http.patch(
        f"{SUPABASE_URL}/rest/v1/clips",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        params={"id": f"eq.{clip_id}"},
        json={"ai_caption": caption, "ai_enrichment_source": f"{args.provider}_frame", "caption_rebuilt_at": None},
    )


def main():
    # Fetch clips needing enrichment at this offset
    r = http.get(f"{SUPABASE_URL}/rest/v1/clips", headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
    }, params={
        "select": "id,s3_key",
        "s3_bucket": f"eq.{BUCKET}",
        "ai_caption": "is.null",
        "order": "s3_key.asc",
        "offset": str(args.offset),
        "limit": str(args.limit),
    })
    clips = r.json() if r.status_code == 200 else []
    print(f"[W{args.worker_id}] {len(clips)} clips at offset {args.offset}, provider={args.provider}")

    if args.dry_run:
        for c in clips[:3]:
            print(f"  [dry-run] {c['s3_key'][-50:]}")
        return

    ok = 0
    fail = 0
    for clip in clips:
        try:
            url = get_presigned_url(clip["s3_key"])
            frame_path = extract_frame_from_url(url)
            if not frame_path:
                fail += 1
                continue

            data_url = frame_to_data_url(frame_path)
            os.unlink(frame_path)

            caption = call_vision(data_url, args.provider)
            if caption:
                update_clip(clip["id"], caption)
                ok += 1
            else:
                fail += 1

            if ok % 10 == 0 and ok > 0:
                print(f"[W{args.worker_id}] {ok} ok / {fail} fail")

        except Exception as e:
            fail += 1

    print(f"[W{args.worker_id}] Done. {ok} ok / {fail} fail")


if __name__ == "__main__":
    main()
