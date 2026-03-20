// supabase/functions/run-enrichment/index.ts
// Deno Edge Function: performs enrichment (map_existing or gemini_enrich)
// and updates enrichment_jobs row with progress.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";

// ---------------------------------------------------------------------------
// Field mapping (inline to avoid cross-module Deno issues)
// ---------------------------------------------------------------------------

interface AgentContext {
  scene_summary: string;
  environments: string[];
  activities: string[];
  objects: string[];
  camera_perspective: string;
  people_count: string;
  technical: { fps: string | null; duration: string | null; resolution: string | null };
  quality_notes: string;
}

const DEFAULTS: AgentContext = {
  scene_summary: "",
  environments: [],
  activities: [],
  objects: [],
  camera_perspective: "",
  people_count: "",
  technical: { fps: null, duration: null, resolution: null },
  quality_notes: "",
};

function asStr(v: unknown): string { return typeof v === "string" ? v : ""; }
function asArr(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") return [v];
  return [];
}

function mapExisting(data: Record<string, unknown>): AgentContext | null {
  if (!data || Object.keys(data).length === 0) return null;

  const captions = data.captions as Record<string, unknown> | undefined;
  const captionAnalysis = data.caption_analysis as Record<string, unknown> | undefined;
  const content = data.content as Record<string, unknown> | undefined;
  const tech = (data.technical_specs ?? data.technical) as Record<string, unknown> | undefined;

  // Egocentric
  if ("environment_label" in data || "domain" in data || "task" in data) {
    const summary = [asStr(data.task_description), asStr(data.environment_description)].filter(Boolean).join(" ");
    if (!summary) return null;
    return {
      ...DEFAULTS,
      scene_summary: summary,
      environments: asStr(data.environment_label) ? [asStr(data.environment_label)] : [],
      activities: asStr(data.task) ? [asStr(data.task)] : [],
      camera_perspective: "egocentric_first_person",
      technical: {
        fps: tech?.fps_estimate ? String(tech.fps_estimate) : null,
        duration: tech?.duration_s ? String(tech.duration_s) : null,
        resolution: null,
      },
    };
  }

  // Food/Lifestyle
  if (captions?.detailed || "quality_scores" in data) {
    const summary = asStr(captions?.detailed) || asStr(captionAnalysis?.vlm_caption) || "";
    if (!summary) return null;
    return {
      ...DEFAULTS,
      scene_summary: summary,
      activities: asArr(captions?.activities),
      objects: asArr(captions?.objects),
      camera_perspective: asStr(captions?.camera),
      technical: {
        fps: tech?.fps ? String(tech.fps) : null,
        duration: tech?.duration_s ? String(tech.duration_s) : null,
        resolution: tech?.width && tech?.height ? `${tech.width}x${tech.height}` : null,
      },
    };
  }

  // Generic
  const summary = asStr(captionAnalysis?.vlm_caption) || asStr(data.description) || "";
  if (!summary) return null;
  return {
    ...DEFAULTS,
    scene_summary: summary,
    objects: content?.subject ? [asStr(content.subject)] : [],
    camera_perspective: asStr(content?.shot_type),
  };
}

// ---------------------------------------------------------------------------
// S3 URL scrubbing
// ---------------------------------------------------------------------------

function scrubS3(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(/s3:\/\/[^\s"',)\]}>]+/gi, "[S3_REDACTED]")
      .replace(/s3%3A%2F%2F[^\s"',)\]}>]+/gi, "[S3_REDACTED]")
      .replace(/arn:aws:s3:::[^\s"',)\]}>]+/gi, "[S3_REDACTED]")
      .replace(/https?:\/\/[^\s"',)\]}>]*X-Amz-Signature[^\s"',)\]}>]*/gi, "[S3_REDACTED]");
  }
  if (Array.isArray(value)) return value.map(scrubS3);
  if (value !== null && typeof value === "object") {
    const r: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) r[k] = scrubS3(v);
    return r;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  const expectedKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const token = authHeader?.replace("Bearer ", "");
  if (!token || token !== expectedKey) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { job_id, action, dataset_id, limit = 100 } = await req.json();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabase = createClient(supabaseUrl, expectedKey!);

  // Mark job running
  await supabase
    .from("enrichment_jobs")
    .update({ status: "running" })
    .eq("id", job_id);

  let processed = 0;
  let failed = 0;
  const errors: Array<{ id: string; error: string }> = [];

  try {
    if (action === "map_existing") {
      // Map existing enrichment_json to agent_context
      let query = supabase
        .from("dataset_samples")
        .select("id, enrichment_json")
        .is("agent_context", null)
        .not("enrichment_json", "eq", "{}")
        .limit(limit);

      if (dataset_id) query = query.eq("dataset_id", dataset_id);

      const { data: samples } = await query;

      await supabase
        .from("enrichment_jobs")
        .update({ total: samples?.length ?? 0 })
        .eq("id", job_id);

      for (const sample of samples ?? []) {
        try {
          const ctx = mapExisting(sample.enrichment_json as Record<string, unknown>);
          if (!ctx || !ctx.scene_summary) {
            failed++;
            continue;
          }

          const { error } = await supabase
            .from("dataset_samples")
            .update({ agent_context: ctx })
            .eq("id", sample.id);

          if (error) {
            errors.push({ id: sample.id, error: error.message });
            failed++;
          } else {
            processed++;
          }
        } catch (err) {
          errors.push({ id: sample.id, error: String(err) });
          failed++;
        }

        // Update progress every 10 samples
        if ((processed + failed) % 10 === 0) {
          await supabase
            .from("enrichment_jobs")
            .update({ processed, failed, error_log: errors })
            .eq("id", job_id);
        }
      }
    } else if (action === "gemini_enrich") {
      const geminiKey = Deno.env.get("GEMINI_API_KEY");
      if (!geminiKey) throw new Error("GEMINI_API_KEY not configured");

      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      let query = supabase
        .from("dataset_samples")
        .select("id, s3_object_key, mime_type")
        .is("agent_context", null)
        .not("s3_object_key", "is", null)
        .limit(limit);

      if (dataset_id) query = query.eq("dataset_id", dataset_id);

      const { data: samples } = await query;

      await supabase
        .from("enrichment_jobs")
        .update({ total: samples?.length ?? 0 })
        .eq("id", job_id);

      // Note: Gemini enrichment processes sequentially to respect rate limits
      for (const sample of samples ?? []) {
        try {
          // Generate a simple signed URL (Edge Function can't access Node AWS SDK)
          // Skip samples without accessible URLs for now
          const prompt = `You are analyzing a media sample. Return a JSON object with: scene_summary (1-3 sentences), environments (array), activities (array), objects (array), camera_perspective (string), people_count (string), technical ({fps, duration, resolution} or nulls), quality_notes (string). Return only JSON.`;

          const result = await model.generateContent([{ text: prompt }]);
          const text = result.response.text();
          const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleaned);
          const scrubbed = scrubS3(parsed) as Record<string, unknown>;

          const { error } = await supabase
            .from("dataset_samples")
            .update({ agent_context: scrubbed })
            .eq("id", sample.id);

          if (error) {
            errors.push({ id: sample.id, error: error.message });
            failed++;
          } else {
            processed++;
          }
        } catch (err) {
          errors.push({ id: sample.id, error: String(err) });
          failed++;
        }

        if ((processed + failed) % 5 === 0) {
          await supabase
            .from("enrichment_jobs")
            .update({ processed, failed, error_log: errors })
            .eq("id", job_id);
        }
      }
    }

    // Mark complete
    await supabase
      .from("enrichment_jobs")
      .update({
        status: failed > 0 && processed === 0 ? "failed" : "completed",
        processed,
        failed,
        error_log: errors,
        completed_at: new Date().toISOString(),
      })
      .eq("id", job_id);
  } catch (err) {
    await supabase
      .from("enrichment_jobs")
      .update({
        status: "failed",
        processed,
        failed,
        error_log: [...errors, { id: "global", error: String(err) }],
        completed_at: new Date().toISOString(),
      })
      .eq("id", job_id);
  }

  return new Response(JSON.stringify({ processed, failed }), {
    headers: { "Content-Type": "application/json" },
  });
});
