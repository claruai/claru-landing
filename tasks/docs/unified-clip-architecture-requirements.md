# Requirements Document

## Introduction

The Claru data catalog currently stores clip data across two separate tables: `dataset_samples` (714 curated rows with enrichment_json, agent_context, metadata_json, and 1536-dim embeddings) and `video_index` (145k+ full corpus rows with caption_text, 768-dim embeddings, and enrichment_source). This split causes data duplication when clips are "added to a catalog" (entire rows are copied from video_index into dataset_samples), multiple enrichment passes overwrite each other in a single caption_text column, two disconnected search modes in the admin UI, and inconsistent rendering between the admin search and the client portal.

The Unified Clip Architecture consolidates both tables into a single `clips` table with structured columns per data source, replaces data copying with a `dataset_clips` join table, unifies search into a single mode, and updates all surfaces (admin UI, portal, MCP tools, loader scripts) to work against the new schema.

The migration targets staging first, with validation before replicating to production.

## Requirements

### Requirement 1: Unified `clips` Table Schema

**User Story:** As a platform admin, I want all clip data stored in a single table with structured per-source columns, so that different enrichment passes don't overwrite each other and I have one source of truth for every clip.

#### Acceptance Criteria

1. WHEN the migration runs THEN the system SHALL create a `clips` table with identity columns: `id` (uuid PK), `s3_bucket` (text NOT NULL), `s3_key` (text NOT NULL), `mime_type` (text), `filename` (text), `UNIQUE(s3_bucket, s3_key)`.
2. WHEN the migration runs THEN the system SHALL include annotation-sourced columns prefixed `ann_`: `ann_metadata` (jsonb), `ann_annotation_key` (text, relative S3 path to annotation-data.json), `ann_specs_key` (text, relative S3 path to game specs).
3. WHEN the migration runs THEN the system SHALL include technical metadata columns prefixed `tech_`: `tech_file_size_bytes` (bigint), `tech_duration_seconds` (numeric), `tech_resolution_width` (integer), `tech_resolution_height` (integer), `tech_fps` (numeric).
4. WHEN the migration runs THEN the system SHALL include AI enrichment columns prefixed `ai_`: `ai_caption` (text), `ai_agent_context` (jsonb), `ai_enrichment_source` (text), `ai_enrichment_json` (jsonb).
5. WHEN the migration runs THEN the system SHALL include a single `embedding` column of type `vector(768)` using text-embedding-3-small.
6. WHEN the migration runs THEN the system SHALL include timestamp columns: `created_at` (timestamptz DEFAULT now()), `updated_at` (timestamptz DEFAULT now()) with an auto-update trigger.
7. WHEN the migration runs THEN the system SHALL create indexes on `s3_bucket`, `s3_key`, and an HNSW or IVFFlat index on the `embedding` column for vector search.

### Requirement 2: `dataset_clips` Join Table

**User Story:** As a platform admin, I want "adding a clip to a dataset" to be a lightweight join table insert rather than a full row copy, so that clips aren't duplicated and dataset membership is easy to manage.

#### Acceptance Criteria

1. WHEN the migration runs THEN the system SHALL create a `dataset_clips` table with columns: `id` (uuid PK), `dataset_id` (uuid FK → datasets), `clip_id` (uuid FK → clips), `added_at` (timestamptz DEFAULT now()), `added_by` (text), `note` (text), `UNIQUE(dataset_id, clip_id)`.
2. WHEN an admin adds a clip to a dataset via the admin UI or MCP THEN the system SHALL insert a single row into `dataset_clips` and SHALL NOT copy clip metadata into any other table.
3. WHEN an admin removes a clip from a dataset THEN the system SHALL delete the `dataset_clips` row and SHALL NOT delete the underlying `clips` row.
4. WHEN the datasets.total_samples count is queried THEN the system SHALL derive it from `COUNT(*)` on `dataset_clips` for that dataset (or maintain it via trigger), not from a separate column that can drift.

### Requirement 3: Data Migration — Merge Existing Tables

**User Story:** As a platform admin, I want all existing data from `dataset_samples` (714 rows) and `video_index` (145k+ rows) merged into the new `clips` table with no data loss, so I can drop the legacy tables.

#### Acceptance Criteria

1. WHEN the migration runs THEN the system SHALL insert all `video_index` rows into `clips`, mapping: `s3_bucket` → `s3_bucket`, `s3_key` → `s3_key`, `caption_text` → `ai_caption`, `enrichment_source` → `ai_enrichment_source`, `embedding(768)` → `embedding`, `indexed_at` → `created_at`.
2. WHEN the migration runs THEN the system SHALL merge `dataset_samples` rows into `clips` by matching on `s3_bucket + s3_key` (upsert), mapping: `enrichment_json` → `ai_enrichment_json`, `agent_context` → `ai_agent_context`, `metadata_json` → `ann_metadata`, `s3_annotation_key` → `ann_annotation_key`, `s3_specs_key` → `ann_specs_key`, `file_size_bytes` → `tech_file_size_bytes`, `duration_seconds` → `tech_duration_seconds`, `resolution_width` → `tech_resolution_width`, `resolution_height` → `tech_resolution_height`, `fps` → `tech_fps`, `mime_type` → `mime_type`, `filename` → `filename`.
3. WHEN a `dataset_samples` row has a 1536-dim embedding but no 768-dim embedding exists for that clip THEN the migration SHALL re-embed the `ai_caption` or `ai_agent_context.scene_summary` text at 768 dimensions and store the result in the `embedding` column.
4. WHEN the migration merges `dataset_samples` rows THEN the system SHALL create corresponding `dataset_clips` rows preserving the original `dataset_id` relationship.
5. WHEN `dataset_samples` rows have a `lead_id` set (lead-specific copies) THEN the migration SHALL create `dataset_clips` rows linking the clip to that dataset AND preserve the lead association in the `dataset_clips` table (via `lead_id` column or a separate `lead_dataset_clips` reference).
6. WHEN the migration completes successfully THEN the system SHALL drop the `dataset_samples` and `video_index` tables, their RPC functions (`match_samples`, `match_video_index`), and all associated indexes.
7. WHEN the migration runs THEN it SHALL be idempotent — safe to re-run without creating duplicates or losing data.

### Requirement 4: Lead-Scoped Dataset Access

**User Story:** As a platform admin, I want to assign clips to a dataset for a specific lead so that different leads can see different subsets of the same dataset.

#### Acceptance Criteria

1. WHEN a lead-specific clip assignment is needed THEN the `dataset_clips` table SHALL support an optional `lead_id` (uuid FK → leads) column.
2. IF `lead_id` is NULL on a `dataset_clips` row THEN the clip SHALL be visible to all leads who have access to that dataset.
3. IF `lead_id` is set on a `dataset_clips` row THEN the clip SHALL only be visible to that specific lead.
4. WHEN the portal queries samples for a dataset THEN RLS policies SHALL filter `dataset_clips` to show only rows where `lead_id IS NULL` or `lead_id` matches the authenticated user's lead record.
5. WHEN the existing `lead_custom_samples` table functionality is migrated THEN the system SHALL represent those relationships as `dataset_clips` rows with `lead_id` set, and the `lead_custom_samples` table SHALL be dropped.

### Requirement 5: Unified Search

**User Story:** As a platform admin, I want a single search mode that queries all clips regardless of whether they were previously in "catalog" or "full corpus," so I don't have to switch modes or run duplicate searches.

#### Acceptance Criteria

1. WHEN the admin searches clips THEN the system SHALL query the single `clips` table using the 768-dim `embedding` column with cosine similarity.
2. WHEN the search API is called THEN it SHALL accept filters for: `dataset_id` (clips in a specific dataset via dataset_clips join), `s3_bucket`, text substring match on `ai_caption`, and a minimum similarity threshold.
3. WHEN the admin UI loads the search page THEN it SHALL NOT display a search mode toggle (catalog vs full_corpus). The toggle SHALL be removed.
4. WHEN search results are returned THEN each result SHALL include: clip ID, s3_bucket, s3_key, ai_caption, similarity score, ai_enrichment_source, signed URL, and dataset memberships (list of dataset names the clip belongs to).
5. WHEN the admin UI displays results THEN it SHALL show a unified result card format that works for all clips, replacing the current two-format (CatalogSearchResult vs FullCorpusSearchResult) discriminated union.
6. WHEN a new `match_clips` RPC function is created THEN it SHALL replace both `match_samples` (1536-dim) and `match_video_index` (768-dim) with a single 768-dim vector search function.

### Requirement 6: Unified Search RPC Function

**User Story:** As a developer, I want a single `match_clips` RPC function that replaces both legacy search functions, so the codebase has one search path.

#### Acceptance Criteria

1. WHEN `match_clips` is called THEN it SHALL accept parameters: `query_embedding` (vector(768)), `match_count` (integer), `filter_dataset_id` (uuid, optional), `filter_bucket` (text, optional), `match_threshold` (float, default 0.40).
2. IF `filter_dataset_id` is provided THEN `match_clips` SHALL join through `dataset_clips` to return only clips in that dataset.
3. WHEN results are returned THEN each row SHALL include: `clip_id`, `s3_bucket`, `s3_key`, `ai_caption`, `ai_agent_context`, `ai_enrichment_source`, `mime_type`, `similarity`.
4. WHEN the RPC is deployed THEN the old `match_samples` and `match_video_index` functions SHALL be dropped.

### Requirement 7: Admin UI Updates

**User Story:** As a platform admin, I want the admin search page and catalog management pages to work against the unified clips table, so I can search, browse, and manage clips from one interface.

#### Acceptance Criteria

1. WHEN the admin search page loads THEN it SHALL call the unified search API endpoint (no mode parameter).
2. WHEN the admin searches clips THEN the search API (`/api/admin/catalog/search`) SHALL query the `clips` table via `match_clips` RPC instead of separate catalog/corpus paths.
3. WHEN admin browses a dataset THEN the API SHALL query `dataset_clips JOIN clips` instead of `dataset_samples`.
4. WHEN the admin uses "Add to Catalog" THEN the system SHALL insert into `dataset_clips` instead of copying rows into `dataset_samples`.
5. WHEN the admin uses "Create Custom Catalog" (`/api/admin/catalog/custom`) THEN the system SHALL create the dataset and insert `dataset_clips` rows with `lead_id`, not copy data into `dataset_samples`.
6. WHEN the admin views a catalog detail page (`/admin/catalog/[id]`) THEN it SHALL render clips via `dataset_clips JOIN clips` and all existing functionality (edit, preview, batch edit, CSV upload) SHALL work against the new schema.
7. WHEN the search mode toggle (CatalogSearchClient) is removed THEN the `SearchMode` type, mode URL parameter, and all mode-switching logic SHALL be deleted from the codebase.

### Requirement 8: Portal UI Updates

**User Story:** As a lead viewing the portal, I want the dataset detail page and sample gallery to render from the unified clips table, so I see accurate and up-to-date clip data.

#### Acceptance Criteria

1. WHEN the portal dataset detail page loads (`/portal/catalog/[id]`) THEN it SHALL query `dataset_clips JOIN clips` filtered by the lead's access, instead of querying `dataset_samples`.
2. WHEN the portal renders gallery cards THEN it SHALL use structured fields from the `clips` table: `filename`, `mime_type`, `ai_agent_context.scene_summary` for description, `s3_key` for signed URL generation.
3. WHEN the portal renders the sample detail modal THEN it SHALL fetch annotation data live from S3 using `ann_annotation_key` (hybrid rendering: DB for cards, S3 for detail).
4. WHEN the portal fetches annotation data from S3 THEN it SHALL use the existing `/api/portal/s3-annotation` endpoint, passing the `ann_annotation_key` from the clips table.
5. WHEN RLS policies are created for the `clips` and `dataset_clips` tables THEN authenticated users SHALL only see clips that belong to datasets they have been granted access to via `lead_dataset_access`.
6. WHEN lead-specific clips exist (dataset_clips.lead_id is set) THEN the portal SHALL only show those clips to the matching lead, not to other leads with access to the same dataset.

### Requirement 9: MCP Tool Updates

**User Story:** As an AI agent using the MCP server, I want all catalog tools to work against the unified clips table, so agent workflows don't break during the migration.

#### Acceptance Criteria

1. WHEN the `search_catalog` MCP tool is called THEN it SHALL query the `clips` table via `match_clips` instead of `match_samples`.
2. WHEN the `search_full_catalog` MCP tool is called THEN it SHALL query the same `clips` table via `match_clips` instead of `match_video_index`. The tool MAY be merged with `search_catalog` into a single `search_clips` tool.
3. WHEN the `add_clips_to_catalog` MCP tool is called THEN it SHALL insert into `dataset_clips` instead of copying rows into `dataset_samples`.
4. WHEN the `get_dataset_overview` MCP tool is called THEN it SHALL aggregate data from `dataset_clips JOIN clips` instead of `dataset_samples`.
5. WHEN the `get_corpus_stats` MCP tool is called THEN it SHALL query the `clips` table instead of `video_index`.
6. WHEN the `remove_clips_from_catalog` MCP tool is called THEN it SHALL delete from `dataset_clips` instead of `dataset_samples`.
7. WHEN the `download_clips` MCP tool is called THEN it SHALL resolve S3 keys from the `clips` table instead of `dataset_samples`.
8. WHEN any MCP tool references `VideoIndexRecord` or `DatasetSample` types THEN those types SHALL be replaced with a unified `Clip` type.

### Requirement 10: Loader Script Updates

**User Story:** As a data engineer, I want loader scripts to ingest directly into the `clips` table, so new data goes to the right place without manual intervention.

#### Acceptance Criteria

1. WHEN `load-cobry-captions.ts` runs THEN it SHALL upsert into `clips` (matching on `s3_bucket + s3_key`) with caption data mapped to `ai_caption` and `ai_enrichment_source`.
2. WHEN `load-annotation-platform.ts` runs THEN it SHALL upsert into `clips` with annotation data mapped to `ann_metadata` and `ann_annotation_key`.
3. WHEN `load-ml-dataset-captions.ts` runs THEN it SHALL upsert into `clips` with caption data mapped to `ai_caption`.
4. WHEN `load-troveo-metadata.ts` runs THEN it SHALL upsert into `clips` with metadata mapped to the appropriate `ann_*` or `tech_*` columns.
5. WHEN `ingest-samples.ts` runs THEN it SHALL upsert into `clips` and create `dataset_clips` rows, instead of inserting into `dataset_samples`.
6. WHEN `backfill-embeddings.ts` runs THEN it SHALL operate on the `clips.embedding` column (768-dim) instead of separate `dataset_samples.embedding` (1536) and `video_index.embedding` (768) columns.
7. WHEN any enrichment script (`enrich-samples-gemini.ts`, `enrich-xtr-gemini.ts`) runs THEN it SHALL write to `clips.ai_enrichment_json` and `clips.ai_agent_context` instead of `dataset_samples.enrichment_json` and `dataset_samples.agent_context`.

### Requirement 11: Supabase Edge Function Updates

**User Story:** As a platform admin, I want the enrichment and embedding edge functions to target the unified clips table, so automated pipelines keep working.

#### Acceptance Criteria

1. WHEN the `run-enrichment` edge function executes THEN it SHALL read from and write to the `clips` table (`ai_enrichment_json`, `ai_agent_context`) instead of `dataset_samples`.
2. WHEN the `embed-samples` edge function executes THEN it SHALL read `ai_caption` or `ai_agent_context.scene_summary` from `clips` and write 768-dim embeddings to `clips.embedding`.
3. WHEN the enrichment status API (`/api/admin/catalog/enrichment/status`) is called THEN it SHALL report status based on `clips` rows linked to the dataset via `dataset_clips`.

### Requirement 12: TypeScript Type Updates

**User Story:** As a developer, I want the TypeScript types to reflect the new schema so the codebase compiles cleanly and IDE autocomplete works correctly.

#### Acceptance Criteria

1. WHEN the types are updated THEN `data-catalog.ts` SHALL export a `Clip` interface matching the `clips` table columns.
2. WHEN the types are updated THEN `data-catalog.ts` SHALL export a `DatasetClip` interface matching the `dataset_clips` table columns.
3. WHEN the types are updated THEN the `DatasetSample` interface SHALL be removed.
4. WHEN the types are updated THEN the `VideoIndexRecord` interface SHALL be removed.
5. WHEN the types are updated THEN the `LeadCustomSample` interface SHALL be removed.
6. WHEN the types are updated THEN the discriminated union `UnifiedSearchResult` (CatalogSearchResult | FullCorpusSearchResult) SHALL be replaced with a single `ClipSearchResult` type.
7. WHEN the types are updated THEN all files importing removed types SHALL be updated to use the new `Clip` and `DatasetClip` types.

### Requirement 13: RLS Policies for New Tables

**User Story:** As a platform admin, I want row-level security on the new tables so that portal users can only see clips they're authorized to access.

#### Acceptance Criteria

1. WHEN RLS is enabled on `clips` THEN authenticated users SHALL be able to SELECT clips that belong to at least one dataset they have access to via `lead_dataset_access`.
2. WHEN RLS is enabled on `dataset_clips` THEN authenticated users SHALL be able to SELECT rows where the `dataset_id` is in their `lead_dataset_access` grants AND (`lead_id IS NULL` OR `lead_id` matches their lead record).
3. WHEN admin operations are performed THEN they SHALL use the service role client (bypasses RLS), preserving existing admin auth patterns.
4. WHEN the old `dataset_samples` RLS policies are dropped THEN no existing portal access SHALL break — equivalent access SHALL be provided by the new policies.

### Requirement 14: Staging-First Deployment

**User Story:** As a platform admin, I want to validate the migration on staging before touching production, so I can catch issues early.

#### Acceptance Criteria

1. WHEN the migration is ready THEN it SHALL be applied to the staging Supabase project first.
2. WHEN staging migration completes THEN the admin SHALL validate: search works, portal renders correctly, MCP tools respond, clip counts match expectations.
3. IF validation fails on staging THEN the migration SHALL be reversible — a rollback script SHALL exist that can recreate `dataset_samples` and `video_index` from the `clips` table.
4. WHEN staging is validated THEN the same migration SHALL be applied to production with the same rollback safety net.
5. WHEN the migration is applied THEN the `dataset_prefix_routes` table SHALL be preserved (it maps datasets to S3 bucket/prefix for scoping search results by dataset).
