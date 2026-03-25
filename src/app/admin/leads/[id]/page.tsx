export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import LeadDetailClient from "@/app/admin/components/LeadDetailClient";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Admin lead detail page (server component).
 *
 * Loads the lead by ID from Supabase and passes it along with all datasets
 * and current grants to the client-side detail component.
 *
 * Protected by middleware -- only accessible with a valid admin-token cookie.
 */
export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Fetch lead
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (leadErr || !lead) {
    notFound();
  }

  // Fetch current dataset access grants with dataset info
  const { data: grants } = await supabase
    .from("lead_dataset_access")
    .select("*, datasets(*, dataset_categories(name))")
    .eq("lead_id", id);

  // Fetch all datasets for the selector (grouped by category)
  const { data: allDatasets } = await supabase
    .from("datasets")
    .select("*, dataset_categories(name)")
    .eq("is_published", true)
    .order("name");

  // Fetch custom samples added specifically for this lead (via dataset_clips + clips)
  const { data: customSamplesRaw } = await supabase
    .from("dataset_clips")
    .select("*, clips(*), datasets(name)")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  // Flatten: merge clip data with dataset_clip metadata for the UI
  const customSamples = (customSamplesRaw ?? [])
    .filter((dc: Record<string, unknown>) => dc.clips != null)
    .map((dc: Record<string, unknown>) => {
      const clip = dc.clips as Record<string, unknown>;
      return {
        // Spread clip fields as the base (id, s3_key, filename, etc.)
        ...clip,
        // Map clip fields to legacy names the UI expects
        s3_object_key: clip.s3_key as string | null,
        // Overlay dataset_clip metadata
        dataset_id: dc.dataset_id as string,
        dataset_clip_id: dc.id as string,
        lead_id: dc.lead_id as string | null,
        added_by: dc.added_by as string | null,
        note: dc.note as string | null,
        created_at: dc.created_at as string,
        // Ensure required clip fields are typed
        id: clip.id as string,
        filename: clip.filename as string | null,
        s3_key: clip.s3_key as string | null,
        // Nested dataset relation
        datasets: dc.datasets as { name: string } | null,
      };
    });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-mono font-semibold tracking-tight">
          claru
          <span className="text-[var(--accent-primary)]">/</span>
          admin
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-secondary)]">leads</span>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-tertiary)]">detail</span>
        </h1>
      </header>

      <LeadDetailClient
        initialLead={lead}
        initialGrants={grants ?? []}
        allDatasets={allDatasets ?? []}
        initialCustomSamples={customSamples ?? []}
      />
    </div>
  );
}
