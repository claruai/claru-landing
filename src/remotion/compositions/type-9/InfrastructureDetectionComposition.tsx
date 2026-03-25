"use client";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BoundingBox } from "../../shared/BoundingBox";

// ---------------------------------------------------------------------------
// Infrastructure Detection Composition (Type 9)
// Shows a simulated dashcam feed cycling through street scenes with
// animated bounding boxes detecting infrastructure issues.
// Based on real Gemini 2.5 Flash detection data from Bellwood, Illinois.
// ---------------------------------------------------------------------------

// Color palette for different issue types
const ISSUE_COLORS: Record<string, string> = {
  "cracked road surface": "#FF8C42",
  "faded lane marking": "#4DA6FF",
  pothole: "#FF4444",
  "damaged sign": "#FF6B6B",
  "broken sidewalk": "#FFAA00",
  "overgrown vegetation": "#92B090",
  "litter or debris": "#FFD700",
  "damaged utility pole": "#FF6B6B",
};

// Detection data from actual Gemini runs — normalized to 0-1 range
// Source: Bellwood, IL dashcam footage, March 2026
interface Detection {
  label: string;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] normalized 0-1
}

interface Scene {
  subtitle: string;
  location: string;
  timestamp: string;
  speed: string;
  detections: Detection[];
}

const SCENES: Scene[] = [
  {
    subtitle: "Scanning residential street — 4 issues detected",
    location: "25th Ave & St. Charles Rd",
    timestamp: "07:39:12",
    speed: "31 MPH",
    detections: [
      { label: "cracked road surface", bbox: [0.0, 0.57, 1.0, 0.7] },
      { label: "cracked road surface", bbox: [0.25, 0.48, 0.75, 0.57] },
      { label: "faded lane marking", bbox: [0.48, 0.48, 0.52, 0.58] },
      { label: "faded lane marking", bbox: [0.7, 0.48, 0.75, 0.58] },
    ],
  },
  {
    subtitle: "Commercial corridor — vegetation and road damage",
    location: "Mannheim Rd & Washington Blvd",
    timestamp: "07:43:05",
    speed: "28 MPH",
    detections: [
      { label: "cracked road surface", bbox: [0.0, 0.68, 0.4, 0.8] },
      { label: "cracked road surface", bbox: [0.45, 0.6, 0.7, 0.7] },
      { label: "faded lane marking", bbox: [0.4, 0.58, 0.48, 0.63] },
      { label: "overgrown vegetation", bbox: [0.7, 0.55, 1.0, 0.65] },
      { label: "overgrown vegetation", bbox: [0.0, 0.47, 0.25, 0.6] },
      { label: "faded lane marking", bbox: [0.65, 0.55, 0.8, 0.6] },
    ],
  },
  {
    subtitle: "Intersection analysis — lane markings deteriorated",
    location: "Bellwood Ave & Adams St",
    timestamp: "07:44:23",
    speed: "11 MPH",
    detections: [
      { label: "faded lane marking", bbox: [0.0, 0.59, 0.3, 0.64] },
      { label: "faded lane marking", bbox: [0.35, 0.58, 0.65, 0.63] },
      { label: "faded lane marking", bbox: [0.7, 0.59, 1.0, 0.64] },
      { label: "cracked road surface", bbox: [0.35, 0.52, 0.6, 0.58] },
      { label: "cracked road surface", bbox: [0.0, 0.57, 0.25, 0.65] },
      { label: "cracked road surface", bbox: [0.75, 0.57, 1.0, 0.65] },
    ],
  },
  {
    subtitle: "Residential block — sidewalk and debris flagged",
    location: "Eastern Ave & Bohland Ave",
    timestamp: "07:48:51",
    speed: "22 MPH",
    detections: [
      { label: "broken sidewalk", bbox: [0.0, 0.55, 0.15, 0.7] },
      { label: "litter or debris", bbox: [0.8, 0.6, 0.95, 0.72] },
      { label: "cracked road surface", bbox: [0.2, 0.62, 0.8, 0.75] },
      { label: "damaged sign", bbox: [0.88, 0.2, 0.97, 0.45] },
    ],
  },
  {
    subtitle: "Night patrol — VLM detects under low light",
    location: "25th Ave & Fillmore St",
    timestamp: "21:12:37",
    speed: "18 MPH",
    detections: [
      { label: "faded lane marking", bbox: [0.3, 0.55, 0.7, 0.6] },
      { label: "cracked road surface", bbox: [0.1, 0.6, 0.9, 0.75] },
      { label: "damaged utility pole", bbox: [0.02, 0.1, 0.08, 0.55] },
    ],
  },
];

// Scene timing: each scene gets ~100 frames (3.3s), with transitions
const SCENE_DURATION = 100;
const TRANSITION = 15;

function DashcamHUD({
  location,
  timestamp,
  speed,
  issueCount,
  opacity,
}: {
  location: string;
  timestamp: string;
  speed: string;
  issueCount: number;
  opacity: number;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {/* Top-left: Camera info */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 14,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10,
          color: "#ffffff",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          letterSpacing: 0.5,
        }}
      >
        <div style={{ opacity: 0.6 }}>VANTRUE E1 PRO</div>
      </div>

      {/* Top-right: Detection count */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 14,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: issueCount > 0 ? "#FF4444" : "#92B090",
            boxShadow: `0 0 6px ${issueCount > 0 ? "#FF444488" : "#92B09088"}`,
          }}
        />
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 11,
            fontWeight: 700,
            color: issueCount > 0 ? "#FF8C42" : "#92B090",
            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          {issueCount} ISSUE{issueCount !== 1 ? "S" : ""} DETECTED
        </span>
      </div>

      {/* Bottom-left: Timestamp + GPS */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: 14,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10,
          color: "#ffffff",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          lineHeight: 1.5,
        }}
      >
        <div>{timestamp} &nbsp; N:41.8819 W:87.8728</div>
        <div style={{ opacity: 0.7 }}>{location}</div>
      </div>

      {/* Bottom-right: Speed */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 14,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 12,
          fontWeight: 700,
          color: "#ffffff",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
        }}
      >
        {speed}
      </div>

      {/* Scanline effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function InfrastructureDetectionComposition({
  compositionId: _compositionId,
}: {
  compositionId: string;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Determine which scene is active (loop through scenes)
  const totalSceneFrames = SCENE_DURATION * SCENES.length;
  const loopFrame = frame % totalSceneFrames;
  const sceneIndex = Math.floor(loopFrame / SCENE_DURATION);
  const sceneFrame = loopFrame % SCENE_DURATION;
  const scene = SCENES[sceneIndex];

  // Scene fade in/out
  const sceneOpacity = interpolate(
    sceneFrame,
    [0, TRANSITION, SCENE_DURATION - TRANSITION, SCENE_DURATION],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Simulated dashcam background — gradient that shifts per scene
  const bgHue = sceneIndex * 30;
  const isNight = sceneIndex === 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isNight ? "#0a0a0f" : "#1a1a20",
        overflow: "hidden",
      }}
    >
      {/* Simulated dashcam frame background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isNight
            ? `linear-gradient(180deg, #0a0a12 0%, #0f0f18 40%, #151520 60%, #1a1a28 100%)`
            : `linear-gradient(180deg, hsl(${200 + bgHue}, 10%, 65%) 0%, hsl(${200 + bgHue}, 8%, 55%) 35%, hsl(${30 + bgHue}, 6%, 45%) 55%, hsl(${20 + bgHue}, 8%, 35%) 100%)`,
          opacity: sceneOpacity * 0.85,
        }}
      />

      {/* Road surface simulation */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45%",
          background: isNight
            ? "linear-gradient(180deg, #1a1a24 0%, #252530 50%, #2a2a35 100%)"
            : `linear-gradient(180deg, hsl(${20 + bgHue}, 5%, 38%) 0%, hsl(${15 + bgHue}, 4%, 32%) 50%, hsl(${10 + bgHue}, 3%, 28%) 100%)`,
          opacity: sceneOpacity,
        }}
      />

      {/* Horizon line */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: isNight ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
          opacity: sceneOpacity,
        }}
      />

      {/* Detection bounding boxes — stagger entrance */}
      {scene.detections.map((det, i) => {
        const detEnter = TRANSITION + i * 8; // Stagger each box by 8 frames
        const detOpacity = interpolate(
          sceneFrame,
          [detEnter, detEnter + 10, SCENE_DURATION - TRANSITION - 5, SCENE_DURATION - TRANSITION],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <BoundingBox
            key={`${sceneIndex}-${i}`}
            bbox={det.bbox}
            label={det.label.toUpperCase()}
            color={ISSUE_COLORS[det.label] ?? "#92B090"}
            opacity={detOpacity * sceneOpacity}
            showCorners={true}
          />
        );
      })}

      {/* Dashcam HUD overlay */}
      <DashcamHUD
        location={scene.location}
        timestamp={scene.timestamp}
        speed={scene.speed}
        issueCount={scene.detections.length}
        opacity={sceneOpacity}
      />

      {/* Bottom bar subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 28,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 14,
          opacity: sceneOpacity,
        }}
      >
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 10,
            color: "#92B090",
            letterSpacing: 0.5,
          }}
        >
          {scene.subtitle}
        </span>
      </div>

      {/* VLM processing indicator — top center */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          opacity: sceneOpacity * 0.9,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#92B090",
            animation: "pulse 1.5s ease-in-out infinite",
            boxShadow: "0 0 4px #92B09066",
          }}
        />
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 9,
            color: "#92B090",
            letterSpacing: 1,
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          GEMINI 2.5 FLASH &bull; INFRASTRUCTURE DETECTION
        </span>
      </div>
    </AbsoluteFill>
  );
}
