"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { OSSDatasetFilters, OSSDatasetSortOption, FilterOptions } from "@/types/oss-datasets";

// ---------------------------------------------------------------------------
// Multi-Select Dropdown
// ---------------------------------------------------------------------------
function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string; count: number }[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const displayLabel = selected.length > 0 ? `${label} (${selected.length})` : label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
          selected.length > 0
            ? "border-[#92B090]/40 bg-[#92B090]/10 text-[#92B090]"
            : "border-white/10 text-white/60 hover:border-white/20"
        }`}
        style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
        aria-expanded={isOpen}
        aria-label={`Filter by ${label}`}
      >
        {displayLabel}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-64 min-w-[200px] overflow-y-auto rounded-lg border border-white/10 bg-[#141412] shadow-xl">
          {options.slice(0, 20).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-[12px] transition-colors ${
                selected.includes(opt.value)
                  ? "bg-[#92B090]/10 text-[#92B090]"
                  : "text-white/60 hover:bg-white/5 hover:text-white/80"
              }`}
              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            >
              <span className="truncate mr-2">{opt.label}</span>
              <span className="text-white/30 flex-shrink-0">{opt.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sort Dropdown
// ---------------------------------------------------------------------------
const SORT_OPTIONS: { value: OSSDatasetSortOption; label: string }[] = [
  { value: "downloads", label: "Most downloads" },
  { value: "recent", label: "Most recent" },
  { value: "citations", label: "Most cited" },
  { value: "name", label: "A-Z" },
];

function SortDropdown({
  value,
  onChange,
}: {
  value: OSSDatasetSortOption;
  onChange: (v: OSSDatasetSortOption) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Sort";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/60 hover:border-white/20 transition-colors"
        style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
        aria-label="Sort datasets"
      >
        {currentLabel}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-[#141412] shadow-xl">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-[12px] transition-colors ${
                value === opt.value
                  ? "bg-[#92B090]/10 text-[#92B090]"
                  : "text-white/60 hover:bg-white/5 hover:text-white/80"
              }`}
              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------
interface FilterBarProps {
  filters: OSSDatasetFilters;
  filterOptions: FilterOptions;
  resultCount: number;
  onFiltersChange: (filters: OSSDatasetFilters) => void;
}

export default function FilterBar({
  filters,
  filterOptions,
  resultCount,
  onFiltersChange,
}: FilterBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateFilter = useCallback(
    (key: keyof OSSDatasetFilters, value: OSSDatasetFilters[keyof OSSDatasetFilters]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateFilter("search", val);
      }, 300);
    },
    [updateFilter],
  );

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.modalities.length > 0 ||
    filters.robot_embodiments.length > 0 ||
    filters.environment_type.length > 0 ||
    filters.task_types.length > 0 ||
    filters.license.length > 0 ||
    filters.data_format.length > 0;

  const clearAll = () => {
    onFiltersChange({
      search: "",
      modalities: [],
      robot_embodiments: [],
      environment_type: [],
      task_types: [],
      license: [],
      data_format: [],
      sort: filters.sort,
    });
    if (searchRef.current) searchRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Search + Sort row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search datasets..."
            defaultValue={filters.search}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-[#92B090]/40 focus:outline-none transition-colors"
            style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            aria-label="Search datasets"
          />
        </div>
        <SortDropdown
          value={filters.sort}
          onChange={(v) => updateFilter("sort", v)}
        />
      </div>

      {/* Filter pills row — overflow-visible so dropdowns aren't clipped */}
      <div className="flex flex-wrap items-center gap-2">
        <MultiSelectDropdown
          label="Modality"
          options={filterOptions.modalities}
          selected={filters.modalities}
          onChange={(v) => updateFilter("modalities", v)}
        />
        <MultiSelectDropdown
          label="Robot"
          options={filterOptions.robot_embodiments}
          selected={filters.robot_embodiments}
          onChange={(v) => updateFilter("robot_embodiments", v)}
        />
        <MultiSelectDropdown
          label="Environment"
          options={filterOptions.environment_type}
          selected={filters.environment_type}
          onChange={(v) => updateFilter("environment_type", v)}
        />
        <MultiSelectDropdown
          label="Task"
          options={filterOptions.task_types}
          selected={filters.task_types}
          onChange={(v) => updateFilter("task_types", v)}
        />
        <MultiSelectDropdown
          label="License"
          options={filterOptions.license}
          selected={filters.license}
          onChange={(v) => updateFilter("license", v)}
        />
        <MultiSelectDropdown
          label="Format"
          options={filterOptions.data_format}
          selected={filters.data_format}
          onChange={(v) => updateFilter("data_format", v)}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex-shrink-0 text-[12px] text-white/40 hover:text-white/70 transition-colors"
            style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Result count */}
      <div
        className="text-[12px] text-white/40"
        style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
        aria-live="polite"
      >
        {resultCount} dataset{resultCount !== 1 ? "s" : ""}
        {hasActiveFilters ? " matching" : " available"}
      </div>
    </div>
  );
}
