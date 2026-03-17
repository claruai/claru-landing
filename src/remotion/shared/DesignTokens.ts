// ---------------------------------------------------------------------------
// Design Tokens — shared constants for all Remotion compositions
// ---------------------------------------------------------------------------

export const TOKENS = {
  colors: {
    accent: "#92B090",
    accentAlt: "#4a90d9",
    text: "#e8e8e8",
    muted: "#888",
    panelBg: "rgba(10, 9, 8, 0.88)",
    error: "rgba(239, 68, 68, 0.8)",
    warning: "#f5a623",
    success: "#22c55e",
    chosen: "#22c55e",
    rejected: "#ef4444",
    selected: "#92B090",
  },
  fonts: {
    mono: "JetBrains Mono, monospace",
    sans: "Geist, sans-serif",
  },
  bbox: {
    hand: "#92B090",
    object: "#4a90d9",
    face: "#c084fc",
    violation: "#ef4444",
    highlight: "#f5a623",
    product: "#38bdf8",
  },
} as const;
