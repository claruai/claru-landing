import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * DELETE /api/admin/leads/[id]/custom-samples/[sampleId]
 * Removes a custom sample from a lead.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; sampleId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, sampleId } = await params;

  const idParsed = z.string().uuid().safeParse(id);
  const sampleIdParsed = z.string().uuid().safeParse(sampleId);
  if (!idParsed.success || !sampleIdParsed.success) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("lead_custom_samples")
    .delete()
    .eq("id", sampleId)
    .eq("lead_id", id);

  if (error) {
    console.error("[DELETE custom-samples]", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted" });
}
