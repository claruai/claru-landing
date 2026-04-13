import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/admin-auth";
import { UnifiedCRMView } from "./UnifiedCRMView";

export const dynamic = "force-dynamic";

export type PipelineLead = {
  lead_id: string;
  lead_name: string | null;
  lead_email: string;
  company: string | null;
  type: string;
  icp_score: number | null;
  thread_state: string;
  waiting_on: string;
  last_touch_at: string | null;
  days_silent: number;
  smartlead_campaign_name: string | null;
  smartlead_sequence_step: number | null;
  deal_stage: string | null;
  sample_pack_status: string | null;
  follow_up_at: string | null;
  data_needs: string | null;
  use_case: string | null;
};

export type QueueItem = {
  id: string;
  lead_id: string | null;
  inbox: string;
  sender_email: string;
  sender_name: string | null;
  gmail_message_id: string;
  gmail_thread_id: string | null;
  subject: string | null;
  body_snippet: string | null;
  received_at: string;
  draft_status: string;
  draft_response: string | null;
  snoozed_until: string | null;
  classification: string;
};

export type EnrichedLead = PipelineLead & {
  queueItem: QueueItem | null;
};

// Queue items with no matching lead — render sender info only, no lead metadata
export type UnmatchedQueueItem = QueueItem;

async function fetchLeads(db: ReturnType<typeof createSupabaseAdminClient>): Promise<PipelineLead[]> {
  const { data: leads, error } = await db.rpc("get_pipeline_leads" as never);

  if (!error) return (leads as PipelineLead[]) ?? [];

  // Fallback to direct query if RPC not yet deployed
  const { data: fallback } = await db
    .from("lead_crm_data")
    .select(
      `
      lead_id,
      type,
      icp_score,
      thread_state,
      waiting_on,
      last_touch_at,
      smartlead_campaign_name,
      smartlead_sequence_step,
      deal_stage,
      sample_pack_status,
      follow_up_at,
      leads (
        name,
        email,
        company,
        data_needs,
        use_case
      )
    `
    )
    // No cold/dead filter — ColdSection needs all thread_states
    .order("last_touch_at", { ascending: true, nullsFirst: true });

  return (fallback ?? []).map((r: Record<string, unknown>) => {
    const lead = r.leads as {
      name: string | null;
      email: string;
      company: string | null;
      data_needs: string | null;
      use_case: string | null;
    } | null;
    const lastTouch = r.last_touch_at as string | null;
    const daysSilent = lastTouch
      ? Math.floor((Date.now() - new Date(lastTouch).getTime()) / 86_400_000)
      : 999;

    return {
      lead_id: r.lead_id as string,
      lead_name: lead?.name ?? null,
      lead_email: lead?.email ?? "",
      company: lead?.company ?? null,
      type: r.type as string,
      icp_score: r.icp_score as number | null,
      thread_state: r.thread_state as string,
      waiting_on: r.waiting_on as string,
      last_touch_at: lastTouch,
      days_silent: daysSilent,
      smartlead_campaign_name: r.smartlead_campaign_name as string | null,
      smartlead_sequence_step: r.smartlead_sequence_step as number | null,
      deal_stage: r.deal_stage as string | null,
      sample_pack_status: r.sample_pack_status as string | null,
      follow_up_at: r.follow_up_at as string | null,
      data_needs: lead?.data_needs ?? null,
      use_case: lead?.use_case ?? null,
    };
  });
}

async function fetchQueueItems(db: ReturnType<typeof createSupabaseAdminClient>): Promise<QueueItem[]> {
  const { data } = await db
    .from("reply_queue")
    .select(
      "id, lead_id, inbox, sender_email, sender_name, gmail_message_id, gmail_thread_id, subject, body_snippet, received_at, draft_status, draft_response, snoozed_until, classification"
    )
    .or(
      "draft_status.in.(pending,needs_manual_draft),and(draft_status.eq.snoozed,snoozed_until.lt.now())"
    )
    .order("received_at", { ascending: false });

  return (data ?? []) as QueueItem[];
}

export default async function PipelinePage() {
  // Auth: admin-token cookie only (local JWT verify — no network call)
  const cookieStore = await cookies();
  if (!(await getAdminSession(cookieStore))) {
    notFound();
  }

  const db = createSupabaseAdminClient();

  // Parallel fetch — leads (throws on total failure, triggers error.tsx) + queue items (graceful on failure)
  const [leads, queueItems] = await Promise.all([
    fetchLeads(db),
    fetchQueueItems(db).catch(() => [] as QueueItem[]),
  ]);

  // Merge: build a map from lead_id → QueueItem
  const queueMap = new Map<string, QueueItem>();
  const unmatchedItems: UnmatchedQueueItem[] = [];

  for (const item of queueItems) {
    if (item.lead_id) {
      queueMap.set(item.lead_id, item);
    } else {
      unmatchedItems.push(item);
    }
  }

  const enrichedLeads: EnrichedLead[] = leads.map((l) => ({
    ...l,
    queueItem: queueMap.get(l.lead_id) ?? null,
  }));

  // Queue items whose lead_id didn't match any lead
  for (const item of queueItems) {
    if (item.lead_id && !leads.some((l) => l.lead_id === item.lead_id)) {
      unmatchedItems.push(item);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
            Pipeline
          </h1>
          <p className="mt-1 text-sm font-mono text-[var(--text-tertiary)]">
            Active leads in motion
          </p>
        </div>
        <Link
          href="/admin/brief"
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 font-mono text-sm text-[var(--text-secondary)] transition-colors hover:border-[#92B090]/40 hover:text-[#92B090]"
        >
          Daily Brief →
        </Link>
      </div>
      <UnifiedCRMView leads={enrichedLeads} unmatchedItems={unmatchedItems} />
    </div>
  );
}
