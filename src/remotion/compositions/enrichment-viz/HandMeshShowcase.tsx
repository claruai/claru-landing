// ---------------------------------------------------------------------------
// HandMeshShowcase — Renders hand-mesh.glb with dramatic lighting, slow orbit,
// and a subtle wireframe overlay to highlight the mesh topology.
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
    [0, durationInFrames],
    [3.5, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camY = interpolate(Math.sin(frame * 0.015), [-1, 1], [0.3, 0.8]);

  camera.position.set(0, camY, camZ);
  camera.lookAt(0, 0, 0);

  return null;
}

// ---------------------------------------------------------------------------
// HandModel
// ---------------------------------------------------------------------------

const HAND_URL = staticFile("/models/hand-mesh.glb");

function HandModel() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { scene } = useGLTF(HAND_URL);
  const groupRef = useRef<THREE.Group>(null);

  const { clonedScene, wireframeMeshes } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 2.5 / maxDim;
    clone.scale.setScalar(s);

    // Collect mesh geometries for wireframe overlay
    const meshes: THREE.BufferGeometry[] = [];
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push((child as THREE.Mesh).geometry);
      }
    });

    return { clonedScene: clone, wireframeMeshes: meshes };
  }, [scene]);

  const rotY = interpolate(frame, [0, durationInFrames], [0, Math.PI * 1.5]);
  const rotX = interpolate(Math.sin(frame * 0.02), [-1, 1], [-0.15, 0.15]);

  const wireOpacity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.15, 0.4]
  );

  return (
    <group ref={groupRef} rotation={[rotX, rotY, 0]}>
      <primitive object={clonedScene} />
      {wireframeMeshes.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial
            wireframe
            color={ENRICHMENT_ACCENT}
            transparent
            opacity={wireOpacity}
            depthTest={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function HandScene() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={[ENRICHMENT_BG]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 4, 2]} intensity={0.8} color="#ffffff" />
      <directionalLight
        position={[-3, 2, -1]}
        intensity={0.3}
        color={ENRICHMENT_ACCENT}
      />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#4a90d9" />

      <Suspense fallback={null}>
        <HandModel />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color={ENRICHMENT_BG}
          transparent
          opacity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

const HandMeshShowcase: React.FC<EnrichmentVizProps> = () => {
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
        camera={{ fov: 45, position: [0, 0.5, 4], near: 0.01, far: 100 }}
      >
        <HandScene />
      </ThreeCanvas>
    </div>
  );
};

export default HandMeshShowcase;
