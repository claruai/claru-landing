"use client";

import { useRef, useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Category {
  name: string;
  slug: string;
  display_order: number;
}

interface CategoryFilterPillsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (slug: string | null) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CategoryFilterPills({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  // Detect whether the scroll container overflows (for fade mask)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => setOverflows(el.scrollWidth > el.clientWidth);
    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [categories]);

  const sorted = [...categories].sort(
    (a, b) => a.display_order - b.display_order,
  );

  const pillBase =
    "font-mono text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 flex-shrink-0 min-h-[36px] inline-flex items-center";

  const selectedCls =
    "bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]";

  const unselectedCls =
    "border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/20 hover:text-[var(--text-primary)]";

  return (
    <div
      ref={scrollRef}
      className="flex flex-nowrap gap-2 overflow-x-auto category-pills-scroll"
      style={
        overflows
          ? {
              maskImage:
                "linear-gradient(to right, black 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 90%, transparent 100%)",
            }
          : undefined
      }
    >
      {/* "All" pill — selected when no category filter is active */}
      <button
        type="button"
        className={`${pillBase} ${selectedCategory === null ? selectedCls : unselectedCls}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>

      {sorted.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          className={`${pillBase} ${selectedCategory === cat.slug ? selectedCls : unselectedCls}`}
          onClick={() => onSelect(cat.slug)}
        >
          {cat.name}
        </button>
      ))}

      {/* Hide scrollbar across browsers */}
      <style jsx>{`
        .category-pills-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .category-pills-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
