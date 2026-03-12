"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { PublicDataset } from "@/types/data-catalog";
import PublicDatasetCard from "./PublicDatasetCard";
import CategoryFilterPills from "./CategoryFilterPills";

const BATCH_SIZE = 12;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ---------------------------------------------------------------------------
// Skeleton card
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-[var(--bg-card)] animate-pulse h-[200px]" />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PublicDatasetBrowser() {
  const [datasets, setDatasets] = useState<PublicDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/public/datasets");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: PublicDataset[] = await res.json();
      setDatasets(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  // Deduplicate categories by slug, sort by display_order
  const categories = useMemo(() => {
    const map = new Map<
      string,
      { name: string; slug: string; display_order: number }
    >();
    for (const d of datasets) {
      if (!map.has(d.category.slug)) {
        map.set(d.category.slug, { ...d.category });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => a.display_order - b.display_order,
    );
  }, [datasets]);

  // Filter datasets by selected category
  const filtered = useMemo(() => {
    if (selectedCategory === null) return datasets;
    return datasets.filter((d) => d.category.slug === selectedCategory);
  }, [datasets, selectedCategory]);

  // Slice to only the visible portion
  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMore = visibleCount < filtered.length;

  // Reset visible count when category changes
  const handleCategorySelect = useCallback(
    (slug: string | null) => {
      setSelectedCategory(slug);
      setVisibleCount(BATCH_SIZE);
    },
    [],
  );

  // IntersectionObserver to load more cards on scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => prev + BATCH_SIZE);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Placeholder for filter pills */}
        <div className="h-9" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error state
  // ---------------------------------------------------------------------------
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-mono text-sm text-[var(--text-tertiary)] mb-4">
          Failed to load datasets
        </p>
        <button
          type="button"
          onClick={fetchDatasets}
          className="font-mono text-xs text-[var(--accent-primary)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-full hover:border-[var(--accent-primary)]/40 transition-colors cursor-pointer"
        >
          [retry]
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------
  if (datasets.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-mono text-[var(--text-tertiary)]">
          No datasets available yet
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loaded state
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      <CategoryFilterPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
      />

      <motion.div
        key={selectedCategory ?? "__all"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {visible.map((dataset) => (
          <motion.div
            key={dataset.id}
            variants={cardVariants}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <PublicDatasetCard dataset={dataset} />
          </motion.div>
        ))}
      </motion.div>

      {/* Sentinel for IntersectionObserver */}
      {hasMore && <div ref={sentinelRef} className="h-1" />}

      {/* Counter */}
      {filtered.length > BATCH_SIZE && (
        <p className="font-mono text-xs text-[var(--text-tertiary)] text-center mt-4">
          Showing {visible.length} of {filtered.length} datasets
        </p>
      )}
    </div>
  );
}
