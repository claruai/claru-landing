import React from "react";
import {
  AbsoluteFill,
  Video,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  spring,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { ProgressBar } from "../../shared/ProgressBar";
import { RadarChart, RadarAxis } from "../../shared/RadarChart";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import {
  Type6Annotation,
  ParsedQualityData,
  QualityDimension,
  parseAnnotation,
  scoreColor,
} from "./types";

// ---------------------------------------------------------------------------
// Fallback annotation data — used when the JSON fails to load
// ---------------------------------------------------------------------------

const FALLBACK_DATA: ParsedQualityData = {
  dimensions: [
    { name: "Cinematic", value: "not-cinematic", numericScore: 0.2 },
    { name: "Motion", value: "good-motion", numericScore: 0.8 },
    { name: "Quality", value: "not-high-quality", numericScore: 0.3 },
    { name: "Interest", value: "interesting", numericScore: 0.7 },
    { name: "Alignment", value: "good-alignment", numericScore: 0.8 },
  ],
  videoDescription:
    "Three young friends engage in a humorous discussion outdoors. The atmosphere is light-hearted, with gestures and expressions indicating a playful exchange.",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadAnnotation(compositionId: string): ParsedQualityData {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require(
      `../../../../public/remotion-assets/annotations/${compositionId}.json`,
    ) as Type6Annotation;
    return parseAnnotation(raw);
  } catch {
    return FALLBACK_DATA;
  }
}

// ---------------------------------------------------------------------------
// Timeline constants (frames at 30 fps, 360 total = 12s)
// ---------------------------------------------------------------------------
const T = {
  FADE_IN_START: 0,
  FADE_IN_END: 30,
  FIRST_GAUGE_START: 30,
  FIRST_GAUGE_END: 60,
  REMAINING_GAUGES_START: 60,
  REMAINING_GAUGES_END: 90,
  RADAR_START: 90,
  RADAR_END: 150,
  DESCRIPTION_START: 150,
  DESCRIPTION_END: 240,
  HOLD_START: 240,
  HOLD_END: 360,
} as const;

// ---------------------------------------------------------------------------
// GaugeRow — individual dimension gauge with animated fill
// ---------------------------------------------------------------------------

interface GaugeRowProps {
  dimension: QualityDimension;
  animateFrom: number;
  animationDuration: number;
}

const GaugeRow: React.FC<GaugeRowProps> = ({
  dimension,
  animateFrom,
  animationDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [animateFrom, animateFrom + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scoreSpring = spring({
    frame: frame - animateFrom,
    fps,
    config: { damping: 30, stiffness: 120 },
  });

  const displayScore = Math.round(dimension.numericScore * 100 * Math.min(scoreSpring, 1));
  const color = scoreColor(dimension.numericScore);

  return (
    <div
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 10,
            color: TOKENS.colors.text,
            letterSpacing: 0.5,
          }}
        >
          {dimension.name}
        </span>
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 9,
            color,
            letterSpacing: 0.3,
          }}
        >
          {displayScore}%
        </span>
      </div>
      <ProgressBar
        progress={dimension.numericScore * 100}
        color={color}
        height={4}
        animateFrom={animateFrom}
        animationDuration={animationDuration}
      />
      <span
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 8,
          color: TOKENS.colors.muted,
          letterSpacing: 0.3,
        }}
      >
        {dimension.value}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// TypewriterText — character-by-character reveal
// ---------------------------------------------------------------------------

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  endFrame: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();

  const charCount = Math.floor(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const visible = text.slice(0, charCount);
  const showCursor = frame >= startFrame && frame <= endFrame + 15;

  return (
    <div
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 9,
        color: TOKENS.colors.text,
        lineHeight: 1.5,
        letterSpacing: 0.2,
        opacity: interpolate(frame, [startFrame - 5, startFrame], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {visible}
      {showCursor && (
        <span
          style={{
            color: TOKENS.colors.accent,
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
          }}
        >
          _
        </span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// QualityRubricComposition
// ---------------------------------------------------------------------------

export interface QualityRubricCompositionProps {
  compositionId: string;
}

const QualityRubricComposition: React.FC<QualityRubricCompositionProps> = ({
  compositionId,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = loadAnnotation(compositionId);
  const { dimensions, videoDescription } = data;

  // Master fade in
  const masterOpacity = interpolate(
    frame,
    [T.FADE_IN_START, T.FADE_IN_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Panel slide-in from right
  const panelX = interpolate(
    frame,
    [T.FADE_IN_START, T.FADE_IN_END],
    [40, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Time for bottom bar
  const timeS = frame / fps;

  // Radar chart axes (exact 5-tuple expected by RadarChart)
  const radarAxes: [RadarAxis, RadarAxis, RadarAxis, RadarAxis, RadarAxis] = [
    { label: dimensions[0].name, value: dimensions[0].numericScore },
    { label: dimensions[1].name, value: dimensions[1].numericScore },
    { label: dimensions[2].name, value: dimensions[2].numericScore },
    { label: dimensions[3].name, value: dimensions[3].numericScore },
    { label: dimensions[4].name, value: dimensions[4].numericScore },
  ];

  // Radar chart visibility
  const radarOpacity = interpolate(
    frame,
    [T.RADAR_START, T.RADAR_START + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Determine phase label for bottom bar
  let phaseLabel = "Quality Assessment";
  if (frame < T.FIRST_GAUGE_END) {
    phaseLabel = "Quality Assessment — Scoring";
  } else if (frame < T.RADAR_END) {
    phaseLabel = "Quality Assessment — Analysis";
  } else if (frame < T.DESCRIPTION_END) {
    phaseLabel = "Quality Assessment — Description";
  }

  // Video file path
  const videoSrc = staticFile(`remotion-assets/samples/${compositionId}.mp4`);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* Main content area */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 32, // leave room for bottom bar
          display: "flex",
          opacity: masterOpacity,
        }}
      >
        {/* LEFT: Video area (60%) */}
        <div
          style={{
            width: "60%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Video container */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#000",
            }}
          >
            <Video
              src={videoSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Subtle gradient overlay at bottom for description readability */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
                background:
                  "linear-gradient(transparent, rgba(10, 9, 8, 0.9))",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Video description typewriter beneath video */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 12,
              right: 12,
              maxHeight: 80,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 8,
                color: TOKENS.colors.muted,
                marginBottom: 3,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Assessment
            </div>
            <TypewriterText
              text={videoDescription}
              startFrame={T.DESCRIPTION_START}
              endFrame={T.DESCRIPTION_END}
            />
          </div>
        </div>

        {/* RIGHT: Scoring panel (40%) */}
        <div
          style={{
            width: "40%",
            backgroundColor: TOKENS.colors.panelBg,
            borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "16px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            transform: `translateX(${panelX}px)`,
            overflow: "hidden",
          }}
        >
          {/* Panel header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: TOKENS.colors.accent,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: TOKENS.colors.text,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Quality Rubric
            </span>
          </div>

          {/* Separator */}
          <div
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
            }}
          />

          {/* Gauge rows: first gauge 30-60, remaining stagger 60-90 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {dimensions.map((dim, i) => {
              const gaugeStart =
                i === 0
                  ? T.FIRST_GAUGE_START
                  : T.REMAINING_GAUGES_START + (i - 1) * 7;
              const gaugeDuration = i === 0 ? 25 : 20;

              return (
                <GaugeRow
                  key={dim.name}
                  dimension={dim}
                  animateFrom={gaugeStart}
                  animationDuration={gaugeDuration}
                />
              );
            })}
          </div>

          {/* Separator before radar */}
          <div
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              marginTop: 4,
            }}
          />

          {/* Radar chart */}
          <div
            style={{
              opacity: radarOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 8,
                color: TOKENS.colors.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Composite Profile
            </span>
            <RadarChart
              axes={radarAxes}
              size={180}
              color={TOKENS.colors.accent}
              animateFrom={T.RADAR_START}
              animationDuration={T.RADAR_END - T.RADAR_START}
            />
          </div>

          {/* Overall score summary */}
          <div
            style={{
              opacity: interpolate(
                frame,
                [T.RADAR_END - 10, T.RADAR_END],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "4px 0",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: TOKENS.colors.muted,
                letterSpacing: 0.5,
              }}
            >
              Avg Score
            </span>
            <span
              style={{
                fontSize: 12,
                color: TOKENS.colors.accent,
                fontWeight: 600,
              }}
            >
              {Math.round(
                (dimensions.reduce((s, d) => s + d.numericScore, 0) /
                  dimensions.length) *
                  100,
              )}
              %
            </span>
          </div>
        </div>
      </div>

      {/* TechMetadataOverlay — required on all composition types */}
      <TechMetadataOverlay
        codec="h264"
        resolution="1280x720"
        fps={30}
        duration="12s"
      />

      {/* BottomBar with "Quality Assessment" label */}
      <BottomBar
        timeS={timeS}
        phaseLabel={phaseLabel}
        opacity={masterOpacity}
      />
    </AbsoluteFill>
  );
};

export default QualityRubricComposition;
