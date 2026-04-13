/**
 * NetworkStatus — Animated city-by-city collector status dashboard
 * with horizontal bar chart. Bars fill in one by one with stagger.
 * 1080x1080 at 30fps, 210 frames (7 seconds).
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

export interface CityStatus {
  name: string;
  count: number;
  active: boolean;
}

export interface NetworkStatusProps {
  cities?: CityStatus[];
  total?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TITLE_APPEAR = 10;
const TITLE_DONE = 30;
const BARS_START = 40;
const BAR_STAGGER = 8;
const TOTAL_OFFSET = 12;

// ---------------------------------------------------------------------------
// CityBar
// ---------------------------------------------------------------------------

const CityBar: React.FC<{
  city: CityStatus;
  index: number;
  maxCount: number;
  accent: string;
}> = ({ city, index, maxCount, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = BARS_START + index * BAR_STAGGER;

  const fillProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 24, stiffness: 60, mass: 0.8 },
  });
  const progress = Math.max(0, Math.min(1, fillProgress));

  const barWidthPct = maxCount > 0 ? (city.count / maxCount) * 100 : 0;
  const currentWidth = progress * barWidthPct;
  const currentCount = Math.floor(progress * city.count);

  const rowOpacity = interpolate(
    frame,
    [startFrame, startFrame + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const slideX = interpolate(
    frame,
    [startFrame, startFrame + 10],
    [-20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < startFrame - 2) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: rowOpacity,
        transform: `translateX(${slideX}px)`,
        marginBottom: 14,
      }}
    >
      {/* City name + active dot */}
      <div
        style={{
          width: 160,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 16,
          color: TOKENS.colors.text,
          textAlign: "right",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        <span>{city.name}</span>
        {city.active && (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: accent,
              boxShadow: `0 0 6px ${accent}`,
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* Bar track */}
      <div
        style={{
          flex: 1,
          height: 24,
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${currentWidth}%`,
            backgroundColor: city.active ? accent : `${accent}80`,
            borderRadius: 3,
            boxShadow: city.active ? `0 0 12px ${accent}33` : undefined,
          }}
        />
      </div>

      {/* Count */}
      <div
        style={{
          width: 80,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 16,
          color: accent,
          textAlign: "right",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {frame >= startFrame ? currentCount.toLocaleString() : ""}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

const DEFAULT_CITIES: CityStatus[] = [
  { name: "Nairobi", count: 420, active: true },
  { name: "Manila", count: 380, active: true },
  { name: "Lagos", count: 310, active: true },
];

const NetworkStatus: React.FC<NetworkStatusProps> = ({
  cities = DEFAULT_CITIES,
  total = "1,110",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeS = frame / fps;

  const maxCount = Math.max(...cities.map((c) => c.count), 1);
  const activeCities = cities.filter((c) => c.active).length;
  const accent = TOKENS.colors.accent;

  // Title
  const titleOpacity = interpolate(frame, [TITLE_APPEAR, TITLE_DONE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [TITLE_APPEAR, TITLE_DONE], [-10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Total section
  const totalStart = BARS_START + cities.length * BAR_STAGGER + TOTAL_OFFSET;
  const totalOpacity = interpolate(
    frame,
    [totalStart, totalStart + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const totalSlideY = interpolate(
    frame,
    [totalStart, totalStart + 15],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
        title="claru-network -- status"
        statusLabel={`${activeCities} ACTIVE`}
        statusColor={accent}
      />

      {/* Main content */}
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
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: TOKENS.colors.muted,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Collector Network
          </div>
          <div
            style={{
              fontSize: 24,
              color: TOKENS.colors.text,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Active Collection Sites
          </div>
        </div>

        {/* City bars */}
        <div style={{ marginBottom: 32 }}>
          {cities.map((city, i) => (
            <CityBar
              key={city.name}
              city={city}
              index={i}
              maxCount={maxCount}
              accent={accent}
            />
          ))}
        </div>

        {/* Rule line + Total */}
        <div
          style={{
            opacity: totalOpacity,
            transform: `translateY(${totalSlideY}px)`,
          }}
        >
          <div
            style={{
              height: 1,
              backgroundColor: `${accent}30`,
              marginBottom: 20,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: TOKENS.colors.muted,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Total Clips Collected
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: accent,
                letterSpacing: -1,
                textShadow: `0 0 40px ${accent}25`,
              }}
            >
              {total}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <BottomBar timeS={timeS} opacity={barOpacity} />
    </AbsoluteFill>
  );
};

export default NetworkStatus;
