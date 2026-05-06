#!/usr/bin/env python3
"""
Generate the 5 Workforce Wall keyframe stills + (later) idle looping clips.

The Wall sits below the hero on /partnerships and shows the breadth of
verticals Claru partners with. Five scenes, deliberately distinct from the
hero's 5 (cafe / packing / grocery / workshop / kitchen) — these are:

  01  textile_sewing       industrial sewing machine, fabric being guided
  02  mechanic_garage      car engine bay, wrench on a bolt
  03  farm_harvest         tomato vines, hand picking ripe fruit
  04  auto_assembly        car body on assembly line, torque wrench on door
  05  convenience_cashier  store counter, scanning a packaged item

Stage 1 generates the 5 stills. Stage 2 (run after approval) generates 5
idle ~5s loops on Seedance using image_url only (no end frame).
"""
import argparse
import os
import sys
import time
from pathlib import Path

import fal_client
import requests

ROOT = Path(__file__).resolve().parents[1]
OUT_STILLS = ROOT / "gtm" / "partnerships-wall" / "stills"
OUT_CLIPS = ROOT / "gtm" / "partnerships-wall" / "clips"
PUBLIC_STILLS = ROOT / "public" / "wall-stills"

# ─── Locked anchors (same as hero v8 — chest-cam POV with body realism) ────
LOCKED = (
    "Body-mounted POV camera attached to the CHEST of a standing worker "
    "(approximate height 5'10\", camera at sternum level). Camera angle "
    "tilted slightly downward (~10°) toward the workspace. 24mm wide-"
    "angle lens with realistic barrel distortion at the frame edges. The "
    "worker's hands enter from the BOTTOM EDGE of frame — never from the "
    "sides — at a natural arm's-reach distance from the wearer's body. "
    "The wearer's body is felt but never appears as a distinct figure. "
    "Composition is asymmetric and naturally caught — never centered, "
    "never posed. Cinematic desaturated grade, slightly cool shadows, "
    "Kodak Portra 800 fine grain. Authentic GoPro Hero or Meta Aria "
    "chest-mount work footage, NOT staged photography. ALL packaging, "
    "signage, products, tools, and vehicles are completely unbranded "
    "and unmarked — surfaces are plain and free of logos, text, or "
    "labels."
)

# ─── 5 wall scenes ───────────────────────────────────────────────────────────
STILLS = [
    {
        "id": "01_wall_textile_sewing",
        "title": "Textile & Garment",
        "prompt": (
            "Wide-angle 24mm GoPro camera image looking DOWN AND FORWARD "
            "at an industrial sewing machine on a textile workshop bench. "
            "Camera mounted at chest height, pointed slightly downward. "
            "IN THE FRAME: a heavy-duty industrial sewing machine in the "
            "lower-foreground with needle plate and presser foot, soft "
            "cotton fabric being guided through; both bare hands enter "
            "the BOTTOM EDGE of frame from below — left hand pinching the "
            "fabric edge to keep it taut, right hand guiding the fabric "
            "forward into the needle. Spools of unbranded thread on racks "
            "to the side, scissors and chalk on the workbench, blurred "
            "textile workshop with rolls of fabric in soft-focus "
            "background depth. Cool fluorescent overhead light. CRITICAL: "
            "NO third-person figure, NO body visible to the side. "
            "Composition is straight-on forward with hands from BELOW. "
            + LOCKED
        ),
    },
    {
        "id": "02_wall_mechanic_garage",
        "title": "Auto Mechanic",
        "prompt": (
            "Wide-angle 24mm GoPro camera image looking DOWN AND FORWARD "
            "at an open car engine bay in a residential auto shop. Camera "
            "mounted at chest height, pointed slightly downward. IN THE "
            "FRAME: an exposed engine block with valve cover, hoses, "
            "pulleys, and dipstick in the lower-foreground; both grease-"
            "stained bare hands enter the BOTTOM EDGE of frame from below "
            "— left hand bracing on the engine fender, right hand turning "
            "a chrome socket wrench on a bolt. Workshop pegboard with "
            "unbranded tools and oil rags in soft-focus background, "
            "fluorescent shop lighting with warm tungsten accents from a "
            "nearby work lamp. CRITICAL: NO third-person figure, no body "
            "to the side. Composition is straight-on with hands from "
            "BELOW. " + LOCKED
        ),
    },
    {
        "id": "03_wall_farm_harvest",
        "title": "Agriculture",
        "prompt": (
            "Wide-angle 24mm GoPro camera image looking DOWN AND FORWARD "
            "at a row of ripe tomato plants in an outdoor market garden. "
            "Camera mounted at chest height, pointed slightly downward. "
            "IN THE FRAME: green tomato vines in the lower-foreground "
            "heavy with clusters of bright red ripe tomatoes; both bare "
            "hands enter the BOTTOM EDGE of frame from below — left hand "
            "cradling a small green plastic produce basket already half-"
            "full of tomatoes, right hand reaching forward to pick a "
            "tomato from the vine. Long rows of plants receding into "
            "soft-focus background depth, blue sky overhead, warm golden-"
            "hour sunlight raking across the field. CRITICAL: NO third-"
            "person figure. Composition is straight-on with hands from "
            "BELOW. " + LOCKED
        ),
    },
    {
        "id": "04_wall_auto_assembly",
        "title": "Auto Assembly",
        "prompt": (
            "Wide-angle 24mm GoPro camera image looking DOWN AND FORWARD "
            "at a partially-assembled car body on an industrial assembly "
            "line. Camera mounted at chest height, pointed slightly "
            "downward. IN THE FRAME: a primer-grey unbranded car door "
            "panel mounted in a jig in the lower-foreground; both bare "
            "hands enter the BOTTOM EDGE of frame from below — left hand "
            "bracing the door panel, right hand operating a black "
            "pneumatic torque wrench on a bolt at the door hinge. Long "
            "assembly line track receding into soft-focus background "
            "depth with overhead conveyor and other car bodies in "
            "various stages of assembly, cool fluorescent industrial "
            "lighting. CRITICAL: NO third-person figure, no logos on "
            "any vehicle. Composition is straight-on with hands from "
            "BELOW. " + LOCKED
        ),
    },
    {
        "id": "05_wall_convenience_cashier",
        "title": "Retail Cashier",
        "prompt": (
            "Wide-angle 24mm GoPro camera image looking DOWN AND FORWARD "
            "at a convenience store checkout counter. Camera mounted at "
            "chest height, pointed slightly downward. IN THE FRAME: a "
            "black rubber checkout mat with a small unmarked plastic-"
            "wrapped snack product on the counter in the lower-"
            "foreground; both bare hands enter the BOTTOM EDGE of frame "
            "from below — left hand holding the snack over a generic "
            "barcode scanner, right hand pressing keys on an unbranded "
            "register screen. A customer's hand visible at the FAR LEFT "
            "edge of frame placing folded cash on the counter. Blurred "
            "shelves of unmarked snacks and beverages in soft-focus "
            "background depth, soft fluorescent overhead light. "
            "CRITICAL: NO third-person body visible to the side, only a "
            "hand at the far edge. Composition is straight-on with hands "
            "from BELOW. " + LOCKED
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


def _download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = requests.get(url, timeout=180)
    r.raise_for_status()
    dest.write_bytes(r.content)
    print(f"  saved → {dest.relative_to(ROOT)}  ({len(r.content)//1024} KB)")


def gen_stills() -> None:
    """Generate all 5 wall stills in parallel via Nano Banana 2 t2i @ 2K."""
    OUT_STILLS.mkdir(parents=True, exist_ok=True)
    PUBLIC_STILLS.mkdir(parents=True, exist_ok=True)

    print(f"[stills] generating 5 wall stills @ 2K (parallel)")
    handles = []
    for s in STILLS:
        h = fal_client.submit(
            "fal-ai/nano-banana-2",
            arguments={
                "prompt": s["prompt"],
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
        # also copy into public for the review page
        (PUBLIC_STILLS / f"{s['id']}.png").write_bytes(dest.read_bytes())


def gen_clips() -> None:
    """Generate 5 idle looping clips on Seedance using image_url only."""
    OUT_CLIPS.mkdir(parents=True, exist_ok=True)
    print(f"[clips] generating 5 idle wall clips on Seedance 2.0 (parallel)")

    motion_prompts = {
        "01_wall_textile_sewing": "Hands feeding fabric forward through an industrial sewing machine, gentle steady motion, needle moving up and down. Continuous shot, no cut, naturalistic GoPro chest-mount feel.",
        "02_wall_mechanic_garage": "Right hand turning a socket wrench on a bolt in an engine bay, slow steady rotation. Continuous shot, no cut, naturalistic GoPro chest-mount feel.",
        "03_wall_farm_harvest": "Right hand reaches forward and picks a ripe tomato from the vine, places it into the basket. Continuous shot, no cut, naturalistic GoPro chest-mount feel.",
        "04_wall_auto_assembly": "Right hand operates a torque wrench tightening a bolt on a car door panel, steady industrial motion. Continuous shot, no cut, naturalistic GoPro chest-mount feel.",
        "05_wall_convenience_cashier": "Left hand passes a snack over a barcode scanner, right hand presses register keys, customer hand places cash on counter. Continuous shot, no cut, naturalistic GoPro chest-mount feel.",
    }

    handles = []
    for s in STILLS:
        path = OUT_STILLS / f"{s['id']}.png"
        if not path.exists():
            sys.exit(f"ERROR: missing still {path} — run --stills first")
        url = fal_client.upload_file(str(path))
        h = fal_client.submit(
            "bytedance/seedance-2.0/image-to-video",
            arguments={
                "prompt": motion_prompts[s["id"]],
                "image_url": url,
                "duration": "5",
                "aspect_ratio": "16:9",
                "generate_audio": False,
            },
        )
        handles.append((s, h))
        print(f"  submitted {s['id']}")

    for s, h in handles:
        print(f"  waiting on {s['id']}…")
        result = h.get()
        url = result["video"]["url"]
        dest = OUT_CLIPS / f"{s['id']}.mp4"
        _download(url, dest)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--stills", action="store_true")
    p.add_argument("--clips", action="store_true")
    args = p.parse_args()
    _ensure_fal_key()
    if args.stills:
        gen_stills()
    if args.clips:
        gen_clips()


if __name__ == "__main__":
    main()
