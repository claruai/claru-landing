"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Video URLs -- diverse mix of raw footage and annotated overlays
// ---------------------------------------------------------------------------

const VIDEO_URLS = [
  // Row 0 (top)
  "/videos/mosaic/mosaic-03.mp4",
  "/videos/mosaic/annotated-depth-02.mp4",
  "/videos/mosaic/mosaic-04.mp4",
  "/videos/mosaic/mosaic-09.mp4",
  "/videos/mosaic/annotated-sensor.mp4",
  "/videos/mosaic/mosaic-16.mp4",
  // Row 1
  "/videos/mosaic/mosaic-05.mp4",
  "/videos/mosaic/annotated-bbox-01.mp4",
  "/videos/mosaic/mosaic-01.mp4",
  "/videos/mosaic/mosaic-game-env.mp4",
  "/videos/mosaic/annotated-seg-01.mp4",
  "/videos/mosaic/mosaic-11.mp4",
  // Row 2
  "/videos/mosaic/mosaic-driving.mp4",
  "/videos/mosaic/kling-robot.mp4",
  "/videos/mosaic/annotated-depth-01.mp4",
  "/videos/mosaic/mosaic-teleop.mp4",
  "/videos/mosaic/mosaic-12.mp4",
  "/videos/mosaic/robot-arm.mp4",
  // Row 3 (bottom)
  "/videos/mosaic/mosaic-17.mp4",
  "/videos/mosaic/annotated-bbox-02.mp4",
  "/videos/mosaic/kling-simlab.mp4",
  "/videos/mosaic/mosaic-20.mp4",
  "/videos/mosaic/vla-telemetry.mp4",
  "/videos/mosaic/mosaic-15.mp4",
];

// ---------------------------------------------------------------------------
// Dense 6x4 tile wall — tight gaps, variable sizes
// ---------------------------------------------------------------------------

type TileSize = "sm" | "md" | "lg";

interface TileLayout {
  col: number;
  row: number;
  size: TileSize;
}

const COLS = 6;
const ROWS = 4;

const TILE_LAYOUTS: TileLayout[] = [
  // Row 0: [SM] [SM] [MD] [SM] [SM] [SM]
  { col: 0, row: 0, size: "sm" },
  { col: 1, row: 0, size: "sm" },
  { col: 2, row: 0, size: "md" },
  { col: 3, row: 0, size: "sm" },
  { col: 4, row: 0, size: "sm" },
  { col: 5, row: 0, size: "sm" },
  // Row 1: [SM] [MD] [LG] [LG] [MD] [SM]
  { col: 0, row: 1, size: "sm" },
  { col: 1, row: 1, size: "md" },
  { col: 2, row: 1, size: "lg" },
  { col: 3, row: 1, size: "lg" },
  { col: 4, row: 1, size: "md" },
  { col: 5, row: 1, size: "sm" },
  // Row 2: [SM] [LG] [MD] [MD] [LG] [SM]
  { col: 0, row: 2, size: "sm" },
  { col: 1, row: 2, size: "lg" },
  { col: 2, row: 2, size: "md" },
  { col: 3, row: 2, size: "md" },
  { col: 4, row: 2, size: "lg" },
  { col: 5, row: 2, size: "sm" },
  // Row 3: [SM] [SM] [MD] [SM] [SM] [SM]
  { col: 0, row: 3, size: "sm" },
  { col: 1, row: 3, size: "sm" },
  { col: 2, row: 3, size: "md" },
  { col: 3, row: 3, size: "sm" },
  { col: 4, row: 3, size: "sm" },
  { col: 5, row: 3, size: "sm" },
];

const TILE_DIMENSIONS: Record<TileSize, [number, number]> = {
  sm: [1.1, 0.7],
  md: [1.4, 0.9],
  lg: [1.7, 1.1],
};

const GAP_X = 1.55;
const GAP_Y = 1.15;

// Pre-compute tile positions + variations with a stable seed
interface TileConfig {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  opacity: number;
  width: number;
  height: number;
  edgeWidth: number; // dissolution width — more aggressive for outer tiles
  size: TileSize;
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

  for (let i = 0; i < TILE_LAYOUTS.length; i++) {
    if (i >= VIDEO_URLS.length) break;

    const layout = TILE_LAYOUTS[i];
    const [w, h] = TILE_DIMENSIONS[layout.size];

    const x = layout.col * GAP_X - centerX;
    const y = (ROWS - 1 - layout.row) * GAP_Y - centerY;
    const z = (rand() - 0.5) * 1.2; // depth variation

    const rotX = (rand() - 0.5) * 0.08; // slight random tilt
    const rotY = (rand() - 0.5) * 0.08;

    // Distance from center for opacity falloff + edge dissolution
    const dist = Math.sqrt(x * x + y * y);
    const normalizedDist = maxDist > 0 ? dist / maxDist : 0;
    const opacity = THREE.MathUtils.clamp(1.0 - normalizedDist * 0.6, 0.3, 1.0);

    // Edge dissolution: center tiles show more video, outer tiles dissolve heavily
    const edgeWidth = THREE.MathUtils.lerp(0.18, 0.42, normalizedDist);

    configs.push({
      url: VIDEO_URLS[i],
      position: [x, y, z],
      rotation: [rotX, rotY, 0],
      opacity,
      width: w,
      height: h,
      edgeWidth,
      size: layout.size,
    });
  }

  return configs;
}

// ---------------------------------------------------------------------------
// ASCII Edge Decomposition Shader (enhanced)
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

// Fragment shader -- renders video with sage green tint, dissolves to ASCII at edges
// Enhanced: color tinting, stronger glow emission, distance-based dissolution
const ASCII_FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D videoTex;
uniform sampler2D asciiAtlas;
uniform float time;
uniform float edgeWidth;       // per-tile dissolution width (distance-based)
uniform float tileOpacity;     // per-tile opacity from distance falloff
uniform vec3 accentColor;      // sage green
uniform float colorTintStrength; // 0.0 - 1.0, how much sage green tint

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

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Rounded rectangle SDF — returns 0 at rounded border, positive inside
float roundedRectDist(vec2 uv, vec2 halfSize, float radius) {
  vec2 d = abs(uv - 0.5) - halfSize + radius;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
}

void main() {
  // Sample video texture
  vec4 videoColor = texture2D(videoTex, vUv);
  float luminance = dot(videoColor.rgb, vec3(0.299, 0.587, 0.114));

  // Apply sage green color tint to unify all tiles
  vec3 tintedColor = mix(videoColor.rgb, videoColor.rgb * accentColor * 2.5, colorTintStrength);
  tintedColor *= 1.15;

  // --- Rounded rectangle distance field ---
  // The "clean video" zone is an inner rounded rect, much smaller than the tile
  // cornerRadius controls how rounded the inner shape is (higher = more pill-like)
  float cornerRadius = 0.12;
  // Shrink the inner rect so there's a wide dissolution border
  float innerShrink = edgeWidth * 1.2; // dissolution eats into the tile substantially
  vec2 halfSize = vec2(0.5 - innerShrink, 0.5 - innerShrink);
  float sdf = -roundedRectDist(vUv, halfSize, cornerRadius);
  // sdf > 0 inside the rounded rect, < 0 outside

  // Organic edge: FBM noise warps the boundary + breathing animation
  float breathe = sin(time * 0.4) * 0.025;
  float noiseVal = fbm(vUv * 10.0 + time * 0.15) * 0.08;
  sdf += noiseVal + breathe;

  // Horizontal glitch distortion lines
  float glitchLine = step(0.97, sin(vUv.y * 180.0 + time * 2.5)) * 0.035;
  sdf -= glitchLine;

  // Transition: wide band from full-ASCII to full-video
  // The dissolution zone spans from sdf = -0.06 (outer, all ASCII) to sdf = +0.06 (inner, all video)
  float dissolveBand = 0.08;
  float t = smoothstep(-dissolveBand, dissolveBand, sdf);

  // --- ASCII rendering for the dissolution zone ---
  float charIndex = floor(luminance * 9.0);
  float col = mod(charIndex, 16.0);
  float row = floor(charIndex / 16.0);
  vec2 cellUV = fract(vUv * 30.0);
  vec2 atlasUV = (vec2(col, row) + cellUV) / 16.0;
  float ascii = texture2D(asciiAtlas, atlasUV).r;

  // ASCII color with flowing brightness
  float flowBrightness = 0.6 + 0.4 * sin(vUv.y * 12.0 - time * 1.2 + vUv.x * 6.0);
  vec3 asciiColor = accentColor * ascii * flowBrightness;

  // ASCII glow halo
  float asciiGlow = smoothstep(0.0, 0.5, ascii) * 0.25;
  asciiColor += accentColor * asciiGlow;

  // --- Compose final pixel ---
  // Video center gets bloom-friendly glow boost
  float glowBoost = smoothstep(0.4, 0.9, luminance) * 0.3;
  vec3 videoFinal = tintedColor + accentColor * glowBoost;

  // Blend: ASCII outside, video inside, smooth crossfade in between
  vec3 finalColor = mix(asciiColor, videoFinal, t);

  // Alpha: ASCII zone fades out toward tile edge, video zone is full opacity
  float edgeAlpha = (1.0 - t) * 0.8;
  float finalAlpha = mix(edgeAlpha, 1.0, t) * tileOpacity;

  // Fade to zero at the very outer boundary of the tile
  float outerFade = smoothstep(-0.2, -0.02, sdf - noiseVal);
  finalAlpha *= outerFade;

  // Scanline effect — stronger in dissolution zone
  float scanline = sin(vUv.y * 350.0) * 0.5 + 0.5;
  finalColor *= mix(0.85, 1.0, scanline * t + (1.0 - t) * 0.4);

  gl_FragColor = vec4(finalColor, finalAlpha);
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
  width: number;
  height: number;
  edgeWidth: number;
  asciiAtlas: THREE.CanvasTexture;
}

/** Cached across all tiles -- once we know the shader compiles (or not), skip re-checking */
let shaderCompileOk: boolean | null = null;

function VideoPlane({
  url,
  position,
  rotation,
  tileOpacity,
  width,
  height,
  edgeWidth,
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
      edgeWidth: { value: edgeWidth },
      tileOpacity: { value: tileOpacity },
      accentColor: { value: new THREE.Color(0x92b090) },
      colorTintStrength: { value: 0.25 }, // 25% sage green tint on all tiles
    }),
    [asciiAtlas, tileOpacity, edgeWidth]
  );

  // Subtle per-tile floating animation + shader time uniform update
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Floating animation -- slightly more pronounced
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.35 + floatOffset) * 0.06;
    // Subtle z-breathing
    meshRef.current.position.z =
      position[2] + Math.sin(t * 0.2 + floatOffset * 0.7) * 0.04;

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
        <planeGeometry args={[width, height]} />
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
      <planeGeometry args={[width, height]} />
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
// FloorReflection -- mirror-like reflection plane below the grid
// ---------------------------------------------------------------------------

function FloorReflection({
  tileConfigs,
  asciiAtlas,
}: {
  tileConfigs: TileConfig[];
  asciiAtlas: THREE.CanvasTexture;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Only reflect the 8 center tiles to limit video element count
  const centerTiles = tileConfigs.filter((_, i) => {
    const layout = TILE_LAYOUTS[i];
    return layout && layout.col >= 1 && layout.col <= 4 && layout.row >= 1 && layout.row <= 2;
  });

  return (
    <group
      ref={groupRef}
      position={[0, -3.2, 0]}
      scale={[1, -0.35, 1]}
    >
      {centerTiles.map((cfg, i) => (
        <VideoPlane
          key={`reflection-${i}`}
          url={cfg.url}
          position={cfg.position}
          rotation={cfg.rotation}
          tileOpacity={cfg.opacity * 0.12}
          width={cfg.width}
          height={cfg.height}
          edgeWidth={cfg.edgeWidth + 0.18}
          asciiAtlas={asciiAtlas}
        />
      ))}
      <mesh position={[0, 0, 0.5]}>
        <planeGeometry args={[20, 6]} />
        <meshBasicMaterial
          color={0x0a0908}
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Atmospheric particles -- tiny sage-green dots floating in the scene
// ---------------------------------------------------------------------------

function AtmosphericParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const [positions, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const opac = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      opac[i] = Math.random() * 0.3 + 0.1;
    }
    return [pos, opac];
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      // Gentle drift
      posArray[i * 3 + 1] += Math.sin(t * 0.2 + i * 0.5) * 0.001;
      posArray[i * 3] += Math.cos(t * 0.15 + i * 0.3) * 0.0005;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0x92b090}
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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
      mouse.current.x * 0.06,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.current.y * -0.04,
      0.04
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

      {/* Atmospheric exponential fog for depth haze */}
      <fogExp2 attach="fog" args={[0x0a0908, 0.06]} />

      <MouseParallaxGroup>
        {/* Main tile grid */}
        {tileConfigs.map((cfg, i) => (
          <VideoPlane
            key={i}
            url={cfg.url}
            position={cfg.position}
            rotation={cfg.rotation}
            tileOpacity={cfg.opacity}
            width={cfg.width}
            height={cfg.height}
            edgeWidth={cfg.edgeWidth}
            asciiAtlas={asciiAtlas}
          />
        ))}

        {/* Floor reflection below the grid */}
        <FloorReflection tileConfigs={tileConfigs} asciiAtlas={asciiAtlas} />

        {/* Atmospheric particles floating in the scene */}
        <AtmosphericParticles />
      </MouseParallaxGroup>

      {/* Post-processing: aggressive bloom for glow halos */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.6}
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
      camera={{ position: [0, 0, 7.5], fov: 60 }}
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
    >
      <FPSLimiter fps={30} />
      <Scene />
    </Canvas>
  );
}
