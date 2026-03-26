"use client";
import React from "react";
import {
  AbsoluteFill,
  Img,
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

// Bellwood route following actual streets (right-angle turns at intersections)
// Traces: 25th Ave north → St. Charles Rd east → Mannheim Rd south → Washington Blvd west → loop
const ROUTE_POINTS = [
  // Start: 25th Ave heading north
  { lat: 41.8790, lng: -87.8770, label: "" },
  { lat: 41.8810, lng: -87.8770, label: "" },
  { lat: 41.8827, lng: -87.8770, label: "25th Ave" },
  // Turn east on Fillmore St
  { lat: 41.8827, lng: -87.8750, label: "" },
  { lat: 41.8827, lng: -87.8720, label: "" },
  { lat: 41.8827, lng: -87.8690, label: "" },
  // Turn north on Mannheim Rd
  { lat: 41.8845, lng: -87.8690, label: "" },
  { lat: 41.8860, lng: -87.8690, label: "Mannheim Rd" },
  { lat: 41.8880, lng: -87.8690, label: "" },
  // Turn east on St. Charles Rd
  { lat: 41.8880, lng: -87.8670, label: "" },
  { lat: 41.8880, lng: -87.8640, label: "" },
  { lat: 41.8880, lng: -87.8610, label: "St. Charles Rd" },
  // Turn south on Eastern Ave
  { lat: 41.8865, lng: -87.8610, label: "" },
  { lat: 41.8845, lng: -87.8610, label: "" },
  { lat: 41.8827, lng: -87.8610, label: "Eastern Ave" },
  // Turn west on Washington Blvd
  { lat: 41.8827, lng: -87.8640, label: "" },
  { lat: 41.8827, lng: -87.8670, label: "" },
  { lat: 41.8827, lng: -87.8700, label: "Washington Blvd" },
  // Second loop: north on 22nd Ave
  { lat: 41.8850, lng: -87.8700, label: "" },
  { lat: 41.8870, lng: -87.8700, label: "" },
  { lat: 41.8890, lng: -87.8700, label: "" },
  // East on Madison St
  { lat: 41.8890, lng: -87.8680, label: "" },
  { lat: 41.8890, lng: -87.8650, label: "Madison St" },
  // South back down
  { lat: 41.8870, lng: -87.8650, label: "" },
  { lat: 41.8850, lng: -87.8650, label: "" },
  { lat: 41.8830, lng: -87.8650, label: "" },
  // West to close
  { lat: 41.8830, lng: -87.8680, label: "" },
  { lat: 41.8830, lng: -87.8720, label: "" },
  { lat: 41.8830, lng: -87.8760, label: "" },
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

  // Map bounds — tighter crop around the route area
  const mapMinLat = 41.876;
  const mapMaxLat = 41.895;
  const mapMinLng = -87.885;
  const mapMaxLng = -87.855;

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

      {/* Map area — real Bellwood map */}
      <div
        style={{
          flex: 1,
          borderRadius: 8,
          border: "1px solid rgba(146, 176, 144, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Real map background */}
        <Img
          src={staticFile("remotion-assets/bellwood/map-dark.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.85,
          }}
        />

        {/* Animated route polyline following streets */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {(() => {
            // Build the full polyline path
            const totalSegments = ROUTE_POINTS.length - 1;
            const visibleSegments = Math.floor(routeProgress * totalSegments);
            const partialProgress = (routeProgress * totalSegments) % 1;

            const lines: React.ReactNode[] = [];

            for (let i = 0; i <= visibleSegments && i < totalSegments; i++) {
              const pt = ROUTE_POINTS[i];
              const next = ROUTE_POINTS[i + 1];
              const x1 = toMapX(pt.lng);
              const y1 = toMapY(pt.lat);
              const x2 = toMapX(next.lng);
              const y2 = toMapY(next.lat);

              // Full segment or partial (for the leading edge)
              const segProgress = i < visibleSegments ? 1 : partialProgress;
              const ex = x1 + (x2 - x1) * segProgress;
              const ey = y1 + (y2 - y1) * segProgress;

              lines.push(
                <React.Fragment key={i}>
                  <line x1={x1} y1={y1} x2={ex} y2={ey}
                    stroke="#92B090" strokeWidth={3} strokeLinecap="round" opacity={0.2} />
                  <line x1={x1} y1={y1} x2={ex} y2={ey}
                    stroke="#92B090" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
                </React.Fragment>
              );
            }

            // Moving dot at the leading edge
            if (visibleSegments < totalSegments) {
              const pt = ROUTE_POINTS[visibleSegments];
              const next = ROUTE_POINTS[visibleSegments + 1];
              const x = toMapX(pt.lng) + (toMapX(next.lng) - toMapX(pt.lng)) * partialProgress;
              const y = toMapY(pt.lat) + (toMapY(next.lat) - toMapY(pt.lat)) * partialProgress;
              lines.push(
                <circle key="dot" cx={x} cy={y} r={1.5} fill="#ffffff" opacity={0.9}>
                  <animate attributeName="r" values="1.5;2.5;1.5" dur="1s" repeatCount="indefinite" />
                </circle>
              );
            }

            return lines;
          })()}
        </svg>

        {/* Named intersection pins only */}
        {ROUTE_POINTS.filter(pt => pt.label).map((pt, i) => {
          const ptIndex = ROUTE_POINTS.indexOf(pt);
          const pointVisible = routeProgress > ptIndex / ROUTE_POINTS.length;
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
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "2px solid #92B090",
                  transform: `translate(-50%, -50%) scale(${pulseScale})`,
                  opacity: 0.4,
                  left: "50%",
                  top: "50%",
                }}
              />
              {/* Outer glow */}
              <div
                style={{
                  position: "absolute",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: i === 0 ? "#FF8C42" : "#92B090",
                  opacity: 0.15,
                  transform: "translate(-50%, -50%)",
                  left: "50%",
                  top: "50%",
                  filter: "blur(4px)",
                }}
              />
              {/* Dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: i === 0 ? "#FF8C42" : "#92B090",
                  boxShadow: `0 0 8px ${i === 0 ? "#FF8C42" : "#92B090"}88`,
                  border: "1px solid rgba(255,255,255,0.3)",
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
