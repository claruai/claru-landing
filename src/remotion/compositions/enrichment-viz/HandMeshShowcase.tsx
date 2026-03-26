// ---------------------------------------------------------------------------
// HandMeshShowcase — Renders hand-mesh.glb with dramatic lighting, slow orbit,
// and a subtle wireframe overlay to highlight the mesh topology.
// ---------------------------------------------------------------------------

import React, { Suspense, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { EnrichmentVizProps } from "./types";
import { ENRICHMENT_BG, ENRICHMENT_ACCENT } from "./types";

// ---------------------------------------------------------------------------
// HandModel — loads the GLB and renders solid + wireframe overlay
// ---------------------------------------------------------------------------

const HAND_URL = staticFile("/models/hand-mesh.glb");

function HandModel() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { scene } = useGLTF(HAND_URL);
  const groupRef = useRef<THREE.Group>(null);

  // Compute bounding box and center the model
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    // Scale to fit within a reasonable viewport
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.5 / maxDim;
    clone.scale.setScalar(scale);

    return clone;
  }, [scene]);

  // Slow rotation
  const rotY = interpolate(frame, [0, durationInFrames], [0, Math.PI * 1.5]);
  const rotX = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [-0.15, 0.15]
  );

  // Wireframe pulse opacity
  const wireOpacity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.15, 0.4]
  );

  return (
    <group ref={groupRef} rotation={[rotX, rotY, 0]}>
      {/* Main mesh */}
      <primitive object={clonedScene} />

      {/* Wireframe overlay — traverse all meshes and add wireframe */}
      {clonedScene.children.map((child, i) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          return (
            <mesh key={i} geometry={mesh.geometry} position={mesh.position} rotation={mesh.rotation} scale={mesh.scale}>
              <meshBasicMaterial
                wireframe
                color={ENRICHMENT_ACCENT}
                transparent
                opacity={wireOpacity}
                depthTest={false}
              />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene — lighting + camera animation
// ---------------------------------------------------------------------------

function HandScene() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Camera slowly pulls back
  const camZ = interpolate(
    frame,
    [0, durationInFrames],
    [3.5, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camY = interpolate(
    Math.sin(frame * 0.015),
    [-1, 1],
    [0.3, 0.8]
  );

  return (
    <>
      <color attach="background" args={[ENRICHMENT_BG]} />
      <perspectiveCamera
        position={[0, camY, camZ]}
        fov={45}
        makeDefault
      />

      {/* Three-point lighting for dramatic look */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={0.8}
        color="#ffffff"
      />
      <directionalLight
        position={[-3, 2, -1]}
        intensity={0.3}
        color={ENRICHMENT_ACCENT}
      />
      <pointLight
        position={[0, -2, 3]}
        intensity={0.4}
        color="#4a90d9"
      />

      <Suspense fallback={null}>
        <HandModel />
      </Suspense>

      {/* Floor reflection hint */}
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
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in/out
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
