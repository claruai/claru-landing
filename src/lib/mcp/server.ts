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

  registerSearchCatalog(server);
  registerSearchFullCatalog(server);
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
  registerSendLeadInvite(server);

  return server;
}

// ---------------------------------------------------------------------------
// search_catalog tool
// ---------------------------------------------------------------------------

function registerSearchCatalog(server: McpServer) {
  server.tool(
    "search_catalog",
    "Semantic search over annotated dataset samples. Returns samples ranked by relevance to the query.",
    {
      query: z.string().describe("Natural language search query"),
      limit: z.number().min(1).max(50).default(10).describe("Max results (default 10, max 50)"),
      dataset_id: z.string().uuid().optional().describe("Optional: restrict to a single dataset"),
    },
    async ({ query, limit, dataset_id }) => {
      const supabase = createSupabaseAdminClient();

      // Embed the query
      const queryEmbedding = await generateEmbedding(query);

      // Call match_samples RPC
      const { data: matches, error } = await supabase.rpc("match_samples", {
        query_embedding: queryEmbedding,
        match_count: limit,
        filter_dataset_id: dataset_id ?? null,
      });

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      if (!matches || matches.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ results: [], message: "No samples found matching query" }) }],
        };
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

      // Scrub any leaked S3 URLs
      const scrubbed = scrubS3Urls({ results });

      return {
        content: [{ type: "text" as const, text: JSON.stringify(scrubbed) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// search_full_catalog tool (video_index — 768-dim)
// ---------------------------------------------------------------------------

function registerSearchFullCatalog(server: McpServer) {
  server.tool(
    "search_full_catalog",
    "Semantic search over the full video corpus (1.3M+ S3 videos). Returns results from video_index ranked by cosine similarity.",
    {
      query: z.string().describe("Natural language search query"),
      limit: z.number().min(1).max(50).default(10).describe("Max results (default 10, max 50)"),
      s3_bucket: z.string().optional().describe("Optional: filter to a specific S3 bucket"),
      match_threshold: z.number().min(0).max(1).default(0.4).describe("Minimum similarity threshold (default 0.4)"),
    },
    async ({ query, limit, s3_bucket, match_threshold }) => {
      const supabase = createSupabaseAdminClient();

      // Embed query at 768 dimensions (matches video_index)
      const queryEmbedding = await generateEmbedding(query, 768);

      const { data: matches, error } = await supabase.rpc("match_video_index", {
        query_embedding: queryEmbedding,
        match_count: limit,
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
          content: [{ type: "text" as const, text: JSON.stringify({ results: [], message: "No videos found matching query" }) }],
        };
      }

      // Generate signed URLs (600s TTL for MCP)
      const results = await Promise.all(
        matches.map(async (match: {
          id: string;
          s3_bucket: string;
          s3_key: string;
          caption_text: string | null;
          similarity: number;
          enrichment_source: string | null;
        }) => {
          const signed_url = await getS3SignedUrl(match.s3_key, 600, match.s3_bucket);

          return {
            id: match.id,
            s3_bucket: match.s3_bucket,
            s3_key: match.s3_key,
            caption_text: match.caption_text,
            similarity: Math.round(match.similarity * 1000) / 1000,
            enrichment_source: match.enrichment_source,
            signed_url,
          };
        }),
      );

      // Scrub S3 URLs in caption_text only — signed_url preserved via PRESERVED_KEYS
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
    "Get a complete summary of a dataset including sample counts, annotation types, and representative samples.",
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

      // Aggregate agent_context fields from samples
      const { data: samples } = await supabase
        .from("dataset_samples")
        .select("agent_context, s3_object_key, mime_type, embedding")
        .eq("dataset_id", dataset_id)
        .not("agent_context", "is", null)
        .limit(200);

      const envCounts = new Map<string, number>();
      const actCounts = new Map<string, number>();
      const perspectives = new Set<string>();
      let embeddingCount = 0;

      for (const s of samples ?? []) {
        const ctx = s.agent_context as AgentContext | null;
        if (!ctx) continue;
        if (s.embedding) embeddingCount++;
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

      // Get up to 3 representative samples with signed URLs
      const { data: repSamples } = await supabase
        .from("dataset_samples")
        .select("s3_object_key, mime_type, agent_context")
        .eq("dataset_id", dataset_id)
        .not("agent_context", "is", null)
        .not("s3_object_key", "is", null)
        .limit(3);

      const representative_samples = await Promise.all(
        (repSamples ?? []).map(async (s) => {
          const signedUrl = s.s3_object_key
            ? await getS3SignedUrl(s.s3_object_key, 3600)
            : null;
          return {
            signed_url: signedUrl,
            mime_type: s.mime_type,
            scene_summary: (s.agent_context as AgentContext | null)?.scene_summary ?? null,
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
        top_environments: topEnvs,
        top_activities: topActs,
        camera_perspectives: [...perspectives],
        embedding_count: embeddingCount,
        enriched_count: (samples ?? []).length,
        representative_samples,
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
    "Build a structured data brief for lead outbound messaging. Returns raw catalog data grouped by dataset — no marketing copy.",
    {
      company_description: z.string().describe("Brief description of the target company"),
      use_case: z.string().describe("Their likely data use case"),
      limit: z.number().min(1).max(20).default(5).describe("Max samples to search (default 5)"),
    },
    async ({ company_description, use_case, limit }) => {
      const supabase = createSupabaseAdminClient();

      // Combine inputs for semantic search
      const searchQuery = `${company_description} ${use_case}`;
      const queryEmbedding = await generateEmbedding(searchQuery);

      const { data: matches, error } = await supabase.rpc("match_samples", {
        query_embedding: queryEmbedding,
        match_count: limit,
        filter_dataset_id: null,
      });

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      if (!matches || matches.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ datasets: [], message: "No matching catalog data found" }) }],
        };
      }

      // Group by dataset
      const datasetMap = new Map<string, {
        dataset_name: string;
        dataset_id: string;
        matched_samples: Array<{
          similarity: number;
          scene_summary: string | null;
          environments: string[];
          activities: string[];
          signed_url: string | null;
        }>;
      }>();

      for (const match of matches as Array<{
        sample_id: string;
        dataset_id: string;
        dataset_name: string;
        similarity: number;
        agent_context: AgentContext | null;
        s3_object_key: string | null;
        mime_type: string;
      }>) {
        if (!datasetMap.has(match.dataset_id)) {
          datasetMap.set(match.dataset_id, {
            dataset_name: match.dataset_name,
            dataset_id: match.dataset_id,
            matched_samples: [],
          });
        }

        let signed_url: string | null = null;
        if (match.s3_object_key) {
          signed_url = await getS3SignedUrl(match.s3_object_key, 3600);
        }

        const ctx = match.agent_context;
        datasetMap.get(match.dataset_id)!.matched_samples.push({
          similarity: Math.round(match.similarity * 1000) / 1000,
          scene_summary: ctx?.scene_summary ?? null,
          environments: ctx?.environments ?? [],
          activities: ctx?.activities ?? [],
          signed_url,
        });
      }

      // Enrich with dataset metadata
      const datasetIds = [...datasetMap.keys()];
      const { data: datasets } = await supabase
        .from("datasets")
        .select("id, total_samples, annotation_types")
        .in("id", datasetIds);

      const result = [...datasetMap.values()].map((group) => {
        const ds = datasets?.find((d) => d.id === group.dataset_id);
        const allEnvs = new Set<string>();
        const allActs = new Set<string>();
        for (const s of group.matched_samples) {
          s.environments.forEach((e) => allEnvs.add(e));
          s.activities.forEach((a) => allActs.add(a));
        }
        return {
          dataset_name: group.dataset_name,
          dataset_id: group.dataset_id,
          total_samples: ds?.total_samples ?? null,
          annotation_types: ds?.annotation_types ?? [],
          matched_sample_count: group.matched_samples.length,
          representative_signed_urls: group.matched_samples
            .map((s) => s.signed_url)
            .filter(Boolean)
            .slice(0, 3),
          aggregated_environments: [...allEnvs],
          aggregated_activities: [...allActs],
        };
      });

      // Also search full corpus (768-dim)
      let fullCorpusResults: Array<{
        id: string;
        s3_bucket: string;
        caption_text: string | null;
        similarity: number;
        enrichment_source: string | null;
        signed_url: string | null;
        source: "full_corpus";
      }> = [];

      try {
        const queryEmbedding768 = await generateEmbedding(searchQuery, 768);
        const { data: fcMatches } = await supabase.rpc("match_video_index", {
          query_embedding: queryEmbedding768,
          match_count: limit,
          filter_bucket: null,
          match_threshold: 0.4,
        });

        if (fcMatches && fcMatches.length > 0) {
          fullCorpusResults = await Promise.all(
            (fcMatches as Array<{
              id: string;
              s3_bucket: string;
              s3_key: string;
              caption_text: string | null;
              similarity: number;
              enrichment_source: string | null;
            }>).map(async (m) => ({
              id: m.id,
              s3_bucket: m.s3_bucket,
              caption_text: m.caption_text,
              similarity: Math.round(m.similarity * 1000) / 1000,
              enrichment_source: m.enrichment_source,
              signed_url: await getS3SignedUrl(m.s3_key, 600, m.s3_bucket),
              source: "full_corpus" as const,
            })),
          );
        }
      } catch {
        // full corpus search is optional — don't fail the whole brief
      }

      const scrubbed = scrubS3Urls({
        datasets: result,
        full_corpus: fullCorpusResults,
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

      // Get custom samples count
      const { count: customSampleCount } = await supabase
        .from("dataset_samples")
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
    "Create a custom curated catalog for a lead from search results. Pass sample IDs from search_catalog (as dataset_sample_ids) and/or video IDs from search_full_catalog (as video_index_ids). The catalog is created, samples are added, and the lead gets access. Returns a portal URL the lead can visit.",
    {
      name: z.string().min(1).max(200).describe("Name for the custom catalog (e.g. 'Kitchen Activity Videos for Acme')"),
      lead_id: z.string().uuid().describe("Lead UUID to assign this catalog to"),
      dataset_sample_ids: z.array(z.string().uuid()).optional().describe("Sample IDs from search_catalog results"),
      video_index_ids: z.array(z.string().uuid()).optional().describe("Video IDs from search_full_catalog results"),
      note: z.string().optional().describe("Optional note about why these clips were selected"),
    },
    async ({ name, lead_id, dataset_sample_ids, video_index_ids, note }) => {
      const sampleIds = dataset_sample_ids ?? [];
      const videoIds = video_index_ids ?? [];

      if (sampleIds.length === 0 && videoIds.length === 0) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({ error: "Provide at least one dataset_sample_id or video_index_id" }),
          }],
        };
      }

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

      const mimeMap: Record<string, string> = {
        mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
        jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
      };

      let inserted = 0;

      // Process video_index clips
      for (const viId of videoIds) {
        const { data: vi } = await supabase
          .from("video_index")
          .select("s3_bucket, s3_key, caption_text, enrichment_source")
          .eq("id", viId)
          .single();

        if (!vi) continue;

        const ext = vi.s3_key.split(".").pop()?.toLowerCase();
        const mimeType = (ext && mimeMap[ext]) || "video/mp4";

        const { error: insErr } = await supabase
          .from("dataset_samples")
          .insert({
            dataset_id: dataset.id,
            lead_id,
            s3_object_key: vi.s3_key,
            filename: vi.s3_key.split("/").pop() || "sample",
            mime_type: mimeType,
            file_size_bytes: 0,
            metadata_json: { caption: vi.caption_text, source: vi.enrichment_source, note },
            added_by: "mcp_agent",
            source_video_index_id: viId,
          });

        if (!insErr) inserted++;
      }

      // Process existing catalog samples
      for (const sId of sampleIds) {
        const { data: existing } = await supabase
          .from("dataset_samples")
          .select("s3_object_key, filename, mime_type, file_size_bytes, metadata_json, agent_context")
          .eq("id", sId)
          .single();

        if (!existing) continue;

        const { error: insErr } = await supabase
          .from("dataset_samples")
          .insert({
            dataset_id: dataset.id,
            lead_id,
            s3_object_key: existing.s3_object_key,
            filename: existing.filename,
            mime_type: existing.mime_type,
            file_size_bytes: existing.file_size_bytes,
            metadata_json: {
              ...(existing.metadata_json as Record<string, unknown>),
              note,
              source_sample_id: sId,
            },
            agent_context: existing.agent_context,
            added_by: "mcp_agent",
          });

        if (!insErr) inserted++;
      }

      // Update sample count
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
            samples_added: inserted,
            portal_url: `/portal/catalog/${dataset.id}`,
            lead: { id: lead.id, name: lead.name, company: lead.company },
            message: `Created catalog "${name}" with ${inserted} samples for ${lead.name}`,
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
    "Get download-ready signed URLs for a list of clips. Works with both dataset sample IDs and video_index IDs. URLs are valid for 1 hour.",
    {
      dataset_sample_ids: z.array(z.string().uuid()).optional().describe("Sample IDs from search_catalog"),
      video_index_ids: z.array(z.string().uuid()).optional().describe("Video IDs from search_full_catalog"),
    },
    async ({ dataset_sample_ids, video_index_ids }) => {
      const sampleIds = dataset_sample_ids ?? [];
      const videoIds = video_index_ids ?? [];

      if (sampleIds.length === 0 && videoIds.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Provide at least one ID" }) }],
        };
      }

      const supabase = createSupabaseAdminClient();
      const downloads: Array<{
        id: string;
        source: "catalog" | "full_corpus";
        filename: string;
        mime_type: string;
        download_url: string | null;
        caption: string | null;
      }> = [];

      // Catalog samples
      if (sampleIds.length > 0) {
        const { data: samples } = await supabase
          .from("dataset_samples")
          .select("id, filename, mime_type, s3_object_key, agent_context")
          .in("id", sampleIds);

        for (const s of samples ?? []) {
          const url = s.s3_object_key ? await getS3SignedUrl(s.s3_object_key, 3600) : null;
          const ctx = s.agent_context as AgentContext | null;
          downloads.push({
            id: s.id,
            source: "catalog",
            filename: s.filename,
            mime_type: s.mime_type,
            download_url: url,
            caption: ctx?.scene_summary ?? null,
          });
        }
      }

      // Full corpus
      if (videoIds.length > 0) {
        const { data: videos } = await supabase
          .from("video_index")
          .select("id, s3_bucket, s3_key, caption_text")
          .in("id", videoIds);

        for (const v of videos ?? []) {
          const url = await getS3SignedUrl(v.s3_key, 3600, v.s3_bucket);
          const filename = v.s3_key.split("/").pop() || "clip";
          const ext = filename.split(".").pop()?.toLowerCase();
          const mimeMap: Record<string, string> = {
            mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
            jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
          };
          downloads.push({
            id: v.id,
            source: "full_corpus",
            filename,
            mime_type: (ext && mimeMap[ext]) || "video/mp4",
            download_url: url,
            caption: v.caption_text,
          });
        }
      }

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
    "Add more clips to an existing catalog/dataset. Use to expand a custom catalog after initial creation. Requires the dataset ID and lead ID.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID to add clips to"),
      lead_id: z.string().uuid().describe("Lead UUID (clips are added as lead-specific samples)"),
      dataset_sample_ids: z.array(z.string().uuid()).optional().describe("Catalog sample IDs to copy into this dataset"),
      video_index_ids: z.array(z.string().uuid()).optional().describe("Full corpus video IDs to add"),
      note: z.string().optional().describe("Optional note"),
    },
    async ({ dataset_id, lead_id, dataset_sample_ids, video_index_ids, note }) => {
      const sampleIds = dataset_sample_ids ?? [];
      const videoIds = video_index_ids ?? [];

      if (sampleIds.length === 0 && videoIds.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Provide at least one clip ID" }) }],
        };
      }

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

      const mimeMap: Record<string, string> = {
        mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
        jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
      };

      let inserted = 0;

      for (const viId of videoIds) {
        const { data: vi } = await supabase
          .from("video_index")
          .select("s3_bucket, s3_key, caption_text, enrichment_source")
          .eq("id", viId)
          .single();

        if (!vi) continue;

        const ext = vi.s3_key.split(".").pop()?.toLowerCase();
        const mimeType = (ext && mimeMap[ext]) || "video/mp4";

        const { error: insErr } = await supabase
          .from("dataset_samples")
          .insert({
            dataset_id,
            lead_id,
            s3_object_key: vi.s3_key,
            filename: vi.s3_key.split("/").pop() || "sample",
            mime_type: mimeType,
            file_size_bytes: 0,
            metadata_json: { caption: vi.caption_text, source: vi.enrichment_source, note },
            added_by: "mcp_agent",
            source_video_index_id: viId,
          });

        if (!insErr) inserted++;
      }

      for (const sId of sampleIds) {
        const { data: existing } = await supabase
          .from("dataset_samples")
          .select("s3_object_key, filename, mime_type, file_size_bytes, metadata_json, agent_context")
          .eq("id", sId)
          .single();

        if (!existing) continue;

        const { error: insErr } = await supabase
          .from("dataset_samples")
          .insert({
            dataset_id,
            lead_id,
            s3_object_key: existing.s3_object_key,
            filename: existing.filename,
            mime_type: existing.mime_type,
            file_size_bytes: existing.file_size_bytes,
            metadata_json: {
              ...(existing.metadata_json as Record<string, unknown>),
              note,
              source_sample_id: sId,
            },
            agent_context: existing.agent_context,
            added_by: "mcp_agent",
          });

        if (!insErr) inserted++;
      }

      // Update sample count
      const { count } = await supabase
        .from("dataset_samples")
        .select("id", { count: "exact", head: true })
        .eq("dataset_id", dataset_id);

      await supabase
        .from("datasets")
        .update({ total_samples: count ?? 0 })
        .eq("id", dataset_id);

      // Ensure lead has access
      await supabase
        .from("lead_dataset_access")
        .upsert({ lead_id, dataset_id }, { onConflict: "lead_id,dataset_id" });

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            dataset_id,
            dataset_name: dataset.name,
            clips_added: inserted,
            total_samples: count ?? 0,
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
    "Get statistics about the full video corpus and dataset catalog. Returns total counts, per-bucket breakdowns, and keyword prevalence. Useful for citing real numbers in outreach.",
    {
      keyword: z.string().optional().describe("Optional: check how many clips mention this keyword (e.g. 'person', 'kitchen', 'face')"),
    },
    async ({ keyword }) => {
      const supabase = createSupabaseAdminClient();

      // Video index stats by bucket
      const { data: bucketStats } = await supabase.rpc("get_video_index_stats" as never) as { data: null };

      // Fallback: manual query
      let stats: Array<{ s3_bucket: string; enrichment_source: string; total: number }> = [];

      if (!bucketStats) {
        // Direct query
        const { data } = await supabase
          .from("video_index")
          .select("s3_bucket, enrichment_source")
          .limit(0);

        // Use raw SQL via a simpler approach — count per bucket
        // Since we can't do GROUP BY via PostgREST easily, use known buckets
        const buckets = [
          "mv-artlist-external", "mv-abaka-external", "mv-troveo",
          "moonvalley-annotation-platform", "moonvalley-ml-datasets", "mv-xtr-external",
        ];

        for (const bucket of buckets) {
          const { count } = await supabase
            .from("video_index")
            .select("id", { count: "exact", head: true })
            .eq("s3_bucket", bucket);

          if (count && count > 0) {
            stats.push({ s3_bucket: bucket, enrichment_source: "", total: count });
          }
        }
      }

      // Total video index
      const { count: totalVideos } = await supabase
        .from("video_index")
        .select("id", { count: "exact", head: true });

      // Total datasets
      const { count: totalDatasets } = await supabase
        .from("datasets")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true);

      // Total dataset samples
      const { count: totalSamples } = await supabase
        .from("dataset_samples")
        .select("id", { count: "exact", head: true });

      // Total leads
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true });

      // Keyword prevalence
      let keywordCount: number | null = null;
      if (keyword) {
        const { count } = await supabase
          .from("video_index")
          .select("id", { count: "exact", head: true })
          .ilike("caption_text", `%${keyword}%`);
        keywordCount = count;
      }

      const result: Record<string, unknown> = {
        full_corpus: {
          total_indexed_videos: totalVideos ?? 0,
          by_bucket: stats.map((s) => ({ bucket: s.s3_bucket, count: s.total })),
        },
        catalog: {
          total_published_datasets: totalDatasets ?? 0,
          total_samples_with_previews: totalSamples ?? 0,
        },
        leads: {
          total: totalLeads ?? 0,
        },
      };

      if (keyword && keywordCount !== null) {
        result.keyword_search = {
          keyword,
          matching_clips: keywordCount,
          percentage: totalVideos ? `${Math.round((keywordCount / totalVideos) * 100)}%` : "N/A",
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
    "List all catalogs/datasets a lead has access to, including sample counts and portal URLs. Use to see what a lead already has before adding more.",
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

      // Count lead-specific samples per dataset
      const catalogs = await Promise.all(
        (datasets ?? []).map(async (ds) => {
          const { count: leadSamples } = await supabase
            .from("dataset_samples")
            .select("id", { count: "exact", head: true })
            .eq("dataset_id", ds.id)
            .eq("lead_id", lead_id);

          const { count: baseSamples } = await supabase
            .from("dataset_samples")
            .select("id", { count: "exact", head: true })
            .eq("dataset_id", ds.id)
            .is("lead_id", null);

          const grantedAt = access.find((a) => a.dataset_id === ds.id)?.granted_at;

          return {
            dataset_id: ds.id,
            name: ds.name,
            description: ds.description,
            type: ds.type,
            total_dataset_samples: ds.total_samples,
            base_preview_samples: baseSamples ?? 0,
            lead_specific_samples: leadSamples ?? 0,
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
    "Update metadata on any dataset/catalog — name, description, geographic coverage, annotation types, published status, type, subcategory, etc. Cannot delete datasets.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID to update"),
      name: z.string().optional().describe("Updated name"),
      description: z.string().optional().describe("Updated description"),
      geographic_coverage: z.string().optional().describe("Updated geographic coverage (e.g. 'Global', 'North America')"),
      annotation_types: z.array(z.string()).optional().describe("Updated annotation type tags"),
      subcategory: z.string().optional().describe("Updated subcategory"),
      total_samples: z.number().optional().describe("Updated total sample count"),
      total_duration_hours: z.number().optional().describe("Updated total duration in hours"),
      is_published: z.boolean().optional().describe("Set published status"),
      type: z.string().optional().describe("Dataset type (short_form, long_form, cinematic, etc.)"),
      source_type: z.string().optional().describe("Source type (collected, synthetic, curated)"),
      modality: z.string().optional().describe("Modality (video_text, image_text, etc.)"),
    },
    async ({ dataset_id, ...updates }) => {
      const supabase = createSupabaseAdminClient();

      // Filter out undefined values
      const fields: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) fields[key] = value;
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
    "Remove specific samples from a dataset/catalog by their sample IDs. Use list_lead_catalogs or get_dataset_overview to find sample IDs first.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID to remove samples from"),
      sample_ids: z.array(z.string().uuid()).min(1).describe("Sample IDs to remove from this dataset"),
    },
    async ({ dataset_id, sample_ids }) => {
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

      // Delete the specified samples (only within this dataset for safety)
      const { data: deleted, error } = await supabase
        .from("dataset_samples")
        .delete()
        .eq("dataset_id", dataset_id)
        .in("id", sample_ids)
        .select("id");

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      const removedCount = deleted?.length ?? 0;

      // Update the dataset sample count
      const { count } = await supabase
        .from("dataset_samples")
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
            requested: sample_ids.length,
            remaining_samples: count ?? 0,
            message: `Removed ${removedCount} sample${removedCount !== 1 ? "s" : ""} from "${dataset.name}"`,
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

function registerSendLeadInvite(server: McpServer) {
  server.tool(
    "send_lead_invite",
    "Create a Supabase auth account for a lead so they can log in to the portal. Generates a magic link. The lead must be approved first. Does NOT send an invite email by default — use the admin UI for that.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      send_email: z.boolean().default(false).describe("Send the invite email (default: false — use admin UI to send invites)"),
    },
    async ({ lead_id, send_email }) => {
      const supabase = createSupabaseAdminClient();

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

      // Create or find Supabase Auth user
      let supabaseUserId = lead.supabase_user_id;

      if (!supabaseUserId) {
        const { data: authUser, error: createErr } =
          await supabase.auth.admin.createUser({
            email: lead.email,
            email_confirm: true,
          });

        if (createErr) {
          // User might already exist
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existing = existingUsers?.users?.find((u) => u.email === lead.email);

          if (existing) {
            supabaseUserId = existing.id;
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
        }

        // Store supabase_user_id on lead
        await supabase
          .from("leads")
          .update({ supabase_user_id: supabaseUserId })
          .eq("id", lead_id);
      }

      // Generate magic link
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";
      const { data: linkData, error: linkErr } =
        await supabase.auth.admin.generateLink({
          type: "magiclink",
          email: lead.email,
          options: {
            redirectTo: `${siteUrl}/portal/auth/callback`,
          },
        });

      let magicLink: string | null = null;
      if (!linkErr && linkData?.properties?.action_link) {
        magicLink = linkData.properties.action_link;
      }

      // Optionally send invite email
      let inviteSent = false;
      if (send_email && magicLink) {
        try {
          const { sendInviteEmail } = await import("@/lib/email/invite");
          const result = await sendInviteEmail({
            to: lead.email,
            name: lead.name,
            magicLink,
          });
          inviteSent = result.success;
        } catch {
          // Email sending failed — still return the magic link
        }
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead_id,
            email: lead.email,
            supabase_user_id: supabaseUserId,
            magic_link: magicLink,
            invite_email_sent: inviteSent,
            portal_url: `${siteUrl}/portal`,
            message: inviteSent
              ? `Invite sent to ${lead.email}`
              : magicLink
                ? `Auth user created. Magic link generated (email not sent).`
                : `Auth user created but magic link generation failed.`,
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
