"""
Gemini-based Video Keyframe Extraction
=======================================
Uses Gemini's video understanding to semantically identify scene changes,
then extracts frames at those timestamps and composites into a grid.

Usage:
    python extract_keyframes_gemini.py <video_path> [--frames 5] [--output grid.jpg]

Requires: GEMINI_API_KEY in .env.local or environment
"""

import argparse
import json
import os
import re
import time
from pathlib import Path

import cv2
import google.generativeai as genai
from PIL import Image


def load_api_key():
    """Load API key from environment or .env.local."""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    # Try .env.local
    env_path = Path(__file__).resolve().parents[2] / ".env.local"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise RuntimeError("GEMINI_API_KEY not found")


def upload_video(video_path: str):
    """Upload video to Gemini File API."""
    print(f"Uploading {video_path}...")
    video_file = genai.upload_file(path=video_path)

    # Wait for processing
    while video_file.state.name == "PROCESSING":
        print("  Processing...")
        time.sleep(2)
        video_file = genai.get_file(video_file.name)

    if video_file.state.name == "FAILED":
        raise RuntimeError(f"Video processing failed: {video_file.state.name}")

    print(f"  Upload complete: {video_file.uri}")
    return video_file


def detect_scenes_gemini(video_file, n_frames: int):
    """Ask Gemini to identify the N most visually distinct moments."""
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""Analyze this video and identify exactly {n_frames} timestamps where the most significant visual changes occur.

For each timestamp, return:
- timestamp_seconds: the exact time in seconds (as a float)
- description: a brief description of what's happening at that moment

Return ONLY a JSON array, no markdown formatting, no code blocks. Example format:
[{{"timestamp_seconds": 1.5, "description": "Person raises hand"}}, ...]

Rules:
- Spread the timestamps across the full duration of the video
- Focus on moments of meaningful visual change (movement, position change, new action)
- Do NOT cluster timestamps together — ensure they capture distinct moments
- Return exactly {n_frames} entries sorted by timestamp"""

    print(f"Asking Gemini to identify {n_frames} key moments...")
    response = model.generate_content([video_file, prompt])

    # Parse JSON from response
    text = response.text.strip()
    # Strip markdown code blocks if present
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    try:
        scenes = json.loads(text)
    except json.JSONDecodeError:
        print(f"Raw Gemini response:\n{text}")
        raise RuntimeError("Failed to parse Gemini response as JSON")

    print(f"\nGemini identified {len(scenes)} key moments:")
    for i, scene in enumerate(scenes):
        ts = scene["timestamp_seconds"]
        desc = scene["description"]
        print(f"  Frame {i+1}: {ts:.2f}s — {desc}")

    return scenes


def extract_frame_at(video_path: str, timestamp_sec: float) -> Image.Image:
    """Extract a single frame at a given timestamp using OpenCV."""
    cap = cv2.VideoCapture(video_path)
    cap.set(cv2.CAP_PROP_POS_MSEC, timestamp_sec * 1000)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        raise RuntimeError(f"Failed to extract frame at {timestamp_sec:.2f}s")
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    return Image.fromarray(frame_rgb)


def create_grid(frames: list[Image.Image], columns: int = None, padding: int = 6) -> Image.Image:
    """Composite frames into a grid image."""
    n = len(frames)
    if columns is None:
        columns = n

    rows = (n + columns - 1) // columns
    fw, fh = frames[0].size

    grid_w = columns * fw + (columns - 1) * padding
    grid_h = rows * fh + (rows - 1) * padding
    grid = Image.new("RGB", (grid_w, grid_h), (10, 9, 8))

    for i, frame in enumerate(frames):
        col = i % columns
        row = i // columns
        x = col * (fw + padding)
        y = row * (fh + padding)
        grid.paste(frame, (x, y))

    return grid


def main():
    parser = argparse.ArgumentParser(description="Gemini-based keyframe extraction")
    parser.add_argument("video", help="Path to video file")
    parser.add_argument("--frames", "-n", type=int, default=5, help="Number of frames")
    parser.add_argument("--output", "-o", default=None, help="Output image path")
    parser.add_argument("--columns", "-c", type=int, default=None, help="Grid columns")
    parser.add_argument("--width", "-w", type=int, default=480, help="Frame width in grid")
    args = parser.parse_args()

    video_path = args.video
    if not Path(video_path).exists():
        print(f"Error: {video_path} not found")
        return

    # Configure Gemini
    api_key = load_api_key()
    genai.configure(api_key=api_key)

    # Upload video
    video_file = upload_video(video_path)

    # Detect scenes with Gemini
    scenes = detect_scenes_gemini(video_file, args.frames)

    # Extract frames and save individually
    timestamps = [s["timestamp_seconds"] for s in scenes]
    output_path = args.output or str(Path(video_path).stem + "_gemini_keyframes.jpg")
    output_dir = Path(output_path).parent
    stem = Path(video_path).stem

    frames = []
    print(f"\nExtracting {len(timestamps)} frames...")
    for i, t in enumerate(timestamps):
        frame = extract_frame_at(video_path, t)

        # Save individual frame at full resolution
        individual_path = output_dir / f"{stem}_frame_{i+1}_{t:.2f}s.jpg"
        frame.save(str(individual_path), quality=95)
        desc = scenes[i]["description"]
        print(f"  Saved: {individual_path.name} — {desc}")

        # Resize for grid
        ratio = args.width / frame.width
        new_h = int(frame.height * ratio)
        frame_resized = frame.resize((args.width, new_h), Image.LANCZOS)
        frames.append(frame_resized)

    # Create grid
    grid = create_grid(frames, columns=args.columns)
    grid.save(output_path, quality=92)
    print(f"\nGrid saved to: {output_path} ({grid.width}x{grid.height})")

    # Cleanup uploaded file
    try:
        genai.delete_file(video_file.name)
        print("Cleaned up uploaded video from Gemini")
    except Exception:
        pass


if __name__ == "__main__":
    main()
