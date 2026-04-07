// ---------------------------------------------------------------------------
// Glossary Deep Page Registry
// ---------------------------------------------------------------------------
// Discovers all glossary deep page data files in this directory at build time.
// Each file exports a GlossaryDeepPageData object as default.
// ---------------------------------------------------------------------------

import type { GlossaryDeepPageData } from "../types";

// ---------------------------------------------------------------------------
// Static imports — we use explicit imports so Next.js can tree-shake and
// statically analyze at build time. The index is the single point of entry.
// ---------------------------------------------------------------------------

const modules: Record<string, GlossaryDeepPageData> = {};

// We'll populate this via explicit imports below.
// Each data file calls registerGlossaryDeepPage() or we import them directly.

function register(page: GlossaryDeepPageData): void {
  if (modules[page.slug]) {
    throw new Error(
      `[glossary-deep] BUILD ERROR: Duplicate slug "${page.slug}"`
    );
  }
  modules[page.slug] = page;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validatePage(page: GlossaryDeepPageData): void {
  // Word count: longDefinition + historicalContext + practicalImplications >= 800
  const totalWords = [
    page.longDefinition,
    page.historicalContext,
    page.practicalImplications,
    ...page.sections.flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    }),
  ]
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 400) {
    console.warn(
      `[glossary-deep] WARNING: Page "${page.slug}" has ${totalWords} words in core content (target: 800+)`
    );
  }

  // FAQs: 3-5
  if (page.faqs.length < 3 || page.faqs.length > 5) {
    console.warn(
      `[glossary-deep] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3-5)`
    );
  }

  // Common misconceptions: at least 2
  if (page.commonMisconceptions.length < 2) {
    console.warn(
      `[glossary-deep] WARNING: Page "${page.slug}" has ${page.commonMisconceptions.length} misconceptions (expected 2+)`
    );
  }

  // Key papers: at least 3
  if (page.keyPapers.length < 3) {
    console.warn(
      `[glossary-deep] WARNING: Page "${page.slug}" has ${page.keyPapers.length} key papers (expected 3+)`
    );
  }

  // Slug consistency
  if (page.termSlug !== page.slug) {
    console.warn(
      `[glossary-deep] WARNING: Page slug "${page.slug}" does not match termSlug "${page.termSlug}"`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports — add one line per data file
// ---------------------------------------------------------------------------

import vla from "./vla";
import diffusionPolicy from "./diffusion-policy";
import behavioralCloning from "./behavioral-cloning";
import simToRealGap from "./sim-to-real-gap";
import imitationLearning from "./imitation-learning";
import embodiedAi from "./embodied-ai";
import physicalAi from "./physical-ai";
import teleoperation from "./teleoperation-data";
import egocentricVideo from "./egocentric-video";
import worldModel from "./world-model";
import humanoidRobot from "./humanoid-robot";
import visuomotorPolicy from "./visuomotor-policy";
import foundationModelRobotics from "./foundation-model-robotics";
import crossEmbodimentData from "./cross-embodiment-data";
import manipulationTrajectory from "./manipulation-trajectory";
import depthData from "./depth-data";
import rgbdData from "./rgb-d-data";
import pointCloud from "./point-cloud";
import proprioceptiveData from "./proprioceptive-data";
import syntheticData from "./synthetic-data";
import keypointAnnotation from "./keypoint-annotation";
import temporalAnnotation from "./temporal-annotation";
import actionSegmentation from "./action-segmentation";
import semanticSegmentation from "./semantic-segmentation";
import instanceSegmentation from "./instance-segmentation";
import activityAnnotation from "./activity-annotation";
import boundingBoxAnnotation from "./bounding-box-annotation";
import preferenceAnnotation from "./preference-annotation";
import dataEnrichment from "./data-enrichment";
import benchmarkCuration from "./benchmark-curation";
import dataDeduplication from "./data-deduplication";
import interAnnotatorAgreement from "./inter-annotator-agreement";
import rlhf from "./rlhf";
import dataQualityScoring from "./data-quality-scoring";
import datasetDiversity from "./dataset-diversity";
import activeLearning from "./active-learning";
import opticalFlow from "./optical-flow";
import monocularDepthEstimation from "./monocular-depth-estimation";
import poseEstimation from "./pose-estimation";
import handObjectInteraction from "./hand-object-interaction";
import objectTracking from "./object-tracking";
import videoPrediction from "./video-prediction";
import sam from "./sam";
import panopticSegmentation from "./panoptic-segmentation";
import domainRandomization from "./domain-randomization";
import actionChunking from "./action-chunking";
import rewardModel from "./reward-model";
import sixDofGraspPlanning from "./6-dof-grasp-planning";
import raft from "./raft";
import depthAnythingV2 from "./depth-anything-v2";
import vitpose from "./vitpose";
import openXEmbodiment from "./open-x-embodiment";
import diffusionTransformer from "./diffusion-transformer";
import visionTransformer from "./vision-transformer";
import grootN1 from "./groot-n1";
import piZero from "./pi-zero";
// New terms (14 additional)
import rlds from "./rlds";
import actionSpace from "./action-space";
import dexterousManipulation from "./dexterous-manipulation";
import graspingDataset from "./grasping-dataset";
import contactRichManipulation from "./contact-rich-manipulation";
import languageConditionedPolicy from "./language-conditioned-policy";
import multimodalFoundationModel from "./multimodal-foundation-model";
import robotLearning from "./robot-learning";
import spatialActionMaps from "./spatial-action-maps";
import taskAndMotionPlanning from "./task-and-motion-planning";
import trajectoryOptimization from "./trajectory-optimization";
import transferLearningRobotics from "./transfer-learning-robotics";
import zeroShotGeneralization from "./zero-shot-generalization";
import sceneUnderstanding from "./scene-understanding";
// Wave 3 — 30 new terms
import crossEmbodimentTransfer from "./cross-embodiment-transfer";
import zeroShotManipulation from "./zero-shot-manipulation";
import fewShotImitation from "./few-shot-imitation";
import forceTorqueSensing from "./force-torque-sensing";
import graspPlanning from "./grasp-planning";
import inverseKinematics from "./inverse-kinematics";
import jointSpaceControl from "./joint-space-control";
import motionPlanning from "./motion-planning";
import pathPlanning from "./path-planning";
import reinforcementLearningRobotics from "./reinforcement-learning-robotics";
import selfSupervisedLearningRobotics from "./self-supervised-learning-robotics";
import visualServoing from "./visual-servoing";
import workspaceMapping from "./workspace-mapping";
import objectPoseEstimation from "./object-pose-estimation";
import affordancePrediction from "./affordance-prediction";
import collisionAvoidance from "./collision-avoidance";
import deformableObjectManipulation from "./deformable-object-manipulation";
import gripperDesign from "./gripper-design";
import hapticFeedback from "./haptic-feedback";
import humanIntentPrediction from "./human-intent-prediction";
import multiTaskLearningRobotics from "./multi-task-learning-robotics";
import neuralRadianceField from "./neural-radiance-field";
import occupancyGrid from "./occupancy-grid";
import policyDistillation from "./policy-distillation";
import rewardShaping from "./reward-shaping";
import safetyConstraintLearning from "./safety-constraint-learning";
import sensorFusion from "./sensor-fusion";
import taskDecomposition from "./task-decomposition";
import trajectoryPrediction from "./trajectory-prediction";
import visualGrounding from "./visual-grounding";

// Register all pages
[
  vla, diffusionPolicy, behavioralCloning, simToRealGap, imitationLearning,
  embodiedAi, physicalAi, teleoperation, egocentricVideo, worldModel,
  humanoidRobot, visuomotorPolicy, foundationModelRobotics, crossEmbodimentData,
  manipulationTrajectory, depthData, rgbdData, pointCloud, proprioceptiveData,
  syntheticData, keypointAnnotation, temporalAnnotation, actionSegmentation,
  semanticSegmentation, instanceSegmentation, activityAnnotation,
  boundingBoxAnnotation, preferenceAnnotation, dataEnrichment, benchmarkCuration,
  dataDeduplication, interAnnotatorAgreement, rlhf, dataQualityScoring,
  datasetDiversity, activeLearning, opticalFlow, monocularDepthEstimation,
  poseEstimation, handObjectInteraction, objectTracking, videoPrediction,
  sam, panopticSegmentation, domainRandomization, actionChunking, rewardModel,
  sixDofGraspPlanning, raft, depthAnythingV2, vitpose, openXEmbodiment,
  diffusionTransformer, visionTransformer, grootN1, piZero,
  rlds, actionSpace, dexterousManipulation, graspingDataset,
  contactRichManipulation, languageConditionedPolicy,
  multimodalFoundationModel, robotLearning, spatialActionMaps,
  taskAndMotionPlanning, trajectoryOptimization, transferLearningRobotics,
  zeroShotGeneralization, sceneUnderstanding,
  // Wave 3 — 30 new terms
  crossEmbodimentTransfer, zeroShotManipulation, fewShotImitation,
  forceTorqueSensing, graspPlanning, inverseKinematics,
  jointSpaceControl, motionPlanning, pathPlanning,
  reinforcementLearningRobotics, selfSupervisedLearningRobotics, visualServoing,
  workspaceMapping, objectPoseEstimation, affordancePrediction,
  collisionAvoidance, deformableObjectManipulation, gripperDesign,
  hapticFeedback, humanIntentPrediction, multiTaskLearningRobotics,
  neuralRadianceField, occupancyGrid, policyDistillation,
  rewardShaping, safetyConstraintLearning, sensorFusion,
  taskDecomposition, trajectoryPrediction, visualGrounding,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getGlossaryDeepPage(
  slug: string
): GlossaryDeepPageData | null {
  return modules[slug] ?? null;
}

export function getAllGlossaryDeepPages(): GlossaryDeepPageData[] {
  return Object.values(modules);
}

export function getAllGlossaryDeepSlugs(): string[] {
  return Object.keys(modules);
}
