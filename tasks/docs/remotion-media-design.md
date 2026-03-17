# Remotion + Gemini Media Enhancement -- Design Document

> **Status**: Draft
> **Date**: 2026-03-16
> **Scope**: 22 pre-rendered Remotion video compositions (11 solution pages + 11 case study pages) enhanced with Gemini 2.5 Flash vision annotations. Case study pages receive full redesigns with video heroes.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Components and Interfaces](#3-components-and-interfaces)
4. [Data Models](#4-data-models)
5. [Composition-to-Page Mapping](#5-composition-to-page-mapping)
6. [Gemini Enrichment Pipeline](#6-gemini-enrichment-pipeline)
7. [Render Pipeline](#7-render-pipeline)
8. [Case Study Page Redesign](#8-case-study-page-redesign)
9. [Error Handling](#9-error-handling)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. Overview

### 1.1 Business Value

Claru's landing site currently uses static hero sections and text-heavy layouts. This feature transforms both solution pages and case study pages with pre-rendered video compositions that demonstrate Claru's data annotation capabilities in action. Each composition is unique to its page's content type, providing visual proof of technical competence to frontier AI lab prospects (Reka AI, Moonvalley).

### 1.2 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Rendering strategy** | Pre-rendered MP4, not runtime `<RemotionPlayer>` | Zero JS bundle cost, instant playback, no hydration mismatch risk, works with `autoPlay muted loop playsInline` |
| **AI enrichment** | Gemini 2.5 Flash (vision) | Already configured and tested; multimodal frame analysis at low cost; structured JSON output mode |
| **Composition taxonomy** | 8 annotation workflow types (1-8) | Each type represents a real Claru annotation workflow; every composition grounded in actual media assets |
| **Annotation data strategy** | Real S3 annotation JSON first, Gemini only when needed | Types 2-7 use real annotation data from S3; Types 1, 8 use Gemini only because those datasets lack annotation JSON |
| **Video hosting** | `public/videos/` committed to repo (< 220 MB total) | Vercel serves from edge CDN; no presigned URL complexity; deterministic builds |
| **Fallback for large files** | S3 + CloudFront (existing `presigner.ts`) | If total MP4 size exceeds Vercel's 256 MB function limit, overflow to S3 with existing CloudFront signing |

### 1.3 Constraints

- **Video budget**: 5-10 MB per MP4, 1280x720, 30fps, 8-15 seconds each
- **Total disk**: ~110-220 MB across 22 compositions
- **Gemini rate limits**: 15 RPM on free tier, 1000 RPM on pay-as-you-go (2.5 Flash)
- **ffmpeg required**: Local dependency for frame extraction
- **Render time**: ~30-60s per composition via Remotion CLI (total ~15-20 min for full batch)

---

## 2. Architecture

### 2.1 High-Level System Diagram

```mermaid
flowchart TB
    subgraph Build Pipeline ["Build Pipeline (local / CI)"]
        DL["scripts/download-samples.ts<br/>Downloads 3-5 S3 hero samples<br/>per composition"]
        FE["scripts/gemini-enrich.ts<br/>ffmpeg frame extraction<br/>+ Gemini 2.5 Flash analysis"]
        RN["scripts/render-all.ts<br/>Remotion CLI render<br/>22 compositions → MP4"]
        DL --> FE --> RN
    end

    subgraph S3 ["AWS S3 (existing)"]
        SAMPLES["189 video samples<br/>12 datasets<br/>enrichment_json"]
    end

    subgraph Gemini ["Google AI"]
        GEM["Gemini 2.5 Flash<br/>(vision + structured output)"]
    end

    subgraph Remotion ["Remotion Compositions"]
        T1["Type 1: Sensor-Fusion Tracking"]
        T2["Type 2: Pairwise Arena"]
        T3["Type 3: Multi-Gen Gallery"]
        T4["Type 4: Detection + Annotation"]
        T5["Type 5: Classification Pipeline"]
        T6["Type 6: Quality Rubric"]
        T7["Type 7: Safety Shield"]
        T8["Type 8: Cinematic Showcase"]
    end

    subgraph Output ["public/"]
        VID["videos/<br/>22 × MP4 files"]
        ANN["remotion-assets/annotations/<br/>22 × JSON files"]
    end

    subgraph NextJS ["Next.js App (runtime)"]
        SP["Solution Pages<br/>/solutions/[slug]"]
        CS["Case Study Pages<br/>/case-studies/[slug]"]
        VH["VideoHero component<br/><video autoPlay muted loop>"]
    end

    SAMPLES -->|presigned download| DL
    FE -->|frames + prompts| GEM
    GEM -->|structured JSON| FE
    FE -->|annotation JSON| ANN
    ANN -->|staticFile()| Remotion
    SAMPLES -->|hero clips| Remotion
    Remotion -->|npx remotion render| VID
    VID --> VH
    VH --> SP
    VH --> CS
```

### 2.2 Data Flow

1. **Download phase**: `download-samples.ts` reads a manifest JSON (`scripts/composition-manifest.json`) that maps each composition ID to its S3 sample keys. Downloads 3-5 representative clips per composition to `tmp/samples/{composition-id}/`.

2. **Annotation extraction phase**: `extract-annotations.ts` downloads existing S3 annotation JSONs for Types 2-7 (13 compositions with real annotation data), extracts relevant fields, and writes formatted JSON to `public/remotion-assets/annotations/{composition-id}.json`.

2b. **Gemini enrichment phase** (Types 1, 8 only): `gemini-enrich.ts` processes the 7 compositions without annotation JSON (5 sensor-fusion + 2 cinematic), extracts frames at 2-3 fps using ffmpeg, sends to Gemini 2.5 Flash, and writes structured annotation JSON.

3. **Render phase**: `render-all.ts` invokes `npx remotion render` for each of the 22 registered compositions, outputting to `public/videos/{composition-id}.mp4`.

4. **Runtime**: Next.js pages embed the pre-rendered MP4 with `<video autoPlay muted loop playsInline>` via the new `VideoHero` component. Zero runtime JS cost for video playback.

### 2.3 File Structure

```
src/remotion/
├── index.ts                              # registerRoot (existing)
├── Root.tsx                              # All 22 compositions registered
├── compositions/
│   ├── type-1/                           # Sensor-Fusion Tracking
│   │   ├── SensorFusionComposition.tsx    # Video + bboxes + telemetry panel
│   │   └── types.ts                       # Type 1 annotation schema (Gemini-generated)
│   ├── type-2/                           # Pairwise Arena
│   │   ├── PairwiseArenaComposition.tsx   # Split-screen A/B + winner crown
│   │   └── types.ts                       # Uses real betterVideoId/selectedAnswer
│   ├── type-3/                           # Multi-Gen Gallery
│   │   ├── MultiGenGalleryComposition.tsx # 2x4 grid + best-of-N selection
│   │   └── types.ts                       # Uses real bestImage/selectedImages
│   ├── type-4/                           # Detection + Annotation
│   │   ├── DetectionAnnotationComposition.tsx # Progressive bboxes + labels
│   │   └── types.ts                       # Uses real bbox coords/confidence
│   ├── type-5/                           # Classification Pipeline
│   │   ├── ClassificationPipelineComposition.tsx # Taxonomy tree expansion
│   │   └── types.ts                       # Uses real category/subcategory
│   ├── type-6/                           # Quality Rubric
│   │   ├── QualityRubricComposition.tsx   # 5-axis gauges + radar chart
│   │   └── types.ts                       # Uses real 5-axis quality dimensions
│   ├── type-7/                           # Safety Shield
│   │   ├── SafetyShieldComposition.tsx    # Scan + verdict badges
│   │   └── types.ts                       # Uses real policy violation data
│   └── type-8/                           # Cinematic Showcase
│       ├── CinematicShowcaseComposition.tsx # Minimal overlay on 4K footage
│       └── types.ts                       # Gemini scene description + metadata
├── shared/
│   ├── BoundingBox.tsx                    # Reusable bbox overlay (extracted from EgocentricPipeline)
│   ├── MetadataPanel.tsx                  # Reusable terminal-style panel
│   ├── ProgressBar.tsx                    # Animated progress indicator
│   ├── BottomBar.tsx                      # CLARU-branded timestamp bar
│   ├── TerminalHeader.tsx                 # macOS-style terminal title bar
│   ├── DesignTokens.ts                   # Colors, fonts, shared constants
│   ├── RadarChart.tsx                     # 5-axis spider chart (Type 6)
│   ├── TaxonomyTree.tsx                   # Animated hierarchy tree (Type 5)
│   └── VerdictBadge.tsx                   # Animated verdict stamp/badge/crown
├── EgocentricPipeline.tsx                 # Existing prototype (kept for reference)

scripts/
├── composition-manifest.json              # Maps composition IDs → S3 keys + config
├── download-samples.ts                    # S3 sample + annotation JSON downloader
├── extract-annotations.ts                 # Extracts real annotation data for Types 2-7
├── gemini-enrich.ts                       # Gemini enrichment for Types 1, 8 ONLY
├── render-all.ts                          # Batch Remotion render
└── gemini-prompts/
    └── type-1-sensor-fusion.txt           # Only prompt needed (Types 2-7 use real data)

src/app/components/media/
├── VideoHero.tsx                          # Pre-rendered video hero (client)
├── AnimatedMetrics.tsx                    # Animated counter cards (client)
└── ProcessTimeline.tsx                    # Animated process step timeline (client)

public/
├── videos/                                # 22 pre-rendered MP4s
│   ├── egocentric-video-data.mp4
│   ├── vla-training-data.mp4
│   └── ... (20 more)
└── remotion-assets/
    ├── annotations/                       # Per-composition annotation JSON (real + Gemini)
    │   ├── egocentric-video-data.json
    │   └── ... (21 more -- all 22 compositions have annotation JSON)
    ├── frames/                            # Extracted keyframes (gitignored)
    ├── video-annotations.json             # Existing prototype data
    └── pour-liquid.mp4                    # Existing prototype video
```

---

## 3. Components and Interfaces

### 3.1 Remotion Shared Components

#### BoundingBox (extracted from EgocentricPipeline)

```typescript
// src/remotion/shared/BoundingBox.tsx

interface BoundingBoxProps {
  /** Normalized coordinates [x1, y1, x2, y2] in range [0, 1] */
  bbox: [number, number, number, number];
  /** Display label above the box */
  label: string;
  /** Box border color */
  color: string;
  /** Optional secondary label (e.g. affordance, action) */
  sublabel?: string;
  /** Opacity [0, 1] — controlled by parent for fade-in */
  opacity: number;
  /** Show corner markers (default: true) */
  showCorners?: boolean;
}
```

**Design decision**: Extracted from the existing `EgocentricPipeline.tsx` BBox component to enable reuse across Type A, B, and D compositions. The existing implementation at lines 91-165 of `EgocentricPipeline.tsx` is production-ready and only needs the interface extracted.

#### MetadataPanel

```typescript
// src/remotion/shared/MetadataPanel.tsx

interface MetadataPanelProps {
  /** Panel title shown in terminal header */
  title: string;
  /** Array of labeled sections, each with key-value rows */
  sections: MetadataSection[];
  /** Panel width in pixels (default: 320) */
  width?: number;
  /** Whether panel is visible (controls slide-in animation) */
  visible: boolean;
  /** Position: 'right' (default) or 'left' */
  position?: "right" | "left";
}

interface MetadataSection {
  label: string;
  rows: MetadataRow[];
}

interface MetadataRow {
  key: string;
  value: string | number;
  color?: string;
  /** Optional progress bar [0-100] */
  progress?: number;
}
```

**Design decision**: Generalized from the `SidePanel` in `EgocentricPipeline.tsx` (lines 170-299). The existing panel is tightly coupled to the egocentric annotation schema. The new `MetadataPanel` accepts generic sections/rows so it can render any composition type's data.

#### DesignTokens

```typescript
// src/remotion/shared/DesignTokens.ts

export const TOKENS = {
  colors: {
    accent: "#92B090",        // Claru green (matches globals.css --accent-primary mapped)
    accentAlt: "#4a90d9",     // Blue for secondary elements
    text: "#e8e8e8",
    muted: "#888",
    panelBg: "rgba(10, 9, 8, 0.88)",
    error: "rgba(239, 68, 68, 0.8)",
    warning: "#f5a623",
    success: "#22c55e",
    chosen: "#22c55e",
    rejected: "#ef4444",
  },
  fonts: {
    mono: "JetBrains Mono, monospace",
    sans: "Geist, sans-serif",
  },
  bbox: {
    hand: "#92B090",
    object: "#4a90d9",
    violation: "#ef4444",
    highlight: "#f5a623",
  },
} as const;
```

### 3.2 Composition Templates

> **v2 update**: Composition types changed from A-E (generic) to 1-8 (annotation workflow-specific). Type E (animated charts) removed entirely -- every composition now shows a real annotation workflow. See `tasks/prd-remotion-media.md` Appendix A for detailed per-composition design specs.

#### Type 1: Sensor-Fusion Tracking (formerly Type A)

Used for egocentric video, manipulation, teleoperation, and workplace pages. **Gemini-enriched** (Egocentric dataset has no annotation JSON).

```typescript
// src/remotion/compositions/type-1/SensorFusionComposition.tsx

interface Type1Props {
  /** Composition ID (used to load annotation JSON + video) */
  compositionId: string;
}
```

**Visual structure**:
```
┌─────────────────────────────────────────────────────┬──────────────┐
│                                                     │  SENSOR      │
│            Real Video with BBox Overlays             │  FUSION      │
│                                                     │  PANEL       │
│   ┌──────────┐  ┌──────────────┐                    │              │
│   │ L_HAND   │  │ white bottle │                    │  task_state  │
│   │ grasping │  │ graspable    │                    │  hand_telem  │
│   └──────────┘  └──────────────┘                    │  objects     │
│                                                     │  spatial     │
│                                                     │  imu         │
├─────────────────────────────────────────────────────┴──────────────┤
│ CLARU  t=2.3s  pouring  ━━━━━━━━━━━━━━━━░░░░░░░░░░░░              │
└────────────────────────────────────────────────────────────────────┘
```

**Animation timeline** (10s at 30fps = 300 frames):
| Frame Range | Event |
|-------------|-------|
| 0-15 | Video plays, no overlays |
| 15-24 | Bounding boxes fade in |
| 24-30 | Side panel slides in from right |
| 30-270 | Full composition with interpolated bbox tracking |
| 270-300 | Gentle fade to CLARU watermark |

**Design decision**: This is a direct evolution of the existing `EgocentricPipeline.tsx`. The prototype already implements bbox interpolation (lines 28-86), sensor-fusion side panel, and bottom bar. Type 1 compositions parameterize this by reading different annotation JSON and video sources per `compositionId`.

#### Type 2: Pairwise Arena (formerly Type B)

Used for video generation, RLHF, prompt benchmark, and quality parameters pages. **Uses real annotation data** (betterVideoId, selectedAnswer, bestVideo from S3 annotation JSONs).

```typescript
// src/remotion/compositions/type-2/PairwiseArenaComposition.tsx

interface Type2Props {
  compositionId: string;
}
```

**Visual structure**:
```
┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│        VIDEO A           │        VIDEO B           │
│      (Original)          │      (Generated)         │
│                          │                          │
│   ┌─── CHOSEN ───┐      │                          │
│   └──────────────┘      │   ┌── REJECTED ──┐      │
│                          │   └──────────────┘      │
├──────────────────────────┴──────────────────────────┤
│  Clarity: ████████░░ 8.2  Motion: ██████░░░░ 6.1   │
│  Alignment: █████████░ 9.0  Artifacts: ██░░░░░░ 2.3│
├─────────────────────────────────────────────────────┤
│ CLARU  Quality Eval  ━━━━━━━━━━━━━━━━░░░░░░░░░░    │
└─────────────────────────────────────────────────────┘
```

**Animation timeline** (12s at 30fps = 360 frames):
| Frame Range | Event |
|-------------|-------|
| 0-30 | Side-by-side videos fade in simultaneously |
| 30-90 | Videos play, no badges |
| 90-120 | Dimension score bars animate in sequentially (spring) |
| 120-180 | Scores continue updating |
| 180-210 | CHOSEN badge stamps onto Video A (spring bounce) |
| 210-240 | REJECTED badge stamps onto Video B (fade + slight shake) |
| 240-360 | Hold final state with subtle pulsing on winner |

**Design decision**: Side-by-side is the most intuitive layout for preference/quality tasks. The winner crown reveal creates a moment of drama that communicates the evaluation concept instantly. Real annotation data (betterVideoId) determines the winner -- no Gemini needed.

#### New Types 3-8 (v2 additions)

Types 3-8 are new annotation workflow compositions replacing the old generic types. See `tasks/prd-remotion-media.md` for full specs:

- **Type 3: Multi-Gen Gallery** -- 2x4 grid of N generations, checkmark/X, best crown (uses real bestImage/selectedImages)
- **Type 4: Detection + Annotation** -- Progressive bboxes with real coordinates, confidence scores, captions
- **Type 5: Classification Pipeline** -- Animated taxonomy tree from real category/subcategory hierarchies
- **Type 6: Quality Rubric** -- 5-axis gauges + radar chart from real quality dimension data
- **Type 7: Safety Shield** -- Scanning overlay + verdict badges from real policy violation data (replaces old Type C)
- **Type 8: Cinematic Showcase** -- Minimal overlay on 4K footage, Gemini scene descriptions

#### Type 7: Safety Shield (formerly Type C)

Used for generative AI safety, red teaming, and content safety pages. **Uses real annotation data** (text_policy_violation, video_policy_violation from S3 annotation JSONs).

```typescript
// src/remotion/compositions/type-7/SafetyShieldComposition.tsx

interface Type7Props {
  compositionId: string;
}
```

**Visual structure**:
```
┌─────────────────────────────────────────────────────┬──────────────┐
│                                                     │ MODERATION   │
│          Content Under Review                       │ DASHBOARD    │
│          (blurred/redacted regions)                 │              │
│                                                     │ ● Violence   │
│   ┌─ VIOLATION ─────────────────┐                   │   HIGH 0.92  │
│   │  Category: hate_speech      │                   │ ● Sexual     │
│   │  Severity: HIGH             │                   │   LOW  0.12  │
│   │  Policy: EU AI Act Art.52   │                   │ ● Hate       │
│   └─────────────────────────────┘                   │   MED  0.67  │
│                                                     │              │
├─────────────────────────────────────────────────────┤ Attack: 47   │
│ CLARU  Safety Pipeline  ━━━━━━━━━━━━━░░░░░░░░░░     │ Blocked: 43  │
└─────────────────────────────────────────────────────┴──────────────┘
```

**Animation timeline** (10s at 30fps = 300 frames):
| Frame Range | Event |
|-------------|-------|
| 0-30 | Content fades in (blurred/pixelated for safety) |
| 30-60 | Scanning line sweeps across content |
| 60-90 | Violation detection boxes appear with spring animation |
| 90-150 | Dashboard scores animate in, bars filling |
| 150-210 | Category breakdown appears, confidence numbers tick up |
| 210-270 | Attack/defense counters increment |
| 270-300 | "BLOCKED" stamp with red flash, fade to CLARU watermark |

**Design decision**: Content is always shown blurred/redacted -- never actual unsafe content. Real annotation data provides the policy violation verdicts. The visual emphasis is on the review pipeline and verdict badges, not the content. Dual-channel (text + video) review is a key differentiator.

> **v2 note**: The old Type D (Data Pipeline / Sync) and Type E (Animated Charts) have been removed. Type D pages now use Type 5 (Classification Pipeline) or Type 4 (Detection + Annotation). Type E pages now use Type 3 (Multi-Gen Gallery), Type 7 (Safety Shield), or Type 8 (Cinematic Showcase) -- every composition shows a real annotation workflow.

### 3.3 Page-Level Components

#### VideoHero

```typescript
// src/app/components/media/VideoHero.tsx
"use client";

interface VideoHeroProps {
  /** Path to pre-rendered MP4 in public/videos/ */
  videoSrc: string;
  /** Fallback poster image path */
  posterSrc?: string;
  /** Optional overlay text/badge */
  badge?: string;
  /** Aspect ratio class (default: "aspect-video") */
  aspectRatio?: string;
}
```

Renders a `<video autoPlay muted loop playsInline>` element with:
- Intersection Observer to pause when off-screen (battery savings)
- Poster image fallback for slow connections
- Optional gradient overlay at bottom for text readability
- Matches existing site styling (rounded-2xl, border-subtle)

#### AnimatedMetrics

```typescript
// src/app/components/media/AnimatedMetrics.tsx
"use client";

interface AnimatedMetricsProps {
  metrics: Array<{
    value: string;     // e.g. "50,000+" or "98.7%"
    label: string;     // e.g. "Annotations Delivered"
    numericValue: number; // Parsed number for counter animation
    suffix?: string;   // e.g. "+", "%", "x"
    prefix?: string;   // e.g. "$", ">"
  }>;
}
```

Replaces the static `snapshotStats` grid in `CaseStudyDetailClient.tsx` (lines 360-383). Uses Framer Motion `useInView` + `useMotionValue` to animate numbers from 0 to target with easing, matching the terminal aesthetic.

**Design decision**: The current snapshot bar (section 3 in CaseStudyDetailClient) already uses Framer Motion for fade-in. AnimatedMetrics enhances this with actual counter animation while maintaining the same grid layout and styling.

#### ProcessTimeline

```typescript
// src/app/components/media/ProcessTimeline.tsx
"use client";

interface ProcessTimelineProps {
  steps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  /** Animation variant: 'flow' (horizontal) or 'vertical' */
  variant?: "flow" | "vertical";
}
```

Replaces the existing `ProcessFlow` component (lines 19-121 in CaseStudyDetailClient.tsx). Adds:
- Sequential step reveal with stagger delay
- Animated connecting lines that "draw" between steps
- Pulsing active step indicator
- Terminal-style step numbers with monospace font

**Design decision**: The existing `ProcessFlow` is embedded as a local component inside `CaseStudyDetailClient.tsx`. Extracting it to a standalone component enables reuse on solution pages and allows the enhanced animation without bloating the case study client file.

---

## 4. Data Models

### 4.1 Composition Manifest

Central configuration mapping all 22 compositions to their resources.

```typescript
// scripts/composition-manifest.json schema

interface CompositionManifest {
  compositions: CompositionConfig[];
}

interface CompositionConfig {
  /** Unique composition ID — used as filename and Remotion composition ID */
  id: string;
  /** Composition type determines which annotation workflow template to use */
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** Where annotation data comes from */
  annotationSource: "real" | "gemini" | "metadata-only";
  /** Page this composition belongs to */
  page: {
    route: string;       // e.g. "/solutions/egocentric-video-data"
    placement: "hero" | "inline" | "after-approach";
  };
  /** S3 sample keys to download for this composition */
  samples: Array<{
    datasetSlug: string;
    sampleId?: string;          // Specific sample ID
    subcategory?: string;       // Or pick from subcategory
    maxSamples?: number;        // How many to pick (default: 3)
  }>;
  /** Gemini enrichment configuration (null when annotationSource !== 'gemini') */
  enrichment: {
    promptFile: string;         // Path to prompt template
    framesPerSecond: number;    // Frame extraction rate (2-3)
    maxFrames: number;          // Cap on frames sent to Gemini
  } | null;
  /** Remotion render configuration */
  render: {
    durationFrames: number;     // e.g. 300 (10s at 30fps)
    fps: number;                // 30
    width: number;              // 1280
    height: number;             // 720
    codec: "h264" | "vp8";     // h264 for MP4, vp8 for WebM
  };
  /** S3 annotation key for compositions with annotationSource: 'real' */
  s3AnnotationKey?: string;
}
```

### 4.2 Annotation Schemas (Real Data + Gemini Output)

> **v2 update**: Types 2-7 schemas now match the actual fields in S3 annotation JSONs (see media-asset-audit.md). Types 1 and 8 are Gemini-generated. See `tasks/prd-remotion-media.md` user stories US-013 through US-020 for exact field extraction per type.

#### Type 1: Sensor-Fusion Annotation (Gemini-generated)

```typescript
// src/remotion/compositions/type-1/types.ts

interface Type1Annotation {
  frames: Type1Frame[];
}

interface Type1Frame {
  timestamp_s: number;
  manipulation_phase: string;
  task_step: string;
  task_pct: number;
  hands: HandAnnotation[];
  objects: ObjectAnnotation[];
  spatial?: SpatialEstimate;
  imu_estimate?: IMUEstimate;
  scene?: SceneContext;
}

interface HandAnnotation {
  side: "left" | "right";
  bbox: [number, number, number, number];
  action: string;
  holding: string | null;
  finger_state?: string;
  force_estimate_N?: number;
  velocity_ms?: number;
  wrist_pose?: { x: number; y: number; z_depth_est: number };
}

interface ObjectAnnotation {
  label: string;
  bbox: [number, number, number, number];
  affordance: string;
  interacting: boolean;
  state?: string;
  fill_level_pct?: number;
  pose_6dof?: { roll: number; pitch: number; yaw: number };
}

interface SpatialEstimate {
  camera_height_est_m: number;
  camera_pitch_deg: number;
  workspace_depth_m: number;
  dominant_hand_distance_m: number;
}

interface IMUEstimate {
  head_angular_vel_dps: { x: number; y: number; z: number };
  linear_accel_ms2: { x: number; y: number; z: number };
  head_stable: boolean;
}

interface SceneContext {
  lighting_lux_est: number;
  clutter_level: string;
  surface_material: string;
}
```

**Design decision**: This schema is derived directly from the existing `video-annotations.json` (already in `public/remotion-assets/`). The existing EgocentricPipeline already consumes this exact structure. New Type 1 compositions use the same schema so they can share the interpolation logic. Gemini generates this data because Egocentric Activity Capture has no annotation JSON.

#### Type 2: Pairwise Arena Annotation (Real S3 data)

```typescript
// src/remotion/compositions/type-2/types.ts
// Fields extracted from real S3 annotation JSONs

interface Type2Annotation {
  videoA: { url: string; label?: string };
  videoB: { url: string; label?: string };
  winner: "A" | "B";
  promptText: string;
  configLabels?: { a: string; b: string };  // For cs-vid-eval: "Config 21", "Config 41"
  categoryLabel?: string;                    // For cs-prompt-bench: "Kayaking"
  categoryVerified?: boolean;                // From videoBelongsToCategory
  tournamentRound?: string;                  // From project.title: "v1 Round 1"
}
```

#### Type 3: Multi-Gen Gallery Annotation (Real S3 data)

```typescript
// src/remotion/compositions/type-3/types.ts

interface Type3Annotation {
  prompt: string;
  generations: Array<{ id: string; url: string }>;
  selectedImages: string[];      // IDs of acceptable images (6 of 8)
  bestImage: string;             // ID of best image
  hasGoodQuality: boolean;
  passRate: number;              // e.g., 0.75
}
```

#### Type 4: Detection + Annotation (Real S3 data)

```typescript
// src/remotion/compositions/type-4/types.ts

interface Type4Annotation {
  variant: "identity" | "product";
  // Identity variant (Object & Face Identity dataset)
  segments?: Array<{
    bbox: [number, number, number, number];  // [965, 222, 1390, 829]
    class: string;                           // "face"
    score: number;                           // 0.825
    frameIndex: number;
    thumbnailUrl?: string;
    matchVerdicts?: Record<string, boolean>; // segment1_image1: true
  }>;
  // Product variant (Product Image Annotation dataset)
  product?: {
    brandName: string;                       // "Craghoppers"
    category: string;                        // "Fashion (Men's)"
    subcategory: string;                     // "Tops"
    shortCaption: string;
    longCaption: string;
    lifestyleBbox: { x1: number; y1: number; x2: number; y2: number };
  };
}
```

#### Type 5: Classification Pipeline Annotation (Real S3 data)

```typescript
// src/remotion/compositions/type-5/types.ts

interface Type5Annotation {
  taxonomies: Array<{
    root: string;
    levels: string[];            // ["People", "Technology & Computing", "Smartphones & Gadget Use"]
  }>;
  caption?: string;
  concept?: string;              // "People"
  pipelineStages: string[];      // ["Raw Capture", "Classification", "Review", "Approved"]
  // Game-specific
  gameTitle?: string;            // "Red Dead Redemption 2"
  gameCatalog?: string[];        // 25 game titles from template
  genre?: string;                // "Adventure"
}
```

#### Type 6: Quality Rubric Annotation (Real S3 data)

```typescript
// src/remotion/compositions/type-6/types.ts

interface Type6Annotation {
  dimensions: Array<{
    name: string;                // "Cinematic", "Motion Quality", etc.
    rawValue: string;            // "not-cinematic", "good-motion", etc.
    numericScore: number;        // 0.2, 0.8, etc.
    color: string;               // red/orange/green
  }>;
  videoDescription: string;      // From metadata.video_description
  annotatorWatchedFull: boolean; // videoEndedAt >= video duration
}

// Mapping: "good-*" -> 0.8, "not-*" -> 0.2-0.3, "interesting" -> 0.7
```

#### Type 7: Safety Shield Annotation (Real S3 data)

```typescript
// src/remotion/compositions/type-7/types.ts

interface Type7Annotation {
  prompt: string;                           // From metadata.prompt (200+ words)
  textPolicyViolation: boolean;             // From generalData.text_policy_violation
  videoPolicyViolation: boolean;            // From generalData.video_policy_violation
  projectType: string;                      // "RED_TEAM_SAFETY_PROJECT_VIDEO_POLICY_REVIEW"
  reviewType: "single" | "dual-channel";    // dual-channel for cs-red-team
  policyRefs?: string[];                    // For sol-eu-ai-act: ["Art.52", "Art.6"]
}
```

#### Type 8: Cinematic Showcase Annotation (Gemini + metadata)

```typescript
// src/remotion/compositions/type-8/types.ts

interface Type8Annotation {
  category: string;              // "Travel & Exploration"
  subcategory: string;           // "Safari & Wildlife Tours"
  sceneDescription: string;      // Gemini-generated
  licensingType: string;         // "Cinematic Licensed Data"
  resolution: string;            // "3840x2160"
  clips?: Array<{                // For cs-egocentric cross-fade
    label: string;
    startFrame: number;
    endFrame: number;
  }>;
}
```

#### Legacy Type B: Quality Evaluation Annotation (kept for reference)

> **v2 note**: The old TypeBAnnotation with Gemini-generated dimension scores is no longer the primary schema. Type 2 now uses real annotation data. This schema is retained only for sol-rlhf which may use Gemini for supplementary quality dimension estimates.

```typescript
interface TypeBAnnotation {
  comparison: {
    videoA: { label: string; source: string };
    videoB: { label: string; source: string };
    winner: "A" | "B";
    rationale: string;
  };
  dimensions: Array<{
    name: string;          // e.g. "clarity", "motion_smoothness"
    scoreA: number;        // 0-10
    scoreB: number;        // 0-10
    description: string;
  }>;
  artifacts: Array<{
    timestamp_s: number;
    type: string;          // e.g. "flickering", "morphing", "temporal_inconsistency"
    severity: "low" | "medium" | "high";
    bbox?: [number, number, number, number];
  }>;
  overall: {
    preferenceStrength: "weak" | "moderate" | "strong";
    eloChange?: number;
  };
}
```

#### Legacy Type C: Safety Classification Annotation (kept for reference)

> **v2 note**: Replaced by Type 7 (SafetyShieldComposition) which uses real policy violation data. This Gemini-generated schema retained only if demonstration-mode moderation data is needed.

```typescript
// Legacy -- see Type 7 above for the real annotation schema
interface TypeCAnnotation {
  frames: TypeCFrame[];
  summary: {
    totalViolations: number;
    blockedCount: number;
    passedCount: number;
    topCategories: Array<{ category: string; count: number }>;
  };
}

interface TypeCFrame {
  timestamp_s: number;
  violations: Array<{
    category: string;        // e.g. "hate_speech", "violence", "sexual"
    severity: "low" | "medium" | "high" | "critical";
    confidence: number;      // 0-1
    policyRef?: string;      // e.g. "EU AI Act Art.52"
    bbox?: [number, number, number, number];
    description: string;
  }>;
  overallRisk: "safe" | "low" | "medium" | "high" | "critical";
  moderationDecision: "pass" | "flag" | "block";
}
```

#### Legacy Type D: Synchronization Annotation (removed in v2)

> **v2 note**: Type D removed. Pages formerly using Type D now use Type 5 (Classification Pipeline) for game/sim data, or Type 4 (Detection + Annotation) for identity matching.

```typescript
// Legacy -- removed in v2
interface TypeDAnnotation {
  streams: Array<{
    id: string;
    label: string;            // e.g. "Simulation", "Real World"
    totalFrames: number;
  }>;
  alignment: Array<{
    timestamp_s: number;
    streamCorrespondence: Array<{
      streamId: string;
      frameIndex: number;
    }>;
    latencyMs: number;
    syncScore: number;        // 0-1
  }>;
  pipeline: {
    throughputFps: number;
    totalProcessed: number;
    avgLatencyMs: number;
  };
  objectTracking?: Array<{
    objectId: string;
    label: string;
    segments: Array<{
      streamId: string;
      bbox: [number, number, number, number];
      timestamp_s: number;
    }>;
  }>;
}
```

### 4.3 Extended CaseStudy Type

The existing `CaseStudy` interface (from `src/types/case-study.ts`) needs a new optional field:

```typescript
// Addition to CaseStudy interface

interface CaseStudy {
  // ... existing fields ...

  /** Optional pre-rendered video composition config */
  videoComposition?: {
    /** Composition ID matching public/videos/{id}.mp4 */
    compositionId: string;
    /** Poster image path for loading state */
    posterImage?: string;
    /** Placement on the page */
    placement: "hero" | "inline" | "after-approach";
  };
}
```

---

## 5. Composition-to-Page Mapping

### 5.1 Solution Pages (11)

> **v2 update**: Types changed from A-E to 1-8. Annotation source column added. See PRD Appendix A for per-composition design specs.

| # | Slug | Type | Composition ID | S3 Dataset | Annotation Source | Duration |
|---|------|------|---------------|------------|-------------------|----------|
| 1 | `egocentric-video-data` | 1 | `sol-egocentric` | Egocentric Activity (eb07cf5b) | Gemini | 10s |
| 2 | `vla-training-data` | 1 | `sol-vla` | Egocentric Activity (eb07cf5b) | Gemini | 10s |
| 3 | `manipulation-trajectory-data` | 1 | `sol-manipulation` | Egocentric Activity (eb07cf5b) | Gemini | 10s |
| 4 | `teleoperation-data` | 1 | `sol-teleop` | Egocentric Activity (eb07cf5b) | Gemini | 10s |
| 5 | `video-generation-training-data` | 2 | `sol-video-gen` | Video Preference (bafc163f) | Real JSON | 12s |
| 6 | `expert-rlhf-annotation` | 2 | `sol-rlhf` | Video Preference (bafc163f) | Real JSON | 12s |
| 7 | `red-teaming-data` | 7 | `sol-red-teaming` | Content Safety (132debad) | Real JSON | 10s |
| 8 | `sim-to-real-data` | 5 | `sol-sim2real` | Game Environment (b2b542aa) | Real JSON | 10s |
| 9 | `open-datasets-vs-custom` | 8 | `sol-open-vs-custom` | Cinematic Action (b2d26fd9) | Gemini + metadata | 10s |
| 10 | `crowdsourced-vs-expert-rlhf` | 3 | `sol-crowd-vs-expert` | AI Image Eval (55f26c56) | Real JSON | 10s |
| 11 | `eu-ai-act-red-teaming` | 7 | `sol-eu-ai-act` | Content Safety (132debad) | Real JSON | 10s |

### 5.2 Case Study Pages (11)

| # | Slug | Type | Composition ID | S3 Dataset | Annotation Source | Duration |
|---|------|------|---------------|------------|-------------------|----------|
| 1 | `egocentric-video-collection` | 8 | `cs-egocentric` | Egocentric + Cinematic (eb07cf5b + b2d26fd9) | Gemini + metadata | 10s |
| 2 | `workplace-egocentric-data` | 1 | `cs-workplace` | Egocentric Activity (eb07cf5b) | Gemini | 10s |
| 3 | `fashion-ai-annotation` | 4 | `cs-fashion` | Product Image (f6bdb2f1) | Real JSON | 10s |
| 4 | `game-based-data-capture` | 5 | `cs-game-capture` | Game Environment (b2b542aa) | Real JSON | 12s |
| 5 | `generative-ai-safety` | 7 | `cs-gen-safety` | Content Safety (132debad) | Real JSON | 10s |
| 6 | `red-teaming-moderation` | 7 | `cs-red-team` | Content Safety (132debad) | Real JSON | 10s |
| 7 | `video-content-classification` | 5 | `cs-vid-classify` | Video Classification (ca2465cf) | Real JSON | 12s |
| 8 | `video-model-evaluation` | 2 | `cs-vid-eval` | Quality Parameters (a5f0c373) | Real JSON | 12s |
| 9 | `video-quality-at-scale` | 6 | `cs-vid-quality` | Video Quality (4bda56db) | Real JSON | 12s |
| 10 | `prompt-enhancement-benchmark` | 2 | `cs-prompt-bench` | Prompt Rankings (8689f381) | Real JSON | 12s |
| 11 | `object-identity-persistence` | 4 | `cs-object-id` | Object Identity (040fee50) | Real JSON | 10s |

---

## 6. Annotation Data Pipeline

> **v2 update**: The pipeline now has two paths: (1) `extract-annotations.ts` for Types 2-7 using real S3 annotation data, and (2) `gemini-enrich.ts` for Types 1 and 8 only where no annotation JSON exists.

### 6.0 Real Annotation Extraction (Types 2-7)

```typescript
// scripts/extract-annotations.ts (pseudocode)

import manifest from "./composition-manifest.json";

async function extractAnnotation(config: CompositionConfig) {
  if (config.annotationSource !== "real") return;

  // 1. Download S3 annotation JSON
  const rawAnnotation = await downloadAnnotationJson(config.s3AnnotationKey);

  // 2. Extract fields based on composition type
  const formatted = transformByType(config.type, rawAnnotation);
  // Type 2: { videoA, videoB, winner: rawAnnotation.generalData.betterVideoId, ... }
  // Type 3: { bestImage, selectedImages, generations, ... }
  // Type 4: { segments: rawAnnotation.generalData.segment, ... }
  // Type 5: { taxonomies: [{root, levels}], caption, ... }
  // Type 6: { dimensions: mapQualityValues(rawAnnotation.generalData), ... }
  // Type 7: { textPolicyViolation, videoPolicyViolation, prompt, ... }

  // 3. Validate against Zod schema
  const validated = TypeSchemas[config.type].parse(formatted);

  // 4. Write to public/remotion-assets/annotations/
  await fs.writeFile(
    `public/remotion-assets/annotations/${config.id}.json`,
    JSON.stringify(validated, null, 2)
  );
}
```

### 6.1 Gemini Enrichment (Types 1, 8 Only)

```typescript
// scripts/gemini-enrich.ts (pseudocode)

import { GoogleGenAI } from "@google/genai";
import manifest from "./composition-manifest.json";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function enrichComposition(config: CompositionConfig) {
  if (config.annotationSource !== "gemini") return; // Only Types 1, 8

  // 1. Extract frames with ffmpeg
  const frames = await extractFrames(
    `tmp/samples/${config.id}/`,
    config.enrichment.framesPerSecond,
    config.enrichment.maxFrames
  );

  // 2. Load prompt template
  const promptTemplate = await fs.readFile(config.enrichment.promptFile, "utf-8");

  // 3. Send frames to Gemini with structured output
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: promptTemplate },
          ...frames.map(f => ({
            inlineData: { mimeType: "image/jpeg", data: f.base64 }
          })),
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  // 4. Parse and validate response
  const annotation = JSON.parse(response.text());

  // 5. Write to public/remotion-assets/annotations/
  await fs.writeFile(
    `public/remotion-assets/annotations/${config.id}.json`,
    JSON.stringify(annotation, null, 2)
  );
}

// Process all compositions with rate limiting (3 concurrent, 1s delay)
async function main() {
  const queue = manifest.compositions.filter(c => c.enrichment !== null);
  await processWithConcurrency(queue, 3, enrichComposition, 1000);
}
```

### 6.2 Gemini Prompt Templates

> **v2 note**: Only Type 1 needs a Gemini prompt. Types 2-7 use real annotation data. Type 8 uses a simple scene description prompt (not documented here as it's a basic "describe this scene" instruction).

#### Type 1: Sensor-Fusion Prompt (only required Gemini prompt)

```
You are an expert egocentric video annotator for robotics training data.

Analyze these sequential video frames (extracted at {fps}fps from an egocentric camera).

For EACH frame, provide a JSON object with:
- timestamp_s: estimated time in seconds
- manipulation_phase: one of [idle, approach, contact, grasp, transport, place, pour, stir, release]
- task_step: natural language description of current action
- task_pct: estimated task completion percentage (0-100)
- hands: array of detected hands, each with:
  - side: "left" or "right"
  - bbox: [x1, y1, x2, y2] normalized to [0,1]
  - action: current hand action
  - holding: object being held (null if empty)
  - finger_state: grip type (pinch, power, precision, open)
  - force_estimate_N: estimated force in Newtons
  - velocity_ms: estimated hand velocity m/s
  - wrist_pose: {x, y, z_depth_est} relative coordinates
- objects: array of visible objects, each with:
  - label: object name
  - bbox: [x1, y1, x2, y2] normalized
  - affordance: primary affordance
  - interacting: boolean
  - state: current object state
  - fill_level_pct: if container, fill percentage
  - pose_6dof: {roll, pitch, yaw} in degrees
- spatial: {camera_height_est_m, camera_pitch_deg, workspace_depth_m, dominant_hand_distance_m}
- imu_estimate: {head_angular_vel_dps: {x,y,z}, linear_accel_ms2: {x,y,z}, head_stable: bool}
- scene: {lighting_lux_est, clutter_level, surface_material}

Return a JSON array of frame annotations. Ensure bounding boxes are smooth between consecutive frames.
```

#### Legacy Type B-D Prompts (removed in v2)

> **v2 note**: Types B, C, and D prompts are no longer needed. Type 2 (Pairwise Arena) uses real betterVideoId/selectedAnswer from annotation JSONs. Type 7 (Safety Shield) uses real text_policy_violation/video_policy_violation. Type 5 (Classification) uses real category/subcategory. No Gemini generation needed for these.

### 6.3 Frame Extraction

```typescript
// Utility function in gemini-enrich.ts

async function extractFrames(
  videoDir: string,
  fps: number,
  maxFrames: number
): Promise<Array<{ path: string; base64: string; timestampS: number }>> {
  const videoFile = glob.sync(`${videoDir}/*.mp4`)[0];
  const outputDir = `tmp/frames/${path.basename(videoDir)}`;
  await fs.mkdir(outputDir, { recursive: true });

  // ffmpeg: extract at specified fps, resize to 512px width for Gemini
  await exec(
    `ffmpeg -i "${videoFile}" -vf "fps=${fps},scale=512:-1" -q:v 2 "${outputDir}/frame_%04d.jpg"`
  );

  const framePaths = glob.sync(`${outputDir}/frame_*.jpg`).slice(0, maxFrames);
  return Promise.all(
    framePaths.map(async (p, i) => ({
      path: p,
      base64: (await fs.readFile(p)).toString("base64"),
      timestampS: i / fps,
    }))
  );
}
```

---

## 7. Render Pipeline

### 7.1 Remotion Root Registration

The existing `Root.tsx` registers only `EgocentricPipeline`. It needs to register all 22 compositions:

```typescript
// src/remotion/Root.tsx

import { Composition } from "remotion";
import manifest from "../../scripts/composition-manifest.json";

// Dynamic imports for each type
import AnnotationDemoComposition from "./compositions/type-a/AnnotationDemoComposition";
import QualityComparisonComposition from "./compositions/type-b/QualityComparisonComposition";
import SafetyPipelineComposition from "./compositions/type-c/SafetyPipelineComposition";
import SyncVisualizationComposition from "./compositions/type-d/SyncVisualizationComposition";
import ComparisonChartComposition from "./compositions/type-e/ComparisonChartComposition";
import MetricCounterComposition from "./compositions/type-e/MetricCounterComposition";
import TimelineComposition from "./compositions/type-e/TimelineComposition";

const TYPE_MAP = {
  A: AnnotationDemoComposition,
  B: QualityComparisonComposition,
  C: SafetyPipelineComposition,
  D: SyncVisualizationComposition,
  E: ComparisonChartComposition, // Default E; sub-types handled via inputProps
};

export const RemotionRoot: React.FC = () => (
  <>
    {manifest.compositions.map((config) => (
      <Composition
        key={config.id}
        id={config.id}
        component={TYPE_MAP[config.type]}
        durationInFrames={config.render.durationFrames}
        fps={config.render.fps}
        width={config.render.width}
        height={config.render.height}
        defaultProps={{ compositionId: config.id }}
      />
    ))}
  </>
);
```

### 7.2 Batch Render Script

```typescript
// scripts/render-all.ts

import { execSync } from "child_process";
import manifest from "./composition-manifest.json";

const CONCURRENCY = 2; // Parallel renders (CPU-bound)

async function renderComposition(config: CompositionConfig) {
  const outPath = `public/videos/${config.id}.mp4`;

  console.log(`Rendering ${config.id} → ${outPath}`);

  execSync(
    `npx remotion render src/remotion/index.ts ${config.id} ${outPath} ` +
    `--codec h264 ` +
    `--crf 23 ` +          // Good quality/size balance
    `--props '${JSON.stringify({ compositionId: config.id })}'`,
    { stdio: "inherit" }
  );

  // Verify file size
  const stats = await fs.stat(outPath);
  const sizeMB = stats.size / (1024 * 1024);
  if (sizeMB > 10) {
    console.warn(`WARNING: ${config.id} is ${sizeMB.toFixed(1)} MB (target: < 10 MB)`);
  }
}

async function main() {
  // Render in batches
  for (let i = 0; i < manifest.compositions.length; i += CONCURRENCY) {
    const batch = manifest.compositions.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(renderComposition));
  }
}
```

### 7.3 npm Scripts

```json
{
  "scripts": {
    "remotion:studio": "remotion studio src/remotion/index.ts",
    "remotion:download": "tsx scripts/download-samples.ts",
    "remotion:enrich": "tsx scripts/gemini-enrich.ts",
    "remotion:render": "tsx scripts/render-all.ts",
    "remotion:pipeline": "npm run remotion:download && npm run remotion:enrich && npm run remotion:render"
  }
}
```

---

## 8. Case Study Page Redesign

### 8.1 Current Page Structure

Based on the existing `CaseStudyDetailClient.tsx` (636 lines), the current section order is:

1. Breadcrumbs
2. Hero (category badge + title + headline stat)
3. Quick Summary (terminal callout)
4. Snapshot Bar (4 stat cards)
5. Challenge
6. Our Approach + ProcessFlow
7. Results
8. Impact
9. Sample Data (optional)
10. Service Used (pillar link)
11. Related Case Studies
12. FAQ
13. CTA

### 8.2 Redesigned Page Structure

The updated page inserts the video hero and enhances existing sections:

1. Breadcrumbs (unchanged)
2. **NEW: Video Hero** -- full-width pre-rendered composition
3. Hero text (category badge + title + headline stat) -- moved below video
4. Quick Summary (unchanged)
5. **ENHANCED: Snapshot Bar** -- now uses `AnimatedMetrics` with counter animation
6. Challenge (unchanged)
7. **ENHANCED: Our Approach** -- uses `ProcessTimeline` instead of `ProcessFlow`
8. Results (unchanged)
9. Impact (unchanged)
10. Sample Data (unchanged)
11. Service Used (unchanged)
12. Related Case Studies (unchanged)
13. FAQ (unchanged)
14. CTA (unchanged)

### 8.3 CaseStudyDetailClient Changes

The modifications to `CaseStudyDetailClient.tsx` are minimal:

1. **Add `videoComposition` to props** (from extended CaseStudy type)
2. **Insert VideoHero** between breadcrumbs and hero text sections
3. **Replace snapshot stats grid** with `<AnimatedMetrics>` component
4. **Replace `<ProcessFlow>`** with `<ProcessTimeline>`

```typescript
// Updated interface
interface CaseStudyDetailClientProps {
  caseStudy: CaseStudy;
  categoryLabel: string;
  relatedCaseStudies: CaseStudy[];
}

// In the render, after breadcrumbs and before hero text:
{cs.videoComposition && (
  <section className="pb-4">
    <div className="container">
      <VideoHero
        videoSrc={`/videos/${cs.videoComposition.compositionId}.mp4`}
        badge={categoryLabel}
      />
    </div>
  </section>
)}
```

**Design decision**: Rather than a full rewrite of `CaseStudyDetailClient.tsx`, the changes are additive. The video hero is conditionally rendered only when `videoComposition` is present in the case study data. This means pages without video compositions continue to work unchanged, and the feature can be rolled out incrementally per case study.

### 8.4 Solution Page Integration

Solution pages use `ContentPageTemplate.tsx`. The video hero integrates by adding an optional `videoSrc` field to `ContentPageData` and rendering `VideoHero` inside `ContentPageTemplate` before or after the existing `ContentHero`.

```typescript
// In ContentPageTemplate.tsx, after ContentHero:
{page.videoSrc && (
  <div className="container max-w-6xl mx-auto px-4 -mt-8 mb-12">
    <VideoHero videoSrc={page.videoSrc} />
  </div>
)}
```

---

## 9. Error Handling

### 9.1 Build Pipeline Errors

| Error | Handling | Recovery |
|-------|----------|----------|
| S3 download failure | Retry 3x with exponential backoff; skip composition if all retries fail | Script continues with remaining compositions; generates report of skipped items |
| ffmpeg not installed | Check at script start, exit with clear error message and install instructions | N/A -- hard prerequisite |
| Gemini API rate limit | Exponential backoff starting at 2s; max 5 retries per composition | Queue remaining compositions for retry at end of batch |
| Gemini returns invalid JSON | Retry with stricter prompt; fall back to existing annotation JSON if available | Log warning; use fallback or skip |
| Gemini returns empty/partial response | Validate all required fields; retry if < 50% of expected frames annotated | Pad with interpolated data from available frames |
| Remotion render failure | Capture stderr; retry once; skip if second attempt fails | Report composition ID for manual investigation |
| MP4 exceeds 10 MB | Re-render with `--crf 28` (lower quality); if still over, compress with ffmpeg | Warn in output; cap at 15 MB absolute maximum |

### 9.2 Runtime Errors

| Error | Handling |
|-------|----------|
| Video file missing (404) | `VideoHero` renders nothing (graceful degradation); page works without video |
| Video fails to load | `<video>` shows poster image fallback; `onError` handler hides the video element |
| Video causes layout shift | Fixed aspect ratio container (`aspect-video`) prevents CLS |
| User has autoplay blocked | `muted` attribute ensures autoplay works in all browsers; `playsInline` for iOS |

### 9.3 Validation

The `gemini-enrich.ts` script validates every annotation JSON against the TypeScript schema using a Zod runtime validator before writing to disk:

```typescript
// Example for Type A
const TypeAFrameSchema = z.object({
  timestamp_s: z.number(),
  manipulation_phase: z.string(),
  task_step: z.string(),
  task_pct: z.number().min(0).max(100),
  hands: z.array(z.object({
    side: z.enum(["left", "right"]),
    bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    action: z.string(),
    holding: z.string().nullable(),
  })),
  objects: z.array(z.object({
    label: z.string(),
    bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    affordance: z.string(),
    interacting: z.boolean(),
  })),
});
```

---

## 10. Testing Strategy

### 10.1 Unit Tests

| Component | Test Focus | Tool |
|-----------|-----------|------|
| `BoundingBox` | Correct positioning from normalized coords, label rendering | Vitest + React Testing Library |
| `MetadataPanel` | Section rendering, row display, visibility toggle | Vitest + RTL |
| `DesignTokens` | Export shape matches expected structure | Vitest type test |
| Annotation schemas | Zod schema validates sample JSON correctly | Vitest |
| `interpolateKeyframes()` | Smooth interpolation between adjacent frames | Vitest |
| `AnimatedMetrics` | Renders correct number of metric cards | Vitest + RTL |
| `VideoHero` | Renders video element with correct attributes | Vitest + RTL |

### 10.2 Integration Tests

| Test | Description | Tool |
|------|-------------|------|
| Composition render smoke test | Render each composition type for 1 frame, verify no crashes | Remotion `renderStill` API |
| Manifest validation | All 22 compositions in manifest have valid config, matching prompt files | Vitest |
| Annotation JSON integrity | All JSON files in `annotations/` pass Zod validation | Vitest |
| Page with video | Case study page renders with VideoHero when videoComposition is set | Playwright |
| Page without video | Case study page renders normally when videoComposition is absent | Playwright |

### 10.3 Visual / E2E Tests

| Test | Description | Tool |
|------|-------------|------|
| Composition screenshot comparison | Render frame 0, mid, and final frame; compare against baseline | Remotion `renderStill` + Playwright screenshot diff |
| Case study page with video hero | Full-page screenshot comparison | Playwright |
| Mobile viewport | VideoHero responsive behavior at 375px, 768px, 1024px | Playwright |
| Video autoplay | Verify video plays on page load (muted + playsInline) | Playwright `page.waitForFunction` checking `.paused === false` |

### 10.4 Performance Tests

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s with video hero | Lighthouse CI |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse CI |
| Total MP4 size per page | < 10 MB | Build script validation |
| Total `public/videos/` size | < 220 MB | CI check |
| Video start time | < 1s on 4G | WebPageTest |

### 10.5 Pipeline Tests

| Test | Description |
|------|-------------|
| `download-samples.ts` dry run | Verify manifest sample IDs resolve to real S3 keys (no actual download) |
| `gemini-enrich.ts` single composition | Run enrichment for one composition end-to-end |
| `render-all.ts` single composition | Render one composition, verify MP4 output |
| Full pipeline | Run `remotion:pipeline` and verify all 22 MP4s + 19 annotation JSONs exist |

---

## Appendix A: Implementation Phases

### Phase 1: Foundation (Days 1-3)
- Extract shared components from `EgocentricPipeline.tsx` (BoundingBox, MetadataPanel, DesignTokens)
- Create `composition-manifest.json` with all 22 entries
- Implement `VideoHero` component
- Wire up one Type A composition end-to-end (download, enrich, render, embed)

### Phase 2: All Composition Types (Days 4-7)
- Implement Type B, C, D, E composition templates
- Write all 4 Gemini prompt templates
- Implement `gemini-enrich.ts` with rate limiting and validation
- Implement `render-all.ts` batch renderer

### Phase 3: Page Integration (Days 8-10)
- Implement `AnimatedMetrics` and `ProcessTimeline` components
- Update `CaseStudyDetailClient.tsx` with video hero support
- Update `ContentPageTemplate.tsx` with video hero support
- Add `videoComposition` fields to case study JSON files

### Phase 4: Polish and QA (Days 11-13)
- Render all 22 compositions
- Optimize MP4 file sizes (CRF tuning, resolution adjustments)
- Visual QA on all 22 pages
- Performance testing (Lighthouse, WebPageTest)
- Write unit and integration tests

### Phase 5: Deploy (Day 14)
- Commit MP4s to repo (or upload to S3 if over Vercel limit)
- Deploy to Vercel preview
- Stakeholder review
- Production deploy
