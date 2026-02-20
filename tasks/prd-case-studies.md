# PRD: Case Studies Section

## Introduction

Build a `/case-studies` section on the Claru landing site (Next.js 16, App Router, Tailwind CSS 4, Framer Motion) that publishes 10 internal case studies as public-facing, SEO/AEO-optimized pages. Each case study targets a skeptical AI researcher at a frontier lab — no marketing fluff, concrete methodology, real numbers, technical vocabulary. The section includes a filterable index page, individual case study pages with structured data, and integration with the existing ProofOfWork section and site navigation.

Source content exists as markdown docs in `docs/case-studies/*.md`. The 10 case studies cover: egocentric video collection (1,000+ hrs), game-based data capture (10K+ hrs), fashion AI annotation (3M+ images), generative AI safety (205K outputs), video model evaluation (39K pairwise evals), workplace egocentric robotics, object identity persistence, prompt enhancement benchmarking, video content classification (105K clips), and data engine for world models.

---

## Goals

- Publish 10 case studies as statically generated, SEO/AEO-optimized pages at `/case-studies/[slug]`
- Each page includes Article + FAQPage + BreadcrumbList JSON-LD schema for search engine and AI assistant discoverability
- Answer-first content structure on every section — direct statement before elaboration
- Internal linking between case studies, pillar pages (`/pillars/acquire/*`, `/pillars/enrich/*`, `/pillars/validate/*`), and related case studies
- Filterable index page at `/case-studies` with category-based filtering
- Update existing ProofOfWork section on the main landing page to link to case study pages
- Add Case Studies to site-wide navigation (Header + Footer)
- Match existing dark terminal aesthetic (near-black backgrounds, sage green `#92B090` accents, JetBrains Mono, TextScramble effects)

---

## Agent & Skill Assignments

Each user story specifies which agents and skills to invoke. Here is the full roster:

| Agent/Skill | Used For |
|---|---|
| `nextjs-expert` agent | Next.js pages, routes, static generation, JSON-LD schema, data utilities |
| `frontend-expert` agent | UI components, responsive design, animations, Framer Motion integration |
| `code-reviewer` agent | Post-implementation review after EVERY user story + build verification |
| `content-marketing:blog-writer` skill | Case study content authoring, answer-first formatting, technical tone |
| `seo-content` skill | AEO-optimized FAQ content, answer blocks, meta descriptions |
| `on-page` skill | On-page SEO audit of completed pages |
| `favicon-meta` skill | Open Graph, Twitter cards, structured data meta tags |
| `frontend-testing` skill | Vitest unit tests for components |
| `webapp-testing` skill | Playwright E2E test creation |
| `brand-voice` skill | Consistent voice across case study copy |
| `commit` skill | Commit after each completed + reviewed user story |

### Post-Story Completion Protocol

After EVERY user story is implemented, the following MUST happen in order:

1. **Build verification:** Run `npm run build` — must pass with zero errors
2. **Typecheck:** Run `npx tsc --noEmit` — must pass
3. **Lint:** Run `npm run lint` — must pass
4. **Code Review:** Launch `code-reviewer` agent to review all changed files
5. **Browser verification** (UI stories only): Verify in browser using Playwright or dev tools
6. **Commit:** Only after all checks pass, commit with descriptive message (with user confirmation)

---

## Architecture Decisions

1. **Route:** `/case-studies` (index) and `/case-studies/[slug]` (individual pages)
2. **Data:** JSON files in `src/data/case-studies/[slug].json` with typed schema (mirrors existing job board pattern in `src/data/jobs/` and `src/lib/jobs.ts`)
3. **Static generation:** Use `generateStaticParams` for all case study pages (same pattern as `/jobs/[slug]`)
4. **Media assets:** Images stored in `public/images/case-studies/[slug]/` — each case study has 3-6 images referenced by relative path in the JSON data
5. **Shared components:** `Header` (with `opaque` prop) and `Footer` from existing layout components
6. **Types:** `src/types/case-study.ts` — mirrors the structure of `src/types/job.ts`
7. **Utilities:** `src/lib/case-studies.ts` — mirrors the structure of `src/lib/jobs.ts` (server-side fs-based reads)

---

## Content Tone (CRITICAL)

Write for a skeptical AI researcher at a frontier lab. This means:

- NO marketing fluff ("world-class", "cutting-edge", "revolutionary", "game-changing")
- Concrete methodology descriptions (what pipeline, what QA process, what tools)
- Technical vocabulary (egocentric POV, semantic segmentation, Krippendorff's alpha, ELO ranking, pairwise evaluation, Swiss-style pairing)
- Real numbers without inflation — use the exact figures from the source docs
- Show annotation schema snippets or data structure examples where available
- No stock imagery — only real screenshots/visuals from actual projects
- Tone: competent peer explaining what they built and why it worked

---

## SEO/AEO Requirements (CRITICAL)

Every case study page MUST include:

1. **Answer-first content** — every section opens with 1-2 sentence direct answer before elaborating
2. **Quick Summary / TL;DR block** at top (challenge, solution, result in 3 lines)
3. **Article + FAQPage + BreadcrumbList JSON-LD schema** injected via `<script type="application/ld+json">` tags
4. **SEO meta:** keyword-targeted title (<60 chars), meta description (<155 chars) with primary keyword + quantitative result
5. **FAQ section** with 3-5 questions per case study, answer-first format, FAQPage schema
6. **Internal linking:** each case study links to its primary pillar page and to 2-3 related case studies
7. **OG/Twitter meta tags** for social sharing (title, description, image)
8. **Breadcrumbs** (Home > Case Studies > [Title]) — rendered in UI and in BreadcrumbList schema

### Target Keywords (Per Case Study)

| Slug | Primary Keyword |
|---|---|
| `egocentric-video-collection` | egocentric video data collection robotics |
| `game-based-data-capture` | game-based data collection AI training |
| `fashion-ai-annotation` | fashion image annotation AI training data |
| `generative-ai-safety` | generative AI safety labeling service |
| `video-model-evaluation` | video generation model evaluation service |
| `workplace-egocentric-data` | workplace egocentric data robotics training |
| `object-identity-persistence` | object identity tracking video annotation AI |
| `prompt-enhancement-benchmark` | prompt enhancement benchmarking training data |
| `video-content-classification` | video content classification training data at scale |
| `data-engine-world-models` | data engine for world models AI |

### Internal Linking Map

| Case Study | Primary Pillar Page |
|---|---|
| Egocentric Video Collection | `/pillars/acquire/egocentric-video` |
| Game-Based Data Capture | `/pillars/acquire/synthetic-data` |
| Fashion AI Annotation | `/pillars/enrich/expert-annotation` |
| Generative AI Safety | `/pillars/validate/red-teaming` |
| Video Model Evaluation | `/pillars/validate/benchmark-curation` |
| Workplace Egocentric Data | `/pillars/acquire/egocentric-video` |
| Object Identity Persistence | `/pillars/enrich/video-annotation` |
| Prompt Enhancement Benchmark | `/pillars/validate/benchmark-curation` |
| Video Content Classification | `/pillars/enrich/expert-annotation` |
| Data Engine for World Models | `/pillars/acquire` |

---

## Page Structure: Individual Case Study (`/case-studies/[slug]`)

Each case study page follows this structure:

1. **Hero** — outcome-led headline + category badge + key metric (large monospace number)
2. **Quick Summary** — TL;DR block in terminal-style callout: Challenge / Solution / Result in 3 lines
3. **Snapshot Bar** — 3-4 inline stats in a horizontal row (monospace numbers, subtle borders)
4. **Challenge Section** — 2-4 sentences, answer-first. What the customer needed and why it was hard.
5. **What We Built / Our Approach** — 2-3 paragraphs with methodology detail. Concrete pipeline descriptions, tools used, QA processes. No hand-waving.
6. **Results Section** — 3-column stat grid with large monospace numbers, labels below
7. **Impact Section** — 1 paragraph. What this enabled for the customer.
8. **Related Case Studies** — 3-card grid linking to related case studies
9. **FAQ Section** — 3-5 questions, answer-first format, with FAQPage JSON-LD schema
10. **CTA Section** — "Book a Call" primary button + "Start a similar project" secondary link, both pointing to `#contact` or `/contact`

---

## Page Structure: Index Page (`/case-studies`)

1. **Section label:** `// CASE STUDIES` (monospace, accent color, uppercase tracking)
2. **Headline:** "What we've shipped."
3. **Category filter pills** — Filterable by: All, Data Collection, Annotation, Safety, Evaluation, Video, Robotics, Gaming
4. **Card grid** — Responsive grid of case study cards (1 col mobile, 2 col tablet, 3 col desktop)
5. **Each card:**
   - Category badge (pill, accent color)
   - Headline stat (large monospace number, e.g., "1,000+ hrs", "3M+ images")
   - Title (bold)
   - 2-line teaser text
   - Arrow link ("Read case study →")
6. **Cards use existing dark card style** — `bg-[var(--bg-card)]`, `border-[var(--border-subtle)]`, hover lift + border glow (same pattern as `ProofOfWork.tsx` `ProjectCard`)

---

## Data Schema

### TypeScript Interface (`src/types/case-study.ts`)

```typescript
/**
 * Case study data types and constants.
 *
 * All case studies are stored as individual JSON files under
 * `src/data/case-studies/` and loaded at build time via the utility
 * functions in `src/lib/case-studies.ts`.
 */

/** Union of all valid case study category slugs. */
export type CaseStudyCategory =
  | 'data-collection'
  | 'annotation'
  | 'safety'
  | 'evaluation'
  | 'video'
  | 'robotics'
  | 'gaming';

/** A single case study. */
export interface CaseStudy {
  /** URL-safe identifier used as the filename (without extension) and route param. */
  slug: string;

  /** Human-readable title. */
  title: string;

  /** Category the case study belongs to. */
  category: CaseStudyCategory;

  /** 1-2 sentence teaser shown on cards and in meta descriptions. */
  teaser: string;

  /** Large headline stat displayed prominently (e.g., "1,000+ hours", "3M+ images"). */
  headlineStat: string;

  /** Summary paragraph (2-4 sentences). */
  summary: string;

  /** Key metrics — displayed in the snapshot bar. */
  keyMetrics: string[];

  /** Challenge section content (answer-first, 2-4 sentences). */
  challenge: string;

  /** What We Built / Our Approach section (2-3 paragraphs). */
  approach: string;

  /** Results — displayed as a stat grid. */
  results: {
    stat: string;
    label: string;
  }[];

  /** Impact section (1 paragraph). */
  impact: string;

  /** FAQ items for the FAQ section. 3-5 per case study. */
  faqs: {
    question: string;
    answer: string;
  }[];

  /** Primary keyword for SEO meta title/description. */
  primaryKeyword: string;

  /** SEO meta title (<60 chars). */
  metaTitle: string;

  /** SEO meta description (<155 chars). */
  metaDescription: string;

  /** Primary pillar page this case study links to. */
  pillarPageHref: string;

  /** Slugs of 2-3 related case studies. */
  relatedCaseStudies: string[];

  /** Paths to images in public/images/case-studies/[slug]/. */
  images: string[];

  /** ISO 8601 date string for when the case study was published. */
  datePublished: string;

  /** ISO 8601 date string for last modification. */
  dateModified: string;
}

/** Human-readable labels for each case study category. */
export const CASE_STUDY_CATEGORIES: Record<CaseStudyCategory, string> = {
  'data-collection': 'Data Collection',
  'annotation': 'Annotation',
  'safety': 'Safety',
  'evaluation': 'Evaluation',
  'video': 'Video',
  'robotics': 'Robotics',
  'gaming': 'Gaming',
};
```

---

## ProofOfWork Section Update

The existing `ProofOfWork` section on the main landing page (`src/app/components/sections/ProofOfWork.tsx`) should be updated so its cards link to `/case-studies/[slug]` instead of being static. The 5 cards map to:

| Current Card Title | Case Study Slug | Stat from Case Study |
|---|---|---|
| Egocentric Video Capture | `egocentric-video-collection` | 1,000+ hours |
| Manipulation Trajectory Data | (keep as-is, no case study yet) | — |
| Game Environment Capture | `game-based-data-capture` | 10,000+ hours |
| Multi-Modal Annotation | `fashion-ai-annotation` | 3M+ images |
| Synthetic Data Pipelines | (keep as-is, no case study yet) | — |

Cards with matching case studies become `<Link>` components pointing to `/case-studies/[slug]`. Cards without a matching case study remain static. Each linked card gets an "Read case study →" link at the bottom.

---

## User Stories

### US-001: Case Study JSON Data Schema, Types, and Utility Functions

**Description:** As a developer, I need a typed data schema and server-side utility functions for case studies so that the index and detail pages can load data at build time.

**Agents/Skills:** `nextjs-expert` agent (TypeScript interfaces, data utilities)

**Acceptance Criteria:**
- [ ] `src/types/case-study.ts` created with `CaseStudy` interface, `CaseStudyCategory` type, and `CASE_STUDY_CATEGORIES` constant (as specified in the Data Schema section above)
- [ ] `src/lib/case-studies.ts` created with the following functions (mirroring `src/lib/jobs.ts` pattern):
  - `getAllCaseStudies()` — returns all case studies sorted by `datePublished` descending
  - `getCaseStudyBySlug(slug: string)` — returns a single case study or `null`
  - `getCaseStudiesByCategory(category: CaseStudyCategory)` — returns filtered list
  - `getRelatedCaseStudies(slug: string)` — returns the related case studies for a given slug
- [ ] Utility functions read from `src/data/case-studies/` directory (JSON files)
- [ ] All functions are server-side only (use `fs` and `path` modules)
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-002: Seed 10 Case Study JSON Files From Markdown Docs

**Description:** As a developer, I need the 10 case study markdown docs converted into structured JSON files so that the data layer has content to serve.

**Agents/Skills:** `content-marketing:blog-writer` skill (expand content, write FAQs, challenge/approach sections), `seo-content` skill (meta titles, descriptions, keywords), `nextjs-expert` agent (JSON file creation)

**Acceptance Criteria:**
- [ ] `src/data/case-studies/` directory created with 10 JSON files:
  - `egocentric-video-collection.json`
  - `game-based-data-capture.json`
  - `fashion-ai-annotation.json`
  - `generative-ai-safety.json`
  - `video-model-evaluation.json`
  - `workplace-egocentric-data.json`
  - `object-identity-persistence.json`
  - `prompt-enhancement-benchmark.json`
  - `video-content-classification.json`
  - `data-engine-world-models.json`
- [ ] Each JSON file conforms to the `CaseStudy` interface
- [ ] Content is expanded from the markdown source docs — NOT just copied verbatim:
  - `challenge` field: 2-4 sentences, answer-first, describing the problem
  - `approach` field: 2-3 paragraphs with concrete methodology detail
  - `impact` field: 1 paragraph describing downstream effect
  - `faqs` field: 3-5 questions per case study, answer-first format
- [ ] All `metaTitle` values are under 60 characters
- [ ] All `metaDescription` values are under 155 characters and include the primary keyword + a quantitative result
- [ ] All `primaryKeyword` values match the target keywords table
- [ ] All `pillarPageHref` values match the internal linking map
- [ ] Each case study has 2-3 `relatedCaseStudies` slugs that are valid slugs of other case studies
- [ ] `results` array has 3 entries per case study (stat + label pairs)
- [ ] `datePublished` and `dateModified` are valid ISO 8601 date strings
- [ ] Content tone: no marketing fluff, concrete methodology, technical vocabulary, real numbers
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent — verify content quality, tone, and schema conformance
- [ ] **Commit** after review passes

---

### US-003: Download Media Assets From Notion to Public Directory

**Description:** As a developer, I need a script that downloads case study images from Notion to the local `public/images/case-studies/[slug]/` directories so that pages can reference local image paths.

**Agents/Skills:** `nextjs-expert` agent (Node.js script), general-purpose agent (file I/O)

**Acceptance Criteria:**
- [ ] Script at `scripts/download-case-study-images.ts` (runnable with `npx tsx scripts/download-case-study-images.ts`)
- [ ] Script reads image URLs from a configuration object or from the markdown docs in `docs/case-studies/`
- [ ] Downloads images to `public/images/case-studies/[slug]/` — one subdirectory per case study
- [ ] Each case study directory contains 3-6 images (hero image + supporting visuals)
- [ ] Images are optimized for web (reasonable file sizes, appropriate dimensions)
- [ ] Script is idempotent — running it again skips already-downloaded files
- [ ] After running, update each case study JSON's `images` array with the local paths (e.g., `/images/case-studies/egocentric-video-collection/hero.jpg`)
- [ ] If Notion image URLs are expired or unavailable, script logs a warning and continues
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on script
- [ ] **Commit** after review passes

---

### US-004: Case Study Index Page `/case-studies` With Filterable Card Grid

**Description:** As a site visitor, I want to browse all case studies on a filterable index page so that I can find projects relevant to my domain.

**Agents/Skills:** `nextjs-expert` agent (page route, metadata), `frontend-expert` agent (card grid, filter UI, animations), `seo-content` skill (page metadata)

**Acceptance Criteria:**
- [ ] Page at `/case-studies` with proper metadata:
  - Title: "Case Studies | Claru AI" (<60 chars)
  - Description targeting "AI training data case studies" with mention of project count
- [ ] Section label: `// CASE STUDIES` (monospace, accent color, uppercase tracking — matching existing section label pattern in `ProofOfWork.tsx`)
- [ ] Headline: "What we've shipped." (matching existing ProofOfWork heading style)
- [ ] Category filter pills: All, Data Collection, Annotation, Safety, Evaluation, Video, Robotics, Gaming
  - "All" selected by default
  - Clicking a category filters the card grid (client-side, no page reload)
  - Active pill has accent color background, others have subtle border
- [ ] Card grid: responsive (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Each card displays:
  - Category badge (small pill, monospace, accent color)
  - Headline stat (large monospace number, e.g., "1,000+ hrs")
  - Title (bold, 1 line)
  - Teaser text (2 lines, truncated with ellipsis)
  - "Read case study →" link (accent color, monospace)
- [ ] Cards use existing dark card style: `bg-[var(--bg-card)]`, `border-[var(--border-subtle)]`, hover lift + border glow (match `ProjectCard` in `ProofOfWork.tsx`)
- [ ] TextScramble effect on page heading
- [ ] FadeIn scroll animations on card grid
- [ ] Uses shared `Header` (with `opaque` prop) and `Footer` components
- [ ] Responsive: renders correctly on mobile, tablet, and desktop
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-005: Individual Case Study Page Template `/case-studies/[slug]`

**Description:** As a site visitor, I want to read a detailed case study with methodology, results, and related work so that I can evaluate Claru's capabilities for a similar project.

**Agents/Skills:** `nextjs-expert` agent (dynamic route, `generateStaticParams`, metadata), `frontend-expert` agent (page layout, section components, animations)

**Acceptance Criteria:**
- [ ] Dynamic route at `/case-studies/[slug]` using `generateStaticParams` for static generation of all 10 case studies
- [ ] Page sections rendered in order:
  1. **Breadcrumbs** — Home > Case Studies > [Title] (rendered as text links)
  2. **Hero** — category badge + headline (title) + headline stat (large monospace number, 48px+)
  3. **Quick Summary** — terminal-style callout block with monospace font, subtle background, showing Challenge / Solution / Result in 3 labeled lines
  4. **Snapshot Bar** — 3-4 key metrics displayed inline horizontally, separated by vertical dividers, monospace numbers
  5. **Challenge** — h2 heading + answer-first paragraph(s)
  6. **What We Built** — h2 heading + 2-3 paragraphs with methodology detail
  7. **Results** — 3-column stat grid with large monospace numbers (top) and labels (bottom), accent color on numbers
  8. **Impact** — h2 heading + 1 paragraph
  9. **Related Case Studies** — h2 heading + 3-card grid (reusing index page card component)
  10. **FAQ** — accordion/collapsible items (reuse existing FAQ pattern if available)
  11. **CTA** — "Book a Call" primary button + "Start a similar project" secondary link
- [ ] Internal link to primary pillar page rendered within the approach or impact section (contextual anchor text, not "click here")
- [ ] Uses shared `Header` (with `opaque` prop) and `Footer` components
- [ ] Page layout: max-width content column (prose-width, ~720px), centered
- [ ] Responsive: all sections stack properly on mobile
- [ ] Framer Motion fade-in animations on section entrance
- [ ] TextScramble effect on the hero headline
- [ ] 404 page returned for invalid slugs (not a blank page)
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser (check at least 3 different case studies)
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-006: JSON-LD Schema Injection (Article + FAQPage + BreadcrumbList)

**Description:** As a search engine or AI assistant, I need structured data on every case study page so that content is properly indexed and eligible for rich results.

**Agents/Skills:** `nextjs-expert` agent (JSON-LD generation, metadata), `favicon-meta` skill (OG tags, Twitter cards), `on-page` skill (SEO audit after implementation)

**Acceptance Criteria:**
- [ ] Each case study page injects three JSON-LD scripts in the page `<head>` (via Next.js `metadata` export or `<script>` tags):
  - **Article schema:**
    - `@type`: "Article"
    - `headline`: case study title
    - `description`: meta description
    - `datePublished`: from JSON data
    - `dateModified`: from JSON data
    - `author`: `{ "@type": "Organization", "name": "Claru AI", "url": "https://claru.ai" }`
    - `publisher`: `{ "@type": "Organization", "name": "Claru AI", "url": "https://claru.ai" }`
    - `image`: first image from case study images array
    - `mainEntityOfPage`: canonical URL
  - **FAQPage schema:**
    - `@type`: "FAQPage"
    - `mainEntity`: array of FAQ items from the case study's `faqs` field
    - Each item: `{ "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }`
  - **BreadcrumbList schema:**
    - `@type`: "BreadcrumbList"
    - 3 items: Home (https://claru.ai) → Case Studies (/case-studies) → [Title] (/case-studies/[slug])
- [ ] OG meta tags on every case study page:
  - `og:title`: case study title
  - `og:description`: meta description
  - `og:image`: first image from images array
  - `og:url`: canonical URL
  - `og:type`: "article"
- [ ] Twitter meta tags:
  - `twitter:card`: "summary_large_image"
  - `twitter:title`: case study title
  - `twitter:description`: meta description
  - `twitter:image`: first image
- [ ] Canonical URL set on each page
- [ ] JSON-LD is valid JSON (no trailing commas, proper escaping)
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Unit Tests:** Test JSON-LD generation functions — verify required fields, proper types, URL construction
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-007: FAQ Section Component for Case Study Pages

**Description:** As a site visitor, I want an expandable FAQ section on each case study page so that I can get quick answers to common questions about the project.

**Agents/Skills:** `frontend-expert` agent (accordion component, animations), `seo-content` skill (FAQ content quality review)

**Acceptance Criteria:**
- [ ] FAQ section component renders below the Impact section on each case study page
- [ ] Section heading: "Frequently Asked Questions" with `h2` tag
- [ ] Each FAQ item is collapsible (accordion pattern):
  - Question visible by default (clickable)
  - Answer hidden by default, expands on click
  - Smooth expand/collapse animation (Framer Motion `AnimatePresence`)
  - Chevron or `+`/`-` indicator rotates on toggle
- [ ] Only one FAQ item expanded at a time (accordion behavior, not independent toggles)
- [ ] FAQ content comes from the case study's `faqs` field in the JSON data
- [ ] Answer text uses answer-first format: direct statement in the first sentence, elaboration after
- [ ] Component is reusable — accepts `faqs: { question: string; answer: string }[]` prop
- [ ] If an existing FAQ component exists in the codebase, extend it rather than creating a duplicate
- [ ] Accessible: keyboard navigable, `aria-expanded`, `aria-controls` attributes
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test accordion toggle state, only-one-open behavior, prop rendering
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-008: Related Case Studies Component

**Description:** As a site visitor, I want to see related case studies at the bottom of each page so that I can explore similar projects without returning to the index.

**Agents/Skills:** `frontend-expert` agent (card grid component, animations)

**Acceptance Criteria:**
- [ ] Related Case Studies component renders a section with heading "Related Case Studies" (`h2`)
- [ ] Displays 3 cards in a responsive grid (1 col mobile, 3 col desktop)
- [ ] Cards are the same component used on the index page (reuse, not duplicate)
- [ ] Related case studies are determined by the `relatedCaseStudies` slugs in the JSON data
- [ ] If a related slug doesn't resolve to a valid case study, it is silently skipped
- [ ] If fewer than 3 related case studies exist, show however many are available
- [ ] Cards link to `/case-studies/[slug]`
- [ ] FadeIn scroll animation on section entrance
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-009: Update ProofOfWork Section to Link to Case Study Pages

**Description:** As a site visitor on the main landing page, I want to click through from the ProofOfWork cards to detailed case studies so that I can learn more about specific projects.

**Agents/Skills:** `frontend-expert` agent (component updates, Link integration)

**Acceptance Criteria:**
- [ ] `ProofOfWork.tsx` updated: cards with matching case studies become `<Link>` components:
  - "Egocentric Video Capture" → `/case-studies/egocentric-video-collection`
  - "Game Environment Capture" → `/case-studies/game-based-data-capture`
  - "Multi-Modal Annotation" → `/case-studies/fashion-ai-annotation`
- [ ] Cards without a matching case study ("Manipulation Trajectory Data", "Synthetic Data Pipelines") remain static (no link)
- [ ] Linked cards display a "Read case study →" text link at the bottom of the card (monospace, accent color, same style as the existing "Explore our full data catalog" link)
- [ ] The `projects` data array gains an optional `caseStudySlug` field
- [ ] Bottom section link updated: "Explore our full data catalog" → links to `/case-studies` instead of `#contact`
- [ ] Hover behavior unchanged — lift + glow + TextScramble still work on linked cards
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser (main landing page)
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-010: Add Case Studies to Site Navigation (Header + Footer)

**Description:** As a site visitor, I want to see Case Studies in the main navigation so that the section is discoverable from any page.

**Agents/Skills:** `frontend-expert` agent (Header/Footer updates)

**Acceptance Criteria:**
- [ ] "Case Studies" added to `Header.tsx` `navLinks` array: `{ href: "/case-studies", label: "Case Studies" }`
- [ ] Nav order: Training Data, Expert Labeling, Case Studies, Work With Us, [Book a Call CTA]
- [ ] Appears in both desktop nav and mobile menu
- [ ] "Case Studies" added to `Footer.tsx` in the appropriate link section
- [ ] Active state: nav link highlighted when on `/case-studies` or `/case-studies/*` routes
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser (desktop + mobile)
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-011: Internal Linking — Add Case Study Callouts to Pillar Pages

**Description:** As an SEO system, I need bidirectional internal links between case studies and pillar pages so that authority flows between the two content types.

**Agents/Skills:** `on-page` skill (internal link audit), `seo-content` skill (anchor text optimization), `frontend-expert` agent (callout component)

**Acceptance Criteria:**
- [ ] Each pillar page that has a matching case study includes a callout block linking to the case study:
  - `/pillars/acquire` pages: link to egocentric-video-collection, game-based-data-capture, data-engine-world-models, workplace-egocentric-data
  - `/pillars/enrich` pages: link to fashion-ai-annotation, object-identity-persistence, video-content-classification
  - `/pillars/validate` pages: link to generative-ai-safety, video-model-evaluation, prompt-enhancement-benchmark
- [ ] Callout block is a reusable component with: case study title, headline stat, 1-line teaser, and "Read case study →" link
- [ ] Callout appears contextually within the pillar page content (not just appended at the bottom)
- [ ] Anchor text is descriptive and keyword-rich (e.g., "See how we collected 1,000+ hours of egocentric video" not "click here")
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

---

### US-012: Playwright E2E Tests — Case Studies Section

**Description:** As QA, I need end-to-end tests verifying that a user can browse case studies, filter by category, view individual pages, and that all structured data is present.

**Agents/Skills:** `webapp-testing` skill (Playwright test creation)

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/case-studies.spec.ts`
- [ ] Test flow — Index Page:
  1. Navigate to `/case-studies`
  2. Verify page title and heading render
  3. Verify all 10 case study cards are displayed (when "All" filter is active)
  4. Click a category filter pill (e.g., "Annotation"), verify only matching case studies show
  5. Click "All" filter, verify all cards return
  6. Verify each card displays: category badge, headline stat, title, teaser, arrow link
- [ ] Test flow — Individual Page:
  7. Click a case study card, verify navigation to `/case-studies/[slug]`
  8. Verify breadcrumbs render (Home > Case Studies > [Title])
  9. Verify hero section: title, category badge, headline stat
  10. Verify Quick Summary block renders with Challenge/Solution/Result
  11. Verify Snapshot Bar renders with 3+ metrics
  12. Verify Challenge, What We Built, Results, Impact sections render with content
  13. Verify Results section has 3 stat items
  14. Verify Related Case Studies section renders with 2-3 cards
  15. Verify FAQ section renders with 3+ expandable items
  16. Click an FAQ item, verify it expands to show answer
  17. Verify CTA section renders with "Book a Call" button
- [ ] Test flow — Structured Data:
  18. Extract all `<script type="application/ld+json">` tags from the page
  19. Parse and verify Article schema has required fields: headline, datePublished, author
  20. Parse and verify FAQPage schema has mainEntity with Question items
  21. Parse and verify BreadcrumbList schema has 3 items
- [ ] Test flow — ProofOfWork Integration:
  22. Navigate to `/` (main landing page)
  23. Scroll to ProofOfWork section
  24. Verify "Egocentric Video Capture" card links to `/case-studies/egocentric-video-collection`
  25. Verify "Explore our full data catalog" links to `/case-studies`
- [ ] Test flow — Navigation:
  26. Verify "Case Studies" link exists in Header nav
  27. Click it, verify navigation to `/case-studies`
- [ ] Test uses Page Object Model pattern for maintainability
- [ ] Test runs successfully: `npx playwright test tests/e2e/case-studies.spec.ts`
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent on test file
- [ ] **Commit** after review passes

---

## Functional Requirements

- **FR-01:** `/case-studies` page renders a filterable grid of all 10 case study cards
- **FR-02:** `/case-studies/[slug]` pages are statically generated via `generateStaticParams` with full content
- **FR-03:** Each case study page includes Article + FAQPage + BreadcrumbList JSON-LD schema
- **FR-04:** Each case study page includes OG and Twitter meta tags for social sharing
- **FR-05:** SEO meta titles are under 60 characters; meta descriptions are under 155 characters with primary keyword + quantitative result
- **FR-06:** FAQ section on each case study page uses answer-first format and renders as an accordion
- **FR-07:** Related Case Studies section displays 2-3 linked cards at the bottom of each page
- **FR-08:** Internal links from each case study to its primary pillar page and from pillar pages back to case studies
- **FR-09:** Case study data stored as JSON files in `src/data/case-studies/`, loaded via server-side utility functions
- **FR-10:** ProofOfWork section on the main landing page links to relevant case study pages
- **FR-11:** "Case Studies" link added to Header and Footer navigation
- **FR-12:** Category filter on `/case-studies` filters cards client-side without page reload
- **FR-13:** All pages use shared Header (with `opaque` prop) and Footer components
- **FR-14:** All pages match existing dark terminal aesthetic (near-black bg, sage green accents, JetBrains Mono, TextScramble effects)
- **FR-15:** Breadcrumbs rendered in UI and in BreadcrumbList schema on every case study page
- **FR-16:** 404 returned for invalid case study slugs
- **FR-17:** Content tone: no marketing fluff, concrete methodology, technical vocabulary, real numbers from source docs

---

## Non-Goals

- No CMS or external content management — case studies are static JSON files checked into the repo
- No comments, ratings, or user-generated content on case study pages
- No PDF download or print-optimized view at launch
- No video embeds at launch (images only)
- No A/B testing infrastructure for case study pages
- No analytics event tracking beyond standard page views (future phase)
- No automated case study generation from Notion — manual JSON authoring for now
- No HubSpot or external form integration — CTA links to existing `#contact` section or `/contact`

---

## Design Considerations

- **Visual aesthetic:** Must match existing site — dark bg (`#050505`), sage green accent (`#92B090`), monospace fonts (JetBrains Mono), ASCII-influenced elements
- **Existing components to reuse:** Header, Footer, Button, FadeIn, TextScramble, existing card patterns from ProofOfWork.tsx
- **New components needed:**
  - `CaseStudyCard` — used on both index page and Related Case Studies section
  - `CategoryFilter` — pill-based filter bar for the index page
  - `QuickSummary` — terminal-style TL;DR block
  - `SnapshotBar` — inline horizontal stat bar
  - `StatGrid` — 3-column results display with large monospace numbers
  - `CaseStudyFAQ` — accordion FAQ component (or extend existing FAQ component if one exists)
  - `CaseStudyCTA` — bottom call-to-action section
  - `Breadcrumbs` — reusable breadcrumb component
  - `PillarCallout` — callout block for embedding case study links in pillar pages
- **Animations:** Framer Motion for component-level transitions, FadeIn for scroll-triggered reveals, TextScramble on headings
- **Mobile-first:** Cards stack to single column, filter pills scroll horizontally, stat grids stack vertically, content sections full-width

---

## Technical Considerations

- **Static generation:** Case study pages use `generateStaticParams` reading from `src/data/case-studies/*.json` — same pattern as existing job board
- **Build performance:** Only 10 static pages at launch. Minimal build time impact.
- **Image optimization:** Use Next.js `<Image>` component for all case study images with proper `width`, `height`, and `alt` attributes
- **Data loading pattern:** Server Components read JSON from disk at build time. No client-side data fetching needed.
- **Reusable components:** The `CaseStudyCard` component should accept a `CaseStudy` prop and be usable in both the index grid and the Related Case Studies section
- **Schema validation:** Validate JSON-LD output against Google's Rich Results Test before launch
- **Category filter state:** Managed with React `useState` on the client. URL search params optional (nice-to-have, not required).
- **Accessibility:** All interactive elements (filter pills, FAQ accordions, card links) must be keyboard-navigable with proper ARIA attributes

---

## Success Metrics

- All 10 case study pages indexed by Google within 30 days of launch
- At least 3 case study pages appear in Google search results for their target keywords within 60 days
- FAQ schema triggers FAQ rich results for at least 2 case studies within 60 days
- Internal linking increases average pages per session by 15%+ (measured via analytics)
- ProofOfWork cards with case study links see higher click-through than static cards
- No build failures from case study data schema violations
- All Playwright E2E tests pass in CI

---

## Open Questions

- Should case study pages include a table of contents / sticky sidebar navigation for longer pages?
- Should we add a "Download as PDF" option for case studies in a future iteration?
- Should the Quick Summary block be visually distinct enough to serve as a standalone social share card?
- Are there additional case studies in the pipeline that should inform the schema design (e.g., fields we might need later)?
- Should category filter state be persisted in URL search params for shareability?
