// ---------------------------------------------------------------------------
// Academic Alternatives Registry
// ---------------------------------------------------------------------------

import type { AcademicAltPageData } from "../types";

const modules: Record<string, AcademicAltPageData> = {};

function register(page: AcademicAltPageData): void {
  if (modules[page.slug]) {
    throw new Error(`[academic-alts] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: AcademicAltPageData): void {
  const totalWords = [
    page.heroSubtitle,
    page.claruRelevance,
    ...page.sections.flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    }),
  ]
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 400) {
    console.warn(
      `[academic-alts] WARNING: Page "${page.slug}" has ${totalWords} words (target: 800+)`
    );
  }

  if (page.faqs.length < 3 || page.faqs.length > 5) {
    console.warn(
      `[academic-alts] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3-5)`
    );
  }

  if (page.limitations.length < 3) {
    console.warn(
      `[academic-alts] WARNING: Page "${page.slug}" has ${page.limitations.length} limitations (expected 3+)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import ego4d from "./ego4d-alternative";
import epicKitchens from "./epic-kitchens-alternative";
import bridgedataV2 from "./bridgedata-v2-alternative";
import openXEmbodiment from "./open-x-embodiment-alternative";
import droid from "./droid-alternative";
import somethingSomethingV2 from "./something-something-v2-alternative";
import robonet from "./robonet-alternative";
import robomimic from "./robomimic-alternative";
import maniskill from "./maniskill-alternative";
import calvin from "./calvin-alternative";
import habitat from "./habitat-alternative";
import rlbench from "./rlbench-alternative";
import robocasa from "./robocasa-alternative";
import libero from "./libero-alternative";
import rh20t from "./rh20t-alternative";
import languageTable from "./language-table-alternative";
import bcz from "./bc-z-alternative";
import fractal from "./fractal-alternative";
import kuka from "./kuka-alternative";
import toto from "./toto-alternative";

[
  ego4d, epicKitchens, bridgedataV2, openXEmbodiment, droid,
  somethingSomethingV2, robonet, robomimic, maniskill, calvin,
  habitat, rlbench, robocasa, libero, rh20t, languageTable,
  bcz, fractal, kuka, toto,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getAcademicAltPage(slug: string): AcademicAltPageData | null {
  return modules[slug] ?? null;
}

export function getAllAcademicAltPages(): AcademicAltPageData[] {
  return Object.values(modules);
}

export function getAllAcademicAltSlugs(): string[] {
  return Object.keys(modules);
}
