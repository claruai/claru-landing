// ---------------------------------------------------------------------------
// ContentPageData Type System
// ---------------------------------------------------------------------------
// Core types for the /solutions/[slug] content pages. Each page is a single
// TypeScript file in this directory that default-exports a ContentPageData
// object. The page registry (index.ts) discovers them at build time.
// ---------------------------------------------------------------------------

/**
 * A single research paper citation used for inline references and the
 * "References" section at the bottom of a content page.
 */
export interface ResearchCitation {
  /** Unique ID used for inline reference mapping, e.g. "ego4d-2022" */
  id: string;
  /** Full paper title */
  title: string;
  /** Abbreviated author list, e.g. "Grauman et al." */
  authors: string;
  /** Publication venue, e.g. "CVPR 2022" */
  venue: string;
  /** Publication year */
  year: number;
  /** URL to the paper (arXiv, conference page, etc.) */
  url: string;
  /** One-sentence summary of the relevant finding */
  keyClaim: string;
  /** Optional DOI identifier */
  doi?: string;
}

/**
 * A section within the problem or solution area of a content page.
 * Used for structured multi-paragraph content with citation references.
 */
export interface ContentSection {
  /** Section heading text */
  heading: string;
  /** Body content (paragraph text) */
  content: string;
  /** IDs referencing entries in the page's citations array */
  citationIds: string[];
}

/**
 * A row in the dataset comparison table (Landscape section).
 */
export interface DatasetComparisonRow {
  /** Dataset name, e.g. "Ego4D" */
  name: string;
  /** Scale description, e.g. "3,670 hours" */
  scale: string;
  /** Supported tasks, e.g. "Activity recognition, object interaction" */
  tasks: string;
  /** Target environments, e.g. "Kitchen, workshop, outdoor" */
  environments: string;
  /** Known limitations of this dataset */
  limitations: string;
  /** Whether this row represents Claru's offering */
  isClaru: boolean;
}

/**
 * A single FAQ item. Answers are plain text (no HTML) so they serialize
 * cleanly into FAQPage JSON-LD.
 */
export interface FAQ {
  /** The question, phrased as the buyer would ask it */
  question: string;
  /** Plain-text answer (no HTML, no JSX) */
  answer: string;
}

/**
 * Core data model for a /solutions/[slug] content page.
 *
 * Each content page targets a specific buyer-intent keyword and is composed
 * of: hero, problem statement, landscape comparison, solution with inline
 * case studies, dataset showcase, FAQ, and research citations.
 */
export interface ContentPageData {
  // -- Identity & SEO --

  /** URL slug, e.g. "egocentric-video-data" */
  slug: string;
  /** H1 text */
  title: string;
  /** <title> tag content (50-60 chars recommended) */
  metaTitle: string;
  /** Meta description (150-160 chars recommended) */
  metaDescription: string;
  /** Primary target keyword */
  primaryKeyword: string;
  /** Additional keywords for topical coverage */
  secondaryKeywords: string[];
  /** Short label for the breadcrumb trail */
  breadcrumbLabel: string;
  /** OG image category parameter */
  ogCategory: string;

  // -- Hero --

  /** Lead paragraph under the H1 */
  heroSubtitle: string;

  /** Optional path to a pre-rendered hero video (e.g. "/videos/sol-egocentric.mp4") */
  videoSrc?: string;

  // -- Problem Section --

  /** The "problem" this page addresses */
  problem: {
    /** Question-form H2 heading */
    heading: string;
    /** Structured sections with citation references */
    sections: ContentSection[];
  };

  // -- Landscape / Comparison --

  /** Dataset comparison table data */
  landscape: {
    /** Question-form H2 heading */
    heading: string;
    /** Section intro paragraph */
    description: string;
    /** Comparison rows (open datasets vs Claru) */
    datasets: DatasetComparisonRow[];
  };

  // -- Solution Section --

  /** How Claru solves the problem */
  solution: {
    /** Question-form H2 heading */
    heading: string;
    /** Structured methodology sections with citation references */
    sections: ContentSection[];
  };

  // -- Case Studies --

  /** Case study slugs to render inline as proof (from src/data/case-studies/) */
  caseStudySlugs: string[];

  // -- Dataset Showcase --

  /** Supabase dataset UUIDs to feature (empty array is valid) */
  datasetIds: string[];

  // -- Media Showcase --

  /** Supabase dataset_samples UUIDs for VideoShowcase (S3 presigned videos). Empty = no showcase. */
  sampleIds?: string[];

  /** Optional heading for the video showcase section */
  sampleShowcaseHeading?: string;

  /** Optional subheading for the video showcase section */
  sampleShowcaseSubheading?: string;

  // -- FAQ --

  /** 3-5 FAQ items for both rendered HTML and FAQPage JSON-LD */
  faqs: FAQ[];

  // -- Research Citations --

  /** Research papers cited throughout the page */
  citations: ResearchCitation[];

  // -- Internal Linking --

  /** Links to related pillar pages */
  pillarLinks: string[];

  // -- Related Content Pages --

  /** Other content page slugs for the "Related Solutions" section (REQUIRED) */
  relatedSlugs: string[];
}

// ---------------------------------------------------------------------------
// Citation Utilities
// ---------------------------------------------------------------------------

/**
 * Builds a map from citation ID to 1-based reference number.
 *
 * Used to render inline `[1]`-style references and to match them to the
 * numbered list in the ResearchCitations component.
 *
 * @example
 * ```ts
 * const map = buildCitationMap(page.citations);
 * map.get("ego4d-2022"); // => 1
 * map.get("droid-2024"); // => 2
 * ```
 */
export function buildCitationMap(
  citations: ResearchCitation[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (let i = 0; i < citations.length; i++) {
    map.set(citations[i].id, i + 1);
  }
  return map;
}
