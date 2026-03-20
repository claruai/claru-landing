import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/catalog/enrichment/job/[id]
 *
 * Returns job row + error log with optional pagination via ?log_offset=N.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: job, error } = await supabase
    .from("enrichment_jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Paginate error_log if offset provided
  const url = new URL(_request.url);
  const logOffset = parseInt(url.searchParams.get("log_offset") ?? "0", 10);
  const errorLog = Array.isArray(job.error_log) ? job.error_log : [];
  const paginatedLog = errorLog.slice(logOffset);

  return NextResponse.json({
    ...job,
    error_log: paginatedLog,
    log_total: errorLog.length,
    log_offset: logOffset,
  });
}
