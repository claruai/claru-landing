"use client";

import Link from "next/link";
import type { OSSDataset } from "@/types/oss-datasets";
import { formatCount } from "@/app/lib/utils";

interface OSSDatasetCardProps {
  dataset: OSSDataset;
  onCompareToggle?: (slug: string) => void;
  isSelected?: boolean;
}

export default function OSSDatasetCard({
  dataset,
  onCompareToggle,
  isSelected = false,
}: OSSDatasetCardProps) {
  const maxTags = 4;
  const visibleMods = dataset.modalities.slice(0, maxTags);
  const extraCount = dataset.modalities.length - maxTags;

  return (
    <div className="group relative rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
      {/* Compare checkbox */}
      {onCompareToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompareToggle(dataset.slug);
          }}
          className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded border transition-colors ${
            isSelected
              ? "border-[#92B090] bg-[#92B090]/20 text-[#92B090]"
              : "border-white/20 text-transparent hover:border-white/40"
          }`}
          aria-label={`${isSelected ? "Remove from" : "Add to"} comparison: ${dataset.name}`}
          aria-checked={isSelected}
          role="checkbox"
        >
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      )}

      <Link
        href={`/datasets/${dataset.slug}`}
        className="block"
        aria-label={`${dataset.name} — ${dataset.modalities.join(", ")} — ${formatCount(dataset.hf_downloads)} downloads`}
      >
        {/* Name */}
        <h3 className="text-[15px] font-semibold text-white group-hover:underline mb-1.5 pr-8 leading-snug">
          {dataset.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-3">
          {dataset.description || "No description available."}
        </p>

        {/* Modality tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {visibleMods.map((mod) => (
            <span
              key={mod}
              className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-[11px]"
              style={{
                color: "#92B090",
                fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              }}
            >
              {mod}
            </span>
          ))}
          {extraCount > 0 && (
            <span
              className="inline-flex items-center text-[11px] text-white/30"
              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            >
              +{extraCount}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div
          className="flex items-center gap-3 text-[11px] text-white/40"
          style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
        >
          <span title="HuggingFace downloads">{formatCount(dataset.hf_downloads)} downloads</span>
          {dataset.year_released && <span>{dataset.year_released}</span>}
          {dataset.license && (
            <span className="rounded border border-white/10 px-1.5 py-0.5 text-white/50">
              {dataset.license}
            </span>
          )}
          {dataset.is_gated && (
            <span className="rounded border border-amber-500/30 px-1.5 py-0.5 text-amber-400/70">
              gated
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
