# PRD: Data Catalog Sample Management Refactor

## Introduction

Refactor the data catalog's sample management system from a file-upload model to an external URL + metadata JSON model. The current system requires admins to upload files to Supabase Storage — the new system lets admins paste media URLs (S3, Google Drive, etc.) paired with metadata JSON. This dramatically simplifies bulk ingest and better matches how Claru's data actually lives (in existing S3 buckets).

The portal view is also refactored from a simple list into a gallery grid with hover video preview and a split detail view (media left, metadata right).

## Goals

- Replace file upload as the primary sample input method with URL + JSON pairs
- Support three input methods: single add, bulk JSON paste, and CSV upload
- Keep Supabase Storage upload as a fallback option
- Redesign the portal dataset detail page as a gallery grid with auto-play-on-hover
- Add a split detail view: media player on the left, metadata JSON on the right
- Enable bulk ingest of thousands of samples via script using the same data model
- Simplify the `dataset_samples` schema to center on `media_url` + `metadata_json`

## User Stories

### US-001: Simplify dataset_samples schema
**Description:** As a developer, I need to update the dataset_samples table and TypeScript types to center on media_url + metadata_json instead of storage_path + individual columns.

**Acceptance Criteria:**
- [ ] Create new migration `supabase/migrations/003_simplify_samples.sql` that adds `media_url text` column to `dataset_samples`
- [ ] Copy existing `storage_path` values into `media_url` for any existing samples
- [ ] Keep `storage_path` column as nullable (for Supabase Storage fallback uploads)
- [ ] Make `metadata_json` the primary store for all sample metadata (subcategory, duration, resolution, fps, capture_device, etc.)
- [ ] Update `src/types/data-catalog.ts` — add `media_url` to `DatasetSample` interface, mark individual columns (duration_seconds, resolution_width, etc.) as optional
- [ ] Typecheck passes
- [ ] **Unit Tests:** Verify type exports compile correctly
- [ ] **Code Review:** Run code-reviewer agent to verify migration safety

### US-002: Admin single sample add — URL + JSON form
**Description:** As an admin, I want to add a single sample to a dataset by pasting a media URL and its metadata JSON.

**Acceptance Criteria:**
- [ ] On the dataset edit page (`/admin/catalog/[id]`), replace the DatasetUploader drag-and-drop zone with a new "Add Sample" section
- [ ] Form has two fields: Media URL (text input, required) and Metadata JSON (textarea with monospace font, optional, default `{}`)
- [ ] URL input validates it starts with `http://` or `https://`
- [ ] JSON textarea has syntax validation — shows error if invalid JSON
- [ ] "Add Sample" button calls API to create a `dataset_samples` record with `media_url` and `metadata_json`
- [ ] On success, sample appears in the samples list below
- [ ] Keep the existing Supabase Storage upload button as a secondary "Or upload a file" option below the URL form
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test URL validation, JSON validation, form submission
- [ ] **Code Review:** Run code-reviewer agent

### US-003: Admin bulk import — JSON array paste
**Description:** As an admin, I want to paste a JSON array of URL+metadata pairs to add many samples at once.

**Acceptance Criteria:**
- [ ] "Bulk Import" button/tab on the dataset edit page samples section
- [ ] Opens a modal or expanded panel with a large textarea
- [ ] Accepts a JSON array where each object has `media_url` (required) and `metadata` (optional object):
  ```json
  [
    {"media_url": "https://s3.../video1.mov", "metadata": {"subcategory": "Twist", "fps": 30}},
    {"media_url": "https://s3.../video2.mov", "metadata": {"subcategory": "Pour", "fps": 24}}
  ]
  ```
- [ ] Preview shows count: "X samples to import"
- [ ] Validates: all items have media_url, all metadata values are valid JSON objects
- [ ] "Import All" button batch-inserts all samples via API
- [ ] Progress indicator during import (X of Y imported)
- [ ] On completion, shows summary: "Imported X samples, Y errors"
- [ ] Errors displayed with row number and reason
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test JSON array validation, error handling for malformed entries
- [ ] **Code Review:** Run code-reviewer agent

### US-004: Admin bulk import — CSV upload
**Description:** As an admin, I want to upload a CSV file with media_url and metadata columns to bulk-add samples.

**Acceptance Criteria:**
- [ ] "Upload CSV" option alongside the JSON bulk import
- [ ] Accepts CSV with columns: `media_url` (required), `metadata_json` (optional, JSON string)
- [ ] Parses CSV client-side (use papaparse or simple split logic)
- [ ] Shows preview table with first 5 rows before import
- [ ] Same batch import flow as JSON: progress, summary, error display
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test CSV parsing, column mapping
- [ ] **Code Review:** Run code-reviewer agent

### US-005: Update samples API for new model
**Description:** As a developer, I need the samples API routes to support the new URL+JSON model alongside existing uploads.

**Acceptance Criteria:**
- [ ] Update `POST /api/admin/catalog/[id]/samples` to accept `{ media_url, metadata_json }` body
- [ ] If `media_url` is provided: create sample with media_url and metadata_json, no storage path needed
- [ ] If file upload flow: keep existing signed URL upload path (Supabase Storage fallback)
- [ ] Add `POST /api/admin/catalog/[id]/samples/bulk` for batch insert — accepts JSON array, returns success count + errors
- [ ] Update `GET` to return `media_url` in sample response
- [ ] Update `DELETE` — if sample has `storage_path`, delete from storage; if only `media_url`, just delete DB record
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test both URL-based and upload-based creation paths
- [ ] **Code Review:** Run code-reviewer agent

### US-006: Admin samples list — show URL-based samples
**Description:** As an admin, I want to see all samples in a dataset displayed in a grid showing thumbnails and metadata previews.

**Acceptance Criteria:**
- [ ] Replace the current file-list table with a visual grid of sample cards
- [ ] Each card shows: video thumbnail (auto-generated poster frame or placeholder), media URL (truncated), metadata preview (first 2-3 key-value pairs), delete button
- [ ] For video URLs: attempt to render a `<video>` element with the URL to get a poster frame
- [ ] For image URLs: show the image directly
- [ ] Cards are compact — fit 3-4 per row on desktop
- [ ] Total sample count displayed at top
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test card rendering with different URL types
- [ ] **Code Review:** Run code-reviewer agent

### US-007: Portal gallery grid with hover preview
**Description:** As an approved lead, I want to see a grid of data samples with video auto-play on hover so I can quickly scan the dataset.

**Acceptance Criteria:**
- [ ] Replace the current portal dataset detail sample list with a responsive gallery grid
- [ ] Grid: 2 columns on mobile, 3 on tablet, 4 on desktop
- [ ] Each card shows a thumbnail (poster frame for video, image preview for images)
- [ ] On hover: video auto-plays muted inline within the card (no click needed)
- [ ] On mouse leave: video pauses and resets
- [ ] Subcategory badge overlay on each card (from metadata_json.subcategory if present)
- [ ] Duration overlay on video cards (from metadata_json.duration_seconds if present)
- [ ] Clicking a card opens the detail split view (US-008)
- [ ] Smooth transitions: fade-in on grid load, scale on hover
- [ ] For external URLs (S3): render directly — no signed URL needed if the S3 bucket is public or has a CDN
- [ ] For Supabase Storage URLs: use signed URLs (existing getSignedUrl)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test hover state management, URL resolution logic
- [ ] **Code Review:** Run code-reviewer agent

### US-008: Portal detail split view — media left, JSON right
**Description:** As an approved lead, I want to click a sample and see a full detail view with the media on the left and metadata on the right.

**Acceptance Criteria:**
- [ ] Clicking a gallery card opens a detail view (either a modal overlay or an expanded inline panel)
- [ ] Left side (60% width on desktop): full media player
  - Video: HTML5 video with controls, autoplay muted, dark background
  - Image: full-size image with zoom on click
- [ ] Right side (40% width on desktop): metadata panel
  - Terminal-style JSON viewer matching existing SampleDataViewer aesthetic
  - Shows full `metadata_json` content formatted with syntax highlighting
  - Key-value pairs displayed at top for common fields (subcategory, duration, resolution, fps)
  - "Copy JSON" button
  - Annotation ID displayed if present
- [ ] Mobile: stacks vertically (media on top, metadata below)
- [ ] Close button / click outside to return to gallery
- [ ] Previous/Next navigation arrows to browse through samples without closing
- [ ] Keyboard navigation: left/right arrows, Escape to close
- [ ] Dark terminal aesthetic consistent with the rest of the portal
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test navigation logic, keyboard handlers, responsive layout breakpoints
- [ ] **Code Review:** Run code-reviewer agent

### US-009: Bulk ingest script for programmatic population
**Description:** As a developer, I need a script that reads a JSON file and bulk-populates samples into a dataset.

**Acceptance Criteria:**
- [ ] Script at `scripts/ingest-samples.ts` runnable with `npx tsx scripts/ingest-samples.ts --dataset <slug> --file <path>`
- [ ] Reads a JSON file with structure: `[{ "media_url": "...", "metadata": {...} }, ...]`
- [ ] Also accepts: `[{ "type": "...", "category": "...", "subcategory": "...", "annotation_id": "...", "file_url": "...", "metadata": {...} }]` — the Notion-style format
- [ ] Maps Notion-style fields: `file_url` → `media_url`, `subcategory`/`annotation_id` merged into `metadata_json`
- [ ] Uses Supabase admin client for batch inserts (chunks of 100 for performance)
- [ ] Idempotent: skips samples where `media_url` already exists for that dataset (upsert or existence check)
- [ ] Outputs progress: "Inserted X of Y samples (Z skipped, W errors)"
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test JSON parsing, field mapping, chunking logic
- [ ] **Code Review:** Run code-reviewer agent

### US-010: Playwright E2E Test — Admin sample management
**Description:** As QA, I need an E2E test verifying the admin can add samples via URL and bulk import.

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/data-catalog-samples.spec.ts`
- [ ] Test flow:
  1. Login as admin
  2. Navigate to /admin/catalog, click a dataset
  3. Add a single sample via URL + JSON form
  4. Verify sample appears in the grid
  5. Open bulk import, paste a JSON array with 2 samples
  6. Verify import succeeds and count updates
  7. Delete a sample, verify it's removed
- [ ] Test includes assertions for validation errors (bad URL, invalid JSON)
- [ ] Typecheck passes

### US-011: Playwright E2E Test — Portal gallery and detail view
**Description:** As QA, I need an E2E test verifying the portal gallery grid and split detail view.

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/data-catalog-portal-gallery.spec.ts`
- [ ] Test flow:
  1. Navigate to /portal (with authenticated session)
  2. Browse to a dataset with samples
  3. Verify gallery grid renders with sample cards
  4. Click a sample card
  5. Verify split detail view opens with media player and JSON panel
  6. Verify "Copy JSON" button works
  7. Test next/previous navigation
  8. Press Escape to close, verify return to gallery
- [ ] Typecheck passes

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** - Test core logic, validation, and edge cases
2. **Code Review** - Run code-reviewer agent after implementation to verify correctness
3. **Type Safety** - All code must pass TypeScript strict mode

End-to-end tests (Playwright) are defined in US-010 and US-011 to verify complete user flows.

## Functional Requirements

- FR-1: `dataset_samples` table has `media_url` column for external URLs
- FR-2: Admin can add samples via single URL+JSON form
- FR-3: Admin can bulk import samples via pasted JSON array
- FR-4: Admin can bulk import samples via CSV upload
- FR-5: Admin can still upload files to Supabase Storage as fallback
- FR-6: Bulk API endpoint processes batch inserts with error reporting
- FR-7: Portal gallery grid shows responsive thumbnail cards
- FR-8: Video samples auto-play muted on hover in the gallery
- FR-9: Clicking a gallery card opens split detail view (media left, JSON right)
- FR-10: Detail view supports next/previous navigation and keyboard shortcuts
- FR-11: Bulk ingest script supports both Notion-style and simple URL+JSON formats
- FR-12: Ingest script is idempotent (no duplicate samples on re-run)

## Non-Goals

- No transcoding or video processing — URLs are served as-is
- No thumbnail generation — use video poster frames or image URLs directly
- No CDN setup — external URLs served directly from source
- No editing of metadata after initial import (admin can delete and re-add)
- No versioning of samples or metadata

## Design Considerations

- Reuse existing `MetadataJsonViewer` component from portal for the right panel
- Gallery grid should use CSS grid with `object-cover` thumbnails for consistent card sizes
- Hover video preview uses native `<video>` with `preload="metadata"` to minimize bandwidth
- Split detail view can be a modal overlay with `position: fixed` and backdrop blur
- Terminal aesthetic throughout — dark bg, green accents, monospace metadata

## Technical Considerations

- External S3 URLs may require CORS headers if serving video directly — test with actual moonvalley-annotation-platform S3 URLs
- For S3 URLs that require authentication: admin may need to make the bucket/objects publicly readable, or use CloudFront signed URLs
- Bulk insert API should use Supabase batch insert (single query for up to 100 rows) for performance
- CSV parsing should happen client-side to avoid sending large files to the server
- Video hover preview: use `IntersectionObserver` to only load videos when cards are in viewport

## Success Metrics

- Admin can add 100+ samples in under 60 seconds via bulk import
- Portal gallery loads in under 2 seconds for datasets with 50+ samples
- Video hover preview starts within 500ms of hover
- Zero increase in Supabase Storage costs (samples served from external URLs)

## Open Questions

- Are the S3 URLs publicly accessible, or do they need signed URLs / auth headers?
- Should we support Google Drive URLs (they require a different embedding pattern)?
- What's the expected max samples per dataset? (affects pagination strategy)
