import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/embeddings/openai";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import type { AgentContext } from "@/lib/enrichment/types";

// ---------------------------------------------------------------------------
// search_clips tool (unified -- replaces search_catalog + search_full_catalog)
// ---------------------------------------------------------------------------

function registerSearchClips(server: McpServer) {
  server.tool(
    "search_clips",
    "Semantic search over the unified clips table. Returns clips ranked by cosine similarity with structured metadata. Replaces the old search_catalog and search_full_catalog tools.",
    {
      query: z.string().describe("Natural language search query"),
      limit: z.number().min(1).max(50).default(10).describe("Max results (default 10, max 50)"),
      dataset_id: z.string().uuid().optional().describe("Optional: restrict to clips in a specific dataset"),
      s3_bucket: z.string().optional().describe("Optional: filter to a specific S3 bucket"),
      match_threshold: z.number().min(0).max(1).default(0.4).describe("Minimum similarity threshold (default 0.4)"),
    },
    async ({ query, limit, dataset_id, s3_bucket, match_threshold }) => {
      const supabase = createSupabaseAdminClient();

      // Embed query at 768 dimensions (clips table uses 768-dim vectors)
      const queryEmbedding = await generateEmbedding(query, 768);

      // Call unified match_clips RPC
      const { data: matches, error } = await supabase.rpc("match_clips", {
        query_embedding: queryEmbedding,
        match_count: limit,
        filter_dataset_id: dataset_id ?? null,
        filter_bucket: s3_bucket ?? null,
        match_threshold,
      });

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      if (!matches || matches.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ results: [], message: "No clips found matching query" }) }],
        };
      }

      // Generate signed URLs and format as ClipSearchResult
      const results = await Promise.all(
        matches.map(async (match: {
          id: string;
          s3_bucket: string;
          s3_key: string;
          mime_type: string | null;
          similarity: number;
          ai_caption: string | null;
          caption_text: string | null;
          ai_enrichment_source: string | null;
          ai_agent_context: Record<string, unknown> | null;
          ann_metadata: Record<string, unknown> | null;
          tech_resolution_width: number | null;
          tech_resolution_height: number | null;
          tech_fps: number | null;
          tech_duration_seconds: number | null;
          tech_codec: string | null;
        }) => {
          const signed_url = await getS3SignedUrl(match.s3_key, 600, match.s3_bucket);

          return {
            id: match.id,
            similarity: Math.round(match.similarity * 1000) / 1000,
            signed_url,
            s3_bucket: match.s3_bucket,
            s3_key: match.s3_key,
            mime_type: match.mime_type,
            ann_metadata: match.ann_metadata,
            tech_resolution_width: match.tech_resolution_width,
            tech_resolution_height: match.tech_resolution_height,
            tech_fps: match.tech_fps,
            tech_duration_seconds: match.tech_duration_seconds,
            tech_codec: match.tech_codec,
            ai_caption: match.ai_caption,
            ai_enrichment_source: match.ai_enrichment_source,
            ai_agent_context: match.ai_agent_context,
            caption_text: match.caption_text,
          };
        }),
      );

      // Scrub any leaked S3 URLs in caption/metadata fields
      const scrubbed = scrubS3Urls({ results });

      return {
        content: [{ type: "text" as const, text: JSON.stringify(scrubbed) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// get_dataset_overview tool
// ---------------------------------------------------------------------------

function registerGetDatasetOverview(server: McpServer) {
  server.tool(
    "get_dataset_overview",
    "Get a complete summary of a dataset including clip counts, annotation types, and representative clips.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID"),
    },
    async ({ dataset_id }) => {
      const supabase = createSupabaseAdminClient();

      // Fetch dataset
      const { data: dataset, error: dsError } = await supabase
        .from("datasets")
        .select("id, name, description, category_id, subcategory, total_samples, total_duration_hours, annotation_types")
        .eq("id", dataset_id)
        .single();

      if (dsError || !dataset) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Dataset not found" }) }],
        };
      }

      // Fetch category name
      const { data: category } = await supabase
        .from("dataset_categories")
        .select("name")
        .eq("id", dataset.category_id)
        .single();

      // Get clip IDs for this dataset via dataset_clips join
      const { data: dcRows } = await supabase
        .from("dataset_clips")
        .select("clip_id")
        .eq("dataset_id", dataset_id)
        .limit(200);

      const clipIds = (dcRows ?? []).map((r) => r.clip_id);

      // Fetch clips with ai_agent_context for aggregation
      let clips: Array<{
        id: string;
        ai_agent_context: AgentContext | null;
        s3_key: string;
        s3_bucket: string;
        mime_type: string | null;
        ai_caption: string | null;
        embedding: number[] | null;
      }> = [];

      if (clipIds.length > 0) {
        const { data } = await supabase
          .from("clips")
          .select("id, ai_agent_context, s3_key, s3_bucket, mime_type, ai_caption, embedding")
          .in("id", clipIds);
        clips = (data ?? []) as typeof clips;
      }

      const envCounts = new Map<string, number>();
      const actCounts = new Map<string, number>();
      const perspectives = new Set<string>();
      let embeddingCount = 0;

      for (const c of clips) {
        const ctx = c.ai_agent_context as AgentContext | null;
        if (c.embedding) embeddingCount++;
        if (!ctx) continue;
        for (const env of ctx.environments ?? []) {
          envCounts.set(env, (envCounts.get(env) ?? 0) + 1);
        }
        for (const act of ctx.activities ?? []) {
          actCounts.set(act, (actCounts.get(act) ?? 0) + 1);
        }
        if (ctx.camera_perspective) perspectives.add(ctx.camera_perspective);
      }

      const topEnvs = [...envCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([env]) => env);
      const topActs = [...actCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([act]) => act);

      // Get up to 3 representative clips with signed URLs
      const repClips = clips
        .filter((c) => c.ai_agent_context || c.ai_caption)
        .slice(0, 3);

      const representative_clips = await Promise.all(
        repClips.map(async (c) => {
          const signedUrl = await getS3SignedUrl(c.s3_key, 3600, c.s3_bucket);
          const ctx = c.ai_agent_context as AgentContext | null;
          return {
            clip_id: c.id,
            signed_url: signedUrl,
            mime_type: c.mime_type,
            ai_caption: c.ai_caption,
            scene_summary: ctx?.scene_summary ?? null,
          };
        }),
      );

      const result = scrubS3Urls({
        name: dataset.name,
        description: dataset.description,
        category: category?.name ?? null,
        subcategory: dataset.subcategory,
        total_samples: dataset.total_samples,
        total_duration_hours: dataset.total_duration_hours,
        annotation_types: dataset.annotation_types,
        clip_count: clipIds.length,
        top_environments: topEnvs,
        top_activities: topActs,
        camera_perspectives: [...perspectives],
        embedding_count: embeddingCount,
        enriched_count: clips.filter((c) => c.ai_agent_context || c.ai_caption).length,
        representative_clips,
      });

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// build_lead_brief tool
// ---------------------------------------------------------------------------

function registerBuildLeadBrief(server: McpServer) {
  server.tool(
    "build_lead_brief",
    "Build a structured data brief for lead outbound messaging. Returns raw catalog data grouped by dataset -- no marketing copy. Uses unified clips search.",
    {
      company_description: z.string().describe("Brief description of the target company"),
      use_case: z.string().describe("Their likely data use case"),
      limit: z.number().min(1).max(20).default(5).describe("Max clips to search (default 5)"),
    },
    async ({ company_description, use_case, limit }) => {
      const supabase = createSupabaseAdminClient();

      // Combine inputs for semantic search -- single 768-dim embedding
      const searchQuery = `${company_description} ${use_case}`;
      const queryEmbedding = await generateEmbedding(searchQuery, 768);

      // Single match_clips call replaces old match_samples + match_video_index
      const { data: matches, error } = await supabase.rpc("match_clips", {
        query_embedding: queryEmbedding,
        match_count: limit,
        filter_dataset_id: null,
        filter_bucket: null,
        match_threshold: 0.4,
      });

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      if (!matches || matches.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ clips: [], message: "No matching clips found" }) }],
        };
      }

      // Look up which datasets each clip belongs to via dataset_clips
      const clipIds = (matches as Array<{ id: string }>).map((m) => m.id);
      const { data: dcRows } = await supabase
        .from("dataset_clips")
        .select("clip_id, dataset_id")
        .in("clip_id", clipIds);

      const clipToDatasets = new Map<string, string[]>();
      for (const row of dcRows ?? []) {
        const arr = clipToDatasets.get(row.clip_id) ?? [];
        arr.push(row.dataset_id);
        clipToDatasets.set(row.clip_id, arr);
      }

      // Fetch dataset metadata for referenced datasets
      const allDatasetIds = [...new Set((dcRows ?? []).map((r) => r.dataset_id))];
      const { data: datasets } = allDatasetIds.length > 0
        ? await supabase
            .from("datasets")
            .select("id, name, total_samples, annotation_types")
            .in("id", allDatasetIds)
        : { data: [] };

      const datasetLookup = new Map((datasets ?? []).map((d) => [d.id, d]));

      // Build clips array with signed URLs and dataset context
      const clips = await Promise.all(
        (matches as Array<{
          id: string;
          s3_bucket: string;
          s3_key: string;
          similarity: number;
          ai_caption: string | null;
          caption_text: string | null;
          ai_agent_context: Record<string, unknown> | null;
          ai_enrichment_source: string | null;
          mime_type: string | null;
        }>).map(async (match) => {
          const signed_url = await getS3SignedUrl(match.s3_key, 600, match.s3_bucket);
          const ctx = match.ai_agent_context as AgentContext | null;

          // Datasets this clip belongs to
          const dsIds = clipToDatasets.get(match.id) ?? [];
          const clipDatasets = dsIds
            .map((id) => datasetLookup.get(id))
            .filter(Boolean)
            .map((d) => ({ id: d!.id, name: d!.name }));

          return {
            clip_id: match.id,
            similarity: Math.round(match.similarity * 1000) / 1000,
            s3_bucket: match.s3_bucket,
            ai_caption: match.ai_caption,
            caption_text: match.caption_text,
            scene_summary: ctx?.scene_summary ?? null,
            environments: ctx?.environments ?? [],
            activities: ctx?.activities ?? [],
            signed_url,
            datasets: clipDatasets,
          };
        }),
      );

      // Aggregate into dataset groups for backward-compatible brief structure
      const datasetMap = new Map<string, {
        dataset_name: string;
        dataset_id: string;
        total_samples: number | null;
        annotation_types: string[];
        matched_clips: typeof clips;
      }>();

      for (const clip of clips) {
        for (const ds of clip.datasets) {
          if (!datasetMap.has(ds.id)) {
            const dsMeta = datasetLookup.get(ds.id);
            datasetMap.set(ds.id, {
              dataset_name: ds.name,
              dataset_id: ds.id,
              total_samples: dsMeta?.total_samples ?? null,
              annotation_types: dsMeta?.annotation_types ?? [],
              matched_clips: [],
            });
          }
          datasetMap.get(ds.id)!.matched_clips.push(clip);
        }
      }

      const datasetResults = [...datasetMap.values()].map((group) => {
        const allEnvs = new Set<string>();
        const allActs = new Set<string>();
        for (const c of group.matched_clips) {
          c.environments.forEach((e: string) => allEnvs.add(e));
          c.activities.forEach((a: string) => allActs.add(a));
        }
        return {
          dataset_name: group.dataset_name,
          dataset_id: group.dataset_id,
          total_samples: group.total_samples,
          annotation_types: group.annotation_types,
          matched_clip_count: group.matched_clips.length,
          representative_signed_urls: group.matched_clips
            .map((c) => c.signed_url)
            .filter(Boolean)
            .slice(0, 3),
          aggregated_environments: [...allEnvs],
          aggregated_activities: [...allActs],
        };
      });

      // Include unaffiliated clips (not in any dataset)
      const unaffiliated = clips.filter((c) => c.datasets.length === 0);

      const scrubbed = scrubS3Urls({
        datasets: datasetResults,
        unaffiliated_clips: unaffiliated.map((c) => ({
          clip_id: c.clip_id,
          s3_bucket: c.s3_bucket,
          similarity: c.similarity,
          ai_caption: c.ai_caption,
          signed_url: c.signed_url,
        })),
      });

      return {
        content: [{ type: "text" as const, text: JSON.stringify(scrubbed) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// get_corpus_stats tool
// ---------------------------------------------------------------------------

function registerGetCorpusStats(server: McpServer) {
  server.tool(
    "get_corpus_stats",
    "Get statistics about the full clip corpus and dataset catalog. Returns total counts, per-bucket breakdowns, and keyword prevalence. Useful for citing real numbers in outreach.",
    {
      keyword: z.string().optional().describe("Optional: check how many clips mention this keyword (e.g. 'person', 'kitchen', 'face')"),
    },
    async ({ keyword }) => {
      const supabase = createSupabaseAdminClient();

      // Count clips per bucket (known buckets)
      const buckets = [
        "mv-artlist-external", "mv-abaka-external", "mv-troveo",
        "moonvalley-annotation-platform", "moonvalley-ml-datasets", "mv-xtr-external",
      ];

      const bucketStats: Array<{ bucket: string; count: number }> = [];
      for (const bucket of buckets) {
        const { count } = await supabase
          .from("clips")
          .select("id", { count: "exact", head: true })
          .eq("s3_bucket", bucket);

        if (count && count > 0) {
          bucketStats.push({ bucket, count });
        }
      }

      // Total clips
      const { count: totalClips } = await supabase
        .from("clips")
        .select("id", { count: "exact", head: true });

      // Total datasets
      const { count: totalDatasets } = await supabase
        .from("datasets")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true);

      // Total dataset_clips (clips assigned to datasets)
      const { count: totalDatasetClips } = await supabase
        .from("dataset_clips")
        .select("id", { count: "exact", head: true });

      // Total leads
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true });

      // Keyword prevalence (search in caption_text on clips)
      let keywordCount: number | null = null;
      if (keyword) {
        const { count } = await supabase
          .from("clips")
          .select("id", { count: "exact", head: true })
          .ilike("caption_text", `%${keyword}%`);
        keywordCount = count;
      }

      const result: Record<string, unknown> = {
        corpus: {
          total_clips: totalClips ?? 0,
          by_bucket: bucketStats,
        },
        catalog: {
          total_published_datasets: totalDatasets ?? 0,
          total_dataset_clip_assignments: totalDatasetClips ?? 0,
        },
        leads: {
          total: totalLeads ?? 0,
        },
      };

      if (keyword && keywordCount !== null) {
        result.keyword_search = {
          keyword,
          matching_clips: keywordCount,
          percentage: totalClips ? `${Math.round((keywordCount / totalClips) * 100)}%` : "N/A",
        };
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// list_datasets tool
// ---------------------------------------------------------------------------

function registerListDatasets(server: McpServer) {
  server.tool(
    "list_datasets",
    "List all datasets in the catalog with filtering. Shows name, category, type, sample count, and published status. Use to browse what data is available before searching.",
    {
      category: z.string().optional().describe("Filter by category name (e.g. 'Licensed Cinematic', 'Egocentric Crowd')"),
      published_only: z.boolean().default(true).describe("Only show published datasets (default: true)"),
      search: z.string().optional().describe("Search by dataset name or description"),
    },
    async ({ category, published_only, search }) => {
      const supabase = createSupabaseAdminClient();

      let query = supabase
        .from("datasets")
        .select("id, name, slug, description, type, source_type, subcategory, total_samples, total_duration_hours, annotation_types, is_published, category_id, dataset_categories:category_id(name)")
        .order("name");

      if (published_only) query = query.eq("is_published", true);
      if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

      const { data, error } = await query;

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      let datasets = (data ?? []).map((d: Record<string, unknown>) => ({
        id: d.id,
        name: d.name,
        category: (d.dataset_categories as Record<string, unknown> | null)?.name ?? null,
        type: d.type,
        source_type: d.source_type,
        subcategory: d.subcategory,
        total_samples: d.total_samples,
        total_duration_hours: d.total_duration_hours,
        annotation_types: d.annotation_types,
        is_published: d.is_published,
        description: d.description,
      }));

      if (category) {
        datasets = datasets.filter((d) =>
          (d.category as string | null)?.toLowerCase().includes(category.toLowerCase())
        );
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ datasets, count: datasets.length }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// query_clips tool -- structured SQL filters (not semantic search)
// ---------------------------------------------------------------------------

function registerQueryClips(server: McpServer) {
  server.tool(
    "query_clips",
    "Filter clips by structured criteria (not semantic search). Use for precise filtering by S3 prefix, duration range, enrichment status, etc. Returns clip IDs and metadata for further processing.",
    {
      s3_key_prefix: z.string().optional().describe("Filter clips whose s3_key starts with this prefix (e.g. 'egocentric-capture/completed/')"),
      s3_bucket: z.string().optional().describe("Filter to a specific S3 bucket"),
      min_duration: z.number().optional().describe("Minimum duration in seconds"),
      max_duration: z.number().optional().describe("Maximum duration in seconds"),
      min_hand_coverage: z.number().optional().describe("Minimum hand coverage ratio (0-1) from ai_agent_context"),
      has_embedding: z.boolean().optional().describe("Filter to clips that have (or lack) an embedding vector"),
      has_enrichment: z.boolean().optional().describe("Filter to clips that have (or lack) ai_enrichment_json"),
      has_caption: z.boolean().optional().describe("Filter to clips that have (or lack) caption_text"),
      has_annotation_key: z.boolean().optional().describe("Filter to clips that have (or lack) ann_annotation_key"),
      limit: z.number().min(1).max(200).default(50).describe("Max results (default 50, max 200)"),
      offset: z.number().default(0).describe("Offset for pagination (default 0)"),
    },
    async ({ s3_key_prefix, s3_bucket, min_duration, max_duration, min_hand_coverage, has_embedding, has_enrichment, has_caption, has_annotation_key, limit, offset }) => {
      const supabase = createSupabaseAdminClient();

      let query = supabase
        .from("clips")
        .select("id, s3_key, s3_bucket, mime_type, tech_duration_seconds, tech_resolution_width, tech_resolution_height, tech_fps, ai_caption, caption_text, ai_enrichment_source, ann_annotation_key")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (s3_key_prefix) {
        query = query.ilike("s3_key", `${s3_key_prefix}%`);
      }
      if (s3_bucket) {
        query = query.eq("s3_bucket", s3_bucket);
      }
      if (min_duration != null) {
        query = query.gte("tech_duration_seconds", min_duration);
      }
      if (max_duration != null) {
        query = query.lte("tech_duration_seconds", max_duration);
      }
      if (has_embedding === true) {
        query = query.not("embedding", "is", null);
      } else if (has_embedding === false) {
        query = query.is("embedding", null);
      }
      if (has_enrichment === true) {
        query = query.not("ai_enrichment_json", "is", null);
      } else if (has_enrichment === false) {
        query = query.is("ai_enrichment_json", null);
      }
      if (has_caption === true) {
        query = query.not("caption_text", "is", null);
      } else if (has_caption === false) {
        query = query.is("caption_text", null);
      }
      if (has_annotation_key === true) {
        query = query.not("ann_annotation_key", "is", null);
      } else if (has_annotation_key === false) {
        query = query.is("ann_annotation_key", null);
      }

      const { data, error, count } = await query;

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      // Post-filter for min_hand_coverage if specified (requires reading ai_agent_context)
      let clips = data ?? [];
      if (min_hand_coverage != null && clips.length > 0) {
        // Fetch ai_agent_context for these clips
        const ids = clips.map((c) => c.id);
        const { data: ctxData } = await supabase
          .from("clips")
          .select("id, ai_agent_context")
          .in("id", ids);

        const ctxMap = new Map((ctxData ?? []).map((c) => [c.id, c.ai_agent_context as AgentContext | null]));
        clips = clips.filter((c) => {
          const ctx = ctxMap.get(c.id);
          if (!ctx) return false;
          // Check for hand-related activities as a proxy for hand coverage
          const hasHands = ctx.activities?.some((a: string) =>
            a.toLowerCase().includes("hand") || a.toLowerCase().includes("manipulat") || a.toLowerCase().includes("grasp")
          );
          return hasHands;
        });
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            clips: clips.map((c) => ({
              id: c.id,
              s3_key: c.s3_key,
              s3_bucket: c.s3_bucket,
              mime_type: c.mime_type,
              duration_seconds: c.tech_duration_seconds,
              resolution: c.tech_resolution_width && c.tech_resolution_height
                ? `${c.tech_resolution_width}x${c.tech_resolution_height}`
                : null,
              fps: c.tech_fps,
              has_caption: !!c.caption_text,
              has_enrichment: !!c.ai_enrichment_source,
              has_annotation_key: !!c.ann_annotation_key,
              caption_preview: (c.ai_caption ?? c.caption_text ?? "").slice(0, 120) || null,
            })),
            count: clips.length,
            offset,
            limit,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// get_environment_breakdown tool -- environment/activity counts
// ---------------------------------------------------------------------------

function registerGetEnvironmentBreakdown(server: McpServer) {
  server.tool(
    "get_environment_breakdown",
    "Count clips by environment and activity labels from enrichment data. Useful for understanding what content exists in a prefix or dataset. Aggregates ai_agent_context fields in-memory.",
    {
      s3_key_prefix: z.string().optional().describe("Filter by S3 key prefix (recommended for performance, e.g. 'egocentric-capture/completed/')"),
      dataset_id: z.string().uuid().optional().describe("Filter to clips in a specific dataset"),
    },
    async ({ s3_key_prefix, dataset_id }) => {
      const supabase = createSupabaseAdminClient();

      let clipIds: string[] | null = null;

      // If dataset_id, get clip IDs from dataset_clips join
      if (dataset_id) {
        const { data: dcRows } = await supabase
          .from("dataset_clips")
          .select("clip_id")
          .eq("dataset_id", dataset_id)
          .limit(5000);
        clipIds = (dcRows ?? []).map((r) => r.clip_id);
        if (clipIds.length === 0) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify({ error: "No clips found in dataset", total: 0 }) }],
          };
        }
      }

      // Build query for clips with ai_agent_context
      let query = supabase
        .from("clips")
        .select("id, ai_agent_context")
        .not("ai_agent_context", "is", null)
        .limit(5000);

      if (s3_key_prefix) {
        query = query.ilike("s3_key", `${s3_key_prefix}%`);
      }
      if (clipIds) {
        query = query.in("id", clipIds);
      }

      const { data: clips, error } = await query;

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      if (!clips || clips.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ total: 0, by_environment: {}, by_activity: {}, message: "No enriched clips found" }) }],
        };
      }

      // Aggregate in-memory
      const envCounts = new Map<string, number>();
      const actCounts = new Map<string, number>();
      const perspectiveCounts = new Map<string, number>();

      for (const c of clips) {
        const ctx = c.ai_agent_context as AgentContext | null;
        if (!ctx) continue;

        for (const env of ctx.environments ?? []) {
          envCounts.set(env, (envCounts.get(env) ?? 0) + 1);
        }
        for (const act of ctx.activities ?? []) {
          actCounts.set(act, (actCounts.get(act) ?? 0) + 1);
        }
        if (ctx.camera_perspective) {
          perspectiveCounts.set(ctx.camera_perspective, (perspectiveCounts.get(ctx.camera_perspective) ?? 0) + 1);
        }
      }

      const sortMap = (m: Map<string, number>) =>
        Object.fromEntries([...m.entries()].sort((a, b) => b[1] - a[1]));

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            total: clips.length,
            by_environment: sortMap(envCounts),
            by_activity: sortMap(actCounts),
            by_perspective: sortMap(perspectiveCounts),
            unique_environments: envCounts.size,
            unique_activities: actCounts.size,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Register all search tools
// ---------------------------------------------------------------------------

export function register(server: McpServer) {
  registerSearchClips(server);
  registerGetDatasetOverview(server);
  registerBuildLeadBrief(server);
  registerGetCorpusStats(server);
  registerListDatasets(server);
  registerQueryClips(server);
  registerGetEnvironmentBreakdown(server);
}
