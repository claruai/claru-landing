#!/usr/bin/env python3
"""
Re-enrich annotation-platform video_index entries by:
1. Downloading each video from S3
2. Extracting one keyframe via ffmpeg
3. Sending the frame to Gemini Flash Vision for a scene description
4. Re-embedding with OpenAI and updating the row

Usage:
  python3 scripts/re-enrich-annotation-frames.py [--limit 100] [--dry-run] [--concurrency 3]

Requires: Python 3.10+, boto3, openai, google-genai, Pillow
Also requires: ffmpeg binary on PATH
"""

import os, sys, json, time, subprocess, argparse, tempfile
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

# Check deps
try:
    import boto3
    from openai import OpenAI
    from google import genai
    import httpx
except ImportError as e:
    print(f"Missing dependency: {e}. Install: pip3 install boto3 openai google-genai httpx")
    sys.exit(1)

# Check ffmpeg
if subprocess.run(["which", "ffmpeg"], capture_output=True).returncode != 0:
    print("ffmpeg not found on PATH. Install: brew install ffmpeg")
    sys.exit(1)

# Env
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
OPENAI_KEY = os.environ.get("OPENAI_API_KEY")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, OPENAI_KEY, GEMINI_KEY]):
    print("Missing env vars. Source .env.local first.")
    sys.exit(1)

# Clients
s3 = boto3.client("s3", region_name=os.environ.get("AWS_REGION", "us-east-1"))
oai = OpenAI()
gclient = genai.Client(api_key=GEMINI_KEY)
http = httpx.Client(timeout=30)

# Args
parser = argparse.ArgumentParser()
parser.add_argument("--limit", type=int, default=None)
parser.add_argument("--dry-run", action="store_true")
parser.add_argument("--concurrency", type=int, default=3)
parser.add_argument("--key-gt", type=str, default=None, help="Only process s3_keys > this value (for range splitting)")
parser.add_argument("--key-lte", type=str, default=None, help="Only process s3_keys <= this value (for range splitting)")
parser.add_argument("--worker-id", type=str, default="0", help="Worker identifier for logging")
args = parser.parse_args()

BUCKET = "moonvalley-annotation-platform"
PROMPT = """Describe this video frame in 2-3 sentences for a search index. Include:
- The environment/setting (indoor home, kitchen, outdoor, office, etc.)
- What activity or task is happening
- Notable objects visible
- Camera perspective (first-person/egocentric, third-person, etc.)

Return ONLY a JSON object with: scene_summary (string), environments (string array), activities (string array), objects (string array), camera_perspective (string)"""


def extract_frame(video_path: str, output_path: str) -> bool:
    """Extract one frame at 10% duration using ffmpeg."""
    try:
        # Get duration
        probe = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", video_path],
            capture_output=True, text=True, timeout=10
        )
        duration = float(json.loads(probe.stdout).get("format", {}).get("duration", "5"))
        seek = max(0.5, duration * 0.1)

        subprocess.run(
            ["ffmpeg", "-y", "-ss", str(seek), "-i", video_path,
             "-frames:v", "1", "-q:v", "2", output_path],
            capture_output=True, timeout=30
        )
        return Path(output_path).exists() and Path(output_path).stat().st_size > 0
    except Exception:
        return False


def process_video(row: dict) -> dict:
    """Download video, extract frame, caption with Gemini, embed, update DB."""
    vid = row["id"]
    s3_key = row["s3_key"]
    fname = s3_key.split("/")[-1]

    with tempfile.TemporaryDirectory() as tmpdir:
        video_path = os.path.join(tmpdir, fname)
        frame_path = os.path.join(tmpdir, "frame.jpg")

        try:
            # Download
            s3.download_file(BUCKET, s3_key, video_path)
            size_mb = os.path.getsize(video_path) / 1024 / 1024

            # Extract frame
            if not extract_frame(video_path, frame_path):
                return {"id": vid, "status": "frame_failed"}

            # Upload frame to Gemini
            uploaded = gclient.files.upload(file=frame_path, config={"mime_type": "image/jpeg"})

            # Wait for active
            for _ in range(30):
                f = gclient.files.get(name=uploaded.name)
                if f.state.name == "ACTIVE":
                    break
                time.sleep(0.5)

            # Generate caption
            response = gclient.models.generate_content(
                model="gemini-2.5-flash",
                contents=[uploaded, PROMPT]
            )

            text = response.text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
            ctx = json.loads(text)

            # Clean up Gemini file
            try:
                gclient.files.delete(name=uploaded.name)
            except:
                pass

            # Embed
            emb_text = f"{ctx.get('scene_summary', '')}. Environments: {', '.join(ctx.get('environments', []))}. Activities: {', '.join(ctx.get('activities', []))}"
            emb_resp = oai.embeddings.create(model="text-embedding-3-small", input=emb_text, dimensions=768)
            embedding = emb_resp.data[0].embedding

            # Update video_index
            caption = ctx.get("scene_summary", "")
            update_body = {
                "caption_text": caption,
                "embedding": json.dumps(embedding),
                "enrichment_source": "gemini_frame",
            }

            resp = http.patch(
                f"{SUPABASE_URL}/rest/v1/video_index?id=eq.{vid}",
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
                json=update_body,
            )

            return {"id": vid, "status": "ok", "caption": caption[:60], "size_mb": round(size_mb, 1)}

        except Exception as e:
            return {"id": vid, "status": "error", "error": str(e)[:80]}


def main():
    print(f"[worker-{args.worker_id}] bucket={BUCKET} limit={args.limit or 'all'} dry_run={args.dry_run} concurrency={args.concurrency} key_gt={args.key_gt} key_lte={args.key_lte}")

    # Fetch video_index entries that still have sparse captions
    params = {
        "select": "id,s3_key,caption_text",
        "s3_bucket": f"eq.{BUCKET}",
        "enrichment_source": "eq.annotation_json",
        "order": "s3_key.asc",
    }
    if args.key_gt:
        params["s3_key"] = f"gt.{args.key_gt}"
    if args.key_lte:
        if "s3_key" in params:
            # Can't do both gt and lte in one param with PostgREST simple syntax
            # Use 'and' filter
            params.pop("s3_key")
            params["and"] = f"(s3_key.gt.{args.key_gt},s3_key.lte.{args.key_lte})"
        else:
            params["s3_key"] = f"lte.{args.key_lte}"
    if args.limit:
        params["limit"] = str(args.limit)
    else:
        params["limit"] = "20000"

    resp = http.get(
        f"{SUPABASE_URL}/rest/v1/video_index",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        },
        params=params,
    )
    rows = resp.json()
    print(f"[re-enrich] Found {len(rows)} entries to re-enrich")

    if args.dry_run:
        for r in rows[:5]:
            print(f"  [dry-run] {r['id'][:8]} | {r['s3_key'][-40:]} | caption: {r['caption_text'][:50]}")
        print(f"  ... and {len(rows) - 5} more")
        return

    ok = 0
    failed = 0

    with ThreadPoolExecutor(max_workers=args.concurrency) as pool:
        futures = {pool.submit(process_video, row): row for row in rows}
        for future in as_completed(futures):
            result = future.result()
            if result["status"] == "ok":
                ok += 1
                print(f"  [{result['id'][:8]}] ✓ ({result['size_mb']}MB) {result['caption']}")
            else:
                failed += 1
                print(f"  [{result['id'][:8]}] ✗ {result.get('error', result['status'])}")

            if (ok + failed) % 50 == 0:
                print(f"  [progress] {ok} ok / {failed} failed / {len(rows)} total")

            # Throttle to avoid DB IO exhaustion
            time.sleep(0.5)

    print(f"\n[re-enrich] Done. OK: {ok} / Failed: {failed} / Total: {len(rows)}")


if __name__ == "__main__":
    main()
