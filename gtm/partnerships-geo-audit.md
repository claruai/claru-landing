# GEO Audit: /partnerships (Supply-Side Operator Page)

**Audit Date:** 2026-05-05
**Target:** http://localhost:3011/partnerships (prod canonical: https://claru.ai/partnerships)
**Page Type:** Supply-side acquisition / partner intake (operators, not vendors)
**Pages Analyzed:** 1 (single-page audit, full DOM + schema + crawler accessibility review)

---

## Executive Summary

**Overall GEO Score: 79/100 (Good — top of band, fixable to 88+)**

The page is unusually well-structured for AI citation: all critical content (headline, three deal types, four fit criteria, eight FAQs, price anchors) is server-rendered into the initial HTML, four schema blocks are embedded (Organization, Service, HowTo, FAQPage), all major AI crawlers (GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Applebot-Extended) are explicitly allowed in robots.txt, and the FAQ answers are written in the exact "named entity + specific number + direct claim" pattern that ChatGPT and Perplexity preferentially quote. The page will rank well for narrow long-tail queries it currently owns.

The biggest gaps are (1) **no Offer/PriceSpecification schema for the $5K–$50K and $40–$120/hr anchors** — those numbers are the most citable strings on the page but live only in prose and free-text Service description, (2) **no Product/Service variants per deal type** (the three "ways we pay you" are described in JSON-LD as one `Service` blob, not three named offerings), and (3) **the WorkforceWall vertical taxonomy** (textile, mechanic, agriculture, manufacturing, retail, cleaning) is plain HTML with no `ItemList`/`Service.serviceType` markup, missing a strong long-tail entity-anchoring opportunity.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 86/100 | 25% | 21.5 |
| Crawler Accessibility / Technical | 88/100 | 15% | 13.2 |
| Schema & Structured Data | 72/100 | 15% | 10.8 |
| Content Patterns (Q&A, definitions, numbers) | 84/100 | 20% | 16.8 |
| Brand Mention Triggers | 70/100 | 15% | 10.5 |
| E-E-A-T / Trust signals | 60/100 | 10% | 6.0 |
| **Overall** | | | **78.8** |

---

## 1. AI Citability Score — 86/100

**How likely to be cited verbatim by ChatGPT, Perplexity, Claude, Gemini, AI Overviews:** High for narrow operator-monetization queries; medium for broad "how do I sell video data" queries.

### Phrases optimized for verbatim citation (high quotability)

These are the strings most likely to appear inside an AI answer with a Claru attribution:

1. **"$5K–$50K for an archive license on existing footage. $40–$120/hr for new capture, paid weekly."** — appears in both prose (DealTypes) and FAQ answer; it is a complete, self-contained, numbered, sourced claim. This is the highest-citability sentence on the page.
2. **"Archive licenses pay on signed agreement, net-15. Paid commission pays weekly via wire, PayPal, or local rail (GCash, DANA, UPI for SEA partners)."** — payment-rail specificity (named entities) is exactly what models like to quote.
3. **"We review every submission within 5 business days."** — short, definitive, repeated three times across HowTo schema, FAQ, and prose. Triple-anchored.
4. **"Frontier labs pay for footage of real work in real environments — kitchens, lines, floors, fields, bays, registers."** — strong noun-cluster that matches operator vocabulary.
5. **"5+ frontier labs buying right now / Net-15 paid on signed license / Weekly payouts for active capture"** — three-stat panel reads as a fact card.

### Sections that are unfindable / weak for AI crawlers

- **Hero H1 ("Your team already makes the data AI labs are paying for")** is wrapped in a `<span class="font-mono">` rendered via `dangerouslySetInnerHTML` from TextScramble's initial `useState(text)`. It IS in the SSR HTML (verified) but the wrapping span and the `opacity:0` initial style is a minor smell — content is parseable but the H1 doesn't read cleanly as a headline. **Score impact: -3.**
- **WorkforceWall blurbs** (textile, auto mechanic, agriculture, etc.) are rendered as `<h3>` + `<p>` but the `<p>` blurb is class `opacity-0 ... group-hover:opacity-100`. Initial HTML *contains* the text, so crawlers see it, but it's hidden visually until hover. Marginal accessibility risk; AI crawlers will still index. **Score impact: -2.**
- **The three "deal type" headlines** ("License what you already have", "Get paid to capture", "Bring your workforce") are direct, scannable Q&A-style claims — **excellent** citability. No fix needed.

### What's missing for higher citability

- No comparison table (deal type × payout × timing × who-it's-for). AI Overviews disproportionately cite tables.
- No definitional block ("What is a data partnership?" / "What is archive licensing?"). Definitions are the #1 cited content type per Princeton GEO study.
- No third-party stats or sources cited. AI models give higher trust scores to pages that themselves cite sources.

---

## 2. Crawler Accessibility — 88/100

### robots.txt — PASS
All five major AI crawlers are explicitly allowed at `/`:
- `GPTBot` — Allow:/  ✓
- `ClaudeBot` — Allow:/  ✓
- `Claude-SearchBot` — Allow:/  ✓
- `Claude-User` — Allow:/  ✓
- `PerplexityBot` — Allow:/  ✓
- `Applebot-Extended` — Allow:/  ✓
- `Google-Extended`, `CCBot`, `Bytespider`, `meta-externalagent` — Disallow (intentional brand-protection posture; consistent with MEMORY.md)

### SSR / initial HTML — PASS
Verified all critical content present in the raw `curl` response (no JS execution required):
- Hero H1 verbatim ✓
- Hero subheadline ✓
- All 6 WorkforceWall titles + blurbs ✓
- All 3 DealTypes titles, headlines, body copy ✓
- All 4 FitCriteria headings + body ✓
- All 8 FAQs (questions + answers) ✓
- Price anchors `$5K–$50K` and `$40–$120/hr` ✓
- "Net-15", "10,000+ collectors", "5+ countries / 100+ cities" ✓

The page is a `"use client"` component but Next.js still server-renders the initial markup — crawlers without JS will see the full page text. This is a major strength versus competitors who client-render their partnerships pages.

### Sitemap — PASS
`/partnerships` is in `/sitemap.xml` with priority 0.9, lastmod 2026-05-06.

### Heading hierarchy — minor issue
Single `<h1>`, then `<h2>` for each section, then `<h3>` for items. Valid and clean. The only oddity: every FAQItem renders an `<h4>` with class `text-white/15` containing `// {number}` — these are decorative numerals being marked up as headings. This dilutes heading semantics. **Score impact: -2.**

### llms.txt — PASS (exists at /llms.txt and /llms-full.txt)
However, the partnerships page is **not currently listed** in `/llms.txt`. Adding a Partnerships entry under a new "Working with Claru" section would be a high-leverage 5-minute fix.

---

## 3. Schema Markup Audit — 72/100

### Schemas present (verified in SSR HTML)

| Schema | Location | Completeness | Notes |
|---|---|---|---|
| `Organization` (site-wide) | layout | 95% | knowsAbout, sameAs, contactPoint all present |
| `WebSite` (site-wide) | layout | 90% | Solid |
| `FAQPage` | partnerships | 100% | All 8 Q&A pairs, perfectly formed |
| `Service` | partnerships | 60% | Generic — see below |
| `HowTo` | partnerships | 85% | 3 steps, position numbers, but step 2 missing `url` and step 3 missing `url` |

### Critical gaps

**1. No `Offer` / `PriceSpecification` for the dollar anchors.**
The headline price ranges ($5K–$50K, $40–$120/hr) are the most-quoted strings on the page but currently live only as plain text and inside a free-text `Service.description`. They should be structured as:

```json
{
  "@type": "Service",
  "name": "Archive License",
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": 5000,
      "maxPrice": 50000,
      "priceCurrency": "USD"
    }
  }
}
```

This is the single highest-impact schema fix. It elevates the price range from prose to a structured fact AI Overviews can render in product cards and "what does X cost" answers.

**2. The three deal types should be three separate Services (or one `Service` with `hasOfferCatalog` containing three Offers).**
Currently a single `Service` named "Claru Data Partnership Program" describes all three deal structures in a prose blob. This loses the entity granularity. Recommend either:
- Three top-level `Service` objects with distinct `@id`s (`#archive-license`, `#paid-capture`, `#co-supply`), OR
- One `Service` with `hasOfferCatalog` → `OfferCatalog` → three `Offer`s, each with its own `priceSpecification` and `description`.

**3. WorkforceWall has no `ItemList` markup.**
Six named verticals (textile, mechanic, agriculture, manufacturing, retail, cleaning) with descriptions are a textbook `ItemList` of `Service` items. Currently zero structured markup. Adding this gives Claru entity-anchoring on six high-traffic vertical queries ("AI training data buyer for cafes", etc.).

**4. HowTo step URLs incomplete.**
Step 2 and Step 3 lack `url` properties. Add `url: "${PAGE_URL}#apply"` to both for consistency.

**5. No `BreadcrumbList`.**
Standard SEO miss; one-line fix.

### Schemas correctly absent
- `Product` is not appropriate (this is a service/marketplace).
- `LocalBusiness` not appropriate (worldwide service area).
- `Review`/`AggregateRating` not appropriate yet (no public reviews to cite — would be deceptive).

---

## 4. Content Patterns Optimized for AI Citation — 84/100

### Patterns AI loves — present
- **Direct Q&A format** (FAQ section): 8 questions, all phrased the way an operator would actually search ("I run a cafe...", "What if my business doesn't already have cameras?"). Excellent.
- **Specific numbers**: $5K–$50K, $40–$120/hr, net-15, 5 business days, ~2 weeks, 10,000+, 100+, 5+. Dense, diverse, citable. Excellent.
- **Named entities**: GCash, DANA, UPI, PayPal, smart-glasses, chest-cam, RLHF (in FAQ#7). Strong proper-noun coverage.
- **Imperative verbs / second-person voice**: "We pay you", "You ship", "We review" — clear actor/action structure that LLMs map cleanly.
- **Short, scannable paragraphs**: Most blocks are 2–4 sentences, each self-contained. AI extractors can lift any single paragraph and have it stand alone.

### Patterns AI loves — missing
- **No comparison/decision table**. The three deal types beg for a table: deal | who it's for | typical $ | timing | inputs needed. AI Overviews use tables disproportionately.
- **No definitional opener**. There is no "What is a Claru data partnership? A Claru data partnership is..." block. This single sentence pattern wins enormous numbers of AI citations.
- **No bulleted lists of qualifying criteria.** FitCriteria uses `<motion.div>` cards instead of `<ul><li>`. Crawlers parse, but bullet-list semantics signal "checklist" to LLMs more strongly.
- **No `<dl><dt><dd>`** for the Stats panel ("5+ frontier labs", "Net-15", "Weekly"). These are textbook definition pairs.
- **No "as of [date]" freshness cues.** AI models prefer content with explicit dates. Adding "Updated [Month YYYY]" near price anchors increases citability.

---

## 5. Brand Mention Triggers — 70/100

When an AI gets a query like *"how do I monetize security camera footage"* or *"where can I sell business video to AI companies"*, what specific phrases on this page trigger Claru as the cited answer?

### Strong triggers (the page will likely surface)

| Likely query | Triggering phrase on page |
|---|---|
| "where can I sell video data to AI companies" | `<title>` "Sell Training Data to AI Labs" + meta description "Claru buys egocentric, synthetic, robotics, and vision data for frontier AI labs" |
| "monetize security camera footage" | FAQ#1 "If you record any of it (security cams, QA cams, training footage, smart-glasses) we'll license the archive" |
| "get paid to record video for AI training" | Hero stat "Weekly payouts for active capture" + DealType #2 "We send the spec. You shoot. We pay weekly" |
| "how much do AI labs pay for training data" | "$5K–$50K for an archive license... $40–$120/hr for new capture" (this is the killer trigger — it's the only price specificity in the answer set) |
| "data partnership for cafes / restaurants / mechanic shops" | FAQ#1 verbatim phrasing + WorkforceWall vertical names |
| "AI training data partner program" | Service schema name "Claru Data Partnership Program" |
| "smart glasses footage buyer" | FAQ#7 "POV smart-glasses and chest-cam capture" |
| "how to license footage to AI labs" | DealType #1 + HowTo schema name "How to become a Claru data partner" |

### Weak / missing triggers

- **"sell drone footage to AI"** — mentioned once in FAQ#7 ("drone, dash, and body-cam footage") but not elevated to a heading or schema item. A drone-specific operator searching this won't see strong anchors.
- **"BPO data partnership" / "regional data collection partner"** — these are FitCriteria #04 but buried in body copy. Should be hoisted into schema and into the WorkforceWall as a 7th tile.
- **"sell teleoperation data" / "robotics data buyer"** — page mentions robotics in DealTypes prose but the WorkforceWall doesn't show a robotics tile. A robotics teleop operator landing here from "robotics data buyer" query will not see immediate fit confirmation.
- **No competitor-comparison phrases** — queries like "Sama vs Scale AI vs Claru data partnership" find nothing on this page that disambiguates Claru from peers. A short comparison block ("Unlike vendors who only buy from labeled-pro pools, Claru buys from operators who already do the work") would create defensible mention triggers.

---

## Quick Wins (in order of leverage)

1. **Add `Offer` + `priceSpecification` to schema** for $5K–$50K and $40–$120/hr. (15 min, single edit to `PartnershipsContent.tsx`.)
2. **Split the single Service into three named Services or one Service with hasOfferCatalog of three Offers.** (20 min.)
3. **Add `ItemList` schema for the six WorkforceWall verticals**, each as a `Service` with `serviceType`. (20 min.)
4. **Add a comparison table** above FAQ: deal | typical $ | timing | who it's for | inputs needed. (30 min copy + render.)
5. **Add a definitional opener** below the hero: "A Claru data partnership is a paid agreement to license existing footage, capture new footage on spec, or co-supply with Claru's workforce." (5 min, single paragraph.)
6. **Add `/partnerships` to `/llms.txt`** under a new "Working with Claru" section with a one-line description. (5 min.)
7. **Fix HowTo step 2 and 3 missing `url` properties.** (2 min.)
8. **Add "Updated May 2026" timestamp** near the price anchor. (2 min.)
9. **Demote decorative `// 01 // 02` numerals from `<h4>` to `<span>`** to clean up heading semantics. (5 min — already a `// 04`, `// 05` mix; pick one.)
10. **Hoist drone, dash-cam, smart-glasses, robotics teleop into named tiles or sub-sections** so each becomes a triggered entity rather than a buried noun. (45 min copy + design.)

---

## Implementation priority

**Week 1 (must-do for AI citability):** items 1, 2, 3, 7, 6 — pure schema/markup fixes, no design impact, immediately raise the score from 79 → 86.

**Week 2 (content depth):** items 4, 5, 8, 9 — copy and small layout, raises score 86 → 90.

**Backlog (when adding the next page rev):** item 10 — content/IA expansion, raises score 90 → 93+.

---

## Files referenced

- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/src/app/partnerships/page.tsx` — metadata
- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/src/app/partnerships/PartnershipsContent.tsx` — schema blocks (faqJsonLd, serviceJsonLd, howToJsonLd) — primary edit target for fixes 1, 2, 3, 7
- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/src/app/components/sections/partnerships/Hero.tsx`
- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/src/app/components/sections/partnerships/WorkforceWall.tsx` — primary edit target for fix 3 (ItemList schema) and fix 10
- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/src/app/components/sections/partnerships/DealTypes.tsx` — copy lives here; consider co-locating per-deal schema
- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/src/app/components/sections/partnerships/FAQ.tsx` — already optimal
- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/src/app/components/sections/partnerships/FitCriteria.tsx`
- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/public/llms.txt` — needs partnerships entry
- `/Users/johnthomas/Desktop/important-coding-projects/claru-landing/public/llms-full.txt` — same
