import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { PipelineList } from "./PipelineList";

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
};

export default async function PipelinePage() {
  // Auth check
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdmin(user.email)) {
    notFound();
  }

  const db = createSupabaseAdminClient();

  // Active leads with days_silent computed via COALESCE
  const { data: leads, error } = await db.rpc("get_pipeline_leads" as never);

  if (error) {
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
        leads!inner (
          name,
          email,
          company
        )
      `
      )
      .not("thread_state", "in", '("cold","dead")')
      .order("last_touch_at", { ascending: true, nullsFirst: true });

    const rows: PipelineLead[] = (fallback ?? []).map((r: Record<string, unknown>) => {
      const lead = r.leads as { name: string | null; email: string; company: string | null } | null;
      const lastTouch = r.last_touch_at as string | null;
      const daysSilent = lastTouch
        ? Math.floor(
            (Date.now() - new Date(lastTouch).getTime()) / 86_400_000
          )
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
      };
    });

    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
            Pipeline
          </h1>
          <p className="mt-1 text-sm font-mono text-[var(--text-tertiary)]">
            Active leads in motion
          </p>
        </div>
        <PipelineList leads={rows} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
          Pipeline
        </h1>
        <p className="mt-1 text-sm font-mono text-[var(--text-tertiary)]">
          Active leads in motion
        </p>
      </div>
      <PipelineList leads={(leads as PipelineLead[]) ?? []} />
    </div>
  );
}
