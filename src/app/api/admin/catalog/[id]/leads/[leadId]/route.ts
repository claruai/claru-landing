import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * DELETE /api/admin/catalog/[id]/leads/[leadId]
 * Revokes a lead's access to this dataset.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; leadId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, leadId } = await params;
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("lead_dataset_access")
    .delete()
    .eq("dataset_id", id)
    .eq("lead_id", leadId);

  if (error) {
    console.error("[DELETE catalog/leads]", error);
    return NextResponse.json({ error: "Failed to revoke" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
