// ---------------------------------------------------------------------------
// TrellisReconstruction — Renders kitchen-trellis.glb as a 3D reconstruction
// with a slow orbit camera showing the reconstructed environment from all
// angles. Includes subtle accent-colored edge highlighting.
// ---------------------------------------------------------------------------

import React, { Suspense, useRef, useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { EnrichmentVizProps } from "./types";
import { ENRICHMENT_BG, ENRICHMENT_ACCENT } from "./types";

// ---------------------------------------------------------------------------
// CameraRig
// ---------------------------------------------------------------------------

function CameraRig() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { camera } = useThree();

  const camZ = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [5, 4, 5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camY = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [1.5, 2.0, 1.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  camera.position.set(0, camY, camZ);
  camera.lookAt(0, 0, 0);

  return null;
}

// ---------------------------------------------------------------------------
// TrellisModel
// ---------------------------------------------------------------------------

const TRELLIS_URL = staticFile("/models/kitchen-trellis.glb");

function TrellisModel() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { scene } = useGLTF(TRELLIS_URL);
  const groupRef = useRef<THREE.Group>(null);

  const { clonedScene, edgeGeometries } = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 3.0 / maxDim;
    clone.scale.setScalar(s);

    const edges: THREE.EdgesGeometry[] = [];
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        edges.push(new THREE.EdgesGeometry((child as THREE.Mesh).geometry, 30));
      }
    });

    return { clonedScene: clone, edgeGeometries: edges };
  }, [scene]);

  const rotY = interpolate(frame, [0, durationInFrames], [0, Math.PI * 2]);
  const tilt = interpolate(
    frame,
    [0, durationInFrames * 0.25, durationInFrames * 0.75, durationInFrames],
    [0.1, 0.3, -0.1, 0.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const edgeOpacity = interpolate(
    frame,
    [
      0,
      durationInFrames * 0.15,
      durationInFrames * 0.4,
      durationInFrames * 0.85,
      durationInFrames,
    ],
    [0, 0.35, 0.2, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <group ref={groupRef} rotation={[tilt, rotY, 0]}>
      <primitive object={clonedScene} />
      {edgeGeometries.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial
            color={ENRICHMENT_ACCENT}
            transparent
            opacity={edgeOpacity}
            depthTest={false}
          />
        </lineSegments>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function TrellisScene() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={[ENRICHMENT_BG]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 3]} intensity={0.7} />
      <directionalLight
        position={[-3, 3, -2]}
        intensity={0.3}
        color={ENRICHMENT_ACCENT}
      />
      <pointLight position={[0, -1, 4]} intensity={0.2} color="#4a90d9" />

      <Suspense fallback={null}>
        <TrellisModel />
      </Suspense>

      <gridHelper
        args={[8, 16, "#1a1a18", "#141412"]}
        position={[0, -1.8, 0]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

const TrellisReconstruction: React.FC<EnrichmentVizProps> = () => {
  const { width, height, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ opacity }}>
      <ThreeCanvas
        width={width}
        height={height}
        style={{ backgroundColor: ENRICHMENT_BG }}
        camera={{ fov: 50, position: [0, 1.5, 5], near: 0.01, far: 100 }}
      >
        <TrellisScene />
      </ThreeCanvas>
    </div>
  );
};

export default TrellisReconstruction;
