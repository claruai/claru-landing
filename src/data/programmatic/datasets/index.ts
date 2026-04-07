// ---------------------------------------------------------------------------
// Dataset Page Registry
// ---------------------------------------------------------------------------

import type { DatasetPageData } from "./types";

const modules: Record<string, DatasetPageData> = {};

function register(page: DatasetPageData): void {
  if (modules[page.slug]) {
    throw new Error(`[datasets] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: DatasetPageData): void {
  const totalWords = page.sections
    .flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    })
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 200) {
    console.warn(
      `[datasets] WARNING: Page "${page.slug}" has ${totalWords} words in prose sections (target: 600+)`
    );
  }

  if (page.faqs.length < 3) {
    console.warn(
      `[datasets] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3+)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import egocentricKitchenVideo from "./egocentric-kitchen-video";
import egocentricWarehouseVideo from "./egocentric-warehouse-video";
import egocentricOutdoorUrban from "./egocentric-outdoor-urban";
import egocentricRetailVideo from "./egocentric-retail-video";
import egocentricOfficeVideo from "./egocentric-office-video";
import teleoperationKitchen from "./teleoperation-kitchen";
import teleoperationWarehouse from "./teleoperation-warehouse";
import teleoperationTabletop from "./teleoperation-tabletop";
import multiViewManipulation from "./multi-view-manipulation";
import rgbdKitchen from "./rgbd-kitchen";
import rgbdManipulation from "./rgbd-manipulation";
import gameEnvironmentData from "./game-environment-data";
import syntheticManipulation from "./synthetic-manipulation";
import dashcamUrban from "./dashcam-urban";
import aerialAgricultural from "./aerial-agricultural";
import egocentricConstruction from "./egocentric-construction";
import egocentricRestaurant from "./egocentric-restaurant";
import egocentricHealthcare from "./egocentric-healthcare";
import multiViewAssembly from "./multi-view-assembly";
import thermalIndustrial from "./thermal-industrial";
import egocentricWorkshop from "./egocentric-workshop";
import pointCloudIndoor from "./point-cloud-indoor";
import multiSensorWarehouse from "./multi-sensor-warehouse";
import egocentricAgricultural from "./egocentric-agricultural";
import stereoOutdoor from "./stereo-outdoor";
import egocentricLab from "./egocentric-lab";
import egocentricOutdoorSports from "./egocentric-outdoor-sports";
import egocentricAssemblyLine from "./egocentric-assembly-line";
import lidarUrban from "./lidar-urban";
import lidarWarehouse from "./lidar-warehouse";
import forceTorqueManipulation from "./force-torque-manipulation";
import eventCameraManipulation from "./event-camera-manipulation";
import multiViewKitchen from "./multi-view-kitchen";
import thermalOutdoor from "./thermal-outdoor";
import stereoManipulation from "./stereo-manipulation";
import pointCloudOutdoor from "./point-cloud-outdoor";
import dashcamHighway from "./dashcam-highway";
import aerialInspection from "./aerial-inspection";
import underwaterInspection from "./underwater-inspection";
import syntheticHousehold from "./synthetic-household";

[
  egocentricKitchenVideo, egocentricWarehouseVideo, egocentricOutdoorUrban,
  egocentricRetailVideo, egocentricOfficeVideo, teleoperationKitchen,
  teleoperationWarehouse, teleoperationTabletop, multiViewManipulation,
  rgbdKitchen, rgbdManipulation, gameEnvironmentData, syntheticManipulation,
  dashcamUrban, aerialAgricultural, egocentricConstruction, egocentricRestaurant,
  egocentricHealthcare, multiViewAssembly, thermalIndustrial, egocentricWorkshop,
  pointCloudIndoor, multiSensorWarehouse, egocentricAgricultural, stereoOutdoor,
  egocentricLab, egocentricOutdoorSports, egocentricAssemblyLine,
  lidarUrban, lidarWarehouse, forceTorqueManipulation, eventCameraManipulation,
  multiViewKitchen, thermalOutdoor, stereoManipulation, pointCloudOutdoor,
  dashcamHighway, aerialInspection, underwaterInspection, syntheticHousehold,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getDatasetPage(slug: string): DatasetPageData | null {
  return modules[slug] ?? null;
}

export function getAllDatasetPages(): DatasetPageData[] {
  return Object.values(modules);
}

export function getAllDatasetSlugs(): string[] {
  return Object.keys(modules);
}
