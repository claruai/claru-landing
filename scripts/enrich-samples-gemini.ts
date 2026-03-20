/**
 * Enrich samples using Gemini Vision (gemini-2.0-flash).
 *
 * Run with:
 *   npx tsx scripts/enrich-samples-gemini.ts [--dry-run] [--dataset-id <uuid>] [--limit <n>]
 *
 * Only processes samples where agent_context IS NULL.
 * Uses p-limit for concurrency control (max 5) with exponential backoff on 429s.
 */

import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { scrubS3Urls } from "../src/lib/scrub-s3-urls";
import { getS3SignedUrl } from "../src/lib/s3/presigner";

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getFlag(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const DRY_RUN = args.includes("--dry-run");
const DATASET_ID = getFlag("dataset-id");
const LIMIT = getFlag("limit") ? parseInt(getFlag("limit")!, 10) : 100;

// ---------------------------------------------------------------------------
// Env validation
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!geminiKey) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ---------------------------------------------------------------------------
// Concurrency control (dynamic import for ESM p-limit)
// ---------------------------------------------------------------------------

async function loadPLimit() {
  const mod = await import("p-limit");
  return mod.default;
}

// ---------------------------------------------------------------------------
// Exponential backoff
// ---------------------------------------------------------------------------

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  initialDelay = 1000,
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

// ---------------------------------------------------------------------------
// Gemini prompt
// ---------------------------------------------------------------------------

const PROMPT = (mimeType: string) => `You are analyzing a media sample from a human-annotated data collection.
Examine this ${mimeType.startsWith("video/") ? "video" : "image"} and return a JSON object
with exactly these fields:

{
  "scene_summary": "<1–3 sentence natural language description of the scene>",
  "environments": ["<location type 1>", "..."],
  "activities": ["<activity 1>", "..."],
  "objects": ["<notable object 1>", "..."],
  "camera_perspective": "<e.g. egocentric, static overhead, handheld third-person>",
  "people_count": "<one of: 0, 1, 2-4, 5-10, crowd>",
  "technical": {
    "fps": "<estimated fps as string or null>",
    "duration": "<duration in seconds as string or null>",
    "resolution": "<WxH or null>"
  },
  "quality_notes": "<lighting, motion blur, occlusion notes or empty string>"
}

Return only the JSON object — no markdown, no explanation.`;

// ---------------------------------------------------------------------------
// Process single sample
// ---------------------------------------------------------------------------

interface SampleRow {
  id: string;
  dataset_id: string;
  s3_object_key: string | null;
  mime_type: string;
  s3_bucket?: string;
}

async function enrichSample(sample: SampleRow): Promise<Record<string, unknown> | null> {
  if (!sample.s3_object_key) return null;

  // Get signed URL for Gemini to access the media
  const signedUrl = await getS3SignedUrl(
    sample.s3_object_key,
    3600,
    sample.s3_bucket || undefined,
  );
  if (!signedUrl) {
    console.error(`  [skip] ${sample.id}: could not generate signed URL`);
    return null;
  }

  const result = await withRetry(async () => {
    const response = await model.generateContent([
      {
        fileData: {
          mimeType: sample.mime_type,
          fileUri: signedUrl,
        },
      },
      { text: PROMPT(sample.mime_type) },
    ]);
    return response.response.text();
  });

  // Parse JSON from response
  const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  // Scrub any S3 URLs that Gemini might echo back
  return scrubS3Urls(parsed) as Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(
    `[enrich-gemini] dry_run=${DRY_RUN} dataset_id=${DATASET_ID ?? "all"} limit=${LIMIT}`,
  );

  // Fetch candidates
  let query = supabase
    .from("dataset_samples")
    .select("id, dataset_id, s3_object_key, mime_type")
    .is("agent_context", null)
    .not("s3_object_key", "is", null);

  if (DATASET_ID) {
    query = query.eq("dataset_id", DATASET_ID);
  }

  query = query.limit(LIMIT);

  const { data: candidates, error } = await query;

  if (error) {
    console.error("Failed to fetch candidates:", error.message);
    process.exit(1);
  }

  if (!candidates || candidates.length === 0) {
    console.log("[enrich-gemini] No candidates found — nothing to do.");
    return;
  }

  console.log(`[enrich-gemini] Found ${candidates.length} candidates`);

  if (DRY_RUN) {
    console.log(`[enrich-gemini] Dry run — would process ${candidates.length} samples`);
    for (const c of candidates.slice(0, 5)) {
      console.log(`  ${c.id} (${c.mime_type}) key=${c.s3_object_key?.slice(0, 60)}...`);
    }
    return;
  }

  const pLimit = await loadPLimit();
  const limit = pLimit(5);

  let processed = 0;
  let failed = 0;

  const tasks = candidates.map((sample) =>
    limit(async () => {
      try {
        const agentContext = await enrichSample(sample as SampleRow);
        if (!agentContext) {
          failed++;
          return;
        }

        const { error: updateError } = await supabase
          .from("dataset_samples")
          .update({ agent_context: agentContext })
          .eq("id", sample.id);

        if (updateError) {
          console.error(`  [error] ${sample.id}: ${updateError.message}`);
          failed++;
        } else {
          processed++;
          if (processed % 10 === 0) {
            console.log(`  [progress] ${processed}/${candidates.length} processed`);
          }
        }
      } catch (err) {
        console.error(`  [error] ${sample.id}:`, err instanceof Error ? err.message : err);
        failed++;
      }
    }),
  );

  await Promise.all(tasks);

  console.log(
    `\n[enrich-gemini] Done. Processed ${processed} / failed ${failed} / total ${candidates.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
