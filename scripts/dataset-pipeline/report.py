"""
Generate a human-readable report from enriched dataset metadata.

V2: Groups by parent_project, Notable Datasets section, extraction completeness,
social signal highlights.

Usage:
    python report.py [--input PATH] [--output PATH]
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path


INPUT_FILE = Path(__file__).parent / "output" / "enriched_with_social.json"
OUTPUT_FILE = Path(__file__).parent / "output" / "dataset_report_v2.md"

EXTRACTION_FIELDS = [
    "name", "description", "parent_project", "modalities", "robot_embodiments",
    "action_space", "environment_type", "task_types", "num_episodes",
    "total_hours", "license", "annotation_types", "data_format",
    "year_released", "paper_url", "physical_ai_relevance",
]


def truncate(text: str | None, max_len: int = 40) -> str:
    if not text:
        return "-"
    if len(text) <= max_len:
        return text
    return text[: max_len - 1] + "..."


def format_list(items: list[str] | None, max_items: int = 3) -> str:
    if not items:
        return "-"
    shown = items[:max_items]
    result = ", ".join(shown)
    if len(items) > max_items:
        result += f" (+{len(items) - max_items})"
    return result


def compute_completeness(extraction: dict) -> float:
    """Compute extraction completeness (0-100%)."""
    non_null = 0
    for field in EXTRACTION_FIELDS:
        val = extraction.get(field)
        if val is not None:
            if isinstance(val, list) and len(val) == 0:
                continue
            if isinstance(val, str) and not val.strip():
                continue
            non_null += 1
    return (non_null / len(EXTRACTION_FIELDS)) * 100.0


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate dataset report (v2)")
    parser.add_argument("--input", type=Path, default=INPUT_FILE, help="Input enriched JSON")
    parser.add_argument("--output", type=Path, default=OUTPUT_FILE, help="Output markdown file")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"ERROR: Input file not found: {args.input}")
        sys.exit(1)

    with open(args.input, "r", encoding="utf-8") as f:
        datasets = json.load(f)

    extracted = [d for d in datasets if d.get("extraction_success") and d.get("extraction")]
    failed = [d for d in datasets if not d.get("extraction_success")]
    extracted.sort(key=lambda d: d.get("downloads") or 0, reverse=True)

    # --- Group by parent_project ---
    families: dict[str, list[dict]] = defaultdict(list)
    for d in extracted:
        ext = d["extraction"]
        parent = ext.get("parent_project") or ext.get("name") or d["dataset_id"]
        families[parent].append(d)

    # Sort families by total downloads
    family_stats: list[tuple[str, list[dict], int]] = []
    for parent, members in families.items():
        total_dl = sum(m.get("downloads") or 0 for m in members)
        family_stats.append((parent, members, total_dl))
    family_stats.sort(key=lambda x: x[2], reverse=True)

    # --- Aggregate counters ---
    modality_counts: Counter[str] = Counter()
    task_counts: Counter[str] = Counter()
    embodiment_counts: Counter[str] = Counter()
    env_counts: Counter[str] = Counter()
    format_counts: Counter[str] = Counter()
    annotation_counts: Counter[str] = Counter()

    for d in extracted:
        ext = d["extraction"]
        for mod in ext.get("modalities") or []:
            modality_counts[mod] += 1
        for task in ext.get("task_types") or []:
            task_counts[task] += 1
        for robot in ext.get("robot_embodiments") or []:
            embodiment_counts[robot] += 1
        for env in ext.get("environment_type") or []:
            env_counts[env] += 1
        fmt = ext.get("data_format")
        if fmt:
            format_counts[fmt] += 1
        for ann in ext.get("annotation_types") or []:
            annotation_counts[ann] += 1

    # --- Completeness stats ---
    completeness_scores = [compute_completeness(d["extraction"]) for d in extracted]
    avg_completeness = sum(completeness_scores) / len(completeness_scores) if completeness_scores else 0

    # --- Social signal highlights ---
    most_discussed_reddit: list[tuple[dict, int]] = []
    most_cited: list[tuple[dict, int]] = []
    most_discussed_hn: list[tuple[dict, int]] = []

    for d in extracted:
        signals = d.get("social_signals") or {}
        reddit_posts = signals.get("reddit_posts") or []
        hn_posts = signals.get("hn_posts") or []
        citations = signals.get("citation_count")

        if reddit_posts:
            total_score = sum(p.get("score", 0) for p in reddit_posts)
            most_discussed_reddit.append((d, total_score))
        if hn_posts:
            total_points = sum(p.get("points", 0) for p in hn_posts)
            most_discussed_hn.append((d, total_points))
        if citations is not None and citations > 0:
            most_cited.append((d, citations))

    most_discussed_reddit.sort(key=lambda x: x[1], reverse=True)
    most_cited.sort(key=lambda x: x[1], reverse=True)
    most_discussed_hn.sort(key=lambda x: x[1], reverse=True)

    # --- Build report ---
    lines: list[str] = []
    lines.append("# Physical AI Dataset Discovery Report (v2)")
    lines.append("")
    lines.append(f"**Total datasets crawled:** {len(datasets)}")
    lines.append(f"**Successfully extracted:** {len(extracted)}")
    lines.append(f"**Failed/skipped:** {len(failed)}")
    lines.append(f"**Unique dataset families:** {len(families)}")
    lines.append(f"**Average extraction completeness:** {avg_completeness:.1f}%")
    lines.append("")

    # --- Notable Datasets (> 1000 downloads) ---
    notable = [d for d in extracted if (d.get("downloads") or 0) > 1000]
    lines.append(f"## Notable Datasets ({len(notable)} with > 1,000 downloads)")
    lines.append("")

    for i, d in enumerate(notable, 1):
        ext = d["extraction"]
        name = ext.get("name") or d["dataset_id"]
        desc = ext.get("description") or "No description"
        relevance = ext.get("physical_ai_relevance") or ""
        downloads = d.get("downloads") or 0
        parent = ext.get("parent_project") or name
        modalities = format_list(ext.get("modalities"), 5)
        robots = format_list(ext.get("robot_embodiments"), 3)
        tasks = format_list(ext.get("task_types"), 3)
        episodes = ext.get("num_episodes") or "-"
        data_fmt = ext.get("data_format") or "-"
        paper = ext.get("paper_url") or ""
        completeness = compute_completeness(ext)

        lines.append(f"### {i}. {name}")
        lines.append(f"- **ID:** `{d['dataset_id']}`")
        lines.append(f"- **Parent Project:** {parent}")
        lines.append(f"- **Downloads:** {downloads:,}")
        lines.append(f"- **Description:** {desc}")
        lines.append(f"- **Modalities:** {modalities}")
        lines.append(f"- **Robots:** {robots}")
        lines.append(f"- **Tasks:** {tasks}")
        lines.append(f"- **Episodes:** {episodes}")
        lines.append(f"- **Format:** {data_fmt}")
        if paper:
            lines.append(f"- **Paper:** {paper}")
        if relevance:
            lines.append(f"- **Physical AI Relevance:** {relevance}")
        lines.append(f"- **Extraction Completeness:** {completeness:.0f}%")

        # Social signals for this dataset
        signals = d.get("social_signals") or {}
        citations = signals.get("citation_count")
        reddit_count = len(signals.get("reddit_posts") or [])
        hn_count = len(signals.get("hn_posts") or [])
        signal_parts = []
        if citations:
            signal_parts.append(f"{citations} citations")
        if reddit_count:
            signal_parts.append(f"{reddit_count} Reddit posts")
        if hn_count:
            signal_parts.append(f"{hn_count} HN posts")
        if signal_parts:
            lines.append(f"- **Social Signals:** {', '.join(signal_parts)}")
        lines.append("")

    # --- Dataset Family Summary ---
    multi_variant_families = [(p, m, dl) for p, m, dl in family_stats if len(m) > 1]
    lines.append(f"## Dataset Families ({len(multi_variant_families)} with multiple variants)")
    lines.append("")
    lines.append("| Family | Variants | Total Downloads | Top Dataset |")
    lines.append("|--------|----------|-----------------|-------------|")

    for parent, members, total_dl in family_stats[:50]:
        if len(members) == 1:
            continue
        top = max(members, key=lambda m: m.get("downloads") or 0)
        top_id = truncate(top["dataset_id"], 40)
        lines.append(f"| {truncate(parent, 30)} | {len(members)} | {total_dl:,} | {top_id} |")
    lines.append("")

    # --- Full Dataset Summary Table ---
    lines.append("## Full Dataset Summary")
    lines.append("")
    lines.append("| # | Dataset | Downloads | Family | Modalities | Robots | Tasks | Episodes | Completeness |")
    lines.append("|---|---------|-----------|--------|------------|--------|-------|----------|--------------|")

    for i, d in enumerate(extracted, 1):
        ext = d["extraction"]
        name = truncate(ext.get("name") or d["dataset_id"], 30)
        downloads = d.get("downloads") or 0
        parent = truncate(ext.get("parent_project") or "-", 20)
        modalities = format_list(ext.get("modalities"), 2)
        robots = format_list(ext.get("robot_embodiments"), 2)
        tasks = format_list(ext.get("task_types"), 2)
        episodes = ext.get("num_episodes") or "-"
        completeness = compute_completeness(ext)
        lines.append(
            f"| {i} | {name} | {downloads:,} | {parent} | {modalities} | {robots} | {tasks} | {episodes} | {completeness:.0f}% |"
        )
    lines.append("")

    # --- Distribution Statistics ---
    lines.append("## Modality Distribution")
    lines.append("")
    for mod, count in modality_counts.most_common():
        bar = "#" * min(count, 50)
        lines.append(f"- **{mod}**: {count} datasets {bar}")
    lines.append("")

    lines.append("## Task Type Distribution")
    lines.append("")
    for task, count in task_counts.most_common():
        bar = "#" * min(count, 50)
        lines.append(f"- **{task}**: {count} datasets {bar}")
    lines.append("")

    lines.append("## Robot Embodiments")
    lines.append("")
    for robot, count in embodiment_counts.most_common(25):
        lines.append(f"- **{robot}**: {count} datasets")
    lines.append("")

    lines.append("## Environment Types")
    lines.append("")
    for env, count in env_counts.most_common():
        lines.append(f"- **{env}**: {count} datasets")
    lines.append("")

    lines.append("## Data Formats")
    lines.append("")
    for fmt, count in format_counts.most_common():
        lines.append(f"- **{fmt}**: {count} datasets")
    lines.append("")

    lines.append("## Annotation Types")
    lines.append("")
    for ann, count in annotation_counts.most_common():
        lines.append(f"- **{ann}**: {count} datasets")
    lines.append("")

    # --- Social Signal Highlights ---
    lines.append("## Social Signal Highlights")
    lines.append("")

    if most_cited[:10]:
        lines.append("### Most Cited Papers")
        lines.append("")
        for d, count in most_cited[:10]:
            ext = d["extraction"]
            name = ext.get("name") or d["dataset_id"]
            paper = ext.get("paper_url") or ""
            lines.append(f"- **{name}**: {count} citations")
            if paper:
                lines.append(f"  - Paper: {paper}")
        lines.append("")

    if most_discussed_reddit[:10]:
        lines.append("### Most Discussed on Reddit")
        lines.append("")
        for d, total_score in most_discussed_reddit[:10]:
            ext = d["extraction"]
            name = ext.get("name") or d["dataset_id"]
            posts = d.get("social_signals", {}).get("reddit_posts", [])
            lines.append(f"- **{name}** (total score: {total_score})")
            for p in posts[:2]:
                lines.append(f"  - r/{p['subreddit']}: \"{truncate(p['title'], 60)}\" (score: {p['score']})")
        lines.append("")

    if most_discussed_hn[:10]:
        lines.append("### Most Discussed on Hacker News")
        lines.append("")
        for d, total_points in most_discussed_hn[:10]:
            ext = d["extraction"]
            name = ext.get("name") or d["dataset_id"]
            posts = d.get("social_signals", {}).get("hn_posts", [])
            lines.append(f"- **{name}** (total points: {total_points})")
            for p in posts[:2]:
                lines.append(f"  - \"{truncate(p['title'], 60)}\" ({p['points']} pts, {p['num_comments']} comments)")
        lines.append("")

    # --- Extraction Completeness Stats ---
    lines.append("## Extraction Completeness Stats")
    lines.append("")
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

    lines.append(f"- **Average:** {avg_completeness:.1f}%")
    for bucket, count in comp_buckets.items():
        pct = count / len(extracted) * 100 if extracted else 0
        bar = "#" * int(pct / 2)
        lines.append(f"- **{bucket}:** {count} datasets ({pct:.1f}%) {bar}")
    lines.append("")

    report_text = "\n".join(lines)

    # Print to stdout
    print(report_text)

    # Save to file
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(report_text)

    print(f"\n---\nReport saved to {args.output}")


if __name__ == "__main__":
    main()
