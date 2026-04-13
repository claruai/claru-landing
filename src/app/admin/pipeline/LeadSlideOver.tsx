"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, ChevronDown, ChevronUp, Loader2, Search, Check } from "lucide-react";
import type { EnrichedLead, UnmatchedQueueItem } from "./page";
import {
  approveItem,
  dismissItem,
  snoozeItem,
  updateDraft,
} from "@/app/admin/queue/actions";
import { moveLeadToColumn, updateDealStage, updateSamplePackStatus } from "./actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityEvent = {
  type: "inbound" | "outbound" | "note";
  date: string;
  subject?: string;
  body?: string;
  classification?: string;
  draft_status?: string;
  draft_response?: string;
  step?: number;
  source: "reply_queue" | "smartlead" | "attio";
};

type SampleClip = {
  id: string;
  ai_caption: string;
  s3_object_key: string | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const INBOX_DISPLAY: Record<string, string> = {
  claru: "claru.ai",
  moonvalley: "moonvalley.com",
};

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

type Column = "respond" | "their-court" | "nurturing" | "cold";

const COLUMN_LABELS: Record<Column, string> = {
  respond: "Respond Now",
  "their-court": "Waiting on Them",
  nurturing: "Nurturing",
  cold: "Cold",
};

const DEAL_STAGES: { key: string; label: string }[] = [
  { key: "outreach", label: "Outreach" },
  { key: "engaged", label: "Engaged" },
  { key: "qualified", label: "Qualified" },
  { key: "sample_pack", label: "Sample Pack" },
  { key: "proposal", label: "Proposal" },
  { key: "nda", label: "NDA" },
  { key: "contract", label: "Contract" },
  { key: "closed", label: "Closed ✓" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDraftErrorMessage(status: number): string {
  if (status === 429) return "Rate limited — try in 30s";
  if (status === 503) return "Claude is busy — try again";
  if (status === 504 || status === 408) return "Request timed out — try again";
  return "Unknown error — try again";
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(diff / 86_400_000);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
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

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LeadSlideOverProps {
  lead: EnrichedLead | null;
  unmatchedItem: UnmatchedQueueItem | null;
  positionInQueue: number | undefined;
  totalInQueue: number | undefined;
  isDrafting: boolean;
  setIsDrafting: (v: boolean) => void;
  onClose: () => void;
  onAdvance: () => void;
  onRemove: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LeadSlideOver({
  lead,
  unmatchedItem,
  positionInQueue,
  totalInQueue,
  isDrafting,
  setIsDrafting,
  onClose,
  onAdvance,
  onRemove,
}: LeadSlideOverProps) {
  const router = useRouter();

  const queueItem = lead?.queueItem ?? unmatchedItem ?? null;
  const isMatched = !!lead;

  // ── Draft state ──
  const [draftText, setDraftText] = useState(queueItem?.draft_response ?? "");
  const [actionPending, setActionPending] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Refinement state ──
  const [refinementText, setRefinementText] = useState("");
  const [iterationCount, setIterationCount] = useState(0);

  // ── Deal stage state ──
  const [dealStage, setDealStage] = useState(lead?.deal_stage ?? "outreach");

  // ── Activity timeline state ──
  const [activityOpen, setActivityOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityEvent[] | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // ── Sample pack state ──
  const [samplePackOpen, setSamplePackOpen] = useState(false);
  const [sampleQuery, setSampleQuery] = useState(lead?.data_needs ?? "");
  const [sampleResults, setSampleResults] = useState<SampleClip[] | null>(null);
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [isSearchingClips, setIsSearchingClips] = useState(false);
  const [packRequested, setPackRequested] = useState(
    !!(lead?.sample_pack_status && lead.sample_pack_status !== "none")
  );

  const isDisabled = actionPending || isDrafting;

  // ── Reset all state when selected item changes ──
  useEffect(() => {
    setDraftText(queueItem?.draft_response ?? "");
    setDraftError(null);
    setActionPending(false);
    setRefinementText("");
    setIterationCount(0);
    setDealStage(lead?.deal_stage ?? "outreach");
    setActivityOpen(false);
    setActivities(null);
    setSamplePackOpen(false);
    setSampleQuery(lead?.data_needs ?? "");
    setSampleResults(null);
    setSelectedClips([]);
    setPackRequested(!!(lead?.sample_pack_status && lead.sample_pack_status !== "none"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueItem?.id]);

  // ── Load activities when accordion opens ──
  useEffect(() => {
    if (!activityOpen || !lead || activities !== null) return;
    setIsLoadingActivities(true);
    fetch(`/api/admin/lead-context/${lead.lead_id}`)
      .then((r) => r.json())
      .then((data: { events?: ActivityEvent[] }) =>
        setActivities(data.events ?? [])
      )
      .catch(() => setActivities([]))
      .finally(() => setIsLoadingActivities(false));
  }, [activityOpen, lead, activities]);

  // ── Escape to close ──
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // ── Draft auto-save ──
  async function flushDraft(text: string) {
    if (!queueItem) return;
    await updateDraft(queueItem.id, text).catch(() => null);
  }

  function handleDraftChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setDraftText(val);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (queueItem) {
      setIsSavingDraft(true);
      saveTimerRef.current = setTimeout(async () => {
        await updateDraft(queueItem.id, val).catch(() => null);
        setIsSavingDraft(false);
      }, 800);
    }
  }

  // ── Action handlers ──
  async function handleApprove() {
    if (!queueItem || isDisabled) return;
    setActionPending(true);
    try {
      await flushDraft(draftText);
      await navigator.clipboard.writeText(draftText);
      await approveItem(queueItem.id);
      onRemove();
    } catch {
      setActionPending(false);
    }
  }

  async function handleDismiss() {
    if (!queueItem || isDisabled) return;
    setActionPending(true);
    try {
      await dismissItem(queueItem.id);
      onRemove();
    } catch {
      setActionPending(false);
    }
  }

  async function handleSnooze() {
    if (!queueItem || isDisabled) return;
    setActionPending(true);
    try {
      await snoozeItem(queueItem.id, new Date(Date.now() + 86_400_000));
      onRemove();
    } catch {
      setActionPending(false);
    }
  }

  async function handleDraftWithClaude() {
    if (!lead || !queueItem || isDrafting) return;
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
        setDraftError(getDraftErrorMessage(res.status));
        setTimeout(() => setDraftError(null), 3000);
        return;
      }
      const json = (await res.json()) as { draft?: string };
      if (json.draft) setDraftText(json.draft);
      router.refresh();
    } catch {
      setDraftError("Unknown error — try again");
      setTimeout(() => setDraftError(null), 3000);
    } finally {
      setIsDrafting(false);
    }
  }

  async function handleRefine() {
    if (!lead || !queueItem || isDrafting || !refinementText.trim() || !draftText)
      return;
    setDraftError(null);
    setIsDrafting(true);
    try {
      const res = await fetch("/api/admin/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.lead_id,
          queueItemId: queueItem.id,
          previousDraft: draftText,
          feedback: refinementText.trim(),
        }),
      });
      if (!res.ok) {
        setDraftError(getDraftErrorMessage(res.status));
        setTimeout(() => setDraftError(null), 3000);
        return;
      }
      const json = (await res.json()) as { draft?: string };
      if (json.draft) {
        setDraftText(json.draft);
        setIterationCount((c) => c + 1);
        setRefinementText("");
      }
    } catch {
      setDraftError("Unknown error — try again");
      setTimeout(() => setDraftError(null), 3000);
    } finally {
      setIsDrafting(false);
    }
  }

  async function handleMoveTo(col: Column) {
    if (!lead) return;
    setMoveMenuOpen(false);
    try {
      await moveLeadToColumn(lead.lead_id, col);
    } catch {
      // Server revalidates on success
    }
  }

  async function handleDealStageClick(stage: string) {
    if (!lead) return;
    const prev = dealStage;
    setDealStage(stage);
    try {
      await updateDealStage(lead.lead_id, stage);
    } catch {
      setDealStage(prev);
    }
  }

  async function handleSampleSearch() {
    if (!sampleQuery.trim()) return;
    setIsSearchingClips(true);
    setSampleResults(null);
    try {
      const res = await fetch(
        `/api/admin/sample-pack-search?q=${encodeURIComponent(sampleQuery)}`
      );
      if (res.ok) {
        const data = (await res.json()) as { clips: SampleClip[] };
        setSampleResults(data.clips ?? []);
      }
    } catch {
      setSampleResults([]);
    } finally {
      setIsSearchingClips(false);
    }
  }

  function toggleClip(clipId: string) {
    setSelectedClips((prev) =>
      prev.includes(clipId)
        ? prev.filter((id) => id !== clipId)
        : [...prev, clipId]
    );
  }

  async function handleRequestPack() {
    if (!lead || selectedClips.length === 0) return;
    try {
      await updateSamplePackStatus(lead.lead_id, "requested", selectedClips);
      setPackRequested(true);
      setSamplePackOpen(false);
    } catch {
      // Keep open
    }
  }

  // ── Derived values ──
  const badge = queueItem?.classification
    ? (CLASSIFICATION_BADGE[queueItem.classification] ?? CLASSIFICATION_BADGE.other)
    : null;
  const inboxDisplay = queueItem
    ? (INBOX_DISPLAY[queueItem.inbox] ?? queueItem.inbox)
    : null;
  const displayName =
    lead?.company ??
    unmatchedItem?.sender_name ??
    unmatchedItem?.sender_email ??
    "Unknown";
  const showPositionCounter =
    positionInQueue != null && totalInQueue != null && totalInQueue > 0;

  return (
    <>
      {/* Transparent backdrop */}
      <div className="fixed inset-0 z-30" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="fixed right-0 top-0 z-40 flex h-full w-[480px] flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
          <h3 className="min-w-0 flex-1 truncate font-mono text-sm font-semibold text-[var(--text-primary)]">
            {displayName}
          </h3>

          <div className="ml-3 flex shrink-0 items-center gap-2">
            {/* Move to dropdown */}
            {isMatched && (
              <div className="relative">
                <button
                  onClick={() => setMoveMenuOpen((o) => !o)}
                  className="rounded border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-xs text-[var(--text-tertiary)] transition-colors hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]"
                >
                  Move to ▾
                </button>
                {moveMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMoveMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-8 z-50 min-w-[180px] rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-lg">
                      {(Object.keys(COLUMN_LABELS) as Column[]).map((col) => (
                        <button
                          key={col}
                          onClick={() => handleMoveTo(col)}
                          className="block w-full px-3 py-2 text-left font-mono text-xs text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                        >
                          {COLUMN_LABELS[col]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded p-1 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Lead contact metadata */}
          {lead && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
                <MetaField
                  label="Contact"
                  value={lead.lead_name ?? lead.lead_email}
                />
                <MetaField
                  label="ICP Score"
                  value={
                    lead.icp_score != null ? String(lead.icp_score) : "—"
                  }
                />
                <MetaField label="Email" value={lead.lead_email} />
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
                {lead.data_needs && (
                  <MetaField label="Data Needs" value={lead.data_needs} />
                )}
                {lead.use_case && (
                  <MetaField label="Use Case" value={lead.use_case} />
                )}
              </div>

              {/* Deal stage pills */}
              <div className="mt-3 flex flex-wrap gap-1">
                {DEAL_STAGES.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleDealStageClick(key)}
                    className={`rounded px-2 py-0.5 font-mono text-[10px] transition-colors ${
                      dealStage === key
                        ? "bg-[#92B090]/15 text-[#92B090] ring-1 ring-[#92B090]/40"
                        : "text-[var(--text-muted)] hover:text-[var(--text-tertiary)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!lead && unmatchedItem && (
            <div className="mb-5">
              <MetaField label="Sender" value={unmatchedItem.sender_email} />
            </div>
          )}

          {/* Email detail */}
          {queueItem && (
            <div className="mb-4 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3">
              <div className="mb-2 flex items-center gap-2">
                {badge && (
                  <span
                    className={`rounded border px-1.5 py-0.5 font-mono text-[10px] capitalize ${badge.text} ${badge.border} ${badge.bg}`}
                  >
                    {queueItem.classification}
                  </span>
                )}
                {inboxDisplay && (
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {inboxDisplay}
                  </span>
                )}
              </div>

              {queueItem.subject && (
                <div className="mb-2">
                  {queueItem.gmail_thread_id ? (
                    <a
                      href={`https://mail.google.com/mail/u/0/#all/${queueItem.gmail_thread_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-[#92B090] hover:underline"
                    >
                      {queueItem.subject}
                    </a>
                  ) : (
                    <p className="font-mono text-sm text-[var(--text-primary)]">
                      {queueItem.subject}
                    </p>
                  )}
                </div>
              )}

              {queueItem.body_snippet && (
                <p className="font-mono text-xs leading-relaxed text-[var(--text-muted)] line-clamp-4">
                  {queueItem.body_snippet}
                </p>
              )}
            </div>
          )}

          {!queueItem && (
            <p className="mb-4 font-mono text-xs text-[var(--text-muted)]">
              No reply received — compose outreach
            </p>
          )}

          {/* Draft textarea */}
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Draft
                {iterationCount > 0 && (
                  <span className="ml-1.5 text-[#92B090]">
                    · iteration {iterationCount + 1}
                  </span>
                )}
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
              placeholder="Draft your reply..."
              rows={8}
              className={`w-full resize-y rounded border bg-[var(--bg-secondary)] px-3 py-2.5 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#92B090]/50 ${
                isSavingDraft
                  ? "border-[#92B090]/40"
                  : "border-[var(--border-subtle)]"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            />

            {/* Refinement input */}
            {isMatched && draftText && (
              <div className="mt-2 flex gap-2">
                <input
                  value={refinementText}
                  onChange={(e) => setRefinementText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleRefine();
                    }
                  }}
                  disabled={isDisabled}
                  placeholder="Refine: make it shorter, remove last sentence…"
                  className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#92B090]/50 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  onClick={handleRefine}
                  disabled={isDisabled || !refinementText.trim()}
                  className="rounded border border-[var(--border-subtle)] px-2.5 py-1.5 font-mono text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isDrafting && refinementText ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "→"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {queueItem && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button
                onClick={handleApprove}
                disabled={isDisabled}
                className="rounded bg-[#92B090]/20 px-3 py-1.5 font-mono text-xs text-[#92B090] transition-colors hover:bg-[#92B090]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Approve &amp; copy
              </button>
              <button
                onClick={handleDismiss}
                disabled={isDisabled}
                className="rounded px-3 py-1.5 font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-tertiary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Dismiss
              </button>
              <button
                onClick={handleSnooze}
                disabled={isDisabled}
                className="rounded px-3 py-1.5 font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-tertiary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Snooze 24h
              </button>

              <div className="ml-auto flex items-center gap-2">
                {draftError && (
                  <span className="font-mono text-xs text-red-400">
                    {draftError}
                  </span>
                )}
                {/* Sample Pack button */}
                {isMatched && (
                  <button
                    onClick={() => setSamplePackOpen((o) => !o)}
                    disabled={isDisabled}
                    className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      packRequested
                        ? "border-[#92B090]/40 text-[#92B090]"
                        : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-tertiary)]"
                    }`}
                  >
                    {packRequested ? "Pack ✓" : "Sample Pack"}
                  </button>
                )}
                {/* Draft with Claude button */}
                {isMatched && (
                  <button
                    onClick={handleDraftWithClaude}
                    disabled={isDisabled}
                    className="rounded border border-[var(--border-subtle)] px-3 py-1.5 font-mono text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDrafting && !refinementText ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Drafting…
                      </span>
                    ) : (
                      "Draft ✦"
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Sample pack inline panel */}
          {samplePackOpen && isMatched && (
            <div className="mb-4 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Sample Pack
              </p>
              <div className="flex gap-2">
                <input
                  value={sampleQuery}
                  onChange={(e) => setSampleQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSampleSearch();
                  }}
                  placeholder="What task type / scene? e.g. kitchen manipulation"
                  className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-2.5 py-1.5 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#92B090]/50"
                />
                <button
                  onClick={handleSampleSearch}
                  disabled={isSearchingClips}
                  className="rounded border border-[var(--border-subtle)] p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-50"
                >
                  {isSearchingClips ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Search className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {sampleResults !== null && sampleResults.length === 0 && (
                <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">
                  No clips found. Try different keywords.
                </p>
              )}

              {sampleResults && sampleResults.length > 0 && (
                <>
                  <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                    {sampleResults.map((clip) => {
                      const isSelected = selectedClips.includes(clip.id);
                      return (
                        <div
                          key={clip.id}
                          onClick={() => toggleClip(clip.id)}
                          className={`flex cursor-pointer items-start gap-2 rounded px-2 py-1.5 transition-colors ${
                            isSelected
                              ? "bg-[#92B090]/10 ring-1 ring-[#92B090]/30"
                              : "hover:bg-[var(--bg-tertiary)]"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                              isSelected
                                ? "border-[#92B090] bg-[#92B090]/20"
                                : "border-[var(--border-subtle)]"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-2.5 w-2.5 text-[#92B090]" />
                            )}
                          </div>
                          <p className="font-mono text-[10px] leading-relaxed text-[var(--text-tertiary)] line-clamp-2">
                            {clip.ai_caption}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {selectedClips.length} clip
                      {selectedClips.length !== 1 ? "s" : ""} selected
                    </span>
                    <button
                      onClick={handleRequestPack}
                      disabled={selectedClips.length === 0}
                      className="rounded bg-[#92B090]/20 px-3 py-1 font-mono text-xs text-[#92B090] transition-colors hover:bg-[#92B090]/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Request Pack
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Activity timeline accordion */}
          {lead && (
            <div className="mt-2">
              <button
                onClick={() => setActivityOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded px-1 py-1.5 font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-tertiary)]"
              >
                <span className="uppercase tracking-wider">Activity</span>
                {activityOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {activityOpen && (
                <div className="mt-1 space-y-2">
                  {isLoadingActivities && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />
                    </div>
                  )}

                  {!isLoadingActivities && activities?.length === 0 && (
                    <p className="py-2 font-mono text-xs text-[var(--text-muted)]">
                      No activity yet.
                    </p>
                  )}

                  {!isLoadingActivities &&
                    activities?.map((event, i) => {
                      const eventBadge =
                        event.classification
                          ? (CLASSIFICATION_BADGE[event.classification] ??
                            CLASSIFICATION_BADGE.other)
                          : null;

                      return (
                        <div
                          key={i}
                          className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2"
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                                event.type === "inbound"
                                  ? "bg-blue-900/20 text-blue-400"
                                  : event.type === "outbound"
                                    ? "bg-zinc-800/40 text-zinc-400"
                                    : "bg-purple-900/20 text-purple-400"
                              }`}
                            >
                              {event.type}
                              {event.step != null && ` · step ${event.step}`}
                            </span>

                            {eventBadge && event.classification && (
                              <span
                                className={`rounded border px-1 py-0.5 font-mono text-[9px] capitalize ${eventBadge.text} ${eventBadge.border} ${eventBadge.bg}`}
                              >
                                {event.classification}
                              </span>
                            )}

                            <span className="ml-auto font-mono text-[9px] text-[var(--text-muted)]">
                              {relativeTime(event.date)}
                            </span>
                          </div>

                          {event.subject && (
                            <p className="mb-1 font-mono text-xs font-medium text-[var(--text-primary)]">
                              {event.subject}
                            </p>
                          )}

                          {event.body && (
                            <p className="font-mono text-[10px] leading-relaxed text-[var(--text-muted)] line-clamp-3">
                              {event.body.slice(0, 300)}
                            </p>
                          )}

                          {event.draft_response && (
                            <p className="mt-1 border-t border-[var(--border-subtle)] pt-1 font-mono text-[10px] leading-relaxed text-[var(--text-muted)] line-clamp-2">
                              Draft: {event.draft_response.slice(0, 200)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: position counter + Next */}
        {showPositionCounter && (
          <div className="flex shrink-0 items-center justify-between border-t border-[var(--border-subtle)] px-5 py-3">
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {positionInQueue} of {totalInQueue}
            </span>
            <button
              onClick={onAdvance}
              disabled={positionInQueue >= totalInQueue!}
              className="flex items-center gap-0.5 font-mono text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
