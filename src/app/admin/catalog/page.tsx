import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DatasetCategory } from "@/types/data-catalog";
import AdminCatalogHeader from "./AdminCatalogHeader";
import AdminCatalogTable from "./AdminCatalogTable";

/**
 * Admin catalog dashboard (server component).
 *
 * Fetches all datasets with their categories from Supabase using the
 * service-role client and hands data to the interactive client-side table
 * for filtering, searching, and linking to edit pages.
 *
 * Protected by middleware -- only accessible with a valid admin-token cookie.
 */
export default async function AdminCatalogPage() {
  const supabase = createSupabaseAdminClient();

  const [datasetsResult, categoriesResult] = await Promise.all([
    supabase
      .from("datasets")
      .select("*, dataset_categories(name)")
      .order("name"),
    supabase
      .from("dataset_categories")
      .select("*")
      .order("display_order", { ascending: true }),
  ]);

  if (datasetsResult.error) {
    return (
      <div className="min-h-screen">
        <AdminCatalogHeader />
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-mono text-[var(--error)]">
            <span className="opacity-60">error: </span>
            {datasetsResult.error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminCatalogHeader />
      <AdminCatalogTable
        datasets={datasetsResult.data ?? []}
        categories={(categoriesResult.data as DatasetCategory[]) ?? []}
      />
    </div>
  );
}
