"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PipelineLead } from "./page";
import { PipelineRow } from "./PipelineRow";

type SortKey = "days_silent" | "icp_score" | "thread_state" | "company";
type FilterType = "all" | "demand" | "supply";

interface PipelineListProps {
  leads: PipelineLead[];
}

export function PipelineList({ leads }: PipelineListProps) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("days_silent");
  const [sortDesc, setSortDesc] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Auto-refresh every 5 min
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 300_000);
    return () => clearInterval(interval);
  }, [router]);

  const filtered = leads.filter(
    (l) => filterType === "all" || l.type === filterType
  );

  const sorted = [...filtered].sort((a, b) => {
    let av: string | number | null = a[sortKey];
    let bv: string | number | null = b[sortKey];

    if (av === null) av = sortDesc ? -Infinity : Infinity;
    if (bv === null) bv = sortDesc ? -Infinity : Infinity;

    if (av < bv) return sortDesc ? 1 : -1;
    if (av > bv) return sortDesc ? -1 : 1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (k !== sortKey) return <span className="opacity-20">↕</span>;
    return <span>{sortDesc ? "↓" : "↑"}</span>;
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex items-center gap-1 font-mono text-sm">
        {(["all", "demand", "supply"] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-md px-3 py-1.5 capitalize transition-colors ${
              filterType === t
                ? "bg-[#92B090]/20 text-[#92B090]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-[var(--text-tertiary)]">
          {sorted.length} lead{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-16 font-mono text-sm text-[var(--text-tertiary)]">
          No active leads in this view
        </div>
      )}

      {/* Table */}
      {sorted.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                <Th onClick={() => handleSort("company")}>
                  Company <SortIcon k="company" />
                </Th>
                <Th onClick={() => handleSort("thread_state")}>
                  State <SortIcon k="thread_state" />
                </Th>
                <Th>Waiting</Th>
                <Th onClick={() => handleSort("days_silent")}>
                  Silent <SortIcon k="days_silent" />
                </Th>
                <Th onClick={() => handleSort("icp_score")}>
                  ICP <SortIcon k="icp_score" />
                </Th>
                <Th>Campaign</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-primary)]">
              {sorted.map((lead) => (
                <PipelineRow
                  key={lead.lead_id}
                  lead={lead}
                  expanded={expandedId === lead.lead_id}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === lead.lead_id ? null : lead.lead_id
                    )
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 text-left text-xs font-medium text-[var(--text-tertiary)] ${
        onClick ? "cursor-pointer select-none hover:text-[var(--text-primary)]" : ""
      }`}
    >
      {children}
    </th>
  );
}
