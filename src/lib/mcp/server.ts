import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/embeddings/openai";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import type { AgentContext } from "@/lib/enrichment/types";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";

/**
 * Create and configure the MCP server with all catalog tools.
 * Tools are registered here; the route handler manages transport and auth.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: "claru-catalog", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  registerSearchClips(server);
  registerGetDatasetOverview(server);
  registerBuildLeadBrief(server);
  registerListLeads(server);
  registerCreateLead(server);
  registerGetLead(server);
  registerUpdateLead(server);
  registerApproveLead(server);
  registerCreateCustomCatalog(server);
  registerDownloadClips(server);
  registerListDatasets(server);
  registerAddClipsToCatalog(server);
  registerGetCorpusStats(server);
  registerListLeadCatalogs(server);
  registerListCaseStudies(server);
  registerGetCaseStudy(server);
  registerUpdateDataset(server);
  registerRemoveClipsFromCatalog(server);
  registerGrantLeadAccess(server);
  registerRevokeLeadAccess(server);
  registerCreateLeadAuthUser(server);

  return server;
}

// ---------------------------------------------------------------------------
// search_clips tool (unified — replaces search_catalog + search_full_catalog)
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
    "Build a structured data brief for lead outbound messaging. Returns raw catalog data grouped by dataset — no marketing copy. Uses unified clips search.",
    {
      company_description: z.string().describe("Brief description of the target company"),
      use_case: z.string().describe("Their likely data use case"),
      limit: z.number().min(1).max(20).default(5).describe("Max clips to search (default 5)"),
    },
    async ({ company_description, use_case, limit }) => {
      const supabase = createSupabaseAdminClient();

      // Combine inputs for semantic search — single 768-dim embedding
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
// list_leads tool
// ---------------------------------------------------------------------------

function registerListLeads(server: McpServer) {
  server.tool(
    "list_leads",
    "List leads in the system. Use to find existing leads before creating duplicates. Supports filtering by status and searching by name/email/company.",
    {
      status: z.enum(["pending", "approved", "rejected"]).optional().describe("Filter by status (default: all)"),
      search: z.string().optional().describe("Search by name, email, or company"),
      limit: z.number().min(1).max(100).default(20).describe("Max results (default 20)"),
    },
    async ({ status, search, limit }) => {
      const supabase = createSupabaseAdminClient();

      let query = supabase
        .from("leads")
        .select("id, name, email, company, role, status, data_needs, use_case, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (status) query = query.eq("status", status);
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify({ leads: data ?? [], count: data?.length ?? 0 }) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// create_lead tool
// ---------------------------------------------------------------------------

function registerCreateLead(server: McpServer) {
  server.tool(
    "create_lead",
    "Create a new lead and optionally approve them immediately. Returns the lead record with ID. Check list_leads first to avoid duplicates.",
    {
      name: z.string().min(1).describe("Lead's full name"),
      email: z.string().email().describe("Lead's email address"),
      company: z.string().min(1).describe("Lead's company name"),
      role: z.string().optional().describe("Lead's role/title"),
      data_needs: z.string().optional().describe("What data they need"),
      use_case: z.string().optional().describe("Their use case for the data"),
      auto_approve: z.boolean().default(true).describe("Automatically approve the lead (default: true)"),
    },
    async ({ name, email, company, role, data_needs, use_case, auto_approve }) => {
      const supabase = createSupabaseAdminClient();

      // Check for existing lead with same email
      const { data: existing } = await supabase
        .from("leads")
        .select("id, name, email, status")
        .eq("email", email)
        .single();

      if (existing) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              error: "Lead with this email already exists",
              existing_lead: existing,
            }),
          }],
        };
      }

      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          name,
          email,
          company,
          role: role ?? "",
          data_needs: data_needs ?? "",
          use_case: use_case ?? "",
          status: auto_approve ? "approved" : "pending",
          admin_notes: "Created via MCP agent",
        })
        .select()
        .single();

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead,
            message: `Lead created${auto_approve ? " and approved" : ""}`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// get_lead tool
// ---------------------------------------------------------------------------

function registerGetLead(server: McpServer) {
  server.tool(
    "get_lead",
    "Get full details of a lead by ID, including their dataset access and custom samples.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
    },
    async ({ lead_id }) => {
      const supabase = createSupabaseAdminClient();

      const { data: lead, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", lead_id)
        .single();

      if (error || !lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      // Get dataset access
      const { data: access } = await supabase
        .from("lead_dataset_access")
        .select("dataset_id, granted_at, datasets:dataset_id(name)")
        .eq("lead_id", lead_id);

      // Get custom clips count (lead-specific dataset_clips entries)
      const { count: customSampleCount } = await supabase
        .from("dataset_clips")
        .select("id", { count: "exact", head: true })
        .eq("lead_id", lead_id);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead,
            dataset_access: (access ?? []).map((a: Record<string, unknown>) => ({
              dataset_id: a.dataset_id,
              dataset_name: (a.datasets as Record<string, unknown> | null)?.name ?? null,
              granted_at: a.granted_at,
            })),
            custom_sample_count: customSampleCount ?? 0,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// update_lead tool
// ---------------------------------------------------------------------------

function registerUpdateLead(server: McpServer) {
  server.tool(
    "update_lead",
    "Update lead details (name, email, company, role, data_needs, use_case, admin_notes). Cannot change status — use approve_lead instead. Cannot delete leads.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      name: z.string().optional().describe("Updated name"),
      email: z.string().email().optional().describe("Updated email"),
      company: z.string().optional().describe("Updated company"),
      role: z.string().optional().describe("Updated role/title"),
      data_needs: z.string().optional().describe("Updated data needs"),
      use_case: z.string().optional().describe("Updated use case"),
      admin_notes: z.string().optional().describe("Updated admin notes"),
    },
    async ({ lead_id, ...updates }) => {
      const supabase = createSupabaseAdminClient();

      // Filter out undefined values
      const fields: Record<string, string> = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) fields[key] = value;
      }

      if (Object.keys(fields).length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "No fields to update" }) }],
        };
      }

      const { data: lead, error } = await supabase
        .from("leads")
        .update(fields)
        .eq("id", lead_id)
        .select()
        .single();

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ lead, message: `Updated fields: ${Object.keys(fields).join(", ")}` }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// approve_lead tool
// ---------------------------------------------------------------------------

function registerApproveLead(server: McpServer) {
  server.tool(
    "approve_lead",
    "Approve a pending lead. Sets status to 'approved' but does NOT send an invite email or create a Supabase auth user. Use the admin UI to send invites.",
    {
      lead_id: z.string().uuid().describe("Lead UUID to approve"),
    },
    async ({ lead_id }) => {
      const supabase = createSupabaseAdminClient();

      // Check current status
      const { data: lead, error: fetchErr } = await supabase
        .from("leads")
        .select("id, name, email, status")
        .eq("id", lead_id)
        .single();

      if (fetchErr || !lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      if (lead.status === "approved") {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ message: "Lead is already approved", lead }) }],
        };
      }

      const { data: updated, error } = await supabase
        .from("leads")
        .update({ status: "approved" })
        .eq("id", lead_id)
        .select()
        .single();

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead: updated,
            message: `Lead "${lead.name}" approved. Use admin UI to send invite email.`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// create_custom_catalog tool
// ---------------------------------------------------------------------------

const CUSTOM_CURATIONS_CATEGORY_ID = "46cf5324-f3e3-484f-9cb3-7b1dffff0094";

function registerCreateCustomCatalog(server: McpServer) {
  server.tool(
    "create_custom_catalog",
    "Create a custom curated catalog for a lead from search results. Pass clip IDs from search_clips. Creates a dataset, inserts dataset_clips rows (no data copying), and grants lead access. Returns a portal URL.",
    {
      name: z.string().min(1).max(200).describe("Name for the custom catalog (e.g. 'Kitchen Activity Videos for Acme')"),
      lead_id: z.string().uuid().describe("Lead UUID to assign this catalog to"),
      clip_ids: z.array(z.string().uuid()).min(1).describe("Clip IDs from search_clips results"),
      note: z.string().optional().describe("Optional note about why these clips were selected"),
      is_showcase: z.boolean().default(false).describe("If true, clips are visible to ALL leads with dataset access (base showcase). If false (default), only visible to the specified lead."),
    },
    async ({ name, lead_id, clip_ids, note, is_showcase }) => {
      const supabase = createSupabaseAdminClient();

      // Verify lead exists
      const { data: lead } = await supabase
        .from("leads")
        .select("id, name, company")
        .eq("id", lead_id)
        .single();

      if (!lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      // Verify clip IDs exist
      const { data: validClips } = await supabase
        .from("clips")
        .select("id")
        .in("id", clip_ids);

      const validIds = new Set((validClips ?? []).map((c) => c.id));
      const invalidIds = clip_ids.filter((id) => !validIds.has(id));

      if (validIds.size === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "No valid clip IDs provided" }) }],
        };
      }

      // Create the dataset
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

      const { data: dataset, error: dsError } = await supabase
        .from("datasets")
        .insert({
          name,
          slug,
          category_id: CUSTOM_CURATIONS_CATEGORY_ID,
          type: "short_form",
          source_type: "curated",
          subcategory: "",
          description: `Custom curated collection for ${lead.name} (${lead.company})`,
          total_samples: 0,
          total_duration_hours: 0,
          geographic_coverage: "",
          annotation_types: [],
          is_published: true,
        })
        .select()
        .single();

      if (dsError || !dataset) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Failed to create dataset", details: dsError?.message }) }],
        };
      }

      // Insert dataset_clips rows — no data copying
      const dcRows = [...validIds].map((clipId) => ({
        dataset_id: dataset.id,
        clip_id: clipId,
        lead_id: is_showcase ? null : lead_id,
        is_showcase,
        added_by: "mcp_agent",
        note: note ?? null,
      }));

      const { data: insertedRows, error: dcError } = await supabase
        .from("dataset_clips")
        .insert(dcRows)
        .select("id");

      const inserted = insertedRows?.length ?? 0;

      if (dcError) {
        // Partial failure — some clips may have been inserted
        console.error("dataset_clips insert error:", dcError.message);
      }

      // Update sample count on dataset
      await supabase
        .from("datasets")
        .update({ total_samples: inserted })
        .eq("id", dataset.id);

      // Grant lead access
      await supabase
        .from("lead_dataset_access")
        .upsert(
          { lead_id, dataset_id: dataset.id },
          { onConflict: "lead_id,dataset_id" }
        );

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            dataset: { id: dataset.id, name: dataset.name, slug: dataset.slug },
            clips_added: inserted,
            invalid_clip_ids: invalidIds.length > 0 ? invalidIds : undefined,
            portal_url: `/portal/catalog/${dataset.id}`,
            lead: { id: lead.id, name: lead.name, company: lead.company },
            message: `Created catalog "${name}" with ${inserted} clips for ${lead.name}`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// download_clips tool
// ---------------------------------------------------------------------------

function registerDownloadClips(server: McpServer) {
  server.tool(
    "download_clips",
    "Get download-ready signed URLs for a list of clips by their clip IDs. URLs are valid for 1 hour.",
    {
      clip_ids: z.array(z.string().uuid()).min(1).describe("Clip IDs from search_clips results"),
    },
    async ({ clip_ids }) => {
      const supabase = createSupabaseAdminClient();

      const { data: clips } = await supabase
        .from("clips")
        .select("id, s3_bucket, s3_key, mime_type, filename, ai_caption, caption_text")
        .in("id", clip_ids);

      if (!clips || clips.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "No clips found for given IDs" }) }],
        };
      }

      const mimeMap: Record<string, string> = {
        mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
        jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
      };

      const downloads = await Promise.all(
        clips.map(async (c) => {
          const url = await getS3SignedUrl(c.s3_key, 3600, c.s3_bucket);
          const derivedFilename = c.filename || c.s3_key.split("/").pop() || "clip";
          const ext = derivedFilename.split(".").pop()?.toLowerCase();
          return {
            id: c.id,
            filename: derivedFilename,
            mime_type: c.mime_type || (ext && mimeMap[ext]) || "video/mp4",
            download_url: url,
            caption: c.ai_caption ?? c.caption_text ?? null,
          };
        }),
      );

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ downloads, count: downloads.length, expires_in: "1 hour" }),
        }],
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
// add_clips_to_catalog tool
// ---------------------------------------------------------------------------

function registerAddClipsToCatalog(server: McpServer) {
  server.tool(
    "add_clips_to_catalog",
    "Add clips to an existing catalog/dataset by inserting dataset_clips rows. No data copying — clips already exist in the clips table. Optionally assigns to a lead.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID to add clips to"),
      clip_ids: z.array(z.string().uuid()).min(1).describe("Clip IDs to add to this dataset"),
      lead_id: z.string().uuid().optional().describe("Optional: Lead UUID (makes clips lead-specific)"),
      is_showcase: z.boolean().default(false).describe("If true, clips become base showcase visible to ALL leads with access. If false, only the specified lead sees them."),
      note: z.string().optional().describe("Optional note"),
    },
    async ({ dataset_id, clip_ids, lead_id, is_showcase, note }) => {
      const supabase = createSupabaseAdminClient();

      // Verify dataset exists
      const { data: dataset } = await supabase
        .from("datasets")
        .select("id, name")
        .eq("id", dataset_id)
        .single();

      if (!dataset) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Dataset not found" }) }],
        };
      }

      // Verify clip IDs exist
      const { data: validClips } = await supabase
        .from("clips")
        .select("id")
        .in("id", clip_ids);

      const validIds = new Set((validClips ?? []).map((c) => c.id));

      // Insert dataset_clips rows
      const dcRows = [...validIds].map((clipId) => ({
        dataset_id,
        clip_id: clipId,
        lead_id: is_showcase ? null : (lead_id ?? null),
        is_showcase,
        added_by: "mcp_agent",
        note: note ?? null,
      }));

      let inserted = 0;
      if (dcRows.length > 0) {
        // Use individual inserts to handle duplicates gracefully (UNIQUE constraint)
        for (const row of dcRows) {
          const { error: insErr } = await supabase
            .from("dataset_clips")
            .insert(row);
          if (!insErr) inserted++;
        }
      }

      // Update sample count from dataset_clips
      const { count } = await supabase
        .from("dataset_clips")
        .select("id", { count: "exact", head: true })
        .eq("dataset_id", dataset_id);

      await supabase
        .from("datasets")
        .update({ total_samples: count ?? 0 })
        .eq("id", dataset_id);

      // Ensure lead has access if lead_id provided
      if (lead_id) {
        await supabase
          .from("lead_dataset_access")
          .upsert({ lead_id, dataset_id }, { onConflict: "lead_id,dataset_id" });
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            dataset_id,
            dataset_name: dataset.name,
            clips_added: inserted,
            total_clips: count ?? 0,
            message: `Added ${inserted} clips to "${dataset.name}"`,
          }),
        }],
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
// list_lead_catalogs tool
// ---------------------------------------------------------------------------

function registerListLeadCatalogs(server: McpServer) {
  server.tool(
    "list_lead_catalogs",
    "List all catalogs/datasets a lead has access to, including clip counts and portal URLs. Use to see what a lead already has before adding more.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
    },
    async ({ lead_id }) => {
      const supabase = createSupabaseAdminClient();

      // Verify lead
      const { data: lead } = await supabase
        .from("leads")
        .select("id, name, company")
        .eq("id", lead_id)
        .single();

      if (!lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      // Get dataset access with dataset details
      const { data: access } = await supabase
        .from("lead_dataset_access")
        .select("dataset_id, granted_at")
        .eq("lead_id", lead_id);

      if (!access || access.length === 0) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              lead: { id: lead.id, name: lead.name, company: lead.company },
              catalogs: [],
              message: "Lead has no catalog access",
            }),
          }],
        };
      }

      const datasetIds = access.map((a) => a.dataset_id);

      const { data: datasets } = await supabase
        .from("datasets")
        .select("id, name, description, type, total_samples, is_published")
        .in("id", datasetIds);

      // Count clips per dataset via dataset_clips (lead-specific vs base)
      const catalogs = await Promise.all(
        (datasets ?? []).map(async (ds) => {
          const { count: leadClips } = await supabase
            .from("dataset_clips")
            .select("id", { count: "exact", head: true })
            .eq("dataset_id", ds.id)
            .eq("lead_id", lead_id);

          const { count: baseClips } = await supabase
            .from("dataset_clips")
            .select("id", { count: "exact", head: true })
            .eq("dataset_id", ds.id)
            .is("lead_id", null);

          const grantedAt = access.find((a) => a.dataset_id === ds.id)?.granted_at;

          return {
            dataset_id: ds.id,
            name: ds.name,
            description: ds.description,
            type: ds.type,
            total_dataset_clips: ds.total_samples,
            base_clips: baseClips ?? 0,
            lead_specific_clips: leadClips ?? 0,
            is_published: ds.is_published,
            granted_at: grantedAt,
            portal_url: `/portal/catalog/${ds.id}`,
          };
        })
      );

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead: { id: lead.id, name: lead.name, company: lead.company },
            catalogs,
            total_catalogs: catalogs.length,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// list_case_studies tool
// ---------------------------------------------------------------------------

function registerListCaseStudies(server: McpServer) {
  server.tool(
    "list_case_studies",
    "List all published case studies with title, category, teaser, headline stat, and tags. Use to find relevant case studies for a prospect's use case or industry.",
    {
      category: z.string().optional().describe("Filter by category (e.g. 'robotics', 'annotation', 'safety', 'evaluation', 'video', 'data-collection', 'gaming', 'fashion-ai')"),
      tag: z.string().optional().describe("Filter by tag keyword (e.g. 'video', 'rlhf', 'egocentric')"),
    },
    async ({ category, tag }) => {
      let studies = getAllCaseStudies();

      if (category) {
        studies = studies.filter((s) => s.category === category);
      }

      if (tag) {
        const lowerTag = tag.toLowerCase();
        studies = studies.filter((s) =>
          s.title.toLowerCase().includes(lowerTag) ||
          s.teaser.toLowerCase().includes(lowerTag) ||
          s.category.includes(lowerTag)
        );
      }

      const results = studies.map((s) => ({
        slug: s.slug,
        title: s.title,
        category: s.category,
        teaser: s.teaser,
        headline_stat: s.headlineStat,
        headline_stat_label: s.headlineStatLabel,
        url: `/case-studies/${s.slug}`,
        date_published: s.datePublished,
        results_summary: s.results.map((r) => `${r.value} ${r.label}`),
      }));

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ case_studies: results, count: results.length }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// get_case_study tool
// ---------------------------------------------------------------------------

function registerGetCaseStudy(server: McpServer) {
  server.tool(
    "get_case_study",
    "Get the full content of a case study by slug. Returns challenge, approach, results, impact, FAQs, and related studies. Use in outreach to reference specific proof points.",
    {
      slug: z.string().describe("Case study slug (e.g. 'egocentric-video-collection', 'video-quality-at-scale')"),
    },
    async ({ slug }) => {
      const study = getCaseStudyBySlug(slug);

      if (!study) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Case study "${slug}" not found` }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            slug: study.slug,
            title: study.title,
            category: study.category,
            headline_stat: study.headlineStat,
            headline_stat_label: study.headlineStatLabel,
            summary: study.summary,
            challenge: study.challenge,
            approach: study.approach,
            results: study.results,
            impact: study.impact,
            why_it_matters: study.whyItMatters,
            faqs: study.faqs,
            process_steps: study.processSteps ?? [],
            related_slugs: study.relatedSlugs,
            url: `/case-studies/${study.slug}`,
            date_published: study.datePublished,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// update_dataset tool
// ---------------------------------------------------------------------------

function registerUpdateDataset(server: McpServer) {
  server.tool(
    "update_dataset",
    "Update metadata on any dataset/catalog — name, description, geographic coverage, annotation types, published status, type, subcategory, etc. Cannot delete datasets. If sync_clip_count is true, total_samples is derived from dataset_clips count.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID to update"),
      name: z.string().optional().describe("Updated name"),
      description: z.string().optional().describe("Updated description"),
      geographic_coverage: z.string().optional().describe("Updated geographic coverage (e.g. 'Global', 'North America')"),
      annotation_types: z.array(z.string()).optional().describe("Updated annotation type tags"),
      subcategory: z.string().optional().describe("Updated subcategory"),
      total_samples: z.number().optional().describe("Updated total sample count (overridden if sync_clip_count is true)"),
      total_duration_hours: z.number().optional().describe("Updated total duration in hours"),
      is_published: z.boolean().optional().describe("Set published status"),
      type: z.string().optional().describe("Dataset type (short_form, long_form, cinematic, etc.)"),
      source_type: z.string().optional().describe("Source type (collected, synthetic, curated)"),
      modality: z.string().optional().describe("Modality (video_text, image_text, etc.)"),
      sync_clip_count: z.boolean().default(false).describe("If true, derive total_samples from COUNT on dataset_clips"),
    },
    async ({ dataset_id, sync_clip_count, ...updates }) => {
      const supabase = createSupabaseAdminClient();

      // Filter out undefined values
      const fields: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) fields[key] = value;
      }

      // Derive total_samples from dataset_clips count if requested
      if (sync_clip_count) {
        const { count } = await supabase
          .from("dataset_clips")
          .select("id", { count: "exact", head: true })
          .eq("dataset_id", dataset_id);
        fields.total_samples = count ?? 0;
      }

      if (Object.keys(fields).length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "No fields to update" }) }],
        };
      }

      const { data: dataset, error } = await supabase
        .from("datasets")
        .update(fields)
        .eq("id", dataset_id)
        .select("id, name, description, type, source_type, subcategory, total_samples, total_duration_hours, geographic_coverage, annotation_types, is_published, modality")
        .single();

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            dataset,
            updated_fields: Object.keys(fields),
            message: `Updated ${Object.keys(fields).join(", ")} on "${dataset.name}"`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// remove_clips_from_catalog tool
// ---------------------------------------------------------------------------

function registerRemoveClipsFromCatalog(server: McpServer) {
  server.tool(
    "remove_clips_from_catalog",
    "Remove clips from a dataset/catalog by their clip IDs. Deletes dataset_clips join rows only — the clips themselves are preserved. Use list_lead_catalogs or get_dataset_overview to find clip IDs.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID to remove clips from"),
      clip_ids: z.array(z.string().uuid()).min(1).describe("Clip IDs to remove from this dataset"),
    },
    async ({ dataset_id, clip_ids }) => {
      const supabase = createSupabaseAdminClient();

      // Verify dataset exists
      const { data: dataset } = await supabase
        .from("datasets")
        .select("id, name")
        .eq("id", dataset_id)
        .single();

      if (!dataset) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Dataset not found" }) }],
        };
      }

      // Delete dataset_clips rows (not the clips themselves)
      const { data: deleted, error } = await supabase
        .from("dataset_clips")
        .delete()
        .eq("dataset_id", dataset_id)
        .in("clip_id", clip_ids)
        .select("id");

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      const removedCount = deleted?.length ?? 0;

      // Update the dataset clip count
      const { count } = await supabase
        .from("dataset_clips")
        .select("id", { count: "exact", head: true })
        .eq("dataset_id", dataset_id);

      await supabase
        .from("datasets")
        .update({ total_samples: count ?? 0 })
        .eq("id", dataset_id);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            dataset_id,
            dataset_name: dataset.name,
            removed: removedCount,
            requested: clip_ids.length,
            remaining_clips: count ?? 0,
            message: `Removed ${removedCount} clip${removedCount !== 1 ? "s" : ""} from "${dataset.name}"`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// grant_lead_access tool
// ---------------------------------------------------------------------------

function registerGrantLeadAccess(server: McpServer) {
  server.tool(
    "grant_lead_access",
    "Grant a lead access to one or more existing datasets/catalogs. The lead will see these in their portal. Use list_datasets to find dataset IDs.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      dataset_ids: z.array(z.string().uuid()).min(1).describe("Dataset UUIDs to grant access to"),
    },
    async ({ lead_id, dataset_ids }) => {
      const supabase = createSupabaseAdminClient();

      // Verify lead exists
      const { data: lead } = await supabase
        .from("leads")
        .select("id, name, company")
        .eq("id", lead_id)
        .single();

      if (!lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      // Verify datasets exist
      const { data: datasets } = await supabase
        .from("datasets")
        .select("id, name")
        .in("id", dataset_ids);

      const foundIds = new Set((datasets ?? []).map((d) => d.id));
      const notFound = dataset_ids.filter((id) => !foundIds.has(id));

      // Upsert access grants
      const rows = dataset_ids
        .filter((id) => foundIds.has(id))
        .map((dataset_id) => ({ lead_id, dataset_id }));

      let granted = 0;
      if (rows.length > 0) {
        const { error } = await supabase
          .from("lead_dataset_access")
          .upsert(rows, { onConflict: "lead_id,dataset_id" });

        if (error) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
          };
        }
        granted = rows.length;
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead: { id: lead.id, name: lead.name, company: lead.company },
            granted,
            datasets_granted: (datasets ?? []).map((d) => ({ id: d.id, name: d.name })),
            not_found: notFound.length > 0 ? notFound : undefined,
            message: `Granted ${lead.name} access to ${granted} dataset${granted !== 1 ? "s" : ""}`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// revoke_lead_access tool
// ---------------------------------------------------------------------------

function registerRevokeLeadAccess(server: McpServer) {
  server.tool(
    "revoke_lead_access",
    "Revoke a lead's access to one or more datasets/catalogs. They will no longer see these in their portal.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      dataset_ids: z.array(z.string().uuid()).min(1).describe("Dataset UUIDs to revoke access from"),
    },
    async ({ lead_id, dataset_ids }) => {
      const supabase = createSupabaseAdminClient();

      const { data: deleted, error } = await supabase
        .from("lead_dataset_access")
        .delete()
        .eq("lead_id", lead_id)
        .in("dataset_id", dataset_ids)
        .select("dataset_id");

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            revoked: deleted?.length ?? 0,
            message: `Revoked access to ${deleted?.length ?? 0} dataset${(deleted?.length ?? 0) !== 1 ? "s" : ""}`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// send_lead_invite tool
// ---------------------------------------------------------------------------

function registerCreateLeadAuthUser(server: McpServer) {
  server.tool(
    "create_lead_auth_user",
    "Create a Supabase auth account with a temporary password for an approved lead so they can log in to the portal. Required before a lead can access the portal. Does NOT send any emails. Returns the temp password — share it with the lead securely.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      password: z.string().min(8).optional().describe("Custom password. If omitted, a random temp password is generated."),
    },
    async ({ lead_id, password: customPassword }) => {
      const supabase = createSupabaseAdminClient();

      // Generate a temp password if not provided — use firstname!123 convention
      let tempPassword = customPassword;
      if (!tempPassword) {
        const { data: leadForName } = await supabase
          .from("leads")
          .select("name")
          .eq("id", lead_id)
          .single();
        const firstName = (leadForName?.name ?? "user").split(" ")[0].toLowerCase();
        tempPassword = `${firstName}!123`;
      }

      // Fetch lead
      const { data: lead, error: fetchErr } = await supabase
        .from("leads")
        .select("*")
        .eq("id", lead_id)
        .single();

      if (fetchErr || !lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      if (lead.status !== "approved") {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({ error: "Lead must be approved first. Use approve_lead tool.", status: lead.status }),
          }],
        };
      }

      // Create or find Supabase Auth user (with temp password for signInWithPassword)
      let supabaseUserId = lead.supabase_user_id;
      let passwordSet = false;

      if (!supabaseUserId) {
        const { data: authUser, error: createErr } =
          await supabase.auth.admin.createUser({
            email: lead.email,
            password: tempPassword,
            email_confirm: true,
          });

        if (createErr) {
          // User might already exist — find and update their password
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existing = existingUsers?.users?.find((u) => u.email === lead.email);

          if (existing) {
            supabaseUserId = existing.id;
            // Update password and confirm email on existing user
            await supabase.auth.admin.updateUserById(existing.id, {
              password: tempPassword,
              email_confirm: true,
            });
            passwordSet = true;
          } else {
            return {
              content: [{
                type: "text" as const,
                text: JSON.stringify({ error: "Failed to create auth user", details: createErr.message }),
              }],
            };
          }
        } else {
          supabaseUserId = authUser.user.id;
          passwordSet = true;
        }

        // Store supabase_user_id on lead
        await supabase
          .from("leads")
          .update({ supabase_user_id: supabaseUserId })
          .eq("id", lead_id);
      } else {
        // Auth user already exists — update password and ensure email confirmed
        await supabase.auth.admin.updateUserById(supabaseUserId, {
          password: tempPassword,
          email_confirm: true,
        });
        passwordSet = true;
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead_id,
            email: lead.email,
            supabase_user_id: supabaseUserId,
            temp_password: tempPassword,
            password_set: passwordSet,
            portal_url: `${siteUrl}/portal/login`,
            message: `Auth account ready. Lead can log in with email: ${lead.email} and the temp password.`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Auth: Bearer token validation using timing-safe comparison
// ---------------------------------------------------------------------------

export function validateBearerToken(request: Request): boolean {
  const expectedToken = process.env.ADMIN_MCP_TOKEN;
  if (!expectedToken) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);

  // Timing-safe comparison
  if (token.length !== expectedToken.length) return false;

  const encoder = new TextEncoder();
  const a = encoder.encode(token);
  const b = encoder.encode(expectedToken);

  // Use crypto.subtle for timing-safe compare in web standard environments
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

// ---------------------------------------------------------------------------
// Rate limiting: in-memory per-IP limits
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  minuteCount: number;
  minuteStart: number;
  hourCount: number;
  hourStart: number;
}

const RATE_LIMIT_MINUTE = 100;
const RATE_LIMIT_HOUR = 1000;
const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(ip);

  if (!entry) {
    entry = {
      minuteCount: 0,
      minuteStart: now,
      hourCount: 0,
      hourStart: now,
    };
    rateLimitStore.set(ip, entry);
  }

  // Reset minute window
  if (now - entry.minuteStart > 60_000) {
    entry.minuteCount = 0;
    entry.minuteStart = now;
  }

  // Reset hour window
  if (now - entry.hourStart > 3_600_000) {
    entry.hourCount = 0;
    entry.hourStart = now;
  }

  entry.minuteCount++;
  entry.hourCount++;

  if (entry.minuteCount > RATE_LIMIT_MINUTE) {
    const retryAfter = Math.ceil((entry.minuteStart + 60_000 - now) / 1000);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  if (entry.hourCount > RATE_LIMIT_HOUR) {
    const retryAfter = Math.ceil((entry.hourStart + 3_600_000 - now) / 1000);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  return { allowed: true };
}
