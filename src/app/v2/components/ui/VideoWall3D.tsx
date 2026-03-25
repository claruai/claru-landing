"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Video URLs -- diverse mix of raw footage and annotated overlays
// ---------------------------------------------------------------------------

const VIDEO_URLS = [
  "/videos/mosaic/mosaic-01.mp4", // egocentric cooking
  "/videos/mosaic/annotated-bbox-01.mp4", // with bounding boxes
  "/videos/mosaic/annotated-depth-01.mp4", // depth map colored
  "/videos/mosaic/mosaic-game-env.mp4", // game env
  "/videos/mosaic/mosaic-driving.mp4", // driving
  "/videos/mosaic/mosaic-teleop.mp4", // teleop/robotics
  "/videos/mosaic/annotated-seg-01.mp4", // segmentation
  "/videos/mosaic/mosaic-12.mp4", // varied egocentric
  "/videos/mosaic/annotated-bbox-02.mp4", // more bbox
  "/videos/mosaic/annotated-depth-02.mp4", // more depth
  "/videos/mosaic/mosaic-20.mp4", // varied
  "/videos/mosaic/mosaic-24.mp4", // varied
];

// ---------------------------------------------------------------------------
// Grid layout configuration
// ---------------------------------------------------------------------------

const COLS = 4;
const ROWS = 3;
const TILE_WIDTH = 2.0;
const TILE_HEIGHT = 1.2; // ~16:9 aspect
const GAP_X = 2.3;
const GAP_Y = 1.5;

// Pre-compute tile positions + variations with a stable seed
interface TileConfig {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  opacity: number;
}

function buildTileConfigs(): TileConfig[] {
  const configs: TileConfig[] = [];
  const centerX = ((COLS - 1) * GAP_X) / 2;
  const centerY = ((ROWS - 1) * GAP_Y) / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

  // Seeded pseudo-random for deterministic layout
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      if (idx >= VIDEO_URLS.length) break;

      const x = col * GAP_X - centerX;
      const y = (ROWS - 1 - row) * GAP_Y - centerY; // flip Y so row 0 is top
      const z = (rand() - 0.5) * 0.6; // +/- 0.3 depth variation

      const rotX = (rand() - 0.5) * 0.07; // +/- ~2 degrees
      const rotY = (rand() - 0.5) * 0.07;

      // Distance from center for opacity falloff
      const dx = x;
      const dy = y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normalizedDist = maxDist > 0 ? dist / maxDist : 0;
      const opacity = THREE.MathUtils.clamp(1.0 - normalizedDist * 0.55, 0.35, 1.0);

      configs.push({
        url: VIDEO_URLS[idx],
        position: [x, y, z],
        rotation: [rotX, rotY, 0],
        opacity,
      });
    }
  }

  return configs;
}

// ---------------------------------------------------------------------------
// VideoPlane -- a single mesh with a video texture
// ---------------------------------------------------------------------------

interface VideoPlaneProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  tileOpacity: number;
}

function VideoPlane({ url, position, rotation, tileOpacity }: VideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = url;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    // Stagger playback start to reduce simultaneous decode
    const delay = Math.random() * 2000;
    const timeout = setTimeout(() => {
      video.play().catch(() => {
        // Autoplay blocked -- degrade silently
      });
    }, delay);

    videoRef.current = video;

    const tex = new THREE.VideoTexture(video);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.format = THREE.RGBAFormat;
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);

    return () => {
      clearTimeout(timeout);
      video.pause();
      video.removeAttribute("src");
      video.load(); // release resources
      tex.dispose();
    };
  }, [url]);

  // Subtle per-tile floating animation
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.4 + floatOffset) * 0.04;
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[TILE_WIDTH, TILE_HEIGHT]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        transparent
        opacity={tileOpacity}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// MouseParallaxGroup -- rotates children based on normalized mouse position
// ---------------------------------------------------------------------------

function MouseParallaxGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e: PointerEvent) => {
    // Normalize to -1..1
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.current.x * 0.05,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.current.y * -0.03,
      0.05
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

// ---------------------------------------------------------------------------
// Scene -- inner R3F scene content
// ---------------------------------------------------------------------------

function Scene() {
  const tileConfigs = useMemo(() => buildTileConfigs(), []);

  return (
    <>
      {/* Ambient light so videos show true color */}
      <ambientLight intensity={1} />

      <MouseParallaxGroup>
        {tileConfigs.map((cfg, i) => (
          <VideoPlane
            key={i}
            url={cfg.url}
            position={cfg.position}
            rotation={cfg.rotation}
            tileOpacity={cfg.opacity}
          />
        ))}
      </MouseParallaxGroup>

      {/* Post-processing: subtle bloom for glow */}
      <EffectComposer>
        <Bloom
          intensity={0.3}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ---------------------------------------------------------------------------
// FPSLimiter -- caps frame rate to reduce GPU usage
// ---------------------------------------------------------------------------

function FPSLimiter({ fps }: { fps: number }) {
  const { invalidate, clock } = useThree();
  const lastTime = useRef(0);

  useFrame(() => {
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastTime.current >= 1 / fps) {
      lastTime.current = elapsed;
      invalidate();
    }
  });

  return null;
}

// ---------------------------------------------------------------------------
// VideoWall3D -- public component
// ---------------------------------------------------------------------------

export default function VideoWall3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      // On-demand rendering capped by FPSLimiter -- but video textures
      // need continuous updates, so we keep the default "always" frameloop
    >
      <FPSLimiter fps={30} />
      <Scene />
    </Canvas>
  );
}
