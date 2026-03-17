import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import { type Type2Annotation, FALLBACK_TYPE2_ANNOTATION } from "./types";
import CodeRLHFWorkflow from "./CodeRLHFWorkflow";

// ---------------------------------------------------------------------------
// PairwiseArenaComposition — Annotation workflow visualization
// Timeline (360 frames @ 30fps = 12s):
//   Phase 1 (0-30):    Setup — fade in, question header, video panels
//   Phase 2 (30-150):  Watching — videos play, cursor sweeps A↔B
//   Phase 3 (150-200): Evaluating — cursor hovers winner, click flash
//   Phase 4 (200-260): Result — winner border glow, loser dims, SELECTED
//   Phase 5 (260-360): Output — JSON annotation panel slides in
// ---------------------------------------------------------------------------

export interface PairwiseArenaCompositionProps {
  compositionId: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Hardcoded annotations per compositionId.
 * We inline these because `require()` doesn't work in Remotion's bundle.
 */
const ANNOTATIONS: Record<string, Type2Annotation> = {
  "cs-vid-eval": {
    type: 2,
    compositionId: "cs-vid-eval",
    videoA: {
      url: "",
      label: "config 21",
    },
    videoB: {
      url: "",
      label: "config 41",
    },
    winner: "A",
    promptText:
      "A friendly, anthropomorphic capybara sits peacefully on a sun-drenched grassy hill in realistic Pixar animation style, soft light-brown fur rippling in a gentle breeze...",
    configLabels: { a: "config 21", b: "config 41" },
  },
  "cs-prompt-bench": {
    type: 2,
    compositionId: "cs-prompt-bench",
    videoA: { url: "", label: "Video 1" },
    videoB: { url: "", label: "Video 2" },
    winner: "B",
    promptText:
      "Which video best represents the 'Kayaking' category? Select the clip that would serve as the definitive example of this activity.",
    categoryLabel: "Kayaking",
    categoryVerified: true,
    configLabels: { a: "Video 1", b: "Video 2" },
  },
  "sol-video-gen": {
    type: 2,
    compositionId: "sol-video-gen",
    videoA: { url: "", label: "A" },
    videoB: { url: "", label: "B" },
    winner: "A",
    promptText:
      "A lone cowboy strides down the desolate street of a post-apocalyptic ghost town, wearing a weathered trench coat and flat-brimmed hat. He fires an oversized pistol at shambling figures while the camera tracks his purposeful movement through the eerie, dust-filled ruins...",
    configLabels: { a: "Model A", b: "Model B" },
  },
  "sol-rlhf": {
    type: 2,
    compositionId: "sol-rlhf",
    videoA: { url: "", label: "A" },
    videoB: { url: "", label: "B" },
    winner: "A",
    promptText:
      "A lone cowboy strides down the desolate street of a post-apocalyptic ghost town, wearing a weathered trench coat and flat-brimmed hat. He fires an oversized pistol at shambling figures while the camera tracks his purposeful movement through the eerie, dust-filled ruins...",
    configLabels: { a: "Model A", b: "Model B" },
  },
};

function getAnnotation(compositionId: string): Type2Annotation {
  return ANNOTATIONS[compositionId] ?? { ...FALLBACK_TYPE2_ANNOTATION, compositionId };
}

/** Duration of source videos in composition frames at 30fps comp rate */
const VIDEO_DURATION_MAP: Record<string, number> = {
  "cs-vid-eval": 120,       // ~4.0s at 30fps
  "cs-prompt-bench": 150,   // ~4.94s at 30fps (longer video B)
  "sol-video-gen": 160,     // ~5.33s at 30fps
  "sol-rlhf": 160,          // ~5.33s at 30fps
};
const DEFAULT_VIDEO_DURATION_FRAMES = 120;

// ---------------------------------------------------------------------------
// Cursor SVG — simple pointer arrow
// ---------------------------------------------------------------------------
const CursorIcon: React.FC<{ clicking?: boolean }> = ({ clicking }) => (
  <svg
    width="24"
    height="28"
    viewBox="0 0 24 28"
    fill="none"
    style={{ filter: clicking ? "drop-shadow(0 0 6px #fff)" : "none" }}
  >
    <path
      d="M5 2L5 22L10 17L16 26L19 24L13 15L20 15L5 2Z"
      fill={clicking ? "#fff" : "rgba(255,255,255,0.95)"}
      stroke="rgba(0,0,0,0.5)"
      strokeWidth="1.5"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// JSON Output Panel — annotation data building line by line
// ---------------------------------------------------------------------------
const JsonOutputPanel: React.FC<{
  annotation: Type2Annotation;
  labelA: string;
  labelB: string;
  progress: number; // 0..1, how much of the JSON to reveal
  slideIn: number; // 0..1, panel slide-in progress
}> = ({ annotation, labelA, labelB, progress, slideIn }) => {
  const winnerLabel = annotation.winner === "A" ? labelA : labelB;
  const promptSnippet =
    annotation.promptText.length > 40
      ? annotation.promptText.slice(0, 40) + "..."
      : annotation.promptText;

  const isCategory = !!annotation.categoryLabel;

  const lines = isCategory
    ? [
        `{`,
        `  "project": "SUPER_CATEGORY_BEST_VIDEO",`,
        `  "category": "${annotation.categoryLabel}",`,
        `  "category_verified": ${annotation.categoryVerified ?? false},`,
        `  "selected": "${winnerLabel}",`,
        `  "video1_watched": "4.34s",`,
        `  "video2_watched": "4.94s",`,
        `  "status": "completed"`,
        `}`,
      ]
    : [
        `{`,
        `  "project": "PARAMS_TESTING_OVERALL_QUALITY",`,
        `  "config_a": "${labelA}",`,
        `  "config_b": "${labelB}",`,
        `  "selected": "${winnerLabel}",`,
        `  "prompt": "${promptSnippet}",`,
        `  "status": "completed"`,
        `}`,
      ];

  const visibleLines = Math.floor(progress * lines.length);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        right: 0,
        bottom: 32,
        width: "38%",
        backgroundColor: "rgba(10, 9, 8, 0.95)",
        borderLeft: `1px solid ${TOKENS.colors.accent}30`,
        padding: "16px 14px",
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
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        annotation output
      </div>
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 11,
          lineHeight: 1.7,
          color: TOKENS.colors.text,
        }}
      >
        {lines.slice(0, visibleLines).map((line, i) => (
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
        {/* Blinking cursor at end */}
        {visibleLines < lines.length && visibleLines > 0 && (
          <span
            style={{
              color: TOKENS.colors.accent,
              opacity: Math.sin(progress * 30) > 0 ? 1 : 0,
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
// Main composition
// ---------------------------------------------------------------------------
const PairwiseArenaDefault: React.FC<PairwiseArenaCompositionProps> = ({
  compositionId,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  const annotation = useMemo(
    () => getAnnotation(compositionId),
    [compositionId],
  );

  const videoASrc = staticFile(`remotion-assets/samples/${compositionId}-a.mp4`);
  const videoBSrc = staticFile(`remotion-assets/samples/${compositionId}-b.mp4`);
  const lastFrameASrc = staticFile(`remotion-assets/samples/${compositionId}-a-last.jpg`);
  const lastFrameBSrc = staticFile(`remotion-assets/samples/${compositionId}-b-last.jpg`);

  // Whether the video is still within its natural duration
  const videoDurationFrames = VIDEO_DURATION_MAP[compositionId] ?? DEFAULT_VIDEO_DURATION_FRAMES;
  const videoStillPlaying = frame < videoDurationFrames;

  // Labels
  const labelA = annotation.configLabels?.a ?? annotation.videoA.label ?? "A";
  const labelB = annotation.configLabels?.b ?? annotation.videoB.label ?? "B";
  const winnerSide = annotation.winner; // "A" or "B"

  // -------------------------------------------------------------------------
  // Animation timeline
  // -------------------------------------------------------------------------

  // Phase 1: Setup (0-30) — fade in
  const setupFade = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Watching (60-180) — cursor sweeps between sides
  // Delayed start so viewer reads the prompt first
  const cursorVisible = frame >= 70 && frame < 280;
  const watchingCursorX = (() => {
    if (frame < 70 || frame >= 180) return winnerSide === "A" ? 25 : 75;
    const t = (frame - 70) / 110; // 0..1 over sweep phase
    // Sine wave: 3 full sweeps (1.5 cycles from A to B and back)
    const sineVal = Math.sin(t * Math.PI * 3);
    return interpolate(sineVal, [-1, 1], [22, 78]);
  })();

  // Phase 3: Evaluating (180-220) — cursor moves to winner side
  const evalCursorX = (() => {
    if (frame < 180 || frame >= 220) return winnerSide === "A" ? 25 : 75;
    const target = winnerSide === "A" ? 25 : 75;
    const start = watchingCursorX;
    return interpolate(frame, [180, 200], [start, target], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  })();

  // Combined cursor X
  const cursorX = frame < 180 ? watchingCursorX : evalCursorX;

  // Cursor Y: slight drift for natural feel
  const cursorBaseY = 55; // percent from top of video area
  const cursorY =
    cursorBaseY + Math.sin(frame * 0.08) * 3 + Math.cos(frame * 0.05) * 2;

  // Click flash at frame 185
  const isClicking = frame >= 183 && frame <= 190;
  const clickFlash = interpolate(frame, [205, 207, 212], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight border on hover (before click, on winner side)
  const hoverHighlight = interpolate(frame, [160, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4: Result (220-280)
  const selectionProgress = interpolate(frame, [220, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "SELECTED" label fade in
  const selectedLabelOpacity = interpolate(frame, [215, 235], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5: JSON output (280-360)
  const jsonSlideIn = interpolate(frame, [280, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const jsonProgress = interpolate(frame, [310, 355], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Video area shrinks when JSON panel slides in
  const videoAreaRightPct = interpolate(jsonSlideIn, [0, 1], [0, 38]);

  // Phase label for BottomBar — category-aware labels for cs-prompt-bench
  const isCategory = !!annotation.categoryLabel;
  let phaseLabel = "Watching";
  if (frame < 60)
    phaseLabel = isCategory ? `Category: ${annotation.categoryLabel}` : "Reading Prompt";
  else if (frame < 180)
    phaseLabel = isCategory ? "Comparing" : "Watching";
  else if (frame < 220)
    phaseLabel = isCategory ? "Selecting Best" : "Evaluating";
  else if (frame < 280)
    phaseLabel = isCategory ? "Category Champion" : "Selected";
  else phaseLabel = "Output";

  // Per-side styling
  const sideStyle = (side: "A" | "B") => {
    const isWinner = side === winnerSide;
    const dim = !isWinner
      ? interpolate(selectionProgress, [0, 1], [0, 0.35], {
          extrapolateRight: "clamp",
        })
      : 0;
    const saturation = !isWinner
      ? interpolate(selectionProgress, [0, 1], [1, 0.6], {
          extrapolateRight: "clamp",
        })
      : 1;
    // Hover highlight (before click)
    const borderColor =
      isWinner && frame >= 190 && frame < 220
        ? `rgba(146, 176, 144, ${hoverHighlight * 0.5})`
        : isWinner && selectionProgress > 0
          ? `rgba(146, 176, 144, ${selectionProgress * 0.8})`
          : "transparent";
    const borderWidth = isWinner && selectionProgress > 0 ? 2 : isWinner && frame >= 160 ? 1 : 0;

    return { dim, saturation, borderColor, borderWidth, isWinner };
  };

  const styleA = sideStyle("A");
  const styleB = sideStyle("B");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* --- Header: question text with typewriter prompt --- */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
          backgroundColor: "rgba(10, 9, 8, 0.9)",
          borderBottom: `1px solid ${TOKENS.colors.accent}15`,
          opacity: setupFade,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: TOKENS.colors.text,
            letterSpacing: 0.3,
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          <span style={{ color: TOKENS.colors.text, fontSize: 11, fontWeight: 600 }}>
            {annotation.categoryLabel
              ? `Which video best represents the '${annotation.categoryLabel}' category?`
              : "Which video better matches the prompt?"}
          </span>
          {annotation.categoryLabel && annotation.categoryVerified && (
            <span
              style={{
                display: "inline-block",
                marginLeft: 8,
                padding: "1px 6px",
                backgroundColor: `${TOKENS.colors.accent}20`,
                border: `1px solid ${TOKENS.colors.accent}40`,
                borderRadius: 3,
                fontSize: 9,
                color: TOKENS.colors.accent,
                verticalAlign: "middle",
              }}
            >
              {"\u2713"} {annotation.categoryLabel}
            </span>
          )}
          <div
            style={{
              fontSize: 11,
              color: TOKENS.colors.accent,
              marginTop: 4,
              maxWidth: 900,
              lineHeight: 1.5,
              overflow: "hidden",
              textAlign: "left",
            }}
          >
            {/* Typewriter: reveal prompt text over first 2 seconds (60 frames) */}
            {(() => {
              const promptText = annotation.promptText;
              const typewriterProgress = interpolate(frame, [5, 60], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const charsToShow = Math.floor(typewriterProgress * promptText.length);
              const visibleText = promptText.slice(0, charsToShow);
              const showCursor = frame < 65 && Math.sin(frame * 0.4) > 0;
              return (
                <>
                  {visibleText}
                  {showCursor && (
                    <span style={{ color: TOKENS.colors.accent, fontWeight: 700 }}>|</span>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* --- Video panels area --- */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: `${videoAreaRightPct}%`,
          bottom: 32,
          display: "flex",
          opacity: setupFade,
        }}
      >
        {/* Side A */}
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "100%",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            boxSizing: "border-box",
            outline: `${styleA.borderWidth}px solid ${styleA.borderColor}`,
            outlineOffset: -styleA.borderWidth,
          }}
        >
          {/* Last frame as freeze-frame background (always rendered) */}
          <Img
            src={lastFrameASrc}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `saturate(${styleA.saturation})`,
            }}
          />
          {/* Video overlay — only during its natural duration */}
          {videoStillPlaying && (
            <OffthreadVideo
              src={videoASrc}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: `saturate(${styleA.saturation})`,
              }}
              volume={0}
              toneMapped={false}
            />
          )}
          {/* Dim overlay */}
          {styleA.dim > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `rgba(0, 0, 0, ${styleA.dim})`,
                pointerEvents: "none",
              }}
            />
          )}
          {/* Winner glow */}
          {styleA.isWinner && selectionProgress > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: `inset 0 0 ${20 * selectionProgress}px ${TOKENS.colors.accent}40`,
                pointerEvents: "none",
              }}
            />
          )}
          {/* Label */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              padding: "3px 10px",
              backgroundColor: "rgba(10, 9, 8, 0.75)",
              borderRadius: 3,
              fontSize: 11,
              color:
                styleA.isWinner && selectionProgress > 0
                  ? TOKENS.colors.accent
                  : TOKENS.colors.muted,
              letterSpacing: 0.8,
            }}
          >
            A
          </div>
          {/* Config label at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              padding: "2px 8px",
              backgroundColor: "rgba(10, 9, 8, 0.7)",
              borderRadius: 2,
              fontSize: 10,
              color: TOKENS.colors.muted,
            }}
          >
            {labelA}
          </div>
          {/* "SELECTED" label */}
          {styleA.isWinner && selectedLabelOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                padding: "3px 10px",
                backgroundColor: `${TOKENS.colors.accent}20`,
                border: `1px solid ${TOKENS.colors.accent}60`,
                borderRadius: 3,
                fontSize: 10,
                fontWeight: 600,
                color: TOKENS.colors.accent,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                opacity: selectedLabelOpacity,
              }}
            >
              Selected
            </div>
          )}
        </div>

        {/* Side B */}
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "100%",
            overflow: "hidden",
            boxSizing: "border-box",
            outline: `${styleB.borderWidth}px solid ${styleB.borderColor}`,
            outlineOffset: -styleB.borderWidth,
          }}
        >
          {/* Last frame as freeze-frame background (always rendered) */}
          <Img
            src={lastFrameBSrc}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `saturate(${styleB.saturation})`,
            }}
          />
          {/* Video overlay — only during its natural duration */}
          {videoStillPlaying && (
            <OffthreadVideo
              src={videoBSrc}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: `saturate(${styleB.saturation})`,
              }}
              volume={0}
              toneMapped={false}
            />
          )}
          {/* Dim overlay */}
          {styleB.dim > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `rgba(0, 0, 0, ${styleB.dim})`,
                pointerEvents: "none",
              }}
            />
          )}
          {/* Winner glow */}
          {styleB.isWinner && selectionProgress > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: `inset 0 0 ${20 * selectionProgress}px ${TOKENS.colors.accent}40`,
                pointerEvents: "none",
              }}
            />
          )}
          {/* Label */}
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "3px 10px",
              backgroundColor: "rgba(10, 9, 8, 0.75)",
              borderRadius: 3,
              fontSize: 11,
              color:
                styleB.isWinner && selectionProgress > 0
                  ? TOKENS.colors.accent
                  : TOKENS.colors.muted,
              letterSpacing: 0.8,
            }}
          >
            B
          </div>
          {/* Config label at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              padding: "2px 8px",
              backgroundColor: "rgba(10, 9, 8, 0.7)",
              borderRadius: 2,
              fontSize: 10,
              color: TOKENS.colors.muted,
            }}
          >
            {labelB}
          </div>
          {/* "SELECTED" label */}
          {styleB.isWinner && selectedLabelOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                padding: "3px 10px",
                backgroundColor: `${TOKENS.colors.accent}20`,
                border: `1px solid ${TOKENS.colors.accent}60`,
                borderRadius: 3,
                fontSize: 10,
                fontWeight: 600,
                color: TOKENS.colors.accent,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                opacity: selectedLabelOpacity,
              }}
            >
              Selected
            </div>
          )}
        </div>
      </div>

      {/* --- Animated cursor --- */}
      {cursorVisible && (
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: `${videoAreaRightPct}%`,
            bottom: 32,
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${cursorX}%`,
              top: `${cursorY}%`,
              transform: "translate(-2px, -2px)",
              opacity: interpolate(
                frame,
                [40, 48, 250, 260],
                [0, 1, 1, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              ),
            }}
          >
            <CursorIcon clicking={isClicking} />
          </div>
          {/* Click ripple effect */}
          {clickFlash > 0 && (
            <div
              style={{
                position: "absolute",
                left: `${cursorX}%`,
                top: `${cursorY}%`,
                width: 30 + clickFlash * 20,
                height: 30 + clickFlash * 20,
                borderRadius: "50%",
                border: `2px solid rgba(255, 255, 255, ${(1 - clickFlash) * 0.6})`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>
      )}

      {/* --- Split divider line --- */}
      <div
        style={{
          position: "absolute",
          top: 80,
          bottom: 32,
          left: `${(100 - videoAreaRightPct) / 2}%`,
          width: 1,
          backgroundColor: `rgba(255, 255, 255, ${0.12 * setupFade})`,
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
            padding: "2px 8px",
            backgroundColor: "rgba(10, 9, 8, 0.85)",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.06)",
            fontSize: 9,
            color: TOKENS.colors.muted,
            whiteSpace: "nowrap",
            opacity: setupFade,
          }}
        >
          VS
        </div>
      </div>

      {/* --- JSON Output panel (Phase 5) --- */}
      {frame >= 255 && (
        <JsonOutputPanel
          annotation={annotation}
          labelA={labelA}
          labelB={labelB}
          slideIn={jsonSlideIn}
          progress={jsonProgress}
        />
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
        rightInset={frame >= 280 ? (jsonSlideIn * 38 * 12.8) : 0}
      />
    </AbsoluteFill>
  );
};

/** Router: delegates to CodeRLHFWorkflow for sol-rlhf */
const PairwiseArenaComposition: React.FC<PairwiseArenaCompositionProps> = ({
  compositionId,
}) => {
  if (compositionId === "sol-rlhf") {
    return <CodeRLHFWorkflow />;
  }
  return <PairwiseArenaDefault compositionId={compositionId} />;
};

export default PairwiseArenaComposition;
