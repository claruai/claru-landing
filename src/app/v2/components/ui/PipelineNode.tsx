"use client";

interface PipelineNodeProps {
  label: string;
  active?: boolean;
}

export default function PipelineNode({ label, active = false }: PipelineNodeProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded border px-4 py-2 font-mono text-sm transition-all ${
        active
          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-[0_0_12px_var(--accent-glow)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-white/60"
      }`}
    >
      <span className={active ? "animate-pulse" : ""}>{active ? "▶" : "○"}</span>
      <span>{label}</span>
    </div>
  );
}
