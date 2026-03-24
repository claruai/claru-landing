/**
 * Load troveo per-video metadata into video_index with 768-dim embeddings.
 *
 * Iterates over mv-troveo tranches (1–10), reads per-video metadata JSONs
 * from {tranche}/{delivery}/metadata/{id}.json, constructs a caption from
 * the rich clip_annotations + technical fields, generates embeddings, upserts.
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

// ---------------------------------------------------------------------------
// Env validation
// ---------------------------------------------------------------------------

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

const BUCKET = "mv-troveo";

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const cliArgs = process.argv.slice(2);

function getFlag(name: string): string | undefined {
  const idx = cliArgs.indexOf(`--${name}`);
  return idx !== -1 ? cliArgs[idx + 1] : undefined;
}

const DRY_RUN = cliArgs.includes("--dry-run");
const LIMIT = getFlag("limit") ? parseInt(getFlag("limit")!, 10) : undefined;

// ---------------------------------------------------------------------------
// S3 helpers
// ---------------------------------------------------------------------------

async function listPrefixes(prefix: string): Promise<string[]> {
  const prefixes: string[] = [];
  let token: string | undefined;
  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      Delimiter: "/",
      MaxKeys: 1000,
      ContinuationToken: token,
    });
    const r = await s3.send(cmd);
    for (const p of r.CommonPrefixes ?? []) {
      if (p.Prefix) prefixes.push(p.Prefix);
    }
    token = r.NextContinuationToken;
  } while (token);
  return prefixes;
}

async function listObjects(
  prefix: string,
  extension?: string,
): Promise<string[]> {
  const keys: string[] = [];
  let token: string | undefined;
  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      MaxKeys: 1000,
      ContinuationToken: token,
    });
    const r = await s3.send(cmd);
    for (const obj of r.Contents ?? []) {
      if (obj.Key && (!extension || obj.Key.endsWith(extension))) {
        keys.push(obj.Key);
      }
    }
    token = r.NextContinuationToken;
  } while (token);
  return keys;
}

async function readJsonFromS3(
  key: string,
): Promise<Record<string, unknown> | null> {
  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const r = await s3.send(cmd);
    const body = await r.Body!.transformToString();
    return JSON.parse(body);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Troveo metadata types
// ---------------------------------------------------------------------------

interface TroveoMetadata {
  id: number;
  video_id: number;
  aws_s3_video_file_path?: string;
  category?: string;
  main_category?: string;
  subcategory?: string;
  width?: number;
  height?: number;
  clip_duration?: number;
  format_note?: string;
  quality?: { category?: string; score?: number };
  clip_annotations?: {
    style?: string;
    simple_description?: string;
    detailed_description?: string;
    foreground_description?: string;
    background_description?: string;
    main_characters?: string;
    main_activities?: string;
  };
}

// ---------------------------------------------------------------------------
// Caption construction
// ---------------------------------------------------------------------------

function buildCaption(meta: TroveoMetadata): string {
  const parts: string[] = [];

  const ann = meta.clip_annotations;
  if (ann?.detailed_description) {
    parts.push(ann.detailed_description);
  } else if (ann?.simple_description) {
    parts.push(ann.simple_description);
  }

  if (
    ann?.main_activities &&
    !parts[0]?.includes(ann.main_activities)
  ) {
    parts.push(`Activities: ${ann.main_activities}`);
  }

  const cats = [meta.main_category, meta.subcategory, meta.category].filter(
    Boolean,
  );
  if (cats.length > 0) {
    parts.push(`Category: ${cats.join(" > ")}`);
  }

  const tech: string[] = [];
  if (meta.width && meta.height) tech.push(`${meta.width}x${meta.height}`);
  if (meta.clip_duration) tech.push(`${meta.clip_duration.toFixed(1)}s`);
  if (meta.format_note) tech.push(meta.format_note);
  if (meta.quality?.category)
    tech.push(`${meta.quality.category} quality (${meta.quality.score})`);
  if (tech.length > 0) parts.push(`Technical: ${tech.join(", ")}`);

  return parts.join(". ").slice(0, 2000);
}

/**
 * Derive the payload s3_key from the troveo-deliverable S3 path.
 *
 * Input:  s3://troveo-deliverable/dt=2024-10-21-22-41/318/clips/PAzABiWs_clip_15.mp4
 * Output: dt_2024_10_21_22_41_318_clips_pazabiws_clip_15.mp4
 */
function derivePayloadFilename(awsPath: string): string {
  const stripped = awsPath.replace(/^s3:\/\/[^/]+\//, "");
  return stripped.replace(/[/=\-]/g, "_").toLowerCase();
}

// ---------------------------------------------------------------------------
// OpenAI embedding (768-dim batch)
// ---------------------------------------------------------------------------

async function generateEmbeddings(
  texts: string[],
): Promise<(number[] | null)[]> {
  if (texts.length === 0) return [];
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texts,
      dimensions: 768,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  [embedding error] ${res.status}: ${err.slice(0, 200)}`);
    return texts.map(() => null);
  }
  const data = await res.json();
  const sorted = (
    data.data as Array<{ index: number; embedding: number[] }>
  ).sort((a, b) => a.index - b.index);
  return sorted.map((d) => d.embedding);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(
    `[load-troveo] bucket=${BUCKET} limit=${LIMIT ?? "all"} dry_run=${DRY_RUN}`,
  );

  // Discover all tranches
  const topDirs = await listPrefixes("");
  const trancheDirs = topDirs.filter((d) => d.includes("tranche")).sort();
  console.log(`[load-troveo] Found ${trancheDirs.length} tranches`);

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const trancheDir of trancheDirs) {
    if (LIMIT && totalInserted >= LIMIT) break;

    const deliveryDirs = await listPrefixes(trancheDir);
    const actualDeliveries = deliveryDirs.filter((d) =>
      d.includes("delivery"),
    );
    console.log(
      `\n[load-troveo] ${trancheDir} — ${actualDeliveries.length} deliveries`,
    );

    for (const deliveryDir of actualDeliveries) {
      if (LIMIT && totalInserted >= LIMIT) break;

      const metadataPrefix = `${deliveryDir}metadata/`;
      const metaKeys = await listObjects(metadataPrefix, ".json");
      console.log(`  ${deliveryDir} — ${metaKeys.length} metadata JSONs`);

      if (metaKeys.length === 0) continue;

      const payloadPrefix = `${deliveryDir}payload/`;
      const batchSize = 20;

      for (let i = 0; i < metaKeys.length; i += batchSize) {
        if (LIMIT && totalInserted >= LIMIT) break;

        const remaining = LIMIT ? LIMIT - totalInserted : metaKeys.length - i;
        const batch = metaKeys.slice(i, i + Math.min(batchSize, remaining));

        // Fetch all metadata JSONs in parallel
        const metas = await Promise.all(
          batch.map((k) => readJsonFromS3(k)),
        );

        const rows: Array<{ s3_key: string; caption: string }> = [];

        for (const raw of metas) {
          if (!raw) {
            totalFailed++;
            continue;
          }
          const meta = raw as unknown as TroveoMetadata;
          const caption = buildCaption(meta);
          if (!caption) {
            totalSkipped++;
            continue;
          }

          if (!meta.aws_s3_video_file_path) {
            totalSkipped++;
            continue;
          }

          const filename = derivePayloadFilename(meta.aws_s3_video_file_path);
          rows.push({ s3_key: `${payloadPrefix}${filename}`, caption });
        }

        if (rows.length === 0) continue;

        if (DRY_RUN) {
          for (const row of rows) {
            console.log(
              `  [dry-run] ${row.s3_key.split("/").pop()?.slice(0, 45)} → "${row.caption.slice(0, 80)}..."`,
            );
          }
          totalInserted += rows.length;
          continue;
        }

        // Batch embedding
        const embeddings = await generateEmbeddings(
          rows.map((r) => r.caption),
        );

        const inserts = rows
          .map((row, idx) => ({
            s3_bucket: BUCKET,
            s3_key: row.s3_key,
            caption_text: row.caption,
            embedding: embeddings[idx]
              ? JSON.stringify(embeddings[idx])
              : null,
            enrichment_source: "troveo_metadata",
            dataset_id: null,
          }))
          .filter((_, idx) => embeddings[idx] !== null);

        if (inserts.length === 0) {
          totalFailed += rows.length;
          continue;
        }

        const { error } = await supabase
          .from("video_index")
          .upsert(inserts, {
            onConflict: "s3_bucket,s3_key",
            ignoreDuplicates: true,
          });

        if (error) {
          console.error(`  [error] batch upsert: ${error.message}`);
          totalFailed += inserts.length;
        } else {
          totalInserted += inserts.length;
          totalSkipped += rows.length - inserts.length;
        }

        if (totalInserted > 0 && totalInserted % 200 < batchSize) {
          console.log(
            `  [progress] ${totalInserted} inserted, ${totalSkipped} skipped, ${totalFailed} failed`,
          );
        }
      }
    }
  }

  console.log(
    `\n[load-troveo] Done. Inserted ${totalInserted} / skipped ${totalSkipped} / failed ${totalFailed}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
