#!/usr/bin/env python3
"""
Generate the partnerships hero stills + time-warp clips.

Stages:
  --still-01           Generate only Still 01 (text-to-image, costs ~$0.04)
  --stills-02-06       Generate Stills 02-06 using Still 01 as reference (costs ~$0.40)
  --warps              Generate the 6 time-warp Kling clips (costs ~$2.52 on O3 Standard)
  --all                Run all three stages sequentially

Usage:
  python3 scripts/gen-partnerships-hero.py --still-01
"""
import argparse
import os
import sys
import time
from pathlib import Path

import fal_client  # type: ignore
import requests

ROOT = Path(__file__).resolve().parents[1]
OUT_STILLS = ROOT / "gtm" / "partnerships-hero" / "stills"
OUT_CLIPS = ROOT / "gtm" / "partnerships-hero" / "clips"

# ─── Locked anchors (v6: body-position realism) ──────────────────────────────
LOCKED = (
    "Body-mounted POV camera attached to the CHEST of a standing worker "
    "(approximate height 5'10\", camera at sternum level). Camera angle "
    "tilted slightly downward (~10°) toward the workspace. 24mm wide-angle "
    "lens with realistic barrel distortion at the frame edges. The "
    "worker's hands enter from the BOTTOM EDGE of frame — never from the "
    "sides — at a natural arm's-reach distance (40–60cm) from the wearer's "
    "body. Forearms angle inward toward the workspace. The wearer's apron "
    "fabric and clothing are visible only as texture along the very bottom "
    "edge of frame; the wearer's body is felt but never appears as a "
    "distinct figure. Composition is asymmetric and naturally caught — "
    "never centered, never posed. Cinematic desaturated grade, slightly "
    "cool shadows, Kodak Portra 800 fine grain, real-world lighting "
    "irregularities. Authentic GoPro Hero or Meta Aria chest-mount work "
    "footage, NOT staged photography. ALL packaging, signage, products, "
    "and tools are completely unbranded and unmarked — surfaces are plain "
    "and free of logos, text, or labels."
)

NEGATIVE = (
    "text, words, signage, logos, brand names, watermarks, captions, "
    "faces visible, hands entering from the sides of frame, third-person "
    "view, side-cam angle, posed photography, perfectly centered "
    "composition, distorted fingers, six fingers, extra limbs, "
    "oversaturated colors, fashion lighting, stock photography aesthetic"
)

# ─── 6 hero stills ───────────────────────────────────────────────────────────
STILLS = [
    {
        "id": "01_ego_coffee_handoff",
        "scene_prompt": (
            "Body stance: the worker stands behind a coffee bar, body "
            "facing across the counter toward a customer, leaning slightly "
            "forward, both arms reaching down and out from the chest. "
            "Scene: First-person view at the pickup bar of a small "
            "independent cafe. "
            "Composition: stainless steel coffee bar in the foreground, a "
            "hot white ceramic cup with fresh latte art passed across the "
            "counter, customer's outstretched hand reaching from the far "
            "edge of frame to receive the cup, espresso machine and "
            "blurred coworker in soft-focus background depth. "
            "Lighting: warm tungsten overhead mixed with cool daylight "
            "from a side window. "
            "Action: right hand offering the latte across the pickup "
            "counter toward the customer's hand, the customer's hand about "
            "to grasp the cup."
        ),
    },
    {
        "id": "02_ego_packing_center",
        "scene_prompt": (
            "Body stance: the worker stands directly facing a conveyor-"
            "belt packing station, arms extended forward and down to reach "
            "an open box on the belt in front of them. "
            "Scene: First-person view at a fulfillment-center packing "
            "station. "
            "Composition: an open unmarked brown cardboard box centered on "
            "a steel-roller conveyor belt, packing tape gun and label "
            "printer at frame edges, foam inserts inside the box, conveyor "
            "extending into blurred warehouse aisles in background depth. "
            "Lighting: cool fluorescent overhead, even and shadowless. "
            "Action: both hands entering from the bottom of frame, "
            "lowering a small unmarked product wrapped in bubble wrap into "
            "the open cardboard box."
        ),
    },
    {
        "id": "03_ego_grocery_walk",
        "scene_prompt": (
            "Body stance: the worker walks forward down the center of a "
            "supermarket aisle, both hands gripping a shopping cart handle "
            "directly in front of them. "
            "Scene: First-person view walking down a supermarket aisle. "
            "Composition: long aisle of stocked grocery shelves receding "
            "into depth on both sides, a metal shopping cart pushed forward "
            "in the lower-center of frame with the red cart handle gripped "
            "by both hands entering from the bottom of frame, polished "
            "tile floor with subtle ceiling light reflections. "
            "Lighting: bright fluorescent overhead, cool color temperature, "
            "mild lens flare. "
            "Action: both hands pushing the shopping cart forward down "
            "the aisle, gentle forward motion."
        ),
    },
    {
        "id": "04_ego_workshop_hammer",
        "scene_prompt": (
            "Body stance: the worker stands directly in front of a "
            "workbench, body squared to the bench, arms reaching forward "
            "and slightly down to the work surface; the right arm raises "
            "upward to swing a hammer. "
            "Scene: First-person view at a wooden workshop bench in a "
            "residential garage. "
            "Composition: thick pine plank centered on the bench, "
            "scattered nails and sawdust, unrolled tape measure and yellow "
            "carpenter pencil at frame edges, pegboard wall of hand tools "
            "in soft-focus background. NO power tools visible — only hand "
            "tools. "
            "Lighting: warm late-afternoon side light from a workshop "
            "window, dust motes catching the light. "
            "Action: left hand entering from the bottom of frame pinching "
            "a nail upright against the plank, right arm rising up from "
            "below frame holding a claw hammer above shoulder height."
        ),
    },
    {
        "id": "05_ego_kitchen_cook",
        "scene_prompt": (
            "Body stance: the worker stands at the restaurant kitchen "
            "line, body facing the prep counter and gas range, both arms "
            "extended forward and down to work the pan and spoon. "
            "Scene: First-person view at a restaurant kitchen line. "
            "Composition: stainless steel prep counter with a black cast-"
            "iron pan on a blue gas flame, sliced vegetables and "
            "shimmering oil mid-toss in the pan, plating area with white "
            "plates at left, blurred line cooks in background depth. "
            "Lighting: warm tungsten overhead with hot orange flame glow "
            "from below. "
            "Action: right hand entering from the bottom of frame "
            "gripping the cast-iron pan handle and tossing the vegetables "
            "mid-flip, left hand entering from the bottom of frame "
            "holding a wooden spoon ready."
        ),
    },
]

# ─── 6 time-warp clips (Kling first_frame + end_frame) ───────────────────────
# v5 motion prompt — tight, physical-camera-only, trusts the keyframes
_WARP_MOTION = (
    "POV chest-cam, rapid forward dolly, heavy motion blur, light streaks "
    "at frame edges. Handheld micro-shake. Continuous shot, no cut."
)

WARPS = [
    {"id": "w1_coffee_to_packing",   "first": "01_ego_coffee_handoff",  "end": "02_ego_packing_center",  "motion": _WARP_MOTION},
    {"id": "w2_packing_to_grocery",  "first": "02_ego_packing_center",  "end": "03_ego_grocery_walk",    "motion": _WARP_MOTION},
    {"id": "w3_grocery_to_workshop", "first": "03_ego_grocery_walk",    "end": "04_ego_workshop_hammer", "motion": _WARP_MOTION},
    {"id": "w4_workshop_to_kitchen", "first": "04_ego_workshop_hammer", "end": "05_ego_kitchen_cook",    "motion": _WARP_MOTION},
    {"id": "w5_kitchen_to_coffee",   "first": "05_ego_kitchen_cook",    "end": "01_ego_coffee_handoff",  "motion": _WARP_MOTION},
]


def _ensure_fal_key() -> None:
    """Prefer .env.local over shell env (shell may have a stale value)."""
    env_local = ROOT / ".env.local"
    if env_local.exists():
        for line in env_local.read_text().splitlines():
            if line.startswith("FAL_KEY="):
                os.environ["FAL_KEY"] = line.split("=", 1)[1].strip().strip('"').strip("'")
                break
    if not os.environ.get("FAL_KEY"):
        sys.exit("ERROR: FAL_KEY not set in env or .env.local")
    print(f"  using FAL_KEY: {os.environ['FAL_KEY'][:8]}…{os.environ['FAL_KEY'][-4:]} (len {len(os.environ['FAL_KEY'])})")


def _download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = requests.get(url, timeout=120)
    r.raise_for_status()
    dest.write_bytes(r.content)
    print(f"  saved → {dest.relative_to(ROOT)}")


def gen_still_01() -> Path:
    """Text-to-image with nano-banana-2 (Gemini 3.1 Flash Image)."""
    s = STILLS[0]
    full_prompt = f"{s['scene_prompt']} {LOCKED}"
    print(f"[stage 1] generating {s['id']} (text-to-image @ 2K)")
    print(f"  prompt: {full_prompt[:120]}…")
    t0 = time.time()
    result = fal_client.subscribe(
        "fal-ai/nano-banana-2",
        arguments={
            "prompt": full_prompt,
            "num_images": 1,
            "output_format": "png",
            "aspect_ratio": "16:9",
            "resolution": "2K",
        },
    )
    dt = time.time() - t0
    print(f"  done in {dt:.1f}s")
    url = result["images"][0]["url"]
    dest = OUT_STILLS / f"{s['id']}.png"
    _download(url, dest)
    return dest


def gen_stills_02_06(reference_path: Path) -> list[Path]:
    """Independent text-to-image for each subsequent scene at 2K.

    We DON'T chain from Still 01 because Nano Banana over-locks to the
    reference image's hand pose (e.g., "two hands meeting over a counter"
    propagates to every other scene). Per-scene t2i with the LOCKED style
    anchor in the prompt gives full latitude on hand action while keeping
    grade/lens/sleeve cues consistent.
    """
    print(f"[stage 2] generating Stills 02–N @ 2K (independent t2i, parallel)")

    paths: list[Path] = []
    handles = []
    for s in STILLS[1:]:
        full_prompt = f"{s['scene_prompt']} {LOCKED}"
        h = fal_client.submit(
            "fal-ai/nano-banana-2",
            arguments={
                "prompt": full_prompt,
                "num_images": 1,
                "output_format": "png",
                "aspect_ratio": "16:9",
                "resolution": "2K",
            },
        )
        handles.append((s, h))
        print(f"  submitted {s['id']}")

    for s, h in handles:
        result = h.get()
        url = result["images"][0]["url"]
        dest = OUT_STILLS / f"{s['id']}.png"
        _download(url, dest)
        paths.append(dest)
    return paths


def gen_warps() -> list[Path]:
    """Generate the 6 time-warp clips with Seedance 2.0."""
    print(f"[stage 3] generating 6 time-warp clips on Seedance 2.0 (parallel)")
    # upload all 6 stills first
    upload_urls: dict[str, str] = {}
    for s in STILLS:
        path = OUT_STILLS / f"{s['id']}.png"
        if not path.exists():
            sys.exit(f"ERROR: missing still {path}")
        url = fal_client.upload_file(str(path))
        upload_urls[s["id"]] = url
        print(f"  uploaded {s['id']}")

    handles = []
    for w in WARPS:
        h = fal_client.submit(
            "bytedance/seedance-2.0/image-to-video",
            arguments={
                "prompt": w["motion"],
                "image_url": upload_urls[w["first"]],
                "end_image_url": upload_urls[w["end"]],
                "duration": "5",
                "aspect_ratio": "16:9",
                "generate_audio": False,
            },
        )
        handles.append((w, h))
        print(f"  submitted {w['id']}")

    paths: list[Path] = []
    for w, h in handles:
        print(f"  waiting on {w['id']}…")
        result = h.get()
        url = result["video"]["url"]
        dest = OUT_CLIPS / f"{w['id']}.mp4"
        _download(url, dest)
        paths.append(dest)
    return paths


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--still-01", action="store_true")
    p.add_argument("--stills-02-06", action="store_true")
    p.add_argument("--warps", action="store_true")
    p.add_argument("--all", action="store_true")
    args = p.parse_args()

    _ensure_fal_key()

    if args.all or args.still_01:
        gen_still_01()
    if args.all or args.stills_02_06:
        ref = OUT_STILLS / f"{STILLS[0]['id']}.png"
        if not ref.exists():
            sys.exit("ERROR: still 01 missing — run --still-01 first")
        gen_stills_02_06(ref)
    if args.all or args.warps:
        gen_warps()


if __name__ == "__main__":
    main()
