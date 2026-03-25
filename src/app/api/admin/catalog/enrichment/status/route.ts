import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/catalog/enrichment/status
 *
 * Returns aggregation counts for enrichment status across clips.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  // Get per-dataset enrichment counts
  const { data: datasets } = await supabase
    .from("datasets")
    .select("id, name, total_samples")
    .order("name");

  if (!datasets) {
    return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 });
  }

  // Get counts for each enrichment state
  const { count: totalSamples } = await supabase
    .from("clips")
    .select("id", { count: "exact", head: true });

  const { count: withContext } = await supabase
    .from("clips")
    .select("id", { count: "exact", head: true })
    .not("ai_agent_context", "is", null);

  const { count: withEmbedding } = await supabase
    .from("clips")
    .select("id", { count: "exact", head: true })
    .not("embedding", "is", null);

  const { count: withEnrichmentJson } = await supabase
    .from("clips")
    .select("id", { count: "exact", head: true })
    .not("ai_enrichment_json", "eq", "{}");

  const { count: needsContext } = await supabase
    .from("clips")
    .select("id", { count: "exact", head: true })
    .is("ai_agent_context", null);

  const { count: needsEmbedding } = await supabase
    .from("clips")
    .select("id", { count: "exact", head: true })
    .not("ai_agent_context", "is", null)
    .is("embedding", null);

  return NextResponse.json({
    total_samples: totalSamples ?? 0,
    with_agent_context: withContext ?? 0,
    with_embedding: withEmbedding ?? 0,
    with_enrichment_json: withEnrichmentJson ?? 0,
    needs_agent_context: needsContext ?? 0,
    needs_embedding: needsEmbedding ?? 0,
    datasets: datasets.map((d) => ({
      id: d.id,
      name: d.name,
      total_samples: d.total_samples,
    })),
  });
}
