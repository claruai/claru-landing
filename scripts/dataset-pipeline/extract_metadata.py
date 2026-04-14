"""
LLM-based structured metadata extraction from HuggingFace dataset READMEs.

V2: Incremental extraction — loads existing v1 extractions and only processes
new datasets. Adds parent_project field for deduplication.

Usage:
    python extract_metadata.py [--input PATH] [--output PATH] [--existing PATH] [--delay SECONDS]

Requires:
    ANTHROPIC_API_KEY environment variable
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import anthropic


INPUT_FILE = Path(__file__).parent / "output" / "hf_robotics_raw_v2.json"
OUTPUT_FILE = Path(__file__).parent / "output" / "enriched_v2.json"
EXISTING_FILE = Path(__file__).parent / "output" / "enriched_datasets.json"
MODEL = "claude-haiku-4-5-20251001"
MIN_CARD_LENGTH = 50  # lowered from 100 since fallback text is shorter
DEFAULT_DELAY = 0.5

EXTRACTION_PROMPT = """Extract structured metadata from this robotics dataset description. Return valid JSON only — no markdown fences, no explanation.
If a field cannot be determined from the text, use null. Do not guess or infer.

Fields:
- name: string — human-readable dataset name
- description: string — 1-2 sentence summary
- parent_project: string — the overarching project or dataset collection this belongs to (e.g., "RoboCasa", "LIBERO", "Open X-Embodiment"). If it's a standalone dataset, use the dataset name itself.
- modalities: list of strings — data types present (e.g., "rgb", "depth", "force_torque", "proprioception", "language", "imu", "lidar", "audio", "tactile", "point_cloud")
- robot_embodiments: list of strings — robot platforms mentioned (e.g., "Franka Panda", "UR5", "humanoid", "quadruped", "mobile_manipulator")
- action_space: string or null — type of action representation (e.g., "joint_positions", "end_effector_delta", "joint_velocities", "language")
- environment_type: list of strings — where data was collected (e.g., "lab", "home", "kitchen", "warehouse", "outdoor", "simulation")
- task_types: list of strings — what tasks are represented (e.g., "manipulation", "grasping", "navigation", "locomotion", "pick_and_place", "pouring")
- num_episodes: string or null — number of episodes/trajectories if mentioned
- total_hours: string or null — total recording hours if mentioned
- license: string or null — dataset license
- annotation_types: list of strings — what annotations exist (e.g., "language_instructions", "reward_labels", "action_labels", "segmentation", "bounding_boxes")
- data_format: string or null — storage format (e.g., "RLDS", "HDF5", "LeRobot", "zarr", "WebDataset")
- year_released: number or null — year the dataset was first released
- paper_url: string or null — link to the associated paper
- physical_ai_relevance: string — 1-sentence explanation of why this dataset matters for physical AI research"""


def extract_metadata(client: anthropic.Anthropic, card_text: str) -> dict | None:
    """Send card text to Claude Haiku and parse the structured JSON response."""
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": f"{EXTRACTION_PROMPT}\n\n---\n\n{card_text[:8000]}",
                }
            ],
        )
        raw = response.content[0].text.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            lines = raw.split("\n")
            lines = [line for line in lines if not line.strip().startswith("```")]
            raw = "\n".join(lines)

        parsed = json.loads(raw)
        if isinstance(parsed, list):
            parsed = parsed[0] if parsed else None
        if not isinstance(parsed, dict):
            print(f"    Unexpected response type: {type(parsed).__name__}")
            return None
        return parsed
    except json.JSONDecodeError as e:
        print(f"    JSON parse error: {e}")
        return None
    except anthropic.APIError as e:
        print(f"    API error: {e}")
        return None


def load_existing_extractions(path: Path) -> dict[str, dict]:
    """Load existing extractions keyed by dataset_id."""
    if not path.exists():
        return {}
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    existing = {}
    for record in data:
        did = record.get("dataset_id")
        if did and record.get("extraction_success") and record.get("extraction"):
            existing[did] = record
    return existing


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract structured metadata from dataset READMEs (v2)")
    parser.add_argument("--input", type=Path, default=INPUT_FILE, help="Input raw crawl JSON")
    parser.add_argument("--output", type=Path, default=OUTPUT_FILE, help="Output enriched JSON")
    parser.add_argument("--existing", type=Path, default=EXISTING_FILE, help="Existing v1 extractions to reuse")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY, help="Delay between API calls (seconds)")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"ERROR: Input file not found: {args.input}")
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set")
        sys.exit(1)

    client = anthropic.Anthropic()

    # Load raw crawl data
    with open(args.input, "r", encoding="utf-8") as f:
        raw_datasets = json.load(f)
    print(f"Loaded {len(raw_datasets)} datasets from {args.input}")

    # Load existing extractions
    existing = load_existing_extractions(args.existing)
    print(f"Loaded {len(existing)} existing extractions from {args.existing}")

    results: list[dict] = []
    new_extraction_count = 0
    reused_count = 0
    error_count = 0
    skipped_count = 0

    for i, dataset in enumerate(raw_datasets, 1):
        dataset_id = dataset["dataset_id"]
        print(f"  [{i}/{len(raw_datasets)}] {dataset_id}", end=" ")

        # Check if we already have a valid extraction
        if dataset_id in existing:
            old_record = existing[dataset_id]
            old_extraction = old_record["extraction"]

            # Add parent_project if missing from v1 extraction
            if old_extraction and "parent_project" not in old_extraction:
                old_extraction["parent_project"] = old_extraction.get("name", dataset_id)

            record = {
                "dataset_id": dataset_id,
                "author": dataset.get("author") or old_record.get("author"),
                "downloads": dataset.get("downloads") or old_record.get("downloads"),
                "likes": dataset.get("likes") or old_record.get("likes"),
                "last_modified": dataset.get("last_modified") or old_record.get("last_modified"),
                "tags": dataset.get("tags") or old_record.get("tags", []),
                "extraction": old_extraction,
                "extraction_success": True,
            }
            results.append(record)
            reused_count += 1
            print("- REUSED (v1)")
            continue

        # Need new extraction — check if we have card text
        card_text = dataset.get("card_text")
        if not card_text or len(card_text) < MIN_CARD_LENGTH:
            results.append({
                "dataset_id": dataset_id,
                "author": dataset.get("author"),
                "downloads": dataset.get("downloads"),
                "likes": dataset.get("likes"),
                "last_modified": dataset.get("last_modified"),
                "tags": dataset.get("tags", []),
                "extraction": None,
                "extraction_success": False,
            })
            skipped_count += 1
            print(f"- SKIPPED (card_text {'missing' if not card_text else f'too short: {len(card_text)} chars'})")
            continue

        # Run LLM extraction
        metadata = extract_metadata(client, card_text)

        record = {
            "dataset_id": dataset_id,
            "author": dataset.get("author"),
            "downloads": dataset.get("downloads"),
            "likes": dataset.get("likes"),
            "last_modified": dataset.get("last_modified"),
            "tags": dataset.get("tags", []),
            "extraction": metadata,
            "extraction_success": metadata is not None,
        }

        if metadata:
            new_extraction_count += 1
            name = metadata.get("name", "?")
            parent = metadata.get("parent_project", "?")
            mods = metadata.get("modalities") or []
            print(f"- NEW: {name} [parent={parent}] ({len(mods)} modalities)")
        else:
            error_count += 1
            print("- FAILED")

        results.append(record)

        # Rate limit between API calls
        if i < len(raw_datasets):
            time.sleep(args.delay)

    # Save
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nDone.")
    print(f"  Reused from v1:  {reused_count}")
    print(f"  New extractions: {new_extraction_count}")
    print(f"  Errors:          {error_count}")
    print(f"  Skipped:         {skipped_count}")
    print(f"  Total records:   {len(results)}")
    print(f"Saved to {args.output}")


if __name__ == "__main__":
    main()
