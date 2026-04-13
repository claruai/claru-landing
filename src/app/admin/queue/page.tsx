import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/admin-auth";
import { QueueList } from "./QueueList";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  // Auth: admin-token cookie only
  const cookieStore = await cookies();
  if (!(await getAdminSession(cookieStore))) {
    notFound();
  }

  const db = createSupabaseAdminClient();

  // Parallel fetch — queue items + sync error state
  const [{ data: items }, { data: syncState }] = await Promise.all([
    db
      .from("reply_queue")
      .select(
        `
        id,
        lead_id,
        inbox,
        sender_email,
        sender_name,
        gmail_message_id,
        gmail_thread_id,
        subject,
        body_snippet,
        received_at,
        draft_status,
        draft_response,
        snoozed_until,
        classification,
        leads (
          name,
          company,
          email
        )
      `
      )
      .or(
        "draft_status.in.(pending,needs_manual_draft),and(draft_status.eq.snoozed,snoozed_until.lt.now())"
      )
      .order("received_at", { ascending: false }),

    db
      .from("inbox_sync_state")
      .select("inbox, last_error, updated_at")
      .not("last_error", "is", null),
  ]);

  const syncErrors = syncState ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
          Reply Queue
        </h1>
        <p className="mt-1 text-sm font-mono text-[var(--text-tertiary)]">
          Inbound replies awaiting review
        </p>
      </div>

      <QueueList
        items={(items ?? []) as unknown as Parameters<typeof QueueList>[0]["items"]}
        syncErrors={syncErrors}
      />
    </div>
  );
}
