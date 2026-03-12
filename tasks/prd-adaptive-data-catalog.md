# PRD: Adaptive Data Catalog — Standardized Import & Enrichment Display

## Introduction

The admin portal's CSV bulk importer doesn't match the real-world CSV formats we receive (e.g., Ergo1.csv with 9 columns of mixed data, nested JSON, and human-readable column names). Additionally, AI-generated enrichment data (e.g., Reka Vision analysis) has no dedicated storage — it gets dumped into a generic `metadata_json` blob alongside everything else. Technical metadata fields like duration, resolution, and FPS are never populated from imports.

This feature introduces a standardized 5-column CSV import template, stores enrichment as a first-class database column, auto-extracts technical metadata from both enrichment JSON and S3 annotation files at import time, and adds an adaptive JSON tree renderer that works regardless of schema — because every dataset has a different metadata structure.

### The Three-Layer Sample Model

1. **Fixed** — Video player + technical specs (duration, resolution, FPS). Same for every dataset.
2. **Adaptive** — Annotation JSON (from S3) + Enrichment JSON (from CSV). Rendered as browsable, searchable trees. Schema varies per dataset.
3. **Curated** — Dataset-level summary (admin-authored). Already exists in current system.

## Goals

- Define a standardized 5-column CSV template that maps cleanly to the data model
- Store enrichment data (AI analysis, Reka Vision output) in a dedicated `enrichment_json` column, not mixed into `metadata_json`
- Auto-extract technical metadata (duration, resolution, FPS) from enrichment JSON and S3 annotation files at import time
- Build an adaptive JSON tree renderer with search/filter that handles any JSON schema
- Add an Enrichment panel to the sample detail modal, visible to clients only when admin enables it per-dataset (labeled as "Additional Metadata" to clients, never "enrichment")
- Maintain backward compatibility with existing CSV imports and portal display

## User Stories

### US-001: Database migration — enrichment_json column and dataset visibility toggle

**Description:** As a developer, I need a dedicated `enrichment_json` column on `dataset_samples` and a `show_enrichment` toggle on `datasets` so that enrichment data has proper storage and admin controls client visibility.

**Acceptance Criteria:**
- [ ] Create migration `supabase/migrations/006_enrichment_json.sql`
- [ ] Add `enrichment_json JSONB DEFAULT '{}'` column to `dataset_samples`
- [ ] Add `show_enrichment BOOLEAN DEFAULT false` column to `datasets`
- [ ] Update `DatasetSample` interface in `src/types/data-catalog.ts` — add `enrichment_json: Record<string, unknown>`
- [ ] Update `Dataset` interface in `src/types/data-catalog.ts` — add `show_enrichment: boolean`
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] **Code Review:** Run code-reviewer agent to verify migration safety and type correctness

**Agent Strategy:** general-purpose agent (schema + types)

---

### US-002: CSV auto-mapping rules for standardized 5-column template

**Description:** As an admin, I want the CSV importer to automatically recognize our standardized column names so I don't have to manually reassign every column.

**Standardized CSV Template:**

| Column | Maps To | Required |
|--------|---------|----------|
| `s3_video_uri` | `s3_object_key` | Yes |
| `s3_annotation_uri` | `s3_annotation_key` | No |
| `category` | unmapped → `metadata_json.category` | No |
| `subcategory` | unmapped → `metadata_json.subcategory` | No |
| `enrichment` | `enrichment_json` | No |

**Acceptance Criteria:**
- [ ] Add `enrichment_json` to `MappableField` union type in `BulkCsvUploader.tsx`
- [ ] Add `enrichment_json` to `FIELD_LABELS` map (label: "Enrichment JSON")
- [ ] Add auto-map aliases to `AUTO_MAP_RULES`:
  - `s3_video_uri` → `s3_object_key`
  - `video_uri` → `s3_object_key`
  - `s3_annotation_uri` → `s3_annotation_key`
  - `annotation_uri` → `s3_annotation_key`
  - `enrichment` → `enrichment_json`
  - `enrichment_json` → `enrichment_json`
  - `ai_metadata` → `enrichment_json`
- [ ] Update `buildSampleRows()` to extract the `enrichment_json` mapped column, parse it as JSON, and include it in the sample row payload
- [ ] If enrichment column fails JSON parse, store raw string as `{ "_raw": "<value>" }` (don't silently drop it)
- [ ] Existing auto-map rules still work (old CSV formats not broken)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Verify auto-mapping with standardized column names, verify enrichment JSON parsing (valid JSON, invalid JSON, empty), verify backward compatibility with old-format CSVs
- [ ] **Code Review:** Run code-reviewer agent to verify mapping logic correctness

**Agent Strategy:** general-purpose agent (component logic)

---

### US-003: Bulk import API — accept enrichment_json and extract tech metadata from enrichment

**Description:** As an admin, I want the bulk import to store enrichment data in the dedicated column and auto-populate technical fields (duration, resolution, FPS) from the enrichment JSON's `technical_specs` so I don't have to enter them manually.

**Acceptance Criteria:**
- [ ] Update `POST /api/admin/catalog/[id]/samples/bulk` to accept `enrichment_json` field in each sample object
- [ ] Pass `enrichment_json` through to Supabase insert
- [ ] After building each sample row, if `enrichment_json.technical_specs` exists, extract:
  - `technical_specs.duration_s` → `duration_seconds`
  - `technical_specs.resolution_px.width` → `resolution_width`
  - `technical_specs.resolution_px.height` → `resolution_height`
  - `technical_specs.fps_estimate` → `fps`
- [ ] Only populate fields that are currently null/0 (don't overwrite explicit values)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test enrichment_json passthrough to DB, test tech metadata extraction from various enrichment shapes (present, partial, missing, malformed), test that explicit values aren't overwritten
- [ ] **Code Review:** Run code-reviewer agent to verify API contract and extraction logic

**Agent Strategy:** general-purpose agent (API route)

---

### US-004: S3 annotation fetch at import for tech metadata extraction

**Description:** As an admin, I want the import process to also fetch annotation JSON files from S3 and extract MediaInfo technical metadata, so that duration/resolution/FPS are populated even when the enrichment JSON doesn't contain `technical_specs`.

**Extraction priority:**
1. First: enrichment JSON `technical_specs` (already inline, fast) — from US-003
2. Second: S3 annotation JSON `files[].attributes.media` MediaInfo data (requires network fetch)
3. Fields already populated by step 1 are NOT overwritten by step 2

**Acceptance Criteria:**
- [ ] In the bulk import API, after enrichment extraction (US-003), check if duration/resolution/fps are still null
- [ ] For samples with `s3_annotation_key` and missing tech fields, fetch annotation JSON from S3 using existing AWS SDK client
- [ ] Parse the annotation JSON: look for `files[].attributes.media.track[]` where `@type === "Video"` — extract `Width`, `Height`, `Duration`, `FrameRate`
- [ ] Also look for `files[].attributes.media.track[]` where `@type === "General"` for fallback `Duration`
- [ ] Fetch S3 annotations in parallel within each chunk (max 10 concurrent fetches using `Promise.allSettled`)
- [ ] If S3 fetch fails for any sample, log warning but don't fail the import — leave tech fields null
- [ ] Add a note in the BulkCsvUploader progress UI: "Extracting metadata from S3..." during this phase
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test S3 fetch logic with mocked responses (annotation with MediaInfo, annotation without MediaInfo, fetch failure), test extraction priority (enrichment values not overwritten by S3), test parallel fetch with partial failures
- [ ] **Code Review:** Run code-reviewer agent to verify S3 access patterns, error handling, and concurrency limits

**Agent Strategy:** general-purpose agent (API + AWS SDK)

---

### US-005: Sample APIs — return and accept enrichment_json

**Description:** As a developer, I need all sample-related APIs to include `enrichment_json` in responses and accept it in updates so the frontend can display and edit it.

**Acceptance Criteria:**
- [ ] Admin GET `/api/admin/catalog/[id]/samples` — `enrichment_json` included in response (already returned by `SELECT *`, but verify it's in the TypeScript response type)
- [ ] Admin PATCH `/api/admin/catalog/[id]/samples/[sampleId]` — accept `enrichment_json` in request body and update in Supabase
- [ ] Admin PATCH `/api/admin/catalog/[id]/samples/bulk` (batch edit) — accept `enrichment_json` in `updates` object
- [ ] Portal server component `src/app/portal/catalog/[id]/page.tsx` — verify `enrichment_json` is included in sample data passed to client components (should work automatically with `SELECT *` but confirm the `SampleWithUrl` type propagation)
- [ ] Admin dataset PATCH — accept `show_enrichment` boolean and update in Supabase
- [ ] Admin dataset GET — return `show_enrichment` field
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test PATCH with enrichment_json update, test that enrichment_json appears in GET responses
- [ ] **Code Review:** Run code-reviewer agent to verify API contracts and type safety

**Agent Strategy:** general-purpose agent (API routes)

---

### US-006: Adaptive JSON tree renderer with search

**Description:** As a user viewing sample metadata, I want a browsable, searchable JSON renderer that handles any schema — because different datasets have completely different metadata structures.

**Acceptance Criteria:**
- [ ] Create `src/app/components/catalog/JsonTree.tsx`
- [ ] Component accepts `data: Record<string, unknown>` and optional `title?: string` props
- [ ] Renders JSON as a collapsible tree:
  - Objects: collapsible sections with key count in header (e.g., "technical_specs (5)")
  - Arrays: collapsible list with item count (e.g., "chunking (10 items)")
  - Strings: displayed with muted quotes
  - Numbers: displayed with tabular-nums styling
  - Booleans: colored badge (green/red)
  - Null: muted "null" text
- [ ] Top-level keys are expanded by default; nested objects/arrays are collapsed
- [ ] Search input at the top of the tree:
  - Filters visible nodes to those matching the query (key name or value)
  - Highlights matching text in accent color
  - Auto-expands parent sections of matching nodes
  - Clear button to reset search
- [ ] Empty state: show muted "No data" when data is empty object
- [ ] Follows existing design system: font-mono, var(--text-primary), var(--border-subtle), var(--accent-primary) for highlights
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright screenshot
- [ ] **Unit Tests:** Test rendering of all JSON types (string, number, boolean, null, object, array, nested), test search filtering, test collapse/expand behavior, test empty state
- [ ] **Code Review:** Run code-reviewer agent to verify component accessibility, performance with large JSON objects, and design system compliance

**Agent Strategy:** frontend-expert agent

---

### US-007: Enrichment panel in SampleDetailModal with dataset visibility toggle

**Description:** As a user viewing a sample, I want to see the enrichment data as a separate browsable panel. As an admin, I want to control whether clients can see this panel per-dataset. Clients never see the word "enrichment" — it's labeled "Additional Metadata" in the portal.

**Acceptance Criteria:**
- [ ] Register a new panel type in the DataPanelTabs / DataPanelRegistry system:
  - Admin label: "Enrichment"
  - Portal label: "Additional Metadata"
  - Icon: appropriate lucide icon (e.g., `Sparkles` or `Database`)
  - Component: renders `JsonTree` with the sample's `enrichment_json`
- [ ] Panel tab only appears when `enrichment_json` is non-empty (not `{}` or null)
- [ ] In portal context: panel only appears when the dataset's `show_enrichment` is `true`
- [ ] In admin context: panel always appears (admin always sees enrichment regardless of toggle)
- [ ] `SampleDetailModal` receives `enrichment_json` from sample data and `showEnrichment` from dataset config
- [ ] Update `SamplePreviewModal` (admin wrapper) to pass enrichment data through
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright screenshot — check both admin and portal views
- [ ] **Unit Tests:** Test panel visibility logic (empty enrichment hides tab, non-empty shows it), test portal visibility respects `show_enrichment` flag, test admin always sees it
- [ ] **Code Review:** Run code-reviewer agent to verify panel registration, conditional rendering logic, and portal/admin context separation

**Agent Strategy:** frontend-expert agent

---

### US-008: Admin dataset settings — show_enrichment toggle

**Description:** As an admin editing a dataset, I want a toggle to control whether clients can see the additional metadata panel, so I can curate what's visible per-dataset.

**Acceptance Criteria:**
- [ ] Add "Show additional metadata to clients" checkbox/toggle to the dataset edit form in `CatalogEditClient.tsx`
- [ ] Position it near the `is_published` toggle (in the dataset settings section)
- [ ] Toggle saves via the existing dataset PATCH API (include `show_enrichment` in the update payload)
- [ ] Default is `false` (unchecked) for new datasets
- [ ] Add helper text below toggle: "When enabled, clients can browse AI-generated metadata for each sample"
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright screenshot
- [ ] **Unit Tests:** Test toggle state management, test save includes show_enrichment field
- [ ] **Code Review:** Run code-reviewer agent to verify form integration and save logic

**Agent Strategy:** frontend-expert agent

---

### US-009: Admin SampleEditPanel — enrichment JSON editing

**Description:** As an admin, I want to view and edit a sample's enrichment JSON from the edit panel, so I can correct or augment AI-generated metadata.

**Acceptance Criteria:**
- [ ] Add "Enrichment JSON" textarea to `SampleEditPanel.tsx`, positioned after the existing "Metadata JSON" textarea
- [ ] Include "Format" button (same pattern as metadata_json formatter)
- [ ] JSON validation on save — show error if invalid JSON
- [ ] Only include `enrichment_json` in PATCH payload if the value changed (same diff-detection pattern as other fields)
- [ ] Textarea uses same styling as metadata_json textarea (font-mono, dark bg, border)
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright screenshot
- [ ] **Unit Tests:** Test JSON validation (valid, invalid, empty), test diff detection (changed vs unchanged)
- [ ] **Code Review:** Run code-reviewer agent to verify edit panel integration

**Agent Strategy:** frontend-expert agent

---

### US-010: Playwright E2E — CSV import with enrichment and sample display verification

**Description:** As QA, I need an end-to-end test verifying the complete flow: upload a standardized CSV with enrichment data, verify samples are created with correct fields, browse the grid, open a sample, and verify the enrichment panel renders.

**Acceptance Criteria:**
- [ ] Create a test CSV fixture file with 3-5 rows using the standardized 5-column format (include valid enrichment JSON with `technical_specs`)
- [ ] Test flow using Playwright MCP:
  1. Navigate to admin portal (may require manual auth handoff — pause and request auth from user if needed)
  2. Navigate to a test dataset's edit page
  3. Click "Bulk Import" tab
  4. Upload the test CSV fixture
  5. Verify auto-mapping: `s3_video_uri` → S3 Object Key, `s3_annotation_uri` → S3 Annotation Key, `enrichment` → Enrichment JSON
  6. Click Import and wait for completion
  7. Verify success message shows correct inserted count
  8. Switch to Samples tab, verify samples appear in table
  9. Toggle to grid view, verify thumbnail cards render
  10. Click a sample card, verify preview modal opens
  11. In the modal, verify "Enrichment" tab is visible (admin context)
  12. Click the Enrichment tab, verify JsonTree renders with searchable data
  13. Type a search query in the JsonTree search input, verify filtering works
  14. Close modal, click a sample row in table view, verify SampleEditPanel shows enrichment_json textarea
  15. Navigate to portal view of the same dataset (may require auth handoff)
  16. If `show_enrichment` is false: verify NO "Additional Metadata" tab in sample detail
  17. Toggle `show_enrichment` to true in admin, return to portal: verify "Additional Metadata" tab now appears
- [ ] Test includes assertions for all critical state transitions
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent to verify test coverage and assertions

**Agent Strategy:** general-purpose agent (Playwright MCP for browser automation). **Note:** Auth handoff — if the admin portal requires authentication, pause execution and ask the user to authenticate in the browser, then continue the test flow.

---

## Functional Requirements

- **FR-1:** The `dataset_samples` table must have an `enrichment_json` JSONB column (default `'{}'`) for storing per-sample AI-generated metadata
- **FR-2:** The `datasets` table must have a `show_enrichment` boolean column (default `false`) controlling client visibility of enrichment data
- **FR-3:** The CSV bulk importer must auto-map `s3_video_uri` → `s3_object_key`, `s3_annotation_uri` → `s3_annotation_key`, and `enrichment` → `enrichment_json`
- **FR-4:** Unmapped CSV columns (e.g., `category`, `subcategory`) must continue flowing into `metadata_json` as key-value pairs
- **FR-5:** At import time, the system must extract `duration_seconds`, `resolution_width`, `resolution_height`, and `fps` from enrichment JSON's `technical_specs` when present
- **FR-6:** At import time, if tech fields are still null after enrichment extraction, the system must attempt to fetch the S3 annotation JSON and extract MediaInfo data from `files[].attributes.media.track[]`
- **FR-7:** S3 annotation fetches during import must be parallel (max 10 concurrent) and must not fail the import if individual fetches fail
- **FR-8:** The adaptive JSON tree renderer must handle any valid JSON structure with collapsible sections and search/filter capability
- **FR-9:** The enrichment panel in the sample detail modal must be labeled "Enrichment" for admins and "Additional Metadata" for portal clients
- **FR-10:** The enrichment panel must only be visible to portal clients when the dataset's `show_enrichment` is `true`
- **FR-11:** The admin SampleEditPanel must allow viewing and editing `enrichment_json` with JSON validation
- **FR-12:** All existing CSV import formats must continue to work (backward compatibility)

## Non-Goals (Out of Scope)

- No automatic Reka Vision analysis pipeline (enrichment is imported via CSV, not generated by the system)
- No dataset-level aggregation computed from sample metadata (dataset summary remains admin-curated)
- No enrichment data versioning or history tracking
- No per-field enrichment visibility controls (it's all-or-nothing per dataset)
- No inline editing of JSON values in the tree renderer (read-only with search)
- No changes to the existing MetaTable component or annotation panel rendering
- No changes to the standardized CSV template columns beyond the 5 defined
- No batch enrichment operations (bulk re-processing of enrichment data)

## Design Considerations

### JSON Tree Renderer
- Follows existing design system: `font-mono`, CSS custom properties for colors
- Collapsible sections use subtle border-left indicators for nesting depth
- Search highlights use `var(--accent-primary)` background
- Handles deeply nested structures without performance issues (virtual rendering not needed for typical enrichment sizes of < 200 keys)
- Empty object `{}` shows "No data" message, not an empty tree

### Enrichment Panel
- Tab appears alongside existing Annotation and Data Files tabs
- Uses the same `DataPanelTabs` / `DataPanelRegistry` extension system
- Icon: `Sparkles` (lucide-react) — subtle indicator this is AI-generated data
- Portal label "Additional Metadata" is deliberately generic — clients don't need to know the data source

### CSV Import UX
- Auto-mapping preview highlights all 5 columns when standardized template is used
- Progress indicator shows "Extracting metadata from S3..." phase separately from insert phase
- Import summary shows how many samples had tech metadata auto-populated

## Technical Considerations

### S3 Annotation Fetching
- Uses existing AWS SDK client (`@aws-sdk/client-s3`) already configured in the codebase
- `GetObjectCommand` to fetch annotation JSON, pipe body to string, parse as JSON
- Three different S3 path prefixes observed in real data:
  - `video_capture/completed/{id}/annotation-data.json`
  - `video-capture-activities/completed/{id}/annotation-data.json`
  - `Video Capture: First Person Videos (Phone)/completed/{id}/annotation-data.json`
- Annotation JSON sizes: 1.7KB (short form) to 5.8KB (long form) — lightweight fetches

### MediaInfo Extraction Path
The annotation JSON's technical metadata lives at:
```
files[0].attributes.media.track[] → find @type === "Video"
  → Width (string, parse to int) → resolution_width
  → Height (string, parse to int) → resolution_height
  → Duration (number) → duration_seconds
  → FrameRate (number) → fps
```
Fallback for duration: `files[0].attributes.media.track[]` where `@type === "General"` → `Duration`

### Enrichment JSON Size
- Typical Reka Vision output: ~500 bytes to 3KB
- Activity Analysis (long form temporal chunking): up to 5KB
- Pre-merged into single JSON blob before CSV export (per design decision)
- JSONB storage in Supabase handles this efficiently

### Backward Compatibility
- Existing `AUTO_MAP_RULES` are preserved — old CSVs with columns like `s3_object_key`, `s3_uri`, `media_url` still auto-map correctly
- `enrichment_json` defaults to `'{}'` — existing samples unaffected
- `show_enrichment` defaults to `false` — existing datasets don't suddenly show new panels to clients
- Portal SampleDetailModal only renders enrichment tab when data exists AND dataset flag is true

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests** — Test core logic, validation, and edge cases (where applicable)
2. **Code Review** — Run code-reviewer agent after implementation to verify correctness
3. **Type Safety** — All code must pass TypeScript strict mode (`npx tsc --noEmit`)

End-to-end tests (Playwright) are defined in US-010 to verify the complete import-to-display flow.

**Auth Note:** Admin and portal views require authentication. During Playwright E2E testing, if the browser encounters an auth wall, the agent should pause and request the user to authenticate manually, then continue the test flow.

## Success Metrics

- Admin can upload a standardized 5-column CSV and have all fields correctly mapped without manual adjustment
- Imported samples have `duration_seconds`, `resolution_width`, `resolution_height`, and `fps` auto-populated (from enrichment or S3 annotation)
- Admin can browse enrichment data as a searchable JSON tree in the sample detail modal
- Admin can toggle per-dataset whether clients see the "Additional Metadata" panel
- Clients see "Additional Metadata" tab when enabled, with full search/filter capability
- Existing CSV imports and portal display are unaffected (zero regressions)

## Open Questions

- Should we add a "Download CSV Template" button to the bulk import UI that generates an empty CSV with the 5 standardized column headers?
- Should the JSON tree renderer support "copy path" (click a key to copy its JSON path like `technical_specs.resolution_px.width`)?
- Should `show_enrichment` eventually become more granular (e.g., per-sample visibility, or field-level redaction)?
