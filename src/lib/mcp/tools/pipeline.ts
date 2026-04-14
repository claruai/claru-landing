import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

// ---------------------------------------------------------------------------
// Shared S3 client for pipeline tools
// ---------------------------------------------------------------------------

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION ?? "us-east-1",
  });
}

// ---------------------------------------------------------------------------
// run_enrichment tool -- kick off vision enrichment on clips
// ---------------------------------------------------------------------------

function registerRunEnrichment(server: McpServer) {
  server.tool(
    "run_enrichment",
    "Run vision enrichment on clips matching an S3 prefix. For each clip, signs a URL, extracts a representative frame via the signed URL, sends it to OpenAI gpt-4o-mini vision for scene analysis, and writes ai_enrichment_json + ai_agent_context back to the clips table. Processes sequentially to avoid rate limits.",
    {
      s3_key_prefix: z.string().describe("S3 key prefix to match clips (e.g. 'egocentric-capture/completed/')"),
      only_missing: z.boolean().default(true).describe("If true, only enrich clips that lack ai_enrichment_json (default: true)"),
      limit: z.number().min(1).max(100).default(10).describe("Max clips to enrich per run (default 10, max 100)"),
    },
    async ({ s3_key_prefix, only_missing, limit }) => {
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "OPENAI_API_KEY not configured" }) }],
        };
      }

      const supabase = createSupabaseAdminClient();

      // Find clips to enrich
      let query = supabase
        .from("clips")
        .select("id, s3_key, s3_bucket, mime_type, ai_caption, caption_text, tech_duration_seconds")
        .ilike("s3_key", `${s3_key_prefix}%`)
        .limit(limit);

      if (only_missing) {
        query = query.is("ai_enrichment_json", null);
      }

      const { data: clips, error } = await query;

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      if (!clips || clips.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ enriched: 0, failed: 0, message: "No clips found to enrich" }) }],
        };
      }

      const results: Array<{ clip_id: string; status: "enriched" | "failed"; error?: string }> = [];
      let enriched = 0;
      let failed = 0;

      for (const clip of clips) {
        try {
          // Sign URL for the clip
          const signedUrl = await getS3SignedUrl(clip.s3_key, 600, clip.s3_bucket);
          if (!signedUrl) {
            results.push({ clip_id: clip.id, status: "failed", error: "Failed to sign URL" });
            failed++;
            continue;
          }

          // For video clips, we use the OpenAI vision API with the video URL directly
          // gpt-4o-mini can analyze video URLs
          const isVideo = (clip.mime_type ?? "").startsWith("video/") ||
            clip.s3_key.match(/\.(mp4|mov|webm|avi)$/i);

          const visionPrompt = `Analyze this ${isVideo ? "video" : "image"} for a data catalog. Return valid JSON only (no markdown):
{
  "scene_summary": "1-2 sentence description of the scene",
  "environments": ["list", "of", "environments"],
  "activities": ["list", "of", "activities"],
  "objects": ["notable", "objects", "visible"],
  "camera_perspective": "egocentric|third-person|overhead|etc",
  "people_count": "0|1|2|few|many",
  "technical": {
    "lighting": "natural|artificial|mixed|low-light",
    "motion_blur": "none|slight|moderate|heavy",
    "stability": "stable|slight-shake|handheld|unstable"
  },
  "quality_notes": "any quality issues or notable characteristics"
}`;

          const messages = [
            {
              role: "user" as const,
              content: [
                { type: "text" as const, text: visionPrompt },
                {
                  type: "image_url" as const,
                  image_url: { url: signedUrl, detail: "low" as const },
                },
              ],
            },
          ];

          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openaiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages,
              max_tokens: 500,
              temperature: 0.2,
            }),
          });

          if (!response.ok) {
            const errText = await response.text();
            results.push({ clip_id: clip.id, status: "failed", error: `OpenAI API ${response.status}: ${errText.slice(0, 200)}` });
            failed++;
            continue;
          }

          const data = await response.json();
          const rawText = data.choices?.[0]?.message?.content ?? "";
          const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

          let enrichment: Record<string, unknown>;
          try {
            enrichment = JSON.parse(cleaned);
          } catch {
            results.push({ clip_id: clip.id, status: "failed", error: "Failed to parse OpenAI response as JSON" });
            failed++;
            continue;
          }

          // Build agent context from enrichment
          const agentContext = {
            scene_summary: enrichment.scene_summary ?? "",
            environments: Array.isArray(enrichment.environments) ? enrichment.environments : [],
            activities: Array.isArray(enrichment.activities) ? enrichment.activities : [],
            objects: Array.isArray(enrichment.objects) ? enrichment.objects : [],
            camera_perspective: enrichment.camera_perspective ?? "",
            people_count: enrichment.people_count ?? "",
            technical: enrichment.technical ?? { fps: null, duration: null, resolution: null },
            quality_notes: enrichment.quality_notes ?? "",
          };

          // Write back to clips table
          const { error: updateErr } = await supabase
            .from("clips")
            .update({
              ai_enrichment_json: enrichment,
              ai_enrichment_source: "gpt-4o-mini-vision-mcp",
              ai_agent_context: agentContext,
            })
            .eq("id", clip.id);

          if (updateErr) {
            results.push({ clip_id: clip.id, status: "failed", error: updateErr.message });
            failed++;
          } else {
            results.push({ clip_id: clip.id, status: "enriched" });
            enriched++;
          }
        } catch (e) {
          results.push({ clip_id: clip.id, status: "failed", error: e instanceof Error ? e.message : "Unknown error" });
          failed++;
        }
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            enriched,
            failed,
            total_attempted: clips.length,
            results,
            message: `Enriched ${enriched}/${clips.length} clips (${failed} failed)`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// backfill_annotation_keys tool -- map S3 annotations to clips
// ---------------------------------------------------------------------------

function registerBackfillAnnotationKeys(server: McpServer) {
  server.tool(
    "backfill_annotation_keys",
    "Backfill ann_annotation_key on clips by scanning an S3 prefix for annotation-data.json files. For each annotation file found, reads its content to identify the source video key, matches it to a clip in the database, and optionally updates the clip's ann_annotation_key. Use dry_run=true first to preview matches.",
    {
      s3_annotation_prefix: z.string().describe("S3 prefix to scan for annotation files (e.g. 'egocentric-capture/completed/')"),
      s3_bucket: z.string().optional().describe("S3 bucket to scan (defaults to S3_BUCKET_NAME env var)"),
      dry_run: z.boolean().default(true).describe("If true, preview matches without writing (default: true)"),
      limit: z.number().min(1).max(500).default(100).describe("Max annotation files to process (default 100, max 500)"),
    },
    async ({ s3_annotation_prefix, s3_bucket, dry_run, limit }) => {
      const bucket = s3_bucket ?? process.env.S3_BUCKET_NAME;
      if (!bucket) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "No S3 bucket specified and S3_BUCKET_NAME not set" }) }],
        };
      }

      const s3 = getS3Client();
      const supabase = createSupabaseAdminClient();

      // List annotation files in the prefix
      const annotationKeys: string[] = [];
      let continuationToken: string | undefined;

      do {
        const listCmd = new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: s3_annotation_prefix,
          ContinuationToken: continuationToken,
          MaxKeys: 1000,
        });

        const listResult = await s3.send(listCmd);

        for (const obj of listResult.Contents ?? []) {
          if (obj.Key?.endsWith("annotation-data.json") && annotationKeys.length < limit) {
            annotationKeys.push(obj.Key);
          }
        }

        continuationToken = listResult.IsTruncated ? listResult.NextContinuationToken : undefined;
      } while (continuationToken && annotationKeys.length < limit);

      if (annotationKeys.length === 0) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              matched: 0,
              updated: 0,
              message: `No annotation-data.json files found under ${s3_annotation_prefix}`,
            }),
          }],
        };
      }

      const previews: Array<{
        annotation_key: string;
        video_key: string | null;
        clip_id: string | null;
        status: string;
      }> = [];
      let matched = 0;
      let updated = 0;

      for (const annKey of annotationKeys) {
        try {
          // Read the annotation JSON from S3
          const getCmd = new GetObjectCommand({
            Bucket: bucket,
            Key: annKey,
          });

          const getResult = await s3.send(getCmd);
          const body = await getResult.Body?.transformToString("utf-8");

          if (!body) {
            previews.push({ annotation_key: annKey, video_key: null, clip_id: null, status: "empty_body" });
            continue;
          }

          let annData: Record<string, unknown>;
          try {
            annData = JSON.parse(body);
          } catch {
            previews.push({ annotation_key: annKey, video_key: null, clip_id: null, status: "invalid_json" });
            continue;
          }

          // Look for the source video key in common annotation structures
          const videoKey = (annData.video_key ?? annData.source_key ?? annData.s3_key ?? annData.videoKey) as string | undefined;

          if (!videoKey) {
            // Try to derive from the annotation key path
            // e.g. "egocentric-capture/completed/abc123/annotation-data.json"
            // might correspond to "egocentric-capture/completed/abc123/video.mp4"
            const parentDir = annKey.replace(/\/annotation-data\.json$/, "");

            // Search for a clip with s3_key starting with the parent directory
            const { data: matchingClips } = await supabase
              .from("clips")
              .select("id, s3_key")
              .ilike("s3_key", `${parentDir}/%`)
              .limit(1);

            if (matchingClips && matchingClips.length > 0) {
              matched++;
              if (!dry_run) {
                const { error: upErr } = await supabase
                  .from("clips")
                  .update({ ann_annotation_key: annKey })
                  .eq("id", matchingClips[0].id);
                if (!upErr) updated++;
              }
              previews.push({
                annotation_key: annKey,
                video_key: matchingClips[0].s3_key,
                clip_id: matchingClips[0].id,
                status: dry_run ? "would_update" : "updated",
              });
            } else {
              previews.push({ annotation_key: annKey, video_key: null, clip_id: null, status: "no_clip_found" });
            }
            continue;
          }

          // Match by exact video key
          const { data: clip } = await supabase
            .from("clips")
            .select("id, s3_key")
            .eq("s3_key", videoKey)
            .single();

          if (clip) {
            matched++;
            if (!dry_run) {
              const { error: upErr } = await supabase
                .from("clips")
                .update({ ann_annotation_key: annKey })
                .eq("id", clip.id);
              if (!upErr) updated++;
            }
            previews.push({
              annotation_key: annKey,
              video_key: videoKey,
              clip_id: clip.id,
              status: dry_run ? "would_update" : "updated",
            });
          } else {
            previews.push({ annotation_key: annKey, video_key: videoKey, clip_id: null, status: "no_clip_found" });
          }
        } catch (e) {
          previews.push({
            annotation_key: annKey,
            video_key: null,
            clip_id: null,
            status: `error: ${e instanceof Error ? e.message : "unknown"}`,
          });
        }
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            matched,
            updated,
            total_annotation_files: annotationKeys.length,
            dry_run,
            previews: previews.slice(0, 50), // Limit preview output
            message: dry_run
              ? `Found ${matched} matches out of ${annotationKeys.length} annotation files. Set dry_run=false to apply.`
              : `Updated ${updated}/${matched} matched clips from ${annotationKeys.length} annotation files.`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// get_enrichment_coverage tool -- pipeline coverage stats
// ---------------------------------------------------------------------------

function registerGetEnrichmentCoverage(server: McpServer) {
  server.tool(
    "get_enrichment_coverage",
    "Get enrichment coverage statistics for clips matching a filter. Shows counts and percentages for embeddings, captions, enrichment JSON, and annotation keys. Useful for planning enrichment runs and tracking pipeline progress.",
    {
      s3_key_prefix: z.string().optional().describe("Filter by S3 key prefix (e.g. 'egocentric-capture/completed/')"),
      s3_bucket: z.string().optional().describe("Filter to a specific S3 bucket"),
    },
    async ({ s3_key_prefix, s3_bucket }) => {
      const supabase = createSupabaseAdminClient();

      // Run parallel count queries
      const [totalResult, embeddingResult, captionResult, enrichmentResult, annotationResult, agentCtxResult] = await Promise.all([
        // Total clips matching filter
        (() => {
          let q = supabase.from("clips").select("id", { count: "exact", head: true });
          if (s3_key_prefix) q = q.ilike("s3_key", `${s3_key_prefix}%`);
          if (s3_bucket) q = q.eq("s3_bucket", s3_bucket);
          return q;
        })(),
        // Clips with embeddings
        (() => {
          let q = supabase.from("clips").select("id", { count: "exact", head: true }).not("embedding", "is", null);
          if (s3_key_prefix) q = q.ilike("s3_key", `${s3_key_prefix}%`);
          if (s3_bucket) q = q.eq("s3_bucket", s3_bucket);
          return q;
        })(),
        // Clips with caption_text
        (() => {
          let q = supabase.from("clips").select("id", { count: "exact", head: true }).not("caption_text", "is", null);
          if (s3_key_prefix) q = q.ilike("s3_key", `${s3_key_prefix}%`);
          if (s3_bucket) q = q.eq("s3_bucket", s3_bucket);
          return q;
        })(),
        // Clips with ai_enrichment_json
        (() => {
          let q = supabase.from("clips").select("id", { count: "exact", head: true }).not("ai_enrichment_json", "is", null);
          if (s3_key_prefix) q = q.ilike("s3_key", `${s3_key_prefix}%`);
          if (s3_bucket) q = q.eq("s3_bucket", s3_bucket);
          return q;
        })(),
        // Clips with ann_annotation_key
        (() => {
          let q = supabase.from("clips").select("id", { count: "exact", head: true }).not("ann_annotation_key", "is", null);
          if (s3_key_prefix) q = q.ilike("s3_key", `${s3_key_prefix}%`);
          if (s3_bucket) q = q.eq("s3_bucket", s3_bucket);
          return q;
        })(),
        // Clips with ai_agent_context
        (() => {
          let q = supabase.from("clips").select("id", { count: "exact", head: true }).not("ai_agent_context", "is", null);
          if (s3_key_prefix) q = q.ilike("s3_key", `${s3_key_prefix}%`);
          if (s3_bucket) q = q.eq("s3_bucket", s3_bucket);
          return q;
        })(),
      ]);

      const total = totalResult.count ?? 0;
      const withEmbedding = embeddingResult.count ?? 0;
      const withCaption = captionResult.count ?? 0;
      const withEnrichment = enrichmentResult.count ?? 0;
      const withAnnotation = annotationResult.count ?? 0;
      const withAgentContext = agentCtxResult.count ?? 0;

      const pct = (n: number) => total > 0 ? `${Math.round((n / total) * 100)}%` : "N/A";

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            filters: {
              s3_key_prefix: s3_key_prefix ?? null,
              s3_bucket: s3_bucket ?? null,
            },
            total,
            with_embedding: { count: withEmbedding, pct: pct(withEmbedding) },
            with_caption: { count: withCaption, pct: pct(withCaption) },
            with_enrichment: { count: withEnrichment, pct: pct(withEnrichment) },
            with_agent_context: { count: withAgentContext, pct: pct(withAgentContext) },
            with_annotation_key: { count: withAnnotation, pct: pct(withAnnotation) },
            gaps: {
              missing_embedding: total - withEmbedding,
              missing_caption: total - withCaption,
              missing_enrichment: total - withEnrichment,
              missing_agent_context: total - withAgentContext,
              missing_annotation_key: total - withAnnotation,
            },
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Register all pipeline tools
// ---------------------------------------------------------------------------

export function register(server: McpServer) {
  registerRunEnrichment(server);
  registerBackfillAnnotationKeys(server);
  registerGetEnrichmentCoverage(server);
}
