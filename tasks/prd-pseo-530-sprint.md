# PRD: pSEO 530+ Page Sprint

**Date:** 2026-04-06
**Branch:** shaded-player
**Status:** In Progress

## Current State
- 275 programmatic pages (10 playbooks, avg 2,000-3,200 words) — DONE
- 89 competitor alt pages (data files avg 1,441 words, 0 above 1,600) — NEED BUMP
- 12 solutions pages (ContentPageData) — NEED 8 MORE
- ~50 other pages (homepage, blog, landing pages, privacy, terms, etc.)
- **Total: ~426 pages**

## Target
- **530+ total pages**
- **Majority at 1,600+ words**
- Zero TypeScript errors

## Gap: ~104 pages

### Work Stream 1: Competitor Alt Word Bump (88 pages × ~200-400 words each)
- Files: `src/data/compare/*.tsx` (85 files using ComparisonData type)
- 5 standalone pages use GeoPageShell pattern (already full)
- Action: Expand each data file's prose sections to cross 1,600 words
- Template: Appen (542 lines, 1,441 words) → target 1,800+ words
- Quality: Add competitor-specific research (funding, employees, specialties)

### Work Stream 2: New Solutions Pages (8 pages)
- Files: `src/data/content-pages/*.ts` using ContentPageData type
- Existing 12: vla-training-data, teleoperation-data, sim-to-real-data, egocentric-video-data, etc.
- New 8 topics (from strategy): 
  1. humanoid-robot-training-data
  2. grasping-dataset-commercial
  3. kitchen-manipulation-data
  4. warehouse-robotics-data
  5. multi-robot-training-data
  6. language-conditioned-robot-data
  7. depth-sensing-training-data
  8. safety-critical-robot-data
- Each must be 2,000+ words with real citations

### Work Stream 3: New Programmatic Pages (~96 pages across existing playbooks)
- Glossary: +30 new terms (cross-embodiment-transfer, zero-shot-manipulation, etc.)
- Guides: +20 new how-to guides
- Tasks: +15 new task pages (packing, stacking, pick-and-place variants, etc.)
- Datasets: +15 new dataset pages (new collection domains)
- Labs: +8 new lab pages (Covariant, RightHand Robotics, Anybotics, etc.)
- Benchmarks: +8 new benchmark pages

## Execution Plan

### Phase 1: Competitor Alt Bump (highest ROI — 88 existing pages → 1,600+ words)
- 6 agents, ~15 files each
- Each agent: read file, add 200-400 words of competitor research, expand comparison table
- Build check after each wave

### Phase 2: Solutions Pages (8 new pages)
- 2 agents, 4 pages each
- Use ContentPageData type, follow vla-training-data.ts as gold standard

### Phase 3: New Programmatic Pages (96 new pages)
- 6 agents handling different playbooks
- Each creates new .ts data files following existing type definitions
- Must register in index.ts files

## Acceptance Criteria
- [ ] 530+ total renderable pages
- [ ] >400 pages at 1,600+ words
- [ ] Zero TypeScript errors
- [ ] All new pages in sitemap
- [ ] Build succeeds (`next build`)
