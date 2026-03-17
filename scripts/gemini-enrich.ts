/**
 * Gemini Enrichment Pipeline
 *
 * Downloads S3 video/image samples, extracts frames with ffmpeg,
 * sends to Gemini 2.5 Flash with type-specific prompts, validates
 * with Zod schemas, and saves enrichment JSON.
 *
 * Processes ALL 22 compositions:
 * - Types 1, 8 (no human annotation): Gemini generates ALL data
 * - Types 2-7 (human annotation exists): Gemini SUPPLEMENTS with
 *   quality dimensions, artifact analysis, scene descriptions, technical specs
 *
 * Usage:
 *   npx tsx scripts/gemini-enrich.ts                       # All 22
 *   npx tsx scripts/gemini-enrich.ts --composition sol-egocentric  # Single
 */

import * as fs from "node:fs";
import * as path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });
import { execSync } from "node:child_process";
import { S3Client, GetObjectCommand, ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(__dirname, "composition-manifest.json");
const PROMPTS_DIR = path.join(__dirname, "gemini-prompts");
const OUTPUT_DIR = path.join(ROOT, "public", "remotion-assets", "enrichments");
const TMP_DIR = path.join(ROOT, "tmp");
const SAMPLES_DIR = path.join(TMP_DIR, "samples");
const FRAMES_DIR = path.join(TMP_DIR, "frames");
const MISSING_LOG = path.join(TMP_DIR, "missing-samples.log");

const CONCURRENCY_LIMIT = 3;
const BATCH_DELAY_MS = 1000;
const BACKOFF_BASE_MS = 2000;
const MAX_RETRIES = 5;

// S3 prefixes per dataset slug (determined from media-asset-audit)
const DATASET_S3_PREFIXES: Record<string, string[]> = {
  "egocentric-activity-capture": [
    "Samples Egocentric Videos/",
    "video_capture/completed/",
  ],
  "video-generation-preference": [
    "video_capture/completed/",
  ],
  "content-safety-policy-review": [
    "video_capture/completed/",
  ],
  "game-environment-capture": [
    "video-game-capture/completed/",
    "video_capture/completed/",
  ],
  "cinematic-action-footage": [
    "Cinematic_Action_Footage/",
    "video_capture/completed/",
  ],
  "ai-image-generation-eval": [
    "video_capture/completed/",
  ],
  "product-image-annotation": [
    "video_capture/completed/",
  ],
  "video-classification-supervised-labels": [
    "video_capture/completed/",
  ],
  "systematic-quality-parameter-evaluations": [
    "video_capture/completed/",
  ],
  "video-quality-annotations": [
    "video_capture/completed/",
  ],
  "prompt-video-selection-rankings": [
    "video_capture/completed/",
  ],
  "object-face-identity-matching": [
    "video_capture/completed/",
  ],
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ManifestSample {
  datasetId: string;
  datasetSlug: string;
  sampleId?: string;
  subcategory?: string;
  maxSamples?: number;
}

interface ManifestEnrichment {
  promptFile: string;
  framesPerSecond: number;
  maxFrames: number;
}

interface CompositionConfig {
  id: string;
  type: number;
  page: { route: string; placement: string };
  samples: ManifestSample[];
  annotationSource: "real" | "gemini" | "metadata-only";
  enrichment: ManifestEnrichment | null;
  render: { durationFrames: number; fps: number; width: number; height: number; codec: string };
}

interface Manifest {
  compositions: CompositionConfig[];
}

interface FrameData {
  path: string;
  base64: string;
  timestampS: number;
}

// ---------------------------------------------------------------------------
// Zod schemas per type
// ---------------------------------------------------------------------------

const Type1Schema = z.object({
  frames: z.array(z.object({
    timestamp_s: z.number(),
    manipulation_phase: z.string(),
    task_step: z.string(),
    task_pct: z.number(),
    hands: z.array(z.object({
      side: z.string(),
      bbox: z.array(z.number()).length(4),
      action: z.string(),
      holding: z.string().nullable(),
      finger_state: z.string(),
      force_estimate_N: z.number(),
      velocity_ms: z.number(),
      wrist_pose: z.object({ x: z.number(), y: z.number(), z_depth_est: z.number() }),
    })),
    objects: z.array(z.object({
      label: z.string(),
      bbox: z.array(z.number()).length(4),
      affordance: z.string(),
      interacting: z.boolean(),
      state: z.string(),
      fill_level_pct: z.number().nullable(),
      pose_6dof: z.object({ roll: z.number(), pitch: z.number(), yaw: z.number() }),
    })),
    spatial: z.object({
      camera_height_est_m: z.number(),
      camera_pitch_deg: z.number(),
      workspace_depth_m: z.number(),
      dominant_hand_distance_m: z.number(),
    }),
    imu_estimate: z.object({
      head_angular_vel_dps: z.object({ x: z.number(), y: z.number(), z: z.number() }),
      linear_accel_ms2: z.object({ x: z.number(), y: z.number(), z: z.number() }),
      head_stable: z.boolean(),
    }),
    scene: z.object({
      lighting_lux_est: z.number(),
      clutter_level: z.string(),
      surface_material: z.string(),
    }),
  })),
  summary: z.object({
    total_frames: z.number(),
    primary_task: z.string(),
    objects_involved: z.array(z.string()),
    manipulation_phases_observed: z.array(z.string()),
  }),
});

const Type2Schema = z.object({
  quality_dimensions: z.object({
    prompt_adherence: z.object({ score: z.number(), notes: z.string() }),
    motion_quality: z.object({ score: z.number(), notes: z.string() }),
    visual_fidelity: z.object({ score: z.number(), notes: z.string() }),
    temporal_consistency: z.object({ score: z.number(), notes: z.string() }),
    aesthetic_quality: z.object({ score: z.number(), notes: z.string() }),
  }),
  artifacts: z.array(z.object({
    type: z.string(),
    severity: z.string(),
    frame_range: z.array(z.number()),
    description: z.string(),
  })),
  scene_description: z.string(),
  technical_observations: z.object({
    estimated_resolution: z.string(),
    motion_complexity: z.string(),
    scene_type: z.string(),
  }),
});

const Type3Schema = z.object({
  per_image_analysis: z.array(z.object({
    image_index: z.number(),
    quality_score: z.number(),
    artifacts: z.array(z.object({
      type: z.string(),
      severity: z.string(),
      location: z.string(),
      description: z.string(),
    })),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  })),
  comparative_notes: z.object({
    best_quality_index: z.number(),
    worst_quality_index: z.number(),
    quality_spread: z.string(),
    common_artifacts: z.array(z.string()),
    differentiating_factors: z.array(z.string()),
  }),
  scene_description: z.string(),
  prompt_adherence_notes: z.string(),
  technical_observations: z.object({
    style_consistency: z.string(),
    detail_level: z.string(),
    color_palette: z.string(),
  }),
});

const Type4Schema = z.object({
  object_analysis: z.array(z.object({
    label: z.string(),
    material: z.string(),
    color_primary: z.string(),
    color_secondary: z.string().nullable(),
    affordances: z.array(z.string()),
    condition: z.string(),
    estimated_size: z.object({ width_cm: z.number(), height_cm: z.number() }),
    orientation: z.string(),
    occlusion_pct: z.number(),
  })),
  spatial_relationships: z.array(z.object({
    subject: z.string(),
    relation: z.string(),
    object: z.string(),
  })),
  scene_context: z.object({
    environment: z.string(),
    lighting: z.string(),
    background: z.string(),
    image_quality: z.string(),
  }),
  annotation_quality_notes: z.object({
    bbox_tightness: z.string(),
    suggested_additional_objects: z.array(z.string()),
  }),
});

const Type5Schema = z.object({
  scene_description: z.string(),
  object_inventory: z.array(z.object({
    object: z.string(),
    count: z.number(),
    prominence: z.string(),
    relevance_to_category: z.string(),
  })),
  visual_style: z.object({
    art_style: z.string(),
    color_palette: z.string(),
    camera_angle: z.string(),
    motion_type: z.string(),
  }),
  classification_confidence: z.object({
    primary_category_confidence: z.number(),
    alternative_categories: z.array(z.object({
      category: z.string(),
      subcategory: z.string(),
      confidence: z.number(),
      reasoning: z.string(),
    })),
    ambiguity_notes: z.string().nullable(),
  }),
  content_signals: z.object({
    text_visible: z.boolean(),
    text_content: z.string().nullable(),
    ui_elements_visible: z.boolean(),
    human_presence: z.boolean(),
    action_intensity: z.string(),
  }),
  technical_quality: z.object({
    estimated_resolution: z.string(),
    frame_rate_impression: z.string(),
    compression_artifacts: z.boolean(),
  }),
});

const Type6Schema = z.object({
  frame_analysis: z.array(z.object({
    frame_index: z.number(),
    timestamp_s: z.number(),
    quality_notes: z.string(),
    artifacts_present: z.array(z.object({
      type: z.string(),
      severity: z.string(),
      location: z.string(),
    })),
    visual_interest_score: z.number(),
  })),
  motion_metrics: z.object({
    camera_movement: z.string(),
    subject_motion: z.string(),
    motion_smoothness: z.number(),
    estimated_optical_flow_magnitude: z.string(),
  }),
  cinematic_analysis: z.object({
    shot_composition: z.string(),
    depth_of_field: z.string(),
    color_grading: z.string(),
    lighting_quality: z.string(),
  }),
  text_alignment_analysis: z.object({
    visible_text_elements: z.array(z.string()),
    text_relevance_to_content: z.string().nullable(),
    text_rendering_quality: z.string().nullable(),
  }),
  overall_assessment: z.object({
    strongest_dimension: z.string(),
    weakest_dimension: z.string(),
    key_quality_differentiator: z.string(),
    suggested_improvements: z.array(z.string()),
  }),
});

const Type7Schema = z.object({
  content_categories: z.array(z.object({
    category: z.string(),
    confidence: z.number(),
    subcategory: z.string().nullable(),
    evidence_description: z.string(),
  })),
  risk_assessment: z.object({
    overall_severity: z.string(),
    audience_impact: z.string(),
    context_sensitivity: z.string(),
    escalation_recommended: z.boolean(),
  }),
  policy_mapping: z.object({
    eu_ai_act: z.object({
      relevant_articles: z.array(z.string()),
      risk_classification: z.string(),
      compliance_notes: z.string(),
    }),
    platform_policies: z.array(z.object({
      framework: z.string(),
      relevant_section: z.string(),
      violation_likely: z.boolean(),
    })),
  }),
  visual_analysis: z.object({
    scene_description: z.string(),
    sensitive_elements: z.array(z.string()),
    blur_or_redaction_needed: z.boolean(),
    redaction_regions: z.array(z.string()),
  }),
  prompt_analysis: z.object({
    intent_classification: z.string(),
    jailbreak_technique: z.string().nullable(),
    prompt_risk_level: z.string(),
  }),
});

const Type8Schema = z.object({
  scene_description: z.string(),
  scene_elements: z.object({
    setting: z.string(),
    subjects: z.array(z.string()),
    action: z.string(),
    mood: z.string(),
  }),
  camera_movement: z.object({
    type: z.string(),
    direction: z.string(),
    speed: z.string(),
    stability: z.string(),
  }),
  technical_quality: z.object({
    estimated_resolution: z.string(),
    dynamic_range: z.string(),
    color_depth_est: z.string(),
    noise_level: z.string(),
    sharpness: z.string(),
    codec_impression: z.string(),
  }),
  color_analysis: z.object({
    dominant_colors: z.array(z.string()),
    color_temperature: z.string(),
    saturation: z.string(),
    contrast: z.string(),
  }),
  composition: z.object({
    framing: z.string(),
    depth_of_field: z.string(),
    rule_of_thirds: z.boolean(),
    leading_lines: z.boolean(),
    symmetry: z.boolean(),
  }),
  licensing_suitability: z.object({
    commercial_use: z.boolean(),
    identifiable_persons: z.boolean(),
    brand_logos_visible: z.boolean(),
    location_identifiable: z.boolean(),
  }),
});

const TYPE_SCHEMAS: Record<number, z.ZodType> = {
  1: Type1Schema,
  2: Type2Schema,
  3: Type3Schema,
  4: Type4Schema,
  5: Type5Schema,
  6: Type6Schema,
  7: Type7Schema,
  8: Type8Schema,
};

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { compositionId?: string } {
  const args = process.argv.slice(2);
  let compositionId: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--composition" && args[i + 1]) {
      compositionId = args[i + 1];
      i++;
    }
  }

  return { compositionId };
}

// ---------------------------------------------------------------------------
// S3 Client
// ---------------------------------------------------------------------------

function getS3Client(): S3Client {
  return new S3Client({ region: process.env.AWS_REGION });
}

async function getPresignedUrl(key: string): Promise<string> {
  const client = getS3Client();
  const bucket = process.env.S3_BUCKET_NAME!;
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
}

async function headObject(key: string): Promise<boolean> {
  const client = getS3Client();
  const bucket = process.env.S3_BUCKET_NAME!;
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function listS3Objects(prefix: string, maxKeys: number = 10): Promise<string[]> {
  const client = getS3Client();
  const bucket = process.env.S3_BUCKET_NAME!;
  try {
    const result = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    }));
    return (result.Contents ?? [])
      .map(o => o.Key!)
      .filter(k => k && (k.endsWith(".mp4") || k.endsWith(".mov") || k.endsWith(".jpg") || k.endsWith(".png") || k.endsWith(".jpeg")));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Sample downloading
// ---------------------------------------------------------------------------

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch {
    return false;
  }
}

async function findAndDownloadSample(config: CompositionConfig): Promise<string | null> {
  const sampleDir = path.join(SAMPLES_DIR, config.id);
  fs.mkdirSync(sampleDir, { recursive: true });

  // Check for already cached samples
  const cached = fs.readdirSync(sampleDir).filter(f =>
    f.endsWith(".mp4") || f.endsWith(".mov") || f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".jpeg")
  );
  if (cached.length > 0) {
    console.log(`  [cache] Using cached sample: ${cached[0]}`);
    return path.join(sampleDir, cached[0]);
  }

  // Try each dataset sample config
  for (const sample of config.samples) {
    const prefixes = DATASET_S3_PREFIXES[sample.datasetSlug] ?? ["video_capture/completed/"];

    for (const prefix of prefixes) {
      console.log(`  [s3] Listing objects with prefix: ${prefix}`);
      const keys = await listS3Objects(prefix, 20);

      if (keys.length === 0) {
        console.log(`  [s3] No media files found with prefix: ${prefix}`);
        continue;
      }

      // Try each key until one downloads successfully
      for (const key of keys.slice(0, 5)) {
        console.log(`  [s3] Trying: ${key.slice(0, 80)}...`);
        try {
          const url = await getPresignedUrl(key);
          const ext = path.extname(key) || ".mp4";
          const destPath = path.join(sampleDir, `sample${ext}`);

          const ok = await downloadFile(url, destPath);
          if (ok) {
            const stat = fs.statSync(destPath);
            console.log(`  [ok] Downloaded ${(stat.size / 1024 / 1024).toFixed(1)} MB`);
            return destPath;
          } else {
            fs.appendFileSync(MISSING_LOG, `${new Date().toISOString()} | 404 | ${config.id} | ${key}\n`);
            console.log(`  [404] Failed to download: ${key}`);
          }
        } catch (err) {
          fs.appendFileSync(MISSING_LOG, `${new Date().toISOString()} | ERROR | ${config.id} | ${key} | ${err}\n`);
          console.log(`  [err] Error downloading: ${key}`);
        }
      }
    }
  }

  console.log(`  [skip] No downloadable sample found for ${config.id}`);
  return null;
}

// ---------------------------------------------------------------------------
// Frame extraction
// ---------------------------------------------------------------------------

function extractFrames(
  mediaPath: string,
  compositionId: string,
  fps: number,
  maxFrames: number
): FrameData[] {
  const framesDir = path.join(FRAMES_DIR, compositionId);
  fs.mkdirSync(framesDir, { recursive: true });

  // Check if frames already extracted
  const existingFrames = fs.readdirSync(framesDir).filter(f => f.startsWith("frame_") && f.endsWith(".jpg"));
  if (existingFrames.length > 0) {
    console.log(`  [cache] Using ${existingFrames.length} cached frames`);
    return loadFrames(framesDir, fps, maxFrames);
  }

  const ext = path.extname(mediaPath).toLowerCase();
  const isImage = [".jpg", ".jpeg", ".png"].includes(ext);

  if (isImage) {
    // For images, just copy and resize
    const outPath = path.join(framesDir, "frame_0001.jpg");
    try {
      execSync(
        `ffmpeg -y -i "${mediaPath}" -vf "scale=512:-1" -q:v 2 "${outPath}" 2>/dev/null`,
        { stdio: "pipe" }
      );
    } catch {
      // Fallback: just copy as-is
      fs.copyFileSync(mediaPath, outPath);
    }
    return loadFrames(framesDir, fps, 1);
  }

  // For video, extract at specified fps
  try {
    execSync(
      `ffmpeg -y -i "${mediaPath}" -vf "fps=${fps},scale=512:-1" -q:v 2 "${framesDir}/frame_%04d.jpg" 2>/dev/null`,
      { stdio: "pipe", timeout: 60000 }
    );
  } catch (err) {
    console.log(`  [warn] ffmpeg extraction failed, trying with fewer options...`);
    try {
      execSync(
        `ffmpeg -y -i "${mediaPath}" -vf "fps=1,scale=512:-1" -q:v 2 "${framesDir}/frame_%04d.jpg" 2>/dev/null`,
        { stdio: "pipe", timeout: 60000 }
      );
    } catch {
      console.log(`  [err] Frame extraction failed completely`);
      return [];
    }
  }

  return loadFrames(framesDir, fps, maxFrames);
}

function loadFrames(framesDir: string, fps: number, maxFrames: number): FrameData[] {
  const framePaths = fs.readdirSync(framesDir)
    .filter(f => f.startsWith("frame_") && f.endsWith(".jpg"))
    .sort()
    .slice(0, maxFrames);

  return framePaths.map((filename, i) => ({
    path: path.join(framesDir, filename),
    base64: fs.readFileSync(path.join(framesDir, filename)).toString("base64"),
    timestampS: i / fps,
  }));
}

// ---------------------------------------------------------------------------
// Gemini API with retry
// ---------------------------------------------------------------------------

async function callGeminiWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  frames: FrameData[],
  retryCount: number = 0
): Promise<string> {
  try {
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: prompt },
      ...frames.map(f => ({
        inlineData: { mimeType: "image/jpeg" as const, data: f.base64 },
      })),
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user" as const, parts }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    return text;
  } catch (err: unknown) {
    const error = err as Error & { status?: number };
    const isRateLimit = error.status === 429 || error.message?.includes("429") || error.message?.includes("rate");

    if (isRateLimit && retryCount < MAX_RETRIES) {
      const delay = BACKOFF_BASE_MS * Math.pow(2, retryCount);
      console.log(`  [retry] Rate limited, waiting ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return callGeminiWithRetry(ai, prompt, frames, retryCount + 1);
    }

    if (retryCount < MAX_RETRIES) {
      const delay = BACKOFF_BASE_MS * Math.pow(2, retryCount);
      console.log(`  [retry] Error: ${error.message}, waiting ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return callGeminiWithRetry(ai, prompt, frames, retryCount + 1);
    }

    throw err;
  }
}

// ---------------------------------------------------------------------------
// Enrichment processing
// ---------------------------------------------------------------------------

async function enrichComposition(ai: GoogleGenAI, config: CompositionConfig): Promise<boolean> {
  console.log(`\n[${"=".repeat(60)}]`);
  console.log(`[${config.id}] Type ${config.type} | Source: ${config.annotationSource}`);
  console.log(`[${"=".repeat(60)}]`);

  const outputPath = path.join(OUTPUT_DIR, `${config.id}.json`);

  // Check if already enriched
  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] Already enriched: ${outputPath}`);
    return true;
  }

  // 1. Download sample
  console.log(`  [1/4] Downloading sample...`);
  const samplePath = await findAndDownloadSample(config);
  if (!samplePath) {
    console.log(`  [FAIL] No sample available, skipping enrichment`);
    return false;
  }

  // 2. Extract frames
  const enrichConfig = config.enrichment ?? { framesPerSecond: 2, maxFrames: 20, promptFile: `scripts/gemini-prompts/type-${config.type}.txt` };
  console.log(`  [2/4] Extracting frames (${enrichConfig.framesPerSecond} fps, max ${enrichConfig.maxFrames})...`);
  const frames = extractFrames(samplePath, config.id, enrichConfig.framesPerSecond, enrichConfig.maxFrames);
  if (frames.length === 0) {
    console.log(`  [FAIL] No frames extracted, skipping`);
    return false;
  }
  console.log(`  [ok] Extracted ${frames.length} frames`);

  // 3. Load prompt template
  const promptPath = path.join(ROOT, `scripts/gemini-prompts/type-${config.type}.txt`);
  if (!fs.existsSync(promptPath)) {
    console.log(`  [FAIL] Prompt template not found: ${promptPath}`);
    return false;
  }
  const promptTemplate = fs.readFileSync(promptPath, "utf-8");
  console.log(`  [3/4] Sending ${frames.length} frames to Gemini 2.5 Flash...`);

  // 4. Call Gemini
  let rawResponse: string;
  try {
    rawResponse = await callGeminiWithRetry(ai, promptTemplate, frames);
  } catch (err) {
    console.log(`  [FAIL] Gemini API failed: ${(err as Error).message}`);
    return false;
  }

  // 5. Parse and validate
  console.log(`  [4/4] Validating response...`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    console.log(`  [FAIL] Invalid JSON from Gemini`);
    console.log(`  Response preview: ${rawResponse.slice(0, 200)}...`);
    return false;
  }

  const schema = TYPE_SCHEMAS[config.type];
  if (!schema) {
    console.log(`  [FAIL] No schema for type ${config.type}`);
    return false;
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    console.log(`  [warn] Validation failed, retrying with stricter prompt...`);

    // Retry with stricter prompt
    const stricterPrompt = promptTemplate + "\n\nIMPORTANT: Your response MUST be valid JSON matching the EXACT schema described above. Do NOT include any extra fields. Do NOT omit any required fields. Ensure all numbers are actual numbers (not strings), all booleans are true/false, and all arrays contain the correct types.";

    try {
      rawResponse = await callGeminiWithRetry(ai, stricterPrompt, frames);
      parsed = JSON.parse(rawResponse);
      const retryResult = schema.safeParse(parsed);
      if (!retryResult.success) {
        console.log(`  [FAIL] Validation failed on retry:`);
        // Log first 3 issues
        const issues = retryResult.error.issues.slice(0, 3);
        for (const issue of issues) {
          console.log(`    - ${issue.path.join(".")}: ${issue.message}`);
        }
        // Save anyway with _unvalidated suffix for debugging
        const debugPath = path.join(OUTPUT_DIR, `${config.id}_unvalidated.json`);
        fs.writeFileSync(debugPath, JSON.stringify(parsed, null, 2));
        console.log(`  [debug] Saved unvalidated response to ${debugPath}`);
        return false;
      }
      parsed = retryResult.data;
    } catch (err) {
      console.log(`  [FAIL] Retry failed: ${(err as Error).message}`);
      return false;
    }
  } else {
    parsed = result.data;
  }

  // 6. Write enrichment JSON
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const enrichment = {
    compositionId: config.id,
    type: config.type,
    annotationSource: config.annotationSource,
    generatedAt: new Date().toISOString(),
    framesAnalyzed: frames.length,
    data: parsed,
  };

  fs.writeFileSync(outputPath, JSON.stringify(enrichment, null, 2));
  console.log(`  [OK] Saved enrichment to ${outputPath}`);
  return true;
}

// ---------------------------------------------------------------------------
// Concurrency control
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processWithConcurrency(
  items: CompositionConfig[],
  limit: number,
  processor: (item: CompositionConfig) => Promise<boolean>
): Promise<{ success: number; failed: number; skipped: number }> {
  let success = 0;
  let failed = 0;
  const skipped = 0;

  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    console.log(`\n--- Batch ${Math.floor(i / limit) + 1} (${batch.length} compositions) ---`);

    const results = await Promise.all(
      batch.map(item => processor(item).catch(() => false))
    );

    for (const ok of results) {
      if (ok) success++;
      else failed++;
    }

    // Delay between batches (except last)
    if (i + limit < items.length) {
      console.log(`\n  [wait] ${BATCH_DELAY_MS}ms delay before next batch...`);
      await sleep(BATCH_DELAY_MS);
    }
  }

  return { success, failed, skipped };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Gemini Enrichment Pipeline ===\n");

  // Validate env
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("ERROR: GOOGLE_API_KEY not found in environment.");
    console.error("Add it to .env.local and ensure dotenv/config is loaded.");
    process.exit(1);
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.S3_BUCKET_NAME) {
    console.error("ERROR: AWS credentials not found. Need AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET_NAME in .env.local");
    process.exit(1);
  }

  // Ensure directories
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Check ffmpeg
  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
  } catch {
    console.error("ERROR: ffmpeg not found. Install with: brew install ffmpeg");
    process.exit(1);
  }

  // Load manifest
  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  console.log(`Loaded manifest: ${manifest.compositions.length} compositions`);

  // Filter if --composition flag
  const { compositionId } = parseArgs();
  let compositions = manifest.compositions;

  if (compositionId) {
    compositions = compositions.filter(c => c.id === compositionId);
    if (compositions.length === 0) {
      console.error(`ERROR: Composition "${compositionId}" not found in manifest.`);
      console.error(`Available IDs: ${manifest.compositions.map(c => c.id).join(", ")}`);
      process.exit(1);
    }
    console.log(`Processing single composition: ${compositionId}`);
  } else {
    console.log(`Processing all ${compositions.length} compositions`);
  }

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey });
  console.log(`Gemini client initialized (model: gemini-2.5-flash)`);
  console.log(`Concurrency: ${CONCURRENCY_LIMIT}, Batch delay: ${BATCH_DELAY_MS}ms`);
  console.log(`Output: ${OUTPUT_DIR}`);

  // Process
  const results = await processWithConcurrency(
    compositions,
    CONCURRENCY_LIMIT,
    (config) => enrichComposition(ai, config)
  );

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("=== Summary ===");
  console.log(`  Success: ${results.success}`);
  console.log(`  Failed:  ${results.failed}`);
  console.log(`  Total:   ${compositions.length}`);
  console.log("=".repeat(60));

  if (results.failed > 0) {
    console.log(`\nCheck ${MISSING_LOG} for download failures.`);
    console.log(`Check ${OUTPUT_DIR} for _unvalidated.json debug files.`);
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
