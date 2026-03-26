#!/usr/bin/env tsx
/**
 * render-enrichment-viz.ts — Renders the 4 enrichment-viz 3D compositions
 * and the 3 ffmpeg-composite videos for the enrichment scroll section.
 *
 * Usage:
 *   npx tsx scripts/render-enrichment-viz.ts                   # Render all
 *   npx tsx scripts/render-enrichment-viz.ts --remotion-only   # Only Remotion 3D renders
 *   npx tsx scripts/render-enrichment-viz.ts --ffmpeg-only     # Only ffmpeg composites
 *   npx tsx scripts/render-enrichment-viz.ts --dry-run         # Print commands only
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "..");
const ENTRY_POINT = path.join("src", "remotion", "index.ts");
const OUTPUT_DIR = path.join(ROOT, "public", "videos", "enrichment-viz");

const REMOTION_COMPOSITIONS = [
  "enrichment-pointcloud-flythrough",
  "enrichment-hand-mesh",
  "enrichment-trellis-reconstruction",
  "enrichment-human-fold-mesh",
];

interface FfmpegJob {
  id: string;
  command: string;
}

const FFMPEG_COMPOSITES: FfmpegJob[] = [
  {
    id: "human-to-robot-transfer",
    command: [
      "ffmpeg",
      `-i ${path.join(OUTPUT_DIR, "human-fold.mp4")}`,
      `-i ${path.join(OUTPUT_DIR, "robot-fold.mp4")}`,
      `-filter_complex "[0:v]scale=640:360[left];[1:v]scale=640:360[right];[left][right]hstack=inputs=2"`,
      "-c:v libx264 -crf 22 -pix_fmt yuv420p -t 5 -an",
      `${path.join(OUTPUT_DIR, "human-to-robot-transfer.mp4")} -y`,
    ].join(" "),
  },
  {
    id: "digital-twin",
    command: [
      "ffmpeg",
      `-i ${path.join(OUTPUT_DIR, "real-kitchen.mp4")}`,
      `-i ${path.join(OUTPUT_DIR, "sim-kitchen.mp4")}`,
      `-filter_complex "[0:v]scale=640:360[left];[1:v]scale=640:360[right];[left][right]hstack=inputs=2"`,
      "-c:v libx264 -crf 22 -pix_fmt yuv420p -t 5 -an",
      `${path.join(OUTPUT_DIR, "digital-twin.mp4")} -y`,
    ].join(" "),
  },
  {
    id: "rgb-depth-comparison",
    command: [
      "ffmpeg",
      `-loop 1 -i ${path.join(ROOT, "public", "images", "enrichment-viz", "depth-kitchen-kling.png")} -t 5`,
      `-i ${path.join(OUTPUT_DIR, "raw-kitchen.mp4")}`,
      `-filter_complex "[0:v]scale=640:360[depth];[1:v]scale=640:360,trim=0:5,setpts=PTS-STARTPTS[raw];[raw][depth]hstack=inputs=2"`,
      "-c:v libx264 -crf 22 -pix_fmt yuv420p -t 5 -an",
      `${path.join(OUTPUT_DIR, "rgb-depth-comparison.mp4")} -y`,
    ].join(" "),
  },
];

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    remotionOnly: args.includes("--remotion-only"),
    ffmpegOnly: args.includes("--ffmpeg-only"),
    dryRun: args.includes("--dry-run"),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fileSizeMB(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(1) + " MB";
  } catch {
    return "N/A";
  }
}

function renderRemotionComp(id: string, dryRun: boolean): boolean {
  const output = path.join("public", "videos", "enrichment-viz", `${id}.mp4`);
  const propsJson = JSON.stringify({ compositionId: id });
  const cmd = [
    "npx remotion render",
    ENTRY_POINT,
    id,
    output,
    "--codec h264",
    "--crf 23",
    `--props '${propsJson}'`,
  ].join(" ");

  if (dryRun) {
    console.log(`  [dry-run] ${cmd}`);
    return true;
  }

  console.log(`  Rendering ${id} ...`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    const absOutput = path.join(ROOT, output);
    console.log(`  Done: ${id} (${fileSizeMB(absOutput)})`);
    return true;
  } catch (err) {
    console.error(`  FAILED: ${id}`, err);
    return false;
  }
}

function runFfmpegJob(job: FfmpegJob, dryRun: boolean): boolean {
  if (dryRun) {
    console.log(`  [dry-run] ${job.command}`);
    return true;
  }

  console.log(`  Compositing ${job.id} ...`);
  try {
    execSync(job.command, { cwd: ROOT, stdio: "inherit" });
    const outputPath = path.join(OUTPUT_DIR, `${job.id}.mp4`);
    console.log(`  Done: ${job.id} (${fileSizeMB(outputPath)})`);
    return true;
  } catch (err) {
    console.error(`  FAILED: ${job.id}`, err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const { remotionOnly, ffmpegOnly, dryRun } = parseArgs();

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let totalOk = 0;
  let totalFail = 0;

  // Remotion 3D renders
  if (!ffmpegOnly) {
    console.log("\n=== Remotion 3D Asset Renders ===\n");
    for (const id of REMOTION_COMPOSITIONS) {
      const ok = renderRemotionComp(id, dryRun);
      if (ok) totalOk++;
      else totalFail++;
    }
  }

  // ffmpeg composites
  if (!remotionOnly) {
    console.log("\n=== ffmpeg Side-by-Side Composites ===\n");
    for (const job of FFMPEG_COMPOSITES) {
      const ok = runFfmpegJob(job, dryRun);
      if (ok) totalOk++;
      else totalFail++;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("  ENRICHMENT VIZ RENDER SUMMARY");
  console.log("=".repeat(60));

  console.log("\n  Output files:");
  const allIds = [
    ...(!ffmpegOnly ? REMOTION_COMPOSITIONS : []),
    ...(!remotionOnly ? FFMPEG_COMPOSITES.map((j) => j.id) : []),
  ];
  for (const id of allIds) {
    const outputPath = path.join(OUTPUT_DIR, `${id}.mp4`);
    const exists = fs.existsSync(outputPath);
    console.log(
      `  ${exists ? "OK" : "MISSING"}  ${id}.mp4  ${exists ? fileSizeMB(outputPath) : ""}`
    );
  }

  console.log(`\n  Total: ${totalOk + totalFail} | OK: ${totalOk} | Failed: ${totalFail}`);
  console.log("=".repeat(60));

  if (totalFail > 0) process.exit(1);
}

main();
