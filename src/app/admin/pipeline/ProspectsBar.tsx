"use client";

import type { EnrichedLead } from "./page";

type FilterType = "all" | "demand" | "supply";

interface ProspectsBarProps {
  leads: EnrichedLead[];
  unmatchedCount: number;
  filterType: FilterType;
  setFilterType: (t: FilterType) => void;
  newTodayCount?: number;
}

export function ProspectsBar({
  leads,
  unmatchedCount,
  filterType,
  setFilterType,
  newTodayCount,
}: ProspectsBarProps) {
  const demandCount = leads.filter((l) => l.type === "demand").length;
  const supplyCount = leads.filter((l) => l.type === "supply").length;
  const needResponseCount =
    leads.filter((l) => l.queueItem !== null).length + unmatchedCount;

  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "demand", label: "Demand" },
    { key: "supply", label: "Supply" },
  ];

  return (
    <div className="mb-6 flex items-center gap-4 border-b border-[var(--border-subtle)] pb-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`rounded-md px-3 py-1.5 font-mono text-sm transition-colors ${
              filterType === key
                ? "bg-[#92B090]/20 text-[#92B090]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Counts */}
      <span className="font-mono text-xs text-[var(--text-muted)]">
        {demandCount} demand · {supplyCount} supply · {needResponseCount} need
        response
      </span>

      {/* New today badge */}
      {newTodayCount != null && newTodayCount > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-[#92B090]/10 px-2.5 py-0.5 font-mono text-xs text-[#92B090]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#92B090]" />
          {newTodayCount} new today
        </span>
      )}

      {/* Spacer */}
      <span className="ml-auto" />
    </div>
  );
}
