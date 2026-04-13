"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { EnrichedLead, UnmatchedQueueItem } from "./page";

const CLASSIFICATION_BADGE: Record<
  string,
  { text: string; border: string; bg: string }
> = {
  interested: {
    text: "text-green-400",
    border: "border-green-800/40",
    bg: "bg-green-900/20",
  },
  question: {
    text: "text-blue-400",
    border: "border-blue-800/40",
    bg: "bg-blue-900/20",
  },
  objection: {
    text: "text-yellow-400",
    border: "border-yellow-800/40",
    bg: "bg-yellow-900/20",
  },
  unsubscribe: {
    text: "text-red-400",
    border: "border-red-800/40",
    bg: "bg-red-900/20",
  },
  other: {
    text: "text-zinc-400",
    border: "border-zinc-700/40",
    bg: "bg-zinc-800/20",
  },
};

const INBOX_DISPLAY: Record<string, string> = {
  claru: "claru.ai",
  moonvalley: "moonvalley.com",
};

// Matched lead card — draggable
interface LeadKanbanCardProps {
  lead: EnrichedLead;
  isSelected: boolean;
  onClick: () => void;
}

export function LeadKanbanCard({
  lead,
  isSelected,
  onClick,
}: LeadKanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `lead:${lead.lead_id}`,
      data: { type: "lead", leadId: lead.lead_id },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const queueItem = lead.queueItem;
  const classification = queueItem?.classification;
  const badge = classification
    ? (CLASSIFICATION_BADGE[classification] ?? CLASSIFICATION_BADGE.other)
    : null;
  const inboxDisplay = queueItem
    ? (INBOX_DISPLAY[queueItem.inbox] ?? queueItem.inbox)
    : null;
  const hasSilentAlert = lead.days_silent > 14 && lead.days_silent < 999;
  const isNewToday = !!(
    queueItem?.received_at &&
    Date.now() - new Date(queueItem.received_at).getTime() < 86_400_000
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`relative cursor-pointer rounded-md border px-3 py-2.5 transition-colors ${
        isSelected
          ? "border-[#92B090]/50 bg-[#92B090]/5"
          : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)]"
      } ${isDragging ? "opacity-40 shadow-lg" : ""}`}
    >
      {isNewToday && (
        <span className="absolute right-2 top-2 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#92B090] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#92B090]" />
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        {/* Left: company + contact */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm font-medium text-[var(--text-primary)]">
            {lead.company ?? lead.lead_email}
          </p>
          <p className="truncate font-mono text-xs text-[var(--text-tertiary)]">
            {lead.lead_name ?? lead.lead_email}
            {inboxDisplay && ` · ${inboxDisplay}`}
          </p>
        </div>

        {/* Right: badge + ICP + days */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          {badge && classification && (
            <span
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] capitalize ${badge.text} ${badge.border} ${badge.bg}`}
            >
              {classification}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            {lead.icp_score != null && (
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {lead.icp_score}
              </span>
            )}
            {lead.days_silent < 999 && lead.days_silent > 0 && (
              <span
                className={`flex items-center gap-0.5 font-mono text-[10px] ${
                  hasSilentAlert ? "text-red-400" : "text-[var(--text-muted)]"
                }`}
              >
                {hasSilentAlert && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                )}
                {lead.days_silent}d
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Unmatched queue item card — not draggable (no lead to reattach)
interface UnmatchedKanbanCardProps {
  item: UnmatchedQueueItem;
  isSelected: boolean;
  onClick: () => void;
}

export function UnmatchedKanbanCard({
  item,
  isSelected,
  onClick,
}: UnmatchedKanbanCardProps) {
  const badge =
    CLASSIFICATION_BADGE[item.classification] ?? CLASSIFICATION_BADGE.other;
  const inboxDisplay = INBOX_DISPLAY[item.inbox] ?? item.inbox;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-md border px-3 py-2.5 transition-colors ${
        isSelected
          ? "border-[#92B090]/50 bg-[#92B090]/5"
          : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm font-medium text-[var(--text-primary)]">
            {item.sender_name ?? item.sender_email}
          </p>
          <p className="truncate font-mono text-xs text-[var(--text-tertiary)]">
            <span className="text-orange-400">unmatched</span>
            {` · ${inboxDisplay}`}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={`rounded border px-1.5 py-0.5 font-mono text-[10px] capitalize ${badge.text} ${badge.border} ${badge.bg}`}
          >
            {item.classification}
          </span>
        </div>
      </div>
    </div>
  );
}
