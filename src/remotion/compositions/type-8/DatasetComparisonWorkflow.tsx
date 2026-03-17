import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";

// ---------------------------------------------------------------------------
// DatasetComparisonWorkflow — Open Datasets vs Custom Collection
//
// Timeline (300 frames @ 30fps = 10s):
//   Phase 1 (0-30):    Fade in, title
//   Phase 2 (30-80):   Three columns appear: Open X-Embodiment, DROID, Claru Custom
//   Phase 3 (80-160):  Stats animate in per column
//   Phase 4 (160-210): Coverage gap visualization
//   Phase 5 (210-250): Claru advantages highlight
//   Phase 6 (250-300): JSON output
// ---------------------------------------------------------------------------

interface DatasetColumn {
  name: string;
  shortName: string;
  color: string;
  stats: { label: string; value: string; barPct: number }[];
  gaps: string[];
  strengths: string[];
}

const DATASETS: DatasetColumn[] = [
  {
    name: "Open X-Embodiment",
    shortName: "X-Embodiment",
    color: TOKENS.colors.rejected,
    stats: [
      { label: "Trajectories", value: "1M+", barPct: 90 },
      { label: "Robot Types", value: "22", barPct: 65 },
      { label: "Task Diversity", value: "Low", barPct: 25 },
      { label: "Annotation Quality", value: "Varies", barPct: 30 },
      { label: "Custom Tasks", value: "No", barPct: 0 },
    ],
    gaps: ["Limited task diversity", "Inconsistent quality", "No custom specs"],
    strengths: [],
  },
  {
    name: "DROID",
    shortName: "DROID",
    color: TOKENS.colors.warning,
    stats: [
      { label: "Trajectories", value: "76K", barPct: 35 },
      { label: "Robot Types", value: "1 (Franka)", barPct: 10 },
      { label: "Task Diversity", value: "86 tasks", barPct: 55 },
      { label: "Annotation Quality", value: "Good", barPct: 60 },
      { label: "Custom Tasks", value: "No", barPct: 0 },
    ],
    gaps: ["Single robot only", "Limited scale", "No customization"],
    strengths: [],
  },
  {
    name: "Claru Custom",
    shortName: "Claru",
    color: TOKENS.colors.accent,
    stats: [
      { label: "Trajectories", value: "Custom", barPct: 100 },
      { label: "Robot Types", value: "Any", barPct: 100 },
      { label: "Task Diversity", value: "Any Task", barPct: 100 },
      { label: "Annotation Quality", value: "Expert", barPct: 95 },
      { label: "Custom Tasks", value: "Yes", barPct: 100 },
    ],
    gaps: [],
    strengths: ["Any robot platform", "Custom task specs", "Expert annotation", "Scale on demand"],
  },
];

const JSON_LINES = [
  `{`,
  `  "comparison": "OPEN_VS_CUSTOM_DATASETS",`,
  `  "x_embodiment": { "trajectories": "1M+", "robots": 22, "tasks": "limited" },`,
  `  "droid": { "trajectories": "76K", "robots": 1, "tasks": 86 },`,
  `  "claru_custom": { "trajectories": "on_demand", "robots": "any", "tasks": "any" },`,
  `  "coverage_gap": "67%",`,
  `  "recommendation": "claru_custom",`,
  `  "status": "comparison_complete"`,
  `}`,
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Animated stat bar row */
const StatBar: React.FC<{
  label: string;
  value: string;
  barPct: number;
  color: string;
  startFrame: number;
  index: number;
}> = ({ label, value, barPct, color, startFrame, index }) => {
  const frame = useCurrentFrame();
  const myStart = startFrame + index * 8;

  const opacity = interpolate(frame, [myStart, myStart + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = interpolate(frame, [myStart, myStart + 25], [0, barPct], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{ opacity, fontFamily: TOKENS.fonts.mono, marginBottom: 2 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <span style={{ fontSize: 8, color: TOKENS.colors.muted }}>{label}</span>
        <span style={{ fontSize: 9, color: TOKENS.colors.text, fontWeight: 500 }}>
          {value}
        </span>
      </div>
      <div
        style={{
          height: 4,
          backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barWidth}%`,
            backgroundColor: color,
            borderRadius: 2,
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  );
};

/** Coverage gap item */
const GapItem: React.FC<{
  text: string;
  startFrame: number;
  isGap: boolean;
}> = ({ text, startFrame, isGap }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        opacity,
        fontFamily: TOKENS.fonts.mono,
        fontSize: 9,
        padding: "2px 0",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: isGap ? TOKENS.colors.rejected : TOKENS.colors.accent,
          flexShrink: 0,
          opacity: 0.7,
        }}
      />
      <span style={{ color: isGap ? "#888" : TOKENS.colors.accent }}>
        {text}
      </span>
    </div>
  );
};

/** Dataset column component */
const DatasetColumnView: React.FC<{
  dataset: DatasetColumn;
  columnIndex: number;
  startFrame: number;
  gapStartFrame: number;
}> = ({ dataset, columnIndex, startFrame, gapStartFrame }) => {
  const frame = useCurrentFrame();

  const columnOpacity = interpolate(
    frame,
    [startFrame + columnIndex * 12, startFrame + columnIndex * 12 + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const columnSlideY = interpolate(
    frame,
    [startFrame + columnIndex * 12, startFrame + columnIndex * 12 + 18],
    [15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const isClaru = columnIndex === 2;
  const borderColor = isClaru && frame > gapStartFrame
    ? `${TOKENS.colors.accent}50`
    : "rgba(255,255,255,0.06)";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(15, 14, 13, 0.95)",
        border: `1px solid ${borderColor}`,
        borderRadius: 4,
        overflow: "hidden",
        opacity: columnOpacity,
        transform: `translateY(${columnSlideY}px)`,
        transition: "border-color 0.3s",
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: "8px 10px",
          backgroundColor: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: dataset.color,
              opacity: 0.8,
            }}
          />
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 10,
              color: TOKENS.colors.text,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {dataset.shortName}
          </span>
        </div>
        {isClaru && (
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: TOKENS.colors.accent,
              letterSpacing: 1,
              textTransform: "uppercase",
              padding: "1px 6px",
              backgroundColor: `${TOKENS.colors.accent}15`,
              borderRadius: 2,
              border: `1px solid ${TOKENS.colors.accent}30`,
            }}
          >
            Recommended
          </span>
        )}
      </div>

      {/* Stats */}
      <div style={{ padding: "8px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {dataset.stats.map((stat, i) => (
          <StatBar
            key={stat.label}
            label={stat.label}
            value={stat.value}
            barPct={stat.barPct}
            color={dataset.color}
            startFrame={80 + columnIndex * 15}
            index={i}
          />
        ))}
      </div>

      {/* Gaps / Strengths */}
      <div
        style={{
          padding: "6px 10px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          minHeight: 60,
        }}
      >
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 8,
            color: "#444",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {dataset.gaps.length > 0 ? "Coverage Gaps" : "Strengths"}
        </span>
        {dataset.gaps.map((gap, i) => (
          <GapItem
            key={gap}
            text={gap}
            startFrame={gapStartFrame + i * 6}
            isGap={true}
          />
        ))}
        {dataset.strengths.map((s, i) => (
          <GapItem
            key={s}
            text={s}
            startFrame={gapStartFrame + i * 6}
            isGap={false}
          />
        ))}
      </div>
    </div>
  );
};

/** JSON output panel */
const JsonPanel: React.FC<{
  slideIn: number;
  progress: number;
}> = ({ slideIn, progress }) => {
  const frame = useCurrentFrame();
  const visibleLines = Math.floor(progress * JSON_LINES.length);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 32,
        width: "34%",
        backgroundColor: "rgba(10, 9, 8, 0.95)",
        borderLeft: `1px solid ${TOKENS.colors.accent}30`,
        padding: "16px 12px",
        transform: `translateX(${(1 - slideIn) * 100}%)`,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        zIndex: 25,
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          color: TOKENS.colors.muted,
          letterSpacing: 1,
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        comparison output
      </div>
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10,
          lineHeight: 1.7,
          color: TOKENS.colors.text,
        }}
      >
        {JSON_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            {line.includes(":") ? (
              <>
                <span style={{ color: TOKENS.colors.muted }}>
                  {line.split(":")[0]}:
                </span>
                <span style={{ color: TOKENS.colors.accent }}>
                  {line.split(":").slice(1).join(":")}
                </span>
              </>
            ) : (
              <span style={{ color: TOKENS.colors.muted }}>{line}</span>
            )}
          </div>
        ))}
        {visibleLines < JSON_LINES.length && visibleLines > 0 && (
          <span
            style={{
              color: TOKENS.colors.accent,
              opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
            }}
          >
            _
          </span>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const DatasetComparisonWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  // Setup fade
  const setupFade = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title typewriter
  const titleText = "Dataset Comparison: Open Datasets vs Custom Collection";
  const titleProgress = interpolate(frame, [5, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleChars = Math.floor(titleProgress * titleText.length);

  // Coverage gap indicator (160-210)
  const gapOpacity = interpolate(frame, [160, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gapPct = interpolate(frame, [165, 195], [0, 67], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // JSON panel (250-300)
  const jsonSlideIn = interpolate(frame, [250, 275], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const jsonProgress = interpolate(frame, [275, 298], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const contentRightPct = interpolate(jsonSlideIn, [0, 1], [0, 34]);

  // Phase label
  let phaseLabel = "Loading";
  if (frame < 30) phaseLabel = "Dataset Comparison";
  else if (frame < 80) phaseLabel = "Loading Datasets";
  else if (frame < 160) phaseLabel = "Analyzing Stats";
  else if (frame < 210) phaseLabel = "Coverage Analysis";
  else if (frame < 250) phaseLabel = "Recommendation";
  else phaseLabel = "Comparison Output";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* --- Header --- */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: `${contentRightPct}%`,
          height: 48,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          backgroundColor: "rgba(10, 9, 8, 0.9)",
          borderBottom: `1px solid ${TOKENS.colors.accent}15`,
          opacity: setupFade,
          zIndex: 20,
          gap: 8,
        }}
      >
        <span style={{ fontSize: 9, color: TOKENS.colors.accent, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>
          Open vs Custom
        </span>
        <span style={{ color: "#333" }}>|</span>
        <span style={{ fontSize: 11, color: TOKENS.colors.text }}>
          {titleText.slice(0, titleChars)}
          {titleChars < titleText.length && (
            <span style={{ color: TOKENS.colors.accent, opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0 }}>
              |
            </span>
          )}
        </span>
      </div>

      {/* --- Three column comparison --- */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: `${contentRightPct}%`,
          bottom: frame >= 160 ? 72 : 32,
          display: "flex",
          gap: 8,
          padding: "8px 12px",
          opacity: setupFade,
        }}
      >
        {DATASETS.map((dataset, i) => (
          <DatasetColumnView
            key={dataset.name}
            dataset={dataset}
            columnIndex={i}
            startFrame={30}
            gapStartFrame={165}
          />
        ))}
      </div>

      {/* --- Coverage gap bar (160+) --- */}
      {frame >= 158 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: `${contentRightPct}%`,
            bottom: 32,
            height: 40,
            padding: "6px 20px",
            backgroundColor: "rgba(10, 9, 8, 0.92)",
            borderTop: `1px solid ${TOKENS.colors.accent}15`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: gapOpacity,
            zIndex: 15,
          }}
        >
          <span style={{ fontSize: 9, color: TOKENS.colors.muted, letterSpacing: 1 }}>
            COVERAGE GAP IN OPEN DATASETS
          </span>
          <div
            style={{
              flex: 1,
              height: 8,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Filled portion = gap */}
            <div
              style={{
                height: "100%",
                width: `${gapPct}%`,
                backgroundColor: TOKENS.colors.rejected,
                borderRadius: 4,
                opacity: 0.5,
              }}
            />
            {/* Claru fills the rest */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${gapPct}%`,
                right: 0,
                height: "100%",
                backgroundColor: TOKENS.colors.accent,
                borderRadius: "0 4px 4px 0",
                opacity: frame >= 210
                  ? interpolate(frame, [210, 230], [0, 0.6], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 0,
              }}
            />
          </div>
          <span style={{ fontSize: 11, color: TOKENS.colors.rejected, fontWeight: 600, width: 36 }}>
            {Math.round(gapPct)}%
          </span>
          {frame >= 210 && (
            <span
              style={{
                fontSize: 9,
                color: TOKENS.colors.accent,
                opacity: interpolate(frame, [215, 230], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Claru fills the gap
            </span>
          )}
        </div>
      )}

      {/* --- JSON Output panel (250-300) --- */}
      {frame >= 248 && (
        <JsonPanel slideIn={jsonSlideIn} progress={jsonProgress} />
      )}

      {/* Tech metadata overlay */}
      <TechMetadataOverlay
        codec="h264"
        resolution="1280x720"
        fps={fps}
        duration={`${(durationInFrames / fps).toFixed(0)}s`}
      />

      {/* Bottom bar */}
      <BottomBar
        timeS={timeS}
        phaseLabel={phaseLabel}
        opacity={setupFade}
        rightInset={frame >= 250 ? jsonSlideIn * 34 * 12.8 : 0}
      />
    </AbsoluteFill>
  );
};

export default DatasetComparisonWorkflow;
