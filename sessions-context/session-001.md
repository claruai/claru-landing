# Session 001 — 2026-03-25

## Summary
Massive infrastructure session covering PostHog analytics for the client portal, Supabase RLS security hardening, complete legacy table migration (dataset_samples/video_index to clips/dataset_clips), embedding rebuild for 1M+ clips to 100% search coverage, Bellwood dashcam dataset ingestion (300 clips from Dropbox to S3), candidate testing fraud detection dataset ingestion (1,835 clips), Gemini vision enrichment pipelines, and bounding box infrastructure detection via Gemini 2.5 Flash. Also set up FAL MCP globally.

## What We Built / Changed

### PostHog Analytics (deployed to prod via PRs #36-40)
- Created `src/app/components/portal/PortalIdentify.tsx` — identifies portal users in PostHog with name, company, lead_status, datasets_count
- Created `src/app/components/portal/DatasetViewTracker.tsx` — fires `dataset_viewed` event
- Added `portal_login` event to `src/app/portal/login/page.tsx`
- Added `sample_opened` event to `src/app/portal/catalog/[id]/SampleGallery.tsx`
- Added `custom_request_submitted` server-side event to `src/app/portal/request/actions.ts`
- Added `posthog.reset()` on sign-out in `src/app/portal/PortalNav.tsx`
- Added `NEXT_PUBLIC_POSTHOG_KEY` to `.env.example`

### Bug Fixes (deployed via PRs #39, #41, #42)
- Fixed `CatalogSearchClient.tsx` — "Create New" and "Add to Catalog" tabs sending `items` instead of `clip_ids` to `/api/admin/catalog/custom`
- Fixed `/api/admin/catalog/custom/route.ts` — `upsert` with `onConflict` failing silently because Supabase client string doesn't match COALESCE-based unique index; switched to plain insert with pre-check

### RLS Security (applied directly to prod DB)
- Revoked INSERT/UPDATE/DELETE/TRUNCATE from `anon` role on all 9 public tables
- Revoked INSERT/UPDATE/DELETE/TRUNCATE from `authenticated` role (except INSERT on custom_requests, UPDATE on leads)
- Verified via Playwright UAT — all portal flows work, all write operations blocked for anon

### Legacy Table Migration (PR #51, merged to staging)
- Migrated ALL 22 runtime `from("dataset_samples")` and `from("video_index")` references to `clips` + `dataset_clips`
- 6 commits across 15+ files:
  - `custom-samples/route.ts` + `bulk/route.ts` — accept `clip_id` instead of legacy IDs, fix live bug
  - `portal/page.tsx` — viewable count from `dataset_clips`
  - `enrichment/status/route.ts` + `run/route.ts` — all count queries migrated
  - `subcategories/route.ts` — `video_index` to `clips`
  - `VideoShowcase.tsx`, `DataPreview.tsx` + clients — `DatasetSample` to `Clip` type
  - `catalog/[id]/samples/route.ts` POST — 3 insert modes now upsert `clips` + `dataset_clips`
  - `catalog/[id]/samples/bulk/route.ts` POST — batch insert migrated
  - `admin/leads/[id]/page.tsx` — custom samples from `dataset_clips`
  - UUID remapping in `egocentric-video-data.ts`, `parametric/page.tsx`, `general-intuition/page.tsx`
- Code review findings fixed: TOCTOU race condition in upsertClip (catch 23505), bulk count fix, stale comments, dead types

### Embedding Rebuild (completed)
- Ran `scripts/rebuild-clip-captions.py` with 10 parallel workers split by s3_key range
- 290,937 clips got embeddings in ~1.5 hours (down from 115 hour estimate with 1 worker)
- Coverage: 72.2% → 100.0% (1,045,255 of 1,045,408 with embeddings)

### Bellwood Dashcam Dataset (ingested + enriching)
- Transferred 300 files (455 GB) from Dropbox shared folder to `s3://moonvalley-annotation-platform/bellwood-dashcam/` via EC2 streaming script (~$0.50 EC2 cost)
- Set up rclone globally with Dropbox OAuth (shared folders via namespace)
- Created "Bellwood Municipal Dashcam Collection" dataset in DB with "Municipal / Government" category
- Ingested 300 clips with parsed metadata (driver, date, sequence from filenames)
- 6 showcase clips marked across different drivers
- Caption enrichment running (53/300 done at session end, ~247 remaining)
- Bounding box detection running (91/300 done, detecting cracked roads, faded markings, broken sidewalks, litter)
- Tested Gemini 2.5 Flash bounding box detection: 5 frames, 22 infrastructure detections, annotated overlay images generated

### Candidate Testing Dataset (ingested + enriching)
- Analyzed `candidate-testing/completed/` — 1,835 annotated video clips for interview fraud detection
- 3 main categories: No Face (1,050), Multiple Faces (452), Secondary Face (333)
- 19 subcategories including hand obstruction, face masks, clothing changes, spectacle swaps, hairstyle changes
- Ingested 1,715 clips (117 failed — folders with no video), 6 showcase clips
- Created "Interview Fraud Detection" dataset with "Identity Verification" category
- Caption enrichment started (1,715 clips queued)

### FAL MCP Setup
- Added FAL MCP server globally: `claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp`
- FAL_KEY saved to `.env.local`
- Tested: `search_models`, `recommend_model`, `get_model_schema`, `submit_job`, `upload_file`
- Found Florence-2 OVD and SAM 3 Video on FAL for object detection

### SentrySearch Analysis
- Reviewed https://github.com/ssrajadh/sentrysearch — native video embedding via Gemini Embedding 2
- Key learning: Gemini can embed raw video directly into 768-dim space (same as text), skipping caption step
- Relevant for future: overlapping chunk strategy, still-frame detection, preprocessing for bandwidth

## Key Decisions Made
- **RLS approach**: Revoke grants rather than add restrictive policies — existing RLS policies already enforce row-level access, the vulnerability was overly permissive table-level grants
- **Legacy migration order**: Low-risk reads first (portal count, enrichment dashboard), then high-risk writes (catalog POST routes), then atomic deploy (custom samples system)
- **Embedding parallelization**: 10 workers split by s3_key range reduced 115 hours to 1.5 hours
- **Bellwood transfer**: EC2 in us-east-1 streaming via Python (Dropbox API → S3 multipart) instead of rclone (shared folder access broken)
- **Enrichment approach**: Single frame at 50% of video duration via Gemini 2.5 Flash — cheapest and fastest
- **Bounding box storage**: Infrastructure detections stored in `ai_enrichment_json` on each clip
- **Candidate testing**: Classification dataset, not detection — each clip gets one category label, stored in `ann_metadata`

## Technical Details
- `upsertClip` helper catches Postgres error code 23505 (unique violation) for TOCTOU race conditions
- Supabase client `onConflict` string doesn't match COALESCE-based unique indexes — use plain insert with pre-check instead
- `source .env.local` doesn't export vars in subshells — use `export $(grep -v '^#' .env.local | grep -v '^$' | xargs) 2>/dev/null`
- Gemini 2.0 Flash deprecated — use `gemini-2.5-flash` with new `google.genai` SDK (not deprecated `google.generativeai`)
- Gemini bbox detection returns `[y_min, x_min, y_max, x_max]` in 0-1000 range — Y comes first
- Set `thinking_budget=0` and `temperature=0.5` for faster bbox detection
- `dataset_clips` unique index uses COALESCE: `UNIQUE(dataset_id, clip_id, COALESCE(lead_id, '00000000-...'))`
- Dropbox shared folders need namespace ID via API, not just `shared_folders=true` in rclone config

## Data & Metrics
- **Clips table**: 1,045,408 total → 100% embedding coverage (was 72.2%)
- **Bellwood**: 300 clips, 455 GB, 5 drivers, 10 days, ~75 hours footage
- **Candidate testing**: 1,835 annotations, 1,715 videos, ~209 GB, 19 fraud subcategories
- **Embedding rebuild rate**: ~2,500-3,400 clips/min with 10 parallel workers
- **Bellwood enrichment rate**: ~4 clips/min (caption) + ~12 clips/min (bbox) — bottlenecked by S3 download of large files
- **Gemini bbox cost**: <$0.01 for 5 frames
- **EC2 transfer cost**: ~$0.50 total (c5.xlarge for ~1 hour)
- **PostHog key**: `phc_aFuVsaSodRF53kKxdlSWYRHbWSsCyGOfE05KTRltOR3` (needs adding to Vercel env vars)

## Current State
- **Branch**: `brook-wildflower` at commit `b370938`
- **PR #51**: Merged to staging (legacy migration + code review fixes)
- **Staging → main merge**: Not yet done — should UAT on staging first
- **Bellwood enrichment**: Caption (53/300) + Bbox (91/300) running in background
- **Candidate enrichment**: Caption (starting, 1,715 clips) running in background
- **Embedding rebuild**: Will need to run for Bellwood + Candidate clips after captions finish
- **Vercel env**: `NEXT_PUBLIC_POSTHOG_KEY` still needs adding
- **EC2 cleaned up**: Instance terminated, SG deleted, key pair deleted

## Next Steps
1. **Wait for enrichments to complete** — Bellwood captions + bboxes (~30 min), Candidate captions (~45 min)
2. **Run embedding rebuild** for Bellwood (300) + Candidate (1,715) clips
3. **Merge staging → main** after enrichment + UAT
4. **Build Bellwood case study** — Remotion composition with bbox overlays, case study page
5. **Build Candidate Testing case study** — fraud detection visualization
6. **Add `NEXT_PUBLIC_POSTHOG_KEY` to Vercel** for production PostHog tracking
7. **Drop legacy tables** — `video_index` and `dataset_samples` can be dropped now that all code is migrated
8. **Vision enrichment** for 25k captionless clips in `moonvalley-annotation-platform` bucket
9. **mv-protege-external** — 79k raw videos, separate loader project
