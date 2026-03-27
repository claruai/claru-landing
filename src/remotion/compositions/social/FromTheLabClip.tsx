/**
 * FromTheLabClip — Wraps a raw video clip with terminal-style metadata overlay.
 * Full-frame video with TerminalHeader, metadata, stat counter, vignette.
 * 1080x1080 at 30fps, 240 frames (8 seconds).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  OffthreadVideo,
  staticFile,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { TerminalHeader } from "../../shared/TerminalHeader";

export interface FromTheLabClipProps {
  videoSrc?: string;
  location?: string;
  stat?: string;
  sessionId?: string;
  timestamp?: string;
}

/** Parse stat string like "4,200 clips this week" into number + suffix */
function parseStatParts(stat: string): { number: number; suffix: string } {
  const match = stat.match(/^([\d,]+)\s*(.*)/);
  if (!match) return { number: 0, suffix: stat };
  return {
    number: parseInt(match[1].replace(/,/g, ""), 10),
    suffix: match[2],
  };
}

function formatNumber(n: number): string {
  return Math.floor(n).toLocaleString();
}

const FromTheLabClip: React.FC<FromTheLabClipProps> = ({
  videoSrc = "remotion-assets/samples/cs-egocentric.mp4",
  location = "Nairobi, Kenya",
  stat = "4,200 clips this week",
  sessionId = "session-4217",
  timestamp,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = TOKENS.colors.accent;

  // Metadata fade in (frames 5-30)
  const metaOpacity = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const metaSlideY = interpolate(frame, [5, 30], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stat counter tick up (frames 15-40)
  const { number: statTarget, suffix: statSuffix } = parseStatParts(stat);
  const counterProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 30, stiffness: 50, mass: 1 },
  });
  const currentStatValue =
    statTarget * Math.min(Math.max(0, counterProgress), 1);

  // Border fade in
  const borderOpacity = interpolate(frame, [0, 15], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Timestamp
  const displayTimestamp =
    timestamp || new Date().toISOString().split("T")[0];

  // Recording indicator blink
  const recBlink = frame % 40 < 20;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* Full-frame video */}
      <OffthreadVideo
        src={staticFile(videoSrc)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.7,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />

      {/* Thin sage green border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${accent}`,
          opacity: borderOpacity,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Terminal header at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          backgroundColor: "rgba(10, 9, 8, 0.75)",
          opacity: metaOpacity,
        }}
      >
        <TerminalHeader
          title={location}
          statusLabel="RECORDING"
          statusColor={recBlink ? accent : "transparent"}
        />
      </div>

      {/* "FROM THE LAB" watermark — top right */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 16,
          zIndex: 20,
          opacity: metaOpacity * 0.5,
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: TOKENS.colors.muted,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          From the Lab
        </span>
      </div>

      {/* Bottom-left metadata: claru.ai | sessionId + timestamp */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          zIndex: 20,
          opacity: metaOpacity,
          transform: `translateY(${metaSlideY}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(10, 9, 8, 0.7)",
            padding: "5px 10px",
            borderRadius: 2,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: accent,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            claru.ai
          </span>
          <span style={{ fontSize: 10, color: TOKENS.colors.muted }}>|</span>
          <span
            style={{
              fontSize: 11,
              color: TOKENS.colors.muted,
              letterSpacing: 0.5,
            }}
          >
            {sessionId}
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(10, 9, 8, 0.7)",
            padding: "3px 10px",
            borderRadius: 2,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: TOKENS.colors.muted,
              letterSpacing: 0.5,
            }}
          >
            {displayTimestamp}
          </span>
        </div>
      </div>

      {/* Bottom-right stat */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 20,
          opacity: metaOpacity,
          transform: `translateY(${metaSlideY}px)`,
          backgroundColor: "rgba(10, 9, 8, 0.7)",
          padding: "8px 14px",
          borderRadius: 2,
          border: `1px solid ${accent}25`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 22,
            color: accent,
            fontWeight: 700,
            letterSpacing: -0.5,
            textShadow: `0 0 20px ${accent}30`,
          }}
        >
          {frame >= 15 ? formatNumber(currentStatValue) : "0"}
        </span>
        {statSuffix && (
          <span
            style={{
              fontSize: 10,
              color: TOKENS.colors.muted,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {statSuffix}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};

export default FromTheLabClip;
