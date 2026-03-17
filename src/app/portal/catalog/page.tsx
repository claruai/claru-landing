import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Lead,
  Dataset,
  DatasetCategory,
} from "@/types/data-catalog";
import { CatalogBrowser } from "./CatalogBrowser";
import { OtherDatasets } from "./OtherDatasets";

// ---------------------------------------------------------------------------
// Data Fetching
// ---------------------------------------------------------------------------

async function getCatalogData() {
  const supabase = await createSupabaseServerClient();

  // Verify the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  // Confirm the user is a valid lead
  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("supabase_user_id", user.id)
    .single<Pick<Lead, "id">>();

  if (!lead) {
    redirect("/portal/login");
  }

  // Fetch datasets the lead has access to (via RLS on lead_dataset_access + datasets)
  // We join through lead_dataset_access to get the granted datasets with their categories
  const { data: accessGrants } = await supabase
    .from("lead_dataset_access")
    .select(
      `
      dataset_id,
      granted_at,
      datasets (
        id,
        name,
        slug,
        description,
        type,
        subcategory,
        tags,
        total_samples,
        total_duration_hours,
        thumbnail_url,
        tags,
        is_published,
        category_id,
        dataset_categories ( id, name, slug )
      )
    `
    )
    .eq("lead_id", lead.id)
    .order("granted_at", { ascending: false });

  // Flatten to just the dataset objects
  const datasets: Array<
    Dataset & {
      category: Pick<DatasetCategory, "id" | "name" | "slug"> | null;
    }
  > = [];

  const categoryMap = new Map<
    string,
    Pick<DatasetCategory, "id" | "name" | "slug">
  >();

  for (const grant of accessGrants ?? []) {
    const ds = grant.datasets as unknown as
      | (Dataset & {
          dataset_categories: Pick<
            DatasetCategory,
            "id" | "name" | "slug"
          > | null;
        })
      | null;

    if (!ds) continue;

    const cat = ds.dataset_categories ?? null;
    datasets.push({
      ...ds,
      category: cat,
    });

    if (cat && !categoryMap.has(cat.id)) {
      categoryMap.set(cat.id, cat);
    }
  }

  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Fetch all other published datasets the user does NOT have access to
  // Use anon client to bypass the authenticated RLS policy (which only shows granted datasets)
  const grantedIds = datasets.map((d) => d.id);

  let otherDatasets: Array<{
    id: string;
    name: string;
    description: string | null;
    total_samples: number;
    category_name: string | null;
    source_type: string;
  }> = [];

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: allPublished } = await anonClient
    .from("datasets")
    .select("id, name, description, total_samples, source_type, dataset_categories(name)")
    .eq("is_published", true)
    .order("total_samples", { ascending: false });

  if (allPublished) {
    otherDatasets = allPublished
      .filter((d) => !grantedIds.includes(d.id))
      .map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        total_samples: d.total_samples,
        source_type: d.source_type,
        category_name: (d.dataset_categories as unknown as { name: string } | null)?.name ?? null,
      }));
  }

  return { datasets, categories, otherDatasets };
}

// ---------------------------------------------------------------------------
// Page Component (Server)
// ---------------------------------------------------------------------------

export default async function PortalCatalogPage() {
  const { datasets, categories, otherDatasets } = await getCatalogData();

  // Fetch booking URL
  const supabase = await createSupabaseServerClient();
  const { data: bookingSetting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "booking_url")
    .single<{ value: string }>();
  const bookingUrl = bookingSetting?.value ?? "mailto:team@claru.ai";

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding)] py-12">
      {/* Header */}
      <section className="mb-8">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
          <span className="text-[var(--accent-primary)]">$</span> portal / catalog
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Dataset Catalog
        </h1>
        <p className="mt-2 text-sm font-mono text-[var(--text-muted)]">
          {datasets.length} dataset{datasets.length !== 1 ? "s" : ""} available
          to you
        </p>
      </section>

      {/* Client-side browsing UI (search, filter, grid) */}
      <Suspense>
        <CatalogBrowser
          datasets={datasets}
          categories={categories}
        />
      </Suspense>

      {/* Other available datasets (expandable) */}
      {otherDatasets.length > 0 && (
        <OtherDatasets datasets={otherDatasets} bookingUrl={bookingUrl} />
      )}
    </div>
  );
}
