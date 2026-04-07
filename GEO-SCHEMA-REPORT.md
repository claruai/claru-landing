# GEO Schema & Structured Data Report -- claru.ai

Date: 2026-04-06

## Schema Score: 62/100

| Criterion | Points | Score | Notes |
|---|---|---|---|
| Organization/Person schema present and complete | 15 | 12 | Present with knowsAbout, but only 2 sameAs links; missing founder, address, numberOfEmployees |
| sameAs links (5+ platforms) | 15 | 6 | Only 2 links (GitHub, LinkedIn). Missing Wikipedia, Wikidata, Twitter/X, Crunchbase, YouTube |
| Article schema with author details | 10 | 5 | Author uses @id reference to Organization -- no Person author with individual credentials |
| Business-type-specific schema present | 10 | 8 | FAQPage on all 5 pages; Service on solutions page; SoftwareApplication on models page |
| WebSite + SearchAction | 5 | 3 | WebSite present on all pages via layout. SearchAction is missing |
| BreadcrumbList on inner pages | 5 | 5 | Present on all 4 inner pages audited |
| JSON-LD format (not Microdata/RDFa) | 5 | 5 | All structured data uses JSON-LD exclusively. No Microdata or RDFa detected |
| Server-rendered (not JS-injected) | 10 | 7 | Layout Organization+WebSite block is in `<head>` (server-rendered). Page-level blocks are in `<body>` (still server-rendered via Next.js RSC, not JS-injected) |
| speakable property on articles | 5 | 0 | No speakable property found anywhere |
| Valid JSON + valid Schema.org types | 10 | 7 | All JSON is syntactically valid. Truncated description on glossary page; duplicate Organization on homepage |
| knowsAbout property on Organization/Person | 5 | 5 | Present with 10 topics on the global Organization schema |
| No deprecated schemas present | 5 | 4 | HowTo used on guide pages (rich results deprecated Aug 2023, still useful for AI parsing -- minor flag) |
| **TOTAL** | **100** | **62** | |

---

## Detected Schemas

### 1. Homepage (`/`)

| Block | Schema Type | Format | Location | Status | Issues |
|---|---|---|---|---|---|
| 1 (layout) | Organization + WebSite (`@graph`) | JSON-LD | `<head>` | Valid | See Organization details below |
| 2 (page) | FAQPage | JSON-LD | `<body>` | Valid | 7 Q&A pairs, well-structured |
| 3 (page) | Organization (duplicate) | JSON-LD | `<body>` | **ISSUE** | Duplicate Organization with empty `sameAs: []` and different description. Conflicts with layout Organization. |

**Critical Issue -- Duplicate Organization:** The homepage emits TWO Organization schemas. The layout `<head>` contains a complete Organization (with legalName, sameAs, knowsAbout, contactPoint, logo), while `src/app/page.tsx` line 72-80 adds a second, incomplete Organization with `sameAs: []` and a different description. This creates conflicting entity signals. The second one should be removed.

Source: `/src/app/page.tsx` lines 72-80 (`orgJsonLd` constant)

### 2. Glossary Page (`/glossary/behavioral-cloning`)

| Block | Schema Type | Format | Location | Status | Issues |
|---|---|---|---|---|---|
| 1 (layout) | Organization + WebSite (`@graph`) | JSON-LD | `<head>` | Valid | Same global schema |
| 2 (page) | BreadcrumbList + DefinedTerm + Article + FAQPage (`@graph`) | JSON-LD | `<body>` | Valid with issues | Truncated description |

**Issue -- Truncated Description:** Both the DefinedTerm and Article `description` fields are truncated at 155 characters, ending mid-word: "...but s". This is a data issue in the source file.

Source: `/src/data/programmatic/glossary-deep/behavioral-cloning.ts` line 8

**Good patterns:**
- Uses `DefinedTerm` with `inDefinedTermSet` -- correct for glossary entries
- Article uses `@id` reference to Organization for author/publisher
- BreadcrumbList with 3 levels (Home > Glossary > Term)
- FAQPage with 5 substantive Q&A pairs
- Uses `datePublished` and `dateModified` (set to BUILD_DATE)

### 3. Models Page (`/models/openvla`)

| Block | Schema Type | Format | Location | Status | Issues |
|---|---|---|---|---|---|
| 1 (layout) | Organization + WebSite (`@graph`) | JSON-LD | `<head>` | Valid | Same global schema |
| 2 (page) | BreadcrumbList + Article + FAQPage (`@graph`) | JSON-LD | `<body>` | Valid | Minor: no `image` property on Article |

**Good patterns:**
- Article includes nested `about` with `SoftwareApplication` schema for OpenVLA
- SoftwareApplication includes `creator` Organization and `datePublished`
- FAQPage with 6 detailed Q&A pairs covering technical details
- BreadcrumbList with 3 levels (Home > Models > OpenVLA)

### 4. Compare Page (`/compare/appen-alternatives`)

| Block | Schema Type | Format | Location | Status | Issues |
|---|---|---|---|---|---|
| 1 (layout) | Organization + WebSite (`@graph`) | JSON-LD | `<head>` | Valid | Same global schema |
| 2 (page) | FAQPage + Article + BreadcrumbList + Organization (Claru) + Organization (Appen) + Service (array) | JSON-LD | `<body>` | Valid with issues | Uses JSON array instead of `@graph`; redundant Organization schemas |

**Issue -- Structural inconsistency:** This page uses a JSON array `[...]` instead of the `@graph` pattern used by all other pages. While technically valid JSON-LD, it means each object has its own `@context` declaration instead of sharing one. More importantly, it includes two redundant Organization schemas (minimal Claru and Appen) that don't use `@id` references and cannot be cross-referenced by other schemas on the page.

**Issue -- BreadcrumbList format inconsistency:** This page uses `name` + `item` (as URL string) format for BreadcrumbList items, while all other pages use `item: { @id, name }` object format. Both are valid but the inconsistency is unnecessary.

**Good patterns:**
- Service schema with provider linking to Claru
- Article with publisher logo
- Competitor Organization entity (Appen) declared
- 8 FAQ items

Source: `/src/app/compare/_components/ComparisonPage.tsx` lines 26-129

### 5. Solutions Page (`/solutions/vla-training-data`)

| Block | Schema Type | Format | Location | Status | Issues |
|---|---|---|---|---|---|
| 1 (layout) | Organization + WebSite (`@graph`) | JSON-LD | `<head>` | Valid | Same global schema |
| 2 (page) | BreadcrumbList + Service + FAQPage (`@graph`) | JSON-LD | `<body>` | Valid | Clean implementation |

**Good patterns:**
- Service schema with `serviceType`, `areaServed`, `provider` (@id reference), `dateModified`
- BreadcrumbList with 3 levels (Home > Solutions > VLA Training Data)
- FAQPage with 5 detailed Q&A pairs
- Uses `@id` reference for provider, linking to global Organization

---

## Validation Results

### Global Organization Schema (layout.tsx)

| Property | Status | Value |
|---|---|---|
| `@type` | PASS | Organization |
| `@id` | PASS | https://claru.ai/#organization |
| `name` | PASS | Claru |
| `legalName` | PASS | Reka AI Inc. |
| `url` | PASS | https://claru.ai |
| `logo` | PASS | ImageObject with url, width, height, caption |
| `description` | PASS | Present, descriptive |
| `foundingDate` | WARN | "2024" -- should be ISO 8601 (e.g., "2024-01-01") |
| `contactPoint` | PASS | ContactPoint with email and contactType |
| `sameAs` | WARN | Only 2 links -- need 5+ for strong entity recognition |
| `knowsAbout` | PASS | 10 topics |
| `founder` | MISSING | No founder Person schema |
| `address` | MISSING | No PostalAddress |
| `numberOfEmployees` | MISSING | Not present |
| `areaServed` | MISSING | Not present |

### Global WebSite Schema (layout.tsx)

| Property | Status | Value |
|---|---|---|
| `@type` | PASS | WebSite |
| `@id` | PASS | https://claru.ai/#website |
| `url` | PASS | https://claru.ai |
| `name` | PASS | Claru |
| `description` | PASS | Present |
| `publisher` | PASS | @id reference to Organization |
| `potentialAction` (SearchAction) | MISSING | No SearchAction defined |

### Article Schema (glossary, models, compare)

| Property | Glossary | Models | Compare |
|---|---|---|---|
| `headline` | PASS | PASS | PASS |
| `description` | FAIL (truncated) | PASS | PASS |
| `author` | PASS (@id ref) | PASS (@id ref) | PASS (inline Org) |
| `publisher` | PASS (@id ref) | PASS (@id ref) | PASS (inline Org with logo) |
| `datePublished` | PASS | PASS | PASS |
| `dateModified` | PASS | PASS | PASS |
| `mainEntityOfPage` | PASS | PASS | PASS |
| `image` | MISSING | MISSING | MISSING |
| `speakable` | MISSING | MISSING | MISSING |

### FAQPage Schema (all pages)

| Property | Homepage | Glossary | Models | Compare | Solutions |
|---|---|---|---|---|---|
| Valid `@type` | PASS | PASS | PASS | PASS | PASS |
| Question/Answer pairs | 7 | 5 | 6 | 8 | 5 |
| All answers non-empty | PASS | PASS | PASS | PASS | PASS |

### BreadcrumbList Schema (inner pages)

| Page | Levels | Format | Status |
|---|---|---|---|
| /glossary/behavioral-cloning | 3 | `item: { @id, name }` | PASS |
| /models/openvla | 3 | `item: { @id, name }` | PASS |
| /compare/appen-alternatives | 3 | `name + item (string)` | PASS (inconsistent format) |
| /solutions/vla-training-data | 3 | `item: { @id, name }` | PASS |

---

## Missing Recommended Schemas

| Schema | Priority | Where | Notes |
|---|---|---|---|
| SearchAction on WebSite | Medium | layout.tsx | Enables sitelinks search box. Site may not have search, but including it signals completeness |
| `image` on Article schemas | High | programmatic-jsonld.ts, ComparisonPage.tsx, content-page-jsonld.ts | Google strongly recommends image for Article schema |
| `speakable` on Article schemas | Medium | All article pages | Signals which content is best for AI voice/citation extraction |
| Person author schema | High | Currently all articles use Organization as author | Individual author with credentials (sameAs, jobTitle, knowsAbout) is a stronger E-E-A-T signal |
| `founder` on Organization | Medium | layout.tsx | Strengthens entity credibility |
| `address` on Organization | Low | layout.tsx | Physical address adds trust signals |

---

## sameAs Audit

| Platform | URL | Status |
|---|---|---|
| GitHub | https://github.com/claruai | Present |
| LinkedIn | https://www.linkedin.com/company/claruai | Present |
| Wikipedia | Not found | **MISSING** -- highest authority entity link |
| Wikidata | Not found | **MISSING** -- machine-readable entity identifier |
| Twitter/X | Not found | **MISSING** -- should be added when account exists |
| YouTube | Not found | **MISSING** |
| Crunchbase | Not found | **MISSING** -- important for startup entity recognition |
| Facebook | Not found | MISSING |
| Instagram | Not found | MISSING |

**Recommendation:** Add at minimum Crunchbase and Twitter/X profiles to sameAs. Create a Wikidata entry for Claru to establish machine-readable entity identity. The current 2 sameAs links are well below the recommended 5+ minimum for strong entity recognition.

---

## Issues Summary (Priority Order)

### HIGH Priority

1. **Duplicate Organization on homepage** -- `src/app/page.tsx` lines 72-80 creates a second, weaker Organization schema with `sameAs: []` that conflicts with the complete layout-level Organization. Remove the `orgJsonLd` constant and its `<script>` tag.

2. **Truncated description on glossary pages** -- `behavioral-cloning.ts` line 8 has a metaDescription cut off at 155 chars mid-word. This propagates into both the DefinedTerm and Article description fields. Audit all 100 glossary-deep data files for similar truncation.

3. **Missing `image` on all Article schemas** -- Google requires or strongly recommends `image` for Article. None of the 77+ pages with Article schema include an image property. Add the OG image URL as the Article image.

4. **Only 2 sameAs links** -- Entity recognition across AI platforms requires 5+ sameAs links. Add Crunchbase, Twitter/X, and create Wikidata entry.

### MEDIUM Priority

5. **No SearchAction on WebSite** -- The WebSite schema in layout.tsx has no `potentialAction` SearchAction. If the site has search functionality, add it; if not, consider adding site search.

6. **No speakable property** -- None of the Article schemas include `speakable`, which signals AI assistants which content sections are best for citation.

7. **Structural inconsistency on compare pages** -- ComparisonPage.tsx uses a JSON array instead of `@graph`, and inline Organization objects instead of `@id` references. Refactor to match the `@graph` pattern used everywhere else.

8. **BreadcrumbList format inconsistency** -- ComparisonPage.tsx uses `name` + `item` (string) format while all other pages use `item: { @id, name }` (object) format.

9. **No Person author schema** -- All Article schemas use Organization as author. Adding a Person schema with credentials (jobTitle, sameAs, knowsAbout) would be a stronger E-E-A-T signal.

### LOW Priority

10. **foundingDate format** -- Currently "2024" (valid but vague). Change to ISO 8601 format like "2024-01-15" for precision.

11. **HowTo schema on guide pages** -- Rich results deprecated Aug 2023, but still useful for AI parsing. No action needed unless it causes confusion in testing tools.

12. **Missing `numberOfEmployees`, `areaServed`, `address`** on Organization -- Would strengthen the entity graph but not critical.

---

## Implementation Notes

### Where to fix each issue

1. **Remove duplicate Organization** -- Delete lines 72-80 and the corresponding `<script>` tag in `src/app/page.tsx`
2. **Fix truncated descriptions** -- Audit and fix `src/data/programmatic/glossary-deep/*.ts` files
3. **Add image to Article** -- Update `buildGlossaryDeepJsonLd`, `buildModelJsonLd`, `buildGuideJsonLd`, `buildTaskJsonLd`, `buildAcademicAltJsonLd` in `src/lib/programmatic-jsonld.ts` and `buildJsonLd` in `src/app/compare/_components/ComparisonPage.tsx` and `buildContentPageJsonLd` in `src/lib/content-page-jsonld.ts`
4. **Add sameAs** -- Update `src/app/layout.tsx` line 138-141
5. **Add SearchAction** -- Update WebSite schema in `src/app/layout.tsx` line 155-163
6. **Refactor ComparisonPage JSON-LD** -- Rewrite `buildJsonLd` in `src/app/compare/_components/ComparisonPage.tsx` to use `@graph` pattern with `@id` references

### Testing

- Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Validate with [Schema.org Validator](https://validator.schema.org/)
- Check rendered output with `curl -s https://claru.ai | python3 -c "import sys,re,json; [print(json.dumps(json.loads(b),indent=2)) for b in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>',sys.stdin.read())]"`
