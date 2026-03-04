# PRD: Slide Deck Builder — Phase 1: Base Template Builder + AI Agent

## Introduction

Build a **Slide Deck Builder** module for the Claru admin portal that lets admins create, edit, and manage base sales presentation templates for first-call pitches to frontier AI labs. Templates are self-contained HTML slide decks with animations, keyboard/touch navigation, and a terminal-green aesthetic matching Claru's brand. An AI editing agent (Claude Agent SDK + MCP) provides a chat interface for real-time content generation and editing, backed by GTM strategy skills (positioning-angles, message-architecture, direct-response-copy). Phase 2 (not in scope) will add per-lead customization using lead data.

**Claru** sells "Expert Human Intelligence for AI Labs" — purpose-built training data for frontier AI companies working on video, robotics, multimodal, and vision models.

---

## Goals

- Give admins a visual tool to build and iterate on sales presentation templates without writing HTML/CSS
- Provide AI-powered content generation using Claude Agent SDK + MCP with access to Claru's GTM positioning skills
- Store templates in Supabase with version history so admins can track and revert changes
- Generate self-contained HTML presentations that work offline with zero external dependencies
- Enable export to PDF and full-screen browser presentation mode
- Establish the template system that Phase 2 will extend for per-lead deck customization

---

## Architecture References

### Slide Technology

Templates use the **frontend-slides** approach — self-contained HTML files with:
- Inline CSS + JavaScript, zero external CDN dependencies
- Keyboard navigation (arrow keys, spacebar), touch/swipe support
- Scroll-triggered animations and slide transitions
- Progress indicators and navigation dots
- Responsive design with reduced-motion accessibility
- **Terminal Green** design preset matching Claru's `--accent-primary: #00ff88` on `--bg-primary: #050505`

### Rendering Approach: Hybrid

- **Editor**: React components render slides directly for instant editing feedback
- **Preview iframe**: Full HTML generation for WYSIWYG accuracy
- **Export**: Same HTML generator produces self-contained files and PDF source

### Database Schema (3 new tables)

```sql
-- Base templates for sales presentations
CREATE TABLE slide_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  slides_json JSONB NOT NULL DEFAULT '[]',
  theme TEXT NOT NULL DEFAULT 'terminal-green',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Version history for templates
CREATE TABLE slide_template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES slide_templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  slides_json JSONB NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'terminal-green',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat history for AI agent per template
CREATE TABLE template_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES slide_templates(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Slide JSON Schema

Each slide in `slides_json` follows this structure:

```typescript
interface SlideData {
  id: string;              // UUID
  order: number;           // Position in deck
  layout: 'title' | 'title-body' | 'two-column' | 'image-left' | 'image-right' | 'quote' | 'blank';
  title: string;           // Slide headline
  body: string;            // Markdown content
  speaker_notes: string;   // Presenter notes (not shown in presentation)
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string;         // Color hex, gradient CSS, or image URL
  };
  metadata: Record<string, unknown>; // Extensible for future use
}

interface TemplateData {
  id: string;
  name: string;
  description: string;
  slides: SlideData[];
  theme: string;
  is_active: boolean;
}
```

### API Routes

```
GET    /api/admin/deck-builder              — List all templates
POST   /api/admin/deck-builder              — Create new template
GET    /api/admin/deck-builder/[id]         — Get template by ID
PATCH  /api/admin/deck-builder/[id]         — Update template
DELETE /api/admin/deck-builder/[id]         — Delete template
POST   /api/admin/deck-builder/[id]/duplicate — Duplicate template
POST   /api/admin/deck-builder/[id]/chat    — AI agent chat (streaming)
POST   /api/admin/deck-builder/[id]/generate — AI content generation wizard
GET    /api/admin/deck-builder/[id]/versions — Get version history
POST   /api/admin/deck-builder/[id]/versions — Save version snapshot
POST   /api/admin/deck-builder/[id]/export  — Export to PDF
```

All routes protected by existing admin JWT middleware.

### File Structure

```
src/
├── app/admin/deck-builder/
│   ├── page.tsx                         # Template list page
│   ├── DeckBuilderClient.tsx            # Client component for list
│   └── [id]/
│       ├── page.tsx                     # Template editor page
│       └── DeckEditorClient.tsx         # Client component for editor
│
├── app/api/admin/deck-builder/
│   ├── route.ts                         # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts                     # GET, PATCH, DELETE
│       ├── duplicate/route.ts           # POST
│       ├── chat/route.ts               # POST (streaming)
│       ├── generate/route.ts           # POST
│       ├── versions/route.ts           # GET, POST
│       └── export/route.ts            # POST
│
├── app/components/deck-builder/
│   ├── TemplateCard.tsx                 # Template list card
│   ├── SlideEditor.tsx                  # Individual slide editor
│   ├── SlidePreview.tsx                 # React slide preview component
│   ├── SlideSorter.tsx                  # Drag-and-drop slide reordering
│   ├── SlideLayoutPicker.tsx            # Layout selection UI
│   ├── ChatPanel.tsx                    # AI agent chat sidebar
│   ├── ChatMessage.tsx                  # Individual chat message
│   ├── GenerateWizard.tsx              # AI content generation wizard
│   ├── PresentationPreview.tsx          # iframe preview panel
│   ├── ExportMenu.tsx                   # Export options dropdown
│   └── VersionHistory.tsx              # Version history panel
│
├── lib/deck-builder/
│   ├── html-renderer.ts                 # Generates self-contained HTML from SlideData[]
│   ├── slide-themes.ts                  # Theme definitions (terminal-green, etc.)
│   ├── slide-layouts.ts                 # Layout templates
│   ├── ai-agent.ts                      # Claude Agent SDK + MCP setup
│   ├── ai-tools.ts                      # MCP tool definitions for slide manipulation
│   └── gtm-prompts.ts                  # System prompts incorporating GTM skills context
│
├── types/
│   └── deck-builder.ts                  # TypeScript interfaces
│
└── tests/e2e/
    └── deck-builder.spec.ts             # Playwright E2E tests
```

---

## Agent & Skill Assignments

Each user story specifies which agents and skills to invoke. Here is the full roster:

| Agent/Skill | Used For |
|---|---|
| `frontend-expert` agent | UI components, slide editor, chat panel, drag-drop, template list |
| `nextjs-expert` agent | API routes, server components, streaming endpoints |
| `supabase-expert` skill | Database migrations, Supabase client queries |
| `claude-developer-platform` skill | Claude Agent SDK setup, MCP tool definitions, streaming chat |
| `frontend-slides` skill | HTML renderer, slide themes, animation systems |
| `positioning-angles` skill | GTM content generation — finding the sales angle |
| `message-architecture` skill | GTM content generation — structuring narrative |
| `direct-response-copy` skill | GTM content generation — compelling slide copy |
| `code-reviewer` agent | Post-implementation review after EVERY user story |
| `webapp-testing` skill | Playwright E2E test creation using Playwright MCP |
| `commit` skill | Commit after each completed + reviewed user story |

### Post-Story Completion Protocol

After EVERY user story is implemented, the following MUST happen in order:

1. **Typecheck:** Run `npx tsc --noEmit` — must pass
2. **Lint:** Run `npm run lint` — must pass
3. **Build verification:** Run `npm run build` — must pass with zero errors
4. **Code Review:** Launch `code-reviewer` agent to review all changed files
5. **Browser verification** (UI stories only): Verify in browser using Playwright MCP at `http://localhost:3005`
6. **Commit:** Only after all checks pass, commit with descriptive message (with user confirmation)

---

## User Stories

### US-001: TypeScript Types & Slide Data Schema

**Description:** As a developer, I need TypeScript interfaces for templates, slides, and chat messages so all components share a single source of truth.

**Invoke:** `general-purpose` agent

**Acceptance Criteria:**
- [ ] Create `src/types/deck-builder.ts` with interfaces: `SlideData`, `SlideBackground`, `SlideLayout` (union type), `SlideTemplate`, `SlideTemplateVersion`, `TemplateChatMessage`
- [ ] `SlideData` includes: id, order, layout, title, body, speaker_notes, background, metadata
- [ ] `SlideTemplate` includes: id, name, description, slides (SlideData[]), theme, is_active, created_by, created_at, updated_at
- [ ] `SlideLayout` = `'title' | 'title-body' | 'two-column' | 'image-left' | 'image-right' | 'quote' | 'blank'`
- [ ] Export a `createEmptySlide()` factory function that returns a `SlideData` with UUID and sensible defaults
- [ ] Export a `createEmptyTemplate()` factory function that returns a `SlideTemplate` with one title slide
- [ ] Typecheck passes: `npx tsc --noEmit`
- [ ] **Unit Tests:** Test factory functions return valid shapes, UUID uniqueness, default values
- [ ] **Code Review:** Run code-reviewer agent to verify type correctness and completeness

---

### US-002: Supabase Database Migration

**Description:** As a developer, I need the three database tables (`slide_templates`, `slide_template_versions`, `template_chat_messages`) created in Supabase so the backend can persist data.

**Invoke:** `supabase-expert` skill

**Acceptance Criteria:**
- [ ] Create SQL migration file at `supabase/migrations/YYYYMMDD_create_deck_builder_tables.sql`
- [ ] `slide_templates` table created with all columns, defaults, and constraints as specified in Architecture References
- [ ] `slide_template_versions` table created with FK cascade to slide_templates
- [ ] `template_chat_messages` table created with role CHECK constraint and FK cascade
- [ ] Add indexes: `slide_templates(is_active)`, `slide_template_versions(template_id, version_number)`, `template_chat_messages(template_id, created_at)`
- [ ] Add `updated_at` trigger on `slide_templates` (auto-update on modification)
- [ ] Migration runs successfully against Supabase
- [ ] Typecheck passes
- [ ] **Unit Tests:** Verify migration is valid SQL (can parse without errors)
- [ ] **Code Review:** Run code-reviewer agent to verify schema design and constraints

---

### US-003: Template CRUD API Routes

**Description:** As an admin, I need API endpoints to create, read, update, delete, and list templates so the frontend can manage template data.

**Invoke:** `nextjs-expert` agent

**Acceptance Criteria:**
- [ ] `GET /api/admin/deck-builder` — returns `{ templates: SlideTemplate[] }` ordered by `updated_at DESC`
- [ ] `POST /api/admin/deck-builder` — creates template from `{ name, description?, theme? }`, returns `{ template }` with status 201. Auto-creates one empty title slide in `slides_json`
- [ ] `GET /api/admin/deck-builder/[id]` — returns `{ template }` or 404
- [ ] `PATCH /api/admin/deck-builder/[id]` — updates any subset of `{ name, description, slides_json, theme, is_active }`. When `is_active` set to true, unsets any other active template. Returns updated template
- [ ] `DELETE /api/admin/deck-builder/[id]` — deletes template and all related versions/messages (cascade). Returns 204
- [ ] All routes verify admin JWT via `verifyAdminToken` (consistent with `src/app/api/admin/leads/route.ts` pattern)
- [ ] All routes use `createSupabaseAdminClient()` for database access
- [ ] Error responses follow existing pattern: `{ error: string }` with appropriate HTTP status codes
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test validation (missing name → 400), auth (no token → 401), not found (bad ID → 404), is_active toggle logic
- [ ] **Code Review:** Run code-reviewer agent to verify API patterns match existing codebase conventions

---

### US-004: Template Duplicate & Version History API Routes

**Description:** As an admin, I need to duplicate templates and view/save version history so I can experiment safely and revert changes.

**Invoke:** `nextjs-expert` agent

**Acceptance Criteria:**
- [ ] `POST /api/admin/deck-builder/[id]/duplicate` — creates a copy of the template with name `"{original name} (Copy)"`, `is_active: false`. Returns `{ template }` with status 201
- [ ] `GET /api/admin/deck-builder/[id]/versions` — returns `{ versions: SlideTemplateVersion[] }` ordered by `version_number DESC`
- [ ] `POST /api/admin/deck-builder/[id]/versions` — saves current template state as a new version. Auto-increments `version_number`. Returns `{ version }` with status 201
- [ ] Version snapshots capture: `slides_json`, `name`, `description`, `theme` at time of save
- [ ] All routes verify admin JWT
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test duplicate naming, version auto-increment, version snapshot captures all fields
- [ ] **Code Review:** Run code-reviewer agent to verify implementation correctness

---

### US-005: HTML Slide Renderer

**Description:** As a developer, I need a function that converts `SlideData[]` + theme into a complete self-contained HTML presentation so we can power the preview iframe and export features.

**Invoke:** `frontend-slides` skill + `frontend-expert` agent

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/html-renderer.ts` with function `renderSlidesToHTML(slides: SlideData[], theme: string, options?: RenderOptions): string`
- [ ] Output is a complete HTML document (`<!DOCTYPE html>` through `</html>`) with all CSS and JS inline
- [ ] Supports all 7 slide layouts: title, title-body, two-column, image-left, image-right, quote, blank
- [ ] Includes keyboard navigation: ArrowRight/ArrowDown/Space = next, ArrowLeft/ArrowUp = previous, Escape = overview
- [ ] Includes touch/swipe gesture support for mobile
- [ ] Includes progress bar and slide counter (e.g., "3 / 12")
- [ ] Includes slide transition animations (fade or slide, configurable)
- [ ] Markdown in `body` field rendered to HTML (bold, italic, lists, code blocks, links)
- [ ] Speaker notes NOT rendered in presentation (only available in export metadata)
- [ ] Create `src/lib/deck-builder/slide-themes.ts` with at least 3 themes: `terminal-green` (default, matching Claru brand), `midnight-executive` (dark blue), `clean-white` (light corporate)
- [ ] Create `src/lib/deck-builder/slide-layouts.ts` with HTML/CSS templates for each layout type
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test HTML output contains DOCTYPE, each layout renders correctly, markdown parsing works, keyboard nav JS is present, theme styles are applied
- [ ] **Code Review:** Run code-reviewer agent to verify HTML quality, accessibility, and cross-browser compatibility

---

### US-006: Template List Page (`/admin/deck-builder`)

**Description:** As an admin, I want to see all my saved templates in a list so I can manage them, create new ones, and navigate to the editor.

**Invoke:** `frontend-expert` agent

**Acceptance Criteria:**
- [ ] Create server component at `src/app/admin/deck-builder/page.tsx` that fetches templates from Supabase
- [ ] Create client component `DeckBuilderClient.tsx` for interactive functionality
- [ ] Page header: breadcrumb `claru / admin / deck-builder`, consistent with `AdminDashboardHeader.tsx` pattern
- [ ] "New Template" button that opens a name input modal and POSTs to create endpoint, then navigates to editor
- [ ] Template cards in a grid (2 columns on desktop) showing: name, description (truncated), slide count, last modified date, active badge (green dot if `is_active`)
- [ ] Each card has actions: Edit (navigates to `/admin/deck-builder/[id]`), Duplicate, Set Active, Delete (with confirmation dialog)
- [ ] Empty state when no templates exist: message + prominent "Create your first template" CTA
- [ ] Search/filter bar to filter templates by name
- [ ] Matches existing admin aesthetic: dark terminal theme, `var(--bg-primary)`, `var(--accent-primary)`, `font-mono` accents
- [ ] Typecheck passes
- [ ] Verify in browser at `http://localhost:3005/admin/deck-builder` using Playwright MCP
- [ ] **Unit Tests:** Test template card rendering, empty state, active badge display, delete confirmation
- [ ] **Code Review:** Run code-reviewer agent to verify component patterns and accessibility

---

### US-007: Add Deck Builder to Dashboard Navigation

**Description:** As an admin, I want to see Deck Builder in the admin dashboard so I can navigate to it alongside other modules.

**Invoke:** `frontend-expert` agent

**Acceptance Criteria:**
- [ ] Add "Deck Builder" card to the modules array in `src/app/admin/dashboard/page.tsx`
- [ ] Icon: `Presentation` from lucide-react (or `LayoutTemplate` if better fit)
- [ ] Description: "Create and manage sales presentation templates with AI assistance"
- [ ] Stat: shows template count (e.g., "3 templates") fetched from Supabase
- [ ] Links to `/admin/deck-builder`
- [ ] Card styled consistently with existing module cards
- [ ] Typecheck passes
- [ ] Verify in browser at `http://localhost:3005/admin/dashboard` using Playwright MCP
- [ ] **Unit Tests:** Test module card renders with correct href and icon
- [ ] **Code Review:** Run code-reviewer agent to verify consistency with existing dashboard code

---

### US-008: Template Editor — Slide Panel & Layout

**Description:** As an admin, I want a split-pane editor layout where I can see my slides on the left and edit them on the right, so I have a productive editing workflow.

**Invoke:** `frontend-expert` agent

**Acceptance Criteria:**
- [ ] Create page at `src/app/admin/deck-builder/[id]/page.tsx` (server component fetching template)
- [ ] Create `DeckEditorClient.tsx` as the main client component
- [ ] Three-panel layout: slide sorter sidebar (left, ~200px), main editor (center), chat/preview toggle (right, ~350px)
- [ ] Left panel: vertical filmstrip of slide thumbnails (small previews rendered via React components)
- [ ] Clicking a thumbnail selects that slide for editing in the center panel
- [ ] Center panel: shows selected slide's editable fields — title (text input), body (textarea with markdown preview toggle), speaker notes (collapsible textarea), layout picker, background settings
- [ ] Right panel: tabs for "Preview" (iframe) and "AI Chat" (chat panel, built in US-012)
- [ ] Template name editable inline in the header bar
- [ ] Save button that PATCHes to API. Autosave after 5 seconds of inactivity (debounced)
- [ ] Back button returning to `/admin/deck-builder`
- [ ] "Present" button that opens full-screen HTML presentation in new tab
- [ ] Typecheck passes
- [ ] Verify in browser at `http://localhost:3005/admin/deck-builder/[id]` using Playwright MCP
- [ ] **Unit Tests:** Test slide selection state, autosave debounce logic, panel layout rendering
- [ ] **Code Review:** Run code-reviewer agent to verify component architecture and state management

---

### US-009: Slide Sorter — Add, Reorder, Duplicate, Delete Slides

**Description:** As an admin, I want to add new slides, reorder them via drag-and-drop, duplicate, and delete slides so I can structure my presentation.

**Invoke:** `frontend-expert` agent

**Acceptance Criteria:**
- [ ] "Add Slide" button at bottom of slide sorter adds a new `title-body` slide after the currently selected slide
- [ ] Drag-and-drop reordering of slide thumbnails (use native HTML5 drag-and-drop or a lightweight library — no heavy deps)
- [ ] Right-click context menu on slide thumbnails with: Duplicate, Delete, Move Up, Move Down
- [ ] Duplicate creates an exact copy inserted after the original
- [ ] Delete shows confirmation if more than 1 slide exists; prevent deleting the last slide
- [ ] Reordering updates `order` field on all affected slides
- [ ] All mutations update local state immediately (optimistic) and trigger autosave
- [ ] Typecheck passes
- [ ] Verify in browser — test drag-and-drop, add, duplicate, delete flows using Playwright MCP
- [ ] **Unit Tests:** Test slide array manipulation functions (add, reorder, duplicate, delete), order recalculation, last-slide protection
- [ ] **Code Review:** Run code-reviewer agent to verify drag-and-drop implementation and edge cases

---

### US-010: Slide Layout Picker & Background Settings

**Description:** As an admin, I want to choose from different slide layouts and customize the background so I can create visually varied presentations.

**Invoke:** `frontend-expert` agent

**Acceptance Criteria:**
- [ ] `SlideLayoutPicker.tsx` component showing visual thumbnails of all 7 layouts in a grid
- [ ] Clicking a layout updates the selected slide's `layout` field
- [ ] Current layout highlighted with accent border
- [ ] Background settings panel with:
  - Type selector: Solid Color / Gradient / Image
  - Solid: color picker input (hex value)
  - Gradient: two color pickers + direction selector (to-right, to-bottom, to-bottom-right)
  - Image: URL input field (image upload deferred to Phase 2)
- [ ] Background changes reflect immediately in the slide preview (React component)
- [ ] Typecheck passes
- [ ] Verify in browser — switch layouts, change backgrounds using Playwright MCP
- [ ] **Unit Tests:** Test layout switching updates state, background type changes, color picker value handling
- [ ] **Code Review:** Run code-reviewer agent to verify component API design

---

### US-011: Live Preview Panel (iframe)

**Description:** As an admin, I want a live preview of my presentation rendered as actual HTML in an iframe so I can see exactly how it will look when presented.

**Invoke:** `frontend-expert` agent + `frontend-slides` skill

**Acceptance Criteria:**
- [ ] `PresentationPreview.tsx` component renders an iframe with `srcdoc` set to the output of `renderSlidesToHTML()`
- [ ] Preview updates when slides change (debounced, 500ms after last edit)
- [ ] Preview navigates to the currently selected slide (post message to iframe to go to slide N)
- [ ] "Refresh Preview" button to force regeneration
- [ ] "Full Screen" button opens the HTML in a new browser tab
- [ ] iframe is sandboxed appropriately (`sandbox="allow-scripts"`)
- [ ] Preview panel shows a loading spinner while HTML is generating
- [ ] Typecheck passes
- [ ] Verify in browser — edit a slide and confirm preview updates using Playwright MCP
- [ ] **Unit Tests:** Test debounce timing, srcdoc generation triggers, postMessage slide navigation
- [ ] **Code Review:** Run code-reviewer agent to verify iframe security and performance

---

### US-012: AI Chat Panel — Claude Agent SDK + MCP Setup

**Description:** As an admin, I want a chat panel where I can talk to an AI agent that can edit my slides in real-time, so I can iterate on content quickly using natural language.

**Invoke:** `claude-developer-platform` skill + `nextjs-expert` agent

**Acceptance Criteria:**
- [ ] Create `src/lib/deck-builder/ai-agent.ts` — initializes Anthropic client with `ANTHROPIC_API_KEY` env var
- [ ] Create `src/lib/deck-builder/ai-tools.ts` — defines MCP tools the agent can call:
  - `edit_slide` — update title, body, or speaker_notes of a specific slide (by index or ID)
  - `add_slide` — insert a new slide at a position with content
  - `delete_slide` — remove a slide by index
  - `reorder_slides` — move a slide from one position to another
  - `set_slide_layout` — change a slide's layout
  - `set_slide_background` — change a slide's background
  - `get_all_slides` — read current template state (so agent can reason about full deck)
  - `set_template_theme` — change the presentation theme
- [ ] Create `src/lib/deck-builder/gtm-prompts.ts` — system prompt that includes:
  - Claru's positioning context (data quality for frontier AI labs, video/robotics/multimodal/vision)
  - Instructions for using GTM frameworks (positioning-angles, message-architecture, direct-response-copy)
  - Guidance on sales presentation best practices
  - Available tool descriptions
- [ ] Create `POST /api/admin/deck-builder/[id]/chat` route that:
  - Accepts `{ message: string, slides_json: SlideData[] }` in request body
  - Loads chat history from `template_chat_messages` table
  - Sends to Claude with tools and system prompt
  - Streams response back using `ReadableStream` (SSE or NDJSON)
  - When Claude calls a tool, returns the tool call as a streamed event so the frontend can execute it
  - Saves both user message and assistant response to `template_chat_messages`
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test tool definitions have correct schemas, system prompt contains required context, chat history loading, message persistence
- [ ] **Code Review:** Run code-reviewer agent to verify Claude SDK usage patterns, streaming implementation, and security (no API key leaks)

---

### US-013: AI Chat Panel — Frontend UI

**Description:** As an admin, I want the chat UI rendered in the right panel of the editor so I can send messages and see the AI's responses and tool calls in real-time.

**Invoke:** `frontend-expert` agent

**Acceptance Criteria:**
- [ ] `ChatPanel.tsx` component in right panel (toggled via tab alongside Preview)
- [ ] Message input at bottom with send button and Enter-to-send (Shift+Enter for newline)
- [ ] Chat history displayed as message bubbles: user messages right-aligned, assistant left-aligned
- [ ] Streaming assistant responses render incrementally (typewriter effect)
- [ ] When agent calls a tool (e.g., `edit_slide`), display a styled tool-call card showing what was changed (e.g., "Edited slide 3 title: 'New headline'")
- [ ] Tool calls automatically apply to the local slide state and trigger preview update
- [ ] Loading indicator while waiting for response
- [ ] Chat history loaded from API on editor mount
- [ ] Quick-action suggestion chips above input: "Improve headlines", "Add a closing slide", "Make it more compelling", "Restructure the flow"
- [ ] Matches terminal aesthetic: monospace font for code/tool calls, green accent for agent actions
- [ ] Typecheck passes
- [ ] Verify in browser — send a message, see streaming response, observe tool calls updating slides using Playwright MCP
- [ ] **Unit Tests:** Test message rendering, streaming state management, tool call parsing and application, suggestion chip clicks
- [ ] **Code Review:** Run code-reviewer agent to verify streaming UX patterns and state synchronization

---

### US-014: AI Content Generation Wizard

**Description:** As an admin, I want a "Generate with AI" wizard when creating a new template that guides me through audience definition and generates a complete first-draft presentation using GTM strategies.

**Invoke:** `claude-developer-platform` skill + `positioning-angles` skill + `message-architecture` skill + `direct-response-copy` skill

**Acceptance Criteria:**
- [ ] `GenerateWizard.tsx` modal component triggered by "Generate with AI" button on template list page (or in empty template editor)
- [ ] Step 1 — **Audience Profile**: Form fields for target company type (dropdown: AI lab, robotics company, video platform, autonomous vehicles, other), company stage (early, growth, enterprise), primary pain point (textarea), data modalities needed (checkboxes: video, robotics, multimodal, vision, text)
- [ ] Step 2 — **Generating** (loading state): Shows animated progress with stage indicators:
  - "Finding the best angle..." (positioning-angles)
  - "Structuring the narrative..." (message-architecture)
  - "Writing compelling copy..." (direct-response-copy)
  - "Building your presentation..."
- [ ] Step 3 — **Review**: Shows generated slide deck in a preview. Admin can accept (saves and opens editor) or regenerate
- [ ] Create `POST /api/admin/deck-builder/[id]/generate` route that:
  - Accepts audience profile data
  - Calls Claude with a multi-step prompt that incorporates positioning-angles framework (find the hook), message-architecture framework (structure: problem → agitation → solution → proof → CTA), and direct-response-copy framework (write converting headlines and body text)
  - Returns generated `SlideData[]` (typically 8-12 slides: title, problem, solution, capabilities, proof points, case study, pricing/next steps, CTA)
  - Streams progress events so UI can show stage indicators
- [ ] Generated deck follows a proven sales narrative arc:
  1. Title slide with hook headline
  2. Problem/pain point slide
  3. "The old way vs. the new way" comparison
  4. Claru's solution overview
  5. Capabilities breakdown (2-3 slides per modality selected)
  6. Social proof / case study
  7. How it works / process
  8. Call to action / next steps
- [ ] Typecheck passes
- [ ] Verify in browser — run through wizard, see generated deck using Playwright MCP
- [ ] **Unit Tests:** Test wizard step progression, form validation, API request payload construction, progress event parsing
- [ ] **Code Review:** Run code-reviewer agent to verify prompt engineering quality and GTM framework integration

---

### US-015: Export — HTML Download & PDF

**Description:** As an admin, I want to export my presentation as a self-contained HTML file or PDF so I can share it externally.

**Invoke:** `nextjs-expert` agent + `frontend-expert` agent

**Acceptance Criteria:**
- [ ] `ExportMenu.tsx` dropdown component in editor header with options: "Download HTML", "Export PDF", "Open in Browser"
- [ ] "Download HTML" triggers client-side download of `renderSlidesToHTML()` output as `.html` file (named `{template-name}.html`)
- [ ] "Export PDF" calls `POST /api/admin/deck-builder/[id]/export` which:
  - Generates HTML using the renderer
  - Uses a headless approach to convert to PDF (either `@react-pdf/renderer` for server-side, or return HTML and use client-side `window.print()` with print-optimized CSS as the MVP approach)
  - Returns PDF as binary download
- [ ] "Open in Browser" opens the HTML in a new tab using a data URL or blob URL
- [ ] PDF export includes all slides (one slide per page, landscape orientation)
- [ ] Export preserves theme styling and layout
- [ ] Typecheck passes
- [ ] Verify in browser — download HTML, open in browser, trigger PDF export using Playwright MCP
- [ ] **Unit Tests:** Test HTML filename generation, blob URL creation, export menu state management
- [ ] **Code Review:** Run code-reviewer agent to verify export implementation and file handling

---

### US-016: Version History Panel

**Description:** As an admin, I want to view and restore previous versions of my template so I can safely experiment and revert changes.

**Invoke:** `frontend-expert` agent

**Acceptance Criteria:**
- [ ] `VersionHistory.tsx` panel accessible via a "History" button in the editor header
- [ ] Opens as a slide-out drawer (right side) or modal
- [ ] Lists all versions with: version number, timestamp (relative: "2 hours ago"), slide count
- [ ] "Save Version" button at top to manually snapshot current state
- [ ] Auto-save creates a version before any AI generation (so you can revert if the AI output is bad)
- [ ] Click a version to preview it (read-only, in the preview iframe)
- [ ] "Restore" button on each version that replaces current `slides_json` with the version's data (with confirmation dialog)
- [ ] Typecheck passes
- [ ] Verify in browser — save version, view history, restore a version using Playwright MCP
- [ ] **Unit Tests:** Test version list rendering, restore confirmation flow, auto-version trigger logic
- [ ] **Code Review:** Run code-reviewer agent to verify version management implementation

---

### US-017: Playwright E2E Test — Template CRUD Flow

**Description:** As QA, I need an end-to-end test verifying the complete template management flow from creation through editing to deletion.

**Invoke:** `webapp-testing` skill (Playwright MCP)

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/deck-builder-crud.spec.ts`
- [ ] Test requires admin auth setup (login and set JWT cookie)
- [ ] Test flow:
  1. Navigate to `/admin/deck-builder`
  2. Verify empty state message shown
  3. Click "New Template", enter name "Test Sales Deck"
  4. Verify redirect to editor page `/admin/deck-builder/[id]`
  5. Verify template name appears in header
  6. Verify one default slide exists in the slide sorter
  7. Edit slide title to "Welcome to Claru"
  8. Add a new slide, verify slide count increases to 2
  9. Navigate back to `/admin/deck-builder`
  10. Verify "Test Sales Deck" appears in the template list
  11. Duplicate the template, verify "Test Sales Deck (Copy)" appears
  12. Delete the copy, verify it's removed from the list
  13. Delete the original, verify empty state returns
- [ ] Test includes assertions for all critical state transitions
- [ ] Test uses Playwright MCP for browser interaction
- [ ] Test handles async operations (waits for saves, navigations)
- [ ] Typecheck passes

---

### US-018: Playwright E2E Test — AI Chat & Generation Flow

**Description:** As QA, I need an end-to-end test verifying the AI chat and content generation features work correctly.

**Invoke:** `webapp-testing` skill (Playwright MCP)

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/deck-builder-ai.spec.ts`
- [ ] Test requires admin auth + `ANTHROPIC_API_KEY` env var
- [ ] Test flow — Chat:
  1. Navigate to an existing template in the editor
  2. Switch to "AI Chat" tab in right panel
  3. Type a message: "Add a slide about our video data capabilities"
  4. Send the message
  5. Wait for streaming response to complete
  6. Verify a new slide was added (slide count increased)
  7. Verify the new slide contains content related to "video"
- [ ] Test flow — Generate Wizard:
  1. Navigate to `/admin/deck-builder`
  2. Click "Generate with AI"
  3. Fill in audience profile (AI lab, growth stage, "need high-quality video training data")
  4. Click "Generate"
  5. Wait for generation to complete (may take 15-30 seconds)
  6. Verify preview shows a multi-slide deck (at least 6 slides)
  7. Click "Accept" to save
  8. Verify redirected to editor with the generated deck
- [ ] Test includes timeout handling for AI responses (60s max)
- [ ] Test uses Playwright MCP for browser interaction
- [ ] Typecheck passes

---

### US-019: Playwright E2E Test — Export & Present Flow

**Description:** As QA, I need an end-to-end test verifying the export and presentation features work correctly.

**Invoke:** `webapp-testing` skill (Playwright MCP)

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/deck-builder-export.spec.ts`
- [ ] Test flow:
  1. Navigate to a template with multiple slides in the editor
  2. Click "Open in Browser" from export menu
  3. Verify new tab opens with the HTML presentation
  4. Verify presentation shows slide 1 content
  5. Verify keyboard navigation works (press ArrowRight, verify slide 2 shown)
  6. Close the presentation tab
  7. Click "Download HTML" from export menu
  8. Verify file download initiated (check download event)
  9. Verify downloaded file is valid HTML (contains DOCTYPE)
  10. Click "Present" button (full-screen mode)
  11. Verify full-screen presentation opens
- [ ] Test uses Playwright MCP for browser interaction
- [ ] Test handles popup/new-tab scenarios
- [ ] Typecheck passes

---

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** — Test core logic, validation, and edge cases
2. **Code Review** — Run code-reviewer agent after implementation to verify correctness
3. **Type Safety** — All code must pass TypeScript strict mode (`npx tsc --noEmit`)
4. **Build Verification** — `npm run build` must succeed with zero errors
5. **Browser Verification** (UI stories) — Verify in browser using Playwright MCP at `http://localhost:3005`

End-to-end tests (Playwright) are defined in US-017, US-018, and US-019 to verify complete user flows.

---

## Functional Requirements

- **FR-1:** Admin can create a new slide template with a name and optional description
- **FR-2:** Admin can add, edit, reorder, duplicate, and delete slides within a template
- **FR-3:** Each slide supports 7 layout types: title, title-body, two-column, image-left, image-right, quote, blank
- **FR-4:** Each slide has editable: title, body (markdown), speaker notes, background (solid/gradient/image), layout
- **FR-5:** Live preview renders the complete HTML presentation in an iframe, updating within 500ms of edits
- **FR-6:** AI chat agent can edit slides, add/remove slides, change layouts/themes via natural language
- **FR-7:** AI chat uses Claude Agent SDK with MCP tools for structured slide manipulation
- **FR-8:** AI content generation wizard produces a complete 8-12 slide sales deck from audience profile
- **FR-9:** Content generation incorporates positioning-angles, message-architecture, and direct-response-copy GTM frameworks
- **FR-10:** Templates can be exported as self-contained HTML files with zero external dependencies
- **FR-11:** Templates can be exported as PDF (landscape, one slide per page)
- **FR-12:** "Present in Browser" opens the HTML presentation full-screen in a new tab
- **FR-13:** Version history allows saving snapshots and restoring any previous version
- **FR-14:** One template can be marked "active" (only one at a time) for Phase 2 lead customization
- **FR-15:** Template CRUD is persisted in Supabase with admin JWT auth
- **FR-16:** Chat history is persisted per template in Supabase
- **FR-17:** Deck Builder is accessible from the admin dashboard sidebar navigation

---

## Non-Goals (Out of Scope)

- **Per-lead deck customization** — deferred to Phase 2
- **Image upload to S3** — slides reference image URLs, not uploaded files
- **Collaborative editing** — single admin at a time
- **Mobile editing support** — admin tool is desktop-only
- **Custom CSS injection** — admins use the visual editor, not raw CSS
- **Slide animations editor** — transitions are theme-defined, not per-slide configurable
- **Template sharing/permissions** — all admins have equal access
- **Real-time collaboration** — no WebSocket/multiplayer editing
- **Custom font uploads** — themes use Geist Sans and JetBrains Mono (already in the project)

---

## Design Considerations

- Reuse existing admin aesthetic: `var(--bg-primary)`, `var(--accent-primary)`, `var(--border-subtle)`, `font-mono` accents
- Editor layout inspired by presentation tools (Keynote/Slides): filmstrip left, editor center, preview right
- Chat panel should feel native to the terminal aesthetic — monospace for tool calls, green highlights for AI actions
- Slide thumbnails in the sorter should be proportional mini-renders (16:9 aspect ratio)
- All modals and confirmation dialogs should match existing patterns (see `LeadDetailClient.tsx` delete confirmation)

---

## Technical Considerations

- **Claude Agent SDK:** Already installed (`@anthropic-ai/sdk` 0.75.0). Requires `ANTHROPIC_API_KEY` environment variable
- **Streaming:** Use `ReadableStream` with NDJSON events for chat streaming (consistent with modern Next.js patterns)
- **Markdown rendering:** Use a lightweight markdown-to-HTML converter (e.g., `marked` or custom regex for basic formatting) — avoid heavy deps
- **Drag-and-drop:** Use native HTML5 DnD API or `@dnd-kit/core` if needed — keep bundle small
- **iframe sandbox:** Use `sandbox="allow-scripts"` on preview iframe for security
- **Autosave:** Debounced PATCH with 5-second delay. Show save status indicator ("Saved", "Saving...", "Unsaved changes")
- **Performance:** HTML regeneration for preview should be <100ms for <20 slides. Debounce at 500ms
- **Environment:** Add `ANTHROPIC_API_KEY` to `.env.local` and document in README

---

## Success Metrics

- Admin can create a new template and have a working 8+ slide presentation within 5 minutes using the AI wizard
- AI chat agent successfully modifies slides >90% of the time without errors
- HTML export renders identically in Chrome, Firefox, and Safari
- PDF export produces a professional-looking document with correct layout
- Template editing autosave has zero data loss scenarios
- E2E tests pass in CI with <60 second runtime (excluding AI-dependent tests)

---

## Open Questions

1. Should we add a "presenter notes" view alongside the presentation (like Keynote presenter display)?
2. Should templates have tags/categories for organization as the template library grows?
3. Should the AI agent be able to search the web for company information (Phase 2 lead research), or only use provided context?
4. What is the maximum number of slides we should support per template? (Suggest: 30 for performance)
5. Should we support custom theme creation by admins, or only the preset themes?
