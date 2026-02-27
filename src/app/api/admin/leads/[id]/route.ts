import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/leads/[id]
 *
 * Fetches a single lead by ID with their dataset access grants.
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

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Fetch dataset access grants for this lead
  const { data: grants } = await supabase
    .from("lead_dataset_access")
    .select("*, datasets(*)")
    .eq("lead_id", id);

  return NextResponse.json({ lead, grants: grants ?? [] });
}

/**
 * PATCH /api/admin/leads/[id]
 *
 * Updates admin_notes on a lead.
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

  const supabase = createSupabaseAdminClient();

  const updateFields: Record<string, unknown> = {};
  if (typeof body.admin_notes === "string") {
    updateFields.admin_notes = body.admin_notes;
  }
  if (typeof body.status === "string" && ["pending", "approved", "rejected"].includes(body.status)) {
    updateFields.status = body.status;
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("leads")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[PATCH /api/admin/leads/[id]]", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ lead: data });
}

/**
 * DELETE /api/admin/leads/[id]
 *
 * Deletes a lead with full cleanup:
 * 1. Removes all dataset access grants
 * 2. Deletes the Supabase Auth user (if exists)
 * 3. Deletes the lead row
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

  // Fetch lead — 404 if not found
  const { data: lead, error: fetchErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // 1. Delete all dataset access grants for this lead
  const { error: grantsErr } = await supabase
    .from("lead_dataset_access")
    .delete()
    .eq("lead_id", id);

  if (grantsErr) {
    console.error("[DELETE /api/admin/leads/[id]] Failed to delete grants:", grantsErr);
    return NextResponse.json(
      { error: "Failed to delete dataset access grants" },
      { status: 500 }
    );
  }

  // 2. Delete Supabase Auth user if one exists
  if (lead.supabase_user_id) {
    const { error: authErr } = await supabase.auth.admin.deleteUser(
      lead.supabase_user_id
    );
    if (authErr) {
      // User may already be gone — log warning but continue
      console.warn(
        "[DELETE /api/admin/leads/[id]] Failed to delete auth user (may already be gone):",
        authErr
      );
    }
  }

  // 3. Delete the lead row
  const { error: deleteErr } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (deleteErr) {
    console.error("[DELETE /api/admin/leads/[id]] Failed to delete lead:", deleteErr);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Lead deleted" });
}
