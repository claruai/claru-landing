import { task } from "@trigger.dev/sdk/v3";
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

interface AnalyzeVideoPayload {
  jobId: string;
  videoUrl: string;
  specName: string;
}

interface TechnicalMetadata {
  duration_seconds: number;
  width: number;
  height: number;
  fps: number;
  codec: string;
  orientation: "landscape" | "portrait" | "square";
  file_size_bytes: number;
}

interface ContentAnalysis {
  score: number;
  issues: string[];
  summary: string;
  hand_visibility_estimate: string;
  pov_type: string;
  has_active_manipulation: boolean;
  has_narration: boolean;
  exposure_quality: string;
}

function runFfprobe(filePath: string): TechnicalMetadata {
  const ffprobePath = process.env.FFPROBE_PATH || "ffprobe";
  const raw = execSync(
    `${ffprobePath} -v quiet -print_format json -show_format -show_streams "${filePath}"`,
    { encoding: "utf-8", timeout: 30_000 },
  );
  const data = JSON.parse(raw);

  const videoStream = data.streams?.find(
    (s: { codec_type: string }) => s.codec_type === "video",
  );

  const width = videoStream?.width ?? 0;
  const height = videoStream?.height ?? 0;
  const duration = parseFloat(data.format?.duration ?? "0");
  const fileSize = parseInt(data.format?.size ?? "0", 10);

  let fps = 0;
  const rFrameRate = videoStream?.r_frame_rate;
  if (rFrameRate && rFrameRate.includes("/")) {
    const [num, den] = rFrameRate.split("/").map(Number);
    fps = den > 0 ? Math.round((num / den) * 100) / 100 : 0;
  }

  return {
    duration_seconds: Math.round(duration * 100) / 100,
    width,
    height,
    fps,
    codec: videoStream?.codec_name ?? "unknown",
    orientation: width > height ? "landscape" : width < height ? "portrait" : "square",
    file_size_bytes: fileSize,
  };
}

function extractFrames(filePath: string, count: number, tmpDir: string): string[] {
  const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
  const raw = execSync(
    `${ffmpegPath} -v quiet -print_format json -show_format "${filePath}"`,
    { encoding: "utf-8", timeout: 10_000 },
  ).trim();

  let duration = 60;
  try {
    const parsed = JSON.parse(raw);
    duration = parseFloat(parsed.format?.duration ?? "60");
  } catch {
    // fallback
  }

  const paths: string[] = [];
  const interval = duration / (count + 1);

  for (let i = 1; i <= count; i++) {
    const timestamp = Math.round(interval * i * 100) / 100;
    const outPath = join(tmpDir, `frame_${i}.jpg`);
    try {
      execSync(
        `${ffmpegPath} -ss ${timestamp} -i "${filePath}" -vframes 1 -q:v 2 "${outPath}" -y`,
        { timeout: 15_000, stdio: "pipe" },
      );
      paths.push(outPath);
    } catch {
      // skip failed frames
    }
  }
  return paths;
}

async function analyzeWithGemini(
  frames: string[],
  specRequirements: string[],
): Promise<ContentAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      score: 0,
      issues: ["GEMINI_API_KEY not configured"],
      summary: "Skipped",
      hand_visibility_estimate: "unknown",
      pov_type: "unknown",
      has_active_manipulation: false,
      has_narration: false,
      exposure_quality: "unknown",
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const frameParts = frames.map((fp) => {
    const data = require("fs").readFileSync(fp);
    return {
      inlineData: {
        mimeType: "image/jpeg" as const,
        data: data.toString("base64"),
      },
    };
  });

  const prompt = `You are a professional video QA auditor. Analyze these ${frames.length} evenly-sampled frames from a video clip.

CONTENT REQUIREMENTS TO CHECK:
${specRequirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

For each frame, assess: hand visibility, POV type, active manipulation, exposure quality.

Respond with valid JSON only (no markdown):
{
  "score": <0-10>,
  "issues": ["specific violations found"],
  "summary": "one sentence overall assessment",
  "hand_visibility_estimate": "none|low (<30%)|medium (30-70%)|high (70-90%)|very_high (>90%)",
  "pov_type": "first_person_head_mounted|first_person_chest|first_person_handheld|third_person|unclear",
  "has_active_manipulation": true/false,
  "has_narration": false,
  "exposure_quality": "underexposed|good|overexposed|mixed"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [...frameParts, { text: prompt }] }],
    });

    const text = response.text?.trim() ?? "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return {
      score: 0,
      issues: [`Gemini error: ${e instanceof Error ? e.message : "unknown"}`],
      summary: "Analysis failed",
      hand_visibility_estimate: "unknown",
      pov_type: "unknown",
      has_active_manipulation: false,
      has_narration: false,
      exposure_quality: "unknown",
    };
  }
}

export const analyzeVideo = task({
  id: "analyze-video",
  retry: { maxAttempts: 2 },
  run: async (payload: AnalyzeVideoPayload) => {
    const { jobId, videoUrl, specName } = payload;
    const supabase = getSupabase();

    await supabase
      .from("video_analysis_jobs")
      .update({ status: "running" })
      .eq("id", jobId);

    const tmpDir = join("/tmp", `video-qa-${randomUUID()}`);
    mkdirSync(tmpDir, { recursive: true });
    const videoPath = join(tmpDir, "input_video");

    try {
      // Download video
      const res = await fetch(videoUrl);
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      writeFileSync(videoPath, buffer);

      // ffprobe metadata
      const tech = runFfprobe(videoPath);

      // Load spec from DB
      const { data: spec } = await supabase
        .from("client_specs")
        .select("content_requirements, min_duration_seconds, max_duration_seconds, min_resolution_height, min_fps, orientation")
        .eq("name", specName)
        .single();

      if (!spec) throw new Error(`Spec "${specName}" not found`);

      // Technical pass/fail
      const techChecks: Record<string, { pass: boolean; actual: string; required: string }> = {};

      techChecks.duration = {
        pass: tech.duration_seconds >= spec.min_duration_seconds && tech.duration_seconds <= spec.max_duration_seconds,
        actual: `${Math.round(tech.duration_seconds)}s`,
        required: `${spec.min_duration_seconds}-${spec.max_duration_seconds}s`,
      };
      techChecks.resolution = {
        pass: tech.height >= spec.min_resolution_height,
        actual: `${tech.width}x${tech.height}`,
        required: `>=${spec.min_resolution_height}p`,
      };
      techChecks.fps = {
        pass: tech.fps >= spec.min_fps,
        actual: `${tech.fps}fps`,
        required: `>=${spec.min_fps}fps`,
      };
      if (spec.orientation !== "any") {
        techChecks.orientation = {
          pass: tech.orientation === spec.orientation,
          actual: tech.orientation,
          required: spec.orientation,
        };
      }

      const allTechPass = Object.values(techChecks).every((c) => c.pass);

      // Extract frames + Gemini vision analysis
      const frames = extractFrames(videoPath, 8, tmpDir);
      const content = await analyzeWithGemini(frames, spec.content_requirements ?? []);

      const contentPass = content.score >= 7;
      const overallScore = allTechPass ? content.score : Math.min(content.score, 3);
      const pass = allTechPass && contentPass;

      const result = {
        pass,
        overall_score: overallScore,
        technical_checks: techChecks,
        content_analysis: content,
        technical_metadata: tech,
      };

      await supabase
        .from("video_analysis_jobs")
        .update({
          status: "completed",
          technical_metadata: tech,
          content_analysis: content,
          overall_result: result,
          completed_at: new Date().toISOString(),
        })
        .eq("id", jobId);

      return result;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Unknown error";
      await supabase
        .from("video_analysis_jobs")
        .update({ status: "failed", error: errorMsg, completed_at: new Date().toISOString() })
        .eq("id", jobId);
      throw e;
    } finally {
      try {
        execSync(`rm -rf "${tmpDir}"`, { stdio: "pipe" });
      } catch {
        // cleanup best-effort
      }
    }
  },
});
