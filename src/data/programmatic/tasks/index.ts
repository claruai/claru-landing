// ---------------------------------------------------------------------------
// Tasks Registry
// ---------------------------------------------------------------------------

import type { TaskPageData } from "../types";

const modules: Record<string, TaskPageData> = {};

function register(page: TaskPageData): void {
  if (modules[page.slug]) {
    throw new Error(`[tasks] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: TaskPageData): void {
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
      `[tasks] WARNING: Page "${page.slug}" has ${totalWords} words (target: 800+)`
    );
  }

  if (page.faqs.length < 3 || page.faqs.length > 5) {
    console.warn(
      `[tasks] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3-5)`
    );
  }

  if (page.dataRequirements.keyAnnotations.length < 3) {
    console.warn(
      `[tasks] WARNING: Page "${page.slug}" has ${page.dataRequirements.keyAnnotations.length} key annotations (expected 3+)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import objectManipulation from "./object-manipulation";
import dexterousManipulation from "./dexterous-manipulation";
import grasping from "./grasping";
import teleoperation from "./teleoperation";
import kitchenTasks from "./kitchen-tasks";
import navigation from "./navigation";
import locomotion from "./locomotion";
import assembly from "./assembly";
import binPicking from "./bin-picking";
import toolUse from "./tool-use";
import bimanualManipulation from "./bimanual-manipulation";
import agriculturalRobotics from "./agricultural-robotics";
import mobileManipulation from "./mobile-manipulation";
import surgicalManipulation from "./surgical-manipulation";
import humanRobotHandover from "./human-robot-handover";
import doorCabinetManipulation from "./door-cabinet-manipulation";
import foldingDeformables from "./folding-deformables";
import pouringLiquids from "./pouring-liquids";
import wristCameraData from "./wrist-camera-data";
import tactileSensorData from "./tactile-sensor-data";
import warehouseAutomation from "./warehouse-automation";
import constructionRobotics from "./construction-robotics";
import underwaterManipulation from "./underwater-manipulation";
import aerialManipulation from "./aerial-manipulation";
import foodPreparation from "./food-preparation";
import cleaningTasks from "./cleaning-tasks";
import tableSetting from "./table-setting";
import objectRearrangement from "./object-rearrangement";
import cableRouting from "./cable-routing";
import insertionTasks from "./insertion-tasks";
import packing from "./packing";
import stacking from "./stacking";
import pickAndPlace from "./pick-and-place";
import pushing from "./pushing";
import wipingSurfaces from "./wiping-surfaces";
import screwDriving from "./screw-driving";
import pegInsertion from "./peg-insertion";
import clothFolding from "./cloth-folding";
import drawerManipulation from "./drawer-manipulation";
import buttonPressing from "./button-pressing";
import valveTurning from "./valve-turning";
import welding from "./welding";
import painting from "./painting";
import inspection from "./inspection";
import palletizing from "./palletizing";

[
  objectManipulation, dexterousManipulation, grasping, teleoperation,
  kitchenTasks, navigation, locomotion, assembly, binPicking, toolUse,
  bimanualManipulation, agriculturalRobotics, mobileManipulation,
  surgicalManipulation, humanRobotHandover, doorCabinetManipulation,
  foldingDeformables, pouringLiquids, wristCameraData, tactileSensorData,
  warehouseAutomation, constructionRobotics, underwaterManipulation,
  aerialManipulation, foodPreparation, cleaningTasks, tableSetting,
  objectRearrangement, cableRouting, insertionTasks,
  packing, stacking, pickAndPlace, pushing, wipingSurfaces,
  screwDriving, pegInsertion, clothFolding, drawerManipulation,
  buttonPressing, valveTurning, welding, painting, inspection, palletizing,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getTaskPage(slug: string): TaskPageData | null {
  return modules[slug] ?? null;
}

export function getAllTaskPages(): TaskPageData[] {
  return Object.values(modules);
}

export function getAllTaskSlugs(): string[] {
  return Object.keys(modules);
}
