import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/catalog/[id]/leads
 * Lists all leads that have access to this dataset.
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
    .from("lead_dataset_access")
    .select("lead_id, granted_at, leads(name, company)")
    .eq("dataset_id", id);

  if (error) {
    console.error("[GET catalog/leads]", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  const grants = (data ?? []).map((row) => {
    const lead = (row as Record<string, unknown>).leads as { name: string; company: string } | null;
    return {
      lead_id: row.lead_id,
      lead_name: lead?.name ?? "Unknown",
      lead_company: lead?.company ?? "",
      granted_at: row.granted_at,
    };
  });

  return NextResponse.json({ grants });
}

/**
 * POST /api/admin/catalog/[id]/leads
 * Grants a single lead access to this dataset (upsert — safe to call multiple times).
 * Body: { lead_id: string }
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

  const { id: datasetId } = await params;

  let body: { lead_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.lead_id) {
    return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("lead_dataset_access")
    .upsert(
      { lead_id: body.lead_id, dataset_id: datasetId, granted_by: "admin" },
      { onConflict: "lead_id,dataset_id" }
    );

  if (error) {
    console.error("[POST catalog/leads]", error);
    return NextResponse.json({ error: "Failed to grant access" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
