# Session 002 — 2026-04-06

## Summary
Built the complete programmatic SEO infrastructure and first 275 new pages across 10 playbooks targeting physical AI and robotics training data keywords. Started from zero — researched keywords via DataForSEO + GSC, validated competitive landscape, designed architecture, ran adversarial review, then built all waves (0-4) with parallel agents. Pages need depth improvement before deploy.

## What We Built / Changed

### Strategy & Research (Phase 1)
- `tasks/pseo-strategy.md` — v1 strategy document
- `tasks/pseo-strategy-v2.md` — v2 incorporating adversarial review (12 playbooks, 530+ target)
- Keyword validation via DataForSEO API (confirmed: physical AI 3,600/mo, diffusion policy 1,900/mo, VLA model 1,000/mo)
- GSC analysis showing existing rankings (teleoperation data, ego4d alternative, egocentric video)
- Competitive audit of 12 competitors (Scale AI, Encord, Appen, Labelbox, Roboflow, iMerit, V7, Segments.ai, SuperAnnotate, Labellerr)
- Adversarial review scored strategy 6.5/10, prompted v2 with 6 new playbooks

### Infrastructure (Wave 0)
- `src/data/programmatic/types.ts` — unified type system (ProgrammaticPageBase + per-playbook extensions)
- `src/app/components/content/ProgrammaticPageTemplate.tsx` — shared server component template
- `src/lib/programmatic-jsonld.ts` — JSON-LD for glossary/guide (DefinedTerm, HowTo, FAQPage)
- `src/lib/wave3-jsonld.ts` — JSON-LD for dataset/format/industry
- `src/lib/wave4-jsonld.ts` — JSON-LD for lab/benchmark
- 10 registries with build-time validation (one per playbook)
- Sitemap updated with ALL new routes (Codex MCP verified)
- Glossary index page updated to link to deep pages
- Guides hub page created (`/guides`)

### Content Pages (Waves 1-4) — 275 new data files

| Playbook | Route | Count | Files |
|----------|-------|-------|-------|
| Glossary Deep | `/glossary/[term]` | 70 | `src/data/programmatic/glossary-deep/*.ts` |
| How-To Guides | `/guides/[topic]` | 40 | `src/data/programmatic/guides/*.ts` |
| Task Pages | `/training-data/[task]` | 30 | `src/data/programmatic/tasks/*.ts` |
| Model-Specific | `/models/[model]` | 25 | `src/data/programmatic/models/*.ts` |
| Academic Alts | `/compare/[dataset]-alternative` | 20 | `src/data/programmatic/academic-alts/*.ts` |
| Lab-Specific | `/for/[company]` | 20 | `src/data/programmatic/labs/*.ts` |
| Benchmarks | `/benchmarks/[benchmark]` | 15 | `src/data/programmatic/benchmarks/*.ts` |
| Datasets | `/datasets/[slug]` | 25 | `src/data/programmatic/datasets/*.ts` |
| Formats | `/formats/[format]` | 15 | `src/data/programmatic/formats/*.ts` |
| Industries | `/industries/[vertical]` | 15 | `src/data/programmatic/industries/*.ts` |

### Route Files Created
- `src/app/glossary/[term]/page.tsx`
- `src/app/guides/[topic]/page.tsx` + `src/app/guides/page.tsx`
- `src/app/training-data/[task]/page.tsx` + `src/app/training-data/page.tsx`
- `src/app/models/[model]/page.tsx` + `src/app/models/page.tsx`
- `src/app/datasets/[slug]/page.tsx` + `src/app/datasets/page.tsx`
- `src/app/formats/[format]/page.tsx` + `src/app/formats/page.tsx`
- `src/app/industries/[vertical]/page.tsx` + `src/app/industries/page.tsx`
- `src/app/for/[company]/page.tsx` + `src/app/for/page.tsx`
- `src/app/benchmarks/[benchmark]/page.tsx` + `src/app/benchmarks/page.tsx`
- 20 individual pages in `src/app/compare/[dataset]-alternative/page.tsx`

### Quality Fixes
- 21 glossary pages rewritten with genuine unique content + real arXiv citations
- 5 guide pages rewritten with unique steps
- Sitemap expanded to include all new routes
- Lab pages noindex override fixed (X-Robots-Tag)
- JSON-LD totalTime format fixed to ISO 8601

## Key Decisions Made

1. **Dynamic routes + generateStaticParams** over individual page files (scales to 500+ without 500 file imports)
2. **GEO-first strategy** — primary KPI is AI citability in ChatGPT/Perplexity, not just organic traffic (most keywords are <10/mo in Google Ads)
3. **12 playbooks** instead of original 5 — added industry verticals, how-to guides, model-specific, format/standard, lab-specific, benchmarks
4. **Content quality tiers** — Tier A (1200+ words, human-written), Tier B (800+, AI-drafted+edited), Tier C (600+, template+unique tables)
5. **Separate type files per wave** to avoid merge conflicts during parallel agent work
6. **Intent-based keyword mapping** to prevent cannibalization (glossary=informational, task=task-intent, solutions=product-intent)

## Technical Details

### Architecture Pattern
- All pages use `GeoPageShell` wrapper (existing component — Header + Footer)
- `ProgrammaticPageTemplate` handles variant rendering via discriminated union on `playbook` field
- Each playbook has its own `types.ts`, `index.ts` registry, and data files
- Registry pattern: static imports + Map + validation at build time
- JSON-LD split across 3 files (programmatic-jsonld.ts, wave3-jsonld.ts, wave4-jsonld.ts) — should consolidate

### Gotchas Discovered
- Wave 1 builder produced templated boilerplate content (all 110 pages shared identical prose with term name swapped) — caught by code reviewer, partially fixed
- Codex MCP rate limit hit during first review attempt — used code-reviewer agent as fallback
- `/for/` layout has noindex by default (for prospect pages) — lab pages need explicit override
- Multiple agents writing to `types.ts` simultaneously causes conflicts — solved by having each wave use separate type files
- `pnpm run build` requires Supabase + Resend env vars — TypeScript check (`tsc --noEmit`) is the reliable local validation

### DataForSEO API
- Endpoint: `https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live`
- Credentials: `john@claru.ai` in main tree `.env.local`
- Cost: ~$0.075 per batch of 20 keywords

## Data & Metrics

### Search Volume (DataForSEO, US monthly)
- physical AI: 3,600 (growing: 2,900 → 6,600)
- diffusion policy: 1,900
- embodied AI: 1,900 ($8.28 CPC)
- teleoperation: 1,000 ($5.35 CPC)
- VLA model: 1,000 (growing: 1,000 → 1,600)
- world model AI: 1,000 (exploding: 480 → 4,400)
- imitation learning: 880
- behavior cloning: 260
- Most long-tail compound keywords: 0 in Google Ads (<10/mo threshold)

### GSC (claru.ai, 90 days)
- "buy pre-collected tele-operation data bundles": 31 impressions, pos 6.8
- "teleoperation data for robotics": 13 impressions, pos 9.4
- "scale AI alternatives": 32 impressions, pos 28.3
- "VLA model": 3 impressions, pos 48

### Page Counts
- New programmatic data files: 275
- Total estimated pages (including existing): ~396
- Target: 500+ (need ~104 more + depth improvement on existing)

### Agent Usage This Session
- 3 research agents (keyword, competitive, architecture) — ~10 min each
- 1 adversarial strategy review agent — ~3 min
- 1 main builder agent (Wave 0+1) — ~25 min
- 4 parallel builder agents (Waves 2-4 + fixer) — ~30 min each
- 1 code reviewer agent — ~2 min
- 1 Codex MCP review — found 2 P1 issues
- Total: ~12 agents spawned

## Current State

### What Works
- TypeScript compiles clean
- Dev server runs at localhost:3000
- All 275 new pages render via dynamic routes
- Sitemap includes all new routes
- Glossary index links to deep pages
- Hub pages exist for all playbooks

### Known Issues
- ~49 glossary pages + ~35 guides still have templated boilerplate content (not unique)
- Pages are 600-1000 words on average — need 1500-2500+ for competitive depth
- No llms.txt generated yet
- Cloudflare still blocking AI crawlers (manual dashboard action required)
- No cross-playbook internal linking pass done
- Build requires env vars (Supabase, Resend) — can't do full `pnpm run build` locally without them
- Not deployed to any preview URL yet

### Branch
- Local: `shaded-player` (NOT pushed to remote)
- Based on: `main` @ `8a7f67d`
- Last commit: `cca44fe` (pre-pSEO, contact form fix)

## Next Steps

1. **CRITICAL: Content depth** — Every page needs 1500-2500+ words of genuine expert content. Spawn 100+ agents, each taking 2-3 pages, to deeply research and write unique content with real citations, data tables, and technical depth. The current ~800w average is not competitive.

2. **Reach 500+ pages** — Add ~104 more pages:
   - 30 more glossary terms (expand to 100 total)
   - 40 cross-dimensional pages (task x environment combos)
   - 20 more how-to guides
   - 14 additional lab/benchmark pages

3. **Content quality rewrite** — Rewrite remaining 84 boilerplate pages (49 glossary + 35 guides) with unique content

4. **Cloudflare fix** — Enable GPTBot, ClaudeBot, PerplexityBot in Cloudflare dashboard (manual action, can't automate)

5. **Generate llms.txt** — Machine-readable index for AI crawlers

6. **Cross-playbook internal linking** — Populate all `relatedGlossaryTerms`, `relatedTaskPages`, etc. fields

7. **Preview deploy** — Push to staging branch, deploy to Vercel preview for visual review

8. **Final Codex review** — Full code review after content depth pass

9. **Submit to GSC** — Submit new sitemaps after deploy
