import { config } from "dotenv";
config({ path: ".env.local" });

import { generateVideo } from "../src/lib/deck-builder/media-generation";

async function testVideo() {
  console.log("Testing Veo 3 video generation...");
  console.log("This may take 30s-2min...\n");

  const start = Date.now();

  try {
    const result = await generateVideo(
      "Slow cinematic flythrough of abstract data visualization. Glowing sage green particles flowing through dark space, forming neural network connections. Minimal, premium feel. Dark background.",
      { aspectRatio: "16:9", duration: "4" }
    );

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`SUCCESS! (${elapsed}s)`);
    console.log("  Filename:", result.filename);
    console.log("  URL:", result.url);
    console.log("  Path:", result.localPath);
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.error(`FAILED after ${elapsed}s:`, err instanceof Error ? err.message : err);
  }
}

testVideo();
