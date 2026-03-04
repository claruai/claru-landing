"use client";

import { useState, useRef, useEffect } from "react";
import { renderSlidesToHTML } from "@/lib/deck-builder/html-renderer";
import type { SlideData } from "@/types/deck-builder";

interface Variation {
  label: string;
  html: string;
}

interface VariationPickerProps {
  variations: Variation[];
  slideIndex: number;
  theme: string;
  onSelect: (html: string) => void;
}

export function VariationPicker({ variations, slideIndex, theme, onSelect }: VariationPickerProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <div className="mt-2 space-y-2">
      <div className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-wider">
        {variations.length} variations for slide {slideIndex + 1}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {variations.map((v, i) => (
          <div
            key={i}
            className={`rounded-lg border overflow-hidden cursor-pointer transition-all ${
              selectedIdx === i
                ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30"
                : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
            }`}
            onClick={() => setSelectedIdx(i)}
          >
            {/* Mini preview */}
            <VariationPreview html={v.html} theme={theme} />
            {/* Label + select */}
            <div className="flex items-center justify-between px-2 py-1.5 bg-[var(--bg-tertiary)]">
              <span className="font-mono text-[10px] text-[var(--text-secondary)] truncate">
                {v.label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(v.html);
                }}
                className="font-mono text-[10px] text-[var(--accent-primary)] hover:underline shrink-0 ml-2"
              >
                [select]
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VariationPreview({ html, theme }: { html: string; theme: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setScale(el.offsetWidth / 1920);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build a minimal slide for rendering
  const slide: SlideData = {
    id: 'preview',
    order: 0,
    layout: 'blank',
    title: '',
    body: '',
    html,
    background: { type: 'solid', value: '#0a0908' },
    metadata: {},
  };

  const fullHtml = renderSlidesToHTML([slide], theme, { showProgress: false });

  return (
    <div ref={containerRef} className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
      <iframe
        srcDoc={fullHtml}
        sandbox="allow-scripts allow-same-origin"
        className="absolute top-0 left-0 border-0 pointer-events-none"
        style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        title="Variation preview"
      />
    </div>
  );
}
