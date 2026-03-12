# SEO / AEO / GEO Optimization — Requirements Document

## Introduction

Claru (https://claru.ai) is a B2B AI training data company built on Next.js 16 with ~82 pages: homepage, 11 case studies, ~50 job postings, 16 pillar/sub-pillar service pages, a data catalog, legal pages, and authenticated portal routes.

Currently only 1 of 82 pages is indexed by Google (the homepage). The site has critical technical SEO gaps — no sitemap existed until recently, robots.txt blocks AI search crawlers, the homepage returns empty HTML to crawlers due to client-side rendering, and ~25 pages lack OG images. Structured data coverage is strong on pillar and case study pages but missing at the root level (no Organization or WebSite schema) and lacks freshness signals (no dateModified anywhere).

This document defines the requirements for a comprehensive SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) overhaul. The scope covers technical fixes, structured data additions, content tweaks for AI citability, and post-deploy verification. It explicitly excludes new content pages (blog/research routes) and focuses on maximizing the existing page inventory.

---

## Requirements

### Requirement 1: robots.txt Crawler Policy

**User Story:** As a site owner, I want robots.txt to allow AI search/citation crawlers while blocking AI training crawlers, so that Claru pages appear in ChatGPT, Perplexity, Claude, and Google AI Overviews without consenting to model training on our content.

#### Acceptance Criteria

1. WHEN a crawler requests /robots.txt THEN the server SHALL return a valid robots.txt file containing a `Sitemap: https://claru.ai/sitemap.xml` directive.
2. WHEN the robots.txt is served THEN it SHALL contain `Disallow` rules for training-only crawlers: `Google-Extended`, `CCBot`, `Bytespider`.
3. WHEN the robots.txt is served THEN it SHALL NOT block search/citation crawlers: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Applebot-Extended`, `Amazonbot`.
4. WHEN the robots.txt is served THEN it SHALL include explicit `Allow: /` rules for `GPTBot`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, and `PerplexityBot` user agents.
5. WHEN the robots.txt is served THEN `Googlebot` and `Bingbot` SHALL NOT be blocked (default allow).
6. WHEN the robots.txt is served THEN authenticated routes (`/portal/*`, `/admin/*`) SHALL be disallowed for all user agents.
7. IF robots.txt is implemented as `src/app/robots.ts` (Next.js convention) THEN it SHALL export a default function returning `MetadataRoute.Robots`.
8. IF robots.txt is a static file in `public/robots.txt` THEN it SHALL be migrated to `src/app/robots.ts` for maintainability.

#### Edge Cases & Validation

- New AI crawlers may emerge after deployment. The robots.txt should be structured so adding new user agents is straightforward (one block per agent).
- Vercel or middleware may override robots.txt — verify the deployed response matches the source file.
- The `meta-externalagent` crawler (Meta's training bot) SHOULD remain blocked.

#### Dependencies

- Requires sitemap.ts to be deployed first (Requirement 1 references the sitemap URL).

---

### Requirement 2: Organization + WebSite JSON-LD Schemas

**User Story:** As a site owner, I want root-level Organization and WebSite structured data so Google Knowledge Graph recognizes Claru as a named entity and AI systems can extract accurate company metadata.

#### Acceptance Criteria

1. WHEN any page on claru.ai is loaded THEN the HTML SHALL contain a `<script type="application/ld+json">` tag in the root layout with an `@graph` array containing both Organization and WebSite schemas.
2. WHEN the Organization schema is present THEN it SHALL include: `@type: Organization`, `name: "Claru"`, `legalName: "Reka AI Inc."`, `url: "https://claru.ai"`, `logo` (absolute URL to the logo image), and `description` matching the canonical company description.
3. WHEN the Organization schema is present THEN it SHALL include a `sameAs` array with URLs to: LinkedIn company page, GitHub org (`https://github.com/claruai`), and any Crunchbase/G2 profiles that exist.
4. WHEN the Organization schema is present THEN it SHALL include a `contactPoint` with `contactType: "sales"` and `email: "team@claru.ai"`.
5. WHEN the WebSite schema is present THEN it SHALL include: `@type: WebSite`, `name: "Claru"`, `url: "https://claru.ai"`.
6. IF the site has no search functionality THEN the WebSite schema SHALL NOT include a `potentialAction` SearchAction (avoid promising functionality that doesn't exist).
7. WHEN the JSON-LD is added to `src/app/layout.tsx` THEN it SHALL be placed inside the `<body>` tag (same pattern as pillar layout schemas).

#### Edge Cases & Validation

- The schema must validate at https://validator.schema.org/ with no errors.
- The `logo` field must be an absolute URL (not relative) — use `https://claru.ai/logo.png` or equivalent.
- If sameAs URLs don't exist yet (e.g., no G2 profile), omit them rather than linking to nonexistent pages. Update the array as profiles are created.

#### Dependencies

- None. Can be implemented independently.
- The `sameAs` URLs feed into Requirement 10 (cross-platform entity consistency).

---

### Requirement 3: llms.txt File

**User Story:** As a site owner, I want an llms.txt file at the site root so AI crawlers and LLM systems can efficiently understand Claru's site structure and content without crawling every page.

#### Acceptance Criteria

1. WHEN a client requests `https://claru.ai/llms.txt` THEN the server SHALL return a plain-text Markdown file following the llms.txt specification.
2. WHEN the llms.txt file is served THEN it SHALL begin with the site name (`# Claru`) and a one-line description: "Purpose-built human annotation data for frontier AI labs."
3. WHEN the llms.txt file is served THEN it SHALL list all major public sections with their URLs and 1-2 sentence descriptions: homepage, case studies (index + individual slugs), jobs (index), data catalog, all 4 pillar landing pages, all 12 sub-pillar pages, for-annotators, and legal pages.
4. WHEN the llms.txt file is served THEN each section entry SHALL use the format: `- [Section Name](URL): Description text`.
5. WHEN the llms.txt file is served THEN it SHALL include a "Company Info" section with: founding context, specialization areas (text, vision, video, robotics), and the canonical company description.
6. IF implemented as a static file THEN it SHALL be placed at `public/llms.txt`.
7. IF implemented as a dynamic route THEN it SHALL be at `src/app/llms.txt/route.ts` returning a `text/plain` Response.

#### Edge Cases & Validation

- The llms.txt spec is emerging and not formally standardized. Follow the format at https://llmstxt.org as the reference.
- When new pages are added (e.g., new case studies, new jobs), llms.txt must be updated. A dynamic route.ts that reads from the same data sources as sitemap.ts is more maintainable than a static file.
- Keep the file under 4000 tokens — it should be a summary, not a full content dump.

#### Dependencies

- None. Can be implemented independently.
- Benefits from sitemap.ts being deployed (same URL inventory).

---

### Requirement 4: Canonical URLs for All Public Pages

**User Story:** As a site owner, I want canonical URLs on every public page so search engines don't treat URL variations as duplicate content and consolidate ranking signals to the correct URL.

#### Acceptance Criteria

1. WHEN any public page is rendered THEN its HTML `<head>` SHALL contain a `<link rel="canonical">` tag pointing to the definitive URL for that page.
2. WHEN canonical URLs are added THEN the following pages SHALL have `alternates.canonical` in their metadata exports: `/data-catalog`, `/labeling`, `/jobs`, `/case-studies`, `/for-annotators`, `/data`, `/privacy`, `/terms`, `/prohibited-use`, `/job-applicant-privacy`.
3. WHEN canonical URLs are specified THEN they SHALL use relative paths (e.g., `"/jobs"`) because `metadataBase` in the root layout resolves them to `https://claru.ai/jobs`.
4. IF a page uses `generateMetadata` for dynamic content (e.g., `/case-studies/[slug]`, `/jobs/[slug]`) THEN the canonical URL SHALL be set within `generateMetadata` using the resolved slug.
5. WHEN canonical URLs are set for dynamic pages THEN they SHALL follow the pattern: `"/case-studies/{slug}"` and `"/jobs/{slug}"`.
6. IF a page is behind authentication (`/portal/*`, `/admin/*`) THEN it SHALL NOT have a canonical URL (these pages should not be indexed).
7. WHEN the `/experiment` page exists THEN it SHALL NOT have a canonical URL (internal testing page, should be noindex).

#### Edge Cases & Validation

- Pages that already have canonical URLs in their layouts (all pillar pages) should not be modified.
- If a page has metadata in both `layout.tsx` and `page.tsx`, the canonical should be in whichever file currently owns the metadata export (Next.js merges them, but duplicates cause confusion).
- Trailing slashes: Verify Vercel's trailing slash configuration. Canonical URLs must match the actual served URL (with or without trailing slash consistently).

#### Dependencies

- Depends on `metadataBase` being set in root layout (already done: `new URL("https://claru.ai")`).

---

### Requirement 5: FAQPage Schema for Homepage and Data Catalog

**User Story:** As a site owner, I want FAQ structured data on high-value landing pages so Claru appears in Google's People Also Ask boxes and AI Overviews extract our answers directly.

#### Acceptance Criteria

1. WHEN the homepage is loaded THEN the HTML SHALL contain a FAQPage JSON-LD schema with 5-8 question-answer pairs about Claru's services.
2. WHEN the homepage FAQ schema is present THEN questions SHALL target high-value search queries including: "What types of AI training data does Claru provide?", "How does Claru ensure annotation quality?", "What makes Claru different from general data annotation vendors?", "What AI modalities does Claru support?", "How does Claru handle data privacy and security?".
3. WHEN the homepage FAQ schema is present THEN each answer SHALL be 40-80 words, self-contained, factually accurate, and written so AI systems can extract them as standalone passages.
4. WHEN the data catalog page is loaded THEN the HTML SHALL contain a FAQPage JSON-LD schema with 3-5 question-answer pairs about the catalog.
5. WHEN FAQ schemas are added to the homepage THEN the JSON-LD SHALL be rendered from a server component (not gated behind `if (!mounted) return null`).
6. IF the homepage FAQ is added to `src/app/layout.tsx` THEN it SHALL be scoped so it only applies to the homepage route, not all pages.
7. IF the homepage FAQ is added via a server wrapper component THEN it SHALL render the `<script type="application/ld+json">` tag unconditionally (no client-side mount guard).

#### Edge Cases & Validation

- The homepage is currently a full `"use client"` component that returns `null` before mount. FAQ JSON-LD must NOT be inside this client boundary — it would be invisible to crawlers.
- Preferred approach: add a homepage-specific layout (`src/app/(home)/layout.tsx`) or inject the schema from the root layout conditionally.
- FAQ answers must not contradict content on other pages. Cross-reference with pillar page FAQ schemas (which already exist on acquire, enrich, prepare, validate layouts).
- Google limits FAQ rich results to 2 visible entries in SERPs but indexes all of them for AI Overviews.

#### Dependencies

- Partially depends on Requirement 6 (Homepage SSR refactor) — if the homepage remains fully client-rendered, the FAQ schema needs a separate server-rendered injection point.

---

### Requirement 6: Homepage SSR Refactor

**User Story:** As a site owner, I want the homepage to render meaningful HTML content server-side so search crawlers and AI systems see real content instead of an empty page.

#### Acceptance Criteria

1. WHEN a crawler or user without JavaScript requests the homepage THEN the server SHALL return HTML containing at minimum: the H1 headline ("Purpose-built data for frontier AI labs"), all section headings, primary CTA text, navigation links, and footer content.
2. WHEN the homepage is refactored THEN `src/app/page.tsx` SHALL be converted from a full `"use client"` component to a server component that renders static content and delegates animations to client child components.
3. WHEN the homepage renders server-side THEN the `if (!mounted) return null` pattern SHALL be removed from the page-level component.
4. WHEN client-side animations are needed THEN they SHALL be implemented as `"use client"` child components that enhance (not replace) the server-rendered content.
5. IF the full server component refactor is too risky for the initial release THEN the `if (!mounted) return null` SHALL be replaced with a static HTML fallback that includes all crawlable text content, and the animated version replaces it after hydration.
6. WHEN the homepage is deployed THEN `curl -s https://claru.ai | grep -i 'purpose-built'` SHALL return a match (proving server-rendered content).
7. WHEN the homepage is deployed THEN there SHALL be no visual regression for users with JavaScript enabled — all animations and effects continue to work after hydration.
8. WHEN the refactor is complete THEN dynamic imports with `{ ssr: false }` for below-the-fold sections (ProblemAgitation, TwoPaths, Origin, etc.) MAY remain, but their loading skeletons SHALL contain semantic text content (not just gray boxes).

#### Edge Cases & Validation

- The `LenisProvider` is currently dynamically imported with `{ ssr: false }`. If the page becomes a server component, Lenis initialization must move to a client child or be conditionally applied.
- `HeroBackground` (canvas animation) must remain client-only — it has no meaningful content for crawlers.
- The `SectionBridge` component contains static text ("So we built something different.") — this should render server-side.
- Framer Motion's `motion` components require `"use client"`. Any section using `motion.*` must be a client component. The server component renders the text; the client component wraps it with animation.
- Test with Google's Rich Results Test and "View Rendered Page" to confirm content appears.
- Hydration mismatches: if the server renders content that the client then replaces, React may throw hydration warnings. Use `suppressHydrationWarning` where necessary, or ensure server and client output match structurally.

#### Dependencies

- Requirement 5 (Homepage FAQ schema) depends on this — FAQ JSON-LD needs a server-rendered injection point.
- This is the highest-impact single fix. The homepage soft 404 is likely the root cause of the 1-of-82 indexing problem.

---

### Requirement 7: Dynamic OG Image Generator

**User Story:** As a site owner, I want every public page to have a branded Open Graph image so shares on LinkedIn, Twitter, Slack, and other platforms show rich visual previews instead of blank cards.

#### Acceptance Criteria

1. WHEN any public page is shared on a social platform THEN the platform SHALL display a branded OG image with page-specific text.
2. WHEN a dynamic OG image is generated THEN it SHALL use the Next.js `ImageResponse` API (from `next/og`) in a route handler or `opengraph-image.tsx` convention.
3. WHEN a dynamic OG image is rendered THEN it SHALL follow Claru's visual identity: dark background (`#0a0908`), sage green accent (`#92B090`), white text (`#FFFFFF`), and JetBrains Mono or Geist Sans font.
4. WHEN a dynamic OG image is rendered THEN it SHALL be 1200x630 pixels (standard OG dimensions).
5. WHEN a dynamic OG image is rendered THEN it SHALL include: the Claru logo or wordmark, the page title, and a short descriptor or category label.
6. WHEN the OG image generator is implemented THEN the following pages SHALL have OG images (currently missing ~25 pages): `/data-catalog`, `/labeling`, `/jobs`, `/case-studies`, all 4 pillar landing pages, all 12 sub-pillar pages, `/data`, `/for-annotators`.
7. WHEN OG images are added THEN each page's metadata SHALL include `openGraph.images` with the correct image URL, `width: 1200`, `height: 630`, and a descriptive `alt` text.
8. WHEN OG images are added THEN each page's metadata SHALL include `twitter.card: "summary_large_image"`.

#### Edge Cases & Validation

- The OG image generator runs at build time (static) or request time (dynamic). For a site with ~82 pages, static generation at build time is preferred for performance.
- If using the `opengraph-image.tsx` file convention, it applies to the route segment and all children. Place it strategically to cover page groups without duplication.
- Font files for `ImageResponse` must be loaded differently than normal Next.js fonts (fetch from public or embed). JetBrains Mono must be loaded as an ArrayBuffer.
- Pages that already have a static OG image (homepage with `/og-image.png`) should keep their existing image unless the dynamic version is strictly better.
- Legal pages (`/privacy`, `/terms`, etc.) can share a single generic OG image — they don't need unique images.
- Validate with https://www.opengraph.xyz/ or Twitter Card Validator after deploy.

#### Dependencies

- None technically, but should be implemented after Requirement 4 (canonical URLs) so OG URLs are consistent.

---

### Requirement 8: dateModified in All Structured Data

**User Story:** As a site owner, I want dateModified fields in all Article and Service structured data so Google and AI systems prioritize our content as fresh and up-to-date.

#### Acceptance Criteria

1. WHEN a case study detail page is loaded THEN its Article JSON-LD schema SHALL include a `dateModified` field in ISO 8601 format.
2. WHEN a case study has a known modification date THEN `dateModified` SHALL reflect that date. IF no separate modification date exists THEN `dateModified` SHALL equal `datePublished`.
3. WHEN a pillar or sub-pillar layout renders a Service JSON-LD schema THEN it SHALL include a `dateModified` field.
4. WHEN `dateModified` is added to Service schemas THEN the value SHALL be a hardcoded ISO date string representing the last substantive content update to that page, updated manually when content changes.
5. IF a build-time date is used as a fallback THEN it SHALL be generated via `new Date().toISOString()` at build time (not runtime, to avoid changing on every request).
6. WHEN dateModified is present THEN it SHALL always be greater than or equal to datePublished (if both exist).

#### Edge Cases & Validation

- Case study data files (JSON in `src/data/case-studies/`) may need a new `dateModified` field added to their schema.
- If the case study data model doesn't support `dateModified`, fall back to `datePublished`.
- Google penalizes fake freshness signals. Do not set `dateModified` to "today" on every build for content that hasn't actually changed. Use static dates that are manually updated.
- Validate with Google Rich Results Test to confirm dateModified appears in parsed structured data.

#### Dependencies

- None. Can be implemented independently across all layout files.

---

### Requirement 9: Question-Form H2 Headings on Pillar Pages

**User Story:** As a content strategist, I want pillar and sub-pillar pages to use question-form H2 headings with answer-first paragraphs so AI Overviews and People Also Ask are more likely to cite Claru's content.

#### Acceptance Criteria

1. WHEN a pillar or sub-pillar page is audited THEN statement-form H2 headings SHALL be identified as candidates for conversion to question form.
2. WHEN a heading is converted THEN it SHALL use natural question phrasing that matches real search queries (e.g., "Our Collection Pipeline" becomes "How does Claru's data collection pipeline work?").
3. WHEN a question-form H2 is present THEN the first 2-3 sentences (approximately 150 words) following it SHALL directly answer the question in a self-contained manner that AI systems can extract as a standalone passage.
4. WHEN headings are updated THEN each pillar page SHALL have a minimum of 2-3 question-form H2s.
5. IF a heading is already effective as a statement or where question form would be awkward THEN it SHALL NOT be changed.
6. WHEN headings are updated THEN the visual styling SHALL remain unchanged — only the text content changes.
7. WHEN headings are updated THEN the corresponding FAQ schemas in layout files SHALL be reviewed for consistency with the new heading text.

#### Edge Cases & Validation

- Not all headings benefit from question form. Section headings like "Our Clients" or "Get Started" should remain as-is.
- The question phrasing should match actual search intent. Use PAA (People Also Ask) queries from Google for the target keywords as a reference.
- Answer-first paragraphs must still read naturally in the page context — they shouldn't feel like FAQ answers jammed into a narrative page.
- Sub-pillar pages (e.g., `/pillars/enrich/rlhf`, `/pillars/acquire/egocentric-video`) are the highest priority because they target specific long-tail queries.

#### Dependencies

- Should be coordinated with Requirement 5 (FAQ schemas) to avoid contradictions between FAQ answers and H2 answer paragraphs.

---

### Requirement 10: Cross-Platform Entity Consistency

**User Story:** As a marketing lead, I want Claru's company description to be identical across all external platforms so LLMs build a consistent entity graph and confidently cite Claru in responses.

#### Acceptance Criteria

1. WHEN the canonical company description is defined THEN it SHALL be: "Claru provides purpose-built human annotation data for frontier AI labs, specializing in text, vision, video, and robotics modalities."
2. WHEN external profiles are audited THEN the following platforms SHALL have descriptions matching (or closely paraphrasing) the canonical description: LinkedIn company page, GitHub org (claruai), Crunchbase (if profile exists), and any G2/Capterra listings.
3. WHEN the Organization JSON-LD schema is created (Requirement 2) THEN its `description` field SHALL use the canonical description verbatim.
4. WHEN new platform profiles are created (e.g., G2, Capterra) THEN they SHALL use the canonical description and be added to the `sameAs` array in the Organization schema.
5. WHEN entity consistency is verified THEN a reference document SHALL be created listing all platform URLs, current description status, and last-verified date.
6. IF a platform profile does not exist (e.g., no G2 listing) THEN the team SHALL be notified with a recommendation to create it, including the suggested description text.

#### Edge Cases & Validation

- This is a partially manual/external task. The code changes are limited to the Organization schema's `sameAs` array and `description` field.
- Platform descriptions have character limits (LinkedIn: 2000 chars, GitHub org: 160 chars). The canonical description should have short and long variants.
- LLMs weight entities that appear across multiple credible sources. Even partial matches help — the key is consistency in the core positioning ("purpose-built", "frontier AI labs", "human annotation").

#### Dependencies

- Depends on Requirement 2 (Organization schema) for the `sameAs` array and `description` field.

---

### Requirement 11: Post-Deploy GSC Verification

**User Story:** As a site owner, after deploying all SEO changes I want to verify that Google can crawl and index all pages, so I can confirm the optimization work is effective and catch any remaining issues.

#### Acceptance Criteria

1. WHEN all SEO changes are deployed THEN `https://claru.ai/sitemap.xml` SHALL return valid XML containing all public page URLs.
2. WHEN the sitemap is verified THEN its status in Google Search Console SHALL show "Success" (not "Pending" or "Error").
3. WHEN the homepage is inspected via GSC THEN it SHALL NOT report as a soft 404 (confirming Requirement 6 fixed the SSR issue).
4. WHEN URL inspection is run on key pages THEN the following SHALL be confirmed crawlable: homepage, `/case-studies`, `/jobs`, `/data-catalog`, all 4 pillar landing pages.
5. WHEN robots.txt is verified THEN `https://claru.ai/robots.txt` SHALL contain the Sitemap directive and correct crawler policies (confirming Requirement 1).
6. IF any page reports indexing issues THEN the specific error SHALL be documented with a remediation plan.
7. WHEN initial indexing data is available (3-7 days post-deploy) THEN a follow-up report SHALL document: number of indexed pages, any crawl errors, and impressions/clicks if available.
8. WHEN the verification is complete THEN the team SHALL be provided with a checklist of: pages indexed, pages pending, pages with errors, and recommended next actions.

#### Edge Cases & Validation

- GSC indexing is not instant. Initial crawling may take 24-72 hours after sitemap submission. Full indexing of all 82 pages may take 1-2 weeks.
- Some pages may be indexed but show "Discovered - currently not indexed" status. This is normal for new sitemaps and resolves as Googlebot processes the queue.
- If the homepage still shows as soft 404 after deploy, the SSR refactor (Requirement 6) needs debugging — check with `curl` and Google's URL Inspection tool's "View Tested Page" feature.
- Job pages may churn (new jobs added, old ones removed). Verify that the sitemap dynamically includes current jobs and excludes expired ones.

#### Dependencies

- Depends on ALL other requirements being deployed first. This is the final verification step.
- Specifically depends on: Requirement 1 (robots.txt), Requirement 6 (homepage SSR), and the sitemap being live.

---

## Dependency Graph

```
Independent (can start immediately):
  - Req 2: Organization + WebSite JSON-LD
  - Req 3: llms.txt
  - Req 4: Canonical URLs
  - Req 7: Dynamic OG images
  - Req 8: dateModified additions
  - Req 9: Question-form H2s

Sequential dependencies:
  Req 1 (robots.txt) → needs sitemap deployed
  Req 5 (Homepage FAQ) → partially depends on Req 6 (Homepage SSR)
  Req 6 (Homepage SSR) → blocks Req 5 and Req 11
  Req 10 (Entity consistency) → depends on Req 2 (Organization schema)
  Req 11 (GSC verification) → depends on ALL other requirements
```

## Out of Scope

- Blog or research route creation (no new content pages)
- New landing pages or route additions
- Backend form submission (existing TODO, separate workstream)
- Portal/admin SEO (authenticated routes, intentionally noindexed)
- Internationalization or hreflang tags (single-language site)
- Page speed optimization (separate workstream, current performance is acceptable)
