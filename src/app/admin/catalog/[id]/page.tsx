import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import CatalogEditClient from "./CatalogEditClient";

interface CatalogEditPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Admin dataset edit page (server component).
 *
 * Loads the dataset by ID from Supabase and passes it to the client-side form
 * and the DatasetUploader component for sample management.
 *
 * Protected by middleware -- only accessible with a valid admin-token cookie.
 */
export default async function CatalogEditPage({ params }: CatalogEditPageProps) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Fetch dataset
  const { data: dataset, error: datasetErr } = await supabase
    .from("datasets")
    .select("*, dataset_categories(id, name)")
    .eq("id", id)
    .single();

  if (datasetErr || !dataset) {
    notFound();
  }

  // Fetch all categories for the selector
  const { data: categories } = await supabase
    .from("dataset_categories")
    .select("id, name, slug")
    .order("display_order");

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
          <span className="text-[var(--text-tertiary)]">edit</span>
        </h1>
        <Link
          href="/admin/catalog"
          className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          &larr; back to catalog
        </Link>
      </header>

      <CatalogEditClient
        dataset={dataset}
        categories={categories ?? []}
      />
    </div>
  );
}
