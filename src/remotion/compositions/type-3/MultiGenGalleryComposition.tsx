import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import { BottomBar } from "../../shared/BottomBar";
import { VerdictBadge } from "../../shared/VerdictBadge";
import { Type3Annotation, FALLBACK_TYPE3 } from "./types";
import QualityComparisonWorkflow from "./QualityComparisonWorkflow";

// ---------------------------------------------------------------------------
// MultiGenGalleryComposition — Type 3
// 2x4 grid of 8 AI image generations with accept/reject verdicts and
// best-of-N selection highlight. Uses real annotation data from the
// AI Image Generation Evaluation dataset.
//
// Timeline (300 frames @ 30fps = 10s):
//   0-30   grid container fades in
//  30-90   images appear one by one (staggered 6f apart)
//  90-120  prompt text types out
// 120-180  checkmarks / Xs animate onto images
// 180-210  accent border glow on best image
// 210-240  stats overlay appears with animated counter
// 240-300  hold
// ---------------------------------------------------------------------------

export interface MultiGenGalleryCompositionProps {
  compositionId: string;
}

// ---------------------------------------------------------------------------
// Annotation loader — attempts to import extracted JSON, falls back gracefully
// ---------------------------------------------------------------------------

function useAnnotation(compositionId: string): Type3Annotation {
  const [data, setData] = React.useState<Type3Annotation | null>(null);
  const [handle] = React.useState(() => delayRender("Loading Type3 annotation"));

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          staticFile(`remotion-assets/annotations/${compositionId}.json`)
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Type3Annotation;
        if (!cancelled && json.type === 3) {
          // Resolve generation image URLs to staticFile paths
          for (const gen of json.generations) {
            if (gen.url && !gen.url.startsWith("http") && !gen.url.startsWith("blob:")) {
              // Convert relative paths like /remotion-assets/... to staticFile URLs
              const cleanPath = gen.url.replace(/^\//, "");
              gen.url = staticFile(cleanPath);
            }
          }
          setData(json);
        }
      } catch {
        // Annotation not yet extracted — use fallback
      }
      if (!cancelled) continueRender(handle);
    })();
    return () => {
      cancelled = true;
    };
  }, [compositionId, handle]);

  if (data) return data;
  return { ...FALLBACK_TYPE3, compositionId };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Typewriter text effect */
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  /** Frames per character */
  speed?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, speed = 1, style }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.min(text.length, Math.floor(elapsed / speed));
  const showCursor = frame >= startFrame && charCount < text.length;

  return (
    <div
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 13,
        color: TOKENS.colors.text,
        letterSpacing: 0.3,
        lineHeight: 1.5,
        opacity: frame >= startFrame ? 1 : 0,
        ...style,
      }}
    >
      <span style={{ color: TOKENS.colors.accent, marginRight: 6 }}>$</span>
      {text.slice(0, charCount)}
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

/** Placeholder thumbnail when image URL is missing */
const PlaceholderThumb: React.FC<{ index: number }> = ({ index }) => (
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
      color: "#333",
    }}
  >
    gen-{index + 1}
  </div>
);

/** Single image cell in the 2x4 grid */
const ImageCell: React.FC<{
  gen: { id: string; url: string };
  index: number;
  isSelected: boolean;
  isBest: boolean;
  isRejected: boolean;
  imageStartFrame: number;
  verdictStartFrame: number;
  bestHighlightFrame: number;
}> = ({
  gen,
  index,
  isSelected,
  isBest,
  isRejected,
  imageStartFrame,
  verdictStartFrame,
  bestHighlightFrame,
}) => {
  const frame = useCurrentFrame();

  // Stagger: each image fades in 6 frames apart
  const myStart = imageStartFrame + index * 6;
  const imageOpacity = interpolate(frame, [myStart, myStart + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imageScale = interpolate(
    frame,
    [myStart, myStart + 15],
    [0.85, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const hasUrl = gen.url && gen.url.length > 0;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1",
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${isBest && frame >= bestHighlightFrame ? TOKENS.colors.selected : "#222"}`,
        opacity: imageOpacity,
        transform: `scale(${imageScale})`,
      }}
    >
      {/* Image or placeholder */}
      {hasUrl ? (
        <Img
          src={gen.url}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <PlaceholderThumb index={index} />
      )}

      {/* Dark overlay for rejected images */}
      {isRejected && frame >= verdictStartFrame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            opacity: interpolate(
              frame,
              [verdictStartFrame, verdictStartFrame + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        />
      )}

      {/* Verdict badge — checkmark or X */}
      {isSelected && !isBest && (
        <div style={{ position: "absolute", top: 6, right: 6 }}>
          <VerdictBadge
            verdict="PASS"
            color={TOKENS.colors.chosen}
            variant="badge"
            animationStyle="fade"
            animateFrom={verdictStartFrame}
            animationDuration={20}
          />
        </div>
      )}

      {isRejected && (
        <div style={{ position: "absolute", top: 6, right: 6 }}>
          <VerdictBadge
            verdict="FAIL"
            color={TOKENS.colors.rejected}
            variant="badge"
            animationStyle="fade"
            animateFrom={verdictStartFrame}
            animationDuration={20}
          />
        </div>
      )}

      {/* Best image — border glow via VerdictBadge variant */}
      {isBest && (
        <VerdictBadge
          verdict="BEST"
          color={TOKENS.colors.selected}
          variant="border-glow"
          animationStyle="glow"
          animateFrom={bestHighlightFrame}
          animationDuration={20}
        />
      )}

      {/* Best label inside the cell */}
      {isBest && frame >= bestHighlightFrame && (
        <div style={{ position: "absolute", top: 6, right: 6 }}>
          <VerdictBadge
            verdict="BEST"
            color={TOKENS.colors.selected}
            variant="badge"
            animationStyle="glow"
            animateFrom={bestHighlightFrame}
            animationDuration={20}
          />
        </div>
      )}

      {/* Image index label */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: 4,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 8,
          color: "#555",
          letterSpacing: 0.5,
        }}
      >
        {index + 1}/8
      </div>
    </div>
  );
};

/** Animated counter that counts up from 0 to target */
const AnimatedCounter: React.FC<{
  value: number;
  startFrame: number;
  duration?: number;
  suffix?: string;
}> = ({ value, startFrame, duration = 20, suffix = "" }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const current = Math.round(value * progress);
  return (
    <span>
      {current}
      {suffix}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

const MultiGenGalleryDefault: React.FC<
  MultiGenGalleryCompositionProps
> = ({ compositionId }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const annotation = useAnnotation(compositionId);

  // Ensure we always work with exactly 8 generations
  const generations = React.useMemo(() => {
    const gens = annotation.generations.slice(0, 8);
    while (gens.length < 8) {
      gens.push({ id: `pad-${gens.length}`, url: "" });
    }
    return gens;
  }, [annotation.generations]);

  const selectedSet = React.useMemo(
    () => new Set(annotation.selectedImages),
    [annotation.selectedImages]
  );

  const prompt = annotation.prompt ?? "Evaluate generation quality across 8 image variants";
  const selectedCount = annotation.selectedImages.length;
  const totalCount = generations.length;
  const passRate = totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;

  // --- Timeline keyframes ---
  const GRID_FADE_START = 0;
  const GRID_FADE_END = 30;
  const IMAGE_STAGGER_START = 30;
  const PROMPT_TYPE_START = 90;
  const VERDICT_START = 120;
  const BEST_HIGHLIGHT_START = 180;
  const STATS_START = 210;

  // Grid container opacity
  const gridOpacity = interpolate(
    frame,
    [GRID_FADE_START, GRID_FADE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Stats opacity
  const statsOpacity = interpolate(
    frame,
    [STATS_START, STATS_START + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const timeS = frame / fps;

  // Phase label for BottomBar
  let phaseLabel = "Generation Eval";
  if (frame < GRID_FADE_END) phaseLabel = "Generation Eval > Loading";
  else if (frame < 90) phaseLabel = "Generation Eval > Rendering";
  else if (frame < VERDICT_START) phaseLabel = "Generation Eval > Prompt";
  else if (frame < BEST_HIGHLIGHT_START) phaseLabel = "Generation Eval > Review";
  else if (frame < STATS_START) phaseLabel = "Generation Eval > Selection";
  else phaseLabel = "Generation Eval > Complete";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* Main content area — above bottom bar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          bottom: 32,
          display: "flex",
          flexDirection: "column",
          padding: "24px 32px 8px 32px",
          gap: 12,
        }}
      >
        {/* Header: composition label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: gridOpacity,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: TOKENS.colors.accent,
              textTransform: "uppercase",
              letterSpacing: 3,
              fontWeight: 600,
            }}
          >
            Multi-Generation Gallery
          </span>
          <span
            style={{
              fontSize: 9,
              color: "#444",
              letterSpacing: 1,
            }}
          >
            {compositionId}
          </span>
        </div>

        {/* Prompt typewriter */}
        <TypewriterText
          text={prompt}
          startFrame={PROMPT_TYPE_START}
          speed={1}
          style={{
            fontSize: 12,
            maxWidth: 800,
            minHeight: 20,
          }}
        />

        {/* 2x4 image grid */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 8,
            opacity: gridOpacity,
            maxHeight: 500,
          }}
        >
          {generations.map((gen, i) => {
            const isSelected = selectedSet.has(gen.id);
            const isBest = gen.id === annotation.bestImage;
            const isRejected = !isSelected && !isBest;

            return (
              <ImageCell
                key={gen.id}
                gen={gen}
                index={i}
                isSelected={isSelected}
                isBest={isBest}
                isRejected={isRejected}
                imageStartFrame={IMAGE_STAGGER_START}
                verdictStartFrame={VERDICT_START}
                bestHighlightFrame={BEST_HIGHLIGHT_START}
              />
            );
          })}
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "8px 12px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderRadius: 4,
            border: "1px solid #1a1a1a",
            opacity: statsOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: TOKENS.colors.chosen,
              fontWeight: 600,
            }}
          >
            <AnimatedCounter
              value={selectedCount}
              startFrame={STATS_START}
              duration={20}
            />
            <span style={{ color: TOKENS.colors.muted, fontWeight: 400 }}>
              /{totalCount} acceptable
            </span>
            <span style={{ color: TOKENS.colors.muted, fontWeight: 400 }}>
              (
              <AnimatedCounter
                value={passRate}
                startFrame={STATS_START}
                duration={20}
                suffix="%"
              />
              )
            </span>
          </div>

          <div
            style={{
              width: 1,
              height: 14,
              backgroundColor: "#333",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: TOKENS.colors.selected,
            }}
          >
            <AnimatedCounter
              value={1}
              startFrame={STATS_START}
              duration={10}
            />
            <span style={{ color: TOKENS.colors.muted }}> best</span>
          </div>

          <div
            style={{
              width: 1,
              height: 14,
              backgroundColor: "#333",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: TOKENS.colors.rejected,
            }}
          >
            <AnimatedCounter
              value={totalCount - selectedCount}
              startFrame={STATS_START}
              duration={20}
            />
            <span style={{ color: TOKENS.colors.muted }}> rejected</span>
          </div>

          {annotation.hasGoodQuality && (
            <>
              <div
                style={{
                  width: 1,
                  height: 14,
                  backgroundColor: "#333",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: TOKENS.colors.muted,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                quality: {annotation.hasGoodQuality}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tech metadata overlay */}
      <TechMetadataOverlay
        codec="h264"
        resolution="1280x720"
        fps={fps}
        duration={`${(durationInFrames / fps).toFixed(0)}s`}
      />

      {/* Bottom bar */}
      <BottomBar timeS={timeS} phaseLabel={phaseLabel} />
    </AbsoluteFill>
  );
};

/** Router: delegates to QualityComparisonWorkflow for sol-crowd-vs-expert */
const MultiGenGalleryComposition: React.FC<
  MultiGenGalleryCompositionProps
> = ({ compositionId }) => {
  if (compositionId === "sol-crowd-vs-expert") {
    return <QualityComparisonWorkflow />;
  }
  return <MultiGenGalleryDefault compositionId={compositionId} />;
};

export default MultiGenGalleryComposition;
