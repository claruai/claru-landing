/**
 * BeforeAfterReveal — Split-screen reveal: raw footage on left,
 * enriched on right with a sliding sage green divider.
 * Uses OffthreadVideo for video sources.
 * 1080x1080 at 30fps, 180 frames (6 seconds).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  OffthreadVideo,
  staticFile,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TerminalHeader } from "../../shared/TerminalHeader";
import { BottomBar } from "../../shared/BottomBar";

export interface BeforeAfterRevealProps {
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeSrc?: string;
  afterSrc?: string;
  accent?: string;
}

/** Typing text effect */
function typedChars(
  text: string,
  frame: number,
  startFrame: number,
  cps: number = 1.5
): string {
  if (frame < startFrame) return "";
  const elapsed = frame - startFrame;
  const count = Math.min(Math.floor(elapsed * cps), text.length);
  return text.slice(0, count);
}

const BeforeAfterReveal: React.FC<BeforeAfterRevealProps> = ({
  title = "Enrichment Pipeline",
  beforeLabel = "RAW CAPTURE",
  afterLabel = "ENRICHED",
  beforeSrc = "enrichment-assets/before-sample.mp4",
  afterSrc = "enrichment-assets/after-sample.mp4",
  accent = TOKENS.colors.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const timeS = frame / fps;

  // Layout
  const contentTop = 32;
  const contentBottom = 32;
  const titleAreaHeight = 72;
  const videoAreaTop = contentTop + titleAreaHeight;
  const videoAreaHeight = height - videoAreaTop - contentBottom;

  // Title fade in (frames 0-20)
  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sweep divider position (frames 45-90): 0 = left edge, width = right edge
  const sweepProgress = interpolate(frame, [45, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweepX = sweepProgress * width;

  // "RAW CAPTURE" label types in (frames 30-45)
  const beforeText = typedChars(beforeLabel, frame, 30, 1.5);
  const beforeComplete = beforeText.length >= beforeLabel.length;
  const beforeOpacity = interpolate(frame, [30, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "ENRICHED" label types in (frames 90-105)
  const afterText = typedChars(afterLabel, frame, 90, 1.5);
  const afterComplete = afterText.length >= afterLabel.length;
  const afterOpacity = interpolate(frame, [90, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sweep line glow
  const sweepLineOpacity = interpolate(
    frame, [45, 50, 85, 90], [0, 1, 1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cursor blink
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

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
        title="claru-enrichment -- compare"
        statusLabel="PIPELINE"
        statusColor={accent}
      />

      {/* Title bar */}
      <div
        style={{
          position: "absolute",
          top: contentTop,
          left: 0,
          right: 0,
          height: titleAreaHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: TOKENS.colors.text,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {title}
        </div>
      </div>

      {/* Video area */}
      <div
        style={{
          position: "absolute",
          top: videoAreaTop,
          left: 0,
          right: 0,
          height: videoAreaHeight,
          overflow: "hidden",
        }}
      >
        {/* "Before" video — full width, always visible */}
        <OffthreadVideo
          src={staticFile(beforeSrc)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height: videoAreaHeight,
            objectFit: "cover",
          }}
        />

        {/* "After" video — clipped to reveal from the sweep position */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height: videoAreaHeight,
            clipPath: `inset(0 0 0 ${sweepX}px)`,
          }}
        >
          <OffthreadVideo
            src={staticFile(afterSrc)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height: videoAreaHeight,
              objectFit: "cover",
            }}
          />
        </div>

        {/* Sweep divider line */}
        {frame >= 45 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: sweepX - 1,
              width: 2,
              height: videoAreaHeight,
              backgroundColor: accent,
              opacity: sweepLineOpacity,
              boxShadow: `0 0 12px ${accent}, 0 0 24px ${accent}60`,
              zIndex: 10,
            }}
          />
        )}

        {/* "RAW CAPTURE" label — bottom-left */}
        {frame >= 30 && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              opacity: beforeOpacity,
              zIndex: 15,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "6px 12px",
                borderRadius: 2,
                border: `1px solid ${TOKENS.colors.muted}40`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: TOKENS.colors.muted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {beforeText}
              </span>
              {!beforeComplete && cursorBlink && (
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 14,
                    backgroundColor: TOKENS.colors.muted,
                    marginLeft: 2,
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* "ENRICHED" label — bottom-right */}
        {frame >= 90 && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              opacity: afterOpacity,
              zIndex: 15,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "6px 12px",
                borderRadius: 2,
                border: `1px solid ${accent}40`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: accent,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {afterText}
              </span>
              {!afterComplete && cursorBlink && (
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 14,
                    backgroundColor: accent,
                    marginLeft: 2,
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Thin border around video area */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `1px solid ${accent}20`,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      </div>

      {/* Bottom bar */}
      <BottomBar timeS={timeS} opacity={barOpacity} />
    </AbsoluteFill>
  );
};

export default BeforeAfterReveal;
