#!/usr/bin/env python3
"""
Fetch existing dataset extractions from Supabase so extract_metadata.py
can skip already-processed datasets. Only re-extracts genuinely new ones.

Usage:
    python fetch_existing.py [--output PATH]

Requires:
    SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
"""

import argparse
import json
import os
import sys
from pathlib import Path

try:
    from supabase import create_client
except ImportError:
    print("ERROR: supabase-py not installed. Run: pip install supabase")
    sys.exit(1)

OUTPUT_FILE = Path(__file__).parent / "output" / "existing_from_supabase.json"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=OUTPUT_FILE)
    args = parser.parse_args()

    url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required")
        sys.exit(1)

    client = create_client(url, key)

    print("Fetching existing datasets from Supabase...")
    rows = []
    offset = 0
    batch = 1000
    while True:
        resp = client.table("oss_datasets").select(
            "hf_id, name, description, modalities, robot_embodiments, "
            "environment_type, task_types, license, data_format, "
            "extraction_completeness"
        ).eq("is_active", True).range(offset, offset + batch - 1).execute()
        rows.extend(resp.data)
        if len(resp.data) < batch:
            break
        offset += batch

    existing = []
    for row in rows:
        if not row.get("hf_id"):
            continue
        extraction = {
            "name": row.get("name"),
            "description": row.get("description"),
            "modalities": row.get("modalities"),
            "robot_embodiments": row.get("robot_embodiments"),
            "environment_type": row.get("environment_type"),
            "task_types": row.get("task_types"),
            "license": row.get("license"),
            "data_format": row.get("data_format"),
        }
        existing.append({
            "dataset_id": row["hf_id"],
            "extraction": extraction,
            "extraction_success": True,
        })

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w") as f:
        json.dump(existing, f)

    print(f"Exported {len(existing)} existing extractions to {args.output}")


if __name__ == "__main__":
    main()
