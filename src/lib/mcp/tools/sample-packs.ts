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
 *
 * Coverage:
 *  - Integrity-class errors (PG SQLSTATE 23xxx): unique, FK, NOT NULL, CHECK.
 *  - Data-exception errors (SQLSTATE 22xxx): bad input types, length overflow.
 *  - Authorization errors (SQLSTATE 42501): "permission denied for table".
 *  - Schema/syntax errors that leak column / relation / function names
 *    (SQLSTATE 42P*, 42703, 42883).
 *  - Transient transaction errors (SQLSTATE 40xxx): serialization failure,
 *    deadlock — these are retry-friendly and we surface that distinction.
 *  - PostgREST text patterns even when no `code` is present: "violates X
 *    constraint", "column ... of relation", "duplicate key value",
 *    "null value in column", "permission denied", "relation ... does not
 *    exist", "function ... does not exist".
 *
 * Anything not matched falls through unchanged — errors thrown by our own
 * code are already user-friendly. Original message is always logged before
 * sanitisation so prod triage isn't blocked.
 */
export function sanitizeError(err: unknown): string {
  // Supabase PostgrestError shape: { message, code, details, hint }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pgCode: string | undefined = (err as any)?.code;
  const msg = err instanceof Error ? err.message : String(err);

  const INTEGRITY_TEXT =
    /violates .* constraint|column .* of relation|duplicate key value|null value in column|permission denied|relation .* does not exist|function .* does not exist/i;

  const codeIsIntegrity = typeof pgCode === "string" && /^23\d{3}$/.test(pgCode);
  const codeIsDataException =
    typeof pgCode === "string" && /^22(\d{3}|P\d{2})$/.test(pgCode);
  const codeIsAuthz = pgCode === "42501";
  const codeLeaksSchema =
    typeof pgCode === "string" && /^42(P\d{2}|703|883)$/.test(pgCode);
  const codeIsTransient =
    typeof pgCode === "string" && /^40(\d{3}|P\d{2})$/.test(pgCode);

  if (
    codeIsIntegrity ||
    codeIsDataException ||
    codeIsAuthz ||
    codeLeaksSchema ||
    codeIsTransient ||
    INTEGRITY_TEXT.test(msg)
  ) {
    console.error(
      `[mcp:sample-packs] suppressed error${pgCode ? ` (${pgCode})` : ""}: ${msg}`,
    );
    if (codeIsAuthz || /permission denied/i.test(msg)) {
      return "Permission denied. Contact an admin.";
    }
    if (codeIsTransient) {
      return "Transient database error. Retry the request.";
    }
    if (
      codeIsIntegrity ||
      codeIsDataException ||
      /duplicate key|null value in column|violates .* constraint/i.test(msg)
    ) {
      return "Database constraint violation. Check your inputs and try again.";
    }
    return "Database error. Check your inputs and try again.";
  }

  return msg;
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
        .select("id, name, share_token, share_mode, share_expires_at, share_view_count, share_first_viewed_at")
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
          // Surface the existing token + URL so the agent can return that
          // URL to the user *without* rotating. If they need showcase mode
          // specifically, they can pass force_rotate=true.
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";
          return okText({
            error: err.message,
            current_mode: err.currentMode,
            requested_mode: err.requestedMode,
            existing_share: ds.share_token
              ? {
                  share_url: `${siteUrl}/share/${ds.share_token}`,
                  token: ds.share_token,
                  mode: ds.share_mode,
                  expires_at: ds.share_expires_at,
                  view_count: ds.share_view_count ?? 0,
                  first_viewed_at: ds.share_first_viewed_at,
                }
              : null,
            hint:
              "The dataset's current share token is included in `existing_share` (different mode than requested). " +
              "If the caller just needs A share URL for this dataset, return existing_share.share_url. " +
              "Pass force_rotate=true to invalidate the existing token and mint a fresh one in the requested mode.",
          });
        }
        if (err instanceof DatasetNotFoundError) return errText(err.message);
        return errText(sanitizeError(err));
      }
    },
  );
}

/**
 * get_share_link — READ-ONLY
 *
 * Returns the current share token + URL for a dataset (looked up by slug
 * or id), without minting or rotating. Use this when the caller just
 * wants to retrieve the existing share URL.
 */
function registerGetShareLink(server: McpServer) {
  server.tool(
    "get_share_link",
    "READ-ONLY: Look up the current share link for a dataset (by slug or id) without minting or rotating. " +
      "Returns share_url, mode, expiry, and view stats. If the dataset has no share token yet, returns " +
      "`{ has_share_link: false }` — the caller can then call publish_share_link or mint_showcase_share_link " +
      "to create one. Always prefer this tool when you just want to retrieve an existing URL.",
    {
      dataset_slug: z.string().optional().describe("Dataset slug (e.g. 'egocentric-long-form-salon-healthcare'). Provide this OR dataset_id."),
      dataset_id: z.string().uuid().optional().describe("Dataset UUID. Provide this OR dataset_slug."),
    },
    async ({ dataset_slug, dataset_id }) => {
      if (!dataset_slug && !dataset_id) {
        return errText("Provide either dataset_slug or dataset_id.");
      }
      const supabase = createSupabaseAdminClient();
      const q = supabase
        .from("datasets")
        .select(
          "id, slug, name, share_token, share_mode, share_expires_at, share_view_count, share_first_viewed_at, is_published",
        );
      const lookup = dataset_id ? q.eq("id", dataset_id) : q.eq("slug", dataset_slug!);
      const { data: ds, error } = await lookup.single();
      if (error || !ds) {
        return errText(`Dataset not found: ${dataset_slug ?? dataset_id}`);
      }
      if (!ds.share_token) {
        return okText({
          has_share_link: false,
          dataset_id: ds.id,
          dataset_slug: ds.slug,
          dataset_name: ds.name,
          is_published: ds.is_published,
          hint:
            "No share link minted yet. Call mint_showcase_share_link({dataset_slug}) for a showcase-only URL, " +
            "or publish_share_link({dataset_id}) for a full-access URL.",
        });
      }
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";
      const expired = ds.share_expires_at != null && new Date(ds.share_expires_at) < new Date();
      return okText({
        has_share_link: true,
        share_url: `${siteUrl}/share/${ds.share_token}`,
        token: ds.share_token,
        mode: ds.share_mode ?? "all",
        expires_at: ds.share_expires_at,
        is_expired: expired,
        view_count: ds.share_view_count ?? 0,
        first_viewed_at: ds.share_first_viewed_at,
        dataset_id: ds.id,
        dataset_slug: ds.slug,
        dataset_name: ds.name,
        is_published: ds.is_published,
      });
    },
  );
}

/**
 * list_share_links — discovery / inventory
 *
 * Lists every dataset that currently has a share token, optionally filtered
 * by category, mode, or expiry. Useful when the caller asks "what share
 * links exist?" or wants to find an existing link by category/mode.
 */
function registerListShareLinks(server: McpServer) {
  server.tool(
    "list_share_links",
    "Discovery: list every dataset with an active share link. Optional filters: category_slug (e.g. " +
      "'egocentric'), mode ('all' or 'showcase'), include_expired (default false). Returns each link's " +
      "URL, mode, expiry, and view stats — sorted by most recently viewed.",
    {
      category_slug: z
        .string()
        .optional()
        .describe("Restrict to a single category slug (e.g. 'egocentric', 'gaming')."),
      mode: z
        .enum(["all", "showcase"])
        .optional()
        .describe("Filter by share mode."),
      include_expired: z
        .boolean()
        .default(false)
        .describe("Include expired share links (default false)."),
    },
    async ({ category_slug, mode, include_expired }) => {
      const supabase = createSupabaseAdminClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = supabase
        .from("datasets")
        .select(
          "id, slug, name, share_token, share_mode, share_expires_at, share_view_count, share_first_viewed_at, is_published, dataset_categories(slug,name)",
        )
        .not("share_token", "is", null);

      if (mode) q = q.eq("share_mode", mode);
      if (!include_expired) {
        // Either no expiry set, or expiry in the future
        q = q.or(`share_expires_at.is.null,share_expires_at.gt.${new Date().toISOString()}`);
      }
      q = q.order("share_first_viewed_at", { ascending: false, nullsFirst: false });

      const { data, error } = await q;
      if (error) return errText(sanitizeError(error));

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";
      const rows = (data ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((r: any) => {
          if (!category_slug) return true;
          const cat = r.dataset_categories as { slug: string } | null;
          return cat?.slug === category_slug;
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => ({
          dataset_id: r.id,
          dataset_slug: r.slug,
          dataset_name: r.name,
          category_slug: (r.dataset_categories as { slug: string } | null)?.slug ?? null,
          category_name: (r.dataset_categories as { name: string } | null)?.name ?? null,
          share_url: `${siteUrl}/share/${r.share_token}`,
          mode: r.share_mode ?? "all",
          expires_at: r.share_expires_at,
          view_count: r.share_view_count ?? 0,
          first_viewed_at: r.share_first_viewed_at,
          is_published: r.is_published,
        }));

      return okText({ count: rows.length, share_links: rows });
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
  registerGetShareLink(server);
  registerListShareLinks(server);
  registerMintShowcaseShareLink(server);
  registerSendSamplePack(server);
  registerSetClipShowcase(server);
  registerListSamplePacksForLead(server);
}
