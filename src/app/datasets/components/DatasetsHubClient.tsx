"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OSSDataset, OSSDatasetFilters, OSSDatasetSortOption, FilterOptions } from "@/types/oss-datasets";
import { DEFAULT_FILTERS } from "@/types/oss-datasets";
import { filterAndSortDatasets, deriveFilterOptions } from "@/lib/oss-datasets";
import FilterBar from "./FilterBar";
import OSSDatasetCard from "./OSSDatasetCard";

const ITEMS_PER_PAGE = 48;

interface DatasetsHubClientProps {
  initialDatasets: OSSDataset[];
}

function parseFiltersFromParams(params: URLSearchParams): OSSDatasetFilters {
  return {
    search: params.get("q") ?? "",
    modalities: params.get("modality")?.split(",").filter(Boolean) ?? [],
    robot_embodiments: params.get("robot")?.split(",").filter(Boolean) ?? [],
    environment_type: params.get("env")?.split(",").filter(Boolean) ?? [],
    task_types: params.get("task")?.split(",").filter(Boolean) ?? [],
    license: params.get("license")?.split(",").filter(Boolean) ?? [],
    data_format: params.get("format")?.split(",").filter(Boolean) ?? [],
    sort: (params.get("sort") as OSSDatasetSortOption) ?? "downloads",
  };
}

function filtersToParams(filters: OSSDatasetFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.modalities.length) params.set("modality", filters.modalities.join(","));
  if (filters.robot_embodiments.length) params.set("robot", filters.robot_embodiments.join(","));
  if (filters.environment_type.length) params.set("env", filters.environment_type.join(","));
  if (filters.task_types.length) params.set("task", filters.task_types.join(","));
  if (filters.license.length) params.set("license", filters.license.join(","));
  if (filters.data_format.length) params.set("format", filters.data_format.join(","));
  if (filters.sort !== "downloads") params.set("sort", filters.sort);
  const str = params.toString();
  return str ? `?${str}` : "";
}

export default function DatasetsHubClient({ initialDatasets }: DatasetsHubClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Parse filters from URL on mount
  const [filters, setFilters] = useState<OSSDatasetFilters>(() =>
    parseFiltersFromParams(searchParams),
  );

  // Derive filter options from full dataset
  const filterOptions: FilterOptions = useMemo(
    () => deriveFilterOptions(initialDatasets),
    [initialDatasets],
  );

  // Apply filters + sort client-side
  const filteredDatasets = useMemo(
    () => filterAndSortDatasets(initialDatasets, filters),
    [initialDatasets, filters],
  );

  // Visible slice
  const visibleDatasets = useMemo(
    () => filteredDatasets.slice(0, visibleCount),
    [filteredDatasets, visibleCount],
  );

  const hasMore = visibleCount < filteredDatasets.length;

  // Sync URL when filters change
  const handleFiltersChange = useCallback(
    (newFilters: OSSDatasetFilters) => {
      setFilters(newFilters);
      setVisibleCount(ITEMS_PER_PAGE);
      const qs = filtersToParams(newFilters);
      router.replace(`/datasets${qs}`, { scroll: false });
    },
    [router],
  );

  // Comparison state
  const [compareSlugSet, setCompareSlugSet] = useState<Set<string>>(new Set());

  const handleCompareToggle = useCallback((slug: string) => {
    setCompareSlugSet((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else if (next.size < 3) {
        next.add(slug);
      }
      return next;
    });
  }, []);

  // Intersection observer for load-more
  useEffect(() => {
    if (!hasMore) return;
    const sentinel = document.getElementById("load-more-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, filteredDatasets.length]);

  return (
    <>
      {/* Filters */}
      <section className="w-full pb-6">
        <div className="mx-auto max-w-6xl px-6">
          <FilterBar
            filters={filters}
            filterOptions={filterOptions}
            resultCount={filteredDatasets.length}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </section>

      {/* Dataset Grid */}
      <section className="w-full pb-16">
        <div className="mx-auto max-w-6xl px-6">
          {filteredDatasets.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-white/50 mb-4">No datasets match your filters.</p>
              <button
                type="button"
                onClick={() => handleFiltersChange(DEFAULT_FILTERS)}
                className="text-[#92B090] hover:underline text-sm"
                style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleDatasets.map((ds) => (
                  <OSSDatasetCard
                    key={ds.slug}
                    dataset={ds}
                    onCompareToggle={handleCompareToggle}
                    isSelected={compareSlugSet.has(ds.slug)}
                  />
                ))}
              </div>
              {hasMore && (
                <div id="load-more-sentinel" className="py-8 text-center">
                  <span
                    className="text-sm text-white/30"
                    style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    Loading more...
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Comparison Bar */}
      {compareSlugSet.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#141412]/95 backdrop-blur-sm" aria-live="assertive">
          <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {Array.from(compareSlugSet).map((slug) => {
                const ds = initialDatasets.find((d) => d.slug === slug);
                return (
                  <span
                    key={slug}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#92B090]/30 bg-[#92B090]/10 px-3 py-1 text-[12px] text-[#92B090]"
                    style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    {ds?.name ?? slug}
                    <button
                      type="button"
                      onClick={() => handleCompareToggle(slug)}
                      className="ml-0.5 hover:text-white transition-colors"
                      aria-label={`Remove ${ds?.name ?? slug} from comparison`}
                    >
                      x
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCompareSlugSet(new Set())}
                className="text-[12px] text-white/40 hover:text-white/70 transition-colors"
                style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  const slugs = Array.from(compareSlugSet).join(",");
                  router.push(`/datasets/compare?ids=${slugs}`);
                }}
                disabled={compareSlugSet.size < 2}
                className="rounded-full px-4 py-1.5 text-[12px] font-medium transition-all disabled:opacity-40"
                style={{
                  backgroundColor: "#92B090",
                  color: "#0a0908",
                  fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                }}
              >
                Compare ({compareSlugSet.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
