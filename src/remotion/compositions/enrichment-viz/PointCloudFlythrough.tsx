// ---------------------------------------------------------------------------
// PointCloudFlythrough — Renders kitchen-pointcloud.ply as a slowly rotating
// point cloud with a cinematic camera orbit. Uses @remotion/three + R3F.
// ---------------------------------------------------------------------------

import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
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

  // Compute center for centering
  let cx = 0,
    cy = 0,
    cz = 0;
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

  const positions = new Float32Array(rawData.length * 3);
  const colors = new Float32Array(rawData.length * 3);

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
// CameraRig — imperatively moves the camera each frame
// ---------------------------------------------------------------------------

function CameraRig() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { camera } = useThree();

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

  camera.position.set(
    Math.sin(angle) * radius,
    elevation,
    Math.cos(angle) * radius
  );
  camera.lookAt(0, 0, 0);

  return null;
}

// ---------------------------------------------------------------------------
// PointCloudScene
// ---------------------------------------------------------------------------

const PLY_URL = staticFile("/models/kitchen-pointcloud.ply");

function PointCloudScene({ plyText }: { plyText: string }) {
  const frame = useCurrentFrame();

  const geometry = useMemo(() => parsePLYToGeometry(plyText), [plyText]);

  const pointSize = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.012, 0.018]
  );

  return (
    <>
      <CameraRig />
      <color attach="background" args={[ENRICHMENT_BG]} />
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

      <gridHelper
        args={[6, 20, "#1a1a18", "#1a1a18"]}
        position={[0, -1.5, 0]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main composition wrapper
// ---------------------------------------------------------------------------

const PointCloudFlythrough: React.FC<EnrichmentVizProps> = () => {
  const { width, height, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const [plyText, setPlyText] = React.useState<string | null>(null);
  const [handle] = React.useState(() => delayRender("Loading PLY file"));

  React.useEffect(() => {
    fetch(PLY_URL)
      .then((res) => res.text())
      .then((text) => {
        setPlyText(text);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Failed to load PLY:", err);
        continueRender(handle);
      });
  }, [handle]);

  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (!plyText) {
    return (
      <div style={{ width, height, backgroundColor: ENRICHMENT_BG }} />
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
