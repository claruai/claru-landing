"use client";

interface EnrichmentOverlayProps {
  mode: "raw" | "depth" | "pose" | "segmentation" | "all";
  className?: string;
}

export default function EnrichmentOverlay({ mode, className }: EnrichmentOverlayProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className ?? ""}`}>
      <div className="flex h-full items-center justify-center bg-[var(--bg-card)] p-8">
        <span className="font-mono text-sm text-white/40">
          [{mode.toUpperCase()}] overlay — placeholder
        </span>
      </div>
    </div>
  );
}
