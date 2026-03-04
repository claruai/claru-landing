# PRD: Slide-as-Website Architecture

## Introduction

Refactor the deck builder's slide rendering from static HTML strings (`srcdoc` iframes) to server-rendered pages with full web capabilities. Each slide becomes its own mini website served via a Next.js API route, with access to signed S3 media, CDN scripts, live data fetching, and any web technology a landing page would use. The AI agent continues writing HTML/CSS/JS — it just gets served differently.

**The core problem:** Videos don't play because signed S3 URLs expire when baked into static HTML. Beyond that, slides can't reliably load external scripts, fetch live data, or use server-side capabilities. The current architecture treats slides as strings, not pages.

**The fix:** Each slide is a server-rendered page at `/api/slide/[templateId]/[slideIndex]`. The editor keeps `srcdoc` for instant feedback during editing. Present mode, shared links, and QA screenshots all use the server route. A media proxy at `/api/media/s3?key=...` provides permanent URLs for S3 assets.

## Goals

- S3 videos and images play reliably in all contexts (editor, present, shared links)
- Slides can load external scripts (GSAP, Google Fonts, chart libraries) from CDN
- Slides can fetch live data at render time (Supabase queries, API calls)
- Editor preview remains instant (no server round-trip on each keystroke)
- Present mode and shared links serve identical, server-rendered pages
- Existing decks with custom HTML continue working after migration
- The AI agent system (orchestrator, design agent, tools) needs minimal changes

## User Stories

### US-001: S3 Media Proxy Endpoint
**Description:** As a developer, I need a proxy endpoint that serves S3 media with fresh signed URLs so that slides can reference media with permanent, non-expiring URLs.

**Acceptance Criteria:**
- [ ] `GET /api/media/s3?key=video_capture/completed/.../file.MP4` returns a 302 redirect to a freshly signed S3 URL
- [ ] Signed URL has 1-hour expiry
- [ ] Response includes `Cache-Control: private, max-age=3000` so browsers cache for ~50 min
- [ ] Returns 400 if `key` param missing
- [ ] Rejects keys containing `..` or starting with `/` (path traversal protection)
- [ ] Works for video (mp4, webm, mov) and image (jpg, png, webp) files
- [ ] Test: `curl /api/media/s3?key=video_capture/completed/.../file.MP4` follows redirect and returns video bytes
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test key validation (reject traversal, reject empty), test redirect response shape, test cache headers
- [ ] **Code Review:** Run code-reviewer agent to verify security of key validation

### US-002: Server-Rendered Slide Route
**Description:** As a developer, I need a route that serves a single slide as a full HTML page so that present mode and shared links get server-rendered slides with fresh signed URLs.

**Acceptance Criteria:**
- [ ] `GET /api/slide/[templateId]/[slideIndex]` returns a complete HTML page for that slide
- [ ] Fetches template from Supabase, extracts the slide by sorted index
- [ ] If slide has custom `html` field, uses that as the slide content
- [ ] If slide has no custom HTML, generates content from layout system (`renderSlideLayout`)
- [ ] Applies theme (colors, fonts) from template settings
- [ ] All S3 references in HTML are resolved: `s3-placeholder.local` URLs, raw S3 bucket URLs, and `{{s3:key}}` tokens are replaced with `/api/media/s3?key=...` proxy URLs
- [ ] Sets `<base href>` to the app origin so relative URLs resolve correctly
- [ ] Returns `Content-Type: text/html` with `Cache-Control: private, no-cache`
- [ ] Returns 404 if template or slide not found, 400 if invalid index
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test S3 URL replacement patterns (placeholder, raw bucket, template token), test layout fallback, test error responses
- [ ] **Code Review:** Run code-reviewer agent to verify Supabase query patterns and error handling

### US-003: Presentation Controller Route
**Description:** As a developer, I need a route that serves the full presentation (all slides with navigation) as a server-rendered page, so that present mode uses real server-rendered slides instead of blob URLs.

**Acceptance Criteria:**
- [ ] `GET /api/slide/[templateId]/present` returns a full HTML presentation page
- [ ] Includes all slides, keyboard/touch navigation, progress bar, slide counter (same JS as current `renderSlidesToHTML`)
- [ ] Each slide's HTML has S3 references resolved to proxy URLs
- [ ] Uses the 1920×1080 fixed stage with `transform: scale()` to fit viewport
- [ ] Overview mode (Escape key) works
- [ ] Touch/swipe navigation works
- [ ] PostMessage API works (for `goToSlide` from editor)
- [ ] Returns complete self-contained HTML (all CSS/JS inline)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test slide ordering, test S3 URL resolution across all slides
- [ ] **Code Review:** Run code-reviewer agent to verify presentation JS logic

### US-004: Update Present Mode to Use Server Route
**Description:** As a user, I want the "present" button to open a server-rendered presentation so that videos play and media loads reliably.

**Acceptance Criteria:**
- [ ] Clicking "present" opens `/api/slide/[templateId]/present` in a new tab (not a blob URL)
- [ ] Remove blob URL creation and `URL.createObjectURL` logic from `handlePresent`
- [ ] Remove the `sign-urls` API endpoint (no longer needed)
- [ ] Videos autoplay on slide 6 (egocentric capture case study)
- [ ] Navigation works: arrow keys, space, swipe
- [ ] Progress bar updates correctly
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test that present URL is correctly constructed with template ID
- [ ] **Code Review:** Run code-reviewer agent to verify blob URL cleanup is complete

### US-005: Update Editor Preview to Use Media Proxy
**Description:** As a user, I want videos and images to preview correctly in the editor so that I can see media while editing slides.

**Acceptance Criteria:**
- [ ] Editor preview continues using `srcdoc` (no change to editing UX)
- [ ] Before injecting HTML into `srcdoc`, all S3 references are rewritten to use `/api/media/s3?key=...` proxy URLs (client-side rewrite, no server call needed)
- [ ] Create `rewriteS3ToProxy(html: string): string` utility that converts S3 references to proxy URLs
- [ ] Handles: `s3-placeholder.local/*` URLs, raw S3 bucket URLs (`moonvalley-annotation-platform.s3...`), `{{s3:key}}` tokens
- [ ] Already-proxied URLs (`/api/media/s3?key=...`) are left unchanged
- [ ] Videos play in the editor preview iframe
- [ ] Images from S3 display in the editor preview iframe
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test URL rewriting for each pattern (placeholder, bucket URL, token, already-proxied), test that non-S3 URLs are untouched
- [ ] **Code Review:** Run code-reviewer agent to verify regex patterns handle edge cases

### US-006: Update QA Screenshot Capture to Use Server Route
**Description:** As a developer, I need the auto-verify system to screenshot server-rendered slides so that QA sees exactly what users will see in present mode.

**Acceptance Criteria:**
- [ ] `autoVerifySlide()` in `server-tool-handlers.ts` navigates Playwright to `/api/slide/[templateId]/[slideIndex]` instead of rendering via `srcdoc`
- [ ] Must save the latest slide HTML to Supabase before taking the screenshot (so the server route serves the current version)
- [ ] Screenshot matches what present mode shows
- [ ] Videos appear as loaded frames (not black boxes) in screenshots
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test that correct URL is constructed for Playwright navigation
- [ ] **Code Review:** Run code-reviewer agent to verify Playwright usage patterns

### US-007: Update Design Agent Prompt for Proxy URLs
**Description:** As a developer, I need the design agent to use proxy URLs for media so that generated slides work immediately without post-processing.

**Acceptance Criteria:**
- [ ] Update `design-prompt.ts`: canvas description says slides are 1920×1080px served as web pages
- [ ] Add instruction: "For S3 media, use `/api/media/s3?key=PATH` as the URL. Example: `<video src="/api/media/s3?key=video_capture/completed/.../file.MP4" autoplay muted loop playsinline>`"
- [ ] Add instruction: "You can load external scripts from CDN: `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>`"
- [ ] Add instruction: "Google Fonts: `<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">`"
- [ ] Update `gtm-prompts.ts`, `ai-tools.ts` tool descriptions to mention proxy URLs
- [ ] Research agent's `get_dataset_samples` tool returns proxy URLs instead of signed URLs
- [ ] Remove `signSlideHtml` calls from `chat/route.ts` (no longer needed)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test that research agent returns proxy URL format
- [ ] **Code Review:** Run code-reviewer agent to verify all prompt references are consistent

### US-008: Migrate Existing Slide HTML to Proxy URLs
**Description:** As a developer, I need a migration script that rewrites S3 URLs in existing slide HTML to use proxy URLs so that current decks work with the new architecture.

**Acceptance Criteria:**
- [ ] Script reads all `slide_templates` with `slides_json` containing custom HTML
- [ ] For each slide with an `html` field, rewrites S3 references to `/api/media/s3?key=...` format
- [ ] Handles: `s3-placeholder.local/*` URLs, signed S3 bucket URLs (extracts key before `?`), double-signed URLs, `{{s3:key}}` tokens
- [ ] Script is idempotent — running twice produces the same result
- [ ] Script logs: templates processed, slides updated, URLs rewritten
- [ ] Saves updated `slides_json` back to Supabase
- [ ] Run on the demo deck (template `54f7930f-cf81-4c0d-8f66-28ddaf93476a`) and verify videos play in present mode
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test URL rewriting patterns, test idempotency (rewrite already-proxied URL returns same URL)
- [ ] **Code Review:** Run code-reviewer agent to verify migration safety

### US-009: Clean Up Legacy Signing Code
**Description:** As a developer, I need to remove the fragile URL signing code that's no longer needed so that the codebase is clean.

**Acceptance Criteria:**
- [ ] Delete `src/lib/deck-builder/sign-slide-urls.ts`
- [ ] Delete `src/app/api/admin/deck-builder/[id]/sign-urls/route.ts`
- [ ] Remove `signSlideHtml` import and calls from `chat/route.ts`
- [ ] Remove the sign-urls fetch from `DeckEditorClient.tsx` `handlePresent`
- [ ] Keep `src/lib/s3/presigner.ts` (still used by the media proxy and data catalog)
- [ ] Keep `src/app/api/media/s3/route.ts` (this is the new approach)
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run code-reviewer agent to verify no dead imports remain

### US-010: Add media_refs Field to SlideData
**Description:** As a developer, I need each slide to track which S3 media keys it references so that we can pre-warm caches, validate media exists, and track dependencies.

**Acceptance Criteria:**
- [ ] Add optional `media_refs` field to `SlideData` type: `media_refs?: string[]` — array of S3 object keys used in the slide
- [ ] When the design agent writes HTML via `delegate_design`, extract S3 keys from the HTML and populate `media_refs` on the slide data
- [ ] Extraction logic: parse `/api/media/s3?key=KEY` URLs from the HTML, collect unique keys
- [ ] Create `extractMediaRefs(html: string): string[]` utility function
- [ ] When `edit_slide` or `set_slide_html` updates a slide with HTML, re-extract `media_refs`
- [ ] `media_refs` is saved as part of `slides_json` (no Supabase schema change needed — it's inside the JSON)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test extraction from HTML with multiple video/image proxy URLs, test deduplication, test empty HTML returns empty array, test non-S3 URLs are excluded
- [ ] **Code Review:** Run code-reviewer agent to verify type safety and extraction regex

### US-011: Playwright E2E Test — Video Playback in Present Mode
**Description:** As QA, I need an end-to-end test verifying that videos play in presentation mode.

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/deck-video-playback.spec.ts`
- [ ] Test flow:
  1. Log in as admin
  2. Navigate to deck builder with the demo template
  3. Click "present" button
  4. Navigate to slide 6 (egocentric capture case study with videos)
  5. Wait for video elements to reach `readyState >= 2` (data loaded)
  6. Assert no video elements have `networkState === 3` (error)
  7. Assert at least one video is not paused (autoplay working)
- [ ] Test includes timeout handling for slow video loads
- [ ] Test runs successfully in CI environment
- [ ] Typecheck passes

### US-012: Playwright E2E Test — Editor Preview Media
**Description:** As QA, I need an end-to-end test verifying that media displays in the editor preview.

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/deck-editor-media.spec.ts`
- [ ] Test flow:
  1. Log in as admin
  2. Navigate to deck builder with the demo template
  3. Click on slide 6 thumbnail (the one with videos)
  4. In the main preview iframe, find video elements
  5. Assert video `src` or `source` elements contain `/api/media/s3?key=` URLs
  6. Assert video `networkState !== 3` (no error loading)
- [ ] Test runs successfully in CI environment
- [ ] Typecheck passes

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** - Test core logic, validation, and edge cases
2. **Code Review** - Run code-reviewer agent after implementation to verify correctness
3. **Type Safety** - All code must pass TypeScript strict mode

End-to-end tests (Playwright) are defined in US-011 and US-012 to verify complete user flows.

## Functional Requirements

- FR-1: `GET /api/media/s3?key=KEY` must return a 302 redirect to a freshly signed S3 URL with 1-hour expiry
- FR-2: `GET /api/slide/[templateId]/[slideIndex]` must return a complete HTML page for a single slide with all S3 references resolved to proxy URLs
- FR-3: `GET /api/slide/[templateId]/present` must return a full navigable presentation with all slides, keyboard/touch navigation, and media resolved
- FR-4: The "present" button must open the server route, not a blob URL
- FR-5: The editor preview must rewrite S3 references to proxy URLs before injecting into `srcdoc`
- FR-6: The design agent must generate slides using `/api/media/s3?key=...` for all S3 media
- FR-7: The research agent's `get_dataset_samples` tool must return proxy URLs, not signed or placeholder URLs
- FR-8: QA screenshots must use the server-rendered slide route
- FR-9: Existing decks must be migrated via a one-time script to rewrite S3 URLs to proxy format
- FR-10: Slides served via the server route can load external scripts (GSAP, Google Fonts, chart libraries) from CDN
- FR-11: The media proxy must reject path traversal attempts (`..`, leading `/`)

## Non-Goals (Out of Scope)

- **Auth on the media proxy** — Currently the S3 key itself is the access control. Adding auth to the media proxy is a separate concern for the deck sharing feature.
- **Server-side data fetching in slides** — While the server route enables this, implementing actual live data injection (e.g., pulling Supabase metrics into slide HTML at render time) is a future enhancement. This PRD only sets up the architecture.
- **Major data model changes** — `slides_json` stays as an array of `SlideData` objects. The only addition is an optional `media_refs` field for dependency tracking.
- **Real-time collaborative editing** — This is about rendering architecture, not multiplayer.
- **Mobile-specific slide rendering** — Covered in the deck sharing PRD.

## Design Considerations

- **Editor preview stays `srcdoc`** — Instant feedback when editing. A 500ms debounce timer already prevents thrashing. The only change is rewriting S3 URLs to proxy format before injection.
- **Present mode uses `window.open("/api/slide/[id]/present")`** — Clean URL, server-rendered, all media resolved. No more blob URLs.
- **The media proxy is a simple 302 redirect** — The browser follows the redirect transparently. S3 handles range requests natively (important for video seeking). The signed URL is ephemeral and never visible to the user.
- **The `<base href>` tag** — Set on server-rendered slides so that relative URLs like `/api/media/s3?key=...` resolve correctly even in iframes.

## Technical Considerations

- **S3 presigner** (`src/lib/s3/presigner.ts`) already handles both CloudFront and S3 fallback. The media proxy calls this.
- **Playwright screenshots** currently render slides by building HTML and loading in a browser context. Switching to navigating to the server route is simpler and more accurate.
- **The presentation JS** (keyboard nav, touch, overview mode) stays inline in the HTML — same as current `renderSlidesToHTML()`.
- **Existing `renderSlidesToHTML()`** is still useful for export (self-contained HTML file download). It should NOT be deleted, just no longer used for present mode or editor preview.
- **Race condition on QA screenshots** — The server route reads from Supabase, so slides must be saved before screenshots. The chat route should save updated `slides_json` to Supabase before calling `autoVerifySlide`.

## Success Metrics

- Videos play in present mode on slide 6 (the egocentric capture case study)
- Videos play in the editor preview
- Media loads within 3 seconds (redirect + S3 fetch)
- No more double-signing bugs or expired URL issues
- `npx tsc --noEmit` and `npm run build` pass
- E2E tests for video playback pass

## Resolved Decisions

- **Media proxy: 302 redirect** — Start with redirect. Switch to byte-streaming only if CORS or range request issues arise.
- **Server-rendered slide auth: none** — No auth on the slide route for now. Aligns with shared deck use case.
- **`media_refs` field: yes** — Add to `SlideData` for dependency tracking, pre-warming, and cache invalidation. See US-012.

## Open Questions

- Should the media proxy add CORS headers to the redirect response? Depends on whether slides served from different origins (shared decks) need to fetch media cross-origin.
- Should `media_refs` be auto-extracted from HTML on save, or only populated by the agent when it writes a slide? Auto-extraction is more reliable but adds parsing overhead.
