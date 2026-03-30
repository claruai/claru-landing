/**
 * StatReveal — Animated stat counter with terminal cursor typing effect.
 * Reveals a large number with a blinking cursor and query prompt.
 * 1080x1080 at 30fps, 150 frames (5 seconds).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TerminalHeader } from "../../shared/TerminalHeader";
import { BottomBar } from "../../shared/BottomBar";

export interface StatRevealProps {
  stat?: string;
  label?: string;
  sublabel?: string;
  accent?: string;
}

/** Parse a formatted stat string like "3,741,892" to its numeric value */
function parseStatValue(stat: string): number {
  const cleaned = stat.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned) || 0;
}

/** Format a number to match the original stat's pattern */
function formatStatValue(value: number, template: string): string {
  const hasCommas = template.includes(",");
  const decMatch = template.match(/\.(\d+)/);
  const decimals = decMatch ? decMatch[1].length : 0;

  let formatted = decimals > 0
    ? value.toFixed(decimals)
    : Math.floor(value).toString();

  if (hasCommas) {
    const parts = formatted.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formatted = parts.join(".");
  }

  // Preserve any suffix like "+" or "%"
  const suffix = template.replace(/[0-9,.\s]/g, "");
  if (suffix && !formatted.endsWith(suffix)) {
    formatted += suffix;
  }

  return formatted;
}

const StatReveal: React.FC<StatRevealProps> = ({
  stat = "3,741,892",
  label = "human annotations completed",
  sublabel,
  accent = TOKENS.colors.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeS = frame / fps;
  const targetValue = parseStatValue(stat);

  const queryText = "> query: total_annotations";

  // Phase 1: cursor blinks (frames 0-5) — very short, just a flash
  const cursorBlink = Math.floor(frame / 6) % 2 === 0;

  // Phase 2: query text types in (frames 5-18) — starts fast
  const queryProgress = interpolate(frame, [5, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const queryChars = Math.floor(queryProgress * queryText.length);

  // Phase 3: stat number counter rolls up (frames 25-75) — faster spring, finishes well before end
  const counterProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.6 },
  });
  const currentValue = targetValue * Math.min(Math.max(0, counterProgress), 1);
  const displayStat = frame >= 25 ? formatStatValue(currentValue, stat) : "";

  const statOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Phase 4: label fades in (frames 70-85)
  const labelOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [70, 85], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5: sublabel (frames 80-95)
  const sublabelOpacity = sublabel
    ? interpolate(frame, [80, 95], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Scanline drift
  const scanlineY = (frame * 0.8) % 200;

  // Pulse on status dot
  const dotPulse = interpolate(
    frame % 30, [0, 15, 30], [0.6, 1, 0.6],
    { extrapolateRight: "clamp" }
  );

  // BottomBar fade in
  const barOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor visibility per phase
  const showQueryCursor = frame >= 0 && frame < 25;
  const showStatCursor = frame >= 25 && frame < 70;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
        overflow: "hidden",
      }}
    >
      {/* Terminal header */}
      <TerminalHeader
        title="claru-db -- query"
        statusLabel="CONNECTED"
        statusColor={accent}
      />

      {/* Scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          )`,
          transform: `translateY(${scanlineY}px)`,
          pointerEvents: "none",
          zIndex: 5,
          opacity: interpolate(frame, [45, 60], [0, 0.06], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Main content area */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 0,
          right: 0,
          bottom: 32,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
        }}
      >
        {/* Query line */}
        <div
          style={{
            alignSelf: "flex-start",
            marginBottom: 48,
            fontSize: 18,
            color: TOKENS.colors.muted,
            minHeight: 28,
          }}
        >
          {frame < 5 ? (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 20,
                backgroundColor: cursorBlink ? accent : "transparent",
                verticalAlign: "middle",
              }}
            />
          ) : (
            <>
              <span style={{ color: accent }}>$ </span>
              <span>{queryText.slice(0, queryChars)}</span>
              {showQueryCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 20,
                    backgroundColor: cursorBlink ? accent : "transparent",
                    marginLeft: 2,
                    verticalAlign: "middle",
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Main stat number */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: accent,
            opacity: statOpacity,
            transform: `scale(${Math.max(0, statScale)})`,
            lineHeight: 1,
            letterSpacing: -2,
            textShadow: `0 0 60px ${accent}30`,
            display: "flex",
            alignItems: "center",
            minHeight: 130,
          }}
        >
          {displayStat}
          {showStatCursor && (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 80,
                backgroundColor: cursorBlink ? accent : "transparent",
                marginLeft: 4,
              }}
            />
          )}
        </div>

        {/* Label */}
        <div
          style={{
            marginTop: 24,
            fontSize: 22,
            color: TOKENS.colors.text,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
            textAlign: "center",
          }}
        >
          {label}
        </div>

        {/* Sublabel with status dot */}
        {sublabel && (
          <div
            style={{
              marginTop: 32,
              fontSize: 16,
              color: TOKENS.colors.muted,
              opacity: sublabelOpacity,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: accent,
                opacity: dotPulse,
                boxShadow: `0 0 8px ${accent}`,
              }}
            />
            {sublabel}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <BottomBar timeS={timeS} opacity={barOpacity} />
    </AbsoluteFill>
  );
};

export default StatReveal;
