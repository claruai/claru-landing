"use client";

import { useContext } from "react";
import { CalendlyContext } from "../providers/CalendlyProvider";
import type { PublicDataset } from "@/types/data-catalog";

export default function PublicDatasetCard({
  dataset,
}: {
  dataset: PublicDataset;
}) {
  const calendly = useContext(CalendlyContext);

  return (
    <div
      className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 md:p-6 hover:border-[var(--accent-primary)]/30 hover:translate-y-[-2px] transition-all duration-300"
    >
      {/* Category */}
      <span className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider mb-2">
        {dataset.category.name}
      </span>

      {/* Source type badge */}
      {dataset.source_type !== "collected" && (
        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--accent-primary)]/20 text-[var(--accent-primary)]/70 bg-[var(--accent-primary)]/5 w-fit mb-1">
          {dataset.source_type === "synthetic" ? "SYNTHETIC" : "CURATED \u00b7 TRAINING-READY"}
        </span>
      )}

      {/* Name */}
      <h3 className="text-lg font-semibold text-white mb-1">
        {dataset.name}
      </h3>

      {/* Description */}
      {dataset.description && (
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
          {dataset.description}
        </p>
      )}

      {/* Request Access CTA — pushed to bottom */}
      <button
        type="button"
        onClick={() => calendly?.openCalendly()}
        className="mt-auto inline-flex items-center min-h-[44px] font-mono text-xs text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80 transition-colors cursor-pointer"
      >
        Request Access&nbsp;&rarr;
      </button>
    </div>
  );
}
