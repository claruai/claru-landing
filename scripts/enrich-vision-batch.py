#!/usr/bin/env python3
"""
Gemini Batch API enrichment — submit ALL clips as a single batch job.

50% cheaper than sync API. Google processes in parallel, returns results
within ~24 hours (usually much faster).

Workflow:
  1. Fetch all clips needing enrichment
  2. Generate presigned URLs
  3. Write JSONL batch file
  4. Upload JSONL to Gemini File API
  5. Create batch job
  6. Poll for completion
  7. Download results and update clips

Usage:
  # Submit batch
  python3 scripts/enrich-vision-batch.py submit --limit 50000

  # Check status of running batch
  python3 scripts/enrich-vision-batch.py status --batch-name <name>

  # Download results and update DB
  python3 scripts/enrich-vision-batch.py apply --batch-name <name>
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
import time
from pathlib import Path

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

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
BUCKET = "moonvalley-annotation-platform"

PROMPT = """Describe this video in detail for a search index. Include:
- The environment/setting (indoor/outdoor, specific location type like kitchen, workshop, factory, street)
- People and their actions throughout the video (what they are doing, how they move)
- Key objects visible and how they're used
- Camera perspective (first-person/egocentric, overhead, third-person, etc.)
Write 2-4 sentences that capture what happens across the video. Be specific, not generic."""

# State file for tracking batch jobs
STATE_DIR = Path(__file__).parent / ".batch_state"


def get_client() -> genai.Client:
    return genai.Client(api_key=GEMINI_KEY)


def get_http() -> httpx.Client:
    return httpx.Client(timeout=60)


def fetch_clips(limit: int, offset: int = 0) -> list[dict]:
    """Fetch clips needing enrichment."""
    http = get_http()
    r = http.get(f"{SUPABASE_URL}/rest/v1/clips", headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }, params={
        "select": "id,s3_key",
        "s3_bucket": f"eq.{BUCKET}",
        "ai_caption": "is.null",
        "order": "s3_key.asc",
        "offset": str(offset),
        "limit": str(limit),
    })
    http.close()
    return r.json() if r.status_code == 200 else []


def cmd_submit(args):
    """Submit a batch of clips to Gemini Batch API."""
    if not GEMINI_KEY:
        print("Missing GEMINI_API_KEY", file=sys.stderr)
        sys.exit(1)

    clips = fetch_clips(args.limit, args.offset)
    print(f"Fetched {len(clips)} clips needing enrichment")

    if not clips:
        print("Nothing to do!")
        return

    s3 = boto3.client("s3", region_name="us-east-1")
    client = get_client()

    # Build JSONL — each line is a GenerateContentRequest keyed by clip ID
    print("Generating presigned URLs and building JSONL...")
    jsonl_path = tempfile.mktemp(suffix=".jsonl", prefix="gemini-batch-")

    with open(jsonl_path, "w") as f:
        for i, clip in enumerate(clips):
            url = s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": BUCKET, "Key": clip["s3_key"]},
                ExpiresIn=86400,  # 24 hours for batch processing
            )

            request = {
                "key": clip["id"],
                "request": {
                    "contents": [{
                        "parts": [
                            {
                                "file_data": {
                                    "file_uri": url,
                                    "mime_type": "video/mp4",
                                }
                            },
                            {"text": PROMPT},
                        ]
                    }],
                    "generation_config": {
                        "temperature": 0.3,
                        "max_output_tokens": 400,
                    },
                },
            }
            f.write(json.dumps(request) + "\n")

            if (i + 1) % 5000 == 0:
                print(f"  {i + 1}/{len(clips)} URLs generated")

    file_size = os.path.getsize(jsonl_path) / (1024 * 1024)
    print(f"JSONL ready: {jsonl_path} ({file_size:.1f} MB, {len(clips)} requests)")

    if args.dry_run:
        # Show first few lines
        with open(jsonl_path) as f:
            for _ in range(3):
                line = f.readline()
                parsed = json.loads(line)
                print(f"  key={parsed['key'][:8]}... url={parsed['request']['contents'][0]['parts'][0]['file_data']['file_uri'][:60]}...")
        os.unlink(jsonl_path)
        print(f"\n[dry-run] Would submit {len(clips)} clips to Gemini Batch API")
        return

    # Upload JSONL to Gemini File API
    print("Uploading JSONL to Gemini File API...")
    uploaded = client.files.upload(file=jsonl_path)
    print(f"Uploaded: {uploaded.name} ({uploaded.uri})")

    # Create batch job
    print("Creating batch job...")
    batch = client.batches.create(
        model="gemini-2.5-flash",
        src=uploaded.uri,
        config=types.CreateBatchJobConfig(
            display_name=f"clip-enrichment-{int(time.time())}",
        ),
    )
    print(f"Batch created: {batch.name}")
    print(f"State: {batch.state}")

    # Save state for later retrieval
    STATE_DIR.mkdir(exist_ok=True)
    state = {
        "batch_name": batch.name,
        "file_name": uploaded.name,
        "num_clips": len(clips),
        "clip_ids": [c["id"] for c in clips],
        "created_at": time.time(),
    }
    state_path = STATE_DIR / f"{batch.name.replace('/', '_')}.json"
    state_path.write_text(json.dumps(state, indent=2))

    os.unlink(jsonl_path)
    print(f"\nBatch submitted! Monitor with:")
    print(f"  python3 scripts/enrich-vision-batch.py status --batch-name {batch.name}")
    print(f"  python3 scripts/enrich-vision-batch.py apply --batch-name {batch.name}")


def cmd_status(args):
    """Check status of a batch job."""
    client = get_client()
    batch = client.batches.get(name=args.batch_name)
    print(f"Batch: {batch.name}")
    print(f"State: {batch.state}")
    if hasattr(batch, "metadata") and batch.metadata:
        print(f"Metadata: {batch.metadata}")


def cmd_apply(args):
    """Download batch results and update clips in DB."""
    client = get_client()

    # Check batch status
    batch = client.batches.get(name=args.batch_name)
    print(f"Batch: {batch.name} | State: {batch.state}")

    if str(batch.state) not in ("JOB_STATE_SUCCEEDED", "SUCCEEDED", "BatchJobState.JOB_STATE_SUCCEEDED"):
        print(f"Batch not complete yet. Current state: {batch.state}")
        return

    # Get results
    print("Fetching results...")
    http = get_http()

    ok = 0
    fail = 0

    for result in client.batches.list(name=args.batch_name):
        # Each result has key (clip_id) and response
        clip_id = result.key if hasattr(result, "key") else None
        if not clip_id:
            continue

        response = result.response if hasattr(result, "response") else None
        if not response:
            fail += 1
            continue

        # Extract caption text
        caption = None
        try:
            if hasattr(response, "candidates") and response.candidates:
                caption = response.candidates[0].content.parts[0].text.strip()
            elif hasattr(response, "text"):
                caption = response.text.strip()
        except Exception:
            pass

        if not caption:
            fail += 1
            continue

        # Update clip in DB
        if not args.dry_run:
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
                    "ai_enrichment_source": "gemini_video_batch",
                    "caption_rebuilt_at": None,
                },
            )
            if resp.status_code not in (200, 204):
                fail += 1
                continue

        ok += 1
        if ok % 100 == 0:
            print(f"  {ok} ok / {fail} fail")

    http.close()
    print(f"\nDone. {ok} ok / {fail} fail")


def cmd_list(args):
    """List all batch jobs."""
    client = get_client()
    for batch in client.batches.list():
        print(f"  {batch.name} | {batch.state}")


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")

    p_submit = sub.add_parser("submit", help="Submit batch job")
    p_submit.add_argument("--limit", type=int, default=50000)
    p_submit.add_argument("--offset", type=int, default=0)
    p_submit.add_argument("--dry-run", action="store_true")

    p_status = sub.add_parser("status", help="Check batch status")
    p_status.add_argument("--batch-name", required=True)

    p_apply = sub.add_parser("apply", help="Apply batch results")
    p_apply.add_argument("--batch-name", required=True)
    p_apply.add_argument("--dry-run", action="store_true")

    sub.add_parser("list", help="List batch jobs")

    args = parser.parse_args()

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Missing SUPABASE env vars", file=sys.stderr)
        sys.exit(1)

    if args.command == "submit":
        cmd_submit(args)
    elif args.command == "status":
        cmd_status(args)
    elif args.command == "apply":
        cmd_apply(args)
    elif args.command == "list":
        cmd_list(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
