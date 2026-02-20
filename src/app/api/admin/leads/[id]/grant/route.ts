import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/leads/[id]/grant
 *
 * Updates dataset access grants for a lead.
 * Accepts a full list of dataset IDs -- computes diff to insert/delete.
 *
 * Request body:
 *   { dataset_ids: string[] }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: leadId } = await params;
  const supabase = createSupabaseAdminClient();

  // Verify lead exists
  const { data: lead, error: fetchErr } = await supabase
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .single();

  if (fetchErr || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  let body: { dataset_ids?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const newDatasetIds = body.dataset_ids ?? [];

  // Get current grants
  const { data: currentGrants } = await supabase
    .from("lead_dataset_access")
    .select("dataset_id")
    .eq("lead_id", leadId);

  const currentIds = new Set(
    (currentGrants ?? []).map((g) => g.dataset_id)
  );
  const desiredIds = new Set(newDatasetIds);

  // Compute inserts and deletes
  const toInsert = newDatasetIds.filter((id) => !currentIds.has(id));
  const toDelete = [...currentIds].filter((id) => !desiredIds.has(id));

  // Delete removed grants
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase
      .from("lead_dataset_access")
      .delete()
      .eq("lead_id", leadId)
      .in("dataset_id", toDelete);

    if (delErr) {
      console.error("[grant] delete error:", delErr);
    }
  }

  // Insert new grants
  if (toInsert.length > 0) {
    const rows = toInsert.map((datasetId) => ({
      lead_id: leadId,
      dataset_id: datasetId,
      granted_by: "admin",
    }));

    const { error: insErr } = await supabase
      .from("lead_dataset_access")
      .insert(rows);

    if (insErr) {
      console.error("[grant] insert error:", insErr);
      return NextResponse.json(
        { error: "Failed to update grants" },
        { status: 500 }
      );
    }
  }

  // Return updated grants
  const { data: updatedGrants } = await supabase
    .from("lead_dataset_access")
    .select("*, datasets(*)")
    .eq("lead_id", leadId);

  return NextResponse.json({
    grants: updatedGrants ?? [],
    added: toInsert.length,
    removed: toDelete.length,
    message: "Dataset access updated",
  });
}

/**
 * DELETE /api/admin/leads/[id]/grant
 *
 * Revokes a specific dataset grant.
 *
 * Request body:
 *   { dataset_id: string }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: leadId } = await params;

  let body: { dataset_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.dataset_id) {
    return NextResponse.json(
      { error: "dataset_id is required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("lead_dataset_access")
    .delete()
    .eq("lead_id", leadId)
    .eq("dataset_id", body.dataset_id);

  if (error) {
    console.error("[grant DELETE]", error);
    return NextResponse.json(
      { error: "Failed to revoke access" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Access revoked" });
}
