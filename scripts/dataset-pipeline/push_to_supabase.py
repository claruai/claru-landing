#!/usr/bin/env python3
"""
push_to_supabase.py — Upsert enriched pipeline data into the oss_datasets table.

Reads enriched_v2.json (or enriched_with_social.json if available),
transforms each record into the oss_datasets schema, and upserts via
the Supabase service role key.

Usage:
    python push_to_supabase.py [--dry-run]
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: supabase-py not installed. Run: pip install supabase")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR / "output"

# Try enriched_with_social.json first (has social signals), fall back to enriched_v2.json
ENRICHED_FILE = OUTPUT_DIR / "enriched_with_social.json"
if not ENRICHED_FILE.exists():
    ENRICHED_FILE = OUTPUT_DIR / "enriched_v2.json"

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

BATCH_SIZE = 50  # Supabase upsert batch size

# Fields used to compute extraction_completeness
EXTRACTION_FIELDS = [
    "name", "description", "modalities", "robot_embodiments", "action_space",
    "environment_type", "task_types", "num_episodes", "total_hours", "license",
    "annotation_types", "data_format", "year_released", "paper_url",
    "physical_ai_relevance", "parent_project",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def make_slug(dataset_id: str) -> str:
    """Generate URL-safe slug from HuggingFace dataset_id."""
    slug = dataset_id.lower()
    slug = slug.replace("/", "-")
    slug = re.sub(r"[^a-z0-9\-]", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    slug = slug.strip("-")
    return slug


def compute_completeness(extraction: dict) -> float:
    """Fraction of non-null extraction fields (0.0 to 1.0)."""
    if not extraction:
        return 0.0
    filled = sum(
        1 for f in EXTRACTION_FIELDS
        if extraction.get(f) is not None
        and extraction.get(f) != []
        and extraction.get(f) != ""
    )
    return round(filled / len(EXTRACTION_FIELDS), 3)


def safe_array(val) -> list:
    """Ensure value is a list (or empty list if None)."""
    if val is None:
        return []
    if isinstance(val, list):
        return val
    return [val]


def safe_int(val):
    """Convert to int or None."""
    if val is None:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


def transform_record(raw: dict) -> dict:
    """Transform a pipeline record into an oss_datasets row."""
    ext = raw.get("extraction", {}) or {}
    dataset_id = raw["dataset_id"]

    # Parse last_modified
    hf_last_modified = None
    if raw.get("last_modified"):
        try:
            hf_last_modified = raw["last_modified"]
        except Exception:
            pass

    row = {
        "dataset_id": dataset_id,
        "slug": make_slug(dataset_id),
        "name": ext.get("name") or dataset_id.split("/")[-1],
        "description": ext.get("description"),
        "parent_project": ext.get("parent_project"),
        "author": raw.get("author"),
        "modalities": safe_array(ext.get("modalities")),
        "robot_embodiments": safe_array(ext.get("robot_embodiments")),
        "action_space": ext.get("action_space"),
        "environment_type": safe_array(ext.get("environment_type")),
        "task_types": safe_array(ext.get("task_types")),
        "num_episodes": ext.get("num_episodes"),
        "total_hours": ext.get("total_hours"),
        "license": ext.get("license"),
        "annotation_types": safe_array(ext.get("annotation_types")),
        "data_format": ext.get("data_format"),
        "year_released": safe_int(ext.get("year_released")),
        "paper_url": ext.get("paper_url"),
        "physical_ai_relevance": ext.get("physical_ai_relevance"),
        "hf_downloads": raw.get("downloads", 0),
        "hf_likes": raw.get("likes", 0),
        "hf_last_modified": hf_last_modified,
        "hf_created_at": raw.get("created_at"),
        "hf_tags": safe_array(raw.get("tags")),
        "is_active": True,
        "is_gated": False,
        "is_private": False,
        "extraction_completeness": compute_completeness(ext),
        "card_text_source": "readme" if raw.get("extraction_success") else "fallback",
        "last_crawled_at": datetime.utcnow().isoformat(),
    }

    # Social signals — nested under "social_signals" key from social_signals.py
    ss = raw.get("social_signals", {})
    if ss:
        row["citation_count"] = ss.get("citation_count")
        row["citing_papers_sample"] = ss.get("citing_papers_sample", [])
        row["hf_discussion_count"] = ss.get("hf_discussion_count", 0)
        row["hf_discussions_sample"] = ss.get("hf_discussions_sample", [])
        row["reddit_posts"] = ss.get("reddit_posts", [])
        row["hn_posts"] = ss.get("hn_posts", [])
        row["hf_downloads_rank"] = ss.get("hf_downloads_rank")
    # Also handle flat keys for backwards compatibility
    elif "reddit_posts" in raw:
        row["reddit_posts"] = raw["reddit_posts"]
        row["hn_posts"] = raw.get("hn_posts", [])
        row["citation_count"] = raw.get("citation_count")

    return row


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    dry_run = "--dry-run" in sys.argv

    if not SUPABASE_URL:
        print("ERROR: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL env var required")
        sys.exit(1)
    if not SUPABASE_KEY:
        print("ERROR: SUPABASE_SERVICE_ROLE_KEY env var required")
        sys.exit(1)

    print(f"Loading data from: {ENRICHED_FILE}")
    with open(ENRICHED_FILE) as f:
        raw_data = json.load(f)

    print(f"Total records: {len(raw_data)}")

    # Transform all records
    rows = []
    slug_set = set()
    for raw in raw_data:
        row = transform_record(raw)
        # Handle slug collisions (rare but possible); author may be None
        if row["slug"] in slug_set:
            suffix = row.get("author") or row["dataset_id"].split("/")[0]
            row["slug"] = row["slug"] + "-" + suffix
        slug_set.add(row["slug"])
        rows.append(row)

    print(f"Transformed: {len(rows)} rows")

    if dry_run:
        print("\n[DRY RUN] Would upsert the following sample:")
        print(json.dumps(rows[0], indent=2, default=str))
        print(f"\n[DRY RUN] Total rows: {len(rows)}")
        return

    # Connect to Supabase
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Upsert in batches
    inserted = 0
    errors = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        try:
            result = supabase.table("oss_datasets").upsert(
                batch,
                on_conflict="dataset_id",
            ).execute()
            inserted += len(batch)
            print(f"  Batch {i // BATCH_SIZE + 1}: upserted {len(batch)} rows")
        except Exception as e:
            errors += len(batch)
            print(f"  Batch {i // BATCH_SIZE + 1}: ERROR — {e}")

    print(f"\nDone. Upserted: {inserted}, Errors: {errors}")

    # Verify
    result = supabase.table("oss_datasets").select("id", count="exact").execute()
    print(f"Total rows in oss_datasets: {result.count}")


if __name__ == "__main__":
    main()
