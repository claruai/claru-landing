import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import { VerdictBadge } from "../../shared/VerdictBadge";
import { type Type2Annotation, FALLBACK_TYPE2_ANNOTATION } from "./types";

// ---------------------------------------------------------------------------
// PairwiseArenaComposition — split-screen A vs B comparison
// Timeline (360 frames @ 30fps = 12s):
//   0-30   fade in + split divider label
//   30-60  prompt text types out
//   60-180 both videos play
//   180-240 selected glow + non-selected dims
//   240-360 hold with subtle pulse on selected
// ---------------------------------------------------------------------------

export interface PairwiseArenaCompositionProps {
  compositionId: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadAnnotation(compositionId: string): Type2Annotation {
  try {
    // Annotation JSON is placed by extract-annotations.ts
    const path = staticFile(
      `remotion-assets/annotations/${compositionId}.json`,
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require(path) as Type2Annotation;
    return data;
  } catch {
    return { ...FALLBACK_TYPE2_ANNOTATION, compositionId };
  }
}

function resolveVideoSrc(
  videoRef: { url: string },
  compositionId: string,
  side: "a" | "b",
): string {
  // Prefer local static file if it exists
  try {
    return staticFile(
      `remotion-assets/samples/${compositionId}-${side}.mp4`,
    );
  } catch {
    // Fall back to the URL from annotation data
    return videoRef.url || "";
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Typewriter prompt text */
const TypewriterPrompt: React.FC<{
  text: string;
  startFrame: number;
  charsPerFrame?: number;
}> = ({ text, startFrame, charsPerFrame = 1.5 }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(
    text.length,
    Math.floor(elapsed * charsPerFrame),
  );
  const displayText = text.slice(0, visibleChars);
  const showCursor = frame >= startFrame && visibleChars < text.length;

  return (
    <div
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 13,
        color: TOKENS.colors.text,
        lineHeight: 1.5,
        maxWidth: "90%",
        textAlign: "center",
        opacity: interpolate(
          frame,
          [startFrame, startFrame + 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      }}
    >
      <span style={{ color: TOKENS.colors.muted, marginRight: 6 }}>
        prompt:
      </span>
      <span>{displayText}</span>
      {showCursor && (
        <span
          style={{
            color: TOKENS.colors.accent,
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
          }}
        >
          |
        </span>
      )}
    </div>
  );
};

/** Neutral split divider between the two videos */
const SplitDivider: React.FC<{
  labelA: string;
  labelB: string;
  opacity: number;
}> = ({ labelA, labelB, opacity }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 32, // above BottomBar
        left: "50%",
        transform: "translateX(-50%)",
        width: 1,
        backgroundColor: `rgba(255, 255, 255, ${0.15 * opacity})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 12px",
          backgroundColor: "rgba(10, 9, 8, 0.85)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10,
          color: TOKENS.colors.muted,
          letterSpacing: 1,
          whiteSpace: "nowrap",
          opacity,
        }}
      >
        <span>{labelA}</span>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
        <span>{labelB}</span>
      </div>
    </div>
  );
};

/** Category verification badge for cs-prompt-bench */
const CategoryBadge: React.FC<{
  label: string;
  verified?: boolean;
  opacity: number;
}> = ({ label, verified, opacity }) => {
  if (!label) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        backgroundColor: "rgba(10, 9, 8, 0.75)",
        borderRadius: 3,
        border: `1px solid ${TOKENS.colors.accent}30`,
        fontFamily: TOKENS.fonts.mono,
        fontSize: 10,
        color: TOKENS.colors.text,
        opacity,
      }}
    >
      <span style={{ color: TOKENS.colors.muted }}>category:</span>
      <span>{label}</span>
      {verified !== undefined && (
        <span style={{ color: verified ? TOKENS.colors.success : TOKENS.colors.error }}>
          {verified ? "\u2713" : "\u2717"}
        </span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Video panel (one side of the split)
// ---------------------------------------------------------------------------
const VideoPanel: React.FC<{
  src: string;
  label: string;
  side: "left" | "right";
  isWinner: boolean;
  fadeInOpacity: number;
  selectionProgress: number;
  frame: number;
  fps: number;
}> = ({
  src,
  label,
  side,
  isWinner,
  fadeInOpacity,
  selectionProgress,
  frame,
  fps,
}) => {
  // Dim the non-selected side
  const dimAmount = isWinner
    ? 0
    : interpolate(selectionProgress, [0, 1], [0, 0.4], {
        extrapolateRight: "clamp",
      });

  // Desaturation on the non-selected side
  const saturation = isWinner
    ? 1
    : interpolate(selectionProgress, [0, 1], [1, 0.6], {
        extrapolateRight: "clamp",
      });

  const hasVideo = src !== "";

  return (
    <div
      style={{
        position: "relative",
        width: "50%",
        height: "100%",
        overflow: "hidden",
        opacity: fadeInOpacity,
      }}
    >
      {/* Video or fallback */}
      {hasVideo ? (
        <Video
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `saturate(${saturation})`,
          }}
          startFrom={0}
          volume={0}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: TOKENS.fonts.mono,
            fontSize: 11,
            color: TOKENS.colors.muted,
          }}
        >
          Video {label}
        </div>
      )}

      {/* Dim overlay for non-selected */}
      {!isWinner && selectionProgress > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(0, 0, 0, ${dimAmount})`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Winner border glow using VerdictBadge */}
      {isWinner && selectionProgress > 0 && (
        <VerdictBadge
          verdict="SELECTED"
          color={TOKENS.colors.accent}
          variant="border-glow"
          animationStyle="glow"
          animateFrom={180}
          animationDuration={40}
        />
      )}

      {/* Side label */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          ...(side === "left" ? { left: 12 } : { right: 12 }),
          padding: "3px 8px",
          backgroundColor: "rgba(10, 9, 8, 0.7)",
          borderRadius: 2,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10,
          color: isWinner && selectionProgress > 0
            ? TOKENS.colors.accent
            : TOKENS.colors.muted,
          letterSpacing: 0.8,
          transition: "color 0.3s",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------
const PairwiseArenaComposition: React.FC<PairwiseArenaCompositionProps> = ({
  compositionId,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  // Load annotation data (with graceful fallback)
  const annotation = useMemo(() => loadAnnotation(compositionId), [compositionId]);

  // Resolve video sources
  const videoASrc = useMemo(
    () => resolveVideoSrc(annotation.videoA, compositionId, "a"),
    [annotation.videoA, compositionId],
  );
  const videoBSrc = useMemo(
    () => resolveVideoSrc(annotation.videoB, compositionId, "b"),
    [annotation.videoB, compositionId],
  );

  // Derive labels
  const labelA = annotation.configLabels?.a ?? annotation.videoA.label ?? "A";
  const labelB = annotation.configLabels?.b ?? annotation.videoB.label ?? "B";

  // --- Animation timeline ---

  // Phase 1: Fade in (0-30)
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider slide-in via spring
  const dividerSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: 30,
  });

  // Phase 2: Prompt types out (30-60) -- handled by TypewriterPrompt startFrame

  // Phase 3: Selection glow (180-240)
  const selectionProgress = interpolate(frame, [180, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4: Hold with subtle pulse (240-360)
  // Pulse is handled inside VerdictBadge glow animation

  // Determine phase label for BottomBar
  let phaseLabel = "Arena";
  if (frame < 30) phaseLabel = "Arena // Loading";
  else if (frame < 60) phaseLabel = "Arena // Prompt";
  else if (frame < 180) phaseLabel = "Arena // Playing";
  else if (frame < 240) phaseLabel = "Arena // Selection";
  else phaseLabel = "Arena // Result";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* Prompt text area */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
          backgroundColor: "rgba(10, 9, 8, 0.85)",
          borderBottom: `1px solid ${TOKENS.colors.accent}15`,
        }}
      >
        {/* Category badge for cs-prompt-bench */}
        {annotation.categoryLabel && (
          <div style={{ position: "absolute", top: 6, right: 12 }}>
            <CategoryBadge
              label={annotation.categoryLabel}
              verified={annotation.categoryVerified}
              opacity={interpolate(frame, [30, 45], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          </div>
        )}
        <TypewriterPrompt
          text={annotation.promptText}
          startFrame={30}
          charsPerFrame={1.5}
        />
      </div>

      {/* Split-screen video area */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          bottom: 32, // above BottomBar
          display: "flex",
        }}
      >
        <VideoPanel
          src={videoASrc}
          label={labelA}
          side="left"
          isWinner={annotation.winner === "A"}
          fadeInOpacity={fadeIn}
          selectionProgress={selectionProgress}
          frame={frame}
          fps={fps}
        />
        <VideoPanel
          src={videoBSrc}
          label={labelB}
          side="right"
          isWinner={annotation.winner === "B"}
          fadeInOpacity={fadeIn}
          selectionProgress={selectionProgress}
          frame={frame}
          fps={fps}
        />
      </div>

      {/* Split divider */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          bottom: 32,
        }}
      >
        <SplitDivider
          labelA={labelA}
          labelB={labelB}
          opacity={dividerSpring}
        />
      </div>

      {/* Winner indicator label (appears during selection phase) */}
      {selectionProgress > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 44,
            left: annotation.winner === "A" ? "25%" : "75%",
            transform: "translateX(-50%)",
            zIndex: 15,
          }}
        >
          <VerdictBadge
            verdict="SELECTED"
            color={TOKENS.colors.accent}
            variant="badge"
            animationStyle="glow"
            animateFrom={200}
            animationDuration={25}
          />
        </div>
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
        opacity={fadeIn}
      />
    </AbsoluteFill>
  );
};

export default PairwiseArenaComposition;
