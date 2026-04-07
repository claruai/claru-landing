// ---------------------------------------------------------------------------
// Models Registry
// ---------------------------------------------------------------------------

import type { ModelPageData } from "../types";

const modules: Record<string, ModelPageData> = {};

function register(page: ModelPageData): void {
  if (modules[page.slug]) {
    throw new Error(`[models] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: ModelPageData): void {
  const totalWords = [
    page.heroSubtitle,
    page.dataVolumeBenchmarks,
    page.trainingRecipe,
    page.claruIntegration,
    ...page.sections.flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    }),
  ]
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 400) {
    console.warn(
      `[models] WARNING: Page "${page.slug}" has ${totalWords} words (target: 800+)`
    );
  }

  if (page.faqs.length < 3 || page.faqs.length > 5) {
    console.warn(
      `[models] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3-5)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import openvla from "./openvla";
import rt2 from "./rt-2";
import octo from "./octo";
import piZero from "./pi-zero";
import grootN1 from "./groot-n1";
import diffusionPolicyModel from "./diffusion-policy-model";
import actAloha from "./act-aloha";
import rt1 from "./rt-1";
import bridgedataV2Model from "./bridgedata-v2-model";
import gato from "./gato";
import palmE from "./palm-e";
import robocat from "./robocat";
import roboflamingo from "./roboflamingo";
import voltron from "./voltron";
import r3m from "./r3m";
import mvp from "./mvp";
import vc1 from "./vc-1";
import theia from "./theia";
import susie from "./susie";
import genima from "./genima";
import gr2 from "./gr2";
import humanplusModel from "./humanplus-model";
import crossformer from "./crossformer";
import hpt from "./hpt";
import pi05 from "./pi-0-5";

[
  openvla, rt2, octo, piZero, grootN1, diffusionPolicyModel, actAloha,
  rt1, bridgedataV2Model, gato, palmE, robocat, roboflamingo, voltron,
  r3m, mvp, vc1, theia, susie, genima, gr2, humanplusModel, crossformer,
  hpt, pi05,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getModelPage(slug: string): ModelPageData | null {
  return modules[slug] ?? null;
}

export function getAllModelPages(): ModelPageData[] {
  return Object.values(modules);
}

export function getAllModelSlugs(): string[] {
  return Object.keys(modules);
}
