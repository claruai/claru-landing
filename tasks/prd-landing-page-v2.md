# PRD: Claru Landing Page V2

## Overview

Reposition claru.ai from "end-to-end data pipeline service provider" to "the training data catalog for physical AI." The new landing page leads with the data itself — browsable datasets, video clips with enrichment overlays, and a global collection network — not with services or team descriptions.

**Route:** `/v2` (local dev only, parallel to existing `/` page) **Branch:** `landing-page-v2`**Design system:** Evolve existing dark theme (keep `#0a0908`, `#92B090`, JetBrains Mono, Geist Sans, terminal chrome) but replace ASCII canvas with rich media content.

---

## Target Audience

- Robotics foundation model teams (Physical Intelligence, Skild, Covariant-class)
- World model researchers (NVIDIA Cosmos-scale, World Labs)
- Autonomous vehicle / drone companies
- Embodied AI startups (YC-stage through Series B)
- Research labs needing real-world training data

---

## Positioning

**Identity:** "The training data catalog for physical AI." **Wedge:** Real-world data that transfers. Not synthetic approximations. Not internet scrapes. **Mechanism:** Global collection network + FAL-powered enrichment pipeline + gaming platform. **Proof:** 3.7M+ annotations, 25+ datasets, 8 modalities — shown, not claimed.

---

## Competitive Context

### Established players

- **Scale AI** ($15B): Owns "volume + infrastructure." 100K production hours. We counter with annotation depth + browse-ability.
- **Cortex AI** (YC, $6M seed): Marketplace for egocentric + workplace data. We have richer catalog + enrichment pipeline + gaming data.
- **Sensei Robotics** (YC): Cheap teleoperation hardware ($300 vs $40K). We're multi-modal, not just manipulation trajectories.
- **NVIDIA synthetic** (Cosmos/Omniverse): Sim-to-real gap. We provide the real-world data that bridges it.
- **Hugging Face/open**: Free but limited. We're curated, annotated, commercially licensed.

### Recent launches (March 2026)

- **Human Archive** (YC W26, $500K): "Archive the world for embodied intelligence." Two datasets: HA-Multi (vision + stereo depth + tactile gloves + body IMU + wrist cameras) and HA-Ego (mono RGB + annotations). Claims 8,000 hrs/day capacity, 1,000+ custom rigs, 50K+ contributors, 125+ national partnerships. Stanford/Berkeley dropouts who moved to Asia for collection. **Hero: 8-tile video grid showing modalities in action — the boldest visual approach of the new entrants.** Dark theme, pure black. **Key differentiator:** tactile + force data (gloves). **Weakness:** no enrichment pipeline, no gaming data, no catalog browse experience, unproven at scale.
- **Asimov** (YC W26, $500K): "On-demand human intelligence for robots." Ex-Scale AI + USAF team (Berkeley undergrads). Passive collection: people wear phone-on-headband during daily activities, get paid $5-30/hr. 5,000+ contributors across 3 continents. Privacy-first (no audio, faces auto-blurred). Dark navy `#0D1117`, cyan accent, sparse text-forward design. **Key differentiator:** passive daily-life collection (vs directed teleoperation), zero-cost for businesses hosting collectors. **Weakness:** founders still in school, no named customers, narrow focus (human motion only), no catalog.
- **Luel AI** (YC W26, $500K): "The Marketplace for Multimodal Data." Two-sided marketplace: creators upload video/audio/voice, enterprises buy rights-cleared datasets. Niche collections (gemstone manufacturing, patient-doctor conversations from South Asia). Light theme with blue accent, animated floating data tags. Angel investors from xAI, Meta, Apple. **Key differentiator:** rights-clearance rigor, bespoke edge-case data, marketplace compounds over time. **Weakness:** generalist (not physical AI specific), 2-person team, no enrichment pipeline.

### Claru's unique position

Nobody combines all four: (1) browsable data catalog, (2) global collection network for custom data, (3) AI enrichment pipeline (depth, pose, segmentation), (4) gaming platform. Human Archive has the best sensor suite. Asimov has the tightest vertical integration. Luel has the rights-clearance story. Scale has the volume. **Claru owns the "browse real data with enrichment overlays" intersection.**

**Positioning note:** The "human intelligence" framing is now crowded. Asimov's tagline is literally "on-demand human intelligence for robots." Human Archive is "archiving the world." Claru's current V1 tagline "Expert Human Intelligence for AI Labs" sits in this same space. V2 must shift away from the human/intelligence framing toward the **data catalog** framing. We're not selling people. We're selling the data those people already collected, enriched, and made model-ready.

**Rights clearance:** Luel is making compliance their headline. V2 should include a visible signal about data licensing and rights (even one line in the hero or catalog section) to preempt this becoming a differentiator against us.

---

## Design Principles

1. **"Restraint plus one deliberate bet"** — Our bet: real data as the visual medium. Every section's primary visual is actual data output (video clips, depth maps, pose skeletons, segmentation masks).
2. **Terminal chrome as UI frame** — Monospace labels, `//` section markers, ASCII corner decorations, sage green accent. The terminal is the interface; the data inside it is vivid.
3. **Specificity over superlatives** — No vague claims ("at scale", "diverse", "revolutionary"). Every number is real and qualified by domain. Run `/humanizer` and `/stop-slop` on all copy before shipping.
4. **Engineer audience** — Monospace section labels signal technical fluency. Specific non-round numbers. Falsifiable claims. Show the data, don't describe it.
5. **OKLCH color space** — Add 0.01 chroma of sage green to all neutrals for cohesion. Use `oklch()` for all neutral colors in the design system.
6. **Real assets first, generated assets to fill gaps** — Use actual clips from our 3.7M annotation catalog wherever possible. Only generate via FAL for categories where we genuinely lack footage (robotic arm demos, specific warehouse scenes). A page about real-world data must show real-world data.
7. **Accessibility** — `prefers-reduced-motion` fallbacks for all animations. Video format fallbacks (H.264 for all browsers, H.265 for Safari). Alt text on all enrichment overlays. Keyboard-navigable enrichment demo.

---

## Design System Evolution

### Keep from V1

- Background: `#0a0908`
- Accent: `#92B090` (sage green)
- Fonts: JetBrains Mono (labels, stats, terminal), Geist Sans (headlines, body)
- `//` section markers, corner ASCII decorations
- Card design with subtle borders + hover glow
- Animation stack: Framer Motion, GSAP ScrollTrigger, Lenis

### Add for V2

- **Enrichment colors:** Cool blue `#4A9EDE` (depth maps), warm orange `#DE8A4A` (pose skeletons), soft purple `#9E6ADE` (segmentation) — real data viz conventions
- **Video thumbnails** as first-class card content (looping, muted, `object-fit: cover`)
- **COBE globe** (`cobe` package, 5KB WebGL) for collection network visualization
- **Dot grid background** replacing ASCII canvas (less noisy, lets media breathe)
- **OKLCH neutrals** with 0.01 sage chroma

### Remove from V1

- ASCII canvas background (too noisy for video content)
- Particle field in hero
- Magnetic cursor effect (distracting with rich media)

---

## Page Architecture

### Section 1: Hero

**Label:** (none — hero is label-free)

**Layout:** Full-viewport cinematic. Text centered or left-aligned over video background.

**Visual treatment — Full-bleed looping video hero:** A muted, autoplay looping video montage (10-12 sec, 720p, &lt;1.5MB) showing the breadth of Claru's data. **Lead with the most robotics-legible footage:**

- Robot arm: manipulation task close-up (FIRST — immediately signals "this is for robotics")
- Warehouse: forklift navigating shelves
- Road: dashcam driving footage
- Game: 3D game environment fly-through

Each clip is 3-4 seconds, cross-dissolving into the next. Dark gradient overlay from top (`from-black/80 via-black/40 to-transparent`) ensures text readability. The video IS the product — showing buyers exactly what kind of data exists.

**Visual enhancement:** Consider using the `shaders` library to composite a subtle `<DotGrid>` or `<Grid>` shader over the video (low opacity, sage green) to maintain the terminal aesthetic while the video plays underneath. This bridges the V1 ASCII aesthetic with the V2 media-forward approach. Additionally, the headline text could use a `TextScramble` or per-character reveal animation (via Fancy Components `@fancy/text-scramble`) on page load — characters scramble then resolve, echoing the V1 text scramble effect.

**Decision: Pre-encoded MP4, not Remotion.** A `<video>` element with a pre-encoded montage achieves the same visual result at zero JS cost. Remotion adds \~150KB gzipped to the bundle and hurts LCP. Reserve Remotion for the enrichment pipeline demo (Section 5) where runtime interactivity is needed.

**Asset priority:** Use real clips from the existing catalog (egocentric activity \~386K clips, game environment \~66K, traffic data) as the primary sources. Generate via FAL only for robotic arm scenes where we lack footage. Compress hero montage to &lt;1.5MB (H.264 baseline, 720p, CRF 28-30).

**Content:**

- Headline: "The training data catalog for physical AI." (Geist Sans, white, \~72px desktop / 40px mobile, bold)
- Sub: "Curated video datasets with depth, pose, and segmentation — built for robotics and embodied AI teams. Download, load, train." (Geist Sans, white/80, \~20px desktop / 16px mobile)
- Stats bar (monospace, sage green): `3.7M+ annotations across kitchens, warehouses, roads, and game environments · 25+ licensed datasets · Depth + pose + segmentation on every clip`
- Trust signal (small monospace, white/60): `Commercially licensed. Not scraped. Not synthetic.`
- CTAs: "Browse the Catalog" (primary, sage green fill) + "Request Custom Collection" (ghost outline)

**Background:** Video loop with dark gradient overlay on `#0a0908`. No ASCII canvas, no particle field, no globe (globe moves to Section 6).

---

### Section 2: The Data Gap

**Label:** `// THE DATA GAP`

**Layout:** Full-width visual split, scroll-driven transition.

**Left half — "What's out there":**

- Composite of degraded visuals with aggressive visual treatment:
  - Blurry scraped thumbnails with visible compression artifacts and watermarks
  - Synthetic renders with obvious uncanny-valley lighting
  - Tiny academic dataset crops at pixelated resolution
  - Apply CSS filters: `grayscale(50%) brightness(0.6) contrast(0.8)` + consider using the `shaders` library `<Glitch>` or `<CRTScreen>` effect for a "broken data" feel
- Labels: "Internet scrapes", "Synthetic renders", "Academic datasets", "Open datasets" in monospace with muted red tint `rgba(255,100,100,0.6)`
- One-liner below: "Open datasets get you started. Production models need purpose-collected, commercially licensed data with consistent enrichment across every clip."

**Right half — "What your model needs":**

- 2x2 grid of the SAME egocentric scene shown four ways:
  1. Raw video frame (kitchen, hands reaching for objects)
  2. Depth map overlay (blue-purple gradient via Depth Anything)
  3. Pose skeleton overlay (green/orange joints via DWPose)
  4. Segmentation masks (colored object outlines via SAM2)

**Scroll behavior (GSAP ScrollTrigger):** Pin the section with `anticipatePin: 1` and explicit end: `end: "+=150vh"`. From scroll 0-40%: both halves visible. From 40-60%: left fades. From 60-100%: right expands. Unpin at 100%. Use the Lenis ticker integration (NOT `scrollerProxy()`). Call `ScrollTrigger.refresh()` on `resize` and `orientationchange` for iOS Safari address bar changes.

**Assets (generated via FAL):**

- Generate egocentric kitchen scene with FLUX.2 Pro + Realism LoRA
- Animate with Wan 2.2 image-to-video (5 sec clip)
- Process through Depth Anything Video, DWPose Video, SAM2 Video
- Extract best frame for the 2x2 composite

---

**SECTION ORDER (canonical, matches Story 0):**

1. Hero → 2. Data Gap → 3. Three Modes → 4. Catalog Showcase → 5. Enrichment Pipeline → 6. Collection Network → 7. Game Capture → 8. Why Claru → 9. Social Proof → 10. Final CTA

*Note: The section descriptions below retain their original numbering for reference stability. The CANONICAL order above is what gets built.*

### Section 3 (build position 4): Catalog Showcase

**Label:** `// DATA CATALOG`

**Layout: GSAP Stacked Cards.** Full-width pinned cards that stack on scroll. Each card = one dataset category. As you scroll, the current card scales down slightly (`scale: 1 - (cards.length - index) * 0.025`) and the next card slides over it. Metrics count-up animate when a card becomes the top card. "View Dataset →" CTA visible only on the active top card. Uses existing GSAP ScrollTrigger (`pin: true, pinSpacing: false`). Test on iOS Safari early (known scroll position issues with pinning).

**6 cards** (not 8 — stacked cards become tedious past 6 scrolls, and 6 covers core categories with a "View all 25+" CTA at the end):

**Dataset cards:**

- Looping video thumbnail (3-5 sec, muted, autoplay)
- Dataset name (Geist Sans bold)
- Annotation count (monospace, sage green) — count-up animation on scroll entry
- Modality badges (small pills)
- Hover: card lifts, border glows sage green, reveals 1-line description + "View samples →"

**Datasets to show (real clips first, FAL-generated only where needed):**

1. Egocentric Activity Capture (\~386K clips) — REAL clips from catalog
2. Game Environment Capture (\~66K clips) — REAL game footage
3. Video Quality Annotations (\~976K assessments) — REAL clips from catalog
4. Object Identity Tracking (\~1.07M verifications) — REAL clips from catalog
5. Traffic & Driving Data — REAL if available, FAL-generated if not
6. Robotic Arm Demonstrations — FAL-generated (we lack this footage)

**CTA:** "View all 25+ datasets →" (links to public catalog page at `/catalog`)

**Note on** `/catalog` **route:** Build a lightweight public catalog page showing dataset cards with 2-3 preview clips each, annotation counts, and modality tags. Gate full dataset access (all samples, download) behind email capture. This is the most important conversion path on the page — the "Browse the Catalog" CTA must not hit a login wall.

---

### Section 4: Three Modes

**Label:** `// HOW IT WORKS`

**Layout:** Three-column cards. Clean, no heavy animation. Contrast to rich media sections.

**Mode 1: Browse & Buy**

- Icon: catalog/grid icon
- "Off-the-shelf datasets. Browse the catalog, preview samples, license what you need."
- Items: Pre-annotated datasets, Multiple modalities, Non-exclusive licensing, Preview samples before committing
- CTA: "Browse Catalog" → links to `/catalog` (public, email-gated for full access)

**Mode 2: Commission Collection**

- Icon: globe/network icon
- "Tell us what you need. Our global workforce captures it in real environments."
- Items: Custom scenarios & environments, Residential + commercial locations, Multi-device capture rigs, Your spec, our logistics
- CTA: "Describe Your Dataset"

**Mode 3: Enrich Your Data**

- Icon: pipeline/layers icon
- "Bring your raw footage. We add depth, pose, segmentation, and captions."
- Items: Depth estimation (Depth Anything), Pose detection (DWPose), Object segmentation (SAM2), AI-assisted captioning
- CTA: "Learn About Enrichment" → scrolls to Section 5 enrichment demo (no self-serve upload exists yet)

---

### Section 5: Enrichment Pipeline

**Label:** `// ENRICHMENT PIPELINE`

**Layout:** Horizontal pipeline visualization + video frame below.

**Pipeline nodes:** `Raw Video` → `Depth Estimation` → `Pose Detection` → `Segmentation` → `Captioning` → `Model-Ready`

**Interaction — Before/after slider with pipeline labels:**

The pipeline nodes above act as position markers/labels. The primary interaction is a drag slider on the video frame below. As the slider moves left-to-right, enrichment layers reveal progressively. The corresponding pipeline node highlights (sage green glow) to show which processing step is active at the current slider position. On mobile, the slider is touch-draggable.

**Before/after slider:** A CSS `clip-path: inset()` slider on a single frame. Drag left-to-right to reveal enrichment layers progressively:

- Left edge: raw video frame
- 25%: depth map overlay (blue `#4A9EDE`)
- 50%: pose skeleton (orange `#DE8A4A`)
- 75%: segmentation masks (purple `#9E6ADE`)
- 100%: all overlays + caption text below frame

Implementation: Pre-render each overlay layer as a transparent PNG from FAL output. Stack as absolute-positioned images. A `<input type="range">` drives `clip-path: inset(0 ${100 - value}% 0 0)` on each layer. Zero backend. No competitor in the physical AI data space has this pattern.

**All overlays pre-generated via FAL** but animated as if real-time. The demo shows the actual enrichment pipeline we offer.

---

### Section 6: Collection Network

**Label:** `// GLOBAL COLLECTION`

**Layout:** Two-part section. Top: COBE globe (full-width, \~500px height). Bottom: environment type grid (2x3).

**COBE Globe — visualizing the global collection network:**

- `dark: 1`, sage green markers at collection locations, slow auto-rotation (`phi += 0.003`)
- Globe config: `baseColor: [0.04, 0.04, 0.03]`, `markerColor: [0.57, 0.69, 0.56]`, `glowColor: [0.2, 0.25, 0.2]`, `mapBrightness: 2`
- Cap `mapSamples` at 8000 on mobile (16000 on desktop) to manage GPU memory
- **MVP: markers only, no arcs or floating labels.** COBE does not natively support arcs or CSS anchor positioning. Static labels positioned around the globe (not rotation-anchored) with collection type names.
- **Follow-up enhancement (post-MVP):** Custom lat/lng-to-screen projection for rotation-anchored labels + arc rendering via SVG overlay. This requires \~100 lines of trigonometry.
- Destroy WebGL context on unmount (`globe.destroy()`)

**Environment type grid (2x3)**:Cards (photo/generated image + monospace label):

- Residential Kitchens
- Industrial Warehouses
- Public Roads & Traffic
- Office Environments
- Game Studios
- Retail Spaces

**Stats bar:** Real numbers only. If we don't have confirmed country/collector counts, omit the stats bar and let the environment grid + globe speak for itself. Do not use placeholder numbers on a page about real data.

**Copy:** "We collect where your robots will operate. Suburban kitchens. Factory floors. City streets. Not lab environments — real ones."

---

### Section 7: Game Capture Platform

**Label:** `// GAME CAPTURE`

**Layout:** Full-bleed background (real game footage from our \~66K clip catalog) with dark gradient overlay. Split content.

**Left:** Real game environment clip (looping, from existing game capture data) **Right:** Extracted training data shown as a 2x2 mini-grid:

1. RGB frame from game
2. Depth buffer (pixel-perfect, engine-native)
3. Object instance IDs (color-coded per object)
4. Physics state overlay (velocity vectors, collision bounds)

**Copy:** "Game engines generate pixel-perfect labels with zero manual annotation. Depth buffers, object IDs, physics state."

**Visual treatment:** The split should feel like a before/after transformation. Left side plays the raw game footage as a looping video. Right side shows the same footage but with the extracted training data overlaid — depth buffer in blue, object instance IDs as colored outlines, velocity vectors as animated arrows. Use Framer Motion `AnimatePresence` to toggle between the raw and annotated views on a 4-second timer, creating a continuous "see the data" loop.

**Stats (real numbers from catalog):** `~66K game environment clips · Pixel-perfect ground truth · Zero manual annotation`

**Unique differentiator callout:** Below the split, a single line in sage green monospace: `No competitor offers game environment training data. This is unique to Claru.`

**Why this section earns its place:** Game capture data is genuinely unique to Claru. No competitor (Scale, Cortex, Sensei, Human Archive, Asimov, Luel) offers it. The bridge to physical AI: game environments provide diverse scenarios with perfect ground truth at a fraction of the cost of real-world collection. Robotics labs use game data for sim-to-real pretraining.

---

### Section 8: Social Proof

**Label:** `// PROOF OF WORK`

**Layout:** Metrics module + horizontal scroll testimonials (keep from V1).

**Metrics (large monospace numbers) — reframed as buyer-relevant outcomes, not internal process stats:**

- 3.7M+ expert annotations on real-world physical environments
- 97.3% inter-annotator agreement (if we have this number — otherwise use a real quality metric)
- 25+ commercially licensed production datasets
- 8 modalities: egocentric video, game environments, traffic, workplace, robotics, cinematic, object tracking, content safety

**Testimonials:** Keep V1's four testimonial cards. Reframe quotes around data quality outcomes: "X% improvement in model accuracy", "cut our data pipeline from 3 months to 3 weeks", etc. If we don't have these quotes yet, use the existing ones but add a dataset-specific proof point to each card.

---

### Section 8.5: Why Claru (competitive comparison)

**Label:** `// WHY CLARU`

**Layout:** Simple 4-column comparison row showing the four-pillar advantage:

| Capability | Claru | Scale AI | Cortex | Open (HF) |
| --- | --- | --- | --- | --- |
| Browsable catalog | Yes | No | Limited | Yes (limited) |
| Enrichment (depth, pose, seg) | On every clip | Per-project | No | No |
| Custom collection | Global network | SF lab | Marketplace | No |
| Game ground truth | Unique to Claru | No | No | No |

Render as a dark card with monospace text and subtle grid background. Checkmarks in sage green (animated check-draw SVG on scroll entry), dashes in white/30. Each "Yes" cell has a subtle sage green glow. The "Unique to Claru" cell for game data gets a brighter glow + pulse animation to draw the eye. Keep it factual, no marketing language. One sentence below: "One vendor. Catalog, enrichment, collection, and game data."

---

### Section 9: Final CTA

**Label:** (none — CTA section)

**Headline:** "3.7M annotations. 25 datasets. Depth, pose, segmentation on every clip." (Geist Sans, white, 48px) **Sub:** "Browse now or tell us what's missing."

**Two CTAs:**

- "Browse the Catalog" (primary, sage green, links to `/catalog`)
- "Request Custom Collection" (secondary, ghost) → scrolls to contact form with `id="contact"`

**Contact form:** Reuse V1's terminal-style form. Section must have `id="contact"` for Lenis anchor scrolling from hero CTA.

**Enrichment CTA:** Add a lightweight link at bottom: "Want enrichment on your footage? \[Talk to us\]" → same contact form.

**Background:** Subtle dot grid pattern on `#0a0908`. No second COBE instance.

---

## Generative Asset Pipeline

### Phase 1: Generate base images with FLUX.2 Pro

6-8 hero stills: kitchen egocentric, warehouse walkthrough, road driving, game env, office, robot arm, annotator working

### Phase 2: Animate with Wan 2.2 image-to-video

Convert best stills to 5-second clips ($0.50/clip)

### Phase 3: Run enrichment pipeline on clips

- Depth Anything Video → depth map overlays
- DWPose Video → skeleton overlays
- SAM2 Video → segmentation masks

### Phase 4: Create composites

- 2x2 enrichment comparison grids
- Before/after pairs (FLUX.1 Kontext)
- Side-by-side raw vs enriched

### Phase 5: Extract thumbnails

- 3-5 second loops from each video (FFmpeg)
- Best frames as stills for OG meta / social preview

### Phase 6: Upscale and polish

- Topaz Video AI on all final clips
- Optimize for web (H.264/H.265, appropriate bitrate)

### Script: `scripts/generate-v2-assets.ts`

Chains FAL API calls to produce all assets. Idempotent — running twice doesn't regenerate existing assets.

---

## Technical Implementation

### New dependencies

- `cobe` (5KB WebGL globe) — for collection network with custom arcs + floating labels
- `shaders` — GPU-accelerated effects (`<DotGrid>` overlay on hero, `<Glitch>`/`<CRTScreen>` on Data Gap). See `/shaders` skill for full API.
- No other new deps — existing stack (Framer Motion, GSAP, Lenis) handles everything. Remotion stays out of V2 imports.

### File structure

```
src/app/v2/
├── page.tsx                    # V2 landing page (client-side)
├── components/
│   ├── sections/
│   │   ├── HeroV2.tsx          # Video montage + headline
│   │   ├── DataGap.tsx         # Before/after split
│   │   ├── CatalogShowcase.tsx # Interactive dataset grid
│   │   ├── ThreeModes.tsx      # Browse/Commission/Enrich
│   │   ├── EnrichmentPipeline.tsx # Interactive pipeline demo
│   │   ├── CollectionNetwork.tsx  # Environment type grid
│   │   ├── GameCapture.tsx     # Gaming platform section
│   │   ├── SocialProofV2.tsx   # Metrics + testimonials
│   │   ├── WhyClaru.tsx        # Competitive comparison row
│   │   └── FinalCTAV2.tsx      # CTA + contact form
│   └── ui/
│       ├── Globe.tsx           # COBE wrapper component
│       ├── DatasetCard.tsx     # Video thumbnail card
│       ├── PipelineNode.tsx    # Enrichment pipeline step
│       └── EnrichmentOverlay.tsx # Depth/pose/seg toggle
├── data/
│   └── datasets.ts            # Dataset metadata (name, thumbnail, stats)
└── hooks/
    └── useGlobe.ts            # COBE lifecycle hook
```

### Performance considerations

- Video thumbnails: lazy load, IntersectionObserver for autoplay/pause (only play when in viewport)
- Responsive video delivery: separate desktop (1920x1080) and mobile (720x1280 portrait) sources per the Anduril/Figure pattern: `<source src="desktop.mp4" media="(min-width: 768px)" />` + `<source src="mobile.mp4" />`
- Video poster images: WebP stills with `fetchpriority="high"` on hero video
- COBE globe: single WebGL context, destroy on unmount, `devicePixelRatio` capped at 2
- FAL-generated videos: serve from CloudFront CDN (existing `d301h7ygdmxuux.cloudfront.net`)
- Enrichment pipeline overlays: pre-rendered PNGs with CSS `clip-path` transitions (not real-time processing)
- GSAP stacked cards: `pin: true, pinSpacing: false`, `will-change: transform` on cards
- Catalog grid: virtualized if &gt;12 cards visible
- Hero video: 10-12 seconds at 720p, target &lt;1.5MB (H.264 baseline, CRF 28-30, 1Mbps bitrate). Provide WebP poster as fallback. Note: 15-20s at 1080p in &lt;2MB is unrealistic — revised down.
- Dataset card videos: load poster image by default, load video only on hover/intersection. \~300KB each.
- Video format: `<source type="video/mp4; codecs=hvc1">` (H.265 Safari) + `<source type="video/mp4">` (H.264 universal)
- `prefers-reduced-motion`: disable all scroll-pinning, cross-dissolves, count-up animations. Show static layouts.
- `loading="lazy"` on all images below fold. `fetchpriority="high"` on hero poster only.
- Target: Lighthouse &gt;90, LCP &lt;2.5s, CLS &lt;0.1. Total initial page weight &lt;3MB (hero video + critical CSS/JS). Total with lazy-loaded assets: \~8MB.

---

## QA Plan

1. Run `/gstack-qa` on the V2 page at all viewports (desktop, tablet, mobile)
2. Run `/critique` + `/audit` from impeccable skills for design quality check
3. Run `/humanizer` + `/stop-slop` on all copy
4. Playwright E2E for: page load, scroll through all sections, catalog tab switching, CTA clicks, contact form submission
5. Performance: Lighthouse score &gt;90, LCP &lt;2.5s, CLS &lt;0.1
6. Cross-browser: Chrome, Safari, Firefox

---

## Success Metrics

- Page communicates "data catalog for physical AI" within 5 seconds (user testing)
- Catalog section engagement: visitors interact with dataset cards
- CTA conversion: "Browse Catalog" click-through rate
- Time on page: &gt;60 seconds (currently \~45s on V1)
- Bounce rate: &lt;40%

---

## Resolved Decisions

1. **Globe placement:** Collection network section (Section 6). The hero's job is "data catalog for physical AI" in 5 seconds. A globe says "we are global" which is a supporting detail. Video montage of actual data is the stronger hero.

2. **Pricing:** No public prices, but show the pricing MODEL. In the Three Modes section, include structure: "Per-dataset licensing (catalog) / Per-hour collection rates (custom) / Per-minute enrichment (pipeline)." This pre-qualifies leads without committing to numbers.

3. **Dataset cards:** 6 cards in the GSAP stacked section. Covers core categories with a "View all 25+" CTA.

4. **Catalog CTA destination:** Build a public `/catalog` route. Dataset cards with 2-3 preview clips, annotation counts, modality tags. Gate full access (all samples, download) behind email capture. The portal remains the authenticated experience for licensed buyers. This is the highest-impact deliverable in the PRD.

5. **Hero visual:** Pre-encoded MP4 montage, not Remotion. Simpler, faster LCP, zero JS cost.

6. **Enrichment interaction:** Before/after slider as primary. Pipeline nodes as labels that highlight to show active step. One pattern, not two.

7. **Hugging Face positioning gap:** Add one line to the Data Gap section: "Open datasets get you started. Production models need purpose-collected, commercially licensed data with consistent enrichment across every clip."

8. **Hero video budget:** Revised to 10-12 seconds at 720p (not 15-20s at 1080p). Target &lt;1.5MB. Cross-dissolves between 3-4 clips, not 5-6.

9. **Inkwell.tech inspiration:** Scroll-driven narrative with media floating in circular crops, light-to-dark transition, per-character text animation, giant wordmark section dividers. Adapt: use scroll-driven media reveals for our dataset cards (thumbnails that float/grow into view as you scroll past them). The circular ring of thumbnails in their hero could inspire our catalog showcase layout.

---

## User Stories (for Ralph execution)

Each story is independently implementable and testable. Stories are ordered by dependency.

**Parallelization plan:**

```
Story 0 (scaffold + data population) — BLOCKING, must complete first
  |
  ├── Stories 1, 4, 5, 6, 7, 8, 9 — all parallelizable
  ├── Story 10 (/catalog) — parallelizable (independent route)
  ├── Story 12 (SEO/meta) — parallelizable
  |
  └── Story 2 then Story 3 — SEQUENTIAL (back-to-back GSAP pins need sequential QA)

Story 11 (responsive) — AFTER all of Stories 1-9 complete
```

### Story 0: Project scaffolding

**As a** developer **I want** the V2 route and file structure set up **So that** I can build sections independently

**Acceptance criteria:**

- `src/app/v2/page.tsx` exists with hydration-safe client component shell
- Section order: Hero → DataGap → ThreeModes → CatalogShowcase → EnrichmentPipeline → CollectionNetwork → GameCapture → WhyClaru → SocialProofV2 → FinalCTAV2
- All section component files created as empty stubs
- `src/app/v2/data/datasets.ts` created with typed dataset schema AND populated with real metadata from Supabase catalog (annotation counts, modality, descriptions for all 6 datasets)
- `src/app/v2/hooks/useGlobe.ts` created as empty hook
- `src/app/v2/components/ui/` directory with Globe, DatasetCard, PipelineNode, EnrichmentOverlay stubs
- `npm run dev` serves `/v2` without errors
- Dot grid background replaces ASCII canvas in the V2 layout
- Lenis smooth scroll provider wraps V2 page
- `cobe` installed: `npm install cobe`
- OKLCH color system: define CSS custom properties for all neutrals with 0.01 sage chroma in `globals.css` V2 section
- Shared `useReducedMotion()` hook created in `src/app/v2/hooks/useReducedMotion.ts` (reads `prefers-reduced-motion` media query)
- GSAP cleanup pattern: all stories MUST use `@gsap/react`'s `useGSAP` hook (already in package.json) which handles ScrollTrigger cleanup on unmount automatically
- Placeholder assets: create solid-color WebP poster images for hero and dataset cards so the scaffold renders without broken images
- Remove `@remotion/player` and `remotion` from V2 imports (they stay in dependencies for V1 but V2 must not import them)

### Story 1: Hero section

**As a** visitor **I want** to immediately understand what Claru sells **So that** I decide in 5 seconds whether to keep scrolling

**Acceptance criteria:**

- Full-viewport section with dark background `#0a0908`
- Headline: "The training data catalog for physical AI." in Geist Sans, white, 72px desktop / 40px mobile, bold
- Sub: "Curated video datasets with depth, pose, and segmentation. Ready for training." in Geist Sans, white/80, 20px desktop / 16px mobile
- Stats bar in JetBrains Mono, sage green `#92B090`: "3.7M+ annotations on real-world physical environments · 25+ commercially licensed datasets · 8 modalities"
- Trust signal line: "Commercially licensed · Rights-cleared · Production-ready" in JetBrains Mono, white/60, 14px
- Two CTAs: "Browse the Catalog" (sage green fill, links to `/catalog`) + "Request Custom Collection" (ghost outline, scrolls to Section 9 contact form)
- Background: looping muted autoplay video (poster image as WebP fallback). Video attributes: `autoPlay muted loop playsInline`. Separate desktop (720p landscape) and mobile (720p portrait) sources via `<source media="(min-width: 768px)">`.
- Dark gradient overlay: `bg-gradient-to-b from-[#0a0908]/80 via-[#0a0908]/40 to-transparent`
- iOS safe: `playsInline` attribute on video element
- `prefers-reduced-motion`: show poster image only, no video
- Hero video asset: use real egocentric activity clip from S3 catalog if available, otherwise a placeholder poster image until FAL generation completes

**DoD:** Page loads, headline readable within 1s, video plays on desktop Chrome/Safari, poster shows on mobile.

### Story 2: Data Gap section

**As a** visitor **I want** to understand why existing data sources are insufficient **So that** I see why Claru's catalog is worth exploring

**Acceptance criteria:**

- Section label: `// THE DATA GAP` in JetBrains Mono, sage green, 14px
- Full-width pinned section (GSAP ScrollTrigger)
- Left half: composite of 4 degraded thumbnail images with monospace labels "Internet scrapes", "Synthetic renders", "Academic datasets", "Open datasets". Desaturated, 60% brightness.
- Below left: "Open datasets get you started. Production models need purpose-collected, commercially licensed data with consistent enrichment across every clip."
- Right half: 2x2 grid showing ONE scene four ways: (1) raw frame, (2) depth map overlay in blue `#4A9EDE`, (3) pose skeleton in orange `#DE8A4A`, (4) segmentation masks in purple `#9E6ADE`
- Scroll behavior: GSAP ScrollTrigger pin. 0-40% scroll: both halves visible. 40-60%: left fades (`opacity: 0, scale: 0.95`). 60-100%: right expands full width. Unpin at 100%. Total: 1.5vh scroll distance.
- GSAP + Lenis integration: use the Lenis ticker pattern (NOT `scrollerProxy()`) — see Integration Notes section
- `prefers-reduced-motion`: show both halves side by side, no pinning, no animation
- Assets: use real catalog frames for the 2x2 if available in S3. Process through FAL (Depth Anything, DWPose, SAM2) to generate overlays. If no real frames available yet, use placeholder colored rectangles with labels.

**DoD:** Section pins on scroll, left fades, right expands. Works in Chrome + Safari. Reduced motion shows static layout.

### Story 3: Catalog Showcase (GSAP stacked cards)

**As a** visitor **I want** to browse available datasets **So that** I can evaluate whether Claru has what my model needs

**Acceptance criteria:**

- Section label: `// DATA CATALOG` in JetBrains Mono, sage green
- 6 full-width stacked cards using GSAP ScrollTrigger pin pattern: `pin: true, pinSpacing: false, anticipatePin: 1`, scale down `1 - (cards.length - index) * 0.025`. Add manual spacer div after the section to compensate for `pinSpacing: false` (height = total pinned scroll distance). Apply `will-change: transform` only to the currently-animating card, remove after animation.
- Each card: dark bg `#121110`, subtle border `rgba(255,255,255,0.08)`, rounded-lg
- Card content: video thumbnail placeholder (WebP poster, video loads on intersection), dataset name (Geist Sans bold 24px), annotation count (JetBrains Mono sage green), modality badges (small pills), 1-line description, "View Dataset →" link
- 6 datasets with real data from Supabase catalog:
  1. Egocentric Activity Capture — \~386K clips
  2. Game Environment Capture — \~66K clips
  3. Video Quality Annotations — \~976K assessments
  4. Object Identity Tracking — \~1.07M verifications
  5. Traffic & Driving Data — count TBD (use real count from DB or "Coming soon")
  6. Robotic Arm Demonstrations — "Coming soon" (FAL-generated thumbnail)
- After card 6: "View all 25+ datasets →" CTA button (sage green, links to `/catalog`)
- Count-up animation on annotation numbers when card becomes active — use GSAP `onEnter` callback per card's ScrollTrigger to trigger count-up state
- **iOS Safari mitigations:** Call `ScrollTrigger.refresh()` on `resize` and `orientationchange` (address bar). Use GSAP's `stopOverscroll()` helper to prevent rubber-banding breaking pin math. Consider reducing Lenis `touchMultiplier` to 1 on this page to prevent momentum scroll-through of pinned sections.
- **Story 2 → Story 3 dependency:** Story 3 cannot be properly QA'd until Story 2's pin height (`end: "+=150vh"`) is finalized. Build these sequentially, not in parallel.
- `prefers-reduced-motion`: show all 6 cards in a vertical stack, no pinning
- Below `lg` breakpoint (1024px): disable GSAP pinning entirely, show cards as a vertical scrolling list

**DoD:** 6 cards stack/unstack on scroll. Numbers animate. CTA links to /catalog. Works on iOS Safari.

### Story 4: Three Modes section

**As a** visitor **I want** to understand how to get data from Claru **So that** I choose the right path (browse, commission, or enrich)

**Acceptance criteria:**

- Section label: `// HOW IT WORKS`
- Three-column layout on desktop (grid-cols-3), single column on mobile
- Each card: dark bg, border, icon (monoline Lucide icon, sage green stroke), title (Geist Sans bold 20px), 3-4 bullet points (16px), CTA link with arrow
- Mode 1 "Browse & Buy": catalog icon, "Preview samples before committing", CTA → `/catalog`
- Mode 2 "Commission Collection": globe icon, "Your spec, our logistics", CTA → scroll to contact form
- Mode 3 "Enrich Your Data": layers icon, "Depth, pose, segmentation, captions", CTA → scroll to Section 5
- Pricing model line below cards: "Per-dataset licensing · Per-hour collection rates · Per-minute enrichment" in JetBrains Mono, white/60, 14px
- Cards fade up on scroll with 0.1s stagger (Framer Motion `whileInView`)
- `prefers-reduced-motion`: no stagger, instant visibility

**DoD:** Three cards render, CTAs work, responsive stacking on mobile.

### Story 5: Enrichment Pipeline (before/after slider)

**As a** visitor **I want** to see how Claru enriches raw data **So that** I understand the value added beyond raw footage

**Acceptance criteria:**

- Section label: `// ENRICHMENT PIPELINE`
- Pipeline nodes displayed horizontally above the demo: `Raw Video → Depth → Pose → Segmentation → Caption → Model-Ready` (JetBrains Mono, 14px)
- Active node highlighted with sage green glow based on slider position
- Below nodes: a single video frame (\~720px wide, 16:9 aspect ratio)
- `<input type="range" min="0" max="100">` styled as a drag handle below the frame
- Overlay layers stacked as absolute-positioned images with `clip-path: inset(0 ${100 - value}% 0 0)`:
  - 0-20%: raw frame only
  - 20-40%: depth map overlay fades in (blue `#4A9EDE`)
  - 40-60%: pose skeleton appears (orange `#DE8A4A`)
  - 60-80%: segmentation masks (purple `#9E6ADE`)
  - 80-100%: all overlays + caption text below frame
- Touch-draggable on mobile — wrap `<input type="range">` in a 64px-tall touch target div (iOS Safari thumb area is smaller than expected)
- Keyboard accessible (arrow keys move slider)
- Video error/loading state: show a skeleton placeholder (dark rectangle with subtle pulse animation) while video frame loads. If load fails, show the raw frame as a static WebP.
- Assets: pre-rendered overlay PNGs from FAL pipeline. If not available yet, use colored semi-transparent rectangles as placeholders.
- `prefers-reduced-motion`: show fully enriched frame (all overlays visible), no slider interaction needed

**DoD:** Slider drags, overlays reveal progressively, pipeline nodes highlight. Works on touch devices.

### Story 6: Collection Network (COBE globe + environment grid)

**As a** visitor **I want** to see where Claru collects data **So that** I trust they can capture data in environments my robots operate in

**Acceptance criteria:**

- Section label: `// GLOBAL COLLECTION`
- COBE globe component: dynamically imported (`ssr: false`), `dark: 1`, markers at 5+ locations with sage green color `[0.57, 0.69, 0.56]`, auto-rotation `phi += 0.003`, `mapBrightness: 2`, `devicePixelRatio` capped at 2. **MVP: markers only, no arcs** (arcs are a post-MVP enhancement requiring custom SVG overlay). Static labels around the globe, not rotation-anchored.
- Globe canvas: 500px height, full width, centered
- Below globe: 2x3 grid of environment cards (200px height each). Each card: background image (or placeholder gradient) + monospace label overlay. Environments: Residential Kitchens, Industrial Warehouses, Public Roads, Office Environments, Game Studios, Retail Spaces
- Copy below grid: "We collect where your robots will operate. Suburban kitchens. Factory floors. City streets. Not lab environments — real ones."
- No stats bar unless we have confirmed real numbers (no placeholders)
- Globe destroys WebGL context on unmount (`globe.destroy()`)
- `prefers-reduced-motion`: show static globe snapshot image instead of animated WebGL
- No-WebGL fallback: show a dark world map SVG with marker dots

**DoD:** Globe renders and rotates, environment grid displays, cleanup on unmount.

### Story 7: Game Capture section

**As a** visitor **I want** to understand the gaming data advantage **So that** I see why game data is valuable for physical AI

**Acceptance criteria:**

- Section label: `// GAME CAPTURE`
- Full-bleed dark background with game footage poster/video
- Dark gradient overlay from bottom
- Split layout: left = game environment clip/image, right = 2x2 mini-grid showing extracted data (RGB frame, depth buffer, object IDs, physics state)
- Copy: "Game engines generate pixel-perfect labels with zero manual annotation. Depth buffers, object IDs, physics state."
- Stats: "\~66K game environment clips" (real number from catalog)
- Use real game capture footage from S3 if available

**DoD:** Section renders with real or placeholder game footage, split layout works on desktop and mobile.

### Story 8: Social Proof section

**As a** visitor **I want** evidence that Claru delivers quality **So that** I trust the catalog before engaging

**Acceptance criteria:**

- Section label: `// PROOF OF WORK`
- Metrics module: 4 large monospace numbers in a row (desktop) / 2x2 grid (mobile)
  - "3.7M+ expert annotations"
  - "97.3% inter-annotator agreement" (confirm real number or use a different real quality metric)
  - "25+ commercially licensed datasets"
  - "8 modalities" with list: egocentric, game, traffic, workplace, robotics, cinematic, object tracking, content safety
- Horizontal scroll testimonial cards from V1 (reuse `Testimonials.tsx` component, adapt styling)
- Count-up animation on metric numbers on scroll entry

**DoD:** Metrics display, testimonials scroll horizontally. Numbers are real.

### Story 9: Final CTA + Contact Form

**As a** visitor **I want** to take action **So that** I browse the catalog or request custom data

**Acceptance criteria:**

- Headline: "3.7M annotations. 25 datasets. Depth, pose, segmentation on every clip." (Geist Sans, white, 48px desktop / 28px mobile)
- Sub: "Browse now or tell us what's missing."
- Two CTAs: "Browse the Catalog" (sage green, links to `/catalog`) + "Request Custom Collection" (ghost, scrolls to `#contact`)
- Enrichment CTA below form: "Want enrichment on your footage? \[Talk to us\]" → same `#contact`
- Contact form: section has `id="contact"`. Reuse V1's `ContactForm.tsx` terminal-style progressive form. Fields: name, email, company, what you're training, data needs, timeline
- Form submission: currently logs to console (same as V1 — backend TBD)
- Background: subtle dot grid on `#0a0908`, no second COBE globe
- `prefers-reduced-motion`: no animation on form steps

**DoD:** CTAs work, form renders and accepts input, no JS errors.

### Story 10: Public catalog page (`/catalog`)

**As a** visitor who clicked "Browse the Catalog" **I want** to see available datasets with preview clips **So that** I evaluate Claru's data before committing

**Acceptance criteria:**

- Route: `src/app/catalog/page.tsx`
- Layout: reuse V2 dark theme, header, footer
- Grid of dataset cards (3 columns desktop, 2 tablet, 1 mobile)
- Each card: video thumbnail (poster + lazy video), dataset name, annotation count, modality badges, 1-line description
- Data source: `datasets.ts` static file initially (migrate to Supabase API later)
- Click card: expand inline (Framer Motion `AnimatePresence` + `layoutId`)
- **Email gate boundary (critical UX decision):**
  - WITHOUT email: see all dataset cards, poster thumbnails, annotation counts, modality badges, descriptions. Can play 1 preview clip per dataset (low-res, 3 seconds).
  - WITH email: see 2-3 full-quality sample clips per dataset, enrichment overlay previews (depth/pose/seg), download sample pack link
  - Gate trigger: "See all samples" button on expanded card → email capture modal
- Email capture modal: fields = email + company name. No backend yet — `console.log({ email, company })` + `localStorage.setItem('catalog_email', email)` + show "Thanks! Full access unlocked." + reveal gated content.
- No authentication required to browse the ungated view
- SEO: meta title "Claru Data Catalog — Training Data for Physical AI", meta description with keywords

**DoD:** `/catalog` loads, shows dataset cards, cards expand, email modal works.

### Story 11: Responsive behavior

**As a** mobile visitor **I want** the page to work on my phone **So that** I can evaluate Claru anywhere

**Acceptance criteria:**

- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px` (Tailwind defaults)
- Hero: stack headline + stats vertically, full-width CTAs, video switches to portrait source
- Data Gap: stack left/right vertically at `md`, no pinning on mobile (static layout)
- Catalog cards: full-width on mobile, no GSAP pinning below `lg` (vertical scroll instead)
- Three Modes: single column stack on mobile
- Enrichment pipeline: pipeline nodes wrap to 2 rows on mobile, slider is full-width
- Globe: 300px height on mobile, 500px on desktop
- Environment grid: 2x3 → 1x6 on mobile
- Game Capture: stack split layout vertically
- Metrics: 4 in a row → 2x2 grid on mobile
- Testimonials: horizontal scroll works on touch
- All touch targets: minimum 44x44px

**DoD:** Every section renders correctly at 375px, 768px, and 1280px widths.

---

## Dataset Schema (`datasets.ts`)

```typescript
interface Dataset {
  id: string
  name: string
  slug: string
  description: string          // 1-2 sentences
  annotationCount: number      // e.g., 386000
  annotationLabel: string      // e.g., "clips", "assessments", "verifications"
  modality: string             // e.g., "Egocentric Video", "Game Environment"
  modalityBadges: string[]     // e.g., ["video", "depth", "pose"]
  thumbnailPoster: string      // WebP poster URL (CloudFront)
  thumbnailVideo?: string      // MP4 loop URL (CloudFront), optional
  enrichments: string[]        // e.g., ["depth", "pose", "segmentation", "caption"]
  status: 'available' | 'coming_soon'
  sampleClips?: string[]       // URLs for expanded catalog view
}
```

Initial data: populate from Supabase catalog metadata. Use real S3/CloudFront URLs where clips exist. Use `status: 'coming_soon'` for categories without footage.

---

## Asset Inventory

| Asset | Source | Status | Path |
| --- | --- | --- | --- |
| Hero video (desktop) | Real egocentric activity clip from S3 | Extract from catalog | `public/videos/hero-desktop.mp4` |
| Hero video (mobile) | Same clip, portrait crop | Process from desktop source | `public/videos/hero-mobile.mp4` |
| Hero poster | Best frame from hero video | Extract | `public/images/hero-poster.webp` |
| Data Gap: degraded thumbnails | Create montage of blurry/watermarked stock | Manual creation | `public/images/data-gap-bad.webp` |
| Data Gap: raw frame | Real catalog frame | Extract from S3 | `public/images/enrichment-raw.webp` |
| Data Gap: depth overlay | FAL Depth Anything on raw frame | Generate via script | `public/images/enrichment-depth.webp` |
| Data Gap: pose overlay | FAL DWPose on raw frame | Generate via script | `public/images/enrichment-pose.webp` |
| Data Gap: segmentation overlay | FAL SAM2 on raw frame | Generate via script | `public/images/enrichment-seg.webp` |
| Dataset card posters (x6) | Real clips from S3 catalog | Extract best frames | `public/images/datasets/{slug}-poster.webp` |
| Dataset card videos (x6) | Real clips from S3, 3-5 sec loops | Extract + compress | `public/videos/datasets/{slug}-loop.mp4` |
| Environment grid images (x6) | FAL FLUX.2 Pro generated or real photos | Generate if needed | `public/images/environments/{name}.webp` |
| Game capture footage | Real game data from S3 (\~66K clips) | Extract | `public/videos/game-capture.mp4` |
| Globe fallback (no-WebGL) | Dark world map SVG with dots | Create | `public/images/globe-fallback.svg` |
| Enrichment slider overlays (x4) | FAL pipeline on a single frame | Generate via script | `public/images/slider/{layer}.png` |

**Asset generation script:** `scripts/generate-v2-assets.ts` — chains FAL API calls. Requires `FAL_KEY` env var. Idempotent (skips existing assets). Run with `npx tsx scripts/generate-v2-assets.ts`.

---

## `/catalog` Page Specification

### Route

`src/app/catalog/page.tsx` (server component with client islands)

### Layout

- Reuse global header/footer from V1
- Dark background `#0a0908`
- Max width 1280px, centered

### Components

- `CatalogGrid` — 3-column grid (responsive)
- `CatalogCard` — extends `DatasetCard` with expand behavior
- `EmailCaptureModal` — modal with email + company fields, logs to console

### Data Flow

1. Page imports `datasets` from `data/datasets.ts` (static initially)
2. Future: API route `src/app/api/catalog/route.ts` → Supabase query
3. Card click → expand inline (Framer Motion `AnimatePresence` + `layoutId`)
4. "Get full access" → open `EmailCaptureModal`
5. Modal submit → `console.log({ email, company })` + show "Thanks! We'll be in touch."

### SEO

```tsx
export const metadata = {
  title: 'Claru Data Catalog — Training Data for Physical AI',
  description: 'Browse 25+ commercially licensed datasets for robotics, world models, and embodied AI. Egocentric video, game environments, depth maps, pose estimation, and more.',
}
```

---

## GSAP + Lenis Integration Notes

GSAP ScrollTrigger and Lenis need explicit integration. Add to the V2 page setup:

```typescript
// In LenisProvider or V2 page.tsx
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// After Lenis initializes:
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

This replaces the need for `ScrollTrigger.scrollerProxy()`.

---

## Enrichment Pipeline Slider — Node-to-Slider Mapping

| Slider % | Active Node | Overlay Layer |
| --- | --- | --- |
| 0-20% | Raw Video | None (raw frame only) |
| 20-40% | Depth Estimation | `enrichment-depth.png` at `clip-path: inset(0 ${100 - (value - 20) * 5}% 0 0)` |
| 40-60% | Pose Detection | `enrichment-pose.png` added |
| 60-80% | Segmentation | `enrichment-seg.png` added |
| 80-100% | Captioning + Model-Ready | All overlays + caption text: "Person reaches for cup on kitchen counter" |

Bounding boxes are NOT a separate step (removed to match pipeline nodes). Depth is first, matching the pipeline order.

---

## Story 12: SEO, Meta Tags & OG Images

**As a** visitor finding Claru via search or social share **I want** the page title, description, and social preview to reflect the V2 positioning **So that** search engines and social cards convey "physical AI data catalog" not "data services"

**Acceptance criteria:**

- V2 page metadata (in `src/app/v2/layout.tsx` or `page.tsx`):

  ```tsx
  export const metadata = {
    title: 'Claru — The Training Data Catalog for Physical AI',
    description: 'Browse 25+ commercially licensed datasets for robotics, world models, and embodied AI. Real-world egocentric video, game environments, depth maps, pose estimation. 3.7M+ expert annotations.',
    openGraph: {
      title: 'Claru — Training Data for Physical AI',
      description: 'Real-world datasets with depth, pose, and segmentation. Browse the catalog.',
      images: [{ url: '/images/og-v2.webp', width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Claru — Training Data for Physical AI',
      description: 'Real-world datasets with depth, pose, and segmentation. Browse the catalog.',
      images: ['/images/og-v2.webp'],
    },
  }
  ```

- OG image (`public/images/og-v2.webp`): 1200x630, dark background `#0a0908`, Claru logo, headline text "The training data catalog for physical AI", sample dataset thumbnail grid, sage green accent. Generate with FAL FLUX.2 or design manually.

- `/catalog` page has its own metadata (specified in Story 10)

- Structured data (JSON-LD) for Organization:

  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Claru",
    "url": "https://claru.ai",
    "description": "The training data catalog for physical AI — robotics, world models, and embodied intelligence.",
    "sameAs": []
  }
  ```

- Canonical URL set correctly for `/v2` (important: don't let it compete with `/` for SEO until V2 replaces V1)

- `robots` meta: `noindex` on `/v2` during development, remove when V2 goes live

- Favicon and existing apple-touch-icon carry over from V1

**DoD:** Meta tags render in page source. OG image shows correctly in social share preview (test with https://www.opengraph.xyz/). JSON-LD validates at https://validator.schema.org/.