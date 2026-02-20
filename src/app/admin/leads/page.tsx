import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Lead } from "@/types/data-catalog";
import AdminLeadsHeader from "./AdminLeadsHeader";
import AdminLeadsTable from "./AdminLeadsTable";

/**
 * Admin leads dashboard (server component).
 *
 * Fetches all access-request leads from Supabase using the service-role
 * client and hands data to the interactive client-side table for filtering,
 * searching, and linking to individual lead detail views.
 *
 * Protected by middleware -- only accessible with a valid admin-token cookie.
 */
export default async function AdminLeadsPage() {
  const supabase = createSupabaseAdminClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen">
        <AdminLeadsHeader />
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-mono text-[var(--error)]">
            <span className="opacity-60">error: </span>
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminLeadsHeader />
      <AdminLeadsTable leads={(leads as Lead[]) ?? []} />
    </div>
  );
}
