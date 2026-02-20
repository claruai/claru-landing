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
import type { Job, JobCategory } from '@/types/job';

/** Absolute path to the directory containing job JSON files. */
const JOBS_DIR = path.join(process.cwd(), 'src/data/jobs');

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
 * Return every job listing on disk.
 *
 * @param opts.includeArchived - When `true`, archived jobs are included in the
 *   result set. Defaults to `false`.
 * @returns An array of {@link Job} objects sorted by `datePosted` descending
 *   (newest first).
 */
export function getAllJobs(opts?: { includeArchived?: boolean }): Job[] {
  const includeArchived = opts?.includeArchived ?? false;

  if (!fs.existsSync(JOBS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(JOBS_DIR).filter((f) => f.endsWith('.json'));

  const jobs: Job[] = [];

  for (const file of files) {
    const job = readJobFile(path.join(JOBS_DIR, file));
    if (!job) continue;
    if (!includeArchived && job.archived) continue;
    jobs.push(job);
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
export function getJobBySlug(slug: string): Job | null {
  const filePath = path.join(JOBS_DIR, `${slug}.json`);
  return readJobFile(filePath);
}

/**
 * Return all **active** (non-archived) jobs that belong to a specific
 * category.
 *
 * @param category - One of the valid {@link JobCategory} values.
 * @returns An array of matching {@link Job} objects sorted by `datePosted`
 *   descending (newest first).
 */
export function getJobsByCategory(category: JobCategory | string): Job[] {
  return getAllJobs().filter((job) => job.category === category);
}
