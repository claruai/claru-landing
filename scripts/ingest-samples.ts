/**
 * Bulk ingest samples into a dataset from a JSON file.
 *
 * Run with:
 *   npx tsx scripts/ingest-samples.ts --dataset <slug> --file <path>
 *
 * Supports two JSON formats:
 *
 * 1. Simple format:
 *    [{ "media_url": "https://...", "metadata": { ... } }]
 *
 * 2. Notion-style format:
 *    [{ "type": "short_form", "category": "Object Manipulation",
 *       "subcategory": "Twist", "annotation_id": "00356662...",
 *       "file_url": "https://s3.../video.mov", "metadata": { ... } }]
 *    Maps file_url -> media_url, merges type/category/subcategory/annotation_id
 *    into metadata_json.
 *
 * Idempotent: skips samples whose media_url already exists for the dataset.
 * Batch inserts in chunks of 100.
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { datasetSlug: string; filePath: string } {
  const args = process.argv.slice(2);
  let datasetSlug = "";
  let filePath = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dataset" && args[i + 1]) {
      datasetSlug = args[i + 1];
      i++;
    } else if (args[i] === "--file" && args[i + 1]) {
      filePath = args[i + 1];
      i++;
    }
  }

  if (!datasetSlug || !filePath) {
    console.error(
      "Usage: npx tsx scripts/ingest-samples.ts --dataset <slug> --file <path>"
    );
    process.exit(1);
  }

  return { datasetSlug, filePath };
}

// ---------------------------------------------------------------------------
// Admin client (mirrors src/lib/supabase/admin.ts but avoids path alias issues
// when running via tsx outside of Next.js)
// ---------------------------------------------------------------------------

function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
    process.exit(1);
  }

  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// Types for input formats
// ---------------------------------------------------------------------------

interface SimpleSample {
  media_url: string;
  metadata?: Record<string, unknown>;
}

interface NotionStyleSample {
  type?: string;
  category?: string;
  subcategory?: string;
  annotation_id?: string;
  file_url: string;
  metadata?: Record<string, unknown>;
}

type InputSample = SimpleSample | NotionStyleSample;

interface NormalizedSample {
  media_url: string;
  metadata_json: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Format detection and normalization
// ---------------------------------------------------------------------------

function isNotionStyle(sample: InputSample): sample is NotionStyleSample {
  return "file_url" in sample && typeof (sample as NotionStyleSample).file_url === "string";
}

function normalizeSample(sample: InputSample): NormalizedSample {
  if (isNotionStyle(sample)) {
    const metadata: Record<string, unknown> = { ...(sample.metadata ?? {}) };

    // Merge Notion-specific fields into metadata_json
    if (sample.type !== undefined) metadata.type = sample.type;
    if (sample.category !== undefined) metadata.category = sample.category;
    if (sample.subcategory !== undefined) metadata.subcategory = sample.subcategory;
    if (sample.annotation_id !== undefined) metadata.annotation_id = sample.annotation_id;

    return {
      media_url: sample.file_url,
      metadata_json: metadata,
    };
  }

  // Simple format
  const simple = sample as SimpleSample;
  return {
    media_url: simple.media_url,
    metadata_json: simple.metadata ?? {},
  };
}

/** Best-effort MIME type guess from a URL extension. */
function guessMimeType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return (ext && map[ext]) || "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { datasetSlug, filePath } = parseArgs();
  const supabase = createSupabaseAdminClient();

  // -- Resolve and read the JSON file --
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(resolvedPath, "utf-8");
  let rawSamples: InputSample[];
  try {
    rawSamples = JSON.parse(fileContent);
  } catch {
    console.error("Failed to parse JSON file. Ensure it contains a valid JSON array.");
    process.exit(1);
  }

  if (!Array.isArray(rawSamples)) {
    console.error("JSON file must contain an array of sample objects.");
    process.exit(1);
  }

  console.log(`Read ${rawSamples.length} samples from ${resolvedPath}`);

  // -- Look up dataset by slug --
  const { data: dataset, error: datasetError } = await supabase
    .from("datasets")
    .select("id, name, slug")
    .eq("slug", datasetSlug)
    .single();

  if (datasetError || !dataset) {
    console.error(
      `Dataset with slug "${datasetSlug}" not found.`,
      datasetError?.message ?? ""
    );
    process.exit(1);
  }

  const datasetId: string = dataset.id;
  console.log(`Dataset: "${dataset.name}" (${datasetId})\n`);

  // -- Normalize all samples --
  const normalized: NormalizedSample[] = rawSamples.map(normalizeSample);

  // -- Fetch existing media_urls for this dataset (idempotency check) --
  const { data: existingRows, error: existingError } = await supabase
    .from("dataset_samples")
    .select("media_url")
    .eq("dataset_id", datasetId);

  if (existingError) {
    console.error("Failed to query existing samples:", existingError.message);
    process.exit(1);
  }

  const existingUrls = new Set((existingRows ?? []).map((r) => r.media_url));

  // -- Filter out duplicates --
  const toInsert: NormalizedSample[] = [];
  let skippedCount = 0;

  for (const sample of normalized) {
    if (existingUrls.has(sample.media_url)) {
      skippedCount++;
    } else {
      toInsert.push(sample);
    }
  }

  console.log(
    `Samples to insert: ${toInsert.length} (${skippedCount} skipped as duplicates)`
  );

  if (toInsert.length === 0) {
    console.log("\nNothing to insert. Done.");
    return;
  }

  // -- Batch insert in chunks of 100 --
  const CHUNK_SIZE = 100;
  let insertedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < toInsert.length; i += CHUNK_SIZE) {
    const chunk = toInsert.slice(i, i + CHUNK_SIZE);
    const chunkEnd = Math.min(i + CHUNK_SIZE, toInsert.length);

    const rows = chunk.map((sample) => {
      const urlFilename =
        sample.media_url.split("/").pop()?.split("?")[0] || "sample";
      return {
        dataset_id: datasetId,
        filename: urlFilename,
        media_url: sample.media_url,
        storage_path: null,
        mime_type: guessMimeType(sample.media_url),
        file_size_bytes: 0,
        metadata_json: sample.metadata_json,
      };
    });

    const { data, error } = await supabase
      .from("dataset_samples")
      .insert(rows)
      .select("id");

    if (error) {
      console.error(
        `  Error inserting chunk [${i + 1}..${chunkEnd}]: ${error.message}`
      );
      errorCount += chunk.length;
    } else {
      const count = data?.length ?? 0;
      insertedCount += count;
      console.log(
        `  Inserted chunk [${i + 1}..${chunkEnd}]: ${count} rows`
      );
    }
  }

  // -- Summary --
  console.log(
    `\nInserted ${insertedCount} of ${rawSamples.length} samples (${skippedCount} skipped as duplicates, ${errorCount} errors)`
  );
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
