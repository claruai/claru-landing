import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TOKENS } from "./DesignTokens";

// ---------------------------------------------------------------------------
// RadarChart — 5-axis spider chart using SVG with animated fill
// ---------------------------------------------------------------------------

export interface RadarAxis {
  label: string;
  /** Value in range [0, 1] */
  value: number;
}

export interface RadarChartProps {
  /** Exactly 5 axes for the radar chart */
  axes: [RadarAxis, RadarAxis, RadarAxis, RadarAxis, RadarAxis];
  /** Chart size in pixels (width and height, default: 200) */
  size?: number;
  /** Fill color (default: accent) */
  color?: string;
  /** Frame at which animation starts (default: 0) */
  animateFrom?: number;
  /** Duration of fill animation in frames (default: 45) */
  animationDuration?: number;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): [number, number] {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(angleRad), cy + r * Math.sin(angleRad)];
}

export const RadarChart: React.FC<RadarChartProps> = ({
  axes,
  size = 200,
  color = TOKENS.colors.accent,
  animateFrom = 0,
  animationDuration = 45,
}) => {
  const frame = useCurrentFrame();
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const angleStep = 360 / 5;

  const animProgress = interpolate(
    frame,
    [animateFrom, animateFrom + animationDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Grid rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Data polygon points
  const dataPoints = axes.map((axis, i) => {
    const r = maxR * axis.value * animProgress;
    return polarToCartesian(cx, cy, r, i * angleStep);
  });
  const dataPath =
    dataPoints.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {rings.map((r) => {
        const ringPoints = Array.from({ length: 5 }, (_, i) =>
          polarToCartesian(cx, cy, maxR * r, i * angleStep),
        );
        const ringPath =
          ringPoints
            .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
            .join(" ") + " Z";
        return (
          <path
            key={r}
            d={ringPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const [ex, ey] = polarToCartesian(cx, cy, maxR, i * angleStep);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={ex}
            y2={ey}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={1}
          />
        );
      })}

      {/* Filled data area */}
      <path d={dataPath} fill={`${color}30`} stroke={color} strokeWidth={1.5} />

      {/* Data points */}
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5} fill={color} />
      ))}

      {/* Labels */}
      {axes.map((axis, i) => {
        const [lx, ly] = polarToCartesian(cx, cy, maxR + 16, i * angleStep);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="central"
            fill={TOKENS.colors.muted}
            fontFamily={TOKENS.fonts.mono}
            fontSize={8}
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
};
