/**
 * Enrich dataset samples using Gemini image analysis (frame extraction).
 *
 * For large videos that can't be uploaded to Gemini's File API,
 * extracts 3 frames via ffmpeg, sends them to Gemini for analysis.
 */

import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { execSync } from "node:child_process";
import { readFileSync, unlinkSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATASET_ID = "eb07cf5b-55b1-45ec-a513-65b9e78956de";
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function getVideoUrl(key) {
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
  }
  return key;
}

const ENRICHMENT_PROMPT = `These are 3 frames extracted from an egocentric (first-person) video. Analyze them and produce a JSON object:

{
  "task": "short_snake_case_task_name",
  "task_description": "2-3 sentence description of what the person is doing",
  "domain": "one of: kitchen_food_prep, household_living, workplace_industrial, outdoor_navigation, personal_care, laundry_clothing, skilled_trade, retail_commercial",
  "environment_label": "one of: indoor_home, indoor_workplace, indoor_commercial, outdoor_urban, outdoor_rural, vehicle",
  "environment_description": "1-2 sentence description of the physical environment",
  "hands": {
    "hands_visible": true/false,
    "primary_hand": "left" or "right" or "both",
    "right_hand_pct": estimated percentage (0-100),
    "left_hand_pct": estimated percentage (0-100),
    "both_hands_pct": estimated percentage (0-100),
    "no_hand_pct": estimated percentage (0-100),
    "active_manipulation": true if hands are manipulating objects,
    "confidence": 0.0 to 1.0
  },
  "technical_specs": {
    "duration_s": null,
    "resolution_px": {"width": null, "height": null},
    "fps_estimate": null,
    "aspect_ratio": "16:9"
  }
}

Return ONLY the JSON object, no markdown.`;

const tmpDir = join(tmpdir(), 'enrich-frames');
try { mkdirSync(tmpDir, { recursive: true }); } catch {}

async function enrichSample(sample) {
  const videoUrl = getVideoUrl(sample.s3_object_key);
  const frameDir = join(tmpDir, sample.id);
  try { mkdirSync(frameDir, { recursive: true }); } catch {}

  try {
    // Extract 3 frames using ffmpeg directly from URL
    // Frame at 1s, 5s, 10s
    for (const [i, time] of ['1', '5', '10'].entries()) {
      try {
        execSync(
          `ffmpeg -ss ${time} -i "${videoUrl}" -frames:v 1 -q:v 2 "${join(frameDir, `frame${i}.jpg`)}" -y 2>/dev/null`,
          { timeout: 30000 }
        );
      } catch {
        // If video is shorter than the timestamp, skip
      }
    }

    // Read frames that were extracted
    const frameParts = [];
    for (let i = 0; i < 3; i++) {
      const framePath = join(frameDir, `frame${i}.jpg`);
      try {
        const data = readFileSync(framePath);
        frameParts.push({
          inlineData: {
            data: data.toString('base64'),
            mimeType: 'image/jpeg',
          },
        });
      } catch {
        // Frame didn't extract (video too short)
      }
    }

    if (frameParts.length === 0) {
      throw new Error("No frames extracted");
    }

    // Send frames to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            ...frameParts,
            { text: ENRICHMENT_PROMPT },
          ],
        },
      ],
    });

    const text = response.text.trim();
    const cleaned = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
    const enrichment = JSON.parse(cleaned);

    // Write to Supabase
    const { error } = await supabase
      .from("dataset_samples")
      .update({ enrichment_json: enrichment })
      .eq("id", sample.id);

    if (error) {
      console.error(`  ✗ DB write failed: ${error.message}`);
      return false;
    }

    console.log(`  ✓ ${sample.filename} → ${enrichment.task} (${enrichment.domain})`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${sample.filename}: ${err.message}`);
    return false;
  } finally {
    // Cleanup frames
    for (let i = 0; i < 3; i++) {
      try { unlinkSync(join(frameDir, `frame${i}.jpg`)); } catch {}
    }
  }
}

async function main() {
  const { data: samples, error } = await supabase
    .from("dataset_samples")
    .select("id, filename, s3_object_key, mime_type")
    .eq("dataset_id", DATASET_ID)
    .not("s3_annotation_key", "is", null)
    .or("enrichment_json.is.null,enrichment_json.eq.{}");

  if (error) {
    console.error("Failed to fetch:", error.message);
    process.exit(1);
  }

  console.log(`Found ${samples.length} samples needing enrichment\n`);

  let success = 0, failed = 0;
  for (const sample of samples) {
    console.log(`[${success + failed + 1}/${samples.length}] ${sample.filename}`);
    const ok = await enrichSample(sample);
    if (ok) success++; else failed++;
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone: ${success} enriched, ${failed} failed`);
}

main();
