/**
 * Enrich uncaptioned videos in mv-xtr-external using Gemini 2.5 Flash Vision.
 *
 * Lists video files in asteria/, david_darg/, paul_trillo/ subdirectories,
 * generates signed URLs, sends to Gemini for captioning, then embeds and
 * upserts into video_index.
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/enrich-xtr-gemini.ts [--limit 100] [--dry-run]
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import {
  S3Client,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

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

const BUCKET = "mv-xtr-external";
const PREFIXES = ["asteria/", "david_darg/", "paul_trillo/"];
const VIDEO_EXTENSIONS = /\.(mp4|mov|avi|mkv|webm|mxf)$/i;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!openaiKey) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}
if (!geminiKey) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const s3 = new S3Client({ region: process.env.AWS_REGION ?? "us-east-1" });
const openai = new OpenAI({ apiKey: openaiKey });
const genAI = new GoogleGenerativeAI(geminiKey);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ---------------------------------------------------------------------------
// Concurrency control (dynamic import for ESM p-limit)
// ---------------------------------------------------------------------------

async function loadPLimit() {
  const mod = await import("p-limit");
  return mod.default;
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

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  initialDelay = 1000
): Promise<T> {
  let delay = initialDelay;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const is429 =
        err instanceof Error &&
        (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED"));
      if (!is429 || attempt === retries) throw err;
      console.log(`  [retry] 429 received, waiting ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("unreachable");
}

async function listVideoFiles(prefix: string): Promise<string[]> {
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
      if (obj.Key && VIDEO_EXTENSIONS.test(obj.Key)) {
        keys.push(obj.Key);
      }
    }
    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

async function getPresignedUrl(key: string): Promise<string> {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: 3600 });
}

function guessMimeType(key: string): string {
  if (key.endsWith(".mp4")) return "video/mp4";
  if (key.endsWith(".mov")) return "video/quicktime";
  if (key.endsWith(".avi")) return "video/x-msvideo";
  if (key.endsWith(".mkv")) return "video/x-matroska";
  if (key.endsWith(".webm")) return "video/webm";
  if (key.endsWith(".mxf")) return "video/mxf";
  return "video/mp4";
}

const PROMPT = `Describe this video in 1-3 sentences for a search index. Focus on:
- What is happening in the scene
- The environment and setting
- Notable objects, people, or activities
- Camera style (aerial, handheld, static, etc.)

Return only the description text, no formatting or labels.`;

async function captionWithGemini(signedUrl: string, mimeType: string): Promise<string | null> {
  try {
    const result = await withRetry(async () => {
      const response = await geminiModel.generateContent([
        {
          fileData: {
            mimeType,
            fileUri: signedUrl,
          },
        },
        { text: PROMPT },
      ]);
      return response.response.text();
    });
    return result.trim().slice(0, 1000);
  } catch (err) {
    console.error(
      `  [error] Gemini failed:`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`[enrich-xtr] bucket=${BUCKET} limit=${LIMIT ?? "all"} dry_run=${DRY_RUN}`);

  // Collect all video files
  const allVideoKeys: string[] = [];
  for (const prefix of PREFIXES) {
    const keys = await listVideoFiles(prefix);
    console.log(`  ${prefix}: ${keys.length} videos`);
    allVideoKeys.push(...keys);
  }

  console.log(`[enrich-xtr] Total: ${allVideoKeys.length} video files`);

  const toProcess = LIMIT ? allVideoKeys.slice(0, LIMIT) : allVideoKeys;

  if (DRY_RUN) {
    for (const key of toProcess.slice(0, 10)) {
      console.log(`  [dry-run] ${key}`);
    }
    if (toProcess.length > 10) {
      console.log(`  ... and ${toProcess.length - 10} more`);
    }
    console.log(`\n[enrich-xtr] Dry run — would process ${toProcess.length} videos`);
    return;
  }

  const pLimit = await loadPLimit();
  const limit = pLimit(5);

  let inserted = 0;
  let failed = 0;

  const tasks = toProcess.map((videoKey) =>
    limit(async () => {
      try {
        // Generate signed URL for Gemini
        const signedUrl = await getPresignedUrl(videoKey);
        const mimeType = guessMimeType(videoKey);

        // Caption with Gemini
        const caption = await captionWithGemini(signedUrl, mimeType);
        if (!caption) {
          failed++;
          return;
        }

        // Generate embedding
        const embedding = await generateEmbedding(caption);

        // Upsert into video_index
        const { error } = await supabase.from("video_index").upsert(
          {
            s3_bucket: BUCKET,
            s3_key: videoKey,
            caption_text: caption,
            embedding: JSON.stringify(embedding),
            enrichment_source: "gemini_vision",
          },
          {
            onConflict: "s3_bucket,s3_key",
            ignoreDuplicates: true,
          }
        );

        if (error) {
          console.error(`  [error] upsert ${videoKey}: ${error.message}`);
          failed++;
        } else {
          inserted++;
          if (inserted % 50 === 0) {
            console.log(`  [progress] ${inserted}/${toProcess.length} inserted`);
          }
        }
      } catch (err) {
        console.error(
          `  [error] ${videoKey}:`,
          err instanceof Error ? err.message : err
        );
        failed++;
      }
    })
  );

  await Promise.all(tasks);

  console.log(
    `\n[enrich-xtr] Done. Inserted ${inserted} / failed ${failed} / total ${toProcess.length}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
