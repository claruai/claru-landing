// ---------------------------------------------------------------------------
// Benchmark Page Registry (Wave 4)
// ---------------------------------------------------------------------------

import type { BenchmarkPageData } from "./types";

const modules: Record<string, BenchmarkPageData> = {};

function register(page: BenchmarkPageData): void {
  if (modules[page.slug]) {
    throw new Error(`[benchmarks] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: BenchmarkPageData): void {
  const totalWords = [
    page.benchmarkDescription,
    page.taskSet,
    page.observationSpace,
    page.actionSpace,
    page.evaluationProtocol,
    page.simToRealGap,
    page.realWorldDataNeeds,
    page.technicalAnalysis,
    page.heroSubtitle,
    ...page.complementaryDatasets.map((d) => d.rationale),
    ...page.sections.flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    }),
  ]
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 600) {
    console.warn(
      `[benchmarks] WARNING: Page "${page.slug}" has ${totalWords} words (target: 600+)`
    );
  }

  if (page.faqs.length < 3) {
    console.warn(
      `[benchmarks] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3+)`
    );
  }

  if (page.keyPapers.length < 2) {
    console.warn(
      `[benchmarks] WARNING: Page "${page.slug}" has ${page.keyPapers.length} key papers (expected 2+)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import rlbench from "./rlbench";
import calvin from "./calvin";
import maniskill from "./maniskill";
import colosseum from "./colosseum";
import habitatBenchmark from "./habitat-benchmark";
import metaworld from "./metaworld";
import robosuite from "./robosuite";
import libero from "./libero";
import sapien from "./sapien";
import vlabench from "./vlabench";
import robocasa from "./robocasa";
import simplerEnv from "./simpler-env";
import realRobotChallenge from "./real-robot-challenge";
import dexart from "./dexart";
import furnitureBench from "./furniture-bench";
import robosuiteBenchmark from "./robosuite-benchmark";
import dexartBenchmark from "./dexart-benchmark";
import adroit from "./adroit";
import dmControl from "./dm-control";
import furnitureBenchBenchmark from "./furniture-bench-benchmark";
import biDexhands from "./bi-dexhands";
import arnold from "./arnold";
import partnetMobility from "./partnet-mobility";

[
  rlbench, calvin, maniskill, colosseum, habitatBenchmark,
  metaworld, robosuite, libero, sapien, vlabench,
  robocasa, simplerEnv, realRobotChallenge, dexart, furnitureBench,
  robosuiteBenchmark, dexartBenchmark, adroit, dmControl,
  furnitureBenchBenchmark, biDexhands, arnold, partnetMobility,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getBenchmarkPage(slug: string): BenchmarkPageData | null {
  return modules[slug] ?? null;
}

export function getAllBenchmarkPages(): BenchmarkPageData[] {
  return Object.values(modules);
}

export function getAllBenchmarkSlugs(): string[] {
  return Object.keys(modules);
}
