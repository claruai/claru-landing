# PRD: Unified Dataset Sample Management

## Introduction

The admin portal's dataset sample management is currently fragmented across 3 separate interfaces:

1. **AddSampleForm** (`/admin/catalog/[id]`) — Single URL entry, only accepts `http://` or `https://`, no S3 URI support
2. **DatasetUploader** (`/admin/catalog/[id]`) — Drag-and-drop file upload to Supabase Storage with sample grid display
3. **CSV Import Wizard** (`/admin/catalog/import`) — Disconnected 4-step wizard page for bulk CSV import with section detection

Additionally, `BulkImporter.tsx` (755 lines) is dead code — imported nowhere.

This PRD consolidates everything into a single, intuitive interface on the dataset edit page (`/admin/catalog/[id]`) with two clear entry points:

1. **Single sample entry** — S3 URI + annotation key + specs key + metadata JSON
2. **CSV bulk upload** — Flat CSV (single dataset type), smart duplicate detection, column mapping, progress tracking

Samples become editable after upload — admins can click any sample to modify its S3 URI, annotation key, specs key, or metadata JSON. Batch editing is supported for applying changes across multiple selected samples.

---

## Goals

- Consolidate 3 fragmented sample management UIs into one unified interface on the dataset edit page
- Support S3 URIs as the primary sample identifier (matching actual data format: `s3://moonvalley-annotation-platform/...`)
- Enable flat CSV bulk upload with smart duplicate detection (match on `s3_object_key`) — no multi-section support needed
- Make every sample field editable after creation (S3 URI, annotation key, specs key, metadata JSON)
- Support batch editing — select multiple samples, edit a shared field across all
- Paginate the samples list for datasets with hundreds of samples
- Remove dead code (`BulkImporter.tsx`)
- Add a `PATCH` API endpoint for sample editing (currently missing)

## Non-Goals

- No multi-section CSV parsing (no "Egocentric Crowd" / "Egocentric Workplaces" section headers — flat CSV only)
- No changes to the portal/lead-facing view (only admin-side changes)
- No video transcoding, thumbnail generation, or CDN setup
- No changes to Supabase Storage upload flow in DatasetUploader (keep as-is for file uploads)

---

## User Stories

### US-001: Remove dead code and clean up imports

**Description:** As a developer, I want to remove unused code to reduce confusion and maintenance burden.

**Acceptance Criteria:**
- [ ] Delete `src/app/admin/catalog/[id]/BulkImporter.tsx` (755 lines, not imported anywhere)
- [ ] Verify no other files reference BulkImporter
- [ ] Typecheck passes (`npx tsc --noEmit`)

**Agent Workflow:**
1. Use **Explore agent** to verify no references to BulkImporter exist across the codebase
2. Delete the file
3. Run **code-reviewer agent** to verify cleanup is complete and no broken imports remain

---

### US-002: Add PATCH API endpoint for editing samples

**Description:** As a developer, I need a PATCH endpoint so admins can update individual sample fields after creation.

**Acceptance Criteria:**
- [ ] Add `PATCH` handler to `src/app/api/admin/catalog/[id]/samples/[sampleId]/route.ts`
- [ ] Accepts partial updates to: `s3_object_key`, `s3_annotation_key`, `s3_specs_key`, `metadata_json`, `media_url`
- [ ] Validates that at least one field is provided
- [ ] Validates `metadata_json` is valid JSON if provided
- [ ] Returns updated sample record
- [ ] Auth-protected (same JWT auth as existing endpoints)
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **Explore agent** to read existing route handlers in `[sampleId]/route.ts` for auth pattern reference
2. Implement the PATCH handler following the same auth + Supabase patterns
3. Run **code-reviewer agent** to verify security, validation, and error handling

---

### US-003: Add batch PATCH API endpoint for editing multiple samples

**Description:** As a developer, I need an endpoint to update the same field(s) across multiple samples at once.

**Acceptance Criteria:**
- [ ] Add `PATCH` handler to `src/app/api/admin/catalog/[id]/samples/bulk/route.ts`
- [ ] Accepts: `{ sample_ids: string[], updates: { s3_object_key?, s3_annotation_key?, s3_specs_key?, metadata_json?, media_url? } }`
- [ ] Validates all sample_ids belong to the specified dataset
- [ ] Applies the same partial update to all specified samples
- [ ] Returns: `{ updated: number, errors: Array<{ id: string, message: string }> }`
- [ ] Auth-protected
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **Explore agent** to reference existing bulk route patterns
2. Implement the batch PATCH handler
3. Run **code-reviewer agent** to verify security and edge cases

---

### US-004: Update bulk import API for duplicate detection support

**Description:** As a developer, I need the bulk import API to support a "skip duplicates" mode.

**Acceptance Criteria:**
- [ ] Update `POST /api/admin/catalog/[id]/samples/bulk` to accept optional `skip_duplicates: boolean` parameter
- [ ] When `skip_duplicates` is true:
  - Before inserting, query existing `s3_object_key` values for this dataset
  - Filter out any rows with matching `s3_object_key`
  - Return count of skipped rows in response alongside inserted count
- [ ] Response shape: `{ inserted: number, skipped: number, errors: Array<{ row: number, message: string }> }`
- [ ] Continue chunking at 100 records per batch
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **Explore agent** to read existing bulk route implementation
2. Add duplicate detection logic
3. Run **code-reviewer agent** to verify query efficiency and correctness

---

### US-005: Update single sample entry to support S3 URIs

**Description:** As an admin, I want to add a single sample by entering its S3 URI and associated metadata, instead of being limited to http/https URLs.

**Acceptance Criteria:**
- [ ] Replace or refactor `AddSampleForm.tsx` to accept S3 URIs (`s3://bucket/path`)
- [ ] Form fields:
  - **S3 Object URI** (required) — text input, validates `s3://` prefix or `http(s)://` prefix
  - **S3 Annotation Key** (optional) — text input for annotation file path
  - **S3 Specs Key** (optional) — text input for specs file path
  - **Metadata JSON** (optional) — monospace textarea, validates JSON, defaults to `{}`
- [ ] On submit, calls POST API with `s3_object_key` (stripped of `s3://bucket/` prefix), `s3_annotation_key`, `s3_specs_key`, `metadata_json`
- [ ] Success: sample appears in the samples list immediately
- [ ] Error: inline error message with details
- [ ] Terminal aesthetic: dark inputs, green accent, JetBrains Mono for JSON field
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **Explore agent** to read existing AddSampleForm and POST API for current patterns
2. Use **frontend-expert agent** to build the refactored form with proper validation and terminal aesthetic
3. Run **code-reviewer agent** to verify form validation, API integration, and accessibility

---

### US-006: CSV bulk upload with smart duplicate detection

**Description:** As an admin, I want to upload a flat CSV file of samples for a single dataset and have the system intelligently skip duplicates.

**Acceptance Criteria:**
- [ ] "Bulk CSV Upload" tab/button on the dataset edit page samples section
- [ ] Drag-and-drop or file picker for CSV files
- [ ] **Flat CSV only** — no multi-section parsing, no section headers. One row = one sample.
- [ ] Client-side CSV parsing using PapaParse (already a dependency)
- [ ] Auto-detect column mapping:
  - Look for columns matching: `s3_object_key`, `s3_uri`, `file_url`, `media_url`, `url` → maps to `s3_object_key`
  - Look for: `annotation_key`, `s3_annotation_key`, `annotation` → maps to `s3_annotation_key`
  - Look for: `specs_key`, `s3_specs_key`, `specs` → maps to `s3_specs_key`
  - Look for: `metadata`, `metadata_json`, `meta` → maps to `metadata_json`
  - Remaining columns get merged into `metadata_json` as key-value pairs
- [ ] S3 prefix stripping: automatically remove `s3://bucket-name/` prefix from S3 URI columns (using existing regex: `/^s3:\/\/[^/]+\//`)
- [ ] **Duplicate detection**: Before importing, fetch existing `s3_object_key` values for this dataset. Compare against CSV rows. Show:
  - "X new samples to import"
  - "Y duplicates will be skipped" (with option to expand and see which ones)
- [ ] Preview table showing first 10 rows with mapped columns
- [ ] "Import" button triggers batch insert via `POST /api/admin/catalog/[id]/samples/bulk` with `skip_duplicates: true`
- [ ] Progress bar during import (chunks of 100 records)
- [ ] Completion summary: "Imported X samples. Y skipped (duplicates). Z errors."
- [ ] Errors displayed with row number and reason
- [ ] Terminal aesthetic consistent with admin portal
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **Explore agent** to study existing PapaParse usage in the import wizard for reference patterns
2. Use **frontend-expert agent** to build the CSV upload component with drag-and-drop, column mapping UI, and progress tracking
3. Run **code-reviewer agent** to verify CSV parsing, duplicate detection logic, and error handling

---

### US-007: Editable sample detail panel

**Description:** As an admin, after samples are uploaded, I want to click on any sample to edit its S3 URI, annotation key, specs key, or metadata JSON.

**Acceptance Criteria:**
- [ ] Clicking a sample row/card in the samples list opens an edit panel (slide-over from right)
- [ ] Edit panel shows all editable fields:
  - **S3 Object Key** — text input (pre-filled)
  - **S3 Annotation Key** — text input (pre-filled)
  - **S3 Specs Key** — text input (pre-filled)
  - **Metadata JSON** — monospace textarea with JSON syntax validation (pre-filled with formatted JSON)
  - **Media URL** — text input (pre-filled, if exists)
- [ ] "Save" button calls `PATCH /api/admin/catalog/[id]/samples/[sampleId]` (US-002)
- [ ] "Cancel" button discards changes
- [ ] "Delete" button with confirmation (uses existing DELETE endpoint)
- [ ] Success: panel closes, sample list refreshes with updated data
- [ ] Error: inline error display, panel stays open
- [ ] JSON field has a "Format JSON" button that pretty-prints the content
- [ ] Keyboard: Escape to close, Cmd+Enter to save
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **frontend-expert agent** to build the slide-over panel component with form fields, keyboard shortcuts, and terminal aesthetic
2. Run **code-reviewer agent** to verify state management, API integration, and UX patterns

---

### US-008: Batch editing for multiple selected samples

**Description:** As an admin, I want to select multiple samples and edit a shared field across all of them at once.

**Acceptance Criteria:**
- [ ] Checkbox selection on each sample row in the samples list
- [ ] "Select All" checkbox in the list header (selects current page)
- [ ] When 1+ samples selected, a batch action bar appears above the list:
  - Shows count: "X samples selected"
  - **"Edit Selected"** button — opens a batch edit modal
  - **"Delete Selected"** button — with confirmation dialog showing count
- [ ] Batch edit modal:
  - Shows the same fields as the single edit panel (S3 keys, metadata JSON, media URL)
  - Each field has a checkbox to include it in the batch update
  - Only checked fields are applied to all selected samples
  - "Apply to X samples" button calls `PATCH /api/admin/catalog/[id]/samples/bulk` (US-003)
- [ ] Success: modal closes, sample list refreshes, selection clears
- [ ] Error: shows which samples failed to update
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **frontend-expert agent** to build selection state management, batch action bar, and batch edit modal
2. Run **code-reviewer agent** to verify batch update logic and state management

---

### US-009: Paginated samples list component

**Description:** As an admin, I need the samples list to be paginated so datasets with hundreds of samples remain performant and navigable.

**Acceptance Criteria:**
- [ ] Extract samples display into `SamplesList.tsx` component
- [ ] Paginate at 50 samples per page
- [ ] Pagination controls at bottom: "Previous / Page X of Y / Next"
- [ ] Page number display and jump-to-page input
- [ ] Total count in section header: "Samples (147)"
- [ ] Server-side pagination: update `GET /api/admin/catalog/[id]/samples` to accept `page` and `per_page` query params
- [ ] API returns: `{ samples: DatasetSample[], total: number, page: number, per_page: number }`
- [ ] Loading state with skeleton while fetching new page
- [ ] Maintain selection state across page navigation (for batch operations)
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **Explore agent** to read existing samples GET endpoint and DatasetUploader's fetch logic
2. Use **frontend-expert agent** to build paginated list with server-side pagination integration
3. Run **code-reviewer agent** to verify pagination logic, query efficiency, and edge cases (empty pages, last page)

---

### US-010: Unified samples section layout on dataset edit page

**Description:** As an admin, I want the dataset edit page to have a clean, consolidated layout with dataset details on top and a tabbed samples section below.

**Acceptance Criteria:**
- [ ] Refactor `CatalogEditClient.tsx` layout:
  - **Top section**: Dataset details form (name, description, category, status) — keep as-is
  - **Bottom section**: Samples management with tabs:
    - **Tab 1: "Samples"** — Paginated list of all samples (US-009) with selection + batch actions (US-008)
    - **Tab 2: "Add Sample"** — Single sample entry form (US-005)
    - **Tab 3: "Bulk Import"** — CSV upload interface (US-006)
- [ ] Samples list shows: S3 object key (truncated), annotation key indicator, specs key indicator, metadata preview, format issues badge
- [ ] Samples list supports: click to edit (US-007), checkbox selection (US-008), inline delete with confirmation
- [ ] Samples count displayed in the tab badge: "Samples (147)"
- [ ] Empty state: "No samples yet. Add samples individually or import from CSV."
- [ ] Remove the separate DatasetUploader component from this page
- [ ] Typecheck passes

**Agent Workflow:**
1. Use **Explore agent** to understand full CatalogEditClient.tsx structure and dependencies
2. Use **frontend-expert agent** to refactor the page layout with tabbed interface integrating all sub-components
3. Run **code-reviewer agent** to verify component integration, state flow, and no regressions

---

### US-011: Playwright E2E testing — full sample management flow

**Description:** As QA, I need comprehensive E2E tests verifying all sample management flows work correctly in the browser.

**Acceptance Criteria:**
- [ ] **Test 1: Single sample add**
  1. Login as admin
  2. Navigate to `/admin/catalog`, click a dataset
  3. Go to "Add Sample" tab
  4. Enter S3 URI + metadata JSON
  5. Submit and verify sample appears in the "Samples" tab
  6. Test validation: submit with empty URI, submit with invalid JSON

- [ ] **Test 2: CSV bulk import**
  1. Upload a test CSV file with 5 sample rows
  2. Verify column mapping preview
  3. Verify duplicate detection (upload same CSV again — should show duplicates)
  4. Import and verify completion summary
  5. Verify samples appear in paginated list

- [ ] **Test 3: Single sample edit**
  1. Click a sample in the list
  2. Verify edit panel opens with pre-filled data
  3. Modify the S3 object key
  4. Save and verify the list updates
  5. Test keyboard: Escape to close, Cmd+Enter to save

- [ ] **Test 4: Batch editing**
  1. Select 3 samples using checkboxes
  2. Click "Edit Selected"
  3. Check the metadata JSON field, enter new value
  4. Apply and verify all 3 samples updated

- [ ] **Test 5: Batch delete**
  1. Select 2 samples
  2. Click "Delete Selected"
  3. Confirm deletion
  4. Verify samples removed from list and count updated

- [ ] **Test 6: Pagination**
  1. For a dataset with 50+ samples, verify pagination controls appear
  2. Navigate to page 2, verify different samples shown
  3. Verify selection persists across page navigation

- [ ] Typecheck passes

**Agent Workflow:**
1. Use **Playwright MCP** tools (`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_take_screenshot`) to manually verify each flow first
2. Create test file at `tests/e2e/sample-management.spec.ts`
3. Use **code-reviewer agent** to verify test coverage and assertions

---

## Technical Architecture

### Data Flow: Single Sample Add
```
Admin enters S3 URI + metadata
  → Client validates S3 URI format + JSON syntax
  → POST /api/admin/catalog/[id]/samples (mode: s3_uri)
  → Strip S3 bucket prefix → s3_object_key
  → Insert into dataset_samples
  → Return new sample with presigned URLs
  → Update samples list in UI
```

### Data Flow: CSV Bulk Import
```
Admin uploads flat CSV file
  → PapaParse parses client-side
  → Auto-detect column mapping (no multi-section parsing)
  → Strip S3 prefixes from URI columns
  → Fetch existing s3_object_keys for dataset (dedup check)
  → Show preview: new vs duplicate counts
  → Admin clicks "Import"
  → POST /api/admin/catalog/[id]/samples/bulk (chunks of 100, skip_duplicates: true)
  → Response: inserted/skipped/error counts
  → Refresh samples list
```

### Data Flow: Edit Sample (Single)
```
Admin clicks sample in list
  → Open slide-over edit panel with pre-filled fields
  → Admin modifies fields
  → PATCH /api/admin/catalog/[id]/samples/[sampleId]
  → Return updated sample
  → Refresh list item in UI
```

### Data Flow: Batch Edit
```
Admin selects multiple samples via checkboxes
  → Clicks "Edit Selected" in batch action bar
  → Opens batch edit modal, checks fields to update
  → PATCH /api/admin/catalog/[id]/samples/bulk
  → Returns updated count + errors
  → Refresh samples list, clear selection
```

### Files to Modify

| File | Change |
|------|--------|
| `src/app/admin/catalog/[id]/CatalogEditClient.tsx` | Refactor layout with tabbed samples section |
| `src/app/admin/catalog/[id]/AddSampleForm.tsx` | Rewrite to support S3 URIs + all fields |
| `src/app/admin/catalog/[id]/BulkImporter.tsx` | **DELETE** (dead code) |
| `src/app/api/admin/catalog/[id]/samples/route.ts` | Update POST for S3 URI mode, GET for pagination |
| `src/app/api/admin/catalog/[id]/samples/[sampleId]/route.ts` | Add PATCH handler |
| `src/app/api/admin/catalog/[id]/samples/bulk/route.ts` | Add duplicate detection + batch PATCH |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/app/admin/catalog/[id]/BulkCsvUploader.tsx` | CSV upload with column mapping + dedup |
| `src/app/admin/catalog/[id]/SampleEditPanel.tsx` | Slide-over panel for editing individual samples |
| `src/app/admin/catalog/[id]/BatchEditModal.tsx` | Modal for batch editing multiple samples |
| `src/app/admin/catalog/[id]/SamplesList.tsx` | Paginated samples list with selection support |
| `tests/e2e/sample-management.spec.ts` | Playwright E2E tests |

### Existing S3 Integration

The codebase already has S3 prefix stripping logic:
```typescript
// Regex to strip S3 bucket prefix: /^s3:\/\/[^/]+\//
// Example: s3://moonvalley-annotation-platform/video_capture/completed/abc/file.mp4
// Becomes: video_capture/completed/abc/file.mp4
```

The bulk API (`POST /api/admin/catalog/[id]/samples/bulk`) already accepts `s3_object_key`, `s3_annotation_key`, `s3_specs_key` fields directly.

---

## Implementation Order

```
US-001 (Remove dead code)
  ↓
US-002 (PATCH single sample API)
US-003 (PATCH batch samples API)        ← can run in parallel
US-004 (Bulk import dedup API)
  ↓
US-005 (Single sample form)
US-006 (CSV bulk uploader)              ← can run in parallel
  ↓
US-007 (Edit panel)
US-008 (Batch editing)                  ← can run in parallel
  ↓
US-009 (Paginated list)
  ↓
US-010 (Unified layout — integrates everything)
  ↓
US-011 (Playwright E2E tests)
```

---

## Design Considerations

- Match existing terminal aesthetic: dark backgrounds, green `#00ff88` accents, `JetBrains Mono` for code/data fields
- Tabs should use same styling as existing admin portal tabs
- CSV upload area: dashed border drag-and-drop zone matching existing upload patterns
- Sample edit panel: slide-over from the right (consistent with detail views in the portal)
- Batch edit modal: centered modal with dark overlay
- JSON editor textarea: monospace font, dark background
- Duplicate detection results: collapsible section showing which rows are duplicates
- Pagination: minimal design matching admin portal, bottom of list

## Success Metrics

- Admin can bulk import 500+ samples from CSV in under 2 minutes
- Duplicate detection correctly identifies existing samples by `s3_object_key`
- All sample fields are editable after creation (single and batch)
- Paginated list loads quickly for datasets with 500+ samples
- Zero dead code remaining in sample management components
- All 6 E2E test scenarios pass

## Resolved Questions

- **Multi-section CSV?** No — flat CSV only, one row per sample, no section headers
- **Pagination?** Yes — 50 samples per page with server-side pagination
- **Batch editing?** Yes — select multiple samples, apply shared field updates
