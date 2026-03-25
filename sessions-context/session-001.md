# Session 001 — 2026-03-25

## Summary
Massive session covering contract review (HackerRank MSA), git branch cleanup, global skill/tool installation (~195 skills), Maton API gateway setup, and full V2 landing page positioning research + PRD creation. The core output is a battle-tested PRD at `tasks/prd-landing-page-v2.md` that repositions Claru from "data services provider" to "the training data catalog for physical AI."

## What We Built / Changed

### Contract Review
- Reviewed HackerRank - Claru Order Form + MSA via Maton Google Docs API
- Identified 3 blockers: "INSERT" placeholder in jurisdiction, swapped signature blocks, backdated term
- Drafted new Section 7 (Limitation of Liability), Section 12 (Data Rights & IP), Section 13 (Force Majeure)
- Key IP position: Claru owns all deliverables, client gets non-exclusive perpetual license, Claru can resell

### Git Cleanup
- Synced `local/main`, `remote/main`, `remote/staging` — all in parity
- Created `landing-page-v2` branch from main
- Pushed staging to remote to catch it up

### Global Skills Installed (~195 total)
- **Anti-slop:** humanizer, stop-slop, unslop (with profiles), impeccable (21 sub-skills via marketplace)
- **GTM:** cold-outreach-writer, icp-scorer, meeting-prep-brief, prospect-researcher, weekly-pipeline-digest (with references wired up)
- **gstack (Garry Tan):** 28 skills — qa, ship, investigate, cso, design-review, plan-ceo-review, office-hours, etc.
- **taste-skill:** 7 design aesthetic skills (brutalist, minimalist, soft, redesign, stitch, output)
- **Generative Media:** 4 skills (gen-media-media, edit, platform, workflow) via muapi.ai
- **design-plugin:** design-and-refine
- **geo-seo-claude:** 15 GEO/SEO skills (audit, citability, crawlers, schema, report-pdf, prospect, etc.)
- **design-research:** browser-based design analysis
- **Efecto:** 3 skills (web-design, graphic-design, social-media) via MCP
- **Shaders:** Custom skill — 70+ GPU-accelerated React components (aurora, plasma, glitch, CRT, particles, etc.)
- **Fancy Components:** Custom skill — premium animated React components via shadcn @fancy registry
- **Magic UI:** Custom skill — animated components (globe, particles, marquee, number ticker, terminal)
- **Its Hover:** Custom skill — 186+ animated icons
- **Skiper UI:** Custom skill — premium shadcn components
- Fixed broken `~/.claude/skills` symlink (old uppercase path → lowercase)

### Maton API Gateway
- Verified MATON_API_KEY is set (99 chars)
- 3 active connections: Google Docs, Google Drive, Google Search Console (john@claru.ai)
- 1 pending: Google Slides (needs OAuth)
- Successfully fetched and parsed HackerRank contract .docx via Drive API

### V2 Landing Page PRD
- **File:** `tasks/prd-landing-page-v2.md`
- Full competitive landscape research (Scale AI, Cortex, Sensei, Foxglove, Covariant, Skild, Pi, Rhoda, World Labs, Human Archive, Asimov, Luel)
- 5 positioning angles analyzed, selected: "Browse. Buy. Build." with "The Catalog" identity
- Current page fully audited (all sections, design system, animations)
- FAL generative pipeline mapped (Wan 2.2, FLUX.2 Pro, Depth Anything, DWPose, SAM2, Topaz — ~$20 total for all assets)
- COBE globe API documented for collection network visualization
- Interactive viz patterns researched (GSAP stacked cards, CSS before/after slider, responsive video heroes)
- Competitor visual design analysis (9 sites in detail)
- QA review agent caught 7 critical issues — all resolved in PRD

## Key Decisions Made

1. **Positioning shift:** "Expert Human Intelligence for AI Labs" → "The training data catalog for physical AI." The "human intelligence" framing is now crowded (Asimov, Human Archive both use it).
2. **Hero:** Full-bleed video montage (pre-encoded MP4), NOT Remotion, NOT COBE globe. Globe moves to Section 6 (Collection Network).
3. **Catalog layout:** GSAP stacked cards (6 cards), not tabbed grid. Real clips first, FAL-generated only where footage is missing.
4. **Enrichment demo:** Before/after CSS slider as primary interaction. Pipeline nodes as labels, not separate click-through.
5. **Public catalog page:** Build `/catalog` route — email-gated for full access, no login wall on "Browse the Catalog" CTA.
6. **Data rights in MSA:** Claru owns all deliverables, non-exclusive perpetual license to client, Claru can resell/use for marketing.
7. **No pricing on landing page** but show pricing MODEL (per-dataset, per-hour, per-minute).
8. **Real assets first:** Design principle #6 — use actual catalog clips wherever possible, FAL only to fill gaps.

## Technical Details

### COBE Globe Config for Claru
```js
dark: 1, baseColor: [0.04, 0.04, 0.03], markerColor: [0.57, 0.69, 0.56],
glowColor: [0.2, 0.25, 0.2], mapBrightness: 2, arcColor: [0.57, 0.69, 0.56]
```
CSS anchor positioning for floating labels: `--cobe-visible-{id}` fades labels as globe rotates.

### FAL Pipeline (for asset generation)
1. FLUX.2 Pro + Realism LoRA → base stills (~$0.03/image)
2. Wan 2.2 image-to-video → 5-sec clips (~$0.50/clip)
3. Depth Anything Video → depth overlays
4. DWPose Video → pose skeletons
5. SAM2 Video → segmentation masks
6. Topaz Video AI → upscale/polish ($0.01-0.08/sec)

### Performance Targets
- Hero video: <2MB (H.264, 1080p desktop / 720p mobile)
- Initial page: <3MB. Total with lazy: ~8MB.
- LCP <2.5s, CLS <0.1, Lighthouse >90
- `prefers-reduced-motion` fallbacks for all animations

### Design System V2 Additions
- Enrichment colors: `#4A9EDE` (depth), `#DE8A4A` (pose), `#9E6ADE` (segmentation)
- OKLCH neutrals with 0.01 sage chroma
- Dot grid background replacing ASCII canvas
- Video thumbnails as first-class card content

## Data & Metrics
- Claru catalog: 3.7M+ annotations, 25+ datasets, 8 modalities, ~1.045M clips in prod DB
- HackerRank deal: $10,800 / 10,800 units @ $1.00, March 20 – April 27, 2026
- Competitor funding context: Scale ($15B), Physical Intelligence ($5.6B), Skild ($1.5B), Rhoda ($1.7B), Human Archive ($500K YC), Asimov ($500K YC), Luel ($500K YC)

## Current State
- **Branch:** `landing-page-v2` (from main, no commits yet)
- **Last commit:** `8bb8440` Merge pull request #50 from claruai/staging
- **All branches synced:** local/main = remote/main = remote/staging
- **PRD written and QA'd:** `tasks/prd-landing-page-v2.md` — all 7 QA issues resolved, all open questions decided
- **195 global skills** installed at `~/.claude/skills/`
- **Maton gateway** active with 3 Google connections
- **No code changes yet** — PRD is the deliverable, ready for Ralph conversion

## Next Steps
1. **Run the full QA loop on PRD** (Codex review → specialized agent review → Codex again → context7 docs → final read)
2. **Convert PRD to prd.json** via `/ralph`
3. **Generate visual assets** via FAL pipeline (`scripts/generate-v2-assets.ts`)
4. **Execute via `/ralph-loop`** — autonomous section-by-section build
5. **HackerRank MSA:** Fix the 3 blockers (INSERT jurisdiction, signature swap, term date), add Section 12 (Data Rights) + Section 13 (Force Majeure), soften Section 11(g), send to HackerRank
