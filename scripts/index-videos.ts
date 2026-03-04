#!/usr/bin/env npx tsx
/**
 * Run once to index all site videos with Gemini.
 * Usage: npx tsx scripts/index-videos.ts
 *
 * Analyzes each video and saves descriptions + tags to
 * src/lib/deck-builder/video-index-cache.json
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { indexAllVideosWithGemini } from "../src/lib/deck-builder/video-index";

async function main() {
  console.log("Starting video indexing with Gemini...\n");

  const start = Date.now();
  const index = await indexAllVideosWithGemini();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`\nDone! Indexed ${index.length} videos in ${elapsed}s`);
  console.log("\nSample results:");
  index.slice(0, 5).forEach((v) => {
    console.log(`  ${v.filename}: ${v.description}`);
    console.log(`    tags: ${v.tags.join(", ")}`);
  });
}

main().catch(console.error);
