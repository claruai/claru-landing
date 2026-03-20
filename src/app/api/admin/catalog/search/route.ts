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
 * Body: { query, dataset_id?, s3_bucket?, subcategory?, limit?, offset?, mode? }
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
  const mode: SearchMode =
    body.mode === "full_corpus" || body.mode === "both"
      ? body.mode
      : "catalog";

  const isBrowseMode = !query || !query.trim();
  if (isBrowseMode && !dataset_id && !s3_bucket) {
    return NextResponse.json({ error: "query or dataset filter is required" }, { status: 400 });
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

    let total_count: number | null = null;

    // --- Catalog search (1536-dim) ---
    if (mode === "catalog" || mode === "both") {
      if (isBrowseMode && dataset_id) {
        // Browse mode: return samples from the dataset without vector search
        let browseQuery = supabase
          .from("dataset_samples")
          .select("id, dataset_id, s3_object_key, mime_type, agent_context, datasets(name)", { count: "exact" })
          .eq("dataset_id", dataset_id)
          .is("lead_id", null);

        // Subcategory filter via agent_context->>'scene_summary' ILIKE
        if (subcategory) {
          browseQuery = browseQuery.ilike("agent_context->>scene_summary", `%${subcategory}%`);
        }

        browseQuery = browseQuery.range(offset, offset + limit - 1);

        const { data: browseSamples, error, count } = await browseQuery;
        if (count !== null && count !== undefined) total_count = count;

        if (!error && browseSamples) {
          for (const s of browseSamples) {
            const ds = (s as Record<string, unknown>).datasets as { name: string } | null;
            const ctx = s.agent_context as Record<string, unknown> | null;
            let signed_url: string | null = null;
            if (s.s3_object_key) {
              signed_url = await getS3SignedUrl(s.s3_object_key, 3600);
            }
            results.push({
              source: "catalog",
              id: s.id,
              similarity: 1,
              description: (ctx?.scene_summary as string) ?? null,
              signed_url,
              dataset_id: s.dataset_id,
              dataset_name: ds?.name ?? undefined,
              environments: (ctx?.environments as string[]) ?? [],
              activities: (ctx?.activities as string[]) ?? [],
              objects: (ctx?.objects as string[]) ?? [],
              camera_perspective: (ctx?.camera_perspective as string) ?? null,
              mime_type: s.mime_type,
            });
          }
        }
      } else if (!isBrowseMode) {
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
      } // close else-if !isBrowseMode
    }

    // --- Full corpus search (768-dim) ---
    if (mode === "full_corpus" || mode === "both") {
      // When a dataset is selected, look up its prefix routes to scope the full corpus search
      let corpusBucket: string | null = s3_bucket ?? null;
      let corpusPrefixes: string[] | null = null;

      if (dataset_id) {
        const { data: routes } = await supabase
          .from("dataset_prefix_routes")
          .select("s3_bucket, key_prefix")
          .eq("dataset_id", dataset_id);

        if (routes && routes.length > 0) {
          // Use the bucket from the routes (they all share the same bucket for a dataset)
          corpusBucket = routes[0].s3_bucket;
          corpusPrefixes = routes.map((r) => r.key_prefix).filter(Boolean);
        }
      }

      let filteredMatches: Array<Record<string, unknown>> = [];

      if (isBrowseMode) {
        // Browse mode: return corpus entries from matching bucket/prefixes
        if (corpusPrefixes && corpusPrefixes.length > 0) {
          // Use SQL LIKE filter on the first (longest) prefix to push filtering to the DB
          // Most datasets have one primary prefix (e.g. "video_capture/")
          const primaryPrefix = corpusPrefixes.sort((a, b) => a.length - b.length)[0];

          let browseQuery = supabase
            .from("video_index")
            .select("id, s3_bucket, s3_key, caption_text, enrichment_source", { count: "exact" })
            .like("s3_key", `${primaryPrefix}%`)
            .order("indexed_at", { ascending: false });

          if (corpusBucket) browseQuery = browseQuery.eq("s3_bucket", corpusBucket);
          if (subcategory) browseQuery = browseQuery.ilike("caption_text", `%${subcategory}%`);

          browseQuery = browseQuery.range(offset, offset + limit - 1);

          const { data: browseData, count } = await browseQuery;
          if (count !== null && count !== undefined) total_count = count;

          // If multiple prefixes, also fetch for the other prefixes and merge
          // (rare — most datasets map to one prefix)
          let allResults = browseData ?? [];
          if (corpusPrefixes.length > 1) {
            for (const prefix of corpusPrefixes.slice(1)) {
              const { data: extraData } = await supabase
                .from("video_index")
                .select("id, s3_bucket, s3_key, caption_text, enrichment_source")
                .like("s3_key", `${prefix}%`)
                .eq("s3_bucket", corpusBucket!)
                .order("indexed_at", { ascending: false })
                .range(offset, offset + limit - 1);
              if (extraData) allResults = [...allResults, ...extraData];
            }
          }

          filteredMatches = allResults.map((m) => ({
            ...m,
            similarity: 1,
          }));
        } else {
          // No prefix filtering needed: use SQL range + count
          let browseQuery = supabase
            .from("video_index")
            .select("id, s3_bucket, s3_key, caption_text, enrichment_source", { count: "exact" })
            .order("indexed_at", { ascending: false });

          if (corpusBucket) browseQuery = browseQuery.eq("s3_bucket", corpusBucket);
          if (subcategory) browseQuery = browseQuery.ilike("caption_text", `%${subcategory}%`);

          browseQuery = browseQuery.range(offset, offset + limit - 1);

          const { data: browseData, count } = await browseQuery;
          if (count !== null && count !== undefined) total_count = count;

          filteredMatches = (browseData ?? []).map((m) => ({
            ...m,
            similarity: 1,
          }));
        }
      } else {
        const queryEmbedding768 = await generateEmbedding(query, 768);
        const { data: matches, error } = await supabase.rpc(
          "match_video_index",
          {
            query_embedding: queryEmbedding768,
            match_count: limit,
            filter_bucket: corpusBucket,
            match_threshold: 0.4,
          },
        );

        if (error) {
          console.error("[search/full_corpus]", error);
        }

        filteredMatches = (matches ?? []) as Array<Record<string, unknown>>;

        // Post-filter by prefix when a dataset is selected
        if (corpusPrefixes && corpusPrefixes.length > 0) {
          filteredMatches = filteredMatches.filter(
            (m) => corpusPrefixes!.some((prefix) => (m.s3_key as string).startsWith(prefix))
          );
        }

        // Post-filter by subcategory
        if (subcategory) {
          filteredMatches = filteredMatches.filter(
            (m) => ((m.caption_text as string) ?? "").toLowerCase().includes(subcategory.toLowerCase())
          );
        }
      }

      if (filteredMatches.length > 0) {
        for (const match of filteredMatches as Array<{
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

    // Look up which results have been added to leads
    // For catalog results: check dataset_samples with lead_id set matching the s3_object_key
    // For full corpus results: check dataset_samples with source_video_index_id matching the id
    const catalogIds = results.filter(r => r.source === "catalog").map(r => r.id);
    const corpusIds = results.filter(r => r.source === "full_corpus").map(r => r.id);

    const leadAssignments: Record<string, Array<{ lead_id: string; lead_name: string; lead_company: string }>> = {};

    if (catalogIds.length > 0) {
      // Catalog samples that are lead-specific themselves, or have lead-specific copies with same s3 key
      const { data: catLeads } = await supabase
        .from("dataset_samples")
        .select("id, lead_id, leads(name, company)")
        .in("id", catalogIds)
        .not("lead_id", "is", null);
      for (const row of catLeads ?? []) {
        const lead = (row as Record<string, unknown>).leads as { name: string; company: string } | null;
        if (row.lead_id && lead) {
          if (!leadAssignments[row.id]) leadAssignments[row.id] = [];
          leadAssignments[row.id].push({ lead_id: row.lead_id, lead_name: lead.name, lead_company: lead.company });
        }
      }
    }

    if (corpusIds.length > 0) {
      const { data: corpusLeads } = await supabase
        .from("dataset_samples")
        .select("source_video_index_id, lead_id, leads(name, company)")
        .in("source_video_index_id", corpusIds)
        .not("lead_id", "is", null);
      for (const row of corpusLeads ?? []) {
        const viId = row.source_video_index_id as string;
        const lead = (row as Record<string, unknown>).leads as { name: string; company: string } | null;
        if (viId && row.lead_id && lead) {
          if (!leadAssignments[viId]) leadAssignments[viId] = [];
          leadAssignments[viId].push({ lead_id: row.lead_id, lead_name: lead.name, lead_company: lead.company });
        }
      }
    }

    // Attach lead assignments to results
    const enrichedResults = results.map(r => ({
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
