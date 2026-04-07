// ---------------------------------------------------------------------------
// Guides Registry
// ---------------------------------------------------------------------------

import type { GuidePageData } from "../types";

const modules: Record<string, GuidePageData> = {};

function register(page: GuidePageData): void {
  if (modules[page.slug]) {
    throw new Error(`[guides] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: GuidePageData): void {
  const totalWords = [
    page.heroSubtitle,
    ...page.steps.map((s) => s.description),
    page.claruRelevance,
    ...page.sections.flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    }),
  ]
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 500) {
    console.warn(
      `[guides] WARNING: Page "${page.slug}" has ${totalWords} words (target: 1000+)`
    );
  }

  if (page.faqs.length < 3 || page.faqs.length > 5) {
    console.warn(
      `[guides] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3-5)`
    );
  }

  if (page.steps.length < 5) {
    console.warn(
      `[guides] WARNING: Page "${page.slug}" has ${page.steps.length} steps (expected 5+)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import collectTeleoperationData from "./how-to-collect-teleoperation-data";
import buildManipulationDataset from "./how-to-build-a-manipulation-dataset";
import labelRobotDemonstrations from "./how-to-label-robot-demonstrations";
import evaluateTrainingDataQuality from "./how-to-evaluate-training-data-quality";
import convertToRlds from "./how-to-convert-data-to-rlds-format";
import bridgeSimToReal from "./how-to-bridge-sim-to-real-gap";
import collectEgocentricVideo from "./how-to-collect-egocentric-video-data";
import annotateDepthMaps from "./how-to-annotate-depth-maps";
import createActionLabels from "./how-to-create-action-labels-for-vla";
import buildGraspingDataset from "./how-to-build-a-grasping-dataset";
import trainDiffusionPolicy from "./how-to-train-a-diffusion-policy";
import setupTeleoperationRig from "./how-to-setup-a-teleoperation-rig";
import buildEgocentricDataPipeline from "./how-to-build-an-egocentric-data-pipeline";
import annotateManipulationTrajectories from "./how-to-annotate-manipulation-trajectories";
import createRobotDemonstrationDataset from "./how-to-create-a-robot-demonstration-dataset";
import measureInterAnnotatorAgreement from "./how-to-measure-inter-annotator-agreement";
import buildBenchmarkDataset from "./how-to-build-a-benchmark-dataset";
import implementActiveLearning from "./how-to-implement-active-learning-for-robotics";
import collectMultimodalRobotData from "./how-to-collect-multimodal-robot-data";
import buildDataEnrichmentPipeline from "./how-to-build-a-data-enrichment-pipeline";
import designRewardFunction from "./how-to-design-a-reward-function-for-robot-learning";
import preprocessPointClouds from "./how-to-preprocess-point-clouds-for-training";
import createSemanticSegmentationDataset from "./how-to-create-semantic-segmentation-dataset";
import buildCrossEmbodimentDataset from "./how-to-build-a-cross-embodiment-dataset";
import evaluateSimToRealTransfer from "./how-to-evaluate-sim-to-real-transfer";
import annotateHandObjectInteractions from "./how-to-annotate-hand-object-interactions";
import collectKitchenActivityData from "./how-to-collect-kitchen-activity-data";
import buildLanguageConditionedDataset from "./how-to-build-a-language-conditioned-dataset";
import createTemporalAnnotations from "./how-to-create-temporal-annotations-for-video";
import setupDataQualityPipeline from "./how-to-setup-data-quality-pipeline";
import buildNavigationDataset from "./how-to-build-a-navigation-dataset";
import collectDextManipData from "./how-to-collect-dexterous-manipulation-data";
import annotateRobotFailureModes from "./how-to-annotate-robot-failure-modes";
import buildContactRichDataset from "./how-to-build-a-contact-rich-manipulation-dataset";
import createActionChunkedDataset from "./how-to-create-action-chunked-dataset";
import deduplicateRobotData from "./how-to-deduplicate-robot-training-data";
import buildPreferenceDataset from "./how-to-build-a-preference-dataset-for-rlhf";
import setupDomainRandomization from "./how-to-setup-domain-randomization-pipeline";
import collectWarehouseData from "./how-to-collect-warehouse-robot-data";
import buildObjectTrackingDataset from "./how-to-build-an-object-tracking-dataset";
import buildHumanoidDataset from "./how-to-build-a-humanoid-training-dataset";
import calibrateMultiCameraRigs from "./how-to-calibrate-multi-camera-rigs";
import collectForceTorqueData from "./how-to-collect-force-torque-data";
import createSafetyLabeledData from "./how-to-create-safety-labeled-robot-data";
import designTeleoperationInterface from "./how-to-design-a-teleoperation-interface";
import evaluatePolicyPerformance from "./how-to-evaluate-policy-performance";
import fineTuneVlaModel from "./how-to-fine-tune-a-vla-model";
import generateSyntheticRobotData from "./how-to-generate-synthetic-robot-data";
import handleClassImbalance from "./how-to-handle-class-imbalance-in-robot-data";
import implementDataVersioning from "./how-to-implement-data-versioning-for-robotics";
import labelGraspSuccessFailure from "./how-to-label-grasp-success-failure";
import manageMultiSiteCollection from "./how-to-manage-multi-site-data-collection";
import optimizeDatasetDiversity from "./how-to-optimize-dataset-diversity";
import recordBimanualDemonstrations from "./how-to-record-bimanual-demonstrations";
import setupMobileManipulationRig from "./how-to-set-up-a-mobile-manipulation-rig";
import streamRobotDataToCloud from "./how-to-stream-robot-data-to-cloud";
import validateActionLabels from "./how-to-validate-action-labels";
import workWithRldsAndLerobot from "./how-to-work-with-rlds-and-lerobot-formats";
import annotate3dPointClouds from "./how-to-annotate-3d-point-clouds";
import buildSafetyMonitoringPipeline from "./how-to-build-a-safety-monitoring-pipeline";

[
  collectTeleoperationData, buildManipulationDataset, labelRobotDemonstrations,
  evaluateTrainingDataQuality, convertToRlds, bridgeSimToReal,
  collectEgocentricVideo, annotateDepthMaps, createActionLabels,
  buildGraspingDataset, trainDiffusionPolicy, setupTeleoperationRig,
  buildEgocentricDataPipeline, annotateManipulationTrajectories,
  createRobotDemonstrationDataset, measureInterAnnotatorAgreement,
  buildBenchmarkDataset, implementActiveLearning,
  collectMultimodalRobotData, buildDataEnrichmentPipeline,
  designRewardFunction, preprocessPointClouds,
  createSemanticSegmentationDataset, buildCrossEmbodimentDataset,
  evaluateSimToRealTransfer, annotateHandObjectInteractions,
  collectKitchenActivityData, buildLanguageConditionedDataset,
  createTemporalAnnotations, setupDataQualityPipeline,
  buildNavigationDataset, collectDextManipData,
  annotateRobotFailureModes, buildContactRichDataset,
  createActionChunkedDataset, deduplicateRobotData,
  buildPreferenceDataset, setupDomainRandomization,
  collectWarehouseData, buildObjectTrackingDataset,
  buildHumanoidDataset, calibrateMultiCameraRigs,
  collectForceTorqueData, createSafetyLabeledData,
  designTeleoperationInterface, evaluatePolicyPerformance,
  fineTuneVlaModel, generateSyntheticRobotData,
  handleClassImbalance, implementDataVersioning,
  labelGraspSuccessFailure, manageMultiSiteCollection,
  optimizeDatasetDiversity, recordBimanualDemonstrations,
  setupMobileManipulationRig, streamRobotDataToCloud,
  validateActionLabels, workWithRldsAndLerobot,
  annotate3dPointClouds, buildSafetyMonitoringPipeline,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getGuidePage(slug: string): GuidePageData | null {
  return modules[slug] ?? null;
}

export function getAllGuidePages(): GuidePageData[] {
  return Object.values(modules);
}

export function getAllGuideSlugs(): string[] {
  return Object.keys(modules);
}
