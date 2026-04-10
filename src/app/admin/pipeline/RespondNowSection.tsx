"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import type { EnrichedLead, UnmatchedQueueItem, QueueItem } from "./page";
import {
  approveItem,
  dismissItem,
  snoozeItem,
  updateDraft,
} from "@/app/admin/queue/actions";

type FilterType = "all" | "demand" | "supply";

interface RespondNowSectionProps {
  leads: EnrichedLead[];
  unmatchedItems: UnmatchedQueueItem[];
  filterType: FilterType;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onAction: () => void; // increment mutationCountRef
  onActionDone: () => void; // decrement mutationCountRef
  isDrafting: boolean;
  setIsDrafting: (v: boolean) => void;
}

// inbox display mapping
const INBOX_DISPLAY: Record<string, string> = {
  claru: "claru.ai",
  moonvalley: "moonvalley.com",
};

// classification badge classes
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

function ClassificationBadge({ classification }: { classification: string }) {
  const style =
    CLASSIFICATION_BADGE[classification] ?? CLASSIFICATION_BADGE.other;
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] capitalize ${style.text} ${style.border} ${style.bg}`}
    >
      {classification}
    </span>
  );
}

// Error message lookup
function getDraftErrorMessage(status: number): string {
  if (status === 429) return "Rate limited — try in 30s";
  if (status === 503) return "Claude is busy — try again";
  if (status === 504 || status === 408) return "Request timed out — try again";
  return "Unknown error — try again";
}

// Expanded card for a lead with optional queue item
interface RespondCardProps {
  lead: EnrichedLead;
  isDrafting: boolean;
  setIsDrafting: (v: boolean) => void;
  onAction: () => void;
  onActionDone: () => void;
  onRemove: () => void;
}

function RespondCard({
  lead,
  isDrafting,
  setIsDrafting,
  onAction,
  onActionDone,
  onRemove,
}: RespondCardProps) {
  const router = useRouter();
  const queueItem = lead.queueItem;
  const [draftText, setDraftText] = useState(queueItem?.draft_response ?? "");
  const [actionPending, setActionPending] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDisabled = actionPending || isDrafting;

  async function flushDraft(text: string) {
    if (!queueItem) return;
    await updateDraft(queueItem.id, text);
  }

  function handleDraftChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setDraftText(val);
    // Debounce auto-save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (queueItem) {
      setIsSavingDraft(true);
      saveTimerRef.current = setTimeout(async () => {
        await updateDraft(queueItem.id, val).catch(() => null);
        setIsSavingDraft(false);
      }, 800);
    }
  }

  async function handleApprove() {
    if (!queueItem || isDisabled) return;
    setActionPending(true);
    onAction();
    try {
      await flushDraft(draftText);
      await navigator.clipboard.writeText(draftText);
      await approveItem(queueItem.id);
      onRemove();
    } catch {
      // No-op — optimistic already applied
    } finally {
      setActionPending(false);
      onActionDone();
    }
  }

  async function handleDismiss() {
    if (!queueItem || isDisabled) return;
    setActionPending(true);
    onAction();
    try {
      await dismissItem(queueItem.id);
      onRemove();
    } catch {
      // No-op
    } finally {
      setActionPending(false);
      onActionDone();
    }
  }

  async function handleSnooze() {
    if (!queueItem || isDisabled) return;
    setActionPending(true);
    onAction();
    try {
      await snoozeItem(queueItem.id, new Date(Date.now() + 86_400_000));
      onRemove();
    } catch {
      // No-op
    } finally {
      setActionPending(false);
      onActionDone();
    }
  }

  async function handleDraftWithClaude() {
    if (!queueItem || isDrafting) return;
    setDraftError(null);
    setIsDrafting(true);
    try {
      const res = await fetch("/api/admin/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.lead_id,
          queueItemId: queueItem.id,
        }),
      });
      if (!res.ok) {
        const msg = getDraftErrorMessage(res.status);
        setDraftError(msg);
        setTimeout(() => setDraftError(null), 3000);
        return;
      }
      const json = (await res.json()) as { draft?: string };
      if (json.draft) {
        setDraftText(json.draft);
      }
      router.refresh();
    } catch {
      setDraftError("Unknown error — try again");
      setTimeout(() => setDraftError(null), 3000);
    } finally {
      setIsDrafting(false);
    }
  }

  return (
    <div
      className={`mt-2 rounded-b-md border-x border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-4 transition-opacity ${
        isDisabled ? "opacity-50" : ""
      }`}
    >
      {/* Lead metadata */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetaField label="Company" value={lead.company ?? "—"} />
        <MetaField
          label="Contact"
          value={
            lead.lead_name
              ? `${lead.lead_name} · ${lead.lead_email}`
              : lead.lead_email
          }
        />
        <MetaField
          label="ICP Score"
          value={lead.icp_score != null ? String(lead.icp_score) : "—"}
        />
        <MetaField
          label="Campaign"
          value={
            lead.smartlead_campaign_name
              ? `${lead.smartlead_campaign_name}${
                  lead.smartlead_sequence_step != null
                    ? ` · step ${lead.smartlead_sequence_step}`
                    : ""
                }`
              : "—"
          }
        />
      </div>

      {/* Queue item details */}
      {queueItem ? (
        <div className="mb-4">
          {queueItem.subject && queueItem.gmail_thread_id && (
            <a
              href={`https://mail.google.com/mail/u/0/#all/${queueItem.gmail_thread_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-mono text-sm text-[#92B090] hover:underline"
            >
              {queueItem.subject}
            </a>
          )}
          {queueItem.body_snippet && (
            <p className="mt-1 font-mono text-xs text-[var(--text-muted)] line-clamp-3">
              {queueItem.body_snippet}
            </p>
          )}
        </div>
      ) : (
        <p className="mb-4 font-mono text-xs text-[var(--text-muted)]">
          No reply received — compose outreach
        </p>
      )}

      {/* Draft textarea */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Draft
          </label>
          {isSavingDraft && (
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              saving…
            </span>
          )}
        </div>
        <textarea
          value={draftText}
          onChange={handleDraftChange}
          disabled={isDisabled}
          placeholder="Draft your outreach..."
          rows={6}
          className={`w-full resize-y rounded border bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#92B090]/50 ${
            isSavingDraft
              ? "border-[#92B090]/40"
              : "border-[var(--border-subtle)]"
          }`}
        />
      </div>

      {/* Action buttons */}
      {queueItem && (
        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            onClick={handleApprove}
            disabled={isDisabled}
            variant="primary"
          >
            Approve &amp; copy
          </ActionButton>
          <ActionButton
            onClick={handleDismiss}
            disabled={isDisabled}
            variant="ghost"
          >
            Dismiss
          </ActionButton>
          <ActionButton
            onClick={handleSnooze}
            disabled={isDisabled}
            variant="ghost"
          >
            Snooze 24h
          </ActionButton>

          <div className="ml-auto flex items-center gap-2">
            {draftError && (
              <span className="font-mono text-xs text-red-400">
                {draftError}
              </span>
            )}
            <ActionButton
              onClick={handleDraftWithClaude}
              disabled={isDisabled}
              variant="secondary"
            >
              {isDrafting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Drafting…
                </span>
              ) : (
                "Draft with Claude"
              )}
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-0.5 truncate font-mono text-xs text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  variant: "primary" | "secondary" | "ghost";
}) {
  const base =
    "rounded px-3 py-1.5 font-mono text-xs transition-colors disabled:cursor-not-allowed";
  const styles = {
    primary:
      "bg-[#92B090]/20 text-[#92B090] hover:bg-[#92B090]/30 disabled:opacity-50",
    secondary:
      "border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-50",
    ghost:
      "text-[var(--text-muted)] hover:text-[var(--text-tertiary)] disabled:opacity-50",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

// Card for unmatched queue items (no lead metadata)
interface UnmatchedCardProps {
  item: UnmatchedQueueItem;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onAction: () => void;
  onActionDone: () => void;
  isDrafting: boolean;
  setIsDrafting: (v: boolean) => void;
}

function UnmatchedCard({
  item,
  expandedId,
  setExpandedId,
  onAction,
  onActionDone,
}: UnmatchedCardProps) {
  const isExpanded = expandedId === `unmatched-${item.id}`;
  const [actionPending, setActionPending] = useState(false);
  const [draftText, setDraftText] = useState(item.draft_response ?? "");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggle() {
    setExpandedId(isExpanded ? null : `unmatched-${item.id}`);
  }

  const inboxDisplay =
    INBOX_DISPLAY[item.inbox] ?? item.inbox;

  function handleDraftChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setDraftText(val);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setIsSavingDraft(true);
    saveTimerRef.current = setTimeout(async () => {
      await updateDraft(item.id, val).catch(() => null);
      setIsSavingDraft(false);
    }, 800);
  }

  async function handleApprove() {
    if (actionPending) return;
    setActionPending(true);
    onAction();
    try {
      await updateDraft(item.id, draftText);
      await navigator.clipboard.writeText(draftText);
      await approveItem(item.id);
      setExpandedId(null);
    } catch {
      // No-op
    } finally {
      setActionPending(false);
      onActionDone();
    }
  }

  async function handleDismiss() {
    if (actionPending) return;
    setActionPending(true);
    onAction();
    try {
      await dismissItem(item.id);
      setExpandedId(null);
    } catch {
      // No-op
    } finally {
      setActionPending(false);
      onActionDone();
    }
  }

  async function handleSnooze() {
    if (actionPending) return;
    setActionPending(true);
    onAction();
    try {
      await snoozeItem(item.id, new Date(Date.now() + 86_400_000));
      setExpandedId(null);
    } catch {
      // No-op
    } finally {
      setActionPending(false);
      onActionDone();
    }
  }

  return (
    <div
      className={`rounded-md border border-[var(--border-subtle)] transition-opacity ${
        actionPending ? "opacity-50" : ""
      }`}
    >
      {/* Header row */}
      <button
        onClick={toggle}
        className="flex w-full items-center gap-3 bg-[var(--bg-secondary)] px-4 py-3 text-left hover:bg-[var(--bg-tertiary)]"
      >
        {/* Unmatched badge */}
        <span className="shrink-0 rounded border border-orange-800/40 bg-orange-900/20 px-1.5 py-0.5 font-mono text-[10px] text-orange-400">
          unmatched sender
        </span>

        {/* Sender info */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm text-[var(--text-primary)]">
            {item.sender_name
              ? `${item.sender_name} <${item.sender_email}>`
              : item.sender_email}
          </p>
          {item.subject && (
            <p className="truncate font-mono text-xs text-[var(--text-tertiary)]">
              {item.subject}
            </p>
          )}
        </div>

        {/* Inbox */}
        <span className="shrink-0 font-mono text-xs text-[var(--text-muted)]">
          {inboxDisplay}
        </span>

        {/* Classification badge */}
        <ClassificationBadge classification={item.classification} />
      </button>

      {/* Expanded state */}
      {isExpanded && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-4">
          {item.body_snippet && (
            <p className="mb-4 font-mono text-xs text-[var(--text-muted)] line-clamp-4">
              {item.body_snippet}
            </p>
          )}

          {/* Draft textarea */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Draft
              </label>
              {isSavingDraft && (
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  saving…
                </span>
              )}
            </div>
            <textarea
              value={draftText}
              onChange={handleDraftChange}
              disabled={actionPending}
              placeholder="Draft your outreach..."
              rows={5}
              className={`w-full resize-y rounded border bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#92B090]/50 ${
                isSavingDraft
                  ? "border-[#92B090]/40"
                  : "border-[var(--border-subtle)]"
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton
              onClick={handleApprove}
              disabled={actionPending}
              variant="primary"
            >
              Approve &amp; copy
            </ActionButton>
            <ActionButton
              onClick={handleDismiss}
              disabled={actionPending}
              variant="ghost"
            >
              Dismiss
            </ActionButton>
            <ActionButton
              onClick={handleSnooze}
              disabled={actionPending}
              variant="ghost"
            >
              Snooze 24h
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}

// Matched lead card (compact header + expanded detail)
interface LeadCardProps {
  lead: EnrichedLead;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onAction: () => void;
  onActionDone: () => void;
  isDrafting: boolean;
  setIsDrafting: (v: boolean) => void;
}

function LeadCard({
  lead,
  expandedId,
  setExpandedId,
  onAction,
  onActionDone,
  isDrafting,
  setIsDrafting,
}: LeadCardProps) {
  const isExpanded = expandedId === lead.lead_id;
  const queueItem = lead.queueItem;

  function toggle() {
    setExpandedId(isExpanded ? null : lead.lead_id);
  }

  const inboxDisplay = queueItem
    ? INBOX_DISPLAY[queueItem.inbox] ?? queueItem.inbox
    : null;

  return (
    <div className="rounded-md border border-[var(--border-subtle)]">
      {/* Header row */}
      <button
        onClick={toggle}
        className="flex w-full items-center gap-3 bg-[var(--bg-secondary)] px-4 py-3 text-left hover:bg-[var(--bg-tertiary)]"
      >
        {/* Company */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm text-[var(--text-primary)]">
            {lead.company ?? lead.lead_email}
          </p>
          {(lead.lead_name || queueItem?.subject) && (
            <p className="truncate font-mono text-xs text-[var(--text-tertiary)]">
              {lead.lead_name && `${lead.lead_name} · `}
              {queueItem?.subject ?? lead.lead_email}
            </p>
          )}
        </div>

        {/* Inbox */}
        {inboxDisplay && (
          <span className="shrink-0 font-mono text-xs text-[var(--text-muted)]">
            {inboxDisplay}
          </span>
        )}

        {/* Classification badge */}
        {queueItem && (
          <ClassificationBadge classification={queueItem.classification} />
        )}

        {/* Days silent indicator */}
        {lead.days_silent > 0 && lead.days_silent < 999 && (
          <span
            className={`shrink-0 font-mono text-xs ${
              lead.days_silent > 14
                ? "text-red-400"
                : lead.days_silent > 7
                  ? "text-yellow-400"
                  : "text-[var(--text-muted)]"
            }`}
          >
            {lead.days_silent}d
          </span>
        )}
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <RespondCard
          lead={lead}
          isDrafting={isDrafting}
          setIsDrafting={setIsDrafting}
          onAction={onAction}
          onActionDone={onActionDone}
          onRemove={() => setExpandedId(null)}
        />
      )}
    </div>
  );
}

export function RespondNowSection({
  leads,
  unmatchedItems,
  filterType,
  expandedId,
  setExpandedId,
  onAction,
  onActionDone,
  isDrafting,
  setIsDrafting,
}: RespondNowSectionProps) {
  // Section filter: (waiting_on === "us" && not dead) OR has a queue item
  const sectionLeads = leads
    .filter((l) => filterType === "all" || l.type === filterType)
    .filter(
      (l) =>
        (l.waiting_on === "us" && l.thread_state !== "dead") ||
        l.queueItem !== null
    );

  // Sort: queue items first (received_at DESC), then manual leads (days_silent DESC)
  const withQueue = sectionLeads
    .filter((l) => l.queueItem !== null)
    .sort(
      (a, b) =>
        new Date(b.queueItem!.received_at).getTime() -
        new Date(a.queueItem!.received_at).getTime()
    );

  const withoutQueue = sectionLeads
    .filter((l) => l.queueItem === null)
    .sort((a, b) => b.days_silent - a.days_silent);

  const sortedLeads = [...withQueue, ...withoutQueue];
  const total = unmatchedItems.length + sortedLeads.length;

  return (
    <section className="mb-8">
      <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Respond Now ({total})
      </h2>

      {total === 0 ? (
        <div className="flex items-center gap-2 py-4 font-mono text-sm text-[var(--text-muted)]">
          <CheckCircle className="h-4 w-4 text-[#92B090]" />
          All clear — nothing needs a response ✓
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Unmatched items first */}
          {unmatchedItems.map((item) => (
            <UnmatchedCard
              key={`unmatched-${item.id}`}
              item={item}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onAction={onAction}
              onActionDone={onActionDone}
              isDrafting={isDrafting}
              setIsDrafting={setIsDrafting}
            />
          ))}

          {/* Matched leads */}
          {sortedLeads.map((lead) => (
            <LeadCard
              key={lead.lead_id}
              lead={lead}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onAction={onAction}
              onActionDone={onActionDone}
              isDrafting={isDrafting}
              setIsDrafting={setIsDrafting}
            />
          ))}
        </div>
      )}
    </section>
  );
}
