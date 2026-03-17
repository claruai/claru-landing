/**
 * Enrich dataset samples with Gemini video analysis.
 *
 * For each sample in the Egocentric Activity Capture dataset that has
 * an annotation key but no enrichment, sends the video to Gemini 2.0 Flash
 * for structured analysis and writes the result to enrichment_json.
 */

import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATASET_ID = "eb07cf5b-55b1-45ec-a513-65b9e78956de";

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars: GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CloudFront signer (simplified — just use the public S3 URL approach)
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

function getPublicS3Url(key) {
  // Use the S3 bucket URL directly — Gemini can fetch from public URLs
  // For private buckets, we'd need to use signed URLs
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
  }
  return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
}

const ENRICHMENT_PROMPT = `Analyze this egocentric (first-person) video and produce a JSON object with the following structure. Be precise and factual based on what you see.

{
  "task": "short_snake_case_task_name",
  "task_description": "2-3 sentence description of what the person is doing in the video",
  "domain": "one of: kitchen_food_prep, household_living, workplace_industrial, outdoor_navigation, personal_care, laundry_clothing, skilled_trade, retail_commercial",
  "environment_label": "one of: indoor_home, indoor_workplace, indoor_commercial, outdoor_urban, outdoor_rural, vehicle",
  "environment_description": "1-2 sentence description of the physical environment visible in the video",
  "hands": {
    "hands_visible": true/false,
    "primary_hand": "left" or "right" or "both",
    "right_hand_pct": estimated percentage of video where right hand is active (0-100),
    "left_hand_pct": estimated percentage of video where left hand is active (0-100),
    "both_hands_pct": estimated percentage where both hands are active simultaneously (0-100),
    "no_hand_pct": estimated percentage where no hands are visible (0-100),
    "active_manipulation": true if hands are actively manipulating objects,
    "confidence": your confidence in the hand analysis (0.0 to 1.0)
  },
  "technical_specs": {
    "duration_s": estimated duration in seconds,
    "resolution_px": {"width": estimated width, "height": estimated height},
    "fps_estimate": estimated frames per second,
    "aspect_ratio": "16:9" or "9:16" or "4:3" etc
  }
}

Return ONLY the JSON object, no markdown formatting, no code fences.`;

async function enrichSample(sample) {
  const videoUrl = getPublicS3Url(sample.s3_object_key);
  const mimeType = sample.mime_type === "video/quicktime" ? "video/mp4" : sample.mime_type;
  const tmpPath = join(tmpdir(), `enrich-${sample.id}.mp4`);

  try {
    // Download video to temp file (not into memory)
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.status}`);
    }
    await pipeline(
      Readable.fromWeb(videoResponse.body),
      createWriteStream(tmpPath)
    );

    // Upload temp file to Gemini File API
    const uploadedFile = await ai.files.upload({
      file: tmpPath,
      config: { mimeType },
    });

    // Clean up temp file immediately after upload
    try { unlinkSync(tmpPath); } catch {}

    // Wait for processing
    let file = uploadedFile;
    while (file.state === "PROCESSING") {
      await new Promise(r => setTimeout(r, 2000));
      file = await ai.files.get({ name: file.name });
    }

    if (file.state === "FAILED") {
      throw new Error("Gemini file processing failed");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                fileUri: file.uri,
                mimeType,
              },
            },
            { text: ENRICHMENT_PROMPT },
          ],
        },
      ],
    });

    // Clean up uploaded file from Gemini
    try { await ai.files.delete({ name: file.name }); } catch {}

    const text = response.text.trim();

    // Parse JSON (strip code fences if Gemini adds them)
    const cleaned = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
    const enrichment = JSON.parse(cleaned);

    // Write to Supabase
    const { error } = await supabase
      .from("dataset_samples")
      .update({ enrichment_json: enrichment })
      .eq("id", sample.id);

    if (error) {
      console.error(`  ✗ DB write failed for ${sample.id}:`, error.message);
      return false;
    }

    console.log(`  ✓ ${sample.filename} → ${enrichment.task} (${enrichment.domain})`);
    return true;
  } catch (err) {
    // Clean up temp file on error
    try { unlinkSync(tmpPath); } catch {}
    console.error(`  ✗ ${sample.filename}: ${err.message}`);
    return false;
  }
}

async function main() {
  // Fetch samples that need enrichment
  const { data: samples, error } = await supabase
    .from("dataset_samples")
    .select("id, filename, s3_object_key, mime_type")
    .eq("dataset_id", DATASET_ID)
    .not("s3_annotation_key", "is", null)
    .or("enrichment_json.is.null,enrichment_json.eq.{}");

  if (error) {
    console.error("Failed to fetch samples:", error.message);
    process.exit(1);
  }

  console.log(`Found ${samples.length} samples needing enrichment\n`);

  let success = 0;
  let failed = 0;

  for (const sample of samples) {
    console.log(`[${success + failed + 1}/${samples.length}] ${sample.filename}`);
    const ok = await enrichSample(sample);
    if (ok) success++;
    else failed++;

    // Rate limit — 1 second between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nDone: ${success} enriched, ${failed} failed`);
}

main();
