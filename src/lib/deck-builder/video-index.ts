// =============================================================================
// Video Index — Uses Gemini to analyze video content and store descriptions
// Pre-indexes all site videos so the slide agent knows what's in each file
// =============================================================================

import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VideoMetadata {
  path: string; // e.g. "/videos/mosaic/mosaic-01.mp4"
  filename: string;
  category: "mosaic" | "bento" | "case-study" | "work";
  description: string; // Gemini-generated description
  tags: string[]; // e.g. ["cooking", "kitchen", "overhead"]
}

// ---------------------------------------------------------------------------
// In-memory cache of video descriptions
// ---------------------------------------------------------------------------

let videoIndex: VideoMetadata[] | null = null;
const INDEX_FILE = path.join(
  process.cwd(),
  "src/lib/deck-builder/video-index-cache.json",
);

/**
 * Get the video index. Loads from cache file if available.
 */
export function getVideoIndex(): VideoMetadata[] {
  if (videoIndex) return videoIndex;

  // Try loading from cache
  try {
    if (fs.existsSync(INDEX_FILE)) {
      const data = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
      videoIndex = data as VideoMetadata[];
      return videoIndex;
    }
  } catch {}

  // No cache — return basic index without descriptions
  videoIndex = buildBasicIndex();
  return videoIndex;
}

/**
 * Search the video index by query string. Matches against description and tags.
 */
export function searchVideos(
  query: string,
  category?: string,
): VideoMetadata[] {
  const index = getVideoIndex();
  const q = query.toLowerCase();

  return index.filter((v) => {
    if (category && v.category !== category) return false;
    return (
      v.description.toLowerCase().includes(q) ||
      v.tags.some((t) => t.includes(q)) ||
      v.filename.toLowerCase().includes(q) ||
      v.path.toLowerCase().includes(q)
    );
  });
}

/**
 * Get videos by category with descriptions.
 */
export function getVideosByCategory(
  category: string,
): VideoMetadata[] {
  const index = getVideoIndex();
  if (category === "all") return index;
  return index.filter((v) => v.category === category);
}

// ---------------------------------------------------------------------------
// Basic index (no Gemini descriptions)
// ---------------------------------------------------------------------------

function buildBasicIndex(): VideoMetadata[] {
  const videos: VideoMetadata[] = [];

  // Mosaic clips
  for (let i = 1; i <= 24; i++) {
    videos.push({
      path: `/videos/mosaic/mosaic-${String(i).padStart(2, "0")}.mp4`,
      filename: `mosaic-${String(i).padStart(2, "0")}.mp4`,
      category: "mosaic",
      description: "Egocentric video clip (not yet analyzed)",
      tags: ["egocentric", "first-person"],
    });
  }

  // Bento
  const bentoFiles = [
    { file: "bento-annotation-interface.mp4", desc: "Live annotation tool UI" },
    { file: "bento-autonomous-driving.mp4", desc: "Autonomous driving annotation" },
    { file: "bento-frame-tracking.mp4", desc: "Frame-by-frame video tracking" },
    { file: "bento-robot-arm.mp4", desc: "Robot arm manipulation annotation" },
  ];
  for (const b of bentoFiles) {
    videos.push({
      path: `/videos/${b.file}`,
      filename: b.file,
      category: "bento",
      description: b.desc,
      tags: ["annotation", "bento", "ui"],
    });
  }

  // Case studies
  const caseStudyFiles = [
    { file: "case-study-egocentric-smartphone.mp4", desc: "Egocentric smartphone capture" },
    { file: "case-study-workplace-barista-web.mp4", desc: "Workplace barista footage" },
    { file: "case-study-game-gameplay-web.mp4", desc: "Game-based capture gameplay" },
    { file: "case-study-game-inputviz-web.mp4", desc: "Game input visualization" },
    { file: "case-study-eval-videoA.mp4", desc: "Video model evaluation A" },
    { file: "case-study-eval-videoB.mp4", desc: "Video model evaluation B" },
    { file: "case-study-eval-pose.mp4", desc: "Pose estimation evaluation" },
    { file: "case-study-prompt-video1.mp4", desc: "Prompt enhancement output 1" },
    { file: "case-study-prompt-video2.mp4", desc: "Prompt enhancement output 2" },
    { file: "case-study-redteam-output.mp4", desc: "Red team testing output" },
    { file: "case-study-safety-bird.mp4", desc: "Safety annotation example" },
  ];
  for (const cs of caseStudyFiles) {
    videos.push({
      path: `/videos/${cs.file}`,
      filename: cs.file,
      category: "case-study",
      description: cs.desc,
      tags: ["case-study"],
    });
  }

  // Work categories
  const workFiles = [
    { file: "annotate.mp4", desc: "Data annotation workflow" },
    { file: "quality-review.mp4", desc: "Quality review process" },
    { file: "capture-videos.mp4", desc: "Video capture in the field" },
    { file: "gaming.mp4", desc: "Gaming data capture" },
  ];
  for (const w of workFiles) {
    videos.push({
      path: `/videos/${w.file}`,
      filename: w.file,
      category: "work",
      description: w.desc,
      tags: ["work"],
    });
  }

  return videos;
}

// ---------------------------------------------------------------------------
// Gemini video analysis — run once to populate descriptions
// ---------------------------------------------------------------------------

/**
 * Analyze all videos with Gemini and save the index to cache.
 * This is expensive (~$0.50 total) — run it once, then use the cache.
 */
export async function indexAllVideosWithGemini(): Promise<VideoMetadata[]> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not configured");

  const ai = new GoogleGenAI({ apiKey });
  const publicDir = path.join(process.cwd(), "public");
  const index = buildBasicIndex();

  console.log(`Indexing ${index.length} videos with Gemini...`);

  // Process in batches of 4 to avoid rate limits
  for (let i = 0; i < index.length; i += 4) {
    const batch = index.slice(i, i + 4);
    await Promise.all(
      batch.map(async (video) => {
        const filePath = path.join(publicDir, video.path);
        if (!fs.existsSync(filePath)) {
          console.warn(`File not found: ${filePath}`);
          return;
        }

        try {
          const fileBuffer = fs.readFileSync(filePath);
          const base64 = fileBuffer.toString("base64");

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      mimeType: "video/mp4",
                      data: base64,
                    },
                  },
                  {
                    text: "Describe this video in 1-2 sentences for a slide deck builder. What is shown? (e.g. 'A person cooking pasta in a kitchen, overhead egocentric view'). Then list 3-5 tags as comma-separated words.",
                  },
                ],
              },
            ],
          });

          const text = response.text ?? "";
          const lines = text.split("\n").filter((l: string) => l.trim());
          video.description =
            lines[0]?.replace(/^description:\s*/i, "").trim() ??
            video.description;

          // Extract tags from the last line
          const tagLine = lines.find(
            (l: string) =>
              l.toLowerCase().includes("tag") || l.includes(","),
          );
          if (tagLine) {
            video.tags = tagLine
              .replace(/^tags?:\s*/i, "")
              .split(",")
              .map((t: string) => t.trim().toLowerCase())
              .filter(Boolean)
              .slice(0, 5);
          }

          console.log(`✓ ${video.filename}: ${video.description.slice(0, 60)}...`);
        } catch (err) {
          console.error(
            `✗ ${video.filename}: ${err instanceof Error ? err.message : "error"}`,
          );
        }
      }),
    );

    // Small delay between batches
    if (i + 4 < index.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Save to cache
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  videoIndex = index;
  console.log(`Index saved to ${INDEX_FILE}`);

  return index;
}
