# PRD: S3 Data Catalog Integration

## Introduction

Integrate ~80 private S3-hosted video samples and their paired annotation metadata into the existing Claru portal catalog. Videos live in the `moonvalley-annotation-platform` S3 bucket across 4 data sections (Egocentric Crowd, Egocentric Workplaces, Video Game, Cinematic Licensed Data). Each sample may have a paired `annotation-data.json` in S3 containing rich metadata (domain, task description, hand tracking, temporal chunking segments).

The integration adds AWS S3 presigned URL generation to the existing Supabase-backed portal, a `MetaTable` component for rendering polymorphic annotation metadata, tag-based filtering alongside the existing `DatasetType` enum, and a CSV ingestion pipeline. Annotation JSON files are fetched on-demand from S3 when a user opens a sample detail view.

**Two user classes access the catalog:**
- **Prospective clients** (AI lab researchers) — browse curated samples to evaluate data quality before purchasing
- **Internal team** — review/QA annotation data with full visibility

---

## Goals

- Enable secure video playback from private S3 bucket via presigned URLs without making the bucket public
- Display rich annotation metadata (domain, task, hand tracking, chunking) in a structured, readable format alongside video playback
- Add `tags` column to datasets for flexible faceting alongside the existing `DatasetType` enum
- Ingest ~80 samples from CSV into existing Supabase catalog infrastructure via one-time script, then build admin CSV import UI for future imports
- Fetch `annotation-data.json` from S3 on-demand when a user opens a sample detail view
- Achieve full test coverage: unit tests on all utilities/components, integration tests on API routes, Playwright E2E for all user flows
- Maintain the dark terminal aesthetic and existing component patterns

---

## Architecture References

| Decision | Approach |
|----------|----------|
| **Type system** | Keep `DatasetType` enum (`src/types/data-catalog.ts:12`) + add `tags: string[]` column on `datasets` table |
| **S3 URI storage** | Store `object_key` (path within bucket) on `dataset_samples.storage_path`. Bucket name + region in env vars. Do NOT store raw `s3://` URIs |
| **Metadata rendering** | Single `MetaTable` component with `FIELD_LABELS` map. Known fields get structured rendering; unknown fields fall through to JSON viewer footer |
| **Polymorphic generalData** | Zod discriminated union parsed server-side. Three shapes: `{ mainCategory, subcategory }`, `{ flow, activities[] }`, `{ selectedGame }` |
| **File rendering** | MIME-to-renderer registry: `video/* → VideoPlayer`, `application/json → JsonViewer`, `application/gzip → DownloadLink` |
| **Presigned URLs** | Server-side AWS SDK `getSignedUrl()` with 1-hour expiry. Session-validated API route |
| **Annotation JSON** | Fetched on-demand server-side when user opens detail view. Parsed and passed to MetaTable client component |

**Existing infrastructure to build on:**
- `src/lib/supabase/storage.ts` — Supabase signed URL generation (extend with S3)
- `src/app/portal/catalog/[id]/page.tsx` — Dataset detail server component (lines 103-111 handle signed URL resolution)
- `src/app/portal/catalog/[id]/SampleDetailModal.tsx` — 60/40 split view with `extractCommonFields()` helper
- `src/app/portal/catalog/CatalogBrowser.tsx` — Browse grid with search + category filters
- `src/app/api/admin/catalog/[id]/samples/bulk/route.ts` — Bulk import API
- `src/types/data-catalog.ts` — Type definitions for Dataset, DatasetSample, etc.

---

## User Stories

### US-001: S3 Presigner Utility

**Description:** As a developer, I need a utility to generate presigned URLs for S3 objects so the portal can serve private video/JSON files.

**Acceptance Criteria:**
- [ ] Create `src/lib/s3/presigner.ts` with:
  - `getS3SignedUrl(objectKey: string, expiresIn?: number): Promise<string | null>` — generates presigned GET URL
  - Uses `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`
  - Bucket name and region read from `S3_BUCKET_NAME` and `AWS_REGION` env vars
  - Default expiry: 3600 seconds (matches existing Supabase pattern)
  - Handles keys with spaces, special characters, and mixed-case extensions
  - Returns `null` and logs error on failure
- [ ] Add env vars to `.env.local`: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`
- [ ] Install dependencies: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- [ ] Typecheck passes
- [ ] **Unit Tests (Vitest):** Test `getS3SignedUrl` with valid key, key with spaces, missing env vars (returns null), custom expiry. Mock AWS SDK calls.
- [ ] **Code Review:** Run `code-reviewer` agent to verify security (no credential leakage, proper error handling)

**Agent:** `nextjs-expert`

---

### US-002: S3 Presigned URL API Route

**Description:** As a portal user, I need an authenticated API endpoint that returns presigned URLs so the browser can stream S3 videos.

**Acceptance Criteria:**
- [ ] Create `src/app/api/portal/s3-signed-url/route.ts` — POST handler
- [ ] Request body: `{ objectKey: string }` (validated with Zod)
- [ ] Response: `{ signedUrl: string }` on success, `{ error: string }` on failure
- [ ] Validates Supabase session before generating URL — returns 401 if unauthenticated
- [ ] Validates `objectKey` is non-empty and doesn't contain path traversal (`..`)
- [ ] Rate limiting consideration: log requests for audit trail (object key + user ID + timestamp)
- [ ] Returns 500 with generic error message on AWS SDK failure (no internal details leaked)
- [ ] Typecheck passes
- [ ] **Unit Tests (Vitest):** Test auth validation (401 for unauthenticated), input validation (400 for empty key, path traversal), success path, AWS SDK error handling. Mock Supabase auth + AWS SDK.
- [ ] **Code Review:** Run `code-reviewer` agent to verify auth enforcement, input validation, no credential exposure

**Agent:** `nextjs-expert`

---

### US-003: Database Schema — Add `tags` Column and `s3_object_key` Fields

**Description:** As a developer, I need database schema changes to support S3-referenced samples and tag-based filtering.

**Acceptance Criteria:**
- [ ] Add `tags text[] DEFAULT '{}'` column to `datasets` table via Supabase migration
- [ ] Add `s3_object_key text` column to `dataset_samples` table (nullable — existing samples use `storage_path`)
- [ ] Add `s3_annotation_key text` column to `dataset_samples` table (nullable — path to annotation-data.json in S3)
- [ ] Update `DatasetType` in `src/types/data-catalog.ts` — keep existing enum unchanged
- [ ] Add `tags: string[]` to `Dataset` interface
- [ ] Add `s3_object_key: string | null` and `s3_annotation_key: string | null` to `DatasetSample` interface
- [ ] RLS policy: portal users can read `s3_object_key` and `s3_annotation_key` for datasets they have access to (follows existing `lead_dataset_access` pattern)
- [ ] Typecheck passes
- [ ] **Unit Tests (Vitest):** Test that new type interfaces compile correctly. Test migration SQL runs without errors (if using migration test harness).
- [ ] **Code Review:** Run `code-reviewer` agent to verify migration safety, RLS policy correctness, type interface consistency with DB schema

**Agent:** `nextjs-expert`

---

### US-004: Update Dataset Detail Page for S3 Samples

**Description:** As a portal user, I want to view S3-hosted video samples in the dataset detail page so I can evaluate data quality.

**Acceptance Criteria:**
- [ ] Update `src/app/portal/catalog/[id]/page.tsx` lines 103-111 to handle S3 samples:
  - If `sample.s3_object_key` is present → call `getS3SignedUrl(sample.s3_object_key)` from `src/lib/s3/presigner.ts`
  - Else if `sample.media_url` is present → use directly (existing behavior)
  - Else if `sample.storage_path` is present → call `getSignedUrl(sample.storage_path)` (existing behavior)
- [ ] Presigned URL generation happens server-side in the RSC (no client-side API call needed for initial load)
- [ ] Video plays in existing `VideoPlayer.tsx` component — no changes needed to player
- [ ] Mixed-case extensions (`.MOV`, `.MP4`) handled correctly by existing `isVideoUrl()` helper
- [ ] Typecheck passes
- [ ] Verify in browser: navigate to a dataset with S3 samples, confirm video loads and plays
- [ ] **Unit Tests (Vitest):** Test the URL resolution logic with all three branches (s3_object_key, media_url, storage_path). Test with null/empty values.
- [ ] **Code Review:** Run `code-reviewer` agent to verify no regressions to existing Supabase Storage path, proper error handling for failed presigns

**Agent:** `nextjs-expert`

---

### US-005: On-Demand Annotation JSON Fetching

**Description:** As a portal user, I want to see structured annotation metadata when I open a sample detail view so I can understand the data quality and characteristics.

**Acceptance Criteria:**
- [ ] Create `src/lib/s3/annotation.ts` with:
  - `fetchAnnotationJson(objectKey: string): Promise<Record<string, unknown> | null>` — fetches JSON from S3 via presigned URL, parses, returns object
  - Handles fetch errors gracefully (returns null, logs warning)
  - Timeout: 10 seconds
- [ ] When `SampleDetailModal` opens, if sample has `s3_annotation_key`:
  - Client calls new API route `POST /api/portal/s3-annotation` with `{ objectKey: sample.s3_annotation_key }`
  - API route validates session, fetches JSON server-side via `fetchAnnotationJson()`, returns parsed JSON
  - Client merges fetched annotation with existing `metadata_json` and displays in the right panel
- [ ] Loading state shown while annotation is being fetched ("Fetching annotation..." with terminal cursor)
- [ ] Graceful fallback: if fetch fails, show existing `metadata_json` only with no error to user
- [ ] Typecheck passes
- [ ] Verify in browser: open a sample with S3 annotation, confirm metadata loads after brief delay
- [ ] **Unit Tests (Vitest):** Test `fetchAnnotationJson` with valid JSON, malformed JSON (returns null), network timeout (returns null), missing key (returns null). Test API route auth + success + failure paths.
- [ ] **Code Review:** Run `code-reviewer` agent to verify no SSRF risks (object key validated), proper timeout handling, no credential exposure in client response

**Agent:** `nextjs-expert`

---

### US-006: Zod Schemas for Polymorphic Annotation Metadata

**Description:** As a developer, I need Zod schemas to safely parse the three annotation metadata shapes so the MetaTable component receives typed data.

**Acceptance Criteria:**
- [ ] Create `src/lib/schemas/annotation-metadata.ts` with:
  - `EgocentricShortFormSchema` — validates `{ mainCategory: string, subcategory: string }`
  - `EgocentricLongFormSchema` — validates `{ flow: string, activities: string[] }`
  - `VideoGameSchema` — validates `{ selectedGame: string }`
  - `AnnotationMetadataSchema` — union that tries each schema and returns the matched variant + a `_type` discriminator
  - `RekVisionMetadataSchema` — validates the Reka Vision metadata structure: `{ domain, task, task_description, technical_specs, environment_label, environment_description, hands }`
  - `ChunkingSchema` — validates the chunking array: `Array<{ start_s, end_s, label, objects[], actions[], confidence }>`
- [ ] `parseAnnotationMetadata(raw: unknown): ParsedAnnotation` — returns typed object with `_type` discriminator or `{ _type: 'unknown', raw }` for unrecognized shapes
- [ ] All schemas use `.passthrough()` so unknown fields are preserved (not stripped)
- [ ] Typecheck passes
- [ ] **Unit Tests (Vitest):** Test each schema variant with valid data, test union parser with all three shapes, test with malformed/incomplete data (returns `_type: 'unknown'`), test that unknown fields are preserved. Test RekVision + Chunking schemas with real sample data from the CSV.
- [ ] **Code Review:** Run `code-reviewer` agent to verify schema correctness matches actual S3 JSON structures, no data loss from parsing

**Agent:** `nextjs-expert`

---

### US-007: MetaTable Component

**Description:** As a portal user, I want annotation metadata displayed in a structured, readable format (not raw JSON) so I can quickly assess data characteristics.

**Acceptance Criteria:**
- [ ] Create `src/app/portal/catalog/[id]/MetaTable.tsx` — client component
- [ ] Props: `{ metadata: Record<string, unknown>, annotationData?: Record<string, unknown> | null }`
- [ ] `FIELD_LABELS` map defines known fields with display labels and optional formatters:
  - `domain` → "Domain" (uppercase, badge style)
  - `task` / `task_description` → "Task" (paragraph text)
  - `technical_specs.duration_s` → "Duration" (formatted: `9s`, `3m 06s`)
  - `technical_specs.resolution_px` → "Resolution" (`1920 x 1080`)
  - `technical_specs.fps_estimate` → "FPS"
  - `technical_specs.aspect_ratio` → "Aspect Ratio"
  - `environment_label` → "Environment" (badge style)
  - `environment_description` → "Environment Detail" (paragraph)
  - `hands.hands_visible` → "Hands Visible" (yes/no)
  - `hands.right_hand_pct` / `left_hand_pct` / `both_hands_pct` → "Hand Usage" (horizontal bar visualization)
  - `hands.primary_hand` → "Primary Hand"
  - `hands.confidence` → "Confidence" (percentage)
  - `generalData.mainCategory` → "Category"
  - `generalData.subcategory` → "Subcategory"
  - `generalData.flow` → "Activity Flow"
  - `generalData.activities` → "Activities" (comma-separated badges)
  - `generalData.selectedGame` → "Game"
  - `chunking` → "Segments" (structured text: `[0s-35s] checking_meat_tenderness (0.90)` per line)
- [ ] Tier 1: Known fields render with structured widgets (badges, bars, formatted values) in terminal aesthetic
- [ ] Tier 2: Any remaining fields not in `FIELD_LABELS` → render in a collapsible "Raw Metadata" JSON viewer section at the bottom (reuse existing `highlightJson` from `SampleDetailModal.tsx`)
- [ ] Log analytics event when fallback JSON viewer is displayed (flags metadata gaps for QA)
- [ ] Empty/null fields are silently skipped (no empty rows)
- [ ] Matches existing terminal aesthetic: JetBrains Mono, `// SECTION HEADERS`, accent-primary colors
- [ ] Typecheck passes
- [ ] Verify in browser: open samples with metadata (Egocentric Crowd with Reka Vision data), confirm structured display. Open samples without metadata, confirm graceful empty state.
- [ ] **Unit Tests (Vitest):** Test with each metadata shape (short form, long form, game, reka vision with chunking). Test with empty metadata. Test that unknown fields appear in fallback viewer. Test FIELD_LABELS formatting functions. Test chunking text output format.
- [ ] **Code Review:** Run `code-reviewer` agent to verify accessibility (semantic HTML, screen reader support), terminal aesthetic consistency, no XSS risks from rendering user-provided JSON values

**Agent:** `frontend-expert`

---

### US-008: Integrate MetaTable into SampleDetailModal

**Description:** As a portal user, I want the right panel of the sample detail modal to show structured metadata (via MetaTable) instead of only raw JSON.

**Acceptance Criteria:**
- [ ] Update `src/app/portal/catalog/[id]/SampleDetailModal.tsx`:
  - Replace the raw JSON viewer in the right panel with `MetaTable`
  - Pass `sample.metadata_json` as `metadata` prop
  - If sample has `s3_annotation_key`, trigger on-demand fetch (US-005) and pass result as `annotationData` prop
  - Show loading spinner/terminal cursor while annotation is fetching
- [ ] Keep the existing `extractCommonFields()` summary strip above MetaTable (it provides quick-glance info)
- [ ] Keep "Copy JSON" button — copies the full merged metadata as raw JSON
- [ ] Typecheck passes
- [ ] Verify in browser: open sample modal, confirm MetaTable renders structured metadata. Confirm raw JSON fallback for unknown fields. Confirm Copy JSON still works.
- [ ] **Unit Tests (Vitest):** Test modal renders MetaTable with metadata. Test loading state during annotation fetch. Test fallback when annotation fetch fails. Test Copy JSON includes merged data.
- [ ] **Code Review:** Run `code-reviewer` agent to verify no regressions to existing modal functionality (prev/next navigation, keyboard shortcuts, click-outside-to-close)

**Agent:** `frontend-expert`

---

### US-009: MIME-to-Renderer Registry

**Description:** As a developer, I need a file type registry that maps MIME types to renderer components so the detail view can handle new file types without code changes.

**Acceptance Criteria:**
- [ ] Create `src/lib/file-renderers.ts` with:
  - `type FileRendererConfig = { component: string; label: string }` (component name as string, resolved by dynamic import)
  - `FILE_RENDERERS: Record<string, FileRendererConfig>` mapping:
    - `video/mp4` → VideoPlayer
    - `video/quicktime` → VideoPlayer
    - `video/webm` → VideoPlayer
    - `application/json` → JsonViewer (existing `MetadataJsonViewer.tsx`)
    - `application/gzip` → DownloadLink (new simple component — just an anchor tag)
    - `image/*` → ImageViewer (existing `isImageUrl` path in SampleDetailModal)
  - `getRendererForMime(mimeType: string): FileRendererConfig | null` — matches exact type first, then wildcard (`video/*`), then null
- [ ] Update `SampleDetailModal.tsx` to use `getRendererForMime()` instead of inline `isVideoUrl()` / `isImageUrl()` checks
- [ ] Create `src/app/portal/catalog/[id]/DownloadLink.tsx` — minimal component: terminal-styled download link with file size
- [ ] Typecheck passes
- [ ] **Unit Tests (Vitest):** Test `getRendererForMime` with exact match, wildcard match, unknown type (returns null). Test all registered MIME types resolve correctly.
- [ ] **Code Review:** Run `code-reviewer` agent to verify no regressions to existing video/image rendering paths

**Agent:** `frontend-expert`

---

### US-010: Tag-Based Filtering in CatalogBrowser

**Description:** As a portal user, I want to filter datasets by tags in addition to categories so I can find specific data characteristics (e.g., "annotated", "hand-tracking", "egocentric").

**Acceptance Criteria:**
- [ ] Update `src/app/portal/catalog/CatalogBrowser.tsx`:
  - Add `selectedTags: string[]` state
  - Compute `availableTags` by scanning all datasets' `tags` arrays (deduplicated, sorted)
  - Render tag pill buttons below category pills (terminal-styled, accent border when active)
  - Filter logic: dataset must have ALL selected tags (AND filter)
  - URL sync: persist selected tags in `?tags=annotated,hand-tracking` query params
- [ ] Update `src/app/portal/catalog/page.tsx` server component to fetch `tags` column in the dataset query
- [ ] Tags render as monospace pills with `#` prefix (e.g., `#annotated`, `#hand-tracking`)
- [ ] Clear all tags button when any tags are selected
- [ ] Empty state message when no datasets match filters: "No datasets match the selected filters."
- [ ] Typecheck passes
- [ ] Verify in browser: select tags, confirm filtering works. Confirm URL updates. Refresh page, confirm tags persist.
- [ ] **Unit Tests (Vitest):** Test filter logic (AND semantics), tag deduplication, URL sync read/write, empty state. Test with datasets that have overlapping tags.
- [ ] **Code Review:** Run `code-reviewer` agent to verify URL state management, no performance issues with tag scanning on large datasets

**Agent:** `frontend-expert`

---

### US-011: CSV Ingestion Script (One-Time)

**Description:** As a developer, I need a script to transform the `Data Catalog Samples.csv` into the bulk import format so I can populate the catalog via the existing admin API.

**Acceptance Criteria:**
- [ ] Create `scripts/ingest-csv.ts` — Node.js script (runs with `npx tsx scripts/ingest-csv.ts`)
- [ ] Parses 4 CSV sections with different column schemas:
  - Detects section boundaries by header rows ("Egocentric Crowd", "Egocentric Workplaces", "Video Game", "Cinematic Licensed Data")
  - Each section has its own column mapping (not hardcoded column indices — uses header row detection)
- [ ] For each row, produces:
  ```json
  {
    "filename": "extracted from S3 URI",
    "s3_object_key": "video_capture/completed/{uuid}/{uuid}.mov",
    "s3_annotation_key": "video_capture/completed/{uuid}/annotation-data.json",
    "mime_type": "guessed from extension",
    "metadata_json": {
      "section": "egocentric_crowd",
      "type": "short_form",
      "category": "Object Manipulation",
      "subcategory": "Twist",
      "annotation_id": "00356662-...",
      "reka_vision_metadata": { ... },
      "reka_vision_chunking": [ ... ]
    }
  }
  ```
- [ ] Handles edge cases:
  - S3 URIs with spaces (`Video Capture: First Person Videos (Phone)/...`)
  - Trailing spaces in paths (`Workplaces /...`)
  - Mixed-case extensions (`.mov`, `.MP4`, `.MOV`)
  - Paths without file extensions (line 50: `Paper Cutting`)
  - Inline JSON metadata spanning two CSV columns (merge `Metadata & Labeling` + `Chunking` columns)
  - `na` or empty annotation IDs
  - Properly extracts `object_key` by stripping `s3://moonvalley-annotation-platform/` prefix
- [ ] Outputs JSON files per dataset group (e.g., `scripts/output/egocentric-crowd-object-manipulation.json`) ready for bulk import
- [ ] Dry-run mode: prints summary table of parsed entries without writing files
- [ ] Typecheck passes
- [ ] **Unit Tests (Vitest):** Test S3 URI parsing (standard, with spaces, trailing spaces, no extension). Test MIME type guessing. Test section boundary detection. Test inline JSON merging from two columns. Test with actual sample rows from the CSV.
- [ ] **Code Review:** Run `code-reviewer` agent to verify correct CSV parsing, no data loss, proper handling of edge cases

**Agent:** `nextjs-expert`

---

### US-012: Run Bulk Import via Admin API

**Description:** As an admin, I need to create dataset categories and datasets in the admin UI, then import samples from the CSV script output.

**Acceptance Criteria:**
- [ ] Create 4 `dataset_categories` via admin UI or direct Supabase insert:
  - "Egocentric Crowd" (slug: `egocentric-crowd`)
  - "Egocentric Workplaces" (slug: `egocentric-workplaces`)
  - "Video Game" (slug: `video-game`)
  - "Cinematic Licensed Data" (slug: `cinematic-licensed`)
- [ ] Create ~15-20 `datasets` grouped by category + subcategory, with appropriate `type`, `tags`, and descriptions:
  - E.g., "Object Manipulation — Short Form" under Egocentric Crowd, type: `short_form`, tags: `["egocentric", "object-manipulation", "annotated"]`
  - E.g., "Barista" under Egocentric Workplaces, type: `long_form`, tags: `["egocentric", "workplace", "video-only"]`
  - E.g., "Shooter Games" under Video Game, type: `game_capture`, tags: `["video-game", "annotated", "game-specs"]`
- [ ] Update bulk import API route (`src/app/api/admin/catalog/[id]/samples/bulk/route.ts`) to accept `s3_object_key` and `s3_annotation_key` fields in the sample payload
- [ ] Import each JSON output file from US-011 via the bulk import API
- [ ] Verify all ~80 samples appear in the portal catalog for leads with appropriate dataset access
- [ ] Typecheck passes
- [ ] **Unit Tests (Vitest):** Test bulk import route accepts new S3 fields. Test validation rejects invalid S3 keys. Test MIME type detection for S3-referenced files.
- [ ] **Code Review:** Run `code-reviewer` agent to verify bulk import API changes are backward-compatible, no regression for existing Supabase Storage samples

**Agent:** `nextjs-expert`

---

### US-013: Metadata Completeness Badges on Dataset Cards

**Description:** As a portal user, I want visual indicators on dataset cards showing what data is available (annotated, video-only, game specs) so I can find the richest datasets.

**Acceptance Criteria:**
- [ ] Update dataset card rendering in `CatalogBrowser.tsx`:
  - `[ANNOTATED]` badge — dataset has tag `annotated` (accent green: `bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]`)
  - `[VIDEO]` badge — dataset has tag `video-only` (muted: `bg-[var(--bg-tertiary)] text-[var(--text-muted)]`)
  - `[GAME SPECS]` badge — dataset has tag `game-specs` (blue accent: `bg-blue-500/10 text-blue-400`)
  - `[HAND TRACKING]` badge — dataset has tag `hand-tracking` (accent green)
- [ ] Badges render in the card footer, monospace, uppercase, compact
- [ ] Badge visibility driven entirely by `dataset.tags` — no hardcoded logic per dataset
- [ ] Typecheck passes
- [ ] Verify in browser: confirm badges appear correctly for different dataset types
- [ ] **Unit Tests (Vitest):** Test badge rendering for each tag type. Test dataset with multiple tags shows multiple badges. Test dataset with no tags shows no badges.
- [ ] **Code Review:** Run `code-reviewer` agent to verify badge accessibility (color contrast, screen reader labels)

**Agent:** `frontend-expert`

---

### US-014: Video Format Fallback & Admin Alert

**Description:** As a portal user, I want a clear fallback message when a video format isn't supported by my browser. As an admin, I want to see which samples have format issues.

**Acceptance Criteria:**
- [ ] Update `src/app/portal/catalog/[id]/VideoPlayer.tsx`:
  - Add `canplay` event listener with 5-second timeout
  - If video fails to load or `canplay` doesn't fire within 5s, show terminal-styled fallback:
    ```
    // FORMAT NOT SUPPORTED
    This video format (.MOV) may not be supported in your browser.
    Try opening in Safari or downloading the file.
    [Download] button (presigned URL with Content-Disposition: attachment)
    ```
  - Fallback styled with `bg-[var(--bg-tertiary)]`, monospace text, accent border
  - Also handle `error` event on `<video>` element for immediate failure detection
- [ ] Add `s3_format_issues` tracking:
  - When fallback is triggered, POST to `POST /api/portal/format-issue` with `{ sampleId, mimeType, userAgent }`
  - API route logs to `format_issues` Supabase table (new): `sample_id`, `mime_type`, `user_agent`, `created_at`
- [ ] Admin dashboard flag:
  - In admin catalog sample list, show orange warning badge on samples that have format issue reports
  - Tooltip shows count of reports and most common browser
- [ ] Typecheck passes
- [ ] Verify in browser: test with a `.MOV` file in Chrome/Firefox, confirm fallback appears if not supported
- [ ] **Unit Tests (Vitest):** Test fallback trigger logic (timeout, error event). Test format issue API route validation. Test admin badge rendering with/without issues.
- [ ] **Code Review:** Run `code-reviewer` agent to verify download URL security (presigned, not raw S3), fallback UX accessibility

**Agent:** `frontend-expert` (UI), `nextjs-expert` (API route + admin)

---

### US-015: Annotation JSON Caching in Supabase

**Description:** As a developer, I want fetched annotation JSONs cached in Supabase `metadata_json` after first fetch so repeat views are instant.

**Acceptance Criteria:**
- [ ] Update the annotation fetch flow (US-005):
  - When `POST /api/portal/s3-annotation` fetches JSON from S3 successfully:
    1. Return parsed JSON to client immediately
    2. In background (non-blocking), PATCH `dataset_samples.metadata_json` with the merged annotation data using admin client (bypass RLS)
    3. Set a `_cached_at` timestamp field in `metadata_json` to track when it was cached
  - On subsequent requests for the same sample:
    1. Check if `metadata_json._cached_at` exists
    2. If yes, return `metadata_json` directly — no S3 fetch needed
    3. If no, fetch from S3 and cache as above
- [ ] Add `_s3_annotation_cached: boolean` computed field in the MetaTable to indicate data source
- [ ] Cache is invalidated if `s3_annotation_key` changes (unlikely but handled)
- [ ] Admin can force re-fetch by clearing `metadata_json._cached_at` via admin UI
- [ ] Typecheck passes
- [ ] **Unit Tests (Vitest):** Test cache hit path (returns cached data, no S3 call). Test cache miss path (fetches S3, caches, returns). Test cache invalidation on key change. Test background write doesn't block response.
- [ ] **Code Review:** Run `code-reviewer` agent to verify no race conditions on concurrent requests, admin client usage is safe, cached data integrity

**Agent:** `nextjs-expert`

---

### US-016: Game/PC Specs Panel (Extensible Data Panel System)

**Description:** As a portal user viewing a video game sample, I want to see game and PC specifications in a separate panel. The system should be extensible so new data panel types can be added in the future.

**Acceptance Criteria:**
- [ ] Create an extensible panel system in `src/app/portal/catalog/[id]/DataPanels/`:
  - `DataPanelRegistry.ts` — maps panel type strings to panel components:
    ```typescript
    const PANEL_REGISTRY: Record<string, { component: ComponentType<DataPanelProps>; label: string; icon: LucideIcon }> = {
      'game_specs': { component: GameSpecsPanel, label: 'Game & PC Specs', icon: Monitor },
      'annotation': { component: MetaTable, label: 'Annotation Metadata', icon: FileJson },
      // Future: 'hand_tracking_viz', 'chunking_timeline', 'robotics_telemetry', etc.
    }
    ```
  - `DataPanelProps` interface: `{ data: Record<string, unknown>; sampleId: string }`
  - `DataPanelTabs.tsx` — tabbed container that renders available panels. Tabs only appear if the sample has data for that panel type.
- [ ] Create `GameSpecsPanel.tsx`:
  - Renders game specs JSON in structured format:
    - **System:** OS, CPU, GPU (name + VRAM), RAM, architecture
    - **Game:** Process name, window title, game name
    - **Display:** Resolution, refresh rate, primary display
    - **Application:** Capture app version, build date
  - Terminal-styled with `// SYSTEM`, `// GAME`, `// DISPLAY` section headers
  - Unknown fields in the specs JSON fall through to a "Raw Specs" collapsible section
- [ ] Update `SampleDetailModal.tsx` right panel:
  - Replace single MetaTable with `DataPanelTabs`
  - Tab 1: "Annotation Metadata" (MetaTable — always shown if metadata exists)
  - Tab 2: "Game & PC Specs" (GameSpecsPanel — only shown if sample has `s3_specs_key` or specs in metadata)
  - Future tabs auto-appear when registered in `PANEL_REGISTRY`
- [ ] Add `s3_specs_key text` column to `dataset_samples` table (nullable — path to game specs JSON in S3)
- [ ] Update `DatasetSample` interface with `s3_specs_key: string | null`
- [ ] Specs JSON fetched on-demand same as annotation JSON (via presigned URL, with same caching pattern)
- [ ] Typecheck passes
- [ ] Verify in browser: open a video game sample with specs, confirm Game Specs tab appears with structured data. Open a non-game sample, confirm only Annotation tab shows.
- [ ] **Unit Tests (Vitest):** Test panel registry resolves correct components. Test DataPanelTabs renders only available tabs. Test GameSpecsPanel with real specs data. Test with empty/missing specs. Test future extensibility — add mock panel to registry, verify it renders.
- [ ] **Code Review:** Run `code-reviewer` agent to verify extensibility pattern is clean, no tight coupling between panel types

**Agent:** `frontend-expert` (panels + UI), `nextjs-expert` (DB schema + API)

---

### US-017: Admin CSV Import UI

**Description:** As an admin, I want to upload a CSV file through the admin dashboard, map columns to dataset fields, preview the import, and execute it — so future data imports don't require running scripts.

**Acceptance Criteria:**
- [ ] Create `src/app/admin/catalog/import/page.tsx` — admin CSV import page
- [ ] Step 1: **Upload & Parse**
  - File upload dropzone (terminal-styled, accepts `.csv`)
  - Parse CSV client-side using `papaparse` (install as dependency)
  - Display first 5 rows as preview table
  - Auto-detect section boundaries (blank rows, section headers)
- [ ] Step 2: **Column Mapping**
  - For each detected section, show column mapping UI:
    - Dropdown per target field: `video_s3_key`, `annotation_s3_key`, `specs_s3_key`, `type`, `category`, `subcategory`, `annotation_id`, `metadata_json`
    - Auto-suggest mappings based on column header names
    - S3 URI fields: option to auto-strip `s3://bucket-name/` prefix to extract object key
  - Show which target dataset each section maps to (select from existing datasets or create new)
- [ ] Step 3: **Preview & Validate**
  - Show full parsed sample list with resolved fields
  - Highlight validation errors (missing required fields, invalid S3 keys, duplicate annotation IDs)
  - Show count: `X samples ready, Y warnings, Z errors`
  - Validate a sample S3 key by calling HeadObject (spot-check 1-2 random samples)
- [ ] Step 4: **Import**
  - Submit to existing bulk import API (`POST /api/admin/catalog/[id]/samples/bulk`)
  - Progress bar showing import status
  - Results summary: `X imported, Y skipped, Z failed` with error details
  - Option to download error report as CSV
- [ ] Navigation: add "Import CSV" button to admin catalog page header
- [ ] Install `papaparse` dependency
- [ ] Typecheck passes
- [ ] Verify in browser: upload test CSV, map columns, preview, execute import
- [ ] **Unit Tests (Vitest):** Test CSV parsing with all 4 section types. Test column auto-mapping logic. Test S3 prefix stripping. Test validation rules (missing fields, path traversal). Test section boundary detection.
- [ ] **Code Review:** Run `code-reviewer` agent to verify no XSS from CSV content rendering, proper file size limits, admin auth enforcement

**Agent:** `frontend-expert` (UI), `nextjs-expert` (API integration)

---

### US-018: Playwright E2E — Catalog Browse & Filter Flow

**Description:** As QA, I need an end-to-end test verifying the complete catalog browse and filtering flow for authenticated portal users.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/catalog-browse.spec.ts`
- [ ] Test prerequisites: seed test data in Supabase (dataset categories, datasets with tags, samples with S3 keys) via test setup fixture
- [ ] Test flow:
  1. Navigate to `/portal/catalog` (authenticated via test lead session)
  2. Verify dataset cards render with correct metadata badges
  3. Click a category filter pill — verify dataset list filters correctly
  4. Select a tag filter (`#annotated`) — verify AND filtering with category
  5. Type in search box — verify search filters by name/subcategory
  6. Clear all filters — verify full list restores
  7. Verify URL query params update with each filter change
  8. Refresh page — verify filters persist from URL params
- [ ] Test assertions for:
  - Correct number of visible dataset cards after each filter
  - Badge visibility matches dataset tags
  - Empty state message when no matches
  - URL parameter synchronization
- [ ] Test uses Page Object Model pattern (`tests/pages/CatalogPage.ts`)
- [ ] Test runs via Playwright MCP browser automation
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent to verify test coverage completeness, POM pattern consistency

**Agent:** Use Playwright MCP (`mcp__playwright__*` tools) for browser automation. Use `nextjs-expert` for test file creation.

---

### US-019: Playwright E2E — Sample Detail & Video Playback Flow

**Description:** As QA, I need an end-to-end test verifying that S3-hosted video samples load and play correctly in the sample detail modal with structured metadata.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/sample-detail.spec.ts`
- [ ] Test prerequisites: seed test dataset with S3-referenced samples (at least one with annotation JSON, one without)
- [ ] Test flow:
  1. Navigate to `/portal/catalog/[test-dataset-id]` (authenticated)
  2. Verify sample gallery renders with thumbnail grid
  3. Click first sample — verify detail modal opens
  4. Verify video element loads (check `<video>` src is a presigned URL with `X-Amz-Signature` parameter)
  5. Verify video plays (check `readyState` or `canplay` event fires)
  6. Verify MetaTable renders structured fields (domain, task, etc.) if annotation data present
  7. Verify "Raw Metadata" fallback section exists for unknown fields
  8. Verify "Copy JSON" button copies metadata to clipboard
  9. Navigate to next sample via arrow button — verify modal updates
  10. Close modal via X button — verify return to gallery view
  11. Open a sample WITHOUT annotation — verify graceful empty state (no loading spinner stuck, no error)
- [ ] Test assertions for:
  - Video element `src` contains S3 presigned URL signature
  - MetaTable section headers visible (`// DOMAIN`, `// TASK`, etc.)
  - Modal keyboard navigation (left/right arrows, Escape to close)
  - Loading state during annotation fetch resolves within 10 seconds
- [ ] Test uses Page Object Model pattern (`tests/pages/SampleDetailPage.ts`)
- [ ] Test runs via Playwright MCP browser automation
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent to verify test assertions are comprehensive, no flaky timing issues

**Agent:** Use Playwright MCP (`mcp__playwright__*` tools) for browser automation. Use `nextjs-expert` for test file creation.

---

### US-020: Playwright E2E — End-to-End User Acceptance Flow

**Description:** As QA, I need a comprehensive end-to-end acceptance test simulating a real user journey from catalog browse through video playback and metadata inspection.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/user-acceptance.spec.ts`
- [ ] Test simulates complete user journey:
  1. Authenticated lead logs in and lands on portal catalog
  2. Browses datasets — verifies all 4 categories visible
  3. Filters to "Egocentric Crowd" category
  4. Selects `#annotated` tag filter
  5. Opens a dataset (e.g., "Object Manipulation — Short Form")
  6. Verifies stats bar (sample count, duration)
  7. Opens first sample in detail modal
  8. Verifies video loads and plays from S3 presigned URL
  9. Verifies MetaTable shows structured annotation metadata
  10. Navigates through 3 samples using keyboard arrows
  11. Closes modal and returns to dataset page
  12. Navigates back to catalog browse
  13. Clears filters and searches for "GTA 5"
  14. Opens Video Game dataset, verifies game sample plays
  15. Verifies game-specific metadata renders (selectedGame field)
- [ ] Test includes timing assertions:
  - Page load under 3 seconds
  - Video start (first frame) under 5 seconds
  - Annotation fetch under 10 seconds
- [ ] Test captures screenshots at key steps (for visual regression baseline)
- [ ] Test runs via Playwright MCP browser automation
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent to verify test completeness covers all acceptance criteria from prior stories

**Agent:** Use Playwright MCP (`mcp__playwright__*` tools) for browser automation. Use `nextjs-expert` for test file creation.

---

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** — Test core logic, validation, edge cases, and component rendering
2. **Integration Tests** — API routes tested with mocked Supabase + AWS SDK
3. **Code Review** — Run `code-reviewer` agent after implementation to verify correctness, security, and consistency
4. **Type Safety** — All code must pass TypeScript strict mode (`tsc --noEmit`)
5. **Browser Verification** — UI stories verified visually using Playwright MCP

End-to-end tests (Playwright) are defined in US-018, US-019, and US-020 to verify complete user flows.

### Agent Assignment Summary

| Story | Primary Agent | Supporting Agent |
|-------|--------------|-----------------|
| US-001 S3 Presigner | `nextjs-expert` | `code-reviewer` |
| US-002 Presigned URL API | `nextjs-expert` | `code-reviewer` |
| US-003 DB Schema | `nextjs-expert` | `code-reviewer` |
| US-004 Detail Page S3 | `nextjs-expert` | `code-reviewer` |
| US-005 Annotation Fetch | `nextjs-expert` | `code-reviewer` |
| US-006 Zod Schemas | `nextjs-expert` | `code-reviewer` |
| US-007 MetaTable | `frontend-expert` | `code-reviewer` |
| US-008 MetaTable Integration | `frontend-expert` | `code-reviewer` |
| US-009 MIME Registry | `frontend-expert` | `code-reviewer` |
| US-010 Tag Filtering | `frontend-expert` | `code-reviewer` |
| US-011 CSV Script | `nextjs-expert` | `code-reviewer` |
| US-012 Bulk Import | `nextjs-expert` | `code-reviewer` |
| US-013 Completeness Badges | `frontend-expert` | `code-reviewer` |
| US-014 MOV Fallback | `frontend-expert` + `nextjs-expert` | `code-reviewer` |
| US-015 Annotation Caching | `nextjs-expert` | `code-reviewer` |
| US-016 Game Specs Panel | `frontend-expert` + `nextjs-expert` | `code-reviewer` |
| US-017 Admin CSV Import | `frontend-expert` + `nextjs-expert` | `code-reviewer` |
| US-018 E2E Browse | `nextjs-expert` + Playwright MCP | `code-reviewer` |
| US-019 E2E Detail | `nextjs-expert` + Playwright MCP | `code-reviewer` |
| US-020 E2E Acceptance | `nextjs-expert` + Playwright MCP | `code-reviewer` |

---

## Functional Requirements

- **FR-1:** The system must generate presigned URLs for S3 objects using AWS SDK v3, with configurable expiry (default 1 hour)
- **FR-2:** The presigned URL API route must validate Supabase session before generating any URL
- **FR-3:** The presigned URL API route must reject object keys containing path traversal sequences (`..`)
- **FR-4:** The dataset detail page must resolve S3 presigned URLs server-side during RSC render
- **FR-5:** The sample detail modal must fetch annotation-data.json from S3 on-demand when opened
- **FR-6:** The MetaTable component must render known metadata fields with structured widgets and fall through to raw JSON for unknown fields
- **FR-7:** The MetaTable must handle all three `generalData` shapes (short form egocentric, long form egocentric, video game) without errors
- **FR-8:** Chunking data must render as structured text showing timestamp ranges, labels, and confidence scores
- **FR-9:** The catalog browser must support tag-based filtering (AND semantics) persisted in URL query params
- **FR-10:** Dataset cards must display metadata completeness badges derived from the `tags` array
- **FR-11:** The CSV ingestion script must correctly parse all 4 CSV sections with their different column schemas
- **FR-12:** The CSV ingestion script must handle S3 paths with spaces, special characters, trailing spaces, and missing extensions
- **FR-13:** The bulk import API must accept `s3_object_key` and `s3_annotation_key` fields without breaking existing Supabase Storage import flow
- **FR-14:** All S3 credentials must be stored in environment variables, never in code or database

---

## Non-Goals (Out of Scope)

- Video transcoding (`.MOV` has fallback message + download link; transcode later if needed)
- CloudFront CDN (presigned URLs sufficient for current traffic; add later if needed)
- Real-time annotation editing or annotation pipeline integration
- Video download functionality for portal users (except as format fallback)
- Hand tracking visualization (bar chart) — just text display for v1
- Interactive chunking timeline with video seek — just structured text for v1
- Public-facing catalog changes (existing `/data-catalog` marketing page unchanged)
- Auth flow changes (existing magic link + admin approval flow unchanged)
- Rate limiting on presigned URL generation (start without; add later if needed)

---

## Design Considerations

- **Terminal aesthetic:** All new components must use JetBrains Mono, `// SECTION HEADERS`, accent-primary (#92B090) colors, dark backgrounds
- **Existing components to reuse:**
  - `SampleDetailModal.tsx` — 60/40 split layout, keyboard navigation, Copy JSON
  - `MetadataJsonViewer.tsx` — syntax-highlighted JSON viewer (use for raw JSON fallback)
  - `VideoPlayer.tsx` — video element with controls
  - `highlightJson()` — JSON syntax highlighting function
  - `extractCommonFields()` — quick-glance metadata summary strip
- **Badge component** already exists in dataset detail page (`page.tsx` lines 45-61) — reuse pattern for metadata completeness badges
- **Loading states** should use terminal cursor animation (`.cursor` class from `globals.css`)

---

## Technical Considerations

- **AWS SDK v3** is tree-shakeable — only `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` needed (no full SDK bloat)
- **S3 credential caching:** AWS SDK v3 caches credentials by default via the credential provider chain. No additional caching needed for the presigner.
- **Presigned URL expiry:** 1 hour is sufficient. If a user keeps a tab open longer, the video will stop loading — acceptable tradeoff vs. longer expiry security risk.
- **Annotation JSON size:** Most annotation-data.json files are 2-10KB. Largest observed was ~30KB (long form with full chunking). On-demand fetch is fine.
- **Mixed MIME types:** `.MOV` (QuickTime) has inconsistent browser support. Safari: native. Chrome: supported since v108. Firefox: limited. Add fallback message in VideoPlayer if `canplay` event doesn't fire within 5s.
- **Supabase migration:** Adding nullable columns (`tags`, `s3_object_key`, `s3_annotation_key`) is backward-compatible — existing samples are unaffected.
- **Rate limiting:** Log presigned URL generation for audit. Consider adding rate limiting (e.g., 100 URLs per lead per hour) in a future phase.

---

## Success Metrics

- All ~80 CSV samples successfully imported and visible in the portal catalog
- S3 videos load and play within 5 seconds for authenticated users
- Annotation metadata renders in structured MetaTable format for samples that have it
- Tag-based filtering works with AND semantics and persists via URL params
- All Playwright E2E tests pass (browse, detail, user acceptance)
- Zero S3 credential exposure (verified by code review)
- No regressions to existing Supabase Storage-based samples

---

## Pre-Flight Verification (Completed)

All prerequisites verified before implementation:

| Check | Status | Details |
|-------|--------|---------|
| AWS S3 access | PASS | HeadObject, GetObject, presigned URLs all working |
| S3 paths with spaces | PASS | `Workplaces /Barista.mov` accessible (1.3GB) |
| S3 annotation JSON fetch | PASS | Fetched and parsed `annotation-data.json` successfully |
| Presigned URL streaming | PASS | 206 Partial Content on range request (video playback ready) |
| AWS SDK installed | PASS | `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` in package.json |
| AWS env vars | PASS | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME` in `.env.local` |
| Supabase connection | PASS | Service role key working |
| DB categories | PASS | 4 categories exist (egocentric-crowd, egocentric-workplaces, licensed-cinematic, game-capture) |
| DB datasets | PASS | 5 datasets exist (need expansion to ~15-20) |
| Test lead (client) | PASS | `john+client@claru.ai` — approved, Supabase auth, access to 2 datasets |
| Test lead (pending) | PASS | `john+client2@claru.ai` — pending, no auth |
| Admin account | PASS | `team@claru.ai` with JWT auth |
| DB schema gaps | NEEDS WORK | Missing `tags`, `s3_object_key`, `s3_annotation_key` columns (US-003) |

### Test Accounts for Playwright E2E

| Role | Email | Auth | Purpose |
|------|-------|------|---------|
| Admin | `team@claru.ai` | JWT (password in env) | Admin dashboard, CSV import, sample management |
| Approved Lead | `john+client@claru.ai` | Supabase magic link | Portal catalog browse, video playback, metadata viewing |
| Pending Lead | `john+client2@claru.ai` | None (not approved) | Test access denial, gated content |

---

## Open Questions (Resolved)

1. ~~**MOV browser support**~~ → **Resolved:** Add "Format not supported" fallback message with download link. Flag in admin UI. (US-014)
2. ~~**Annotation JSON caching**~~ → **Resolved:** Cache fetched annotation JSONs in Supabase `metadata_json` after first fetch. (US-015)
3. ~~**Game/PC Specs JSON**~~ → **Resolved:** Render in separate extensible panel via DataPanelRegistry. (US-016)
4. ~~**Admin CSV import UI**~~ → **Resolved:** Build admin CSV import UI with column mapping, preview, and validation. (US-017)
5. ~~**Rate limiting**~~ → **Resolved:** Start without rate limiting. Add later if needed.
