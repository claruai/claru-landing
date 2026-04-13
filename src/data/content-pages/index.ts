// ---------------------------------------------------------------------------
// Content Page Registry
// ---------------------------------------------------------------------------
// Central registry for all /solutions/[slug] content pages. Each page is a
// separate file in this directory that default-exports a ContentPageData
// object. To add a new page:
//
//   1. Create src/data/content-pages/{slug}.ts with a default export
//   2. Add one import line below
//   3. Add one entry to PAGE_IMPORTS
//
// The registry validates data integrity at load time (build time) so that
// broken references fail fast rather than at runtime.
// ---------------------------------------------------------------------------

import type { ContentPageData } from "./types";
import { caseStudyExists } from "@/lib/case-studies-server";

// ---------------------------------------------------------------------------
// Page Imports — add one line per page file
// ---------------------------------------------------------------------------

import egocentricVideoData from "./egocentric-video-data";
import expertRlhfAnnotation from "./expert-rlhf-annotation";
import manipulationTrajectoryData from "./manipulation-trajectory-data";
import redTeamingData from "./red-teaming-data";
import simToRealData from "./sim-to-real-data";
import teleoperationData from "./teleoperation-data";
import videoGenerationTrainingData from "./video-generation-training-data";
import vlaTrainingData from "./vla-training-data";
import openDatasetsVsCustom from "./open-datasets-vs-custom";
import crowdsourcedVsExpertRlhf from "./crowdsourced-vs-expert-rlhf";
import euAiActRedTeaming from "./eu-ai-act-red-teaming";
import humanoidRobotTrainingData from "./humanoid-robot-training-data";
import graspingDatasetCommercial from "./grasping-dataset-commercial";
import kitchenManipulationData from "./kitchen-manipulation-data";
import warehouseRoboticsData from "./warehouse-robotics-data";
import multiRobotTrainingData from "./multi-robot-training-data";
import languageConditionedRobotData from "./language-conditioned-robot-data";
import depthSensingTrainingData from "./depth-sensing-training-data";
import safetyCriticalRobotData from "./safety-critical-robot-data";

// ---------------------------------------------------------------------------
// Page Map — add one entry per page file
// ---------------------------------------------------------------------------
// Using a simple Record so that adding a page is a single-line addition.
// Each key is the slug; each value is the imported ContentPageData.

const PAGE_MAP: Record<string, ContentPageData> = {
  "egocentric-video-data": egocentricVideoData,
  "expert-rlhf-annotation": expertRlhfAnnotation,
  "manipulation-trajectory-data": manipulationTrajectoryData,
  "red-teaming-data": redTeamingData,
  "sim-to-real-data": simToRealData,
  "teleoperation-data": teleoperationData,
  "video-generation-training-data": videoGenerationTrainingData,
  "vla-training-data": vlaTrainingData,
  "open-datasets-vs-custom": openDatasetsVsCustom,
  "crowdsourced-vs-expert-rlhf": crowdsourcedVsExpertRlhf,
  "eu-ai-act-red-teaming": euAiActRedTeaming,
  "humanoid-robot-training-data": humanoidRobotTrainingData,
  "grasping-dataset-commercial": graspingDatasetCommercial,
  "kitchen-manipulation-data": kitchenManipulationData,
  "warehouse-robotics-data": warehouseRoboticsData,
  "multi-robot-training-data": multiRobotTrainingData,
  "language-conditioned-robot-data": languageConditionedRobotData,
  "depth-sensing-training-data": depthSensingTrainingData,
  "safety-critical-robot-data": safetyCriticalRobotData,
};

// ---------------------------------------------------------------------------
// Build-Time Validation
// ---------------------------------------------------------------------------
// Runs once when this module is first imported (at build time during
// generateStaticParams). Validates referential integrity.

function validatePages(pages: Record<string, ContentPageData>): void {
  for (const [slug, page] of Object.entries(pages)) {
    // Validate case study references — missing JSON = BUILD ERROR
    for (const csSlug of page.caseStudySlugs) {
      if (!caseStudyExists(csSlug)) {
        throw new Error(
          `[content-pages] BUILD ERROR: Page "${slug}" references case study "${csSlug}" but no JSON file exists at src/data/case-studies/${csSlug}.json`
        );
      }
    }

    // Validate FAQ count — outside 3-5 = WARNING (not fatal)
    if (page.faqs.length < 3 || page.faqs.length > 5) {
      console.warn(
        `[content-pages] WARNING: Page "${slug}" has ${page.faqs.length} FAQs (expected 3-5)`
      );
    }

    // Validate slug consistency
    if (page.slug !== slug) {
      throw new Error(
        `[content-pages] BUILD ERROR: Page registered as "${slug}" but its slug field is "${page.slug}"`
      );
    }
  }
}

// Run validation on module load (build time)
validatePages(PAGE_MAP);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get a single content page by slug.
 * Returns null if the slug is not registered.
 */
export function getContentPage(slug: string): ContentPageData | null {
  return PAGE_MAP[slug] ?? null;
}

/**
 * Get all registered content page slugs.
 */
export function getAllContentPageSlugs(): string[] {
  return Object.keys(PAGE_MAP);
}

/**
 * Get all registered content page data objects.
 */
export function getAllContentPages(): ContentPageData[] {
  return Object.values(PAGE_MAP);
}
