// ---------------------------------------------------------------------------
// Format Page Registry
// ---------------------------------------------------------------------------

import type { FormatPageData } from "./types";

const modules: Record<string, FormatPageData> = {};

function register(page: FormatPageData): void {
  if (modules[page.slug]) {
    throw new Error(`[formats] BUILD ERROR: Duplicate slug "${page.slug}"`);
  }
  modules[page.slug] = page;
}

function validatePage(page: FormatPageData): void {
  const totalWords = page.sections
    .flatMap((s) => {
      if (s.type === "prose") return s.paragraphs;
      return [];
    })
    .join(" ")
    .split(/\s+/).length;

  if (totalWords < 100) {
    console.warn(
      `[formats] WARNING: Page "${page.slug}" has ${totalWords} words in prose sections (target: 600+)`
    );
  }

  if (page.faqs.length < 3) {
    console.warn(
      `[formats] WARNING: Page "${page.slug}" has ${page.faqs.length} FAQs (expected 3+)`
    );
  }
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import rlds from "./rlds";
import hdf5 from "./hdf5";
import webdataset from "./webdataset";
import tfds from "./tfds";
import lerobotFormat from "./lerobot-format";
import zarr from "./zarr";
import rosBag from "./ros-bag";
import mcap from "./mcap";
import nuscenesFormat from "./nuscenes-format";
import kittiFormat from "./kitti-format";
import bopFormat from "./bop-format";
import cocoFormat from "./coco-format";
import open3dFormat from "./open3d-format";
import arrowFormat from "./arrow-format";
import protobufRobotics from "./protobuf-robotics";

[
  rlds, hdf5, webdataset, tfds, lerobotFormat, zarr, rosBag, mcap,
  nuscenesFormat, kittiFormat, bopFormat, cocoFormat, open3dFormat,
  arrowFormat, protobufRobotics,
].forEach((page) => {
  validatePage(page);
  register(page);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getFormatPage(slug: string): FormatPageData | null {
  return modules[slug] ?? null;
}

export function getAllFormatPages(): FormatPageData[] {
  return Object.values(modules);
}

export function getAllFormatSlugs(): string[] {
  return Object.keys(modules);
}
