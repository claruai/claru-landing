/**
 * Extract real annotation data from S3 for Remotion compositions.
 *
 * Reads composition-manifest.json, filters to annotationSource === "real" (13 compositions),
 * queries Supabase for each sample's s3_annotation_key, downloads the annotation JSON from S3,
 * extracts relevant fields per composition type, validates against Zod schemas, and writes
 * formatted JSON to public/remotion-assets/annotations/{id}.json.
 *
 * Also downloads actual media files (video/image) to public/remotion-assets/samples/{id}.{ext}.
 *
 * Run with:
 *   npx tsx scripts/extract-annotations.ts
 *   npx tsx scripts/extract-annotations.ts --composition cs-vid-quality
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";

// Load .env.local (Next.js convention) — must come before any env var reads
config({ path: path.resolve(__dirname, "../.env.local") });
import { createClient } from "@supabase/supabase-js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { compositionId: string | null } {
  const args = process.argv.slice(2);
  let compositionId: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--composition" && args[i + 1]) {
      compositionId = args[i + 1];
      i++;
    }
  }

  return { compositionId };
}

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

function validateEnv() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "S3_BUCKET_NAME",
  ];

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(", ")}`);
    console.error("Ensure .env.local is present with these variables.");
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Clients (no path aliases -- tsx runs outside Next.js)
// ---------------------------------------------------------------------------

function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function createS3() {
  return new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

async function getPresignedUrl(
  s3: S3Client,
  objectKey: string
): Promise<string | null> {
  // Strip s3://bucket-name/ prefix if present
  let cleanKey = objectKey;
  const s3UriMatch = cleanKey.match(/^s3:\/\/[^/]+\/(.+)$/);
  if (s3UriMatch) {
    cleanKey = s3UriMatch[1];
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: cleanKey,
    });
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  } catch (error) {
    console.error(
      `  [s3] Failed to generate presigned URL for: ${objectKey}`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

async function fetchS3Json(
  s3: S3Client,
  objectKey: string
): Promise<Record<string, unknown> | null> {
  const url = await getPresignedUrl(s3, objectKey);
  if (!url) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) {
      console.warn(`  [s3] HTTP ${resp.status} fetching annotation: ${objectKey}`);
      return null;
    }
    const json: unknown = await resp.json();
    if (json === null || typeof json !== "object" || Array.isArray(json)) {
      console.warn(`  [s3] Unexpected JSON shape for: ${objectKey}`);
      return null;
    }
    return json as Record<string, unknown>;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn(`  [s3] Timeout fetching: ${objectKey}`);
    } else {
      console.warn(
        `  [s3] Fetch error:`,
        error instanceof Error ? error.message : error
      );
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function downloadS3File(
  s3: S3Client,
  objectKey: string,
  destPath: string
): Promise<boolean> {
  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    if (stat.size > 0) {
      console.log(`  [skip] Already downloaded: ${path.basename(destPath)}`);
      return true;
    }
  }

  const url = await getPresignedUrl(s3, objectKey);
  if (!url) return false;

  const controller = new AbortController();
  // 5 minute timeout for large video files
  const timeout = setTimeout(() => controller.abort(), 300_000);

  try {
    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) {
      console.warn(`  [s3] HTTP ${resp.status} downloading media: ${objectKey}`);
      return false;
    }

    const buffer = Buffer.from(await resp.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
    console.log(`  [download] ${path.basename(destPath)} (${sizeMB} MB)`);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn(`  [s3] Timeout downloading: ${objectKey}`);
    } else {
      console.warn(
        `  [s3] Download error:`,
        error instanceof Error ? error.message : error
      );
    }
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Manifest types
// ---------------------------------------------------------------------------

interface ManifestSample {
  datasetId: string;
  datasetSlug: string;
}

interface ManifestComposition {
  id: string;
  type: number;
  page: { route: string; placement: string };
  samples: ManifestSample[];
  annotationSource: string;
  enrichment: unknown;
  render: { durationFrames: number; fps: number; width: number; height: number; codec: string };
}

interface Manifest {
  compositions: ManifestComposition[];
}

// ---------------------------------------------------------------------------
// Per-type Zod schemas
// ---------------------------------------------------------------------------

const Type2AnnotationSchema = z.object({
  type: z.literal(2),
  compositionId: z.string(),
  winner: z.string().nullable(),
  selectedAnswer: z.string().nullable().optional(),
  bestVideo: z.string().nullable().optional(),
  promptText: z.string().nullable(),
  videoAUrl: z.string().nullable(),
  videoBUrl: z.string().nullable(),
  configKey: z.string().nullable().optional(),
  categoryLabel: z.string().nullable().optional(),
  videoBelongsToCategory: z.boolean().nullable().optional(),
  video1EndedAt: z.number().nullable().optional(),
  video2EndedAt: z.number().nullable().optional(),
  projectType: z.string().nullable().optional(),
});

const Type3AnnotationSchema = z.object({
  type: z.literal(3),
  compositionId: z.string(),
  bestImage: z.string().nullable(),
  selectedImages: z.array(z.string()),
  hasGoodQuality: z.string().nullable(),
  prompt: z.string().nullable(),
  generations: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
    })
  ),
  projectType: z.string().nullable().optional(),
});

const Type4AnnotationSchema = z.object({
  type: z.literal(4),
  compositionId: z.string(),
  // Object/Face Identity fields
  segments: z
    .array(
      z.object({
        bbox: z.array(z.number()),
        class: z.string(),
        score: z.number(),
        frameIndex: z.number().nullable().optional(),
        segmentId: z.string().nullable().optional(),
        thumbnailKey: z.string().nullable().optional(),
      })
    )
    .optional(),
  identityMatches: z.record(z.string(), z.string()).optional(),
  // Product Image fields
  brandName: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  subcategory: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  longCaption: z.string().nullable().optional(),
  bbox: z
    .object({
      x1: z.number(),
      y1: z.number(),
      x2: z.number(),
      y2: z.number(),
    })
    .nullable()
    .optional(),
  projectType: z.string().nullable().optional(),
});

const Type5AnnotationSchema = z.object({
  type: z.literal(5),
  compositionId: z.string(),
  category: z.string().nullable(),
  subcategory: z.string().nullable(),
  selectedGame: z.string().nullable().optional(),
  concept: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  // Metadata-level taxonomy (dual classification)
  metaCategory: z.string().nullable().optional(),
  metaSubcategory: z.string().nullable().optional(),
  templateCategories: z.array(z.string()).optional(),
  projectType: z.string().nullable().optional(),
  section: z.string().nullable().optional(),
});

const Type6AnnotationSchema = z.object({
  type: z.literal(6),
  compositionId: z.string(),
  isCinematic: z.string().nullable(),
  hasGoodMotion: z.string().nullable(),
  isHighQuality: z.string().nullable(),
  isVideoInteresting: z.string().nullable(),
  hasGoodTextAlignment: z.string().nullable(),
  videoDescription: z.string().nullable(),
  // Numeric scores mapped from string values
  scores: z.object({
    cinematic: z.number(),
    motion: z.number(),
    quality: z.number(),
    interest: z.number(),
    textAlignment: z.number(),
  }),
  projectType: z.string().nullable().optional(),
});

const Type7AnnotationSchema = z.object({
  type: z.literal(7),
  compositionId: z.string(),
  textPolicyViolation: z.string().nullable(),
  videoPolicyViolation: z.string().nullable(),
  promptText: z.string().nullable(),
  projectType: z.string().nullable().optional(),
  // EU AI Act reference (for sol-eu-ai-act)
  policyReferences: z.array(z.string()).optional(),
});

// ---------------------------------------------------------------------------
// Per-type extraction logic
// ---------------------------------------------------------------------------

function safeGet(obj: Record<string, unknown>, ...paths: string[]): unknown {
  for (const dotPath of paths) {
    const keys = dotPath.split(".");
    let current: unknown = obj;
    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== "object") {
        current = undefined;
        break;
      }
      current = (current as Record<string, unknown>)[key];
    }
    if (current !== undefined) return current;
  }
  return undefined;
}

function extractType2(
  compositionId: string,
  raw: Record<string, unknown>
): z.input<typeof Type2AnnotationSchema> {
  const generalData = (raw.generalData ?? {}) as Record<string, unknown>;
  const metadata = (raw.metadata ?? {}) as Record<string, unknown>;
  const project = (raw.project ?? {}) as Record<string, unknown>;

  // Different pairwise datasets store the winner in different fields
  const betterVideoId = generalData.betterVideoId as string | undefined;
  const selectedAnswer = generalData.selectedAnswer as string | undefined;
  const bestVideo = generalData.bestVideo as string | undefined;

  // Determine winner label
  const winner = betterVideoId ?? selectedAnswer ?? bestVideo ?? null;

  // Video URLs — some datasets use metadata.video_1/video_2, others have them nested
  let videoAUrl: string | null = null;
  let videoBUrl: string | null = null;

  if (metadata.video_1 && typeof metadata.video_1 === "string") {
    videoAUrl = metadata.video_1;
  } else if (metadata.video_1 && typeof metadata.video_1 === "object") {
    const v1 = metadata.video_1 as Record<string, unknown>;
    videoAUrl = (v1.url ?? v1.s3_url ?? v1.category ?? null) as string | null;
  }

  if (metadata.video_2 && typeof metadata.video_2 === "string") {
    videoBUrl = metadata.video_2;
  } else if (metadata.video_2 && typeof metadata.video_2 === "object") {
    const v2 = metadata.video_2 as Record<string, unknown>;
    videoBUrl = (v2.url ?? v2.s3_url ?? v2.category ?? null) as string | null;
  }

  return {
    type: 2 as const,
    compositionId,
    winner,
    selectedAnswer: selectedAnswer ?? null,
    bestVideo: (bestVideo as string) ?? null,
    promptText: (metadata.prompt_text as string) ?? null,
    videoAUrl,
    videoBUrl,
    configKey: (metadata.key as string) ?? null,
    categoryLabel:
      ((safeGet(metadata, "video_1.category") ??
        safeGet(metadata, "video_2.category")) as string) ?? null,
    videoBelongsToCategory:
      generalData.videoBelongsToCategory === true ||
      generalData.videoBelongsToCategory === "true"
        ? true
        : generalData.videoBelongsToCategory === false ||
            generalData.videoBelongsToCategory === "false"
          ? false
          : null,
    video1EndedAt: (generalData.video1EndedAt as number) ?? null,
    video2EndedAt: (generalData.video2EndedAt as number) ?? null,
    projectType: (project.type as string) ?? null,
  };
}

function extractType3(
  compositionId: string,
  raw: Record<string, unknown>
): z.input<typeof Type3AnnotationSchema> {
  const generalData = (raw.generalData ?? {}) as Record<string, unknown>;
  const metadata = (raw.metadata ?? {}) as Record<string, unknown>;
  const project = (raw.project ?? {}) as Record<string, unknown>;

  // Extract generations array
  const rawGenerations = (metadata.generations ?? []) as Array<Record<string, unknown>>;
  const generations = rawGenerations.map((g) => ({
    id: (g.id ?? g.generation_id ?? "") as string,
    url: (g.url ?? g.s3_url ?? g.image_url ?? "") as string,
  }));

  // selectedImages can be an array of IDs or an object
  let selectedImages: string[] = [];
  if (Array.isArray(generalData.selectedImages)) {
    selectedImages = generalData.selectedImages as string[];
  } else if (
    generalData.selectedImages &&
    typeof generalData.selectedImages === "object"
  ) {
    selectedImages = Object.keys(
      generalData.selectedImages as Record<string, unknown>
    );
  }

  return {
    type: 3 as const,
    compositionId,
    bestImage: (generalData.bestImage as string) ?? null,
    selectedImages,
    hasGoodQuality: (generalData.hasGoodQuality as string) ?? null,
    prompt: (metadata.prompt as string) ?? null,
    generations,
    projectType: (project.type as string) ?? null,
  };
}

function extractType4(
  compositionId: string,
  raw: Record<string, unknown>
): z.input<typeof Type4AnnotationSchema> {
  const generalData = (raw.generalData ?? {}) as Record<string, unknown>;
  const metadata = (raw.metadata ?? {}) as Record<string, unknown>;
  const project = (raw.project ?? {}) as Record<string, unknown>;
  const files = (raw.files ?? []) as Array<Record<string, unknown>>;

  // Object Identity: segments with bboxes
  const rawSegments = (metadata.segment ?? metadata.segments ?? []) as Array<
    Record<string, unknown>
  >;
  const segments =
    rawSegments.length > 0
      ? rawSegments.map((seg) => ({
          bbox: (seg.bbox ?? []) as number[],
          class: (seg.class ?? "unknown") as string,
          score: (seg.score ?? 0) as number,
          frameIndex: (seg.frame_index as number) ?? null,
          segmentId: (seg.segment_id as string) ?? null,
          thumbnailKey: (seg.thumbnail as string) ?? null,
        }))
      : undefined;

  // Identity match verdicts from generalData (segment1_image1: "yes", etc.)
  const identityMatches: Record<string, string> = {};
  for (const [key, value] of Object.entries(generalData)) {
    if (key.startsWith("segment") && typeof value === "string") {
      identityMatches[key] = value;
    }
  }

  // Product Image: bbox from files[1].metadata
  let lifestyleBbox: { x1: number; y1: number; x2: number; y2: number } | null =
    null;
  let caption: string | null = null;
  let longCaption: string | null = null;

  if (files.length > 0) {
    // First file often has the caption
    const file0 = files[0] as Record<string, unknown>;
    caption = (file0.caption as string) ?? null;
    const file0Meta = (file0.metadata ?? {}) as Record<string, unknown>;
    longCaption = (file0Meta.longCaption as string) ?? null;
  }
  if (files.length > 1) {
    const file1 = files[1] as Record<string, unknown>;
    const file1Meta = (file1.metadata ?? {}) as Record<string, unknown>;
    if (file1Meta.x1 !== undefined) {
      lifestyleBbox = {
        x1: file1Meta.x1 as number,
        y1: file1Meta.y1 as number,
        x2: file1Meta.x2 as number,
        y2: file1Meta.y2 as number,
      };
    }
  }

  return {
    type: 4 as const,
    compositionId,
    segments: segments && segments.length > 0 ? segments : undefined,
    identityMatches:
      Object.keys(identityMatches).length > 0 ? identityMatches : undefined,
    brandName: (generalData.brandName as string) ?? null,
    category: (generalData.category as string) ?? null,
    subcategory: (generalData.subcategory as string) ?? null,
    caption,
    longCaption,
    bbox: lifestyleBbox,
    projectType: (project.type as string) ?? null,
  };
}

function extractType5(
  compositionId: string,
  raw: Record<string, unknown>
): z.input<typeof Type5AnnotationSchema> {
  const generalData = (raw.generalData ?? {}) as Record<string, unknown>;
  const metadata = (raw.metadata ?? {}) as Record<string, unknown>;
  const project = (raw.project ?? {}) as Record<string, unknown>;

  // Template categories catalog from project.templateData.categories
  let templateCategories: string[] | undefined;
  const templateData = (project.templateData ?? {}) as Record<string, unknown>;
  if (Array.isArray(templateData.categories)) {
    templateCategories = (templateData.categories as Array<Record<string, unknown>>).map(
      (c) => (c.name ?? c.title ?? c.label ?? String(c)) as string
    );
  }

  return {
    type: 5 as const,
    compositionId,
    category: (generalData.category as string) ?? null,
    subcategory: (generalData.subcategory as string) ?? null,
    selectedGame: (generalData.selectedGame as string) ?? null,
    concept: (metadata.concept as string) ?? null,
    caption: (metadata.caption as string) ?? null,
    metaCategory: (metadata.category as string) ?? null,
    metaSubcategory: (metadata.subcategory as string) ?? null,
    templateCategories,
    projectType: (project.type as string) ?? null,
    section: (generalData.section ?? (raw as Record<string, unknown>).section) as string ?? null,
  };
}

/** Map quality rubric string values to numeric scores (0-1). */
function mapQualityScore(value: string | null): number {
  if (!value) return 0.5;
  const lower = value.toLowerCase();
  // Positive patterns
  if (lower.includes("good") || lower === "high-quality" || lower === "cinematic" || lower === "interesting") return 0.8;
  // Negative patterns
  if (lower.includes("not-cinematic") || lower.includes("not-high")) return 0.2;
  if (lower.includes("not-")) return 0.3;
  if (lower === "interesting") return 0.7;
  if (lower === "not-interesting") return 0.3;
  // Default
  return 0.5;
}

function extractType6(
  compositionId: string,
  raw: Record<string, unknown>
): z.input<typeof Type6AnnotationSchema> {
  const generalData = (raw.generalData ?? {}) as Record<string, unknown>;
  const metadata = (raw.metadata ?? {}) as Record<string, unknown>;
  const project = (raw.project ?? {}) as Record<string, unknown>;

  const isCinematic = (generalData.isCinematic as string) ?? null;
  const hasGoodMotion = (generalData.hasGoodMotion as string) ?? null;
  const isHighQuality = (generalData.isHighQuality as string) ?? null;
  const isVideoInteresting = (generalData.isVideoInteresting as string) ?? null;
  const hasGoodTextAlignment = (generalData.hasGoodTextAlignment as string) ?? null;

  return {
    type: 6 as const,
    compositionId,
    isCinematic,
    hasGoodMotion,
    isHighQuality,
    isVideoInteresting,
    hasGoodTextAlignment,
    videoDescription: (metadata.video_description as string) ?? null,
    scores: {
      cinematic: mapQualityScore(isCinematic),
      motion: mapQualityScore(hasGoodMotion),
      quality: mapQualityScore(isHighQuality),
      interest: mapQualityScore(isVideoInteresting),
      textAlignment: mapQualityScore(hasGoodTextAlignment),
    },
    projectType: (project.type as string) ?? null,
  };
}

function extractType7(
  compositionId: string,
  raw: Record<string, unknown>
): z.input<typeof Type7AnnotationSchema> {
  const generalData = (raw.generalData ?? {}) as Record<string, unknown>;
  const metadata = (raw.metadata ?? {}) as Record<string, unknown>;
  const project = (raw.project ?? {}) as Record<string, unknown>;

  // EU AI Act policy references for sol-eu-ai-act
  const policyReferences =
    compositionId === "sol-eu-ai-act"
      ? ["EU AI Act Art.52", "Art.6 High-Risk Systems"]
      : undefined;

  return {
    type: 7 as const,
    compositionId,
    textPolicyViolation: (generalData.text_policy_violation as string) ?? null,
    videoPolicyViolation: (generalData.video_policy_violation as string) ?? null,
    promptText: (metadata.prompt as string) ?? null,
    projectType: (project.type as string) ?? null,
    policyReferences,
  };
}

function extractAnnotation(
  compositionId: string,
  type: number,
  raw: Record<string, unknown>
): unknown {
  switch (type) {
    case 2:
      return extractType2(compositionId, raw);
    case 3:
      return extractType3(compositionId, raw);
    case 4:
      return extractType4(compositionId, raw);
    case 5:
      return extractType5(compositionId, raw);
    case 6:
      return extractType6(compositionId, raw);
    case 7:
      return extractType7(compositionId, raw);
    default:
      console.warn(`  [warn] No extraction logic for type ${type}`);
      return null;
  }
}

function validateAnnotation(
  type: number,
  data: unknown
): { success: boolean; error?: string } {
  const schemas: Record<number, z.ZodType> = {
    2: Type2AnnotationSchema,
    3: Type3AnnotationSchema,
    4: Type4AnnotationSchema,
    5: Type5AnnotationSchema,
    6: Type6AnnotationSchema,
    7: Type7AnnotationSchema,
  };

  const schema = schemas[type];
  if (!schema) return { success: false, error: `No schema for type ${type}` };

  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: JSON.stringify(result.error.format(), null, 2),
    };
  }
  return { success: true };
}

// ---------------------------------------------------------------------------
// Supabase query: get sample with annotation key for a dataset
// ---------------------------------------------------------------------------

async function findSampleWithAnnotation(
  supabase: ReturnType<typeof createSupabaseClient>,
  datasetSlug: string
): Promise<{
  sampleId: string;
  s3AnnotationKey: string;
  s3ObjectKey: string;
  mimeType: string;
} | null> {
  // First resolve the dataset ID from slug
  const { data: dataset, error: dsError } = await supabase
    .from("datasets")
    .select("id")
    .eq("slug", datasetSlug)
    .single();

  if (dsError || !dataset) {
    console.warn(`  [supabase] Dataset not found for slug: ${datasetSlug}`);
    return null;
  }

  const datasetId = (dataset as Record<string, unknown>).id as string;

  // Query samples that have an annotation key, limit to a few to try
  const { data: samples, error: samplesError } = await supabase
    .from("dataset_samples")
    .select("id, s3_annotation_key, s3_object_key, mime_type")
    .eq("dataset_id", datasetId)
    .not("s3_annotation_key", "is", null)
    .limit(5);

  if (samplesError || !samples || samples.length === 0) {
    console.warn(
      `  [supabase] No samples with annotation key for dataset: ${datasetSlug}`
    );
    return null;
  }

  // Return the first sample that has a valid annotation key
  const rows = samples as Array<Record<string, unknown>>;
  for (const sample of rows) {
    if (sample.s3_annotation_key) {
      return {
        sampleId: sample.id as string,
        s3AnnotationKey: sample.s3_annotation_key as string,
        s3ObjectKey: (sample.s3_object_key as string) ?? "",
        mimeType: (sample.mime_type as string) ?? "video/mp4",
      };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Determine media file extension from mime type or S3 key
// ---------------------------------------------------------------------------

function mediaExtension(mimeType: string, s3Key: string): string {
  if (mimeType.includes("image/png") || s3Key.endsWith(".png")) return ".png";
  if (mimeType.includes("image/jpeg") || s3Key.endsWith(".jpg") || s3Key.endsWith(".jpeg"))
    return ".jpg";
  if (mimeType.includes("image/webp") || s3Key.endsWith(".webp")) return ".webp";
  if (s3Key.endsWith(".mov")) return ".mov";
  // Default to mp4 for video
  return ".mp4";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Annotation Data Extraction for Remotion ===\n");

  validateEnv();
  const { compositionId: filterComposition } = parseArgs();

  // Read manifest
  const manifestPath = path.resolve(__dirname, "composition-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(1);
  }

  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  // Filter to real annotation sources
  let compositions = manifest.compositions.filter(
    (c) => c.annotationSource === "real"
  );

  if (filterComposition) {
    compositions = compositions.filter((c) => c.id === filterComposition);
    if (compositions.length === 0) {
      console.error(
        `Composition "${filterComposition}" not found or does not have annotationSource: "real"`
      );
      console.error(
        "Available real compositions:",
        manifest.compositions
          .filter((c) => c.annotationSource === "real")
          .map((c) => c.id)
          .join(", ")
      );
      process.exit(1);
    }
  }

  console.log(
    `Found ${compositions.length} composition(s) with annotationSource: "real"\n`
  );

  // Ensure output directories
  const annotationsDir = path.resolve(
    __dirname,
    "../public/remotion-assets/annotations"
  );
  const samplesDir = path.resolve(
    __dirname,
    "../public/remotion-assets/samples"
  );
  fs.mkdirSync(annotationsDir, { recursive: true });
  fs.mkdirSync(samplesDir, { recursive: true });

  const supabase = createSupabaseClient();
  const s3 = createS3();

  let successCount = 0;
  let failCount = 0;
  const results: Array<{ id: string; status: string; error?: string }> = [];

  for (const comp of compositions) {
    console.log(`[${comp.id}] Type ${comp.type} — ${comp.page.route}`);

    // Try each sample source until we get annotation data
    let annotationJson: Record<string, unknown> | null = null;
    let sampleS3Key: string | null = null;
    let sampleMimeType = "video/mp4";

    for (const sample of comp.samples) {
      console.log(`  Trying dataset: ${sample.datasetSlug}`);

      const found = await findSampleWithAnnotation(supabase, sample.datasetSlug);
      if (!found) {
        console.warn(`  [skip] No annotated sample found for ${sample.datasetSlug}`);
        continue;
      }

      console.log(`  Found sample ${found.sampleId} with annotation key`);

      // Download annotation JSON from S3
      annotationJson = await fetchS3Json(s3, found.s3AnnotationKey);
      if (annotationJson) {
        sampleS3Key = found.s3ObjectKey;
        sampleMimeType = found.mimeType;
        break;
      }

      console.warn(`  [retry] Annotation fetch failed, trying next sample...`);
    }

    if (!annotationJson) {
      console.error(`  [FAIL] Could not fetch annotation data for ${comp.id}`);
      failCount++;
      results.push({ id: comp.id, status: "FAIL", error: "No annotation data found" });
      console.log();
      continue;
    }

    // Extract fields per type
    const extracted = extractAnnotation(comp.id, comp.type, annotationJson);
    if (!extracted) {
      console.error(`  [FAIL] Extraction returned null for ${comp.id}`);
      failCount++;
      results.push({ id: comp.id, status: "FAIL", error: "Extraction returned null" });
      console.log();
      continue;
    }

    // Validate against Zod schema
    const validation = validateAnnotation(comp.type, extracted);
    if (!validation.success) {
      console.error(`  [FAIL] Validation failed for ${comp.id}:`);
      console.error(`  ${validation.error}`);
      failCount++;
      results.push({
        id: comp.id,
        status: "FAIL",
        error: `Validation: ${validation.error}`,
      });
      console.log();
      continue;
    }

    // Write annotation JSON
    const annotationOutPath = path.join(annotationsDir, `${comp.id}.json`);
    fs.writeFileSync(annotationOutPath, JSON.stringify(extracted, null, 2) + "\n");
    console.log(`  [write] annotations/${comp.id}.json`);

    // Download media sample
    if (sampleS3Key) {
      const ext = mediaExtension(sampleMimeType, sampleS3Key);
      const mediaOutPath = path.join(samplesDir, `${comp.id}${ext}`);
      const downloaded = await downloadS3File(s3, sampleS3Key, mediaOutPath);
      if (!downloaded) {
        console.warn(`  [warn] Media download failed for ${comp.id} (annotation OK)`);
      }
    }

    successCount++;
    results.push({ id: comp.id, status: "OK" });
    console.log();
  }

  // Summary
  console.log("=== Summary ===");
  console.log(
    `Extracted: ${successCount}/${compositions.length} | Failed: ${failCount}/${compositions.length}\n`
  );

  for (const r of results) {
    const icon = r.status === "OK" ? "OK" : "FAIL";
    console.log(`  [${icon}] ${r.id}${r.error ? ` — ${r.error}` : ""}`);
  }

  if (failCount > 0) {
    console.log(
      `\n${failCount} composition(s) failed. Check logs above for details.`
    );
    process.exit(1);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
