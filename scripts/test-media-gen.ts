import { config } from "dotenv";
config({ path: ".env.local" });

import { generateImage } from "../src/lib/deck-builder/media-generation";

async function testImage() {
  console.log("Testing Nano Banana image generation...\n");

  try {
    const result = await generateImage(
      "Dark, minimal abstract visualization of data flowing through neural networks. Sage green (#92B090) glowing particles and connection lines on near-black (#0a0908) background. Premium, cinematic feel. No text.",
      { aspectRatio: "16:9", size: "1K" }
    );

    console.log("SUCCESS!");
    console.log("  Filename:", result.filename);
    console.log("  URL:", result.url);
    console.log("  Path:", result.localPath);
    console.log("  MIME:", result.mimeType);
  } catch (err) {
    console.error("FAILED:", err instanceof Error ? err.message : err);
  }
}

testImage();
