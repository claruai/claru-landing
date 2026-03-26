# Video Asset Inventory

Generated: 2026-03-25
Total videos: 96 files across 5 directories

---

## Summary Statistics

| Directory | Count | Size Range | Resolution | Purpose |
|-----------|-------|------------|------------|---------|
| `mosaic/` | 30 | 36K-240K | 426x240 | Hero mosaic grid tiles |
| `globe/` | 18 | 4K-16K | 64x64 | Globe interaction thumbnails |
| `datasets/` | 4 | 148K-508K | 640x360 | Dataset card preview loops |
| Root (`case-study-*`) | 11 | 240K-5.5M | 720x406 - 1920x1088 | Case study inline videos |
| Root (`cs-*`) | 11 | 588K-5.1M | 1280x720 | Case study card videos (Remotion) |
| Root (`sol-*`) | 11 | 588K-6.2M | 1280x720 | Solution page videos (Remotion) |
| Root (`bento-*`) | 4 | 1.3M-5.8M | 1280x720 | Bento grid demo videos |
| Root (other) | 7 | 968K-6.1M | 1280x720 - 1920x1080 | Hero, standalone pages |

---

## Mosaic Tiles (public/videos/mosaic/)

Raw egocentric/activity footage -- used in hero mosaic grid. All 426x240, 3s loops.

| File | Size | Content Description | Category | Usable For |
|------|------|-------------------|----------|------------|
| mosaic-01.mp4 | 48K | Hands dicing carrots on wooden cutting board, egocentric POV | egocentric-kitchen | hero-raw, globe |
| mosaic-02.mp4 | 88K | Walking down a city sidewalk, egocentric POV with pedestrians and tall buildings | egocentric-outdoor | hero-raw, globe |
| mosaic-03.mp4 | 44K | Hands soldering/wiring a circuit board in a vise, workshop bench with tools | egocentric-workshop | hero-raw, globe |
| mosaic-04.mp4 | 36K | Pouring hot water from electric kettle into a ceramic mug, egocentric kitchen POV | egocentric-kitchen | hero-raw, globe |
| mosaic-05.mp4 | 60K | Ironing a blue dress shirt on ironing board, egocentric POV | egocentric-kitchen | hero-raw, globe |
| mosaic-06.mp4 | 64K | Driving through residential neighborhood, dashboard cam POV with steering wheel visible | driving-traffic | hero-raw, globe |
| mosaic-07.mp4 | 48K | Operating an espresso machine, steaming milk in metal pitcher, egocentric barista POV | egocentric-kitchen | hero-raw, globe |
| mosaic-08.mp4 | 64K | Walking down industrial metal staircase, egocentric POV with hands on railings, pipes and dim lighting | egocentric-outdoor | hero-raw, globe |
| mosaic-09.mp4 | 48K | Folding clothes on a bed, egocentric POV with hands sorting small garments | egocentric-kitchen | hero-raw, globe |
| mosaic-10.mp4 | 92K | Skiing down a snowy mountain slope, egocentric POV with skis and poles visible, alpine panorama | egocentric-outdoor | hero-raw, globe |
| mosaic-11.mp4 | 44K | Typing on a MacBook laptop, close-up of hands on keyboard | office-workplace | hero-raw, globe |
| mosaic-12.mp4 | 40K | Hand-sewing dark blue fabric with needle and thread, sewing supplies in background | egocentric-workshop | hero-raw, globe |
| mosaic-13.mp4 | 80K | Washing dishes with yellow gloves under running water at kitchen sink | egocentric-kitchen | hero-raw, globe |
| mosaic-14.mp4 | 76K | Surfing/paddleboarding POV, bow of surfboard facing ocean wave | egocentric-outdoor | hero-raw, globe |
| mosaic-15.mp4 | 48K | Holding and examining a carved wooden bird figurine in a workshop | egocentric-workshop | hero-raw, globe |
| mosaic-16.mp4 | 240K | Welding metal with bright sparks, industrial workshop setting | egocentric-workshop | hero-raw, globe |
| mosaic-17.mp4 | 56K | Packing items into cardboard box in a warehouse with orange shelving | office-workplace | hero-raw, globe |
| mosaic-18.mp4 | 40K | Sweeping a hardwood floor with a broom, low-angle egocentric shot | egocentric-kitchen | hero-raw, globe |
| mosaic-19.mp4 | 60K | Painting on a canvas with brush -- red and blue strokes, art supplies visible | egocentric-workshop | hero-raw, globe |
| mosaic-20.mp4 | 172K | Cycling through a tree-lined park path, egocentric POV with handlebars visible | egocentric-outdoor | hero-raw, globe |
| mosaic-21.mp4 | 60K | Weightlifting in a gym, man curling dumbbells reflected in mirror | egocentric-outdoor | hero-raw, globe |
| mosaic-22.mp4 | 48K | Knitting with yarn and needles, close-up of hands working dark wool | egocentric-workshop | hero-raw, globe |
| mosaic-23.mp4 | 40K | Browsing social media on iPhone, hands holding phone on couch | egocentric-kitchen | hero-raw, globe |
| mosaic-24.mp4 | 40K | Walking through an office hallway, egocentric POV with doors and fluorescent lighting | office-workplace | hero-raw, globe |
| mosaic-driving.mp4 | 76K | Night driving scene with neon-green wireframe annotations overlaid on cars, pedestrians, and buildings (autonomous driving visualization) | annotated-bbox | hero-annotated |
| mosaic-game-env.mp4 | 160K | Third-person gameplay capture (Red Dead Redemption 2 style), character near stone wall with debug overlay | game-environment | hero-raw |
| mosaic-teleop.mp4 | 108K | Park/outdoor scene with sensor fusion overlay -- trees, grass, waterfront, telemetry data panel on right | teleop | hero-raw |

### Annotated Mosaic Tiles

| File | Size | Content Description | Category | Usable For |
|------|------|-------------------|----------|------------|
| annotated-bbox-01.mp4 | 56K | Same as mosaic-01 (carrots) with orange bounding boxes labeled "person", "hand", "object" | annotated-bbox | hero-annotated |
| annotated-bbox-02.mp4 | 84K | Same as mosaic-08 (staircase) with orange bounding boxes labeled "person", "table", "cup" | annotated-bbox | hero-annotated |
| annotated-depth-01.mp4 | 64K | Same as mosaic-05 (ironing) rendered as grayscale depth map | annotated-depth | hero-annotated |
| annotated-depth-02.mp4 | 232K | Same as mosaic-16 (welding) rendered as grayscale depth map with bright sparks | annotated-depth | hero-annotated |
| annotated-seg-01.mp4 | 56K | Same as mosaic-03 (circuit board) with color-tinted segmentation mask overlay | annotated-seg | hero-annotated |

---

## Globe Thumbnails (public/videos/globe/)

Tiny 64x64 pixel loops used as interactive thumbnails on the 3D globe. All are miniaturized versions of mosaic/other clips. 1-3s each, 4-16K each.

| File | Size | Duration | Source Content | Category |
|------|------|----------|---------------|----------|
| point-01.mp4 | 8K | 3s | Carrot chopping (= mosaic-01) | egocentric-kitchen |
| point-02.mp4 | 8K | 2s | City sidewalk (= mosaic-02) | egocentric-outdoor |
| point-03.mp4 | 12K | 3s | Circuit board (= mosaic-03) | egocentric-workshop |
| point-04.mp4 | 4K | 1s | Kettle pouring (= mosaic-04) | egocentric-kitchen |
| point-05.mp4 | 8K | 3s | Industrial staircase (= mosaic-08) | egocentric-outdoor |
| point-06.mp4 | 8K | 2s | Clothes folding (= mosaic-09) | egocentric-kitchen |
| point-07.mp4 | 8K | 3s | Skiing (= mosaic-10) | egocentric-outdoor |
| point-08.mp4 | 4K | 1s | Laptop typing (= mosaic-11) | office-workplace |
| point-09.mp4 | 16K | 3s | Welding (= mosaic-16) | egocentric-workshop |
| point-10.mp4 | 8K | 2s | Warehouse packing (= mosaic-17) | office-workplace |
| point-11.mp4 | 12K | 3s | Painting canvas (= mosaic-19) | egocentric-workshop |
| point-12.mp4 | 4K | 1s | Cycling park (= mosaic-20) | egocentric-outdoor |
| point-13.mp4 | 8K | 3s | Gym lifting (= mosaic-21) | egocentric-outdoor |
| point-14.mp4 | 12K | 3s | Egocentric grid composite (= hero-desktop) | egocentric-kitchen |
| point-15.mp4 | 12K | 3s | Ocean surfing (= mosaic-14) | egocentric-outdoor |
| point-16.mp4 | 8K | 2s | Dish washing (= mosaic-13) | egocentric-kitchen |
| point-17.mp4 | 12K | 3s | Knitting (= mosaic-22) | egocentric-workshop |
| point-18.mp4 | 8K | 2s | Night driving wireframe (= mosaic-driving) | annotated-bbox |

---

## Dataset Card Loops (public/videos/datasets/)

Small preview loops for dataset browsing cards. All 640x360, 4-5s.

| File | Size | Duration | Content Description | Category | Usable For |
|------|------|----------|-------------------|----------|------------|
| egocentric-activity-loop.mp4 | 264K | 5s | Grid of 6 egocentric clips: pouring liquid, chopping fruit, folding clothes, park walking, espresso making, balcony scene. "386K+ egocentric clips across 3 capture pipelines" header | egocentric-kitchen | enrichment-viz, marquee |
| game-environment-loop.mp4 | 508K | 5s | Red Dead Redemption 2 rooftop chase with Claru capture UI overlay showing metadata, input stream, session info | game-environment | enrichment-viz, marquee |
| object-identity-loop.mp4 | 148K | 4s | Two outdoor conversation scene thumbnails with face detection (face confidence 0.825, fedora label). "Source Segments" header | other | enrichment-viz |
| video-quality-loop.mp4 | 348K | 4s | Pool party scene with metadata panel: source file, category "Outdoor Recreation", description, frames count | other | enrichment-viz |

---

## Bento Grid Videos (public/videos/bento-*)

Polished demo videos for the bento-style feature grid. All 1280x720, 8s.

| File | Size | Duration | Content Description | Category | Usable For |
|------|------|----------|-------------------|----------|------------|
| bento-annotation-interface.mp4 | 1.3M | 8s | 2x2 grid of dark-themed annotation screens showing green bounding boxes on egocentric activities (cooking, assembling, typing, laptop) | annotated-bbox | enrichment-viz |
| bento-autonomous-driving.mp4 | 5.8M | 8s | Night city street with green neon wireframe annotations on cars, pedestrians, buildings -- autonomous driving perception visualization | annotated-bbox | enrichment-viz, hero-annotated |
| bento-frame-tracking.mp4 | 2.6M | 8s | Silhouette of person walking in dark warehouse with glowing green bounding box tracking them | annotated-bbox | enrichment-viz |
| bento-robot-arm.mp4 | 1.4M | 8s | Close-up of robotic gripper arm with green LED indicators hovering over a small metal cube, dark cinematic lighting | industrial-robotics | enrichment-viz |

---

## Hero & Standalone Videos (public/videos/ root)

| File | Size | Duration | Resolution | Content Description | Category | Usable For |
|------|------|----------|------------|-------------------|----------|------------|
| hero-desktop.mp4 | 2.6M | 11s | 1280x720 | 6-panel egocentric activity grid with "386K+ egocentric clips across 3 capture pipelines" header. Same as cs-egocentric/datasets-egocentric-activity-loop but higher res | egocentric-kitchen | hero-raw, marquee |
| annotate.mp4 | 6.1M | 5s | 1920x1080 | Young woman smiling while using laptop on couch, natural lighting -- stock footage feel, represents annotator at work | other | not-usable |
| capture-videos.mp4 | 968K | 8s | 1280x720 | Cooking pancakes/flatbread in a frying pan with oil, egocentric kitchen POV | egocentric-kitchen | enrichment-raw, globe |
| quality-review.mp4 | 4.4M | 5s | 1920x1080 | Person at multi-monitor workstation reviewing/editing code or data, professional office setting | office-workplace | enrichment-viz |
| gaming.mp4 | 5.8M | 11s | 1920x1080 | 3D platformer game (cartoon robot character running through forest with flowers, crates), bright colorful graphics | game-environment | enrichment-raw |

---

## Case Study Inline Videos (public/videos/case-study-*)

Specific clips used within case study pages for side-by-side comparisons and examples.

| File | Size | Duration | Resolution | Content Description | Category | Usable For |
|------|------|----------|------------|-------------------|----------|------------|
| case-study-egocentric-smartphone.mp4 | 788K | 10s | 1280x720 | View from window/balcony looking out at tropical vegetation, mountains, with microphone windscreen on sill | egocentric-outdoor | case-study |
| case-study-eval-pose.mp4 | 240K | 5s | 720x406 | Man in purple t-shirt standing in living room, appears to be a video quality/pose evaluation sample | other | case-study |
| case-study-eval-videoA.mp4 | 488K | 5s | 720x406 | Glamorous woman in gold sequin dress and teal jacket, ornate interior with chandelier -- AI-generated video sample A | other | case-study |
| case-study-eval-videoB.mp4 | 536K | 5s | 720x406 | Same woman/scene as videoA but different generation -- AI-generated video sample B for comparison | other | case-study |
| case-study-game-gameplay-web.mp4 | 4.7M | 10s | 1280x720 | First-person shooter gameplay (Counter-Strike style), gun visible, outdoor map with stone walls | game-environment | case-study |
| case-study-game-inputviz-web.mp4 | 4.7M | 10s | 1280x720 | Same FPS gameplay as above -- appears to be input visualization variant of same capture | game-environment | case-study |
| case-study-prompt-video1.mp4 | 1.8M | 5s | 1920x1080 | Mountain sunset panorama -- golden light on snow-capped peaks, dramatic landscape (AI-generated from prompt) | other | case-study |
| case-study-prompt-video2.mp4 | 1.5M | 5s | 1920x1080 | Green mountain range with tundra, overcast sky (AI-generated from prompt) | other | case-study |
| case-study-redteam-output.mp4 | 5.5M | 5s | 1920x1088 | B&W close-up of bearded man laughing, piano keys in background -- AI-generated content for red-team evaluation | other | case-study |
| case-study-safety-bird.mp4 | 4.5M | 5s | 1920x1080 | Vivid blue/purple bird perched on mossy branch, bokeh green background -- AI-generated content for safety eval | other | case-study |
| case-study-workplace-barista-web.mp4 | 3.2M | 9s | 1280x720 | Hands operating commercial espresso machine, GoPro-style egocentric barista POV in real workplace | egocentric-kitchen | case-study |

---

## Case Study Card Videos -- Remotion (public/videos/cs-*)

Animated Remotion-rendered case study card previews with Claru UI chrome, progress bars, and metadata overlays. All 1280x720.

| File | Size | Duration | Content Description | Category | Usable For |
|------|------|----------|-------------------|----------|------------|
| cs-egocentric.mp4 | 3.1M | 10s | 6-panel egocentric grid with "386K+" header, "GRID OVERVIEW" phase label at bottom | case-study | marquee |
| cs-fashion.mp4 | 668K | 10s | Product photo of man in blue athletic pullover on studio backdrop, "SKU_IMAGE_ANNOTATION" label, "detection" phase | case-study | marquee |
| cs-game-capture.mp4 | 3.7M | 12s | RDR2 rooftop chase with full Claru capture overlay: game metadata, input stream stats, session cost | case-study | marquee |
| cs-gen-safety.mp4 | 592K | 10s | Safety annotation batch review UI: 5 blurred image thumbnails with safety-taxonomy panel (Violence/Gore, Nudity, Hate Speech, Self-Harm, Illegal Activity), SAFE/FLAG buttons | case-study | marquee |
| cs-object-id.mp4 | 832K | 10s | Two cropped image segments (face, fedora hat) with confidence scores, "Source Segments from clip_40" | case-study | marquee |
| cs-prompt-bench.mp4 | 4.5M | 12s | Side-by-side kayaking videos with "Which video best represents the 'Kayaking' category?" prompt, category selection | case-study | marquee |
| cs-red-team.mp4 | 588K | 10s | Red-team content feed + dashboard: moderation pipeline (Model 1-3 + Human Review), category breakdown, false positive rate | case-study | marquee |
| cs-vid-classify.mp4 | 1.8M | 12s | Man on phone in European city, "SUPERVISED_FINE_TUNING / VIDEO CLASSIFICATION" labels, classify task panel | case-study | marquee |
| cs-vid-eval.mp4 | 3.0M | 12s | Side-by-side AI capybara videos with "Which video better matches the prompt?" evaluation UI | case-study | marquee |
| cs-vid-quality.mp4 | 2.6M | 12s | Pool party scene with source metadata JSON panel (file, source, category, frames, description) | case-study | marquee |
| cs-workplace.mp4 | 5.1M | 10s | Egocentric barista espresso scene with full sensor_fusion.json overlay: task state, hand telemetry, object states, spatial, IMU | case-study | marquee |

---

## Solution Page Videos -- Remotion (public/videos/sol-*)

Animated Remotion-rendered solution page hero videos with Claru UI chrome. All 1280x720, 10-12s.

| File | Size | Duration | Content Description | Category | Usable For |
|------|------|----------|-------------------|----------|------------|
| sol-crowd-vs-expert.mp4 | 624K | 10s | Terminal-style "$ Evaluate: Is this merge sort" code review prompt, "Reviewing Code" phase label | case-study | marquee |
| sol-egocentric.mp4 | 2.1M | 10s | Egocentric kitchen POV with blue bounding boxes on objects (bottle, mug, hand) + full sensor_fusion.json panel with task state, telemetry, object states, spatial | case-study | enrichment-viz |
| sol-eu-ai-act.mp4 | 588K | 10s | Compliance review UI: content panel with "Generative AI System / Emotion Recognition / Workplace Surveillance" + EU AI Act compliance checklist, "Art. 5 Review" | case-study | marquee |
| sol-manipulation.mp4 | 3.6M | 10s | Egocentric garment folding with blue bounding boxes, hand tracking labels, sensor_fusion.json panel with manipulation-specific data (force, grip type, work depth) | teleop | enrichment-viz |
| sol-open-vs-custom.mp4 | 636K | 10s | "OPEN VS CUSTOM -- Dataset Comparison" title screen, "Loading Datasets" phase label | case-study | marquee |
| sol-red-teaming.mp4 | 588K | 10s | Red-team content feed + dashboard UI (same layout as cs-red-team), "Detection Active" | case-study | marquee |
| sol-rlhf.mp4 | 768K | 12s | RLHF annotation UI: code comparison (Response A vs Response B, python), "Write a function to find the longest pali..." prompt | case-study | marquee |
| sol-sim2real.mp4 | 6.2M | 12s | RDR2 gameplay with full Claru capture overlay including subtitles "I'm being chased by the village idiot", input_capture.json panel | game-environment | enrichment-viz |
| sol-teleop.mp4 | 4.4M | 10s | Park/greenery scene with sensor_fusion.json overlay: object states (grass, tree, palm), spatial data, IMU estimate, "idle" phase | teleop | enrichment-viz |
| sol-video-gen.mp4 | 2.7M | 12s | Side-by-side western/cowboy AI-generated videos with "Which video better matches the prompt?" comparison UI | case-study | marquee |
| sol-vla.mp4 | 2.8M | 10s | Egocentric pomelo cutting with blue bounding boxes + full sensor_fusion.json panel: task state, hand telemetry (21N force), object states (cuttable, cutting tool) | teleop | enrichment-viz |

---

## Category Summary

| Category | Count | Files |
|----------|-------|-------|
| egocentric-kitchen | 22 | mosaic 01,04,05,07,09,13,18,23 + globe equivalents + capture-videos, case-study-workplace-barista, hero-desktop, datasets-egocentric |
| egocentric-outdoor | 14 | mosaic 02,08,10,14,20,21 + globe equivalents + case-study-egocentric-smartphone |
| egocentric-workshop | 12 | mosaic 03,12,15,16,19,22 + globe equivalents |
| office-workplace | 6 | mosaic 11,17,24 + globe equivalents + quality-review |
| driving-traffic | 2 | mosaic-06, mosaic-driving |
| game-environment | 6 | mosaic-game-env, gaming, case-study-game-gameplay-web, case-study-game-inputviz-web, datasets-game-environment-loop, sol-sim2real |
| industrial-robotics | 1 | bento-robot-arm |
| teleop | 4 | mosaic-teleop, sol-teleop, sol-manipulation, sol-vla |
| annotated-bbox | 6 | annotated-bbox-01, annotated-bbox-02, mosaic-driving, bento-annotation-interface, bento-autonomous-driving, bento-frame-tracking |
| annotated-depth | 2 | annotated-depth-01, annotated-depth-02 |
| annotated-seg | 1 | annotated-seg-01 |
| case-study (Remotion UI) | 22 | All cs-* and sol-* files |
| other | 9 | annotate, case-study-eval-pose, eval-videoA/B, prompt-video1/2, redteam-output, safety-bird, datasets-object-identity-loop, datasets-video-quality-loop |

---

## Usability Assessment

### Ready for hero mosaic: 27 tiles
- 24 raw egocentric tiles (mosaic-01 through mosaic-24) at 426x240
- 3 domain-specific tiles (mosaic-driving, mosaic-game-env, mosaic-teleop) at 426x240

### Ready for hero annotated overlay: 5 tiles
- annotated-bbox-01, annotated-bbox-02 (orange bounding boxes)
- annotated-depth-01, annotated-depth-02 (grayscale depth maps)
- annotated-seg-01 (segmentation mask)

### Ready for globe: 18 thumbnails
- All globe/point-01 through point-18 at 64x64

### Ready for case study marquee: 11 Remotion videos
- All cs-* files at 1280x720

### Ready for solution pages: 11 Remotion videos
- All sol-* files at 1280x720

### Potentially not usable:
- **annotate.mp4** (6.1M) -- Generic stock footage of woman on laptop, doesn't match the technical/data quality brand
- **case-study-eval-pose.mp4** (240K) -- Low-res (720x406) man standing in living room, unclear purpose
- **datasets-object-identity-loop.mp4** (148K) -- Very small, face crops at 640x360, might work as thumbnail only

---

## Resolution Tiers

| Tier | Resolution | Count | Usage |
|------|-----------|-------|-------|
| Full HD | 1920x1080/1088 | 7 | Standalone hero/fullscreen videos |
| HD | 1280x720 | 33 | Bento grid, case study cards, solution pages, hero-desktop |
| SD | 720x406 | 3 | Case study eval clips (low quality) |
| Small | 640x360 | 4 | Dataset card preview loops |
| Mosaic | 426x240 | 30 | Hero mosaic grid tiles |
| Thumbnail | 64x64 | 18 | Globe interaction points |

---

## Notes for PRD

1. **Mosaic tiles are low-res (426x240)** -- adequate for small grid cells but would look blurry if enlarged. If the PRD calls for larger mosaic cells, these need re-encoding from source.

2. **Globe thumbnails are 64x64** -- extremely small, purpose-built for the globe dots. Cannot be repurposed for anything larger.

3. **Annotated variants only exist for 5 of 27 mosaic clips.** If the PRD needs more annotated tiles (bbox, depth, seg), the FAL pipeline would need to process additional mosaic sources.

4. **Remotion videos (cs-*, sol-*) all have Claru UI chrome baked in.** They cannot be used as raw footage -- only as pre-rendered showcases.

5. **Three videos appear to be duplicates or near-duplicates:**
   - `hero-desktop.mp4` = `cs-egocentric.mp4` = `datasets-egocentric-activity-loop.mp4` (same 6-panel grid at different resolutions)
   - `cs-red-team.mp4` = `sol-red-teaming.mp4` (same moderation dashboard UI)
   - `cs-gen-safety.mp4` = nearly identical concept to `sol-red-teaming.mp4`

6. **Missing content gaps:**
   - No raw robotics manipulation footage (only bento-robot-arm which is cinematic B-roll, not real teleop)
   - No raw autonomous driving footage (only synthetic/annotated wireframe viz)
   - No raw industrial/factory footage
   - Limited diversity in annotated overlay types (only bbox, depth, seg -- no keypoint, optical flow, or action recognition overlays)

7. **`annotate.mp4` should likely be replaced.** It's a stock-looking clip of a woman on a couch with a laptop -- doesn't convey technical annotation work. Consider replacing with actual annotation interface screen recording.

8. **Case study eval videos (720x406) are the lowest quality group** and would look poor on retina displays. Consider re-encoding at higher resolution if they appear prominently.
