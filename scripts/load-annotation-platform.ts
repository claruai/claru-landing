/**
 * Load annotation JSONs from moonvalley-annotation-platform completed tasks
 * into video_index with 768-dim embeddings.
 *
 * Scans:
 *   video_capture/completed/{taskId}/
 *   video-capture-activities/completed/{taskId}/
 *
 * For each folder, reads the annotation JSON, extracts generalData fields,
 * constructs a caption, generates an embedding, and upserts into video_index.
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/load-annotation-platform.ts [--limit 100] [--dry-run]
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import OpenAI from "openai";
import { Readable } from "stream";

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getFlag(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const DRY_RUN = args.includes("--dry-run");
const LIMIT = getFlag("limit") ? parseInt(getFlag("limit")!, 10) : undefined;

// ---------------------------------------------------------------------------
// Env validation
// ---------------------------------------------------------------------------

const BUCKET = "moonvalley-annotation-platform";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!openaiKey) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const s3 = new S3Client({ region: process.env.AWS_REGION ?? "us-east-1" });
const openai = new OpenAI({ apiKey: openaiKey });

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Egocentric Activity Capture dataset ID — map annotations from video_capture paths
const EGOCENTRIC_DATASET_ID_CACHE: { id: string | null; loaded: boolean } = {
  id: null,
  loaded: false,
};

const ANNOTATION_PREFIXES = [
  "video_capture/completed/",
  "video-capture-activities/completed/",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 768,
  });
  return response.data[0].embedding;
}

async function streamToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf-8");
}

async function getEgocentricDatasetId(): Promise<string | null> {
  if (EGOCENTRIC_DATASET_ID_CACHE.loaded) return EGOCENTRIC_DATASET_ID_CACHE.id;

  const { data } = await supabase
    .from("datasets")
    .select("id")
    .ilike("name", "%egocentric%activity%")
    .limit(1)
    .single();

  EGOCENTRIC_DATASET_ID_CACHE.id = data?.id ?? null;
  EGOCENTRIC_DATASET_ID_CACHE.loaded = true;
  return EGOCENTRIC_DATASET_ID_CACHE.id;
}

interface AnnotationData {
  generalData?: {
    mainCategory?: string;
    subcategory?: string;
    environment?: string;
    activity?: string;
    description?: string;
    [key: string]: unknown;
  };
  task_description?: string;
  [key: string]: unknown;
}

function buildCaptionFromAnnotation(annotation: AnnotationData): string {
  const parts: string[] = [];

  const gd = annotation.generalData;
  if (gd) {
    if (gd.description) parts.push(gd.description);
    if (gd.activity) parts.push(`Activity: ${gd.activity}`);
    if (gd.subcategory) parts.push(`Subcategory: ${gd.subcategory}`);
    if (gd.mainCategory) parts.push(`Category: ${gd.mainCategory}`);
    if (gd.environment) parts.push(`Environment: ${gd.environment}`);
  }

  if (annotation.task_description) {
    parts.push(annotation.task_description);
  }

  return parts.join(". ").slice(0, 1000);
}

/**
 * List all "folders" (common prefixes) under a given prefix using pagination.
 * Returns the folder keys (e.g., "video_capture/completed/abc123/").
 */
async function listFolders(prefix: string): Promise<string[]> {
  const folders: string[] = [];
  let continuationToken: string | undefined;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      Delimiter: "/",
      MaxKeys: 1000,
      ContinuationToken: continuationToken,
    });
    const resp = await s3.send(cmd);
    for (const cp of resp.CommonPrefixes ?? []) {
      if (cp.Prefix) folders.push(cp.Prefix);
    }
    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (continuationToken);

  return folders;
}

/**
 * List all objects in a folder.
 */
async function listObjects(prefix: string): Promise<string[]> {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      MaxKeys: 1000,
      ContinuationToken: continuationToken,
    });
    const resp = await s3.send(cmd);
    for (const obj of resp.Contents ?? []) {
      if (obj.Key) keys.push(obj.Key);
    }
    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

async function fetchJson(key: string): Promise<unknown | null> {
  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const resp = await s3.send(cmd);
    const text = await streamToString(resp.Body as Readable);
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`[load-annotations] bucket=${BUCKET} limit=${LIMIT ?? "all"} dry_run=${DRY_RUN}`);

  const egoDatasetId = await getEgocentricDatasetId();
  console.log(`[load-annotations] Egocentric dataset ID: ${egoDatasetId ?? "not found"}`);

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const annotPrefix of ANNOTATION_PREFIXES) {
    if (LIMIT && totalInserted >= LIMIT) break;

    console.log(`[load-annotations] Listing folders under ${annotPrefix}...`);
    const folders = await listFolders(annotPrefix);
    console.log(`  Found ${folders.length} completed task folders`);

    // Process in batches of 20
    const toProcess = LIMIT
      ? folders.slice(0, Math.min(folders.length, LIMIT - totalInserted))
      : folders;

    for (let i = 0; i < toProcess.length; i += 20) {
      if (LIMIT && totalInserted >= LIMIT) break;

      const batch = toProcess.slice(i, i + 20);
      const batchRows: Array<{
        s3_bucket: string;
        s3_key: string;
        caption_text: string;
        embedding: string;
        enrichment_source: string;
        dataset_id: string | null;
      }> = [];

      for (const folder of batch) {
        // List files in the folder
        const files = await listObjects(folder);

        // Find the video file (s3_key for video_index)
        const videoFile = files.find((f) =>
          /\.(mp4|mov|avi|mkv|webm)$/i.test(f)
        );

        // Find the annotation JSON (non-video file)
        const jsonFile = files.find(
          (f) => f.endsWith(".json") && !f.includes("metadata")
        );

        if (!videoFile) {
          totalSkipped++;
          continue;
        }

        if (DRY_RUN) {
          console.log(`  [dry-run] ${videoFile.slice(0, 70)} json=${jsonFile?.slice(0, 50) ?? "none"}`);
          totalInserted++;
          continue;
        }

        // Parse annotation JSON
        let caption = "";
        if (jsonFile) {
          const annotation = (await fetchJson(jsonFile)) as AnnotationData | null;
          if (annotation) {
            caption = buildCaptionFromAnnotation(annotation);
          }
        }

        if (!caption) {
          // Fall back to folder name as minimal caption
          const folderName = folder.split("/").filter(Boolean).pop() ?? "";
          caption = `Video capture task: ${folderName}`;
        }

        try {
          const embedding = await generateEmbedding(caption);

          // Map dataset_id for egocentric activity paths
          const datasetId =
            annotPrefix.includes("video_capture") && egoDatasetId
              ? egoDatasetId
              : null;

          batchRows.push({
            s3_bucket: BUCKET,
            s3_key: videoFile,
            caption_text: caption,
            embedding: JSON.stringify(embedding),
            enrichment_source: "annotation_json",
            dataset_id: datasetId,
          });
        } catch (err) {
          console.error(
            `  [error] embedding failed for ${videoFile}:`,
            err instanceof Error ? err.message : err
          );
          totalFailed++;
        }
      }

      if (DRY_RUN || batchRows.length === 0) continue;

      // Upsert batch
      const { error } = await supabase.from("video_index").upsert(batchRows, {
        onConflict: "s3_bucket,s3_key",
        ignoreDuplicates: true,
      });

      if (error) {
        console.error(`  [error] batch upsert failed: ${error.message}`);
        totalFailed += batchRows.length;
      } else {
        totalInserted += batchRows.length;
      }

      if (totalInserted % 100 < 20 && totalInserted > 0) {
        console.log(
          `  [progress] ${totalInserted} inserted, ${totalSkipped} skipped, ${totalFailed} failed`
        );
      }
    }
  }

  console.log(
    `\n[load-annotations] Done. Inserted ${totalInserted} / skipped ${totalSkipped} / failed ${totalFailed}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
