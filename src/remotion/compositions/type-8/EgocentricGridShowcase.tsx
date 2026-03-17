import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import { BottomBar } from "../../shared/BottomBar";

// ---------------------------------------------------------------------------
// Type 8 Override: Egocentric Grid Showcase
//
// Shows a grid of diverse egocentric video clips playing simultaneously,
// then zooms into one to reveal enrichment metadata. Emphasizes DIVERSITY
// and SCALE of the 386K+ clip collection across 3 capture pipelines.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Grid cell definitions
// ---------------------------------------------------------------------------

interface GridCell {
  src: string;
  label: string;
  pipeline: string;
}

const GRID_CELLS: GridCell[] = [
  {
    src: staticFile("remotion-assets/samples/sol-egocentric.mp4"),
    label: "Pour Liquid",
    pipeline: "Activity-Specific",
  },
  {
    src: staticFile("remotion-assets/samples/sol-vla.mp4"),
    label: "Chopping",
    pipeline: "GoPro",
  },
  {
    src: staticFile("remotion-assets/samples/sol-manipulation.mp4"),
    label: "Folding",
    pipeline: "Activity-Specific",
  },
  {
    src: staticFile("remotion-assets/samples/sol-teleop.mp4"),
    label: "Walking",
    pipeline: "GoPro",
  },
  {
    src: staticFile("remotion-assets/samples/cs-workplace.mp4"),
    label: "Barista",
    pipeline: "Activity-Specific",
  },
  {
    src: staticFile("videos/case-study-egocentric-smartphone.mp4"),
    label: "Smartphone",
    pipeline: "Smartphone",
  },
];

// The cell index that will be highlighted and zoomed (Pour Liquid)
const HIGHLIGHT_INDEX = 0;

// Grid layout: 3 columns x 2 rows
const COLS = 3;
const ROWS = 2;
const GAP = 6;

// Enrichment metadata for the highlighted clip
const ENRICHMENT_META = {
  activity: "Pour Liquid",
  category: "Object Manipulation",
  subcategory: "Containers & Access",
  hand_tracking: {
    hand: "right_hand",
    grip: "power_grip",
    action: "pouring",
  },
  environment: "indoor_home",
  resolution: "1920x1080",
  fps: 30,
  pipeline: "activity_specific",
  clip_id: "ego-act-04892",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Activity label badge for each grid cell */
const CellLabel: React.FC<{
  text: string;
  pipeline: string;
  opacity: number;
}> = ({ text, pipeline, opacity }) => (
  <div
    style={{
      position: "absolute",
      bottom: 6,
      left: 6,
      right: 6,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      opacity,
    }}
  >
    <span
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 10,
        fontWeight: 600,
        color: TOKENS.colors.text,
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: "2px 6px",
        borderRadius: 2,
        letterSpacing: 0.5,
      }}
    >
      {text}
    </span>
    <span
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 7,
        color: TOKENS.colors.muted,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: "2px 4px",
        borderRadius: 2,
        letterSpacing: 0.3,
      }}
    >
      {pipeline}
    </span>
  </div>
);

/** JSON metadata panel that builds line by line */
const MetadataPanel: React.FC<{
  opacity: number;
  revealProgress: number;
  jsonProgress: number;
}> = ({ opacity, revealProgress, jsonProgress }) => {
  const metaLines: { label: string; value: string }[] = [
    { label: "Activity", value: ENRICHMENT_META.activity },
    { label: "Category", value: ENRICHMENT_META.category },
    { label: "Subcategory", value: ENRICHMENT_META.subcategory },
    { label: "Hand", value: ENRICHMENT_META.hand_tracking.hand },
    { label: "Grip", value: ENRICHMENT_META.hand_tracking.grip },
    { label: "Action", value: ENRICHMENT_META.hand_tracking.action },
    { label: "Environment", value: ENRICHMENT_META.environment },
    { label: "Resolution", value: ENRICHMENT_META.resolution },
    { label: "FPS", value: String(ENRICHMENT_META.fps) },
    { label: "Pipeline", value: ENRICHMENT_META.pipeline },
  ];

  const visibleLines = Math.floor(revealProgress * metaLines.length);

  // JSON representation
  const jsonStr = JSON.stringify(ENRICHMENT_META, null, 2);
  const jsonLines = jsonStr.split("\n");
  const visibleJsonLines = Math.floor(jsonProgress * jsonLines.length);

  return (
    <div
      style={{
        position: "absolute",
        top: 48,
        right: 16,
        width: 340,
        bottom: 48,
        opacity,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        overflow: "hidden",
      }}
    >
      {/* Enrichment header */}
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10,
          color: TOKENS.colors.accent,
          letterSpacing: 2,
          textTransform: "uppercase",
          paddingBottom: 4,
          borderBottom: `1px solid ${TOKENS.colors.accent}30`,
        }}
      >
        Enrichment Metadata
      </div>

      {/* Key-value pairs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {metaLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontFamily: TOKENS.fonts.mono,
              fontSize: 10,
            }}
          >
            <span style={{ color: TOKENS.colors.muted, letterSpacing: 0.3 }}>
              {line.label}
            </span>
            <span
              style={{
                color:
                  line.label === "Activity"
                    ? TOKENS.colors.accent
                    : TOKENS.colors.text,
                fontWeight: line.label === "Activity" ? 600 : 400,
              }}
            >
              {line.value}
            </span>
          </div>
        ))}
      </div>

      {/* JSON output section */}
      {jsonProgress > 0 && (
        <div
          style={{
            marginTop: 8,
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: TOKENS.colors.muted,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            JSON Output
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              border: `1px solid ${TOKENS.colors.accent}20`,
              borderRadius: 3,
              padding: "6px 8px",
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: TOKENS.colors.text,
              lineHeight: 1.5,
              whiteSpace: "pre",
              overflow: "hidden",
            }}
          >
            {jsonLines.slice(0, visibleJsonLines).join("\n")}
            <span style={{ color: TOKENS.colors.accent }}>|</span>
          </div>
        </div>
      )}
    </div>
  );
};

/** Compressed thumbnail strip on the left showing remaining clips */
const ThumbnailStrip: React.FC<{
  opacity: number;
}> = ({ opacity }) => {
  // Show all cells except the highlighted one
  const otherCells = GRID_CELLS.filter((_, i) => i !== HIGHLIGHT_INDEX);
  const stripHeight = 720 - 96; // minus top/bottom bar space
  const thumbHeight = Math.floor(stripHeight / otherCells.length) - 4;

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 8,
        width: 90,
        bottom: 40,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        opacity,
        overflow: "hidden",
      }}
    >
      {otherCells.map((cell, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            width: 90,
            height: thumbHeight,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <OffthreadVideo
            src={cell.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            toneMapped={false}
          />
          <div
            style={{
              position: "absolute",
              bottom: 2,
              left: 3,
              fontFamily: TOKENS.fonts.mono,
              fontSize: 7,
              color: TOKENS.colors.text,
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "1px 3px",
              borderRadius: 1,
            }}
          >
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const EgocentricGridShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  // -------------------------------------------------------------------------
  // Phase boundaries (300 frames = 10s at 30fps)
  // Phase 1 (0-60):    Grid overview - all 6 clips play in 3x2 grid
  // Phase 2 (60-120):  Highlight + dim - one cell gets accent border, others dim
  // Phase 3 (120-200): Zoom into single clip + metadata panel slides in
  // Phase 4 (200-270): JSON output builds
  // Phase 5 (270-300): Hold + fade out
  // -------------------------------------------------------------------------

  // Phase labels for BottomBar
  const phaseLabel =
    frame < 60
      ? "GRID OVERVIEW"
      : frame < 120
        ? "HIGHLIGHT"
        : frame < 200
          ? "ENRICHMENT"
          : frame < 270
            ? "JSON OUTPUT"
            : "COMPLETE";

  // -- Title text animations --
  const titleOpacity = interpolate(frame, [5, 15, 55, 65], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [12, 22, 55, 65],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // -- Grid cell animations --
  // Cell dimensions in grid phase
  const cellW = (1280 - GAP * (COLS + 1)) / COLS;
  const cellH = (720 - 80 - GAP * (ROWS + 1)) / ROWS; // 80px for title area

  // Dimming of non-highlighted cells (Phase 2)
  const dimOthers = interpolate(frame, [60, 85], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight border opacity
  const highlightBorder = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // -- Zoom animation (Phase 3) --
  // The highlighted cell expands from its grid position to fill ~60% of frame
  const zoomProgress = interpolate(frame, [120, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Grid position of highlight cell
  const highlightCol = HIGHLIGHT_INDEX % COLS;
  const highlightRow = Math.floor(HIGHLIGHT_INDEX / COLS);
  const gridX = GAP + highlightCol * (cellW + GAP);
  const gridY = 70 + GAP + highlightRow * (cellH + GAP);

  // Target position: centered-left with thumbnail strip on left
  const targetX = 110;
  const targetY = 40;
  const targetW = 1280 - 340 - 110 - 24; // minus metadata panel, minus strip, minus gaps
  const targetH = 720 - 88; // minus top/bottom margins

  // Interpolated position/size
  const currentX = interpolate(zoomProgress, [0, 1], [gridX, targetX]);
  const currentY = interpolate(zoomProgress, [0, 1], [gridY, targetY]);
  const currentW = interpolate(zoomProgress, [0, 1], [cellW, targetW]);
  const currentH = interpolate(zoomProgress, [0, 1], [cellH, targetH]);

  // Other cells fade out during zoom
  const otherCellsOpacity = interpolate(frame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Thumbnail strip fades in after zoom
  const stripOpacity = interpolate(frame, [160, 185], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Metadata panel slide-in
  const metaPanelOpacity = interpolate(frame, [155, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Metadata reveal progress (key-value pairs)
  const metaRevealProgress = interpolate(frame, [165, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // JSON output progress
  const jsonProgress = interpolate(frame, [200, 265], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final fade out
  const fadeOut = interpolate(frame, [275, 298], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Global fade in
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const globalOpacity = fadeIn * fadeOut;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* Background subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Phase 1-2: Title text */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 30,
          opacity: globalOpacity,
        }}
      >
        <div
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 16,
            fontWeight: 600,
            color: TOKENS.colors.text,
            letterSpacing: 1.5,
            opacity: titleOpacity,
          }}
        >
          386K+ egocentric clips across 3 capture pipelines
        </div>
        <div
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 11,
            color: TOKENS.colors.muted,
            letterSpacing: 1,
            marginTop: 4,
            opacity: subtitleOpacity,
            display: "flex",
            gap: 12,
          }}
        >
          <span>GoPro</span>
          <span style={{ color: TOKENS.colors.accent }}>*</span>
          <span>Smartphone</span>
          <span style={{ color: TOKENS.colors.accent }}>*</span>
          <span>Activity-Specific</span>
        </div>
      </div>

      {/* Grid of video cells */}
      <div style={{ opacity: globalOpacity }}>
        {GRID_CELLS.map((cell, index) => {
          const col = index % COLS;
          const row = Math.floor(index / COLS);
          const x = GAP + col * (cellW + GAP);
          const y = 70 + GAP + row * (cellH + GAP);

          const isHighlight = index === HIGHLIGHT_INDEX;

          // During zoom phase, the highlight cell moves to target position
          // Other cells fade out
          if (isHighlight) {
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: currentX,
                  top: currentY,
                  width: currentW,
                  height: currentH,
                  borderRadius: 4,
                  overflow: "hidden",
                  border:
                    highlightBorder > 0
                      ? `2px solid ${TOKENS.colors.accent}`
                      : "1px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    highlightBorder > 0
                      ? `0 0 ${12 * highlightBorder}px ${TOKENS.colors.accent}40`
                      : "none",
                  zIndex: 20,
                }}
              >
                <OffthreadVideo
                  src={cell.src}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  toneMapped={false}
                />
                <CellLabel
                  text={cell.label}
                  pipeline={cell.pipeline}
                  opacity={zoomProgress < 0.5 ? 1 : 1 - (zoomProgress - 0.5) * 2}
                />
                {/* Zoomed-in label that appears after zoom */}
                {zoomProgress > 0.8 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      opacity: interpolate(
                        zoomProgress,
                        [0.8, 1],
                        [0, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }
                      ),
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: TOKENS.colors.accent,
                        boxShadow: `0 0 6px ${TOKENS.colors.accent}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: TOKENS.fonts.mono,
                        fontSize: 11,
                        fontWeight: 600,
                        color: TOKENS.colors.accent,
                        letterSpacing: 1,
                        textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      CLIP ego-act-04892
                    </span>
                  </div>
                )}
              </div>
            );
          }

          // Non-highlight cells
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: cellW,
                height: cellH,
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                opacity: dimOthers * otherCellsOpacity,
                zIndex: 10,
              }}
            >
              <OffthreadVideo
                src={cell.src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                toneMapped={false}
              />
              <CellLabel text={cell.label} pipeline={cell.pipeline} opacity={1} />
            </div>
          );
        })}
      </div>

      {/* Thumbnail strip (Phase 3+) */}
      {frame >= 155 && (
        <div style={{ opacity: globalOpacity }}>
          <ThumbnailStrip opacity={stripOpacity} />
        </div>
      )}

      {/* Metadata panel (Phase 3+) */}
      {frame >= 150 && (
        <div style={{ opacity: globalOpacity }}>
          <MetadataPanel
            opacity={metaPanelOpacity}
            revealProgress={metaRevealProgress}
            jsonProgress={jsonProgress}
          />
        </div>
      )}

      {/* Enrichment phase title */}
      {frame >= 120 && frame < 270 && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 30,
            opacity:
              globalOpacity *
              interpolate(frame, [120, 140, 260, 270], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
          }}
        >
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 12,
              color: TOKENS.colors.accent,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Per-Clip Enrichment Pipeline
          </span>
        </div>
      )}

      {/* TechMetadataOverlay */}
      <div style={{ zIndex: 30, opacity: globalOpacity }}>
        <TechMetadataOverlay
          codec="h264"
          resolution="1920x1080"
          fps={30}
          duration={`${(durationInFrames / fps).toFixed(1)}s`}
        />
      </div>

      {/* BottomBar with phase labels */}
      <div style={{ zIndex: 30, opacity: globalOpacity }}>
        <BottomBar timeS={timeS} phaseLabel={phaseLabel} />
      </div>
    </AbsoluteFill>
  );
};

export default EgocentricGridShowcase;
