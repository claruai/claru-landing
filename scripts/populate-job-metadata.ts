/**
 * One-shot: populate `targetCountries`, `subcategory`, and `seo` annotations
 * on the 14 open roles per `goals/jobs-page-refocus.md`.
 *
 * - targetCountries: derived from existing locationRequirements + sensible
 *   defaults (egocentric = US/CA/MX/BR worldwide-ish, gaming = same).
 * - subcategory: applied to egocentric (commercial-* / residential-*) and
 *   gaming (per-game where role title implies one).
 * - seo: primary EN keyword + volume from DataForSEO research in the goal doc.
 *
 * Run with:  npx tsx scripts/populate-job-metadata.ts
 */

import fs from "node:fs";
import path from "node:path";

const JOBS_DIR = path.join(process.cwd(), "src/data/jobs");

interface JobMeta {
  targetCountries?: string[];
  subcategory?: string;
  seo?: {
    primaryKeyword?: string;
    locales?: Record<string, { keyword: string; monthlySearchVolume: number }>;
  };
}

// Default supply geos for all open roles unless a stricter restriction exists.
const DEFAULT_OPEN_COUNTRIES = ["US", "CA", "MX", "BR"];

// Per-slug overrides — only entries present here mutate. All others get the
// shared defaults below.
const OVERRIDES: Record<string, JobMeta> = {
  // ---- Egocentric / video-capture ----
  "egocentric-video-capture-specialist": {
    subcategory: "residential-indoor",
    seo: {
      primaryKeyword: "first person video",
      locales: {
        en: { keyword: "first person video", monthlySearchVolume: 140 },
      },
    },
  },
  "first-person-video-data-collector": {
    subcategory: "residential-indoor",
    seo: {
      primaryKeyword: "first person video",
      locales: {
        en: { keyword: "first person video", monthlySearchVolume: 140 },
      },
    },
  },
  "indoor-activity-video-recorder": {
    subcategory: "residential-household",
    seo: {
      primaryKeyword: "ai data collection jobs",
      locales: {
        en: { keyword: "ai data collection jobs", monthlySearchVolume: 50 },
      },
    },
  },
  "embodied-ai-data-capture-associate": {
    subcategory: "commercial-warehouse",
    seo: {
      primaryKeyword: "wearable camera",
      locales: { en: { keyword: "wearable camera", monthlySearchVolume: 1900 } },
    },
  },
  "video-data-collection-specialist": {
    subcategory: "commercial-retail",
    seo: {
      primaryKeyword: "data annotation work from home",
      locales: {
        en: {
          keyword: "data annotation work from home",
          monthlySearchVolume: 70,
        },
      },
    },
  },
  "wearable-camera-data-contributor": {
    subcategory: "residential-household",
    seo: {
      primaryKeyword: "wearable camera",
      locales: { en: { keyword: "wearable camera", monthlySearchVolume: 1900 } },
    },
  },

  // ---- Gaming ----
  "game-annotator": {
    subcategory: "annotation",
    seo: {
      primaryKeyword: "make money playing games",
      locales: {
        en: { keyword: "make money playing games", monthlySearchVolume: 9900 },
      },
    },
  },
  "game-data-collector": {
    subcategory: "capture",
    seo: {
      primaryKeyword: "get paid to play games",
      locales: {
        en: { keyword: "get paid to play games", monthlySearchVolume: 2400 },
      },
    },
  },
  "game-simulation-data-contributor": {
    subcategory: "capture",
    seo: {
      primaryKeyword: "play games for ai training",
      locales: {
        en: { keyword: "play games for ai training", monthlySearchVolume: 0 },
      },
    },
  },
  "game-testing-annotator": {
    subcategory: "qa",
    seo: {
      primaryKeyword: "game testing jobs remote",
      locales: {
        en: { keyword: "game testing jobs remote", monthlySearchVolume: 140 },
      },
    },
  },
  "gameplay-annotation-specialist": {
    subcategory: "annotation",
    seo: {
      primaryKeyword: "make money playing games",
      locales: {
        en: { keyword: "make money playing games", monthlySearchVolume: 9900 },
      },
    },
  },
  "gaming-ai-feedback-specialist": {
    subcategory: "qa",
    seo: {
      primaryKeyword: "ai training jobs",
      locales: {
        en: { keyword: "ai training jobs", monthlySearchVolume: 12100 },
      },
    },
  },
  "interactive-environment-data-collector": {
    subcategory: "capture",
    seo: {
      primaryKeyword: "get paid to play video games",
      locales: {
        en: {
          keyword: "get paid to play video games",
          monthlySearchVolume: 590,
        },
      },
    },
  },
  "virtual-environment-tester": {
    subcategory: "qa",
    seo: {
      primaryKeyword: "game testing jobs remote",
      locales: {
        en: { keyword: "game testing jobs remote", monthlySearchVolume: 140 },
      },
    },
  },
};

function deriveCountries(locationRequirements: string | undefined): string[] {
  if (!locationRequirements) return DEFAULT_OPEN_COUNTRIES;
  const trimmed = locationRequirements.trim();
  if (/worldwide/i.test(trimmed)) return DEFAULT_OPEN_COUNTRIES;
  const parts = trimmed
    .split(",")
    .map((p) => p.trim().toUpperCase())
    .filter(Boolean);
  if (parts.length === 0) return DEFAULT_OPEN_COUNTRIES;
  // Treat "EU" as a region — keep US/CA/MX/BR as worldwide-supply default,
  // since pay is USD and we're not gating on EU residency for this campaign.
  if (parts.includes("EU") && parts.length === 1) return DEFAULT_OPEN_COUNTRIES;
  return parts;
}

function main() {
  const files = fs.readdirSync(JOBS_DIR).filter((f) => f.endsWith(".json"));
  let mutated = 0;

  for (const file of files) {
    const filePath = path.join(JOBS_DIR, file);
    const job = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Only annotate open roles.
    if (job.status !== "open") continue;

    let changed = false;

    const wantCountries = deriveCountries(job.locationRequirements);
    if (
      !Array.isArray(job.targetCountries) ||
      JSON.stringify(job.targetCountries) !== JSON.stringify(wantCountries)
    ) {
      job.targetCountries = wantCountries;
      changed = true;
    }

    const override = OVERRIDES[job.slug];
    if (override?.subcategory && job.subcategory !== override.subcategory) {
      job.subcategory = override.subcategory;
      changed = true;
    }
    if (override?.seo) {
      job.seo = override.seo;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(job, null, 2) + "\n");
      mutated++;
    }
  }

  console.log(`Done. Mutated ${mutated} files.`);
}

main();
