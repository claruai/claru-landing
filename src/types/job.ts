/**
 * Job board data types and constants.
 *
 * All job listings are stored as individual JSON files under `src/data/jobs/`
 * and loaded at build time via the utility functions in `src/lib/jobs.ts`.
 */

/** Union of all valid job category slugs. */
export type JobCategory =
  | 'data-labeling'
  | 'quality-review'
  | 'video-capture'
  | 'gaming'
  | 'rlhf'
  | 'red-teaming'
  | 'coding-review'
  | 'vision-annotation';

/** A single job listing. */
export interface Job {
  /** URL-safe identifier used as the filename (without extension) and route param. */
  slug: string;

  /** Human-readable job title. */
  title: string;

  /** Functional category the role belongs to. */
  category: JobCategory;

  /** Full description of the role rendered on the detail page. */
  description: string;

  /** Required or preferred skills. */
  skills: string[];

  /** Lower bound of the hourly compensation range (USD). */
  compensationMin: number;

  /** Upper bound of the hourly compensation range (USD). */
  compensationMax: number;

  /** Employment relationship type. All Claru roles are contractor-based. */
  employmentType: 'CONTRACTOR';

  /** Work location type. All Claru roles are remote. */
  locationType: 'TELECOMMUTE';

  /** Optional geographic restriction (e.g. "US", "EU"). */
  locationRequirements?: string;

  /** ISO 8601 date string for when the listing was published. */
  datePosted: string;

  /** ISO 8601 date string for when the listing expires. */
  validThrough: string;

  /** Whether the listing should be highlighted in the UI. */
  featured: boolean;

  /** Whether the listing has been archived (hidden from public views). */
  archived: boolean;

  /** Frequently asked questions specific to this role. */
  faqs: { question: string; answer: string }[];
}

/** Human-readable labels for each job category. */
export const JOB_CATEGORIES: Record<JobCategory, string> = {
  'data-labeling': 'Data Labeling',
  'quality-review': 'Quality Review',
  'video-capture': 'Video Capture',
  'gaming': 'Gaming',
  'rlhf': 'RLHF',
  'red-teaming': 'Red Teaming',
  'coding-review': 'Coding Review',
  'vision-annotation': 'Vision Annotation',
};

/** Hourly compensation tiers (USD) used for filtering and display. */
export const COMPENSATION_TIERS = {
  entry: { min: 20, max: 35, label: 'Entry' },
  standard: { min: 35, max: 55, label: 'Standard' },
  expert: { min: 55, max: 100, label: 'Expert' },
} as const;
