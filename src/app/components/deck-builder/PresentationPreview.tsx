"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import type { SlideData, SlideThemeCustom } from "@/types/deck-builder";
import { renderSlidesToHTML } from "@/lib/deck-builder/html-renderer";
import { rewriteS3ToProxy } from "@/lib/deck-builder/rewrite-s3-urls";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PresentationPreviewProps {
  slides: SlideData[];
  theme: string;
  customTheme?: SlideThemeCustom | null;
  selectedIndex: number;
  templateId: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Check if a slide's HTML needs iframe isolation (contains scripts or is a full document).
 */
function needsIframeIsolation(slide: SlideData): boolean {
  if (!slide.html) return false;
  return slide.html.includes('<script') || slide.html.includes('<!DOCTYPE') || slide.html.includes('<html');
}

export function PresentationPreview({
  slides,
  theme,
  customTheme,
  selectedIndex,
  templateId,
}: PresentationPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [srcdoc, setSrcdoc] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(0.2);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track a "generation epoch" to drive the debounced rebuild without
  // calling setState synchronously in useEffect (satisfies
  // react-hooks/set-state-in-effect).
  const [generationEpoch, setGenerationEpoch] = useState(0);

  // Check if current slide needs server-rendered iframe
  const selectedSlide = slides[selectedIndex];
  const useServerRoute = selectedSlide && needsIframeIsolation(selectedSlide);

  /* ---- Bump epoch whenever inputs change -------------------------- */
  const prevDepsRef = useRef({ slides, theme, customTheme });
  if (
    prevDepsRef.current.slides !== slides ||
    prevDepsRef.current.theme !== theme ||
    prevDepsRef.current.customTheme !== customTheme
  ) {
    prevDepsRef.current = { slides, theme, customTheme };
    // React batches state updates during render; this avoids the
    // "setState in useEffect" lint issue by running during render.
    setGenerationEpoch((e) => e + 1);
    setIsGenerating(true);
  }

  /* ---- Debounced HTML generation ---------------------------------- */
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const html = renderSlidesToHTML(slides, theme, {
        showProgress: true,
        customTheme,
      });
      setSrcdoc(rewriteS3ToProxy(html));
      setIsGenerating(false);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generationEpoch]);

  /* ---- Navigate to selected slide in iframe ----------------------- */
  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !srcdoc) return;

    // Small delay to let iframe load before posting message
    const timer = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "goToSlide", index: selectedIndex },
        "*"
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedIndex, srcdoc]);

  /* ---- Calculate scale based on container width ------------------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        const newScale = containerWidth / 1920;
        setScale(newScale);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  /* ---- Force refresh ---------------------------------------------- */
  const handleRefresh = useCallback(() => {
    setIsGenerating(true);
    // Clear debounce and regenerate immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const html = renderSlidesToHTML(slides, theme, {
      showProgress: true,
      customTheme,
    });
    setSrcdoc(rewriteS3ToProxy(html));
    setIsGenerating(false);
  }, [slides, theme, customTheme]);

  /* ---- Render ----------------------------------------------------- */
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)]">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          preview
        </span>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-150"
          title="Refresh Preview"
        >
          <RefreshCw className="w-3 h-3" />
          refresh
        </button>
      </div>

      {/* Preview container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative bg-[var(--bg-primary)]"
      >
        {isGenerating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]/80">
            <span className="font-mono text-xs text-[var(--text-muted)] animate-pulse">
              Generating preview...
            </span>
          </div>
        )}

        {useServerRoute ? (
          /* Server-rendered iframe for slides with scripts or full HTML documents */
          <div
            className="origin-top-left"
            style={{
              width: 1920,
              height: 1080,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <iframe
              key={`server-${selectedIndex}`}
              src={`/api/slide/${templateId}/${selectedIndex}`}
              sandbox="allow-scripts allow-same-origin"
              title="Slide Preview"
              className="w-full h-full border-0"
              style={{ width: 1920, height: 1080 }}
            />
          </div>
        ) : srcdoc ? (
          /* srcdoc for simple layout slides (instant feedback) */
          <div
            className="origin-top-left"
            style={{
              width: 1920,
              height: 1080,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={srcdoc}
              sandbox="allow-scripts allow-same-origin"
              title="Slide Preview"
              className="w-full h-full border-0"
              style={{ width: 1920, height: 1080 }}
            />
          </div>
        ) : null}
      </div>

      {/* Slide indicator */}
      <div className="px-3 py-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          slide {selectedIndex + 1} / {slides.length}
        </span>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
}
