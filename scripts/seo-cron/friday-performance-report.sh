#!/bin/bash
# Friday SEO Performance Report — runs via crontab at 4pm ET
set -euo pipefail

PROJECT_DIR="/Users/johnthomas/Desktop/important-coding-projects/claru-landing"
REPORT_DIR="$PROJECT_DIR/seo-reports"
DATE=$(date +%Y-%m-%d)
CLAUDE="/Users/johnthomas/.superset/bin/claude"

mkdir -p "$REPORT_DIR"

cd "$PROJECT_DIR"

$CLAUDE --print --dangerously-skip-permissions -p "You are the weekly SEO performance analyst for claru.ai (~500 programmatic pages across 10 playbooks). Do the following and write a report to seo-reports/performance-${DATE}.md:

1. Fetch https://claru.ai/sitemap.xml and count URLs by section: /glossary/*, /models/*, /guides/*, /training-data/*, /datasets/*, /formats/*, /industries/*, /for/*, /benchmarks/*, /compare/*, /solutions/*, /blog/*, /case-studies/*, other. Report TOTAL.
2. Spot-check 20 random URLs across sections — curl each, report status codes.
3. For 5 random pages, fetch HTML and check: <title> exists, meta description exists, H1 exists, JSON-LD structured data exists, estimate word count. Flag pages under 500 words.
4. Web search these competitive queries and note where claru.ai appears vs competitors: 'AI training data for robotics', 'egocentric video dataset provider', 'RLHF annotation company', 'Scale AI alternatives for robotics data', 'physical AI training data'.
5. Fetch homepage HTML and count internal links. Check if hub pages are linked from footer/nav.
6. Write the full report to seo-reports/performance-${DATE}.md with top 5 action items for next week.

Do NOT push any changes to git."
