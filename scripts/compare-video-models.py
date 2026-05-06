#!/usr/bin/env python3
"""
3-way model comparison for the partnerships hero time-warp.

Runs the SAME transition (cafe -> factory) on three different fal.ai
image-to-video models in parallel, then saves all three outputs side-by-side
for visual A/B/C review.

Models:
  - Kling V3 Pro    fal-ai/kling-video/v3/pro/image-to-video
  - Kling O3 Std    fal-ai/kling-video/o3/standard/image-to-video
  - Seedance 2.0    fal-ai/bytedance/seedance-2.0/image-to-video

Usage:
  python3 scripts/compare-video-models.py
"""
import os
import sys
import time
from pathlib import Path

import fal_client
import requests

ROOT = Path(__file__).resolve().parents[1]
STILLS = ROOT / "gtm" / "partnerships-hero" / "stills"
OUT = ROOT / "gtm" / "partnerships-hero" / "clips" / "compare"
OUT.mkdir(parents=True, exist_ok=True)

START_IMG = STILLS / "01_ego_cafe.png"
END_IMG = STILLS / "02_ego_factory.png"

MOTION_PROMPT = (
    "Egocentric chest-cam POV: the wearer's hands continue tamping espresso "
    "for one second with natural micro-shake from the chest mount, then the "
    "camera accelerates forward through the espresso bar, environment streaks "
    "into a radial tunnel of motion blur and trailing light streaks, dissolves "
    "into a clean factory assembly bench where the wearer's hands enter from "
    "below to place an electronic component on a green PCB. Continuous shot, "
    "no cut, naturalistic GoPro chest-mount handheld feel with subtle "
    "vibration."
)

NEGATIVE = (
    "text, words, signage, logos, brand names, watermarks, faces, distorted "
    "hands, six fingers, extra limbs, oversaturated colors"
)


def _ensure_fal_key() -> None:
    el = ROOT / ".env.local"
    if el.exists():
        for line in el.read_text().splitlines():
            if line.startswith("FAL_KEY="):
                os.environ["FAL_KEY"] = line.split("=", 1)[1].strip().strip('"').strip("'")
                break
    if not os.environ.get("FAL_KEY"):
        sys.exit("ERROR: FAL_KEY not set")
    print(f"  using FAL_KEY: {os.environ['FAL_KEY'][:8]}…{os.environ['FAL_KEY'][-4:]}")


def _download(url: str, dest: Path) -> None:
    r = requests.get(url, timeout=180)
    r.raise_for_status()
    dest.write_bytes(r.content)
    print(f"  saved → {dest.relative_to(ROOT)}  ({len(r.content)//1024} KB)")


def main() -> None:
    _ensure_fal_key()

    if not START_IMG.exists() or not END_IMG.exists():
        sys.exit(f"ERROR: missing keyframes {START_IMG} / {END_IMG}")

    print("uploading keyframes...")
    start_url = fal_client.upload_file(str(START_IMG))
    end_url = fal_client.upload_file(str(END_IMG))
    print(f"  start: {start_url[:70]}…")
    print(f"  end:   {end_url[:70]}…")

    submissions = [
        # 1) Kling V3 Pro
        (
            "kling_v3_pro",
            "fal-ai/kling-video/v3/pro/image-to-video",
            {
                "prompt": MOTION_PROMPT,
                "image_url": start_url,
                "end_image_url": end_url,
                "duration": "5",
                "aspect_ratio": "16:9",
                "generate_audio": False,
                "negative_prompt": NEGATIVE,
            },
        ),
        # 2) Kling O3 Standard
        (
            "kling_o3_std",
            "fal-ai/kling-video/o3/standard/image-to-video",
            {
                "prompt": MOTION_PROMPT,
                "image_url": start_url,
                "end_image_url": end_url,
                "duration": "5",
                "aspect_ratio": "16:9",
                "generate_audio": False,
                "negative_prompt": NEGATIVE,
            },
        ),
        # 3) Seedance 2.0
        (
            "seedance_2_0",
            "fal-ai/bytedance/seedance-2.0/image-to-video",
            {
                "prompt": MOTION_PROMPT,
                "image_url": start_url,
                "end_image_url": end_url,
                "duration": "5",
                "aspect_ratio": "16:9",
                "generate_audio": False,
            },
        ),
    ]

    handles = []
    for name, endpoint, args in submissions:
        try:
            t0 = time.time()
            h = fal_client.submit(endpoint, arguments=args)
            handles.append((name, endpoint, h, t0))
            print(f"  submitted {name:14s}  endpoint={endpoint}")
        except Exception as e:
            print(f"  FAILED to submit {name}: {e}")
            handles.append((name, endpoint, None, t0))

    for name, endpoint, h, t0 in handles:
        if h is None:
            print(f"  {name:14s}  SKIPPED (submit failed)")
            continue
        print(f"  waiting on {name}…")
        try:
            result = h.get()
            dt = time.time() - t0
            # Different models return different shapes
            video_url = None
            if isinstance(result, dict):
                if "video" in result and isinstance(result["video"], dict):
                    video_url = result["video"].get("url")
                elif "videos" in result and result["videos"]:
                    v = result["videos"][0]
                    video_url = v.get("url") if isinstance(v, dict) else None
                elif "url" in result:
                    video_url = result["url"]
            if not video_url:
                print(f"  {name:14s}  FAILED — no video url in result: {result!r}")
                continue
            dest = OUT / f"{name}.mp4"
            _download(video_url, dest)
            print(f"  {name:14s}  done in {dt:.0f}s")
        except Exception as e:
            print(f"  {name:14s}  FAILED: {e}")


if __name__ == "__main__":
    main()
