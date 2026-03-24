import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/embeddings/openai";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import type { ClipSearchResult } from "@/types/data-catalog";

/**
 * POST /api/admin/catalog/search
 *
 * Unified semantic search over the clips table via match_clips RPC.
 * Single code path — no mode toggle.
 *
 * Body: { query, dataset_id?, s3_bucket?, subcategory?, limit?, offset? }
 *
 * In browse mode (no query), returns `total_count` for pagination.
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
  const subcategory = body.subcategory as string | undefined;
  const limit = Math.min(Math.max(body.limit ?? 20, 1), 100);
  const offset = Math.max(body.offset ?? 0, 0);
  const min_resolution_height = body.min_resolution_height as number | undefined;
  const has_ai_caption = body.has_ai_caption as boolean | undefined;

  const isBrowseMode = !query || !query.trim();

  const supabase = createSupabaseAdminClient();

  try {
    let results: ClipSearchResult[] = [];
    let total_count: number | null = null;

    if (isBrowseMode) {
      // Browse mode: direct query on clips, JOIN dataset_clips when dataset filter set
      let browseQuery = supabase
        .from("clips")
        .select(
          "id, s3_bucket, s3_key, ai_caption, caption_text, ai_enrichment_source, ai_agent_context, mime_type, tech_resolution_width, tech_resolution_height, tech_fps, tech_duration_seconds, tech_codec, ann_metadata",
          { count: "exact" },
        );

      if (dataset_id) {
        // Fetch clip IDs from dataset_clips, then filter
        const { data: dcRows } = await supabase
          .from("dataset_clips")
          .select("clip_id")
          .eq("dataset_id", dataset_id)
          .is("lead_id", null);
        const clipIdsForDataset = (dcRows ?? []).map((r) => r.clip_id);
        if (clipIdsForDataset.length === 0) {
          return NextResponse.json(scrubS3Urls({ results: [], total_count: 0 }));
        }
        browseQuery = browseQuery.in("id", clipIdsForDataset);
      }

      if (s3_bucket) {
        browseQuery = browseQuery.eq("s3_bucket", s3_bucket);
      }

      if (subcategory) {
        browseQuery = browseQuery.ilike("caption_text", `%${subcategory}%`);
      }

      if (min_resolution_height) {
        browseQuery = browseQuery.gte("tech_resolution_height", min_resolution_height);
      }

      if (has_ai_caption) {
        browseQuery = browseQuery.not("ai_caption", "is", null);
      }

      browseQuery = browseQuery
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: browseData, error, count } = await browseQuery;
      if (count !== null && count !== undefined) total_count = count;

      if (error) {
        console.error("[search/browse]", error);
      } else if (browseData) {
        results = browseData.map((c) => ({
          id: c.id,
          s3_bucket: c.s3_bucket,
          s3_key: c.s3_key,
          ai_caption: c.ai_caption,
          caption_text: c.caption_text,
          similarity: 1,
          ai_enrichment_source: c.ai_enrichment_source,
          ai_agent_context: c.ai_agent_context as Record<string, unknown> | null,
          mime_type: c.mime_type,
          tech_resolution_width: c.tech_resolution_width,
          tech_resolution_height: c.tech_resolution_height,
          tech_fps: c.tech_fps,
          tech_duration_seconds: c.tech_duration_seconds,
          tech_codec: c.tech_codec,
          ann_metadata: c.ann_metadata as Record<string, unknown> | null,
          signed_url: null,
        }));
      }
    } else {
      // Semantic search via match_clips RPC
      const queryEmbedding = await generateEmbedding(query, 768);
      const { data: matches, error } = await supabase.rpc("match_clips", {
        query_embedding: queryEmbedding,
        match_count: limit,
        filter_dataset_id: dataset_id ?? null,
        filter_bucket: s3_bucket ?? null,
        match_threshold: 0.3,
      });

      if (error) {
        console.error("[search/semantic]", error);
      } else if (matches) {
        let filtered = matches as Array<Record<string, unknown>>;

        // Post-filter by subcategory if set
        if (subcategory) {
          filtered = filtered.filter(
            (m) => ((m.caption_text as string) ?? "").toLowerCase().includes(subcategory.toLowerCase()),
          );
        }

        // Post-filter by resolution
        if (min_resolution_height) {
          filtered = filtered.filter(
            (m) => (m.tech_resolution_height as number | null) != null && (m.tech_resolution_height as number) >= min_resolution_height,
          );
        }

        // Post-filter by has AI caption
        if (has_ai_caption) {
          filtered = filtered.filter((m) => m.ai_caption != null);
        }

        results = filtered.map((m) => ({
          id: m.id as string,
          s3_bucket: m.s3_bucket as string,
          s3_key: m.s3_key as string,
          ai_caption: m.ai_caption as string | null,
          caption_text: m.caption_text as string | null,
          similarity: Math.round((m.similarity as number) * 1000) / 1000,
          ai_enrichment_source: m.ai_enrichment_source as string | null,
          ai_agent_context: m.ai_agent_context as Record<string, unknown> | null,
          mime_type: m.mime_type as string | null,
          tech_resolution_width: m.tech_resolution_width as number | null,
          tech_resolution_height: m.tech_resolution_height as number | null,
          tech_fps: m.tech_fps as number | null,
          tech_duration_seconds: m.tech_duration_seconds as number | null,
          tech_codec: m.tech_codec as string | null,
          ann_metadata: m.ann_metadata as Record<string, unknown> | null,
          signed_url: null,
        }));
      }
    }

    // Sign S3 URLs
    for (const r of results) {
      r.signed_url = await getS3SignedUrl(r.s3_key, 600, r.s3_bucket);
    }

    // Lead assignment: single dataset_clips query
    const clipIds = results.map((r) => r.id);
    const leadAssignments: Record<string, Array<{ lead_id: string; lead_name: string; lead_company: string }>> = {};

    if (clipIds.length > 0) {
      const { data: dcLeads } = await supabase
        .from("dataset_clips")
        .select("clip_id, lead_id, leads(name, company)")
        .in("clip_id", clipIds)
        .not("lead_id", "is", null);

      for (const row of dcLeads ?? []) {
        const lead = (row as Record<string, unknown>).leads as { name: string; company: string } | null;
        if (row.lead_id && lead) {
          if (!leadAssignments[row.clip_id]) leadAssignments[row.clip_id] = [];
          leadAssignments[row.clip_id].push({
            lead_id: row.lead_id,
            lead_name: lead.name,
            lead_company: lead.company,
          });
        }
      }
    }

    const enrichedResults = results.map((r) => ({
      ...r,
      assigned_leads: leadAssignments[r.id] ?? [],
    }));

    return NextResponse.json(scrubS3Urls({
      results: enrichedResults,
      ...(total_count !== null ? { total_count } : {}),
    }));
  } catch (err) {
    console.error("[POST /api/admin/catalog/search]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 },
    );
  }
}
