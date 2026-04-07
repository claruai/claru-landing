// ---------------------------------------------------------------------------
// Lab Page Registry (Wave 4)
// ---------------------------------------------------------------------------

import type { LabPageData } from "./types";

const modules: Record<string, LabPageData> = {};

function register(page: LabPageData): void {
  if (modules[page.slug]) {
    throw new Error(`[labs] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: LabPageData): void {
  const totalWords = [
    page.companyDescription,
    page.dataNeedsSummary,
    page.technicalAnalysis,
    page.heroSubtitle,
    ...page.dataNeeds.map((d) => d.description),
    ...page.dataMatches.map((m) => m.rationale),
    ...page.sections.flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    }),
  ]
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 600) {
    console.warn(
      `[labs] WARNING: Page "${page.slug}" has ${totalWords} words (target: 600+)`
    );
  }

  if (page.faqs.length < 3) {
    console.warn(
      `[labs] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3+)`
    );
  }

  if (page.keyPapers.length < 2) {
    console.warn(
      `[labs] WARNING: Page "${page.slug}" has ${page.keyPapers.length} key papers (expected 2+)`
    );
  }

  if (page.dataNeeds.length < 2) {
    console.warn(
      `[labs] WARNING: Page "${page.slug}" has ${page.dataNeeds.length} data needs (expected 2+)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import figureAi from "./figure-ai";
import agilityRobotics from "./agility-robotics";
import oneXTechnologies from "./1x-technologies";
import bostonDynamics from "./boston-dynamics";
import unitree from "./unitree";
import apptronik from "./apptronik";
import sanctuaryAi from "./sanctuary-ai";
import cobot from "./cobot";
import physicalIntelligence from "./physical-intelligence";
import skildAi from "./skild-ai";
import toyotaResearch from "./toyota-research";
import nvidiaIsaac from "./nvidia-isaac";
import googleDeepMindRobotics from "./google-deepmind-robotics";
import metaFairRobotics from "./meta-fair-robotics";
import berkeleyAutolab from "./berkeley-autolab";
import stanfordSail from "./stanford-sail";
import mitCsailRobotics from "./mit-csail-robotics";
import cmuRobotics from "./cmu-robotics";
import kaistRobotics from "./kaist-robotics";
import tsinghuaRobotics from "./tsinghua-robotics";
import covariant from "./covariant";
import righthandRobotics from "./righthand-robotics";
import anybotics from "./anybotics";
import berkshireGrey from "./berkshire-grey";
import realtimeRobotics from "./realtime-robotics";
import collaborativeRobotics from "./collaborative-robotics";
import dexterityAi from "./dexterity-ai";
import flexiv from "./flexiv";

[
  figureAi, agilityRobotics, oneXTechnologies, bostonDynamics, unitree,
  apptronik, sanctuaryAi, cobot, physicalIntelligence, skildAi,
  toyotaResearch, nvidiaIsaac, googleDeepMindRobotics, metaFairRobotics,
  berkeleyAutolab, stanfordSail, mitCsailRobotics, cmuRobotics,
  kaistRobotics, tsinghuaRobotics,
  covariant, righthandRobotics, anybotics, berkshireGrey,
  realtimeRobotics, collaborativeRobotics, dexterityAi, flexiv,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getLabPage(slug: string): LabPageData | null {
  return modules[slug] ?? null;
}

export function getAllLabPages(): LabPageData[] {
  return Object.values(modules);
}

export function getAllLabSlugs(): string[] {
  return Object.keys(modules);
}
