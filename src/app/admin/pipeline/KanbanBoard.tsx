"use client";

import {
  useState,
  useOptimistic,
  useRef,
  useEffect,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { EnrichedLead, UnmatchedQueueItem } from "./page";
import { ProspectsBar } from "./ProspectsBar";
import { KanbanColumn } from "./KanbanColumn";
import { LeadKanbanCard, UnmatchedKanbanCard } from "./KanbanCard";
import { LeadSlideOver } from "./LeadSlideOver";
import { moveLeadToColumn } from "./actions";

type FilterType = "all" | "demand" | "supply";
type ColumnId = "respond" | "their-court" | "nurturing" | "cold";

interface KanbanBoardProps {
  leads: EnrichedLead[];
  unmatchedItems: UnmatchedQueueItem[];
}

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "respond", title: "Respond Now" },
  { id: "their-court", title: "Waiting on Them" },
  { id: "nurturing", title: "Nurturing" },
  { id: "cold", title: "Cold" },
];

/** Map each lead to its kanban column based on thread_state + waiting_on */
function getLeadColumn(lead: EnrichedLead): ColumnId {
  if (
    (lead.waiting_on === "us" && lead.thread_state !== "dead") ||
    lead.queueItem !== null
  ) {
    return "respond";
  }
  if (
    lead.waiting_on === "them" &&
    ["hot", "warm", "negotiating"].includes(lead.thread_state)
  ) {
    return "their-court";
  }
  if (lead.waiting_on === "unknown" && lead.thread_state === "warm") {
    return "nurturing";
  }
  return "cold";
}

/** The ordered Respond Now queue: unmatched first, then matched leads with queue items */
type QueueEntry =
  | { type: "lead"; lead: EnrichedLead }
  | { type: "unmatched"; item: UnmatchedQueueItem };

export function KanbanBoard({ leads, unmatchedItems }: KanbanBoardProps) {
  const router = useRouter();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [mobileColumn, setMobileColumn] = useState<ColumnId>("respond");
  const mutationCountRef = useRef(0);

  // Optimistic removal when a lead is actioned
  const [optimisticLeads, updateOptimisticLeads] = useOptimistic(
    leads,
    (state: EnrichedLead[], removedId: string) =>
      state.filter((l) => l.lead_id !== removedId)
  );

  // Auto-refresh every 60s when idle (no open panel, no in-flight mutation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedId && mutationCountRef.current === 0 && !isDrafting) {
        router.refresh();
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [selectedId, isDrafting, router]);

  // DnD sensors — require a small drag distance before activating
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  // Apply type filter
  const filteredLeads =
    filterType === "all"
      ? optimisticLeads
      : optimisticLeads.filter((l) => l.type === filterType);

  // Bucket leads into columns
  const columnLeads: Record<ColumnId, EnrichedLead[]> = {
    respond: [],
    "their-court": [],
    nurturing: [],
    cold: [],
  };
  for (const lead of filteredLeads) {
    columnLeads[getLeadColumn(lead)].push(lead);
  }

  // Sort Respond Now: queue items by received_at DESC, then no-queue by days_silent DESC
  columnLeads.respond.sort((a, b) => {
    if (a.queueItem && b.queueItem) {
      return (
        new Date(b.queueItem.received_at).getTime() -
        new Date(a.queueItem.received_at).getTime()
      );
    }
    if (a.queueItem) return -1;
    if (b.queueItem) return 1;
    return b.days_silent - a.days_silent;
  });

  // Build the Respond Now ordered queue for position counter + auto-advance
  const respondNowQueue: QueueEntry[] = [
    ...unmatchedItems.map(
      (item): QueueEntry => ({ type: "unmatched", item })
    ),
    ...columnLeads.respond
      .filter((l) => l.queueItem !== null)
      .map((lead): QueueEntry => ({ type: "lead", lead })),
  ];

  // Derive selected entities from selectedId
  const selectedLeadId = selectedId?.startsWith("lead:")
    ? selectedId.slice(5)
    : null;
  const selectedUnmatchedId = selectedId?.startsWith("unmatched:")
    ? selectedId.slice(10)
    : null;

  const selectedLead = selectedLeadId
    ? (optimisticLeads.find((l) => l.lead_id === selectedLeadId) ?? null)
    : null;
  const selectedUnmatched = selectedUnmatchedId
    ? (unmatchedItems.find((i) => i.id === selectedUnmatchedId) ?? null)
    : null;

  // Position within respond-now queue (0-based; -1 if not in queue)
  const selectedQueueIdx = respondNowQueue.findIndex((entry) =>
    entry.type === "lead"
      ? `lead:${entry.lead.lead_id}` === selectedId
      : `unmatched:${entry.item.id}` === selectedId
  );

  const showSlideOver = selectedLead !== null || selectedUnmatched !== null;

  // Drag end: move lead to target column via server action
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const dragId = String(active.id);
    const destColumn = String(over.id) as ColumnId;

    if (!dragId.startsWith("lead:")) return;
    const leadId = dragId.slice(5);
    const lead = leads.find((l) => l.lead_id === leadId);
    if (!lead) return;

    if (getLeadColumn(lead) === destColumn) return;

    mutationCountRef.current += 1;
    startTransition(async () => {
      try {
        await moveLeadToColumn(leadId, destColumn);
      } finally {
        mutationCountRef.current = Math.max(0, mutationCountRef.current - 1);
      }
    });
  }

  // Advance to the next item in the respond-now queue
  function handleAdvance() {
    if (selectedQueueIdx < 0 || selectedQueueIdx >= respondNowQueue.length - 1) {
      setSelectedId(null);
      return;
    }
    const next = respondNowQueue[selectedQueueIdx + 1];
    setSelectedId(
      next.type === "lead"
        ? `lead:${next.lead.lead_id}`
        : `unmatched:${next.item.id}`
    );
  }

  // Remove: optimistically hide the lead, close the panel, auto-advance after 500ms
  function handleRemove() {
    // Capture next before state change
    const nextEntry =
      selectedQueueIdx >= 0 && selectedQueueIdx < respondNowQueue.length - 1
        ? respondNowQueue[selectedQueueIdx + 1]
        : null;

    // Optimistically remove the lead
    if (selectedLeadId) {
      mutationCountRef.current += 1;
      startTransition(() => {
        updateOptimisticLeads(selectedLeadId);
        mutationCountRef.current = Math.max(0, mutationCountRef.current - 1);
      });
    }

    // Close slide-over immediately
    setSelectedId(null);

    // Auto-advance after 500ms
    if (nextEntry) {
      const nextId =
        nextEntry.type === "lead"
          ? `lead:${nextEntry.lead.lead_id}`
          : `unmatched:${nextEntry.item.id}`;
      setTimeout(() => setSelectedId(nextId), 500);
    }
  }

  const now = Date.now();
  const newTodayCount =
    optimisticLeads.filter(
      (l) =>
        l.queueItem?.received_at &&
        now - new Date(l.queueItem.received_at).getTime() < 86_400_000
    ).length +
    unmatchedItems.filter(
      (i) => now - new Date(i.received_at).getTime() < 86_400_000
    ).length;

  return (
    <div>
      <ProspectsBar
        leads={optimisticLeads}
        unmatchedCount={unmatchedItems.length}
        filterType={filterType}
        setFilterType={setFilterType}
        newTodayCount={newTodayCount}
      />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {/* Desktop: 4-column grid */}
        <div className="hidden gap-3 md:flex">
          {COLUMNS.map(({ id, title }) => {
            const colLeads = columnLeads[id];
            const colUnmatched = id === "respond" ? unmatchedItems : [];
            const totalCount = colLeads.length + colUnmatched.length;

            return (
              <KanbanColumn key={id} id={id} title={title} count={totalCount}>
                {colUnmatched.map((item) => (
                  <UnmatchedKanbanCard
                    key={item.id}
                    item={item}
                    isSelected={selectedId === `unmatched:${item.id}`}
                    onClick={() => setSelectedId(`unmatched:${item.id}`)}
                  />
                ))}
                {colLeads.map((lead) => (
                  <LeadKanbanCard
                    key={lead.lead_id}
                    lead={lead}
                    isSelected={selectedId === `lead:${lead.lead_id}`}
                    onClick={() => setSelectedId(`lead:${lead.lead_id}`)}
                  />
                ))}
              </KanbanColumn>
            );
          })}
        </div>

        {/* Mobile: tab pills + single scrolling column (no DnD) */}
        <div className="md:hidden">
          <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
            {COLUMNS.map(({ id, title }) => {
              const count =
                columnLeads[id].length +
                (id === "respond" ? unmatchedItems.length : 0);
              return (
                <button
                  key={id}
                  onClick={() => setMobileColumn(id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
                    mobileColumn === id
                      ? "bg-[#92B090]/20 text-[#92B090]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-tertiary)]"
                  }`}
                >
                  {title} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            {mobileColumn === "respond" &&
              unmatchedItems.map((item) => (
                <UnmatchedKanbanCard
                  key={item.id}
                  item={item}
                  isSelected={selectedId === `unmatched:${item.id}`}
                  onClick={() => setSelectedId(`unmatched:${item.id}`)}
                />
              ))}
            {columnLeads[mobileColumn].map((lead) => (
              <LeadKanbanCard
                key={lead.lead_id}
                lead={lead}
                isSelected={selectedId === `lead:${lead.lead_id}`}
                onClick={() => setSelectedId(`lead:${lead.lead_id}`)}
              />
            ))}
          </div>
        </div>
      </DndContext>

      {/* Slide-over panel */}
      {showSlideOver && (
        <LeadSlideOver
          lead={selectedLead}
          unmatchedItem={selectedUnmatched}
          positionInQueue={
            selectedQueueIdx >= 0 ? selectedQueueIdx + 1 : undefined
          }
          totalInQueue={
            respondNowQueue.length > 0 ? respondNowQueue.length : undefined
          }
          isDrafting={isDrafting}
          setIsDrafting={setIsDrafting}
          onClose={() => setSelectedId(null)}
          onAdvance={handleAdvance}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
