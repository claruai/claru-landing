#!/usr/bin/env tsx
/**
 * render-all.ts — Reads composition-manifest.json and renders each composition
 * to MP4 using Remotion CLI.
 *
 * Usage:
 *   npx tsx scripts/render-all.ts                        # Render all compositions
 *   npx tsx scripts/render-all.ts --composition sol-ego   # Render single composition
 *   npx tsx scripts/render-all.ts --dry-run               # Print commands only
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CompositionEntry {
  id: string;
  type: number;
  render: {
    durationFrames: number;
    fps: number;
    width: number;
    height: number;
    codec: string;
  };
}

interface Manifest {
  compositions: CompositionEntry[];
}

interface RenderResult {
  id: string;
  type: number;
  durationSec: number;
  fileSizeMB: number | null;
  status: "ok" | "warn" | "re-rendered" | "fail";
  error?: string;
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { compositionId: string | null; dryRun: boolean } {
  const args = process.argv.slice(2);
  let compositionId: string | null = null;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--composition" && args[i + 1]) {
      compositionId = args[i + 1];
      i++;
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    }
  }

  return { compositionId, dryRun };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "scripts", "composition-manifest.json");
const ENTRY_POINT = path.join("src", "remotion", "index.ts");
const OUTPUT_DIR = path.join(ROOT, "public", "videos");

function buildRenderCommand(id: string, outputPath: string, crf: number): string {
  const propsJson = JSON.stringify({ compositionId: id });
  return [
    "npx remotion render",
    ENTRY_POINT,
    id,
    outputPath,
    "--codec h264",
    `--crf ${crf}`,
    `--props '${propsJson}'`,
  ].join(" ");
}

function getFileSizeMB(filePath: string): number {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

function renderComposition(
  comp: CompositionEntry,
  dryRun: boolean
): RenderResult {
  const outputPath = path.join(OUTPUT_DIR, `${comp.id}.mp4`);
  const relativeOutput = path.relative(ROOT, outputPath);
  const durationSec = comp.render.durationFrames / comp.render.fps;

  const cmd = buildRenderCommand(comp.id, relativeOutput, 23);

  if (dryRun) {
    console.log(`[dry-run] ${cmd}`);
    return {
      id: comp.id,
      type: comp.type,
      durationSec,
      fileSizeMB: null,
      status: "ok",
    };
  }

  // Render at CRF 23
  try {
    console.log(`\n▶ Rendering ${comp.id} ...`);
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
  } catch (err) {
    return {
      id: comp.id,
      type: comp.type,
      durationSec,
      fileSizeMB: null,
      status: "fail",
      error: String(err),
    };
  }

  // Check file size
  let fileSizeMB = getFileSizeMB(outputPath);

  if (fileSizeMB > 15) {
    console.log(
      `  ⚠ ${comp.id} is ${fileSizeMB.toFixed(1)} MB (> 15 MB) — re-rendering with CRF 28...`
    );
    const reCmd = buildRenderCommand(comp.id, relativeOutput, 28);
    try {
      execSync(reCmd, { cwd: ROOT, stdio: "inherit" });
      fileSizeMB = getFileSizeMB(outputPath);
      return {
        id: comp.id,
        type: comp.type,
        durationSec,
        fileSizeMB,
        status: "re-rendered",
      };
    } catch (err) {
      return {
        id: comp.id,
        type: comp.type,
        durationSec,
        fileSizeMB: null,
        status: "fail",
        error: String(err),
      };
    }
  }

  if (fileSizeMB > 10) {
    console.log(`  ⚠ ${comp.id} is ${fileSizeMB.toFixed(1)} MB (> 10 MB warning threshold)`);
    return { id: comp.id, type: comp.type, durationSec, fileSizeMB, status: "warn" };
  }

  return { id: comp.id, type: comp.type, durationSec, fileSizeMB, status: "ok" };
}

// ---------------------------------------------------------------------------
// Batch runner — renders in batches of 2
// ---------------------------------------------------------------------------

async function renderBatch(
  compositions: CompositionEntry[],
  dryRun: boolean
): Promise<RenderResult[]> {
  const results: RenderResult[] = [];
  const BATCH_SIZE = 2;

  for (let i = 0; i < compositions.length; i += BATCH_SIZE) {
    const batch = compositions.slice(i, i + BATCH_SIZE);
    // Run batch concurrently using Promise.all with spawn-based rendering
    const batchResults = await Promise.all(
      batch.map((comp) => renderInWorker(comp, dryRun))
    );
    results.push(...batchResults);
  }

  return results;
}

function renderInWorker(
  comp: CompositionEntry,
  dryRun: boolean
): Promise<RenderResult> {
  return new Promise((resolve) => {
    if (dryRun) {
      resolve(renderComposition(comp, true));
      return;
    }

    // For actual rendering, use spawn for concurrent execution
    const { spawn } = require("child_process") as typeof import("child_process");
    const outputPath = path.join(OUTPUT_DIR, `${comp.id}.mp4`);
    const relativeOutput = path.relative(ROOT, outputPath);
    const durationSec = comp.render.durationFrames / comp.render.fps;
    const propsJson = JSON.stringify({ compositionId: comp.id });

    console.log(`\n▶ Rendering ${comp.id} ...`);

    const child = spawn(
      "npx",
      [
        "remotion",
        "render",
        ENTRY_POINT,
        comp.id,
        relativeOutput,
        "--codec",
        "h264",
        "--crf",
        "23",
        "--props",
        propsJson,
      ],
      { cwd: ROOT, stdio: "inherit" }
    );

    child.on("close", (code: number | null) => {
      if (code !== 0) {
        resolve({
          id: comp.id,
          type: comp.type,
          durationSec,
          fileSizeMB: null,
          status: "fail",
          error: `Process exited with code ${code}`,
        });
        return;
      }

      let fileSizeMB = getFileSizeMB(outputPath);

      if (fileSizeMB > 15) {
        console.log(
          `  ⚠ ${comp.id} is ${fileSizeMB.toFixed(1)} MB (> 15 MB) — re-rendering with CRF 28...`
        );
        const reChild = spawn(
          "npx",
          [
            "remotion",
            "render",
            ENTRY_POINT,
            comp.id,
            relativeOutput,
            "--codec",
            "h264",
            "--crf",
            "28",
            "--props",
            propsJson,
          ],
          { cwd: ROOT, stdio: "inherit" }
        );

        reChild.on("close", (reCode: number | null) => {
          if (reCode !== 0) {
            resolve({
              id: comp.id,
              type: comp.type,
              durationSec,
              fileSizeMB: null,
              status: "fail",
              error: `Re-render exited with code ${reCode}`,
            });
            return;
          }
          fileSizeMB = getFileSizeMB(outputPath);
          resolve({
            id: comp.id,
            type: comp.type,
            durationSec,
            fileSizeMB,
            status: "re-rendered",
          });
        });
        return;
      }

      if (fileSizeMB > 10) {
        console.log(
          `  ⚠ ${comp.id} is ${fileSizeMB.toFixed(1)} MB (> 10 MB warning threshold)`
        );
        resolve({ id: comp.id, type: comp.type, durationSec, fileSizeMB, status: "warn" });
        return;
      }

      resolve({ id: comp.id, type: comp.type, durationSec, fileSizeMB, status: "ok" });
    });

    child.on("error", (err: Error) => {
      resolve({
        id: comp.id,
        type: comp.type,
        durationSec,
        fileSizeMB: null,
        status: "fail",
        error: err.message,
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Summary table
// ---------------------------------------------------------------------------

function printSummary(results: RenderResult[], dryRun: boolean): void {
  console.log("\n" + "=".repeat(80));
  console.log(dryRun ? "  RENDER SUMMARY (DRY RUN)" : "  RENDER SUMMARY");
  console.log("=".repeat(80));

  const header = [
    "Composition ID".padEnd(24),
    "Type".padEnd(6),
    "Duration(s)".padEnd(13),
    "Size(MB)".padEnd(10),
    "Status",
  ].join(" | ");

  console.log(header);
  console.log("-".repeat(80));

  for (const r of results) {
    const row = [
      r.id.padEnd(24),
      String(r.type).padEnd(6),
      r.durationSec.toFixed(1).padStart(8).padEnd(13),
      r.fileSizeMB !== null ? r.fileSizeMB.toFixed(1).padStart(6).padEnd(10) : "   -   ".padEnd(10),
      r.status,
    ].join(" | ");
    console.log(row);
  }

  console.log("-".repeat(80));

  const total = results.length;
  const ok = results.filter((r) => r.status === "ok").length;
  const warned = results.filter((r) => r.status === "warn").length;
  const reRendered = results.filter((r) => r.status === "re-rendered").length;
  const failed = results.filter((r) => r.status === "fail").length;

  console.log(
    `Total: ${total} | OK: ${ok} | Warn: ${warned} | Re-rendered: ${reRendered} | Failed: ${failed}`
  );
  console.log("=".repeat(80));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { compositionId, dryRun } = parseArgs();

  // Read manifest
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Error: Manifest not found at ${MANIFEST_PATH}`);
    process.exit(1);
  }

  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  let compositions = manifest.compositions;

  // Filter to single composition if --composition flag provided
  if (compositionId) {
    compositions = compositions.filter((c) => c.id === compositionId);
    if (compositions.length === 0) {
      console.error(`Error: Composition "${compositionId}" not found in manifest.`);
      console.error(
        "Available compositions:",
        manifest.compositions.map((c) => c.id).join(", ")
      );
      process.exit(1);
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  console.log(`Rendering ${compositions.length} composition(s)${dryRun ? " (dry run)" : ""}...\n`);

  // Render
  const results = await renderBatch(compositions, dryRun);

  // Print summary
  printSummary(results, dryRun);

  // Exit non-zero if any renders failed
  const failed = results.filter((r) => r.status === "fail");
  if (failed.length > 0) {
    console.error(`\n${failed.length} composition(s) failed to render.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
