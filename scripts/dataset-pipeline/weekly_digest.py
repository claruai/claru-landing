#!/usr/bin/env python3
"""
Weekly Dataset Digest — "Physical AI Dataset Radar"

Queries Supabase for datasets added in the last 7 days, scores them,
asks Claude Haiku to pick the top 4-5 with short "why it matters" blurbs,
builds a branded HTML email, and sends it via Resend broadcast API.

Usage:
  python weekly_digest.py              # generate and send
  python weekly_digest.py --dry-run    # generate but don't send

Env vars:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY,
  RESEND_API_KEY, RESEND_DIGEST_SEGMENT_ID
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import anthropic
import requests
from supabase import create_client

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

RESEND_BASE = "https://api.resend.com"
FROM_EMAIL = "Claru AI <digest@claru.ai>"
MIN_DATASETS = 2
TOP_CANDIDATES = 15

# Design tokens
BG_PRIMARY = "#0a0908"
CARD_BG = "#121210"
BORDER = "#2a2a28"
ACCENT = "#92B090"
TEXT_PRIMARY = "#FFFFFF"
TEXT_SECONDARY = "#888888"
TEXT_BODY = "#e8e8e8"

# ---------------------------------------------------------------------------
# Supabase: fetch new datasets from last 7 days
# ---------------------------------------------------------------------------


def fetch_recent_datasets() -> list[dict]:
    url = os.environ.get("SUPABASE_URL") or os.environ["NEXT_PUBLIC_SUPABASE_URL"]
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    sb = create_client(url, key)

    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()

    # Prefer hf_created_at (true HF publish date) with created_at as fallback
    resp = (
        sb.table("oss_datasets")
        .select("*")
        .or_(f"hf_created_at.gte.{week_ago},and(hf_created_at.is.null,created_at.gte.{week_ago})")
        .execute()
    )
    return resp.data or []


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------


def score_dataset(ds: dict) -> float:
    downloads = ds.get("hf_downloads") or 0
    citations = ds.get("citation_count") or 0
    discussions = ds.get("hf_discussion_count") or 0
    reddit_posts = ds.get("reddit_posts") or []
    if isinstance(reddit_posts, str):
        try:
            reddit_posts = json.loads(reddit_posts)
        except (json.JSONDecodeError, TypeError):
            reddit_posts = []
    return downloads + (citations * 50) + (discussions * 10) + len(reddit_posts) * 20


# ---------------------------------------------------------------------------
# Claude Haiku: pick top datasets + write blurbs
# ---------------------------------------------------------------------------


def pick_and_describe(candidates: list[dict]) -> list[dict]:
    client = anthropic.Anthropic()

    summaries = []
    for ds in candidates:
        summaries.append(
            {
                "name": ds.get("name", ""),
                "slug": ds.get("slug", ""),
                "description": (ds.get("description") or "")[:300],
                "hf_downloads": ds.get("hf_downloads") or 0,
                "citation_count": ds.get("citation_count") or 0,
                "modalities": ds.get("modalities") or [],
                "task_types": ds.get("task_types") or [],
                "score": ds.get("_score", 0),
            }
        )

    prompt = f"""You are the editor of "Physical AI Dataset Radar" — a weekly email that robotics ML engineers actually look forward to opening. Your readers build manipulation policies, VLA models, and world models at frontier labs.

{len(summaries)} new robotics datasets dropped this week. Here they are (pre-scored by community signals):

{json.dumps(summaries, indent=2)}

Write two things:

1. **weekly_summary** (2-3 sentences): The big-picture takeaway. What themes emerged? What shifted? Lead with the most interesting signal — don't start with "This week saw..." or any generic opener. Be specific. If NVIDIA released 3 datasets in one week, say that. If egocentric data is suddenly everywhere, call it out. Write like you're briefing a colleague over coffee, not writing a press release.

2. **picks** (4-5 datasets): The ones your reader would regret missing. For each, write a "why_it_matters" blurb (2-3 sentences). Be concrete — mention scale (episode counts, hours), what makes it unique vs existing datasets, and what you'd actually train on it. Skip filler words. Every sentence should teach the reader something.

Return ONLY valid JSON (no markdown fences):
{{"weekly_summary": "...", "picks": [{{"name": "...", "slug": "...", "why_it_matters": "...", "modalities": [...]}}]}}"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )

    text = message.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[: text.rfind("```")]
        text = text.strip()

    result = json.loads(text)
    return result.get("weekly_summary", ""), result.get("picks", [])


# ---------------------------------------------------------------------------
# HTML email builder
# ---------------------------------------------------------------------------


def build_email_html(picks: list[dict], week_label: str, weekly_summary: str, total_new: int) -> str:
    dataset_rows = ""
    for i, ds in enumerate(picks):
        modality_tags = ""
        for mod in (ds.get("modalities") or [])[:4]:
            modality_tags += (
                f'<span style="display:inline-block;border:1px solid {ACCENT}40;'
                f"border-radius:12px;padding:2px 8px;font-size:11px;color:{ACCENT};"
                f"font-family:'JetBrains Mono','Courier New',monospace;margin-right:4px;"
                f'margin-bottom:4px;">{mod}</span>'
            )

        border_top = f"border-top:1px solid {BORDER};" if i > 0 else ""

        dataset_rows += f"""
        <tr>
          <td style="padding:24px 0;{border_top}">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:16px;font-weight:700;color:{TEXT_PRIMARY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                    {ds['name']}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0 12px 0;">
                  <p style="margin:0;font-size:14px;line-height:1.7;color:{TEXT_BODY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                    {ds['why_it_matters']}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:16px;">{modality_tags}</td>
                      <td>
                        <a href="https://claru.ai/datasets/{ds['slug']}"
                           style="font-size:12px;font-weight:600;color:{ACCENT};text-decoration:none;font-family:'JetBrains Mono','Courier New',monospace;border:1px solid {ACCENT};border-radius:4px;padding:4px 12px;display:inline-block;">
                          View Dataset &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Physical AI Dataset Radar &mdash; {week_label}</title>
</head>
<body style="margin:0;padding:0;background-color:{BG_PRIMARY};font-family:'JetBrains Mono','Courier New',monospace;color:{TEXT_PRIMARY};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:{BG_PRIMARY};padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <span style="font-size:13px;letter-spacing:3px;color:{ACCENT};text-transform:uppercase;font-family:'JetBrains Mono','Courier New',monospace;">CLARU AI</span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color:{CARD_BG};border:1px solid {BORDER};border-radius:8px;padding:32px 32px 28px 32px;">

              <!-- Title block -->
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:{TEXT_SECONDARY};text-transform:uppercase;font-family:'JetBrains Mono','Courier New',monospace;">
                PHYSICAL AI DATASET RADAR &middot; {week_label}
              </p>
              <h1 style="margin:0 0 20px 0;font-size:22px;font-weight:700;color:{TEXT_PRIMARY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                {total_new} new robotics datasets dropped this week. Here are the ones that matter.
              </h1>

              <!-- Weekly summary -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
                <tr>
                  <td style="border-left:3px solid {ACCENT};padding:12px 16px;background-color:rgba(146,176,144,0.06);border-radius:0 6px 6px 0;">
                    <p style="margin:0;font-size:14px;line-height:1.7;color:{TEXT_BODY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                      {weekly_summary}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Sponsor inline -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                <tr>
                  <td style="background-color:rgba(146,176,144,0.04);border:1px solid {BORDER};border-radius:6px;padding:16px 20px;">
                    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:2px;color:{TEXT_SECONDARY};text-transform:uppercase;font-family:'JetBrains Mono','Courier New',monospace;">
                      BROUGHT TO YOU BY CLARU
                    </p>
                    <p style="margin:0;font-size:13px;line-height:1.6;color:{TEXT_BODY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                      Need training data for robotics, video, or multimodal AI? We collect, curate, and annotate purpose-built datasets for frontier labs.
                      <a href="https://claru.ai/#contact" style="color:{ACCENT};text-decoration:none;font-weight:600;"> Talk to our team &rarr;</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Section label -->
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:{TEXT_SECONDARY};text-transform:uppercase;font-family:'JetBrains Mono','Courier New',monospace;">
                THIS WEEK'S PICKS
              </p>

              <!-- Datasets -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                {dataset_rows}
              </table>

              <!-- Browse all CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;">
                <tr>
                  <td style="background-color:{ACCENT};border-radius:6px;">
                    <a href="https://claru.ai/datasets?sort=recent"
                       target="_blank"
                       style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:{BG_PRIMARY};text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                      Browse All {total_new}+ New Datasets
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:12px;color:{TEXT_SECONDARY};">
                You received this because you subscribed to the Physical AI Dataset Radar.
              </p>
              <p style="margin:0 0 12px 0;font-size:11px;color:#444444;">
                Claru AI &mdash; Expert Human Intelligence for AI Labs
              </p>
              <p style="margin:0;">
                <a href="{{{{RESEND_UNSUBSCRIBE_URL}}}}"
                   style="font-size:11px;color:#555555;text-decoration:underline;">
                  Unsubscribe
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


# ---------------------------------------------------------------------------
# Resend broadcast
# ---------------------------------------------------------------------------


def send_broadcast(subject: str, html: str) -> dict:
    api_key = os.environ["RESEND_API_KEY"]
    segment_id = os.environ["RESEND_DIGEST_SEGMENT_ID"]
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    # 1. Create broadcast
    create_resp = requests.post(
        f"{RESEND_BASE}/broadcasts",
        headers=headers,
        json={
            "segment_id": segment_id,
            "from": FROM_EMAIL,
            "subject": subject,
            "html": html,
            "name": f"Dataset Radar — {subject}",
        },
    )
    create_resp.raise_for_status()
    broadcast = create_resp.json()
    broadcast_id = broadcast["id"]
    print(f"  Created broadcast {broadcast_id}")

    # 2. Send broadcast
    send_resp = requests.post(
        f"{RESEND_BASE}/broadcasts/{broadcast_id}/send",
        headers=headers,
    )
    send_resp.raise_for_status()
    print(f"  Sent broadcast {broadcast_id}")

    return {"broadcast_id": broadcast_id, "status": "sent"}


# ---------------------------------------------------------------------------
# Save digest
# ---------------------------------------------------------------------------


def save_digest(picks: list[dict], week_label: str, weekly_summary: str, broadcast_result: dict | None):
    output_dir = Path(__file__).parent / "output" / "digests"
    output_dir.mkdir(parents=True, exist_ok=True)

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    out_path = output_dir / f"{date_str}.json"

    payload = {
        "week_label": week_label,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "weekly_summary": weekly_summary,
        "picks": picks,
        "broadcast": broadcast_result,
    }

    out_path.write_text(json.dumps(payload, indent=2, default=str))
    print(f"  Saved digest to {out_path}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="Weekly Dataset Digest")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Generate everything but don't send the email",
    )
    args = parser.parse_args()

    # Monday of the current week
    now = datetime.now(timezone.utc)
    monday = now - timedelta(days=now.weekday())
    week_label = monday.strftime("%b %d")

    print(f"=== Physical AI Dataset Radar — Week of {week_label} ===\n")

    # 1. Fetch recent datasets
    print("1. Fetching datasets from last 7 days...")
    datasets = fetch_recent_datasets()
    print(f"   Found {len(datasets)} new datasets")

    if len(datasets) < MIN_DATASETS:
        print(f"\n   Fewer than {MIN_DATASETS} new datasets — skipping digest.")
        sys.exit(0)

    # 2. Score and rank
    print("2. Scoring datasets...")
    for ds in datasets:
        ds["_score"] = score_dataset(ds)
    datasets.sort(key=lambda d: d["_score"], reverse=True)
    candidates = datasets[:TOP_CANDIDATES]
    print(f"   Top {len(candidates)} candidates selected")

    # 3. Claude picks + blurbs
    print("3. Asking Claude to pick top datasets and write blurbs...")
    weekly_summary, picks = pick_and_describe(candidates)
    print(f"   {len(picks)} datasets selected for digest")
    print(f"   Summary: {weekly_summary[:80]}...")

    # 4. Build email
    print("4. Building HTML email...")
    subject = f"Physical AI Dataset Radar — Week of {week_label}"
    html = build_email_html(picks, week_label, weekly_summary, len(datasets))

    # 5. Send or dry-run
    broadcast_result = None
    if args.dry_run:
        print("5. DRY RUN — skipping email send")
        # Save HTML preview
        preview_dir = Path(__file__).parent / "output" / "digests"
        preview_dir.mkdir(parents=True, exist_ok=True)
        preview_path = preview_dir / f"{now.strftime('%Y-%m-%d')}-preview.html"
        preview_path.write_text(html)
        print(f"   HTML preview saved to {preview_path}")
    else:
        print("5. Sending broadcast via Resend...")
        broadcast_result = send_broadcast(subject, html)

    # 6. Save digest JSON
    print("6. Saving digest...")
    save_digest(picks, week_label, weekly_summary, broadcast_result)

    print("\nDone.")


if __name__ == "__main__":
    main()
