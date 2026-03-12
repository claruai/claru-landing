import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/public/datasets
 *
 * Public endpoint that returns all published datasets with their categories.
 * Uses a plain anon client (no cookies) so RLS always resolves as anon role,
 * not as an authenticated user who may have limited dataset access.
 *
 * Cached at the CDN edge for 1 hour.
 */
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("datasets")
    .select(
      "id, name, slug, description, type, subcategory, source_type, modality, total_samples, total_duration_hours, geographic_coverage, annotation_types, dataset_categories(name, slug, display_order)"
    )
    .eq("is_published", true)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Flatten the nested category object and sort by category display_order, then name
  const datasets = (data ?? [])
    .map((row) => {
      const category = row.dataset_categories as unknown as {
        name: string;
        slug: string;
        display_order: number;
      } | null;

      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        type: row.type,
        subcategory: row.subcategory,
        source_type: row.source_type,
        modality: row.modality,
        total_samples: row.total_samples,
        total_duration_hours: row.total_duration_hours,
        geographic_coverage: row.geographic_coverage,
        annotation_types: row.annotation_types,
        category: category
          ? {
              name: category.name,
              slug: category.slug,
              display_order: category.display_order,
            }
          : null,
      };
    })
    .sort((a, b) => {
      const orderA = a.category?.display_order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.category?.display_order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });

  return NextResponse.json(datasets, {
    headers: {
      "Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
