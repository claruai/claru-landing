# Programmatic SEO Strategy v2: Physical AI Training Data Keywords

**Date:** 2026-04-06
**Status:** Reviewed (adversarial score: 6.5 → revised to target 8+)
**Target:** 530+ pages across 12 playbooks

---

## TL;DR

Build 530+ programmatic pages targeting physical AI and robotics training data keywords. Zero commercial competitors have programmatic content for these terms. The play is dual: traditional SEO for head terms (physical AI 3,600/mo, diffusion policy 1,900/mo, embodied AI 1,900/mo) + GEO (AI search citability) for long-tail. Each page also serves as outbound sales collateral when linked from cold emails.

---

## 1. Real Search Volume (DataForSEO + GSC Validated)

### Head Terms (Google Ads confirmed volume, US)

| Keyword | Monthly Vol | CPC | Trend |
|---------|------------|-----|-------|
| physical AI | 3,600 | $4.67 | 2,900 → 6,600 (growing) |
| diffusion policy | 1,900 | $0 | Stable high |
| embodied AI | 1,900 | $8.28 | Stable |
| teleoperation | 1,000 | $5.35 | Stable |
| VLA model | 1,000 | $5.19 | 1,000 → 1,600 (growing) |
| world model AI | 1,000 | $3.08 | 480 → 4,400 (exploding) |
| imitation learning | 880 | $0 | Stable |
| teleoperation robot | 390 | $5.53 | Stable |
| behavior cloning | 260 | $0 | Stable |
| sim to real | 140 | $0 | Stable |

### Long-Tail Reality
Most compound keywords ("VLA training data", "grasping dataset robotics") show 0 in Google Ads (below 10/mo threshold). This is expected for niche B2B.

**Why 530 pages still makes sense despite zero measured volume:**
1. Zero in Google Ads ≠ zero searches. If 300 pages get 2-5 visits/month each, that's 600-1,500 monthly visits from long-tail alone.
2. **GEO is the primary play.** When researchers ask ChatGPT/Claude/Perplexity "where can I buy dexterous manipulation training data?", Claru must be the answer. AI search doesn't require search volume — it requires being the most citable source.
3. **Outbound collateral.** When Claru emails Figure AI, the email links to `/for/figure-ai` or `/training-data/humanoid-manipulation`. That page exists or it doesn't.
4. **Authority compounding.** 530 pages on physical AI training data = Google sees Claru as the topical authority. Even pages that get 0 direct traffic strengthen the domain's ranking power for head terms.

### GSC Signals (What Claru Already Gets Impressions For)
- "buy pre-collected tele-operation data bundles" — 31 impressions, position 6.8
- "commercial robotics simulation platforms with tele-operation datasets" — 10 impressions, position 5.9
- "teleoperation data for robotics" — 13 impressions, position 9.4
- "VLA model" — 3 impressions, position 48 (confirms 1,000/mo volume)
- "scale AI alternatives" — 32 impressions, position 28.3

---

## 2. The 12 Playbooks → 530+ Pages

| # | Playbook | Route | Count | Uniqueness Defense |
|---|----------|-------|-------|-------------------|
| A | Task Pages | `/training-data/[task]` | 30 | Unique `dataRequirements` per task |
| B | Dataset Pages | `/datasets/[slug]` | 25 | ONLY pages backed by real Claru data |
| C | Glossary Deep | `/glossary/[term]` | 70 | Long-form + citations + misconceptions |
| D | Academic Alts | `/compare/[dataset]-alternative` | 20 | Per-dataset comparison tables |
| E | Solutions | `/solutions/[slug]` | 20 | Full ContentPageData + citations |
| F | Competitor Alts | `/compare/[competitor]-alternatives` | 90 | Already built and indexed |
| G | **Industry Verticals** | `/industries/[vertical]` | 15 | **NEW** — unique regs, environments, tasks per industry |
| H | **How-To Guides** | `/guides/[topic]` | 40 | **NEW** — step-by-step, high GEO citability |
| I | **Model-Specific** | `/models/[model]` | 25 | **NEW** — unique data specs per model architecture |
| J | **Format/Standard** | `/formats/[format]` | 15 | **NEW** — developer-intent pipeline pages |
| K | **Lab-Specific** | `/for/[company]` | 20 | **NEW** — outbound sales collateral |
| L | **Benchmark Pages** | `/benchmarks/[benchmark]` | 15 | **NEW** — unique eval protocols + data needs |
| | **Existing** (blog, case studies, etc.) | various | 46+ | Already indexed |
| | **TOTAL** | | **531+** | |

### New Playbooks Explained

**G: Industry Verticals (15)** — Healthcare (HIPAA), defense (ITAR), agriculture, warehouse, retail, construction, underwater, food processing, manufacturing, logistics, mining, energy, automotive, consumer electronics, space. Each has different regulatory requirements, environments, tasks, and data formats. Not variable swaps.

**H: How-To Guides (40)** — "How to collect teleoperation data", "How to label manipulation demonstrations", "How to build a grasping dataset", "How to evaluate robot policy data quality", etc. Informational intent. Highest GEO citability (AI models love answering "how to" with step-by-step content).

**I: Model-Specific (25)** — "Training data for OpenVLA", "...for RT-2", "...for Octo", "...for pi-zero", "...for GR00T N1", "...for Diffusion Policy", "...for ACT/ALOHA", etc. Each model has specific input formats, action spaces, tokenization, and data volume needs.

**J: Format/Standard (15)** — RLDS, HDF5, WebDataset, TFDS, LeRobot, zarr, ROS bag, MCAP, NuScenes, KITTI, BOP, COCO, Open3D, protobuf, Arrow. Developer-intent pages for pipeline builders.

**K: Lab-Specific (20)** — "Training data for Figure AI", "...for Agility Robotics", "...for 1X Technologies", "...for Boston Dynamics", "...for Unitree", etc. Each references the lab's specific robot, published papers, known data needs from job postings. Doubles as outbound sales support.

**L: Benchmark Pages (15)** — RLBench, CALVIN, ManiSkill, COLOSSEUM, Habitat, MetaWorld, robosuite, libero, SAPIEN, VLABench, RoboCasa, etc. Each has unique task sets, observation spaces, and evaluation protocols. "What real-world data do you need to transfer a RLBench-trained policy to a physical robot?"

---

## 3. Content Quality Tiers

| Tier | Playbooks | Word Count | Production | Quality Gate |
|------|-----------|-----------|------------|-------------|
| **A** (Premium) | Solutions (E), Task (A), Model-Specific (I) | 1,200+ | Human-written, AI drafting assistance | Unique research citations, unique data tables, Jaccard similarity < 0.3 vs siblings |
| **B** (Standard) | Glossary (C), How-To (H), Academic Alts (D), Industry (G) | 800+ | AI-drafted, human-edited | Unique structured data, unique FAQs, min 1 unique editorial paragraph |
| **C** (Template) | Dataset (B), Format (J), Lab-Specific (K), Benchmark (L) | 600+ | Template + unique comparison tables + specs | Unique data profile, unique comparison rows, at least 1 paragraph of non-template content |

### Content Validation Script
Build-time validation for every page:
- Minimum word count met for tier
- Uniqueness: Jaccard similarity < 0.3 vs any sibling page in same playbook
- Citations: Tier A = 3+ unique paper/source references per page
- FAQs: 3-5 unique questions per page, no duplicates across playbook
- No fictional inventory: dataset pages only for data Claru actually has

---

## 4. Keyword Cannibalization Governance

### The Problem
With 530 pages, many target overlapping keywords. "/training-data/manipulation" vs "/datasets/egocentric-kitchen" vs "/glossary/behavioral-cloning" all mention "manipulation training data."

### The Solution: Intent-Based Canonical Mapping

| Intent | Canonical Page Type | Example |
|--------|-------------------|---------|
| **Informational** ("what is X") | Glossary | `/glossary/vla` owns "what is a VLA model" |
| **Task-intent** ("X training data") | Task | `/training-data/manipulation` owns "manipulation training data" |
| **Product-intent** ("buy X dataset") | Solutions/Dataset | `/solutions/vla-training-data` owns "buy VLA training data" |
| **Comparison** ("X alternative") | Compare | `/compare/ego4d-alternative` owns "ego4d alternative" |
| **How-to** ("how to X") | Guides | `/guides/collect-teleoperation-data` owns "how to collect teleop data" |
| **Model-specific** ("data for X model") | Models | `/models/openVLA` owns "OpenVLA training data requirements" |

### Enforcement
- Supporting pages link to canonical using target keyword as anchor text
- Canonical does NOT link back using same anchor
- Title tags and H1s differentiate by intent modifier
- Build-time validator: flag duplicate primary keywords across pages

---

## 5. GEO Strategy (Generative Engine Optimization)

### CRITICAL: Fix Cloudflare AI Crawler Blocking
MEMORY.md notes Cloudflare is blocking GPTBot and ClaudeBot. **This must be fixed before any pages are built.** Every page we build is invisible to AI search until this is resolved.

**Action:** Cloudflare dashboard → Security → Bots → AI Crawler Management → Allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended.

### GEO Infrastructure
1. **`/llms.txt`** — Machine-readable index of all programmatic pages, organized by playbook
2. **`/llms-full.txt`** — Full content export for AI crawlers
3. **Citability-optimized content** — Every page has at least one "definitive claim" paragraph:
   > "Training a VLA policy for dexterous manipulation requires 50,000-200,000 synchronized video-action trajectories [Octo, 2024]. Claru has delivered 386,000+ annotated clips for this use case."
4. **Enhanced schema**: `DataCatalog` + `DataDownload` on dataset pages, `HowTo` on guide pages, `DefinedTerm` on glossary, `Dataset` on dataset pages

### Success Metrics (GEO-first)
| Metric | Primary KPI | Target (6mo) |
|--------|------------|-------------|
| AI citability | % of target keywords where Claru appears in ChatGPT/Perplexity/Claude responses | 30%+ |
| Outbound dwell time | Pages linked in cold emails with >10s dwell | 50%+ |
| Traditional organic | Monthly organic visits | 1,500+ |
| Indexation | Pages indexed in Google | 400+ of 530 |
| Featured Snippets | Glossary terms in Featured Snippets | 10+ |

---

## 6. Differentiated CTAs Per Page Type

| Page Type | CTA | Rationale |
|-----------|-----|-----------|
| Glossary | "Explore related datasets" + "Subscribe to research newsletter" | Informational intent → nurture |
| Task | "Get a custom quote for [task] data" (form pre-filled) | Task-specific purchase intent |
| Dataset | "Request a sample pack" | Lower commitment than contact form |
| Academic Alt | "Compare licensing options" | Addresses license friction |
| How-To Guide | "Talk to a data collection specialist" | Expert consultation offer |
| Lab-Specific | "Schedule a call about [company]'s data needs" | Direct outbound → inbound bridge |
| Solutions | Keep existing contact form | Proven pattern |
| Model-Specific | "Get data formatted for [model]" | Model-ready data positioning |

---

## 7. Existing Page Conflict Resolution

| Existing Page | Proposed Page | Resolution |
|---------------|--------------|------------|
| `/solutions/manipulation-trajectory-data` | `/training-data/manipulation` | Keep both. Solutions = product page. Task = educational. Task links to solutions as CTA |
| `/solutions/egocentric-video-data` | `/datasets/egocentric-kitchen` | Keep both. Solutions = general pitch. Dataset = specific inventory |
| `/solutions/teleoperation-data` | `/training-data/teleoperation` | Keep both. Cross-link with different intent keywords |
| `/egocentric-video-datasets` (GEO page) | `/datasets/egocentric-*` | GEO page = pillar. Dataset pages = spokes. GEO page links down to specific datasets |
| `/training-data-for-robotics` (GEO page) | `/training-data/[task]` | GEO page = pillar. Task pages = spokes. Same pattern |

---

## 8. Technical Architecture

### Dynamic Routes + `generateStaticParams`
```
src/data/programmatic/
  types.ts                    # Shared base + per-playbook types
  link-graph.ts               # Cross-playbook linking engine
  validation.ts               # Build-time content quality checks
  tasks/index.ts + *.ts       # ~30 task data files
  datasets/index.ts + *.ts    # ~25 dataset data files
  guides/index.ts + *.ts      # ~40 how-to guide data files
  models/index.ts + *.ts      # ~25 model-specific data files
  industries/index.ts + *.ts  # ~15 industry vertical data files
  formats/index.ts + *.ts     # ~15 format/standard data files
  labs/index.ts + *.ts        # ~20 lab-specific data files
  benchmarks/index.ts + *.ts  # ~15 benchmark data files
  academic-alts/index.ts      # ~20 academic alternative data files

src/app/
  training-data/[task]/page.tsx       # Dynamic route
  datasets/[slug]/page.tsx            # Dynamic route
  glossary/[term]/page.tsx            # Dynamic route (alongside existing index)
  guides/[topic]/page.tsx             # Dynamic route
  models/[model]/page.tsx             # Dynamic route
  industries/[vertical]/page.tsx      # Dynamic route
  formats/[format]/page.tsx           # Dynamic route
  for/[company]/page.tsx              # Dynamic route (lab-specific)
  benchmarks/[benchmark]/page.tsx     # Dynamic route
```

### Registry Pattern
- Dynamic `fs.readdirSync` at build time (not 500 explicit imports)
- Each playbook's `index.ts` validates content quality at build time
- Programmatic sitemap generation from registries
- ISR (`revalidate: 86400`) for dataset pages that pull Supabase stats
- Full SSG for glossary, task, guide, format pages

---

## 9. Implementation Waves

### Wave 0: Prerequisites (Before ANY pages — Day 1-2)
- [ ] **Fix Cloudflare AI crawler blocking** (GPTBot, ClaudeBot, PerplexityBot)
- [ ] Create canonical keyword map spreadsheet
- [ ] Generate `/llms.txt` file
- [ ] Audit existing page conflicts, document resolution plan
- [ ] Build infrastructure: types.ts, templates, registries, validation script, sitemap automation

### Wave 1: Glossary + How-To Guides (Week 1-2) — 110 pages
- [ ] 70 glossary deep pages (expand 56 existing + 14 new terms)
- [ ] 40 how-to guides (highest GEO citability)
- [ ] Content validation script running on every build
- [ ] Per-playbook sitemap generation
- [ ] Submit to GSC, monitor indexation

### Wave 2: Task + Model + Academic Alts (Week 3-4) — 75 pages
- [ ] 30 task pages
- [ ] 25 model-specific pages
- [ ] 20 academic alternative pages

### Wave 3: Datasets + Formats + Industry (Week 5-6) — 55 pages
- [ ] 25 dataset pages (ONLY for real Claru data)
- [ ] 15 format/standard pages
- [ ] 15 industry vertical pages
- [ ] Cross-linking pass across all playbooks

### Wave 4: Lab-Specific + Benchmarks (Week 7-8) — 35 pages
- [ ] 20 lab-specific pages
- [ ] 15 benchmark pages
- [ ] Full internal linking audit
- [ ] GEO audit: test 50 queries in ChatGPT/Perplexity/Claude

### Wave 5: Monitor + Prune + Expand (Ongoing)
- [ ] Track indexation rate per playbook (< 50% indexed = investigate)
- [ ] Monthly GEO citability audit
- [ ] Prune pages with 0 impressions after 90 days
- [ ] Add pages based on GSC "Queries" report (discover accidental rankings)
- [ ] Quarterly content freshness update (new papers, new models, new stats)

---

## 10. Competitive Defensibility

The moat is NOT "we got there first." It's:
1. **Proprietary data references** — Every page cites Claru's real stats (386K clips, 100+ cities, 10K+ contributors). Generic content is copyable. Content backed by proprietary data is not.
2. **Data freshness** — Quarterly updates with new dataset stats, new papers, new model architectures. Static competitors won't maintain 530 pages.
3. **Cross-link density** — 530 internally linked pages creates a topical authority graph that new entrants can't replicate with a blog post.
4. **GEO citability** — Being the most-cited source in AI search responses compounds over time as AI models learn to reference Claru.

---

## 11. Adversarial Review Findings (Addressed)

| Finding | Severity | Status |
|---------|----------|--------|
| Strategy tops out at 200, not 500+ | CRITICAL | Fixed: 12 playbooks → 530+ pages |
| No content production plan | CRITICAL | Fixed: 3-tier quality bars + validation script |
| Thin content risk on dataset pages | CRITICAL | Fixed: Only build for real Claru data |
| No keyword cannibalization governance | MAJOR | Fixed: Intent-based canonical mapping |
| No GEO strategy | MAJOR | Fixed: Cloudflare fix + llms.txt + citability rules |
| Optimistic competitive window | MAJOR | Fixed: Defensibility = proprietary data, not speed |
| Identical CTAs across page types | MINOR | Fixed: Per-type differentiated CTAs |
| Existing page conflicts | MINOR | Fixed: Resolution table with cross-link strategy |
| No crawl budget management | MINOR | Noted: noindex hub pages initially |
| DataForSEO zero-volume not addressed | MAJOR | Fixed: Reframed metrics (GEO-first) |
