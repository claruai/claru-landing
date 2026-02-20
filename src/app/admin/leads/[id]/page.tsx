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
      />
    </div>
  );
}
