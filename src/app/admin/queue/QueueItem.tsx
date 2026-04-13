"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Check, X, Clock, User, ExternalLink } from "lucide-react";

function relativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
import {
  approveItem,
  dismissItem,
  snoozeItem,
  updateDraft,
} from "./actions";

const CLASSIFICATION_COLORS: Record<string, string> = {
  interested: "bg-green-900/40 text-green-300 border-green-800/40",
  question: "bg-blue-900/40 text-blue-300 border-blue-800/40",
  requirements: "bg-purple-900/40 text-purple-300 border-purple-800/40",
  not_interested: "bg-zinc-800/60 text-zinc-400 border-zinc-700/40",
  bounce: "bg-red-900/40 text-red-300 border-red-800/40",
  internal_forward: "bg-yellow-900/40 text-yellow-300 border-yellow-800/40",
  unsubscribe: "bg-zinc-800/60 text-zinc-500 border-zinc-700/40",
  unknown: "bg-orange-900/40 text-orange-300 border-orange-800/40",
};

interface QueueEntry {
  id: string;
  lead_id: string | null;
  inbox: string;
  sender_email: string;
  sender_name: string | null;
  gmail_message_id: string;
  gmail_thread_id: string | null;
  received_at: string;
  subject: string | null;
  body_snippet: string | null;
  draft_response: string | null;
  draft_status: string;
  snoozed_until: string | null;
  classification: string;
  leads: {
    name: string | null;
    company: string | null;
    email: string | null;
  } | null;
}

export function QueueItem({ item }: { item: QueueEntry }) {
  const [draft, setDraft] = useState(item.draft_response ?? "");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [draft]);

  const classColor =
    CLASSIFICATION_COLORS[item.classification] ??
    CLASSIFICATION_COLORS.unknown;

  const handleApprove = () => {
    startTransition(async () => {
      // Copy draft to clipboard
      if (draft) {
        await navigator.clipboard.writeText(draft).catch(() => {});
      }
      await approveItem(item.id);
    });
  };

  const handleDismiss = () => {
    startTransition(() => dismissItem(item.id));
  };

  const handleSnooze = () => {
    const until = new Date();
    until.setHours(until.getHours() + 24);
    startTransition(() => snoozeItem(item.id, until));
  };

  const handleDraftBlur = () => {
    if (draft !== (item.draft_response ?? "")) {
      startTransition(() => updateDraft(item.id, draft));
    }
  };

  return (
    <div
      className={`rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 transition-opacity ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-mono text-sm text-[var(--text-primary)]">
            <User className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
            <span className="font-medium">
              {item.sender_name ?? item.sender_email}
            </span>
            {item.sender_name && (
              <span className="text-[var(--text-tertiary)]">
                &lt;{item.sender_email}&gt;
              </span>
            )}
          </div>

          {item.leads?.company && (
            <p className="mt-0.5 pl-5 text-xs font-mono text-[var(--text-tertiary)]">
              {item.leads.company}
              {item.leads.name ? ` · ${item.leads.name}` : ""}
            </p>
          )}

          {!item.lead_id && (
            <p className="mt-0.5 pl-5 text-xs font-mono text-orange-400">
              Unmatched sender — assign to a lead
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Classification badge */}
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-mono capitalize ${classColor}`}
          >
            {item.classification.replace(/_/g, " ")}
          </span>

          {/* Inbox badge — colored by account */}
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-mono ${
              item.inbox === "claru"
                ? "border-[#92B090]/40 bg-[#92B090]/10 text-[#92B090]"
                : "border-blue-800/40 bg-blue-900/20 text-blue-300"
            }`}
          >
            {item.inbox === "claru" ? "claru.ai" : "moonvalley.com"}
          </span>

          {/* Relative time */}
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {relativeTime(item.received_at)}
          </span>
        </div>
      </div>

      {/* Subject — links to original Gmail thread */}
      {item.subject && (
        <a
          href={`https://mail.google.com/mail/#all/${item.gmail_thread_id ?? item.gmail_message_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 flex items-center gap-1.5 text-sm font-mono font-medium text-[var(--text-primary)] hover:text-[#92B090] transition-colors group"
        >
          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" strokeWidth={2} />
          {item.subject}
        </a>
      )}

      {/* Body snippet */}
      {item.body_snippet && (
        <p className="mb-4 text-sm font-mono text-[var(--text-tertiary)] leading-relaxed whitespace-pre-wrap">
          {item.body_snippet}
        </p>
      )}

      {/* Draft response */}
      <div className="mb-4">
        {item.draft_status === "needs_manual_draft" && (
          <p className="mb-1.5 text-xs font-mono text-orange-400">
            Needs manual draft
          </p>
        )}
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleDraftBlur}
          placeholder="Draft response..."
          className="w-full resize-none rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#92B090] focus:outline-none transition-colors"
          rows={3}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md bg-[#92B090]/20 px-3 py-1.5 text-xs font-mono text-[#92B090] hover:bg-[#92B090]/30 disabled:opacity-50 transition-colors"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
          Approve &amp; copy
        </button>

        <button
          onClick={handleDismiss}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--text-tertiary)] hover:border-red-800/60 hover:text-red-400 disabled:opacity-50 transition-colors"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
          Dismiss
        </button>

        <button
          onClick={handleSnooze}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--text-tertiary)] hover:border-yellow-800/60 hover:text-yellow-400 disabled:opacity-50 transition-colors"
        >
          <Clock className="h-3.5 w-3.5" strokeWidth={2} />
          Snooze 24h
        </button>
      </div>
    </div>
  );
}
