// ---------------------------------------------------------------------------
// PointCloudFlythrough — Renders kitchen-pointcloud.ply as a slowly rotating
// point cloud with a cinematic camera orbit. Uses @remotion/three + R3F.
// ---------------------------------------------------------------------------

import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import type { EnrichmentVizProps } from "./types";
import { ENRICHMENT_BG } from "./types";

// ---------------------------------------------------------------------------
// PLY Parser — parse ASCII PLY into geometry (runs once via useMemo)
// ---------------------------------------------------------------------------

function parsePLYToGeometry(text: string): THREE.BufferGeometry {
  const lines = text.split("\n");
  let vertexCount = 0;
  let headerEnd = 0;

  // Parse header
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("element vertex")) {
      vertexCount = parseInt(line.split(" ")[2], 10);
    }
    if (line === "end_header") {
      headerEnd = i + 1;
      break;
    }
  }

  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);

  // Compute center for centering
  let cx = 0, cy = 0, cz = 0;
  const rawData: number[][] = [];

  for (let i = 0; i < vertexCount; i++) {
    const parts = lines[headerEnd + i]?.trim().split(/\s+/);
    if (!parts || parts.length < 6) continue;
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    const z = parseFloat(parts[2]);
    const r = parseFloat(parts[3]);
    const g = parseFloat(parts[4]);
    const b = parseFloat(parts[5]);
    rawData.push([x, y, z, r, g, b]);
    cx += x;
    cy += y;
    cz += z;
  }

  cx /= rawData.length;
  cy /= rawData.length;
  cz /= rawData.length;

  // Find max extent for normalization
  let maxExtent = 0;
  for (const [x, y, z] of rawData) {
    maxExtent = Math.max(
      maxExtent,
      Math.abs(x - cx),
      Math.abs(y - cy),
      Math.abs(z - cz)
    );
  }
  const scale = maxExtent > 0 ? 2.0 / maxExtent : 1;

  for (let i = 0; i < rawData.length; i++) {
    const [x, y, z, r, g, b] = rawData[i];
    positions[i * 3] = (x - cx) * scale;
    positions[i * 3 + 1] = (y - cy) * scale;
    positions[i * 3 + 2] = (z - cz) * scale;
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

// ---------------------------------------------------------------------------
// PointCloudScene — the actual Three.js scene rendered inside ThreeCanvas
// ---------------------------------------------------------------------------

const PLY_URL = staticFile("/models/kitchen-pointcloud.ply");

function PointCloudScene({ plyText }: { plyText: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const geometry = useMemo(() => parsePLYToGeometry(plyText), [plyText]);

  // Camera orbit: full 360 rotation over the composition duration
  const angle = interpolate(frame, [0, durationInFrames], [0, Math.PI * 2]);
  const radius = interpolate(
    frame,
    [0, durationInFrames * 0.3, durationInFrames * 0.7, durationInFrames],
    [4.5, 3.5, 3.5, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const elevation = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [0.6, 1.2, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cameraX = Math.sin(angle) * radius;
  const cameraZ = Math.cos(angle) * radius;
  const cameraY = elevation;

  // Slight point size pulse for visual interest
  const pointSize = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.012, 0.018]
  );

  return (
    <>
      <color attach="background" args={[ENRICHMENT_BG]} />
      <perspectiveCamera
        position={[cameraX, cameraY, cameraZ]}
        fov={50}
        makeDefault
      />

      {/* Subtle ambient light for atmosphere */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      <points geometry={geometry}>
        <pointsMaterial
          size={pointSize}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      {/* Faint grid helper for spatial reference */}
      <gridHelper
        args={[6, 20, "#1a1a18", "#1a1a18"]}
        position={[0, -1.5, 0]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main composition wrapper — fetches PLY text then renders
// ---------------------------------------------------------------------------

const PointCloudFlythrough: React.FC<EnrichmentVizProps> = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // We need to load the PLY file. In Remotion, staticFile gives us a URL.
  // We use delayRender to wait for the fetch.
  const [plyText, setPlyText] = React.useState<string | null>(null);
  const [handle] = React.useState(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { delayRender } = require("remotion");
    return delayRender("Loading PLY file");
  });

  React.useEffect(() => {
    fetch(PLY_URL)
      .then((res) => res.text())
      .then((text) => {
        setPlyText(text);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { continueRender } = require("remotion");
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Failed to load PLY:", err);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { continueRender } = require("remotion");
        continueRender(handle);
      });
  }, [handle]);

  // Fade in/out
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (!plyText) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: ENRICHMENT_BG,
        }}
      />
    );
  }

  return (
    <div style={{ opacity }}>
      <ThreeCanvas
        width={width}
        height={height}
        style={{ backgroundColor: ENRICHMENT_BG }}
        camera={{ fov: 50, position: [0, 0.6, 4.5], near: 0.01, far: 100 }}
      >
        <PointCloudScene plyText={plyText} />
      </ThreeCanvas>
    </div>
  );
};

export default PointCloudFlythrough;
