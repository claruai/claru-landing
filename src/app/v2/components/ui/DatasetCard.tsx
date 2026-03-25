"use client";

import type { Dataset } from "../../data/datasets";

interface DatasetCardProps {
  dataset: Dataset;
  index: number;
}

export default function DatasetCard({ dataset, index }: DatasetCardProps) {
  return (
    <div
      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6"
      data-index={index}
    >
      <h3 className="text-xl font-bold text-white">{dataset.name}</h3>
      <p className="font-mono text-sm text-[var(--accent-primary)]">
        {dataset.count}
      </p>
      <p className="mt-2 text-sm text-white/60">{dataset.description}</p>
    </div>
  );
}
