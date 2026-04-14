import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { GoogleGenAI } from "@google/genai";

// ---------------------------------------------------------------------------
// Client Spec system -- reusable QA specs for different customers
// ---------------------------------------------------------------------------

export interface ClipSpec {
  name: string;
  description: string;
  min_duration_seconds: number;
  max_duration_seconds: number;
  min_resolution_height: number;
  min_fps: number;
  orientation: "landscape" | "portrait" | "any";
  content_requirements: string[];
}

export async function loadSpec(specName: string): Promise<ClipSpec | null> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("client_specs")
    .select("name, description, min_duration_seconds, max_duration_seconds, min_resolution_height, min_fps, orientation, content_requirements")
    .eq("name", specName)
    .single();

  if (!data) return null;
  return data as ClipSpec;
}

export async function listSpecs(): Promise<Array<{ name: string; description: string }>> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("client_specs")
    .select("name, description")
    .order("created_at", { ascending: true });
  return (data ?? []) as Array<{ name: string; description: string }>;
}

export interface AuditResult {
  clip_id: string;
  pass: boolean;
  technical_checks: Record<string, { pass: boolean; actual: string; required: string }>;
  content_assessment: {
    score: number;
    pass: boolean;
    issues: string[];
    summary: string;
  };
  overall_score: number;
}

export async function analyzeContentWithGemini(
  caption: string,
  metadata: Record<string, unknown> | null,
  spec: ClipSpec,
): Promise<{ score: number; issues: string[]; summary: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { score: 0, issues: ["GEMINI_API_KEY not configured -- cannot run content analysis"], summary: "Skipped" };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a video QA auditor. Given a clip's caption/description and metadata, evaluate whether it meets the following content requirements for the "${spec.name}" spec.

CONTENT REQUIREMENTS:
${spec.content_requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

CLIP CAPTION:
${caption || "(no caption available)"}

CLIP METADATA:
${metadata ? JSON.stringify(metadata, null, 2) : "(no metadata)"}

Respond with valid JSON only (no markdown):
{
  "score": <0-10 integer>,
  "issues": ["list of specific requirement violations found"],
  "summary": "one sentence assessment"
}

Score guide: 10 = clearly passes all requirements, 7-9 = minor concerns, 4-6 = some requirements not met, 0-3 = clearly fails.
If the caption is too vague to assess, say so in issues and give score 5.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text?.trim() ?? "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      score: Math.min(10, Math.max(0, Number(parsed.score) || 0)),
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      summary: String(parsed.summary || ""),
    };
  } catch (e) {
    return { score: 5, issues: [`Gemini analysis error: ${e instanceof Error ? e.message : "unknown"}`], summary: "Analysis failed" };
  }
}

export function runTechnicalChecks(
  clip: {
    tech_duration_seconds: number | null;
    tech_resolution_width: number | null;
    tech_resolution_height: number | null;
    tech_fps: number | null;
  },
  spec: ClipSpec,
): Record<string, { pass: boolean; actual: string; required: string }> {
  const checks: Record<string, { pass: boolean; actual: string; required: string }> = {};

  const dur = clip.tech_duration_seconds;
  checks.duration = {
    pass: dur != null && dur >= spec.min_duration_seconds && dur <= spec.max_duration_seconds,
    actual: dur != null ? `${Math.round(dur)}s` : "unknown",
    required: `${spec.min_duration_seconds}-${spec.max_duration_seconds}s`,
  };

  const h = clip.tech_resolution_height;
  checks.resolution = {
    pass: h != null && h >= spec.min_resolution_height,
    actual: h != null ? `${clip.tech_resolution_width}x${h}` : "unknown",
    required: `>=${spec.min_resolution_height}p`,
  };

  const fps = clip.tech_fps;
  checks.fps = {
    pass: fps != null && fps >= spec.min_fps,
    actual: fps != null ? `${fps}fps` : "unknown",
    required: `>=${spec.min_fps}fps`,
  };

  if (spec.orientation !== "any") {
    const w = clip.tech_resolution_width;
    const isLandscape = w != null && h != null && w > h;
    const isPortrait = w != null && h != null && h > w;
    checks.orientation = {
      pass: spec.orientation === "landscape" ? isLandscape : isPortrait,
      actual: w != null && h != null ? (w > h ? "landscape" : "portrait") : "unknown",
      required: spec.orientation,
    };
  }

  return checks;
}

export const CUSTOM_CURATIONS_CATEGORY_ID = "46cf5324-f3e3-484f-9cb3-7b1dffff0094";
