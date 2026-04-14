import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/embeddings/openai";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { analyzeVideo } from "@/trigger/analyze-video";
import {
  loadSpec,
  listSpecs,
  analyzeContentWithGemini,
  runTechnicalChecks,
  type AuditResult,
} from "@/lib/mcp/helpers";

// ---------------------------------------------------------------------------
// audit_clip tool -- QA a single clip against a client spec
// ---------------------------------------------------------------------------

function registerAuditClip(server: McpServer) {
  server.tool(
    "audit_clip",
    "QA-audit a single clip against a client spec (e.g. 'sieve'). Checks technical metadata (duration, resolution, fps, orientation) and uses Gemini to assess content requirements from existing captions/enrichment data. Returns pass/fail with detailed scores.",
    {
      clip_id: z.string().uuid().describe("Clip UUID from the clips table"),
      spec_name: z.string().default("sieve").describe("Spec name from client_specs table (default: 'sieve'). Use list_specs to see available specs."),
    },
    async ({ clip_id, spec_name }) => {
      const spec = await loadSpec(spec_name);
      if (!spec) {
        const available = await listSpecs();
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Unknown spec: ${spec_name}. Available: ${available.map((s) => s.name).join(", ")}` }) }],
        };
      }

      const supabase = createSupabaseAdminClient();
      const { data: clip, error } = await supabase
        .from("clips")
        .select("id, s3_key, s3_bucket, mime_type, filename, tech_duration_seconds, tech_resolution_width, tech_resolution_height, tech_fps, tech_codec, ai_caption, caption_text, ai_agent_context, ai_enrichment_source")
        .eq("id", clip_id)
        .single();

      if (error || !clip) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Clip not found" }) }],
        };
      }

      const techChecks = runTechnicalChecks(clip, spec);
      const allTechPass = Object.values(techChecks).every((c) => c.pass);

      const caption = clip.ai_caption || clip.caption_text || "";
      const contentResult = await analyzeContentWithGemini(
        caption,
        clip.ai_agent_context as Record<string, unknown> | null,
        spec,
      );

      const contentPass = contentResult.score >= 7;
      const overallScore = allTechPass ? contentResult.score : Math.min(contentResult.score, 3);

      const result: AuditResult = {
        clip_id,
        pass: allTechPass && contentPass,
        technical_checks: techChecks,
        content_assessment: { ...contentResult, pass: contentPass },
        overall_score: overallScore,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// audit_catalog tool -- batch QA all clips in a dataset
// ---------------------------------------------------------------------------

function registerAuditCatalog(server: McpServer) {
  server.tool(
    "audit_catalog",
    "Batch QA-audit every clip in a dataset against a client spec. Returns per-clip results plus a summary with pass/fail counts, clips to cut, and clips to keep.",
    {
      dataset_id: z.string().uuid().describe("Dataset UUID to audit"),
      spec_name: z.string().default("sieve").describe("Spec name from client_specs table (default: 'sieve')"),
    },
    async ({ dataset_id, spec_name }) => {
      const spec = await loadSpec(spec_name);
      if (!spec) {
        const available = await listSpecs();
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Unknown spec: ${spec_name}. Available: ${available.map((s) => s.name).join(", ")}` }) }],
        };
      }

      const supabase = createSupabaseAdminClient();

      const { data: dcRows } = await supabase
        .from("dataset_clips")
        .select("clip_id")
        .eq("dataset_id", dataset_id);

      if (!dcRows || dcRows.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "No clips found in dataset" }) }],
        };
      }

      const clipIds = dcRows.map((r) => r.clip_id);

      const { data: clips } = await supabase
        .from("clips")
        .select("id, s3_key, filename, tech_duration_seconds, tech_resolution_width, tech_resolution_height, tech_fps, ai_caption, caption_text, ai_agent_context")
        .in("id", clipIds);

      if (!clips || clips.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Clips not found" }) }],
        };
      }

      const results: Array<AuditResult & { filename: string }> = [];

      // Process sequentially to avoid Gemini rate limits
      for (const clip of clips) {
        const techChecks = runTechnicalChecks(clip, spec);
        const allTechPass = Object.values(techChecks).every((c) => c.pass);

        const caption = clip.ai_caption || clip.caption_text || "";
        const contentResult = await analyzeContentWithGemini(
          caption,
          clip.ai_agent_context as Record<string, unknown> | null,
          spec,
        );

        const contentPass = contentResult.score >= 7;
        const overallScore = allTechPass ? contentResult.score : Math.min(contentResult.score, 3);

        results.push({
          clip_id: clip.id,
          filename: clip.filename || clip.s3_key?.split("/").pop() || "unknown",
          pass: allTechPass && contentPass,
          technical_checks: techChecks,
          content_assessment: { ...contentResult, pass: contentPass },
          overall_score: overallScore,
        });
      }

      const passed = results.filter((r) => r.pass);
      const failed = results.filter((r) => !r.pass);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            spec: spec_name,
            dataset_id,
            total_clips: results.length,
            passed_count: passed.length,
            failed_count: failed.length,
            keep: passed.map((r) => ({ clip_id: r.clip_id, filename: r.filename, score: r.overall_score })),
            cut: failed.map((r) => ({
              clip_id: r.clip_id,
              filename: r.filename,
              score: r.overall_score,
              reasons: [
                ...Object.entries(r.technical_checks)
                  .filter(([, v]) => !v.pass)
                  .map(([k, v]) => `${k}: ${v.actual} (need ${v.required})`),
                ...r.content_assessment.issues,
              ],
            })),
            results,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// find_clips_for_spec tool -- search corpus for clips matching a client spec
// ---------------------------------------------------------------------------

function registerFindClipsForSpec(server: McpServer) {
  server.tool(
    "find_clips_for_spec",
    "Search the 1M+ clip corpus for clips that match a client spec's technical and content requirements. Pre-filters by duration, resolution, fps, and orientation using DB metadata, then ranks by semantic similarity to the environment/activity description.",
    {
      spec_name: z.string().default("sieve").describe("Spec name from client_specs table (default: 'sieve')"),
      environment_query: z.string().describe("Natural language description of the environment/activity to find (e.g. 'woodworking in a shop with hand tools', 'pharmacist filling prescriptions')"),
      count: z.number().min(1).max(50).default(10).describe("Number of candidates to return (default 10)"),
      exclude_dataset_id: z.string().uuid().optional().describe("Optional: exclude clips already in this dataset"),
    },
    async ({ spec_name, environment_query, count, exclude_dataset_id }) => {
      const spec = await loadSpec(spec_name);
      if (!spec) {
        const available = await listSpecs();
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Unknown spec: ${spec_name}. Available: ${available.map((s) => s.name).join(", ")}` }) }],
        };
      }

      const supabase = createSupabaseAdminClient();

      // Build a search query that includes the spec's content needs
      const enrichedQuery = `${environment_query}, first-person POV, hands visible, active manipulation`;
      const queryEmbedding = await generateEmbedding(enrichedQuery, 768);

      // First: semantic search to get candidates
      const { data: matches, error } = await supabase.rpc("match_clips", {
        query_embedding: queryEmbedding,
        match_count: count * 5, // over-fetch to filter
        filter_dataset_id: null,
        filter_bucket: null,
        match_threshold: 0.35,
      });

      if (error || !matches || matches.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ results: [], message: "No matching clips found" }) }],
        };
      }

      // Get exclude set if specified
      let excludeIds = new Set<string>();
      if (exclude_dataset_id) {
        const { data: excl } = await supabase
          .from("dataset_clips")
          .select("clip_id")
          .eq("dataset_id", exclude_dataset_id);
        excludeIds = new Set((excl ?? []).map((r) => r.clip_id));
      }

      // Filter by technical requirements + exclusion
      const filtered = (matches as Array<{
        id: string;
        s3_bucket: string;
        s3_key: string;
        mime_type: string | null;
        similarity: number;
        ai_caption: string | null;
        caption_text: string | null;
        tech_duration_seconds: number | null;
        tech_resolution_width: number | null;
        tech_resolution_height: number | null;
        tech_fps: number | null;
      }>).filter((m) => {
        if (excludeIds.has(m.id)) return false;

        const dur = m.tech_duration_seconds;
        if (dur != null && (dur < spec.min_duration_seconds || dur > spec.max_duration_seconds)) return false;

        const h = m.tech_resolution_height;
        if (h != null && h < spec.min_resolution_height) return false;

        const fps = m.tech_fps;
        if (fps != null && fps < spec.min_fps) return false;

        if (spec.orientation === "landscape") {
          const w = m.tech_resolution_width;
          if (w != null && h != null && w <= h) return false;
        }

        return true;
      }).slice(0, count);

      const results = await Promise.all(
        filtered.map(async (m) => {
          const signed_url = await getS3SignedUrl(m.s3_key, 600, m.s3_bucket);
          return {
            id: m.id,
            similarity: Math.round(m.similarity * 1000) / 1000,
            signed_url,
            s3_key: m.s3_key,
            mime_type: m.mime_type,
            duration_seconds: m.tech_duration_seconds,
            resolution: m.tech_resolution_width && m.tech_resolution_height
              ? `${m.tech_resolution_width}x${m.tech_resolution_height}`
              : null,
            fps: m.tech_fps,
            caption: m.ai_caption ?? m.caption_text ?? null,
          };
        }),
      );

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(scrubS3Urls({
            spec: spec_name,
            query: environment_query,
            count: results.length,
            results,
          })),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// register_spec tool -- create or update a client QA spec
// ---------------------------------------------------------------------------

function registerRegisterSpec(server: McpServer) {
  server.tool(
    "register_spec",
    "Create or update a reusable QA spec for a client. Specs define the technical and content requirements that clips must meet. Once registered, use the spec name with audit_clip, audit_catalog, and find_clips_for_spec.",
    {
      name: z.string().min(1).max(50).describe("Unique spec name (lowercase, e.g. 'sieve', 'waymo', 'figure-ai')"),
      description: z.string().describe("One-line description of the spec and client"),
      min_duration_seconds: z.number().min(0).default(60).describe("Minimum clip duration in seconds (default 60)"),
      max_duration_seconds: z.number().min(1).default(180).describe("Maximum clip duration in seconds (default 180)"),
      min_resolution_height: z.number().min(0).default(1080).describe("Minimum vertical resolution (default 1080)"),
      min_fps: z.number().min(0).default(30).describe("Minimum frames per second (default 30)"),
      orientation: z.enum(["landscape", "portrait", "any"]).default("landscape").describe("Required orientation (default 'landscape')"),
      content_requirements: z.array(z.string()).min(1).describe("List of content requirements the clip must meet (evaluated by Gemini vision)"),
      lead_id: z.string().uuid().optional().describe("Optional: link spec to a lead record"),
    },
    async ({ name, description, min_duration_seconds, max_duration_seconds, min_resolution_height, min_fps, orientation, content_requirements, lead_id }) => {
      const supabase = createSupabaseAdminClient();

      const { data, error } = await supabase
        .from("client_specs")
        .upsert({
          name: name.toLowerCase().trim(),
          description,
          min_duration_seconds,
          max_duration_seconds,
          min_resolution_height,
          min_fps,
          orientation,
          content_requirements,
          lead_id: lead_id ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "name" })
        .select("id, name, description, created_at, updated_at")
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
            ...data,
            content_requirements,
            message: `Spec "${name}" registered. Use it with audit_clip, audit_catalog, or find_clips_for_spec.`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// list_specs tool -- list all available QA specs
// ---------------------------------------------------------------------------

function registerListSpecsTool(server: McpServer) {
  server.tool(
    "list_specs",
    "List all registered client QA specs. Use the spec name with audit_clip, audit_catalog, and find_clips_for_spec.",
    {},
    async () => {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("client_specs")
        .select("name, description, min_duration_seconds, max_duration_seconds, min_resolution_height, min_fps, orientation, content_requirements, lead_id, created_at, updated_at")
        .order("created_at", { ascending: true });

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ specs: data ?? [], count: data?.length ?? 0 }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// submit_video_analysis -- dispatch async video QA via Trigger.dev
// ---------------------------------------------------------------------------

function registerSubmitVideoAnalysis(server: McpServer) {
  server.tool(
    "submit_video_analysis",
    "Submit a video URL for async QA analysis via Trigger.dev. Downloads the video, runs ffprobe for metadata, extracts frames, and uses Gemini vision to evaluate against a client spec. Returns a job ID to poll with get_analysis_status. Works with any HTTP video URL (S3 signed URLs, Google Drive direct links, etc).",
    {
      video_url: z.string().url().describe("Direct HTTP URL to the video file (must be downloadable)"),
      spec_name: z.string().default("sieve").describe("Spec name from client_specs table"),
      clip_id: z.string().uuid().optional().describe("Optional: link results to an existing clip record"),
    },
    async ({ video_url, spec_name, clip_id }) => {
      const spec = await loadSpec(spec_name);
      if (!spec) {
        const available = await listSpecs();
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Unknown spec: ${spec_name}. Available: ${available.map((s) => s.name).join(", ")}` }) }],
        };
      }

      const supabase = createSupabaseAdminClient();

      const { data: job, error: insertErr } = await supabase
        .from("video_analysis_jobs")
        .insert({
          video_url,
          spec_name,
          clip_id: clip_id ?? null,
          status: "pending",
        })
        .select("id")
        .single();

      if (insertErr || !job) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: insertErr?.message ?? "Failed to create job" }) }],
        };
      }

      try {
        const handle = await tasks.trigger<typeof analyzeVideo>("analyze-video", {
          jobId: job.id,
          videoUrl: video_url,
          specName: spec_name,
        });

        await supabase
          .from("video_analysis_jobs")
          .update({ trigger_run_id: handle.id })
          .eq("id", job.id);

        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              job_id: job.id,
              trigger_run_id: handle.id,
              status: "pending",
              spec: spec_name,
              message: "Video analysis job submitted. Poll with get_analysis_status to check progress.",
            }),
          }],
        };
      } catch (e) {
        await supabase
          .from("video_analysis_jobs")
          .update({ status: "failed", error: e instanceof Error ? e.message : "Trigger dispatch failed" })
          .eq("id", job.id);

        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Failed to dispatch: ${e instanceof Error ? e.message : "unknown"}`, job_id: job.id }) }],
        };
      }
    },
  );
}

// ---------------------------------------------------------------------------
// get_analysis_status -- poll async video QA job results
// ---------------------------------------------------------------------------

function registerGetAnalysisStatus(server: McpServer) {
  server.tool(
    "get_analysis_status",
    "Check the status and results of an async video analysis job. Returns pending/running/completed/failed status. When completed, includes full QA results with technical metadata, content analysis, and pass/fail verdict.",
    {
      job_id: z.string().uuid().describe("Job ID returned by submit_video_analysis"),
    },
    async ({ job_id }) => {
      const supabase = createSupabaseAdminClient();

      const { data: job, error } = await supabase
        .from("video_analysis_jobs")
        .select("*")
        .eq("id", job_id)
        .single();

      if (error || !job) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Job not found" }) }],
        };
      }

      if (job.status === "completed") {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              job_id: job.id,
              status: "completed",
              spec: job.spec_name,
              result: job.overall_result,
              technical_metadata: job.technical_metadata,
              content_analysis: job.content_analysis,
              completed_at: job.completed_at,
            }),
          }],
        };
      }

      if (job.status === "failed") {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              job_id: job.id,
              status: "failed",
              error: job.error,
              spec: job.spec_name,
            }),
          }],
        };
      }

      let triggerStatus = job.status;
      if (job.trigger_run_id) {
        try {
          const run = await runs.retrieve(job.trigger_run_id);
          triggerStatus = run.status ?? job.status;
        } catch {
          // fallback to DB status
        }
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            job_id: job.id,
            status: triggerStatus,
            spec: job.spec_name,
            message: "Job is still processing. Poll again in a few seconds.",
            created_at: job.created_at,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Register all QA tools
// ---------------------------------------------------------------------------

export function register(server: McpServer) {
  registerAuditClip(server);
  registerAuditCatalog(server);
  registerFindClipsForSpec(server);
  registerRegisterSpec(server);
  registerListSpecsTool(server);
  registerSubmitVideoAnalysis(server);
  registerGetAnalysisStatus(server);
}
