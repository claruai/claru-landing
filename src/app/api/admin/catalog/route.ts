import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
