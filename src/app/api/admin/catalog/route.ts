import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/catalog
 *
 * Returns all datasets (id, name, slug) for use in selectors. Pass
 * `?include_showcase_counts=1` to also attach showcase_count per dataset
 * (used by the Send Sample Pack modal).
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const includeShowcase = request.nextUrl.searchParams.get("include_showcase_counts") === "1";

  const { data: datasets, error } = await supabase
    .from("datasets")
    .select("id, name, slug")
    .order("name");

  if (error) {
    console.error("[GET /api/admin/catalog]", error);
    return NextResponse.json(
      { error: error.message ?? "Fetch failed" },
      { status: 500 }
    );
  }

  if (!includeShowcase) {
    return NextResponse.json({ datasets });
  }

  // Attach per-dataset showcase counts (base entries only).
  const { data: counts } = await supabase
    .from("dataset_clips")
    .select("dataset_id")
    .eq("is_showcase", true)
    .is("lead_id", null);

  const byId = new Map<string, number>();
  for (const r of counts ?? []) {
    byId.set(r.dataset_id, (byId.get(r.dataset_id) ?? 0) + 1);
  }

  return NextResponse.json({
    datasets: (datasets ?? []).map((d) => ({
      ...d,
      showcase_count: byId.get(d.id) ?? 0,
    })),
  });
}

/**
 * POST /api/admin/catalog
 *
 * Creates a new dataset in the catalog.
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    name,
    slug,
    category_id,
    type,
    subcategory,
    description,
    total_samples,
    total_duration_hours,
    geographic_coverage,
    annotation_types,
    is_published,
    source_type,
    modality,
  } = body;

  if (!name || !slug || !category_id || !type) {
    return NextResponse.json(
      { error: "Missing required fields: name, slug, category_id, type" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("datasets")
    .insert({
      name,
      slug,
      category_id,
      type,
      subcategory: subcategory ?? "",
      description: description ?? "",
      total_samples: total_samples ?? 0,
      total_duration_hours: total_duration_hours ?? 0,
      geographic_coverage: geographic_coverage ?? "",
      annotation_types: annotation_types ?? [],
      is_published: is_published ?? false,
      source_type: source_type ?? "collected",
      modality: modality || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/admin/catalog]", error);
    return NextResponse.json(
      { error: error.message ?? "Create failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ dataset: data }, { status: 201 });
}
