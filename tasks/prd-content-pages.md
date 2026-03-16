# PRD: Claru SEO Content Pages (`/solutions/[slug]`)

## Introduction

Build 11 data-driven content pages at `/solutions/[slug]` targeting low-competition, high-value buyer-intent keywords in the AI training data space. These are **problem-first** pages (addressing what the buyer needs) rather than **service-first** (what Claru offers), differentiating them from existing `/pillars/*` capability pages.

Each page pulls real data from Supabase datasets + case study JSONs, cites 5-8 research papers, and goes through a multi-agent copy QA review loop. Pages use a shared dynamic route with `generateStaticParams` for SSG + ISR (1-hour revalidation).

**Reference Implementation:** `tasks/docs/content-pages-design.md` — route architecture, component hierarchy, data flow, QA loop design.

---

## Goals

- Capture buyer-intent search traffic ("I need egocentric video data for my robot") that pillar pages do not target
- Build topical authority through research citations and real project metrics from case studies
- Create an internal linking hub between content pages, pillar pages, case studies, and data catalog
- Generate qualified leads through embedded CTAs backed by proof of delivery
- Each page has 2,000+ words of substantive, research-backed content
- All factual claims backed by inline citations with clickable source links
- Copy sounds like a technical writer who has read the papers, not AI-generated marketing fluff
- Every page passes SEO validation: unique H1, question-form H2s, answer-first paragraphs, FAQPage JSON-LD, BreadcrumbList JSON-LD, Service JSON-LD, canonical URL, OG image

---

## User Stories

### US-001: Create Shared ContentPageData Type System and Data Loading Utilities

**Description:** As a developer, I need the type system, page registry, and server-side data loading utilities so all subsequent page data files and components have a typed foundation.

**Reference docs:**
- Design: `tasks/docs/content-pages-design.md` (sections: Data Models, ContentPageData, Page Registry, Case Study JSON Schema)

**Acceptance Criteria:**
- [ ] Create `src/data/content-pages/types.ts` with `ContentPageData` interface matching the design doc specification (slug, title, metaTitle, metaDescription, primaryKeyword, secondaryKeywords, breadcrumbLabel, ogCategory, heroSubtitle, problem, landscape, solution, datasetIds, faqs, citations, pillarLinks, relatedSlugs)
- [ ] Create `src/data/content-pages/index.ts` that uses **glob-based loading** (reads all `*.ts` files in the directory via a registry pattern) — each page is its own file, no shared index that multiple stories edit concurrently. Functions: `getContentPage(slug)`, `getAllContentPageSlugs()`, `getAllContentPages()`
- [ ] The registry pattern MUST avoid merge conflicts: each page file (e.g., `egocentric-video-data.ts`) self-registers by exporting a named `ContentPageData` object. The index file discovers pages by importing all files in the directory — NOT by maintaining a manual map that parallel agents would conflict on
- [ ] Create `src/lib/case-studies-server.ts` with `getCaseStudyData(slug)` function that reads from `src/data/case-studies/{slug}.json` via `fs.readFileSync` at build time
- [ ] `CaseStudyData` interface includes: slug, title, teaser, headlineStat, headlineStatLabel, results array, approach, processSteps
- [ ] Export `ResearchCitation` interface from types: id, title, authors, venue, year, url, keyClaim, optional doi
- [ ] `relatedSlugs` is REQUIRED in ContentPageData (not optional) — enforces lateral linking
- [ ] Add `buildCitationMap(citations)` utility that generates `[1]`-style inline reference IDs
- [ ] All types are strict — no `any` types
- [ ] Build-time validation: missing case study JSONs = ERROR (CI fails), FAQ count outside 3-5 = WARNING
- [ ] Typecheck passes (`npm run build && npx tsc --noEmit` exit 0)

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-002: Create `/solutions` Layout with JSON-LD, OG Images, Canonical URLs, Breadcrumbs

**Description:** As a developer, I need the shared layout that injects structured data (BreadcrumbList, Service, FAQPage JSON-LD), OG image metadata, and canonical URLs for all content pages.

**Reference docs:**
- Design: `tasks/docs/content-pages-design.md` (sections: SEO and Structured Data, Metadata Generation, JSON-LD Schemas)

**Acceptance Criteria:**
- [ ] Create `src/app/solutions/layout.tsx` as a server component
- [ ] Layout receives page data and injects JSON-LD as a single `@graph` array containing: BreadcrumbList (Home > Solutions > {Page Title}), Service (linked to Organization via `@id` reference to `https://claru.ai/#organization`), FAQPage (from page's `faqs` array)
- [ ] JSON-LD uses canonical base URL `https://claru.ai`
- [ ] Single `<script type="application/ld+json">` tag with `@graph` array — no duplicate roots
- [ ] Service schema includes `dateModified` with build date
- [ ] FAQ answers are plain strings (not JSX) for clean JSON-LD serialization
- [ ] OG image URL generated via `ogImageUrl(title, { category: "solution" })` from `src/lib/og.ts`
- [ ] Add `"solution"` to `VALID_CATEGORIES` in `src/app/api/og/route.tsx` with config: `{ badge: "SOLUTION", borderColor: "#92B090", titlePrefix: "" }`
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-003: Create Shared Page Template Components

**Description:** As a developer, I need the reusable section components that compose each content page: ContentPageTemplate, ContentHero, ProblemSection, DatasetComparison, InlineCaseStudy, ResearchCitations, ContentFAQ, CitationLink.

**Reference docs:**
- Design: `tasks/docs/content-pages-design.md` (sections: Components and Interfaces, Component Hierarchy)

**Acceptance Criteria:**
- [ ] Create `src/app/components/content/ContentPageTemplate.tsx` (server component) — single prop: `page: ContentPageData`. Composes all sections in order: ContentHero → ProblemSection → DatasetComparison → InlineCaseStudy (for each caseStudySlug) → DatasetShowcase → WorkforceStats → ContentFAQ → FinalCTA → ResearchCitations → RelatedSolutions. Reads case study JSONs via `getCaseStudyData()`, passes `page.datasetIds` to existing `DatasetShowcase`
- [ ] **Explicit prop contract:** `ContentPageTemplate` accepts `{ page: ContentPageData }` — no other props. All section components receive slices of `ContentPageData` (e.g., `ProblemSection` gets `page.problem`, `DatasetComparison` gets `page.landscape`)
- [ ] **Prerequisite components that MUST already exist** (from other PRDs/branches): `DatasetShowcase` (src/app/components/prospect/), `WorkforceStats` (src/app/components/prospect/), `FinalCTA` (src/app/components/sections/). If any are missing, this story CANNOT proceed — check at start
- [ ] Create `src/app/components/content/ContentHero.tsx` (server component) — breadcrumb `<nav>` with `<ol>`, H1, subtitle paragraph, CTA button
- [ ] Create `src/app/components/content/ProblemSection.tsx` (server component) — question-form H2, answer-first paragraphs, inline citations via CitationLink, optional callout box
- [ ] Create `src/app/components/content/DatasetComparison.tsx` (server component) — responsive table on desktop, stacked cards on mobile; `#121210` card bg, `#92B090` accent for Claru rows
- [ ] Create `src/app/components/content/InlineCaseStudy.tsx` (server component) — reads case study JSON via `getCaseStudyData()`, renders H3 title, 2-4 highlighted metric cards, methodology excerpt, link to full case study
- [ ] Create `src/app/components/content/ResearchCitations.tsx` (server component) — numbered reference list with external links (`rel="noopener noreferrer"`), uses `buildCitationMap` for `[1]`-style IDs
- [ ] Create `src/app/components/content/RelatedSolutions.tsx` (server component) — renders lateral links to other content pages from `relatedSlugs`, uses page registry for titles
- [ ] Create `src/app/components/content/ContentFAQ.tsx` (client component, `'use client'`) — expandable accordion with toggle state, keyboard accessible
- [ ] Create `src/app/components/content/CitationLink.tsx` (server component) — simple anchor tag for inline citations in server components (no Lucide icon dependency)
- [ ] All components follow design system: `#0a0908` bg, `#92B090` accent, `#FFFFFF` text, Geist Sans + JetBrains Mono
- [ ] Reuses existing components: `DatasetShowcase`, `WorkforceStats`, `FinalCTA`, `Button`
- [ ] `InlineCaseStudy` returns `null` with `console.warn` if case study JSON is missing (no crash)
- [ ] `DatasetComparison` handles empty `datasets` array gracefully
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-004: Create Dynamic `[slug]/page.tsx` Route with `generateStaticParams`

**Description:** As a developer, I need the dynamic route that maps slugs to page data and renders the ContentPageTemplate, with build-time validation of data integrity.

**Reference docs:**
- Design: `tasks/docs/content-pages-design.md` (sections: Route Structure, Rendering Strategy, Data Validation)

**Acceptance Criteria:**
- [ ] Create `src/app/solutions/[slug]/page.tsx` as a server component
- [ ] `generateStaticParams()` returns all slugs from `getAllContentPageSlugs()`
- [ ] `generateMetadata()` returns title, description, keywords, canonical URL, OG image from page data
- [ ] `revalidate = 3600` for 1-hour ISR
- [ ] Unknown slugs call `notFound()` (returns 404)
- [ ] Build-time validation in `generateStaticParams`: warns if case study slugs don't exist on disk, warns if FAQ count is outside 3-5 range, skips validation for empty `datasetIds` arrays (some pages legitimately have no datasets)
- [ ] Page renders `ContentPageTemplate` with the resolved `ContentPageData`
- [ ] Build succeeds with zero pages (empty registry) and with test data
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-005: Tier 1 Data Files — Egocentric Video Data + VLA Training Data

**Description:** As a content creator, I need the first two pillar-tier page data files with research-backed copy, citations, dataset comparisons, FAQs, and case study mappings.

**Reference docs:**
- Design: `tasks/docs/content-pages-design.md` (sections: Page-to-Data Mapping)
- Case studies: `src/data/case-studies/egocentric-video-collection.json`, `workplace-egocentric-data.json`, `game-based-data-capture.json`

**Page 1: `src/data/content-pages/egocentric-video-data.ts`**
- Slug: `egocentric-video-data`
- Title: "Custom Egocentric Video Data Collection for Embodied AI"
- Primary keyword: "egocentric video data"
- Case studies: `egocentric-video-collection`, `workplace-egocentric-data`
- Citations (5-8): EgoDex (Apple), EgoScale (NVIDIA), Ego4D (Meta/CVPR 2022), DROID (arXiv 2024), Open X-Embodiment (arXiv 2024)
- Landscape comparison: Ego4D vs EgoScale vs EPIC-KITCHENS vs Claru custom
- 3-5 FAQs targeting long-tail keywords
- Pillar links: `/pillars/acquire/egocentric-video`

**Page 2: `src/data/content-pages/vla-training-data.ts`**
- Slug: `vla-training-data`
- Title: "VLA Training Data: From Collection to Policy"
- Primary keyword: "VLA training data"
- Case studies: `egocentric-video-collection`, `workplace-egocentric-data`, `game-based-data-capture`
- Citations (5-8): pi-0 (Physical Intelligence), GR00T N1.5 (NVIDIA), OpenVLA (arXiv 2024), RT-2 (Google DeepMind), Octo (arXiv 2024)
- Landscape comparison: Open X-Embodiment vs DROID vs AgiBot World vs Claru custom
- 3-5 FAQs targeting long-tail keywords
- Pillar links: `/pillars/acquire/egocentric-video`, `/pillars/acquire/synthetic-data`

**Acceptance Criteria:**
- [ ] Both data files export typed `ContentPageData` objects that pass typecheck
- [ ] Every citation has a real URL, correct arxiv ID where applicable, and a `keyClaim` that matches the source paper
- [ ] Dataset comparison tables have accurate scale numbers from the source papers
- [ ] FAQ answers are self-contained and answer-first (first sentence directly answers the question)
- [ ] Meta titles are 50-60 characters, meta descriptions are 150-160 characters
- [ ] H2 headings are question-form (contain "?" or start with What/Why/How)
- [ ] **AEO:** First paragraph under each H2 is a self-contained 40-80 word answer extractable by AI Overviews — no dangling references
- [ ] **GEO:** At least 1 proprietary Claru data point per section (case study metric or methodology name) — gives LLMs a reason to cite Claru
- [ ] **GEO:** "Claru" appears by name at least 3 times in body copy (not just "we/our") — entity name recognition for knowledge graph
- [ ] **GEO:** Each semantic section is independently comprehensible out of context
- [ ] **GEO:** Comparison tables include "Claru" as a named row alongside open datasets
- [ ] All case study slugs reference existing JSONs in `src/data/case-studies/`
- [ ] Pages render locally (`npm run build` succeeds, no errors)
- [ ] **Content QA agent review:** Verify citation URLs are real, claimed numbers match sources, copy doesn't read like AI slop, FAQ answers are answer-first, keyword targeting in H1/H2s/meta description, no generic marketing fluff
- [ ] **Code review agent:** Verify TypeScript types, data integrity, no runtime errors

**Recommended agents/skills:** `web-research-specialist` (citation verification), `frontend-expert`, `code-reviewer`

---

### US-006: Tier 1 Data Files — Red Teaming Data + Video Generation Training Data

**Description:** As a content creator, I need the remaining two pillar-tier page data files.

**Reference docs:**
- Case studies: `src/data/case-studies/red-teaming-moderation.json`, `generative-ai-safety.json`, `video-model-evaluation.json`, `video-quality-at-scale.json`, `video-content-classification.json`

**Page 3: `src/data/content-pages/red-teaming-data.ts`**
- Slug: `red-teaming-data`
- Title: "Human Red Teaming Data for AI Safety and EU AI Act Compliance"
- Primary keyword: "red teaming AI models"
- Case studies: `red-teaming-moderation`, `generative-ai-safety`
- Citations: EU AI Act Articles 55/99, Anthropic Constitutional Classifiers (arXiv 2025), OpenAI red teaming paper, NIST AI Risk Management Framework
- Landscape comparison: Automated red teaming tools vs crowdsourced vs expert human red teaming vs Claru
- 3-5 FAQs (include EU AI Act compliance questions)
- Pillar links: `/pillars/validate/red-teaming`

**Page 4: `src/data/content-pages/video-generation-training-data.ts`**
- Slug: `video-generation-training-data`
- Title: "Expert Preference Data for Video Generation Models"
- Primary keyword: "video generation training data"
- Case studies: `video-model-evaluation`, `video-quality-at-scale`, `video-content-classification`
- Citations: VideoReward (arXiv 2501.13918), VidGen-1M, Flow-DPO
- Landscape comparison: GenAI-Bench vs VidProM vs VidGen-1M vs Claru expert annotation
- 3-5 FAQs targeting video generation model training
- Pillar links: `/pillars/enrich/video-annotation`

**Acceptance Criteria:**
- [ ] Same quality criteria as US-005 (typed exports, real citation URLs, accurate comparison tables, answer-first FAQs, SEO-optimized meta tags, question-form H2s)
- [ ] Red teaming page accurately represents EU AI Act requirements (Articles 55 and 99, enforcement dates)
- [ ] Video generation page cites correct arXiv IDs and paper claims
- [ ] Pages render locally (`npm run build` succeeds)
- [ ] **Content QA agent review** (same criteria as US-005)
- [ ] **Code review agent**

**Recommended agents/skills:** `web-research-specialist`, `frontend-expert`, `code-reviewer`

---

### US-007: Tier 2 Data Files — Manipulation Trajectory Data + Expert RLHF Annotation

**Description:** As a content creator, I need two cluster-tier page data files that link up to their parent pillar pages.

**Reference docs:**
- Case studies: `src/data/case-studies/egocentric-video-collection.json`, `game-based-data-capture.json`, `prompt-enhancement-benchmark.json`, `video-quality-at-scale.json`

**Page 5: `src/data/content-pages/manipulation-trajectory-data.ts`**
- Slug: `manipulation-trajectory-data`
- Title: "Custom Manipulation Trajectory Data Collection"
- Primary keyword: "manipulation trajectory data"
- Case studies: `egocentric-video-collection`, `game-based-data-capture`
- Citations: AgiBot World, DROID, Open X-Embodiment, GEN-0
- Pillar links: `/pillars/acquire/egocentric-video`

**Page 6: `src/data/content-pages/expert-rlhf-annotation.ts`**
- Slug: `expert-rlhf-annotation`
- Title: "Expert RLHF Annotation for Code and Specialized Domains"
- Primary keyword: "expert RLHF annotation"
- Case studies: `prompt-enhancement-benchmark`, `video-quality-at-scale`
- Citations: MM-RLHF, RLTHF (arXiv 2502.13417), cost analysis ($60K/600 annotations reference)
- Pillar links: `/pillars/enrich/rlhf`

**Acceptance Criteria:**
- [ ] Same quality criteria as US-005
- [ ] Expert RLHF page includes concrete cost comparison data (crowdsourced vs expert)
- [ ] Manipulation trajectory page accurately describes action space representations from cited papers
- [ ] Pages render locally
- [ ] **Content QA agent review**
- [ ] **Code review agent**

**Recommended agents/skills:** `web-research-specialist`, `frontend-expert`, `code-reviewer`

---

### US-008: Tier 2 Data Files — Sim-to-Real Data + Teleoperation Data

**Description:** As a content creator, I need two cluster-tier page data files for robotics-adjacent topics.

**Reference docs:**
- Case studies: `src/data/case-studies/game-based-data-capture.json`, `egocentric-video-collection.json`, `workplace-egocentric-data.json`

**Page 7: `src/data/content-pages/sim-to-real-data.ts`**
- Slug: `sim-to-real-data`
- Title: "Closing the Sim-to-Real Gap with Real-World Data Collection"
- Primary keyword: "sim-to-real transfer data"
- Case studies: `game-based-data-capture`, `egocentric-video-collection`
- Citations: ABB/NVIDIA HyperReality, Sim2Real-VLA (ICLR 2026)
- Pillar links: `/pillars/acquire/synthetic-data`

**Page 8: `src/data/content-pages/teleoperation-data.ts`**
- Slug: `teleoperation-data`
- Title: "Teleoperation Dataset Collection for Robot Learning"
- Primary keyword: "teleoperation data"
- Case studies: `egocentric-video-collection`, `workplace-egocentric-data`
- Citations: HumanPlus, ACE, Open-TeleVision
- Pillar links: `/pillars/acquire/egocentric-video`

**Acceptance Criteria:**
- [ ] Same quality criteria as US-005
- [ ] Sim-to-real page explains the domain gap problem with specific examples from cited research
- [ ] Teleoperation page covers hardware/interface considerations from cited papers
- [ ] Pages render locally
- [ ] **Content QA agent review**
- [ ] **Code review agent**

**Recommended agents/skills:** `web-research-specialist`, `frontend-expert`, `code-reviewer`

---

### US-009: Tier 3 Data Files — Comparison/Guide Articles (3 Pages)

**Description:** As a content creator, I need three comparison/guide articles that serve as decision-making resources for buyers.

**Page 9: `src/data/content-pages/open-datasets-vs-custom.ts`**
- Slug: `open-datasets-vs-custom`
- Title: "Open Robotics Datasets vs Custom Collection: When Open Isn't Enough"
- Primary keyword: "open robotics datasets"
- Landscape comparison (primary focus): Open X-Embodiment (1M+ episodes, 22 embodiments, limited task coverage) vs DROID (76K episodes, Franka-only) vs AgiBot World (1M+ trajectories, 5 embodiments) vs custom collection
- Citations: All three dataset papers + relevant limitations analyses
- No case study inline sections — this is a pure comparison article
- 5 FAQs targeting "open vs custom dataset" queries

**Page 10: `src/data/content-pages/crowdsourced-vs-expert-rlhf.ts`**
- Slug: `crowdsourced-vs-expert-rlhf`
- Title: "Why Crowdsourced RLHF Fails for Code and Math Models"
- Primary keyword: "crowdsourced vs expert RLHF"
- Citations: RLTHF (arXiv 2502.13417), MM-RLHF, Secrets of RLHF Part II
- Comparison structure: crowdsourced annotator failure modes vs expert annotation quality metrics
- Case studies: `prompt-enhancement-benchmark`

**Page 11: `src/data/content-pages/eu-ai-act-red-teaming.ts`**
- Slug: `eu-ai-act-red-teaming`
- Title: "EU AI Act Red Teaming Requirements: What Data You Actually Need"
- Primary keyword: "EU AI Act red teaming"
- Timeline table with article breakdown and enforcement dates (Feb 2025, Aug 2025, Aug 2026)
- Citations: EU AI Act full text, NIST AI RMF, Anthropic red teaming papers
- Case studies: `red-teaming-moderation`, `generative-ai-safety`

**Acceptance Criteria:**
- [ ] Same quality criteria as US-005
- [ ] Open datasets comparison table has accurate scale/limitation data from primary sources
- [ ] RLHF comparison article includes specific failure mode examples (not just "quality is lower")
- [ ] EU AI Act article correctly represents enforcement dates and article numbers (55, 99)
- [ ] Pages render locally
- [ ] **Content QA agent review**
- [ ] **Code review agent**

**Recommended agents/skills:** `web-research-specialist`, `frontend-expert`, `code-reviewer`

---

### US-010: Content QA Review Loop — All 11 Pages

**Description:** As QA, I need a dedicated content review pass across all 11 pages to verify citation accuracy, copy quality, SEO optimization, and factual claims.

**Acceptance Criteria:**
- [ ] Deploy a content QA agent (`web-research-specialist`) that reviews ALL page data files
- [ ] For each page, verify:
  - Every citation URL resolves (not 404/dead link)
  - Claimed numbers in dataset comparison tables match the source papers
  - `keyClaim` text on each citation accurately represents the paper's finding
  - Copy doesn't read like AI-generated marketing fluff — should sound like a technical writer who has read the papers
  - FAQ answers are self-contained and answer-first (first sentence is the answer)
  - Primary keyword appears in H1, at least one H2, and meta description
  - H2 headings are question-form
  - No generic marketing fluff that should be replaced with specific data points
  - meta title is 50-60 chars, meta description is 150-160 chars
- [ ] Verify each citation URL returns HTTP 200 (allow 3xx→200 for arXiv) — rate-limit to 1/sec to avoid transient errors. Dead links are blocking
- [ ] Flag sentences over 30 words and paragraphs over 4 lines as potential AI-speak requiring rewrite
- [ ] Enforce max 2 citations per author/venue per page to ensure source diversity
- [ ] Document all issues found in a review report
- [ ] All critical issues (broken citations, factually wrong claims, missing keywords) are resolved before marking complete
- [ ] Re-verify after fixes

**Recommended agents/skills:** `web-research-specialist`, `code-reviewer`

---

### US-011: Code Review — All Components, Data Types, SSR Rendering, JSON-LD Validity

**Description:** As QA, I need a comprehensive code review of all new files to verify TypeScript correctness, server/client component boundaries, JSON-LD validity, and performance.

**Acceptance Criteria:**
- [ ] Deploy `code-reviewer` agent on all new files in `src/app/components/content/`, `src/data/content-pages/`, `src/app/solutions/`, `src/lib/case-studies-server.ts`
- [ ] Verify all server components do NOT import client-only libraries (framer-motion, posthog-js)
- [ ] Verify all client components have `'use client'` directive
- [ ] Verify JSON-LD output parses as valid JSON and validates against schema.org types
- [ ] Verify `generateStaticParams` correctly enumerates all slugs
- [ ] Verify `generateMetadata` produces correct canonical URLs, OG images, descriptions
- [ ] Verify `revalidate = 3600` is set on the dynamic route
- [ ] Verify `notFound()` is called for unknown slugs
- [ ] Verify no `any` types or type assertions that bypass safety
- [ ] Verify `DatasetShowcase` receives valid UUID arrays
- [ ] Verify `InlineCaseStudy` gracefully handles missing case study JSONs
- [ ] Full `npm run build` succeeds with zero errors and zero warnings related to content pages
- [ ] Typecheck passes

**Recommended agents/skills:** `code-reviewer`

---

### US-012: Add All Solutions Pages to Sitemap

**Description:** As a developer, I need all 11 solutions pages included in the sitemap for Google indexing.

**Reference:** `src/app/sitemap.ts`

**Acceptance Criteria:**
- [ ] Import `getAllContentPages` from `src/data/content-pages/index.ts` in `src/app/sitemap.ts`
- [ ] Map all content page slugs to sitemap entries with: `url: https://claru.ai/solutions/{slug}`, `changeFrequency: "monthly"`, `priority: 0.8`
- [ ] Verify sitemap output includes all 11 URLs after build
- [ ] No duplicate URLs in sitemap
- [ ] Typecheck passes

**Recommended agents/skills:** `frontend-expert`, `code-reviewer`

---

### US-013: Playwright E2E Tests — All 11 Pages Render

**Description:** As QA, I need E2E tests verifying all content pages render correctly with proper structured data.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/content-pages.spec.ts`
- [ ] For each of the 11 slugs, test:
  1. Page loads without JavaScript errors (HTTP 200)
  2. Exactly 1 `<h1>` element exists
  3. All `<h2>` elements are question-form (contain "?" or start with What/Why/How)
  4. BreadcrumbList JSON-LD is present and valid JSON
  5. FAQPage JSON-LD is present with 3-5 items
  6. Service JSON-LD is present
  7. `<link rel="canonical">` matches `/solutions/{slug}`
  8. `<meta property="og:image">` is present
  9. FAQ accordion expands/collapses on click
  10. CTA button is visible and links to contact section
  11. Research citations section has at least 3 references with external links
- [ ] Test runs against local dev server
- [ ] Test uses data-driven pattern (parameterized across all 11 slugs)
- [ ] Typecheck passes

**Recommended agents/skills:** `general-purpose` with Playwright MCP, `code-reviewer`

---

### US-014: Playwright MCP UAT — Visual Verification

**Description:** As QA, I need visual user acceptance testing via Playwright MCP browser automation at desktop and mobile viewports.

**Acceptance Criteria:**
- [ ] Start local dev server if not already running
- [ ] For a representative sample (at least 3 pages: 1 Tier-1 e.g. `egocentric-video-data`, 1 Tier-2 e.g. `expert-rlhf-annotation`, 1 Tier-3 e.g. `open-datasets-vs-custom`):
  - Navigate to page at desktop (1440px) and mobile (375px) viewports
  - Take screenshots of hero, comparison table, inline case study, FAQ section
  - Verify breadcrumb navigation is visible and clickable
  - Verify dataset showcase renders cards (if page has datasetIds)
  - Verify no console errors
  - Verify responsive layout — table becomes cards on mobile
- [ ] Verify OG image renders by navigating to `/api/og?title=...&category=solution` for at least 2 pages
- [ ] Document any visual issues found and fix critical blockers

**Recommended agents/skills:** `general-purpose` with Playwright MCP (`mcp__playwright`)

---

### US-015: Post-Deploy GSC — Re-submit Sitemap and Verify Indexing

**Description:** As a site owner, after deploying the 11 new solution pages I need to re-submit the sitemap to Google Search Console and verify all new URLs are discoverable.

**Acceptance Criteria:**
- [ ] Use GSC MCP `submit_sitemap` to re-submit `https://claru.ai/sitemap.xml` (it now includes 11 new URLs)
- [ ] Use GSC MCP `get_sitemap_details` to verify sitemap processes with 0 errors and the URL count increased by 11
- [ ] Use GSC MCP `batch_url_inspection` on all 11 new URLs to check initial crawl status:
  - `https://claru.ai/solutions/egocentric-video-data`
  - `https://claru.ai/solutions/vla-training-data`
  - `https://claru.ai/solutions/red-teaming-data`
  - `https://claru.ai/solutions/video-generation-training-data`
  - `https://claru.ai/solutions/manipulation-trajectory-data`
  - `https://claru.ai/solutions/expert-rlhf-annotation`
  - `https://claru.ai/solutions/sim-to-real-data`
  - `https://claru.ai/solutions/teleoperation-data`
  - `https://claru.ai/solutions/open-datasets-vs-custom`
  - `https://claru.ai/solutions/crowdsourced-vs-expert-rlhf`
  - `https://claru.ai/solutions/eu-ai-act-red-teaming`
- [ ] Use GSC MCP `check_indexing_issues` on all 11 URLs — document any robots blocked, noindex, or fetch errors
- [ ] Verify `/robots.txt` does NOT block `/solutions/` paths
- [ ] Verify `/sitemap.xml` includes all 11 `/solutions/` URLs with priority 0.8
- [ ] Document initial crawl status in progress.txt

**Recommended agents/skills:** `general-purpose` with GSC MCP (`mcp__gsc__*`)

---

### US-016: GSC — Monitor Indexing Progress and Request Crawling

**Description:** As a site owner, I need to monitor indexing progress 3-7 days after deploy and request indexing for any pages that haven't been crawled.

**Acceptance Criteria:**
- [ ] Use GSC MCP `batch_url_inspection` on all 11 solution URLs to check current status
- [ ] For any pages still showing "Discovered - currently not indexed" or "URL is unknown to Google":
  - Use GSC MCP `inspect_url_enhanced` for detailed diagnostics (mobile usability, rich results eligibility, crawl errors)
  - Document the specific issue preventing indexing
- [ ] Use GSC MCP `get_search_analytics` with `dimensions: "page"` filtered to `/solutions/` to check if any impressions are appearing
- [ ] Use GSC MCP `get_performance_overview` to compare overall site performance before/after deploy
- [ ] If pages have indexing issues (blocked by robots, noindex detected, server errors), create fix tickets
- [ ] Verify FAQ rich results are showing in GSC for indexed solution pages
- [ ] Report: table of all 11 URLs with status (indexed/discovered/unknown), last crawl date, rich results detected

**Recommended agents/skills:** `general-purpose` with GSC MCP (`mcp__gsc__*`)

---

### US-017: GSC — Keyword Performance Baseline for Solution Pages

**Description:** As a site owner, I need to establish a keyword performance baseline so we can measure the impact of the new content pages over time.

**Acceptance Criteria:**
- [ ] Use GSC MCP `get_advanced_search_analytics` to capture current rankings for target keywords:
  - Filter by page containing `/solutions/` — capture all queries, impressions, clicks, positions
  - Run with `dimensions: "query,page"`, `row_limit: 500`, `days: 28`
- [ ] Use GSC MCP `get_search_analytics` with `dimensions: "query"` to check if any target keywords already have impressions:
  - "egocentric video data", "VLA training data", "red teaming AI", "video generation training data"
  - "manipulation trajectory data", "expert RLHF annotation", "sim-to-real data", "teleoperation data"
  - "open robotics datasets", "crowdsourced vs expert RLHF", "EU AI Act red teaming"
- [ ] Save baseline data to `tasks/docs/gsc-keyword-baseline.md` with date stamp
- [ ] Set up a comparison framework: record impressions, clicks, CTR, avg position per target keyword at deploy date
- [ ] Schedule a follow-up check at 30 days and 60 days post-deploy (document in progress.txt)

**Recommended agents/skills:** `general-purpose` with GSC MCP (`mcp__gsc__*`)

---

### US-018: AEO/GEO Validation — Optimize All Pages for AI Answer Engines

**Description:** As a site owner, I need all 11 solution pages optimized for Answer Engine Optimization (Google AI Overviews, Featured Snippets, People Also Ask) and Generative Engine Optimization (ChatGPT, Claude, Perplexity citations) so they get surfaced when users ask AI about these topics.

**Reference docs:**
- Prior SEO/AEO/GEO audit: `tasks/docs/seo-aeo-geo-requirements.md` (Requirements 9, 3)
- Design: `tasks/docs/content-pages-design.md` (sections: SEO and Structured Data)

**Acceptance Criteria:**

**AEO (Answer Engine Optimization):**
- [ ] Every H2 on every page is question-form ("What is...?", "How does...?", "Why does...?")
- [ ] First paragraph under every H2 is a self-contained answer (40-80 words) that can be extracted by Google AI Overviews as a standalone passage — no references to "above" or "below", no pronouns without antecedents
- [ ] Each page has 3-5 FAQPage JSON-LD Q&A pairs targeting long-tail "People Also Ask" queries specific to that page's keyword cluster
- [ ] FAQ answers are plain text (no HTML/markdown) and directly answer the question in the first sentence
- [ ] Each page's first 150 words contain the primary keyword and a clear, extractable definition/answer

**GEO (Generative Engine Optimization — ChatGPT, Claude, Perplexity):**
- [ ] Every page includes original proprietary data that doesn't exist elsewhere (case study metrics from Claru's real projects — these are the "externally verifiable reason" for LLMs to cite Claru over generic sources)
- [ ] Each page has at least 1 named framework or methodology from Claru (e.g., "three-pipeline architecture", "same-day QA turnaround", "structured activity taxonomy") — quotable, citable concepts
- [ ] Every factual claim is anchored to either a research citation or a case study metric — no unsubstantiated assertions that an LLM would skip over
- [ ] Pages are fully SSR'd — all text content in server-rendered HTML (not behind JS hydration). Verify with: `curl -s https://claru.ai/solutions/{slug} | grep '<h1>'` returns content
- [ ] Company entity consistency: every page references "Claru" by name (not just "we" or "our") at least 3 times in body copy — LLMs need the entity name to build the knowledge graph node
- [ ] Each page links to at least 1 other solution page (`relatedSlugs`) and 1 pillar page (`pillarLinks`) — cross-linking builds topical authority that LLMs use for entity ranking
- [ ] `public/llms.txt` is updated to include all 11 `/solutions/` URLs with descriptions

**Structural GEO signals:**
- [ ] Each semantic section (H2 + following paragraphs) is independently comprehensible — LLMs extract passages out of context, so every section must make sense without the preceding one
- [ ] Comparison tables include Claru as a named row alongside open datasets — when LLMs summarize options, Claru appears as a concrete alternative
- [ ] Research citations include both the claim AND the source inline (e.g., "EgoDex covers 829 hours of tabletop tasks [Apple, arXiv 2505.11709]") — LLMs cite content that itself cites authoritative sources

**Verification:**
- [ ] Use web search to check if any target query ("egocentric video data for robotics", "VLA training data provider") already surfaces Claru in ChatGPT, Perplexity, or Google AI Overviews — document baseline
- [ ] Verify `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot on `/solutions/` paths (already done in SEO PRD, but re-verify)
- [ ] Verify all pages are in sitemap with priority 0.8

**Recommended agents/skills:** `web-research-specialist` (verification), `seo-audit` skill, `code-reviewer`

---

## Story Dependencies

```
US-001 (types + utilities) ← US-002 (layout), US-003 (components), US-004 (route)
US-002 (layout) ← US-004 (route)
US-003 (components) ← US-004 (route)
US-004 (route) ← US-005, US-006, US-007, US-008, US-009 (all data files)
US-005–009 (data files) ← US-010 (content QA), US-011 (code review), US-012 (sitemap)
US-010, US-011, US-012 ← US-013 (E2E tests), US-018 (AEO/GEO validation)
US-013, US-018 ← US-014 (UAT)
US-014 ← US-015 (GSC sitemap re-submit — post-deploy)
US-015 ← US-016 (GSC indexing monitor — 3-7 days after deploy)
US-015 ← US-017 (GSC keyword baseline — same day as deploy)
```

**Parallelizable:**
- US-001 is the foundation — must complete first
- US-002, US-003 can run in parallel after US-001
- US-004 requires US-002 + US-003
- US-005 through US-009 (all data files) can run in parallel after US-004
- US-010, US-011, US-012 can run in parallel after all data files are complete
- US-013 runs after US-010–012
- US-014 is the final story

---

## Functional Requirements

- FR-01: Dynamic route at `/solutions/[slug]` with `generateStaticParams` for SSG of all 11 pages
- FR-02: ISR with `revalidate = 3600` (1-hour) for Supabase dataset refresh
- FR-03: Each page data file is a typed `ContentPageData` object in `src/data/content-pages/{slug}.ts`
- FR-04: Shared `ContentPageTemplate` composes all sections from page data — no per-page custom JSX
- FR-05: Case study data read from `src/data/case-studies/{slug}.json` via `fs.readFileSync` at build time
- FR-06: Dataset showcase fetches from Supabase `datasets` table using anon key (NOT `createSupabaseServerClient`) with `is_published = true` filter
- FR-07: Three JSON-LD schemas per page: BreadcrumbList, Service (linked to Organization), FAQPage
- FR-08: OG images generated via `/api/og?title=...&category=solution`
- FR-09: Canonical URLs at `https://claru.ai/solutions/{slug}`
- FR-10: All H2 headings are question-form for AEO optimization
- FR-11: All first paragraphs under H2s are answer-first (directly answer the question)
- FR-12: 3-5 FAQs per page with plain-string answers (JSON-LD compatible)
- FR-13: 5-8 research citations per page with real URLs, arxiv IDs, and `keyClaim` summaries
- FR-14: Internal links to 1-2 pillar pages, 1-3 case studies, and data catalog per page
- FR-15: Unknown slugs return 404 via `notFound()`
- FR-16: Build-time validation warns on missing case studies, out-of-range FAQ counts
- FR-17: All 11 pages included in `src/app/sitemap.ts` with priority 0.8
- FR-18: `InlineCaseStudy` returns null (not crash) for missing case study JSONs
- FR-19: All server components are free of client-only imports (framer-motion, posthog-js)
- FR-20: Meta titles 50-60 chars, meta descriptions 150-160 chars

---

## Non-Goals (Out of Scope)

- No CMS or admin UI for editing content page copy (data files are code-managed)
- No blog/article infrastructure beyond these 11 pages
- No A/B testing on content pages
- No Supabase table for content page metadata (TypeScript data files only)
- No automated research paper fetching or citation validation at runtime
- No user comments or ratings on content pages
- No multilingual/i18n support
- No changes to existing pillar pages (reciprocal linking is a follow-up)
- No custom analytics beyond PostHog page views (existing tracking covers this)
- No real-time Supabase subscriptions — ISR is sufficient

---

## Design Considerations

- **Aesthetic:** Match existing site — dark terminal theme (`#0a0908` bg, `#92B090` accent, `#FFFFFF` text)
- **Fonts:** Geist Sans for body, JetBrains Mono for code/stats/terminal elements
- **Card backgrounds:** `#121210` for comparison table rows and metric cards
- **Responsive:** Comparison tables become stacked cards on mobile (<768px)
- **Layout flow:** Hero > Problem > Landscape/Comparison > Solution (inline case studies) > Dataset Showcase > Workforce Stats > FAQ > CTA > References > Footer
- **Animation:** Minimal — use existing FadeIn for scroll reveals, no heavy canvas effects on content pages (SEO-first, performance-first)
- **Reuse existing components:** `DatasetShowcase`, `WorkforceStats`, `FinalCTA`, `Button` — do not duplicate
- **Content density:** Each page targets 2,000+ words — enough for topical authority, not padded fluff

---

## Technical Considerations

- **Server/client boundary:** `ContentPageTemplate`, `ContentHero`, `ProblemSection`, `DatasetComparison`, `InlineCaseStudy`, `ResearchCitations`, `CitationLink` are all server components. Only `ContentFAQ` and reused `WorkforceStats`/`FinalCTA` are client components.
- **`fs.readFileSync` is safe** in server components with `generateStaticParams` — runs at build time only
- **Supabase anon key pattern:** Follow `DatasetShowcase.tsx` exactly — use `createClient` with anon key, NOT `createSupabaseServerClient` (which requires auth cookies)
- **React.cache for Supabase queries:** Wrap dataset fetches in `React.cache` to deduplicate across pages during build
- **JSON-LD injection in layout vs page:** JSON-LD goes in layout.tsx because it needs access to page data for FAQPage schema; use Next.js `generateMetadata` return value or `<script>` tags
- **OG image edge runtime:** Adding "solution" category requires no font changes — reuses existing CATEGORY_CONFIG pattern
- **Build performance:** 11 pages with Supabase fetches — parallelize with `Promise.all` in build, rely on React.cache dedup
- **Next.js 16 `params` are async:** `const { slug } = await params;` pattern required in `generateMetadata` and page component

---

## Success Metrics

- All 11 pages indexed by Google within 30 days of deploy
- Google Rich Results Test shows eligible FAQ results on all 11 pages
- Each page scores 90+ on Lighthouse Performance
- Zero build errors or warnings related to content pages
- All citation URLs resolve (no 404s)
- Organic search impressions for target keywords within 60 days (tracked via GSC)
- At least 2 pages ranking on page 1 for their primary keyword within 90 days
- Internal linking increases average pages/session by 15%

---

## Quality Assurance Requirements

Each user story must include:
1. **Type Safety** — All code must pass TypeScript strict mode (`npm run build` succeeds)
2. **Code Review** — Run `code-reviewer` agent after EACH story completion
3. **Content QA** — For data file stories (US-005 through US-009), deploy `web-research-specialist` agent to verify citation accuracy, copy quality, and SEO optimization

### QA Loop Architecture (CRITICAL)

For every content story (US-005 through US-009), the acceptance criteria require a three-step review cycle:

1. **Create:** Author creates the data file with copy, citations, FAQ, case study mappings
2. **Code Review:** `code-reviewer` agent verifies TypeScript types, data integrity, rendering
3. **Content QA:** `web-research-specialist` agent verifies:
   - Every citation URL returns HTTP 200 (allow 3xx→200 for arXiv redirects) — dead links are blocking
   - Claimed numbers in keyClaim match the actual source paper
   - **AI slop detection (concrete heuristics):**
     - Flag these banned phrases: "cutting-edge", "revolutionize", "unleash", "game-changer", "seamlessly", "leverage" (as verb), "in today's rapidly evolving", "look no further", "at the forefront"
     - Flag passive voice exceeding 15% of sentences
     - Require at least 3 specific numbers or citations per 300 words — reject paragraphs that are all claims with no data anchors
     - Flag any sentence over 35 words as potential AI-speak requiring split
     - Flag any paragraph over 5 lines as needing breakup
   - FAQ answers are self-contained and answer-first (first sentence IS the answer)
   - Primary keyword appears in H1, at least one H2, and meta description
   - No generic marketing fluff — every claim must be backed by a case study metric or research citation
   - Max 2 citations per first-author per page (disambiguate by first author surname)
4. **Fix Cycle:** Issues from steps 2-3 are resolved, then re-reviewed

### Execution Guidelines

- **Parallelize infrastructure:** US-001 must complete first, then US-002 + US-003 in parallel
- **Parallelize data files:** US-005 through US-009 can all run in parallel after US-004
- **Content QA is blocking:** No data file story is "done" until content QA passes
- **Code review every story:** Invoke `code-reviewer` after each story before marking complete
- **E2E tests (US-013)** and **Playwright MCP UAT (US-014)** are the final verification gates

End-to-end tests are defined in US-013. Playwright MCP UAT is the final story (US-014) for live verification.

---

## Agent/Skill Routing

| Story | Primary Agent | Secondary Agent | Skills/Tools |
|-------|--------------|-----------------|--------------|
| US-001 | `frontend-expert` | `code-reviewer` | — |
| US-002 | `frontend-expert` | `code-reviewer` | — |
| US-003 | `frontend-expert` | `code-reviewer` | — |
| US-004 | `frontend-expert` | `code-reviewer` | — |
| US-005 | `frontend-expert` | `web-research-specialist`, `code-reviewer` | Web search for citation verification |
| US-006 | `frontend-expert` | `web-research-specialist`, `code-reviewer` | Web search for citation verification |
| US-007 | `frontend-expert` | `web-research-specialist`, `code-reviewer` | Web search for citation verification |
| US-008 | `frontend-expert` | `web-research-specialist`, `code-reviewer` | Web search for citation verification |
| US-009 | `frontend-expert` | `web-research-specialist`, `code-reviewer` | Web search for citation verification |
| US-010 | `web-research-specialist` | `code-reviewer` | Web search, content analysis |
| US-011 | `code-reviewer` | — | — |
| US-012 | `frontend-expert` | `code-reviewer` | — |
| US-013 | `general-purpose` | `code-reviewer` | Playwright MCP |
| US-014 | `general-purpose` | — | Playwright MCP (`mcp__playwright`) |

---

## Supporting Documentation

| Document | Contents |
|----------|----------|
| `tasks/docs/content-pages-design.md` | Route architecture, component hierarchy, data flow, full TypeScript interfaces, SEO strategy, error handling, testing strategy, implementation plan, file tree |

---

## Codex Review Improvements Applied

The following improvements were identified by Codex (o3) code review and incorporated:

### Structural
- **US-003 should be split** into 3 sub-tasks if a single PR exceeds ~1,000 LOC: "Template & Hero", "Problem/Landscape/Solution sections", "FAQ & Citation utilities"
- **US-010 dependency correction:** Explicitly depends on US-005 through US-009 (all data files), not just US-009
- **Duplicate interface:** `ResearchCitation` defined in US-001 types; `CitationLink` in US-003 is the component — keep interface in US-001 only

### SEO / Content Strategy
- **Keyword cannibalization risk:** `/solutions/egocentric-video-data` vs `/pillars/acquire/egocentric-video` target similar terms. Mitigate by differentiating H1s: pillar = "Egocentric Video Collection Services" (service-focused), solution = "Custom Egocentric Video Data for Embodied AI" (problem-focused). Same for RLHF.
- **Citation diversity rule:** Max 2 citations per author/venue per page to avoid single-source bias
- **Tier 3 thin content risk:** Comparison articles (`open-datasets-vs-custom`) must include at least 1 case study proof section or they risk being flagged as content farm pages
- **Internal linking is two-way:** Add `relatedSlugs` as REQUIRED in ContentPageData type. Add `<RelatedSolutions>` component rendering lateral links between solution pages.

### Technical
- **JSON-LD @graph consolidation:** Wrap BreadcrumbList + Service + FAQPage in a single `@graph` array with `@id` references to Organization — prevents duplicate roots
- **Supabase anon key exposure:** Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is only used inside `lib/supabase-server.ts`, never serialized into page data or JSON-LD
- **Citation link builder:** Add `buildCitationMap(citations)` utility that generates `[1]`-style inline reference IDs mapped to the references section
- **External link attributes:** Use `rel="noopener noreferrer"` on all citation links (not `rel="ugc"` — these are editorial citations, not user-generated content)
- **Build-time validation:** Make missing case study JSONs a build ERROR (not warning) so CI fails. FAQ count outside 3-5 range is a warning.

### QA Loop
- **Citation archivability:** QA agent must verify each citation URL returns HTTP 200 and note the DOI or permalink. Dead links are blocking issues.
- **Readability pass:** QA agent should flag sentences over 30 words and paragraphs over 4 lines as potential AI-speak

---

## Open Questions

- What Supabase dataset UUIDs should each page reference in `datasetIds`? (Need to query the `datasets` table for relevant IDs per topic — BLOCKING for DatasetShowcase to render)
- Should we add reciprocal links from pillar pages back to related content pages in this PRD, or defer to a follow-up?
- Do we want PostHog custom events on content pages beyond the default page view tracking? (e.g., `citation_clicked`, `faq_expanded`, `dataset_card_clicked`)
- Should the comparison/guide articles (Tier 3) use a slightly different template layout since they don't all have case study inline sections?
- What is the exact publication date for Sim2Real-VLA at ICLR 2026 — is this a preprint or accepted paper?
- **[NEW from Codex review]** Should we add a `supabase-cache.ts` wrapper using `@vercel/kv` to avoid 11×n identical Supabase reads during build? Or is `React.cache` sufficient?
- **[NEW from Codex review]** Should US-003 be split into 3 tickets to keep PR size manageable, or is a single large PR acceptable given it's all new files?
