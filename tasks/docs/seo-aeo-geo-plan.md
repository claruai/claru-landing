# SEO / AEO / GEO Optimization — Implementation Tasks

> Based on claru.ai (Next.js 16, App Router, 47 page routes).
> Sitemap already deployed and submitted to GSC.

---

## Phase 1 — Quick Wins (independent, parallelizable)

- [ ] **1. Fix robots.txt — unblock AI crawlers, add Sitemap directive**
  - No `public/robots.txt` or `src/app/robots.ts` currently exists; the only robots config is the `metadata.robots` in `layout.tsx`
  - Create `src/app/robots.ts` using Next.js Metadata API (`MetadataRoute.Robots`)
  - Allow: `/` for all user agents
  - Add `Sitemap: https://claru.ai/sitemap.xml`
  - Explicitly allow `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Applebot`
  - Block training crawlers: `Google-Extended`, `CCBot`, `Bytespider`, `GPTBot` (training), `anthropic-ai`
  - Block `/admin/*`, `/portal/*`, `/experiment/*` from all crawlers
  - Test: `npm run build` then verify `/robots.txt` output
  - Complexity: **S** | Risk: Low
  - Ref: Work item 2

- [ ] **2. Add Organization + WebSite JSON-LD to root layout**
  - Edit `src/app/layout.tsx`
  - Add a `<script type="application/ld+json">` in `<head>` with `@graph` containing:
    - `Organization`: name "Claru", legalName "Reka AI Inc.", url, logo (`https://claru.ai/images/logo.png`), sameAs (LinkedIn, etc.), contactPoint
    - `WebSite`: name "Claru", url `https://claru.ai`
  - This is a server component already, so renders server-side
  - Test: validate with Google Rich Results Test / Schema Markup Validator
  - Complexity: **S** | Risk: Low
  - Ref: Work item 3

- [ ] **3. Create `/public/llms.txt`**
  - Static plaintext file mapping site structure for AI systems
  - Include: site description, primary services (Acquire, Enrich, Prepare, Validate), page index with URLs and one-line descriptions
  - Cover all public-facing routes from `sitemap.ts` (skip admin/portal)
  - Format per the llms.txt spec: title, description, then `## Sections` with URLs
  - Test: verify file accessible at `https://claru.ai/llms.txt` after build
  - Complexity: **S** | Risk: Low
  - Ref: Work item 4

- [ ] **4. Add canonical URLs to ~10 pages missing them**
  - Pages with canonicals already: all pillar layouts (16 files), `jobs/layout.tsx`
  - Pages missing canonicals — add `alternates: { canonical: "/path" }` to metadata in:
    - [ ] 4.1 `src/app/data-catalog/page.tsx` (or its layout)
    - [ ] 4.2 `src/app/case-studies/page.tsx` (listing page)
    - [ ] 4.3 `src/app/case-studies/[slug]/page.tsx` (dynamic — use slug in `generateMetadata`)
    - [ ] 4.4 `src/app/for-annotators/page.tsx` (or `layout.tsx`)
    - [ ] 4.5 `src/app/data/page.tsx`
    - [ ] 4.6 `src/app/privacy/page.tsx`
    - [ ] 4.7 `src/app/terms/page.tsx`
    - [ ] 4.8 `src/app/prohibited-use/page.tsx`
    - [ ] 4.9 `src/app/job-applicant-privacy/page.tsx`
    - [ ] 4.10 `src/app/labeling/page.tsx`
  - Test: build and inspect `<link rel="canonical">` in page source for each
  - Complexity: **S** | Risk: Low
  - Ref: Work item 5

- [ ] **5. Add `dateModified` to existing Article and Service schemas**
  - [ ] 5.1 Case study Article JSON-LD (`src/app/case-studies/[slug]/page.tsx` line ~80): add `dateModified` field, use `cs.dateModified ?? cs.datePublished`; add `dateModified` to case study type if needed
  - [ ] 5.2 Pillar Service JSON-LD (all 16 pillar layout files): add `dateModified` using a build-time date constant or per-pillar date
  - Create a shared `BUILD_DATE` constant in `src/lib/constants.ts` for fallback
  - Test: validate schemas still pass Rich Results Test
  - Complexity: **S** | Risk: Low
  - Ref: Work item 9

- [ ] **6. Update 2-3 headings per pillar/sub-pillar page to question form**
  - Target pages: the 12 sub-pillar pages (`src/app/pillars/{acquire,enrich,prepare,validate}/{sub}/page.tsx`)
  - For each: change 2-3 section H2s to question format (e.g., "Data Quality" -> "How Does Claru Ensure Data Quality?")
  - Add a short answer-first paragraph (1-2 sentences) immediately after each question H2
  - Keep existing content; this is heading/lead-in rewrites only
  - Test: visual review; headings render correctly with existing styles
  - Complexity: **M** (12 files, light content work per file) | Risk: Low
  - Ref: Work item 10

---

## Phase 2 — Homepage SSR Refactor (largest item, blocks FAQ schema)

- [ ] **7. Homepage SSR refactor — server component with client children**
  - Currently `src/app/page.tsx` is entirely `'use client'` with `if (!mounted) return null` — zero server-rendered HTML
  - This is the highest-impact SEO fix: all homepage content is invisible to crawlers
  - [ ] 7.1 Create `src/app/components/sections/HeroContent.tsx` as a server component rendering the static H1, tagline, CTA links, and internal navigation. Extract animated wrappers to a separate `HeroAnimations.tsx` client component
  - [ ] 7.2 Refactor `src/app/page.tsx`: remove `'use client'`, remove `mounted` state guard. Make the page a server component. Import sections that need interactivity with `dynamic()` using `ssr: false` only for animation-heavy effects (`HeroBackground`, `LenisProvider`, `AnimatedLogo`), but let content-bearing sections (`ProblemAgitation`, `TwoPaths`, `Origin`, `ProofOfWork`, `Testimonials`, `FinalCTA`) render server-side
  - [ ] 7.3 For each content section currently using Framer Motion at the top level: split into a server-rendered content wrapper + a client `MotionWrapper` that handles animations. The HTML content (headings, paragraphs, links) must be in the server component
  - [ ] 7.4 Move `SectionBridge` to its own file as a client component (uses `motion.div`)
  - [ ] 7.5 Verify `Header` and `Footer` can render server-side (they likely already export static HTML with client interactivity isolated)
  - [ ] 7.6 Test: `curl https://claru.ai | grep -i '<h1>'` must return the homepage H1. Run `npm run build` with no errors. Visually verify all animations still work in dev
  - Complexity: **L** | Risk: High — animation breakage, hydration mismatches
  - Mitigation: refactor one section at a time, test after each. Keep a working branch. Use `Suspense` boundaries around client dynamic imports
  - Ref: Work item 7

---

## Phase 3 — Structured Data & AI Discoverability

- [ ] **8. Add FAQPage schema to homepage**
  - Depends on task 7 (homepage must be server component to render JSON-LD server-side)
  - [ ] 8.1 Define 5-8 Q&A pairs about Claru services in a data file (`src/lib/homepage-faqs.ts`)
  - [ ] 8.2 Add `<script type="application/ld+json">` with FAQPage schema in the server-rendered homepage, following the same pattern as `src/app/pillars/acquire/layout.tsx`
  - [ ] 8.3 Optionally render the FAQ as visible HTML (an accordion section) — visible FAQ content strengthens the schema signal
  - Test: Rich Results Test shows FAQ rich results eligible
  - Complexity: **S** (once task 7 is done) | Risk: Low
  - Ref: Work item 6

- [ ] **9. Add FAQPage schema to data-catalog page**
  - [ ] 9.1 Define 3-5 Q&As about the data catalog in `src/app/data-catalog/page.tsx` (or a layout)
  - [ ] 9.2 Add JSON-LD FAQPage schema server-side
  - [ ] 9.3 Optionally render as visible FAQ section
  - Test: Rich Results Test validation
  - Complexity: **S** | Risk: Low
  - Ref: Work item 6

---

## Phase 4 — Dynamic OG Images

- [ ] **10. Build dynamic OG image generator**
  - [ ] 10.1 Create `src/app/og/route.tsx` (or `src/app/opengraph-image.tsx`) using Next.js `ImageResponse` API
    - Terminal aesthetic: dark bg `#0a0908`, sage green `#92B090` accents, JetBrains Mono font
    - Accept `title` and optional `subtitle` as search params
    - Render a 1200x630 image with Claru branding
  - [ ] 10.2 Create a shared helper `src/lib/og.ts` that generates the OG image URL for a given page title
  - [ ] 10.3 Wire into root layout `metadata.openGraph.images` as default
  - [ ] 10.4 Wire into pillar layouts (16 files) — pass pillar title as param
  - [ ] 10.5 Wire into case study `generateMetadata` — pass case study title
  - [ ] 10.6 Wire into jobs `generateMetadata` — pass job title
  - [ ] 10.7 Wire into remaining pages (data-catalog, for-annotators, labeling, data, case-studies listing, jobs listing)
  - Test: visit `/og?title=Test` in browser, verify image renders. Check `<meta property="og:image">` on built pages
  - Complexity: **M** | Risk: Medium — font loading in ImageResponse can be tricky, need to bundle JetBrains Mono as ArrayBuffer
  - Mitigation: test font loading early in 10.1 before wiring to all pages
  - Ref: Work item 8

---

## Phase 5 — Cross-Platform & Verification

- [ ] **11. Create entity consistency checklist document**
  - Create `src/lib/entity-profile.ts` exporting a canonical entity object: `{ name, legalName, description, tagline, url, foundedYear, ... }`
  - Use this object as the single source of truth for JSON-LD Organization schema (task 2) and any future integrations
  - Non-code deliverable: a markdown checklist at `tasks/docs/entity-consistency-checklist.md` listing LinkedIn, Crunchbase, G2, Capterra with expected description text
  - Complexity: **S** | Risk: Low
  - Ref: Work item 11

- [ ] **12. Post-deploy GSC verification**
  - After all above tasks are deployed, use GSC MCP tools to:
    - [ ] 12.1 Verify `robots.txt` is accessible and correctly parsed
    - [ ] 12.2 Submit updated sitemap
    - [ ] 12.3 Request indexing for key pages (homepage, pillars, case studies)
    - [ ] 12.4 Check for crawl errors or indexing issues
  - Depends on: all previous tasks deployed to production
  - Complexity: **S** | Risk: Low
  - Ref: Work item 12

---

## Dependency Graph

```
Phase 1 (all parallel):
  Task 1 (robots.txt)     ─┐
  Task 2 (Org JSON-LD)     │
  Task 3 (llms.txt)        │
  Task 4 (canonicals)      ├──→ Phase 5: Task 12 (GSC verify)
  Task 5 (dateModified)    │
  Task 6 (question H2s)    │
                            │
Phase 2:                    │
  Task 7 (homepage SSR) ───┤
                            │
Phase 3 (after task 7):     │
  Task 8 (homepage FAQ) ───┤
  Task 9 (catalog FAQ)  ───┤  (independent of task 7)
                            │
Phase 4 (independent):      │
  Task 10 (OG images)  ────┘

Phase 1, Phase 4, and Task 9 can all run in parallel.
Task 8 blocks on Task 7.
Task 12 blocks on everything else being deployed.
```

## Recommended Agent Assignment

| Task | Agent Type | Notes |
|------|-----------|-------|
| 1 (robots.txt) | Code agent | Simple file creation |
| 2 (Org JSON-LD) | Code agent | Edit layout.tsx |
| 3 (llms.txt) | Code agent + human review | Content needs accuracy check |
| 4 (canonicals) | Code agent | Repetitive metadata edits |
| 5 (dateModified) | Code agent | Schema edits + type update |
| 6 (question H2s) | Code agent + human review | Content rewrites need tone review |
| 7 (homepage SSR) | Senior code agent | Complex refactor, high risk |
| 8 (homepage FAQ) | Code agent + human review | Content creation |
| 9 (catalog FAQ) | Code agent + human review | Content creation |
| 10 (OG images) | Code agent | ImageResponse API expertise |
| 11 (entity profile) | Code agent + human | Partially non-code |
| 12 (GSC verify) | Human + GSC tools | Post-deploy manual verification |
