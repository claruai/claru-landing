# PRD: Inline WYSIWYG Text Editing on Slides

## Introduction

Allow users to double-click text elements directly on the slide preview and edit them in-place, like Google Slides. Currently, even fixing a typo requires the AI chat. This adds a fast, direct editing path for text changes that complements the Page Builder chat mode for more complex edits. Includes a basic floating toolbar with bold, italic, and underline toggles.

## Goals

- Double-click any text element on the slide preview to edit it in-place
- Show a basic floating toolbar (bold, italic, underline) while editing
- Changes update the slide HTML and trigger autosave
- Works at any zoom level (Fit, 50%, 75%, 100%)
- Works for both custom HTML slides and layout-based slides
- Preserves existing inner HTML structure (styled spans, em, strong)
- Does not interfere with element selector mode or Page Builder chat

## User Stories

### US-001: Inline edit script for iframe injection
**Description:** As a developer, I need a JS script that enables contentEditable on text elements inside slide iframes when double-clicked.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/inline-edit-script.ts` exporting `getInlineEditScript(): string`
- [ ] Returns a `<script>` block (like SELECTOR_SCRIPT) that gets injected into slide iframes
- [ ] On double-click of a text element (h1, h2, h3, h4, p, span, li, td, th, blockquote, label), the element gets `contentEditable="true"` and receives focus
- [ ] Editable elements get a visible highlight: `outline: 2px solid #92B090; outline-offset: 2px; border-radius: 2px`
- [ ] Only one element editable at a time — clicking elsewhere or pressing Escape commits the edit and removes contentEditable
- [ ] On commit: sends PostMessage to parent with `{ type: 'inlineEdit', tag, text, innerHTML, originalInnerHTML, selector }` where selector is a best-effort CSS path to the element
- [ ] Ignore double-clicks on non-text elements (div with only child elements, img, video, svg, canvas, iframe)
- [ ] Detect text elements: element must have direct text node children OR be a heading/paragraph/list-item tag
- [ ] `contentEditable="true"` preserves existing inner HTML (bold, italic, links) — user can edit around them
- [ ] Ctrl+Z / Cmd+Z works natively within contentEditable (browser built-in)
- [ ] The script coexists with SELECTOR_SCRIPT — when selector mode is active, double-click editing is disabled
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test text element detection logic (which tags are editable, which are not)
- [ ] **Code Review:** Run code-reviewer agent

### US-002: Floating mini toolbar
**Description:** As a user, I want a small toolbar with bold/italic/underline while editing text so I can make basic formatting changes.

**Acceptance Criteria:**
- [ ] When a text element enters contentEditable mode, a floating toolbar appears above it
- [ ] Toolbar has 3 buttons: **B** (bold), *I* (italic), U̲ (underline)
- [ ] Each button toggles the formatting on the current selection using `document.execCommand('bold')` etc.
- [ ] Toolbar is positioned just above the editable element (using getBoundingClientRect)
- [ ] Toolbar style: `background: #121210; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.3)`
- [ ] Button style: `font-family: monospace; font-size: 13px; padding: 4px 8px; color: #fff; cursor: pointer; border-radius: 2px`
- [ ] Active formatting state: button gets `background: #92B090; color: #0a0908`
- [ ] Toolbar checks selection state on each `selectionchange` event to update active states
- [ ] Toolbar disappears when contentEditable is committed (blur/Escape)
- [ ] Toolbar is created as a DOM element inside the iframe (not in the parent)
- [ ] Toolbar doesn't interfere with the text editing — clicking toolbar buttons doesn't trigger blur on the editable element (use `mousedown.preventDefault()`)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test toolbar position calculation, active state detection
- [ ] **Code Review:** Run code-reviewer agent

### US-003: Inject inline edit script into slide iframes
**Description:** As a developer, I need the inline edit script injected into all slide preview iframes so double-click editing works.

**Acceptance Criteria:**
- [ ] Import `getInlineEditScript()` in DeckEditorClient.tsx
- [ ] Append the inline edit script to the `SELECTOR_SCRIPT` constant (or inject alongside it)
- [ ] Both `CenterSlidePreview` and `SlideThumbnail` iframes include the script
- [ ] For custom HTML slides: script appended to the `<body>` in the srcdoc HTML wrapper
- [ ] For layout slides: script included via `renderSlidesToHTML` or appended to srcdoc
- [ ] The script receives an `enableInlineEdit` / `disableInlineEdit` PostMessage to toggle (disabled during selector mode)
- [ ] When selector mode is active (`selectorMode` state), send `disableInlineEdit` to iframes
- [ ] When selector mode deactivates, send `enableInlineEdit`
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test PostMessage integration, mode toggling
- [ ] **Code Review:** Run code-reviewer agent

### US-004: Handle inline edit PostMessage and update slide data
**Description:** As a developer, I need the parent page to receive inline edit events and update the slide HTML accordingly.

**Acceptance Criteria:**
- [ ] Add `inlineEdit` handler to the existing PostMessage listener in DeckEditorClient.tsx (alongside `elementSelected`)
- [ ] When `inlineEdit` message received: compare `innerHTML` with `originalInnerHTML` — if different, update the slide
- [ ] For custom HTML slides (`slide.html` exists): find the element in the HTML string using the selector/tag/originalInnerHTML and replace innerHTML with the new value
- [ ] For layout-based slides (no `slide.html`): if the edited element is the title (h1/h2), update `slide.title`. If it's body text (p/li), update `slide.body`
- [ ] Call `updateCurrentSlide()` with the updated data to trigger re-render + autosave
- [ ] Snapshot the slide for undo before applying the change (using existing undo infrastructure if available)
- [ ] Show a subtle toast: "Text updated" (using existing showToast)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test HTML replacement logic (find element by selector, replace innerHTML), test layout slide field mapping (h1→title, p→body)
- [ ] **Code Review:** Run code-reviewer agent

### US-005: Disable inline editing on thumbnails
**Description:** As a developer, I need inline editing disabled on sidebar thumbnails since they're too small to edit.

**Acceptance Criteria:**
- [ ] `SlideThumbnail` iframes send `disableInlineEdit` PostMessage on load
- [ ] Or: the inline edit script checks a data attribute on the iframe (`data-no-edit`) and skips initialization
- [ ] Or: the inline edit script checks `window.innerWidth < 300` and disables itself in tiny viewports
- [ ] Double-clicking on a thumbnail does NOT trigger contentEditable
- [ ] Thumbnails still support click-to-select slide (existing behavior)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test thumbnail edit disabled condition
- [ ] **Code Review:** Run code-reviewer agent

### US-006: Playwright E2E Test — Inline text editing
**Description:** As QA, I need an end-to-end test verifying inline text editing works.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/deck-inline-edit.spec.ts`
- [ ] Test flow:
  1. Log in as admin, navigate to deck builder with demo template
  2. Select a slide with a visible heading (e.g., slide 3 "Full-Stack Data Infrastructure")
  3. Double-click on the heading text inside the center preview iframe
  4. Verify the element becomes editable (contentEditable="true")
  5. Type " — Updated" to append text
  6. Click elsewhere to commit
  7. Verify the slide data was updated (heading text changed)
  8. Verify autosave status shows "Saved"
- [ ] Timeout: 30 seconds
- [ ] Typecheck passes

---

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** — Test core logic, validation, and edge cases
2. **Code Review** — Run code-reviewer agent after implementation
3. **Type Safety** — All code must pass TypeScript strict mode

End-to-end tests defined in US-006.

---

## Functional Requirements

- FR-1: Double-clicking a text element in the slide preview makes it contentEditable
- FR-2: Only text elements are editable (headings, paragraphs, list items, spans with text) — not containers, images, or videos
- FR-3: A floating toolbar with bold/italic/underline appears above the edited element
- FR-4: Toolbar buttons toggle formatting via document.execCommand
- FR-5: Clicking outside the element or pressing Escape commits the edit
- FR-6: The edit is captured via PostMessage and updates the slide HTML string
- FR-7: For layout-based slides, the edit maps to the `title` or `body` field on SlideData
- FR-8: For custom HTML slides, the edit replaces the innerHTML in the HTML string
- FR-9: Changes trigger autosave via updateCurrentSlide
- FR-10: Inline editing is disabled during element selector mode
- FR-11: Inline editing is disabled on sidebar thumbnails
- FR-12: contentEditable preserves existing inner HTML structure (bold, italic, links, styled spans)
- FR-13: Browser-native undo (Ctrl+Z) works within the contentEditable session

## Non-Goals (Out of Scope)

- **No drag-and-drop** — Cannot move elements around on the slide
- **No resize handles** — Cannot resize text boxes or images
- **No font/size/color picker** — Just bold/italic/underline. Use Page Builder chat for advanced styling.
- **No new element creation** — Cannot add new text boxes by clicking empty space
- **No image editing** — Cannot crop, resize, or replace images inline
- **No layout changes** — Cannot change column structure or slide layout inline

## Design Considerations

- The floating toolbar uses the same dark terminal aesthetic as the rest of the editor
- The contentEditable highlight uses the sage green accent (`#92B090`) for consistency
- The toolbar appears above the element, not below, to avoid blocking content
- If the element is near the top of the viewport, toolbar can appear below instead

## Technical Considerations

- `document.execCommand` is deprecated but still works in all browsers and is the simplest approach for contentEditable formatting. The modern replacement (Input Events Level 2) is significantly more complex for no practical benefit here.
- The inline edit script must coexist with SELECTOR_SCRIPT in the same iframe — they share the `window.addEventListener('message')` handler
- For finding elements in the HTML string (US-004), use the same regex-based approach as `patch_slide_html`'s `buildSelectorRegex` and `findFullElement` helpers
- `mousedown.preventDefault()` on toolbar buttons prevents the editable element from losing focus when clicking formatting buttons

## Success Metrics

- Users can fix a text typo in under 3 seconds (double-click, type, click away)
- No regression in slide preview performance
- Works at all zoom levels without visual glitches

## Open Questions

- None remaining.
