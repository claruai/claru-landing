#!/usr/bin/env python3
"""
Generate the 6 cinematic 2K hero stills + 5s looping clips for the
HowItWorks section on /partnerships.

Stage 1 — `--stills`: 6 stills via Nano Banana 2 (t2i @ 2K, 16:9), parallel.
Stage 2 — `--clips` : 6 i2v clips via Seedance 2.0 (5s, 16:9, no audio), parallel.
Stage 3 — `--all`   : run both sequentially.

Outputs:
  gtm/howitworks/stills/<NN>_<slug>.png       (master)
  gtm/howitworks/stills/<NN>_<slug>.jpg       (poster master)
  gtm/howitworks/clips/<NN>_<slug>.mp4        (master)
  public/videos/howitworks/<NN>_<slug>.mp4    (web)
  public/videos/howitworks/<NN>_<slug>.jpg    (web poster)
"""
import argparse
import os
import subprocess
import sys
import time
from pathlib import Path

import fal_client  # type: ignore
import requests

ROOT = Path(__file__).resolve().parents[1]
OUT_STILLS = ROOT / "gtm" / "howitworks" / "stills"
OUT_CLIPS = ROOT / "gtm" / "howitworks" / "clips"
PUBLIC_DIR = ROOT / "public" / "videos" / "howitworks"

STYLE_SUFFIX = (
    "Photographic realism, 2K cinematic grade, slightly desaturated, Kodak "
    "Portra 800 fine grain, naturalistic GoPro chest-mount or candid "
    "documentary aesthetic. NOT staged stock photography. Soft natural "
    "light, real-world imperfections. ALL packaging, signage, products are "
    "unbranded — no logos or text."
)

# ─── 6 howitworks scenes ────────────────────────────────────────────────────
ASSETS = [
    {
        "id": "01_tell_us_business",
        "still_prompt": (
            "Two professionals having a friendly conversation across a "
            "wooden coffee bar counter inside a small independent cafe. "
            "Left person wears a black work apron, leaning forward, "
            "gesturing with both hands while explaining their work. Right "
            "person stands in a casual hoodie holding an open laptop in one "
            "hand, listening attentively and nodding. Warm pendant overhead "
            "lighting, blurred espresso machine and shelves of unbranded "
            "coffee bags in soft-focus background. Both faces are partially "
            "visible from a 3/4 angle but not centered — captured candidly."
        ),
        "motion": (
            "Both people gesture in conversation, the apron-wearing person "
            "nods and points slightly to the right toward the workspace, "
            "the listener leans forward with interest. Subtle natural body "
            "language, no cut, naturalistic feel."
        ),
    },
    {
        "id": "02_agree_earnings",
        "still_prompt": (
            "Close-up over-the-shoulder view of a person seated at a wooden "
            "desk with a silver laptop open in front of them. The laptop "
            "screen shows a clean dark-mode partner agreement document with "
            "a sage-green signature button visible mid-page. The hands rest "
            "lightly on the keyboard, fingers hovering over the trackpad. A "
            "coffee cup and a small notebook are visible in soft focus to "
            "the right. Soft daylight from a window on the left, late "
            "afternoon glow."
        ),
        "motion": (
            "The right hand glides toward the trackpad, mouse cursor on "
            "screen moves slightly toward the signature button, the left "
            "hand types one or two keys. Subtle natural laptop interaction, "
            "no cut."
        ),
    },
    {
        "id": "03_ship_cameras",
        "still_prompt": (
            "Top-down view of a small open cardboard shipping box on a "
            "wooden desk. Inside: a compact cylindrical black action camera "
            "(about the size of a thick lipstick tube, with a single round "
            "lens at the front, slightly chrome accent ring around the "
            "lens, simple unmarked black plastic body), a chest-mount "
            "harness with adjustable straps, a USB-C charging cable neatly "
            "coiled, a microfiber cleaning cloth, and a folded printed "
            "quick-start card. The cardboard box has minimal foam packaging "
            "visible. Warm desk lighting."
        ),
        "motion": (
            "A hand enters from the right edge of frame and gently lifts "
            "the action camera out of the box, holding it up briefly to "
            "inspect, before placing it back. Slow, deliberate unboxing "
            "motion."
        ),
    },
    {
        "id": "04_you_capture",
        "still_prompt": (
            "Side profile of a worker in a packaging warehouse mid-action. "
            "They wear a compact black cylindrical chest-mounted action "
            "camera (single forward lens, small green LED status light "
            "glowing) clipped to a chest harness over their black work "
            "apron at sternum height. The worker's hands are reaching "
            "forward placing a small wrapped product into an open cardboard "
            "box on a steel-roller conveyor. Warehouse aisles blurred in "
            "background depth. Cool fluorescent overhead light. The camera "
            "is clearly visible on their chest but not the focal subject — "
            "the work IS the focal subject."
        ),
        "motion": (
            "The worker leans forward and places the wrapped product into "
            "the box, the chest cam visibly bobs slightly with their "
            "motion. Natural workplace movement, ambient warehouse activity "
            "in background."
        ),
    },
    {
        "id": "05_you_upload",
        "still_prompt": (
            "Close-up of hands holding a smartphone in portrait "
            "orientation. The phone screen displays a simple dark-mode "
            "upload app: a list of three video thumbnail tiles stacked "
            "vertically with sage-green progress bars (top tile shows "
            "'100%' and a small green check, middle tile shows '67%' "
            "filling, bottom tile shows '0%' queued). Monospace UI font, "
            "generous spacing, dark background with subtle accent. The "
            "thumb of the right hand hovers over the screen. Soft window "
            "light, blurred wooden desk in background."
        ),
        "motion": (
            "The right thumb taps the screen briefly, the middle progress "
            "bar fills slightly more, the bottom tile begins uploading and "
            "its bar starts to fill. Naturalistic phone-in-hand motion."
        ),
    },
    {
        "id": "06_get_paid",
        "still_prompt": (
            "A small business owner and two employees gathered around a "
            "wooden cafe counter, all visibly happy looking at a phone "
            "screen the owner holds out for them to see. The phone screen "
            "shows a clean simple bank deposit notification (numbers "
            "blurred for privacy, but a sage-green check mark and a dollar "
            "amount visible). The owner is mid-laugh, an employee on the "
            "left leans in with a grin, the employee on the right gives a "
            "small celebratory motion. Warm overhead pendant lighting, "
            "blurred coffee bar with espresso machine and milk pitchers "
            "behind. Documentary candid feel — faces visible from 3/4 "
            "angles but not centered."
        ),
        "motion": (
            "The three react together — light laughter, the owner gestures "
            "with the phone, the employee on the right gives a small "
            "celebratory hand motion, the left employee lightly claps the "
            "owner's shoulder. Naturalistic candid moment."
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
        sys.exit("ERROR: FAL_KEY not set in env or .env.local")
    print(f"  using FAL_KEY: {os.environ['FAL_KEY'][:8]}…{os.environ['FAL_KEY'][-4:]}")


def _download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = requests.get(url, timeout=240)
    r.raise_for_status()
    dest.write_bytes(r.content)
    print(f"  saved → {dest.relative_to(ROOT)}  ({len(r.content)//1024} KB)")


def _png_to_jpg(png: Path, jpg: Path) -> None:
    jpg.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(png), "-q:v", "2", str(jpg)],
        check=True,
    )
    print(f"  poster → {jpg.relative_to(ROOT)}  ({jpg.stat().st_size//1024} KB)")


def gen_stills() -> None:
    OUT_STILLS.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[stills] submitting 6 stills @ 2K (parallel)")
    handles = []
    for a in ASSETS:
        full_prompt = f"{a['still_prompt']} {STYLE_SUFFIX}"
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
        handles.append((a, h))
        print(f"  submitted {a['id']}")

    t0 = time.time()
    for a, h in handles:
        result = h.get()
        url = result["images"][0]["url"]
        png = OUT_STILLS / f"{a['id']}.png"
        _download(url, png)
        jpg_master = OUT_STILLS / f"{a['id']}.jpg"
        _png_to_jpg(png, jpg_master)
        # web poster
        jpg_web = PUBLIC_DIR / f"{a['id']}.jpg"
        jpg_web.write_bytes(jpg_master.read_bytes())
        print(f"  web    → {jpg_web.relative_to(ROOT)}")
    print(f"[stills] done in {time.time()-t0:.1f}s")


def gen_clips() -> None:
    OUT_CLIPS.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[clips] uploading stills + submitting 6 i2v jobs (parallel)")
    handles = []
    for a in ASSETS:
        png = OUT_STILLS / f"{a['id']}.png"
        if not png.exists():
            sys.exit(f"ERROR: missing still {png} — run --stills first")
        url = fal_client.upload_file(str(png))
        h = fal_client.submit(
            "bytedance/seedance-2.0/image-to-video",
            arguments={
                "prompt": a["motion"],
                "image_url": url,
                "duration": "5",
                "aspect_ratio": "16:9",
                "generate_audio": False,
            },
        )
        handles.append((a, h))
        print(f"  submitted {a['id']}")

    t0 = time.time()
    for a, h in handles:
        print(f"  waiting on {a['id']}…")
        result = h.get()
        url = result["video"]["url"]
        master = OUT_CLIPS / f"{a['id']}.mp4"
        _download(url, master)
        web = PUBLIC_DIR / f"{a['id']}.mp4"
        web.write_bytes(master.read_bytes())
        print(f"  web    → {web.relative_to(ROOT)}")
    print(f"[clips] done in {time.time()-t0:.1f}s")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--stills", action="store_true")
    p.add_argument("--clips", action="store_true")
    p.add_argument("--all", action="store_true")
    args = p.parse_args()

    _ensure_fal_key()
    if args.all or args.stills:
        gen_stills()
    if args.all or args.clips:
        gen_clips()


if __name__ == "__main__":
    main()
