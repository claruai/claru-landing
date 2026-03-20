import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/embeddings/openai";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import type { AgentContext } from "@/lib/enrichment/types";

/**
 * POST /api/admin/catalog/search
 *
 * Semantic search over catalog samples using embeddings.
 * Body: { query: string, dataset_id?: string, limit?: number }
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const query = body.query as string;
  const dataset_id = body.dataset_id as string | undefined;
  const limit = Math.min(Math.max(body.limit ?? 20, 1), 50);

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  try {
    // Embed the search query
    const queryEmbedding = await generateEmbedding(query);

    // Call match_samples RPC
    const { data: matches, error } = await supabase.rpc("match_samples", {
      query_embedding: queryEmbedding,
      match_count: limit,
      filter_dataset_id: dataset_id ?? null,
    });

    if (error) {
      console.error("[POST /api/admin/catalog/search]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        results: [],
        message: "No samples found matching query",
      });
    }

    // Generate signed URLs and format results
    const results = await Promise.all(
      matches.map(async (match: {
        sample_id: string;
        dataset_id: string;
        dataset_name: string;
        similarity: number;
        agent_context: AgentContext | null;
        s3_object_key: string | null;
        mime_type: string;
      }) => {
        let signed_url: string | null = null;
        if (match.s3_object_key) {
          signed_url = await getS3SignedUrl(match.s3_object_key, 3600);
        }

        const ctx = match.agent_context;
        return {
          sample_id: match.sample_id,
          dataset_id: match.dataset_id,
          dataset_name: match.dataset_name,
          similarity: Math.round(match.similarity * 1000) / 1000,
          scene_summary: ctx?.scene_summary ?? null,
          environments: ctx?.environments ?? [],
          activities: ctx?.activities ?? [],
          objects: ctx?.objects ?? [],
          camera_perspective: ctx?.camera_perspective ?? null,
          signed_url,
          mime_type: match.mime_type,
        };
      }),
    );

    return NextResponse.json(scrubS3Urls({ results }));
  } catch (err) {
    console.error("[POST /api/admin/catalog/search]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 },
    );
  }
}
