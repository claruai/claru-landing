import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/leads/[id]/reject
 *
 * Rejects a lead:
 * 1. Updates status to "rejected"
 * 2. Optionally stores admin notes / rejection reason
 *
 * Request body (optional):
 *   { admin_notes?: string }
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

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Verify lead exists
  const { data: lead, error: fetchErr } = await supabase
    .from("leads")
    .select("id")
    .eq("id", id)
    .single();

  if (fetchErr || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Parse optional body
  let adminNotes: string | undefined;
  try {
    const body = await request.json();
    if (typeof body.admin_notes === "string") {
      adminNotes = body.admin_notes;
    }
  } catch {
    // Body is optional
  }

  const updateFields: Record<string, unknown> = {
    status: "rejected",
  };
  if (adminNotes !== undefined) {
    updateFields.admin_notes = adminNotes;
  }

  const { data: updatedLead, error: updateErr } = await supabase
    .from("leads")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (updateErr) {
    console.error("[reject] Failed to update lead:", updateErr);
    return NextResponse.json(
      { error: "Failed to update lead status" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    lead: updatedLead,
    message: "Lead rejected",
  });
}
