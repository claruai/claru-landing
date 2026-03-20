import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/embeddings/openai";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import type { AgentContext } from "@/lib/enrichment/types";

type SearchMode = "catalog" | "full_corpus" | "both";

/**
 * POST /api/admin/catalog/search
 *
 * Semantic search. Supports three modes:
 *  - catalog (default): searches dataset_samples via match_samples
 *  - full_corpus: searches video_index via match_video_index
 *  - both: searches both and merges by similarity
 *
 * Body: { query, dataset_id?, s3_bucket?, limit?, mode? }
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
  const s3_bucket = body.s3_bucket as string | undefined;
  const limit = Math.min(Math.max(body.limit ?? 20, 1), 50);
  const mode: SearchMode =
    body.mode === "full_corpus" || body.mode === "both"
      ? body.mode
      : "catalog";

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  try {
    const results: Array<{
      source: "catalog" | "full_corpus";
      id: string;
      similarity: number;
      description: string | null;
      signed_url: string | null;
      // catalog-specific
      dataset_id?: string;
      dataset_name?: string;
      environments?: string[];
      activities?: string[];
      objects?: string[];
      camera_perspective?: string | null;
      mime_type?: string;
      // full_corpus-specific
      s3_bucket?: string;
      s3_key?: string;
      caption_text?: string | null;
      enrichment_source?: string | null;
    }> = [];

    // --- Catalog search (1536-dim) ---
    if (mode === "catalog" || mode === "both") {
      const queryEmbedding = await generateEmbedding(query);
      const { data: matches, error } = await supabase.rpc("match_samples", {
        query_embedding: queryEmbedding,
        match_count: limit,
        filter_dataset_id: dataset_id ?? null,
      });

      if (error) {
        console.error("[search/catalog]", error);
      } else if (matches) {
        for (const match of matches as Array<{
          sample_id: string;
          dataset_id: string;
          dataset_name: string;
          similarity: number;
          agent_context: AgentContext | null;
          s3_object_key: string | null;
          mime_type: string;
        }>) {
          let signed_url: string | null = null;
          if (match.s3_object_key) {
            signed_url = await getS3SignedUrl(match.s3_object_key, 3600);
          }
          const ctx = match.agent_context;
          results.push({
            source: "catalog",
            id: match.sample_id,
            similarity: Math.round(match.similarity * 1000) / 1000,
            description: ctx?.scene_summary ?? null,
            signed_url,
            dataset_id: match.dataset_id,
            dataset_name: match.dataset_name,
            environments: ctx?.environments ?? [],
            activities: ctx?.activities ?? [],
            objects: ctx?.objects ?? [],
            camera_perspective: ctx?.camera_perspective ?? null,
            mime_type: match.mime_type,
          });
        }
      }
    }

    // --- Full corpus search (768-dim) ---
    if (mode === "full_corpus" || mode === "both") {
      const queryEmbedding768 = await generateEmbedding(query, 768);
      const { data: matches, error } = await supabase.rpc(
        "match_video_index",
        {
          query_embedding: queryEmbedding768,
          match_count: limit,
          filter_bucket: s3_bucket ?? null,
          match_threshold: 0.4,
        },
      );

      if (error) {
        console.error("[search/full_corpus]", error);
      } else if (matches) {
        for (const match of matches as Array<{
          id: string;
          s3_bucket: string;
          s3_key: string;
          caption_text: string | null;
          similarity: number;
          enrichment_source: string | null;
        }>) {
          const signed_url = await getS3SignedUrl(
            match.s3_key,
            600,
            match.s3_bucket,
          );
          results.push({
            source: "full_corpus",
            id: match.id,
            similarity: Math.round(match.similarity * 1000) / 1000,
            description: match.caption_text,
            signed_url,
            s3_bucket: match.s3_bucket,
            s3_key: match.s3_key,
            caption_text: match.caption_text,
            enrichment_source: match.enrichment_source,
          });
        }
      }
    }

    // Merge by similarity when mode=both
    if (mode === "both") {
      results.sort((a, b) => b.similarity - a.similarity);
      results.splice(limit);
    }

    return NextResponse.json(scrubS3Urls({ results }));
  } catch (err) {
    console.error("[POST /api/admin/catalog/search]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 },
    );
  }
}
