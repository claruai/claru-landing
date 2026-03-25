"use client";
import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";

// ---------------------------------------------------------------------------
// Bellwood Infrastructure Detection — Type 9 Composition
//
// Phase 1 (0-90):   3x3 grid of 9 dashcam feeds with detections
// Phase 2 (90-180): Center tile zooms to fill screen
// Phase 3 (180-450): Full video + side panel with map & stats
// Phase 4 (450-600): Stats punchline, fade to grid loop
// ---------------------------------------------------------------------------

const GRID_COLS = 3;
const GRID_ROWS = 3;
const TILE_W = 426;
const TILE_H = 240;

// Bellwood GPS points from dashcam HUD (for map route visualization)
const ROUTE_POINTS = [
  { lat: 41.8827, lng: -87.8747, label: "Residential" },
  { lat: 41.8837, lng: -87.8832, label: "Commercial" },
  { lat: 41.8864, lng: -87.8760, label: "School Zone" },
  { lat: 41.9223, lng: -87.8704, label: "Main Road" },
  { lat: 41.8877, lng: -87.8635, label: "Industrial" },
  { lat: 41.8875, lng: -87.8907, label: "Dawn Patrol" },
];

// Issue detection stats (accumulated)
const ISSUES_BY_SECOND = [0, 3, 8, 14, 22, 31, 42, 55, 68, 75, 89, 102, 118, 127, 142, 156, 172, 189, 201, 215];

function MapPanel({ frame, enterFrame }: { frame: number; enterFrame: number }) {
  const localFrame = frame - enterFrame;
  const slideIn = interpolate(localFrame, [0, 20], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Animate route lines appearing
  const routeProgress = interpolate(localFrame, [15, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Issue counter
  const secondIdx = Math.min(Math.floor(localFrame / 30), ISSUES_BY_SECOND.length - 1);
  const issueCount = ISSUES_BY_SECOND[Math.max(0, secondIdx)];

  // Map bounds for Bellwood (simplified)
  const mapMinLat = 41.875;
  const mapMaxLat = 41.93;
  const mapMinLng = -87.90;
  const mapMaxLng = -87.85;

  const toMapX = (lng: number) => ((lng - mapMinLng) / (mapMaxLng - mapMinLng)) * 100;
  const toMapY = (lat: number) => (1 - (lat - mapMinLat) / (mapMaxLat - mapMinLat)) * 100;

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "35%",
        backgroundColor: "rgba(10, 9, 8, 0.95)",
        borderLeft: "1px solid rgba(146, 176, 144, 0.3)",
        transform: `translateX(${slideIn}%)`,
        display: "flex",
        flexDirection: "column",
        padding: 16,
        gap: 12,
      }}
    >
      {/* Header */}
      <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 10, color: "#92B090", letterSpacing: 1.5, textTransform: "uppercase" }}>
        Live Detection Map
      </div>

      {/* Map area */}
      <div
        style={{
          flex: 1,
          backgroundColor: "rgba(20, 20, 18, 0.8)",
          borderRadius: 8,
          border: "1px solid rgba(146, 176, 144, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid lines */}
        {[25, 50, 75].map((pct) => (
          <React.Fragment key={pct}>
            <div style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, backgroundColor: "rgba(146, 176, 144, 0.06)" }} />
            <div style={{ position: "absolute", top: `${pct}%`, left: 0, right: 0, height: 1, backgroundColor: "rgba(146, 176, 144, 0.06)" }} />
          </React.Fragment>
        ))}

        {/* Route lines connecting points */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {ROUTE_POINTS.slice(0, -1).map((pt, i) => {
            const next = ROUTE_POINTS[i + 1];
            const pointProgress = interpolate(routeProgress, [i / ROUTE_POINTS.length, (i + 1) / ROUTE_POINTS.length], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const x1 = toMapX(pt.lng);
            const y1 = toMapY(pt.lat);
            const x2 = toMapX(next.lng);
            const y2 = toMapY(next.lat);
            const cx = x1 + (x2 - x1) * pointProgress;
            const cy = y1 + (y2 - y1) * pointProgress;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={cx}
                y2={cy}
                stroke="#92B090"
                strokeWidth={0.8}
                strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}
        </svg>

        {/* Route points with pulse animation */}
        {ROUTE_POINTS.map((pt, i) => {
          const pointVisible = routeProgress > i / ROUTE_POINTS.length;
          if (!pointVisible) return null;

          const x = toMapX(pt.lng);
          const y = toMapY(pt.lat);
          const pulseScale = interpolate(localFrame % 60, [0, 30, 60], [1, 1.5, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Pulse ring */}
              <div
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "1px solid #92B090",
                  transform: `translate(-50%, -50%) scale(${pulseScale})`,
                  opacity: 0.3,
                  left: "50%",
                  top: "50%",
                }}
              />
              {/* Dot */}
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: i === 0 ? "#FF8C42" : "#92B090",
                  boxShadow: `0 0 6px ${i === 0 ? "#FF8C42" : "#92B090"}66`,
                }}
              />
              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 6,
                  color: "rgba(146, 176, 144, 0.7)",
                  whiteSpace: "nowrap",
                }}
              >
                {pt.label}
              </div>
            </div>
          );
        })}

        {/* "Bellwood, IL" label */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            fontFamily: TOKENS.fonts.mono,
            fontSize: 8,
            color: "rgba(146, 176, 144, 0.4)",
            letterSpacing: 0.5,
          }}
        >
          BELLWOOD, IL
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>ISSUES DETECTED</span>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 20, fontWeight: 700, color: "#FF8C42" }}>{issueCount}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>ROUTE COVERAGE</span>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 14, fontWeight: 700, color: "#92B090" }}>
            {Math.round(routeProgress * 200)}+ mi
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>VEHICLES ACTIVE</span>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 14, fontWeight: 700, color: "#4DA6FF" }}>5</span>
        </div>
      </div>

      {/* Issue breakdown bar */}
      <div style={{ display: "flex", gap: 2, height: 4, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ flex: 45, backgroundColor: "#FF8C42", borderRadius: 2 }} />
        <div style={{ flex: 30, backgroundColor: "#4DA6FF", borderRadius: 2 }} />
        <div style={{ flex: 15, backgroundColor: "#92B090", borderRadius: 2 }} />
        <div style={{ flex: 10, backgroundColor: "#FFD700", borderRadius: 2 }} />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { color: "#FF8C42", label: "Cracked Road" },
          { color: "#4DA6FF", label: "Faded Marking" },
          { color: "#92B090", label: "Vegetation" },
          { color: "#FFD700", label: "Debris" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{ width: 5, height: 5, borderRadius: 1, backgroundColor: item.color }} />
            <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 7, color: "rgba(255,255,255,0.4)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InfrastructureDetectionComposition({
  compositionId: _compositionId,
}: {
  compositionId: string;
}) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Phase timing
  const PHASE1_END = 90;   // Grid
  const PHASE2_END = 180;  // Zoom
  const PHASE3_END = 480;  // Full video + map
  const PHASE4_END = 600;  // Stats + fade

  const tileFiles = Array.from({ length: 9 }, (_, i) => staticFile(`remotion-assets/bellwood/tiles/t${i}.mp4`));
  const heroFile = staticFile("remotion-assets/bellwood/hero.mp4");

  // Phase 1: 3x3 grid
  const gridOpacity = interpolate(frame, [0, 10, PHASE1_END - 10, PHASE1_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Zoom — center tile scales up
  const zoomProgress = interpolate(frame, [PHASE1_END, PHASE2_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Phase 3: Full video visible, map panel slides in
  const phase3Active = frame >= PHASE2_END && frame < PHASE3_END;

  // Phase 4: Fade out
  const phase4Opacity = interpolate(frame, [PHASE3_END, PHASE3_END + 30, PHASE4_END - 30, PHASE4_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // During zoom, calculate the center tile's transform
  const centerIdx = 4;
  const centerCol = centerIdx % GRID_COLS;
  const centerRow = Math.floor(centerIdx / GRID_COLS);
  const gridStartX = (width - TILE_W * GRID_COLS) / 2;
  const gridStartY = (height - TILE_H * GRID_ROWS) / 2;
  const centerTileX = gridStartX + centerCol * TILE_W;
  const centerTileY = gridStartY + centerRow * TILE_H;

  // Scale factor: from tile size to full width (accounting for map panel)
  const targetW = phase3Active ? width * 0.65 : width;
  const scaleX = targetW / TILE_W;
  const scaleY = height / TILE_H;
  const scale = Math.min(scaleX, scaleY);

  const zoomScale = interpolate(zoomProgress, [0, 1], [1, scale]);
  const zoomX = interpolate(zoomProgress, [0, 1], [centerTileX, 0]);
  const zoomY = interpolate(zoomProgress, [0, 1], [centerTileY, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0908" }}>

      {/* Phase 1: Grid of 9 videos */}
      {frame < PHASE2_END && (
        <div style={{ position: "absolute", inset: 0, opacity: frame < PHASE1_END ? gridOpacity : 1 - zoomProgress }}>
          <div
            style={{
              position: "absolute",
              left: gridStartX,
              top: gridStartY,
              width: TILE_W * GRID_COLS,
              height: TILE_H * GRID_ROWS,
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_COLS}, ${TILE_W}px)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, ${TILE_H}px)`,
              gap: 0,
            }}
          >
            {tileFiles.map((src, i) => (
              <div key={i} style={{ width: TILE_W, height: TILE_H, overflow: "hidden" }}>
                <OffthreadVideo
                  src={src}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  muted
                />
              </div>
            ))}
          </div>

          {/* Grid label */}
          <div
            style={{
              position: "absolute",
              bottom: gridStartY - 24,
              left: gridStartX,
              fontFamily: TOKENS.fonts.mono,
              fontSize: 10,
              color: "#92B090",
              letterSpacing: 1,
              opacity: gridOpacity,
            }}
          >
            9 DASHCAM FEEDS &bull; BELLWOOD, IL &bull; LIVE DETECTION
          </div>
        </div>
      )}

      {/* Phase 2-3: Zooming center tile / Full hero video */}
      {frame >= PHASE1_END && frame < PHASE3_END + 30 && (
        <div
          style={{
            position: "absolute",
            left: zoomProgress < 1 ? zoomX : 0,
            top: zoomProgress < 1 ? zoomY : 0,
            width: zoomProgress < 1 ? TILE_W : (phase3Active ? "65%" : "100%"),
            height: zoomProgress < 1 ? TILE_H : "100%",
            transform: zoomProgress < 1 ? `scale(${zoomScale})` : undefined,
            transformOrigin: "top left",
            overflow: "hidden",
          }}
        >
          <OffthreadVideo
            src={heroFile}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
            startFrom={0}
          />
        </div>
      )}

      {/* Phase 3: Map panel */}
      {frame >= PHASE2_END && frame < PHASE3_END && (
        <MapPanel frame={frame} enterFrame={PHASE2_END} />
      )}

      {/* Phase 4: Stats punchline */}
      {frame >= PHASE3_END && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase4Opacity,
            gap: 16,
          }}
        >
          <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 11, color: "#92B090", letterSpacing: 2, textTransform: "uppercase" }}>
            Results
          </div>
          <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 48, fontWeight: 700, color: "#ffffff" }}>
            3x
          </div>
          <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 400 }}>
            more infrastructure defects identified vs. manual inspection
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
            {[
              { value: "75+", label: "Hours collected" },
              { value: "200+", label: "Lane-miles" },
              { value: "10", label: "Defect types" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 24, fontWeight: 700, color: "#92B090" }}>{stat.value}</div>
                <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Persistent bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 24,
          backgroundColor: "rgba(10, 9, 8, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 8, color: "rgba(146, 176, 144, 0.6)", letterSpacing: 0.5 }}>
          CLARU &bull; MUNICIPAL INFRASTRUCTURE MONITORING
        </span>
        <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 8, color: "rgba(255, 140, 66, 0.6)" }}>
          {Math.min(Math.floor(frame / 3), 215)} issues detected
        </span>
      </div>
    </AbsoluteFill>
  );
}
