# Programmatic SEO Strategy: Physical AI Training Data Keywords

**Date:** 2026-04-06
**Status:** Research complete, ready for implementation

---

## TL;DR

Build 200+ programmatic pages targeting niche robotics/physical AI training data keywords. Research confirms: **zero commercial data providers have built programmatic content for these terms.** The SERPs are dominated by academic papers, GitHub repos, and HuggingFace — there is no commercial competitor. First-mover window: 12-18 months before Scale/Appen replicate.

---

## 1. The Opportunity

### Market Signal
- MIT Technology Review (Apr 2026): "The gig workers who are training humanoid robots"
- Scale AI blog: "Expanding Our Data Engine for Physical AI"
- Appen launched `/physical-ai` page
- AgiBot World: "World's largest humanoid robot training dataset"
- Figure AI: "Project Go-Big" humanoid pretraining initiative

### Competitive Landscape

| Competitor | Programmatic Pages | Robotics Depth | Threat Level |
|------------|-------------------|----------------|-------------|
| **Roboflow** | 500K+ (horizontal CV) | None (no physical AI) | Low — different market |
| **Scale AI** | 0 (1 blog post) | Brand only | Medium — could build fast |
| **Encord** | ~50 glossary terms (general ML) | 8 blog posts | Low — annotation tool, not data |
| **Appen** | 0 (1 landing page) | Surface level | Low — thin content |
| **Labelbox** | 0 | Sensor/robotics page | Low — tool focus |
| **iMerit** | 0 (blog only) | Good blog content | Low — annotation service |
| **V7 Labs** | ~100 open dataset pages | Weak robotics | Low |
| **Segments.ai** | ~45 dataset pages | LiDAR/multi-sensor | Low — tool focus |

**Bottom line:** Nobody owns this category. Claru already ranks for "egocentric video dataset" and "ego4d alternative" via blog posts. Programmatic pages would compound this dramatically.

### Claru's Existing Authority
- `/blog/best-egocentric-data-providers` — already ranking #1-2 for ego4d alternative queries
- `/solutions/teleoperation-data` — ranking for teleoperation dataset
- `/glossary` — 56 terms indexed, DefinedTermSet JSON-LD
- 4 GEO landing pages indexed
- ~90 competitor alternative pages indexed

---

## 2. Validated Keyword Clusters

### Tier 1: HIGH demand + ZERO commercial competition (build immediately)

| # | Keyword | Playbook | Evidence |
|---|---------|----------|----------|
| 1 | Humanoid robot training data | Solutions | AgiBot, Figure AI, MIT Tech Review. Explosive 2025-26 growth |
| 2 | VLA training data / VLA dataset | Solutions | OpenVLA 1k+ citations. Wikipedia page exists. No commercial page |
| 3 | Dexterous manipulation dataset | Tasks | EgoDex (829hrs), DexCanvas (7k hrs). ICLR/CVPR 2025 papers |
| 4 | Diffusion policy training data | Solutions | Most-cited robot learning paper 2023-25. Zero commercial pages |
| 5 | Egocentric kitchen video dataset | Datasets | EPIC-KITCHENS is CC BY-NC. Direct commercial licensing gap |
| 6 | Foundation model robotics data | Solutions | Enterprise framing. Scale/Appen both position here |
| 7 | Behavior cloning dataset | Solutions | Papers With Code benchmark. Fundamental practitioner term |
| 8 | Sim-to-real gap | Glossary | Most-searched concept in physical AI. Bridge to "why real data" |
| 9 | Teleoperation dataset | Tasks | Acquisition-intent. Describes Claru's actual collection method |
| 10 | World model training data | Solutions | Scale AI blog leads with this. Growing enterprise term |
| 11 | Ego4D alternative | Academic Alt | Claru already ranks. Build full comparison page |
| 12 | Imitation learning robotics | Glossary | Gateway term. MIT/Stanford courses. High volume |
| 13 | Egocentric warehouse video | Datasets | Build AI proved demand (100K hrs). No commercial page |
| 14 | What is a VLA model | Glossary | Breakout search term. Wikipedia is weak competitor |
| 15 | Robot manipulation dataset | Tasks | DROID, OXE, RoboMIND all academic. No commercial page |
| 16 | EPIC-KITCHENS alternative | Academic Alt | CC BY-NC license friction = purchase intent |
| 17 | Grasping dataset | Tasks | GraspNet-1Billion, GraspFactory. No commercial alternative |
| 18 | Kitchen robot dataset | Datasets | EPIC-KITCHENS academic. Zero commercial providers |
| 19 | Open X-Embodiment alternative | Academic Alt | Non-uniform licensing across 60 datasets |
| 20 | RLDS format | Glossary | Developer-intent. Pipeline builders actively search this |

### Tier 2: MEDIUM-HIGH demand (build in Wave 2)

| Keyword | Playbook | Notes |
|---------|----------|-------|
| Agricultural robotics dataset | Tasks | Surprise strength. Ag-tech companies have budget |
| Bimanual manipulation dataset | Tasks | ALOHA/dual-arm proliferation |
| Mobile manipulation dataset | Tasks | DROID, EMMA papers. Emerging |
| Wrist camera dataset | Tasks | WristWorld paper (2025) identifies gap |
| Tactile sensor dataset | Tasks | No commercial provider exists at all |
| ALOHA dataset / Mobile ALOHA | Academic Alt | Breakout open-source platform |
| Legged robot dataset | Tasks | Quadruped market (Unitree, ANYbotics) |
| Navigation training data | Tasks | Indoor/social nav specifically |
| Multi-view manipulation data | Datasets | RH20T, BridgeData V2 multi-cam |
| RGBD manipulation data | Datasets | KITchen (205k images). Moderate volume |
| Physical AI data collection service | Solutions | Commercial transactional keyword |
| Human demonstration robot | Tasks | MIT Tech Review "gig workers" framing |
| Gaussian splatting dataset robotics | Tasks | Ultra-emerging. ArXiv papers only |

### Tier 3: LOW or SKIP

| Keyword | Why Skip |
|---------|----------|
| Autonomous driving training data | Dominated by Tesla/Waymo/Scale. Don't compete |
| Vision transformer training data | Too generic, superseded by VLA framing |
| ManiSkill/CALVIN/Habitat alternative | These are simulators, not data |
| Pouring dataset | Too niche for standalone page |
| Something-Something V2 alternative | CV term, not robotics-specific |
| Door manipulation dataset | Subsumed into broader manipulation |

---

## 3. Page Architecture

### 5 Playbooks → 200+ Pages

```
Playbook A: /training-data/[task]         ~30 pages  (task-specific data needs)
Playbook B: /datasets/[slug]              ~40 pages  (source x environment combos)
Playbook C: /glossary/[term]              ~56 pages  (expand existing 56 terms)
Playbook D: /compare/[dataset]-alternative ~15 pages  (academic dataset alternatives)
Playbook E: /solutions/[slug]             ~15 pages  (model architecture pages)
                                          ─────────
                                          ~156 core + ~50 cross-dimensional = 200+
```

### Technical Implementation

**Pattern:** Dynamic routes + `generateStaticParams` (matching existing `solutions/[slug]`)

```
src/data/programmatic/
  types.ts                    # Shared base + per-playbook types
  link-graph.ts               # Cross-playbook linking engine
  tasks/index.ts + *.ts       # ~30 task data files
  datasets/index.ts + *.ts    # ~40 dataset data files
  academic-alternatives/      # ~15 academic alt data files

src/app/
  training-data/
    page.tsx                  # Hub index
    [task]/page.tsx           # Dynamic route
  datasets/
    page.tsx                  # Hub index
    [slug]/page.tsx           # Dynamic route
  glossary/
    [term]/page.tsx           # Deep pages (index stays)
  solutions/[slug]/           # EXISTING — add more data files
```

**Key decisions:**
- `GeoPageShell` wraps all pages (existing pattern)
- Shared `ProgrammaticPageTemplate` component renders any playbook via discriminated union
- Per-playbook registries with build-time validation (same as `content-pages/index.ts`)
- Per-playbook sitemaps split from current monolithic `sitemap.ts`
- JSON-LD: `Dataset` for dataset pages, `DefinedTerm` for glossary, `Service` for tasks, `FAQPage` everywhere
- All pages SSG (no ISR needed — data is in TypeScript files)
- Existing pages untouched (4 GEO pages, 90 compare pages, glossary index)

### Content Uniqueness (Not Variable Swaps)

Each playbook has domain-specific fields that ensure genuine differentiation:

- **Task pages**: `dataRequirements` (modality, volume, temporal resolution, annotations), `relevantModels`, `environmentTypes`
- **Dataset pages**: `datasetProfile` (modalities, clips, hours, formats, resolution, fps), `comparisonWithPublic`
- **Glossary deep**: `longDefinition` (300-500 words), `historicalContext`, `commonMisconceptions`, `keyPapers`
- **Academic alts**: per-dataset strengths/limitations, dimension-by-dimension comparison table
- **Solutions**: existing `ContentPageData` type — just add more data files

---

## 4. Internal Linking Architecture

### Hub-and-Spoke

```
                    Homepage (/)
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  /training-data   /datasets      /glossary
  (task hub)       (dataset hub)  (term index)
    │                 │               │
    ├── /manipulation ├── /ego-kitchen├── /vla
    ├── /grasping     ├── /ego-warehouse├── /diffusion-policy
    ├── /navigation   ├── /teleop-kitchen├── /sim-to-real
    └── ...           └── ...         └── ...
        │                 │               │
        └─────── cross-links ─────────────┘
```

### Cross-Playbook Links (every page links to 3-5 pages from OTHER playbooks)

Example: `/training-data/dexterous-manipulation` links to:
- `/glossary/vla` (what model architecture trains on this)
- `/datasets/egocentric-kitchen-video` (example dataset for this task)
- `/compare/ego4d-alternative` (academic dataset comparison)
- `/solutions/diffusion-policy-training-data` (what model to train)

---

## 5. Implementation Waves

### Wave 1: Foundation + Highest Impact (Week 1-2)

**Infrastructure:**
- [ ] Create `src/data/programmatic/types.ts` with all type definitions
- [ ] Create `src/data/programmatic/link-graph.ts`
- [ ] Create `ProgrammaticPageTemplate` component
- [ ] Create `PlaybookBreadcrumb` component
- [ ] Create `CrossPlaybookLinks` component

**Content (66 pages):**
- [ ] 56 glossary deep pages (`/glossary/[term]`) — expand existing 56 terms
- [ ] 5 model-solution pages: VLA, world model, diffusion policy, behavior cloning, humanoid
- [ ] 5 academic alternative pages: Ego4D, EPIC-KITCHENS, DROID, Open X-Embodiment, BridgeData

### Wave 2: Task + Dataset Pages (Week 3-4)

**Content (~45 pages):**
- [ ] 15 task pages (top-priority): manipulation, grasping, dexterous manipulation, teleoperation, kitchen tasks, navigation, locomotion, assembly, bin picking, tool use, bimanual, agricultural, mobile manipulation, wrist-camera, surgical
- [ ] 15 dataset pages (top cross-products): egocentric-kitchen, egocentric-warehouse, egocentric-outdoor, teleop-kitchen, teleop-warehouse, multi-view-manipulation, rgbd-kitchen, simulation-manipulation, game-environment, egocentric-retail, egocentric-hospital, multi-view-assembly, teleop-factory, aerial-agricultural, thermal-industrial
- [ ] 15 more task + dataset pages from Tier 2 keywords

### Wave 3: Long Tail + Cross-Linking (Week 5-6)

- [ ] Remaining task + dataset pages to reach 200+
- [ ] Cross-linking pass: populate all `relatedGlossaryTerms`, `relatedTaskPages`, `relatedDatasetPages` fields
- [ ] Update existing glossary `usedIn` links to point to new pages
- [ ] Split sitemap into per-playbook sitemaps
- [ ] Submit to Google Search Console

### Wave 4: Monitoring + Expansion

- [ ] Track indexation rate in GSC
- [ ] Monitor rankings for top 20 keywords
- [ ] Add "discovered" keywords: wrist camera, tactile sensor, ALOHA, gaussian splatting
- [ ] Add environment-specific pages based on what indexes well

---

## 6. Success Metrics

| Metric | Target (3 months) | Target (6 months) |
|--------|-------------------|-------------------|
| Pages indexed | 150+ | 200+ |
| Keywords ranking top 20 | 30+ | 80+ |
| Organic traffic (monthly) | 500+ visits | 2,000+ visits |
| Contact form conversions from pSEO | 3+ | 10+ |
| Glossary terms in Featured Snippets | 5+ | 15+ |

---

## 7. Roboflow Lessons Applied

Roboflow built 500K+ pages via user-generated datasets. Claru can't replicate that. But the structural lessons apply:

1. **Dense internal linking graph** — every page links to 3-5 pages from other playbooks
2. **Hub pages concentrate PageRank** — `/training-data`, `/datasets`, `/glossary` as hubs
3. **Search-indexed discovery pages** — the hub index pages function like Roboflow's browse pages
4. **Vertical depth beats horizontal breadth** — Roboflow is horizontal CV. Claru is vertical physical AI. Go deeper on fewer topics.
5. **The glossary is the long-tail engine** — Encord has ~50 general ML terms. Claru should have 56+ physical AI terms. No overlap.

---

## 8. Key Sources

### Academic Datasets (demand proof)
- DROID: 76k trajectories, droid-dataset.github.io
- Open X-Embodiment: 1M+ episodes, robotics-transformer-x.github.io
- Ego4D: 3,670 hours, CC BY-NC (commercial gap)
- EPIC-KITCHENS: 55+ hours, CC BY-NC-4.0 (commercial gap)
- EgoDex: 829 hours, CVPR 2025
- GraspNet-1Billion: 1.1B grasp poses
- AgiBot World: largest humanoid dataset
- BridgeData V2: 60k trajectories
- RoboMIND: 107k trajectories

### Commercial Signals
- Scale AI: "Physical AI Data Engine" (1 blog post, no depth)
- Appen: `/physical-ai` page mentions world model collection
- Build AI: open-sourced 100K hours industrial egocentric video
- Figure AI: "Project Go-Big" humanoid pretraining
- MIT Tech Review: "gig workers training humanoid robots" (Apr 2026)

### Competitor Content Gaps
- Zero commercial pages for: diffusion policy dataset, VLA training data, bimanual manipulation, dexterous manipulation, grasping dataset, kitchen robot dataset, world model training data, humanoid training data
- Thin commercial pages for: warehouse robot data, sim-to-real data, 3D point cloud robotics, physical AI training data, video annotation for robotics
