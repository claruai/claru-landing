import React from "react";
import { TOKENS } from "./DesignTokens";

// ---------------------------------------------------------------------------
// TerminalHeader — macOS-style terminal title bar with traffic light dots
// ---------------------------------------------------------------------------

export interface TerminalHeaderProps {
  /** Title text displayed next to the dots */
  title: string;
  /** Optional right-side status indicator */
  statusLabel?: string;
  /** Color for the status dot and label (default: accent) */
  statusColor?: string;
}

const DOT_COLORS = [
  "rgba(239, 68, 68, 0.5)",
  "rgba(234, 179, 8, 0.5)",
  "rgba(34, 197, 94, 0.5)",
];

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title,
  statusLabel,
  statusColor = TOKENS.colors.accent,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderBottom: `1px solid ${TOKENS.colors.accent}20`,
      }}
    >
      <div style={{ display: "flex", gap: 4 }}>
        {DOT_COLORS.map((c, i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: c,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          color: TOKENS.colors.muted,
        }}
      >
        {title}
      </span>
      {statusLabel && (
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: statusColor,
            }}
          />
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 9,
              color: statusColor,
            }}
          >
            {statusLabel}
          </span>
        </div>
      )}
    </div>
  );
};
