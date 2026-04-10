"use client";

import { useState, useOptimistic, startTransition } from "react";
import { MoreHorizontal, ChevronRight, ChevronDown } from "lucide-react";
import type { EnrichedLead } from "./page";
import { moveLeadToColumn } from "./actions";

type FilterType = "all" | "demand" | "supply";

interface ColdSectionProps {
  leads: EnrichedLead[];
  filterType: FilterType;
}

function DaysSilentLabel({ days }: { days: number }) {
  if (days === 999) return <span className="text-[var(--text-muted)]">—</span>;
  const cls =
    days > 14
      ? "text-red-400"
      : days > 7
        ? "text-yellow-400"
        : "text-[var(--text-primary)]";
  return <span className={cls}>{days}d</span>;
}

function MenuButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-3 py-2 text-left font-mono text-xs text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
    >
      {children}
    </button>
  );
}

function ColdLeadRow({
  lead,
  onMove,
}: {
  lead: EnrichedLead;
  onMove: (col: "respond" | "their-court" | "nurturing" | "cold") => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3 transition-colors hover:border-[var(--border-medium)]">
      {/* Lead identity — 60% opacity for cold */}
      <div className="min-w-0 flex-1 opacity-60">
        <p className="truncate font-mono text-sm text-[var(--text-primary)]">
          {lead.company ?? lead.lead_email}
        </p>
        {lead.lead_name && (
          <p className="truncate font-mono text-xs text-[var(--text-tertiary)]">
            {lead.lead_name} · {lead.lead_email}
          </p>
        )}
      </div>

      {/* Days silent */}
      <span className="shrink-0 font-mono text-xs opacity-60">
        <DaysSilentLabel days={lead.days_silent} />
      </span>

      {/* Campaign step */}
      {lead.smartlead_campaign_name && (
        <span className="hidden shrink-0 max-w-[140px] truncate font-mono text-xs text-[var(--text-muted)] opacity-60 sm:block">
          {lead.smartlead_campaign_name}
          {lead.smartlead_sequence_step != null
            ? ` · step ${lead.smartlead_sequence_step}`
            : ""}
        </span>
      )}

      {/* 3-dot menu */}
      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded p-1 text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[var(--text-primary)]"
          aria-label="Lead actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-7 z-20 min-w-[180px] rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-lg">
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  onMove("respond");
                }}
              >
                Move to Respond Now
              </MenuButton>
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  onMove("nurturing");
                }}
              >
                Move to Nurturing
              </MenuButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ColdSection({ leads, filterType }: ColdSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filtered = leads
    .filter((l) => filterType === "all" || l.type === filterType)
    .filter((l) => l.thread_state === "cold")
    .sort((a, b) => b.days_silent - a.days_silent); // DESC

  const [optimisticLeads, removeOptimisticLead] = useOptimistic(
    filtered,
    (state, removedId: string) => state.filter((l) => l.lead_id !== removedId)
  );

  function handleMove(
    lead: EnrichedLead,
    column: "respond" | "their-court" | "nurturing" | "cold"
  ) {
    startTransition(async () => {
      removeOptimisticLead(lead.lead_id);
      try {
        await moveLeadToColumn(lead.lead_id, column);
      } catch {
        // Snap back on error — optimistic state reverts automatically when transition ends
      }
    });
  }

  return (
    <section className="mb-8">
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="mb-3 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-tertiary)]"
      >
        {isOpen ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        Cold ({optimisticLeads.length})
      </button>

      {isOpen && (
        <>
          {optimisticLeads.length === 0 ? (
            <p className="py-4 font-mono text-sm text-[var(--text-muted)]">
              No cold leads
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {optimisticLeads.map((lead) => (
                <ColdLeadRow
                  key={lead.lead_id}
                  lead={lead}
                  onMove={(col) => handleMove(lead, col)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
