"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { Dataset, DatasetCategory } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CatalogBrowserProps {
  datasets: Array<
    Dataset & {
      category: Pick<DatasetCategory, "id" | "name" | "slug"> | null;
    }
  >;
  categories: Array<Pick<DatasetCategory, "id" | "name" | "slug">>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDatasetType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k hrs`;
  return `${hours.toFixed(0)} hrs`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CatalogBrowser({ datasets, categories }: CatalogBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDatasets = useMemo(() => {
    let result = datasets;

    if (selectedCategory) {
      result = result.filter((ds) => ds.category?.id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ds) =>
          ds.name.toLowerCase().includes(q) ||
          ds.subcategory?.toLowerCase().includes(q) ||
          ds.description?.toLowerCase().includes(q) ||
          ds.category?.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [datasets, searchQuery, selectedCategory]);

  return (
    <>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-2.5 pl-10 pr-10 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-mono transition-colors duration-200 ${
                selectedCategory === null
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:text-[var(--text-secondary)]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id
                  )
                }
                className={`rounded-full px-3 py-1.5 text-xs font-mono transition-colors duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dataset Grid */}
      {filteredDatasets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDatasets.map((ds) => (
            <Link
              key={ds.id}
              href={`/portal/catalog/${ds.id}`}
              className="group rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-5 hover:border-[var(--accent-primary)]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(146,176,144,0.06)]"
            >
              {/* Badges row */}
              <div className="flex items-center gap-2 mb-3">
                {ds.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)]">
                    {ds.category.name}
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                  {formatDatasetType(ds.type)}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-mono text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-200 mb-1 line-clamp-2">
                {ds.name}
              </h3>

              {/* Subcategory */}
              {ds.subcategory && (
                <p className="font-mono text-[11px] text-[var(--text-muted)] mb-2 truncate">
                  {ds.subcategory}
                </p>
              )}

              {/* Description */}
              {ds.description && (
                <p className="font-mono text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                  {ds.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 pt-3 border-t border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)]">
                <span>
                  <span className="text-[var(--accent-primary)]">
                    {ds.total_samples.toLocaleString()}
                  </span>{" "}
                  samples
                </span>
                {ds.total_duration_hours > 0 && (
                  <span>
                    <span className="text-[var(--accent-primary)]">
                      {formatDuration(ds.total_duration_hours)}
                    </span>{" "}
                    duration
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-16 text-center">
          {datasets.length === 0 ? (
            <>
              <p className="text-sm font-mono text-[var(--text-muted)] mb-1">
                No datasets available yet.
              </p>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                Your admin is setting up your catalog.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-mono text-[var(--text-muted)] mb-1">
                No datasets match your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-3 text-xs font-mono text-[var(--accent-primary)] hover:underline"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}

      {/* "Can't find what you need?" banner */}
      <div className="mt-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-8 text-center">
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
          Can&apos;t find what you need?
        </p>
        <p className="text-xs font-mono text-[var(--text-muted)] mb-4">
          Submit a custom data request and our team will follow up.
        </p>
        <Link
          href="/portal/request"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-mono font-medium text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] transition-colors duration-200"
        >
          Request Data
        </Link>
      </div>
    </>
  );
}
