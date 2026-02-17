// @ts-nocheck - Experimental component with incomplete type definitions from shaders/react
"use client";

import { useEffect, useState, Component, ReactNode } from "react";
import {
  Shader,
  Ascii,
  CRTScreen,
  Godrays,
  SineWave,
  Swirl,
} from "shaders/react";

// Error boundary to catch shader failures
class ShaderErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Shader error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// CSS fallback for when shaders fail
function SectionShaderFallback({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 100% 50%, rgba(146, 176, 144, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 50%, rgba(113, 148, 106, 0.1) 0%, transparent 50%)
          `,
        }}
      />
      {/* Scanline effect */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(146, 176, 144, 0.03) 2px,
            rgba(146, 176, 144, 0.03) 4px
          )`,
        }}
      />
    </div>
  );
}

// Binary matrix ASCII shader for section backgrounds - sage green theme
export function SectionAsciiShader({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [shaderSupported, setShaderSupported] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Check if WebGL is supported
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setShaderSupported(false);
      }
    } catch {
      setShaderSupported(false);
    }
  }, []);

  if (!mounted) return null;

  // Use CSS fallback if WebGL not supported
  if (!shaderSupported) {
    return <SectionShaderFallback className={className} />;
  }

  return (
    <ShaderErrorBoundary
      fallback={<SectionShaderFallback className={className} />}
    >
      <div
        className={`absolute inset-0 overflow-hidden opacity-60 ${className}`}
      >
        <Shader>
          <CRTScreen
            brightness={2.0}
            colorShift={6}
            contrast={1}
            curvature={0}
            pixelSize={1500}
            scaleToFill={0}
            scanlineFrequency={250}
            scanlineIntensity={0.15}
          >
            <Swirl
              blend={92}
              coarseX={50}
              coarseY={50}
              colorA="#050505"
              colorB="#080808"
              detail={1.5}
              fineX={50}
              fineY={50}
              mediumX={50}
              mediumY={50}
            />
            <Ascii
              characters="01010101010101010101010101 "
              fontFamily="JetBrains Mono"
              cellSize={8}
              spacing={0.3}
            >
              <Godrays
                center={{ x: 1, y: 0.5 }}
                density={0.04}
                rayColor="#92B090"
                speed={0.6}
              />
              <SineWave
                amplitude={0.04}
                color="#71946A"
                frequency={0.4}
                position={{ x: 0.5, y: 0 }}
                softness={0.9}
                thickness={0.05}
              />
            </Ascii>
          </CRTScreen>
        </Shader>
      </div>
    </ShaderErrorBoundary>
  );
}
