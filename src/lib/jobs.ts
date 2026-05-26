/**
 * Server-side utility functions for reading job listings from disk.
 *
 * Job data lives as individual JSON files under `src/data/jobs/`. Each file
 * must conform to the {@link Job} interface defined in `@/types/job`.
 *
 * These helpers are designed to run exclusively on the server (Next.js Server
 * Components, `generateStaticParams`, Route Handlers, etc.) because they
 * depend on the Node `fs` and `path` modules.
 */

import fs from 'fs';
import path from 'path';
import type { Job, JobCategory, JobLocale } from '@/types/job';

/** Absolute path to the directory containing job JSON files. */
const JOBS_DIR = path.join(process.cwd(), 'src/data/jobs');

/** Root for per-locale translation overlays. */
const TRANSLATIONS_ROOT = path.join(
  process.cwd(),
  'src/data/jobs-translations',
);

/** Subset of `Job` fields that translations override. */
interface JobTranslation {
  title: string;
  description: string;
  skills: string[];
  faqs: { question: string; answer: string }[];
}

/**
 * Read and parse a single job JSON file.
 *
 * Returns `null` when the file does not exist or cannot be parsed.
 */
function readJobFile(filePath: string): Job | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Job;
  } catch {
    return null;
  }
}

/**
 * Read the translation overlay for a given slug + locale, or `null` if no
 * translation file exists yet.
 */
function readTranslation(slug: string, locale: JobLocale): JobTranslation | null {
  if (locale === 'en') return null;
  const p = path.join(TRANSLATIONS_ROOT, locale, `${slug}.json`);
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as JobTranslation;
  } catch {
    return null;
  }
}

/**
 * Merge a translation overlay into the canonical English Job. English remains
 * the source of truth; only the overlaid fields are swapped in.
 */
function applyTranslation(job: Job, locale: JobLocale | undefined): Job {
  if (!locale || locale === 'en') return job;
  const tr = readTranslation(job.slug, locale);
  if (!tr) return job;
  return {
    ...job,
    title: tr.title,
    description: tr.description,
    skills: tr.skills,
    faqs: tr.faqs,
  };
}

/** Returns `true` when a translation overlay exists for slug + locale. */
export function hasTranslation(slug: string, locale: JobLocale): boolean {
  if (locale === 'en') return true;
  return fs.existsSync(
    path.join(TRANSLATIONS_ROOT, locale, `${slug}.json`),
  );
}

/**
 * Return every job listing on disk.
 *
 * @param opts.includeArchived - When `true`, archived jobs are included in the
 *   result set. Defaults to `false`.
 * @returns An array of {@link Job} objects sorted by `datePosted` descending
 *   (newest first).
 */
export function getAllJobs(opts?: {
  includeArchived?: boolean;
  locale?: JobLocale;
}): Job[] {
  const includeArchived = opts?.includeArchived ?? false;
  const locale = opts?.locale;

  if (!fs.existsSync(JOBS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(JOBS_DIR).filter((f) => f.endsWith('.json'));

  const jobs: Job[] = [];

  for (const file of files) {
    const job = readJobFile(path.join(JOBS_DIR, file));
    if (!job) continue;
    if (!includeArchived && job.archived) continue;
    jobs.push(applyTranslation(job, locale));
  }

  // Sort newest first by datePosted.
  jobs.sort(
    (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
  );

  return jobs;
}

/**
 * Look up a single job by its slug.
 *
 * The slug corresponds to the JSON filename (without the `.json` extension).
 *
 * @returns The matching {@link Job} or `null` if no file exists for the given
 *   slug.
 */
export function getJobBySlug(slug: string, locale?: JobLocale): Job | null {
  const filePath = path.join(JOBS_DIR, `${slug}.json`);
  const job = readJobFile(filePath);
  if (!job) return null;
  return applyTranslation(job, locale);
}

/**
 * Return all **active** (non-archived) jobs that belong to a specific
 * category.
 *
 * @param category - One of the valid {@link JobCategory} values.
 * @returns An array of matching {@link Job} objects sorted by `datePosted`
 *   descending (newest first).
 */
export function getJobsByCategory(
  category: JobCategory | string,
  locale?: JobLocale,
): Job[] {
  return getAllJobs({ locale }).filter((job) => job.category === category);
}
