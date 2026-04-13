/**
 * TerminalQuery — Simulated database terminal session with typed-out
 * queries and results. Lines appear sequentially with realistic typing.
 * 1080x1080 at 30fps, 180 frames (6 seconds).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TerminalHeader } from "../../shared/TerminalHeader";
import { BottomBar } from "../../shared/BottomBar";

export interface TerminalQueryLine {
  type: "query" | "result" | "array" | "comment";
  text: string;
}

export interface TerminalQueryProps {
  lines?: TerminalQueryLine[];
  accent?: string;
}

// ---------------------------------------------------------------------------
// Typing speed constants
// ---------------------------------------------------------------------------

const CHARS_PER_FRAME_QUERY = 1.4;
const CHARS_PER_FRAME_RESULT = 2.0;
const CHARS_PER_FRAME_ARRAY = 1.8;
const CHARS_PER_FRAME_COMMENT = 1.6;
const INTER_LINE_PAUSE = 8;
const INITIAL_DELAY = 15;

function getCharsPerFrame(type: TerminalQueryLine["type"]): number {
  switch (type) {
    case "query": return CHARS_PER_FRAME_QUERY;
    case "result": return CHARS_PER_FRAME_RESULT;
    case "array": return CHARS_PER_FRAME_ARRAY;
    case "comment": return CHARS_PER_FRAME_COMMENT;
    default: return CHARS_PER_FRAME_QUERY;
  }
}

/** Compute the frame each line starts and finishes typing */
function computeTimeline(lines: TerminalQueryLine[]) {
  const timeline: { startFrame: number; endFrame: number }[] = [];
  let cursor = INITIAL_DELAY;

  for (const line of lines) {
    const cpf = getCharsPerFrame(line.type);
    const typeDuration = Math.ceil(line.text.length / cpf);
    timeline.push({ startFrame: cursor, endFrame: cursor + typeDuration });
    cursor += typeDuration + INTER_LINE_PAUSE;
  }

  return timeline;
}

const DEFAULT_LINES: TerminalQueryLine[] = [
  { type: "query", text: "SELECT COUNT(*) FROM clips;" },
  { type: "result", text: "1,045,231" },
];

const TerminalQuery: React.FC<TerminalQueryProps> = ({
  lines = DEFAULT_LINES,
  accent = TOKENS.colors.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeS = frame / fps;

  const timeline = computeTimeline(lines);
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  // Which line is currently active
  let activeLineIndex = -1;
  for (let i = timeline.length - 1; i >= 0; i--) {
    if (frame >= timeline[i].startFrame) {
      activeLineIndex = i;
      break;
    }
  }

  const barOpacity = interpolate(frame, [0, 10], [0, 1], {
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
      {/* Terminal header */}
      <TerminalHeader
        title="claru-db -- session"
        statusLabel="LIVE"
        statusColor={accent}
      />

      {/* Scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          pointerEvents: "none",
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
          transform: `translateY(${(frame * 0.6) % 200}px)`,
        }}
      />

      {/* Terminal content area */}
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
          padding: "0 48px",
        }}
      >
        {/* Initial blinking cursor before any lines */}
        {frame < INITIAL_DELAY && (
          <div style={{ minHeight: 22 }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 18,
                backgroundColor: cursorBlink ? accent : "transparent",
              }}
            />
          </div>
        )}

        {/* Lines */}
        {lines.map((line, i) => {
          const timing = timeline[i];
          if (frame < timing.startFrame) return null;

          const elapsed = frame - timing.startFrame;
          const cpf = getCharsPerFrame(line.type);
          const charCount = Math.min(
            Math.floor(elapsed * cpf),
            line.text.length
          );
          const displayText = line.text.slice(0, charCount);
          const isComplete = charCount >= line.text.length;
          const isActive = i === activeLineIndex;

          // Color and prefix by type
          let textColor: string = TOKENS.colors.text;
          let prefix = "";
          let prefixColor: string = TOKENS.colors.muted;
          let indent = 0;
          let fontSize = 18;
          let fontWeight = 400;

          switch (line.type) {
            case "query":
              textColor = "rgba(232, 232, 232, 0.7)";
              prefix = "$ ";
              prefixColor = accent;
              fontSize = 18;
              break;
            case "result":
              textColor = accent;
              prefix = "  => ";
              prefixColor = TOKENS.colors.muted;
              fontSize = 20;
              fontWeight = 600;
              break;
            case "array":
              textColor = accent;
              prefix = "     ";
              indent = 24;
              fontSize = 18;
              break;
            case "comment":
              textColor = TOKENS.colors.muted;
              prefix = "";
              prefixColor = TOKENS.colors.muted;
              fontSize = 16;
              break;
          }

          const rowOpacity = interpolate(
            frame,
            [timing.startFrame, timing.startFrame + 4],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                opacity: rowOpacity,
                marginLeft: indent,
                marginBottom: 8,
                minHeight: 28,
              }}
            >
              <span
                style={{
                  fontSize,
                  color: prefixColor,
                  whiteSpace: "pre",
                  flexShrink: 0,
                }}
              >
                {prefix}
              </span>
              <span
                style={{
                  fontSize,
                  fontWeight,
                  color: textColor,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {displayText}
              </span>
              {isActive && (
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 18,
                    backgroundColor: cursorBlink ? accent : "transparent",
                    marginLeft: 1,
                    verticalAlign: "middle",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <BottomBar timeS={timeS} opacity={barOpacity} />
    </AbsoluteFill>
  );
};

export default TerminalQuery;
