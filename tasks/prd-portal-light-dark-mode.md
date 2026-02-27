# PRD: Portal Light/Dark Mode Theme System

## Introduction

Add a light/dark mode toggle to the Claru portal (`/portal/*` routes) while keeping the main marketing landing page permanently dark-themed. The portal currently uses a dark terminal aesthetic matching the landing page, but clients using the portal for data browsing should have the option of a clean, light interface. The system will use CSS custom property overrides scoped exclusively to the portal layout, requiring zero changes to the marketing pages.

---

## Goals

- Give portal users a light/dark mode toggle with system preference detection and persistent selection
- Maintain the sage green (#92B090) accent brand identity across both themes
- Keep the marketing landing page (`/`, `/case-studies`, `/privacy`, `/terms`, etc.) permanently dark -- no theme toggle leaks
- Minimize code changes by leveraging the existing 100% CSS variable architecture (portal components already reference `var(--*)` exclusively)
- Ensure smooth transitions between themes with no flash of incorrect theme (FOIT)

---

## Non-Goals

- Theming the marketing landing page or admin dashboard
- Custom user-uploaded themes or accent color pickers
- Per-page theme overrides within the portal

---

## Architecture Overview

### Current State

| Aspect | Detail |
|--------|--------|
| **CSS Variables** | All defined in `globals.css` `:root` -- single dark palette |
| **Portal Layout** | `src/app/portal/layout.tsx` wraps all `/portal/*` routes |
| **Portal Nav** | `src/app/portal/PortalNav.tsx` -- client component with logo + nav |
| **Component Count** | ~23 portal-specific files, all use `var(--*)` for colors |
| **Hardcoded Colors** | None in `.tsx` files -- fully variable-driven |

### Target State

| Aspect | Detail |
|--------|--------|
| **Theme Library** | `next-themes` (lightweight, handles SSR, cookies, system detection) |
| **Theme Scope** | `ThemeProvider` wraps only portal layout, not root layout |
| **CSS Strategy** | `[data-theme="light"]` scoped selector overrides portal variables |
| **Persistence** | `localStorage` + cookie (for SSR flash prevention) |
| **Default Theme** | System preference (`prefers-color-scheme`), fallback to dark |

---

## Design Specifications

### Dark Theme (Current -- unchanged)

```css
/* Already defined in globals.css :root */
--bg-primary: #0a0908;
--bg-secondary: #121110;
--bg-tertiary: #1a1816;
--bg-elevated: #1f1d1a;
--bg-card: #161412;
--bg-card-hover: #1c1a17;
--text-primary: #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.85);
--text-tertiary: rgba(255, 255, 255, 0.6);
--text-muted: rgba(255, 255, 255, 0.4);
--accent-primary: #92B090;
--accent-secondary: #a8c4a6;
--accent-tertiary: #71946A;
--border-subtle: rgba(255, 255, 255, 0.08);
--border-medium: rgba(255, 255, 255, 0.15);
--border-strong: rgba(255, 255, 255, 0.25);
--border-accent: rgba(146, 176, 144, 0.4);
--error: #e57373;
--warning: #ffb74d;
```

### Light Theme (New)

```css
[data-theme="light"] .portal-theme-scope {
  --bg-primary: #FAFAF8;
  --bg-secondary: #F2F1EF;
  --bg-tertiary: #E8E7E4;
  --bg-elevated: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-card-hover: #F7F6F4;
  --text-primary: #1A1A1A;
  --text-secondary: rgba(26, 26, 26, 0.8);
  --text-tertiary: rgba(26, 26, 26, 0.55);
  --text-muted: rgba(26, 26, 26, 0.4);
  --accent-primary: #5E8A5A;       /* Slightly deeper sage for light bg contrast */
  --accent-secondary: #4A7346;
  --accent-tertiary: #92B090;
  --accent-glow: rgba(94, 138, 90, 0.15);
  --accent-glow-strong: rgba(94, 138, 90, 0.3);
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-medium: rgba(0, 0, 0, 0.12);
  --border-strong: rgba(0, 0, 0, 0.2);
  --border-accent: rgba(94, 138, 90, 0.3);
  --error: #d32f2f;
  --warning: #f57c00;
  --success: #5E8A5A;
}
```

### Theme Toggle UI

- Location: `PortalNav.tsx`, between nav items and sign-out button
- Style: Icon-only button (Sun/Moon icons from Lucide)
- Behavior: Cycles between light/dark (two-state toggle)
- Size: Same as existing nav buttons (h-4 w-4 icon, px-3 py-2 button)

---

## Technical Implementation

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next-themes` | `^0.4` | SSR-safe theme management with system preference detection |

### File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/portal/layout.tsx` | **Modify** | Wrap children with `PortalThemeProvider`, add `portal-theme-scope` class to wrapper div |
| `src/app/portal/PortalThemeProvider.tsx` | **Create** | Client component wrapping `next-themes` `ThemeProvider` scoped to portal |
| `src/app/portal/PortalNav.tsx` | **Modify** | Add theme toggle button between nav items and sign-out divider |
| `src/app/globals.css` | **Modify** | Add `[data-theme="light"] .portal-theme-scope` variable overrides |
| `src/app/portal/login/page.tsx` | **Modify** | Add `portal-theme-scope` class to root element (login is outside auth middleware, shares portal theming) |

### No Changes Required

All portal component files (`CatalogBrowser.tsx`, `DatasetCard.tsx`, `SampleViewer.tsx`, etc.) already use CSS variables exclusively. No `.tsx` file modifications needed for color values.

### Implementation Details

**1. PortalThemeProvider (`src/app/portal/PortalThemeProvider.tsx`)**

```tsx
"use client";
import { ThemeProvider } from "next-themes";

export function PortalThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      storageKey="claru-portal-theme"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
```

**2. Portal Layout Wrapper**

The `data-theme` attribute set by `next-themes` on `<html>` combined with the `.portal-theme-scope` class on the portal wrapper ensures CSS variable overrides only apply within the portal. The marketing site never renders `.portal-theme-scope`, so its dark theme is untouched.

**3. Theme Toggle Component**

```tsx
// Inline in PortalNav or extracted to PortalThemeToggle.tsx
const { theme, setTheme } = useTheme();
// Toggle: dark <-> light
// Icon: Moon (dark) / Sun (light)
// aria-label: "Switch to light/dark mode"
```

**4. Flash Prevention**

`next-themes` injects a blocking `<script>` to read the stored preference before hydration, preventing flash of wrong theme. The `storageKey: "claru-portal-theme"` keeps it separate from any future admin theme.

---

## User Stories

### Story 1: Install next-themes and create PortalThemeProvider

**Priority:** P0
**Agents:** `nextjs-expert`

Install the `next-themes` package and create the `PortalThemeProvider` client component. Update `portal/layout.tsx` to wrap children with the provider and add the `portal-theme-scope` class to the wrapper div. Verify the `data-theme` attribute toggles correctly on the HTML element.

**Acceptance Criteria:**
- `next-themes` installed and in `package.json`
- `PortalThemeProvider.tsx` created with correct config (`attribute="data-theme"`, `storageKey="claru-portal-theme"`, `enableSystem`)
- Portal layout wraps children with provider
- Portal wrapper div has `portal-theme-scope` class
- Marketing pages (`/`, `/case-studies`) unaffected

---

### Story 2: Define light theme CSS variables

**Priority:** P0
**Agents:** `frontend-expert`

Add the light theme variable overrides in `globals.css` using the `[data-theme="light"] .portal-theme-scope` selector. Include all background, text, accent, border, and semantic color overrides. Add a CSS transition on `background-color` and `color` properties within `.portal-theme-scope` for smooth theme switching.

**Acceptance Criteria:**
- Light theme variables defined under scoped selector
- All variable categories covered (bg, text, accent, border, semantic)
- Accent colors adjusted for WCAG AA contrast on light backgrounds
- Smooth 200ms transition on theme switch
- No visual changes to marketing landing page or admin dashboard
- `::selection` colors adapt to active theme

---

### Story 3: Add theme toggle to PortalNav

**Priority:** P0
**Agents:** `frontend-expert`

Add a theme toggle button to `PortalNav.tsx` between the navigation links and the sign-out divider. Use `Sun` and `Moon` icons from Lucide. Handle the mounted state to prevent hydration mismatch (icon should only render after mount). Match the existing nav button styling.

**Acceptance Criteria:**
- Toggle button appears in nav bar with correct icon (Sun for light, Moon for dark)
- Clicking toggles between light and dark modes
- No hydration mismatch warnings
- Button has proper `aria-label`
- Styled consistently with existing nav items
- Works on mobile (icon-only without label, same as other nav items on small screens)

---

### Story 4: Theme persistence and system preference

**Priority:** P1
**Agents:** `nextjs-expert`

Verify theme preference persists across page navigations and browser sessions via `localStorage`. Confirm system preference detection works (users who haven't chosen get their OS preference). Test no flash of incorrect theme on page load.

**Acceptance Criteria:**
- Theme choice persists in `localStorage` under `claru-portal-theme`
- New users default to system preference
- No flash of wrong theme on hard refresh
- Navigating between portal pages maintains theme
- Navigating to marketing pages and back maintains portal theme choice

---

### Story 5: Apply portal-theme-scope to login page

**Priority:** P1
**Agents:** `frontend-expert`

The login page (`/portal/login`) sits outside the auth middleware but should share portal theming. Ensure it's wrapped with the `portal-theme-scope` class and has access to the `PortalThemeProvider`. If the login page has its own layout or is outside the portal layout tree, adjust accordingly.

**Acceptance Criteria:**
- Login page respects light/dark theme
- Theme toggle accessible on login page (or inherits system preference)
- No hydration issues on login page
- Login form elements properly styled in both themes

---

### Story 6: QA and visual review across all portal pages

**Priority:** P1
**Agents:** `frontend-expert`

Manually review all portal pages in both light and dark modes. Check: nav, catalog grid, dataset detail, sample viewer, request form, login page. Verify contrast ratios meet WCAG AA, transitions are smooth, and no elements have hardcoded colors that break in light mode.

**Acceptance Criteria:**
- All portal pages visually correct in light and dark modes
- No text-on-background contrast issues (WCAG AA minimum)
- Form inputs, buttons, cards, modals all properly themed
- Loading states and error states styled correctly in both themes
- Scrollbar styling adapts to theme

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Light theme leaks to marketing pages | High | CSS scoping via `.portal-theme-scope` class -- only portal layout renders this class |
| Flash of incorrect theme on SSR | Medium | `next-themes` blocking script handles this; verify with hard refresh testing |
| Hardcoded colors in portal components | Low | Codebase audit shows 0 hardcoded colors in portal `.tsx` files -- all use CSS vars |
| `next-themes` conflicts with existing layout | Low | Provider is scoped to portal layout only, not root layout |
| Contrast issues in light mode | Medium | Story 6 includes WCAG AA audit; accent colors pre-adjusted in spec |

---

## Success Metrics

- Theme toggle works without page reload across all portal pages
- Zero visual regressions on marketing landing page
- No hydration warnings in console
- Theme persists across sessions
- System preference respected for first-time visitors
