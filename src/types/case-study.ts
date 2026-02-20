/**
 * Case study data types and constants.
 *
 * All case studies are stored as individual JSON files under
 * `src/data/case-studies/` and loaded at build time via the utility functions
 * in `src/lib/case-studies.ts`.
 */

/** Union of all valid case study category slugs. */
export type CaseStudyCategory =
  | 'data-collection'
  | 'annotation'
  | 'safety'
  | 'evaluation'
  | 'video'
  | 'robotics'
  | 'gaming'
  | 'fashion-ai';

/** A single case study. */
export interface CaseStudy {
  /** URL-safe identifier used as the filename (without extension) and route param. */
  slug: string;

  /** Human-readable case study title. */
  title: string;

  /** Functional category the case study belongs to. */
  category: CaseStudyCategory;

  /** Short teaser text shown on index cards (1-2 sentences). */
  teaser: string;

  /** Large hero stat value (e.g. "50,000+", "98.7%"). */
  headlineStat: string;

  /** Label describing what the headline stat measures. */
  headlineStatLabel: string;

  /** One-paragraph executive summary. */
  summary: string;

  /** The problem statement — answer-first, then 2-4 elaboration sentences. */
  challenge: string;

  /** Methodology detail — 2-3 paragraphs of technical approach. */
  approach: string;

  /** Quantitative results — 3-4 key metrics. */
  results: { value: string; label: string }[];

  /** One paragraph on downstream impact. */
  impact: string;

  /** One paragraph on broader significance. */
  whyItMatters: string;

  /** Frequently asked questions specific to this case study (3-5). */
  faqs: { question: string; answer: string }[];

  /** Slugs of thematically related case studies (2-3). */
  relatedSlugs: string[];

  /** Link to the relevant pillar/service page. */
  pillarLink: { href: string; label: string };

  /** Primary SEO keyword this case study targets. */
  targetKeyword: string;

  /** SEO meta title (<60 chars). */
  metaTitle: string;

  /** SEO meta description (<155 chars). */
  metaDescription: string;

  /** Optional process steps for the visual flow diagram in the approach section. */
  processSteps?: Array<{
    step: string;
    title: string;
    description: string;
  }>;

  /** Paths to images in public/ (hero, process, metrics, etc.). */
  images: string[];

  /** ISO 8601 date string for when the case study was published. */
  datePublished: string;

  /** Optional sample data configuration for the interactive viewer. */
  sampleData?: {
    type: string;
    images?: Array<{
      src: string;
      label: string;
      description: string;
    }>;
  };
}

/** Human-readable labels for each case study category. */
export const CASE_STUDY_CATEGORIES: Record<CaseStudyCategory, string> = {
  'data-collection': 'Data Collection',
  annotation: 'Annotation',
  safety: 'Safety',
  evaluation: 'Evaluation',
  video: 'Video',
  robotics: 'Robotics',
  gaming: 'Gaming',
  'fashion-ai': 'Fashion AI',
};
