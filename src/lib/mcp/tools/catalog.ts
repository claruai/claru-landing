import { randomBytes } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { fetchAnnotationJson } from "@/lib/s3/annotation";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { CUSTOM_CURATIONS_CATEGORY_ID } from "@/lib/mcp/helpers";

// ---------------------------------------------------------------------------
// create_custom_catalog tool
// ---------------------------------------------------------------------------

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

      // Insert dataset_clips rows -- no data copying
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
        // Partial failure -- some clips may have been inserted
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
// add_clips_to_catalog tool
// ---------------------------------------------------------------------------

function registerAddClipsToCatalog(server: McpServer) {
  server.tool(
    "add_clips_to_catalog",
    "Add clips to an existing catalog/dataset by inserting dataset_clips rows. No data copying -- clips already exist in the clips table. Optionally assigns to a lead.",
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
// remove_clips_from_catalog tool
// ---------------------------------------------------------------------------

function registerRemoveClipsFromCatalog(server: McpServer) {
  server.tool(
    "remove_clips_from_catalog",
    "Remove clips from a dataset/catalog by their clip IDs. Deletes dataset_clips join rows only -- the clips themselves are preserved. Use list_lead_catalogs or get_dataset_overview to find clip IDs.",
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
// update_dataset tool
// ---------------------------------------------------------------------------

function registerUpdateDataset(server: McpServer) {
  server.tool(
    "update_dataset",
    "Update metadata on any dataset/catalog -- name, description, geographic coverage, annotation types, published status, type, subcategory, etc. Cannot delete datasets. If sync_clip_count is true, total_samples is derived from dataset_clips count.",
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
// publish_share_link tool
// ---------------------------------------------------------------------------

function registerPublishShareLink(server: McpServer) {
  server.tool(
    "publish_share_link",
    "Generate a public share link for a dataset so prospects can view curated clips without logging in. " +
      "Idempotent: returns existing token if one already exists and modes match. " +
      "share_mode='all' (default) shows every clip; share_mode='showcase' filters to is_showcase=true only.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID to share"),
      expires_in_days: z.number().min(1).max(365).default(30).describe("Days until the share link expires (default 30)"),
      share_mode: z
        .enum(["all", "showcase"])
        .default("all")
        .describe("'all' (default, backwards compatible) shows every clip; 'showcase' shows only is_showcase=true clips."),
      force_rotate: z
        .boolean()
        .default(false)
        .describe("Invalidate existing token and mint a new one (use to change share_mode)."),
    },
    async ({ dataset_id, expires_in_days, share_mode, force_rotate }) => {
      const supabase = createSupabaseAdminClient();

      const { data: dataset, error: fetchErr } = await supabase
        .from("datasets")
        .select("id, name, share_token, share_expires_at, share_mode")
        .eq("id", dataset_id)
        .single();

      if (fetchErr || !dataset) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Dataset not found" }) }],
        };
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";
      const currentMode = (dataset.share_mode ?? "all") as "all" | "showcase";

      if (dataset.share_token && !force_rotate) {
        if (currentMode !== share_mode) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  error: `Existing share link has share_mode='${currentMode}', not '${share_mode}'. Pass force_rotate=true to rotate.`,
                  current_mode: currentMode,
                  requested_mode: share_mode,
                }),
              },
            ],
          };
        }
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              share_url: `${siteUrl}/share/${dataset.share_token}`,
              token: dataset.share_token,
              dataset_name: dataset.name,
              expires_at: dataset.share_expires_at,
              share_mode: currentMode,
              reused: true,
              message: `Existing share link for "${dataset.name}"`,
            }),
          }],
        };
      }

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000).toISOString();

      const { error: updateErr } = await supabase
        .from("datasets")
        .update({
          share_token: token,
          share_expires_at: expiresAt,
          share_mode,
          share_view_count: 0,
          share_first_viewed_at: null,
        })
        .eq("id", dataset_id);

      if (updateErr) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: updateErr.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            share_url: `${siteUrl}/share/${token}`,
            token,
            dataset_name: dataset.name,
            expires_at: expiresAt,
            share_mode,
            reused: false,
            message: `Share link created for "${dataset.name}", expires in ${expires_in_days} days`,
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
// get_clip_annotation tool -- fetch annotation JSON from S3
// ---------------------------------------------------------------------------

function registerGetClipAnnotation(server: McpServer) {
  server.tool(
    "get_clip_annotation",
    "Fetch the annotation JSON for a clip from S3 using its ann_annotation_key. Returns the parsed annotation data. Useful for inspecting per-frame labels, bounding boxes, and other annotation structures.",
    {
      clip_id: z.string().uuid().describe("Clip UUID from the clips table"),
    },
    async ({ clip_id }) => {
      const supabase = createSupabaseAdminClient();

      const { data: clip, error } = await supabase
        .from("clips")
        .select("id, s3_bucket, s3_key, ann_annotation_key, filename")
        .eq("id", clip_id)
        .single();

      if (error || !clip) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Clip not found" }) }],
        };
      }

      if (!clip.ann_annotation_key) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              clip_id,
              error: "No annotation key on this clip",
              s3_key: clip.s3_key,
              message: "This clip does not have an ann_annotation_key set. Use backfill_annotation_keys to map annotations to clips.",
            }),
          }],
        };
      }

      const annotation = await fetchAnnotationJson(clip.ann_annotation_key, clip.s3_bucket);

      if (!annotation) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              clip_id,
              ann_annotation_key: clip.ann_annotation_key,
              error: "Failed to fetch annotation JSON from S3",
              message: "The annotation key exists but the file could not be read. It may have been deleted or moved.",
            }),
          }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            clip_id,
            ann_annotation_key: clip.ann_annotation_key,
            annotation,
            message: `Fetched annotation for clip ${clip.filename ?? clip.s3_key.split("/").pop()}`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Register all catalog tools
// ---------------------------------------------------------------------------

export function register(server: McpServer) {
  registerCreateCustomCatalog(server);
  registerAddClipsToCatalog(server);
  registerRemoveClipsFromCatalog(server);
  registerUpdateDataset(server);
  registerDownloadClips(server);
  registerPublishShareLink(server);
  registerListCaseStudies(server);
  registerGetCaseStudy(server);
  registerGetClipAnnotation(server);
}
