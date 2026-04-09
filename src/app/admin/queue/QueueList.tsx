"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { QueueItem } from "./QueueItem";

interface SyncError {
  inbox: string;
  last_error: string | null;
  updated_at: string;
}

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

interface QueueListProps {
  items: QueueEntry[];
  syncErrors: SyncError[];
}

export function QueueList({ items, syncErrors }: QueueListProps) {
  const router = useRouter();

  // Auto-refresh every 60s to pull new server data
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 60_000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="space-y-4">
      {/* Sync error banners */}
      {syncErrors.map((err) => (
        <div
          key={err.inbox}
          className="flex items-start gap-3 rounded-lg border border-red-800/40 bg-red-950/30 px-4 py-3 text-sm font-mono"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" strokeWidth={1.5} />
          <div>
            <span className="text-red-300">Gmail sync failed</span>
            {" "}
            <span className="text-[var(--text-tertiary)]">
              ({err.inbox} inbox, at{" "}
              {new Date(err.updated_at).toLocaleString()}):
            </span>{" "}
            <span className="text-red-200">{err.last_error}</span>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-16 text-center">
          <CheckCircle
            className="mb-3 h-8 w-8 text-[#92B090]"
            strokeWidth={1.5}
          />
          <p className="font-mono text-sm text-[var(--text-primary)]">
            No queue items — you're caught up
          </p>
        </div>
      )}

      {/* Queue items */}
      {items.map((item) => (
        <QueueItem key={item.id} item={item} />
      ))}
    </div>
  );
}
