import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TOKENS } from "./DesignTokens";

// ---------------------------------------------------------------------------
// BottomBar — CLARU-branded timestamp bar with scrub indicator
// ---------------------------------------------------------------------------

export interface BottomBarProps {
  /** Current time in seconds */
  timeS: number;
  /** Optional phase or status label shown beside timestamp */
  phaseLabel?: string;
  /** Opacity [0, 1] — controlled by parent for fade-in */
  opacity?: number;
  /** Right-side inset in pixels to accommodate side panel (default: 0) */
  rightInset?: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  timeS,
  phaseLabel,
  opacity = 1,
  rightInset = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: rightInset,
        height: 32,
        backgroundColor: "rgba(10, 9, 8, 0.85)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 16,
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10,
          color: TOKENS.colors.accent,
        }}
      >
        CLARU
      </span>
      <span
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          color: TOKENS.colors.muted,
        }}
      >
        t={timeS.toFixed(1)}s
      </span>
      {phaseLabel && (
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 9,
            color: TOKENS.colors.text,
          }}
        >
          {phaseLabel}
        </span>
      )}
      {/* Scrub bar */}
      <div
        style={{
          flex: 1,
          height: 2,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 1,
          marginLeft: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: TOKENS.colors.accent,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
};
