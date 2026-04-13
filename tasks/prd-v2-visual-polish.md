# PRD: V2 Landing Page Visual Polish

## Overview

This PRD specifies exact video placements, FAL pipeline processing, and visual effects for the V2 landing page. Every clip is intentionally chosen and QA'd. No placeholders. No random assignments.

**Branch:** `landing-page-v2` (existing) **Prerequisite:** The page structure (7 sections) is already built. This PRD covers visual execution only.

---

## Section 1: Hero — R3F Floating Video Wall

### Visual Goal

A floating wall of video tiles in 3D space where edges organically decompose into ASCII characters/particles. The wall emerges from a field of terminal noise, not sits on top of it.

### Tile Assignment (12 tiles, 4x3 grid)

Each tile is intentionally curated. The mix communicates: "we have diverse real-world footage AND rich annotations."

| Position | Video Source | Content | Label | Processing Needed |
| --- | --- | --- | --- | --- |
| (0,0) top-left | mosaic-04.mp4 | Pouring hot water from kettle, egocentric kitchen | KITCHEN | None — raw footage. (mosaic-01 reserved for enrichment section) |
| (1,0) | sol-egocentric.mp4 (crop to tile) | Kitchen POV with blue bounding boxes + sensor_fusion.json panel | ANNOTATED | Crop to 426x240, extract 3s loop from 2-5s mark |
| (2,0) | mosaic-06.mp4 | Daytime residential driving, dashboard cam | DRIVING | None — raw footage. (Use daytime driving, not duplicate night wireframe) |
| (3,0) top-right | mosaic-game-env.mp4 | RDR2 third-person gameplay | GAME ENV | None |
| (0,1) | bento-robot-arm.mp4 (crop) | Robotic gripper hovering over metal cube, green LEDs | ROBOTICS | Crop to 426x240, extract 3s loop. (Physical AI hero MUST have robotics) |
| (1,1) | NEW: depth-welding.mp4 | mosaic-16 (welding) processed through FAL Depth Anything | DEPTH MAP | **FAL PIPELINE**: extract frames from mosaic-16 → Depth Anything → blue-purple colormap. (Non-kitchen scene for diversity) |
| (2,1) | mosaic-03.mp4 | Soldering circuit board, workshop | WORKSHOP | None — raw footage |
| (3,1) | NEW: pose-manipulation.mp4 | sol-manipulation.mp4 cropped — hands folding with pose skeleton overlays | POSE | Crop to 426x240, extract 3s loop |
| (0,2) bottom-left | mosaic-17.mp4 | Warehouse packing, orange shelving | WAREHOUSE | None — raw footage |
| (1,2) | bento-autonomous-driving.mp4 (crop) | Night city with green wireframe — AV perception | 3D WIREFRAME | Crop to 426x240, extract 3s loop |
| (2,2) | NEW: segmentation-warehouse.mp4 | mosaic-17 (warehouse) processed through FAL SAM2 | SEGMENTATION | **FAL PIPELINE**: extract frames → SAM2 → colorize masks. (Non-kitchen scene) |
| (3,2) bottom-right | mosaic-teleop.mp4 | Park scene with sensor fusion overlay | TELEMETRY | None |

### FAL Pipeline for Hero Tiles

**Tile (1,1) — Depth Map (welding scene):**

```bash
# Extract 72 frames from mosaic-16 (welding) at native 24fps
ffmpeg -i public/videos/mosaic/mosaic-16.mp4 -vf "fps=24" /tmp/depth-frames/frame-%03d.jpg

# Run each through FAL Depth Anything
for f in /tmp/depth-frames/frame-*.jpg; do
  BASE64=$(base64 -i "$f")
  curl -X POST "https://fal.run/fal-ai/imageutils/depth" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"image_url\": \"data:image/jpeg;base64,$BASE64\"}" \
    -o "/tmp/depth-out/$(basename $f .jpg).json"
  # Download result image
  URL=$(python3 -c "import json; print(json.load(open('/tmp/depth-out/$(basename $f .jpg).json'))['image']['url'])")
  curl -o "/tmp/depth-rendered/$(basename $f)" "$URL"
done

# Reassemble into video
ffmpeg -framerate 24 -i /tmp/depth-rendered/frame-%03d.jpg -c:v libx264 -crf 28 -vf "scale=426:240" public/videos/mosaic/depth-welding.mp4
```

**Tile (2,2) — Segmentation**:Similar pipeline using `fal-ai/sam2/auto-segment`, colorizing the masks in purple/teal.

**Tile crops from Remotion videos:**

```bash
# sol-egocentric (annotated kitchen with sensor JSON)
ffmpeg -i public/videos/sol-egocentric.mp4 -ss 2 -t 3 -vf "scale=426:240" -c:v libx264 -crf 28 -an public/videos/mosaic/annotated-sensor.mp4

# sol-manipulation (hands with pose + bboxes)
ffmpeg -i public/videos/sol-manipulation.mp4 -ss 1 -t 3 -vf "scale=426:240" -c:v libx264 -crf 28 -an public/videos/mosaic/annotated-pose.mp4

# bento-autonomous-driving (high-quality driving wireframe)
ffmpeg -i public/videos/bento-autonomous-driving.mp4 -ss 2 -t 3 -vf "scale=426:240" -c:v libx264 -crf 28 -an public/videos/mosaic/driving-hq.mp4
```

### Edge Decomposition Effect

The R3F video wall tiles should NOT have sharp rectangular edges. Instead:

**Approach: Custom shader that converts edge pixels to ASCII characters**

In the VideoWall3D component, add a custom `ShaderMaterial` that:

1. Renders the video texture normally in the center of each tile
2. At the edges (last 15% of each side), gradually converts the image to ASCII-art characters
3. Characters use sage green color (#92B090) at varying opacity
4. The transition zone has noise/randomness so it looks organic, not geometric

Implementation: A fragment shader that samples the video texture, and at edge pixels, replaces the color with a character from an ASCII texture atlas, colored in sage green. The "ASCII zone" expands slightly over time with a sine wave for organic breathing.

Fallback: If custom shaders are too complex, use a CSS approach — clip each tile to a slightly irregular shape using SVG clip paths, with the matrix rain visible in the gaps between tiles.

---

## Section 2: Scale Marquee (CatalogShowcase)

### Video Selection per Marquee Slot

**Row 1 (scrolls left) — Raw footage diversity:**

| Slot | Video | Content | Category Label |
| --- | --- | --- | --- |
| 1 | mosaic-07.mp4 | Espresso machine, barista POV | KITCHEN |
| 2 | mosaic-03.mp4 | Circuit board soldering | WORKSHOP |
| 3 | case-study-game-gameplay-web.mp4 (crop to 280x180) | FPS gameplay (CS-style) | GAME |
| 4 | mosaic-06.mp4 | Residential driving, dashboard | DRIVING |
| 5 | mosaic-16.mp4 | Welding with sparks | INDUSTRIAL |
| 6 | mosaic-17.mp4 | Warehouse packing | WAREHOUSE |
| 7 | case-study-workplace-barista-web.mp4 (crop) | Espresso machine, barista POV | WORKPLACE |
| 8 | mosaic-02.mp4 | Walking down city sidewalk, egocentric POV | STREET |

**Row 2 (scrolls right) — Annotated + case study variety:**

| Slot | Video | Content | Category Label |
| --- | --- | --- | --- |
| 1 | sol-egocentric.mp4 (crop) | Kitchen with bbox + sensor JSON | ANNOTATED |
| 2 | cs-game-capture.mp4 (crop) | RDR2 with capture UI overlay | GAME CAPTURE |
| 3 | bento-annotation-interface.mp4 (crop) | 2x2 annotation grid with bboxes | ANNOTATION |
| 4 | sol-manipulation.mp4 (crop) | Garment folding with pose tracking | MANIPULATION |
| 5 | cs-workplace.mp4 (crop) | Barista with sensor_fusion JSON | SENSOR DATA |
| 6 | sol-vla.mp4 (crop) | Pomelo cutting with hand telemetry | TELEMETRY |
| 7 | bento-frame-tracking.mp4 (crop) | Person tracking with bbox | TRACKING |
| 8 | cs-vid-quality.mp4 (crop) | Pool scene with metadata panel | QUALITY |

### Processing

All Remotion/bento/case-study crops:

```bash
ffmpeg -i INPUT.mp4 -ss 1 -t 5 -vf "scale=560:360:force_original_aspect_ratio=decrease,pad=560:360:-1:-1" -c:v libx264 -crf 28 -an OUTPUT.mp4
```

---

## Section 3: Enrichment — Scroll Parallax Multi-Scene Story

### Visual Goal

NOT a single video with overlay layers. A scroll-driven journey across DIFFERENT scenes showing the richness of what ships with Claru data.

### Scroll Steps (pinned section, \~500vh)

**Step 1: "Raw footage"**

- Full-width video frame: mosaic-01 (hands dicing carrots) playing as a loop
- Text: "Every dataset starts with raw footage captured in real environments."
- Clean, no overlays. The point is: this is what raw egocentric data looks like.

**Step 2: "Object detection and tracking"**

- CROSSFADE to: sol-egocentric.mp4 frame — same kind of kitchen scene but WITH blue bounding boxes on objects and hand tracking visible
- Text: "We add object detection and hand tracking on every frame."
- The Remotion video already has this visualization built in — we just show a frame/loop from it.
- Note: sol-egocentric shows bboxes + sensor panel. The bboxes are the visual focus here; sensor panel adds richness.

**Step 3: "Depth and spatial understanding"**

- CROSSFADE to: the FAL-generated depth map video (depth-welding.mp4 from the hero pipeline — welding scene in blue-purple depth colormap)
- Full-width, single image. No split-screen. The depth visualization alone is visually striking.
- Text: "Per-pixel depth estimation turns flat video into spatial data."

**Step 4: "Pose and hand tracking"**

- CROSSFADE to: sol-manipulation.mp4 frame — hands folding garment with pose skeleton visible, bounding boxes, hand tracking labels
- DECISION: sol-manipulation (not sol-vla). Garment folding with visible pose skeleton is immediately legible. Sol-vla's force telemetry (21N) is metadata, saved for step 5.
- Text: "Hand and body pose tracking across every frame."
- Scene change from kitchen/welding to garment folding communicates: "we do this across any environment."
- Transitional text: "Across any scene..."

**Step 5: "Structured metadata"**

- CROSSFADE to: cs-workplace.mp4 frame — barista scene with the full sensor_fusion.json panel visible (task state, hand telemetry, object states, spatial, IMU)
- The JSON panel IS the visual. Terminal-style structured data alongside the video frame.
- Text: "Every clip ships with structured metadata: timestamps, sensor readings, object states, action labels."
- This is the "one clip from your dataset" moment.

**Step 6: "This is one clip."**

- Pull back (zoom out animation): the single enriched frame shrinks to become ONE card in a grid of many similar cards, implying massive scale
- Text: "This is one clip. Your dataset has thousands."
- CTA: "Book a Call"

### Assets Needed

- Steps 1-2: already have raw mosaic clips + sol-egocentric.mp4
- Step 3: FAL depth map video (generate) + surface normal viz (generate via FAL Marigold or colorize)
- Step 4: sol-manipulation.mp4 or sol-vla.mp4 frame (already have)
- Step 5: cs-workplace.mp4 frame (already have) — the sensor_fusion.json panel is baked in
- Step 6: animation effect (GSAP scale + opacity)

---

## Section 4: Globe — Environment Labels + QA'd Videos

### Collection Points (18 locations)

Each point has:

- A tiny video thumbnail (64x64 → keep, but UPGRADE sources)
- An environment label (NOT city name): "Kitchen in Mumbai", "Warehouse in Lagos"
- Green pulsing dot

| Location | Environment Label | Video Source | Content QA |
| --- | --- | --- | --- |
| San Francisco | Lab in San Francisco | mosaic-game-env (game capture) | Game env from capture lab ✓ |
| Mumbai | Kitchen in Mumbai | mosaic-07 (espresso machine) | Barista POV, clear hands ✓ |
| Ho Chi Minh City | Road in Ho Chi Minh | mosaic-06 (residential driving) | Dashboard cam, clear driving ✓ |
| São Paulo | Electronics in São Paulo | mosaic-03 (circuit board soldering) | Clear electronics work, hands + tools ✓ |
| Kyiv | Kitchen in Kyiv | mosaic-04 (kettle pouring) | Clear egocentric kitchen ✓ |
| Lagos | Warehouse in Lagos | mosaic-17 (warehouse packing) | Warehouse with orange shelving ✓ |
| Manila | Industrial in Manila | mosaic-16 (welding) | Industrial workshop, sparks ✓ |
| Bangkok | Street in Bangkok | mosaic-02 (city sidewalk) | Walking POV, urban ✓ |
| London | Office in London | mosaic-24 (office hallway) | Office/workplace ✓ |
| Mexico City | Domestic in Mexico City | mosaic-09 (clothes folding) | Home environment, clear activity ✓ |
| Jakarta | Café in Jakarta | capture-videos.mp4 (crop to 64x64) | Pancake/flatbread cooking, egocentric kitchen POV ✓ |
| Nairobi | Facility in Nairobi | mosaic-08 (industrial staircase) | Industrial facility, clear POV ✓ |
| Cairo | Textile in Cairo | mosaic-22 (knitting wool) | Detailed handwork, clear ✓ |
| Dhaka | Kitchen in Dhaka | mosaic-13 (dish washing) | Kitchen activity, clear ✓ |
| Lima | Artisan in Lima | mosaic-15 (carved bird figurine) | Craft/artisan work ✓ |
| Bogotá | Office in Bogotá | mosaic-11 (laptop typing) | Office activity ✓ |
| Karachi | Domestic in Karachi | mosaic-18 (sweeping floor) | Home maintenance activity ✓ |
| Accra | Studio in Accra | mosaic-19 (painting canvas) | Art studio activity ✓ |

### Videos to EXCLUDE from globe (bad content):

- mosaic-10 (skiing) — not egocentric work activity
- mosaic-14 (surfing) — not work activity
- mosaic-20 (cycling) — not work activity
- mosaic-21 (weightlifting) — not work activity
- mosaic-23 (phone on couch) — not work activity

### Globe Label Format

```
"Kitchen in Mumbai" (not just "Mumbai")
```

JetBrains Mono 10px, white/80. Environment type in white, city in white/50.

---

## Section Order Change

**Current:** Hero → CatalogShowcase → Enrichment → ThreeModes → Globe → Proof → CTA **New:** Hero → Enrichment → CatalogShowcase → ThreeModes → Globe → Proof → CTA

Rationale: The enrichment story builds understanding of WHAT Claru delivers (not just raw footage — rich annotated data). The marquee THEN demonstrates scale. Current order shows volume before the visitor understands what they're looking at.

---

## Mobile & Performance Specs

### Performance Budget

- Total video file count: \~50 across all sections
- Hero: 12 videos × \~100KB avg = \~1.2MB (R3F loads all on mount — acceptable)
- Marquee: 16 videos × \~200KB avg = \~3.2MB (lazy, IntersectionObserver — loads as visible)
- Enrichment: 5 images/videos (preloaded during pin — \~500KB total)
- Globe: 18 videos × \~10KB = \~180KB (tiny 64x64)
- **All videos**: `preload="none"` except hero tiles which use `preload="metadata"`
- **Poster frames**: Extract first-frame JPG for every video so tiles show content before video loads
- **Max file size per clip**: 500KB for mosaic tiles, 1MB for marquee, 20KB for globe

### Mobile Fallbacks

- **Hero**: R3F canvas disabled below 768px. Show a 2x3 CSS grid with 6 tiles (existing fallback).
- **Marquee**: Single row, 200x130px cards, touch-scrollable.
- **Enrichment**: Disable GSAP pin. Show 5 steps as vertical stack with Framer Motion `whileInView` fade-in.
- **Globe**: 300px height, 8000 mapSamples. Video thumbnails at 44x44px. Environment labels hidden below 640px (show city only).
- **All touch targets**: 44x44px minimum.

### prefers-reduced-motion

- Hero: Static poster images in CSS grid, no R3F, no matrix rain
- Marquee: Static cards, no scrolling animation
- Enrichment: Show final "all enriched" frame with metadata panel, no scroll pin
- Globe: Static globe snapshot, no rotation, no video thumbnails

---

## Implementation Order

 1. **FAL Pipeline** — Generate depth map video from mosaic-16 (welding) + segmentation video from mosaic-17 (warehouse)
 2. **Video crops** — Extract 3s/5s loops from sol-egocentric, sol-manipulation, bento-autonomous-driving, bento-robot-arm, cs-workplace, cs-game-capture
 3. **Poster frames** — Extract first-frame JPG from every video used on the page
 4. **Section reorder** — Update V2Content.tsx: Hero → Enrichment → CatalogShowcase → ThreeModes → Globe → Proof → CTA
 5. **Hero tiles** — Update VideoWall3D tile configuration with curated clips
 6. **Hero edge effect** — Implement ASCII edge decomposition shader (or CSS fallback)
 7. **Marquee videos** — Update CatalogShowcase with curated Row 1 + Row 2 videos
 8. **Enrichment rebuild** — Multi-scene scroll story with the 6 steps
 9. **Globe labels + videos** — Change to "Environment in City" format, update video assignments, regenerate globe thumbnails
10. **Visual QA** — Playwright screenshot every section at desktop + mobile, review each tile/video individually

---

## CTA Destinations

- **Hero "Book a Call"** → links to Calendly scheduling page (or `/api/booking-url` redirect which already exists in the codebase). NOT the contact form — this is for high-intent visitors.
- **Hero "Explore the Catalog"** → links to `/catalog`
- **Final CTA "Talk to Our Team"** → scrolls to `#contact` form (lower intent, wants to describe their needs)
- **Final CTA "See the Catalog"** → links to `/catalog`

## Social Proof Section (unchanged from current)

Keep the existing SocialProofV2 section as-is:

- 4 metrics: 3.7M+ annotations, 97%+ inter-annotator agreement, 25+ datasets, 8 modalities
- Horizontal scroll testimonial cards
- No changes needed in this PRD — social proof is content-complete

## Poster Frame Extraction

One-time script to generate poster JPGs for every video:

```bash
# scripts/extract-posters.sh
for f in public/videos/mosaic/*.mp4; do
  ffmpeg -i "$f" -frames:v 1 -q:v 2 "${f%.mp4}-poster.jpg" -y
done
for f in public/videos/globe/*.mp4; do
  ffmpeg -i "$f" -frames:v 1 -q:v 2 "${f%.mp4}-poster.jpg" -y
done
```

For R3F hero: load poster as `THREE.TextureLoader` image, display immediately, swap to `VideoTexture` on `video.oncanplay`. This eliminates the black-tile flash during video decode.

For regular `<video>` elements (marquee, globe): use HTML `poster` attribute.

---

## QA Criteria

- [ ] Every hero tile shows intentional content (no random faces, no ironing boards as "depth maps")

- [ ] Annotated tiles show REAL annotations (bboxes, depth maps, segmentation, not CSS tints)

- [ ] Marquee Row 2 shows clearly annotated/enriched content distinct from Row 1 raw footage

- [ ] Enrichment scroll tells a coherent story across different scenes

- [ ] Every globe video shows egocentric work activity (no skiing, surfing, weightlifting)

- [ ] Globe labels show "Environment in City" format

- [ ] No console errors

- [ ] Mobile fallback works

- [ ] prefers-reduced-motion fallback works