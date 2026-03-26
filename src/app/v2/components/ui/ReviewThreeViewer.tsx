"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Loading spinner shown inside the Canvas while assets load
// ---------------------------------------------------------------------------

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#92B090" wireframe />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Point Cloud Viewer (for .ply files)
// ---------------------------------------------------------------------------

function PointCloudScene({ url }: { url: string }) {
  const geometry = useLoader(PLYLoader, url);
  const pointsRef = useRef<THREE.Points>(null);

  const processedGeometry = useMemo(() => {
    const geo = geometry.clone();

    // Compute bounding box from raw positions to center and scale
    geo.computeBoundingBox();
    const bbox = geo.boundingBox!;
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // Shift positions to center
    const positions = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      positions.setXYZ(
        i,
        positions.getX(i) - center.x,
        positions.getY(i) - center.y,
        positions.getZ(i) - center.z
      );
    }
    positions.needsUpdate = true;

    // Scale to fit in a 2-unit cube
    if (maxDim > 0) {
      const scale = 2 / maxDim;
      for (let i = 0; i < positions.count; i++) {
        positions.setXYZ(
          i,
          positions.getX(i) * scale,
          positions.getY(i) * scale,
          positions.getZ(i) * scale
        );
      }
      positions.needsUpdate = true;
    }

    // Ensure vertex colors are in proper 0-1 range
    const colorAttr = geo.getAttribute("color") as THREE.BufferAttribute | null;
    if (colorAttr) {
      let needsNormalization = false;
      for (let i = 0; i < Math.min(colorAttr.count, 100); i++) {
        if (colorAttr.getX(i) > 1.1) {
          needsNormalization = true;
          break;
        }
      }
      if (needsNormalization) {
        for (let i = 0; i < colorAttr.count; i++) {
          colorAttr.setXYZ(
            i,
            colorAttr.getX(i) / 255,
            colorAttr.getY(i) / 255,
            colorAttr.getZ(i) / 255
          );
        }
        colorAttr.needsUpdate = true;
      }
    }

    geo.computeBoundingBox();
    geo.computeBoundingSphere();

    return geo;
  }, [geometry]);

  const hasColors = !!processedGeometry.getAttribute("color");

  return (
    <points ref={pointsRef} geometry={processedGeometry}>
      <pointsMaterial
        size={0.015}
        vertexColors={hasColors}
        color={hasColors ? undefined : "#92B090"}
        sizeAttenuation
      />
    </points>
  );
}

export function PointCloudViewer({
  url,
  height = 300,
}: {
  url: string;
  height?: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "#111110",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #2a2a28",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#111110"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Suspense fallback={<LoadingFallback />}>
          <PointCloudScene url={url} />
        </Suspense>
        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
        />
        {/* Subtle grid for spatial reference */}
        <gridHelper args={[4, 20, "#2a2a28", "#1a1a18"]} position={[0, -1, 0]} />
      </Canvas>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GLB Viewer (for .glb files -- hand mesh, trellis reconstruction, etc.)
// ---------------------------------------------------------------------------

function GLBScene({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Center and scale to fit view
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2 / maxDim;
      clone.scale.multiplyScalar(scale);
    }

    return clone;
  }, [scene]);

  return <primitive object={clonedScene} />;
}

export function GLBViewer({
  url,
  height = 300,
}: {
  url: string;
  height?: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "#111110",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #2a2a28",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#111110"]} />
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <directionalLight position={[-3, -3, 2]} intensity={0.3} />
        <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#444444" />
        <Suspense fallback={<LoadingFallback />}>
          <GLBScene url={url} />
        </Suspense>
        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
        />
        <gridHelper args={[4, 20, "#2a2a28", "#1a1a18"]} position={[0, -1.2, 0]} />
      </Canvas>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default export combining both for dynamic import convenience
// ---------------------------------------------------------------------------

export default function ReviewThreeViewer({
  type,
  url,
  height,
}: {
  type: "pointcloud" | "glb";
  url: string;
  height?: number;
}) {
  if (type === "pointcloud") {
    return <PointCloudViewer url={url} height={height} />;
  }
  return <GLBViewer url={url} height={height} />;
}
