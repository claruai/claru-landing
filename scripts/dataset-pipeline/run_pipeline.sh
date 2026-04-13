#!/bin/bash
set -e
cd "$(dirname "$0")"
source .venv/bin/activate
# Inject env vars from .env.local if not already in environment (local dev only)
ENV_FILE="$(dirname "$0")/../../.env.local"
if [ -f "$ENV_FILE" ]; then
  for var in ANTHROPIC_API_KEY SUPABASE_URL NEXT_PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY REVALIDATION_SECRET; do
    if [ -z "${!var}" ]; then
      val=$(grep "^${var}=" "$ENV_FILE" | cut -d= -f2-)
      if [ -n "$val" ]; then
        export "$var=$val"
      fi
    fi
  done
fi
mkdir -p output

echo "=== Step 1: Crawling HuggingFace (v2 — downloads + recent) ==="
python crawl_hf.py --limit 300 --output output/hf_robotics_raw_v2.json

echo ""
echo "=== Step 2: Extracting metadata (incremental — reuses v1 extractions) ==="
python extract_metadata.py --input output/hf_robotics_raw_v2.json --output output/enriched_v2.json --existing output/enriched_datasets.json

echo ""
echo "=== Step 3: Social signals (Reddit + HN + Semantic Scholar) ==="
python social_signals.py --input output/enriched_v2.json --output output/enriched_with_social.json

echo ""
echo "=== Step 4: QA scoring ==="
python qa_score.py --input output/enriched_with_social.json

echo ""
echo "=== Step 5: Generating report ==="
python report.py --input output/enriched_with_social.json --output output/dataset_report_v2.md

echo ""
echo "=== Step 6: Push to Supabase ==="
if [ "${SKIP_PUSH:-}" = "1" ]; then
  echo "  Skipped (SKIP_PUSH=1)"
else
  python push_to_supabase.py
fi

echo ""
echo "=== Step 7: Revalidate ISR pages ==="
SITE_URL="${SITE_URL:-https://claru.ai}"
if [ -n "$REVALIDATION_SECRET" ] && [ "${SKIP_PUSH:-}" != "1" ]; then
  curl -sf -X POST "$SITE_URL/api/revalidate" \
    -H "Content-Type: application/json" \
    -H "x-revalidation-secret: $REVALIDATION_SECRET" \
    -d '{"path": "/datasets"}' && echo "  Revalidated /datasets" || echo "  Warning: revalidation failed"
else
  echo "  Skipped (no REVALIDATION_SECRET or SKIP_PUSH=1)"
fi

echo ""
echo "=== Pipeline v2 complete ==="
echo "Outputs:"
echo "  output/hf_robotics_raw_v2.json    — raw crawl data"
echo "  output/enriched_v2.json           — extracted metadata"
echo "  output/enriched_with_social.json  — with social signals"
echo "  output/qa_report.md               — QA scoring report"
echo "  output/dataset_report_v2.md       — final report"
