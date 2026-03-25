"use client";

import { useRef, useCallback } from "react";

interface GlobeInstance {
  destroy: () => void;
}

interface UseGlobeOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  markers?: Array<{ lat: number; lng: number; label: string }>;
}

export function useGlobe({ canvasRef, markers = [] }: UseGlobeOptions) {
  const globeRef = useRef<GlobeInstance | null>(null);

  const init = useCallback(() => {
    // COBE initialization will be implemented in US-007
    if (!canvasRef.current) return;
    void markers; // Will be used in US-007
  }, [canvasRef, markers]);

  const destroy = useCallback(() => {
    globeRef.current?.destroy();
    globeRef.current = null;
  }, []);

  return { init, destroy, globeRef };
}
