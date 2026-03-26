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
  "/videos/mosaic/kling-robot.mp4", // Kling-generated robot arm (was annotated-depth-02)
  "/videos/mosaic/mosaic-20.mp4", // varied
  "/videos/mosaic/kling-simlab.mp4", // Kling-generated sim lab (was mosaic-24)
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
// ASCII Edge Decomposition Shader
// ---------------------------------------------------------------------------

/**
 * Create a shared ASCII glyph atlas texture.
 * Characters are arranged in a 16-column grid so the fragment shader can
 * index into them by luminance value.
 */
function createASCIIAtlas(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);

  // ASCII ramp from empty to dense -- 10 characters
  const chars = " .:-=+*#%@";
  const cellSize = size / 16;

  ctx.fillStyle = "#ffffff";
  ctx.font = `${cellSize * 0.8}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < chars.length; i++) {
    const col = i % 16;
    const row = Math.floor(i / 16);
    ctx.fillText(
      chars[i],
      col * cellSize + cellSize / 2,
      row * cellSize + cellSize / 2
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

// Vertex shader -- pass-through with UV coordinates
const ASCII_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader -- renders video in center, dissolves to ASCII at edges
const ASCII_FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D videoTex;
uniform sampler2D asciiAtlas;
uniform float time;
uniform float edgeWidth;       // 0.18 = 18% of tile
uniform float tileOpacity;     // per-tile opacity from distance falloff
uniform vec3 accentColor;      // sage green

varying vec2 vUv;

// --- Noise helpers for organic edge boundary ---
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  // Sample video texture
  vec4 videoColor = texture2D(videoTex, vUv);
  float luminance = dot(videoColor.rgb, vec3(0.299, 0.587, 0.114));

  // Distance from nearest edge (0 at border, 0.5 at center)
  float dx = min(vUv.x, 1.0 - vUv.x);
  float dy = min(vUv.y, 1.0 - vUv.y);
  float edgeDist = min(dx, dy);

  // Organic edge boundary: noise for randomness + sine for breathing
  float breathe = sin(time * 0.5) * 0.02;
  float noiseVal = noise(vUv * 20.0 + time * 0.3) * 0.04;
  float edgeThreshold = edgeWidth + breathe + noiseVal;

  // Transition factor: 0 = full ASCII, 1 = full video
  float t = smoothstep(0.0, edgeThreshold, edgeDist);

  if (t > 0.99) {
    // Center zone -- pure video
    gl_FragColor = vec4(videoColor.rgb, tileOpacity);
  } else {
    // Edge zone -- ASCII characters mapped by video luminance
    float charIndex = floor(luminance * 9.0); // 10 chars in ramp, indices 0-9
    float col = mod(charIndex, 16.0);
    float row = floor(charIndex / 16.0);

    // Map UV into a repeating ASCII character grid across the tile
    vec2 cellUV = fract(vUv * 30.0); // ~30 characters across each axis
    vec2 atlasUV = (vec2(col, row) + cellUV) / 16.0;
    float ascii = texture2D(asciiAtlas, atlasUV).r;

    // ASCII colored in sage green, opacity fades toward outer edge
    float edgeOpacity = (1.0 - t) * 0.7; // max 70% opacity at very edge
    vec3 asciiColor = accentColor * ascii;

    // Blend video and ASCII based on transition factor
    vec3 finalColor = mix(asciiColor, videoColor.rgb, t);
    float finalAlpha = mix(edgeOpacity, 1.0, t) * tileOpacity;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
}
`;

// ---------------------------------------------------------------------------
// VideoPlane -- a single mesh with video texture + ASCII edge shader
// ---------------------------------------------------------------------------

interface VideoPlaneProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  tileOpacity: number;
  asciiAtlas: THREE.CanvasTexture;
}

/** Cached across all tiles -- once we know the shader compiles (or not), skip re-checking */
let shaderCompileOk: boolean | null = null;

function VideoPlane({
  url,
  position,
  rotation,
  tileOpacity,
  asciiAtlas,
}: VideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const [useFallback, setUseFallback] = useState(false);

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

  // Shader uniforms -- stable reference, values mutated in useFrame
  const uniforms = useMemo(
    () => ({
      videoTex: { value: null as THREE.VideoTexture | null },
      asciiAtlas: { value: asciiAtlas },
      time: { value: 0 },
      edgeWidth: { value: 0.18 },
      tileOpacity: { value: tileOpacity },
      accentColor: { value: new THREE.Color(0x92b090) },
    }),
    [asciiAtlas, tileOpacity]
  );

  // Subtle per-tile floating animation + shader time uniform update
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.4 + floatOffset) * 0.04;

    if (!useFallback && shaderCompileOk !== false) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.time.value = t;
        if (texture) {
          mat.uniforms.videoTex.value = texture;
        }
      }

      // One-time shader compile validation on first render with texture
      if (shaderCompileOk === null && texture) {
        try {
          // Access the compiled program -- if diagnostics say not runnable, fall back
          const matAny = mat as unknown as Record<string, unknown>;
          const program = matAny.program as
            | { diagnostics?: { runnable: boolean } }
            | undefined;
          if (program?.diagnostics && !program.diagnostics.runnable) {
            shaderCompileOk = false;
            setUseFallback(true);
          } else if (program) {
            shaderCompileOk = true;
          }
        } catch {
          shaderCompileOk = false;
          setUseFallback(true);
        }
      }
    }
  });

  if (!texture) return null;

  // Fallback: plain meshBasicMaterial if shader compilation failed
  if (useFallback || shaderCompileOk === false) {
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

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[TILE_WIDTH, TILE_HEIGHT]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={ASCII_VERTEX_SHADER}
        fragmentShader={ASCII_FRAGMENT_SHADER}
        transparent
        toneMapped={false}
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
  // Create the ASCII atlas once and share across all tiles
  const asciiAtlas = useMemo(() => createASCIIAtlas(), []);

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
            asciiAtlas={asciiAtlas}
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
