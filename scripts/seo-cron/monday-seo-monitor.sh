#!/bin/bash
# Monday SEO Monitor — runs via crontab at 9am ET
set -euo pipefail

PROJECT_DIR="/Users/johnthomas/Desktop/important-coding-projects/claru-landing"
REPORT_DIR="$PROJECT_DIR/seo-reports"
DATE=$(date +%Y-%m-%d)
CLAUDE="/Users/johnthomas/.superset/bin/claude"

mkdir -p "$REPORT_DIR"

cd "$PROJECT_DIR"

$CLAUDE --print --dangerously-skip-permissions -p "You are the weekly SEO monitor for claru.ai. Do the following and write a report to seo-reports/weekly-monitor-${DATE}.md:

1. Fetch https://claru.ai/sitemap.xml with curl and count total URLs. Break down by section (/glossary/*, /models/*, /guides/*, /compare/*, etc).
2. Fetch https://claru.ai/robots.txt and verify no accidental blocks on hub routes, AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are allowed, training crawlers are blocked.
3. Spot-check 10 random pages from the sitemap — curl each and report HTTP status codes. Flag any non-200.
4. Verify these critical pages return 200: /, /glossary, /compare, /solutions, /guides, /for, /models, /llms.txt
5. Read src/app/sitemap.ts and count URL generators. Cross-reference with live sitemap count.
6. Write the full report to seo-reports/weekly-monitor-${DATE}.md with findings and recommended fixes.

Do NOT push any changes to git."
