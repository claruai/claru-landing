# PRD: Three-Mode Agent Architecture

## Introduction

Replace the single-agent deck builder with a three-mode system where each mode has its own agent configuration, tools, model, system prompt, and UX. The user explicitly selects a mode via tabs above the chat panel, and the system adapts everything — from what tools are available to how fast responses are.

**The core problem:** A single agent oscillates between restructuring the entire deck and tweaking CSS on one slide. It doesn't know what abstraction level the user wants, uses the heavy design→QA pipeline for simple text changes, and generates messy conversations.

**The fix:** Three modes — Strategist (deck outline), Art Director (creative direction per slide), Page Builder (hands-on HTML editing per slide). Each feels like a different product.

## Goals

- Each mode has a distinct personality, speed, and capability set
- Mode 3 (Page Builder) responses arrive in 2-5 seconds — no QA loop, no design delegation
- Mode 1 (Strategist) cannot accidentally modify slide HTML
- Mode switching is explicit (tab bar) with natural language detection as a supplement
- Chat history persists across mode switches
- The agent in each mode never does work outside its scope

## User Stories

### US-001: Mode type definition and configuration registry
**Description:** As a developer, I need a typed mode system that defines the configuration for each mode (tools, model, prompt builder, capabilities).

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agent-modes.ts`
- [ ] Export `AgentMode` type: `'strategist' | 'art-director' | 'page-builder'`
- [ ] Export `AgentModeConfig` interface: `{ mode, label, description, model, tools, getSystemPrompt, streamingBehavior }`
- [ ] Export `AGENT_MODES: Record<AgentMode, AgentModeConfig>` with all three mode configs
- [ ] Strategist config: model `claude-sonnet-4-20250514`, tools limited to structure/content only
- [ ] Art Director config: model `claude-opus-4-6` for complex / `claude-sonnet-4-20250514` for simple, full orchestrator tools with delegation
- [ ] Page Builder config: model `claude-sonnet-4-20250514`, direct HTML tools only, no delegation
- [ ] Export `getModeTools(mode: AgentMode): Anthropic.Tool[]` that returns filtered tool arrays
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test that each mode returns correct tool count, correct model, no tool overlap violations (strategist has no HTML tools, page builder has no restructure tools)
- [ ] **Code Review:** Run code-reviewer agent to verify type safety

### US-002: Strategist system prompt
**Description:** As a developer, I need a system prompt for the Strategist mode that focuses on deck structure and narrative flow.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/strategist-prompt.ts`
- [ ] Export `getStrategistPrompt(context)` — context includes deck name, description, slide outline (titles only), slide count
- [ ] Prompt persona: "Senior presentation strategist. McKinsey-trained. You structure the story."
- [ ] Prompt includes: full deck outline (all slide titles with indices), narrative flow analysis capability
- [ ] Prompt explicitly says: "You CANNOT modify slide HTML, CSS, or visual design. You work with titles, key messages, and slide order."
- [ ] Prompt can generate new decks from scratch: "When the deck is empty or user asks for a new deck, create a complete outline with titles and key messages for each slide."
- [ ] Execution rules: act first, explain briefly, no filler (same style as orchestrator-prompt.ts)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test prompt includes slide outline, test prompt excludes HTML/design references
- [ ] **Code Review:** Run code-reviewer agent to verify prompt quality

### US-003: Page Builder system prompt
**Description:** As a developer, I need a system prompt for the Page Builder mode that focuses on precise HTML/CSS execution.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/page-builder-prompt.ts`
- [ ] Export `getPageBuilderPrompt(context)` — context includes slide index, slide HTML (full source), theme, media assets
- [ ] Prompt persona: "Expert frontend developer. You execute exactly what the user asks. You are their hands on the keyboard."
- [ ] Prompt includes: current slide's full HTML source, available media proxy URL pattern, CDN/Google Fonts instructions
- [ ] Prompt explicitly says: "Execute the user's instruction precisely. Do NOT redesign or reinterpret. If they say 'make the heading 48px', change the heading to 48px — don't redesign the slide."
- [ ] Prompt says: "For small changes, use patch_slide_html. For large rewrites, use set_slide_html."
- [ ] Prompt says: "No QA needed. The user is looking at the slide and will tell you if something is wrong."
- [ ] Prompt includes research capability: "You can search for dataset samples and media to embed."
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test prompt includes slide HTML, test prompt excludes QA/delegation references
- [ ] **Code Review:** Run code-reviewer agent to verify prompt quality

### US-004: Page Builder tools — patch_slide_html
**Description:** As a developer, I need a surgical HTML patch tool for Mode 3 that can make targeted changes without rewriting the entire slide.

**Acceptance Criteria:**
- [ ] Add `patch_slide_html` tool to the tools registry
- [ ] Tool params: `{ slide_index: number, patches: Array<{ selector: string, action: 'replace' | 'setAttribute' | 'setStyle' | 'setText' | 'insertBefore' | 'insertAfter' | 'remove', value?: string }> }`
- [ ] Handler: parses the current slide HTML, applies patches using a DOM-like approach (regex or simple parser — no jsdom dependency)
- [ ] For `setStyle`: merges into existing inline style attribute
- [ ] For `setText`: replaces text content of matched element
- [ ] For `replace`: replaces entire matched element with new HTML
- [ ] Returns updated slides array with patched HTML
- [ ] Falls back gracefully if selector doesn't match (returns error message, doesn't crash)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test each patch action type, test selector matching, test no-match fallback, test style merging
- [ ] **Code Review:** Run code-reviewer agent to verify HTML parsing safety

### US-005: Strategist tool set
**Description:** As a developer, I need the filtered tool set for Strategist mode — structure and content tools only.

**Acceptance Criteria:**
- [ ] Strategist tools include: `get_all_slides`, `add_slide`, `delete_slide`, `reorder_slides`, `restructure_deck`, `edit_slide` (title and body only — no image_url or layout changes), `generate_section`, `delegate_research`, `get_deck_approach`, `load_skill`, `think`
- [ ] Strategist tools EXCLUDE: `delegate_design`, `delegate_qa`, `set_slide_html`, `patch_slide_html`, `get_slide_html`, `set_template_theme`, `customize_theme`, `generate_variations`, `generate_image`, `generate_video`, `apply_to_all_slides`
- [ ] `edit_slide` in strategist mode has `field` restricted to `["title", "body"]` only — no `image_url`, no `layout`
- [ ] Defined in `getModeTools('strategist')` in agent-modes.ts
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test tool array contains only allowed tools, test edit_slide schema restriction
- [ ] **Code Review:** Run code-reviewer agent to verify no design tools leak through

### US-006: Page Builder tool set
**Description:** As a developer, I need the filtered tool set for Page Builder mode — direct HTML editing and media access.

**Acceptance Criteria:**
- [ ] Page Builder tools include: `get_slide_html`, `set_slide_html`, `patch_slide_html`, `edit_slide` (all fields), `get_media_assets`, `get_site_media`, `delegate_research` (for finding dataset samples/media), `get_dataset_samples` (direct, no research agent needed), `think`
- [ ] Page Builder tools EXCLUDE: `delegate_design`, `delegate_qa`, `generate_variations`, `add_slide`, `delete_slide`, `reorder_slides`, `restructure_deck`, `generate_section`, `get_deck_approach`, `load_skill`
- [ ] Defined in `getModeTools('page-builder')` in agent-modes.ts
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test tool array contains only allowed tools, test no deck-structure tools present
- [ ] **Code Review:** Run code-reviewer agent to verify isolation

### US-007: Mode-aware chat route
**Description:** As a developer, I need the chat route to accept a `mode` parameter and configure the agent accordingly.

**Acceptance Criteria:**
- [ ] Modify `POST /api/admin/deck-builder/[id]/chat` to accept `mode: AgentMode` in the request body
- [ ] Default mode is `'art-director'` (backwards compatible)
- [ ] Based on mode, select: system prompt, tools, model, and whether to run QA after design
- [ ] Strategist mode: uses `getStrategistPrompt`, strategist tools, Sonnet model, no design delegation
- [ ] Art Director mode: uses existing `getOrchestratorPrompt`, full orchestrator tools, Opus/Sonnet routing, full design→QA pipeline
- [ ] Page Builder mode: uses `getPageBuilderPrompt`, page builder tools, Sonnet model, no delegation or QA
- [ ] Page Builder mode: injects full slide HTML into the system prompt context (so agent can read it without calling get_slide_html)
- [ ] Emit `{ type: "mode_info", mode: string }` stream event at the start of each response
- [ ] Mode is saved in chat message metadata_json for history
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test mode selection logic, test default mode, test tool filtering per mode
- [ ] **Code Review:** Run code-reviewer agent to verify no cross-mode tool leakage

### US-008: Mode tab bar UI component
**Description:** As a user, I want to see and switch between Strategy/Design/Build modes via a tab bar above the chat panel.

**Acceptance Criteria:**
- [ ] Create mode tab bar component in ChatPanel.tsx (or extract to separate component)
- [ ] Three tabs: `Strategy` | `Design` | `Build` with terminal-style aesthetic
- [ ] Active tab: sage green accent border-bottom + text, inactive: muted text
- [ ] Tabs use monospace font, compact height (~28px)
- [ ] Tab labels show mode icon: Strategy (📋), Design (🎨), Build (⚡)
- [ ] Clicking a tab sets the active mode in state
- [ ] Mode state passed to `sendMessage` so it's included in the API request body
- [ ] Default mode: `Design` (art-director)
- [ ] Chat input placeholder changes per mode: Strategist → "Describe your deck structure..." / Art Director → "Describe the design you want..." / Page Builder → "What should I change on this slide?"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test tab click changes mode state, test default mode, test placeholder text per mode
- [ ] **Code Review:** Run code-reviewer agent to verify accessibility (keyboard navigation, ARIA)

### US-009: Mode-specific suggestion chips
**Description:** As a user, I want the suggestion chips below the chat to change based on the current mode so I know what the mode can do.

**Acceptance Criteria:**
- [ ] Strategist chips: "Build a sales deck", "Restructure the flow", "Add a closing slide", "Improve the narrative"
- [ ] Art Director chips: "Redesign this slide", "Make it more impactful", "Add data visualization", "Show me 3 options"
- [ ] Page Builder chips: "Make heading bigger", "Add video grid", "Change background color", "Fix the spacing"
- [ ] Chips update immediately when mode tab is clicked
- [ ] Chips are defined in a config object, not hardcoded in JSX
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test chips change per mode
- [ ] **Code Review:** Run code-reviewer agent

### US-010: Fine-tune button on QA results
**Description:** As a user, after seeing a design result with QA, I want a "Fine-tune" button that switches me to Page Builder mode for that slide.

**Acceptance Criteria:**
- [ ] Add "Fine-tune" button to the QA action buttons (alongside Accept/Improve/Redo)
- [ ] Clicking "Fine-tune" switches mode to `page-builder`
- [ ] The chat input gets focus so user can immediately type a specific instruction
- [ ] A system message appears: "Switched to Build mode. Make specific edits to this slide."
- [ ] The mode tab bar reflects the change (Build tab active)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test button click changes mode, test system message appears
- [ ] **Code Review:** Run code-reviewer agent

### US-011: Natural language mode detection (supplement)
**Description:** As a developer, I need lightweight intent detection that suggests mode switches when the user's message clearly belongs to a different mode.

**Acceptance Criteria:**
- [ ] Create `detectModeIntent(message: string, currentMode: AgentMode): AgentMode | null` in agent-modes.ts
- [ ] Strategist signals: "restructure", "reorder", "add a slide", "remove slide", "deck flow", "storyline", "outline", "how many slides", "build me a deck"
- [ ] Page Builder signals: "change the font", "make it 48px", "edit the heading", "add this image here", "fix the padding", "move this div", "change background to"
- [ ] Art Director signals: "redesign", "make it more", "improve this", "show me options", "make this impactful"
- [ ] Returns null if the message fits the current mode (no switch needed)
- [ ] This does NOT auto-switch — it emits a suggestion: "This sounds like a [Build] task. Switch mode?" with a clickable action
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test each signal category, test null return when message fits current mode, test edge cases
- [ ] **Code Review:** Run code-reviewer agent

### US-012: Mode context in system prompt state block
**Description:** As a developer, I need the structured state block in the system prompt to include mode-specific context so the agent knows its boundaries.

**Acceptance Criteria:**
- [ ] Modify the state block builder in orchestrator-prompt.ts (or mode-specific prompts) to include mode context
- [ ] Strategist state: includes full deck outline (all titles, all indices), no slide HTML
- [ ] Art Director state: includes current slide info (index, title, has_html, layout), recent edits
- [ ] Page Builder state: includes current slide's full HTML (truncated to first 2000 chars in state block, full in system prompt), available media refs
- [ ] Each mode's state block explicitly says what the mode CAN and CANNOT do
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test state block content varies by mode
- [ ] **Code Review:** Run code-reviewer agent

### US-013: Playwright E2E Test — Mode switching flow
**Description:** As QA, I need an end-to-end test verifying mode switching works correctly.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/deck-agent-modes.spec.ts`
- [ ] Test flow:
  1. Log in as admin
  2. Navigate to deck builder with demo template
  3. Verify default mode is "Design" (tab highlighted)
  4. Click "Strategy" tab
  5. Verify suggestion chips change to strategy-related options
  6. Click "Build" tab
  7. Verify suggestion chips change to build-related options
  8. Send a message in Build mode
  9. Verify the response arrives (streaming works in Build mode)
  10. Click "Design" tab, verify mode switches back
- [ ] Test includes assertions for tab active state, chip content
- [ ] Typecheck passes

### US-014: Playwright E2E Test — Page Builder speed
**Description:** As QA, I need a test verifying that Page Builder mode responds faster than Art Director mode.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/deck-page-builder-speed.spec.ts`
- [ ] Test flow:
  1. Log in as admin, navigate to deck builder
  2. Switch to Build mode
  3. Send "change the title to Test Title"
  4. Measure time from send to "done" event
  5. Assert response time < 10 seconds (Page Builder should be 2-5s)
  6. Switch to Design mode
  7. Send "redesign this slide"
  8. Measure time from send to "done" event
  9. Assert Design mode response time > Page Builder response time
- [ ] Test requires ANTHROPIC_API_KEY (skip if not set)
- [ ] Typecheck passes

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** — Test core logic, validation, and edge cases
2. **Code Review** — Run code-reviewer agent after implementation to verify correctness
3. **Type Safety** — All code must pass TypeScript strict mode

End-to-end tests (Playwright) are defined in US-013 and US-014 to verify complete user flows.

## Functional Requirements

- FR-1: Three distinct agent modes: `strategist`, `art-director`, `page-builder`
- FR-2: Each mode has its own system prompt, tool set, model selection, and UX
- FR-3: Mode is selected via a tab bar above the chat panel (Strategy | Design | Build)
- FR-4: Default mode is `Design` (art-director) for backwards compatibility
- FR-5: Chat route accepts `mode` parameter and configures agent accordingly
- FR-6: Strategist mode can generate new decks from scratch AND restructure existing ones
- FR-7: Strategist mode CANNOT modify slide HTML, CSS, or visual design
- FR-8: Page Builder mode responds in 2-5 seconds with no QA loop or design delegation
- FR-9: Page Builder has both `set_slide_html` (full rewrite) and `patch_slide_html` (surgical edit) tools
- FR-10: Art Director mode retains the full design→QA pipeline from the current system
- FR-11: "Fine-tune" button on QA results switches to Page Builder mode
- FR-12: Chat history persists across mode switches
- FR-13: Mode is saved in message metadata for history reconstruction
- FR-14: Natural language mode detection suggests (does not auto-switch) mode changes
- FR-15: Suggestion chips change per mode
- FR-16: Mode-specific context injected into system prompt (deck outline for strategist, full HTML for page builder)

## Non-Goals (Out of Scope)

- **Auto-switching modes** — Detection suggests, user confirms. No silent mode changes.
- **Separate chat histories per mode** — One continuous chat, modes are just different agent configurations.
- **Mode-specific UI layouts** — The editor layout stays the same. Only the chat panel changes (tabs, chips, agent behavior).
- **Custom tool UIs per mode** — Tool result cards render the same way regardless of mode.
- **Collaborative/multi-user modes** — Single user, single mode at a time.

## Design Considerations

- **Tab bar aesthetic:** Matches the terminal/monospace design of the existing chat panel. Three compact tabs above the chat messages area. Active tab has sage green (#92B090) bottom border.
- **Mode transition:** Instant — no loading state needed. The system prompt changes, tools change, next message uses the new mode.
- **Fine-tune button:** Appears alongside existing Accept/Improve/Redo buttons. Uses the ⚡ icon and "Build" style (suggesting speed/precision).
- **Chat continuity:** When switching modes, a subtle divider line appears in the chat: "— switched to Build mode —" in muted text.

## Technical Considerations

- **Token efficiency:** Strategist prompt is lean (no HTML, no design reference). Page Builder prompt includes full slide HTML but no deck overview. Each mode loads only what it needs.
- **Model routing:** Strategist uses Sonnet (fast, structure-focused). Page Builder uses Sonnet (fast, code-focused). Art Director uses the existing Haiku/Sonnet/Opus routing based on complexity.
- **The `patch_slide_html` tool:** Needs a lightweight HTML manipulation approach. Using regex-based pattern matching for common operations (setAttribute, setStyle, setText) rather than a full DOM parser. Falls back to returning an error if the selector doesn't match — the agent can then use `set_slide_html` for a full rewrite.
- **Backwards compatibility:** If no `mode` parameter is sent, defaults to `art-director`. Existing chat history without mode metadata is treated as art-director.

## Success Metrics

- Page Builder responses arrive in < 5 seconds (vs 15-30s for Art Director with QA)
- Users switch modes at least once per session (indicating the modes are discoverable and useful)
- Strategist mode never produces HTML-level changes
- No "mode confusion" in agent responses (agent stays in its lane)
- `npx tsc --noEmit` and `npm run build` pass
- E2E tests pass

## Resolved Decisions

- **Mode auto-detect:** Suggestion chip only, not a hard switch. User clicks to confirm.
- **HTML source panel:** Not needed. Page Builder should feel like working with Claude Code — precise editing via chat, not a code editor.
- **Chat input placeholders:** Yes, change per mode. Strategist: "Describe your deck structure..." / Art Director: "Describe the design you want..." / Page Builder: "What should I change on this slide?"

## Open Questions

- None remaining.
