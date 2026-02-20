/**
 * Server-side utility functions for reading case studies from disk.
 *
 * Case study data lives as individual JSON files under
 * `src/data/case-studies/`. Each file must conform to the {@link CaseStudy}
 * interface defined in `@/types/case-study`.
 *
 * These helpers are designed to run exclusively on the server (Next.js Server
 * Components, `generateStaticParams`, Route Handlers, etc.) because they
 * depend on the Node `fs` and `path` modules.
 */

import fs from 'fs';
import path from 'path';
import type { CaseStudy, CaseStudyCategory } from '@/types/case-study';

/** Absolute path to the directory containing case study JSON files. */
const CASE_STUDIES_DIR = path.join(process.cwd(), 'src/data/case-studies');

/**
 * Read and parse a single case study JSON file.
 *
 * Returns `null` when the file does not exist or cannot be parsed.
 */
function readCaseStudyFile(filePath: string): CaseStudy | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as CaseStudy;
  } catch {
    return null;
  }
}

/**
 * Return every case study on disk.
 *
 * @returns An array of {@link CaseStudy} objects sorted by `datePublished`
 *   descending (newest first).
 */
export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CASE_STUDIES_DIR).filter((f) => f.endsWith('.json'));

  const caseStudies: CaseStudy[] = [];

  for (const file of files) {
    const caseStudy = readCaseStudyFile(path.join(CASE_STUDIES_DIR, file));
    if (!caseStudy) continue;
    caseStudies.push(caseStudy);
  }

  // Sort newest first by datePublished.
  caseStudies.sort(
    (a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
  );

  return caseStudies;
}

/**
 * Look up a single case study by its slug.
 *
 * The slug corresponds to the JSON filename (without the `.json` extension).
 *
 * @returns The matching {@link CaseStudy} or `null` if no file exists for the
 *   given slug.
 */
export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.json`);
  return readCaseStudyFile(filePath);
}

/**
 * Return all case studies that belong to a specific category.
 *
 * @param category - One of the valid {@link CaseStudyCategory} values.
 * @returns An array of matching {@link CaseStudy} objects sorted by
 *   `datePublished` descending (newest first).
 */
export function getCaseStudiesByCategory(
  category: CaseStudyCategory | string,
): CaseStudy[] {
  return getAllCaseStudies().filter((cs) => cs.category === category);
}

/**
 * Return case studies related to the given slug.
 *
 * Uses the `relatedSlugs` field from the source case study to look up related
 * entries. Falls back to same-category case studies if a related slug cannot
 * be resolved.
 *
 * @param slug - The slug of the source case study.
 * @param limit - Maximum number of related case studies to return. Defaults to 3.
 * @returns An array of {@link CaseStudy} objects (up to `limit`).
 */
export function getRelatedCaseStudies(slug: string, limit = 3): CaseStudy[] {
  const source = getCaseStudyBySlug(slug);
  if (!source) return [];

  const related: CaseStudy[] = [];

  // First, resolve explicitly listed related slugs.
  for (const relatedSlug of source.relatedSlugs) {
    if (related.length >= limit) break;
    const cs = getCaseStudyBySlug(relatedSlug);
    if (cs) related.push(cs);
  }

  // If we still need more, fill from the same category.
  if (related.length < limit) {
    const sameCategory = getCaseStudiesByCategory(source.category).filter(
      (cs) => cs.slug !== slug && !related.some((r) => r.slug === cs.slug),
    );
    for (const cs of sameCategory) {
      if (related.length >= limit) break;
      related.push(cs);
    }
  }

  return related;
}
