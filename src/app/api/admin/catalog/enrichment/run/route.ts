import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/catalog/enrichment/run
 *
 * Trigger an enrichment job. Creates a row in enrichment_jobs, then
 * invokes the run-enrichment Edge Function.
 *
 * Body: { action, dataset_id?, limit?, dry_run? }
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, dataset_id, limit, dry_run } = body as {
    action: string;
    dataset_id?: string;
    limit?: number;
    dry_run?: boolean;
  };

  if (!action || !["map_existing", "gemini_enrich"].includes(action)) {
    return NextResponse.json(
      { error: "action must be map_existing or gemini_enrich" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();

  // Dry run: return count of what would be processed
  if (dry_run) {
    // When filtering by dataset_id, join through dataset_clips
    const selectCols = dataset_id
      ? "id, dataset_clips!inner(dataset_id)"
      : "id";

    let query = supabase
      .from("clips")
      .select(selectCols, { count: "exact", head: false })
      .is("ai_agent_context", null);

    if (action === "map_existing") {
      query = query.not("ai_enrichment_json", "eq", "{}");
    } else {
      query = query.not("s3_key", "is", null);
    }

    if (dataset_id) {
      query = query.eq("dataset_clips.dataset_id", dataset_id);
    }

    if (limit) {
      query = query.limit(limit);
    } else {
      query = query.limit(100);
    }

    const { data, count } = await query;
    const rows = (data ?? []) as unknown as { id: string }[];
    return NextResponse.json({
      dry_run: true,
      would_process: count ?? rows.length,
      samples: rows.slice(0, 10).map((s) => s.id),
    });
  }

  // Check for existing running job (single-job enforcement)
  const { data: running } = await supabase
    .from("enrichment_jobs")
    .select("id")
    .eq("status", "running")
    .limit(1);

  if (running && running.length > 0) {
    return NextResponse.json(
      { error: "An enrichment job is already running", job_id: running[0].id },
      { status: 409 },
    );
  }

  // Create job row
  const { data: job, error: insertError } = await supabase
    .from("enrichment_jobs")
    .insert({
      action,
      dataset_id: dataset_id || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !job) {
    return NextResponse.json(
      { error: insertError?.message ?? "Failed to create job" },
      { status: 500 },
    );
  }

  // Invoke Edge Function (fire and forget)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRoleKey) {
    fetch(`${supabaseUrl}/functions/v1/run-enrichment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: job.id,
        action,
        dataset_id: dataset_id || null,
        limit: limit || 100,
      }),
    }).catch((err) => {
      console.error("[enrichment/run] Edge Function invocation failed:", err);
    });
  }

  return NextResponse.json({ job_id: job.id, status: "pending" });
}
