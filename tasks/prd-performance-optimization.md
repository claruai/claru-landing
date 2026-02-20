# PRD: Mobile & Speed Optimization

## Introduction

Optimize the Claru landing site for mobile performance and faster load times without changing the visual aesthetics. The site currently has heavy animations (ASCII backgrounds, particles, GSAP scroll effects), unoptimized images (~13.7MB in PNGs), and large JS bundles (three.js, GSAP, Framer Motion, Lenis). This optimization will improve Core Web Vitals and achieve < 5s Time to Interactive on average mobile networks.

## Goals

- Achieve < 5s Time to Interactive on average mobile connections (4G)
- Reduce initial JS bundle size by 40%+
- Convert images to WebP with ~90% quality (reduce ~13.7MB → ~2-3MB)
- Maintain full animation fidelity on desktop while optimizing for mobile
- Support `prefers-reduced-motion` for accessibility
- Improve Lighthouse performance score to 80+

## User Stories

### US-001: Convert images to Next.js Image component with WebP
**Description:** As a visitor, I want images to load faster so that the page feels responsive on mobile.

**Acceptance Criteria:**
- [ ] Replace all `<img>` tags with Next.js `<Image>` component
- [ ] Configure `next.config.js` for WebP/AVIF output formats
- [ ] Add appropriate `sizes` attribute for responsive images
- [ ] Add `priority` prop to above-the-fold images
- [ ] Add blur placeholder for below-the-fold images
- [ ] Verify images render correctly at all breakpoints
- [ ] Typecheck passes
- [ ] **Verify in browser** - images load progressively without layout shift

### US-002: Optimize ASCII robot background images
**Description:** As a visitor, I want the hero ASCII effect to load quickly without blocking the main content.

**Acceptance Criteria:**
- [ ] Convert robot-face PNG images to WebP format (target 80-100KB each vs current ~1MB+)
- [ ] Create smaller resolution versions for mobile (max 800px width)
- [ ] Load mobile-optimized images on screens < 768px
- [ ] Add loading="lazy" equivalent behavior for canvas image loading
- [ ] Preload hero images using `<link rel="preload">` in layout
- [ ] Typecheck passes
- [ ] **Verify in browser** - ASCII effect still renders correctly on desktop and mobile

### US-003: Implement device-aware animation strategy
**Description:** As a mobile visitor, I want smooth performance even with animations, so I can enjoy the site without jank.

**Acceptance Criteria:**
- [ ] Create `useDeviceCapability` hook to detect mobile/low-power devices
- [ ] Reduce ASCII background FPS from 20 → 10 on mobile
- [ ] Disable particle effects on mobile devices
- [ ] Reduce GSAP animation complexity on mobile (simpler easing, fewer animated elements)
- [ ] Keep full animation fidelity on desktop
- [ ] Typecheck passes
- [ ] **Verify in browser** - test on mobile viewport, animations should be smooth

### US-004: Add prefers-reduced-motion support
**Description:** As a visitor with motion sensitivity, I want to see a static version of the site that respects my system preferences.

**Acceptance Criteria:**
- [ ] Create `useReducedMotion` hook that checks `prefers-reduced-motion: reduce`
- [ ] Disable ASCII background animation when reduced motion is preferred
- [ ] Show static gradient or simple background instead
- [ ] Disable Framer Motion animations (use `motion.prefersReducedMotion`)
- [ ] Disable Lenis smooth scroll
- [ ] Disable text scramble/typewriter effects
- [ ] Typecheck passes
- [ ] **Verify in browser** - enable reduced motion in system settings, verify static experience

### US-005: Code-split and lazy load below-the-fold sections
**Description:** As a visitor, I want the hero to load immediately while other sections load progressively.

**Acceptance Criteria:**
- [ ] Keep Hero, Header statically imported (critical path)
- [ ] Dynamic import ProblemAgitation, FourPillars, Capabilities, Testimonials, FinalCTA
- [ ] Add Intersection Observer to trigger loading when section approaches viewport
- [ ] Show lightweight skeleton/placeholder while sections load
- [ ] Typecheck passes
- [ ] **Verify in browser** - check Network tab, sections should load on scroll

### US-006: Remove unused three.js dependency
**Description:** As a developer, I want to reduce bundle size by removing unused dependencies.

**Acceptance Criteria:**
- [ ] Audit ShaderBackground.tsx usage - confirm it's not actively used
- [ ] Remove three.js from package.json if unused
- [ ] Remove AsciiEffect.tsx and AsciiScene.tsx if unused
- [ ] Remove any other unused effect components
- [ ] Run `npm run build` to verify no broken imports
- [ ] Bundle size should decrease by ~150KB (three.js size)
- [ ] Typecheck passes

### US-007: Optimize Framer Motion bundle
**Description:** As a visitor, I want faster initial load by only loading animation code when needed.

**Acceptance Criteria:**
- [ ] Import only used Framer Motion components (motion, AnimatePresence) not entire library
- [ ] Use `LazyMotion` and `domAnimation` for reduced bundle
- [ ] Wrap app in `LazyMotion` with dynamic feature loading
- [ ] Typecheck passes
- [ ] **Verify in browser** - animations still work correctly

### US-008: Optimize font loading
**Description:** As a visitor, I want text to appear quickly without layout shift.

**Acceptance Criteria:**
- [ ] Add `font-display: swap` to all font declarations
- [ ] Preload critical fonts (Geist Sans, JetBrains Mono) in document head
- [ ] Use `next/font` with `display: 'swap'` and `preload: true`
- [ ] Subset fonts to only used characters if possible
- [ ] Typecheck passes
- [ ] **Verify in browser** - no FOUT (flash of unstyled text) or layout shift

### US-009: Add resource hints for faster navigation
**Description:** As a visitor navigating between pages, I want instant page transitions.

**Acceptance Criteria:**
- [ ] Add `<link rel="prefetch">` for pillar pages on homepage
- [ ] Add DNS prefetch for external domains (if any analytics, fonts CDN)
- [ ] Use Next.js `prefetch` on Link components for pillar navigation
- [ ] Typecheck passes

### US-010: Implement critical CSS and reduce render-blocking
**Description:** As a visitor, I want the page to render immediately without waiting for all CSS.

**Acceptance Criteria:**
- [ ] Ensure Tailwind purges unused CSS in production
- [ ] Inline critical above-the-fold CSS if needed
- [ ] Defer non-critical CSS loading
- [ ] Remove any unused CSS from globals.css
- [ ] Typecheck passes
- [ ] **Verify in browser** - check Coverage tab in DevTools, CSS coverage should be > 80%

### US-011: Add loading states and skeleton screens
**Description:** As a visitor, I want visual feedback while content loads so the page feels responsive.

**Acceptance Criteria:**
- [ ] Create reusable `<Skeleton>` component matching site aesthetic
- [ ] Add skeleton for dynamically loaded sections
- [ ] Show skeleton during image loading
- [ ] Ensure no Cumulative Layout Shift (CLS) from loading states
- [ ] Typecheck passes
- [ ] **Verify in browser** - throttle network to Slow 3G, verify skeletons appear

### US-012: Optimize pillar page performance
**Description:** As a visitor on pillar pages, I want them to load as fast as the homepage.

**Acceptance Criteria:**
- [ ] Apply same image optimization to pillar page images
- [ ] Lazy load FAQ accordion content
- [ ] Code-split citation tooltips
- [ ] Use simpler header on pillar pages (no ASCII background)
- [ ] Typecheck passes
- [ ] **Verify in browser** - pillar pages should load < 3s on 4G

### US-013: Run Lighthouse audit and fix remaining issues
**Description:** As a developer, I want to verify all optimizations achieve the target performance score.

**Acceptance Criteria:**
- [ ] Run Lighthouse audit on homepage (mobile mode)
- [ ] Achieve Performance score ≥ 80
- [ ] Achieve LCP (Largest Contentful Paint) < 2.5s
- [ ] Achieve FID (First Input Delay) < 100ms
- [ ] Achieve CLS (Cumulative Layout Shift) < 0.1
- [ ] Document any remaining issues for future optimization
- [ ] **Verify in browser** - run Lighthouse in Chrome DevTools

## Functional Requirements

- FR-1: All images must use Next.js `<Image>` component with WebP format
- FR-2: ASCII background must detect device capability and adjust FPS accordingly
- FR-3: All animations must respect `prefers-reduced-motion` system setting
- FR-4: Below-the-fold sections must be dynamically imported with Intersection Observer
- FR-5: Initial JS bundle must not include three.js or unused effect components
- FR-6: Framer Motion must use `LazyMotion` with `domAnimation` feature set
- FR-7: Fonts must be preloaded with `font-display: swap`
- FR-8: Critical CSS must be inlined or loaded synchronously
- FR-9: Non-critical CSS must be deferred
- FR-10: Loading skeletons must prevent CLS

## Non-Goals (Out of Scope)

- Changing the visual design or aesthetic of the site
- Removing animations entirely (only optimizing them)
- Server-side rendering changes (keep current client-side pattern)
- Adding service worker or PWA functionality
- Image CDN integration (use Next.js built-in optimization)
- Backend/API optimization (static site)
- SEO changes beyond performance improvements

## Technical Considerations

### Current State
- Images: ~13.7MB across 11 PNG files (no optimization)
- JS Bundle: three.js (~150KB), GSAP (~25KB), Framer Motion (~50KB), Lenis (~10KB)
- Animations: ASCII background at 20 FPS, no mobile optimization
- No `prefers-reduced-motion` support
- No code splitting for sections

### Dependencies to Update/Remove
```
Remove: three.js (if ShaderBackground unused)
Keep: framer-motion (optimize with LazyMotion)
Keep: gsap (tree-shake unused features)
Keep: lenis (lightweight enough)
```

### Device Detection Strategy
```typescript
// useDeviceCapability hook
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isLowPower = navigator.hardwareConcurrency <= 4;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Image Optimization Config
```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

## Success Metrics

| Metric | Current (Est.) | Target |
|--------|---------------|--------|
| Time to Interactive (Mobile 4G) | ~8-10s | < 5s |
| Lighthouse Performance | ~50-60 | ≥ 80 |
| LCP | ~4-5s | < 2.5s |
| Total Image Size | 13.7MB | < 3MB |
| Initial JS Bundle | ~400KB | < 250KB |
| CLS | Unknown | < 0.1 |

## Open Questions

1. Is the ShaderBackground component actively used anywhere? Need to audit before removing three.js.
2. Should we add a "lite mode" toggle for users on slow connections?
3. Are there analytics showing what percentage of users are on mobile vs desktop?
4. Should pillar pages share the ASCII background or use a simpler alternative?

## Implementation Order

Recommended sequence for maximum impact:

1. **US-006** - Remove three.js (quick win, big bundle reduction)
2. **US-001** - Image optimization (biggest file size win)
3. **US-002** - ASCII background images
4. **US-007** - Framer Motion optimization
5. **US-005** - Code splitting sections
6. **US-003** - Device-aware animations
7. **US-004** - Reduced motion support
8. **US-008** - Font optimization
9. **US-011** - Loading states
10. **US-010** - CSS optimization
11. **US-009** - Resource hints
12. **US-012** - Pillar pages
13. **US-013** - Final Lighthouse audit
