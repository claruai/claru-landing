# PRD: Deck Sharing, Mobile Optimization & Analytics

## Introduction

Turn the slide deck builder from a creation tool into a sales intelligence platform. Admins share decks via public URLs or tokenized lead-specific links. Viewers see mobile-optimized presentations. All engagement is tracked — which slides, how long, who viewed — feeding directly into the lead module for informed follow-up.

## Goals

- Enable external sharing of decks via clean public URLs (`/d/[slug]`)
- Support three sharing modes: public link, lead list share (tokenized), email invite (tokenized)
- Deliver mobile-optimized viewing experience (responsive CSS + optional custom mobile slides)
- Track viewer engagement per-slide with attribution to leads
- Surface analytics inline on the share panel (views, completion, viewers)
- Send engagement notifications when leads view shared decks
- Auto-generate og:image social previews from slide 1 screenshots

## Architecture Note (Updated)

The deck builder now uses a **slide-as-website architecture**:
- Each slide is served as a standalone web page at `/api/slide/[templateId]/[slideIndex]`
- Full presentations are served at `/api/slide/[templateId]/present`
- Media uses proxy URLs (`/api/media/s3?key=PATH`) that never expire — the proxy signs at request time
- S3 URLs in slide HTML are rewritten via `rewriteS3ToProxy()` from `src/lib/deck-builder/rewrite-s3-urls.ts`
- The `renderSlidesToHTML()` function is still available for offline export but is NOT the primary rendering path

The public viewer page (`/d/[slug]`) should leverage the server presentation route rather than calling `renderSlidesToHTML()` directly. This ensures media plays correctly, scripts load, and the rendering matches what the admin sees in present mode.

---

## User Stories

### US-001: Database migration — share settings, tokens, views tables
**Description:** As a developer, I need database tables for share settings, viewer tokens, and view analytics.

**Acceptance Criteria:**
- [x] Add `share_settings` JSONB column to `slide_templates` table with default `null`. Schema: `{ enabled: boolean, slug: string, expiry: string|null, gate_type: 'none'|'email'|'password', gate_value: string|null, cta_enabled: boolean, cta_text: string|null, cta_url: string|null, show_branding: boolean }`
- [x] Create `deck_share_tokens` table: id (UUID PK), template_id (FK → slide_templates CASCADE), lead_id (FK → leads, nullable), email (TEXT NOT NULL), token (TEXT UNIQUE NOT NULL), parent_lead_id (UUID nullable — for associating teammates), created_at, expires_at (nullable)
- [x] Create `deck_views` table: id (UUID PK), template_id (FK → slide_templates CASCADE), token_id (FK → deck_share_tokens, nullable), viewer_email (nullable), device_type (TEXT — 'desktop'|'mobile'|'tablet'), slides_viewed (JSONB — array of {index, duration_seconds}), total_duration_seconds (INT), completion_rate (DECIMAL), viewed_at (TIMESTAMPTZ DEFAULT now()), ip_address (TEXT nullable)
- [x] Add indexes: `deck_share_tokens(token)`, `deck_share_tokens(template_id)`, `deck_views(template_id, viewed_at)`, `deck_views(token_id)`
- [ ] Add unique constraint on `slide_templates` share_settings->slug (via a generated column or application-level check)
- [x] Add `html_mobile` optional field to SlideData type in `src/types/deck-builder.ts` (alongside existing `media_refs`)
- [x] Typecheck passes
- [ ] **Unit Tests:** Verify migration SQL is valid
- [ ] **Code Review:** Run code-reviewer agent

---

### US-002: Share settings API routes
**Description:** As an admin, I need API endpoints to get and update share settings for a template.

**Acceptance Criteria:**
- [ ] Create `GET /api/admin/deck-builder/[id]/share` — returns current share_settings or default (disabled)
- [ ] Create `PATCH /api/admin/deck-builder/[id]/share` — updates share_settings JSONB on the template
- [ ] Auto-generate slug from template name on first enable (kebab-case, unique). If slug conflicts, append random 4-char suffix
- [ ] Validate: slug is URL-safe (lowercase, hyphens, no spaces), expiry is valid date or null, gate_type is one of the 3 options
- [ ] Admin JWT auth required on both routes
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test slug generation, uniqueness handling, validation
- [ ] **Code Review:** Run code-reviewer agent

---

### US-003: Public viewer page — `/d/[slug]`
**Description:** As a viewer, I want to open a shared deck URL and see the full presentation without logging in.

**Acceptance Criteria:**
- [ ] Create `src/app/d/[slug]/page.tsx` as a server component (NO auth middleware)
- [ ] Add `/d/*` to middleware exclusions so auth doesn't block public access
- [ ] Fetch template by slug from share_settings JSONB (query: `slide_templates` where `share_settings->>'slug' = slug` AND `share_settings->>'enabled' = 'true'`)
- [ ] Check expiry — if expired, show an expiry page ("This link has expired")
- [ ] If gate_type is 'password', show password form before rendering deck
- [ ] If gate_type is 'email', show email capture form → auto-create lead with status 'pending' → then render deck
- [ ] If gate_type is 'none' or valid token provided, render deck directly
- [ ] **Render via server presentation route:** Fetch the presentation HTML from the internal `/api/slide/[templateId]/present` route (server-side fetch). This ensures media proxy URLs work, scripts load, and rendering matches present mode.
- [ ] Include og:image meta tag — URL to `/api/deck/[slug]/og-image` (built in US-004)
- [ ] Include og:title (deck name), og:description (deck description or "Presentation by Claru AI")
- [ ] No admin navigation, no app chrome — full-screen presentation only
- [ ] Check for `?t=[token]` query param — if present, validate against `deck_share_tokens`, track views attributed to that token
- [ ] Inject tracking script (from US-005) with the slug and token context
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test slug lookup, expiry check, gate rendering, token validation
- [ ] **Code Review:** Run code-reviewer agent

---

### US-004: OG image generation endpoint
**Description:** As a developer, I need an endpoint that returns a screenshot of slide 1 for social preview cards.

**Acceptance Criteria:**
- [ ] Create `GET /api/deck/[slug]/og-image` — no auth required
- [ ] Fetch the template by slug, navigate Playwright to `/api/slide/[templateId]/0` (the server-rendered slide route), capture screenshot
- [ ] Return the PNG image with `Content-Type: image/png` and cache headers (`Cache-Control: public, max-age=3600`)
- [ ] If template not found or sharing disabled, return a default Claru-branded 1200x630 placeholder
- [ ] Image should be 1200x630 (standard og:image size) — set Playwright viewport to 1200x630 or render at 1920x1080 then resize
- [ ] Reuse `captureSlideScreenshotFromUrl()` from `src/lib/deck-builder/slide-capture.ts`
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test 404 handling, cache headers
- [ ] **Code Review:** Run code-reviewer agent

---

### US-005: Analytics tracking in shared decks
**Description:** As a developer, I need lightweight JS injected into shared deck presentations that tracks viewer engagement.

**Acceptance Criteria:**
- [ ] Create `POST /api/deck/[slug]/track` — no auth, accepts analytics events
- [ ] Accepts body: `{ token?: string, event: 'view'|'slide_change'|'complete', slide_index?: number, duration?: number, device?: string }`
- [ ] On 'view' event: create a new `deck_views` row with device_type and ip_address, return `{ view_id }` so subsequent events can update it
- [ ] On 'slide_change' event: update the slides_viewed JSONB array on the view row (append new slide entry)
- [ ] On 'complete' event: update total_duration_seconds and completion_rate on the view row
- [ ] Create a tracking script module (vanilla JS, <50 lines) that gets injected into the presentation HTML by the `/d/[slug]` page:
  - Sends 'view' event on page load via `navigator.sendBeacon` (fallback: `fetch` with `keepalive: true`)
  - Sends 'slide_change' event on each slide transition with the slide index and time spent on previous slide
  - Sends 'complete' event on page unload with total duration
  - Includes the token from URL query params if present
  - Detects device type (mobile/desktop/tablet) from user agent
- [ ] No cookies, no localStorage — stateless tracking via beacon API
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test event handling, view row creation/update, beacon payload format
- [ ] **Code Review:** Run code-reviewer agent

---

### US-006: Share panel in the deck editor
**Description:** As an admin, I want a Share drawer in the editor to configure sharing and see basic analytics.

**Acceptance Criteria:**
- [ ] Create `src/app/components/deck-builder/SharePanel.tsx` — slide-out drawer from right (same pattern as VersionHistory)
- [ ] Triggered by a "Share" button in the editor header bar (alongside save, present, export, history)
- [ ] Toggle: sharing enabled/disabled
- [ ] Slug field: editable text input, auto-generated on first enable, shows full URL `{SITE_URL}/d/{slug}`
- [ ] Copy link button — copies the full URL to clipboard with a toast confirmation
- [ ] Expiry dropdown: Never, 7 days, 30 days, Custom date
- [ ] Gate selector: None, Email Capture, Password (with password input when selected)
- [ ] CTA toggle: enabled/disabled with text input and URL input when enabled
- [ ] Branding toggle: show/hide "Powered by Claru"
- [ ] Analytics summary section (inline, not separate page): Total views, Unique viewers, Avg completion rate — fetched from `GET /api/admin/deck-builder/[id]/analytics`
- [ ] Matches terminal/monospace aesthetic of existing editor
- [ ] Dismiss with X button or Escape key
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test form state management, slug copy functionality
- [ ] **Code Review:** Run code-reviewer agent

---

### US-007: Analytics summary API
**Description:** As an admin, I need an endpoint that returns aggregate analytics for a deck.

**Acceptance Criteria:**
- [ ] Create `GET /api/admin/deck-builder/[id]/analytics` — admin JWT auth required
- [ ] Returns: `{ total_views, unique_viewers, avg_completion_rate, views_by_day: [{date, count}], top_slides: [{index, avg_duration}], device_breakdown: {desktop, mobile, tablet} }`
- [ ] `total_views`: COUNT of deck_views rows for this template
- [ ] `unique_viewers`: COUNT DISTINCT of (token_id, viewer_email, ip_address) — best effort dedup
- [ ] `avg_completion_rate`: AVG of completion_rate across all views
- [ ] `views_by_day`: GROUP BY date, last 30 days
- [ ] `top_slides`: slides sorted by average duration (most engaged first)
- [ ] `device_breakdown`: GROUP BY device_type
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test aggregation queries, empty state handling
- [ ] **Code Review:** Run code-reviewer agent

---

### US-008: Lead list share — tokenized URLs
**Description:** As an admin, I want to share a deck to specific leads with unique tracked URLs.

**Acceptance Criteria:**
- [ ] Add a "Share to Leads" section in SharePanel
- [ ] Search/select leads from leads table (autocomplete by name or email)
- [ ] For each selected lead, create a `deck_share_tokens` row with a crypto-random token (32 chars hex via `crypto.randomBytes(16).toString('hex')`)
- [ ] Display the tokenized URL for each lead: `{SITE_URL}/d/{slug}?t={token}`
- [ ] "Send invites" button that sends emails to all selected leads via Resend
- [ ] Email template: branded (dark theme, sage green accent — match existing Claru email templates), includes lead name, deck title, and the tokenized link. Subject: "A presentation from Claru AI"
- [ ] Create `POST /api/admin/deck-builder/[id]/share/send` — accepts `{ lead_ids?: string[], emails?: string[], parent_lead_id?: string }`
- [ ] For lead_ids: create tokens + send emails to each lead's email
- [ ] Bulk support: select multiple leads, send all at once
- [ ] Previously shared leads shown with "Resend" option
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test token generation uniqueness, email payload construction, bulk send
- [ ] **Code Review:** Run code-reviewer agent

---

### US-009: Email invite share — non-lead recipients
**Description:** As an admin, I want to share a deck to email addresses not in my lead list.

**Acceptance Criteria:**
- [ ] Add an "Invite by Email" section in SharePanel below the lead list share
- [ ] Free-form email input (comma-separated or one at a time with Enter to add)
- [ ] Optional: associate with a parent lead via a dropdown ("Who is this person associated with?")
- [ ] Creates `deck_share_tokens` rows with lead_id null but parent_lead_id set if associated
- [ ] Sends invite email via the same Resend template
- [ ] Invited emails shown in a list with "Resend" and "Remove" options
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test email validation, parent lead association, token creation
- [ ] **Code Review:** Run code-reviewer agent

---

### US-010: Per-viewer analytics on lead detail page
**Description:** As an admin, I want to see deck engagement data on a lead's detail page.

**Acceptance Criteria:**
- [ ] Create `GET /api/admin/leads/[id]/deck-views` — returns all deck views attributed to this lead (via token_id → lead_id)
- [ ] On the LeadDetailClient page, add a "Deck Engagement" section showing:
  - List of decks this lead has viewed
  - For each: deck name, viewed date, completion rate, time spent, slides viewed count
  - Click to expand: slide-by-slide breakdown with duration per slide
- [ ] Sort by most recent view first
- [ ] If no views: show "No deck engagement yet"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test view aggregation per lead, empty state
- [ ] **Code Review:** Run code-reviewer agent

---

### US-011: Mobile-responsive CSS layer
**Description:** As a developer, I need the presentation renderer to inject mobile-responsive CSS so shared decks are usable on phones.

**Acceptance Criteria:**
- [ ] Add a `@media (max-width: 768px)` block to the presentation route's CSS output (`/api/slide/[templateId]/present`)
- [ ] Mobile CSS: switch from fixed 1920x1080 stage to fluid layout, scale text sizes proportionally, increase padding for touch, restack two-column layouts to vertical
- [ ] Swipe navigation: verify existing touch event handlers work on mobile viewport
- [ ] Progress indicator: switch from bottom bar to dots centered at bottom for mobile
- [ ] Hide any hover-only elements on touch devices
- [ ] Navigation: bigger touch targets, visible swipe hint on first load
- [ ] Add `html_mobile` optional field to SlideData type (alongside `media_refs`) — `html_mobile?: string`
- [ ] In the presentation route: if `slide.html_mobile` exists AND request is from mobile UA (check User-Agent), use it instead of `slide.html`
- [ ] Fallback: if no `html_mobile`, apply the responsive CSS layer to the desktop HTML
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright MCP at mobile viewport (375×812)
- [ ] **Unit Tests:** Test responsive CSS injection, html_mobile field handling, UA detection
- [ ] **Code Review:** Run code-reviewer agent

---

### US-012: Engagement notification emails
**Description:** As an admin, I want to be notified when a lead views my shared deck.

**Acceptance Criteria:**
- [ ] In the `POST /api/deck/[slug]/track` endpoint, when a 'view' event arrives with a valid token linked to a lead:
  - Look up the admin's email from `ADMIN_EMAIL` env var
  - Send a notification email via Resend: "Sarah (Reka AI) viewed your deck 'Q1 Sales Pitch' — 85% completion, 2min on slide 7 (pricing)"
  - Include a link to the deck editor's share panel
- [ ] Debounce: don't send more than 1 notification per lead per deck per hour (check existing deck_views for this token in the last hour)
- [ ] Email template matches existing Claru branding (bg #0a0908, accent #92B090, dark theme)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test debounce logic, email construction, token-to-lead lookup
- [ ] **Code Review:** Run code-reviewer agent

---

### US-013: Playwright E2E Test — Public share flow
**Description:** As QA, I need an end-to-end test verifying deck sharing and viewing.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/deck-sharing.spec.ts`
- [ ] Test flow:
  1. Admin creates a template with slides via API
  2. Admin enables sharing via PATCH share settings (slug: "test-share")
  3. Navigate to /d/test-share (no auth) — verify presentation renders
  4. Verify og:image meta tag is present
  5. Navigate slides with keyboard, verify slide transitions
  6. Verify analytics tracking: check that deck_views has a new row via API
  7. Admin opens share panel in editor — verify view count shows
- [ ] Test timeout: 60 seconds
- [ ] Typecheck passes

---

### US-014: Playwright E2E Test — Lead share with analytics
**Description:** As QA, I need an end-to-end test verifying tokenized lead sharing and per-viewer analytics.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/deck-lead-sharing.spec.ts`
- [ ] Test flow:
  1. Create a template and a lead via API
  2. Enable sharing, create a token for the lead via API
  3. Open /d/[slug]?t=[token] — verify deck renders
  4. Navigate through 3 slides
  5. Close the page (triggers 'complete' event)
  6. Admin fetches /api/admin/leads/[lead-id]/deck-views — verify view attributed to lead
  7. Verify slides_viewed array has 3 entries
  8. Verify completion_rate is calculated
- [ ] Test timeout: 60 seconds
- [ ] Typecheck passes

---

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** — Test core logic, validation, and edge cases
2. **Code Review** — Run code-reviewer agent after implementation
3. **Type Safety** — All code must pass TypeScript strict mode

End-to-end tests defined in US-013 and US-014.

---

## Functional Requirements

- FR-1: Each template has configurable share settings (enabled, slug, expiry, gate, CTA, branding)
- FR-2: Public share URLs at `/d/[slug]` render full presentations without auth, using the server presentation route
- FR-3: Tokenized URLs (`?t=[token]`) attribute viewer activity to specific leads
- FR-4: Email invites create tokens and send branded notification emails via Resend
- FR-5: Analytics track: page views, slide transitions, time per slide, completion rate, device type
- FR-6: Analytics summary (views, unique viewers, completion rate) shown inline on the share panel
- FR-7: Per-viewer engagement data visible on the lead detail page in admin
- FR-8: Mobile-responsive CSS layer injected by the presentation route for shared decks
- FR-9: Optional `html_mobile` field on slides for custom mobile layouts
- FR-10: Social preview (og:image) auto-generated from slide 1 via server-rendered slide route
- FR-11: Engagement notification emails sent when leads view shared decks (debounced)
- FR-12: Share slugs are unique, URL-safe, and auto-generated from deck name
- FR-13: Gate options: none, email capture (auto-creates lead), password protected
- FR-14: Expired links show a clean expiry page
- FR-15: All shared deck media uses `/api/media/s3?key=PATH` proxy URLs (never expire)

---

## Non-Goals (Out of Scope)

- No real-time live collaboration (multiple viewers editing simultaneously)
- No custom domains for share URLs (always claru.ai/d/ or site URL)
- No video conferencing integration (present via shared URL, not embedded in Zoom)
- No A/B testing of different deck versions on the same URL
- No GDPR consent banner (basic tracking without cookies, no PII beyond email if gated)
- No webhook integrations for analytics events (Phase 2+)
- No Slack/Teams notifications (email only for now)

---

## Technical Considerations

- **Public viewer page** must NOT be behind any auth middleware — add `/d/*` to middleware exclusions
- **Server presentation route** (`/api/slide/[templateId]/present`) already handles S3 URL rewriting, script isolation, and theme application. The public viewer page should fetch this HTML server-side and inject tracking + gate logic.
- **Media proxy** (`/api/media/s3?key=PATH`) provides permanent URLs. Shared decks use proxy URLs, so media never expires regardless of when the link is opened.
- **X-Frame-Options** — the `/api/slide/*` routes already have `SAMEORIGIN` (not `DENY`) for iframe embedding. The public viewer page renders inline, not in an iframe, so this doesn't matter for `/d/[slug]`.
- **OG image via Playwright** — reuse `captureSlideScreenshotFromUrl()` from `src/lib/deck-builder/slide-capture.ts` pointed at `/api/slide/[templateId]/0`
- **Analytics beacon** — use `navigator.sendBeacon()` for reliability on page unload. Fall back to `fetch` with `keepalive: true`
- **Token generation** — use `crypto.randomBytes(16).toString('hex')` for 32-char hex tokens
- **Slug uniqueness** — check at API level before saving. If conflict, append `-` + 4 random chars
- **Mobile detection** — User-Agent sniffing in the presentation route for `html_mobile` field selection. CSS media queries handle the responsive fallback.
- **View row lifecycle** — create on 'view' event (return view_id), update on 'slide_change' and 'complete'. Pass view_id via JS closure in the tracking script.

---

## Success Metrics

- Admins can share a deck in under 30 seconds (enable sharing, copy link)
- Shared decks load in under 3 seconds on mobile (LCP)
- 80%+ of shared deck views complete at least 50% of the slides
- Analytics visible to admin within 60 seconds of a lead viewing
- Lead detail page shows engagement data that informs follow-up conversations
- Media (videos, images) plays correctly in shared decks without expiration

---

## Resolved Decisions

- **Rendering:** Use server presentation route (`/api/slide/[templateId]/present`), not `renderSlidesToHTML()` directly
- **Media:** Proxy URLs via `/api/media/s3?key=PATH` — never expire, work in all contexts
- **No auth on viewer page:** Correct, `/d/[slug]` is public. Gate logic handles access control.
- **Mobile:** CSS-first responsive approach with optional `html_mobile` override per slide

## Open Questions

1. Should we support embedding decks in iframes on external sites? (embed code like YouTube)
2. Should analytics be real-time (WebSocket) or near-real-time (poll every 30s)?
3. Should we add a "Request Access" flow for decks that require approval instead of email/password gates?
4. Should mobile slides support a "card stack" navigation (vertical swipe through cards) instead of horizontal swipe?
5. Should we track forwarding — when a tokenized link is opened by a different IP than the original viewer?
