import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildSamplePack } from "@/lib/sample-packs/build";
import {
  mintShareToken,
  ShareModeMismatchError,
  DatasetNotFoundError,
} from "@/lib/share/mint-token";

const okText = (obj: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(obj) }],
});

const errText = (msg: string) => okText({ error: msg });

/**
 * Strip Postgres / Supabase internals from error messages before returning
 * to MCP callers. Keeps the high-signal "what went wrong" but drops constraint
 * names, column lists, and other schema details that an LLM caller shouldn't
 * see.
 */
function sanitizeError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;
    // PostgREST constraint violations expose internal names — collapse to a
    // generic message and log the full one server-side for triage.
    if (/violates .* constraint/i.test(msg) || /column .* of relation/i.test(msg)) {
      console.error("[mcp:sample-packs] suppressed error:", msg);
      return "Database constraint violation. Check your inputs and try again.";
    }
    return msg;
  }
  return String(err);
}

/**
 * mint_showcase_share_link
 *
 * Convenience wrapper around mintShareToken with mode='showcase' and a long
 * default expiry. Lets agents say "give me the salon showcase link" and get
 * the evergreen URL back.
 */
function registerMintShowcaseShareLink(server: McpServer) {
  server.tool(
    "mint_showcase_share_link",
    "Get (or generate) the evergreen showcase share link for a dataset. " +
      "Returns a /share/<token> URL that filters to is_showcase=true clips only " +
      "and never leaks lead-bound clips. Idempotent: returns the existing token " +
      "unless force_rotate=true.",
    {
      dataset_slug: z.string().describe("Dataset slug, e.g. 'egocentric-long-form-salon-healthcare'"),
      expires_in_days: z
        .number()
        .int()
        .min(1)
        .max(365)
        .default(365)
        .describe("Expiry for newly-minted token (default 365)"),
      force_rotate: z
        .boolean()
        .default(false)
        .describe("Invalidate the current token and mint a new one."),
    },
    async ({ dataset_slug, expires_in_days, force_rotate }) => {
      const supabase = createSupabaseAdminClient();
      const { data: ds, error } = await supabase
        .from("datasets")
        .select("id, name")
        .eq("slug", dataset_slug)
        .single();
      if (error || !ds) return errText(`Dataset not found by slug: ${dataset_slug}`);

      try {
        const result = await mintShareToken(supabase, ds.id, {
          mode: "showcase",
          expiresInDays: expires_in_days,
          forceRotate: force_rotate,
        });
        return okText({
          share_url: result.share_url,
          token: result.token,
          mode: result.mode,
          expires_at: result.expires_at,
          reused: result.reused,
          dataset_id: ds.id,
          dataset_name: ds.name,
        });
      } catch (err) {
        if (err instanceof ShareModeMismatchError) {
          return okText({
            error: err.message,
            current_mode: err.currentMode,
            requested_mode: err.requestedMode,
            hint: "Pass force_rotate=true to switch the dataset to showcase mode (invalidates existing URL).",
          });
        }
        if (err instanceof DatasetNotFoundError) return errText(err.message);
        return errText(sanitizeError(err));
      }
    },
  );
}

/**
 * send_sample_pack
 *
 * The headline orchestrator. Takes source dataset slugs + recipient info,
 * spawns a fresh Custom Curation, attaches their showcase clips, grants
 * the lead access, mints a share token. Returns the URL to hand over.
 */
function registerSendSamplePack(server: McpServer) {
  server.tool(
    "send_sample_pack",
    "Build a per-prospect sample pack: pulls showcase clips from one or more " +
      "category datasets, creates a new Custom Curation named 'Sample — {Company} — {Date}', " +
      "find-or-creates the recipient lead, grants access, mints a share token, and returns the URL.",
    {
      source_dataset_slugs: z
        .array(z.string())
        .min(1)
        .describe("Slugs of source datasets to pull showcase clips from"),
      recipient: z
        .object({
          name: z.string().describe("Recipient's full name"),
          email: z.string().email().describe("Recipient's email — used for find-or-create lead"),
          company: z.string().min(1).describe("Recipient's company"),
        })
        .describe("Prospect info — used to find-or-create the lead and name the pack"),
      note: z.string().optional().describe("Internal note saved on the dataset_clips rows"),
      expires_in_days: z
        .number()
        .int()
        .min(1)
        .max(365)
        .default(30)
        .describe("Days until share link expires (default 30)"),
    },
    async (args) => {
      const supabase = createSupabaseAdminClient();
      try {
        const result = await buildSamplePack(supabase, {
          sourceDatasetSlugs: args.source_dataset_slugs,
          recipient: args.recipient,
          note: args.note,
          expiresInDays: args.expires_in_days,
        });
        return okText({
          share_url: result.share_url,
          dataset_id: result.dataset_id,
          dataset_name: result.dataset_name,
          dataset_slug: result.dataset_slug,
          expires_at: result.expires_at,
          lead: {
            id: result.lead.id,
            email: result.lead.email,
            created: result.lead_created,
          },
          clip_count: result.clip_count,
          per_source_breakdown: result.per_source_breakdown,
        });
      } catch (err) {
        return errText(sanitizeError(err));
      }
    },
  );
}

/**
 * set_clip_showcase
 *
 * Toggle is_showcase on a single dataset_clips row (base link, lead_id IS NULL).
 */
function registerSetClipShowcase(server: McpServer) {
  server.tool(
    "set_clip_showcase",
    "Toggle the is_showcase flag on a clip's base attachment in a dataset. " +
      "Showcase clips are the ones surfaced via /share/<token> when share_mode='showcase'.",
    {
      dataset_id: z.string().uuid(),
      clip_id: z.string().uuid(),
      is_showcase: z.boolean(),
    },
    async ({ dataset_id, clip_id, is_showcase }) => {
      const supabase = createSupabaseAdminClient();

      const { error: updateErr, count } = await supabase
        .from("dataset_clips")
        .update({ is_showcase }, { count: "exact" })
        .eq("dataset_id", dataset_id)
        .eq("clip_id", clip_id)
        .is("lead_id", null);

      if (updateErr) return errText(sanitizeError(updateErr));
      if (!count || count === 0) {
        return errText(
          "No matching dataset_clips row (clip may not be attached as a base entry).",
        );
      }

      const { count: showcaseCount } = await supabase
        .from("dataset_clips")
        .select("clip_id", { count: "exact", head: true })
        .eq("dataset_id", dataset_id)
        .eq("is_showcase", true)
        .is("lead_id", null);

      return okText({
        ok: true,
        is_showcase,
        current_showcase_count: showcaseCount ?? 0,
      });
    },
  );
}

/**
 * list_sample_packs_for_lead
 *
 * What have we sent this prospect? Reads datasets WHERE created_for_lead_id = ?
 */
function registerListSamplePacksForLead(server: McpServer) {
  server.tool(
    "list_sample_packs_for_lead",
    "List every Custom Curation Sample Pack built for a lead, with share URL " +
      "and view stats. Provide either lead_id or lead_email.",
    {
      lead_id: z.string().uuid().optional(),
      lead_email: z.string().email().optional(),
    },
    async ({ lead_id, lead_email }) => {
      const supabase = createSupabaseAdminClient();

      let resolvedLeadId = lead_id;
      if (!resolvedLeadId && lead_email) {
        const normalised = lead_email.trim().toLowerCase();
        const { data: lead } = await supabase
          .from("leads")
          .select("id")
          .eq("email", normalised)
          .maybeSingle();
        if (!lead) return errText(`Lead not found by email: ${lead_email}`);
        resolvedLeadId = lead.id;
      }

      if (!resolvedLeadId) {
        return errText("Provide either lead_id or lead_email.");
      }

      const { data: datasets, error } = await supabase
        .from("datasets")
        .select(
          "id, name, slug, description, share_token, share_expires_at, share_first_viewed_at, share_view_count, share_mode, created_at, total_samples, tags",
        )
        .eq("created_for_lead_id", resolvedLeadId)
        .order("created_at", { ascending: false });

      if (error) return errText(sanitizeError(error));

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";
      const packs = (datasets ?? []).map((d) => ({
        dataset_id: d.id,
        name: d.name,
        slug: d.slug,
        clip_count: d.total_samples ?? 0,
        tags: d.tags,
        share_url: d.share_token ? `${siteUrl}/share/${d.share_token}` : null,
        share_token: d.share_token,
        share_mode: d.share_mode,
        share_expires_at: d.share_expires_at,
        share_first_viewed_at: d.share_first_viewed_at,
        share_view_count: d.share_view_count ?? 0,
        is_expired:
          d.share_expires_at != null && new Date(d.share_expires_at) < new Date(),
        created_at: d.created_at,
      }));

      return okText({ lead_id: resolvedLeadId, packs });
    },
  );
}

export function register(server: McpServer) {
  registerMintShowcaseShareLink(server);
  registerSendSamplePack(server);
  registerSetClipShowcase(server);
  registerListSamplePacksForLead(server);
}
