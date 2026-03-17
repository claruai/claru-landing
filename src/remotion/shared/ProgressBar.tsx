import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TOKENS } from "./DesignTokens";

// ---------------------------------------------------------------------------
// ProgressBar — animated horizontal bar using Remotion interpolate
// ---------------------------------------------------------------------------

export interface ProgressBarProps {
  /** Progress value [0, 100] */
  progress: number;
  /** Bar color (default: accent) */
  color?: string;
  /** Bar height in pixels (default: 2) */
  height?: number;
  /** Frame at which the animation starts (default: 0) */
  animateFrom?: number;
  /** Duration of the fill animation in frames (default: 30) */
  animationDuration?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = TOKENS.colors.accent,
  height = 2,
  animateFrom = 0,
  animationDuration = 30,
}) => {
  const frame = useCurrentFrame();

  const animatedProgress = interpolate(
    frame,
    [animateFrom, animateFrom + animationDuration],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        height,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${animatedProgress}%`,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </div>
  );
};
