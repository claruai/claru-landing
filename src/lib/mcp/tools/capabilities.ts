import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * get_mcp_capabilities — META / SELF-DOCUMENTATION
 *
 * Returns a structured, intent-indexed map of every tool this MCP server
 * exposes. The standard MCP `list_tools` already returns a flat list of
 * tool names + descriptions; this tool adds:
 *   - capability grouping (Catalog | CRM | Search | QA | Pipeline | …)
 *   - intent → tool recommendations ("I want to send a prospect a sample
 *     pack" → send_sample_pack)
 *   - canonical workflows (multi-step orchestration recipes)
 *
 * The intended consumer is an LLM agent at the start of a task: it calls
 * this once, learns the lay of the land, then picks the right tool.
 *
 * This tool is read-only and never mutates state. Cheap to call.
 */

interface ToolEntry {
  name: string;
  what_it_does: string;
  /** Whether this tool mutates DB state. */
  mutates: boolean;
}

interface CapabilityGroup {
  group: string;
  description: string;
  tools: ToolEntry[];
}

interface IntentRecipe {
  intent: string;
  recommended_tool: string;
  workflow?: string[];
  notes?: string;
}

// Keep this hand-curated. Whenever a new tool is added, append it here so the
// agent help stays in sync.
const CAPABILITY_MAP: CapabilityGroup[] = [
  {
    group: "Search & Discovery",
    description: "Find clips, datasets, and corpus statistics. Read-only.",
    tools: [
      { name: "search_clips", what_it_does: "Semantic search across 1M+ clips with cosine similarity.", mutates: false },
      { name: "get_dataset_overview", what_it_does: "Clip counts, annotation types, representative clips per dataset.", mutates: false },
      { name: "build_lead_brief", what_it_does: "Structured brief grouped by dataset from search results.", mutates: false },
      { name: "get_corpus_stats", what_it_does: "Total counts per bucket, published datasets, keyword prevalence.", mutates: false },
      { name: "list_datasets", what_it_does: "Filterable by category/publish status/text search.", mutates: false },
      { name: "query_clips", what_it_does: "Structured SQL filtering (duration, resolution, enrichment status).", mutates: false },
      { name: "get_environment_breakdown", what_it_does: "Aggregated activity/environment labels by prefix.", mutates: false },
    ],
  },
  {
    group: "Catalog management",
    description: "Create, update, and link clips to datasets. Mostly mutating.",
    tools: [
      { name: "create_custom_catalog", what_it_does: "New per-lead dataset from clip IDs; auto-grants lead access.", mutates: true },
      { name: "add_clips_to_catalog", what_it_does: "Attach existing clips to an existing dataset (no data copy).", mutates: true },
      { name: "remove_clips_from_catalog", what_it_does: "Detach clips from a dataset (delete dataset_clips rows only).", mutates: true },
      { name: "update_dataset", what_it_does: "Edit dataset metadata: name, description, coverage, publish status.", mutates: true },
      { name: "set_clip_showcase", what_it_does: "Toggle is_showcase on a single dataset_clips row.", mutates: true },
      { name: "download_clips", what_it_does: "Generate signed URLs (1-hour TTL) to download specific clips.", mutates: false },
      { name: "get_clip_annotation", what_it_does: "Fetch annotation JSON from S3 by ann_annotation_key.", mutates: false },
    ],
  },
  {
    group: "Share links",
    description:
      "Mint, retrieve, and inventory the /share/<token> URLs that let prospects view " +
      "a dataset without logging in. Datasets can carry two modes: 'all' (every clip) or " +
      "'showcase' (is_showcase=true clips only).",
    tools: [
      { name: "get_share_link", what_it_does: "READ-ONLY: retrieve the current share URL for a dataset (by slug or id). Use this FIRST before minting.", mutates: false },
      { name: "list_share_links", what_it_does: "List every dataset with an active share token. Filter by category, mode, expiry.", mutates: false },
      { name: "mint_showcase_share_link", what_it_does: "Mint or return existing evergreen showcase share link (1-year default). Idempotent.", mutates: true },
      { name: "publish_share_link", what_it_does: "Mint or return existing share link (full-access by default; pass share_mode for showcase).", mutates: true },
    ],
  },
  {
    group: "Sample packs (orchestrator)",
    description:
      "Build per-prospect Custom Curations spanning multiple source datasets. " +
      "The full headline workflow: source slugs + recipient → fresh dataset → showcase " +
      "clips attached → lead found-or-created → access granted → share URL minted.",
    tools: [
      { name: "send_sample_pack", what_it_does: "End-to-end orchestrator. Returns share URL.", mutates: true },
      { name: "list_sample_packs_for_lead", what_it_does: "Audit trail: every sample pack built for a lead.", mutates: false },
    ],
  },
  {
    group: "CRM / Leads",
    description: "Manage lead records and their dataset access.",
    tools: [
      { name: "list_leads", what_it_does: "Search leads by name/email/company, filter by status.", mutates: false },
      { name: "get_lead", what_it_does: "Full lead details including dataset access list + custom sample count.", mutates: false },
      { name: "create_lead", what_it_does: "Insert new lead (auto-approve optional; checks for duplicate email).", mutates: true },
      { name: "update_lead", what_it_does: "Edit lead fields: name, email, company, role, data_needs, use_case, admin_notes.", mutates: true },
      { name: "approve_lead", what_it_does: "Change status to 'approved' (no email sent).", mutates: true },
      { name: "grant_lead_access", what_it_does: "Upsert lead_dataset_access rows.", mutates: true },
      { name: "revoke_lead_access", what_it_does: "Delete access grants.", mutates: true },
      { name: "list_lead_catalogs", what_it_does: "Show a lead's dataset access with clip counts.", mutates: false },
      { name: "create_lead_auth_user", what_it_does: "Create a Supabase auth account for portal login (temp password).", mutates: true },
    ],
  },
  {
    group: "QA / Spec validation",
    description: "Tech + content audit of clips against client specs.",
    tools: [
      { name: "audit_clip", what_it_does: "Single-clip QA against client spec (tech + Gemini content analysis).", mutates: false },
      { name: "audit_catalog", what_it_does: "Batch audit of all clips in a dataset.", mutates: false },
      { name: "find_clips_for_spec", what_it_does: "Pre-filter corpus by tech specs, rank by semantic similarity.", mutates: false },
      { name: "register_spec", what_it_does: "Create / update a client QA spec.", mutates: true },
      { name: "list_specs", what_it_does: "All registered specs.", mutates: false },
      { name: "submit_video_analysis", what_it_does: "Async Gemini analysis job (Railway worker). Returns job ID.", mutates: true },
      { name: "get_analysis_status", what_it_does: "Poll async analysis job status.", mutates: false },
    ],
  },
  {
    group: "Pipeline / Enrichment",
    description: "Run vision enrichment + manage annotation linkage.",
    tools: [
      { name: "run_enrichment", what_it_does: "Vision enrichment via gpt-4o-mini on an S3 prefix.", mutates: true },
      { name: "backfill_annotation_keys", what_it_does: "Map S3 annotation files to clip rows (dry-run supported).", mutates: true },
      { name: "get_enrichment_coverage", what_it_does: "Coverage % for embedding / caption / enrichment / annotation across the corpus.", mutates: false },
    ],
  },
  {
    group: "Case studies (read-only content)",
    description: "Reference content for sales conversations.",
    tools: [
      { name: "list_case_studies", what_it_does: "Filterable case study list by category/tag.", mutates: false },
      { name: "get_case_study", what_it_does: "Full content of one case study (challenge / approach / results / FAQs).", mutates: false },
    ],
  },
];

const INTENT_RECIPES: IntentRecipe[] = [
  {
    intent: "I just want the share URL for an existing dataset",
    recommended_tool: "get_share_link",
    notes:
      "READ-ONLY. Pass dataset_slug or dataset_id. Returns the current URL without minting or rotating. If no share link exists yet, the response tells you which tool to call next.",
  },
  {
    intent: "I want the showcase share link for category X",
    recommended_tool: "mint_showcase_share_link",
    workflow: [
      "(optional) get_share_link({dataset_slug}) — returns existing if any",
      "mint_showcase_share_link({dataset_slug}) — idempotent, returns existing if mode matches",
    ],
    notes:
      "If a mode mismatch is returned, the response includes `existing_share.share_url` — return that URL directly OR pass force_rotate=true to rotate to showcase mode.",
  },
  {
    intent: "What share links currently exist?",
    recommended_tool: "list_share_links",
    notes: "Filterable by category_slug, mode, include_expired. Shows view stats.",
  },
  {
    intent: "Send a prospect a sample pack from multiple datasets",
    recommended_tool: "send_sample_pack",
    workflow: [
      "list_datasets — find source slugs",
      "send_sample_pack({source_dataset_slugs, recipient}) — orchestrator returns share URL",
    ],
    notes:
      "Each call creates a fresh Custom Curation tagged to the recipient lead. Use list_sample_packs_for_lead to review history.",
  },
  {
    intent: "Find clips that match a description",
    recommended_tool: "search_clips",
    workflow: [
      "search_clips({query}) — semantic search",
      "get_dataset_overview({dataset_id}) — examine each candidate dataset",
    ],
  },
  {
    intent: "Audit a dataset against a client spec",
    recommended_tool: "audit_catalog",
    workflow: [
      "list_specs — find the spec_id",
      "audit_catalog({dataset_id, spec_id})",
    ],
  },
  {
    intent: "Mark a clip as showcase",
    recommended_tool: "set_clip_showcase",
    notes:
      "Toggles is_showcase on the base dataset_clips row (lead_id IS NULL). Lead-bound rows can't be flipped here.",
  },
  {
    intent: "What clips does this lead have access to?",
    recommended_tool: "list_lead_catalogs",
    notes: "Shows their dataset access list with clip counts (base vs lead-specific).",
  },
];

export function register(server: McpServer) {
  server.tool(
    "get_mcp_capabilities",
    "META / SELF-DOCUMENTATION: Returns a structured, intent-indexed map of every tool this " +
      "MCP server exposes — grouped by capability (Search, Catalog, Share links, Sample packs, " +
      "CRM, QA, Pipeline, Case studies) plus 'intent → tool' recommendations and canonical " +
      "multi-step workflows. Call this first when starting a task to learn what's available. " +
      "Read-only, cheap, no side effects.",
    {
      group: z
        .string()
        .optional()
        .describe(
          "Optional: restrict to a single group (e.g. 'Search & Discovery', 'Share links'). Case-insensitive partial match.",
        ),
    },
    async ({ group }) => {
      const filteredGroups = group
        ? CAPABILITY_MAP.filter((g) =>
            g.group.toLowerCase().includes(group.toLowerCase()),
          )
        : CAPABILITY_MAP;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              server: "claru-catalog",
              total_tools: CAPABILITY_MAP.reduce((sum, g) => sum + g.tools.length, 0) + 1,
              groups: filteredGroups,
              intents: INTENT_RECIPES,
              note:
                "Use this map to pick the right tool. Always prefer READ-ONLY tools (mutates=false) " +
                "first. The intents[] list maps user goals to the recommended starting tool.",
            }),
          },
        ],
      };
    },
  );
}
