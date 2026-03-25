# Session 001 Continued — 2026-03-25 (evening)

## Summary
Continued case study visualization work. Iterated through multiple approaches for dashcam detection overlays. Final state: 7 motion-verified driving clips with Gemini bounding box overlays at 30fps. Map visualization still needs building as a Remotion composition.

## What Still Needs Building

### Remotion Composition: Bellwood Infrastructure Detection
**Concept** (from user):
1. **Start with 3x3 grid** — 9 dashcam feeds all driving with detection overlays playing simultaneously
2. **Zoom into one grid cell** — it expands to full screen showing the driving + detection bounding boxes
3. **Side panel slides in** — shows a map of Bellwood with driver routes highlighted, issue pins appearing as detections are found

### Assets Ready
- 7 detected clips at `/tmp/bellwood-v3/clip_0{0-6}_detected.mp4` (1280x720, 5s each, 30fps)
- Sezim detected clip at `/tmp/bellwood-v3/sezim_detected.mp4`
- Grid tiles at `/tmp/bellwood-v3/tiles/t{0-8}.mp4` (426x240)
- Pre-built grid video at `/tmp/bellwood-v3/grid.mp4`
- All clips verified driving (no 0 MPH parked clips)
- Speed verified: 7-31 MPH across all clips

### Clip Speed Map
| Clip | Speed | Scene |
|------|-------|-------|
| clip_00 | 15 MPH | Residential street, overcast |
| clip_01 | 0 MPH | PARKED — DO NOT USE |
| clip_02 | 31 MPH | Commercial buildings, rain |
| clip_03 | 31 MPH | Rainy commercial road, passing cars |
| clip_04 | 0 MPH | PARKED — DO NOT USE |
| clip_05 | 7 MPH | Commercial intersection, trucks |
| clip_06 | 19 MPH | Dawn residential |
| sezim | 31 MPH | Main road, overcast |

### Bellwood GPS Coordinates (from dashcam HUD)
- N:41.8827 W:87.8747 (residential)
- N:41.8837 W:87.8832 (commercial rain)
- N:41.9223 W:87.8704 (main road)
- N:41.8877 W:87.8635 (commercial intersection)
- N:41.8875 W:87.8907 (dawn residential)

### Technical Notes
- Gemini drawbox at 30fps via ffmpeg is the working approach
- Extract keyframes at 3fps, run Gemini detection, apply drawbox filter (each detection held for 10 frames)
- SAM 3 on FAL: only mask mode works (black cutout), bounding box mode crashes
- Florence-2 OVD: treats comma-separated prompt as single label
- YOLO + Supervision: works but COCO categories only, not infrastructure-specific
- Motion detection: use frame-to-frame JPEG file size variance as proxy — but must verify speed from HUD

### Remotion Implementation Plan
1. Create `src/remotion/compositions/type-9/BellwoodInfraComposition.tsx`
2. Use `<OffthreadVideo>` for the 9 grid clips (copy to `public/remotion-assets/bellwood/`)
3. Phase 1 (0-90 frames / 0-3s): 3x3 grid with all videos playing
4. Phase 2 (90-180 frames / 3-6s): Center tile scales up with `interpolate()` to fill screen
5. Phase 3 (180-450 frames / 6-15s): Side panel slides in from right with:
   - Static map image of Bellwood area (generate from Mapbox/OpenStreetMap)
   - Animated SVG route lines showing driver paths (use GPS coords)
   - Issue pins appearing with pop animation as detection count ticks up
6. Phase 4 (450-600 frames / 15-20s): Stats counter overlay — "75+ hours", "200+ lane-miles", "3x more defects detected"

### Background Jobs Status
- Bellwood caption enrichment: was running (check `/tmp/enrich-bellwood.log`)
- Bellwood bbox enrichment: was running (check `/tmp/enrich-bbox.log`)
- Candidate testing enrichment: was running (check `/tmp/enrich-candidate.log`)
- All may have completed or errored — check on next session start

### Git State
- Branch: `brook-wildflower`
- Last commit: `06274de` (v3 viz: motion-verified driving clips)
- 8 commits ahead of origin/brook-wildflower (unpushed)
- PR #51 merged to staging (legacy migration)
- Staging → main merge still pending
