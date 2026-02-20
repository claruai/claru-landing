import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DatasetCategory } from "@/types/data-catalog";
import DatasetForm from "../DatasetForm";

/**
 * Admin create dataset page (server component).
 *
 * Fetches categories for the dropdown and renders the shared form in
 * create mode (dataset=null).
 *
 * Protected by middleware -- only accessible with a valid admin-token cookie.
 */
export default async function AdminCatalogNewPage() {
  const supabase = createSupabaseAdminClient();

  const { data: categories } = await supabase
    .from("dataset_categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-mono font-semibold tracking-tight">
          <Link
            href="/admin/dashboard"
            className="hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            claru
            <span className="text-[var(--accent-primary)]">/</span>
            admin
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <Link
            href="/admin/catalog"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            catalog
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-tertiary)]">new</span>
        </h1>
      </header>

      <DatasetForm
        dataset={null}
        categories={(categories as DatasetCategory[]) ?? []}
      />
    </div>
  );
}
