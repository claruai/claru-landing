// ---------------------------------------------------------------------------
// Industry Vertical Page Registry
// ---------------------------------------------------------------------------

import type { IndustryPageData } from "./types";

const modules: Record<string, IndustryPageData> = {};

function register(page: IndustryPageData): void {
  if (modules[page.slug]) {
    throw new Error(`[industries] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: IndustryPageData): void {
  const totalWords = page.sections
    .flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    })
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 100) {
    console.warn(
      `[industries] WARNING: Page "${page.slug}" has ${totalWords} words in prose sections (target: 800+)`
    );
  }

  if (page.faqs.length < 3) {
    console.warn(
      `[industries] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3-5)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import healthcareRobotics from "./healthcare-robotics";
import agriculturalRobotics from "./agricultural-robotics";
import warehouseLogistics from "./warehouse-logistics";
import retailAutomation from "./retail-automation";
import constructionRobotics from "./construction-robotics";
import manufacturingRobotics from "./manufacturing-robotics";
import foodServiceRobotics from "./food-service-robotics";
import defenseRobotics from "./defense-robotics";
import spaceRobotics from "./space-robotics";
import underwaterRobotics from "./underwater-robotics";
import miningRobotics from "./mining-robotics";
import energyRobotics from "./energy-robotics";
import consumerElectronics from "./consumer-electronics";
import automotiveRobotics from "./automotive-robotics";
import hospitalityRobotics from "./hospitality-robotics";

[
  healthcareRobotics, agriculturalRobotics, warehouseLogistics,
  retailAutomation, constructionRobotics, manufacturingRobotics,
  foodServiceRobotics, defenseRobotics, spaceRobotics, underwaterRobotics,
  miningRobotics, energyRobotics, consumerElectronics, automotiveRobotics,
  hospitalityRobotics,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getIndustryPage(slug: string): IndustryPageData | null {
  return modules[slug] ?? null;
}

export function getAllIndustryPages(): IndustryPageData[] {
  return Object.values(modules);
}

export function getAllIndustrySlugs(): string[] {
  return Object.keys(modules);
}
