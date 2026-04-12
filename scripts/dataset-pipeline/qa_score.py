"""
Automated QA scoring for extraction accuracy.

Compares extracted metadata against known ground truth for well-known datasets
and computes aggregate extraction completeness statistics.

Usage:
    python qa_score.py [--input PATH]

Output:
    output/qa_report.md (markdown report)
    Prints summary to stdout
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path


INPUT_FILE = Path(__file__).parent / "output" / "enriched_with_social.json"
OUTPUT_FILE = Path(__file__).parent / "output" / "qa_report.md"

# Fields that should be non-null in a well-extracted record
EXTRACTION_FIELDS = [
    "name", "description", "parent_project", "modalities", "robot_embodiments",
    "action_space", "environment_type", "task_types", "num_episodes",
    "total_hours", "license", "annotation_types", "data_format",
    "year_released", "paper_url", "physical_ai_relevance",
]

# Ground truth for well-known datasets
# We match by checking if the dataset_id contains the key string (case-insensitive)
GROUND_TRUTH: dict[str, dict] = {
    "droid": {
        "expected_modalities": ["rgb", "depth"],
        "expected_robots": ["Franka"],
        "expected_tasks": ["manipulation"],
        "expected_episodes_order": "10K+",
    },
    "galaxea": {
        "expected_modalities": ["rgb", "depth", "proprioception"],
        "expected_robots": ["mobile_manipulator"],
        "expected_tasks": ["manipulation", "mobile_manipulation"],
        "expected_episodes_order": "10K+",
    },
    "domino": {
        "expected_modalities": ["rgb"],
        "expected_robots": ["Franka", "UR5"],
        "expected_tasks": ["manipulation"],
        "expected_episodes_order": "100K+",
    },
    "robocasa": {
        "expected_modalities": ["rgb", "proprioception"],
        "expected_robots": ["Franka"],
        "expected_tasks": ["manipulation", "pick_and_place"],
    },
    "egodex": {
        "expected_modalities": ["rgb"],
        "expected_tasks": ["manipulation", "grasping"],
    },
    "omniaction": {
        "expected_modalities": ["rgb", "audio"],
        "expected_tasks": ["manipulation"],
        "expected_episodes_order": "100K+",
    },
}


def _normalize(s: str) -> str:
    """Normalize a string for fuzzy matching."""
    return s.lower().strip().replace("_", " ").replace("-", " ")


def _list_contains(haystack: list[str] | None, needle: str) -> bool:
    """Check if any item in haystack partially matches needle (case-insensitive)."""
    if not haystack:
        return False
    needle_norm = _normalize(needle)
    for item in haystack:
        item_norm = _normalize(item)
        if needle_norm in item_norm or item_norm in needle_norm:
            return True
    return False


def _parse_episode_order(num_episodes: str | None) -> str | None:
    """Parse episode count into order of magnitude bucket."""
    if not num_episodes:
        return None
    # Extract digits from strings like "50,000", "~10K", "386,048", etc.
    clean = num_episodes.replace(",", "").replace("~", "").replace("+", "").strip()

    # Handle K/M suffixes
    if clean.upper().endswith("K"):
        try:
            n = float(clean[:-1]) * 1000
        except ValueError:
            return None
    elif clean.upper().endswith("M"):
        try:
            n = float(clean[:-1]) * 1_000_000
        except ValueError:
            return None
    else:
        try:
            n = float(clean)
        except ValueError:
            return None

    if n >= 100_000:
        return "100K+"
    elif n >= 10_000:
        return "10K+"
    elif n >= 1_000:
        return "1K+"
    elif n >= 100:
        return "100+"
    else:
        return "<100"


def score_ground_truth(dataset: dict, gt_key: str, gt: dict) -> dict:
    """Score a single dataset against ground truth."""
    extraction = dataset.get("extraction") or {}
    scores: dict[str, float | str] = {"gt_key": gt_key, "dataset_id": dataset["dataset_id"]}

    # Modality recall
    if "expected_modalities" in gt:
        expected = gt["expected_modalities"]
        found = sum(1 for m in expected if _list_contains(extraction.get("modalities"), m))
        scores["modality_recall"] = found / len(expected) if expected else 1.0
        scores["modality_detail"] = f"{found}/{len(expected)} ({', '.join(expected)})"
    else:
        scores["modality_recall"] = None
        scores["modality_detail"] = "N/A"

    # Robot recall
    if "expected_robots" in gt:
        expected = gt["expected_robots"]
        found = sum(1 for r in expected if _list_contains(extraction.get("robot_embodiments"), r))
        scores["robot_recall"] = found / len(expected) if expected else 1.0
        scores["robot_detail"] = f"{found}/{len(expected)} ({', '.join(expected)})"
    else:
        scores["robot_recall"] = None
        scores["robot_detail"] = "N/A"

    # Task recall
    if "expected_tasks" in gt:
        expected = gt["expected_tasks"]
        found = sum(1 for t in expected if _list_contains(extraction.get("task_types"), t))
        scores["task_recall"] = found / len(expected) if expected else 1.0
        scores["task_detail"] = f"{found}/{len(expected)} ({', '.join(expected)})"
    else:
        scores["task_recall"] = None
        scores["task_detail"] = "N/A"

    # Episode order of magnitude
    if "expected_episodes_order" in gt:
        extracted_order = _parse_episode_order(extraction.get("num_episodes"))
        expected_order = gt["expected_episodes_order"]
        if extracted_order is None:
            scores["episode_match"] = 0.0
            scores["episode_detail"] = f"Expected {expected_order}, got null"
        elif extracted_order == expected_order:
            scores["episode_match"] = 1.0
            scores["episode_detail"] = f"Correct: {expected_order}"
        else:
            scores["episode_match"] = 0.5  # partial credit for wrong magnitude
            scores["episode_detail"] = f"Expected {expected_order}, got {extracted_order}"
    else:
        scores["episode_match"] = None
        scores["episode_detail"] = "N/A"

    # Overall weighted average (only over applicable metrics)
    weights = {"modality_recall": 0.3, "robot_recall": 0.25, "task_recall": 0.3, "episode_match": 0.15}
    total_weight = 0.0
    weighted_sum = 0.0
    for key, weight in weights.items():
        val = scores.get(key)
        if val is not None:
            weighted_sum += val * weight
            total_weight += weight

    scores["overall"] = weighted_sum / total_weight if total_weight > 0 else 0.0

    return scores


def compute_completeness(dataset: dict) -> float:
    """Compute extraction completeness (0-100%) based on non-null fields."""
    extraction = dataset.get("extraction")
    if not extraction:
        return 0.0

    non_null = 0
    for field in EXTRACTION_FIELDS:
        val = extraction.get(field)
        if val is not None:
            # Lists count as non-null only if non-empty
            if isinstance(val, list):
                if len(val) > 0:
                    non_null += 1
            elif isinstance(val, str):
                if val.strip():
                    non_null += 1
            else:
                non_null += 1

    return (non_null / len(EXTRACTION_FIELDS)) * 100.0


def main() -> None:
    parser = argparse.ArgumentParser(description="QA scoring for extraction accuracy")
    parser.add_argument("--input", type=Path, default=INPUT_FILE, help="Input enriched JSON")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"ERROR: Input file not found: {args.input}")
        sys.exit(1)

    with open(args.input, "r", encoding="utf-8") as f:
        datasets = json.load(f)

    extracted = [d for d in datasets if d.get("extraction_success") and d.get("extraction")]
    print(f"Loaded {len(datasets)} datasets, {len(extracted)} with successful extractions")

    # --- Ground Truth Scoring ---
    gt_results: list[dict] = []
    for gt_key, gt_vals in GROUND_TRUTH.items():
        # Find matching dataset (first match where dataset_id contains the key)
        match = None
        for d in extracted:
            if gt_key in d["dataset_id"].lower():
                match = d
                break

        if match:
            scores = score_ground_truth(match, gt_key, gt_vals)
            gt_results.append(scores)
            print(f"  GT match: {gt_key} -> {match['dataset_id']} (overall: {scores['overall']:.1%})")
        else:
            print(f"  GT miss:  {gt_key} (no matching dataset found in extractions)")

    # --- Aggregate Completeness ---
    field_null_counts: Counter[str] = Counter()
    completeness_scores: list[float] = []

    for d in extracted:
        ext = d.get("extraction") or {}
        comp = compute_completeness(d)
        completeness_scores.append(comp)

        for field in EXTRACTION_FIELDS:
            val = ext.get(field)
            is_null = val is None
            if isinstance(val, list) and len(val) == 0:
                is_null = True
            if isinstance(val, str) and not val.strip():
                is_null = True
            if is_null:
                field_null_counts[field] += 1

    # Distribution buckets
    comp_buckets = {"0-25%": 0, "25-50%": 0, "50-75%": 0, "75-100%": 0}
    for c in completeness_scores:
        if c < 25:
            comp_buckets["0-25%"] += 1
        elif c < 50:
            comp_buckets["25-50%"] += 1
        elif c < 75:
            comp_buckets["50-75%"] += 1
        else:
            comp_buckets["75-100%"] += 1

    at_least_3_fields = sum(1 for c in completeness_scores if c >= (3 / len(EXTRACTION_FIELDS)) * 100)
    avg_completeness = sum(completeness_scores) / len(completeness_scores) if completeness_scores else 0

    # --- Build Report ---
    lines: list[str] = []
    lines.append("# Dataset Pipeline v2 - QA Report")
    lines.append("")
    lines.append(f"**Total datasets:** {len(datasets)}")
    lines.append(f"**Successfully extracted:** {len(extracted)}")
    lines.append(f"**Extraction rate:** {len(extracted)/len(datasets)*100:.1f}%")
    lines.append("")

    # Ground truth section
    lines.append("## Ground Truth Validation")
    lines.append("")
    if gt_results:
        lines.append("| Dataset | Overall | Modality | Robot | Task | Episodes |")
        lines.append("|---------|---------|----------|-------|------|----------|")
        for r in gt_results:
            overall = f"{r['overall']:.0%}"
            mod = f"{r.get('modality_recall', 0):.0%}" if r.get('modality_recall') is not None else "N/A"
            rob = f"{r.get('robot_recall', 0):.0%}" if r.get('robot_recall') is not None else "N/A"
            task = f"{r.get('task_recall', 0):.0%}" if r.get('task_recall') is not None else "N/A"
            ep = f"{r.get('episode_match', 0):.0%}" if r.get('episode_match') is not None else "N/A"
            lines.append(f"| {r['gt_key']} ({r['dataset_id'][:40]}) | {overall} | {mod} | {rob} | {task} | {ep} |")
        lines.append("")

        # Detailed breakdown
        lines.append("### Detailed Scores")
        lines.append("")
        for r in gt_results:
            lines.append(f"**{r['gt_key']}** (`{r['dataset_id']}`)")
            lines.append(f"- Modalities: {r['modality_detail']}")
            lines.append(f"- Robots: {r['robot_detail']}")
            lines.append(f"- Tasks: {r['task_detail']}")
            lines.append(f"- Episodes: {r['episode_detail']}")
            lines.append(f"- **Overall: {r['overall']:.1%}**")
            lines.append("")

        # Average GT score
        avg_gt = sum(r["overall"] for r in gt_results) / len(gt_results) if gt_results else 0
        lines.append(f"**Average ground truth score: {avg_gt:.1%}**")
        lines.append("")
    else:
        lines.append("No ground truth datasets found in extraction output.")
        lines.append("")

    # Field completeness
    lines.append("## Field Completeness")
    lines.append("")
    lines.append("| Field | Null Count | Null % | Non-Null % |")
    lines.append("|-------|-----------|--------|------------|")
    for field in EXTRACTION_FIELDS:
        null_count = field_null_counts.get(field, 0)
        null_pct = (null_count / len(extracted) * 100) if extracted else 0
        non_null_pct = 100 - null_pct
        bar = "#" * int(non_null_pct / 5)
        lines.append(f"| {field} | {null_count} | {null_pct:.1f}% | {non_null_pct:.1f}% {bar} |")
    lines.append("")

    # Completeness distribution
    lines.append("## Extraction Completeness Distribution")
    lines.append("")
    lines.append(f"- **Average completeness:** {avg_completeness:.1f}%")
    lines.append(f"- **Datasets with >= 3 non-null fields:** {at_least_3_fields}/{len(extracted)} ({at_least_3_fields/len(extracted)*100:.1f}%)")
    lines.append("")
    for bucket, count in comp_buckets.items():
        bar = "#" * count
        pct = count / len(extracted) * 100 if extracted else 0
        lines.append(f"- **{bucket}:** {count} datasets ({pct:.1f}%) {bar}")
    lines.append("")

    report_text = "\n".join(lines)

    # Print to stdout
    print("\n" + report_text)

    # Save
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(report_text)

    print(f"\nQA report saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
