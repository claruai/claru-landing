# Mobile Responsiveness & CTA Audit Report

**Date:** 2026-02-20
**Viewport tested:** 375x812 (iPhone 14 / standard mobile)
**Pages audited:** `/`, `/data`, `/labeling`, `/case-studies`, `/data-catalog`, `/work-with-us`
**Screenshots saved to:** `/tmp/claru-mobile-*.png`

---

## Executive Summary

The site is generally well-optimized for mobile -- no horizontal overflow was detected on any page, the hamburger menu works correctly, and text readability is good across all tested pages. However, there is a **critical CTA routing bug** in the shared Header component that causes the primary "Book a Call" button to silently fail on most subpages.

### Critical Issues
1. **Header "Book a Call" CTA is broken on all non-homepage pages** (uses `#contact` instead of `/#contact`)
2. **`/case-studies` page has no CTA at all** -- no contact form, no "Book a Call" button in the main content
3. **`/work-with-us` page has no contact/consultation CTA** -- only "Apply Now" links to external app

### Minor Issues
1. Small decorative text at 10px on homepage (card numbers, "Scroll" indicator) -- acceptable for non-content elements
2. Case studies filter buttons at 34px height -- slightly below 44px recommended minimum touch target

---

## Page-by-Page Results

### 1. Homepage (`/`)

**Mobile Layout:** PASS -- No horizontal overflow (doc width 367px < viewport 375px)
**Hamburger Menu:** PASS -- Opens correctly, shows all nav links + "Book a Call" CTA
**Text Readability:** PASS -- 7 elements at 10px, all decorative (card numbers "01"-"06" and "Scroll" indicator)
**Contact Section:** PASS -- `id="contact"` section exists with full contact form

**CTAs on this page:**
| CTA Text | Destination | Status |
|----------|------------|--------|
| "Learn More" (Hero) | `#contact` | PASS -- scrolls to contact form |
| "Book a Call" (TwoPaths section) | `#contact` | PASS -- scrolls to contact form |
| "Explore Data Services" | `/data` | PASS |
| "Explore Labeling Services" | `/labeling` | PASS |
| "Read case study" (x6) | `/case-studies/*` | PASS |
| "View all case studies" | `/case-studies` | PASS |
| "Explore data catalog" | `/data-catalog` | PASS |
| "Book a Consultation" (form) | Form submit | PASS |
| Header "Book a Call" | `#contact` | PASS -- works on homepage |
| Mobile menu "Book a Call" | `#contact` | PASS -- works on homepage |

---

### 2. Training Data (`/data`)

**Mobile Layout:** PASS -- No horizontal overflow
**Hamburger Menu:** PASS
**Text Readability:** PASS
**Contact Section:** PASS -- `id="contact"` section exists at bottom (line 349)

**CTAs on this page:**
| CTA Text | Destination | Status |
|----------|------------|--------|
| "Learn More" (Hero) | `#contact` | PASS -- scrolls to on-page contact form |
| Data Catalog banner link | `/data-catalog` | PASS |
| Case study links (x4) | `/case-studies/*` | PASS |
| "Book a Consultation" (form) | Form submit | PASS |
| Header "Book a Call" | `#contact` | PASS -- works on this page |

---

### 3. Expert Labeling (`/labeling`)

**Mobile Layout:** PASS -- No horizontal overflow
**Hamburger Menu:** PASS
**Text Readability:** PASS
**Contact Section:** PASS -- `id="contact"` section exists at bottom (line 342)

**CTAs on this page:**
| CTA Text | Destination | Status |
|----------|------------|--------|
| "Learn More" (Hero) | `#contact` | PASS -- scrolls to on-page contact form |
| Case study links (x4) | `/case-studies/*` | PASS |
| "Book a Consultation" (form) | Form submit | PASS |
| Header "Book a Call" | `#contact` | PASS -- works on this page |

---

### 4. Case Studies (`/case-studies`)

**Mobile Layout:** PASS -- No horizontal overflow
**Hamburger Menu:** PASS
**Text Readability:** PASS
**Contact Section:** FAIL -- **No `id="contact"` section exists on this page**
**Filter Buttons Touch Targets:** WARN -- Buttons are 34px tall (recommended minimum is 44px), but widths are adequate

**CTAs on this page:**
| CTA Text | Destination | Status |
|----------|------------|--------|
| Case study card links (x11) | `/case-studies/*` | PASS |
| Header "Book a Call" (desktop) | `#contact` | **FAIL** -- no `#contact` section on page; does nothing |
| Mobile menu "Book a Call" | `#contact` | **FAIL** -- navigates to `/case-studies#contact`, no scroll target exists |

**Issues:**
- **CRITICAL:** No CTA to contact/book a call anywhere in the page content. A visitor reading case studies has no way to convert without manually navigating to another page.
- **CRITICAL:** Header "Book a Call" button is broken -- appends `#contact` to current URL with no effect.

---

### 5. Data Catalog (`/data-catalog`)

**Mobile Layout:** PASS -- No horizontal overflow
**Hamburger Menu:** PASS
**Text Readability:** PASS
**Contact Section:** N/A -- Page uses `/#contact` links (with leading slash) which correctly navigate to homepage

**CTAs on this page:**
| CTA Text | Destination | Status |
|----------|------------|--------|
| "Request Catalog Access" (Hero) | `/data-catalog/request` | PASS |
| "Book a Call" (Hero) | `/#contact` | PASS -- navigates to homepage contact |
| "Request Catalog Access" (bottom) | `/data-catalog/request` | PASS |
| "Book a Call" (bottom) | `/#contact` | PASS -- navigates to homepage contact |
| Case study links (x3) | `/case-studies/*` | PASS |
| Header "Book a Call" (desktop) | `#contact` | **FAIL** -- no `#contact` section on page |
| Mobile menu "Book a Call" | `#contact` | **FAIL** -- navigates to `/data-catalog#contact`, no scroll target exists |

**Issue:** The in-page CTAs correctly use `/#contact`, but the shared Header component uses the broken `#contact`.

---

### 6. Work With Us (`/work-with-us`)

**Mobile Layout:** PASS -- No horizontal overflow
**Hamburger Menu:** PASS
**Text Readability:** PASS -- All text >= 12px
**Contact Section:** FAIL -- **No `id="contact"` section exists on this page**

**CTAs on this page:**
| CTA Text | Destination | Status |
|----------|------------|--------|
| "Apply Now" (Hero) | `https://app.claru.ai/signup` | PASS (external link) |
| "Browse Open Roles" (Hero) | `/jobs` | PASS |
| "Apply" links (x4 role cards) | `https://app.claru.ai/signup` | PASS |
| "Browse roles" links (x6) | `/jobs` | PASS |
| "Apply Now" (process section) | `https://app.claru.ai/signup` | PASS |
| Explore links (x3) | `/data`, `/labeling`, `/jobs` | PASS |
| Header "Book a Call" (desktop) | `#contact` | **FAIL** -- no `#contact` section on page |
| Mobile menu "Book a Call" | `#contact` | **FAIL** -- navigates to `/work-with-us#contact`, no scroll target exists |

**Note:** This page intentionally has no "Book a Call" CTA in its content (it targets contributors, not clients), but the Header still shows it.

---

## CTA Inventory -- Full Codebase Analysis

### Header Component (`src/app/components/layout/Header.tsx`)

The Header is shared across all pages and contains two "Book a Call" CTAs:

```
Line 62:  <Button href="#contact" variant="cta-glitch" size="sm">  (desktop nav)
Line 133: <Button href="#contact" size="lg">                        (mobile menu)
```

**Problem:** Using `#contact` (relative anchor) instead of `/#contact` (absolute anchor). This only works on pages that have their own `id="contact"` section.

**Pages with `id="contact"` section** (Header CTA works):
- `/` (homepage) -- via `FinalCTA.tsx`
- `/data` -- line 349
- `/labeling` -- line 342
- All `/pillars/*` pages

**Pages WITHOUT `id="contact"` section** (Header CTA is broken):
- `/case-studies`
- `/case-studies/[slug]` (individual case study pages)
- `/data-catalog`
- `/work-with-us`
- `/jobs`
- `/jobs/[slug]`
- `/privacy`, `/terms`, `/prohibited-use`, `/job-applicant-privacy`

### Inconsistent `#contact` vs `/#contact` Usage

Files that correctly use `/#contact` (works cross-page):
- `src/app/data-catalog/page.tsx` (lines 189, 444)
- `src/app/case-studies/[slug]/CaseStudyDetailClient.tsx` (line 600)
- All `src/app/pillars/*/page.tsx` breadcrumb nav links
- `src/app/components/sections/Footer.tsx` (footer "Contact" link)

Files that use bare `#contact` (only works on same page):
- `src/app/components/layout/Header.tsx` (lines 62, 133) -- **CRITICAL: shared component**
- `src/app/components/sections/Hero.tsx` (line 148)
- `src/app/components/sections/Capabilities.tsx` (line 143)
- `src/app/components/sections/FourPillars.tsx` (line 298)
- `src/app/components/sections/Fascinations.tsx` (line 169)
- `src/app/components/sections/TwoPaths.tsx` (line 136)
- `src/app/data/page.tsx` (line 163)
- `src/app/labeling/page.tsx` (line 152)

The bare `#contact` usage in Hero, Capabilities, FourPillars, Fascinations, and TwoPaths is acceptable because these components are only rendered on the homepage which has the `#contact` section. But the Header is shared everywhere.

### Dead Links or Empty Hrefs

No instances of `href=""` or `href="#"` were found in the codebase. All links point to real destinations.

### External Links

| Link | Used In | Status |
|------|---------|--------|
| `https://app.claru.ai/signup` | `/work-with-us` (7 instances) | External -- verify manually |
| `mailto:contact@claru.ai` | Contact forms, footer | PASS |
| `mailto:support@claru.ai` | Privacy page | PASS |

---

## Recommended Fixes

### P0 -- Critical (broken user flows)

**1. Fix Header `#contact` to `/#contact`**
File: `src/app/components/layout/Header.tsx`

```diff
- <Button href="#contact" variant="cta-glitch" size="sm">
+ <Button href="/#contact" variant="cta-glitch" size="sm">
    Book a Call
  </Button>

- <Button href="#contact" size="lg" onClick={() => setIsMobileMenuOpen(false)}>
+ <Button href="/#contact" size="lg" onClick={() => setIsMobileMenuOpen(false)}>
    Book a Call
  </Button>
```

This single change fixes the CTA across every page on the site (desktop and mobile).

**2. Add a CTA section to `/case-studies`**
The case studies page is a high-intent page (visitors are evaluating your work) but has zero conversion points. Add either:
- A bottom CTA banner (e.g., "Ready to build your dataset? Book a call")
- Or embed a contact form section similar to `/data` and `/labeling`

### P1 -- Important

**3. Consider adding a CTA to `/work-with-us` for enterprise visitors**
While the page targets contributors, enterprise visitors exploring the site may land here. The Header CTA fix (P0 #1) addresses this by ensuring the nav "Book a Call" works.

**4. Standardize `#contact` vs `/#contact` across all files**
For consistency, all `href="#contact"` references should use `/#contact` so they work regardless of which page renders the component. This is a safety measure even though components like Hero.tsx currently only render on the homepage.

Files to update:
- `src/app/data/page.tsx` line 163 (`#contact` -> `/#contact`)
- `src/app/labeling/page.tsx` line 152 (`#contact` -> `/#contact`)
- `src/app/components/sections/Hero.tsx` line 148
- `src/app/components/sections/Capabilities.tsx` line 143
- `src/app/components/sections/FourPillars.tsx` line 298
- `src/app/components/sections/Fascinations.tsx` line 169
- `src/app/components/sections/TwoPaths.tsx` line 136

Note: For `/data` and `/labeling`, since they have their own `#contact` section, the bare `#contact` actually works. But using `/#contact` universally is safer.

### P2 -- Minor

**5. Increase case studies filter button height on mobile**
Current: 34px. Recommended: 44px (Apple's HIG minimum touch target).
This is a minor accessibility improvement.

**6. Consider adding `Data Catalog` to the main nav**
Currently the Header nav has: Training Data, Expert Labeling, Case Studies, Work With Us.
The Data Catalog is only discoverable through the homepage sections or the footer. If it's a key conversion page, consider adding it to the primary navigation or as a dropdown under "Training Data."

---

## Mobile Responsiveness Summary

| Page | Overflow | Menu | Text Size | Touch Targets | Overall |
|------|----------|------|-----------|---------------|---------|
| `/` | PASS | PASS | PASS (minor 10px decorative) | PASS | PASS |
| `/data` | PASS | PASS | PASS | PASS | PASS |
| `/labeling` | PASS | PASS | PASS | PASS | PASS |
| `/case-studies` | PASS | PASS | PASS | WARN (34px filter btns) | PASS |
| `/data-catalog` | PASS | PASS | PASS | PASS | PASS |
| `/work-with-us` | PASS | PASS | PASS | PASS | PASS |

All pages render correctly at 375x812 with no horizontal overflow, functional hamburger menus, and readable text. The mobile layout is well-implemented across the board.

---

## Screenshots Reference

| File | Description |
|------|-------------|
| `/tmp/claru-mobile-homepage.png` | Homepage full page |
| `/tmp/claru-mobile-homepage-menu.png` | Homepage with mobile menu open |
| `/tmp/claru-mobile-data.png` | Training Data page |
| `/tmp/claru-mobile-labeling.png` | Expert Labeling page |
| `/tmp/claru-mobile-case-studies.png` | Case Studies page |
| `/tmp/claru-mobile-data-catalog.png` | Data Catalog page |
| `/tmp/claru-mobile-work-with-us.png` | Work With Us page |
