// =============================================================================
// AI Media Generation — Nano Banana (images) + Veo 3 (videos)
// Used by the Design Agent to create custom visuals for slides
// =============================================================================

import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GeneratedImage {
  base64: string;
  mimeType: string;
  filename: string;
  localPath: string; // path in public/ for serving
  url: string; // relative URL for use in slides
}

export interface GeneratedVideo {
  filename: string;
  localPath: string;
  url: string;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

function getGoogleAI(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not configured");
  return new GoogleGenAI({ apiKey });
}

// ---------------------------------------------------------------------------
// Image Generation (Nano Banana 2)
// ---------------------------------------------------------------------------

const IMAGE_MODEL = "gemini-2.5-flash-image";

/**
 * Generate an image using Nano Banana (Gemini Flash Image).
 * Returns base64 data + saves to public/images/generated/ for serving.
 */
export async function generateImage(
  prompt: string,
  options?: {
    aspectRatio?: string; // default "16:9"
    size?: string; // "512px" | "1K" | "2K" | "4K", default "2K"
  },
): Promise<GeneratedImage> {
  const ai = getGoogleAI();

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: prompt,
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: options?.aspectRatio ?? "16:9",
        imageSize: options?.size ?? "2K",
      },
    },
  });

  // Extract image data from response
  const candidate = response.candidates?.[0];
  if (!candidate?.content?.parts) {
    throw new Error("No image generated — empty response");
  }

  for (const part of candidate.content.parts) {
    if (part.inlineData?.data) {
      const base64 = part.inlineData.data;
      const mimeType = part.inlineData.mimeType ?? "image/png";
      const ext = mimeType.includes("jpeg") ? "jpg" : "png";
      const filename = `gen-${crypto.randomUUID().slice(0, 8)}.${ext}`;

      // Save to public directory for serving
      const dir = path.join(process.cwd(), "public/images/generated");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const localPath = path.join(dir, filename);
      fs.writeFileSync(localPath, Buffer.from(base64, "base64"));

      return {
        base64,
        mimeType,
        filename,
        localPath,
        url: `/images/generated/${filename}`,
      };
    }
  }

  throw new Error("No image data in response");
}

// ---------------------------------------------------------------------------
// Video Generation (Veo 3)
// ---------------------------------------------------------------------------

const VIDEO_MODEL = "veo-3.0-generate-001";

/**
 * Generate a video using Veo 3.
 * This is async — polls until complete, then saves to public/videos/generated/.
 * Can take 30s-6min depending on complexity.
 */
export async function generateVideo(
  prompt: string,
  options?: {
    aspectRatio?: string; // "16:9" | "9:16"
    duration?: string; // "4" | "6" | "8" seconds
    resolution?: string; // "720p" | "1080p"
  },
): Promise<GeneratedVideo> {
  const ai = getGoogleAI();

  let operation = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt,
    config: {
      aspectRatio: options?.aspectRatio ?? "16:9",
      durationSeconds: parseInt(options?.duration ?? "6"),
      resolution: options?.resolution ?? "720p",
    },
  });

  // Poll for completion (check every 10s, max 6 minutes)
  const maxWait = 360_000;
  const pollInterval = 10_000;
  let waited = 0;

  while (!operation.done && waited < maxWait) {
    await new Promise((r) => setTimeout(r, pollInterval));
    waited += pollInterval;
    operation = await ai.operations.getVideosOperation({ operation });
  }

  if (!operation.done) {
    throw new Error("Video generation timed out after 6 minutes");
  }

  const generatedVideos = operation.response?.generatedVideos;
  if (!generatedVideos || generatedVideos.length === 0) {
    throw new Error("No video generated");
  }

  // Download the video
  const filename = `gen-${crypto.randomUUID().slice(0, 8)}.mp4`;
  const dir = path.join(process.cwd(), "public/videos/generated");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const localPath = path.join(dir, filename);

  await ai.files.download({
    file: generatedVideos[0].video!,
    downloadPath: localPath,
  });

  return {
    filename,
    localPath,
    url: `/videos/generated/${filename}`,
  };
}
