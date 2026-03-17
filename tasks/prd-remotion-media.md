# PRD: Remotion + Gemini Media Enhancement (v2)

## Introduction

22 pre-rendered Remotion video compositions (11 solution pages + 11 case study pages) that visualize real annotation workflows using actual S3 media samples and annotation JSON data. Each composition shows a specific annotation workflow in action -- not generic charts, but the actual data labeling processes Claru performs for frontier AI labs. 8 composition types grounded in real media assets. Gemini 2.5 Flash enrichment used ONLY for datasets lacking annotation data (Egocentric, Cinematic). Videos rendered to MP4 locally, committed to repo.

**Reference Implementation:** `tasks/docs/remotion-media-design.md` -- full architecture, component interfaces, data models, Gemini pipeline design, case study redesign spec.

**Media Asset Audit:** `tasks/docs/media-asset-audit.md` -- visual inspection of all 12 S3 datasets that determined composition types.

**Existing Prototype:** `src/remotion/EgocentricPipeline.tsx` -- working Type 1 composition with bbox interpolation, sensor-fusion side panel, and bottom bar.

---

## Goals

- Transform static hero sections on 22 pages into pre-rendered video compositions showing real annotation workflows in action
- Each composition is visually unique to its annotation workflow type (8 types, each representing a real Claru annotation pipeline)
- Every composition uses REAL annotation data from S3 annotation JSONs wherever available -- Gemini enrichment only for datasets without annotations (Egocentric Activity Capture, Cinematic Action Footage)
- Case study pages receive enhanced layouts with video heroes, animated metric counters, and animated process timelines
- Zero runtime JS cost -- pre-rendered MP4s with `<video autoPlay muted loop playsInline>`
- Each video targets 5-10 MB at 1280x720, 30fps, h264, CRF 23
- All compositions use the Claru design system: bg `#0a0908`, accent `#92B090`, text `#FFFFFF`, JetBrains Mono

---

## Non-Goals

- Runtime `<RemotionPlayer>` -- we use pre-rendered MP4s exclusively
- CI/CD rendering -- videos are rendered locally with `npx remotion render`
- Audio -- all videos are silent
- User-uploaded content -- all samples come from existing S3 datasets
- Generic animated charts/counters/timelines -- every composition must show a real annotation workflow

---

## Architecture Overview

```
S3 Samples + Annotation JSONs → download-samples.ts → tmp/samples/
                                                        ↓
                                                 gemini-enrich.ts (ONLY for datasets without annotation JSON)
                                                        ↓
                                                 public/remotion-assets/annotations/{id}.json
                                                 (mix of real annotation data + Gemini-generated where needed)
                                                        ↓
                                                 render-all.ts (npx remotion render × 22)
                                                        ↓
                                                 public/videos/{id}.mp4
                                                        ↓
                                                 <VideoHero> on solution + case study pages
```

### File Structure

```
src/remotion/
├── Root.tsx                              # All 22 compositions registered
├── compositions/
│   ├── type-1/SensorFusionComposition.tsx       # Sensor-Fusion Tracking
│   ├── type-2/PairwiseArenaComposition.tsx       # Pairwise Arena
│   ├── type-3/MultiGenGalleryComposition.tsx     # Multi-Gen Gallery
│   ├── type-4/DetectionAnnotationComposition.tsx # Detection + Annotation
│   ├── type-5/ClassificationPipelineComposition.tsx # Classification Pipeline
│   ├── type-6/QualityRubricComposition.tsx       # Quality Rubric
│   ├── type-7/SafetyShieldComposition.tsx        # Safety Shield
│   └── type-8/CinematicShowcaseComposition.tsx   # Cinematic Showcase
├── shared/
│   ├── BoundingBox.tsx, MetadataPanel.tsx, ProgressBar.tsx
│   ├── BottomBar.tsx, TerminalHeader.tsx, DesignTokens.ts
│   ├── RadarChart.tsx, TaxonomyTree.tsx, VerdictBadge.tsx
│   └── (extracted from EgocentricPipeline.tsx)
├── EgocentricPipeline.tsx                # Existing prototype (kept)

scripts/
├── composition-manifest.json             # 22 composition configs
├── download-samples.ts                   # S3 sample + annotation downloader
├── gemini-enrich.ts                      # Frame extraction + Gemini (Types 1, 8 only)
├── render-all.ts                         # Batch render
└── gemini-prompts/
    └── type-1-sensor-fusion.txt          # Only prompt needed (Types 2-7 use real annotation data)

src/app/components/media/
├── VideoHero.tsx, AnimatedMetrics.tsx, ProcessTimeline.tsx

public/videos/                            # 22 MP4s (committed to repo)
public/remotion-assets/annotations/       # Annotation JSON files (real + Gemini-generated)
```

---

## Composition Types

### Universal: Technical Metadata Overlay
ALL composition types (1-8) include a small, uniform technical info overlay in the bottom-left corner showing: codec, resolution, duration, and frame count. This signals data quality consistently across every composition without visual clutter. Format: `h264 · 1920×1080 · 30fps · 5.2s` in 9px JetBrains Mono, color `#666`, semi-transparent background. This is NOT optional — it appears on every composition.

### Type 1: Sensor-Fusion Tracking
Video + interpolated bounding boxes + hand telemetry + metadata panel. For egocentric/manipulation/teleop/workplace pages. **Gemini-enriched** (no annotation JSON exists for Egocentric Activity Capture dataset).

### Type 2: Pairwise Arena
Split-screen A vs B, both playing simultaneously, selected indicator (subtle border glow) animation. For video generation, RLHF, prompt benchmark, quality params pages. **Uses real annotation data** (betterVideoId, selectedAnswer, bestVideo from annotation JSONs).

### Type 3: Multi-Gen Gallery
Grid of N generations from same prompt, checkmark/X animation, best selection highlight. For AI image evaluation, expert RLHF comparison pages. **Uses real annotation data** (bestImage, selectedImages, hasGoodQuality from annotation JSON).

### Type 4: Detection + Annotation
Video/image with bounding boxes drawing progressively, labels appearing, confidence scores. For object identity, product image, fashion pages. **Uses real annotation data** (bbox coordinates, class labels, confidence scores, captions from annotation JSONs).

### Type 5: Classification Pipeline
Video playing with taxonomy tree expanding from root to leaf, dual-axis classification. For video classification, game capture, content classification pages. **Uses real annotation data** (category, subcategory, selectedGame, concept hierarchies from annotation JSONs).

### Type 6: Quality Rubric
Video playing with animated multi-dimension scoring gauges / radar chart. For video quality at scale, video model evaluation pages. **Uses real annotation data** (isCinematic, hasGoodMotion, isHighQuality, isVideoInteresting, hasGoodTextAlignment from annotation JSON).

### Type 7: Safety Shield
Video with scanning overlay, prompt analysis, binary verdict badges. For red teaming, content safety, generative AI safety pages. **Uses real annotation data** (text_policy_violation, video_policy_violation, prompt text from annotation JSON).

### Type 8: Cinematic Showcase
Minimal overlay on 4K footage emphasizing technical quality signals: resolution badge (3840×2160), codec info, frame rate, color depth, file size. Category labels and licensing status. The technical metadata IS the quality signal — no need for flashy animations. For cinematic/egocentric video collection case study hero. **Gemini-enriched** (no annotation JSON exists for Cinematic Action Footage dataset; uses metadata + ffprobe technical data for overlay).

---

## Composition-to-Page Mapping

### Solution Pages (11)

| # | Slug | Type | Composition ID | S3 Dataset | Annotation Source | Duration |
|---|------|------|---------------|------------|-------------------|----------|
| 1 | `egocentric-video-data` | 1 | `sol-egocentric` | Egocentric Activity Capture (eb07cf5b) | Gemini (no annotation JSON) | 10s |
| 2 | `vla-training-data` | 1 | `sol-vla` | Egocentric Activity Capture (eb07cf5b) | Gemini (no annotation JSON) | 10s |
| 3 | `manipulation-trajectory-data` | 1 | `sol-manipulation` | Egocentric Activity Capture (eb07cf5b) | Gemini (no annotation JSON) | 10s |
| 4 | `teleoperation-data` | 1 | `sol-teleop` | Egocentric Activity Capture (eb07cf5b) | Gemini (no annotation JSON) | 10s |
| 5 | `video-generation-training-data` | 2 | `sol-video-gen` | Video Generation Preference (bafc163f) | Real annotation JSON (betterVideoId, prompt_text) | 12s |
| 6 | `expert-rlhf-annotation` | 2 | `sol-rlhf` | Video Generation Preference (bafc163f) | Real annotation JSON (betterVideoId, quality dimensions) | 12s |
| 7 | `red-teaming-data` | 7 | `sol-red-teaming` | Content Safety & Policy Review (132debad) | Real annotation JSON (text_policy_violation, video_policy_violation) | 10s |
| 8 | `sim-to-real-data` | 5 | `sol-sim2real` | Game Environment Capture (b2b542aa) | Real annotation JSON (selectedGame, category, subcategory) | 10s |
| 9 | `open-datasets-vs-custom` | 8 | `sol-open-vs-custom` | Cinematic Action Footage (b2d26fd9) | Metadata (category, subcategory) + Gemini scene description | 10s |
| 10 | `crowdsourced-vs-expert-rlhf` | 3 | `sol-crowd-vs-expert` | AI Image Generation Eval (55f26c56) | Real annotation JSON (bestImage, selectedImages, 8 generations) | 10s |
| 11 | `eu-ai-act-red-teaming` | 7 | `sol-eu-ai-act` | Content Safety & Policy Review (132debad) | Real annotation JSON (policy violation verdicts + policy refs) | 10s |

### Case Study Pages (11)

| # | Slug | Type | Composition ID | S3 Dataset | Annotation Source | Duration |
|---|------|------|---------------|------------|-------------------|----------|
| 1 | `egocentric-video-collection` | 8 | `cs-egocentric` | Egocentric Activity + Cinematic Action (eb07cf5b + b2d26fd9) | Metadata + Gemini scene description | 10s |
| 2 | `workplace-egocentric-data` | 1 | `cs-workplace` | Egocentric Activity Capture (eb07cf5b) | Gemini (no annotation JSON) | 10s |
| 3 | `fashion-ai-annotation` | 4 | `cs-fashion` | Product Image Annotation (f6bdb2f1) | Real annotation JSON (bbox coords, brandName, captions) | 10s |
| 4 | `game-based-data-capture` | 5 | `cs-game-capture` | Game Environment Capture (b2b542aa) | Real annotation JSON (selectedGame, 25-game catalog, genre) | 12s |
| 5 | `generative-ai-safety` | 7 | `cs-gen-safety` | Content Safety & Policy Review (132debad) | Real annotation JSON (policy violation verdicts) | 10s |
| 6 | `red-teaming-moderation` | 7 | `cs-red-team` | Content Safety & Policy Review (132debad) | Real annotation JSON (dual-channel text + video review) | 10s |
| 7 | `video-content-classification` | 5 | `cs-vid-classify` | Video Classification Supervised Labels (ca2465cf) | Real annotation JSON (category, subcategory, concept, dual taxonomy) | 12s |
| 8 | `video-model-evaluation` | 2 | `cs-vid-eval` | Systematic Quality Parameter Evaluations (a5f0c373) | Real annotation JSON (selectedAnswer, config comparison) | 12s |
| 9 | `video-quality-at-scale` | 6 | `cs-vid-quality` | Video Quality Annotations (4bda56db) | Real annotation JSON (5-axis quality rubric) | 12s |
| 10 | `prompt-enhancement-benchmark` | 2 | `cs-prompt-bench` | Prompt & Video Selection Rankings (8689f381) | Real annotation JSON (bestVideo, category verification) | 12s |
| 11 | `object-identity-persistence` | 4 | `cs-object-id` | Object & Face Identity Matching (040fee50) | Real annotation JSON (bbox coords, face class, confidence scores) | 10s |

---

## User Stories

### Phase 1: Infrastructure

#### US-001: Extract Shared Remotion Components from EgocentricPipeline Prototype

**Description:** Extract reusable components from the existing `src/remotion/EgocentricPipeline.tsx` prototype into `src/remotion/shared/`. This provides the foundation all 8 composition types build on.

**Priority:** High

**Dependencies:** None

**Acceptance Criteria:**
1. Create `src/remotion/shared/DesignTokens.ts` exporting a `TOKENS` constant with `colors` (accent `#92B090`, accentAlt `#4a90d9`, text `#e8e8e8`, muted `#888`, panelBg `rgba(10,9,8,0.88)`, error, warning, success, chosen, rejected, selected `#FFD700`), `fonts` (mono: JetBrains Mono, sans: Geist), and `bbox` (hand, object, face, violation, highlight, product) -- all as `const`
2. Create `src/remotion/shared/BoundingBox.tsx` with `BoundingBoxProps` interface: `bbox: [number,number,number,number]`, `label: string`, `color: string`, `sublabel?: string`, `opacity: number`, `showCorners?: boolean`, `confidence?: number` -- extracted from lines 91-165 of `EgocentricPipeline.tsx`
3. Create `src/remotion/shared/MetadataPanel.tsx` with `MetadataPanelProps` interface: `title: string`, `sections: MetadataSection[]`, `width?: number` (default 320), `visible: boolean`, `position?: "right"|"left"` -- generalized from `SidePanel` (lines 170-299 of `EgocentricPipeline.tsx`)
4. Create `src/remotion/shared/ProgressBar.tsx` -- animated horizontal bar component using Remotion `interpolate`
5. Create `src/remotion/shared/BottomBar.tsx` -- CLARU-branded timestamp bar with scrub indicator, extracted from lines 398-428 of `EgocentricPipeline.tsx`
6. Create `src/remotion/shared/TerminalHeader.tsx` -- macOS-style terminal title bar with red/yellow/green dots
7. Create `src/remotion/shared/RadarChart.tsx` -- 5-axis radar/spider chart component using SVG, with animated fill. Used by Type 6 (Quality Rubric)
8. Create `src/remotion/shared/TaxonomyTree.tsx` -- animated hierarchical label tree component. Used by Type 5 (Classification Pipeline). Props: `levels: Array<{label: string, children?: string[]}>`, `activeDepth: number`
9. Create `src/remotion/shared/VerdictBadge.tsx` -- subtle verdict indicator (PASS/FAIL/SELECTED/REJECTED). Props: `verdict: string`, `color: string`, `variant: "label"|"border-glow"|"badge"`, `animationStyle: "fade"|"glow"`. NO trophy, crown, stamp, or flash animations — keep it sophisticated and data-centric.
10. Create `src/remotion/shared/TechMetadataOverlay.tsx` — small bottom-left overlay showing codec, resolution, fps, duration in 9px JetBrains Mono, color `#666`, semi-transparent bg. Props: `codec: string, resolution: string, fps: number, duration: string`. This component is REQUIRED on ALL 8 composition types.
11. All shared components import colors/fonts from `DesignTokens.ts` instead of hardcoded values
11. All shared components export their prop interfaces
12. `EgocentricPipeline.tsx` continues to work unchanged (do not modify it)
13. TypeScript strict mode passes with no errors

---

#### US-002: Create Composition Manifest and Root.tsx Registry

**Description:** Create the central JSON manifest mapping all 22 composition IDs to their type, S3 samples, annotation source config, and render settings. Update `Root.tsx` to auto-register all compositions from the manifest.

**Priority:** High

**Dependencies:** US-001

**Acceptance Criteria:**
1. Create `scripts/composition-manifest.json` with a `compositions` array of 22 entries, each containing: `id` (string), `type` (1-8), `page` (`{ route, placement }`), `samples` (array of `{ datasetId, datasetSlug, sampleId?, subcategory?, maxSamples? }`), `annotationSource` (`"real"` | `"gemini"` | `"metadata-only"`), `enrichment` (`{ promptFile, framesPerSecond, maxFrames }` or null when `annotationSource !== "gemini"`), `render` (`{ durationFrames, fps: 30, width: 1280, height: 720, codec: "h264" }`)
2. Solution page composition IDs follow pattern `sol-{short-name}`, case study IDs follow `cs-{short-name}` -- matching the mapping tables in this PRD
3. Duration by type: Type 1: 300 frames (10s), Type 2: 360 frames (12s), Type 3: 300 frames (10s), Type 4: 300 frames (10s), Type 5: 360 frames (12s), Type 6: 360 frames (12s), Type 7: 300 frames (10s), Type 8: 300 frames (10s)
4. Each manifest entry's `samples` array references the correct S3 dataset IDs from the composition-to-page mapping tables
5. Entries with `annotationSource: "real"` have `enrichment: null` and reference the `s3_annotation_key` for their dataset
6. Entries with `annotationSource: "gemini"` have enrichment config pointing to `scripts/gemini-prompts/type-1-sensor-fusion.txt`
7. Update `src/remotion/Root.tsx` to import manifest and dynamically register all 22 compositions using `TYPE_MAP` keyed by type number
8. Root.tsx maps: 1->SensorFusionComposition, 2->PairwiseArenaComposition, 3->MultiGenGalleryComposition, 4->DetectionAnnotationComposition, 5->ClassificationPipelineComposition, 6->QualityRubricComposition, 7->SafetyShieldComposition, 8->CinematicShowcaseComposition
9. Each `<Composition>` passes `compositionId` via `defaultProps`
10. The existing `EgocentricPipeline` composition remains registered in Root.tsx (backward compatible)
11. `npx remotion studio` launches without errors

---

#### US-003: Create Gemini Enrichment Pipeline Script

**Description:** Build `scripts/gemini-enrich.ts` that downloads S3 samples, extracts frames with ffmpeg, sends them to Gemini 2.5 Flash with type-specific prompts, validates responses with Zod, and saves enrichment JSON. Runs for ALL 22 compositions — Types 1 and 8 generate all annotation data from scratch (no human annotation exists), while Types 2-7 supplement the real human annotations with additional researcher-valuable metadata (quality dimensions, artifact analysis, scene graphs, technical specs) that the human labels don't cover. The `enrichment_json` column in Supabase is empty for ALL samples — Gemini fills this gap.

**Priority:** High

**Dependencies:** US-002

**Acceptance Criteria:**
1. Create `scripts/gemini-enrich.ts` as a TypeScript script runnable with `tsx`
2. Script reads `composition-manifest.json` and processes ALL 22 compositions (not just gemini-only ones)
3. For each composition: downloads S3 video/image samples (if not already cached in `tmp/samples/{id}/`). If primary sample 404s, try next sample in the same dataset automatically. Log 404s to `tmp/missing-samples.log`.
4. Extracts frames using `ffmpeg -vf "fps={fps},scale=512:-1"` to `tmp/frames/{id}/`
5. Loads the type-specific prompt template from `scripts/gemini-prompts/type-{N}.txt`
6. **For Types 1, 8 (no human annotation exists):** Gemini generates ALL annotation data (bboxes, tracking, scene graphs, manipulation phases, spatial, IMU)
7. **For Types 2-7 (human annotation exists):** Gemini SUPPLEMENTS the real annotation data with additional enrichment — quality dimension breakdowns, artifact analysis, scene descriptions, technical specs, object affordances. The enrichment is MERGED with the real annotation JSON (real data takes priority on any conflicts).
8. Sends frames as base64 inline data parts to Gemini 2.5 Flash with `responseMimeType: "application/json"`
9. Parses and validates against the corresponding Zod schema per type
10. On validation failure: retries once with a stricter prompt; if still invalid, logs error and skips
11. Writes validated enrichment JSON to `public/remotion-assets/enrichments/{id}.json` (separate from annotation JSONs — compositions load both and merge)
12. Processes compositions with concurrency limit of 3 and 1-second delay between batches
13. Handles Gemini API rate limits with exponential backoff (2s base, max 5 retries)
14. Create prompt templates for ALL 8 types: `scripts/gemini-prompts/type-{1-8}.txt` — each tailored to what's valuable for a researcher reviewing that type of data
15. Script accepts optional `--composition {id}` flag to enrich a single composition
16. Script requires `GOOGLE_API_KEY` in `.env.local`; exits with clear error if missing
17. Add `"remotion:enrich": "tsx scripts/gemini-enrich.ts"` to package.json scripts

---

#### US-003b: Create Real Annotation Data Extraction Script

**Description:** Build `scripts/extract-annotations.ts` that downloads existing S3 annotation JSONs for compositions with `annotationSource: "real"`, extracts the relevant fields, and writes formatted annotation JSON suitable for Remotion compositions.

**Priority:** High

**Dependencies:** US-002

**Acceptance Criteria:**
1. Create `scripts/extract-annotations.ts` as a TypeScript script runnable with `tsx`
2. Script reads `composition-manifest.json`, filters to compositions where `annotationSource === "real"`
3. For each composition: downloads the S3 annotation JSON using the `s3_annotation_key`
4. Extracts and transforms annotation fields based on composition type:
   - Type 2 (Pairwise Arena): extracts `betterVideoId`/`selectedAnswer`/`bestVideo`, `prompt_text`, video URLs
   - Type 3 (Multi-Gen Gallery): extracts `bestImage`, `selectedImages`, `hasGoodQuality`, `generations` array
   - Type 4 (Detection + Annotation): extracts `bbox` coordinates, `class` labels, `score` confidence, captions, `brandName`
   - Type 5 (Classification Pipeline): extracts `category`, `subcategory`, `selectedGame`, `concept`, template categories catalog
   - Type 6 (Quality Rubric): extracts `isCinematic`, `hasGoodMotion`, `isHighQuality`, `isVideoInteresting`, `hasGoodTextAlignment`, `video_description`
   - Type 7 (Safety Shield): extracts `text_policy_violation`, `video_policy_violation`, `prompt` text
5. Validates extracted data against per-type Zod schemas
6. Writes formatted JSON to `public/remotion-assets/annotations/{id}.json`
7. Accepts optional `--composition {id}` flag
8. Add `"remotion:extract": "tsx scripts/extract-annotations.ts"` to package.json scripts

---

#### US-004: Create Render Pipeline Script

**Description:** Build `scripts/render-all.ts` that reads the manifest and renders each composition to MP4 using Remotion CLI.

**Priority:** High

**Dependencies:** US-002

**Acceptance Criteria:**
1. Create `scripts/render-all.ts` as a TypeScript script runnable with `tsx`
2. Reads `composition-manifest.json` and iterates all 22 compositions
3. For each: runs `npx remotion render src/remotion/index.ts {id} public/videos/{id}.mp4 --codec h264 --crf 23 --props '{"compositionId":"{id}"}'`
4. Renders in batches of 2 (CPU-bound concurrency)
5. After each render: checks file size -- warns if > 10 MB, re-renders with `--crf 28` if > 15 MB
6. Outputs a summary table: composition ID, duration, file size, status (ok/warn/fail)
7. Creates `public/videos/` directory if it doesn't exist
8. Script accepts optional `--composition {id}` flag to render a single composition
9. Script accepts optional `--dry-run` flag that prints the render commands without executing
10. Add `"remotion:render": "tsx scripts/render-all.ts"` and `"remotion:pipeline": "npm run remotion:extract && npm run remotion:enrich && npm run remotion:render"` to package.json scripts
11. Exits with non-zero code if any composition fails to render

---

### Phase 2: Composition Templates

#### US-005: Type 1 -- Sensor-Fusion Tracking Composition

**Description:** Build `SensorFusionComposition` that renders video with interpolated bounding boxes and a sensor-fusion side panel. Parameterized version of the existing `EgocentricPipeline.tsx` prototype.

**Priority:** High

**Dependencies:** US-001, US-002

**Acceptance Criteria:**
1. Create `src/remotion/compositions/type-1/SensorFusionComposition.tsx` accepting `{ compositionId: string }` props
2. Loads annotation JSON from `staticFile(`remotion-assets/annotations/${compositionId}.json`)` and hero video from `staticFile(`remotion-assets/samples/${compositionId}.mp4`)`
3. Implements keyframe interpolation for smooth bbox tracking between annotation frames (same algorithm as `getAnnotationAtTime` in EgocentricPipeline.tsx lines 28-86)
4. Uses shared `BoundingBox` component for hand and object bboxes
5. Uses shared `MetadataPanel` for the sensor-fusion side panel with sections: TASK STATE, HAND TELEMETRY, OBJECT STATES, SPATIAL, IMU ESTIMATE, SCENE
6. Uses shared `BottomBar` with CLARU branding, timestamp, phase label, and scrub bar
7. Animation timeline: frames 0-15 video only, 15-24 bboxes fade in, 24-30 panel slides in, 30-270 full composition, 270-300 fade to CLARU watermark
8. Create `src/remotion/compositions/type-1/types.ts` exporting `Type1Annotation`, `Type1Frame`, `HandAnnotation`, `ObjectAnnotation`, `SpatialEstimate`, `IMUEstimate`, `SceneContext` interfaces
9. Colors imported from shared `DesignTokens.ts`: hand bboxes use `TOKENS.bbox.hand`, object bboxes use `TOKENS.bbox.object`
10. Renders correctly in Remotion Studio at 1280x720, 30fps
11. TypeScript strict mode passes

---

#### US-006: Type 2 -- Pairwise Arena Composition

**Description:** Build `PairwiseArenaComposition` showing split-screen A vs B comparison with both videos playing simultaneously and selection highlight. Uses real annotation data showing which video was preferred.

**Priority:** High

**Dependencies:** US-001, US-002

**Acceptance Criteria:**
1. Create `src/remotion/compositions/type-2/PairwiseArenaComposition.tsx` accepting `{ compositionId: string }` props
2. Renders two videos side by side (50/50 split) -- Video A (left) and Video B (right)
3. Prompt text types out at the top of the frame showing what was being generated/evaluated
4. Selected/preferred video determined from real annotation data (`betterVideoId`, `selectedAnswer`, or `bestVideo` field from annotation JSON)
5. Selected video gets a subtle accent border glow (`#92B090`) — the non-selected side dims slightly. NO crown, trophy, or flashy animations. The visual should feel like a research tool interface, not a game show.
6. Loser gets subtle dim/desaturation effect
7. For `cs-vid-eval` (Quality Parameters): show config IDs (e.g., "Config 21 vs Config 41") as labels on each side
8. For `cs-prompt-bench` (Prompt Rankings): show category label ("Kayaking") and category verification checkmark
9. Animation timeline: 0-30 videos fade in + neutral split divider label (e.g., "A | B" or "Config 21 | Config 41"), 30-60 prompt text types out, 60-180 both videos play, 180-240 selected indicator (subtle border glow) animates + loser dims, 240-360 hold with subtle pulse on selected
10. Uses shared `BottomBar` with "Arena" label
11. Create `src/remotion/compositions/type-2/types.ts` exporting `Type2Annotation` with `videoA`, `videoB`, `winner`, `promptText`, `configLabels?`, `categoryLabel?` fields
12. TypeScript strict mode passes

---

#### US-007: Type 3 -- Multi-Gen Gallery Composition

**Description:** Build `MultiGenGalleryComposition` showing a grid of N image generations from the same prompt, with checkmark/X filtering and best-of-N selection. Uses real annotation data from the AI Image Generation Evaluation dataset.

**Priority:** High

**Dependencies:** US-001, US-002

**Acceptance Criteria:**
1. Create `src/remotion/compositions/type-3/MultiGenGalleryComposition.tsx` accepting `{ compositionId: string }` props
2. Renders a 2x4 grid of 8 generation images from the annotation JSON `metadata.generations` array
3. Prompt text types out above the grid from `metadata.prompt`
4. Images animate in one at a time (staggered, 6 frames apart)
5. Green checkmarks animate onto the `selectedImages` (6 of 8 accepted) using shared `VerdictBadge` with `variant: "badge"`
6. Red X marks animate onto rejected images (2 of 8)
7. Selected best image gets a subtle accent border glow (`#92B090`) via `VerdictBadge` with `variant: "border-glow"` — NOT a crown or trophy
8. Stats overlay: "6/8 acceptable (75%), 1 best" with animated counter
9. Animation timeline: 0-30 grid container fades in, 30-90 images appear one by one, 90-120 prompt text types, 120-180 checkmarks/Xs animate, 180-210 accent highlight on selected, 210-240 stats appear, 240-300 hold
10. Uses shared `BottomBar` with "Generation Eval" label
11. Create `src/remotion/compositions/type-3/types.ts` with `Type3Annotation` matching AI Image Eval annotation structure: `bestImage`, `selectedImages`, `hasGoodQuality`, `generations` array, `prompt`
12. TypeScript strict mode passes

---

#### US-008: Type 4 -- Detection + Annotation Composition

**Description:** Build `DetectionAnnotationComposition` showing video/image with bounding boxes drawing progressively, labels appearing, and confidence scores. Uses real bbox annotation data from Object & Face Identity and Product Image datasets.

**Priority:** High

**Dependencies:** US-001, US-002

**Acceptance Criteria:**
1. Create `src/remotion/compositions/type-4/DetectionAnnotationComposition.tsx` accepting `{ compositionId: string }` props
2. For video sources (Object Identity): plays video, then freeze-frames at the annotated frame
3. For image sources (Product Image, Fashion): displays the image with animated zoom-in
4. Bounding boxes draw progressively using shared `BoundingBox` with `confidence` prop showing detection scores
5. For Object Identity (`cs-object-id`): draws face bboxes from `segment[].bbox` coordinates ([965, 222, 1390, 829]), shows `class: "face"` labels, displays `score: 0.825` confidence, animates identity matching lines between segments with "Same person? YES" verdict
6. For Product Image (`cs-fashion`): draws product bbox from `files[1].metadata` coordinates ({x1: 175.26, y1: 64.57, x2: 365.51, y2: 317.09}), types out short caption, then long caption, animates brand name and category labels sliding in
7. Caption text types out letter-by-letter beneath the media using typewriter effect
8. Animation timeline: 0-20 media fades in, 20-60 bboxes draw progressively, 60-90 labels + confidence scores appear, 90-150 captions type out, 150-210 identity match / brand metadata, 210-270 hold, 270-300 fade
9. Uses shared `BoundingBox` (with `TOKENS.bbox.face` for faces, `TOKENS.bbox.product` for products), `BottomBar`
10. Create `src/remotion/compositions/type-4/types.ts` with `Type4Annotation` supporting both identity match and product annotation structures
11. TypeScript strict mode passes

---

#### US-009: Type 5 -- Classification Pipeline Composition

**Description:** Build `ClassificationPipelineComposition` showing video with an animated taxonomy tree expanding from root to leaf. Uses real category/subcategory annotation data from Video Classification and Game Environment datasets.

**Priority:** High

**Dependencies:** US-001, US-002

**Acceptance Criteria:**
1. Create `src/remotion/compositions/type-5/ClassificationPipelineComposition.tsx` accepting `{ compositionId: string }` props
2. Video plays on the left (60% width), taxonomy tree animates on the right (40% width) using shared `TaxonomyTree`
3. For Video Classification (`cs-vid-classify`): shows dual taxonomy -- Content taxonomy (Content -> People -> Technology & Computing -> Smartphones & Gadget Use) AND Visual Style taxonomy (Visual Style -> Portrait photography -> Urban outdoor portraits)
4. For Game Environment (`cs-game-capture`, `sol-sim2real`): shows game taxonomy (Video Game -> Adventure -> Red Dead Redemption 2) with the 25-game catalog fanning out at the second level before narrowing to the selected game
5. Caption text from `metadata.caption` types out below the video
6. Annotation pipeline stages animate at bottom: raw capture -> classification -> review -> approved (with status checkmark)
7. Animation timeline: 0-30 video fades in, 30-90 first taxonomy tree animates level by level, 90-180 second taxonomy (if dual), 180-270 caption types + pipeline stages, 270-300/360 hold + fade
8. Uses shared `TaxonomyTree`, `BottomBar`, `VerdictBadge` (for "approved" status)
9. Create `src/remotion/compositions/type-5/types.ts` with `Type5Annotation` containing `taxonomies` (array of `{root, levels[]}`), `caption`, `pipelineStages`, `gameTitle?`, `gameCatalog?`
10. TypeScript strict mode passes

---

#### US-010: Type 6 -- Quality Rubric Composition

**Description:** Build `QualityRubricComposition` showing video with animated multi-dimension scoring gauges and radar chart. Uses the real 5-axis quality rubric data from the Video Quality Annotations dataset.

**Priority:** High

**Dependencies:** US-001, US-002

**Acceptance Criteria:**
1. Create `src/remotion/compositions/type-6/QualityRubricComposition.tsx` accepting `{ compositionId: string }` props
2. Video plays on the left (60% width), scoring panel on the right (40% width)
3. Five quality dimensions from the real annotation data animate as gauges:
   - Cinematic: "not-cinematic" -> maps to 0.2 fill (red)
   - Motion Quality: "good-motion" -> maps to 0.8 fill (green)
   - Overall Quality: "not-high-quality" -> maps to 0.3 fill (orange)
   - Interest Level: "interesting" -> maps to 0.7 fill (green)
   - Text Alignment: "good-alignment" -> maps to 0.8 fill (green)
4. After individual gauges fill, shared `RadarChart` component renders the 5-axis spider chart with the same values, building all 5 axes simultaneously with fill animation
5. `metadata.video_description` text types out beneath the video as the annotator's written assessment
6. Animation timeline: 0-30 video fades in, 30-60 first gauge animates, 60-90 remaining gauges stagger in, 90-150 radar chart builds, 150-240 description types out, 240-300/360 hold
7. Uses shared `RadarChart`, `ProgressBar` (for individual gauges), `BottomBar` with "Quality Assessment" label
8. Create `src/remotion/compositions/type-6/types.ts` with `Type6Annotation` containing `dimensions` (array of `{name, value: string, numericScore: number}`), `videoDescription`, `promptText?`
9. Dimension value strings map to numeric scores: "good-*" = 0.8, "not-*" = 0.2-0.3, "interesting" = 0.7 (documented mapping in types.ts)
10. TypeScript strict mode passes

---

#### US-011: Type 7 -- Safety Shield Composition

**Description:** Build `SafetyShieldComposition` showing video with scanning overlay, prompt analysis, and binary verdict badges. Uses real policy violation annotation data from the Content Safety dataset.

**Priority:** High

**Dependencies:** US-001, US-002

**Acceptance Criteria:**
1. Create `src/remotion/compositions/type-7/SafetyShieldComposition.tsx` accepting `{ compositionId: string }` props
2. Content area shows blurred/pixelated visual (never actual unsafe content) with scanning line animation
3. Prompt text from `metadata.prompt` types out in a terminal-style overlay panel, showing the generation prompt being reviewed
4. Dual-channel verdict badges animate in using shared `VerdictBadge`:
   - "Text Policy: PASS" (green badge) or "Text Policy: VIOLATION" (red badge) from `generalData.text_policy_violation`
   - "Video Policy: PASS" (green badge) or "Video Policy: VIOLATION" (red badge) from `generalData.video_policy_violation`
5. For `sol-eu-ai-act`: add EU AI Act article reference badges (e.g., "Art. 52 Transparency", "Art. 6 High-Risk") alongside verdicts
6. For `cs-red-team`: show dual-channel review animation -- text review scan runs first, then video review scan, emphasizing the two-pass pipeline
7. Shield icon animation: shield outline draws, then fills with green (pass) or red (violation) based on overall result
8. Animation timeline: 0-30 blurred content fades in, 30-60 scanning line sweeps, 60-90 prompt text types in terminal panel, 90-150 text policy verdict stamps, 150-210 video policy verdict stamps, 210-270 shield fills + overall verdict, 270-300 fade to CLARU watermark
9. Uses shared `VerdictBadge`, `TerminalHeader` (for prompt display panel), `BottomBar` with "Safety Review" label
10. Create `src/remotion/compositions/type-7/types.ts` with `Type7Annotation` containing `prompt`, `textPolicyViolation: boolean`, `videoPolicyViolation: boolean`, `policyRefs?`, `reviewType: "single"|"dual-channel"`
11. TypeScript strict mode passes

---

#### US-012: Type 8 -- Cinematic Showcase Composition

**Description:** Build `CinematicShowcaseComposition` showing stunning 4K footage with minimal elegant overlay. For pages emphasizing data quality over annotation workflow. Uses Gemini scene description for overlay text.

**Priority:** Medium

**Dependencies:** US-001, US-002

**Acceptance Criteria:**
1. Create `src/remotion/compositions/type-8/CinematicShowcaseComposition.tsx` accepting `{ compositionId: string }` props
2. Video plays full-bleed with letterbox bars (cinematic 2.39:1 aspect ratio within 16:9 frame)
3. Minimal overlay elements: category tag (e.g., "Travel & Exploration"), subcategory (e.g., "Safari & Wildlife Tours"), licensing badge ("Licensed 4K")
4. Labels slide in from the left with subtle motion blur effect, hold, then slide out
5. Film grain overlay using CSS noise texture for cinematic quality
6. For `cs-egocentric`: cross-fade between egocentric clip and cinematic safari clip to show range of collection
7. For `sol-open-vs-custom`: emphasize the quality difference -- "This is custom data" label with premium styling
8. Gemini-generated scene description appears as a subtle typed subtitle at the bottom
9. Animation timeline: 0-15 video fades in through letterbox, 15-90 video plays with labels sliding in/out, 90-180 scene description types, 180-270 hold with gentle zoom, 270-300 fade to CLARU watermark with "Licensed Collection" badge
10. Uses shared `BottomBar` (minimal variant -- no timestamp, just CLARU branding)
11. Create `src/remotion/compositions/type-8/types.ts` with `Type8Annotation` containing `category`, `subcategory`, `sceneDescription`, `licensingType`, `resolution`
12. TypeScript strict mode passes

---

### Phase 3: Annotation Data Preparation

**Two-layer data strategy for ALL 22 compositions:**
1. **Layer 1 — Real human annotations (US-013 through US-018):** Extract real annotation JSONs from S3 for the 15 compositions that have them (Types 2-7). These contain human labels, bboxes, quality scores, preference selections, policy verdicts.
2. **Layer 2 — Gemini enrichment (US-019, US-020, and as part of US-013-018):** Run Gemini on ALL hero samples to generate supplementary researcher-valuable metadata. For Types 1 and 8, Gemini creates all annotation data from scratch. For Types 2-7, Gemini supplements the human data with dimensional analysis, technical specs, scene graphs, and affordance labels that human annotators didn't capture. The Supabase `enrichment_json` column is empty for all samples — Gemini fills this gap.
3. **Compositions load both files** and merge them (human data takes priority on conflicts).

#### US-013: Extract Real Annotation Data for Type 2 Compositions (4 Compositions)

**Description:** Extract and transform real annotation data from S3 for all 4 Pairwise Arena compositions: sol-video-gen, sol-rlhf, cs-vid-eval, cs-prompt-bench. After extraction, also run `gemini-enrich.ts` for these compositions to supplement with quality dimension scores and artifact analysis that the human annotations don't cover.

**Priority:** High

**Dependencies:** US-003b, US-006

**Acceptance Criteria:**
1. Download annotation JSONs from S3 for each dataset:
   - `sol-video-gen` + `sol-rlhf`: Video Generation Preference (bafc163f) -- extract `betterVideoId`, `metadata.prompt_text`, video URLs from `metadata.video_1`/`metadata.video_2`
   - `cs-vid-eval`: Quality Parameter Evaluations (a5f0c373) -- extract `selectedAnswer` ("21"), `metadata.key` ("video_110_config_21_config_41"), video URLs, `metadata.prompt_text`
   - `cs-prompt-bench`: Prompt & Video Selection Rankings (8689f381) -- extract `bestVideo`, `metadata.video_1.category` ("Kayaking"), `videoBelongsToCategory`
2. Download both video files (Video A and Video B) for each composition to `tmp/samples/{id}/`
3. Transform to Type 2 annotation format: `{ videoA, videoB, winner, promptText, configLabels?, categoryLabel? }`
4. Each annotation JSON validates against `Type2AnnotationSchema` with zero errors
5. All 4 JSON files written to `public/remotion-assets/annotations/{id}.json`
6. Verify both videos per composition play at matching framerates

---

#### US-014: Extract Real Annotation Data for Type 3 Composition (1 Composition)

**Description:** Extract real annotation data for the Multi-Gen Gallery composition: sol-crowd-vs-expert.

**Priority:** High

**Dependencies:** US-003b, US-007

**Acceptance Criteria:**
1. Download annotation JSON from AI Image Generation Evaluation dataset (55f26c56)
2. Extract `bestImage` ID, `selectedImages` array (6 of 8), `hasGoodQuality`, `metadata.prompt`, and all 8 generation URLs from `metadata.generations`
3. Download all 8 generation images to `tmp/samples/sol-crowd-vs-expert/`
4. Transform to Type 3 annotation format
5. Validates against `Type3AnnotationSchema`
6. JSON written to `public/remotion-assets/annotations/sol-crowd-vs-expert.json`

---

#### US-015: Extract Real Annotation Data for Type 4 Compositions (2 Compositions)

**Description:** Extract real bbox/identity annotation data for Detection + Annotation compositions: cs-fashion, cs-object-id.

**Priority:** High

**Dependencies:** US-003b, US-008

**Acceptance Criteria:**
1. For `cs-fashion` (Product Image f6bdb2f1):
   - Extract `brandName` ("Craghoppers"), `category` ("Fashion (Men's)"), `subcategory` ("Tops")
   - Extract product image caption and longCaption from `files[0]`
   - Extract lifestyle image bbox `{x1: 175.26, y1: 64.57, x2: 365.51, y2: 317.09}` from `files[1].metadata`
   - Download both product and lifestyle images
2. For `cs-object-id` (Object & Face Identity 040fee50):
   - Extract `segment[]` array with `bbox` ([965, 222, 1390, 829]), `class` ("face"), `score` (0.825), `frame_index` (-3)
   - Extract identity match verdicts from `generalData` (segment1_image1: "yes", etc.)
   - Download video and face thumbnails
3. Both annotations validate against `Type4AnnotationSchema`
4. All files written to `public/remotion-assets/annotations/`

---

#### US-016: Extract Real Annotation Data for Type 5 Compositions (3 Compositions)

**Description:** Extract real classification/taxonomy data for Classification Pipeline compositions: sol-sim2real, cs-game-capture, cs-vid-classify.

**Priority:** High

**Dependencies:** US-003b, US-009

**Acceptance Criteria:**
1. For `cs-vid-classify` (Video Classification ca2465cf):
   - Extract dual taxonomy: `generalData.category` ("Technology & Computing") + `generalData.subcategory` ("Smartphones & Gadget Use") AND `metadata.category` ("Portrait photography") + `metadata.subcategory` ("Urban outdoor portraits")
   - Extract `metadata.caption`, `metadata.concept` ("People")
2. For `cs-game-capture` + `sol-sim2real` (Game Environment b2b542aa):
   - Extract `generalData.selectedGame` ("Red Dead Redemption 2"), `section` ("Video Game"), `category` ("Adventure")
   - Extract full 25-game catalog from `project.templateData.categories`
   - Extract annotation pipeline metadata: `project.type` ("VIDEO_GAME_CAPTURE"), status ("approved")
3. All validate against `Type5AnnotationSchema`
4. All 3 JSONs written to `public/remotion-assets/annotations/`

---

#### US-017: Extract Real Annotation Data for Type 6 Composition (1 Composition)

**Description:** Extract real 5-axis quality rubric data for cs-vid-quality.

**Priority:** High

**Dependencies:** US-003b, US-010

**Acceptance Criteria:**
1. Download annotation JSON from Video Quality Annotations dataset (4bda56db)
2. Extract all 5 quality dimensions:
   - `generalData.isCinematic`: "not-cinematic"
   - `generalData.hasGoodMotion`: "good-motion"
   - `generalData.isHighQuality`: "not-high-quality"
   - `generalData.isVideoInteresting`: "interesting"
   - `generalData.hasGoodTextAlignment`: "good-alignment"
3. Extract `metadata.video_description` for typed assessment overlay
4. Map string values to numeric scores: "good-motion" -> 0.8, "not-cinematic" -> 0.2, "not-high-quality" -> 0.3, "interesting" -> 0.7, "good-alignment" -> 0.8
5. Download the video sample
6. Validates against `Type6AnnotationSchema`
7. JSON written to `public/remotion-assets/annotations/cs-vid-quality.json`

---

#### US-018: Extract Real Annotation Data for Type 7 Compositions (4 Compositions)

**Description:** Extract real safety/policy review data for Safety Shield compositions: sol-red-teaming, sol-eu-ai-act, cs-gen-safety, cs-red-team.

**Priority:** High

**Dependencies:** US-003b, US-011

**Acceptance Criteria:**
1. Download annotation JSONs from Content Safety & Policy Review dataset (132debad)
2. For each composition extract:
   - `generalData.text_policy_violation` (boolean: "yes"/"no")
   - `generalData.video_policy_violation` (boolean: "yes"/"no")
   - `metadata.prompt` (full generation prompt text, 200+ words)
   - `project.type` ("RED_TEAM_SAFETY_PROJECT_VIDEO_POLICY_REVIEW")
3. Note: one sample video returned 404 during audit -- try alternate samples from the same dataset. If all fail, compositions use a blurred placeholder (blurred placeholder is acceptable since safety compositions always blur content anyway)
4. For `sol-eu-ai-act`: add policy reference strings to annotation JSON ("EU AI Act Art.52", "Art.6 High-Risk Systems")
5. All 4 validate against `Type7AnnotationSchema`
6. All 4 JSONs written to `public/remotion-assets/annotations/`

---

#### US-019: Gemini Enrichment for Type 1 Compositions (5 Compositions)

**Description:** Run Gemini 2.5 Flash enrichment for the 5 Type 1 compositions that need generated annotations: sol-egocentric, sol-vla, sol-manipulation, sol-teleop, cs-workplace.

**Priority:** High

**Dependencies:** US-003, US-005

**Acceptance Criteria:**
1. Download and curate best S3 samples for each:
   - `sol-egocentric`: Egocentric Activity Capture (eb07cf5b) -- traffic/transportation footage (4K)
   - `sol-vla`: Egocentric Activity Capture -- multi-activity montage
   - `sol-manipulation`: Egocentric Activity Capture -- manipulation subcategories (grasping, placing, pouring)
   - `sol-teleop`: Egocentric Activity Capture -- outdoor movement + workplace tasks
   - `cs-workplace`: Egocentric Activity Capture -- workplace subcategories
2. Select the single best "hero" sample per composition (most visually interesting, clear activity, good lighting)
3. Run `scripts/gemini-enrich.ts --composition {id}` for each
4. Each annotation JSON validates against `Type1AnnotationSchema` with zero errors
5. Each JSON contains 20-30 frame annotations at 2-3 fps, with smooth bbox coordinates suitable for interpolation
6. Every frame has at least 1 hand annotation and 1 object annotation with valid normalized bboxes (all values in [0,1])
7. `manipulation_phase` uses canonical vocabulary: idle, approach, contact, grasp, transport, place, pour, stir, release
8. All 5 JSON files written to `public/remotion-assets/annotations/{id}.json`
9. Total Gemini API cost documented

---

#### US-020: Gemini Enrichment for Type 8 Compositions (2 Compositions)

**Description:** Run Gemini enrichment for the 2 Cinematic Showcase compositions: sol-open-vs-custom, cs-egocentric.

**Priority:** Medium

**Dependencies:** US-003, US-012

**Acceptance Criteria:**
1. Download samples:
   - `sol-open-vs-custom`: Cinematic Action Footage (b2d26fd9) -- 4K safari footage
   - `cs-egocentric`: Best egocentric clip + cinematic safari clip for cross-fade
2. Run Gemini enrichment to generate scene descriptions for overlay text
3. Use metadata `category`/`subcategory` ("Travel & Exploration" / "Safari & Wildlife Tours") for labels
4. Each JSON validates against `Type8AnnotationSchema`
5. Both JSONs written to `public/remotion-assets/annotations/`

---

### Phase 4: Render All 22 Compositions

#### US-021: Render All 11 Solution Page Compositions to MP4

**Description:** Execute the render pipeline for all 11 solution page compositions.

**Priority:** High

**Dependencies:** US-005 through US-020

**Acceptance Criteria:**
1. Run `scripts/render-all.ts` for all 11 solution page compositions
2. Each renders to `public/videos/{id}.mp4` at 1280x720, 30fps, h264, CRF 23
3. Each MP4 file is between 1-10 MB (if > 10 MB, re-render with CRF 28)
4. Each video plays correctly in Chrome, Firefox, and Safari
5. Type 1 videos: bounding boxes track smoothly, sensor panel is readable, bottom bar shows progress
6. Type 2 videos: both sides play simultaneously, prompt text visible, selected indicator (subtle border glow) appears
7. Type 3 video: 8-image grid visible, checkmarks/Xs animate, accent highlight on selected
8. Type 5 videos: taxonomy tree animates level by level, caption types out
9. Type 7 videos: content blurred, scanning animation visible, verdict badges stamp
10. Type 8 videos: letterbox framing, labels slide in/out, cinematic quality
11. All 11 MP4 files committed to repo in `public/videos/`
12. Print summary: composition ID | type | duration | file size | render time

---

#### US-022: Render All 11 Case Study Compositions to MP4

**Description:** Execute the render pipeline for all 11 case study page compositions.

**Priority:** High

**Dependencies:** US-005 through US-020

**Acceptance Criteria:**
1. Run `scripts/render-all.ts` for all 11 case study compositions
2. Each renders to `public/videos/{id}.mp4` at 1280x720, 30fps, h264, CRF 23
3. Each MP4 file is between 1-10 MB
4. Type 1 videos: sensor-fusion overlays on workplace footage
5. Type 2 videos: capybara A/B (cs-vid-eval), kayaking A/B (cs-prompt-bench)
6. Type 4 videos: product bbox + captions (cs-fashion), face detection + identity matching (cs-object-id)
7. Type 5 videos: RDR2 game taxonomy (cs-game-capture), dual taxonomy tree (cs-vid-classify)
8. Type 6 video: 5-axis radar chart with quality gauges (cs-vid-quality)
9. Type 7 videos: safety scan + verdict badges (cs-gen-safety, cs-red-team)
10. Type 8 video: cinematic showcase with cross-fade (cs-egocentric)
11. All 11 MP4 files committed to repo in `public/videos/`
12. Total `public/videos/` directory size (all 22 files) under 220 MB

---

### Phase 5: Solution Page Integration

#### US-023: Add Video Hero to All 11 Solution Pages

**Description:** Create the `VideoHero` component and integrate it into the solution page template.

**Priority:** High

**Dependencies:** US-021

**Acceptance Criteria:**
1. Create `src/app/components/media/VideoHero.tsx` as a client component with props: `videoSrc: string`, `posterSrc?: string`, `badge?: string`, `aspectRatio?: string` (default "aspect-video")
2. Renders `<video autoPlay muted loop playsInline>` with the specified `videoSrc`
3. Implements IntersectionObserver to pause video when scrolled off-screen
4. Shows poster image as fallback while video loads or if video fails to load
5. `onError` handler gracefully hides the video element
6. Fixed aspect ratio container prevents CLS
7. Styled with rounded-2xl, border border-[var(--border-subtle)], overflow-hidden
8. Add `videoSrc?: string` optional field to `ContentPageData` interface
9. Update `ContentPageTemplate.tsx` to render `<VideoHero>` when `videoSrc` is present
10. Update all 11 solution page data files with `videoSrc: "/videos/{composition-id}.mp4"`
11. All 11 solution pages render the video hero
12. Responsive: full-width on mobile, max-w-6xl on desktop
13. TypeScript strict mode passes

---

### Phase 6: Case Study Page Redesign

#### US-024: Create Case Study Enhancement Components

**Description:** Build `AnimatedMetrics` and `ProcessTimeline` components for case study pages.

**Priority:** Medium

**Dependencies:** US-023

**Acceptance Criteria:**
1. Create `src/app/components/media/AnimatedMetrics.tsx` with Framer Motion `useInView` triggered counter animation
2. Grid layout: `grid-cols-2 md:grid-cols-4`, terminal aesthetic with JetBrains Mono
3. Create `src/app/components/media/ProcessTimeline.tsx` with staggered step reveal and connecting line draw animation
4. Responsive: horizontal on desktop, vertical on mobile
5. Both components work standalone
6. TypeScript strict mode passes

---

#### US-025: Redesign Case Study Detail Page Layout

**Description:** Update `CaseStudyDetailClient.tsx` to conditionally render video hero, animated metrics, and process timeline.

**Priority:** Medium

**Dependencies:** US-023, US-024

**Acceptance Criteria:**
1. Render `<VideoHero>` when `cs.videoComposition` present
2. Replace static snapshot stats with `<AnimatedMetrics>`
3. Replace `<ProcessFlow>` with `<ProcessTimeline>`
4. All changes conditional -- no regressions for case studies without videoComposition
5. TypeScript strict mode passes

---

#### US-026: Wire Up All 11 Case Study Pages

**Description:** Add `videoComposition` field to all 11 case study data files.

**Priority:** Medium

**Dependencies:** US-022, US-025

**Acceptance Criteria:**
1. Add `videoComposition?` to CaseStudy type
2. Update all 11 case study JSONs with correct composition IDs
3. All set `placement: "hero"`
4. Smoke test: no console errors, video plays, metrics animate

---

### Phase 7: QA & Testing

#### US-027: Code Review

**Description:** Comprehensive code review of all new files and modifications.

**Priority:** High

**Dependencies:** US-026

**Acceptance Criteria:**
1. Review all files in `src/remotion/shared/` -- consistent DesignTokens, proper interfaces
2. Review all 8 composition templates -- correct annotation data loading, graceful error handling
3. Review `scripts/extract-annotations.ts` -- correct field extraction per type
4. Review `scripts/gemini-enrich.ts` -- only runs for Types 1 and 8
5. Review `scripts/composition-manifest.json` -- all 22 entries, correct annotation sources
6. `npm run build` succeeds with zero errors
7. `npm run lint` passes
8. TypeScript strict mode passes

---

#### US-028: Playwright E2E Tests

**Description:** Write Playwright tests verifying all 22 pages render with video compositions.

**Priority:** Medium

**Dependencies:** US-026, US-027

**Acceptance Criteria:**
1. Create `tests/e2e/remotion-media.spec.ts`
2. Test: 11 solution pages load `<video>` with correct src
3. Test: 11 case study pages load `<video>`
4. Test: video elements have autoplay, muted, loop, playsinline
5. Test: no console errors
6. Test: mobile viewport responsive
7. All tests pass

---

#### US-029: Visual Verification

**Description:** Manual visual verification of all 22 pages.

**Priority:** Low

**Dependencies:** US-028

**Acceptance Criteria:**
1. Screenshot all 22 pages at 375px, 768px, 1440px
2. Verify each composition shows the correct annotation workflow for its type
3. Verify no layout shifts
4. Document issues as GitHub issues

---

## Technical Notes

### Design System
All compositions use the Claru design system:
- Background: `#0a0908`
- Accent: `#92B090` (Claru green)
- Text: `#FFFFFF`
- Muted: `#888888`
- Selected: accent border glow (`#92B090`)
- Fonts: JetBrains Mono (monospace), Geist (sans-serif)

### Render Settings
- Resolution: 1280x720
- Frame rate: 30fps
- Codec: h264 (MP4)
- CRF: 23 (fallback to 28 if > 10 MB)
- Target file size: 5-10 MB per video
- Total directory size: < 220 MB

### Annotation Data Strategy

**Two distinct data sources exist:**
1. **S3 Annotation JSONs** (`s3_annotation_key`) — real human annotation labels stored as `annotation-data.json` or `data.json` in S3. Available for 10 of 12 datasets. Contains human labels, bboxes, categories, quality scores, preference selections, policy verdicts.
2. **Supabase `enrichment_json` column** — EMPTY across all 12 datasets. This column exists but was never populated.

**Strategy: Use real annotation JSONs as primary data. Generate Gemini enrichment for ALL hero samples to supplement with researcher-valuable metadata (hand tracking, object affordances, scene graphs, technical specs) that the human annotations don't cover.**

| Composition Type | Primary Data Source | Gemini Enrichment |
|-----------------|--------------------|--------------------|
| Type 1: Sensor-Fusion | NONE — Egocentric/Cinematic datasets have no annotation JSON | **YES — Gemini generates ALL annotation data** (bboxes, hand tracking, scene graphs, manipulation phases, spatial estimation, IMU) |
| Type 2: Pairwise Arena | Real S3 annotation JSON (betterVideoId, selectedAnswer, bestVideo, prompt_text) | **YES — Gemini supplements** with quality dimension scores, artifact detection, motion analysis (the human annotation only records winner, not dimensional breakdown) |
| Type 3: Multi-Gen Gallery | Real S3 annotation JSON (bestImage, selectedImages, generations, prompt) | **YES — Gemini supplements** with per-image quality analysis, artifact descriptions, comparative notes |
| Type 4: Detection + Annotation | Real S3 annotation JSON (bbox coords, class, score, captions, brand) | **OPTIONAL — Gemini can add** material classification, affordance labels, object state if human annotations lack them |
| Type 5: Classification Pipeline | Real S3 annotation JSON (category, subcategory, game catalog, concept) | **OPTIONAL — Gemini can add** scene description, object inventory, visual style analysis |
| Type 6: Quality Rubric | Real S3 annotation JSON (5-axis quality dimensions, video_description) | **YES — Gemini supplements** with frame-level quality analysis, artifact timestamps, motion quality metrics |
| Type 7: Safety Shield | Real S3 annotation JSON (text/video policy verdicts, prompt text) | **YES — Gemini supplements** with content category analysis, risk severity estimation, policy mapping |
| Type 8: Cinematic Showcase | NONE — Cinematic dataset has no annotation JSON | **YES — Gemini generates ALL annotation data** (scene description, object detection, camera movement, technical quality analysis) |

**Key principle: For every hero sample we select for a composition, if the enrichment_json is empty (which it is for ALL samples), run Gemini to generate it. This applies to ALL 22 compositions, not just Types 1 and 8. The difference is whether we also have a human annotation JSON to layer on top.**

### Content Safety Dataset (#5) — Video 404 Fix
The media audit found one Content Safety sample video returned 404 from S3. The annotation JSON was accessible but the video file was missing. **The extraction script MUST try alternate sample IDs from the same dataset (132debad).** There are 10 samples total — at least one should be accessible. If a composition's primary sample 404s, the script tries the next sample automatically.

### Environment Requirements
- `GOOGLE_API_KEY` in `.env.local` for Gemini enrichment (Types 1, 8 only)
- `ffmpeg` installed locally for frame extraction
- Node.js 18+ for scripts
- Remotion CLI (`npx remotion`) for rendering

### Sample 404 Fallback Rule
All download/extraction scripts MUST implement: if a primary S3 sample URL returns 404, automatically try the next sample ID in the same dataset. Log failures to `tmp/missing-samples.log`. If ALL samples in a dataset 404, the script exits with non-zero code and the composition is skipped. This was identified during the media audit (Content Safety dataset had one 404).

### Performance Targets
- LCP < 2.5s with video hero
- CLS < 0.1 (fixed aspect ratio containers)
- Total MP4 size per page < 10 MB
- Video start time < 1s on 4G

---

## Appendix A: Composition Design Document

### Composition 1: sol-egocentric (egocentric-video-data)
**Type:** 1 (Sensor-Fusion Tracking)
**S3 Dataset:** Egocentric Activity Capture (eb07cf5b-55b1-45ec-a513-65b9e78956de)
**Sample to use:** 4K traffic/transportation footage from the Philippines -- high-angle dashcam/overpass footage of a busy multi-lane road with dozens of vehicles (tricycles, motorcycles, vans, trucks, SUVs).
**Annotation data available:** None -- empty enrichment, no s3_annotation_key. Gemini generates all annotation data.
**What the Remotion composition shows:** The 4K traffic footage plays with Gemini-generated bounding boxes tracking vehicles as they move through the frame. The sensor-fusion side panel shows simulated telemetry: vehicle count by type (tricycle/motorcycle/van/truck), estimated speeds, lane assignments. Bounding boxes are color-coded by vehicle class. The bottom bar shows CLARU branding with a frame counter and "Traffic Analysis" phase label.
**Gemini enrichment needed:** Full frame-by-frame analysis -- vehicle detection bboxes, vehicle class labels, estimated trajectories. Prompt requests vehicle bounding boxes, class labels, and count aggregation per frame.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Color-coded vehicle bboxes, vehicle count sidebar, speed estimates, lane tracking lines, CLARU bottom bar

### Composition 2: sol-vla (vla-training-data)
**Type:** 1 (Sensor-Fusion Tracking)
**S3 Dataset:** Egocentric Activity Capture (eb07cf5b-55b1-45ec-a513-65b9e78956de)
**Sample to use:** Multi-activity egocentric footage -- select a clip showing hand manipulation (pouring, grasping, or object interaction) from the Samples Egocentric Videos subcategories.
**Annotation data available:** None -- Gemini generates all annotation data.
**What the Remotion composition shows:** Egocentric video with hand and object bounding boxes tracking manipulation actions. The side panel shows VLA-relevant telemetry: manipulation phase (approach/contact/grasp/transport), hand position, object state, task completion percentage. This demonstrates the kind of data that trains Vision-Language-Action models.
**Gemini enrichment needed:** Hand detection, object detection, manipulation phase classification, task progress estimation.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Hand bboxes (green), object bboxes (blue), manipulation phase indicator, task progress bar, VLA telemetry panel

### Composition 3: sol-manipulation (manipulation-trajectory-data)
**Type:** 1 (Sensor-Fusion Tracking)
**S3 Dataset:** Egocentric Activity Capture (eb07cf5b-55b1-45ec-a513-65b9e78956de)
**Sample to use:** Manipulation-specific clip showing clear hand-object interaction (grasping, placing, pouring).
**Annotation data available:** None -- Gemini generates all annotation data.
**What the Remotion composition shows:** Close-up egocentric manipulation with detailed hand tracking. Side panel emphasizes manipulation-specific telemetry: grip force estimate, finger contact points, object affordance labels, grasp type classification. Bboxes show both hands and the target object with trajectory trails.
**Gemini enrichment needed:** Detailed hand pose, grip type, contact point estimation, object affordance analysis, force estimates.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Detailed hand bboxes with finger landmarks, object affordance labels, grip force gauge, trajectory trails, contact point indicators

### Composition 4: sol-teleop (teleoperation-data)
**Type:** 1 (Sensor-Fusion Tracking)
**S3 Dataset:** Egocentric Activity Capture (eb07cf5b-55b1-45ec-a513-65b9e78956de)
**Sample to use:** Outdoor/workplace egocentric footage showing navigation or workplace task.
**Annotation data available:** None -- Gemini generates all annotation data.
**What the Remotion composition shows:** Egocentric footage with bounding boxes on key objects and navigation waypoints. Side panel shows teleoperation-relevant data: spatial orientation, path planning indicators, obstacle detection, environment mapping metadata. Demonstrates data collection for robotic teleoperation training.
**Gemini enrichment needed:** Scene understanding, object detection, spatial layout estimation, navigation-relevant landmarks.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Object bboxes, navigation path overlay, spatial orientation compass, obstacle highlighting, environment map panel

### Composition 5: sol-video-gen (video-generation-training-data)
**Type:** 2 (Pairwise Arena)
**S3 Dataset:** Video Generation Preference Data (bafc163f-83c5-48d5-8944-bd6808cf8688)
**Sample to use:** The cowboy/western post-apocalyptic ghost town scene -- AI-generated video of a cowboy in a weathered trench coat striding down a dusty main street, aiming a revolver, with zombie-like figures. Cinematic quality, desaturated color grading.
**Annotation data available:** Real annotation JSON with `generalData.betterVideoId` (video 1 selected as winner), `metadata.video_1` and `metadata.video_2` S3 URLs, `metadata.prompt_text` (full generation prompt), `project.type`: "VIDEO_MODEL_ARENA", annotation cost $0.05 per comparison.
**What the Remotion composition shows:** Split-screen showing Video A (seed 1) vs Video B (seed 2) of the cowboy scene, both generated from the same prompt. The prompt types out at the top: the full cowboy scene description. After both play, the winning video (Video 1) receives a subtle accent border highlight animation. The loser dims slightly. A neutral split divider label (e.g., "A | B" or "Config 21 | Config 41") pulses between them during playback. This is the single most visually compelling composition -- it directly shows RLHF data collection for video generation.
**Gemini enrichment needed:** None -- uses existing annotation JSON. Selected video is `betterVideoId`, prompt is `metadata.prompt_text`.
**Duration:** 12s at 30fps (360 frames)
**Key visual elements:** Split-screen videos, neutral split divider label (e.g., "A | B" or "Config 21 | Config 41"), typed prompt text, subtle accent border glow on selected, dim on non-selected, technical metadata overlay (resolution, codec), "Arena" bottom bar label

### Composition 6: sol-rlhf (expert-rlhf-annotation)
**Type:** 2 (Pairwise Arena)
**S3 Dataset:** Video Generation Preference Data (bafc163f-83c5-48d5-8944-bd6808cf8688)
**Sample to use:** Second preference pair from the dataset -- different prompt/scene than sol-video-gen to show variety.
**Annotation data available:** Real annotation JSON with same structure as sol-video-gen: betterVideoId, prompt_text, video pair URLs.
**What the Remotion composition shows:** Another pairwise comparison but with emphasis on the "expert" aspect -- a quality scoring overlay appears after the selection showing dimension breakdowns (estimated from Gemini: prompt adherence, motion quality, visual fidelity, aesthetic quality, artifact count). The expert annotator's choice is highlighted with rationale text.
**Gemini enrichment needed:** Minimal -- uses real annotation data for preference selection. Gemini provides supplementary quality dimension scores for the overlay (since the raw annotation only has winner, not dimension breakdown).
**Duration:** 12s at 30fps (360 frames)
**Key visual elements:** Split-screen videos, quality dimension score bars, subtle accent border on selected, metadata overlay (resolution, codec, frame count), "Expert RLHF" bottom bar label

### Composition 7: sol-red-teaming (red-teaming-data)
**Type:** 7 (Safety Shield)
**S3 Dataset:** Content Safety & Policy Review (132debad-3518-4814-8d33-f7bb7b32cd6c)
**Sample to use:** The hiking scene sample (man hiking along alpine trail in red plaid shirt) -- benign content that demonstrates safety review even on non-violating content.
**Annotation data available:** Real annotation JSON with `generalData.text_policy_violation`: "no", `generalData.video_policy_violation`: "no", `metadata.prompt` (200+ word generation prompt), `project.type`: "RED_TEAM_SAFETY_PROJECT_VIDEO_POLICY_REVIEW".
**What the Remotion composition shows:** A blurred content area (the hiking scene is blurred even though benign, to maintain consistent safety composition aesthetics). The prompt text types out in a terminal panel showing the detailed generation prompt. A scanning line sweeps across. Then two verdict badges stamp in: "Text Policy: PASS" (green) and "Video Policy: PASS" (green). A shield icon fills green. This shows the full safety review pipeline even for benign content -- demonstrating thoroughness.
**Gemini enrichment needed:** None -- uses existing annotation JSON directly.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Blurred content area, terminal prompt panel, scanning line, "PASS" verdict badges (green), shield icon, "Safety Review" bottom bar

### Composition 8: sol-sim2real (sim-to-real-data)
**Type:** 5 (Classification Pipeline)
**S3 Dataset:** Game Environment Capture (b2b542aa-7f82-41ee-8fb2-88fd17f07e12)
**Sample to use:** Red Dead Redemption 2 gameplay footage -- third-person western town navigation with visible game HUD, cutscene with NPCs, cinematic camera angles.
**Annotation data available:** Real annotation JSON with `generalData.selectedGame`: "Red Dead Redemption 2", `section`: "Video Game", `category`: "Adventure", `subcategory`: "Red Dead Redemption 2", full 25-game catalog in `project.templateData.categories`, `project.type`: "VIDEO_GAME_CAPTURE".
**What the Remotion composition shows:** The RDR2 gameplay footage plays on the left. On the right, a taxonomy tree animates: the 25-game catalog fans out at the genre level (showing GTA 5, Skyrim, Valorant, Minecraft, etc. briefly), then narrows to "Adventure" -> "Red Dead Redemption 2" as the annotator's selection. The sim-to-real narrative: game environments as proxy for real-world training data. Pipeline stages animate at bottom: Capture -> Game ID -> Scene Classification -> Quality Review -> Approved.
**Gemini enrichment needed:** None -- uses existing annotation JSON.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** RDR2 footage, 25-game taxonomy tree, genre fanning animation, selection narrowing, pipeline stages, "Sim-to-Real" bottom bar

### Composition 9: sol-open-vs-custom (open-datasets-vs-custom)
**Type:** 8 (Cinematic Showcase)
**S3 Dataset:** Cinematic Action Footage (b2d26fd9-745a-4161-9ecf-b784d743f5cf)
**Sample to use:** 4K safari footage -- Samburu/Maasai man wearing traditional beaded jewelry riding in open safari vehicle, arid East African landscape, cinematic shallow depth of field, golden-hour lighting.
**Annotation data available:** None -- no s3_annotation_key. Metadata only: `type`: "Cinematic", `section`: "Cinematic Licensed Data", `category`: "Travel & Exploration", `subcategory`: "Safari & Wildlife Tours".
**What the Remotion composition shows:** The stunning 4K safari footage plays full-bleed with letterbox bars. Minimal overlays emphasize quality: "Licensed 4K" badge, category labels sliding in. A "This is custom data" label appears with premium gold styling, contrasting with the implied low quality of open datasets. The visual itself IS the argument -- this footage quality speaks for itself. Film grain overlay for cinematic feel.
**Gemini enrichment needed:** Scene description for subtitle text (Gemini analyzes the safari scene and generates a natural-language description).
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Full-bleed 4K footage, letterbox bars, "Licensed 4K" badge, category labels, "Custom Data" premium label, film grain overlay

### Composition 10: sol-crowd-vs-expert (crowdsourced-vs-expert-rlhf)
**Type:** 3 (Multi-Gen Gallery)
**S3 Dataset:** AI Image Generation Evaluation (55f26c56-04d5-4a30-9939-b49e3ad809bb)
**Sample to use:** "Magic Flying Drone UFO" generations -- 8 AI-generated images of a drone/UFO toy hovering in a modern living room with LED lights creating colorful reflections. Photorealistic rendering quality.
**Annotation data available:** Real annotation JSON with `generalData.bestImage` (best of 8), `generalData.hasGoodQuality`: "yes", `generalData.selectedImages` (6 of 8 selected as acceptable, 75% pass rate), `metadata.prompt`: "Magic Flying Drone UFO Flying", `metadata.generations` (array of 8 objects with IDs and S3 URLs).
**What the Remotion composition shows:** A 2x4 grid of all 8 drone UFO generations, animating in one at a time. The prompt "Magic Flying Drone UFO Flying" types out above. Green checkmarks appear on the 6 accepted images, red Xs on the 2 rejected. A subtle accent border highlight highlights the best image. Stats overlay: "6/8 acceptable (75%), 1 best". This shows expert evaluation quality -- the narrative is that expert annotators catch subtle quality differences that crowdsourced workers miss.
**Gemini enrichment needed:** None -- uses existing annotation JSON directly.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** 2x4 image grid, staggered reveal, green checkmarks, red Xs, subtle accent border highlight, stats counter, prompt text

### Composition 11: sol-eu-ai-act (eu-ai-act-red-teaming)
**Type:** 7 (Safety Shield)
**S3 Dataset:** Content Safety & Policy Review (132debad-3518-4814-8d33-f7bb7b32cd6c)
**Sample to use:** The sensitive historical content sample -- prompt involving historical scene. This demonstrates handling nuanced edge cases per EU AI Act requirements.
**Annotation data available:** Real annotation JSON with text/video policy violation verdicts, detailed prompt text.
**What the Remotion composition shows:** Safety shield composition with EU AI Act regulatory framing. The prompt types out in a terminal panel. Scanning animation runs. Verdict badges stamp in with EU AI Act article references: "Art. 52 Transparency: PASS", "Art. 6 High-Risk Systems: REVIEW REQUIRED". Policy reference badges are styled differently from standard safety badges -- using EU blue (#003399) accent color. The shield fills with a gradient reflecting the nuanced verdict.
**Gemini enrichment needed:** None -- uses existing annotation JSON. Policy article references are hardcoded based on EU AI Act structure.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Blurred content, terminal prompt panel, EU AI Act policy reference badges, EU blue accent color, nuanced shield verdict, "EU AI Act Compliance" bottom bar

### Composition 12: cs-egocentric (egocentric-video-collection)
**Type:** 8 (Cinematic Showcase)
**S3 Dataset:** Egocentric Activity Capture (eb07cf5b) + Cinematic Action Footage (b2d26fd9)
**Sample to use:** Cross-fade between best egocentric clip and the 4K safari footage -- showing the breadth of Claru's video collection pipeline from egocentric to cinematic.
**Annotation data available:** Cinematic metadata (category/subcategory). Gemini provides scene descriptions.
**What the Remotion composition shows:** Opens with an egocentric activity clip (4K traffic footage from the Philippines), then cross-fades to the cinematic safari footage. Minimal labels: "Egocentric Collection" on the first clip, "Cinematic Licensed" on the second. Demonstrates the range of Claru's video data collection -- from raw egocentric capture to professional cinematography. Letterbox framing throughout.
**Gemini enrichment needed:** Scene descriptions for both clips for subtitle overlay.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Cross-fade between two clips, collection type labels, letterbox bars, CLARU watermark, "Data Collection" bottom bar

### Composition 13: cs-workplace (workplace-egocentric-data)
**Type:** 1 (Sensor-Fusion Tracking)
**S3 Dataset:** Egocentric Activity Capture (eb07cf5b-55b1-45ec-a513-65b9e78956de)
**Sample to use:** Workplace-specific egocentric footage -- office/industrial/commercial environment activity.
**Annotation data available:** None -- Gemini generates all annotation data.
**What the Remotion composition shows:** Egocentric workplace footage with sensor-fusion overlays. Side panel shows workplace-specific telemetry: activity classification (typing, walking, reaching, lifting), PPE detection status, zone identification, interaction logging. Demonstrates data collection for workplace safety and efficiency AI.
**Gemini enrichment needed:** Full frame analysis -- activity classification, object detection, workspace zone estimation.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Workplace-relevant bboxes, activity classification labels, zone indicators, PPE status, workspace telemetry panel

### Composition 14: cs-fashion (fashion-ai-annotation)
**Type:** 4 (Detection + Annotation)
**S3 Dataset:** Product Image Annotation (f6bdb2f1-b580-40ba-8f36-97e42d206ad0)
**Sample to use:** E-commerce product photo of a man wearing bright blue Craghoppers half-zip fleece pullover. Clean gray studio background, full-body shot.
**Annotation data available:** Real annotation JSON with `brandName`: "Craghoppers", `category`: "Fashion (Men's)", `subcategory`: "Tops", product image caption ("A bright blue pullover with a half-zip front and long sleeves"), long caption (50+ words), lifestyle image bbox `{x1: 175.26, y1: 64.57, x2: 365.51, y2: 317.09}`, `productUrl`, `brandUrl`.
**What the Remotion composition shows:** The product image displays with an animated bounding box drawing around the garment at the exact coordinates from the annotation. The brand name "Craghoppers" slides in. The short caption types out letter by letter, then the detailed long caption. Category labels ("Fashion (Men's)" -> "Tops") animate in. A split animation shows product image vs lifestyle image with the bbox highlighting the product within context. This directly visualizes how e-commerce data gets structured for visual search.
**Gemini enrichment needed:** None -- uses existing annotation JSON with real bbox coordinates and captions.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Product bbox (exact coordinates from annotation), typed captions (short then long), brand label, category labels, product-vs-lifestyle split

### Composition 15: cs-game-capture (game-based-data-capture)
**Type:** 5 (Classification Pipeline)
**S3 Dataset:** Game Environment Capture (b2b542aa-7f82-41ee-8fb2-88fd17f07e12)
**Sample to use:** Same RDR2 footage as sol-sim2real but with different focus -- emphasize the full classification pipeline and the 25-game catalog breadth.
**Annotation data available:** Real annotation JSON with selectedGame, full 25-game catalog (GTA 5, Skyrim, Valorant, Counter Strike 2, Minecraft, Elden Ring, PUBG, etc.), genre categories, scene type classification, project.type: "VIDEO_GAME_CAPTURE", annotationCostType: "DURATION".
**What the Remotion composition shows:** RDR2 footage plays on the left. On the right, the full classification pipeline visualizes: first the 25-game catalog fans out showing ALL available games in the taxonomy, then the tree narrows as the annotator selects "Adventure" -> "Red Dead Redemption 2". Scene type classification follows: "cutscene" vs "gameplay" vs "exploration" labels toggle as different parts of the clip play. HUD elements in the game are highlighted (minimap, action icons). The pipeline shows: Raw Capture -> Game ID -> Scene Classification -> Quality Review -> Approved (with cost: "paid per second").
**Gemini enrichment needed:** None -- uses existing annotation JSON.
**Duration:** 12s at 30fps (360 frames)
**Key visual elements:** Full 25-game taxonomy tree, genre selection animation, scene type toggles, HUD element highlights, cost-per-second indicator, pipeline stages

### Composition 16: cs-gen-safety (generative-ai-safety)
**Type:** 7 (Safety Shield)
**S3 Dataset:** Content Safety & Policy Review (132debad-3518-4814-8d33-f7bb7b32cd6c)
**Sample to use:** Benign hiking scene sample (alpine trail, red plaid shirt) -- demonstrates safety review pipeline on safe content.
**Annotation data available:** Real annotation JSON with text_policy_violation: "no", video_policy_violation: "no", full prompt text.
**What the Remotion composition shows:** Full safety review pipeline visualization. Blurred content area. Prompt types out showing the detailed generation description (200+ words). Scanning animation with shield overlay. Text policy scan runs first, producing "Text Policy: PASS" badge. Video policy scan runs second, producing "Video Policy: PASS" badge. Overall shield fills green. Emphasis on the thoroughness of reviewing even clearly benign content -- demonstrating responsible AI development practices.
**Gemini enrichment needed:** None -- uses existing annotation JSON.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Blurred content, terminal prompt panel (200+ words), sequential dual-channel scan, "PASS" badges, green shield, "Generative AI Safety" bottom bar

### Composition 17: cs-red-team (red-teaming-moderation)
**Type:** 7 (Safety Shield)
**S3 Dataset:** Content Safety & Policy Review (132debad-3518-4814-8d33-f7bb7b32cd6c)
**Sample to use:** Different sample from the content safety dataset -- use the sensitive historical content prompt to show handling of nuanced edge cases.
**Annotation data available:** Real annotation JSON with policy violation verdicts.
**What the Remotion composition shows:** Safety shield with emphasis on dual-channel review pipeline. The composition splits the review into two distinct phases: Phase 1 shows the text/prompt analysis with a scanning animation over the prompt text, producing the text policy verdict. Phase 2 shows the video analysis with a frame-by-frame scanning animation, producing the video policy verdict. This dual-channel approach is visually distinct from cs-gen-safety (which shows them sequentially without the phase split). A "Reviewed by Expert" badge appears at the end.
**Gemini enrichment needed:** None -- uses existing annotation JSON.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Dual-channel split animation, Phase 1/Phase 2 labels, text scan + video scan as separate passes, verdict badges, "Expert Reviewed" badge, "Red Team Pipeline" bottom bar

### Composition 18: cs-vid-classify (video-content-classification)
**Type:** 5 (Classification Pipeline)
**S3 Dataset:** Video Classification Supervised Labels (ca2465cf-80ee-4a3c-8c06-a66820671254)
**Sample to use:** Man talking on smartphone outdoors near European architecture. Golden-hour lighting, stock footage quality.
**Annotation data available:** Real annotation JSON with dual taxonomy: `generalData.category`: "Technology & Computing", `generalData.subcategory`: "Smartphones & Gadget Use", AND `metadata.category`: "Portrait photography", `metadata.subcategory`: "Urban outdoor portraits". Also: `metadata.caption` (scene description), `metadata.concept`: "People", `metadata.source`: "Supervised_fine_tuning".
**What the Remotion composition shows:** The smartphone video plays on the left (60%). On the right, TWO taxonomy trees animate sequentially. First: Content taxonomy expanding "Content" -> "People" -> "Technology & Computing" -> "Smartphones & Gadget Use". Second: Visual Style taxonomy expanding "Visual Style" -> "Portrait photography" -> "Urban outdoor portraits". The dual taxonomy shows how a single clip gets multiple classification passes. Caption text types out below. A "Supervised Fine-Tuning" source badge appears, indicating this is for instruction-tuned model training.
**Gemini enrichment needed:** None -- uses existing annotation JSON.
**Duration:** 12s at 30fps (360 frames)
**Key visual elements:** Dual taxonomy trees (content + visual style), sequential tree expansion, caption typewriter, "Supervised Fine-Tuning" badge, concept label ("People")

### Composition 19: cs-vid-eval (video-model-evaluation)
**Type:** 2 (Pairwise Arena)
**S3 Dataset:** Systematic Quality Parameter Evaluations (a5f0c373-0bed-4d30-8f6c-03a862cf968e)
**Sample to use:** Pixar-style anthropomorphic capybara on a grassy hill. Furry character in white t-shirt and blue shorts. Vertical (portrait) format, 1080x1920.
**Annotation data available:** Real annotation JSON with `generalData.selectedAnswer`: "21" (config 21 won), `metadata.key`: "video_110_config_21_config_41", `metadata.video_1` (config 21), `metadata.video_2` (config 41), `metadata.prompt_text` (capybara description with image-to-video placeholder), `project.type`: "PARAMS_TESTING_OVERALL_QUALITY".
**What the Remotion composition shows:** Split-screen showing Config 21 (left) vs Config 41 (right) of the Pixar capybara. Config labels prominently displayed: "Config 21" and "Config 41". The prompt types out above. After both play, Config 21 receives the selected indicator (subtle border glow). Labels show this is a systematic parameter sweep: "video_110_config_21_config_41" -- revealing the industrial-scale testing methodology. An inference parameter table briefly flashes to suggest hyperparameter optimization.
**Gemini enrichment needed:** None -- uses existing annotation JSON.
**Duration:** 12s at 30fps (360 frames)
**Key visual elements:** Portrait-format capybara videos (letterboxed in 16:9), "Config 21" vs "Config 41" labels, parameter sweep notation, selected indicator (subtle border glow), "Parameter Testing" bottom bar

### Composition 20: cs-vid-quality (video-quality-at-scale)
**Type:** 6 (Quality Rubric)
**S3 Dataset:** Video Quality Annotations (4bda56db-59de-4794-9913-6738955c4f8c)
**Sample to use:** Three young people outdoors in rural setting -- woman in orange outfit gesturing, two men nearby. "Cg 11 king" watermark. User-generated social media content.
**Annotation data available:** Real annotation JSON with 5 quality dimensions: isCinematic ("not-cinematic"), hasGoodMotion ("good-motion"), isHighQuality ("not-high-quality"), isVideoInteresting ("interesting"), hasGoodTextAlignment ("good-alignment"). Also: videoEndedAt (4.966667s, annotator watched full clip), metadata.video_description (full scene description), metadata.num_frames (149).
**What the Remotion composition shows:** The social media video plays on the left (60%). On the right, five quality dimension gauges animate in staggered sequence: Cinematic (low, red), Motion (high, green), Quality (low, orange), Interest (high, green), Text Alignment (high, green). After all gauges fill, a 5-axis radar chart builds showing the shape of this video's quality profile. The annotator's scene description types out beneath. This composition is the clearest visualization of Claru's multi-dimensional evaluation -- not just "good/bad" but 5 orthogonal quality axes.
**Gemini enrichment needed:** None -- uses existing annotation JSON with real quality dimension values.
**Duration:** 12s at 30fps (360 frames)
**Key visual elements:** 5 animated quality gauges (color-coded), 5-axis radar chart, scene description typewriter, watermark acknowledgment, "Quality Assessment" bottom bar

### Composition 21: cs-prompt-bench (prompt-enhancement-benchmark)
**Type:** 2 (Pairwise Arena)
**S3 Dataset:** Prompt & Video Selection Rankings (8689f381-9bb2-4dec-9b0f-f8eb4ecce79b)
**Sample to use:** Kayaking footage -- two kayakers paddling through river slalom course with red/white and green/white gate poles. Dynamic action with splashing water.
**Annotation data available:** Real annotation JSON with `generalData.bestVideo` (video 2 selected as winner), `generalData.video1EndedAt` (4.337667s), `generalData.video2EndedAt` (4.938267s), `generalData.videoBelongsToCategory`: true, `metadata.video_1.category`: "Kayaking", `metadata.video_2.category`: "Kayaking", `project.type`: "SUPER_CATEGORY_BEST_VIDEO", `project.title`: "Super Category Best Video v1 Round 1".
**What the Remotion composition shows:** Split-screen showing two kayaking videos side by side with the category label "Kayaking" prominently above both. Both play simultaneously. A category verification checkmark animates in, confirming both videos belong to the Kayaking category. After both play, Video 2 receives the selected indicator (subtle border glow). A evaluation round indicator appears: "Evaluation 1 of N" suggesting iterative selection rounds. Annotator watch times display briefly, showing both clips were watched fully.
**Gemini enrichment needed:** None -- uses existing annotation JSON.
**Duration:** 12s at 30fps (360 frames)
**Key visual elements:** Split-screen kayaking, "Kayaking" category label, category verification checkmark, selected indicator (subtle border glow), "Round 1" tournament indicator, watch time stamps, "Prompt Benchmark" bottom bar

### Composition 22: cs-object-id (object-identity-persistence)
**Type:** 4 (Detection + Annotation)
**S3 Dataset:** Object & Face Identity Matching (040fee50-eafd-426d-bf9c-e5343b449d72)
**Sample to use:** Two men in a park -- one with curly dark hair in plaid shirt (main subject), the other in a straw hat. Stone monument in background. Close-up framing on faces.
**Annotation data available:** Real annotation JSON with `segment[]` array: segment 1 bbox [965, 222, 1390, 829] class "face" score 0.825, segment 2 with its own bbox/score. Identity match verdicts: segment1_image1: "yes", segment1_image2: "yes", etc. Frame index, aligned face thumbnails, `project.type`: "OBJECT_IDENTITY_V4".
**What the Remotion composition shows:** The video plays, then freeze-frames. Bounding boxes draw around both detected faces using the EXACT coordinates from the annotation ([965, 222, 1390, 829]). Confidence scores appear: "0.825". Face crops extract and display side by side with alignment lines. The annotator's identity verdict animates: "Same person? YES" with a green connecting line between matched segments. A second pair comparison shows a "NO" match for contrast. The v4 version badge indicates methodology refinement.
**Gemini enrichment needed:** None -- uses existing annotation JSON with real bbox coordinates and identity verdicts.
**Duration:** 10s at 30fps (300 frames)
**Key visual elements:** Face bboxes at exact annotation coordinates, confidence scores, extracted face crops, identity match lines (green for yes, red for no), "Object Identity v4" version badge, "Identity Pipeline" bottom bar
