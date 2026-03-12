# PRD: Reka Data Catalog Expansion

## Introduction

Expand the dataset catalog schema to support multiple data source types (collected, synthetic, curated) and add ~13 new datasets from Reka AI's training data inventory. This grows the public dataset browser from 12 entries to 25, covering multimodal instruction tuning, speech/audio, code/math, document understanding, video understanding, and large-scale pretraining data. The schema gains `source_type` and `modality` columns, and the admin portal gets updated to manage them.

## Goals

- Add `source_type` and `modality` columns to the datasets table with migration
- Create 6 new dataset categories for expanded data domains
- Backfill existing 15 datasets with appropriate source_type and modality values
- Seed 8 Tier 1 (synthetic) and 5 Tier 2 (curated) dataset entries
- Update the public API, TypeScript types, and card component to support source_type badges
- Update admin DatasetForm to include source_type and modality fields
- Publish all new datasets immediately

## User Stories

### US-001: Database migration — add source_type and modality columns
**Description:** As a developer, I need to add source_type and modality columns to the datasets table so we can classify datasets by provenance and data modality.

**Acceptance Criteria:**
- [ ] Create Supabase migration adding two columns to `datasets`:
  - `source_type TEXT NOT NULL DEFAULT 'collected'` — allowed values: 'collected', 'synthetic', 'curated'
  - `modality TEXT` (nullable) — allowed values: 'image_text', 'video_text', 'audio_text', 'text_only', 'audio_audio', 'multiple_images_text', 'audio_video_text', 'mixed'
- [ ] Add CHECK constraint on source_type: `source_type IN ('collected', 'synthetic', 'curated')`
- [ ] No CHECK constraint on modality (keep flexible for future values)
- [ ] Migration runs successfully without data loss
- [ ] Existing rows get `source_type = 'collected'` (from DEFAULT)
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent to verify migration safety

**Recommended agents/skills:** `general-purpose`, `code-reviewer`

---

### US-002: Backfill existing datasets with modality values
**Description:** As a developer, I need to set the correct modality on all existing datasets so they're properly classified.

**Acceptance Criteria:**
- [ ] Run SQL to set modality on all 15 existing datasets:
  - Egocentric Activity Capture → 'video_text'
  - Traffic & Transportation Footage → 'video_text'
  - Workplace Activities → 'video_text'
  - Cinematic Action Footage → 'video_text'
  - Henri Halle Africa Cinematography → 'video_text'
  - Game Environment Capture → 'video_text'
  - Video Quality Annotations → 'video_text'
  - Video Classification — Supervised Labels → 'video_text'
  - Systematic Quality Parameter Evaluations → 'video_text'
  - Video Generation Preference Data → 'video_text'
  - Prompt & Video Selection Rankings → 'video_text'
  - Object & Face Identity Matching → 'image_text'
  - AI Image Generation Evaluation → 'image_text'
  - Content Safety & Policy Review → 'mixed'
  - Product Image Annotation → 'image_text'
- [ ] All 15 existing datasets have source_type = 'collected' (already from DEFAULT)
- [ ] Verify with: `SELECT name, source_type, modality FROM datasets ORDER BY name` — no NULLs in source_type, modality set for all
- [ ] Typecheck passes

**Recommended agents/skills:** `general-purpose`, `code-reviewer`

---

### US-003: Create 6 new dataset categories
**Description:** As a developer, I need new categories for the expanded data domains so datasets can be properly organized.

**Acceptance Criteria:**
- [ ] Insert 6 new rows into `dataset_categories`:
  - 'Multimodal Instruction Tuning', slug: 'multimodal-instruction-tuning', display_order: 9
  - 'Speech & Audio', slug: 'speech-audio', display_order: 10
  - 'Code & Math Reasoning', slug: 'code-math-reasoning', display_order: 11
  - 'Document Understanding', slug: 'document-understanding', display_order: 12
  - 'Video Understanding', slug: 'video-understanding', display_order: 13
  - 'Large-Scale Pretraining', slug: 'large-scale-pretraining', display_order: 14
- [ ] Verify RLS allows anon SELECT on new categories (existing "Public can read categories" policy should cover it)
- [ ] Typecheck passes

**Recommended agents/skills:** `general-purpose`, `code-reviewer`

---

### US-004: Seed Tier 1 synthetic datasets
**Description:** As a developer, I need to create the 8 proprietary synthetic dataset entries so they appear in the catalog.

**Acceptance Criteria:**
- [ ] Insert 8 datasets with `source_type = 'synthetic'`, `is_published = true`:

  1. **Multimodal Image Chat** — category: Multimodal Instruction Tuning, modality: image_text, total_samples: 997000, total_duration_hours: 0, description: "Multi-turn conversational data pairing images with instruction-following dialogues. Covers chart interpretation, financial documents, and general visual reasoning across multiple generation rounds.", type: 'instruction', annotation_types: ['multi_turn_chat', 'instruction_following', 'visual_reasoning']

  2. **Multimodal Video Chat** — category: Multimodal Instruction Tuning, modality: video_text, total_samples: 440000, total_duration_hours: 0, description: "Multi-turn video conversation data for training models to reason about temporal sequences, actions, and events in video content.", type: 'instruction', annotation_types: ['multi_turn_chat', 'video_reasoning', 'temporal_understanding']

  3. **Financial & Chart Reasoning** — category: Document Understanding, modality: image_text, total_samples: 325000, total_duration_hours: 0, description: "Structured conversations around financial documents, data tables, and chart visualizations. Designed for training models to extract, interpret, and reason about quantitative visual data.", type: 'instruction', annotation_types: ['chart_reasoning', 'table_extraction', 'financial_analysis']

  4. **Code Instruction Tuning** — category: Code & Math Reasoning, modality: text_only, total_samples: 3600000, total_duration_hours: 0, description: "High-quality instruction-following data for code generation, comprehension, SQL queries, and programming tasks across multiple languages and difficulty levels.", type: 'instruction', annotation_types: ['code_generation', 'code_comprehension', 'sql', 'instruction_following']

  5. **Math Visual Reasoning** — category: Code & Math Reasoning, modality: image_text, total_samples: 1700000, total_duration_hours: 0, description: "Visual mathematics problems paired with step-by-step reasoning. Includes OCR-focused variants for extracting and solving equations from images of handwritten and printed mathematical content.", type: 'instruction', annotation_types: ['math_reasoning', 'ocr', 'equation_solving']

  6. **Speech-to-Speech Training** — category: Speech & Audio, modality: audio_audio, total_samples: 3300000, total_duration_hours: 0, description: "Paired audio-to-audio training data for speech generation and voice synthesis models. Derived from long-form spoken content with diverse speaker characteristics.", type: 'generation', annotation_types: ['speech_synthesis', 'voice_conversion']

  7. **Text-to-Speech Training** — category: Speech & Audio, modality: audio_text, total_samples: 6500000, total_duration_hours: 0, description: "Large-scale text-audio paired data for training text-to-speech and speech understanding models. Covers diverse reading styles, pacing, and content domains.", type: 'generation', annotation_types: ['text_to_speech', 'speech_understanding']

  8. **Synthetic OCR & Rendered Text** — category: Document Understanding, modality: image_text, total_samples: 20000000, total_duration_hours: 0, description: "Millions of synthetically rendered text images with character-level and line-level annotations. Includes diverse fonts, rotations, lighting conditions, and background textures for robust OCR training.", type: 'annotation', annotation_types: ['ocr', 'text_detection', 'character_recognition']

- [ ] All 8 have unique slugs (kebab-case of name)
- [ ] All 8 have is_published = true
- [ ] Verify with: `SELECT name, source_type, modality, is_published FROM datasets WHERE source_type = 'synthetic'` — returns 8 rows
- [ ] Typecheck passes

**Recommended agents/skills:** `general-purpose`, `code-reviewer`

---

### US-005: Seed Tier 2 curated datasets
**Description:** As a developer, I need to create the 5 curated open-source dataset entries so they appear in the catalog.

**Acceptance Criteria:**
- [ ] Insert 5 datasets with `source_type = 'curated'`, `is_published = true`:

  1. **Video Captioning & QA Collection** — category: Video Understanding, modality: video_text, total_samples: 70000000, total_duration_hours: 0, description (public-facing): "Comprehensive video-text collection spanning captioning, question answering, and temporal reasoning tasks across diverse video domains including instructional content, movies, and real-world activities.", description (internal, stored in admin_notes or tags): sources include PANDA-70M, ActivityNet, MSRVTT, MSVD, FunQA, CinePile, condensed_movies, FineVideo. type: 'captioning', annotation_types: ['video_captioning', 'video_qa', 'temporal_reasoning']

  2. **Document & PDF Intelligence** — category: Document Understanding, modality: multiple_images_text, total_samples: 25000000, total_duration_hours: 0, description: "Training-ready document understanding data covering PDF parsing, table extraction, infographic interpretation, and multi-page document reasoning. Processed into distributed-training-ready shards.", type: 'annotation', annotation_types: ['document_parsing', 'table_extraction', 'pdf_ocr', 'infographic_qa']

  3. **Audio Understanding Collection** — category: Speech & Audio, modality: audio_text, total_samples: 2600000, total_duration_hours: 0, description: "Curated audio-text pairs spanning environmental sound classification, music understanding, and speech captioning. Quality-filtered and formatted for multimodal model training.", type: 'captioning', annotation_types: ['audio_captioning', 'sound_classification', 'music_understanding']

  4. **Interleaved Multimodal Documents** — category: Large-Scale Pretraining, modality: multiple_images_text, total_samples: 140000000, total_duration_hours: 0, description: "Web-scale interleaved image-text documents preserving natural reading order. Designed for pretraining models that understand documents with mixed visual and textual content.", type: 'pretraining', annotation_types: ['interleaved_pretraining', 'document_understanding']

  5. **Image-Text Pretraining Shards** — category: Large-Scale Pretraining, modality: image_text, total_samples: 500000000, total_duration_hours: 0, description: "Billions of image-text pairs processed into training-ready webdataset shards. Quality-filtered, deduplicated, and validated for large-scale multimodal pretraining pipelines.", type: 'pretraining', annotation_types: ['image_text_pretraining', 'contrastive_learning']

- [ ] For Tier 2 datasets: store source dataset names in the `tags` array (e.g. tags: ['source:PANDA-70M', 'source:ActivityNet', ...]) — these are internal-only since tags aren't shown on the public page
- [ ] All 5 have unique slugs, is_published = true
- [ ] Verify with: `SELECT name, source_type, modality, is_published FROM datasets WHERE source_type = 'curated'` — returns 5 rows
- [ ] Typecheck passes

**Recommended agents/skills:** `general-purpose`, `code-reviewer`

---

### US-006: Update PublicDataset type and public API
**Description:** As a developer, I need the public API to return source_type and modality so the frontend can display badges and support future filtering.

**Acceptance Criteria:**
- [ ] Add `source_type` (string) and `modality` (string | null) to the `PublicDataset` interface in `src/types/data-catalog.ts`
- [ ] Update `src/app/api/public/datasets/route.ts` to include `source_type` and `modality` in the SELECT query and response mapping
- [ ] Verify API response at `/api/public/datasets` includes both new fields on every dataset
- [ ] Existing fields unchanged
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent to verify no data leakage

**Recommended agents/skills:** `nextjs-expert`, `code-reviewer`

---

### US-007: Add source_type badge to PublicDatasetCard
**Description:** As a visitor, I want to see what type of data each dataset is (collected, synthetic, curated) so I understand its provenance.

**Acceptance Criteria:**
- [ ] Update `src/app/components/catalog/PublicDatasetCard.tsx` to show a source_type badge
- [ ] Badge placement: below the category label, above the dataset name
- [ ] Badge logic:
  - `source_type === 'collected'` → no badge (default, strongest signal, no label needed)
  - `source_type === 'synthetic'` → pill with text "SYNTHETIC"
  - `source_type === 'curated'` → pill with text "CURATED · TRAINING-READY"
- [ ] Badge styling: `font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--accent-primary)]/20 text-[var(--accent-primary)]/70 bg-[var(--accent-primary)]/5 w-fit`
- [ ] Badge should not increase card height significantly — keep it compact
- [ ] Typecheck passes
- [ ] Verify in browser at desktop, tablet, and mobile viewports
- [ ] **Code Review:** Run code-reviewer agent to verify design system consistency

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-008: Update admin DatasetForm with source_type and modality
**Description:** As an admin, I need to set source_type and modality when creating or editing datasets so the catalog is properly classified.

**Acceptance Criteria:**
- [ ] Read `src/app/admin/catalog/DatasetForm.tsx` to understand existing form structure
- [ ] Add `source_type` dropdown to the form:
  - Options: 'collected' (default), 'synthetic', 'curated'
  - Label: "Source Type"
  - Styled consistent with existing form inputs (bg-[var(--bg-secondary)], border-[var(--border-subtle)], font-mono text-sm)
- [ ] Add `modality` dropdown to the form:
  - Options: (empty/null), 'image_text', 'video_text', 'audio_text', 'text_only', 'audio_audio', 'multiple_images_text', 'audio_video_text', 'mixed'
  - Label: "Modality"
  - Optional field (can be null)
- [ ] Place both fields after the existing `type` field in the form layout
- [ ] Both fields save correctly on create (POST) and update (PATCH)
- [ ] Verify the admin API routes (`/api/admin/catalog/` POST and `/api/admin/catalog/[id]` PATCH) accept and persist the new fields — update if needed
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Code Review:** Run code-reviewer agent to verify form patterns

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-009: Playwright MCP User Acceptance Testing
**Description:** As QA, I need to verify the expanded catalog renders correctly across viewports with the new datasets and badges.

**Acceptance Criteria:**
- [ ] Navigate to localhost:3005/data-catalog
- [ ] Scroll to the "BROWSE THE CATALOG" section, take screenshot
- [ ] Verify all 25 published datasets are visible (scroll/lazy-load through all)
- [ ] Verify new category filter pills appear (Multimodal Instruction Tuning, Speech & Audio, Code & Math Reasoning, Document Understanding, Video Understanding, Large-Scale Pretraining)
- [ ] Click "Multimodal Instruction Tuning" pill — verify only 2 cards show (Image Chat + Video Chat)
- [ ] Click "Speech & Audio" pill — verify 3 cards show (Speech-to-Speech, Text-to-Speech, Audio Understanding)
- [ ] Click "Large-Scale Pretraining" pill — verify 2 cards show
- [ ] Verify "SYNTHETIC" badge appears on Tier 1 datasets
- [ ] Verify "CURATED · TRAINING-READY" badge appears on Tier 2 datasets
- [ ] Verify NO badge appears on existing collected datasets (e.g. Egocentric Activity Capture)
- [ ] Click "Request Access" on a synthetic dataset — verify Calendly modal opens
- [ ] Resize to mobile (375px) — verify badges don't break card layout, take screenshot
- [ ] Check browser console for errors
- [ ] Navigate to admin catalog, verify source_type and modality dropdowns appear on edit form
- [ ] Document any issues found and fix critical blockers

**Recommended agents/skills:** Playwright MCP (`mcp__playwright`), `code-reviewer`

---

## Functional Requirements

- FR-1: `source_type` column added to datasets with CHECK constraint ('collected', 'synthetic', 'curated'), default 'collected'
- FR-2: `modality` column added to datasets (nullable text, no constraint)
- FR-3: All existing datasets backfilled with source_type='collected' and appropriate modality
- FR-4: 6 new categories created with display_order 9-14
- FR-5: 8 Tier 1 synthetic datasets seeded with is_published=true, source_type='synthetic'
- FR-6: 5 Tier 2 curated datasets seeded with is_published=true, source_type='curated'
- FR-7: Curated dataset source names stored in tags array (e.g. 'source:PANDA-70M') for internal reference
- FR-8: Public API returns source_type and modality in response
- FR-9: Public card shows "SYNTHETIC" or "CURATED · TRAINING-READY" pill badge based on source_type
- FR-10: No badge shown for source_type='collected'
- FR-11: Admin DatasetForm includes source_type and modality dropdowns
- FR-12: Admin API routes accept and persist source_type and modality
- FR-13: All 25 published datasets appear on the public /data-catalog page

## Non-Goals

- No separate modality filter on the public page (modality is implied by category)
- No detail pages for the new datasets
- No sample data or S3 integration for the new datasets
- No changes to the portal catalog (authenticated view)
- No changes to lead_dataset_access for the new datasets
- No Tier 3 datasets (medical, weapons, LAION-2B — excluded from catalog)

## Design Considerations

- Source type badges use a softer styling than category labels — border + background at very low opacity to keep them subtle
- Badge text is 10px (smaller than category label at 12px) to establish visual hierarchy: category > badge > name
- Cards should remain the same height range with or without badges — the badge is compact (single line)
- New categories may cause the filter pills to overflow on tablet — horizontal scroll already handles this

## Technical Considerations

- Migration must be safe for existing data: DEFAULT 'collected' ensures no nulls, modality is nullable so existing rows get NULL until backfilled
- Backfill runs as a separate SQL statement after migration (not in same migration to avoid transaction issues)
- The public API uses `createClient` with anon key (no cookies) — this was fixed earlier in this session to avoid authenticated role issues
- RLS "Public can read published datasets" policy already covers new datasets since it only checks `is_published = true`
- RLS "Public can read categories" policy already covers new categories
- Admin API routes may need minor updates to whitelist source_type and modality in the updateFields logic

## Success Metrics

- Public catalog grows from 12 to 25 published datasets
- 8 new category filter pills available (existing + 6 new)
- Source type badges render correctly at all viewports
- No regressions on existing dataset display
- Admin can create new datasets with source_type and modality from the form

## Quality Assurance Requirements

Each user story must include:
1. **Code Review** — Run code-reviewer agent after EACH story completion
2. **Type Safety** — All code must pass TypeScript strict mode
3. **Visual Verification** — UI stories verified in browser via Playwright MCP

### Execution Guidelines
- **Parallelize work**: US-001 (migration) must go first. Then US-002 + US-003 can run in parallel. Then US-004 + US-005 in parallel. Then US-006 + US-007 + US-008 can be parallelized since they touch different files.
- **Code review every story**
- **Playwright MCP UAT**: US-009 is the final story for live verification

## Open Questions

- Should we add a `size_gb` column to datasets for internal tracking of storage footprint? (Not displayed publicly, but useful for the Reka inventory)
- Should Tier 2 curated dataset descriptions mention "training-ready webdataset shards" or keep it more generic?
- Future: should the public page support text search across dataset names and descriptions?
