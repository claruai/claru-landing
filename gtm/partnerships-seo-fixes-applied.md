# Partnerships SEO+GEO Fixes Applied
**Date:** 2026-05-05
**Page:** `/partnerships`
**Audit baseline:** 79/100 (gtm/partnerships-geo-audit.md). Target post-fix: 88+.

## Keyword Research Findings (DataForSEO + Serper)

US Google Ads search volumes for operator-side queries are effectively zero (`monetize security camera footage`, `sell business video to AI`, `get paid for surveillance footage`, `AI training data partner program`, `data licensing for businesses` all returned `vol=None`). Only `data partnership program` returned data: vol=10, comp=LOW, intent=informational. This is bottom-of-funnel buyer-intent vocabulary that hasn't been indexed by the keyword planner yet.

SERP competition (Serper) tells the real story:
- **`sell footage to AI training data`** → GoPro AI Training Program, Versos, Wirestock, Hollywood Reporter — established competitors with branded recognition. Title must compete on framing, not volume.
- **`monetize security camera footage`** → Reolink, Videoloft, BlackHatWorld, Quora — weak competition, mostly guides. Operator-side keyword is winnable.
- **`AI training data partner program`** → AI CERTs, Veeva, FactSet — partner-program framing dominates, supports keyword choice.
- **`data licensing for AI training`** → Stack Overflow, Shutterstock, Lexology — high authority but distinct vertical (corpus licensing, not operator footage).

Decision: **Lead the title with "Get Paid For Your Footage"** (recognition trigger that matches GoPro/Wirestock framing) and use the long-tail operator keywords for keyword meta. Keep "Claru Partnerships" as branded suffix.

## Exact Metadata Shipped

```
<title>Get Paid For Your Footage — Claru Partnerships</title>  (49 chars)
<meta name="description" content="Cafes, factories, farms, fleets, retail — frontier AI labs pay for footage of real work. License your archive, get paid to capture, or co-supply. Net-15.">  (152 chars)
<meta name="keywords" content="monetize security camera footage,sell business video to AI,get paid for surveillance footage,data licensing for businesses,AI training data partner program,sell footage to AI companies,license footage to AI labs,AI data partnership,data partnership program,sell training data to AI,get paid for video footage,AI training data buyer">  (12 keywords)
og:image = https://claru.ai/og/partnerships
twitter:image = /og/partnerships
```

## Schema Delta Summary

`PartnershipsContent.tsx` JSON-LD blocks:

1. **Service** — added `@id`, rewrote description to operator-side framing (kitchens/lines/floors/fields/bays/registers, removed "egocentric/synthetic/robotics/vision-multimodal").
2. **AggregateOffer + priceSpecification** — wrapped Service.offers with $5K–$50K archive-license PriceSpecification + $40–$120/hr UnitPriceSpecification (HUR unit code).
3. **hasOfferCatalog** — added OfferCatalog with 3 named Offer items: `#archive-license`, `#paid-capture`, `#co-supply`. Each carries its own priceSpecification + url.
4. **HowTo** — rewrote step copy to operator framing; added `url` to all 3 steps (was missing on step 2 + 3).
5. **NEW ItemList** — `verticalsItemListJsonLd` with 6 ListItem→Service entries (Textile & Garment, Auto Mechanic, Agriculture & Harvest, Manufacturing Line, Retail & Hospitality, Cleaning & Janitorial), each with serviceType + description + provider + areaServed.

`Hero.tsx`:
- Removed `TextScramble` wrapper from H1. H1 now renders plain text in SSR with `opacity:1`. Cleaner heading semantics + crawler-readable.

`og/partnerships/route.tsx` (new):
- Edge runtime ImageResponse, 1200×630, bg `#0a0908`, sage accent `#92B090`, JetBrains Mono + Geist Bold, headline + claru.ai/partnerships footer + NET-15 badge.

## Verification curl Outputs

```
$ curl -s http://localhost:3011/partnerships | grep -oE '<h1[^>]*>[^<]*</h1>'
<h1 ...style="...opacity:1;transform:none">Your team already makes the data AI labs are paying for.</h1>

$ curl -s http://localhost:3011/og/partnerships -o /tmp/og.png && file /tmp/og.png
/tmp/og.png: PNG image data, 1200 x 630, 8-bit/color RGBA, non-interlaced  (34KB)

$ # JSON-LD parse check
Found 5 JSON-LD blocks:
  [1] @type=Organization (site-wide layout)
  [2] @type=FAQPage
  [3] @type=Service  name=Claru Data Partnership Program
  [4] @type=HowTo  name=How to become a Claru data partner
  [5] @type=ItemList  name=Workforce verticals Claru is actively buying footage from
All blocks parse cleanly with json.loads().
```

## Files Touched

- `src/app/partnerships/page.tsx` — metadata title/description/keywords + og:image refs
- `src/app/partnerships/PartnershipsContent.tsx` — Service+HowTo rewrite, AggregateOffer+priceSpecification, hasOfferCatalog with 3 Offers, new ItemList JSON-LD
- `src/app/components/sections/partnerships/Hero.tsx` — H1 SSR fix (removed TextScramble wrapper, opacity:1)
- `src/app/og/partnerships/route.tsx` — NEW, edge OG image route
