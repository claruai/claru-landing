# Unified Clip Architecture — Implementation Tasks

> Replaces `dataset_samples` + `video_index` with a single `clips` table and `dataset_clips` join table.
> Staging DB first (`kpjcbemvwxffibiohmvi`), then prod (`usmgbihcevnvrkyvrlju`).

---

## Phase 1: Schema & Data Migration (Staging)

- [ ] 1.1 Create `clips` table DDL and migration file
  - New file: `supabase/migrations/009_unified_clips.sql`
  - Columns: `id`, `s3_bucket`, `s3_key` (unique pair), `mime_type`, `caption_text`, `embedding vector(768)`, `enrichment_source`, `ann_data jsonb` (annotation metadata), `tech_meta jsonb` (resolution, fps, duration, file_size), `ai_context jsonb` (scene_summary, environments, activities, objects, camera_perspective — replaces agent_context), `s3_annotation_key`, `s3_specs_key`, `created_at`, `updated_at`
  - Add `UNIQUE(s3_bucket, s3_key)` constraint
  - Add indexes: `s3_bucket`, GIN on `ai_context`, IVFFlat on `embedding`
  - Use `INSERT ON CONFLICT DO NOTHING` pattern in all inserts (bloat prevention per project convention)
  - Ref: Target state — structured columns (ann_*, tech_*, ai_*)

- [ ] 1.2 Create `dataset_clips` join table DDL
  - Same migration file as 1.1
  - Columns: `id`, `dataset_id` (FK datasets), `clip_id` (FK clips), `lead_id` (FK leads, nullable), `added_by text`, `note text`, `created_at`
  - `UNIQUE(dataset_id, clip_id, lead_id)` — allows same clip in multiple datasets and per-lead assignments
  - Ref: Target state — dataset_clips join table

- [ ] 1.3 Create `match_clips` RPC function
  - Same migration file as 1.1
  - Replaces both `match_samples` (1536-dim) and `match_video_index` (768-dim)
  - Signature: `match_clips(query_embedding vector(768), match_count int, filter_dataset_id uuid, filter_bucket text, match_threshold float)`
  - Returns: `id, s3_bucket, s3_key, caption_text, similarity, ai_context, mime_type, enrichment_source`
  - Joins `dataset_clips` when `filter_dataset_id` provided
  - Ref: One unified search mode

- [ ] 1.4 Write data migration script: `video_index` → `clips`
  - New file: `scripts/migrate-video-index-to-clips.py`
  - Copy all ~145k `video_index` rows into `clips` using batch INSERT ON CONFLICT DO NOTHING
  - Map: `s3_bucket`, `s3_key`, `caption_text`, `embedding`, `enrichment_source` — direct copy
  - Run via psql (not Supabase dashboard) to avoid 2 min timeout
  - Validate row counts match post-migration
  - Ref: video_index: 145k rows on prod, 47k on staging

- [ ] 1.5 Write data migration script: `dataset_samples` → `clips` + `dataset_clips`
  - New file: `scripts/migrate-dataset-samples-to-clips.py`
  - For each `dataset_samples` row:
    - Upsert to `clips` using `s3_object_key` as the `s3_key`, re-embed at 768 dims if row has `agent_context` (current embeddings are 1536-dim, incompatible)
    - Copy `agent_context` fields into `ai_context` jsonb, `s3_annotation_key`, `s3_specs_key`
    - Copy resolution/fps/duration/file_size into `tech_meta` jsonb
    - Insert `dataset_clips` row linking `clip_id` + `dataset_id` + `lead_id`
  - Handle rows without `s3_object_key` gracefully (skip or log)
  - Ref: dataset_samples has 1536-dim embeddings, clips will use 768-dim — need to re-embed

- [ ] 1.6 Run migrations and data scripts on staging DB
  - Apply migration 009 via psql on staging (`kpjcbemvwxffibiohmvi`)
  - Run `migrate-video-index-to-clips.py` against staging
  - Run `migrate-dataset-samples-to-clips.py` against staging
  - Validate: clips row count = unique(video_index ∪ dataset_samples by s3 key)
  - Validate: dataset_clips rows match original dataset_samples count
  - Validate: `match_clips` RPC returns results for a test query
  - Ref: Staging DB first, validate, then replicate on prod

---

## Phase 2: TypeScript Types & Embedding Utility

- [ ] 2.1 Update TypeScript types in `src/types/data-catalog.ts`
  - Add `Clip` interface matching `clips` table schema
  - Add `DatasetClip` interface matching `dataset_clips` schema
  - Add `ClipSearchResult` interface (unified, replaces both `CatalogSearchResult` and `FullCorpusSearchResult`)
  - Remove `VideoIndexRecord` and `LeadCustomSample` types (deprecated by clips)
  - Keep `DatasetSample` temporarily for backward compat during transition, mark with `@deprecated`
  - Remove `UnifiedSearchResult` discriminated union (no more catalog vs full_corpus distinction)
  - Ref: MCP tools return different shapes — need unified shape

- [ ] 2.2 Update `src/lib/embeddings/openai.ts` — default to 768 dims
  - Change `generateEmbedding()` default to 768 (currently defaults to 1536)
  - Remove or deprecate the 1536 path since `clips` only uses 768
  - Update `agentContextToEmbeddingText()` to accept `ai_context` shape (same fields, just renamed)
  - Ref: Embedding dimension: 768 (text-embedding-3-small)

---

## Phase 3: Search API Rewrite

- [ ] 3.1 Rewrite `src/app/api/admin/catalog/search/route.ts` for unified clips
  - Remove `SearchMode` type and mode parameter (`catalog`/`full_corpus`/`both`)
  - Single search path: call `match_clips` RPC with 768-dim embedding
  - Browse mode: query `clips` table directly, join `dataset_clips` when dataset filter is set
  - Replace separate catalog/full_corpus result shapes with unified `ClipSearchResult`
  - Keep `dataset_id`, `s3_bucket`, `subcategory` filters — now all go through same query
  - Update lead-assignment lookup: query `dataset_clips` instead of `dataset_samples`
  - Ref: One unified search mode, no more catalog vs full_corpus distinction

- [ ] 3.2 Write tests for the unified search API
  - New file: `src/app/api/admin/catalog/search/__tests__/route.test.ts`
  - Test: search with query returns `ClipSearchResult[]` shape
  - Test: browse mode with dataset filter returns paginated clips
  - Test: subcategory filter works
  - Test: lead-assignment enrichment returns correctly
  - Mock Supabase RPC and S3 presigner
  - Ref: Search API update depends on schema + data

---

## Phase 4: Admin Search UI

- [ ] 4.1 Update `src/app/admin/catalog/search/CatalogSearchClient.tsx`
  - Remove mode toggle (catalog/full_corpus/both) — no longer needed
  - Remove `UnifiedResult.source` discriminated union logic
  - Use single `ClipSearchResult` interface for all results
  - Remove conditional rendering based on `source === 'catalog'` vs `source === 'full_corpus'`
  - Update result card rendering to use unified clip fields (`ai_context`, `caption_text`)
  - Keep bucket/dataset/subcategory filters (now they filter clips directly)
  - Update `AddToLeadButton` interaction to pass `clip_id` instead of `video_index_id`/`dataset_sample_id`
  - Ref: Admin UI depends on search API

- [ ] 4.2 Update admin search page server component
  - File: `src/app/admin/catalog/search/page.tsx`
  - Remove `video_index` count query (was used for `videoIndexCount` prop)
  - Remove `buckets` query from `video_index` — get distinct buckets from `clips` instead
  - Update props passed to `CatalogSearchClient`
  - Ref: no more video_index table

---

## Phase 5: Custom Catalog & Lead APIs

- [ ] 5.1 Rewrite `src/app/api/admin/catalog/custom/route.ts`
  - Change item schema: replace `video_index_id`/`dataset_sample_id` with `clip_id`
  - Insert into `dataset_clips` instead of `dataset_samples` when adding clips to a catalog
  - Remove video_index lookup (clip already has all S3 info)
  - Update dataset sample count: count `dataset_clips` rows for dataset
  - Ref: Portal and admin render from same clips table

- [ ] 5.2 Rewrite `src/app/api/admin/leads/[id]/custom-samples/route.ts`
  - GET: query `dataset_clips` joined with `clips` for the lead, generate signed URLs
  - POST: accept `clip_id` instead of `video_index_id`/`dataset_sample_id`, insert into `dataset_clips`
  - Remove video_index fallback lookups
  - Ref: no more separate lead_custom_samples table

- [ ] 5.3 Update `src/app/api/admin/leads/[id]/custom-samples/bulk/route.ts`
  - Same pattern as 5.2 — replace video_index references with clips
  - Batch insert into `dataset_clips`
  - Ref: Bulk operations also need updating

- [ ] 5.4 Write tests for custom catalog and lead sample APIs
  - Test: create custom catalog with clip_ids inserts into dataset_clips
  - Test: GET custom samples returns clips joined data
  - Test: POST with clip_id creates dataset_clips row
  - Mock Supabase client

---

## Phase 6: Portal UI Updates

- [ ] 6.1 Update portal dataset detail page `src/app/portal/catalog/[id]/page.tsx`
  - Replace `dataset_samples` query with: `clips` JOIN `dataset_clips` WHERE `dataset_id = id`
  - Filter by lead: `dataset_clips.lead_id IS NULL OR dataset_clips.lead_id = leadId`
  - Map clip fields to the shape expected by `SampleGallery` (or update `SampleGallery` props)
  - S3 presigned URL generation: use `clips.s3_key` + `clips.s3_bucket`
  - Ref: Portal reads from dataset_samples only → now reads from clips

- [ ] 6.2 Update `SampleGallery` and `SampleDetailModal` props
  - File: `src/app/portal/catalog/[id]/SampleGallery.tsx`
  - File: `src/app/portal/catalog/[id]/SampleDetailModal.tsx`
  - Change `SampleWithUrl.sample` type from `DatasetSample` to `Clip` (or a mapped subset)
  - Update field references: `agent_context` → `ai_context`, `s3_object_key` → `s3_key`
  - Ensure `SampleDetailModal` annotation endpoint still works — it fetches from `s3_annotation_key` which is now on `clips`
  - Ref: Portal SampleDetailModal fetches annotation JSON from S3 live

- [ ] 6.3 Update portal S3 annotation API
  - File: `src/app/api/portal/s3-annotation/route.ts`
  - Change sample lookup from `dataset_samples` to `clips` table
  - Cache writes go to `clips.ann_data` instead of `dataset_samples.metadata_json`
  - Ref: live S3 fetch API currently uses dataset_samples fields

- [ ] 6.4 Update portal catalog list page
  - File: `src/app/portal/catalog/page.tsx`
  - If it queries `dataset_samples` or `lead_custom_samples` for counts, switch to `dataset_clips`
  - Ref: Portal renders from same clips table

---

## Phase 7: Admin Dataset Detail Pages

- [ ] 7.1 Update `src/app/admin/catalog/[id]/SamplesList.tsx`
  - Change fetch from `dataset_samples` API to `clips` + `dataset_clips` join
  - Update type from `DatasetSample` to `Clip`
  - Update selection logic to use `clip_id`
  - Ref: Admin samples list

- [ ] 7.2 Update `src/app/admin/catalog/[id]/SampleEditPanel.tsx`
  - Edit operations now target `clips` table (for content fields) and `dataset_clips` (for assignment fields)
  - Update field names: `agent_context` → `ai_context`, `metadata_json` → `ann_data`/`tech_meta`
  - Ref: Admin sample edit panel

- [ ] 7.3 Update admin dataset samples API
  - File: `src/app/api/admin/catalog/[id]/samples/route.ts` (if exists, or whichever API `SamplesList` calls)
  - Query `clips` joined with `dataset_clips` instead of `dataset_samples`
  - Ref: Admin dataset detail depends on schema

- [ ] 7.4 Update admin S3 annotation API
  - File: `src/app/api/admin/s3-annotation/route.ts`
  - Change sample lookup from `dataset_samples` to `clips`
  - Ref: Admin annotation preview

- [ ] 7.5 Update `src/app/admin/catalog/[id]/SamplePreviewModal.tsx`
  - Update type references from `DatasetSample` to `Clip`
  - Ref: Admin preview modal

- [ ] 7.6 Update admin subcategories API
  - File: `src/app/api/admin/catalog/[id]/subcategories/route.ts`
  - Query `clips` + `dataset_clips` instead of `dataset_samples` + `dataset_prefix_routes`
  - Ref: Subcategory filter uses dataset_prefix_routes which is tied to video_index

---

## Phase 8: MCP Server Rewrite

- [ ] 8.1 Rewrite `search_catalog` tool
  - File: `src/lib/mcp/server.ts` — `registerSearchCatalog`
  - Call `match_clips` RPC with 768-dim embedding
  - Return unified clip shape instead of catalog-specific shape
  - Ref: MCP tools simplified, no more catalog vs full_corpus distinction

- [ ] 8.2 Remove `search_full_catalog` tool or merge into `search_catalog`
  - File: `src/lib/mcp/server.ts` — `registerSearchFullCatalog`
  - Either remove entirely (single search tool handles everything) or keep as alias
  - Recommended: remove and update tool description on `search_catalog` to mention full corpus
  - Ref: no more separate full_corpus search

- [ ] 8.3 Update `build_lead_brief` tool
  - Remove separate full corpus search section (768-dim + `match_video_index`)
  - Single search via `match_clips` — results already span all data
  - Update result shape to unified clip format
  - Ref: build_lead_brief currently does two separate searches

- [ ] 8.4 Update `get_dataset_overview` tool
  - Query `clips` + `dataset_clips` instead of `dataset_samples`
  - Read `ai_context` instead of `agent_context`
  - Ref: get_dataset_overview reads from dataset_samples

- [ ] 8.5 Update `create_custom_catalog` tool
  - Accept `clip_ids` instead of `dataset_sample_ids`/`video_index_ids`
  - Insert into `dataset_clips` instead of `dataset_samples`
  - Ref: create_custom_catalog inserts into dataset_samples

- [ ] 8.6 Update `download_clips` tool
  - Accept `clip_ids` instead of separate `dataset_sample_ids`/`video_index_ids`
  - Single query to `clips` table
  - Ref: download_clips queries both tables separately

- [ ] 8.7 Update `add_clips_to_catalog` tool
  - Accept `clip_ids` instead of `dataset_sample_ids`/`video_index_ids`
  - Insert into `dataset_clips`
  - Ref: add_clips_to_catalog inserts into dataset_samples

- [ ] 8.8 Update `get_corpus_stats` tool
  - Query `clips` table instead of `video_index` for counts and bucket stats
  - Query `dataset_clips` instead of `dataset_samples` for catalog stats
  - Remove separate full_corpus vs catalog distinction in output
  - Ref: get_corpus_stats queries video_index and dataset_samples separately

- [ ] 8.9 Update `list_lead_catalogs` tool
  - Count via `dataset_clips` instead of `dataset_samples`
  - Ref: list_lead_catalogs counts dataset_samples per lead

- [ ] 8.10 Update `remove_clips_from_catalog` tool
  - Delete from `dataset_clips` instead of `dataset_samples`
  - Accept `clip_ids` or `dataset_clip_ids`
  - Ref: remove_clips deletes from dataset_samples

- [ ] 8.11 Update `get_lead` tool
  - Count custom samples via `dataset_clips` instead of `dataset_samples`
  - Ref: get_lead counts dataset_samples

- [ ] 8.12 Write tests for updated MCP tools
  - Test `search_catalog` returns unified clip shape
  - Test `create_custom_catalog` creates `dataset_clips` rows
  - Test `get_corpus_stats` returns correct counts from `clips` table
  - Mock Supabase and embeddings

---

## Phase 9: Loader Script Updates

- [ ] 9.1 Update `scripts/load_cobry_captions.py` to write to `clips`
  - Change target table from `video_index` to `clips`
  - Map columns: `s3_bucket`, `s3_key`, `caption_text`, `embedding`, `enrichment_source`
  - Use INSERT ON CONFLICT (s3_bucket, s3_key) DO NOTHING
  - Ref: Loader scripts write to video_index

- [ ] 9.2 Update `scripts/load-annotation-metadata.py` to write to `clips`
  - Same pattern as 9.1 — target `clips` instead of `video_index`
  - Store annotation metadata in `ann_data` jsonb column
  - Ref: Annotation loader writes to video_index

- [ ] 9.3 Update `scripts/re-enrich-annotation-frames.py` to update `clips`
  - Change update target from `video_index` to `clips`
  - Store Gemini descriptions in `ai_context` jsonb
  - Ref: Re-enrichment updates video_index

---

## Phase 10: Shared Components & Utilities

- [ ] 10.1 Update `src/app/components/catalog/GalleryCard.tsx`
  - Accept `Clip` type instead of `DatasetSample`
  - Update field references
  - Ref: GalleryCard renders sample thumbnails in both admin and portal

- [ ] 10.2 Update prospect page components
  - File: `src/app/components/prospect/VideoShowcaseClient.tsx`
  - If it references `DatasetSample` or `s3-annotation`, update to use `Clip` type
  - Ref: Prospect pages reuse portal gallery components

- [ ] 10.3 Update `src/app/components/ui/DatasetUploader.tsx`
  - If it writes to `dataset_samples`, update to write to `clips` + `dataset_clips`
  - Ref: DatasetUploader references s3-annotation

---

## Phase 11: Cleanup & Deprecation

- [ ] 11.1 Remove deprecated RPC functions
  - Drop `match_samples` RPC (was 1536-dim)
  - Drop `match_video_index` RPC (replaced by `match_clips`)
  - Drop `resolve_dataset_for_s3_key` if no longer needed (clips already have all info)
  - New migration file: `supabase/migrations/010_drop_legacy_rpcs.sql`
  - Ref: Old RPCs are no longer called

- [ ] 11.2 Remove `@deprecated` `DatasetSample` type and old interfaces
  - Clean up `src/types/data-catalog.ts` — remove `DatasetSample`, `VideoIndexRecord`, `LeadCustomSample`, `CatalogSearchResult`, `FullCorpusSearchResult`, `UnifiedSearchResult`
  - Ref: All code now uses Clip/ClipSearchResult

- [ ] 11.3 Drop legacy tables (staging only, keep prod tables until validated)
  - Migration: `supabase/migrations/011_drop_legacy_tables.sql`
  - `DROP TABLE IF EXISTS lead_custom_samples CASCADE;`
  - `DROP TABLE IF EXISTS video_index CASCADE;`
  - `DROP TABLE IF EXISTS dataset_samples CASCADE;` (only after full validation)
  - Ref: Old tables no longer referenced

---

## Phase 12: Production Migration

- [ ] 12.1 Apply schema migration (009) on prod DB
  - Run via psql against prod (`usmgbihcevnvrkyvrlju`)
  - Ref: Prod migration comes last

- [ ] 12.2 Run data migration scripts on prod
  - `migrate-video-index-to-clips.py` — 145k rows
  - `migrate-dataset-samples-to-clips.py` — 714 rows + re-embed
  - Validate counts match
  - Ref: Must use psql for long DDL, 2 min timeout on dashboard

- [ ] 12.3 Deploy updated app code to prod
  - All API routes, MCP server, and UI now point to `clips`/`dataset_clips`
  - Verify search works end-to-end
  - Verify portal dataset detail pages load correctly
  - Ref: E2E tests depend on all UI changes

- [ ] 12.4 Apply cleanup migrations (010, 011) on prod after validation
  - Drop old RPCs and legacy tables
  - Ref: Only after confirming everything works on prod

---

## Notes

- All embedding operations standardized to 768 dimensions (text-embedding-3-small)
- The 714 `dataset_samples` rows with 1536-dim embeddings must be re-embedded at 768 dims during migration (task 1.5)
- `dataset_prefix_routes` table may become unnecessary if clips already carry bucket/key — evaluate during implementation
- `lead_custom_samples` table is fully replaced by `dataset_clips` (with `lead_id` set)
