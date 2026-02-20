import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/catalog/[id]
 *
 * Fetches a single dataset by ID with its category.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("datasets")
    .select("*, dataset_categories(name)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  }

  return NextResponse.json({ dataset: data });
}

/**
 * PATCH /api/admin/catalog/[id]
 *
 * Updates an existing dataset.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const allowedFields = [
    "name",
    "slug",
    "category_id",
    "type",
    "subcategory",
    "description",
    "total_samples",
    "total_duration_hours",
    "geographic_coverage",
    "annotation_types",
    "is_published",
  ];

  const updateFields: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) {
      updateFields[key] = body[key];
    }
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("datasets")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[PATCH /api/admin/catalog/[id]]", error);
    return NextResponse.json(
      { error: error.message ?? "Update failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ dataset: data });
}

/**
 * DELETE /api/admin/catalog/[id]
 *
 * Deletes a dataset. Also removes associated access grants.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Revoke all access grants for this dataset first
  await supabase.from("lead_dataset_access").delete().eq("dataset_id", id);

  // Delete the dataset
  const { error } = await supabase.from("datasets").delete().eq("id", id);

  if (error) {
    console.error("[DELETE /api/admin/catalog/[id]]", error);
    return NextResponse.json(
      { error: error.message ?? "Delete failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
