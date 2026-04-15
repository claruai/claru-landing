"""
Crawl HuggingFace Hub for robotics datasets and save raw metadata + README content.

V2: Two-pass strategy (downloads + recent) with README fallback to card_data.

Usage:
    python crawl_hf.py [--limit N] [--output PATH]

Output:
    output/hf_robotics_raw_v2.json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

from huggingface_hub import HfApi


OUTPUT_DIR = Path(__file__).parent / "output"
DEFAULT_OUTPUT = OUTPUT_DIR / "hf_robotics_raw_v2.json"
DEFAULT_LIMIT = 300


def _build_fallback_text(ds) -> str | None:
    """Build fallback card text from dataset metadata when README is unavailable."""
    parts: list[str] = []

    # Use card_data if available (YAML frontmatter fields)
    if hasattr(ds, "card_data") and ds.card_data:
        card = ds.card_data
        if hasattr(card, "description") and card.description:
            parts.append(f"Description: {card.description}")
        if hasattr(card, "language") and card.language:
            parts.append(f"Language: {card.language}")

    # Tags are always available
    if ds.tags:
        parts.append(f"Tags: {', '.join(ds.tags)}")

    # Dataset ID often encodes useful info
    parts.append(f"Dataset ID: {ds.id}")
    if ds.author:
        parts.append(f"Author: {ds.author}")

    return "\n".join(parts) if parts else None


def fetch_datasets_pass(api: HfApi, sort: str, limit: int, label: str) -> list:
    """Run one pass of dataset fetching with a given sort order."""
    print(f"\n--- Pass: {label} (sort={sort}, limit={limit}) ---")
    datasets = list(
        api.list_datasets(
            filter="robotics",
            sort=sort,
            limit=limit,
            full=True,
        )
    )
    print(f"  Found {len(datasets)} datasets")
    return datasets


def download_readmes(api: HfApi, datasets: list) -> list[dict]:
    """Download READMEs for a list of datasets, with fallback to card_data."""
    results: list[dict] = []
    errors: list[str] = []

    for i, ds in enumerate(datasets, 1):
        dataset_id = ds.id
        print(f"  [{i}/{len(datasets)}] {dataset_id}", end=" ")

        record = {
            "dataset_id": dataset_id,
            "author": ds.author,
            "downloads": ds.downloads,
            "likes": ds.likes,
            "last_modified": ds.lastModified.isoformat() if ds.lastModified else None,
            "created_at": ds.created_at.isoformat() if hasattr(ds, 'created_at') and ds.created_at else None,
            "tags": ds.tags or [],
            "card_text": None,
            "card_text_source": None,  # "readme" or "fallback"
        }

        # Try downloading the README first
        try:
            readme_path = api.hf_hub_download(
                repo_id=dataset_id,
                filename="README.md",
                repo_type="dataset",
            )
            with open(readme_path, "r", encoding="utf-8", errors="replace") as f:
                text = f.read()
            if text and len(text.strip()) > 10:
                record["card_text"] = text
                record["card_text_source"] = "readme"
                print(f"- README OK ({len(text)} chars)")
            else:
                # README exists but is essentially empty
                fallback = _build_fallback_text(ds)
                if fallback:
                    record["card_text"] = fallback
                    record["card_text_source"] = "fallback"
                    print(f"- Empty README, using fallback ({len(fallback)} chars)")
                else:
                    print("- Empty README, no fallback")
        except Exception as e:
            error_msg = str(e)
            # Use fallback text for any download failure
            fallback = _build_fallback_text(ds)
            if fallback:
                record["card_text"] = fallback
                record["card_text_source"] = "fallback"

            if "gated" in error_msg.lower():
                print(f"- GATED (fallback: {'yes' if fallback else 'no'})")
            elif "404" in error_msg or "not found" in error_msg.lower():
                print(f"- No README (fallback: {'yes' if fallback else 'no'})")
            elif "private" in error_msg.lower():
                print(f"- PRIVATE (fallback: {'yes' if fallback else 'no'})")
            else:
                short_err = error_msg[:80]
                print(f"- ERROR: {short_err} (fallback: {'yes' if fallback else 'no'})")
            errors.append(f"{dataset_id}: {error_msg[:120]}")

        results.append(record)

    return results


def main() -> None:
    parser = argparse.ArgumentParser(description="Crawl HuggingFace for robotics datasets (v2)")
    parser.add_argument(
        "--limit", type=int, default=DEFAULT_LIMIT,
        help=f"Max datasets per pass (default: {DEFAULT_LIMIT})"
    )
    parser.add_argument(
        "--output", type=Path, default=DEFAULT_OUTPUT,
        help="Output JSON file path"
    )
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    api = HfApi()

    # Pass 1: Top downloads — captures canonical high-download datasets
    downloads_ds = fetch_datasets_pass(api, sort="downloads", limit=args.limit, label="Top Downloads")

    # Pass 2: Most recently modified — captures new and actively maintained datasets
    recent_limit = min(200, args.limit)
    recent_ds = fetch_datasets_pass(api, sort="lastModified", limit=recent_limit, label="Recently Modified")

    # Merge and deduplicate by dataset_id
    seen_ids: set[str] = set()
    merged: list = []
    for ds in downloads_ds:
        if ds.id not in seen_ids:
            seen_ids.add(ds.id)
            merged.append(ds)
    for ds in recent_ds:
        if ds.id not in seen_ids:
            seen_ids.add(ds.id)
            merged.append(ds)

    print(f"\nMerged: {len(merged)} unique datasets "
          f"({len(downloads_ds)} from downloads + {len(recent_ds)} from recent, "
          f"{len(downloads_ds) + len(recent_ds) - len(merged)} duplicates removed)")

    # Download READMEs for all
    print(f"\nDownloading READMEs for {len(merged)} datasets...")
    results = download_readmes(api, merged)

    # Summary
    readme_count = sum(1 for r in results if r["card_text_source"] == "readme")
    fallback_count = sum(1 for r in results if r["card_text_source"] == "fallback")
    no_text_count = sum(1 for r in results if r["card_text"] is None)

    print(f"\nDone. {len(results)} datasets crawled:")
    print(f"  {readme_count} with READMEs")
    print(f"  {fallback_count} with fallback text (tags/metadata)")
    print(f"  {no_text_count} with no text at all")

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"Saved to {args.output}")


if __name__ == "__main__":
    main()
