// =============================================================================
// Agent Modes — Client-safe subset of agent-modes.ts
// Contains only types, config, and intent detection (no server-only imports).
// Import this from client components instead of agent-modes.ts.
// =============================================================================

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
