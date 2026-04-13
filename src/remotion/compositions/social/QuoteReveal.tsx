/**
 * QuoteReveal — Text scramble effect revealing a quote character by character.
 * Left accent bar draws down, characters resolve from random glyphs.
 * 1080x1080 at 30fps, 150 frames (5 seconds).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BottomBar } from "../../shared/BottomBar";

export interface QuoteRevealProps {
  quote?: string;
  attribution?: string;
  accent?: string;
}

// ---------------------------------------------------------------------------
// Scramble engine
// ---------------------------------------------------------------------------

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]=/\\|~^";

function scrambleChar(charIndex: number, frame: number): string {
  const seed = (charIndex * 7 + frame * 13) % SCRAMBLE_CHARS.length;
  return SCRAMBLE_CHARS[seed];
}

// ---------------------------------------------------------------------------
// ScrambleText — each character resolves in a wave from left to right
// ---------------------------------------------------------------------------

const ScrambleText: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
  color: string;
  scrambleColor: string;
  fontSize: number;
  lineHeight: number;
  fontWeight?: number;
}> = ({
  text,
  startFrame,
  endFrame,
  color,
  scrambleColor,
  fontSize,
  lineHeight,
  fontWeight = 400,
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const totalDuration = endFrame - startFrame;
  const elapsed = frame - startFrame;
  const waveSpeed = text.length / totalDuration;

  return (
    <span
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing: 0.3,
        wordBreak: "break-word",
      }}
    >
      {text.split("").map((char, i) => {
        if (char === " ") {
          return (
            <span key={i} style={{ color }}>
              {" "}
            </span>
          );
        }
        if (char === "\n") {
          return <br key={i} />;
        }

        // Per-character jitter for natural feel
        const jitter = ((i * 31) % 7) - 3;
        const charResolveFrame = i / waveSpeed + jitter;
        const isResolved = elapsed >= charResolveFrame;

        if (isResolved) {
          return (
            <span key={i} style={{ color }}>
              {char}
            </span>
          );
        }

        return (
          <span key={i} style={{ color: scrambleColor, opacity: 0.7 }}>
            {scrambleChar(i, frame)}
          </span>
        );
      })}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

const QuoteReveal: React.FC<QuoteRevealProps> = ({
  quote = "The bottleneck in frontier AI isn't compute. It's the quality of human signal in the training data.",
  attribution,
  accent = TOKENS.colors.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeS = frame / fps;

  // Left accent bar draws down (frames 0-10)
  const barHeight = interpolate(frame, [0, 10], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barOpacityIn = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Attribution fades in (frames 70-90)
  const attrOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const attrY = interpolate(frame, [70, 90], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bar glow intensifies during hold
  const barGlow = interpolate(frame, [70, 90], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Decorative quote marks
  const openQuoteOpacity = interpolate(frame, [8, 15], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const closeQuoteOpacity = interpolate(frame, [65, 75], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bottomBarOpacity = interpolate(frame, [0, 10], [0, 1], {
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
      {/* Main content — centered */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: `${barHeight}%`,
            maxHeight: 300,
            backgroundColor: accent,
            opacity: barOpacityIn,
            borderRadius: 1,
            boxShadow:
              barGlow > 0
                ? `0 0 16px ${accent}${Math.floor(barGlow * 255)
                    .toString(16)
                    .padStart(2, "0")}`
                : undefined,
          }}
        />

        {/* Quote content area */}
        <div
          style={{
            marginLeft: 40,
            maxWidth: 800,
            position: "relative",
          }}
        >
          {/* Decorative open quote */}
          <div
            style={{
              position: "absolute",
              top: -50,
              left: -20,
              fontSize: 120,
              color: accent,
              opacity: openQuoteOpacity,
              fontFamily: TOKENS.fonts.sans,
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {"\u201C"}
          </div>

          {/* Quote text with scramble */}
          <ScrambleText
            text={quote}
            startFrame={10}
            endFrame={70}
            color={TOKENS.colors.text}
            scrambleColor={accent}
            fontSize={28}
            lineHeight={1.6}
            fontWeight={500}
          />

          {/* Decorative close quote */}
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -10,
              fontSize: 120,
              color: accent,
              opacity: closeQuoteOpacity,
              fontFamily: TOKENS.fonts.sans,
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {"\u201D"}
          </div>

          {/* Attribution */}
          {attribution && (
            <div
              style={{
                marginTop: 32,
                fontSize: 14,
                color: TOKENS.colors.muted,
                letterSpacing: 1,
                opacity: attrOpacity,
                transform: `translateY(${attrY}px)`,
              }}
            >
              <span style={{ color: accent, marginRight: 8 }}>&mdash;</span>
              {attribution}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <BottomBar timeS={timeS} opacity={bottomBarOpacity} />
    </AbsoluteFill>
  );
};

export default QuoteReveal;
