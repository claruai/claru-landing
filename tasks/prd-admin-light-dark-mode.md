# PRD: Admin Portal Light/Dark Mode Theme System

## Overview

Extend the existing portal light/dark mode theming system to the admin portal (`/admin/*` routes). Reuse the same `next-themes` infrastructure and CSS variable scoping pattern already implemented for `/portal/*`.

## Background

The portal (`/portal/*`) already has full light/dark mode support via:
- `next-themes` ThemeProvider scoped with `attribute="data-theme"`
- CSS variable overrides under `[data-theme="light"] .portal-theme-scope`
- Sun/Moon toggle in PortalNav

The admin portal (`/admin/*`) is currently dark-only. It needs the same treatment.

## Architecture

### Approach: Shared scope class

Rather than creating a separate `admin-theme-scope`, we'll reuse the existing `.portal-theme-scope` class and its CSS variable overrides. The class name is arbitrary — it just needs to match the CSS selector. We can rename it to a more generic `.app-theme-scope` if desired, but reusing `.portal-theme-scope` is simpler and avoids changing working code.

**Decision: Reuse `.portal-theme-scope` class on admin layout wrapper.**

### Theme Provider

Reuse the existing `PortalThemeProvider` component (or rename to `AppThemeProvider`). Both portal and admin share the same localStorage key (`claru-portal-theme`) so theme preference syncs across both areas.

## Files to Modify

### Admin Layout
- `src/app/admin/layout.tsx` — wrap with PortalThemeProvider, add `portal-theme-scope` class

### Theme Toggle — Add to Each Header
The admin has no shared nav component. Each page has its own header:
- `src/app/admin/dashboard/page.tsx` — has inline header, add toggle
- `src/app/admin/components/AdminJobsHeader.tsx` — add toggle
- `src/app/admin/catalog/AdminCatalogHeader.tsx` — add toggle
- `src/app/admin/leads/AdminLeadsHeader.tsx` — add toggle

### Hardcoded Colors to Fix
- `src/app/admin/dashboard/page.tsx` — `text-blue-400`, `text-purple-400`
- `src/app/admin/catalog/DatasetForm.tsx` — `text-red-400`, `bg-red-500/10`, `border-red-500/20`
- `src/app/admin/catalog/[id]/CatalogEditClient.tsx` — `text-red-400`, `bg-red-500/10`, `border-red-500/20`
- `src/app/admin/leads/AdminLeadsTable.tsx` — `text-red-400`, `bg-red-500/10`, `text-yellow-400`, `bg-yellow-500/10`
- `src/app/admin/components/AdminJobsTable.tsx` — `text-red-400`, `border-red-400/30`
- `src/app/admin/components/LeadDetailClient.tsx` — `text-red-400`, `border-red-400/30`

### Files to NOT Modify
- `src/app/admin/settings/page.tsx` — contains email template HTML with hardcoded hex colors. These are rendered in email clients, NOT in the browser. Leave them alone.
- `src/app/admin/page.tsx` — admin login already uses CSS variables perfectly.

## Color Mapping for Hardcoded → CSS Variable

| Hardcoded | Replace With |
|-----------|-------------|
| `text-red-400` | `text-[var(--error)]` |
| `bg-red-500/10` | `bg-[var(--error)]/10` |
| `border-red-500/20` | `border-[var(--error)]/20` |
| `text-red-400/30` | `text-[var(--error)]/30` |
| `border-red-400/30` | `border-[var(--error)]/30` |
| `text-red-400/60` | `text-[var(--error)]/60` |
| `text-yellow-400` | `text-[var(--warning)]` |
| `bg-yellow-500/10` | `bg-[var(--warning)]/10` |
| `border-yellow-500/20` | `border-[var(--warning)]/20` |
| `bg-yellow-500/5` | `bg-[var(--warning)]/5` |
| `text-blue-400` | `text-[var(--accent-tertiary)]` |
| `text-purple-400` | `text-[var(--accent-primary)]` |

## User Stories

### US-001: Wrap admin layout with ThemeProvider
- Update `src/app/admin/layout.tsx` to import and wrap with PortalThemeProvider
- Add `portal-theme-scope` class to the wrapper div
- Admin login page inherits the theme scope automatically
- Marketing pages remain unaffected

### US-002: Add theme toggle to admin dashboard header
- The dashboard page has an inline header (not a shared component)
- Add Sun/Moon toggle button before the [logout] link
- Use same mounted guard pattern as PortalNav
- Fix hardcoded `text-blue-400` and `text-purple-400` on module cards

### US-003: Add theme toggle to AdminJobsHeader, AdminCatalogHeader, AdminLeadsHeader
- All three headers follow the same pattern: breadcrumb left, actions right
- Add theme toggle button before [settings] link in each
- Use same mounted guard + useTheme pattern

### US-004: Fix hardcoded colors in catalog components
- `DatasetForm.tsx` — replace all `red-400`/`red-500` with `var(--error)`
- `CatalogEditClient.tsx` — replace all `red-400`/`red-500` with `var(--error)`

### US-005: Fix hardcoded colors in leads and jobs components
- `AdminLeadsTable.tsx` — replace `red-400`/`red-500`, `yellow-400`/`yellow-500`
- `AdminJobsTable.tsx` — replace `red-400`/`border-red-400`
- `LeadDetailClient.tsx` — replace `red-400`/`border-red-400`

### US-006: Visual QA of all admin pages in both themes
- Verify login page in both themes
- Verify dashboard in both themes
- Verify catalog list, edit, import pages
- Verify leads list and detail pages
- Verify jobs list page
- Verify settings page
- Check for zero console errors/hydration warnings
- Verify marketing page still dark
