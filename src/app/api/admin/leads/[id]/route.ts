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
 * Updates editable fields on a lead.
 * Accepts: name, email, company, role, data_needs, use_case, admin_notes, status
 * Only provided fields are updated (omitted fields are not nulled out).
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

  // Validate name if provided
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Name must be a non-empty string" }, { status: 400 });
    }
  }

  // Validate email format if provided
  if (body.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof body.email !== "string" || !emailRegex.test(body.email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
  }

  // Validate status if provided
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !["pending", "approved", "rejected"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
  }

  const supabase = createSupabaseAdminClient();

  const updateFields: Record<string, unknown> = {};

  // String fields that are included if provided as strings
  if (typeof body.name === "string") {
    updateFields.name = body.name.trim();
  }
  if (typeof body.email === "string") {
    updateFields.email = body.email.trim();
  }
  if (typeof body.company === "string") {
    updateFields.company = body.company.trim();
  }
  if (typeof body.role === "string") {
    updateFields.role = body.role.trim();
  }
  if (typeof body.data_needs === "string") {
    updateFields.data_needs = body.data_needs.trim();
  }
  if (typeof body.use_case === "string") {
    updateFields.use_case = body.use_case.trim();
  }
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
    // UNIQUE violation on email
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email already in use by another lead" },
        { status: 409 }
      );
    }
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
