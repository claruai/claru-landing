/**
 * Load captions from moonvalley-ml-datasets into video_index with embeddings.
 *
 * Handles three source formats:
 *   --source sharegpt4video : ShareGPT4Video per-video JSONs
 *   --source movie_clips    : backup-caption-parquets/movie_clips_captions.parquet
 *   --source tv_clips       : backup-caption-parquets/tv_clips_captions.parquet
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/load-ml-dataset-captions.ts --source sharegpt4video [--limit 100] [--dry-run]
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
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { execSync } from "child_process";

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
const SOURCE = getFlag("source") ?? "sharegpt4video";

const VALID_SOURCES = ["sharegpt4video", "movie_clips", "tv_clips"];
if (!VALID_SOURCES.includes(SOURCE)) {
  console.error(`Invalid --source: ${SOURCE}. Valid: ${VALID_SOURCES.join(", ")}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Env validation
// ---------------------------------------------------------------------------

const BUCKET = "moonvalley-ml-datasets";

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

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks);
}

async function listJsonFiles(prefix: string): Promise<string[]> {
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
      if (obj.Key?.endsWith(".json")) {
        keys.push(obj.Key);
      }
    }
    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

async function fetchJson(key: string): Promise<unknown | null> {
  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const resp = await s3.send(cmd);
    const buf = await streamToBuffer(resp.Body as Readable);
    return JSON.parse(buf.toString("utf-8"));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// ShareGPT4Video loader
// ---------------------------------------------------------------------------

interface ShareGPT4VideoJson {
  video?: Array<{ content?: string }>;
  [key: string]: unknown;
}

async function loadShareGPT4Video(): Promise<{ inserted: number; skipped: number; failed: number }> {
  console.log("[load-ml] Loading ShareGPT4Video JSONs...");

  const prefix = "ShareGPT4Video/";
  const jsonKeys = await listJsonFiles(prefix);
  console.log(`  Found ${jsonKeys.length} JSON files`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  const toProcess = LIMIT ? jsonKeys.slice(0, LIMIT) : jsonKeys;

  for (let i = 0; i < toProcess.length; i += 20) {
    if (LIMIT && inserted >= LIMIT) break;

    const batch = toProcess.slice(i, i + 20);
    const batchRows: Array<{
      s3_bucket: string;
      s3_key: string;
      caption_text: string;
      embedding: string;
      enrichment_source: string;
    }> = [];

    for (const jsonKey of batch) {
      if (DRY_RUN) {
        console.log(`  [dry-run] ${jsonKey.slice(0, 80)}`);
        inserted++;
        continue;
      }

      const data = (await fetchJson(jsonKey)) as ShareGPT4VideoJson | null;
      if (!data) {
        skipped++;
        continue;
      }

      // Extract caption from video[0].content
      const caption = data.video?.[0]?.content;
      if (!caption) {
        skipped++;
        continue;
      }

      // Derive the video s3_key from the JSON path
      // ShareGPT4Video/{dataset}/bronze/{id}/json/{file}.json → video is nearby
      const videoKey = jsonKey
        .replace("/json/", "/video/")
        .replace(".json", ".mp4");

      try {
        const embedding = await generateEmbedding(caption.slice(0, 1000));
        batchRows.push({
          s3_bucket: BUCKET,
          s3_key: videoKey,
          caption_text: caption.slice(0, 1000),
          embedding: JSON.stringify(embedding),
          enrichment_source: "ml_dataset_caption",
        });
      } catch (err) {
        console.error(
          `  [error] embedding failed for ${jsonKey}:`,
          err instanceof Error ? err.message : err
        );
        failed++;
      }
    }

    if (DRY_RUN || batchRows.length === 0) continue;

    const { error } = await supabase.from("video_index").upsert(batchRows, {
      onConflict: "s3_bucket,s3_key",
      ignoreDuplicates: true,
    });

    if (error) {
      console.error(`  [error] batch upsert failed: ${error.message}`);
      failed += batchRows.length;
    } else {
      inserted += batchRows.length;
    }

    if (inserted % 100 < 20 && inserted > 0) {
      console.log(`  [progress] ${inserted} inserted, ${skipped} skipped, ${failed} failed`);
    }
  }

  return { inserted, skipped, failed };
}

// ---------------------------------------------------------------------------
// Caption parquet loader (movie_clips / tv_clips)
// ---------------------------------------------------------------------------

async function loadCaptionParquet(
  parquetKey: string
): Promise<{ inserted: number; skipped: number; failed: number }> {
  console.log(`[load-ml] Loading caption parquet: ${parquetKey}`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  let tmpFile: string | null = null;
  try {
    tmpFile = path.join(os.tmpdir(), `ml-dataset-${Date.now()}.parquet`);

    // Download parquet
    console.log("  Downloading parquet file...");
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: parquetKey });
    const resp = await s3.send(cmd);
    const buf = await streamToBuffer(resp.Body as Readable);
    fs.writeFileSync(tmpFile, buf);
    console.log(`  Downloaded ${(buf.length / 1024 / 1024).toFixed(1)} MB`);

    // Use pyarrow row group streaming to avoid loading entire file
    const countScript = `
import pyarrow.parquet as pq
pf = pq.ParquetFile("${tmpFile}")
print(pf.metadata.num_row_groups)
`;
    const numRowGroups = parseInt(
      execSync(`python3 -c '${countScript}'`).toString().trim(),
      10
    );
    console.log(`  ${numRowGroups} row group(s)`);

    for (let rgIdx = 0; rgIdx < numRowGroups; rgIdx++) {
      if (LIMIT && inserted >= LIMIT) break;

      const pyScript = `
import pyarrow.parquet as pq
import json

pf = pq.ParquetFile("${tmpFile}")
table = pf.read_row_group(${rgIdx})
d = table.to_pydict()
rows = []
for i in range(table.num_rows):
    key = d.get("clip_storage_key", d.get("storage_key", [""]))[i] or ""
    if key.startswith("s3://"):
        key = "/".join(key.split("/")[3:])
    caption = d.get("caption", d.get("text", d.get("text_short", [""])))[i] or ""
    if key and caption:
        rows.append({"s3_key": key, "caption": str(caption)[:1000]})
print(json.dumps(rows))
`;
      const result = execSync(`python3 -c '${pyScript.replace(/'/g, "'\\''")}'`, {
        maxBuffer: 200 * 1024 * 1024,
      });
      const rows = JSON.parse(result.toString()) as Array<{
        s3_key: string;
        caption: string;
      }>;

      console.log(`  Row group ${rgIdx}: ${rows.length} rows`);
      const toProcess = LIMIT ? rows.slice(0, LIMIT - inserted) : rows;

      for (let i = 0; i < toProcess.length; i += 20) {
        if (LIMIT && inserted >= LIMIT) break;

        const batch = toProcess.slice(i, i + 20);

        if (DRY_RUN) {
          for (const row of batch) {
            console.log(`  [dry-run] ${row.s3_key.slice(0, 60)} → "${row.caption.slice(0, 80)}..."`);
          }
          inserted += batch.length;
          continue;
        }

        const embeddings = await Promise.all(
          batch.map((row) =>
            generateEmbedding(row.caption).catch(() => null)
          )
        );

        const inserts = batch
          .map((row, idx) => ({
            s3_bucket: BUCKET,
            s3_key: row.s3_key,
            caption_text: row.caption,
            embedding: embeddings[idx] ? JSON.stringify(embeddings[idx]) : null,
            enrichment_source: "ml_dataset_caption",
          }))
          .filter((_, idx) => embeddings[idx] !== null);

        if (inserts.length === 0) continue;

        const { error } = await supabase.from("video_index").upsert(inserts, {
          onConflict: "s3_bucket,s3_key",
          ignoreDuplicates: true,
        });

        if (error) {
          console.error(`  [error] batch upsert failed: ${error.message}`);
          failed += inserts.length;
        } else {
          inserted += inserts.length;
          skipped += batch.length - inserts.length;
        }

        if (inserted % 200 < 20 && inserted > 0) {
          console.log(`  [progress] ${inserted} inserted, ${skipped} skipped, ${failed} failed`);
        }
      }
    }
  } finally {
    if (tmpFile && fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }

  return { inserted, skipped, failed };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`[load-ml] bucket=${BUCKET} source=${SOURCE} limit=${LIMIT ?? "all"} dry_run=${DRY_RUN}`);

  let result: { inserted: number; skipped: number; failed: number };

  switch (SOURCE) {
    case "sharegpt4video":
      result = await loadShareGPT4Video();
      break;
    case "movie_clips":
      result = await loadCaptionParquet("backup-caption-parquets/movie_clips_captions.parquet");
      break;
    case "tv_clips":
      result = await loadCaptionParquet("backup-caption-parquets/tv_clips_captions.parquet");
      break;
    default:
      console.error(`Unknown source: ${SOURCE}`);
      process.exit(1);
  }

  console.log(
    `\n[load-ml] Done. Inserted ${result.inserted} / skipped ${result.skipped} / failed ${result.failed}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
