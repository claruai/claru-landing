"use client";

import { useState, useOptimistic, startTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import type { EnrichedLead } from "./page";
import { moveLeadToColumn } from "./actions";

type FilterType = "all" | "demand" | "supply";

interface NurturingSectionProps {
  leads: EnrichedLead[];
  filterType: FilterType;
}

const THREAD_STATE_COLORS: Record<string, string> = {
  hot: "text-orange-400",
  warm: "text-yellow-400",
  negotiating: "text-[#92B090]",
  cold: "text-zinc-500",
};

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

function NurturingLeadRow({
  lead,
  onMove,
}: {
  lead: EnrichedLead;
  onMove: (col: "respond" | "their-court" | "nurturing" | "cold") => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const stateColor =
    THREAD_STATE_COLORS[lead.thread_state] ?? "text-[var(--text-tertiary)]";

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3 transition-colors hover:border-[var(--border-medium)]">
      {/* Lead identity */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-sm text-[var(--text-primary)]">
          {lead.company ?? lead.lead_email}
        </p>
        {lead.lead_name && (
          <p className="truncate font-mono text-xs text-[var(--text-tertiary)]">
            {lead.lead_name} · {lead.lead_email}
          </p>
        )}
      </div>

      {/* Thread state chip */}
      <span className={`shrink-0 font-mono text-xs capitalize ${stateColor}`}>
        {lead.thread_state}
      </span>

      {/* Days silent */}
      <span className="shrink-0 font-mono text-xs">
        <DaysSilentLabel days={lead.days_silent} />
      </span>

      {/* Campaign step */}
      {lead.smartlead_campaign_name && (
        <span className="hidden shrink-0 max-w-[140px] truncate font-mono text-xs text-[var(--text-muted)] sm:block">
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
                  onMove("their-court");
                }}
              >
                Move to Waiting on Them
              </MenuButton>
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  onMove("cold");
                }}
              >
                Move to Cold
              </MenuButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function NurturingSection({ leads, filterType }: NurturingSectionProps) {
  const filtered = leads
    .filter((l) => filterType === "all" || l.type === filterType)
    .filter(
      (l) => l.waiting_on === "unknown" && l.thread_state === "warm"
    )
    .sort((a, b) => a.days_silent - b.days_silent); // ASC

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
      <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Nurturing ({optimisticLeads.length})
      </h2>

      {optimisticLeads.length === 0 ? (
        <p className="py-4 font-mono text-sm text-[var(--text-muted)]">
          No leads in nurturing
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {optimisticLeads.map((lead) => (
            <NurturingLeadRow
              key={lead.lead_id}
              lead={lead}
              onMove={(col) => handleMove(lead, col)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
