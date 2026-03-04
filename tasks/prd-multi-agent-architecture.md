# PRD: Multi-Agent Architecture for Slide Deck Builder

## Introduction

Rearchitect the slide deck builder's AI chat from a single monolithic agent into a coordinated team of specialist agents. The current single agent suffers from context rot (tool results filling the context window), self-evaluation bias (judging its own work), and role confusion (switching between strategist, designer, developer, and QA). The multi-agent approach gives each role fresh context, independent evaluation, and focused expertise — while the user still sees a single chat interface.

## Goals

- Eliminate context rot by giving each specialist agent a fresh context window scoped to its task
- Remove self-evaluation bias by having a separate QA agent that never sees the creation process
- Improve slide design quality by letting the Design Agent focus solely on HTML/CSS with full design reference
- Reduce token waste by keeping the orchestrator lean (no raw HTML or media inventories)
- Maintain the existing user experience — single chat panel, streaming responses, all existing features work
- Support parallel execution where possible to minimize latency
- Max 2 QA retry loops before delivering with a warning

## Architecture Overview

```
User sends message
       ↓
┌─────────────────────────────────────────────────┐
│  LEAD AGENT (Orchestrator)                       │
│  Model: Sonnet | Streams to user                 │
│  Sees: slide summaries, specialist verdicts       │
│  Never sees: raw HTML, media lists, screenshots   │
│  Tools: delegate_design, delegate_research,       │
│         delegate_qa, get_all_slides, edit_slide,  │
│         undo_slide, reorder_slides, delete_slide  │
│         restructure_deck                          │
└────────┬──────────┬──────────┬───────────────────┘
         │          │          │
    ┌────▼────┐ ┌───▼───┐ ┌───▼───┐
    │ DESIGN  │ │RESEARCH│ │  QA   │
    │ AGENT   │ │ AGENT  │ │ AGENT │
    │ Opus/   │ │ Haiku  │ │Sonnet │
    │ Sonnet  │ │        │ │       │
    └─────────┘ └────────┘ └───────┘
```

### Agent Roles

**Lead Agent (Orchestrator)** — Sonnet, streaming
- Talks directly to the user via the chat interface
- Interprets requests and delegates to specialists
- Receives concise verdicts from specialists (not raw data)
- Makes high-level decisions: which slides to change, narrative structure, deck flow
- Has tools for simple mutations (edit_slide title/body, reorder, delete) that don't need a specialist
- Delegates to Design Agent for any custom HTML, visual redesign, or complex layout work
- Delegates to Research Agent for web search, data catalog, or landing page content
- Delegates to QA Agent after Design Agent returns work

**Design Agent** — Opus for complex, Sonnet for simple
- Called per-slide (or batched for simple edits at orchestrator's discretion)
- Receives: slide data, design reference, spatial guide, media inventory, specific brief from orchestrator
- Returns: finished HTML + a brief self-note ("used 2-column layout with 3 stats")
- Fresh context every call — no conversation history
- Has the full design reference and GSAP reference injected in its system prompt
- Can search for videos by keyword via get_site_media
- Uses Opus for complex visual slides (custom HTML, video grids, animations)
- Uses Sonnet for simpler design tasks

**Research Agent** — Haiku
- Called when the orchestrator needs external information
- Receives: a focused research question
- Returns: concise 200-word brief (not raw search results or full page dumps)
- Has access to: web_search, get_data_catalog, get_landing_page_content
- Summarizes and filters — the orchestrator never sees raw tool output

**QA Agent** — Sonnet
- Called after the Design Agent returns work
- Receives: the screenshot (if available) + the HTML + the structural layout analysis
- Returns: PASS with a score, or FAIL with specific fixes listed
- Has NEVER seen the Design Agent's context — evaluates with completely fresh eyes
- Checks all 3 dimensions: Layout (centering, padding, balance), Content (typography, density, anchors), Interactions (GSAP triggers, animation timing)
- Has the design reference injected for evaluation criteria
- Max 2 retry loops: Design → QA → Fix → QA → deliver (with warning if still failing)

### Execution Flows

**Simple edit** (e.g. "change the title to X"):
```
User → Lead Agent → edit_slide tool → quality check → response
```
No specialist needed. Lead Agent handles directly. One API call.

**Complex slide redesign** (e.g. "redesign slide 5 with videos"):
```
User → Lead Agent (streams "Redesigning slide 5...")
  → Design Agent (Opus, fresh context, writes HTML)
  → QA Agent (fresh context, evaluates screenshot + HTML)
  → if FAIL: Design Agent again with QA feedback
  → if FAIL again: deliver with warning
  → Lead Agent (streams result: "Redesigned slide 5.")
```
3-5 API calls. ~10-20 seconds.

**Research + design** (e.g. "research Reka AI and build a custom slide"):
```
User → Lead Agent (streams "Researching Reka AI...")
  → Research Agent (Haiku, web search) ─┐
  → Lead Agent receives brief            │ parallel if independent
  → Design Agent (uses brief + media)   ─┘
  → QA Agent
  → Lead Agent (streams result)
```

**Multi-slide operation** (e.g. "redesign all slides"):
```
User → Lead Agent (decides: batch or sequential based on complexity)
  → For each slide (or batch of 3 for simple ones):
    → Design Agent (fresh context per slide)
    → QA Agent (fresh context per slide)
  → Lead Agent summarizes: "Redesigned 12 slides. 11 passed QA, 1 delivered with warning."
```

### Parallel Execution

The orchestrator should run independent operations in parallel:
- Research + Design (when design doesn't depend on research results)
- Multiple Design Agent calls for different slides
- QA checks on independently designed slides

Sequential when dependent:
- Research → Design (when design needs research output)
- Design → QA (QA needs design output)
- QA fail → Design retry (retry needs QA feedback)

---

## User Stories

### US-001: Agent System Prompts & Types
**Description:** As a developer, I need separate system prompts and type definitions for each agent role.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/types.ts` with interfaces: `AgentRole`, `AgentCall`, `AgentResult`, `DesignBrief`, `ResearchBrief`, `QAVerdict`
- [ ] `AgentRole` = `'orchestrator' | 'design' | 'research' | 'qa'`
- [ ] `DesignBrief` includes: slideIndex, currentSlideData, instruction, mediaContext (concise, not full inventory), designReference (boolean — whether to include)
- [ ] `ResearchBrief` includes: question, maxLength (default 200 words)
- [ ] `QAVerdict` includes: pass (boolean), score (1-10), issues (string[]), fixes (string[])
- [ ] `AgentResult` includes: role, result (string), slidesUpdated (SlideData[] | null), verdict (QAVerdict | null)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test type shapes, enum values
- [ ] **Code Review:** Run code-reviewer agent

---

### US-002: Orchestrator System Prompt
**Description:** As a developer, I need a lean system prompt for the Lead Agent that focuses on delegation and user communication.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/orchestrator-prompt.ts`
- [ ] System prompt includes: Claru positioning (brief), user communication guidelines, delegation rules
- [ ] Delegation rules: when to handle directly (simple title/body edits) vs delegate to Design Agent (custom HTML, visual work) vs Research Agent (web search, data lookup)
- [ ] Prompt is ~800 words max (currently the single agent prompt is ~3,000)
- [ ] Does NOT include: design reference, GSAP reference, spatial guide, media inventory
- [ ] Includes instructions to stream status updates: "Designing slide 5...", "Running quality check..."
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent

---

### US-003: Design Agent System Prompt
**Description:** As a developer, I need a focused system prompt for the Design Agent that contains all design knowledge.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/design-prompt.ts`
- [ ] Export `getDesignAgentPrompt(brief: DesignBrief)` that builds a focused prompt
- [ ] Includes: full slide design reference (McKinsey principles, spatial guide, layout templates), Claru visual identity (colors, fonts), GSAP reference (if brief.useAnimations), media search capability description
- [ ] Includes the specific brief: which slide, what to do, current slide data
- [ ] Includes concrete CSS values for the 1920×1080 canvas
- [ ] Does NOT include: GTM strategy, sales deck narrative arc, user conversation history
- [ ] Prompt tells the agent to return ONLY the HTML — no explanations, no bullet lists
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent

---

### US-004: Research Agent System Prompt
**Description:** As a developer, I need a system prompt for the Research Agent that returns concise briefs.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/research-prompt.ts`
- [ ] Export `getResearchAgentPrompt(question: string, maxWords: number)` that builds a focused prompt
- [ ] Instructs agent to: search, synthesize, return a brief under maxWords
- [ ] Output format: structured markdown with key facts, metrics, and sources
- [ ] Does NOT include: design knowledge, slide tools, HTML capabilities
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent

---

### US-005: QA Agent System Prompt
**Description:** As a developer, I need a system prompt for the QA Agent that evaluates slides independently.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/qa-prompt.ts`
- [ ] Export `getQAAgentPrompt()` that returns the QA system prompt
- [ ] Includes: full design reference, the 3-dimension quality framework (Layout, Content, Interactions), spatial guide with concrete px values
- [ ] Output format: JSON `{ pass: boolean, score: number, issues: string[], fixes: string[] }`
- [ ] Instructs agent to be critical — "you are a senior presentation designer reviewing work. Be honest. A score of 7+ passes."
- [ ] Does NOT include: GTM strategy, media inventory, conversation history
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent

---

### US-006: Agent Executor
**Description:** As a developer, I need a function that calls each specialist agent and returns structured results.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/executor.ts`
- [ ] Export `callDesignAgent(brief: DesignBrief, slides: SlideData[]): Promise<{ html: string, selfNote: string }>`
  - Calls Claude with design system prompt + brief
  - Uses Opus for complex (brief.complexity === 'high') or Sonnet otherwise
  - Parses HTML from response, returns it
  - Max tokens: 8192
- [ ] Export `callResearchAgent(question: string, maxWords?: number): Promise<string>`
  - Calls Claude Haiku with research prompt
  - Has access to web_search and get_data_catalog as tools
  - Returns the summarized brief text
  - Max tokens: 2048
- [ ] Export `callQAAgent(html: string, screenshot: string | null, layoutAnalysis: string): Promise<QAVerdict>`
  - Calls Claude Sonnet with QA prompt
  - Sends screenshot as image if available
  - Sends layout analysis as text
  - Parses JSON verdict from response
  - Max tokens: 2048
- [ ] Each function creates a fresh Anthropic client call with NO conversation history
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test brief construction, response parsing, error handling
- [ ] **Code Review:** Run code-reviewer agent

---

### US-007: Orchestrator Tool Definitions
**Description:** As a developer, I need to define the tools available to the Lead Agent (orchestrator).

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/orchestrator-tools.ts`
- [ ] Export `ORCHESTRATOR_TOOLS` — the tool definitions for the Lead Agent
- [ ] Tools the orchestrator keeps (direct execution):
  - `edit_slide` — simple title/body/image changes
  - `add_slide` — add a new slide with basic content
  - `delete_slide` — remove a slide
  - `reorder_slides` — move slides
  - `restructure_deck` — reorganize the deck
  - `undo_slide` — revert last change
  - `get_all_slides` — read slide overview
  - `get_slide_html` — inspect a slide's code
  - `set_template_theme` — switch themes
  - `apply_to_all_slides` — bulk simple changes
- [ ] New delegation tools (calls specialist agents):
  - `delegate_design` — params: `{ slide_index, instruction, complexity: 'simple'|'complex', use_animations: boolean }`
    - Orchestrator describes WHAT it wants, Design Agent figures out HOW
  - `delegate_research` — params: `{ question, max_words?: number }`
    - Returns concise brief, not raw search results
  - `delegate_qa` — params: `{ slide_index }`
    - Automatically captures screenshot + runs layout analysis, sends to QA agent
  - `generate_variations` — params: `{ slide_index, direction? }`
    - Calls Design Agent 3 times with different creative directions
- [ ] Orchestrator does NOT have: set_slide_html, get_site_media, get_gsap_reference, get_design_reference, web_search, get_data_catalog, get_landing_page_content, verify_slide
  - These are now internal to the specialist agents
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test tool definition schemas
- [ ] **Code Review:** Run code-reviewer agent

---

### US-008: Refactor Chat Route — Multi-Agent Loop
**Description:** As a developer, I need to refactor the chat API route to use the multi-agent architecture.

**Acceptance Criteria:**
- [ ] Modify `src/app/api/admin/deck-builder/[id]/chat/route.ts`
- [ ] The orchestrator (Lead Agent) streams to the user as before (NDJSON events)
- [ ] When the orchestrator calls `delegate_design`:
  1. Emit stream event: `{ type: "status", message: "Designing slide N..." }`
  2. Build a DesignBrief from the orchestrator's instruction
  3. Call `callDesignAgent(brief, slides)` — non-streaming
  4. Apply the returned HTML to the slide via internal `set_slide_html` logic
  5. Capture screenshot + run layout analysis
  6. Call `callQAAgent(html, screenshot, analysis)` — non-streaming
  7. If QA fails and retries < 2: call Design Agent again with QA feedback, then QA again
  8. Emit stream event: `{ type: "tool_result", name: "delegate_design", result: "Slide N redesigned. QA: PASS (8/10)" }`
  9. Return updated slides to orchestrator
- [ ] When the orchestrator calls `delegate_research`:
  1. Emit: `{ type: "status", message: "Researching..." }`
  2. Call `callResearchAgent(question)` — non-streaming
  3. Return the brief text to the orchestrator (NOT raw search results)
- [ ] When the orchestrator calls `delegate_qa`:
  1. Capture screenshot + run analysis
  2. Call `callQAAgent(...)` — non-streaming
  3. Return verdict to orchestrator
- [ ] Parallel execution: when the orchestrator makes multiple delegate calls in one turn that are independent, run them concurrently with `Promise.all`
- [ ] Undo manager still works — snapshot before mutations
- [ ] Chat history still persisted to Supabase
- [ ] The orchestrator's conversation history stays lean — specialist tool results are summarized (not raw HTML)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test delegation flow, QA retry loop, parallel execution
- [ ] **Code Review:** Run code-reviewer agent

---

### US-009: Status Events in ChatPanel
**Description:** As a user, I want to see what the agent team is doing while it works.

**Acceptance Criteria:**
- [ ] Add `{ type: "status", message: string }` to the stream event type in ChatPanel
- [ ] Render status messages as subtle inline indicators in the chat (not full message bubbles)
- [ ] Style: font-mono text-xs text-[var(--accent-primary)] with a subtle pulse animation
- [ ] Status messages auto-dismiss when the next event arrives
- [ ] Examples: "Designing slide 5...", "Running quality check...", "Researching Reka AI...", "QA: fixing layout issues (attempt 2/2)..."
- [ ] Typecheck passes
- [ ] Verify in browser
- [ ] **Code Review:** Run code-reviewer agent

---

### US-010: QA Verdict Display in Chat
**Description:** As a user, I want to see the QA agent's verdict after a slide is designed.

**Acceptance Criteria:**
- [ ] After `delegate_design` completes, show the QA verdict in the chat as a compact card
- [ ] Card shows: score (e.g. "8/10"), pass/fail badge, and issues list if any
- [ ] Pass: green badge "QA PASSED (8/10)"
- [ ] Fail after retries: orange badge "QA: 2 issues remaining" with the issues listed
- [ ] Screenshot shown below the verdict (existing screenshot rendering)
- [ ] Typecheck passes
- [ ] Verify in browser
- [ ] **Code Review:** Run code-reviewer agent

---

### US-011: Migrate Existing Tools to Agent Scopes
**Description:** As a developer, I need to reorganize existing tools so each agent only has access to its relevant tools.

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/agents/design-tools.ts` — tools the Design Agent can use internally:
  - `set_slide_html`, `get_site_media`, `get_design_reference`, `get_gsap_reference`
  - These are called by the Design Agent within its executor, not exposed to the orchestrator
- [ ] Create `src/lib/deck-builder/agents/research-tools.ts` — tools the Research Agent can use:
  - `web_search`, `get_data_catalog`, `get_landing_page_content`
- [ ] The QA Agent has NO tools — it receives data and returns a verdict
- [ ] Existing `src/lib/deck-builder/ai-tools.ts` becomes the orchestrator's tool set
- [ ] Remove tools from orchestrator that are now delegated: `set_slide_html`, `get_site_media`, `get_gsap_reference`, `get_design_reference`, `web_search`, `get_data_catalog`, `get_landing_page_content`, `verify_slide`, `generate_variations`
- [ ] Keep on orchestrator: `edit_slide`, `add_slide`, `delete_slide`, `reorder_slides`, `restructure_deck`, `undo_slide`, `get_all_slides`, `get_slide_html`, `set_template_theme`, `customize_theme`, `apply_to_all_slides`, `generate_section`, `get_media_assets`
- [ ] Add new orchestrator tools: `delegate_design`, `delegate_research`, `delegate_qa`
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test that each tool set contains the expected tools
- [ ] **Code Review:** Run code-reviewer agent

---

### US-012: Playwright E2E Test — Multi-Agent Design Flow
**Description:** As QA, I need an end-to-end test verifying the multi-agent design and QA flow.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/deck-builder-multi-agent.spec.ts`
- [ ] Test requires ANTHROPIC_API_KEY env var (skip if not set)
- [ ] Test flow:
  1. Navigate to a template editor
  2. Open AI Chat
  3. Send: "redesign slide 1 to be more visually impactful"
  4. Verify status messages appear ("Designing slide 1...", "Running quality check...")
  5. Verify QA verdict card appears (pass/fail with score)
  6. Verify slide 1 content has changed
  7. Verify the slide preview updates
- [ ] Test timeout: 90 seconds (multi-agent calls take longer)
- [ ] Uses Playwright MCP
- [ ] Typecheck passes

---

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** — Test core logic, agent prompt construction, response parsing
2. **Code Review** — Run code-reviewer agent after implementation
3. **Type Safety** — All code must pass TypeScript strict mode

End-to-end tests defined in US-012.

---

## Functional Requirements

- FR-1: The Lead Agent (orchestrator) streams responses to the user via NDJSON
- FR-2: Specialist agents are called non-streaming by the chat route
- FR-3: Each specialist agent gets a fresh context window with no conversation history
- FR-4: The Design Agent uses Opus for complex slides (custom HTML, video grids) and Sonnet for simpler designs
- FR-5: The QA Agent evaluates slides with the 3-dimension quality framework (Layout, Content, Interactions)
- FR-6: QA failures trigger max 2 retry loops (Design → QA → Fix → QA → deliver with warning)
- FR-7: The orchestrator's tool results are summarized — it never sees raw HTML, media inventories, or screenshots
- FR-8: Independent specialist calls run in parallel via Promise.all
- FR-9: Status events stream to the frontend showing current agent activity
- FR-10: The QA verdict (pass/fail, score, issues) is displayed in the chat UI
- FR-11: All existing features work: undo, version history, media upload, element picker, streaming, chat persistence
- FR-12: The frontend (ChatPanel) is unchanged — user sees one chat interface

---

## Non-Goals (Out of Scope)

- No new frontend components beyond status indicators and QA verdict cards
- No changes to the slide renderer, HTML canvas model, or preview system
- No changes to template CRUD, version history, or export
- No agent memory across sessions (each conversation starts fresh)
- No user-configurable agent behavior (fixed roles)
- No separate chat threads per agent — all communication flows through the Lead Agent

---

## Technical Considerations

- **Latency budget**: Design Agent (~3-8s for Opus, ~2-4s for Sonnet) + QA Agent (~2-3s) + screenshot capture (~1s) = ~6-12s per slide design. With parallel execution, multi-slide operations can overlap.
- **Cost**: Each user message that triggers design work costs 3-5 API calls instead of 1. But each call is more focused and uses fewer tokens. Net cost should be similar or slightly higher.
- **Model selection**: Opus for Design Agent on complex work (custom HTML with videos/animations), Sonnet for everything else. The model router logic from the current system can be reused to classify complexity.
- **Error handling**: If a specialist agent fails (API error, timeout), the orchestrator should report the failure to the user gracefully, not crash the stream.
- **Backward compatibility**: The `template_chat_messages` table stores orchestrator messages. Specialist agent calls are internal and not persisted as chat history.

---

## File Structure

```
src/lib/deck-builder/agents/
├── types.ts                # AgentRole, DesignBrief, QAVerdict, etc.
├── orchestrator-prompt.ts  # Lead Agent system prompt
├── orchestrator-tools.ts   # Tools available to the orchestrator
├── design-prompt.ts        # Design Agent system prompt builder
├── design-tools.ts         # Tools the Design Agent uses internally
├── research-prompt.ts      # Research Agent system prompt builder
├── research-tools.ts       # Tools the Research Agent uses internally
├── qa-prompt.ts            # QA Agent system prompt
└── executor.ts             # callDesignAgent, callResearchAgent, callQAAgent
```

Modified files:
```
src/app/api/admin/deck-builder/[id]/chat/route.ts  # Refactored for multi-agent
src/lib/deck-builder/ai-tools.ts                    # Becomes orchestrator tools
src/app/components/deck-builder/ChatPanel.tsx        # Status events + QA verdict
```

---

## Success Metrics

- Slide design quality improves measurably — QA pass rate > 70% on first attempt
- Context rot eliminated — orchestrator context stays under 4,000 tokens of tool results
- QA agent catches issues the old system missed (asymmetric layouts, label titles, etc.)
- User-perceived latency acceptable — status messages keep the user informed during 10-20s operations
- No regression in existing features (undo, export, version history, etc.)

---

## Open Questions

1. Should the Design Agent have access to the current deck's other slides for context (e.g. to maintain visual consistency across the deck)?
2. Should we add a "Style Agent" that defines the deck's visual system once and feeds it to every Design Agent call?
3. Should QA verdicts be persisted to a table for analytics on agent quality over time?
4. Should the user be able to override QA and say "ship it anyway" when QA fails?
