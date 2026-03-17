import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TOKENS } from "./DesignTokens";

// ---------------------------------------------------------------------------
// TaxonomyTree — animated hierarchical label tree
// ---------------------------------------------------------------------------

export interface TaxonomyLevel {
  label: string;
  children?: TaxonomyLevel[];
}

export interface TaxonomyTreeProps {
  /** Hierarchical levels to render */
  levels: TaxonomyLevel[];
  /** How many depth levels are currently visible (animated by parent) */
  activeDepth: number;
  /** Frame at which animation starts (default: 0) */
  animateFrom?: number;
  /** Frames per depth level reveal (default: 15) */
  framesPerLevel?: number;
}

const INDENT = 20;
const LINE_HEIGHT = 22;

interface FlatNode {
  label: string;
  depth: number;
  hasChildren: boolean;
  isLast: boolean;
}

function flattenTree(
  levels: TaxonomyLevel[],
  depth: number = 0,
): FlatNode[] {
  const nodes: FlatNode[] = [];
  levels.forEach((level, i) => {
    const isLast = i === levels.length - 1;
    nodes.push({
      label: level.label,
      depth,
      hasChildren: !!level.children && level.children.length > 0,
      isLast,
    });
    if (level.children) {
      nodes.push(...flattenTree(level.children, depth + 1));
    }
  });
  return nodes;
}

export const TaxonomyTree: React.FC<TaxonomyTreeProps> = ({
  levels,
  activeDepth,
  animateFrom = 0,
  framesPerLevel = 15,
}) => {
  const frame = useCurrentFrame();
  const flatNodes = flattenTree(levels);

  return (
    <div
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 11,
        lineHeight: `${LINE_HEIGHT}px`,
        padding: "12px 16px",
      }}
    >
      {flatNodes.map((node, i) => {
        if (node.depth > activeDepth) return null;

        const levelStart = animateFrom + node.depth * framesPerLevel;
        const nodeOpacity = interpolate(
          frame,
          [levelStart, levelStart + 12],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const nodeTranslateY = interpolate(
          frame,
          [levelStart, levelStart + 12],
          [6, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        const isActive = node.depth === activeDepth;
        const color = isActive
          ? TOKENS.colors.accent
          : TOKENS.colors.text;

        return (
          <div
            key={`${node.depth}-${node.label}-${i}`}
            style={{
              paddingLeft: node.depth * INDENT,
              opacity: nodeOpacity,
              transform: `translateY(${nodeTranslateY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: LINE_HEIGHT,
            }}
          >
            {/* Tree connector */}
            {node.depth > 0 && (
              <span style={{ color: TOKENS.colors.muted, fontSize: 10 }}>
                {node.isLast ? "\u2514\u2500" : "\u251C\u2500"}
              </span>
            )}

            {/* Node indicator */}
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: node.hasChildren ? 1 : "50%",
                backgroundColor: isActive ? color : `${color}60`,
                flexShrink: 0,
              }}
            />

            {/* Label */}
            <span style={{ color, whiteSpace: "nowrap" }}>
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
