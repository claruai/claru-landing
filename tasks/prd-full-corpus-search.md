# PRD: Full Corpus Semantic Search (Phase 2)

> **Prerequisite:** Phase 1 (`tasks/prd-catalog-enrichment-mcp.md`) must be completed and tested before starting Phase 2. Phase 2 is additive — it does not modify Phase 1 infrastructure.

## Introduction

Phase 1 covers the ~300 curated samples in the portal catalog. Phase 2 extends semantic search to the **full S3 video corpus** — **~1.3M+ videos** across 6 accessible buckets.

**Key discovery:** The cobry enrichment pipeline has already generated rich multi-layer captions (detailed description, background, foreground, middleground, short summary) for most videos in parquet format. We don't need Gemini for the vast majority of the corpus — we just embed the existing caption text.

### Corpus Breakdown (from bucket exploration 2026-03-20)

| Tier | Bucket | Videos | Existing Metadata | Method | Est. Cost |
|---|---|---|---|---|---|
| **Tier 2a** | mv-abaka-external | ~800k | Cobry captions parquets: `text`, `text_short`, `text_background`, `text_foreground`, `text_middleground` per video | Embed caption text | ~$3 |
| **Tier 2b** | mv-artlist-external | ~200k+ | Cobry captions + quality_assessment + cinematic_eval parquets | Embed caption text | ~$1.50 |
| **Tier 3a** | mv-troveo | ~112k+ | Per-video metadata JSON (`metadata/*.json`) + pre-computed 256-dim embeddings (incompatible — different model) + quality assessment | Embed metadata text | ~$0.50 |
| **Tier 3b** | moonvalley-annotation-platform | ~220k | Annotation JSON per completed task (generalData, subcategory, task_description) | Embed annotation text | ~$0.90 |
| **Tier 3c** | moonvalley-ml-datasets | varies | ShareGPT4Video per-video JSONs, movie/TV caption parquets (3.9GB + 4.2GB), backup caption parquets | Embed existing text | ~$0.50 |
| **Tier 4** | mv-xtr-external | ~1,257 | **None** — raw video files only (asteria/, david_darg/, paul_trillo/) | Frame extract + Gemini Vision | ~$0.03 |
| | **TOTAL** | **~1.3M+** | | | **~$6.50** |

### Proof of Concept Results (completed)

Loaded 11,799 videos from mv-abaka-external delivery1 cobry captions into `video_index` with OpenAI embeddings. Search results:

| Query | Top Match | Score |
|---|---|---|
| "children cooking baking in a kitchen" | "Three children baking cookies in a well-equipped kitchen" | **73%** |
| "aerial drone shot of city skyline" | "Aerial view captures bustling cityscape with diverse architecture" | **69%** |
| "person walking through a forest trail" | "Woman hikes through a sun-dappled forest" | **66%** |
| "close-up of food on a cutting board" | "Person prepares cherry tomatoes and lettuce on wooden cutting board" | **69%** |
| "industrial warehouse factory workers" | "Worker stands near glowing metal plates in dimly lit industrial" | **50%** |

Caption quality from cobry is excellent — no Gemini needed for search relevance.

## Architecture

```
Tier 2 (Cobry captions — bulk of corpus):
  S3 parquet files (silver/cobry/deliveries/*/captions/*.parquet)
    ↓
  Read parquets → extract s3_key + caption text per row
    ↓
  OpenAI text-embedding-3-small (dimensions: 768) → embedding vector(768)
    ↓
  INSERT into video_index (s3_bucket, s3_key, caption_text, embedding)

Tier 3 (Annotation/metadata JSON):
  S3 JSON files (metadata/*.json, annotations/*.json)
    ↓
  Read JSONs → extract description/caption text
    ↓
  Embed + INSERT into video_index

Tier 4 (No metadata — mv-xtr-external only, ~1,257 videos):
  Frame extraction → Gemini Flash Vision → embed → INSERT

All tiers feed into:
  video_index table → match_video_index() RPC → MCP search_full_catalog tool
    ↓
  Admin picks results → "Add to Lead" → lead_custom_samples table
    ↓
  Lead's portal shows: standard catalog + custom-picked clips
```

## Goals

- 1.3M+ videos searchable semantically for ~$6.50 total API cost
- Cobry captions used directly — no Gemini needed for 99.9% of the corpus
- Admin can search full corpus, find relevant clips, and add them to a specific lead's portal
- `build_lead_brief` includes full corpus results alongside catalog sample results
- Pipeline is idempotent and incremental — new deliveries can be loaded anytime
- `video_index` table already created and proven with 11k+ rows in PoC

---

## User Stories

### US-201: video_index table + match function
**Description:** As a developer, I need the video_index table and match function ready for bulk loading. (Note: table already created during PoC — this story formalizes the migration + adds the HNSW index after loading.)

**Acceptance Criteria:**
- [ ] Formal migration script for `video_index` table (already exists — formalize with `CREATE TABLE IF NOT EXISTS`)
- [ ] Columns: `id uuid PK`, `s3_bucket text NOT NULL`, `s3_key text NOT NULL`, `dataset_id uuid nullable FK`, `caption_text text`, `embedding extensions.vector(768)`, `enrichment_source text`, `indexed_at timestamptz`
- [ ] `enrichment_source` values: `cobry_caption`, `annotation_json`, `troveo_metadata`, `ml_dataset_caption`, `gemini_vision`
- [ ] `match_video_index` RPC function — exact signature:
  ```sql
  match_video_index(
    query_embedding extensions.vector(768),
    match_count int,
    filter_bucket text DEFAULT NULL,
    match_threshold float DEFAULT 0.40
  )
  RETURNS TABLE(
    id uuid, s3_bucket text, s3_key text, caption_text text,
    similarity float, enrichment_source text
  )
  ```
  - Uses cosine distance (`<=>`), returns `1 - distance` as similarity
  - Filters: `embedding IS NOT NULL`, `similarity >= match_threshold`, optional `s3_bucket` filter
  - Ordered by similarity descending, limited to `match_count`
- [ ] HNSW index deferred to US-205b (after bulk loading)
- [ ] Unique constraint on `(s3_bucket, s3_key)`
- [ ] TypeScript type `VideoIndexRecord` in `src/types/data-catalog.ts`
- [ ] Typecheck passes

**Recommended agents/skills:** `supabase-expert`, `code-reviewer`

---

### US-202: Cobry caption loader (Tier 2)
**Description:** As a developer, I need a script that reads cobry caption parquets from S3 and bulk-loads them into video_index with embeddings. This covers mv-abaka-external (~800k) and mv-artlist-external (~200k).

**Acceptance Criteria:**
- [ ] `scripts/load_cobry_captions.py` — standalone Python script that owns the full pipeline (no TypeScript wrapper, no execSync)
- [ ] Reads parquet files from `silver/cobry/deliveries/videos/{delivery}/captions/*.parquet`
- [ ] **Parquet reading at scale:** Each parquet file is ~25-70MB with ~20k rows. Uses pyarrow row_group streaming (`pf.read_row_group(i)` iterator) — never loads entire file into memory at once.
- [ ] Calls OpenAI embeddings via the `openai` Python SDK (`client.embeddings.create(model="text-embedding-3-small", dimensions=768, ...)`)
- [ ] Upserts to Supabase via `httpx` POST to PostgREST REST API (service-role key in env, `Prefer: resolution=merge-duplicates` header)
- [ ] **Checkpoint file:** Writes progress to `scripts/.cobry_checkpoint.json` (`{ last_delivery, last_parquet_file, last_row_offset }`). On restart, resumes from checkpoint. Checkpoint updated after each batch commit.
- [ ] Extracts `clip_storage_key` → `s3_key`, `text_short` + `text` → `caption_text`
- [ ] Strips `s3://bucket-name/` prefix from keys
- [ ] Generates OpenAI embedding from `caption_text` (text_short + text concatenated)
- [ ] Upserts into `video_index` with `enrichment_source = 'cobry_caption'`
- [ ] `--bucket`, `--delivery`, `--limit`, `--dry-run` flags (via `argparse`)
- [ ] **S3 pagination:** Uses `boto3` paginator for `list_objects_v2` to handle deliveries with many parquet files
- [ ] Processes deliveries sequentially, partitions within a delivery sequentially, rows in batches of 20 for embedding + DB insert
- [ ] Idempotent — upsert on `(s3_bucket, s3_key)` conflict = skip
- [ ] **Runtime prerequisite:** Python 3.10+ with `pyarrow`, `openai`, `httpx`, `boto3` installed — script checks and exits with clear error if missing
- [ ] Summary: "Inserted X / skipped Y / failed Z"
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-203: Troveo metadata loader (Tier 3a)
**Description:** As a developer, I need a script that reads per-video metadata JSONs from mv-troveo and loads them into video_index with embeddings.

**Acceptance Criteria:**
- [ ] `scripts/load-troveo-metadata.ts` created
- [ ] Reads embedding parquets from `silver/quality_assessment/*/delivery*/embeddings/*.parquet` to get the list of `storage_key` → video S3 paths and `meta_key` → metadata JSON paths
- [ ] For each video: fetches the metadata JSON, extracts searchable text (video_id, format_note, resolution, codec — combine into a short description)
- [ ] Note: troveo metadata JSONs have technical info only (no captions). Caption text must be constructed: `"{format_note} video, {width}x{height}, {clip_duration}s clip"`
- [ ] If richer captions exist in other troveo paths (check `silver/deliveries/videos/`), prefer those
- [ ] Generates OpenAI embedding from constructed caption text
- [ ] Upserts into `video_index` with `enrichment_source = 'troveo_metadata'`
- [ ] `--limit`, `--dry-run` flags
- [ ] Idempotent
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-204: Annotation platform loader (Tier 3b)
**Description:** As a developer, I need a script that reads annotation JSONs from moonvalley-annotation-platform completed tasks and loads them into video_index with embeddings.

**Acceptance Criteria:**
- [ ] `scripts/load-annotation-platform.ts` created
- [ ] Lists all `video_capture/completed/*/` and `video-capture-activities/completed/*/` folders
- [ ] For each folder: finds the annotation JSON file (the non-video file), reads it, extracts `generalData.subcategory`, `generalData.mainCategory`, task description, etc.
- [ ] Constructs caption text from annotation fields (same mapping logic as Phase 1 field-mapper where applicable)
- [ ] Generates OpenAI embedding from caption text
- [ ] Upserts into `video_index` with `enrichment_source = 'annotation_json'`
- [ ] Maps `dataset_id` to Egocentric Activity Capture dataset where path matches
- [ ] `--limit`, `--dry-run` flags
- [ ] Idempotent
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-204b: ML-datasets caption loader (Tier 3c)
**Description:** As a developer, I need a script that loads existing captions from moonvalley-ml-datasets (ShareGPT4Video JSONs, backup caption parquets, movie/TV clips) into video_index.

**Acceptance Criteria:**
- [ ] `scripts/load-ml-dataset-captions.ts` created
- [ ] Handles 3 source formats:
  - ShareGPT4Video: per-video JSONs at `ShareGPT4Video/*/bronze/*/json/*.json` — extract `video[0].content`
  - Backup caption parquets: `backup-caption-parquets/movie_clips_captions.parquet` (3.9GB) and `tv_clips_captions.parquet` (4.2GB)
  - Other caption parquets in known locations
- [ ] Generates OpenAI embedding from caption text
- [ ] Upserts into `video_index` with `enrichment_source = 'ml_dataset_caption'`
- [ ] `--source` flag to select which format to process
- [ ] `--limit`, `--dry-run` flags
- [ ] Idempotent
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-205: Gemini Vision for uncaptioned videos (Tier 4)
**Description:** As a developer, I need a script for the ~1,257 videos in mv-xtr-external that have no existing metadata. This is the only tier that needs Gemini.

**Acceptance Criteria:**
- [ ] `scripts/enrich-xtr-gemini.ts` created — reuses Phase 1 Gemini client
- [ ] Lists video files in mv-xtr-external (asteria/, david_darg/, paul_trillo/, paul_trillo_2025_09/)
- [ ] For each: generates signed URL → sends to Gemini 2.5 Flash Vision with open-ended prompt → extracts caption text
- [ ] Generates OpenAI embedding from Gemini response
- [ ] Upserts into `video_index` with `enrichment_source = 'gemini_vision'`
- [ ] Concurrency via p-limit (max 5), exponential backoff on 429
- [ ] `--limit`, `--dry-run` flags
- [ ] Idempotent
- [ ] Estimated cost: $0.03 for all 1,257 videos
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-205b: Build HNSW index after bulk loading
**Description:** As a developer, I need the HNSW vector index built after all bulk loading is complete.

**Acceptance Criteria:**
- [ ] Run `CREATE INDEX CONCURRENTLY idx_video_index_embedding ON video_index USING hnsw (embedding extensions.vector_cosine_ops)` outside a transaction
- [ ] Set `hnsw.ef_search = 100` in the `match_video_index` function
- [ ] Document: at 1.3M rows with 768 dims, expect ~4-6 GB HNSW index memory.
- [ ] Verify queries return results in < 500ms after index build

**Recommended agents/skills:** `supabase-expert`

---

### US-206: Lead custom samples — data model + API + RLS
**Description:** As a developer, I need a `lead_custom_samples` table with RLS policies and API so admins can pick specific videos from the full corpus and assign them to a lead's portal view.

**Acceptance Criteria:**
- [ ] Migration creates `lead_custom_samples` table:
  ```sql
  CREATE TABLE lead_custom_samples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    video_index_id uuid REFERENCES video_index(id) ON DELETE SET NULL,
    dataset_sample_id uuid REFERENCES dataset_samples(id) ON DELETE SET NULL,
    s3_bucket text,
    s3_key text,
    added_by text,
    note text,
    added_at timestamptz DEFAULT now()
  );
  -- s3_bucket and s3_key are denormalized from video_index at insert time.
  -- If video_index row is deleted, video_index_id becomes NULL but the sample
  -- remains identifiable via s3_bucket + s3_key (signed URL can still be generated).
  ```
- [ ] **RLS policies** (critical — portal reads use Supabase client with RLS):
  ```sql
  ALTER TABLE lead_custom_samples ENABLE ROW LEVEL SECURITY;
  ALTER TABLE video_index ENABLE ROW LEVEL SECURITY;

  -- Portal users can read their own custom samples
  CREATE POLICY lead_custom_samples_read ON lead_custom_samples
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_custom_samples.lead_id AND leads.supabase_user_id = auth.uid())
    );

  -- Portal users can read video_index rows referenced by their custom samples
  CREATE POLICY video_index_read_via_custom ON video_index
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM lead_custom_samples lcs
              JOIN leads l ON l.id = lcs.lead_id
              WHERE lcs.video_index_id = video_index.id
                AND l.supabase_user_id = auth.uid())
    );

  -- Service role bypasses RLS (admin API uses service role client)
  ```
- [ ] **match_video_index is `SECURITY DEFINER`** — only called by server-side code, so it bypasses RLS. This avoids the query planner hitting video_index RLS for every match.
- [ ] **Portal "Curated for You" query pattern:** The page server component first queries `lead_custom_samples` (small table, tight RLS on `lead_id`) using the user's Supabase client, then joins to `video_index` using the service-role client (bypasses RLS) to fetch video details. This avoids the expensive `video_index_read_via_custom` policy on every portal page load.
- [ ] `POST /api/admin/leads/[id]/custom-samples` — adds a video_index or dataset_sample entry to a lead
  - Body: `{ video_index_id?: string, dataset_sample_id?: string, note?: string }`
  - Auth: `verifyAdminToken()` — uses admin Supabase client (service role, bypasses RLS)
- [ ] `GET /api/admin/leads/[id]/custom-samples` — lists all custom samples for a lead
- [ ] `DELETE /api/admin/leads/[id]/custom-samples/[sampleId]` — removes a custom sample
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent — verify RLS policies don't leak data between leads

**Recommended agents/skills:** `code-reviewer`

---

### US-207: "Add to Lead" button in admin search results
**Description:** As an admin, when I find a relevant video in the full corpus search, I want to click "Add to Lead" and assign it to a specific lead's portal.

**Acceptance Criteria:**
- [ ] **Single-add:** Each search result card shows an "Add to Lead" button → opens searchable combobox with type-ahead filtering by company/contact name
- [ ] Combobox fetches leads where `status = 'approved'`
- [ ] On open: checks existing assignments, shows assigned leads as non-clickable (greyed + checkmark)
- [ ] After selecting a lead: note text input appears with "Confirm" button (note optional)
- [ ] Confirm calls `POST /api/admin/leads/[id]/custom-samples` with `video_index_id` or `dataset_sample_id` + optional `note`
- [ ] Success: checkmark + "Added to [lead name]". Error: inline error with retry.
- [ ] **Bulk-add:** Checkbox on each result card. When 1+ cards selected, a floating action bar appears at the bottom: "[N] selected — Add to Lead [combobox] [note input] [Confirm]"
- [ ] Bulk confirm calls `POST /api/admin/leads/[id]/custom-samples/bulk` with `{ items: [{ video_index_id?, dataset_sample_id? }], note? }`
- [ ] `POST /api/admin/leads/[id]/custom-samples/bulk` — new endpoint, inserts multiple rows in one transaction, returns count inserted + count skipped (already exists)
- [ ] After bulk add: checkboxes cleared, floating bar hidden, success toast "[N] samples added to [lead name]"
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright MCP
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-208: Portal shows lead custom samples
**Description:** As a lead viewing the portal, I want to see custom samples that were specifically picked for me alongside the standard catalog.

**Acceptance Criteria:**
- [ ] Portal catalog page queries `lead_custom_samples` for the authenticated lead
- [ ] **Placement:** Renders as a distinct section between the page header and the `CatalogBrowser` component. Heading: "Curated for You".
- [ ] **Layout:** Horizontal scrollable row of cards (max 6 visible at once, horizontal scroll for overflow). No wrapping.
- [ ] **Custom card component** for each sample:
  - Video/image thumbnail in 16:9 aspect ratio (uses signed URL for `<video>` or `<img>`)
  - `caption_text` truncated to 2 lines with ellipsis overflow
  - Source bucket badge (e.g. "mv-abaka-external") displayed as subtle pill
  - Admin note shown below caption if present (italic, muted color)
  - Cards where `dataset_id` is NULL are not clickable (no link to a dataset detail page)
- [ ] **Signed URLs** generated server-side in the page server component (not client-side)
- [ ] For `dataset_sample_id` samples: shows same as standard sample with link to parent dataset
- [ ] If no custom samples exist, section is hidden entirely (no empty state, no heading)
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright MCP
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-209: MCP tools — search_full_catalog + updated build_lead_brief
**Description:** As a Claude agent, I need MCP tools to search the full corpus and include results in lead briefs.

**Acceptance Criteria:**
- [ ] `search_full_catalog` tool: `{ query: string, limit?: number (default 10, max 50), s3_bucket?: string, match_threshold?: number (default 0.40) }`
- [ ] Handler: embeds query via `generateEmbedding(query)` → calls `match_video_index` RPC → generates signed URL per result via `getS3SignedUrl(s3_key, 3600, s3_bucket)`
- [ ] Output per result: `{ id, s3_bucket, s3_key, caption_text, similarity, enrichment_source, signed_url }`
- [ ] **S3 scrubbing scope:** `scrubS3Urls()` applied to `caption_text` only — `signed_url` is intentionally returned (it's a presigned delivery URL, not an internal path). Phase 1's scrubber targets `s3://` URIs and ARN refs inside metadata text; presigned `https://` URLs are not scrubbed.
- [ ] `build_lead_brief` updated to also call `search_full_catalog` and include results labelled `source: "full_corpus"`
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent — verify scrubbing applies to caption_text but NOT to signed_url

**Recommended agents/skills:** `code-reviewer`

---

### US-210: Admin Search UI — full corpus toggle
**Description:** As an admin, I want to toggle between catalog samples and full corpus in the search page.

**Acceptance Criteria:**
- [ ] Define `UnifiedSearchResult` discriminated union type:
  ```typescript
  type UnifiedSearchResult =
    | { source: 'catalog'; id: string; dataset_name: string; scene_summary: string; description: string; /* ... catalog fields */ }
    | { source: 'full_corpus'; id: string; s3_bucket: string; s3_key: string; caption_text: string; description: string; enrichment_source: string; similarity: number; signed_url: string; };
  ```
  - Both variants map to a shared `description` field: catalog maps `scene_summary` to `description`; full corpus maps `caption_text` to `description`.
- [ ] Modify `POST /api/admin/catalog/search` to accept a `mode` query param: `catalog` | `full_corpus` | `both` (default: `catalog`)
  - In `full_corpus` mode: dataset filter is replaced with bucket filter (from `?bucket=` URL param)
  - In `both` mode: runs both queries and merges results
- [ ] Segmented toggle: `Catalog Samples | Full Corpus | Both`
- [ ] Mode toggle auto-re-executes current query
- [ ] Persist search state in URL params: `?q=`, `?dataset=`, `?bucket=`, `?mode=`
- [ ] Full Corpus results show `FULL CORPUS` badge + source bucket name where dataset_name would appear, `caption_text` in scene_summary slot, `enrichment_source` as subtle tag, tag section hidden (no environments/activities), copy button copies `video_index.id`
- [ ] Full Corpus disabled if video_index is empty
- [ ] Each result card has "Add to Lead" button (from US-207)
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright MCP
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-211: Playwright E2E + UAT
**Description:** As QA, full end-to-end testing of corpus search + lead custom samples.

**Acceptance Criteria:**
- [ ] `tests/e2e/full-corpus-search.spec.ts` created
- [ ] Test: search full corpus → verify results with FULL CORPUS badge → add result to a lead → verify lead portal shows "Curated for You" section
- [ ] Test: MCP `search_full_catalog` tool returns valid response
- [ ] Verify no `s3://` strings in any response
- [ ] UAT: admin portal UI only, no direct DB access

**Recommended agents/skills:** Playwright MCP (`mcp__playwright`)

---

## Functional Requirements

- **FR-201:** `video_index` table stores one row per video with `s3_bucket`, `s3_key`, `caption_text`, `embedding`, `enrichment_source`
- **FR-202:** Cobry caption loader reads parquets, embeds caption text, and bulk-inserts into video_index (~1M videos)
- **FR-203:** Troveo/annotation/ML-dataset loaders handle each metadata format and embed accordingly
- **FR-204:** Gemini Vision only needed for ~1,257 uncaptioned videos in mv-xtr-external ($0.03)
- **FR-205:** `match_video_index` RPC with 40% similarity threshold, cosine distance, HNSW index
- **FR-206:** `lead_custom_samples` table links specific videos to specific leads
- **FR-207:** Admin can add search results to a lead via "Add to Lead" button
- **FR-208:** Lead portal shows custom-picked samples in "Curated for You" section
- **FR-209:** MCP tools support full corpus search + lead brief includes corpus results
- **FR-210:** Admin search UI supports Catalog Samples / Full Corpus / Both toggle
- **FR-211:** All text returned via API/MCP has S3 strings scrubbed

## Non-Goals

- No real-time indexing of new S3 uploads (batch scripts, re-runnable)
- No audio/speech analysis
- No re-embedding of troveo's 256-dim vectors (incompatible model — embed from metadata text instead)
- No UI for triggering bulk loading scripts (CLI only)
- No AWS Rekognition
- No frame extraction needed for Tier 2/3 (captions already exist) — only Tier 4
- ~~No bulk assignment~~ — moved to US-207 as a feature

## PR Structure

- **PR 7:** US-201 (table formalization + match function)
- **PR 8:** US-202 + US-203 + US-204 + US-204b + US-205 (all loaders — can parallelise per tier)
- **PR 9:** US-205b + US-206 (HNSW index build + lead custom samples data model)
- **PR 10:** US-207 + US-208 + US-209 + US-210 (Add to Lead UI + portal view + MCP tools + search toggle)
- **PR 11:** US-211 (E2E + UAT)

## Cost Summary

**Pricing basis:** OpenAI text-embedding-3-small = $0.02 per 1M tokens. Gemini 2.5 Flash Vision = $0.00002 per image.

| Item | Videos | Avg tokens/video | Total tokens | Embedding cost | Other | Total |
|---|---|---|---|---|---|---|
| Cobry captions (abaka + artlist) | ~1M | ~150 (text_short + text) | ~150M | $3.00 | — | **$3.00** |
| Troveo metadata JSON | ~112k | ~80 (technical fields only) | ~9M | $0.18 | — | **$0.18** |
| Annotation-platform JSON | ~220k | ~200 (generalData + subcategory) | ~44M | $0.88 | — | **$0.88** |
| ML-datasets captions | ~100k est. | ~150 | ~15M | $0.30 | — | **$0.30** |
| mv-xtr-external (Gemini) | ~1,257 | ~150 (Gemini output) | ~189k | $0.004 | Gemini: $0.025 | **$0.03** |
| | | | | | | |
| **TOTAL** | **~1.43M** | | **~218M** | **$4.36** | **$0.025** | **~$4.40** |

**Additional costs:**
- Supabase storage: ~1.43M rows × ~6KB/row (embedding + text) = ~8.6 GB
- HNSW index memory: ~4-6 GB at 768 dims
- Compute time: ~14-18 hrs for embedding batches at 20 concurrent requests

## Technical Considerations

- **Cobry parquets are the primary data source** — rich captions already exist. Parquet reading via Python (pyarrow) with row_group streaming in standalone Python scripts.
- **Troveo's 256-dim embeddings are incompatible** with our 768-dim OpenAI vectors. Cannot use them directly — must re-embed from metadata text.
- **HNSW index at 1.3M rows x 768 dims** will consume ~4-6 GB RAM. All embedding generation uses `dimensions: 768` parameter on text-embedding-3-small.
- **Phase 2 video_index uses 768-dim embeddings** (not 1536 like Phase 1 dataset_samples). Different tables, different dimensions — queries against each table use the matching dimension.
- **Full corpus videos may vary in duration/resolution;** card hover-play with `preload='metadata'` should be sufficient.
- **`CREATE INDEX CONCURRENTLY`** required — must run outside a transaction after bulk loading.
- **Parquet files are large** (25-70 MB each). Download to `/tmp`, process, delete. Don't accumulate.
- **Lead custom samples** use `ON DELETE SET NULL` for `video_index_id` and `dataset_sample_id` FKs. Denormalized `s3_bucket` and `s3_key` columns ensure the sample remains identifiable even if the referenced video_index row is deleted.
- **S3 URL scrubbing scope:** `scrubS3Urls()` preserves keys named `signed_url`, `source_video_url`, `thumbnail_url`, `representative_signed_urls` — these are intentional presigned delivery URLs, not internal path leaks. All other string values are scrubbed for `s3://`, ARN refs, and encoded variants. (Pre-existing Phase 1 bug was fixed: the scrubber's presigned URL regex was previously redacting intentional signed URLs.)
- **MCP signed URL TTL:** Use 600s (10 minutes) for MCP-served signed URLs, not 3600s. Enough for an agent to inspect but limits blast radius if URLs leak into conversation logs.
- **UUID validation:** All `[id]` route params in admin API routes must be validated with `z.string().uuid()` before querying Supabase (consistent with existing Zod patterns in `s3-annotation/route.ts`).
- **Temp file cleanup:** Loader scripts must delete parquet files from `/tmp` in a `finally` block, including on error. No parquet files should remain after script completion.
- **`match_video_index` security:** Function remains `SECURITY INVOKER` (Postgres default) so RLS is always enforced for non-service-role callers. MCP server and admin API use service-role client (bypasses RLS). Portal queries go through the `lead_custom_samples` RLS path.
