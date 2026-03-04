// =============================================================================
// Agent Modes — Three-mode architecture for the deck builder agent
// US-001: Mode types, config registry, and intent detection
// US-005: Mode-specific tool sets
// =============================================================================

import type Anthropic from "@anthropic-ai/sdk";
import { ORCHESTRATOR_TOOLS } from "./agents/orchestrator-tools";

// ---------------------------------------------------------------------------
// Mode Type
// ---------------------------------------------------------------------------

export type AgentMode = "strategist" | "art-director" | "page-builder";

// ---------------------------------------------------------------------------
// Mode Configuration Interface
// ---------------------------------------------------------------------------

export interface AgentModeConfig {
  mode: AgentMode;
  label: string;
  description: string;
  model: string;
  icon: string;
  placeholder: string;
}

// ---------------------------------------------------------------------------
// Mode Registry
// ---------------------------------------------------------------------------

export const AGENT_MODES: Record<AgentMode, AgentModeConfig> = {
  strategist: {
    mode: "strategist",
    label: "Strategist",
    description:
      "Plans deck structure, storylines, and narrative flow. Adds, removes, and reorders slides. Writes titles and body copy.",
    model: "claude-sonnet-4-20250514",
    icon: "compass",
    placeholder: "Build me a 10-slide sales deck for Reka AI...",
  },
  "art-director": {
    mode: "art-director",
    label: "Art Director",
    description:
      "Full creative control — designs slides with custom HTML, delegates to specialist agents, runs QA. The default all-purpose mode.",
    model: "claude-sonnet-4-20250514",
    icon: "palette",
    placeholder: "Redesign this slide with a bold stats layout...",
  },
  "page-builder": {
    mode: "page-builder",
    label: "Page Builder",
    description:
      "Direct HTML editing for fine-grained control. Reads and patches slide HTML, tweaks fonts, padding, colors, and layout details.",
    model: "claude-sonnet-4-20250514",
    icon: "code",
    placeholder: "Change the heading font to 64px and fix the padding...",
  },
};

// ---------------------------------------------------------------------------
// Intent Detection — Regex-based mode routing
// Returns null if the message fits the current mode (no switch needed)
// ---------------------------------------------------------------------------

// Signals that suggest the Strategist mode
const STRATEGIST_SIGNALS = [
  /\b(restructur|reorder|reorganiz)/i,
  /\badd\s+(a\s+)?slide/i,
  /\bremove\s+(a\s+|the\s+)?slide/i,
  /\bdelete\s+(a\s+|the\s+)?slide/i,
  /\bdeck\s+flow\b/i,
  /\bstoryline\b/i,
  /\boutline\b/i,
  /\bbuild\s+me\s+a\s+deck\b/i,
  /\bbuild\s+a\s+deck\b/i,
  /\bcreate\s+(a\s+|me\s+a\s+)?deck\b/i,
  /\bslide\s+order\b/i,
  /\bnarrative\b/i,
];

// Signals that suggest the Page Builder mode
const PAGE_BUILDER_SIGNALS = [
  /\bchange\s+the\s+font\b/i,
  /\bmake\s+it\s+\d+px\b/i,
  /\bedit\s+the\s+(heading|title|h1|h2|h3)\b/i,
  /\bfix\s+the\s+padding\b/i,
  /\bmove\s+this\s+div\b/i,
  /\bchange\s+background\s+to\b/i,
  /\bchange\s+the\s+background\s+to\b/i,
  /\bfont[\s-]size\b/i,
  /\bmargin\b/i,
  /\bpadding\b/i,
  /\bborder[\s-]radius\b/i,
  /\bz[\s-]index\b/i,
  /\bcss\b/i,
  /\bhtml\b/i,
  /\bselector\b/i,
  /\btweak\b/i,
];

// Signals that suggest the Art Director mode
const ART_DIRECTOR_SIGNALS = [
  /\bredesign\b/i,
  /\bmake\s+it\s+more\b/i,
  /\bimprove\s+this\b/i,
  /\bshow\s+me\s+options\b/i,
  /\bvariations?\b/i,
  /\bvisual\s+style\b/i,
  /\blook\s+and\s+feel\b/i,
  /\bbrand/i,
];

/**
 * Detect whether a user message suggests switching to a different mode.
 * Returns the suggested mode, or null if the message fits the current mode.
 */
export function detectModeIntent(
  message: string,
  currentMode: AgentMode,
): AgentMode | null {
  const trimmed = message.trim();

  // Check each mode's signals (skip the current mode)
  if (currentMode !== "strategist") {
    if (STRATEGIST_SIGNALS.some((p) => p.test(trimmed))) {
      return "strategist";
    }
  }

  if (currentMode !== "page-builder") {
    if (PAGE_BUILDER_SIGNALS.some((p) => p.test(trimmed))) {
      return "page-builder";
    }
  }

  if (currentMode !== "art-director") {
    if (ART_DIRECTOR_SIGNALS.some((p) => p.test(trimmed))) {
      return "art-director";
    }
  }

  // Message fits current mode — no switch needed
  return null;
}

// ---------------------------------------------------------------------------
// US-005: Mode-Specific Tool Sets
// ---------------------------------------------------------------------------

// Tool names allowed per mode
const STRATEGIST_TOOL_NAMES = new Set([
  "get_all_slides",
  "add_slide",
  "delete_slide",
  "reorder_slides",
  "restructure_deck",
  "edit_slide", // restricted to title/body only — cloned below
  "generate_section",
  "delegate_research",
  "get_deck_approach",
  "load_skill",
  "think",
]);

const PAGE_BUILDER_TOOL_NAMES = new Set([
  "get_slide_html",
  "set_slide_html",
  "patch_slide_html", // tool handler is created in another track (US-004)
  "edit_slide", // all fields allowed
  "get_media_assets",
  "get_site_media",
  "delegate_research",
  "think",
]);

/**
 * Build a restricted edit_slide tool definition that only allows
 * title and body fields (no image_url, layout, or legacy field/value).
 */
function buildStrategistEditSlide(
  baseTool: Anthropic.Tool,
): Anthropic.Tool {
  // Deep clone so we don't mutate the original
  const cloned: Anthropic.Tool = JSON.parse(JSON.stringify(baseTool));
  const props = (cloned.input_schema as Record<string, unknown>).properties as Record<
    string,
    unknown
  >;

  // Remove fields the strategist shouldn't use
  delete props.image_url;
  delete props.layout;
  delete props.field;
  delete props.value;

  // Update description to reflect the restriction
  cloned.description =
    "Edit a slide's title or body text. Only text content changes — no layout or image changes.";

  return cloned;
}

/**
 * Return the tool set for a given agent mode.
 *
 * - Strategist: structural tools + edit_slide (title/body only)
 * - Art Director: ALL ORCHESTRATOR_TOOLS (unchanged)
 * - Page Builder: HTML-level tools + edit_slide (all fields) + media tools
 */
export function getModeTools(mode: AgentMode): Anthropic.Tool[] {
  // Art Director gets everything — the default behavior
  if (mode === "art-director") {
    return ORCHESTRATOR_TOOLS;
  }

  if (mode === "strategist") {
    const tools: Anthropic.Tool[] = [];
    for (const tool of ORCHESTRATOR_TOOLS) {
      if (tool.name === "edit_slide") {
        // Clone with restricted fields
        tools.push(buildStrategistEditSlide(tool));
      } else if (STRATEGIST_TOOL_NAMES.has(tool.name)) {
        tools.push(tool);
      }
    }
    return tools;
  }

  if (mode === "page-builder") {
    const tools: Anthropic.Tool[] = [];

    // Pull matching tools from ORCHESTRATOR_TOOLS
    for (const tool of ORCHESTRATOR_TOOLS) {
      if (PAGE_BUILDER_TOOL_NAMES.has(tool.name)) {
        tools.push(tool);
      }
    }

    // Also pull tools that exist in SLIDE_TOOLS (ai-tools.ts) but not in
    // ORCHESTRATOR_TOOLS — like get_site_media. We import ORCHESTRATOR_TOOLS
    // as the single source, so any tool defined there with a matching name
    // will be picked up above. Tools like get_site_media may not be in
    // ORCHESTRATOR_TOOLS yet — if missing, they'll simply be absent from
    // the filtered set. The chat route's processToolCall from ai-tools.ts
    // can still handle them if they arrive.
    //
    // NOTE: patch_slide_html is listed in PAGE_BUILDER_TOOL_NAMES but its
    // tool definition is created in another track (US-004). It will be
    // included automatically once that definition is added to ORCHESTRATOR_TOOLS.

    return tools;
  }

  // Fallback (should never happen with the type system)
  return ORCHESTRATOR_TOOLS;
}
