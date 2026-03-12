import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/catalog
 *
 * Returns all datasets (id, name, slug) for use in selectors.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
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

  return NextResponse.json({ datasets: data });
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
