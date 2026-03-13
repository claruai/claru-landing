# PRD: Personalized Prospect Pages

## Introduction

Custom "deal room" pages at `/for/[company]` that combine hand-crafted prospect-specific narratives with shared dynamic components. Each page is a static Next.js page with custom copy tailored to a specific outbound prospect, importing reusable components that pull live data (case studies, datasets, workforce stats). Pages are noindex/nofollow for privacy and tracked via PostHog.

The first page will be `/for/rime` as the template example.

## Goals

- Create a reusable component library for prospect pages (CaseStudyCard, DatasetShowcase, WorkforceStats, CalendlyEmbed, ChallengesSolutions)
- Build the `/for/rime` page as the first example with custom narrative
- Add `custom_page_slug` field to leads table to track which leads have pages
- Ensure all `/for/*` pages are noindex/nofollow and excluded from sitemap
- Track page views via PostHog with prospect identification
- Match the main landing page's dark terminal/ASCII aesthetic
- Enable rapid creation of new prospect pages by copying the Rime template
- Show "Prepared for [Name]" personalization on each page
- Auto-expire prospect pages after 30 days with a graceful expired state
- Track scroll depth and section visibility in PostHog for engagement analytics

## User Stories

### US-001: Shared Case Study Mapping
**Description:** As a developer, I need a case study metadata mapping so prospect pages can reference case studies by slug and display rich cards without a database table.

**Acceptance Criteria:**
- [ ] Create `src/lib/case-studies.ts` with a `CASE_STUDIES` const object mapping slug → { title, description, tags, url }
- [ ] Include all 11 published case studies from claru.ai/case-studies/
- [ ] Tags should include relevant keywords (e.g., "video", "annotation", "robotics", "safety", "gaming")
- [ ] Export a `getCaseStudy(slug)` helper and `getCaseStudiesByTag(tag)` helper
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-002: CaseStudyCard Component
**Description:** As a prospect viewing the page, I want to see relevant case studies displayed as rich cards so I can quickly understand Claru's relevant experience.

**Acceptance Criteria:**
- [ ] Create `src/app/components/prospect/CaseStudyCard.tsx` (client component)
- [ ] Props: `slug: string` (looks up from case study mapping)
- [ ] Displays: title, description, tags as pills, "Read Case Study →" link to `/case-studies/[slug]`
- [ ] Dark card style matching landing page aesthetic (`#0a0908` bg, `#92B090` accent, border `#2a2a28`)
- [ ] Framer Motion fade-in animation on scroll
- [ ] Responsive: full-width on mobile, side-by-side on desktop
- [ ] Gracefully render "Unavailable" state when `slug` not found in mapping — should NOT throw
- [ ] Case study links open in new tab with `rel="noopener"`
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-003: DatasetShowcase Component
**Description:** As a prospect, I want to see relevant datasets from Claru's catalog so I understand the breadth of available data.

**Acceptance Criteria:**
- [ ] Create `src/app/components/prospect/DatasetShowcase.tsx` (server component)
- [ ] Props: `datasetIds: string[]` (UUIDs from Supabase datasets table)
- [ ] Fetches dataset metadata from Supabase (name, description, total_samples, total_duration_hours, geographic_coverage, category, source_type, modality)
- [ ] Displays as horizontal scrollable cards or grid
- [ ] Each card shows: name, category badge, source_type badge, sample count, duration if applicable
- [ ] Uses anon Supabase client (same pattern as public datasets API — no auth required). Query MUST filter `is_published = true`
- [ ] Handle empty `datasetIds` array — hide section entirely (don't render blank box)
- [ ] If any dataset ID returns null/filtered by RLS, show "Dataset unavailable" pill rather than crashing
- [ ] Show skeleton loader while Supabase query is in flight
- [ ] Dark card style matching landing page
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-004: WorkforceStats Component
**Description:** As a prospect, I want to see Claru's operational scale so I'm confident they can deliver.

**Acceptance Criteria:**
- [ ] Create `src/app/components/prospect/WorkforceStats.tsx` (client component)
- [ ] Displays key stats in a terminal-styled grid: annotator count, countries, total annotations delivered, QA turnaround
- [ ] Stats are hardcoded constants (not from DB) — easy to update in one place
- [ ] Animated counter effect on scroll (reuse pattern from CatalogPreview if applicable)
- [ ] Dark terminal aesthetic with monospace font (JetBrains Mono)
- [ ] Responsive: 2x2 grid on mobile, 4-column on desktop
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-005: CalendlyEmbed Component
**Description:** As a prospect, I want to book a call directly from the page so the CTA has zero friction.

**Acceptance Criteria:**
- [ ] Create `src/app/components/prospect/CalendlyEmbed.tsx` (client component)
- [ ] Fetches `booking_url` from Supabase `settings` table (key = "booking_url")
- [ ] Falls back to CalendlyContext if available, or a hardcoded default
- [ ] If `booking_url` is empty/misconfigured, render fallback CTA button with `mailto:team@claru.ai`
- [ ] Calendly JS script only loads once per page (guard against multiple embeds)
- [ ] Renders inline Calendly widget (not popup) with dark theme
- [ ] Section header: "Book a Call" or similar
- [ ] Responsive: full-width embed
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-006: ChallengesSolutions Component
**Description:** As a prospect, I want to see my specific challenges mapped to Claru's solutions so the relevance is immediately clear.

**Acceptance Criteria:**
- [ ] Create `src/app/components/prospect/ChallengesSolutions.tsx` (client component)
- [ ] Props: `items: Array<{ challenge: string; solution: string; icon?: string }>`
- [ ] Displays as a two-column layout: left = "Your Challenge", right = "How We Help"
- [ ] Each row has a subtle connecting line or arrow between challenge and solution
- [ ] Framer Motion stagger animation on scroll
- [ ] Terminal/ASCII aesthetic — monospace labels, accent-colored solution text
- [ ] Responsive: stacks vertically on mobile
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-007: ProspectPageLayout Component
**Description:** As a developer, I need a shared layout wrapper for all prospect pages to handle consistent structure, meta tags, and tracking.

**Acceptance Criteria:**
- [ ] Create `src/app/for/layout.tsx` as the layout for all `/for/*` routes
- [ ] Sets `<meta name="robots" content="noindex, nofollow">` via Next.js metadata export
- [ ] Does NOT use portal auth middleware — these pages are public (no login required)
- [ ] Includes PostHog page view tracking (see US-009)
- [ ] Applies dark theme matching main landing page (not portal theme)
- [ ] Includes a minimal header with Claru logo (links to claru.ai) — no full nav
- [ ] Includes a minimal footer with legal links
- [ ] Hero area includes "Prepared for [Name]" personalization — uses prospect's first name or company name passed as a prop from each page
- [ ] Subtle watermark or badge: "Shared with [Full Name] · [Company]" in the footer
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-008: Privacy & SEO — noindex, robots.txt
**Description:** As the business owner, I want prospect pages excluded from search engines so they remain private.

**Acceptance Criteria:**
- [ ] `/for/*` layout exports metadata with `robots: { index: false, follow: false }`
- [ ] Add `Disallow: /for/` to `robots.txt` (or create one if not present)
- [ ] Verify `/for/` paths are NOT in any sitemap
- [ ] Confirm no internal links from public pages point to `/for/*` routes
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-009: PostHog Tracking for Prospect Pages
**Description:** As the sales team, I want to know when a prospect views their page, how long they spend, and what they click.

**Acceptance Criteria:**
- [ ] Fire PostHog `prospect_page_viewed` event on page load with properties: `{ company_slug, company_name }`
- [ ] Track `case_study_clicked` event when a case study card is clicked with `{ company_slug, case_study_slug }`
- [ ] Track `calendly_booked` event if Calendly fires a booking callback
- [ ] Track `dataset_card_clicked` if dataset cards are interactive
- [ ] Track `prospect_page_scroll_depth` at 25%, 50%, 75%, 100% thresholds with `{ company_slug, depth_percent }`
- [ ] Track `prospect_section_viewed` when each section enters the viewport via IntersectionObserver with `{ company_slug, section_name }` (e.g., "challenges", "case_studies", "datasets", "workforce", "calendly")
- [ ] Track `prospect_page_time_spent` on page unload/visibility change with `{ company_slug, seconds_spent }`
- [ ] Track `cta_clicked` for Calendly OR mailto with `{ company_slug, cta_type }`
- [ ] Scroll-depth tracking throttled to once per 3s to reduce event volume
- [ ] All PostHog events include `utm_source=prospect_page` property for attribution
- [ ] PostHog logic lives in client components only — server components (DatasetShowcase) must NOT import posthog-js
- [ ] Use existing PostHog integration (posthog-js should already be in the project)
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-010: Page Expiry System (30 days)
**Description:** As the business owner, I want prospect pages to auto-expire after 30 days so stale pages don't linger indefinitely.

**Acceptance Criteria:**
- [ ] Each prospect page defines a `createdAt` date constant (e.g., `const PAGE_CREATED = "2026-03-17"`)
- [ ] Create `src/app/components/prospect/ExpiryGate.tsx` (client component) that wraps page content
- [ ] ExpiryGate compares current date to `createdAt + 30 days`
- [ ] If expired: render a graceful expired state — "This page is no longer available. Please contact us at team@claru.ai for updated information." with Claru branding
- [ ] If not expired: render children normally
- [ ] Show a subtle "This page expires in X days" note in the footer when < 7 days remain
- [ ] Server-side expiry check in layout using ISR (`revalidate: 86400`) as primary gate — client ExpiryGate is fallback for edge runtimes
- [ ] Expired pages still return HTTP 200 but retain `noindex` meta tag
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-011: Supabase Schema — custom_page_slug on leads

**Description:** As a developer, I need to track which leads have custom prospect pages so we can link them and query them.

**Acceptance Criteria:**
- [ ] Add `custom_page_slug` column (text, nullable, unique) to `leads` table via Supabase migration
- [ ] Update `Lead` interface in `src/types/data-catalog.ts` to include `custom_page_slug: string | null`
- [ ] No RLS changes needed — this field is admin-managed
- [ ] Typecheck passes

**Recommended agents/skills:** `python-backend-expert`, `code-reviewer`

---

### US-012: /for/rime — First Prospect Page
**Description:** As Lily at Rime, I want to see a personalized page that shows Claru understands my annotation challenges and has relevant experience.

**Acceptance Criteria:**
- [ ] Create `src/app/for/rime/page.tsx` as a static page with custom copy
- [ ] Hero section: "Prepared for Rime" with Rime's context (TTS/speech AI, multilingual annotation)
- [ ] ChallengesSolutions section mapping Rime's specific challenges:
  - Challenge: "Hiring Language Annotation Experts across 10+ languages individually" → Solution: "Managed annotator workforce with native speakers across Hindi, Japanese, Arabic, Hebrew, and more"
  - Challenge: "Building annotation guidelines per language from scratch" → Solution: "Proven annotation protocols with linguistic QA — speech, phonetic, and prosody labeling"
  - Challenge: "Quality control across diverse language annotators" → Solution: "Same-day QA pipeline with multi-reviewer consensus and structured rubrics"
- [ ] DatasetShowcase with relevant datasets (select IDs for speech/annotation-adjacent datasets)
- [ ] WorkforceStats section
- [ ] 2-3 CaseStudyCards (closest matches — no direct TTS case study, use video quality + content classification as proxies for annotation-at-scale work)
- [ ] CalendlyEmbed at bottom
- [ ] Page matches main landing page dark terminal aesthetic with Framer Motion animations
- [ ] Responsive across desktop, tablet, mobile
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Recommended agents/skills:** `frontend-expert`, `Shadcn UI Designer`, `code-reviewer`

---

### US-013: Playwright E2E Test — Prospect Page Flow
**Description:** As QA, I need an end-to-end test verifying the prospect page renders correctly and tracking fires.

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/prospect-page.spec.ts`
- [ ] Test flow:
  1. Navigate to `/for/rime`
  2. Verify page title contains "Rime"
  3. Verify noindex meta tag is present
  4. Verify ChallengesSolutions section renders 3 items
  5. Verify at least 1 CaseStudyCard renders
  6. Verify WorkforceStats section renders
  7. Verify CalendlyEmbed section renders
  8. Click a case study card and verify navigation
- [ ] Test includes assertions for responsive layout (mobile + desktop viewports)
- [ ] Test runs successfully
- [ ] Typecheck passes

**Recommended agents/skills:** Playwright MCP, `code-reviewer`

---

### US-014: Playwright MCP User Acceptance Testing
**Description:** As QA, I need to perform user acceptance testing via Playwright MCP browser automation against the running dev server.

**Acceptance Criteria:**
- [ ] Start local dev server if not already running
- [ ] Use Playwright MCP to navigate to `/for/rime`
- [ ] Take screenshots at key checkpoints: hero, challenges/solutions, datasets, workforce stats, calendly
- [ ] Verify all sections render correctly with content
- [ ] Test responsive behavior at desktop (1440px) and mobile (375px) viewports
- [ ] Verify case study links work
- [ ] Verify no console errors
- [ ] Document any issues found and fix critical blockers

**Recommended agents/skills:** Playwright MCP (`mcp__playwright`), `code-reviewer`

---

## Story Dependencies

```
US-001 (case study mapping) ← US-002 (CaseStudyCard)
US-007 (layout) ← US-012 (Rime page)
US-001–006 (all components) ← US-012 (Rime page)
US-012 (Rime page) ← US-013, US-014 (tests)
```

**Parallelizable:** US-001 through US-006 can all be built in parallel. US-007–011 can be built in parallel. US-012 blocks on all of them.

## Functional Requirements

- FR-1: Case study metadata stored as hardcoded mapping in `src/lib/case-studies.ts` (11 entries)
- FR-2: All shared prospect components live in `src/app/components/prospect/`
- FR-3: Each prospect page is a separate static file at `src/app/for/[company]/page.tsx`
- FR-4: `/for/*` layout sets noindex/nofollow metadata and excludes from sitemap
- FR-5: PostHog tracks page views and CTA clicks with company_slug property
- FR-6: CalendlyEmbed uses shared `booking_url` from Supabase settings table
- FR-7: DatasetShowcase uses anon Supabase client (same as public API pattern)
- FR-8: `leads` table gets `custom_page_slug` column for tracking which leads have pages
- FR-9: All components use the main landing page dark terminal aesthetic (#0a0908 bg, #92B090 accent, JetBrains Mono)
- FR-10: Middleware must NOT require auth for `/for/*` routes — these are public pages
- FR-11: If any component fetch fails, still render page shell and PostHog tracking — no blank white screens
- FR-12: Set `X-Robots-Tag: noindex, nofollow` response header as backup in case meta tag is stripped
- FR-13: No unpublished dataset IDs should be hardcoded in any prospect page — all dataset queries filter `is_published = true`
- FR-14: No Supabase `service_role` keys in client bundles — verify with `next build`

## Non-Goals

- No auth wall or login required for prospect pages
- No dynamic route with DB-driven content (each page is a hand-crafted static file)
- No case_studies Supabase table (hardcoded mapping for now)
- No A/B testing or variant system
- No automated page generation from Notion/Attio data
- No prospect-specific Calendly links (same booking URL for all)
- No admin UI for creating/managing prospect pages

## Design Considerations

- **Aesthetic:** Match main landing page — dark terminal theme (#0a0908 bg, #92B090 accent, #FFFFFF text)
- **Fonts:** Geist Sans for body, JetBrains Mono for labels/stats/terminal elements
- **Animations:** Framer Motion fade-in, stagger, and counter animations (reuse patterns from landing page)
- **Layout:** Single-column scroll with clear section breaks
- **Section order:** Hero → Challenges/Solutions → Case Studies → Datasets → Workforce Stats → Book a Call
- **Minimal chrome:** Small Claru logo header, no full navigation — keeps focus on content
- **Mobile-first:** All sections stack cleanly on mobile

## Technical Considerations

- `/for/` layout must be excluded from portal middleware auth checks
- DatasetShowcase server component uses `createClient` with anon key (same pattern as `/api/public/datasets/route.ts`) to avoid RLS issues
- PostHog should already be configured — check for existing provider in layout
- Existing `CalendlyContext` from landing page may be reusable but CalendlyEmbed should be self-contained for prospect pages
- The `deck_views` / `deck_share_tokens` tables show a precedent for view tracking — PostHog is simpler for this use case
- **Next.js 16 App Router gotchas:**
  - Server components CANNOT import `posthog-js` or other browser-only libs — PostHog logic must live in client wrappers
  - Framer Motion requires `'use client'` directive — lazy-load animation-heavy parts to keep server bundle clean
  - `createClient()` inside RSC should use a cached instance to avoid new connections per request
  - `/for/` layout must NOT export `generateStaticParams` that could leak lead slugs at build time — pages are added manually as static files

## Success Metrics

- Prospect pages load in < 2 seconds
- PostHog captures page view events with correct company_slug
- At least 30% of email recipients visit their prospect page (tracked via PostHog)
- Calendly bookings from prospect pages trackable as source
- New prospect pages can be created in < 30 minutes by copying Rime template

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** - Test core logic, validation, and edge cases
2. **Code Review** - Run code-reviewer agent after EACH story completion to verify correctness, security, and patterns
3. **Type Safety** - All code must pass TypeScript strict mode

### Execution Guidelines
- **Parallelize work**: US-001 through US-006 (components) can all be built in parallel
- **Code review every story**: After each user story is implemented, invoke the code-reviewer agent before marking it complete
- **Playwright MCP UAT**: The final story uses Playwright MCP for live browser-based user acceptance testing

## Open Questions

- ~~Should we add a "Shared with [Name]" watermark or identifier on the page to personalize further?~~ **Yes — added to US-007**
- ~~Should prospect pages have an expiry date?~~ **Yes — 30 day expiry, added as US-010**
- ~~Do we want to track scroll depth in PostHog?~~ **Yes — scroll depth + section visibility + time spent, added to US-009**
- Should expired pages offer a "Request updated page" CTA or just contact email?
- Do we want Slack notifications when a prospect visits their page (via PostHog webhook)?
