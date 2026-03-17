import React, { useState, useEffect } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  delayRender,
  continueRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import { BottomBar } from "../../shared/BottomBar";
import { Type8Annotation, FALLBACK_TYPE8_ANNOTATION } from "./types";

// ---------------------------------------------------------------------------
// Type 8: Cinematic Showcase Composition
//
// Full-bleed video with letterbox bars (2.39:1 cinematic within 16:9 frame).
// Minimal overlay emphasizing TECHNICAL QUALITY SIGNALS: resolution badge,
// codec info, frame rate, color depth. Category tag, subcategory, licensing
// badge. Labels slide in from left, hold, slide out. Film grain CSS overlay.
// ---------------------------------------------------------------------------

export interface CinematicShowcaseCompositionProps {
  compositionId: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Load annotation JSON from static file, fallback on error */
function useAnnotation(compositionId: string): Type8Annotation {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require(
      `../../../../public/remotion-assets/annotations/${compositionId}.json`
    ) as Type8Annotation;
    return { ...FALLBACK_TYPE8_ANNOTATION, ...data };
  } catch {
    return FALLBACK_TYPE8_ANNOTATION;
  }
}

/** Check if a hero video sample exists */
function heroVideoPath(compositionId: string): string {
  return staticFile(`remotion-assets/samples/${compositionId}.mp4`);
}

/** Secondary clip path for cs-egocentric cross-fade */
function secondaryVideoPath(compositionId: string): string {
  return staticFile(`remotion-assets/samples/${compositionId}-secondary.mp4`);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Cinematic 2.39:1 letterbox bars within 16:9 frame */
const LetterboxBars: React.FC<{ opacity: number }> = ({ opacity }) => {
  // 16:9 = 1.778, 2.39:1 = 2.39
  // barHeight = (1 - (16/9) / 2.39) / 2 * 100% of frame height
  const barHeightPct = ((1 - 1.778 / 2.39) / 2) * 100;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${barHeightPct}%`,
          backgroundColor: "#000",
          zIndex: 10,
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${barHeightPct}%`,
          backgroundColor: "#000",
          zIndex: 10,
          opacity,
        }}
      />
    </>
  );
};

/** Film grain overlay using CSS noise texture */
const FilmGrain: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 15,
        opacity: opacity * 0.08,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
        pointerEvents: "none",
      }}
    />
  );
};

/** Sliding label that enters from the left with motion blur effect */
const SlideLabel: React.FC<{
  text: string;
  fontSize: number;
  color: string;
  /** Frame at which the slide-in begins */
  enterFrame: number;
  /** Frame at which the slide-out begins */
  exitFrame: number;
  /** Top offset in pixels */
  top: number;
  bold?: boolean;
  bg?: string;
  paddingH?: number;
  paddingV?: number;
  borderRadius?: number;
}> = ({
  text,
  fontSize,
  color,
  enterFrame,
  exitFrame,
  top,
  bold = false,
  bg,
  paddingH = 0,
  paddingV = 0,
  borderRadius = 0,
}) => {
  const frame = useCurrentFrame();

  // Slide in over 15 frames
  const slideIn = interpolate(frame, [enterFrame, enterFrame + 15], [-300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slide out over 15 frames
  const slideOut = interpolate(
    frame,
    [exitFrame, exitFrame + 15],
    [0, -300],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateX = frame < exitFrame ? slideIn : slideIn + slideOut;

  // Opacity for fade
  const opacity = interpolate(
    frame,
    [enterFrame, enterFrame + 8, exitFrame, exitFrame + 15],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Motion blur: slight horizontal blur during movement
  const isMoving =
    (frame >= enterFrame && frame <= enterFrame + 15) ||
    (frame >= exitFrame && frame <= exitFrame + 15);
  const blurAmount = isMoving ? 2 : 0;

  if (frame < enterFrame - 1) return null;
  if (frame > exitFrame + 20) return null;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 32,
        zIndex: 20,
        transform: `translateX(${translateX}px)`,
        opacity,
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
        fontFamily: TOKENS.fonts.mono,
        fontSize,
        fontWeight: bold ? 600 : 400,
        color,
        letterSpacing: fontSize > 14 ? 2 : 0.5,
        textTransform: fontSize > 14 ? "uppercase" : undefined,
        whiteSpace: "nowrap",
        backgroundColor: bg,
        padding:
          paddingH || paddingV
            ? `${paddingV}px ${paddingH}px`
            : undefined,
        borderRadius: borderRadius || undefined,
      }}
    >
      {text}
    </div>
  );
};

/** Resolution badge — prominent quality signal */
const ResolutionBadge: React.FC<{
  resolution: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ resolution, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [enterFrame, enterFrame + 10, exitFrame, exitFrame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [enterFrame, enterFrame + 12],
    [0.8, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < enterFrame - 1 || frame > exitFrame + 15) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        right: 32,
        zIndex: 20,
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 24,
          fontWeight: 700,
          color: TOKENS.colors.accent,
          letterSpacing: 1,
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        {resolution}
      </div>
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          color: TOKENS.colors.muted,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Native Resolution
      </div>
    </div>
  );
};

/** Technical quality signals panel — codec, fps, color depth */
const TechSignals: React.FC<{
  codec: string;
  fps: number;
  colorDepth: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ codec, fps, colorDepth, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [enterFrame, enterFrame + 10, exitFrame, exitFrame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < enterFrame - 1 || frame > exitFrame + 15) return null;

  const items = [
    { label: "Codec", value: codec.toUpperCase() },
    { label: "Frame Rate", value: `${fps}fps` },
    { label: "Color", value: colorDepth },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        right: 32,
        zIndex: 20,
        opacity,
        display: "flex",
        gap: 16,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: TOKENS.colors.muted,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 12,
              color: TOKENS.colors.text,
              fontWeight: 500,
            }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/** Typed subtitle that appears character by character */
const TypedSubtitle: React.FC<{
  text: string;
  startFrame: number;
  /** Characters per frame */
  speed?: number;
}> = ({ text, startFrame, speed = 1.2 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (frame < startFrame) return null;

  const elapsed = frame - startFrame;
  const charCount = Math.min(Math.floor(elapsed * speed), text.length);
  const displayText = text.slice(0, charCount);

  // Blinking cursor
  const showCursor = charCount < text.length || elapsed % 30 < 15;

  // Fade out near end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        padding: "0 60px",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "8px 16px",
          borderRadius: 2,
          maxWidth: 900,
        }}
      >
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 12,
            color: TOKENS.colors.text,
            lineHeight: 1.5,
            letterSpacing: 0.3,
          }}
        >
          {displayText}
        </span>
        {showCursor && (
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 12,
              color: TOKENS.colors.accent,
            }}
          >
            |
          </span>
        )}
      </div>
    </div>
  );
};

/** "Licensed 4K" badge that fades in at the end */
const LicensingBadge: React.FC<{
  licensingType: string;
  enterFrame: number;
}> = ({ licensingType, enterFrame }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [enterFrame, enterFrame + 10, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < enterFrame - 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 42,
        right: 12,
        zIndex: 20,
        opacity,
        fontFamily: TOKENS.fonts.mono,
        fontSize: 9,
        color: TOKENS.colors.accent,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "3px 8px",
        borderRadius: 2,
        border: `1px solid ${TOKENS.colors.accent}40`,
      }}
    >
      {licensingType}
    </div>
  );
};

/** "This is custom data" premium label for sol-open-vs-custom */
const CustomDataLabel: React.FC<{
  enterFrame: number;
  exitFrame: number;
}> = ({ enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [enterFrame, enterFrame + 12, exitFrame - 10, exitFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < enterFrame - 1 || frame > exitFrame + 5) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 32,
        zIndex: 20,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: TOKENS.colors.accent,
          boxShadow: `0 0 8px ${TOKENS.colors.accent}`,
        }}
      />
      <span
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 13,
          color: TOKENS.colors.accent,
          fontWeight: 600,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          textShadow: `0 0 12px ${TOKENS.colors.accent}60`,
        }}
      >
        This is custom data
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

const CinematicShowcaseComposition: React.FC<
  CinematicShowcaseCompositionProps
> = ({ compositionId }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  const annotation = useAnnotation(compositionId);
  const technical = annotation.technical ?? {
    resolution: annotation.resolution ?? "3840x2160",
    codec: "h264",
    fps: 30,
    colorDepth: "8-bit",
  };

  const isCsEgocentric = compositionId === "cs-egocentric";
  const isSolOpenVsCustom = compositionId === "sol-open-vs-custom";

  // Pre-check video availability to avoid delayRender timeout on 404
  const [heroAvailable, setHeroAvailable] = useState(false);
  const [secondaryAvailable, setSecondaryAvailable] = useState(false);
  const [handle] = useState(() => delayRender("Checking video availability"));

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const heroRes = await fetch(heroVideoPath(compositionId), { method: "HEAD" }).catch(() => null);
      if (!cancelled) setHeroAvailable(heroRes?.ok ?? false);
      if (compositionId === "cs-egocentric") {
        const secRes = await fetch(secondaryVideoPath(compositionId), { method: "HEAD" }).catch(() => null);
        if (!cancelled) setSecondaryAvailable(secRes?.ok ?? false);
      }
      if (!cancelled) continueRender(handle);
    }
    check();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compositionId]);

  // -----------------------------------------------------------------------
  // Timeline phases (300 frames = 10s at 30fps)
  // 0-15:    Fade in through letterbox
  // 15-90:   Play with labels sliding in/out
  // 90-180:  Scene description types
  // 180-270: Hold with gentle zoom
  // 270-300: Fade to CLARU watermark + "Licensed Collection" badge
  // -----------------------------------------------------------------------

  // Global fade in (frames 0-15)
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out to CLARU watermark (frames 270-300)
  const fadeOut = interpolate(frame, [270, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CLARU watermark fade in at end
  const watermarkOpacity = interpolate(frame, [275, 295], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle zoom effect during hold phase (frames 180-270)
  const zoom = interpolate(frame, [0, 180, 270], [1, 1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // cs-egocentric: cross-fade between two clips
  const crossFadeOpacity = isCsEgocentric
    ? interpolate(frame, [120, 150], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Letterbox bars opacity — always visible
  const letterboxOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* Video layer with zoom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom})`,
          opacity: fadeIn * fadeOut,
        }}
      >
        {/* Primary video — only rendered if sample exists */}
        {heroAvailable ? (
          <OffthreadVideo
            src={heroVideoPath(compositionId)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isCsEgocentric ? 1 - crossFadeOpacity : 1,
            }}
          />
        ) : (
          <AbsoluteFill
            style={{
              backgroundColor: "#0a0908",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: TOKENS.fonts.mono,
              fontSize: 12,
              color: TOKENS.colors.muted,
            }}
          >
            Cinematic Showcase: {compositionId}
          </AbsoluteFill>
        )}

        {/* Secondary video for cs-egocentric cross-fade — only if available */}
        {isCsEgocentric && secondaryAvailable && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: crossFadeOpacity,
            }}
          >
            <OffthreadVideo
              src={secondaryVideoPath(compositionId)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>

      {/* Film grain overlay */}
      <FilmGrain opacity={fadeIn} />

      {/* Cinematic letterbox bars */}
      <LetterboxBars opacity={letterboxOpacity} />

      {/* Category label — slides in at frame 15, out at frame 75 */}
      <SlideLabel
        text={annotation.category}
        fontSize={16}
        color={TOKENS.colors.text}
        enterFrame={15}
        exitFrame={75}
        top={50}
        bold
      />

      {/* Subcategory label — slides in at frame 22, out at frame 75 */}
      <SlideLabel
        text={annotation.subcategory}
        fontSize={11}
        color={TOKENS.colors.muted}
        enterFrame={22}
        exitFrame={75}
        top={74}
      />

      {/* Licensing badge label — slides in at frame 30, out at frame 80 */}
      <SlideLabel
        text={annotation.licensingType}
        fontSize={9}
        color={TOKENS.colors.accent}
        enterFrame={30}
        exitFrame={80}
        top={96}
        bg="rgba(0, 0, 0, 0.5)"
        paddingH={8}
        paddingV={3}
        borderRadius={2}
      />

      {/* Resolution badge — prominent, top right, frames 15-260 */}
      <ResolutionBadge
        resolution={annotation.resolution}
        enterFrame={15}
        exitFrame={260}
      />

      {/* Tech signals — codec, fps, color depth, frames 25-260 */}
      <TechSignals
        codec={technical.codec}
        fps={technical.fps}
        colorDepth={technical.colorDepth}
        enterFrame={25}
        exitFrame={260}
      />

      {/* sol-open-vs-custom: premium "This is custom data" label */}
      {isSolOpenVsCustom && (
        <CustomDataLabel enterFrame={40} exitFrame={250} />
      )}

      {/* Gemini scene description typed subtitle, starts at frame 90 */}
      {annotation.sceneDescription && (
        <TypedSubtitle
          text={annotation.sceneDescription}
          startFrame={90}
          speed={1.0}
        />
      )}

      {/* TechMetadataOverlay — prominently placed (this type is about quality signals) */}
      <div style={{ zIndex: 20, opacity: fadeIn * fadeOut }}>
        <TechMetadataOverlay
          codec={technical.codec}
          resolution={technical.resolution}
          fps={technical.fps}
          duration={`${(durationInFrames / fps).toFixed(1)}s`}
        />
      </div>

      {/* BottomBar — minimal variant: no timestamp, just CLARU branding */}
      <div style={{ zIndex: 20, opacity: fadeIn * fadeOut }}>
        <BottomBar timeS={timeS} />
      </div>

      {/* Final licensing badge at bottom right during fade-out */}
      <LicensingBadge
        licensingType="Licensed Collection"
        enterFrame={270}
      />

      {/* CLARU watermark at end */}
      {frame >= 270 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            zIndex: 25,
            opacity: watermarkOpacity,
            backgroundColor: `rgba(0, 0, 0, ${watermarkOpacity * 0.7})`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 28,
                fontWeight: 600,
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
                textTransform: "uppercase",
              }}
            >
              Licensed Collection
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default CinematicShowcaseComposition;
