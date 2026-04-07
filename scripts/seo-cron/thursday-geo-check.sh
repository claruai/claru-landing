#!/bin/bash
# Thursday GEO Visibility Check — runs via crontab at 9am ET
set -euo pipefail

PROJECT_DIR="/Users/johnthomas/Desktop/important-coding-projects/claru-landing"
REPORT_DIR="$PROJECT_DIR/seo-reports"
DATE=$(date +%Y-%m-%d)
CLAUDE="/Users/johnthomas/.superset/bin/claude"

mkdir -p "$REPORT_DIR"

cd "$PROJECT_DIR"

$CLAUDE --print --dangerously-skip-permissions -p "You are the weekly GEO (Generative Engine Optimization) monitor for claru.ai. Do the following and write a report to seo-reports/geo-check-${DATE}.md:

1. Fetch https://claru.ai/robots.txt and verify GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Applebot-Extended are ALLOWED. Report exact rules for each.
2. Fetch https://claru.ai/llms.txt — check it loads (200), count entries, verify it includes hub pages: /glossary, /models, /guides, /compare, /solutions, /for, /datasets, /formats, /industries, /benchmarks.
3. Web search for Claru/claru.ai mentions in: 'best training data companies for robotics', 'physical AI training data providers', 'egocentric video data collection', 'RLHF annotation services'. Report which return mentions.
4. For the same queries, note which competitors appear (Scale AI, Appen, Labelbox, iMerit, Surge AI).
5. Fetch the homepage HTML and check for JSON-LD structured data (Organization, FAQPage).
6. Write the full report to seo-reports/geo-check-${DATE}.md.

Do NOT push any changes to git."
