# PRD: Public Dataset Browser Grid

## Introduction

Add a public-facing dataset browser grid to the existing `/data-catalog` marketing page. Pulls published datasets from Supabase and displays them in a filterable, non-interactive grid — giving prospects a "look how much we have" credibility signal without exposing sample data, annotations, or S3 links. Inspired by kled.ai/datasets but richer, using our existing dark/terminal aesthetic.

## Goals

- Show the breadth and scale of Claru's dataset catalog to unauthenticated visitors
- Drive "Request Access" conversions via per-card Calendly CTAs
- Pull live data from Supabase (`is_published = true` only) with CDN caching (`s-maxage` + `stale-while-revalidate`)
- Provide category filtering so prospects can find relevant datasets quickly
- Scale gracefully as the catalog grows beyond 15 datasets (lazy loading at 12)

## User Stories

### US-001: API Route for Public Datasets
**Description:** As the data-catalog page, I need a public API endpoint that returns published datasets with their categories so the grid can be populated.

**Acceptance Criteria:**
- [ ] Create `src/app/api/public/datasets/route.ts` with GET handler
- [ ] Query `datasets` table joined with `dataset_categories` where `is_published = true`
- [ ] Define a `PublicDataset` TypeScript type in `src/types/data-catalog.ts` with only the public fields (not reusing internal `Dataset` type, which has nullable mismatches)
- [ ] Return fields: `id` (opaque UUID, needed as React key), `name`, `slug`, `description`, `type`, `subcategory`, `total_samples`, `total_duration_hours`, `geographic_coverage`, `annotation_types` (high-level labels only, e.g. "RLHF", "Classification"), `category` (object with `name`, `slug`, `display_order`)
- [ ] Do NOT return: `thumbnail_url`, `show_enrichment`, `tags`, `category_id`, or any fields that could expose internal structure
- [ ] Use `createSupabaseServerClient()` from `src/lib/supabase/server.ts` (existing helper). The API route runs server-side so this is appropriate.
- [ ] RLS must allow anon `SELECT` on `datasets` where `is_published = true`. If RLS blocks this, fix the RLS policy — do NOT fall back to service role key for a public endpoint.
- [ ] Sort by category `display_order` ASC, then `name` ASC
- [ ] Set `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600` header for CDN caching (matches existing pattern in `src/app/api/booking-url/route.ts`)
- [ ] Return empty array (not error) if no published datasets exist
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test query filtering (only published), sort order, field selection (no leaked fields), empty state
- [ ] **Code Review:** Run code-reviewer agent to verify no data leakage, proper error handling

**Recommended agents/skills:** `nextjs-expert`, `code-reviewer`

---

### US-002: Dataset Browser Client Component
**Description:** As a visitor, I want to see a grid of dataset cards so I can understand the breadth of Claru's data catalog.

**Acceptance Criteria:**
- [ ] Create `src/app/components/catalog/PublicDatasetBrowser.tsx` (client component)
- [ ] Fetches from `/api/public/datasets` on mount
- [ ] Displays responsive grid: 1 col on mobile, 2 col on tablet (md), 3 col on desktop (lg)
- [ ] Shows loading skeleton state while fetching (grid of placeholder cards matching card dimensions)
- [ ] Shows empty state message if no datasets returned
- [ ] Shows error state with retry button if API fetch fails (network error, 500, etc.)
- [ ] Each card renders via a `PublicDatasetCard` sub-component (see US-003)
- [ ] Uses Framer Motion stagger animation on cards (consistent with existing page sections)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test loading state rendering, empty state, error state with retry, grid layout class application, data mapping to cards
- [ ] **Code Review:** Run code-reviewer agent to verify component patterns match existing codebase

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-003: Dataset Card Component
**Description:** As a visitor, I want each dataset card to show me the dataset's name, category, description, and key stats so I can evaluate relevance at a glance.

**Acceptance Criteria:**
- [ ] Create `src/app/components/catalog/PublicDatasetCard.tsx`
- [ ] Card uses existing design system: `bg-[var(--bg-card)]`, `border-[var(--border-subtle)]`, rounded-xl
- [ ] Card layout (top to bottom):
  1. Category label — mono font, small, `text-[var(--accent-primary)]`
  2. Dataset name — bold, white
  3. Description — `text-[var(--text-secondary)]`, 2-line clamp (`line-clamp-2`)
  4. Stat line — mono font, small, `text-[var(--text-tertiary)]`, adaptive:
     - Always show formatted sample count (e.g. "386K samples")
     - Show `· X hrs` only if `total_duration_hours > 0`
     - Show `· {geographic_coverage}` raw text only if present (do NOT parse — field is free text)
  5. "Request Access →" button — bottom of card, subtle, mono font, `text-[var(--accent-primary)]`, small
- [ ] Card has hover state: `hover:border-[var(--accent-primary)]/30`, subtle translate-y
- [ ] "Request Access" is a `<button>` element (not `<a>`) that calls `useCalendly().openCalendly()` from the global Calendly provider (already in `src/app/layout.tsx`). No navigation — opens modal overlay.
- [ ] Card is NOT clickable as a whole — only the "Request Access" button is interactive
- [ ] **Mobile:** Card padding reduced to `p-4` on mobile (`p-6` on md+). Font sizes scale down appropriately. Stat line wraps gracefully.
- [ ] **Touch:** Hover state also activatable via `:active` for touch devices
- [ ] Typecheck passes
- [ ] Verify in browser at desktop (1440px), tablet (768px), and mobile (375px) viewports
- [ ] **Unit Tests:** Test stat line adaptive rendering (with/without duration, with/without geo), number formatting (K/M suffixes), hover class application
- [ ] **Code Review:** Run code-reviewer agent to verify accessibility, design system consistency

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-004: Category Filter Pills
**Description:** As a visitor, I want to filter datasets by category so I can quickly find datasets relevant to my use case.

**Acceptance Criteria:**
- [ ] Horizontal row of filter pills above the grid in `PublicDatasetBrowser`
- [ ] Pills: "All" (default selected) + one pill per category present in the fetched data, sorted by `display_order`
- [ ] Selected pill styled with `bg-[var(--accent-primary)]/10`, `border-[var(--accent-primary)]/40`, `text-[var(--accent-primary)]`
- [ ] Unselected pills: `border-[var(--border-subtle)]`, `text-[var(--text-secondary)]`, hover state
- [ ] Clicking a pill filters the grid client-side (no API call)
- [ ] Filter is instant — no loading state needed
- [ ] If a category has 0 published datasets, its pill should NOT appear
- [ ] **Mobile:** Pills row is horizontally scrollable (`overflow-x-auto`, `-webkit-overflow-scrolling: touch`, `scrollbar-hide`). No wrapping — single row that scrolls.
- [ ] **Mobile:** Pills have `flex-shrink-0` to prevent text truncation while scrolling
- [ ] **Mobile:** Fade gradient on right edge to indicate scrollability (CSS mask or pseudo-element)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test filter logic (all vs. specific category), pill generation from data, selected state toggling, empty category exclusion
- [ ] **Code Review:** Run code-reviewer agent to verify UX patterns

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-005: Lazy Loading / Infinite Scroll
**Description:** As a visitor browsing a growing catalog, I want more datasets to load automatically as I scroll so I don't hit a wall.

**Acceptance Criteria:**
- [ ] Show first 12 datasets initially
- [ ] When user scrolls near the bottom of the grid (IntersectionObserver on a sentinel element), reveal next batch of 12
- [ ] Batch reveal is instant (all data is already fetched — this is client-side pagination, not API pagination)
- [ ] Show a subtle "Showing X of Y datasets" counter below the grid in mono font
- [ ] If total datasets <= 12, no sentinel, no counter
- [ ] Smooth fade-in animation on newly revealed cards (Framer Motion)
- [ ] Interacts correctly with category filter — filtering resets to first 12 of filtered set
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test batch slicing logic, sentinel visibility conditions, filter reset behavior, counter text
- [ ] **Code Review:** Run code-reviewer agent to verify IntersectionObserver cleanup, performance

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-006: Integrate into /data-catalog Page
**Description:** As a visitor, I want to see the dataset browser grid as a natural section within the existing data-catalog page, placed between the video mosaic and capabilities sections.

**Acceptance Criteria:**
- [ ] Import `PublicDatasetBrowser` into `src/app/data-catalog/page.tsx`
- [ ] Place between section 3 (Video Mosaic) and section 4 (Capabilities)
- [ ] Wrap in a new section with consistent spacing (`py-16 md:py-24`)
- [ ] Section header with mono label (`// EXPLORE OUR DATASETS` or similar) and heading
- [ ] Wrapped in `FadeIn` component for scroll-triggered entrance, consistent with adjacent sections
- [ ] Page still loads and hydrates correctly (no SSR mismatch)
- [ ] No layout shift when dataset grid loads (skeleton matches final dimensions)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** N/A (integration — covered by E2E)
- [ ] **Code Review:** Run code-reviewer agent to verify page structure, hydration safety

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-007: Playwright E2E Test - Public Dataset Browser
**Description:** As QA, I need an end-to-end test verifying the dataset browser grid renders, filters, and lazy-loads correctly.

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/public-dataset-browser.spec.ts`
- [ ] Test flow:
  1. Navigate to `/data-catalog`
  2. Scroll to dataset browser section
  3. Verify dataset cards are visible with expected content (name, description, stat line)
  4. Click a category filter pill — verify grid updates to show only matching datasets
  5. Click "All" pill — verify all datasets return
  6. If > 12 datasets: scroll to bottom, verify more cards appear
  7. Verify "Request Access" link is present on each card
- [ ] Test includes assertions for loading skeleton appearing before data loads
- [ ] Test uses Page Object Model pattern for maintainability
- [ ] Test runs successfully in CI environment
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-008: Playwright MCP User Acceptance Testing
**Description:** As QA, I need to perform user acceptance testing via Playwright MCP browser automation against the running dev server to verify the complete feature works end-to-end.

**Acceptance Criteria:**
- [ ] Ensure at least 3 datasets have `is_published = true` across at least 2 different categories in Supabase (seed if needed)
- [ ] Start local dev server if not already running
- [ ] Use Playwright MCP to navigate to `/data-catalog`
- [ ] Scroll to the dataset browser section and take screenshot
- [ ] Verify cards render with correct data from Supabase
- [ ] Test category filter — click each category pill, verify correct filtering, take screenshots
- [ ] Verify "Request Access" opens Calendly modal/page
- [ ] Test responsive behavior at three viewports:
  - Desktop (1440px): 3-col grid, filter pills inline
  - Tablet (768px): 2-col grid, filter pills may scroll
  - Mobile (375px): 1-col grid, filter pills horizontally scrollable, cards full-width
- [ ] Take screenshots at each viewport for visual verification
- [ ] Verify no layout shift, no hydration errors in console
- [ ] Verify touch interactions work (filter pill tap, Request Access tap)
- [ ] Document any issues found and fix critical blockers

**Recommended agents/skills:** Playwright MCP (`mcp__playwright`), `code-reviewer`

---

## Functional Requirements

- FR-1: Public API endpoint returns only `is_published = true` datasets with category data
- FR-2: No sample data, S3 keys, or internal structure exposed in public API. `id` (opaque UUID) and `annotation_types` (high-level labels) are allowed.
- FR-3: Dataset cards display name, category, description (2-line clamp), and adaptive stat line
- FR-4: Stat line shows sample count always; duration and geographic coverage only when available
- FR-5: Large numbers formatted with K/M suffixes (e.g. 386,343 → "386K", 1,071,463 → "1.1M")
- FR-6: Category filter pills derived from fetched data, sorted by display_order
- FR-7: Filtering is client-side and instant
- FR-8: First 12 datasets shown; additional batches revealed on scroll via IntersectionObserver
- FR-9: "Request Access" per card opens Calendly booking flow
- FR-10: CDN caching via `s-maxage=3600, stale-while-revalidate=600` on the API route
- FR-11: Section integrates seamlessly into existing `/data-catalog` page flow and design system
- FR-12: Fully responsive — 1 col mobile (375px+), 2 col tablet (768px+), 3 col desktop (1024px+)
- FR-13: Error state with retry button on API failure
- FR-14: Touch-friendly — tap targets ≥ 44px, filter pills scrollable on mobile

## Non-Goals

- No click-through to dataset detail pages from the public grid
- No sample previews, thumbnails, or media in the public view
- No search/text filtering (category pills are sufficient for now)
- No server-side pagination (all published datasets fetched in one call)
- No dataset-specific context passed to Calendly (just opens the standard booking flow)
- No tag pills on cards (removed from scope)

## Design Considerations

- Reuse existing design tokens: `--bg-card`, `--border-subtle`, `--accent-primary`, `--text-secondary`, `--text-tertiary`
- Cards match the aesthetic of the "Two Paths" cards already on the page (rounded-xl, border, hover effect)
- Mono font (`font-mono`) for category labels, stat lines, and "Request Access" — consistent with terminal aesthetic
- Filter pills styled like the existing capability tag pills in the Capabilities section
- Skeleton loading cards should match final card height to prevent layout shift
- Stagger animation timing should match existing sections (0.03-0.05s delay per card)

## Technical Considerations

- The `/data-catalog` page is currently fully client-rendered (`"use client"` with mounted guard). The new component fits this pattern — fetch on client mount.
- **Supabase client:** API route uses `createSupabaseServerClient()` from `src/lib/supabase/server.ts`. Browser components use `createSupabaseBrowserClient()` from `src/lib/supabase/client.ts` if needed. Do NOT create new client instances.
- **RLS requirement:** Must have a policy allowing anon `SELECT` on `datasets` where `is_published = true`. If missing, create an RLS policy — do NOT use service role key for public endpoints.
- **Calendly integration:** Global provider already in `src/app/layout.tsx`. Use `useCalendly().openCalendly()` hook for the card CTA button. Do NOT use the `Button` component — the CTA is a subtle text button, not a full button variant.
- **Type safety:** Define a `PublicDataset` type separate from internal `Dataset` type. The internal type has nullable mismatches (`description`, `geographic_coverage`, etc. are nullable in DB but typed as required strings).
- IntersectionObserver for lazy loading must be cleaned up on unmount (`disconnect()` in cleanup function).
- **Mobile-first:** All components must be designed mobile-first. Test at 375px, 768px, and 1440px viewports.
- **Vitest prerequisite:** This project does not currently have a unit test stack. If unit tests are implemented, Vitest + React Testing Library must be configured first. Alternatively, unit test acceptance criteria can be deferred in favor of comprehensive Playwright E2E coverage.

## Success Metrics

- Visitors can see the full published catalog within 2 seconds of scrolling to the section
- Category filtering feels instant (< 100ms)
- "Request Access" click-through rate measurable via Calendly analytics
- No increase in page load time for `/data-catalog` (ISR cached, client-side fetch doesn't block render)

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** - Test core logic, validation, and edge cases
2. **Code Review** - Run code-reviewer agent after EACH story completion to verify correctness, security, and patterns
3. **Type Safety** - All code must pass TypeScript strict mode

### Execution Guidelines
- **Parallelize work**: US-001 (API) and US-003 (card component) can be built in parallel. US-002 depends on both. US-004 and US-005 can be built in parallel after US-002.
- **Code review every story**: After each user story is implemented, invoke the code-reviewer agent before marking it complete
- **Playwright MCP UAT**: US-008 is the final story for live browser-based verification

End-to-end tests (Playwright spec files) are defined in US-007. Playwright MCP UAT is the final story for live verification.

## Agent & Skill Routing Summary

| Story | Primary Agent | Supporting |
|-------|--------------|------------|
| US-001 | `nextjs-expert` | `code-reviewer` |
| US-002 | `frontend-expert` | `code-reviewer` |
| US-003 | `frontend-expert` | `code-reviewer` |
| US-004 | `frontend-expert` | `code-reviewer` |
| US-005 | `frontend-expert` | `code-reviewer` |
| US-006 | `frontend-expert` | `code-reviewer` |
| US-007 | `frontend-expert` | `code-reviewer` |
| US-008 | Playwright MCP | `code-reviewer` |

## Open Questions

- Are all 15 current datasets intended to be published, or should some remain internal-only? (Check `is_published` flags)
- Should the section heading say "Explore Our Datasets" or something more on-brand like "What's in the vault"?
- Future consideration: should we add dataset count badges to category filter pills (e.g. "Video Evaluation (5)")?
