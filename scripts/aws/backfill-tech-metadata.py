#!/usr/bin/env python3
"""
Backfill tech_* metadata columns by running ffprobe against S3 video files.

For each clip missing tech_resolution_width, generates a presigned S3 URL and
runs ffprobe to extract: width, height, fps, codec, file size, and bit depth.

Designed to run on an EC2 instance in us-east-1 (same region as the S3 bucket)
so presigned URL access is fast and free of egress costs.

Requires ffprobe to be installed on the system:
  sudo yum install -y ffmpeg   # Amazon Linux 2023
  sudo apt install -y ffmpeg   # Ubuntu/Debian

Usage:
  python3 backfill-tech-metadata.py [--dry-run] [--limit 5000] [--workers 16] [--batch-size 200]

Env vars:
  SUPABASE_URL            - Supabase project URL
  SUPABASE_SERVICE_KEY    - Supabase service role key
  AWS_ACCESS_KEY_ID       - (optional if using IAM role)
  AWS_SECRET_ACCESS_KEY   - (optional if using IAM role)
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from fractions import Fraction
from typing import Any

import boto3
from supabase import create_client, Client

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("backfill-tech-metadata")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
BUCKET = "moonvalley-annotation-platform"
DATASET_ID = "eb07cf5b-55b1-45ec-a513-65b9e78956de"  # egocentric dataset

# Presigned URLs valid for 1 hour (ffprobe only reads headers, so this is generous)
PRESIGN_EXPIRY = 3600

if not SUPABASE_URL or not SUPABASE_KEY:
    log.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars.")
    sys.exit(1)


def check_ffprobe() -> str:
    """Verify ffprobe is installed and return its path."""
    path = shutil.which("ffprobe")
    if not path:
        log.error(
            "ffprobe not found. Install it: sudo yum install -y ffmpeg (AL2023) "
            "or sudo apt install -y ffmpeg (Debian/Ubuntu)"
        )
        sys.exit(1)
    return path


# ---------------------------------------------------------------------------
# Supabase helpers
# ---------------------------------------------------------------------------


def create_supabase_client() -> Client:
    """Create a Supabase client with the service role key."""
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_clips_batch(
    sb: Client,
    batch_size: int,
    offset: int,
) -> list[dict]:
    """Fetch clips in the egocentric dataset that are missing tech metadata.

    Uses an RPC call to join clips with dataset_clips, filtering to only
    clips in the egocentric dataset where tech_resolution_width IS NULL.
    """
    # PostgREST can query with a foreign table filter via the join syntax.
    # We query clips that appear in dataset_clips for the egocentric dataset.
    resp = (
        sb.table("clips")
        .select("id, s3_key, s3_bucket, dataset_clips!inner(dataset_id)")
        .eq("dataset_clips.dataset_id", DATASET_ID)
        .is_("tech_resolution_width", "null")
        .not_.is_("s3_key", "null")
        .order("created_at")
        .range(offset, offset + batch_size - 1)
        .execute()
    )
    return resp.data or []


def update_clip(sb: Client, clip_id: str, payload: dict[str, Any]) -> bool:
    """Update a single clip row. Returns True on success."""
    try:
        sb.table("clips").update(payload).eq("id", clip_id).execute()
        return True
    except Exception as exc:
        log.warning("Failed to update clip %s: %s", clip_id[:12], exc)
        return False


# ---------------------------------------------------------------------------
# S3 helpers
# ---------------------------------------------------------------------------


def create_s3_client() -> Any:
    """Create a boto3 S3 client for presigned URL generation."""
    return boto3.client("s3", region_name="us-east-1")


def generate_presigned_url(s3_client: Any, key: str, bucket: str = BUCKET) -> str | None:
    """Generate a presigned GET URL for the S3 object."""
    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": key},
            ExpiresIn=PRESIGN_EXPIRY,
        )
        return url
    except Exception as exc:
        log.warning("Failed to generate presigned URL for %s: %s", key[:80], exc)
        return None


def get_file_size(s3_client: Any, key: str, bucket: str = BUCKET) -> int | None:
    """Get the file size from S3 object metadata (HEAD request, no download)."""
    try:
        resp = s3_client.head_object(Bucket=bucket, Key=key)
        return resp.get("ContentLength")
    except Exception:
        return None


# ---------------------------------------------------------------------------
# ffprobe
# ---------------------------------------------------------------------------


def run_ffprobe(url: str, ffprobe_path: str) -> dict | None:
    """Run ffprobe on a URL and return parsed JSON output.

    ffprobe reads only the container headers, so it needs minimal data
    even for large files. The presigned URL lets ffprobe do a range request.
    """
    cmd = [
        ffprobe_path,
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        url,
    ]
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode != 0:
            log.debug("ffprobe failed (rc=%d): %s", result.returncode, result.stderr[:200])
            return None
        return json.loads(result.stdout)
    except subprocess.TimeoutExpired:
        log.debug("ffprobe timed out for URL")
        return None
    except (json.JSONDecodeError, OSError) as exc:
        log.debug("ffprobe parse error: %s", exc)
        return None


def extract_tech_metadata(probe: dict) -> dict[str, Any]:
    """Extract technical metadata from ffprobe JSON output.

    Returns a dict with keys matching the clips table columns:
      tech_resolution_width, tech_resolution_height, tech_fps,
      tech_codec, tech_bit_depth
    """
    result: dict[str, Any] = {}

    # Find the video stream (first one)
    video_stream: dict | None = None
    for stream in probe.get("streams", []):
        if stream.get("codec_type") == "video":
            video_stream = stream
            break

    if not video_stream:
        return result

    # Resolution
    width = video_stream.get("width")
    height = video_stream.get("height")
    if width is not None:
        result["tech_resolution_width"] = int(width)
    if height is not None:
        result["tech_resolution_height"] = int(height)

    # FPS from r_frame_rate (e.g., "30/1", "30000/1001")
    r_frame_rate = video_stream.get("r_frame_rate")
    if r_frame_rate and r_frame_rate != "0/0":
        try:
            fps_fraction = Fraction(r_frame_rate)
            fps_float = round(float(fps_fraction), 3)
            if 0 < fps_float < 1000:  # sanity check
                result["tech_fps"] = fps_float
        except (ValueError, ZeroDivisionError):
            pass

    # Codec
    codec_name = video_stream.get("codec_name")
    if codec_name:
        result["tech_codec"] = codec_name

    # Bit depth
    bit_depth = video_stream.get("bits_per_raw_sample")
    if bit_depth:
        try:
            result["tech_bit_depth"] = int(bit_depth)
        except (ValueError, TypeError):
            pass

    # Duration from format (more reliable than stream duration)
    fmt = probe.get("format", {})
    duration_str = fmt.get("duration")
    if duration_str:
        try:
            duration = float(duration_str)
            if 0 < duration < 86400:  # sanity: < 24 hours
                result["tech_duration_seconds"] = round(duration, 3)
        except (ValueError, TypeError):
            pass

    return result


# ---------------------------------------------------------------------------
# Worker
# ---------------------------------------------------------------------------


def process_clip(
    s3_client: Any,
    sb: Client,
    clip: dict,
    ffprobe_path: str,
    dry_run: bool,
) -> tuple[str, bool, str]:
    """Process a single clip: presign URL, ffprobe, write metadata.

    Returns (clip_id, success, message).
    """
    clip_id: str = clip["id"]
    s3_key: str = clip["s3_key"]
    bucket: str = clip.get("s3_bucket") or BUCKET

    # Generate presigned URL
    url = generate_presigned_url(s3_client, s3_key, bucket)
    if not url:
        return (clip_id, False, "presign_failed")

    # Run ffprobe
    probe = run_ffprobe(url, ffprobe_path)
    if not probe:
        return (clip_id, False, "ffprobe_failed")

    # Extract metadata
    metadata = extract_tech_metadata(probe)
    if not metadata:
        return (clip_id, False, "no_video_stream")

    # Get file size via HEAD (cheap, no download)
    file_size = get_file_size(s3_client, s3_key, bucket)
    if file_size is not None:
        metadata["tech_file_size_bytes"] = file_size

    if dry_run:
        return (clip_id, True, f"dry_run {metadata}")

    # Write to database
    success = update_clip(sb, clip_id, metadata)
    if success:
        dims = f"{metadata.get('tech_resolution_width', '?')}x{metadata.get('tech_resolution_height', '?')}"
        return (clip_id, True, f"updated {dims}")
    return (clip_id, False, "db_update_failed")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Backfill tech_* metadata via ffprobe on S3 videos"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview what would be done without writing to the database",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Maximum number of clips to process (0 = all)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=16,
        help="Number of parallel workers (default: 16)",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=200,
        help="Number of clips to fetch per batch (default: 200)",
    )
    args = parser.parse_args()

    ffprobe_path = check_ffprobe()
    log.info("Using ffprobe at: %s", ffprobe_path)
    log.info(
        "Starting backfill: limit=%s, workers=%d, batch_size=%d, dry_run=%s, dataset=%s",
        args.limit or "all",
        args.workers,
        args.batch_size,
        args.dry_run,
        DATASET_ID,
    )

    sb = create_supabase_client()
    s3 = create_s3_client()

    total_processed = 0
    total_success = 0
    total_failed = 0
    start_time = time.monotonic()

    try:
        while True:
            # Check limit
            remaining = args.limit - total_processed if args.limit > 0 else args.batch_size
            if args.limit > 0 and total_processed >= args.limit:
                log.info("Reached limit of %d clips.", args.limit)
                break

            fetch_size = min(args.batch_size, remaining) if args.limit > 0 else args.batch_size

            # Fetch batch -- always offset=0 because processed clips no longer
            # match the WHERE clause (tech_resolution_width IS NULL)
            clips = fetch_clips_batch(sb, fetch_size, offset=0)
            if not clips:
                log.info("No more clips to process.")
                break

            log.info("Fetched %d clips (total processed so far: %d)", len(clips), total_processed)

            # Process in parallel
            with ThreadPoolExecutor(max_workers=args.workers) as executor:
                futures = {
                    executor.submit(
                        process_clip, s3, sb, clip, ffprobe_path, args.dry_run
                    ): clip["id"]
                    for clip in clips
                }

                batch_success = 0
                batch_failed = 0

                for future in as_completed(futures):
                    clip_id = futures[future]
                    try:
                        _cid, success, message = future.result()
                        if success:
                            batch_success += 1
                        else:
                            batch_failed += 1
                            if batch_failed <= 5:
                                log.warning(
                                    "Clip %s failed: %s", clip_id[:12], message
                                )
                    except Exception as exc:
                        log.error(
                            "Unhandled error for clip %s: %s", clip_id[:12], exc
                        )
                        batch_failed += 1

            total_success += batch_success
            total_failed += batch_failed
            total_processed += len(clips)

            # Progress logging every 500 clips
            if total_processed % 500 < args.batch_size:
                elapsed = time.monotonic() - start_time
                rate = total_processed / elapsed if elapsed > 0 else 0
                log.info(
                    "Progress: %d processed, %d success, %d failed | %.1f clips/sec | %.1fs elapsed",
                    total_processed,
                    total_success,
                    total_failed,
                    rate,
                    elapsed,
                )

            # Small pause between batches
            time.sleep(0.1)

    except KeyboardInterrupt:
        log.info("Interrupted by user.")

    elapsed = time.monotonic() - start_time
    log.info(
        "Done. Processed: %d, Success: %d, Failed: %d | Total time: %.1fs (%.1f clips/sec)",
        total_processed,
        total_success,
        total_failed,
        elapsed,
        total_processed / elapsed if elapsed > 0 else 0,
    )


if __name__ == "__main__":
    main()
