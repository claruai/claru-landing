// ---------------------------------------------------------------------------
// TrellisReconstruction — Renders kitchen-trellis.glb as a 3D reconstruction
// with a slow orbit camera showing the reconstructed environment from all
// angles. Includes subtle scan-line overlay and accent-colored edges.
// ---------------------------------------------------------------------------

import React, { Suspense, useRef, useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { EnrichmentVizProps } from "./types";
import { ENRICHMENT_BG, ENRICHMENT_ACCENT } from "./types";

// ---------------------------------------------------------------------------
// TrellisModel — loads the GLB, centers it, adds edge highlighting
// ---------------------------------------------------------------------------

const TRELLIS_URL = staticFile("/models/kitchen-trellis.glb");

function TrellisModel() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { scene } = useGLTF(TRELLIS_URL);
  const groupRef = useRef<THREE.Group>(null);

  const { clonedScene, edgeGeometries } = useMemo(() => {
    const clone = scene.clone(true);

    // Center and scale
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3.0 / maxDim;
    clone.scale.setScalar(scale);

    // Collect edge geometries for wireframe overlay
    const edges: { geometry: THREE.EdgesGeometry; matrix: THREE.Matrix4 }[] = [];
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const edgeGeo = new THREE.EdgesGeometry(mesh.geometry, 30);
        edges.push({
          geometry: edgeGeo,
          matrix: mesh.matrixWorld.clone(),
        });
      }
    });

    return { clonedScene: clone, edgeGeometries: edges };
  }, [scene]);

  // Smooth orbit
  const rotY = interpolate(frame, [0, durationInFrames], [0, Math.PI * 2]);
  const tilt = interpolate(
    frame,
    [0, durationInFrames * 0.25, durationInFrames * 0.75, durationInFrames],
    [0.1, 0.3, -0.1, 0.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Edge visibility — slowly reveal then fade
  const edgeOpacity = interpolate(
    frame,
    [0, durationInFrames * 0.15, durationInFrames * 0.4, durationInFrames * 0.85, durationInFrames],
    [0, 0.35, 0.2, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <group ref={groupRef} rotation={[tilt, rotY, 0]}>
      {/* Main reconstructed model */}
      <primitive object={clonedScene} />

      {/* Edge highlight overlay */}
      {edgeGeometries.map((edge, i) => (
        <lineSegments key={i} geometry={edge.geometry}>
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
// Scene — environment + lighting
// ---------------------------------------------------------------------------

function TrellisScene() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Camera slowly changes distance
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

  return (
    <>
      <color attach="background" args={[ENRICHMENT_BG]} />
      <perspectiveCamera
        position={[0, camY, camZ]}
        fov={50}
        makeDefault
      />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 3]} intensity={0.7} />
      <directionalLight
        position={[-3, 3, -2]}
        intensity={0.3}
        color={ENRICHMENT_ACCENT}
      />
      <pointLight position={[0, -1, 4]} intensity={0.2} color="#4a90d9" />

      {/* Subtle environment for reflections */}
      <Environment preset="night" environmentIntensity={0.1} />

      <Suspense fallback={null}>
        <TrellisModel />
      </Suspense>

      {/* Ground plane */}
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
        camera={{ fov: 50, position: [0, 1.5, 5], near: 0.01, far: 100 }}
      >
        <TrellisScene />
      </ThreeCanvas>
    </div>
  );
};

export default TrellisReconstruction;
