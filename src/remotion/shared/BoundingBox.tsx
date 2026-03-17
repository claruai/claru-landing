import React from "react";
import { TOKENS } from "./DesignTokens";

// ---------------------------------------------------------------------------
// BoundingBox — reusable bbox overlay for Remotion compositions
// ---------------------------------------------------------------------------

export interface BoundingBoxProps {
  /** Normalized coordinates [x1, y1, x2, y2] in range [0, 1] */
  bbox: [number, number, number, number];
  /** Display label above the box */
  label: string;
  /** Box border color */
  color: string;
  /** Optional secondary label (e.g. affordance, action) */
  sublabel?: string;
  /** Opacity [0, 1] — controlled by parent for fade-in */
  opacity: number;
  /** Show corner markers (default: true) */
  showCorners?: boolean;
  /** Optional confidence score [0, 1] displayed in the label */
  confidence?: number;
}

const CORNERS: [number, number][] = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
];

export const BoundingBox: React.FC<BoundingBoxProps> = ({
  bbox,
  label,
  color,
  sublabel,
  opacity,
  showCorners = true,
  confidence,
}) => {
  const [x1, y1, x2, y2] = bbox;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x1 * 100}%`,
        top: `${y1 * 100}%`,
        width: `${(x2 - x1) * 100}%`,
        height: `${(y2 - y1) * 100}%`,
        border: `2px solid ${color}`,
        borderRadius: 3,
        opacity: Math.min(opacity, 0.9),
        transition: "all 0.05s linear",
        boxShadow: `0 0 8px ${color}40`,
      }}
    >
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: -18,
          left: -1,
          backgroundColor: color,
          color: "#000",
          fontSize: 9,
          fontFamily: TOKENS.fonts.mono,
          fontWeight: 700,
          padding: "1px 5px",
          borderRadius: "2px 2px 0 0",
          whiteSpace: "nowrap",
          letterSpacing: 0.5,
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        <span>{label}</span>
        {sublabel && (
          <span style={{ fontWeight: 400, opacity: 0.8 }}>{sublabel}</span>
        )}
        {confidence !== undefined && (
          <span style={{ fontWeight: 400, opacity: 0.7 }}>
            {(confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {/* Corner markers */}
      {showCorners &&
        CORNERS.map(([cx, cy], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx === 0 ? -2 : undefined,
              right: cx === 1 ? -2 : undefined,
              top: cy === 0 ? -2 : undefined,
              bottom: cy === 1 ? -2 : undefined,
              width: 6,
              height: 6,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
        ))}
    </div>
  );
};
