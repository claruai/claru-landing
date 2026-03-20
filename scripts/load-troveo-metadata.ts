/**
 * Load troveo per-video metadata into video_index with 768-dim embeddings.
 *
 * Reads embedding parquets to discover (storage_key, meta_key) mappings,
 * then fetches each metadata JSON and constructs a caption from technical fields.
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/load-troveo-metadata.ts [--limit 100] [--dry-run]
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

// ---------------------------------------------------------------------------
// Env validation
// ---------------------------------------------------------------------------

const BUCKET = "mv-troveo";

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
// Types
// ---------------------------------------------------------------------------

interface ParquetMapping {
  storage_key: string;
  meta_key: string;
}

interface TroveoMetadata {
  video_id?: string;
  format_note?: string;
  width?: number;
  height?: number;
  clip_duration?: number;
  fps?: number;
  codec?: string;
  [key: string]: unknown;
}

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

async function listParquetFiles(prefix: string): Promise<string[]> {
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
      if (obj.Key?.endsWith(".parquet")) {
        keys.push(obj.Key);
      }
    }
    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

function extractMappingsFromParquet(tmpFile: string): ParquetMapping[] {
  const pyScript = `
import pyarrow.parquet as pq
import json

table = pq.read_table("${tmpFile}")
d = table.to_pydict()
rows = []
for i in range(table.num_rows):
    storage_key = d.get("storage_key", [""])[i] or ""
    meta_key = d.get("meta_key", [""])[i] or ""
    if storage_key:
        # Strip s3://bucket/ prefix
        if storage_key.startswith("s3://"):
            storage_key = "/".join(storage_key.split("/")[3:])
        if meta_key.startswith("s3://"):
            meta_key = "/".join(meta_key.split("/")[3:])
        rows.append({"storage_key": storage_key, "meta_key": meta_key})
print(json.dumps(rows))
`;
  const result = execSync(`python3 -c '${pyScript.replace(/'/g, "'\\''")}'`, {
    maxBuffer: 100 * 1024 * 1024,
  });
  return JSON.parse(result.toString()) as ParquetMapping[];
}

async function fetchMetadataJson(metaKey: string): Promise<TroveoMetadata | null> {
  if (!metaKey) return null;
  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: metaKey });
    const resp = await s3.send(cmd);
    const buf = await streamToBuffer(resp.Body as Readable);
    return JSON.parse(buf.toString("utf-8")) as TroveoMetadata;
  } catch {
    return null;
  }
}

function buildCaption(meta: TroveoMetadata): string {
  const parts: string[] = [];

  if (meta.format_note) {
    parts.push(`${meta.format_note} video`);
  }

  if (meta.width && meta.height) {
    parts.push(`${meta.width}x${meta.height}`);
  }

  if (meta.clip_duration) {
    parts.push(`${meta.clip_duration}s clip`);
  }

  if (meta.fps) {
    parts.push(`${meta.fps}fps`);
  }

  if (meta.codec) {
    parts.push(`codec: ${meta.codec}`);
  }

  if (meta.video_id) {
    parts.push(`id: ${meta.video_id}`);
  }

  return parts.join(", ");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`[load-troveo] bucket=${BUCKET} limit=${LIMIT ?? "all"} dry_run=${DRY_RUN}`);

  // Discover embedding parquets to get storage_key → meta_key mappings
  const prefix = "silver/quality_assessment/";
  console.log(`[load-troveo] Listing embedding parquets under ${prefix}...`);

  const embeddingPrefix = prefix;
  const allParquetKeys = await listParquetFiles(embeddingPrefix);

  // Filter to embedding parquets only
  const embeddingParquets = allParquetKeys.filter((k) =>
    k.includes("/embeddings/") && k.endsWith(".parquet")
  );

  console.log(`[load-troveo] Found ${embeddingParquets.length} embedding parquet files`);

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const pqKey of embeddingParquets) {
    if (LIMIT && totalInserted >= LIMIT) break;

    let tmpFile: string | null = null;
    try {
      // Download parquet
      const tmpDir = os.tmpdir();
      tmpFile = path.join(tmpDir, `troveo-${Date.now()}.parquet`);
      console.log(`[load-troveo] Processing ${pqKey}...`);

      const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: pqKey });
      const resp = await s3.send(cmd);
      const buf = await streamToBuffer(resp.Body as Readable);
      fs.writeFileSync(tmpFile, buf);

      // Extract mappings
      const mappings = extractMappingsFromParquet(tmpFile);
      console.log(`  Extracted ${mappings.length} video mappings`);

      const toProcess = LIMIT
        ? mappings.slice(0, LIMIT - totalInserted)
        : mappings;

      // Process in batches of 20
      for (let i = 0; i < toProcess.length; i += 20) {
        if (LIMIT && totalInserted >= LIMIT) break;

        const batch = toProcess.slice(i, i + 20);
        const batchRows: Array<{
          s3_bucket: string;
          s3_key: string;
          caption_text: string;
          embedding: string;
          enrichment_source: string;
        }> = [];

        for (const mapping of batch) {
          if (DRY_RUN) {
            console.log(`  [dry-run] ${mapping.storage_key.slice(0, 60)} meta=${mapping.meta_key.slice(0, 60)}`);
            totalInserted++;
            continue;
          }

          // Fetch metadata JSON
          const meta = await fetchMetadataJson(mapping.meta_key);
          const caption = meta ? buildCaption(meta) : "";

          if (!caption) {
            totalSkipped++;
            continue;
          }

          try {
            const embedding = await generateEmbedding(caption);
            batchRows.push({
              s3_bucket: BUCKET,
              s3_key: mapping.storage_key,
              caption_text: caption,
              embedding: JSON.stringify(embedding),
              enrichment_source: "troveo_metadata",
            });
          } catch (err) {
            console.error(`  [error] embedding failed for ${mapping.storage_key}:`, err instanceof Error ? err.message : err);
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
          console.log(`  [progress] ${totalInserted} inserted, ${totalSkipped} skipped, ${totalFailed} failed`);
        }
      }
    } finally {
      if (tmpFile && fs.existsSync(tmpFile)) {
        fs.unlinkSync(tmpFile);
      }
    }
  }

  // Also check for cobry-style captions under silver/deliveries/videos/ (richer if available)
  const cobryPrefix = "silver/cobry/deliveries/videos/";
  const cobryParquets = await listParquetFiles(cobryPrefix);

  if (cobryParquets.length > 0) {
    console.log(`[load-troveo] Found ${cobryParquets.length} cobry caption parquets in troveo bucket — processing...`);

    for (const pqKey of cobryParquets) {
      if (LIMIT && totalInserted >= LIMIT) break;

      let tmpFile: string | null = null;
      try {
        tmpFile = path.join(os.tmpdir(), `troveo-cobry-${Date.now()}.parquet`);
        const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: pqKey });
        const resp = await s3.send(cmd);
        const buf = await streamToBuffer(resp.Body as Readable);
        fs.writeFileSync(tmpFile, buf);

        // Extract cobry-style captions
        const pyScript = `
import pyarrow.parquet as pq
import json

table = pq.read_table("${tmpFile}")
d = table.to_pydict()
rows = []
for i in range(table.num_rows):
    key = d.get("clip_storage_key", d.get("orig_clip_storage_key", [""]))[i] or ""
    if key.startswith("s3://"):
        key = "/".join(key.split("/")[3:])
    text = d.get("text_short", d.get("text", [""]))[i] or ""
    full = d.get("text", [""])[i] or ""
    caption = f"{text}. {full}" if text and full and text != full else (full or text)
    if key and caption:
        rows.append({"s3_key": key, "caption": caption[:1000]})
print(json.dumps(rows))
`;
        const result = execSync(`python3 -c '${pyScript.replace(/'/g, "'\\''")}'`, {
          maxBuffer: 100 * 1024 * 1024,
        });
        const rows = JSON.parse(result.toString()) as Array<{ s3_key: string; caption: string }>;
        console.log(`  ${pqKey}: ${rows.length} captioned videos`);

        const toProcess = LIMIT ? rows.slice(0, LIMIT - totalInserted) : rows;

        for (let i = 0; i < toProcess.length; i += 20) {
          if (LIMIT && totalInserted >= LIMIT) break;

          const batch = toProcess.slice(i, i + 20);

          if (DRY_RUN) {
            for (const row of batch) {
              console.log(`  [dry-run] ${row.s3_key.slice(0, 60)} → "${row.caption.slice(0, 80)}..."`);
            }
            totalInserted += batch.length;
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
              enrichment_source: "troveo_metadata",
            }))
            .filter((_, idx) => embeddings[idx] !== null);

          if (inserts.length === 0) continue;

          const { error } = await supabase.from("video_index").upsert(inserts, {
            onConflict: "s3_bucket,s3_key",
            ignoreDuplicates: true,
          });

          if (error) {
            console.error(`  [error] batch upsert failed: ${error.message}`);
            totalFailed += inserts.length;
          } else {
            totalInserted += inserts.length;
            totalSkipped += batch.length - inserts.length;
          }
        }
      } finally {
        if (tmpFile && fs.existsSync(tmpFile)) {
          fs.unlinkSync(tmpFile);
        }
      }
    }
  }

  console.log(
    `\n[load-troveo] Done. Inserted ${totalInserted} / skipped ${totalSkipped} / failed ${totalFailed}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
