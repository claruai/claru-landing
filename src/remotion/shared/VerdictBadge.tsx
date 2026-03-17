import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TOKENS } from "./DesignTokens";

// ---------------------------------------------------------------------------
// VerdictBadge — subtle verdict indicator (PASS/FAIL/SELECTED/REJECTED)
// Sophisticated research-tool aesthetic. No crown, trophy, stamp, or flash.
// ---------------------------------------------------------------------------

export interface VerdictBadgeProps {
  /** Verdict text (e.g. "PASS", "FAIL", "SELECTED", "REJECTED") */
  verdict: string;
  /** Badge color */
  color: string;
  /** Visual variant */
  variant: "label" | "border-glow" | "badge";
  /** Animation style */
  animationStyle: "fade" | "glow";
  /** Frame at which animation starts (default: 0) */
  animateFrom?: number;
  /** Duration of entrance animation in frames (default: 20) */
  animationDuration?: number;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  color,
  variant,
  animationStyle,
  animateFrom = 0,
  animationDuration = 20,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [animateFrom, animateFrom + animationDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Glow pulse after fully visible
  const glowOpacity =
    animationStyle === "glow" && progress >= 1
      ? 0.3 +
        0.15 * Math.sin((frame - animateFrom - animationDuration) * 0.1)
      : 0;

  if (variant === "border-glow") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `2px solid ${color}`,
          borderRadius: 4,
          opacity: progress * 0.7,
          boxShadow: `0 0 ${12 + glowOpacity * 20}px ${color}50`,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (variant === "label") {
    return (
      <span
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          color,
          letterSpacing: 1,
          fontWeight: 600,
          opacity: progress,
          textShadow:
            animationStyle === "glow" ? `0 0 6px ${color}60` : undefined,
        }}
      >
        {verdict}
      </span>
    );
  }

  // variant === "badge"
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 3,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}50`,
        fontFamily: TOKENS.fonts.mono,
        fontSize: 9,
        fontWeight: 600,
        color,
        letterSpacing: 0.8,
        opacity: progress,
        boxShadow:
          animationStyle === "glow"
            ? `0 0 ${8 + glowOpacity * 16}px ${color}30`
            : undefined,
      }}
    >
      {verdict}
    </div>
  );
};
