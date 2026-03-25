# Session 001 Continued — 2026-03-25 (evening)

## Summary
Massive build session. Ralph autonomously built 14/14 stories for V2 landing page. Multiple design iteration rounds followed. Currently in a "good structure but needs visual polish" state. Core feedback: videos need individual curation, hero needs organic edge decomposition (not CSS masks), enrichment section needs complete rethink as multi-scene scroll narrative, globe needs environment-type labels.

## What Was Built
- 14 user stories implemented via Ralph loop (~45 min autonomous)
- R3F 3D floating video wall hero (Three.js + bloom + parallax)
- Two-row auto-scrolling scale marquee (replaced clickable catalog)
- GSAP scroll-pinned enrichment section (5-step layer reveal)
- COBE globe with 18 collection points showing video thumbnails
- Real assets from FAL (depth maps, pose, segmentation) + S3 clips
- GTM copy rewrite (leads with catalog + annotation, not enrichment)
- 195 global skills installed

## Branch State
- Branch: `landing-page-v2`
- Last commit: `b9a0b78` (+ uncommitted enrichment agent changes)
- Dev server: port 3080

## Critical Feedback Not Yet Addressed

### Hero
- Videos have sharp rectangular edges — should decompose into ASCII/particles at edges
- Every video tile needs individual curation:
  - "Depth map" tile should show actual depth visualization
  - "Tracking" tile should show real object tracking with bboxes
  - "Segmentation" tile should show real seg masks
  - Need to build a pipeline: take raw clip → run through FAL → create visualization clip
- Grid looks "slapped together" — needs to feel like data emerging from terminal noise

### Enrichment Section (REJECTED TWICE)
- Layer-by-layer overlay approach is wrong
- Should be multi-scene scroll parallax:
  - Different videos (not one video with overlays)
  - Raw footage → pose visualization → depth heatmaps → 3D reconstruction → JSON metadata
  - Reference images shared: pose skeletons on humans+robots, multi-modal views (RGB/depth/normals/seg), hand gesture recognition, 3D camera rig viz
  - Message: "we don't just give raw data, we give rich supporting data"

### Globe
- Labels should be environment types, not city names
  - "Kitchen in Mumbai" not just "Mumbai"
  - "Warehouse in Lagos" not just "Lagos"
  - "Road in Ho Chi Minh" not just "Ho Chi Minh"
- Every video at every point needs QA — must show real egocentric footage

## Next Steps (for next session)

### Phase 1: Video Asset Pipeline
1. Inventory ALL available videos (mosaic, datasets, case studies)
2. Watch/screenshot each one, categorize by content
3. For each hero tile slot, identify the right source video
4. Run FAL pipeline to create visualization variants:
   - Depth map visualization (FAL Depth Anything)
   - Pose skeleton overlay (FAL DWPose)
   - Segmentation mask overlay (FAL SAM2)
   - Surface normal visualization
5. Create the actual depth-map-looking clip, tracking-with-bbox clip, etc.

### Phase 2: Hero Visual Effects
1. Implement ASCII/particle edge decomposition on the R3F tiles
   - Options: custom shader that dissolves edges into particles, or WebGL post-processing that converts edge pixels to ASCII characters
2. Re-curate every tile position with the right video

### Phase 3: Enrichment Rebuild
1. Multiple different scenes, not one scene with overlays
2. Scroll-driven parallax across: raw → pose viz → depth heatmap → 3D reconstruction → metadata JSON
3. Each step shows a DIFFERENT video/image, not the same one
4. Generate all visual assets via FAL first

### Phase 4: Globe Polish
1. Change labels to "Environment in City" format
2. QA every video at every point
3. Ensure all show real egocentric footage

## Key Files
- `src/app/v2/` — all V2 code
- `src/app/v2/components/sections/HeroV2.tsx` — R3F hero
- `src/app/v2/components/ui/VideoWall3D.tsx` — Three.js wall component
- `src/app/v2/components/sections/CatalogShowcase.tsx` — scale marquee
- `src/app/v2/components/sections/EnrichmentPipeline.tsx` — scroll enrichment
- `src/app/v2/components/sections/CollectionNetwork.tsx` — globe
- `public/videos/mosaic/` — hero mosaic clips
- `public/videos/globe/` — globe thumbnail clips
- `public/images/slider/` — enrichment overlay assets
- `tasks/prd-landing-page-v2.md` — full PRD (901 lines)
