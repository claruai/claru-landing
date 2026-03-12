"""
Video Keyframe Extraction & Grid Compositing
=============================================
Extracts N keyframes at scene-change boundaries and composites them into a grid image.

Usage:
    python extract_keyframes.py <video_path> [--frames 5] [--output grid.jpg]

Approaches tested:
    1. PySceneDetect (adaptive detector) — best general-purpose
    2. FFmpeg scene filter fallback
    3. Uniform sampling fallback (if no scene changes detected)
"""

import argparse
import subprocess
import json
import tempfile
from pathlib import Path

import cv2
from PIL import Image
from scenedetect import open_video, SceneManager, AdaptiveDetector, ContentDetector


def detect_scenes_pyscene(video_path: str, threshold: float = 3.0):
    """Detect scene boundaries using PySceneDetect's AdaptiveDetector."""
    video = open_video(video_path)
    scene_manager = SceneManager()
    scene_manager.add_detector(AdaptiveDetector(adaptive_threshold=threshold))
    scene_manager.detect_scenes(video)
    scenes = scene_manager.get_scene_list()
    print(f"[PySceneDetect] Found {len(scenes)} scenes (threshold={threshold})")
    for i, (start, end) in enumerate(scenes):
        print(f"  Scene {i+1}: {start.get_timecode()} -> {end.get_timecode()}")
    return scenes


def detect_scenes_content(video_path: str, threshold: float = 27.0):
    """Fallback: ContentDetector (pixel diff, more sensitive)."""
    video = open_video(video_path)
    scene_manager = SceneManager()
    scene_manager.add_detector(ContentDetector(threshold=threshold))
    scene_manager.detect_scenes(video)
    scenes = scene_manager.get_scene_list()
    print(f"[ContentDetector] Found {len(scenes)} scenes (threshold={threshold})")
    for i, (start, end) in enumerate(scenes):
        print(f"  Scene {i+1}: {start.get_timecode()} -> {end.get_timecode()}")
    return scenes


def get_video_info(video_path: str):
    """Get video duration and fps via ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json",
         "-show_format", "-show_streams", video_path],
        capture_output=True, text=True
    )
    data = json.loads(result.stdout)
    duration = float(data["format"]["duration"])
    for s in data["streams"]:
        if s["codec_type"] == "video":
            fps_parts = s["r_frame_rate"].split("/")
            fps = int(fps_parts[0]) / int(fps_parts[1])
            width, height = int(s["width"]), int(s["height"])
            return duration, fps, width, height
    raise ValueError("No video stream found")


def extract_frame_at(video_path: str, timestamp_sec: float) -> Image.Image:
    """Extract a single frame at a given timestamp using OpenCV."""
    cap = cv2.VideoCapture(video_path)
    cap.set(cv2.CAP_PROP_POS_MSEC, timestamp_sec * 1000)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        raise RuntimeError(f"Failed to extract frame at {timestamp_sec:.2f}s")
    # BGR -> RGB
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    return Image.fromarray(frame_rgb)


def select_keyframe_times(scenes, n_frames: int, duration: float):
    """Pick the best N timestamps from detected scenes."""
    if len(scenes) == 0:
        # No scenes detected — fall back to uniform sampling
        print(f"[Fallback] No scenes detected, sampling {n_frames} uniform frames")
        step = duration / (n_frames + 1)
        return [step * (i + 1) for i in range(n_frames)]

    # Strategy: pick the midpoint of each scene, spread across the video
    midpoints = []
    for start, end in scenes:
        mid = (start.get_seconds() + end.get_seconds()) / 2
        midpoints.append(mid)

    if len(midpoints) <= n_frames:
        # Fewer scenes than frames requested — use all midpoints
        # plus fill in gaps with uniform samples
        times = midpoints[:]
        if len(times) < n_frames:
            # Add boundary frames (start of first scene, end of last)
            candidates = [scenes[0][0].get_seconds() + 0.5]
            for start, end in scenes:
                candidates.append(start.get_seconds())  # scene boundary
            candidates.append(scenes[-1][1].get_seconds() - 0.5)
            # Deduplicate and pick ones furthest from existing times
            for c in sorted(set(candidates)):
                if len(times) >= n_frames:
                    break
                if all(abs(c - t) > 0.5 for t in times):
                    times.append(c)
        # Still not enough? uniform fill
        if len(times) < n_frames:
            step = duration / (n_frames + 1)
            for i in range(n_frames):
                t = step * (i + 1)
                if all(abs(t - existing) > 0.5 for existing in times):
                    times.append(t)
                if len(times) >= n_frames:
                    break
        times.sort()
        return times[:n_frames]
    else:
        # More scenes than frames — pick evenly spaced ones
        indices = [int(i * (len(midpoints) - 1) / (n_frames - 1)) for i in range(n_frames)]
        return [midpoints[i] for i in indices]


def create_grid(frames: list[Image.Image], columns: int = None, padding: int = 4) -> Image.Image:
    """Composite frames into a grid image."""
    n = len(frames)
    if columns is None:
        columns = n  # single row by default

    rows = (n + columns - 1) // columns
    fw, fh = frames[0].size

    grid_w = columns * fw + (columns - 1) * padding
    grid_h = rows * fh + (rows - 1) * padding
    grid = Image.new("RGB", (grid_w, grid_h), (10, 9, 8))  # dark bg

    for i, frame in enumerate(frames):
        col = i % columns
        row = i // columns
        x = col * (fw + padding)
        y = row * (fh + padding)
        grid.paste(frame, (x, y))

    return grid


def main():
    parser = argparse.ArgumentParser(description="Extract keyframes from video into grid")
    parser.add_argument("video", help="Path to video file")
    parser.add_argument("--frames", "-n", type=int, default=5, help="Number of frames to extract")
    parser.add_argument("--output", "-o", default=None, help="Output image path")
    parser.add_argument("--columns", "-c", type=int, default=None, help="Grid columns (default: all in one row)")
    parser.add_argument("--width", "-w", type=int, default=480, help="Width of each frame in grid")
    parser.add_argument("--threshold", "-t", type=float, default=3.0, help="Scene detection threshold")
    args = parser.parse_args()

    video_path = args.video
    if not Path(video_path).exists():
        print(f"Error: {video_path} not found")
        return

    # Get video info
    duration, fps, orig_w, orig_h = get_video_info(video_path)
    print(f"Video: {orig_w}x{orig_h}, {fps:.1f}fps, {duration:.1f}s")

    # Detect scenes — try adaptive first, then content at progressively lower thresholds
    scenes = detect_scenes_pyscene(video_path, threshold=args.threshold)
    if len(scenes) < 2:
        print("Trying ContentDetector with lower threshold...")
        scenes = detect_scenes_content(video_path, threshold=15.0)
    if len(scenes) < 2:
        print("Trying ContentDetector at threshold=5.0...")
        scenes = detect_scenes_content(video_path, threshold=5.0)
    if len(scenes) < 2:
        print("Trying ContentDetector at threshold=2.0...")
        scenes = detect_scenes_content(video_path, threshold=2.0)

    # Select keyframe timestamps
    times = select_keyframe_times(scenes, args.frames, duration)
    print(f"\nSelected {len(times)} keyframe timestamps:")
    for i, t in enumerate(times):
        print(f"  Frame {i+1}: {t:.2f}s")

    # Extract frames and save individually
    output_path = args.output or str(Path(video_path).stem + "_keyframes.jpg")
    output_dir = Path(output_path).parent
    stem = Path(video_path).stem

    frames = []
    print(f"\nExtracting {len(times)} frames...")
    for i, t in enumerate(times):
        frame = extract_frame_at(video_path, t)

        # Save individual frame at full resolution
        individual_path = output_dir / f"{stem}_frame_{i+1}_{t:.2f}s.jpg"
        frame.save(str(individual_path), quality=95)
        print(f"  Saved: {individual_path.name}")

        # Resize for grid
        ratio = args.width / frame.width
        new_h = int(frame.height * ratio)
        frame_resized = frame.resize((args.width, new_h), Image.LANCZOS)
        frames.append(frame_resized)

    # Create grid
    grid = create_grid(frames, columns=args.columns, padding=6)
    grid.save(output_path, quality=92)
    print(f"\nGrid saved to: {output_path} ({grid.width}x{grid.height})")


if __name__ == "__main__":
    main()
