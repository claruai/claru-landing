/**
 * SixViewGrid — 2x3 grid showing the same clip rendered 6 different ways
 * (e.g. RGB, Depth, Segmentation, Pose, Flow, Mesh).
 * Supports both video and image sources.
 * 1080x1080 at 30fps, 240 frames (8 seconds).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  OffthreadVideo,
  Img,
  staticFile,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TerminalHeader } from "../../shared/TerminalHeader";
import { BottomBar } from "../../shared/BottomBar";

export interface GridPanel {
  label: string;
  src: string;
  accent: string;
}

export interface SixViewGridProps {
  panels?: GridPanel[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLS = 3;
const ROWS = 2;
const GAP = 4;
const PADDING = 24;
const GRID_LINE_START = 15;
const GRID_LINE_DURATION = 25;
const PANEL_START = 45;
const PANEL_STAGGER = 10;
const LABEL_OFFSET = 12;

/** Is this a video file by extension? */
function isVideo(src: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(src);
}

/** Typed text helper */
function typedText(
  text: string,
  frame: number,
  startFrame: number,
  cps: number = 1.2
): string {
  if (frame < startFrame) return "";
  const elapsed = frame - startFrame;
  return text.slice(0, Math.min(Math.floor(elapsed * cps), text.length));
}

// ---------------------------------------------------------------------------
// GridLines — sage green lines that draw in
// ---------------------------------------------------------------------------

const GridLines: React.FC<{
  contentTop: number;
  contentHeight: number;
  cellW: number;
  cellH: number;
}> = ({ contentTop, contentHeight, cellW, cellH }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const progress = interpolate(
    frame,
    [GRID_LINE_START, GRID_LINE_START + GRID_LINE_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const lineColor = `${TOKENS.colors.accent}50`;
  const totalWidth = width - PADDING * 2;

  return (
    <>
      {/* Vertical dividers */}
      {[1, 2].map((col) => {
        const x = PADDING + col * (cellW + GAP) - GAP / 2;
        const h = contentHeight * progress;
        return (
          <div
            key={`v-${col}`}
            style={{
              position: "absolute",
              top: contentTop + (contentHeight - h) / 2,
              left: x,
              width: 1,
              height: h,
              backgroundColor: lineColor,
            }}
          />
        );
      })}

      {/* Horizontal divider */}
      <div
        style={{
          position: "absolute",
          top: contentTop + cellH + GAP / 2,
          left: PADDING + (totalWidth - totalWidth * progress) / 2,
          width: totalWidth * progress,
          height: 1,
          backgroundColor: lineColor,
        }}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Single Panel
// ---------------------------------------------------------------------------

const Panel: React.FC<{
  panel: GridPanel;
  index: number;
  cellW: number;
  cellH: number;
  x: number;
  y: number;
}> = ({ panel, index, cellW, cellH, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeStart = PANEL_START + index * PANEL_STAGGER;
  const labelStart = fadeStart + LABEL_OFFSET;

  // Spring in
  const sp = spring({
    frame: frame - fadeStart,
    fps,
    config: { damping: 20, stiffness: 80, mass: 0.6 },
  });
  const opacity = Math.max(0, Math.min(1, sp));
  const scale = interpolate(frame, [fadeStart, fadeStart + 12], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label typing
  const labelText = typedText(panel.label, frame, labelStart, 1.5);
  const labelComplete = labelText.length >= panel.label.length;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  if (frame < fadeStart - 2) return null;

  const labelH = 28;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: cellW,
        height: cellH,
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Media area */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          borderRadius: 2,
          position: "relative",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        }}
      >
        {isVideo(panel.src) ? (
          <OffthreadVideo
            src={staticFile(panel.src)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Img
            src={staticFile(panel.src)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        {/* Colored border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `1px solid ${panel.accent}30`,
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          height: labelH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 11,
            color: panel.accent,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {labelText}
        </span>
        {!labelComplete && frame >= labelStart && cursorBlink && (
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 12,
              backgroundColor: panel.accent,
            }}
          />
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

const DEFAULT_PANELS: GridPanel[] = [
  { label: "RGB", src: "enrichment-assets/rgb-sample.mp4", accent: "#e8e8e8" },
  { label: "Depth", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_01.png", accent: "#4a90d9" },
  { label: "Segmentation", src: "enrichment-assets/skeletons/33c400a3_skeleton_frame_01.jpg", accent: "#c084fc" },
  { label: "Pose", src: "enrichment-assets/skeletons/33c400a3_skeleton_frame_02.jpg", accent: "#92B090" },
  { label: "Flow", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_02.png", accent: "#f5a623" },
  { label: "3D Mesh", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_03.png", accent: "#38bdf8" },
];

const SixViewGrid: React.FC<SixViewGridProps> = ({ panels = DEFAULT_PANELS }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const timeS = frame / fps;

  const contentTop = 32;
  const contentBottom = 32;
  const contentHeight = height - contentTop - contentBottom;

  const availW = width - PADDING * 2 - GAP * (COLS - 1);
  const availH = contentHeight - GAP * (ROWS - 1);
  const cellW = availW / COLS;
  const cellH = availH / ROWS;

  const barOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* Terminal header */}
      <TerminalHeader
        title="claru-enrichment -- multiview"
        statusLabel="6 MODALITIES"
        statusColor={TOKENS.colors.accent}
      />

      {/* Grid lines */}
      <GridLines
        contentTop={contentTop}
        contentHeight={contentHeight}
        cellW={cellW}
        cellH={cellH}
      />

      {/* Panels */}
      {panels.slice(0, 6).map((panel, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        return (
          <Panel
            key={i}
            panel={panel}
            index={i}
            cellW={cellW}
            cellH={cellH}
            x={PADDING + col * (cellW + GAP)}
            y={contentTop + row * (cellH + GAP)}
          />
        );
      })}

      {/* Bottom bar */}
      <BottomBar timeS={timeS} opacity={barOpacity} />
    </AbsoluteFill>
  );
};

export default SixViewGrid;
