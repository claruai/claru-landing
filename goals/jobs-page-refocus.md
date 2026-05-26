# Jobs Page Refocus + Geo-Localized Supply Acquisition

**Owner:** John
**Branch:** `careerpagecleanup`
**Status:** Phases 1–4 shipped (foundation + filter + i18n + SEO annotations). Awaiting user decisions on per-game role splits and translation review before final polish.
**Last updated:** 2026-05-26

---

## Completion log (2026-05-26)

| Phase | Item | Status | Notes |
|---|---|---|---|
| 1 | `Job` type extended (`status`, `subcategory`, `targetCountries`, `seo`, `JobLocale`) | ✅ Shipped | `src/types/job.ts` — additive, non-breaking |
| 1 | UTM helper `buildJobsCtaUrl` | ✅ Shipped | `src/lib/tracking/jobs.ts` — mirrors `getCtaUrl` for Reddit ads |
| 1 | All Apply CTAs wired through helper | ✅ Shipped | 4 placements (top, sticky, related, general) on board + detail |
| 1 | CLOSED chip + disabled Apply CTA | ✅ Shipped | Card dimmed + chip; detail shows banner + reroutes to general application |
| 1 | JSON-LD/RSS/noindex rules for closed roles | ✅ Shipped | `JobPosting` removed, `<meta robots noindex>` added, excluded from `/jobs/feed.xml` |
| 1 | 38 roles flipped to `status='closed'`, 14 remain `open` | ✅ Shipped | `scripts/flip-jobs-closed.ts` — re-runnable, idempotent |
| 1 | Open roles' past `validThrough` auto-extended +90 days | ✅ Shipped | Same script, prevents Google Jobs expired flag |
| 2 | `targetCountries` populated on 14 open roles | ✅ Shipped | `scripts/populate-job-metadata.ts` — re-runnable |
| 2 | Country dropdown filter | ✅ Shipped | Multi-select, locale-aware default, in board chrome |
| 3a | `ItemList` + `FAQPage` JSON-LD on `/jobs` (all 3 locales) | ✅ Shipped | `src/lib/jobs-jsonld.ts` — FAQ Q&A translated for es-MX + pt-BR |
| 3b | Hreflang on `/jobs` + `/jobs/[slug]` + locale variants | ✅ Shipped | `src/lib/jobs-hreflang.ts` — emits en, es-MX, pt-BR, x-default |
| 3c | `/es-mx/jobs` route tree | ✅ Shipped | layout, page, `[slug]/page`, localized JobPosting w/ `inLanguage: es-MX` |
| 3c | `/pt-br/jobs` route tree | ✅ Shipped | layout, page, `[slug]/page`, localized JobPosting w/ `inLanguage: pt-BR` |
| 3c | UI chrome translations (hero, filters, CTAs, status, country labels, count line, empty state, general CTA) | ✅ Shipped | `src/lib/jobs-i18n.ts` |
| 3c | Locale-aware UTM (`utm_term=<locale>`) on every Apply CTA | ✅ Shipped | Verified end-to-end via curl + Playwright |
| 4 | `seo.primaryKeyword` + `seo.locales.en` on 14 open roles | ✅ Shipped | DataForSEO volumes mapped per role (see §4.1) |
| 4 | `subcategory` tags on egocentric (`commercial-*` / `residential-*`) + gameplay (`capture` / `annotation` / `qa`) | ✅ Shipped | Umbrella-roles-with-sub-tags approach per Open Q #2 |

### Verified end-to-end on dev server (port 3010)

- `/jobs`, `/es-mx/jobs`, `/pt-br/jobs` → 200, locale-correct title + hero + country default + chrome strings
- Hreflang link tags emitted on all three locales with full 4-entry matrix (en, es-MX, pt-BR, x-default)
- Detail pages: JobPosting JSON-LD on open roles with locale-correct `inLanguage`, omitted on closed roles, `noindex` meta on closed
- Apply CTAs carry `utm_campaign=<slug>` + `utm_content=apply_<placement>` + `utm_term=<locale>`, verified across all 3 locales
- `/jobs/feed.xml` returns exactly 14 items (open-only)
- CLOSED chip + dimmed card rendering verified via Playwright on /jobs and /es-mx/jobs (Spanish "Cerrada" chip)

### Decisions that were locked during build (overriding the original Open Questions)

1. **Egocentric sub-taxonomy** → went with umbrella-roles-with-sub-tags (Open Q #2 option B). Kept the 6 existing video-capture roles, added `subcategory` tag (commercial-retail, residential-kitchen, etc.). No new role files yet.
2. **Translation source** → for chrome strings (hero/filters/CTAs/FAQ/closed messaging), translations are hand-authored in `src/lib/jobs-i18n.ts` + `src/lib/jobs-jsonld.ts`. **Role title + description bodies remain in English** with a banner saying so on non-en detail pages. This is the deferred translation work — see §Pending below.
3. **`validThrough` for open roles** → auto-extended +90 days when in the past, so Google Jobs won't mark roles as expired.

### Pending — gated on user input or follow-up work

- **Per-game role files** (Open Q #1): final game list still needs sign-off. The current 8 gaming roles cover annotation/capture/QA generically; per-game splits (Fortnite, Minecraft, CS2, Roblox, Valorant, GTA) are not yet separate JSON files. Recommendation: build these after first traffic data lands on the locale routes — DataForSEO showed near-zero per-game query volume, so it's an AEO/PR play rather than a search play.
- **Role title + description translation for es-MX + pt-BR.** Banner currently tells candidates English bodies are temporary. Options: human translator (highest quality), LLM-assisted with native review (faster), or skip and let the banner stand. Recommend LLM-assisted + native QA on a per-role basis once traffic justifies it.
- **`seo.locales['es-MX']` and `seo.locales['pt-BR']`** entries on each role — not yet populated. Phase 4 only locked English keyword targets. Run DataForSEO pulls for the Spanish/Portuguese long-tails per role and run `scripts/populate-job-metadata.ts` with the new mappings.
- **`/sitemap.xml` update.** Verify whether the existing sitemap generator picks up `/es-mx/jobs/*` and `/pt-br/jobs/*` automatically (it's a Next route, so probably yes — should be confirmed before deploy).
- **Search Console hreflang validation.** Must wait until deploy; pre-deploy verification is unreliable.
- **Competitor comparison pages** (`/vs/outlier`, `/alternativa-remotasks-mexico`, `/alternativa-appen-brasil`) — flagged in §5; separate scope.

---

## 1. Goal

Refocus `/jobs` on Claru's two active supply needs — **egocentric video capture** (commercial + residential) and **gameplay capture/annotation** (with per-game splits for high-volume titles) — and turn the page into a supply-acquisition surface that pulls qualified applicants from the US, Mexico, and Brazil via localized SEO/AEO/GEO. Add a country filter, per-role UTM attribution on every Apply click, and a `CLOSED` state for the 38 roles outside this focus.

## 2. Why now

- Active supply demand is concentrated in egocentric capture and per-game gameplay capture.
- 38 of 52 listed roles are not actively hiring, diluting the page's signal and creating an "expired listing" SEO risk over time.
- Three audience markets where we have no localized acquisition surface (US English, Mexico Spanish, Brazil Portuguese), despite >50K/mo combined Portuguese search volume on adjacent intent ("ganhar dinheiro jogando" alone = 22,200/mo).
- Zero attribution today on Apply clicks — we cannot tell which role drives signups.

---

## 3. Scope

### 3.1 Open roles (~14, refactored)

**Egocentric capture** — split by `subcategory`:
- **Commercial**: retail, restaurant/QSR, warehouse, office, hospitality
- **Residential**: kitchen/cooking, household chores, garage/workshop, indoor activity, garden/outdoor
- Decision pending: one role per sub-vertical (10 roles, stronger per-keyword targeting) vs. two umbrella roles with sub-tags (cleaner UX).

**Gameplay** — per-game splits for high-volume titles (locked during discovery):
- Working set: Fortnite, Minecraft, Counter-Strike 2, Roblox, Valorant, GTA
- Plus "gameplay capture" and "game annotation" umbrella roles

### 3.2 Closed roles (~38)

Categories: RLHF, red-teaming, coding-review, vision-annotation, quality-review, generic data-labeling.

Closed behavior:
- Card visible with `CLOSED` chip, Apply CTA disabled
- Detail page accessible but `JobPosting` JSON-LD removed
- `<meta name="robots" content="noindex">` on closed detail pages
- `validThrough` backdated to today
- Omitted from `/jobs/feed.xml` RSS

This signals "we run this kind of work" without triggering Google Jobs expired-listing errors.

### 3.3 Taxonomy changes (`src/types/job.ts`)

- `JobCategory` → two top categories: `egocentric-capture`, `gameplay`
- New `subcategory` field:
  - `egocentric-capture` → `commercial-retail | commercial-restaurant | commercial-warehouse | commercial-office | commercial-hospitality | residential-kitchen | residential-household | residential-garage | residential-indoor | residential-garden`
  - `gameplay` → `<game-slug>` + `annotation` + `qa`
- New `status: 'open' | 'closed'` field (deprecates `archived` for our use)
- New `targetCountries: string[]` field (ISO-3166) for the country filter
- New `seo: { primaryKeyword: string; locales: Record<string, { keyword: string; monthlySearchVolume: number }> }` field — every open role carries its keyword target as a first-class data attribute

### 3.4 Localization

| Locale | Route | Audience |
|---|---|---|
| `en` | `/jobs` | US + Canada |
| `es-MX` | `/es-mx/jobs` | Mexico + Spanish LATAM |
| `pt-BR` | `/pt-br/jobs` | Brazil |

Translated: hero, filter pills, role titles, role descriptions, FAQs, CTAs. `hreflang` cross-linking on `/jobs` and every `/jobs/[slug]`. Localized `JobPosting` schema per locale.

Pay stays in **USD across all locales** (single source of truth, contracts are USD; FX/local-currency display dropped from scope).

### 3.5 Country filter

- Dropdown on the filter bar — multi-select, sits next to category pills
- Drives client-side filter against `targetCountries`
- Default value derives from locale (`en` → US/CA, `es-MX` → MX, `pt-BR` → BR), user can override
- Locale ≠ country (a Mexican applicant could land on `/jobs` in English and still want roles open to MX)

### 3.6 Attribution

- Every Apply CTA routes through `getJobsCtaUrl(job, placement, locale)` mirroring `src/lib/tracking/reddit.ts:80`
- UTM scheme:

```
utm_source   = jobs
utm_medium   = organic
utm_campaign = <job.slug>
utm_content  = apply_<placement>      # placement ∈ {top, sticky, related, general}
utm_term     = <locale>               # en | es-MX | pt-BR
```

- General-application CTA uses `utm_campaign=general-application`
- Reach into `app.claru.ai` to confirm UTMs land in signup attribution before considering this work done

---

## 4. Keyword research (DataForSEO, Google Ads volume)

### 4.1 US English — highest-leverage queries

| Keyword | Monthly vol | Competition | CPC | Notes |
|---|---:|---|---:|---|
| `ai training jobs` | **12,100** | MED | $5.06 | Category-defining term. Trending up (22K Mar, 27K Apr) |
| `make money playing games` | **9,900** | MED | $7.77 | Gaming side-hustle intent, perfect for game pages |
| `outlier ai jobs` | **3,600** | LOW | $5.88 | Direct competitor brand — high-intent steal opportunity |
| `remote ai jobs` | **3,600** | MED | $4.61 | Broad commercial intent |
| `gig work apps` | **3,600** | MED | $4.39 | Adjacent — useful as content topic |
| `get paid to play games` | **2,400** | HIGH | $9.36 | Highest CPC in cluster; very commercial |
| `wearable camera` | **1,900** | HIGH | $0.99 | Egocentric adjacent, product-intent |
| `data labeling jobs` | **1,600** | LOW | $7.15 | Direct category term, low comp = winnable |
| `scale ai jobs` | **1,600** | LOW | $3.88 | Competitor brand |
| `pov video` | 590 | LOW | — | Egocentric adjacent, mostly content-intent |
| `get paid to play video games` | 590 | MED | $4.41 | Long-tail of above |
| `aria glasses` | 390 | LOW | $1.94 | Meta Project Aria — egocentric goldmine |
| `annotation jobs remote` | 210 | MED | $5.59 | Long-tail of "data labeling jobs" |
| `smart glasses video` | 210 | HIGH | $0.89 | Egocentric adjacent |
| `game testing jobs remote` | 140 | LOW | $5.58 | Gaming adjacent |
| `first person video` | 140 | LOW | — | Egocentric core |
| `warehouse video` | 90 | LOW | $3.38 | Commercial egocentric subcategory |
| `data annotation work from home` | 70 | LOW | $3.85 | Trending up |
| `ai data collection jobs` | 50 | LOW | **$6.38** | Highest commercial intent in egocentric cluster |
| `side hustle from phone` | 70 | HIGH | $4.05 | Adjacent content |

**Zero-volume terms** (still useful for AEO citability, not Google ranking): `egocentric video`, `egocentric video dataset`, `first person video data`, `ego4d`, `epic kitchens`, `fortnite gameplay capture`, `cs2 gameplay capture`, `roblox data collection`, `valorant gameplay capture`, `gta gameplay capture`, `gameplay capture jobs`, `ai game data jobs`, `kitchen pov video`, `household video recording job`, `pov video jobs`.

→ **Implication**: Don't chase per-game search volume directly. Per-game pages should target the broader "make money playing games" + "<game>" intent and be discoverable via AEO (AI-engine surfaces describing the work).

### 4.2 Mexico Spanish — highest-leverage queries

| Keyword | Monthly vol | Competition | CPC |
|---|---:|---|---:|
| `trabajo desde casa` | **33,100** | MED | $0.52 |
| `ganar dinero por internet` | **4,400** | HIGH | $2.58 |
| `trabajo remoto sin experiencia` | **2,400** | MED | $0.38 |
| `ganar dinero online` | 260 | MED | $4.17 |
| `remotasks mexico` | 210 | LOW | $0.75 — **brand-gap opportunity** |
| `ganar dinero jugando videojuegos` | 110 | MED | $1.52 |
| `ganar dinero con el celular` | 90 | MED | $1.84 |
| `appen mexico` | 30 | LOW | $0.44 |
| `etiquetador de datos` | 10 | MED | — |
| `trabajo remoto ia` | 10 | MED | $1.27 |

**Zero-volume:** All long-tail Spanish egocentric/POV terms. Local market doesn't search in our niche language — they search broad job/income terms.

→ **Implication**: MX page should anchor on `trabajo desde casa` and `ganar dinero por internet`-shaped framing in the hero, then narrow into the role specifics. Direct keyword targeting of niche egocentric/gameplay terms in Spanish is low-yield.

### 4.3 Brazil Portuguese — highest-leverage queries

| Keyword | Monthly vol | Competition | CPC |
|---|---:|---|---:|
| `trabalho online` | **22,200** | HIGH | $0.56 |
| `ganhar dinheiro jogando` | **22,200** | MED | $3.61 — **massive gaming intent** |
| `ganhar dinheiro online` | **9,900** | HIGH | $1.75 |
| `ganhar dinheiro em casa` | **5,400** | HIGH | $1.60 |
| `ganhar dinheiro com jogos` | 390 | MED | $4.09 |
| `appen brasil` | 210 | LOW | $0.47 — **brand-gap opportunity** |
| `ganhar dinheiro celular` | 170 | MED | $1.81 |
| `anotador de dados` | 20 | LOW | $6.23 |
| `ganhar dinheiro jogando roblox` | 20 | LOW | $0.17 |

→ **Implication**: Brazil is the **single biggest LATAM opportunity** by volume. `ganhar dinheiro jogando` (22.2K/mo) directly maps to our gameplay capture roles. Brazilian Portuguese hero copy should lead with the gaming intent, not generic AI work. Egocentric is secondary in BR.

### 4.4 Competitor SERP — `ai training jobs remote` (US)

Top 5 organic positions:

1. **mindrift.ai** — "AI Training Jobs — Earn $15-$100+/hr from Home." Same playbook as Claru ("Join 10,000+ experts… No AI experience required"). Direct competitor.
2. **rws.com TrainAI** — established enterprise data services player. Long-form community page.
3. **indeed.com** — generic aggregator, hard to displace.
4. **reddit.com r/WFHJobs** — community thread. Organic ranking = strong AEO + trust signal. We should be cited here.
5. **weworkremotely.com** — job aggregator.

SERP features:
- **Google Jobs widget at position 1** — JobPosting JSON-LD is non-negotiable.
- People Also Ask: "Do AI training jobs actually pay?", "Can I work remotely as an AI trainer?", "What jobs can you get with AI training?", "How can I become an AI trainer?" → FAQ JSON-LD targeting these on `/jobs` is high-leverage.
- Related searches: "no experience", "entry level", "no degree", "part time", "worldwide" → these modifiers should appear in role titles and copy.

---

## 5. Per-locale strategy

### 5.1 `en` (US + CA)

**Hero anchor:** `Remote AI Training Jobs — $20–90/hr. Egocentric video capture and gameplay capture for frontier AI labs.`
**Title pattern:** `<Role>` + remote + pay band → schema-rich for Google Jobs.
**FAQ targets:** the four People-Also-Ask questions from §4.4, locale-localized.
**Content gap to fill:** an honest "vs Outlier / vs Mindrift / vs Scale" comparison page (separate scope) since competitor-brand search volume is real (3,600/mo for Outlier alone).

### 5.2 `es-MX` (Mexico + Spanish LATAM)

**Hero anchor:** Lead with `Trabajo desde casa` + `Gana en dólares grabando video o jugando videojuegos para entrenar IA`.
**Don't translate niche jargon literally.** "Egocentric capture" → `Graba en primera persona desde tu día a día`. "Gameplay capture" → `Graba mientras juegas`.
**Brand-gap play:** Light page targeting `remotasks mexico` (210/mo, LOW comp) — "Alternativa a Remotasks en México." Separate scope.
**Pay framing:** in USD, with phrasing like `Paga en USD vía transferencia internacional` since that itself is a draw vs MXN-paying competitors.

### 5.3 `pt-BR` (Brazil)

**Hero anchor:** `Ganhe dinheiro jogando os jogos que você já joga — treinando IA para os principais laboratórios.` Lead with gaming intent (22.2K/mo).
**Egocentric is secondary** in BR — keep the section but don't anchor on it.
**Brand-gap play:** Light page targeting `appen brasil` (210/mo) — "Alternativa ao Appen no Brasil." Separate scope.
**Pay framing:** USD with phrasing `Pagamento em USD via transferência` (huge differentiator vs BRL-paying Brazilian platforms).

---

## 6. AEO / GEO additions

- **ItemList JSON-LD** on `/jobs` index pages (en + es-MX + pt-BR) listing all open `JobPosting` URLs — improves index-discovery and AI engine citability.
- **FAQ JSON-LD** on `/jobs` index per locale, seeded with the People-Also-Ask questions from §4.4.
- **AI-citable answer block** on each role detail (the existing `answerSummary` pattern at `src/app/jobs/[slug]/page.tsx:77` already does this — extend to localized variants).
- **Robots.txt + sitemap**: add `/es-mx/jobs/*` and `/pt-br/jobs/*` to the sitemap; ensure no crawl blocks.
- **Hreflang**: validate via Search Console after deploy — must pass with zero `Alternate page returns 404` errors.

---

## 7. Success criteria

1. Only the ~14 in-scope open roles surface as Open in Google Jobs across en / es-MX / pt-BR.
2. Hreflang validates clean in Search Console.
3. Country filter works in all three locales; switching locale swaps copy and default country.
4. Every Apply click on `app.claru.ai/signup` carries `utm_campaign=<slug>` and `utm_term=<locale>` so role-and-locale attribution is queryable downstream.
5. Closed listings render correctly (`CLOSED` chip, disabled CTA, noindex, no JSON-LD, no RSS) — verified in production HTML.
6. Each open role has `seo.locales[locale]` populated with `{keyword, monthlySearchVolume}` from DataForSEO so role keyword targets are auditable in JSON.
7. `ItemList` + `FAQ` JSON-LD passes Google Rich Results Test for all three locale variants.

---

## 8. Open questions to lock during build

1. **Final game list** — confirmed targets are Fortnite, Minecraft, CS2, Roblox, Valorant, GTA based on per-game zero-volume DataForSEO (signals these are AEO/PR plays, not search plays). Are there additional games we run capture for that aren't in this list?
2. **Egocentric sub-taxonomy granularity** — one role per commercial/residential sub-vertical (10 roles, stronger per-keyword targeting) vs. two umbrella roles with sub-tags (cleaner UX, fewer pages).
3. **Translation source** — human translator vs. LLM-assisted with native review. (LLM-assisted seems fine for role descriptions; human review mandatory for hero/legal/FAQ.)
4. **Closed role copy** — what does the closed-state detail page say? Proposed: "This role isn't open right now. Apply generally and we'll match you when projects fit your background."
5. **Sitemap + robots delivery** — does our existing sitemap generator handle locale subdirs, or does this need a new build step?

---

## 9. Explicitly out of scope (this phase)

- FX / local-currency pay display — dropped. Pay shown in USD across all locales.
- Backend signup attribution dashboards — UTMs land at app.claru.ai but downstream reporting is its own project.
- Competitor comparison landing pages (`/vs/outlier`, `/alternativa-remotasks-mexico`, `/alternativa-appen-brasil`) — flagged as adjacent opportunities; separate scope.
- Adding Canada-specific localization (en-CA / fr-CA). English `/jobs` serves Canada.

---

## 10. Source data

DataForSEO Google Ads search volume + Labs keyword data, pulled 2026-05-26. Raw responses captured in this branch's session log. Re-pull cadence: quarterly, or any time we add a new game or sub-vertical to the open set.

Competitor SERP analysis: live SERP fetch for `ai training jobs remote` (US, en), 2026-05-26.
