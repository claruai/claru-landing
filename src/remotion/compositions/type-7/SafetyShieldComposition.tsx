import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TerminalHeader } from "../../shared/TerminalHeader";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import { BottomBar } from "../../shared/BottomBar";

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

/** Animated cursor icon (pointer arrow) */
const CursorIcon: React.FC<{ clicking?: boolean }> = ({ clicking }) => (
  <svg
    width="20"
    height="24"
    viewBox="0 0 24 28"
    fill="none"
    style={{ filter: clicking ? "drop-shadow(0 0 6px #fff)" : "none" }}
  >
    <path
      d="M5 2L5 22L10 17L16 26L19 24L13 15L20 15L5 2Z"
      fill={clicking ? "#fff" : "rgba(255,255,255,0.95)"}
      stroke="rgba(0,0,0,0.5)"
      strokeWidth={1}
    />
  </svg>
);

/** Click ripple effect */
const ClickRipple: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const localF = frame - startFrame;
  if (localF < 0 || localF > 12) return null;
  const scale = interpolate(localF, [0, 12], [0.5, 2], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(localF, [0, 12], [0.6, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 4,
        top: 4,
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `1.5px solid ${TOKENS.colors.accent}`,
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

/** Blurred colored rectangle placeholder (simulates content without showing real content) */
const BlurredThumb: React.FC<{
  hue: number;
  width: number | string;
  height: number | string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
}> = ({
  hue,
  width,
  height,
  borderColor,
  borderWidth = 0,
  opacity = 1,
}) => (
  <div
    style={{
      width,
      height,
      backgroundColor: `hsla(${hue}, 20%, 18%, 0.8)`,
      filter: "blur(12px)",
      borderRadius: 4,
      border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : undefined,
      opacity,
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Inner noise texture */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
          repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.015) 0px,
            rgba(255,255,255,0.015) 2px,
            transparent 2px,
            transparent 6px
          )
        `,
      }}
    />
  </div>
);

/** JSON output panel with typing animation */
const JsonOutputPanel: React.FC<{
  json: Record<string, unknown>;
  frame: number;
  startFrame: number;
  title?: string;
}> = ({ json, frame, startFrame, title = "output.json" }) => {
  const localF = frame - startFrame;
  if (localF < 0) return null;

  const jsonStr = JSON.stringify(json, null, 2);
  const typeProgress = interpolate(localF, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const charsVisible = Math.floor(typeProgress * jsonStr.length);
  const displayText = jsonStr.slice(0, charsVisible);

  const panelOpacity = interpolate(localF, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        backgroundColor: "rgba(10, 9, 8, 0.92)",
        border: `1px solid ${TOKENS.colors.accent}30`,
        borderRadius: 4,
        overflow: "hidden",
        opacity: panelOpacity,
      }}
    >
      <TerminalHeader
        title={title}
        statusLabel={typeProgress >= 1 ? "COMPLETE" : "WRITING"}
        statusColor={
          typeProgress >= 1 ? TOKENS.colors.success : TOKENS.colors.warning
        }
      />
      <div style={{ padding: "6px 10px", maxHeight: 120, overflow: "hidden" }}>
        <pre
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 8,
            color: TOKENS.colors.accent,
            lineHeight: 1.4,
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {displayText}
          {typeProgress < 1 && (
            <span style={{ opacity: Math.floor(frame / 4) % 2 === 0 ? 1 : 0 }}>
              _
            </span>
          )}
        </pre>
      </div>
    </div>
  );
};

// ===========================================================================
// 1. SafetyAnnotationWorkflow — cs-gen-safety
//    Shows annotator working through a safety taxonomy on image thumbnails
// ===========================================================================

const SAFETY_CATEGORIES = [
  "Violence/Gore",
  "Nudity/NSFW",
  "Hate Speech",
  "Self-Harm",
  "Illegal Activity",
];

const THUMB_HUES = [200, 320, 50, 140, 270];

interface ImageEval {
  thumbIndex: number;
  category: string | null; // null = "Safe"
  isSafe: boolean;
}

const EVALUATIONS: ImageEval[] = [
  { thumbIndex: 0, category: "Violence/Gore", isSafe: false },
  { thumbIndex: 1, category: null, isSafe: true },
  { thumbIndex: 2, category: "Hate Speech", isSafe: false },
  { thumbIndex: 3, category: null, isSafe: true },
  { thumbIndex: 4, category: "Self-Harm", isSafe: false },
];

const SafetyAnnotationWorkflow: React.FC = () => {
  const frame = useCurrentFrame();

  // Timeline:
  // 0-20:    Grid fades in
  // 20-40:   Cursor moves to image 0, clicks
  // 40-70:   Taxonomy panel opens, cursor selects "Violence/Gore", clicks "Flag"
  // 70-100:  Move to image 1, cursor selects "Safe"
  // 100-130: Move to image 2, select "Hate Speech"
  // 130-160: Move to image 3, select "Safe"
  // 160-190: Move to image 4, select "Self-Harm"
  // 190-220: Aggregate stats appear
  // 220-260: JSON output
  // 260-300: Fade out / CLARU watermark

  const gridOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Which eval is active? Each takes 30 frames starting at frame 20
  const EVAL_START = 20;
  const EVAL_DURATION = 34;
  const evalIndex = Math.floor((frame - EVAL_START) / EVAL_DURATION);
  const evalLocalF = (frame - EVAL_START) % EVAL_DURATION;
  const activeEval = evalIndex >= 0 && evalIndex < EVALUATIONS.length ? evalIndex : -1;

  // How many evals are completed
  const completedEvals = Math.min(
    Math.max(0, Math.floor((frame - EVAL_START) / EVAL_DURATION)),
    EVALUATIONS.length
  );

  // Taxonomy panel visible when actively evaluating
  const taxonomyVisible = activeEval >= 0 && activeEval < EVALUATIONS.length;

  // Stats phase
  const statsStartFrame = EVAL_START + EVALUATIONS.length * EVAL_DURATION;
  const showStats = frame >= statsStartFrame;

  // Count flagged/safe from completed
  const flaggedCount = EVALUATIONS.slice(0, completedEvals).filter(
    (e) => !e.isSafe
  ).length;
  const safeCount = EVALUATIONS.slice(0, completedEvals).filter(
    (e) => e.isSafe
  ).length;

  // Cursor position calculation
  const getCursorPos = (): { x: number; y: number; clicking: boolean } => {
    if (activeEval < 0 || activeEval >= EVALUATIONS.length) {
      return { x: -50, y: -50, clicking: false };
    }

    const e = EVALUATIONS[activeEval];

    // Phase 1 (0-8): move to thumbnail
    if (evalLocalF < 8) {
      const col = e.thumbIndex % 3;
      const row = Math.floor(e.thumbIndex / 3);
      const x = 40 + col * 120 + 50;
      const y = 60 + row * 110 + 45;
      return { x, y, clicking: false };
    }
    // Phase 2 (8-12): click on thumbnail
    if (evalLocalF < 12) {
      const col = e.thumbIndex % 3;
      const row = Math.floor(e.thumbIndex / 3);
      const x = 40 + col * 120 + 50;
      const y = 60 + row * 110 + 45;
      return { x, y, clicking: evalLocalF === 9 || evalLocalF === 10 };
    }
    // Phase 3 (12-22): move to taxonomy panel option
    if (evalLocalF < 22) {
      if (e.isSafe) {
        // Move to "Safe" button
        return {
          x: interpolate(evalLocalF, [12, 18], [400, 540], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          y: interpolate(evalLocalF, [12, 18], [200, 350], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          clicking: false,
        };
      }
      // Move to the specific category
      const catIdx = SAFETY_CATEGORIES.indexOf(e.category!);
      return {
        x: interpolate(evalLocalF, [12, 18], [400, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        y: interpolate(evalLocalF, [12, 18], [200, 110 + catIdx * 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        clicking: false,
      };
    }
    // Phase 4 (22-26): click on category/safe
    if (evalLocalF < 26) {
      if (e.isSafe) {
        return { x: 540, y: 350, clicking: evalLocalF === 23 || evalLocalF === 24 };
      }
      const catIdx = SAFETY_CATEGORIES.indexOf(e.category!);
      return { x: 560, y: 110 + catIdx * 30, clicking: evalLocalF === 23 || evalLocalF === 24 };
    }
    // Phase 5 (26-30): click "Flag" button
    if (!e.isSafe && evalLocalF < 30) {
      return {
        x: 560,
        y: 310,
        clicking: evalLocalF === 27 || evalLocalF === 28,
      };
    }
    return { x: -50, y: -50, clicking: false };
  };

  const cursorPos = getCursorPos();

  // JSON output
  const jsonOutput = {
    batch_id: "SAF-2024-0847",
    total_items: 5,
    flagged: flaggedCount,
    safe: safeCount,
    violation_rate: `${((flaggedCount / 5) * 100).toFixed(0)}%`,
    calibration_score: "92.4%",
    threshold: "<2% violation",
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Left side: Image grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "55%",
          height: "100%",
          padding: "8px 8px 40px 8px",
          opacity: gridOpacity,
        }}
      >
        <TerminalHeader
          title="safety-annotation — batch review"
          statusLabel={
            completedEvals >= EVALUATIONS.length
              ? "COMPLETE"
              : `${completedEvals}/${EVALUATIONS.length}`
          }
          statusColor={
            completedEvals >= EVALUATIONS.length
              ? TOKENS.colors.success
              : TOKENS.colors.warning
          }
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            padding: "16px 12px",
          }}
        >
          {THUMB_HUES.map((hue, i) => {
            const evalForThumb = EVALUATIONS.find((e) => e.thumbIndex === i);
            const isCompleted =
              evalForThumb && completedEvals > EVALUATIONS.indexOf(evalForThumb);
            const isActive =
              activeEval >= 0 &&
              activeEval < EVALUATIONS.length &&
              EVALUATIONS[activeEval].thumbIndex === i;

            let borderColor = "rgba(255,255,255,0.08)";
            let borderW = 1;
            if (isActive) {
              borderColor = TOKENS.colors.accent;
              borderW = 2;
            } else if (isCompleted && evalForThumb) {
              borderColor = evalForThumb.isSafe
                ? TOKENS.colors.success
                : (TOKENS.colors.error as string);
              borderW = 2;
            }

            return (
              <div key={i} style={{ position: "relative" }}>
                <BlurredThumb
                  hue={hue}
                  width={100}
                  height={80}
                  borderColor={borderColor}
                  borderWidth={borderW}
                />
                {/* Verdict overlay */}
                {isCompleted && evalForThumb && (
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      padding: "1px 5px",
                      borderRadius: 2,
                      backgroundColor: evalForThumb.isSafe
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(239, 68, 68, 0.2)",
                      border: `1px solid ${
                        evalForThumb.isSafe
                          ? TOKENS.colors.success
                          : TOKENS.colors.error
                      }50`,
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 7,
                      fontWeight: 700,
                      color: evalForThumb.isSafe
                        ? TOKENS.colors.success
                        : (TOKENS.colors.error as string),
                    }}
                  >
                    {evalForThumb.isSafe ? "SAFE" : "FLAG"}
                  </div>
                )}
                {/* Image number */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    left: 4,
                    fontFamily: TOKENS.fonts.mono,
                    fontSize: 7,
                    color: TOKENS.colors.muted,
                  }}
                >
                  IMG-{String(i + 1).padStart(3, "0")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Aggregate stats */}
        {showStats && (
          <div
            style={{
              margin: "8px 12px",
              padding: "8px 12px",
              backgroundColor: "rgba(10, 9, 8, 0.85)",
              border: `1px solid ${TOKENS.colors.accent}30`,
              borderRadius: 4,
              opacity: interpolate(
                frame,
                [statsStartFrame, statsStartFrame + 15],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
            }}
          >
            <div
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 9,
                color: TOKENS.colors.muted,
                letterSpacing: 2,
                marginBottom: 6,
              }}
            >
              BATCH SUMMARY
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 10 }}>
                <span style={{ color: TOKENS.colors.error as string }}>
                  {EVALUATIONS.filter((e) => !e.isSafe).length}/5
                </span>
                <span style={{ color: TOKENS.colors.muted }}> flagged</span>
              </div>
              <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 10 }}>
                <span style={{ color: TOKENS.colors.success }}>
                  {EVALUATIONS.filter((e) => e.isSafe).length}/5
                </span>
                <span style={{ color: TOKENS.colors.muted }}> safe</span>
              </div>
              <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 10 }}>
                <span style={{ color: TOKENS.colors.accent }}>92.4%</span>
                <span style={{ color: TOKENS.colors.muted }}> calibration</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right side: Taxonomy panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "45%",
          height: "100%",
          padding: "8px 12px 40px 8px",
          backgroundColor: "rgba(10, 9, 8, 0.6)",
          borderLeft: `1px solid ${TOKENS.colors.accent}15`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Taxonomy categories */}
        <div
          style={{
            backgroundColor: "rgba(10, 9, 8, 0.92)",
            border: `1px solid ${TOKENS.colors.accent}30`,
            borderRadius: 4,
            overflow: "hidden",
            opacity: taxonomyVisible
              ? interpolate(evalLocalF, [8, 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : frame >= statsStartFrame
              ? 0.4
              : 0,
          }}
        >
          <TerminalHeader
            title="safety-taxonomy"
            statusLabel={
              taxonomyVisible
                ? `IMG-${String((EVALUATIONS[activeEval]?.thumbIndex ?? 0) + 1).padStart(3, "0")}`
                : "IDLE"
            }
            statusColor={
              taxonomyVisible ? TOKENS.colors.accent : TOKENS.colors.muted
            }
          />
          <div style={{ padding: "8px 10px" }}>
            {SAFETY_CATEGORIES.map((cat, i) => {
              const isSelected =
                taxonomyVisible &&
                !EVALUATIONS[activeEval]?.isSafe &&
                EVALUATIONS[activeEval]?.category === cat &&
                evalLocalF >= 22;
              const isHovered =
                taxonomyVisible &&
                !EVALUATIONS[activeEval]?.isSafe &&
                EVALUATIONS[activeEval]?.category === cat &&
                evalLocalF >= 18 &&
                evalLocalF < 26;

              return (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px",
                    marginBottom: 4,
                    borderRadius: 3,
                    backgroundColor: isSelected
                      ? "rgba(239, 68, 68, 0.15)"
                      : isHovered
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                    border: isSelected
                      ? `1px solid ${TOKENS.colors.error}50`
                      : "1px solid transparent",
                    transition: "background-color 0.1s",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      border: `1px solid ${
                        isSelected ? TOKENS.colors.error : TOKENS.colors.muted
                      }60`,
                      backgroundColor: isSelected
                        ? (TOKENS.colors.error as string)
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 7,
                      color: "#fff",
                    }}
                  >
                    {isSelected ? "\u2713" : ""}
                  </div>
                  <span
                    style={{
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 9,
                      color: isSelected
                        ? (TOKENS.colors.error as string)
                        : TOKENS.colors.text,
                    }}
                  >
                    {cat}
                  </span>
                </div>
              );
            })}

            {/* Safe button */}
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  borderRadius: 3,
                  backgroundColor:
                    taxonomyVisible &&
                    EVALUATIONS[activeEval]?.isSafe &&
                    evalLocalF >= 22
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(34, 197, 94, 0.05)",
                  border: `1px solid ${TOKENS.colors.success}40`,
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 9,
                  fontWeight: 600,
                  color: TOKENS.colors.success,
                  textAlign: "center" as const,
                }}
              >
                SAFE
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  borderRadius: 3,
                  backgroundColor:
                    taxonomyVisible &&
                    !EVALUATIONS[activeEval]?.isSafe &&
                    evalLocalF >= 26
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(239, 68, 68, 0.05)",
                  border: `1px solid ${TOKENS.colors.error}40`,
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 9,
                  fontWeight: 600,
                  color: TOKENS.colors.error as string,
                  textAlign: "center" as const,
                }}
              >
                FLAG
              </div>
            </div>
          </div>
        </div>

        {/* JSON output */}
        {showStats && (
          <JsonOutputPanel
            json={jsonOutput}
            frame={frame}
            startFrame={statsStartFrame + 20}
            title="annotation-result.json"
          />
        )}
      </div>

      {/* Animated cursor */}
      {cursorPos.x > 0 && cursorPos.y > 0 && (
        <div
          style={{
            position: "absolute",
            left: cursorPos.x,
            top: cursorPos.y,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <CursorIcon clicking={cursorPos.clicking} />
          {cursorPos.clicking && (
            <ClickRipple frame={frame} startFrame={frame} />
          )}
        </div>
      )}
    </div>
  );
};

// ===========================================================================
// 2. ModerationDashboard — cs-red-team & sol-red-teaming
//    Shows a moderation platform with content pipeline + live stats
// ===========================================================================

interface PipelineItem {
  id: string;
  hue: number;
  flagged: boolean;
  flagCategory?: string;
  entryFrame: number;
}

const PIPELINE_ITEMS: PipelineItem[] = [
  { id: "MOD-001", hue: 200, flagged: false, entryFrame: 10 },
  { id: "MOD-002", hue: 340, flagged: true, flagCategory: "Violence", entryFrame: 25 },
  { id: "MOD-003", hue: 120, flagged: false, entryFrame: 40 },
  { id: "MOD-004", hue: 50, flagged: true, flagCategory: "Hate Speech", entryFrame: 55 },
  { id: "MOD-005", hue: 280, flagged: false, entryFrame: 70 },
  { id: "MOD-006", hue: 170, flagged: false, entryFrame: 85 },
  { id: "MOD-007", hue: 30, flagged: true, flagCategory: "Nudity", entryFrame: 100 },
  { id: "MOD-008", hue: 90, flagged: false, entryFrame: 115 },
  { id: "MOD-009", hue: 220, flagged: false, entryFrame: 130 },
  { id: "MOD-010", hue: 310, flagged: false, entryFrame: 145 },
  { id: "MOD-011", hue: 160, flagged: false, entryFrame: 160 },
  { id: "MOD-012", hue: 70, flagged: false, entryFrame: 175 },
];

const CATEGORY_COLORS: Record<string, string> = {
  Violence: TOKENS.colors.error as string,
  Nudity: "#c084fc",
  "Hate Speech": TOKENS.colors.warning,
  Safe: TOKENS.colors.success,
};

const ModerationDashboard: React.FC<{
  compositionId: string;
}> = ({ compositionId }) => {
  const frame = useCurrentFrame();
  const isSolution = compositionId === "sol-red-teaming";

  // Items that have entered the pipeline
  const activeItems = PIPELINE_ITEMS.filter((item) => frame >= item.entryFrame);
  // Items that have completed processing (takes 40 frames to traverse)
  const processedItems = PIPELINE_ITEMS.filter(
    (item) => frame >= item.entryFrame + 40
  );

  const processedCount = processedItems.length;
  const flaggedItems = processedItems.filter((i) => i.flagged);

  // Ticking counter
  const displayCount = Math.min(
    processedCount,
    Math.floor(
      interpolate(frame, [30, 250], [0, PIPELINE_ITEMS.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  // Category counts for bar chart
  const categoryCounts: Record<string, number> = {
    Violence: 0,
    Nudity: 0,
    "Hate Speech": 0,
    Safe: 0,
  };
  for (const item of processedItems) {
    if (item.flagged && item.flagCategory) {
      categoryCounts[item.flagCategory] =
        (categoryCounts[item.flagCategory] || 0) + 1;
    } else if (!item.flagged) {
      categoryCounts["Safe"] += 1;
    }
  }
  const maxCount = Math.max(...Object.values(categoryCounts), 1);

  // Pipeline stages
  const stages = ["Model 1", "Model 2", "Model 3", "Human Review"];

  // Dashboard fade in
  const dashOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final stats
  const showFinal = frame >= 230;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: dashOpacity }}>
      {/* Left side: Content pipeline feed */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "40%",
          height: "100%",
          padding: "8px 8px 40px 8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TerminalHeader
          title={isSolution ? "red-team — content feed" : "moderation — pipeline"}
          statusLabel={`${displayCount} processed`}
          statusColor={TOKENS.colors.accent}
        />

        {/* Pipeline stages header */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "8px 8px 4px",
            borderBottom: `1px solid ${TOKENS.colors.accent}15`,
          }}
        >
          {stages.map((stage, i) => (
            <div
              key={stage}
              style={{
                flex: 1,
                fontFamily: TOKENS.fonts.mono,
                fontSize: 7,
                color: TOKENS.colors.muted,
                textAlign: "center" as const,
                padding: "2px 0",
                borderBottom: `1px solid ${TOKENS.colors.accent}30`,
              }}
            >
              {stage}
            </div>
          ))}
        </div>

        {/* Flowing items */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            padding: "4px 8px",
            position: "relative",
          }}
        >
          {activeItems.slice(-8).map((item) => {
            const localF = frame - item.entryFrame;
            // Item flows from left to right across 4 stages
            const xProgress = interpolate(localF, [0, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const itemOpacity = interpolate(
              localF,
              [0, 3, 35, 45],
              [0, 1, 1, 0.3],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Vertical position based on order in visible list
            const visibleIdx = activeItems
              .slice(-8)
              .findIndex((i) => i.id === item.id);

            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  left: `${xProgress * 80}%`,
                  top: 4 + visibleIdx * 30,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  opacity: itemOpacity,
                }}
              >
                <BlurredThumb
                  hue={item.hue}
                  width={24}
                  height={20}
                  borderColor={
                    item.flagged && localF > 20
                      ? (TOKENS.colors.error as string)
                      : "rgba(255,255,255,0.1)"
                  }
                  borderWidth={item.flagged && localF > 20 ? 2 : 1}
                />
                <span
                  style={{
                    fontFamily: TOKENS.fonts.mono,
                    fontSize: 7,
                    color:
                      item.flagged && localF > 20
                        ? (TOKENS.colors.error as string)
                        : TOKENS.colors.muted,
                  }}
                >
                  {item.id}
                </span>
                {item.flagged && localF > 25 && (
                  <span
                    style={{
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 6,
                      padding: "1px 4px",
                      borderRadius: 2,
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                      color: TOKENS.colors.error as string,
                      border: `1px solid ${TOKENS.colors.error}40`,
                    }}
                  >
                    FLAG
                  </span>
                )}
                {!item.flagged && localF > 30 && (
                  <span
                    style={{
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 6,
                      padding: "1px 4px",
                      borderRadius: 2,
                      backgroundColor: "rgba(34, 197, 94, 0.15)",
                      color: TOKENS.colors.success,
                    }}
                  >
                    PASS
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Dashboard */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%",
          height: "100%",
          padding: "8px 12px 40px 8px",
          backgroundColor: "rgba(10, 9, 8, 0.6)",
          borderLeft: `1px solid ${TOKENS.colors.accent}15`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Live detection stats */}
        <div
          style={{
            backgroundColor: "rgba(10, 9, 8, 0.92)",
            border: `1px solid ${TOKENS.colors.accent}30`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <TerminalHeader
            title={isSolution ? "red-team-dashboard" : "moderation-dashboard"}
            statusLabel="LIVE"
            statusColor={TOKENS.colors.success}
          />
          <div style={{ padding: "8px 12px" }}>
            {/* Counter */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 9,
                  color: TOKENS.colors.muted,
                }}
              >
                Items Processed
              </span>
              <span
                style={{
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 16,
                  fontWeight: 700,
                  color: TOKENS.colors.accent,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(displayCount).padStart(3, "0")}
              </span>
            </div>

            {/* Category breakdown bars */}
            <div
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 8,
                color: TOKENS.colors.muted,
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              CATEGORY BREAKDOWN
            </div>
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div
                key={cat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: TOKENS.fonts.mono,
                    fontSize: 8,
                    color: CATEGORY_COLORS[cat] || TOKENS.colors.muted,
                    minWidth: 70,
                  }}
                >
                  {cat}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(count / Math.max(maxCount, 1)) * 100}%`,
                      height: "100%",
                      backgroundColor:
                        CATEGORY_COLORS[cat] || TOKENS.colors.muted,
                      borderRadius: 2,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: TOKENS.fonts.mono,
                    fontSize: 8,
                    color: TOKENS.colors.text,
                    minWidth: 14,
                    textAlign: "right" as const,
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Threshold gauge */}
        <div
          style={{
            backgroundColor: "rgba(10, 9, 8, 0.92)",
            border: `1px solid ${TOKENS.colors.accent}30`,
            borderRadius: 4,
            padding: "8px 12px",
          }}
        >
          <div
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: TOKENS.colors.muted,
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            FALSE POSITIVE RATE
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Gauge bar */}
            <div
              style={{
                flex: 1,
                height: 8,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* 2% threshold marker */}
              <div
                style={{
                  position: "absolute",
                  left: "20%",
                  top: -2,
                  bottom: -2,
                  width: 1,
                  backgroundColor: TOKENS.colors.warning,
                  opacity: 0.6,
                }}
              />
              {/* Current value */}
              <div
                style={{
                  width: `${interpolate(frame, [50, 200], [0, 12], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}%`,
                  height: "100%",
                  backgroundColor: TOKENS.colors.success,
                  borderRadius: 4,
                  opacity: 0.8,
                }}
              />
            </div>
            <span
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 10,
                fontWeight: 700,
                color: TOKENS.colors.success,
              }}
            >
              {"<2%"}
            </span>
          </div>
        </div>

        {/* Pipeline stages visualization */}
        <div
          style={{
            backgroundColor: "rgba(10, 9, 8, 0.92)",
            border: `1px solid ${TOKENS.colors.accent}30`,
            borderRadius: 4,
            padding: "8px 12px",
          }}
        >
          <div
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: TOKENS.colors.muted,
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            DETECTION PIPELINE
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {stages.map((stage, i) => (
              <React.Fragment key={stage}>
                <div
                  style={{
                    padding: "3px 6px",
                    borderRadius: 3,
                    backgroundColor:
                      frame >= 30 + i * 30
                        ? "rgba(34, 197, 94, 0.12)"
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${
                      frame >= 30 + i * 30
                        ? `${TOKENS.colors.success}40`
                        : "rgba(255,255,255,0.08)"
                    }`,
                    fontFamily: TOKENS.fonts.mono,
                    fontSize: 8,
                    color:
                      frame >= 30 + i * 30
                        ? TOKENS.colors.success
                        : TOKENS.colors.muted,
                  }}
                >
                  {stage}
                </div>
                {i < stages.length - 1 && (
                  <span
                    style={{
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 10,
                      color:
                        frame >= 30 + (i + 1) * 30
                          ? TOKENS.colors.accent
                          : TOKENS.colors.muted,
                    }}
                  >
                    {"\u2192"}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Final stats */}
        {showFinal && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "rgba(34, 197, 94, 0.08)",
              border: `1px solid ${TOKENS.colors.success}30`,
              borderRadius: 4,
              opacity: interpolate(frame, [230, 245], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 11,
                fontWeight: 700,
                color: TOKENS.colors.success,
                letterSpacing: 1,
              }}
            >
              0 CRITICAL GAPS IDENTIFIED
            </div>
            <div
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 8,
                color: TOKENS.colors.muted,
                marginTop: 4,
              }}
            >
              {isSolution
                ? "Red team assessment complete - all attack vectors covered"
                : `${flaggedItems.length} items flagged across ${
                    Object.values(categoryCounts).filter((c) => c > 0).length - 1
                  } categories | <2% rejection rate`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===========================================================================
// 3. ComplianceReview — sol-eu-ai-act
//    Shows EU AI Act compliance checklist workflow with article checks
// ===========================================================================

interface ComplianceArticle {
  article: string;
  title: string;
  verdict: "PASS" | "COMPLIANT" | "REVIEW";
  riskLevel?: string;
  startFrame: number;
}

const EU_ARTICLES: ComplianceArticle[] = [
  {
    article: "Art. 5",
    title: "Prohibited Practices",
    verdict: "PASS",
    startFrame: 40,
  },
  {
    article: "Art. 6",
    title: "High-Risk Classification",
    verdict: "REVIEW",
    riskLevel: "HIGH",
    startFrame: 80,
  },
  {
    article: "Art. 52",
    title: "Transparency",
    verdict: "COMPLIANT",
    startFrame: 120,
  },
  {
    article: "Art. 55",
    title: "GPAI Requirements",
    verdict: "COMPLIANT",
    startFrame: 160,
  },
];

const EU_BLUE = "#003399";

const ENFORCEMENT_DATES = [
  { date: "Feb 2025", label: "Prohibitions", passed: true },
  { date: "Aug 2025", label: "GPAI Rules", passed: true },
  { date: "Aug 2026", label: "Full Enforcement", passed: false },
];

const ComplianceReview: React.FC = () => {
  const frame = useCurrentFrame();

  // Cursor position based on which article is being reviewed
  const getArticleCursorPos = (): {
    x: number;
    y: number;
    clicking: boolean;
  } => {
    for (let i = 0; i < EU_ARTICLES.length; i++) {
      const art = EU_ARTICLES[i];
      const localF = frame - art.startFrame;
      if (localF >= 0 && localF < 35) {
        // Phase 1 (0-10): move to verdict area
        if (localF < 10) {
          return {
            x: interpolate(localF, [0, 8], [300, 580], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            y: interpolate(localF, [0, 8], [200, 92 + i * 80], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            clicking: false,
          };
        }
        // Phase 2 (10-18): hover verdict badge area
        if (localF < 18) {
          return {
            x: 580,
            y: 92 + i * 80,
            clicking: false,
          };
        }
        // Phase 3 (18-24): click
        if (localF < 24) {
          return {
            x: 580,
            y: 92 + i * 80,
            clicking: localF === 19 || localF === 20,
          };
        }
        // Phase 4 (24-35): move away
        return { x: -50, y: -50, clicking: false };
      }
    }
    return { x: -50, y: -50, clicking: false };
  };

  const cursorPos = getArticleCursorPos();

  // Content card fade in
  const contentOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Timeline appears at 200
  const timelineOpacity = interpolate(frame, [200, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // JSON output
  const jsonStartFrame = 230;
  const complianceJson = {
    assessment_id: "EU-AI-2024-0391",
    framework: "EU AI Act (Regulation 2024/1689)",
    articles_reviewed: 4,
    status: "CONDITIONALLY_COMPLIANT",
    risk_classification: "HIGH",
    next_review: "2026-08-01",
    findings: {
      "Art. 5": "PASS",
      "Art. 6": "HIGH_RISK - REVIEW",
      "Art. 52": "COMPLIANT",
      "Art. 55": "COMPLIANT",
    },
  };

  return (
    <div style={{ position: "absolute", inset: 0, opacity: contentOpacity }}>
      {/* Left side: Content card being reviewed */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "38%",
          height: "100%",
          padding: "8px 8px 40px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <TerminalHeader
          title="compliance-review — content"
          statusLabel="UNDER REVIEW"
          statusColor={TOKENS.colors.warning}
        />

        {/* Blurred content card */}
        <div
          style={{
            margin: "8px",
            padding: 12,
            backgroundColor: "rgba(10, 9, 8, 0.85)",
            border: `1px solid ${EU_BLUE}40`,
            borderRadius: 4,
          }}
        >
          <BlurredThumb hue={220} width="100%" height={120} />
          <div
            style={{
              marginTop: 8,
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: TOKENS.colors.muted,
            }}
          >
            <div>TYPE: Generative AI System</div>
            <div>DOMAIN: Emotion Recognition</div>
            <div>DEPLOYMENT: Workplace Surveillance</div>
          </div>
          <div
            style={{
              marginTop: 8,
              padding: "3px 6px",
              borderRadius: 3,
              backgroundColor: `${EU_BLUE}15`,
              border: `1px solid ${EU_BLUE}40`,
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: "#6699cc",
              display: "inline-block",
            }}
          >
            EU AI Act Assessment
          </div>
        </div>

        {/* Enforcement timeline */}
        {frame >= 200 && (
          <div
            style={{
              margin: "0 8px",
              padding: "8px 12px",
              backgroundColor: "rgba(10, 9, 8, 0.85)",
              border: `1px solid ${EU_BLUE}30`,
              borderRadius: 4,
              opacity: timelineOpacity,
            }}
          >
            <div
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 8,
                color: "#6699cc",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              ENFORCEMENT TIMELINE
            </div>
            <div style={{ position: "relative", paddingLeft: 12 }}>
              {/* Vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: 4,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: `${EU_BLUE}40`,
                }}
              />
              {ENFORCEMENT_DATES.map((d, i) => (
                <div
                  key={d.date}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    position: "relative",
                    opacity: interpolate(
                      frame,
                      [205 + i * 10, 215 + i * 10],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    ),
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: -10,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: d.passed
                        ? TOKENS.colors.success
                        : TOKENS.colors.warning,
                      border: `1px solid ${
                        d.passed ? TOKENS.colors.success : TOKENS.colors.warning
                      }`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 9,
                      fontWeight: 600,
                      color: d.passed
                        ? TOKENS.colors.success
                        : TOKENS.colors.warning,
                      minWidth: 55,
                    }}
                  >
                    {d.date}
                  </span>
                  <span
                    style={{
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 8,
                      color: TOKENS.colors.muted,
                    }}
                  >
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side: Compliance checklist */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "62%",
          height: "100%",
          padding: "8px 12px 40px 8px",
          backgroundColor: "rgba(10, 9, 8, 0.6)",
          borderLeft: `1px solid ${EU_BLUE}25`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <TerminalHeader
          title="eu-ai-act — compliance checklist"
          statusLabel={
            frame >= 200
              ? "ASSESSED"
              : `${EU_ARTICLES.filter((a) => frame >= a.startFrame + 24).length}/${EU_ARTICLES.length}`
          }
          statusColor={
            frame >= 200 ? TOKENS.colors.success : TOKENS.colors.warning
          }
        />

        {/* Articles */}
        {EU_ARTICLES.map((art, i) => {
          const localF = frame - art.startFrame;
          const isVisible = localF >= -10;
          const articleOpacity = isVisible
            ? interpolate(localF, [-10, 0], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;
          const isChecked = localF >= 24;
          const isActive = localF >= 0 && localF < 35;

          const verdictColor =
            art.verdict === "PASS"
              ? TOKENS.colors.success
              : art.verdict === "COMPLIANT"
              ? TOKENS.colors.success
              : TOKENS.colors.warning;

          return (
            <div
              key={art.article}
              style={{
                padding: "8px 12px",
                backgroundColor: isActive
                  ? "rgba(0, 51, 153, 0.08)"
                  : "rgba(10, 9, 8, 0.85)",
                border: `1px solid ${
                  isActive
                    ? `${EU_BLUE}50`
                    : isChecked
                    ? `${verdictColor}30`
                    : "rgba(255,255,255,0.06)"
                }`,
                borderRadius: 4,
                opacity: articleOpacity,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Checkbox */}
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      border: `1.5px solid ${
                        isChecked ? verdictColor : TOKENS.colors.muted
                      }60`,
                      backgroundColor: isChecked
                        ? `${verdictColor}20`
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 9,
                      color: verdictColor,
                      fontWeight: 700,
                    }}
                  >
                    {isChecked ? "\u2713" : ""}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: TOKENS.fonts.mono,
                        fontSize: 10,
                        fontWeight: 600,
                        color: TOKENS.colors.text,
                      }}
                    >
                      {art.article}
                    </div>
                    <div
                      style={{
                        fontFamily: TOKENS.fonts.mono,
                        fontSize: 8,
                        color: TOKENS.colors.muted,
                      }}
                    >
                      {art.title}
                    </div>
                  </div>
                </div>

                {/* Verdict badge */}
                {isChecked && (
                  <div
                    style={{
                      padding: "2px 8px",
                      borderRadius: 3,
                      backgroundColor: `${verdictColor}18`,
                      border: `1px solid ${verdictColor}50`,
                      fontFamily: TOKENS.fonts.mono,
                      fontSize: 8,
                      fontWeight: 600,
                      color: verdictColor,
                      letterSpacing: 0.5,
                      opacity: interpolate(localF, [24, 30], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                    }}
                  >
                    {art.verdict}
                  </div>
                )}
              </div>

              {/* Risk level selector for Art. 6 */}
              {art.riskLevel && isActive && localF >= 10 && (
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    gap: 6,
                    opacity: interpolate(localF, [10, 16], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  {["LOW", "MEDIUM", "HIGH", "UNACCEPTABLE"].map((level) => (
                    <div
                      key={level}
                      style={{
                        padding: "2px 6px",
                        borderRadius: 2,
                        backgroundColor:
                          level === art.riskLevel && localF >= 20
                            ? "rgba(245, 166, 35, 0.2)"
                            : "rgba(255,255,255,0.03)",
                        border: `1px solid ${
                          level === art.riskLevel && localF >= 20
                            ? `${TOKENS.colors.warning}60`
                            : "rgba(255,255,255,0.08)"
                        }`,
                        fontFamily: TOKENS.fonts.mono,
                        fontSize: 7,
                        color:
                          level === art.riskLevel && localF >= 20
                            ? TOKENS.colors.warning
                            : TOKENS.colors.muted,
                      }}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* JSON output */}
        {frame >= jsonStartFrame && (
          <JsonOutputPanel
            json={complianceJson}
            frame={frame}
            startFrame={jsonStartFrame}
            title="compliance-assessment.json"
          />
        )}
      </div>

      {/* Animated cursor */}
      {cursorPos.x > 0 && cursorPos.y > 0 && (
        <div
          style={{
            position: "absolute",
            left: cursorPos.x,
            top: cursorPos.y,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <CursorIcon clicking={cursorPos.clicking} />
          {cursorPos.clicking && (
            <ClickRipple frame={frame} startFrame={frame} />
          )}
        </div>
      )}
    </div>
  );
};

// ===========================================================================
// Main Composition — Routes by compositionId
// ===========================================================================

export interface SafetyShieldCompositionProps {
  compositionId: string;
}

const SafetyShieldComposition: React.FC<SafetyShieldCompositionProps> = ({
  compositionId,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  // Phase labels per composition type
  let phaseLabel = "Safety Review";

  if (compositionId === "cs-gen-safety") {
    if (frame < 20) phaseLabel = "Loading Batch";
    else if (frame < 190) phaseLabel = "Taxonomy Annotation";
    else if (frame < 230) phaseLabel = "Aggregating Results";
    else if (frame < 270) phaseLabel = "Writing Output";
    else phaseLabel = "Review Complete";
  } else if (
    compositionId === "cs-red-team" ||
    compositionId === "sol-red-teaming"
  ) {
    if (frame < 20) phaseLabel = "Initializing Pipeline";
    else if (frame < 100) phaseLabel = "Detection Active";
    else if (frame < 200) phaseLabel = "Processing Feed";
    else if (frame < 230) phaseLabel = "Analyzing Results";
    else phaseLabel = "Assessment Complete";
  } else if (compositionId === "sol-eu-ai-act") {
    if (frame < 20) phaseLabel = "Loading Assessment";
    else if (frame < 80) phaseLabel = "Art. 5 Review";
    else if (frame < 120) phaseLabel = "Art. 6 Review";
    else if (frame < 160) phaseLabel = "Art. 52 Review";
    else if (frame < 200) phaseLabel = "Art. 55 Review";
    else if (frame < 230) phaseLabel = "Generating Report";
    else phaseLabel = "Assessment Complete";
  }

  // Fade out at end
  const fadeOut = interpolate(frame, [270, 295], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CLARU watermark
  const watermarkOpacity = interpolate(frame, [280, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pick the right sub-composition
  let SubComposition: React.ReactNode;
  if (compositionId === "cs-gen-safety") {
    SubComposition = <SafetyAnnotationWorkflow />;
  } else if (
    compositionId === "cs-red-team" ||
    compositionId === "sol-red-teaming"
  ) {
    SubComposition = <ModerationDashboard compositionId={compositionId} />;
  } else if (compositionId === "sol-eu-ai-act") {
    SubComposition = <ComplianceReview />;
  } else {
    // Default fallback: gen-safety workflow
    SubComposition = <SafetyAnnotationWorkflow />;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* Main content — fades out at end */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: fadeOut,
        }}
      >
        {SubComposition}
      </div>

      {/* CLARU watermark — fades in at end */}
      {frame >= 275 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            opacity: watermarkOpacity,
          }}
        >
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 18,
              fontWeight: 700,
              color: TOKENS.colors.accent,
              letterSpacing: 6,
            }}
          >
            CLARU
          </span>
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 10,
              color: TOKENS.colors.muted,
              letterSpacing: 2,
            }}
          >
            {compositionId === "sol-eu-ai-act"
              ? "COMPLIANCE ASSESSMENT COMPLETE"
              : compositionId === "cs-gen-safety"
              ? "SAFETY ANNOTATION COMPLETE"
              : "MODERATION REVIEW COMPLETE"}
          </span>
        </div>
      )}

      {/* TechMetadataOverlay */}
      <TechMetadataOverlay
        codec="h264"
        resolution="1280x720"
        fps={fps}
        duration={`${(durationInFrames / fps).toFixed(0)}s`}
      />

      {/* BottomBar */}
      <BottomBar timeS={timeS} phaseLabel={phaseLabel} />
    </AbsoluteFill>
  );
};

export default SafetyShieldComposition;
