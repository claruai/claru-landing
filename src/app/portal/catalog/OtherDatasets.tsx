"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarClock } from "lucide-react";

interface OtherDataset {
  id: string;
  name: string;
  description: string | null;
  total_samples: number;
  category_name: string | null;
  source_type: string;
}

interface OtherDatasetsProps {
  datasets: OtherDataset[];
  bookingUrl: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
  return n.toLocaleString();
}

function sourceLabel(type: string): string {
  switch (type) {
    case "synthetic":
      return "SYNTHETIC";
    case "curated":
      return "CURATED";
    default:
      return "COLLECTED";
  }
}

export function OtherDatasets({ datasets, bookingUrl }: OtherDatasetsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-12">
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-sm font-mono text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] transition-all duration-200 w-full justify-center"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
            Hide other datasets
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            View other datasets available
          </>
        )}
      </button>

      {/* Expanded grid */}
      {expanded && (
        <div className="mt-6">
          <p className="text-xs font-mono text-[var(--text-muted)] mb-4">
            These datasets are available upon request. Book a call to discuss
            access.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {datasets.map((ds) => (
              <div
                key={ds.id}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 flex flex-col"
              >
                {/* Category + source type */}
                <div className="flex items-center gap-2 mb-2">
                  {ds.category_name && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-primary)]">
                      {ds.category_name}
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] opacity-60">
                    {sourceLabel(ds.source_type)}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1 line-clamp-1">
                  {ds.name}
                </h3>

                {/* Description */}
                {ds.description && (
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3 flex-1">
                    {ds.description}
                  </p>
                )}

                {/* Stats + CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {formatCount(ds.total_samples)} assets
                  </span>
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-mono text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
                  >
                    <CalendarClock className="h-3 w-3" strokeWidth={1.5} />
                    Book a Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
