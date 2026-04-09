import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { QueueList } from "./QueueList";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  // Auth check — non-admins get 404
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdmin(user.email)) {
    notFound();
  }

  const db = createSupabaseAdminClient();

  // Fetch pending queue items with lead info
  const { data: items } = await db
    .from("reply_queue")
    .select(
      `
      *,
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
    .order("received_at", { ascending: false });

  // Check inbox sync state for errors
  const { data: syncState } = await db
    .from("inbox_sync_state")
    .select("inbox, last_error, updated_at")
    .not("last_error", "is", null);

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
        items={(items ?? []) as Parameters<typeof QueueList>[0]["items"]}
        syncErrors={syncErrors}
      />
    </div>
  );
}
