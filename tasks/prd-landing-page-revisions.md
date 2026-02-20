# PRD: Landing Page Revisions — Transcript-Informed Changes

## Introduction

The Claru landing page needs to better reflect the team's core positioning as an **embedded data ops partner for frontier AI labs**. Based on an internal strategy meeting, the current site undersells the embedded model, lacks proof-of-work credibility signals, and misses key differentiators like geographic diversity and proprietary tooling. These revisions strengthen the demand-side story ahead of the Danny/GTM sync, using a mix of real project data and capability framing.

## Goals

- Add a "Proof of Work" section showing real project types with concrete numbers (mix of real and aspirational)
- Elevate the embedded ops partner angle across the site
- Showcase proprietary tooling (VLM, labeling platform, game capture platform)
- Add an animated geographic diversity map as its own mini-section
- Convert testimonials to a horizontal scroll to reduce vertical weight
- Add speed/flexibility messaging throughout
- Add human/community messaging to the /work-with-us supply-side page
- Keep primary CTA as "Book a Call" throughout

## User Stories

### US-001: Create ProofOfWork section component
**Description:** As a visitor, I want to see what types of projects Claru has delivered so that I trust they can handle my data needs.

**Acceptance Criteria:**
- [ ] New file `src/app/components/sections/ProofOfWork.tsx`
- [ ] Section label: `// WHAT WE'VE SHIPPED`
- [ ] Headline: "Built for labs training at the frontier."
- [ ] Grid of 5 project type cards, each with: Lucide icon, project type name, concrete metric/stat, 1-line description
- [ ] Project types (mix of real and capability-framed):
  1. Egocentric Video Capture — "12,000+ hours collected across 14 countries"
  2. Manipulation Trajectory Data — "900 hours of action breakdowns delivered in 3 weeks"
  3. Game Environment Capture — "Proprietary platform, 50+ game titles, on-demand volume"
  4. Multi-Modal Annotation — "Frame-level video, spatial, RLHF — with real-time QA loops"
  5. Synthetic Data Pipelines — "Unreal & Omniverse environments, sim-to-real validated"
- [ ] Bottom link: "Explore our full data catalog" pointing to `#contact` for now
- [ ] Uses existing animation patterns: `whileInView` fade-in, staggered card reveals, `TextScramble` on hover
- [ ] Responsive: 1-col mobile, 2-col tablet, 3-col desktop (with last 2 spanning below)
- [ ] Follows existing design system: `--bg-card`, `--border-subtle`, `--accent-primary` colors, `font-mono` labels
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test card data rendering, correct number of cards, responsive grid breakpoints
- [ ] **Code Review:** Run code-reviewer agent to verify component patterns match existing sections

### US-002: Add ProofOfWork to main page composition
**Description:** As a developer, I need to integrate the ProofOfWork section into the page flow between TwoPaths and Testimonials.

**Acceptance Criteria:**
- [ ] In `src/app/page.tsx`, add dynamic import for ProofOfWork with `ssr: false` and `SectionSkeleton` loading
- [ ] Insert ProofOfWork after TwoPaths and before Testimonials in the render order
- [ ] Optionally add a `SectionBridge` text between TwoPaths and ProofOfWork if needed for flow
- [ ] Page flow becomes: Hero → ProblemAgitation → Bridge → Origin → TwoPaths → GlobeMap → ProofOfWork → Testimonials → FinalCTA → AnimatedLogo
- [ ] Typecheck/lint passes
- [ ] Verify in browser: scroll through full page, confirm section ordering
- [ ] **Unit Tests:** N/A (composition only)
- [ ] **Code Review:** Run code-reviewer agent to verify import patterns

### US-003: Enhance TwoPaths with embedded model and proprietary tooling
**Description:** As a visitor, I want to understand that Claru has proprietary tools and an embedded working model so that I see them as more than a generic vendor.

**Acceptance Criteria:**
- [ ] In `src/app/components/sections/TwoPaths.tsx`, update the **Training Data** card features to include:
  - "Proprietary video game capture platform" (replace or add to existing items)
  - "Proprietary labeling & QA platform"
  - Keep existing items: egocentric/manipulation capture, synthetic data generation, licensed dataset sourcing, dedup/alignment/quality scoring — reorder as needed to fit 4-5 items
- [ ] Update the **Expert Labeling** card features to include:
  - "Embedded in your Slack — real-time feedback, not batch cycles"
  - "Proprietary VLM for machine-assisted captioning & labeling"
  - Keep existing items: RLHF & preference ranking, frame-level annotation, red teaming, benchmark curation — reorder as needed
- [ ] Add a speed/flexibility callout below the two cards or as a sub-element:
  - Text: "First samples in 48 hours. Requirements change mid-project — we adapt in hours, not weeks."
  - Styled as `font-mono text-sm text-[var(--accent-secondary)]` centered, with subtle animation
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill — confirm cards look balanced, no overflow
- [ ] **Unit Tests:** Test updated feature arrays render correctly
- [ ] **Code Review:** Run code-reviewer agent to verify copy changes don't break layout

### US-004: Create animated geographic diversity map
**Description:** As a visitor, I want to see a world map showing Claru's global contributor network so that I understand the geographic diversity of their data.

**Acceptance Criteria:**
- [ ] New file `src/app/components/ui/GlobeMap.tsx`
- [ ] Renders an animated flat world map (SVG or canvas-based) on a dark background
- [ ] Map uses simplified world continent outlines at very low opacity (matching brand dark aesthetic)
- [ ] Glowing dots in `--accent-primary` color at approximate locations: Philippines, India, Pakistan, US (multiple), Canada, Brazil, Mexico, UK, Germany, Japan, South Korea, Australia, Kenya, South Africa
- [ ] Dots pulse/appear with scroll animation (staggered, using Framer Motion `whileInView`)
- [ ] Small monospace labels for major regions visible (e.g., "NORTH AMERICA", "SOUTHEAST ASIA", "EUROPE")
- [ ] Stats line below map: "Contributors across 14+ countries — your model needs diverse data to generalize."
- [ ] Dark background matches site (`--bg-primary` or slightly lighter), subtle noise grain overlay
- [ ] Responsive: scales down gracefully on mobile (dots may overlap, that's fine — reduce label count)
- [ ] Lightweight: no heavy map library (no Mapbox, Leaflet). SVG paths or canvas only.
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test component renders without errors, correct number of location dots
- [ ] **Code Review:** Run code-reviewer agent to verify canvas/SVG performance

### US-005: Create GlobeMap section wrapper and integrate into page
**Description:** As a developer, I need to wrap the GlobeMap in a section component and place it between TwoPaths and ProofOfWork.

**Acceptance Criteria:**
- [ ] New file `src/app/components/sections/GlobalReach.tsx` — thin wrapper section around GlobeMap
- [ ] Section label: `// GLOBAL REACH`
- [ ] Headline: "Data from everywhere your model will deploy."
- [ ] Contains the `GlobeMap` component
- [ ] In `src/app/page.tsx`, add dynamic import with `ssr: false`
- [ ] Insert after TwoPaths, before ProofOfWork
- [ ] Typecheck/lint passes
- [ ] Verify in browser: map section visible between TwoPaths and ProofOfWork
- [ ] **Unit Tests:** N/A (wrapper only)
- [ ] **Code Review:** Run code-reviewer agent to verify section patterns

### US-006: Convert Testimonials to horizontal scroll
**Description:** As a visitor, I want to see testimonials in a compact horizontal scroll so that they're present but don't dominate the page.

**Acceptance Criteria:**
- [ ] In `src/app/components/sections/Testimonials.tsx`:
  - Keep the 3 metric cards at the top (8wk, 100% embedded, full pipeline) — these stay as-is
  - Convert the 4 testimonial cards from a 2x2 grid to a **horizontal scrolling row**
  - Cards scroll horizontally with snap behavior (`scroll-snap-type: x mandatory`, `scroll-snap-align: start`)
  - Each card has a fixed width (~320px desktop, ~280px mobile) with flex-shrink-0
  - Show partial next card to indicate scrollability (peek effect)
  - Optional: add subtle scroll indicators (dots or fade gradient at edges)
  - Remove parallax blur circles background effect to simplify
  - Reduce section vertical padding (from `section` 8rem default to ~5rem)
- [ ] All 4 testimonials remain accessible via scrolling
- [ ] Responsive: works on mobile (touch scroll) and desktop (mouse/trackpad scroll)
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill — test scroll on desktop and mobile viewport
- [ ] **Unit Tests:** Test all 4 testimonials render, scroll container has correct CSS
- [ ] **Code Review:** Run code-reviewer agent to verify scroll accessibility

### US-007: Add community messaging to /work-with-us page
**Description:** As a potential contributor visiting /work-with-us, I want to see that Claru values its community so that I feel confident joining.

**Acceptance Criteria:**
- [ ] In `src/app/work-with-us/page.tsx`, add a callout/card section near the top (after the hero area, before the bento grid)
- [ ] Content:
  - Headline: "Join a team, not a task queue."
  - Body: "We answer every message. We know our contributors by name. When you join Claru, you're part of a team building the data that trains the world's most advanced AI."
  - Optional: 2-3 small stats (e.g., "500+ active contributors", "Avg. response time: < 2 hours", "Projects across 14+ countries")
- [ ] Styled consistently with existing page: dark card, accent border on hover, `font-mono` label
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test callout renders with correct copy
- [ ] **Code Review:** Run code-reviewer agent to verify integration with existing page layout

### US-008: Playwright E2E Test — Full Page Scroll and Section Visibility
**Description:** As QA, I need an end-to-end test verifying all landing page sections render correctly.

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/landing-page-sections.spec.ts`
- [ ] Test flow:
  1. Navigate to `localhost:3000`
  2. Wait for page to load (hero visible)
  3. Scroll through entire page
  4. Assert each section is visible in order: Hero, ProblemAgitation, Origin, TwoPaths, GlobalReach (map), ProofOfWork, Testimonials, FinalCTA
  5. Assert ProofOfWork section contains 5 project cards
  6. Assert GlobeMap renders (canvas or SVG element present)
  7. Assert Testimonials scroll container is horizontally scrollable
  8. Assert "Book a Call" CTA is present in at least 2 locations
- [ ] Test includes viewport assertions for desktop (1280px) and mobile (375px)
- [ ] Test uses Page Object Model pattern for maintainability
- [ ] Test runs successfully
- [ ] Typecheck passes

### US-009: Playwright E2E Test — Work With Us Page Community Section
**Description:** As QA, I need an end-to-end test verifying the /work-with-us page community messaging.

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/work-with-us.spec.ts`
- [ ] Test flow:
  1. Navigate to `localhost:3000/work-with-us`
  2. Wait for page to load
  3. Assert community callout section is visible
  4. Assert "Join a team, not a task queue" text is present
  5. Scroll to bento grid and verify video elements are present
- [ ] Test runs successfully
- [ ] Typecheck passes

## Functional Requirements

- FR-1: ProofOfWork section displays 5 project type cards with icons, metrics, and descriptions
- FR-2: ProofOfWork section uses scroll-triggered staggered animations matching existing patterns
- FR-3: TwoPaths Training Data card lists proprietary game capture and labeling platforms
- FR-4: TwoPaths Expert Labeling card highlights embedded Slack model and proprietary VLM
- FR-5: Speed/flexibility callout appears near TwoPaths section
- FR-6: Animated flat world map renders with pulsing dots at 14+ locations using accent-primary color
- FR-7: Map section sits between TwoPaths and ProofOfWork as its own mini-section
- FR-8: Testimonials display as horizontal scroll with snap behavior, reducing vertical footprint
- FR-9: Metric cards (8wk, 100%, full pipeline) remain above testimonials
- FR-10: /work-with-us page includes community messaging callout after hero
- FR-11: All CTAs remain "Book a Call" pointing to `#contact`
- FR-12: All new components follow existing design system (CSS custom properties, Geist/JetBrains fonts, Framer Motion)

## Non-Goals

- No new backend/API work
- No "Request a Sample" CTA (keeping "Book a Call" for now)
- No actual data catalog page (just a teaser link)
- No real-time data in the map (static locations)
- No changes to Hero, ProblemAgitation, Origin, FinalCTA, or Footer sections
- No heavy map libraries (Mapbox, Leaflet, etc.)

## Design Considerations

- All new sections must match the existing dark terminal aesthetic: `--bg-primary` (#0a0908), `--accent-primary` (#92B090), noise grain overlay
- Reuse existing components: `TextScramble`, `FadeIn`, `Button`, `GlitchText`
- Section labels use `// UPPERCASE MONO` pattern
- Cards follow existing `--bg-card` with `--border-subtle` borders, 1rem radius
- Map should feel ambient/decorative — not a full cartographic tool
- Horizontal testimonial scroll should have momentum/snap feel

## Technical Considerations

- GlobeMap: Use inline SVG for world outline or simplified path data. Dots are absolutely positioned divs or SVG circles. No external map tile services.
- Horizontal scroll: Use CSS `overflow-x: auto` with `scroll-snap-type: x mandatory`. Consider `useRef` for programmatic scroll indicators.
- All new components should be dynamically imported with `ssr: false` to match existing pattern
- ProofOfWork metrics may change — structure data as a typed array at the top of the component for easy editing

## Success Metrics

- All 6 major sections of the landing page render without errors on desktop and mobile
- ProofOfWork section communicates credibility within 3 seconds of viewing
- Geographic map reinforces global capability without slowing page load
- Testimonials consume ~40% less vertical space than current layout
- /work-with-us page feels more human and community-oriented
- Full page Lighthouse performance score remains above 80

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** - Test core logic, validation, and edge cases
2. **Code Review** - Run code-reviewer agent after implementation to verify correctness
3. **Type Safety** - All code must pass TypeScript strict mode

End-to-end tests (Playwright) are defined in US-008 and US-009 to verify complete user flows.

## Open Questions

- What specific numbers should we use for ProofOfWork metrics? (Currently using best estimates from transcript — 12K hrs, 900 hrs, 14 countries, 50+ games)
- Should the data catalog link go to a placeholder page or just anchor to the contact form?
- Do we want the map dots to correspond to real contributor locations or representative regions?
