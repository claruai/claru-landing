// ---------------------------------------------------------------------------
// Server-side Case Study Data Loader
// ---------------------------------------------------------------------------
// Reads case study JSON files from disk at build time. This module uses
// Node.js fs and should only be imported in server components or build-time
// code (generateStaticParams, generateMetadata, etc.).
// ---------------------------------------------------------------------------

import fs from "fs";
import path from "path";

/**
 * Shape of a case study JSON file at src/data/case-studies/{slug}.json.
 *
 * Derived from the existing JSON schema (e.g., egocentric-video-collection.json).
 * Only the fields needed by content page components are included; the JSON
 * files may contain additional fields that are ignored here.
 */
export interface CaseStudyData {
  slug: string;
  title: string;
  category: string;
  teaser: string;
  headlineStat: string;
  headlineStatLabel: string;
  summary: string;
  challenge: string;
  approach: string;
  results: Array<{ value: string; label: string }>;
  impact: string;
  whyItMatters: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
  pillarLink: { href: string; label: string };
  targetKeyword: string;
  metaTitle: string;
  metaDescription: string;
  processSteps: Array<{ step: string; title: string; description: string }>;
  images: string[];
  datePublished: string;
}

const CASE_STUDIES_DIR = path.join(
  process.cwd(),
  "src",
  "data",
  "case-studies"
);

/**
 * Reads and parses a case study JSON from disk.
 *
 * @param slug - The case study slug (filename without extension)
 * @returns Parsed case study data, or null if the file does not exist
 */
export function getCaseStudyData(slug: string): CaseStudyData | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.json`);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as CaseStudyData;
  } catch (error) {
    console.warn(
      `[case-studies-server] Could not read case study "${slug}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return null;
  }
}

/**
 * Checks whether a case study JSON file exists on disk.
 *
 * Used for build-time validation without parsing the full file.
 */
export function caseStudyExists(slug: string): boolean {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.json`);
  return fs.existsSync(filePath);
}
