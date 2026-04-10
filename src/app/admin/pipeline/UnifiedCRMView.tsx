"use client";

import { useState, useOptimistic, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { EnrichedLead, UnmatchedQueueItem } from "./page";
import { ProspectsBar } from "./ProspectsBar";
import { RespondNowSection } from "./RespondNowSection";
import { WaitingSection } from "./WaitingSection";
import { NurturingSection } from "./NurturingSection";
import { ColdSection } from "./ColdSection";

type FilterType = "all" | "demand" | "supply";

interface UnifiedCRMViewProps {
  leads: EnrichedLead[];
  unmatchedItems: UnmatchedQueueItem[];
}

export function UnifiedCRMView({ leads, unmatchedItems }: UnifiedCRMViewProps) {
  const router = useRouter();

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  // Track in-flight mutations to pause auto-refresh
  const mutationCountRef = useRef(0);

  // Optimistic leads — remove a lead by id (used when queue actions resolve)
  const [optimisticLeads, updateOptimisticLeads] = useOptimistic(
    leads,
    (state: EnrichedLead[], removedId: string) =>
      state.filter((l) => l.lead_id !== removedId)
  );

  // Auto-refresh every 60s — pause when a card is expanded, mutation is in-flight, or AI is drafting
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        !expandedId &&
        mutationCountRef.current === 0 &&
        !isDrafting
      ) {
        router.refresh();
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [expandedId, isDrafting, router]);

  function incrementMutation() {
    mutationCountRef.current += 1;
  }

  function decrementMutation() {
    mutationCountRef.current = Math.max(0, mutationCountRef.current - 1);
  }

  // Page-level empty state when filter yields zero leads
  const visibleLeads =
    filterType === "all"
      ? optimisticLeads
      : optimisticLeads.filter((l) => l.type === filterType);

  const showEmptyState =
    visibleLeads.length === 0 && unmatchedItems.length === 0;

  return (
    <div>
      <ProspectsBar
        leads={optimisticLeads}
        unmatchedCount={unmatchedItems.length}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {showEmptyState ? (
        <div className="flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-16 font-mono text-sm text-[var(--text-tertiary)]">
          No {filterType !== "all" ? filterType : ""} leads
        </div>
      ) : (
        <>
          <RespondNowSection
            leads={optimisticLeads}
            unmatchedItems={unmatchedItems}
            filterType={filterType}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onAction={incrementMutation}
            onActionDone={decrementMutation}
            isDrafting={isDrafting}
            setIsDrafting={setIsDrafting}
          />

          <WaitingSection
            leads={optimisticLeads}
            filterType={filterType}
          />

          <NurturingSection
            leads={optimisticLeads}
            filterType={filterType}
          />

          <ColdSection
            leads={optimisticLeads}
            filterType={filterType}
          />
        </>
      )}
    </div>
  );
}
