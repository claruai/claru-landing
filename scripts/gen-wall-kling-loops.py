#!/usr/bin/env python3
"""
Regenerate the 5 Workforce Wall idle clips on Kling V3 Pro with same
first+last frame so they loop seamlessly.

Strategy: pass each still as BOTH image_url and end_image_url. Kling
interpolates a 5s clip that begins and ends at the same visual state, so
the loop has no visible cut. Motion prompt is the action that happens
between start and end.
"""
import os
import sys
import time
from pathlib import Path

import fal_client
import requests

ROOT = Path(__file__).resolve().parents[1]
STILLS = ROOT / "gtm" / "partnerships-wall" / "stills"
OUT_CLIPS = ROOT / "gtm" / "partnerships-wall" / "clips-kling"
PUBLIC_CLIPS = ROOT / "public" / "videos" / "wall"

TILES = [
    {
        "id": "01_wall_textile_sewing",
        "motion": (
            "Hands feed soft cotton fabric forward through an industrial "
            "sewing machine, gentle steady motion, sewing-machine needle "
            "moves up and down rapidly. The hands and fabric end the clip "
            "in the same starting position. Continuous shot, no cut, "
            "naturalistic GoPro chest-mount feel."
        ),
    },
    {
        "id": "02_wall_mechanic_garage",
        "motion": (
            "Right hand turns a chrome socket wrench on a bolt in an open "
            "engine bay, slow steady rotation, completes one full rotation "
            "and returns to starting position. Left hand stays braced on "
            "the engine fender. Continuous shot, no cut, naturalistic "
            "GoPro chest-mount feel."
        ),
    },
    {
        "id": "03_wall_farm_harvest",
        "motion": (
            "Right hand reaches forward to the tomato vine, picks a single "
            "ripe tomato, and places it gently into the green basket cradled "
            "by the left hand, then the right hand returns to starting "
            "position. Continuous shot, no cut, naturalistic GoPro chest-"
            "mount feel."
        ),
    },
    {
        "id": "04_wall_auto_assembly",
        "motion": (
            "Right hand operates a black pneumatic torque wrench tightening "
            "a bolt on a car door panel, brief rapid rotation with subtle "
            "vibration, returns to starting position. Left hand stays "
            "braced on the door panel. Continuous shot, no cut, "
            "naturalistic GoPro chest-mount feel."
        ),
    },
    {
        "id": "05_wall_convenience_cashier",
        "motion": (
            "Left hand passes a small snack package over a barcode scanner "
            "(brief red scanner glow), right hand presses two keys on the "
            "register screen, both hands return to starting positions. "
            "Customer hand at the far edge stays still. Continuous shot, "
            "no cut, naturalistic GoPro chest-mount feel."
        ),
    },
]


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


def main() -> None:
    _ensure_fal_key()
    OUT_CLIPS.mkdir(parents=True, exist_ok=True)
    PUBLIC_CLIPS.mkdir(parents=True, exist_ok=True)

    print(f"[wall-kling-loops] generating 5 looping wall clips on Kling V3 Pro")
    handles = []
    for t in TILES:
        path = STILLS / f"{t['id']}.png"
        if not path.exists():
            sys.exit(f"ERROR: missing still {path}")
        url = fal_client.upload_file(str(path))
        h = fal_client.submit(
            "fal-ai/kling-video/v3/pro/image-to-video",
            arguments={
                "prompt": t["motion"],
                "image_url": url,        # first frame
                "end_image_url": url,    # SAME image for seamless loop
                "duration": "5",
                "aspect_ratio": "16:9",
                "generate_audio": False,
                "negative_prompt": (
                    "text, logos, brand names, watermarks, faces, "
                    "distorted hands, six fingers, oversaturated colors, "
                    "abrupt cuts, jump cuts"
                ),
            },
        )
        handles.append((t, h))
        print(f"  submitted {t['id']}")

    for t, h in handles:
        print(f"  waiting on {t['id']}…")
        result = h.get()
        url = result["video"]["url"]
        dest = OUT_CLIPS / f"{t['id']}.mp4"
        img = requests.get(url, timeout=180).content
        dest.write_bytes(img)
        # also copy into public/videos/wall (overwrites Seedance versions)
        (PUBLIC_CLIPS / f"{t['id']}.mp4").write_bytes(img)
        print(f"    saved {dest.name} ({len(img)//1024} KB)")


if __name__ == "__main__":
    main()
