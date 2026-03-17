/**
 * Enrich Panda/Web Video Scene Clips samples with rich structured annotations
 * via Gemini frame analysis — foreground, background, objects, actions, etc.
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
const DATASET_ID = "15e8869f-186e-4905-b516-1f9868143ede";
const S3_BUCKET = "moonvalley-ml-datasets";
const AWS_REGION = "us-east-1";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: AWS_REGION });

async function getPresignedUrl(key) {
  const cmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: 3600 });
}

const PROMPT = `Analyze these 3 frames from a video clip. Produce a rich JSON annotation that would be valuable for AI researchers studying video understanding:

{
  "scene_description": "2-3 sentence detailed description of what's happening in this video clip",
  "foreground": "What's in the foreground — main subjects, their appearance, what they're doing",
  "middleground": "What's in the middle layer — secondary elements, supporting objects or people",
  "background": "What's in the background — environment, setting, distant elements, sky, architecture",
  "objects_detected": ["list", "of", "key", "objects", "visible"],
  "actions": ["list", "of", "actions", "or", "events", "happening"],
  "scene_type": "one of: indoor, outdoor, aerial, studio, mixed",
  "lighting": "description of lighting — natural/artificial, time of day, quality",
  "camera_movement": "one of: static, pan, zoom, tracking, aerial, handheld",
  "mood": "overall mood, tone, or atmosphere",
  "text_overlay": "any visible text, watermarks, logos, or graphics (null if none)",
  "content_category": "one of: news, nature, lifestyle, sports, education, entertainment, documentary, commercial, other",
  "temporal_changes": "what changes between the 3 frames — movement, transitions, new elements"
}

Return ONLY the JSON, no markdown.`;

const tmpDir = join(tmpdir(), 'panda-enrich');
try { mkdirSync(tmpDir, { recursive: true }); } catch {}

async function enrichSample(sample) {
  const videoUrl = await getPresignedUrl(sample.s3_object_key);
  const frameDir = join(tmpDir, sample.id);
  try { mkdirSync(frameDir, { recursive: true }); } catch {}

  try {
    // Extract 3 frames via ffmpeg from S3 URL
    for (const [i, time] of ['1', '4', '8'].entries()) {
      try {
        execSync(
          `ffmpeg -ss ${time} -i "${videoUrl}" -frames:v 1 -q:v 2 "${join(frameDir, `frame${i}.jpg`)}" -y 2>/dev/null`,
          { timeout: 30000 }
        );
      } catch {}
    }

    const frameParts = [];
    for (let i = 0; i < 3; i++) {
      try {
        const data = readFileSync(join(frameDir, `frame${i}.jpg`));
        frameParts.push({
          inlineData: { data: data.toString('base64'), mimeType: 'image/jpeg' },
        });
      } catch {}
    }

    if (frameParts.length === 0) throw new Error("No frames extracted");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [...frameParts, { text: PROMPT }] }],
    });

    const text = response.text.trim();
    const cleaned = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
    const annotation = JSON.parse(cleaned);

    // Merge into existing enrichment
    const { data: existing } = await supabase
      .from("dataset_samples")
      .select("enrichment_json")
      .eq("id", sample.id)
      .single();

    const merged = {
      ...(existing?.enrichment_json || {}),
      scene_analysis: annotation,
    };

    const { error } = await supabase
      .from("dataset_samples")
      .update({ enrichment_json: merged })
      .eq("id", sample.id);

    if (error) throw new Error(`DB: ${error.message}`);

    console.log(`  ✓ ${sample.filename} → ${annotation.content_category} | ${annotation.scene_type}`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${sample.filename}: ${err.message}`);
    return false;
  } finally {
    for (let i = 0; i < 3; i++) {
      try { unlinkSync(join(frameDir, `frame${i}.jpg`)); } catch {}
    }
  }
}

async function main() {
  const { data: samples } = await supabase
    .from("dataset_samples")
    .select("id, filename, s3_object_key")
    .eq("dataset_id", DATASET_ID);

  console.log(`Enriching ${samples.length} samples with scene analysis\n`);

  let ok = 0, fail = 0;
  for (const sample of samples) {
    console.log(`[${ok + fail + 1}/${samples.length}] ${sample.filename}`);
    (await enrichSample(sample)) ? ok++ : fail++;
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone: ${ok} enriched, ${fail} failed`);
}

main();
