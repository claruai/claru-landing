# Physical AI Dataset Portal — Implementation Tasks

> Searchable directory of 400+ open-source physical AI datasets at `/datasets`.
> Pipeline (crawl → extract → social → QA) already built. This plan covers: Supabase schema, pipeline push, frontend hub + detail + comparison, email gate, GitHub Actions cron, PostHog tracking, and tests.

---

## Phase 1: Data Layer (Supabase + Pipeline Push)

- [ ] 1.1 Create `oss_datasets` Supabase migration
  - New file: `supabase/migrations/20260410_oss_datasets.sql`
  - Table `oss_datasets` with columns: `id uuid PK`, `dataset_id text UNIQUE NOT NULL` (HF repo ID), `slug text UNIQUE NOT NULL`, `name text`, `description text`, `parent_project text`, `modalities text[]`, `robot_embodiments text[]`, `action_space text`, `environment_type text[]`, `task_types text[]`, `num_episodes text`, `total_hours text`, `license text`, `annotation_types text[]`, `data_format text`, `year_released int`, `paper_url text`, `physical_ai_relevance text`, `downloads bigint DEFAULT 0`, `likes int DEFAULT 0`, `hf_last_modified timestamptz`, `social_signals jsonb DEFAULT '{}'`, `qa_completeness numeric`, `is_published boolean DEFAULT true`, `created_at timestamptz DEFAULT now()`, `updated_at timestamptz DEFAULT now()`
  - Enable RLS: anon SELECT where `is_published = true`, service_role full access
  - Add `updated_at` trigger reusing existing `update_updated_at_column()` function
  - Ref: Phase 1 items 1, 4 from spec

- [ ] 1.2 Create GIN indexes on array columns and text search
  - In same migration or separate file
  - GIN indexes on `modalities`, `robot_embodiments`, `environment_type`, `task_types`, `annotation_types`
  - `tsvector` generated column from `name || description || physical_ai_relevance` with GIN index for full-text search
  - B-tree index on `downloads DESC` for default sort
  - Ref: Phase 1 item 5

- [ ] 1.3 Write `pipeline_push.py` to upsert pipeline output into Supabase
  - New file: `scripts/dataset-pipeline/pipeline_push.py`
  - Reads `output/enriched_with_social.json` (or `enriched_v2.json` as fallback)
  - Generates slug from `dataset_id` (e.g. `nvidia/PhysicalAI-Robotics-GR00T` → `nvidia-physicalai-robotics-gr00t`)
  - Maps extraction fields to `oss_datasets` columns, flattens social signals into `social_signals` jsonb
  - Uses `supabase-py` client with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env vars
  - Upserts on `dataset_id` conflict — updates all fields except `created_at`
  - Prints summary: inserted/updated/skipped counts
  - Ref: Phase 1 items 2, 3

- [ ] 1.4 Run initial data load and verify with a test query
  - Execute `pipeline_push.py` against prod Supabase with the 421 crawled datasets
  - Write `scripts/dataset-pipeline/test_push.py` — verifies row count, spot-checks 3 known datasets (DROID, RoboCasa, Xperience-10M) for correct field mapping
  - Ref: Phase 1 item 3

- [ ] 1.5 Create TypeScript types for `oss_datasets`
  - New file: `src/types/oss-datasets.ts`
  - `OSSDataset` interface matching the Supabase table columns
  - `OSSDatasetFilters` interface for filter state (modalities, embodiments, environments, tasks, license, format, search query, sort)
  - `OSSDatasetSortOption` type: `"downloads" | "recent" | "name" | "year"`
  - Ref: Phase 2 items 1-5

---

## Phase 2: Frontend — Hub Page

- [ ] 2.1 Create Supabase data-fetching layer for OSS datasets
  - New file: `src/lib/oss-datasets.ts`
  - `fetchOSSDatasets(filters: OSSDatasetFilters)` — builds Supabase query with `.contains()` for array filters, `.textSearch()` for full-text, `.order()` for sort, returns `OSSDataset[]`
  - `fetchOSSDatasetBySlug(slug: string)` — single record fetch
  - `fetchFilterOptions()` — queries distinct values for modalities, embodiments, environments, tasks, licenses, formats to populate filter dropdowns
  - Uses `createSupabaseBrowserClient()` for client-side or `createSupabaseAdminClient()` for server-side
  - Ref: Phase 2 items 1, 4, 5

- [ ] 2.2 Build filter bar component
  - New file: `src/app/datasets/components/FilterBar.tsx`
  - Client component with multi-select dropdowns for: modalities, robot embodiments, environment type, task types, license, data format
  - Text search input with debounced onChange (300ms)
  - Sort dropdown (Most Downloads, Most Recent, A-Z, Year Released)
  - Active filter pills with "x" to remove, "Clear all" button
  - Reads initial state from URL search params, writes changes back via `useRouter().replace()`
  - Styled with existing design system: dark cards, sage green accent, JetBrains Mono for labels
  - Ref: Phase 2 items 2, 3

- [ ] 2.3 Build OSS dataset card component
  - New file: `src/app/datasets/components/OSSDatasetCard.tsx`
  - Displays: name, 2-line description, modality pills (max 4), downloads count, year, license badge, robot embodiment tags
  - Checkbox in top-right for comparison selection (controlled via parent state)
  - Links to `/datasets/[slug]`
  - Hover state: `border-white/20 bg-white/[0.05]` (matches existing card pattern in current hub page)
  - Ref: Phase 2 item 6

- [ ] 2.4 Rewrite `/datasets` hub page to query Supabase
  - Modify: `src/app/datasets/page.tsx`
  - Server component that fetches initial dataset list + filter options from Supabase
  - Passes initial data as props to a new client component `DatasetsHubClient.tsx`
  - Client component manages filter state, re-fetches on filter change, renders FilterBar + grid of OSSDatasetCard
  - Keeps existing metadata/SEO block, updates description to reflect 400+ OSS datasets
  - Preserves existing breadcrumb pattern and CTA section
  - Pagination: load more button (50 per page) or virtual scroll if 400+ causes perf issues
  - Ref: Phase 2 items 1, 6

- [ ] 2.5 Wire up URL-based filter state
  - In `DatasetsHubClient.tsx`, sync filter state bidirectionally with `searchParams`
  - URL format: `/datasets?modality=rgb,depth&env=kitchen&sort=downloads&q=manipulation`
  - On mount, parse URL params → set filter state → trigger initial fetch
  - On filter change → update URL (shallow replace, no scroll) → re-fetch
  - Ref: Phase 2 item 3

- [ ] 2.6 Add PostHog tracking to hub page interactions
  - Track events: `oss_dataset_search` (query text), `oss_dataset_filter` (filter name + values), `oss_dataset_sort` (sort option), `oss_dataset_card_click` (dataset slug), `oss_dataset_page_view` (filter state as properties)
  - Use existing `posthog-js/react` hooks from PostHogProvider
  - Ref: Phase 2 item 7

- [ ] 2.7 Write Vitest unit tests for data-fetching and filter logic
  - New file: `src/lib/__tests__/oss-datasets.test.ts`
  - Test filter query construction (array containment, text search, sort mapping)
  - Test slug generation matches pipeline_push.py logic
  - Mock Supabase client responses
  - Ref: Testing strategy

---

## Phase 3: Frontend — Detail Pages

- [ ] 3.1 Build coexistence routing logic for static Claru pages vs dynamic OSS pages
  - Modify: `src/app/datasets/[slug]/page.tsx`
  - Check `getDatasetPage(slug)` first — if match, render existing `Wave3PageTemplate` (existing 40 static Claru pages)
  - If no static match, query `oss_datasets` by slug from Supabase — if found, render new `OSSDatasetDetail` component
  - If neither, return `notFound()`
  - `generateStaticParams` keeps existing static slugs; OSS pages use dynamic rendering with ISR (`revalidate: 3600`)
  - Ref: Phase 3 item 2

- [ ] 3.2 Build OSS dataset detail component
  - New file: `src/app/datasets/components/OSSDatasetDetail.tsx`
  - Server component layout: hero section with name + description + key stats row (downloads, episodes, hours, year)
  - Metadata grid: modalities, robot embodiments, environments, task types, annotation types, data format, license, action space
  - Physical AI relevance callout block (sage green left border)
  - Link to HuggingFace source (`https://huggingface.co/datasets/{dataset_id}`)
  - Styled consistent with existing Wave3PageTemplate patterns
  - Ref: Phase 3 items 3, 5

- [ ] 3.3 Add social signals section to detail page
  - In `OSSDatasetDetail.tsx`, render social signals from the `social_signals` jsonb
  - Display: Reddit posts (title + score + link), HN posts (title + points + link), Semantic Scholar citation count + paper link
  - Collapse to "No community signals yet" if empty
  - Ref: Phase 3 item 4

- [ ] 3.4 Build related datasets query
  - In `src/lib/oss-datasets.ts`, add `fetchRelatedDatasets(dataset: OSSDataset, limit: number)` — finds datasets sharing modalities or task types, excludes current, ordered by downloads, limit 6
  - Render as a grid of `OSSDatasetCard` at bottom of detail page
  - Ref: Phase 3 item 6

- [ ] 3.5 Add contextual Claru CTA to detail pages
  - Component at bottom of `OSSDatasetDetail.tsx`, above related datasets
  - Copy: "Need custom [modality] data?" with description matching the dataset's primary modality/task
  - Links to `/#contact` (same pattern as existing hub page CTA)
  - Ref: Phase 3 item 7

- [ ] 3.6 Add JSON-LD Dataset schema for OSS pages
  - New file: `src/lib/oss-dataset-jsonld.ts`
  - Builds `schema.org/Dataset` JSON-LD from `OSSDataset` fields (name, description, license, creator, distribution)
  - Injected via `<script type="application/ld+json">` in the detail page (same pattern as existing `buildDatasetJsonLd`)
  - Ref: Phase 3 item 8

- [ ] 3.7 Generate OG image metadata for OSS dataset pages
  - In `generateMetadata` for `[slug]`, produce OG metadata using existing `ogImageUrl()` helper with `{ category: "oss-dataset" }`
  - Ref: Phase 3 item 9

- [ ] 3.8 Update sitemap to include OSS dataset slugs
  - Modify: `src/app/sitemap.ts`
  - Add a Supabase query to fetch all `oss_datasets` slugs where `is_published = true`
  - Merge with existing static dataset slugs (dedup by slug)
  - Set priority 0.6 for OSS pages (lower than static Claru pages at 0.7)
  - Ref: SEO requirements

---

## Phase 4: Comparison Tool

- [ ] 4.1 Build comparison state management
  - New file: `src/app/datasets/components/ComparisonContext.tsx`
  - React context + provider wrapping `/datasets` layout
  - State: `selectedSlugs: string[]` (max 4), `addToComparison`, `removeFromComparison`, `clearComparison`
  - Persisted to `sessionStorage` so selections survive page navigation
  - Ref: Phase 4 item 1

- [ ] 4.2 Build floating comparison bar
  - New file: `src/app/datasets/components/ComparisonBar.tsx`
  - Fixed bottom bar, visible when `selectedSlugs.length > 0`
  - Shows selected dataset names as pills with "x" remove
  - "Compare (N)" button → navigates to `/datasets/compare?slugs=slug1,slug2,...`
  - Framer Motion slide-up/down animation
  - Ref: Phase 4 item 1

- [ ] 4.3 Build comparison page
  - New file: `src/app/datasets/compare/page.tsx`
  - Reads `slugs` from search params, fetches datasets from Supabase
  - Side-by-side table: rows for each metadata field, columns for each dataset
  - Highlight cells where values differ across datasets (sage green background on differing cells)
  - Mobile: horizontal scroll on the comparison table
  - Ref: Phase 4 items 2, 3

- [ ] 4.4 Add email-gated CSV export to comparison
  - On comparison page, "Export as CSV" button
  - If user hasn't provided email (check localStorage `oss_portal_email`), show email gate modal (see Phase 5)
  - If unlocked, generate CSV from comparison data and trigger download
  - Ref: Phase 4 item 4

---

## Phase 5: Email Gate

- [ ] 5.1 Build email capture modal component
  - New file: `src/app/datasets/components/EmailGateModal.tsx`
  - Modal with: email input (required, business email validation via regex), company input (optional), submit button
  - On submit: insert into existing `leads` table with `status: 'pending'`, `data_needs: 'oss_portal_access'`
  - On success: set `localStorage.oss_portal_email` and `localStorage.oss_portal_unlocked = true`
  - Ref: Phase 5 items 1, 2, 3

- [ ] 5.2 Wire email gate to gated features
  - Comparison CSV export (Phase 4.4) checks `localStorage.oss_portal_unlocked` before proceeding
  - Optional: blur overlay on social signals section of detail pages for ungated users (stretch goal, implement only if explicit)
  - Ref: Phase 5 items 1, 4

- [ ] 5.3 PostHog identify on email capture
  - After successful lead creation, call `posthog.identify(email, { company, source: 'oss_dataset_portal' })`
  - Track `oss_portal_email_captured` event with company property
  - Ref: Phase 5 item 4

---

## Phase 6: Pipeline Automation (GitHub Actions)

- [ ] 6.1 Create GitHub Actions workflow for daily pipeline run
  - New file: `.github/workflows/dataset-pipeline.yml`
  - Cron: `0 6 * * *` (6am UTC daily)
  - Manual trigger: `workflow_dispatch`
  - Steps: checkout, setup Python 3.14, install deps from `scripts/dataset-pipeline/requirements.txt`, run `crawl_hf.py`, `extract_metadata.py`, `social_signals.py`, `pipeline_push.py`
  - Secrets: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - Ref: Phase 6 items 1, 2

- [ ] 6.2 Add ISR revalidation trigger to pipeline_push.py
  - After successful upsert, call Vercel's on-demand ISR endpoint: `POST https://claru.ai/api/revalidate?secret=REVALIDATION_SECRET&path=/datasets`
  - Also revalidate changed detail page paths: `/datasets/[slug]` for each upserted row
  - Add `REVALIDATION_SECRET` to GitHub Actions secrets and create the API route
  - New file: `src/app/api/revalidate/route.ts` — validates secret, calls `revalidatePath()`
  - Ref: Phase 6 item 3

- [ ] 6.3 Add pipeline failure alerting
  - In the GitHub Actions workflow, add a failure step that posts to a Slack webhook (or sends email) on any step failure
  - Use `if: failure()` condition on a final notification step
  - Ref: Phase 6 item 4

---

## Phase 7: Testing & QA

- [ ] 7.1 Write Playwright E2E tests for hub page
  - New file: `e2e/datasets-portal.spec.ts`
  - Tests: page loads with dataset cards, search filters results, filter dropdowns work, sort changes order, card links to detail page, URL params persist on reload
  - Ref: Phase 7 item 1

- [ ] 7.2 Write Playwright E2E tests for detail page and comparison
  - In same file or separate: detail page renders metadata, social signals section present, related datasets load, comparison selection works, comparison page renders side-by-side table, email gate appears on CSV export
  - Ref: Phase 7 items 1, 2

- [ ] 7.3 Add mobile responsive tests
  - Playwright tests at viewport 375x812 (iPhone) and 768x1024 (iPad)
  - Verify: filter bar collapses to sheet/accordion, cards stack single-column, comparison table scrolls horizontally, comparison bar doesn't overlap content
  - Ref: Phase 7 item 2

- [ ] 7.4 Verify SEO output
  - Write a test that fetches `/datasets` and a sample `/datasets/[slug]` page, asserts: JSON-LD script tag present and valid, canonical URL correct, OG tags present, page appears in sitemap.xml output
  - Ref: Phase 7 item 3

- [ ] 7.5 Performance smoke test for hub page with 400+ datasets
  - Write a test or script that loads `/datasets` and measures: time to first meaningful paint, total DOM nodes (should be < 3000 with 50-item pagination), no layout shift on filter changes
  - If pagination is load-more, verify only 50 cards render initially
  - Ref: Phase 7 item 4

---

## Dependency Graph

```
1.1 → 1.2 → 1.3 → 1.4    (schema → indexes → push script → load data)
1.4 → 1.5                  (data in DB → TypeScript types)
1.5 → 2.1                  (types → fetch layer)
2.1 → 2.2, 2.3             (fetch layer → filter bar, card — parallelizable)
2.2 + 2.3 → 2.4            (components → hub page)
2.4 → 2.5 → 2.6            (hub page → URL state → tracking)
2.1 → 2.7                  (fetch layer → unit tests — can run in parallel with 2.4)

1.5 + 2.3 → 3.1            (types + card → routing logic)
3.1 → 3.2 → 3.3, 3.4, 3.5 (routing → detail → sections parallelizable)
3.2 → 3.6, 3.7, 3.8        (detail → SEO tasks parallelizable)

2.3 → 4.1 → 4.2            (card checkboxes → context → bar)
4.2 → 4.3 → 4.4            (bar → compare page → export)

4.4 → 5.1 → 5.2, 5.3       (export gate → modal → wiring + PostHog)

1.3 → 6.1 → 6.2, 6.3       (push script → GH Actions → revalidation + alerts)

2.6 + 3.8 → 7.1, 7.2, 7.3, 7.4, 7.5  (all features → all tests parallelizable)
```

## Parallelization Opportunities

- 2.2 (FilterBar) and 2.3 (OSSDatasetCard) can be built simultaneously
- 3.3 (social signals), 3.4 (related datasets), 3.5 (Claru CTA) can be built in parallel once 3.2 is done
- 3.6 (JSON-LD), 3.7 (OG images), 3.8 (sitemap) can be built in parallel
- Phase 6 (pipeline automation) is independent of Phases 4-5 and can run in parallel
- All Phase 7 tests can be written in parallel

## Risk Areas

- **Full-text search performance**: tsvector + GIN should handle 400 rows easily, but test with real query patterns. If Supabase's `.textSearch()` is too rigid, fall back to `ILIKE` with `%query%` on name + description.
- **Coexistence routing (3.1)**: The 40 static Claru pages and 400+ OSS pages share `/datasets/[slug]`. Slug collision between static and OSS is unlikely (static slugs are like `egocentric-kitchen-video`, OSS slugs include the HF author prefix) but add a collision check in `pipeline_push.py`.
- **ISR revalidation at scale (6.2)**: Revalidating 400+ paths on every pipeline run could hit Vercel rate limits. Batch revalidation or only revalidate changed pages (compare `updated_at` before/after push).
- **Email gate UX**: localStorage-based gating is trivially bypassable. This is intentional — the gate is a soft friction for lead capture, not a security boundary.
- **Comparison table on mobile**: 4-column comparison won't fit on phone screens. Horizontal scroll is the pragmatic solution; consider a "compare 2 at a time" mobile mode as a stretch.

## Existing Code to Reuse

- `src/lib/supabase/client.ts` and `admin.ts` — Supabase client factories
- `src/app/components/providers/PostHogProvider.tsx` — PostHog integration
- `src/app/datasets/page.tsx` — existing hub page structure (breadcrumb, CTA section)
- `src/app/datasets/[slug]/page.tsx` — existing routing + metadata generation pattern
- `src/lib/og.ts` — OG image URL generation
- `src/lib/wave3-jsonld.ts` — JSON-LD builder pattern
- `src/app/sitemap.ts` — sitemap generation pattern
- `src/app/api/contact/route.ts` — leads table insert pattern
- `supabase/migrations/001_data_catalog_schema.sql` — RLS policy + trigger patterns
- `scripts/dataset-pipeline/run_pipeline.sh` — existing pipeline orchestration

## Estimated Effort

| Phase | Scope | Sessions |
|-------|-------|----------|
| 1. Data Layer | Small | 1 |
| 2. Hub Page | Medium | 1-2 |
| 3. Detail Pages | Medium | 1 |
| 4. Comparison | Medium | 1 |
| 5. Email Gate | Small | 0.5 |
| 6. Pipeline Automation | Small | 0.5 |
| 7. Testing | Medium | 1 |
| **Total** | | **6-7 sessions** |
