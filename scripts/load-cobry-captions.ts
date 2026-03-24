/**
 * Load cobry caption parquets from S3 into video_index with embeddings.
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/load-cobry-captions.ts --bucket mv-abaka-external --delivery delivery1 [--limit 100] [--dry-run]
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// We'll use pyarrow via a child process since there's no good TS parquet reader for complex schemas
import { execSync } from "child_process";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) { console.error("Missing SUPABASE env vars"); process.exit(1); }
if (!openaiKey) { console.error("Missing OPENAI_API_KEY"); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);
const s3 = new S3Client({ region: process.env.AWS_REGION ?? "us-east-1" });

// CLI flags
const args = process.argv.slice(2);
function getFlag(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
}
const BUCKET = getFlag("bucket") ?? "mv-abaka-external";
const DELIVERY = getFlag("delivery") ?? "delivery1";
const LIMIT = getFlag("limit") ? parseInt(getFlag("limit")!, 10) : undefined;
const DRY_RUN = args.includes("--dry-run");

// OpenAI embedding
async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({ model: "text-embedding-3-small", input: text }),
  });
  const data = await res.json();
  return data.data[0].embedding;
}

async function downloadParquetAndExtract(s3Key: string): Promise<Array<{ s3_key: string; caption: string }>> {
  const tmpFile = path.join(os.tmpdir(), `cobry-${Date.now()}.parquet`);

  // Download parquet from S3
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: s3Key });
  const resp = await s3.send(cmd);
  const stream = resp.Body as Readable;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  fs.writeFileSync(tmpFile, Buffer.concat(chunks));

  // Use python to extract rows (pyarrow is much more reliable for parquet)
  const pyScript = `
import pyarrow.parquet as pq
import json, sys

table = pq.read_table("${tmpFile}")
d = table.to_pydict()
rows = []
for i in range(len(d.get("clip_storage_key", []))):
    key = d["clip_storage_key"][i] if "clip_storage_key" in d else d.get("orig_clip_storage_key", [""])[i]
    # Strip s3://bucket/ prefix to get just the key
    if key.startswith("s3://"):
        key = "/".join(key.split("/")[3:])
    text = d.get("text_short", d.get("text", [""]))[i] or ""
    full = d.get("text", [""])[i] or ""
    caption = f"{text}. {full}" if text and full and text != full else (full or text)
    if key and caption:
        rows.append({"s3_key": key, "caption": caption[:1000]})
print(json.dumps(rows))
`;
  const result = execSync(`python3 -c '${pyScript.replace(/'/g, "'\\''")}'`, { maxBuffer: 100 * 1024 * 1024 });
  fs.unlinkSync(tmpFile);
  return JSON.parse(result.toString());
}

async function main() {
  console.log(`[load-cobry] bucket=${BUCKET} delivery=${DELIVERY} limit=${LIMIT ?? "all"} dry_run=${DRY_RUN}`);

  // List caption parquet files
  const prefix = `silver/cobry/deliveries/videos/${DELIVERY}/captions/`;
  const listCmd = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, MaxKeys: 100 });
  const listResp = await s3.send(listCmd);
  const parquetKeys = (listResp.Contents ?? [])
    .map(obj => obj.Key!)
    .filter(k => k.endsWith(".parquet"));

  console.log(`[load-cobry] Found ${parquetKeys.length} caption parquet files`);

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const pqKey of parquetKeys) {
    console.log(`[load-cobry] Processing ${pqKey}...`);
    const rows = await downloadParquetAndExtract(pqKey);
    console.log(`  Extracted ${rows.length} captioned videos`);

    const toProcess = LIMIT ? rows.slice(0, LIMIT - totalInserted) : rows;

    // Process in batches of 20
    for (let i = 0; i < toProcess.length; i += 20) {
      const batch = toProcess.slice(i, i + 20);

      if (DRY_RUN) {
        for (const row of batch) {
          console.log(`  [dry-run] ${row.s3_key.slice(0, 60)} → "${row.caption.slice(0, 80)}..."`);
        }
        totalInserted += batch.length;
        continue;
      }

      // Generate embeddings for the batch
      const embeddings = await Promise.all(
        batch.map(row => generateEmbedding(row.caption).catch(() => null))
      );

      // Insert into video_index
      const inserts = batch.map((row, idx) => ({
        s3_bucket: BUCKET,
        s3_key: row.s3_key,
        caption_text: row.caption,
        embedding: embeddings[idx] ? JSON.stringify(embeddings[idx]) : null,
        enrichment_source: "cobry_caption",
        dataset_id: null, // Could map to Licensed Stock Video Library dataset
      })).filter((_, idx) => embeddings[idx] !== null);

      const { error } = await supabase.from("video_index").upsert(inserts, {
        onConflict: "s3_bucket,s3_key",
        ignoreDuplicates: true,
      });

      if (error) {
        console.error(`  [error] batch insert failed: ${error.message}`);
        totalFailed += batch.length;
      } else {
        totalInserted += inserts.length;
        totalSkipped += batch.length - inserts.length;
      }

      if (i % 100 === 0 && i > 0) {
        console.log(`  [progress] ${totalInserted} inserted so far...`);
      }
    }

    if (LIMIT && totalInserted >= LIMIT) break;
  }

  console.log(`\n[load-cobry] Done. Inserted ${totalInserted} / skipped ${totalSkipped} / failed ${totalFailed}`);
}

main().catch(console.error);
