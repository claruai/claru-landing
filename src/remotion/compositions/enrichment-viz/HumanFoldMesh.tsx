// ---------------------------------------------------------------------------
// HumanFoldMesh — Renders human-fold-mesh.glb showing a human figure
// performing a fold action, with dramatic lighting and slow orbit.
// Used for the human-to-robot transfer visualization.
// ---------------------------------------------------------------------------

import React, { Suspense, useRef, useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { EnrichmentVizProps } from "./types";
import { ENRICHMENT_BG, ENRICHMENT_ACCENT } from "./types";

// ---------------------------------------------------------------------------
// Model loader
// ---------------------------------------------------------------------------

const MODEL_URL = staticFile("/models/human-fold-mesh.glb");

function HumanModel() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.8 / maxDim;
    clone.scale.setScalar(scale);

    // Apply a subtle material enhancement
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.roughness = 0.6;
          mesh.material.metalness = 0.1;
        }
      }
    });

    return clone;
  }, [scene]);

  // Smooth orbit with slight vertical bob
  const rotY = interpolate(frame, [0, durationInFrames], [0, Math.PI * 1.8]);
  const bob = interpolate(
    Math.sin(frame * 0.025),
    [-1, 1],
    [-0.05, 0.05]
  );

  return (
    <group ref={groupRef} rotation={[0, rotY, 0]} position={[0, bob, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function HumanFoldScene() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const camZ = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [4.5, 3.8, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camY = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [1.0, 1.5, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      <color attach="background" args={[ENRICHMENT_BG]} />
      <perspectiveCamera
        position={[0, camY, camZ]}
        fov={45}
        makeDefault
      />

      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 3]} intensity={0.7} />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.25}
        color={ENRICHMENT_ACCENT}
      />
      <pointLight position={[0, -2, 3]} intensity={0.3} color="#4a90d9" />

      <Suspense fallback={null}>
        <HumanModel />
      </Suspense>

      <gridHelper
        args={[6, 16, "#1a1a18", "#141412"]}
        position={[0, -1.6, 0]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

const HumanFoldMesh: React.FC<EnrichmentVizProps> = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

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
        camera={{ fov: 45, position: [0, 1, 4.5], near: 0.01, far: 100 }}
      >
        <HumanFoldScene />
      </ThreeCanvas>
    </div>
  );
};

export default HumanFoldMesh;
