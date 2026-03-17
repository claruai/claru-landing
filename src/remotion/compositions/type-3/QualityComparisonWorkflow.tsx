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
// QualityComparisonWorkflow — Crowdsourced vs Expert RLHF quality
//
// Timeline (300 frames @ 30fps = 10s):
//   Phase 1 (0-30):    Fade in, header types
//   Phase 2 (30-60):   Split screen appears: "Crowdsourced" | "Expert"
//   Phase 3 (60-120):  Same code question shown on both sides
//   Phase 4 (120-180): Annotations arrive — crowdsourced noisy, expert consistent
//   Phase 5 (180-220): Agreement rate comparison counter
//   Phase 6 (220-250): Cost comparison bar
//   Phase 7 (250-300): JSON annotation output
// ---------------------------------------------------------------------------

const CODE_QUESTION = `def merge_sorted(a, b):
    result, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i]); i += 1
        else:
            result.append(b[j]); j += 1
    return result + a[i:] + b[j:]`;

const CODE_QUESTION_LINES = CODE_QUESTION.split("\n");

// Crowdsourced ratings — noisy, inconsistent
const CROWD_RATINGS = [
  { annotator: "worker_8821", score: 7, correct: true, delay: 0 },
  { annotator: "worker_1294", score: 3, correct: false, delay: 6 },
  { annotator: "worker_5510", score: 9, correct: true, delay: 12 },
  { annotator: "worker_0337", score: 2, correct: false, delay: 18 },
  { annotator: "worker_7762", score: 8, correct: true, delay: 24 },
  { annotator: "worker_4491", score: 4, correct: false, delay: 30 },
  { annotator: "worker_6103", score: 6, correct: false, delay: 36 },
];

// Expert ratings — consistent, accurate
const EXPERT_RATINGS = [
  { annotator: "expert_swe_l5", score: 8, correct: true, delay: 0 },
  { annotator: "expert_swe_l6", score: 9, correct: true, delay: 10 },
  { annotator: "expert_ml_l5", score: 8, correct: true, delay: 20 },
  { annotator: "expert_swe_l4", score: 9, correct: true, delay: 30 },
  { annotator: "expert_ml_l6", score: 8, correct: true, delay: 40 },
];

const JSON_LINES = [
  `{`,
  `  "comparison": "CROWD_VS_EXPERT_RLHF",`,
  `  "crowd_agreement": "42%",`,
  `  "expert_agreement": "94%",`,
  `  "crowd_variance": 6.2,`,
  `  "expert_variance": 0.3,`,
  `  "crowd_cost_per_annotation": "$0.05",`,
  `  "expert_cost_per_annotation": "$100",`,
  `  "expert_volume_needed": "6-7%",`,
  `  "recommendation": "expert",`,
  `  "status": "analysis_complete"`,
  `}`,
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Annotation row that fades in with color coding */
const AnnotationRow: React.FC<{
  annotator: string;
  score: number;
  correct: boolean;
  startFrame: number;
  isExpert: boolean;
}> = ({ annotator, score, correct, startFrame, isExpert }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideX = interpolate(frame, [startFrame, startFrame + 10], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity,
        transform: `translateX(${slideX}px)`,
        fontFamily: TOKENS.fonts.mono,
        padding: "3px 0",
      }}
    >
      <span style={{ fontSize: 9, color: "#444", width: 90 }}>
        {annotator}
      </span>
      <div
        style={{
          width: 28,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          backgroundColor: correct
            ? "rgba(34, 197, 94, 0.15)"
            : "rgba(239, 68, 68, 0.15)",
          border: `1px solid ${correct ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          fontSize: 11,
          fontWeight: 600,
          color: correct ? TOKENS.colors.chosen : TOKENS.colors.rejected,
        }}
      >
        {score}
      </div>
      {!correct && !isExpert && (
        <span style={{ fontSize: 8, color: TOKENS.colors.rejected, opacity: 0.7 }}>
          incorrect
        </span>
      )}
      {correct && isExpert && (
        <span style={{ fontSize: 8, color: TOKENS.colors.chosen, opacity: 0.7 }}>
          verified
        </span>
      )}
    </div>
  );
};

/** Animated stat counter */
const StatCounter: React.FC<{
  label: string;
  value: number;
  suffix: string;
  startFrame: number;
  color: string;
  duration?: number;
}> = ({ label, value, suffix, startFrame, color, duration = 25 }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity,
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      <span style={{ fontSize: 28, fontWeight: 700, color }}>
        {Math.round(value * progress)}{suffix}
      </span>
      <span style={{ fontSize: 9, color: TOKENS.colors.muted, letterSpacing: 1 }}>
        {label}
      </span>
    </div>
  );
};

/** Variance indicator bar */
const VarianceBar: React.FC<{
  label: string;
  variance: number;
  maxVariance: number;
  startFrame: number;
  color: string;
}> = ({ label, variance, maxVariance, startFrame, color }) => {
  const frame = useCurrentFrame();

  const width = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [0, (variance / maxVariance) * 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      <span style={{ fontSize: 9, color: TOKENS.colors.muted, width: 100, textAlign: "right" }}>
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 6,
          backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            backgroundColor: color,
            borderRadius: 3,
            opacity: 0.7,
          }}
        />
      </div>
      <span style={{ fontSize: 10, color, width: 30 }}>
        {variance.toFixed(1)}
      </span>
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
        width: "32%",
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
        quality analysis output
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

const QualityComparisonWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  // Setup fade
  const setupFade = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Header typewriter
  const headerText = "Evaluate: Is this merge sort implementation correct and efficient?";
  const headerProgress = interpolate(frame, [10, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerChars = Math.floor(headerProgress * headerText.length);

  // Code block reveal
  const codeOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Split header opacity
  const splitOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Agreement rate section (180-220)
  const agreementOpacity = interpolate(frame, [180, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cost section (220-250)
  const costOpacity = interpolate(frame, [220, 235], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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

  const contentRightPct = interpolate(jsonSlideIn, [0, 1], [0, 32]);

  // Phase label
  let phaseLabel = "Loading";
  if (frame < 30) phaseLabel = "Reading Task";
  else if (frame < 60) phaseLabel = "Reviewing Code";
  else if (frame < 120) phaseLabel = "Distributing to Annotators";
  else if (frame < 180) phaseLabel = "Collecting Annotations";
  else if (frame < 220) phaseLabel = "Agreement Analysis";
  else if (frame < 250) phaseLabel = "Cost Analysis";
  else phaseLabel = "Analysis Output";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* --- Top header: question --- */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: `${contentRightPct}%`,
          height: 42,
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
        <span style={{ color: TOKENS.colors.accent, fontSize: 11, fontWeight: 600 }}>$</span>
        <span style={{ fontSize: 11, color: TOKENS.colors.text }}>
          {headerText.slice(0, headerChars)}
          {headerChars < headerText.length && (
            <span
              style={{
                color: TOKENS.colors.accent,
                opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
              }}
            >
              |
            </span>
          )}
        </span>
      </div>

      {/* --- Code block (shared between both sides) --- */}
      <div
        style={{
          position: "absolute",
          top: 42,
          left: 0,
          right: `${contentRightPct}%`,
          height: 130,
          padding: "8px 16px",
          backgroundColor: "rgba(15, 14, 13, 0.95)",
          borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
          opacity: codeOpacity * setupFade,
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 9, color: TOKENS.colors.muted, marginBottom: 4, letterSpacing: 1 }}>
          CODE UNDER REVIEW
        </div>
        {CODE_QUESTION_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              fontSize: 10,
              lineHeight: 1.55,
            }}
          >
            <span style={{ color: "#333", width: 16, textAlign: "right", flexShrink: 0 }}>
              {i + 1}
            </span>
            <span style={{ color: TOKENS.colors.text }}>{line}</span>
          </div>
        ))}
      </div>

      {/* --- Split comparison area --- */}
      <div
        style={{
          position: "absolute",
          top: 172,
          left: 0,
          right: `${contentRightPct}%`,
          bottom: frame >= 180 ? 130 : 32,
          display: "flex",
          opacity: splitOpacity * setupFade,
        }}
      >
        {/* Left: Crowdsourced */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "8px 14px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: TOKENS.colors.rejected,
                opacity: 0.6,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: TOKENS.colors.text,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Crowdsourced
            </span>
            <span style={{ fontSize: 9, color: "#444" }}>7 annotators</span>
          </div>

          {/* Crowd annotations */}
          {CROWD_RATINGS.map((r, i) => (
            <AnnotationRow
              key={i}
              annotator={r.annotator}
              score={r.score}
              correct={r.correct}
              startFrame={120 + r.delay}
              isExpert={false}
            />
          ))}
        </div>

        {/* Right: Expert */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "8px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: TOKENS.colors.chosen,
                opacity: 0.8,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: TOKENS.colors.text,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Expert
            </span>
            <span style={{ fontSize: 9, color: "#444" }}>5 annotators</span>
          </div>

          {/* Expert annotations */}
          {EXPERT_RATINGS.map((r, i) => (
            <AnnotationRow
              key={i}
              annotator={r.annotator}
              score={r.score}
              correct={r.correct}
              startFrame={120 + r.delay}
              isExpert={true}
            />
          ))}
        </div>
      </div>

      {/* --- Center divider label --- */}
      {splitOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: 172,
            bottom: frame >= 180 ? 130 : 32,
            left: `${(100 - contentRightPct) / 2}%`,
            width: 1,
            backgroundColor: `rgba(255, 255, 255, ${0.06 * splitOpacity})`,
            zIndex: 10,
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "2px 6px",
              backgroundColor: "rgba(10, 9, 8, 0.85)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.06)",
              fontSize: 8,
              color: TOKENS.colors.muted,
              whiteSpace: "nowrap",
            }}
          >
            VS
          </div>
        </div>
      )}

      {/* --- Bottom stats area (180+) --- */}
      {frame >= 178 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: `${contentRightPct}%`,
            bottom: 32,
            height: 128,
            padding: "8px 20px",
            backgroundColor: "rgba(10, 9, 8, 0.92)",
            borderTop: `1px solid ${TOKENS.colors.accent}15`,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 15,
          }}
        >
          {/* Agreement rates */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 48,
              opacity: agreementOpacity,
            }}
          >
            <StatCounter
              label="Crowd Agreement"
              value={42}
              suffix="%"
              startFrame={185}
              color={TOKENS.colors.rejected}
            />
            <div
              style={{
                width: 1,
                height: 36,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            />
            <StatCounter
              label="Expert Agreement"
              value={94}
              suffix="%"
              startFrame={185}
              color={TOKENS.colors.chosen}
            />
          </div>

          {/* Variance bars */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              opacity: costOpacity,
            }}
          >
            <VarianceBar
              label="Crowd variance"
              variance={6.2}
              maxVariance={8}
              startFrame={222}
              color={TOKENS.colors.rejected}
            />
            <VarianceBar
              label="Expert variance"
              variance={0.3}
              maxVariance={8}
              startFrame={228}
              color={TOKENS.colors.chosen}
            />
          </div>

          {/* Cost comparison */}
          {costOpacity > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                opacity: costOpacity,
                fontSize: 9,
                color: TOKENS.colors.muted,
              }}
            >
              <span>
                Cost: <span style={{ color: TOKENS.colors.text }}>$0.05</span> crowd
              </span>
              <span style={{ color: "#333" }}>vs</span>
              <span>
                <span style={{ color: TOKENS.colors.accent }}>$100</span> expert
              </span>
              <span style={{ color: "#333" }}>|</span>
              <span>
                Expert needs only{" "}
                <span style={{ color: TOKENS.colors.accent, fontWeight: 600 }}>6-7%</span> of volume
              </span>
            </div>
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
        rightInset={frame >= 250 ? jsonSlideIn * 32 * 12.8 : 0}
      />
    </AbsoluteFill>
  );
};

export default QualityComparisonWorkflow;
