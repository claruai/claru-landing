// ---------------------------------------------------------------------------
// Programmatic SEO — Type System
// ---------------------------------------------------------------------------
// Shared base types and per-playbook extensions for all programmatic pages.
// Each playbook (glossary-deep, guides, tasks, models, etc.) extends the
// ProgrammaticPageBase with playbook-specific fields.
// ---------------------------------------------------------------------------

import type { GlossaryCategory } from "@/data/glossary";

// ---------------------------------------------------------------------------
// Shared Types
// ---------------------------------------------------------------------------

/** A single FAQ item. Answers are plain text for clean JSON-LD serialization. */
export interface ProgrammaticFAQ {
  question: string;
  answer: string;
}

/** A research paper citation with enough detail for inline references. */
export interface ProgrammaticCitation {
  /** Unique ID for inline reference mapping, e.g. "brohan-rt2-2023" */
  id: string;
  /** Full paper title */
  title: string;
  /** Abbreviated author list, e.g. "Brohan et al." */
  authors: string;
  /** Publication venue, e.g. "CoRL 2023" or "arXiv 2310.12345" */
  venue: string;
  /** Publication year */
  year: number;
  /** URL to the paper (arXiv, conference proceedings, etc.) */
  url: string;
}

/** Breadcrumb segment for structured navigation. */
export interface BreadcrumbSegment {
  label: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Page Section Types
// ---------------------------------------------------------------------------

/** A prose section with heading and paragraphs. */
export interface ProseSection {
  type: "prose";
  heading: string;
  /** Body content — each string is a paragraph. */
  paragraphs: string[];
}

/** A grid of informational cards. */
export interface CardsSection {
  type: "cards";
  heading: string;
  cards: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

/** A comparison table with rows and columns. */
export interface ComparisonTableSection {
  type: "comparison-table";
  heading: string;
  description?: string;
  columns: string[];
  rows: Record<string, string>[];
}

/** Key statistics in a horizontal strip. */
export interface StatsSection {
  type: "stats";
  heading?: string;
  stats: {
    value: string;
    label: string;
  }[];
}

/** A pipeline / step-by-step visual. */
export interface PipelineSection {
  type: "pipeline";
  heading: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
}

/** A numbered list of citations (rendered as References). */
export interface CitationListSection {
  type: "citation-list";
  heading: string;
  citations: ProgrammaticCitation[];
}

/** Union type for all section variants. */
export type PageSection =
  | ProseSection
  | CardsSection
  | ComparisonTableSection
  | StatsSection
  | PipelineSection
  | CitationListSection;

// ---------------------------------------------------------------------------
// Base Type
// ---------------------------------------------------------------------------

export interface ProgrammaticPageBase {
  /** URL slug, e.g. "vla" or "how-to-collect-teleoperation-data" */
  slug: string;

  /** <title> tag content (50-60 chars) */
  metaTitle: string;

  /** Meta description (150-160 chars) */
  metaDescription: string;

  /** Primary target keyword */
  primaryKeyword: string;

  /** Additional keywords for topical coverage */
  secondaryKeywords: string[];

  /** Canonical URL path, e.g. "/glossary/vla" */
  canonicalPath: string;

  /** H1 text */
  h1: string;

  /** Lead paragraph under the H1 */
  heroSubtitle: string;

  /** Ordered breadcrumb trail */
  breadcrumbs: BreadcrumbSegment[];

  /** Main content sections */
  sections: PageSection[];

  /** 3-5 unique FAQ items */
  faqs: ProgrammaticFAQ[];

  /** CTA block heading */
  ctaHeading: string;

  /** CTA block description */
  ctaDescription: string;

  /** Slugs of related glossary terms (for cross-links) */
  relatedGlossaryTerms: string[];

  /** Slugs of related guide pages (for cross-links) */
  relatedGuidePages: string[];

  /** Slugs of related /solutions/ pages */
  relatedSolutionSlugs: string[];
}

// ---------------------------------------------------------------------------
// Glossary Deep Page
// ---------------------------------------------------------------------------

export interface GlossaryDeepPageData extends ProgrammaticPageBase {
  /** Slug of the term in the base glossary (src/data/glossary.ts) */
  termSlug: string;

  /** Category from the base glossary */
  category: GlossaryCategory;

  /** Long-form definition (300-500 words, genuine technical depth) */
  longDefinition: string;

  /** Historical context: origin of the concept, evolution over time */
  historicalContext: string;

  /** Practical implications: how this concept affects real-world work */
  practicalImplications: string;

  /** Common misconceptions about this term */
  commonMisconceptions: {
    misconception: string;
    correction: string;
  }[];

  /** Key academic papers related to this term */
  keyPapers: ProgrammaticCitation[];

  /** How Claru's offering connects to this term */
  claruRelevance: string;
}

// ---------------------------------------------------------------------------
// How-To Guide Page
// ---------------------------------------------------------------------------

export interface GuideStep {
  /** Step number (1-based) */
  stepNumber: number;
  /** Step title, e.g. "Choose your teleoperation interface" */
  title: string;
  /** Detailed instructions for this step (100+ words) */
  description: string;
  /** Tools or technologies mentioned in this step */
  tools?: string[];
  /** Pro tips or warnings */
  tips?: string[];
}

export interface GuidePageData extends ProgrammaticPageBase {
  /** Actionable steps */
  steps: GuideStep[];

  /** Tools and technologies covered */
  tools: string[];

  /** What the reader needs before starting */
  prerequisites: string[];

  /** Difficulty level */
  difficulty: "beginner" | "intermediate" | "advanced";

  /** Estimated time to complete, e.g. "2-4 weeks" */
  estimatedTime: string;

  /** Key academic papers referenced */
  keyPapers: ProgrammaticCitation[];

  /** How Claru's offering connects to this guide */
  claruRelevance: string;
}

// ---------------------------------------------------------------------------
// Task Page
// ---------------------------------------------------------------------------

export interface TaskDataRequirements {
  /** Primary data modality, e.g. "RGB + depth", "force/torque + RGB" */
  modality: string;
  /** Data volume range, e.g. "10K–100K demonstrations" */
  volumeRange: string;
  /** Temporal resolution, e.g. "30 Hz video + 100 Hz proprioception" */
  temporalResolution: string;
  /** Key annotations needed */
  keyAnnotations: string[];
}

export interface TaskPageData extends ProgrammaticPageBase {
  /** Structured data requirements for this task */
  dataRequirements: TaskDataRequirements;

  /** Models that consume data for this task */
  relevantModels: string[];

  /** Environment types where this task occurs */
  environmentTypes: string[];

  /** Key academic papers referenced */
  keyPapers: ProgrammaticCitation[];

  /** How Claru supports this task's data needs */
  claruRelevance: string;
}

// ---------------------------------------------------------------------------
// Model-Specific Page
// ---------------------------------------------------------------------------

export interface ModelInputSpec {
  /** e.g. "256x256 RGB images" */
  observationFormat: string;
  /** e.g. "7-DoF delta joint positions" */
  actionFormat: string;
  /** e.g. "natural language instructions" */
  languageConditioning: string;
  /** e.g. "50 Hz" */
  controlFrequency: string;
}

export interface ModelPageData extends ProgrammaticPageBase {
  /** Full name of the model, e.g. "OpenVLA" */
  modelName: string;

  /** Organization behind the model, e.g. "Stanford / TRI" */
  organization: string;

  /** Year published */
  year: number;

  /** Input/output specifications */
  inputSpec: ModelInputSpec;

  /** Recommended data volumes from papers */
  dataVolumeBenchmarks: string;

  /** Training recipe summary */
  trainingRecipe: string;

  /** How Claru data integrates with this model */
  claruIntegration: string;

  /** Key academic papers referenced */
  keyPapers: ProgrammaticCitation[];
}

// ---------------------------------------------------------------------------
// Academic Alternative Page
// ---------------------------------------------------------------------------

export interface AcademicDatasetProfile {
  /** Institution that published the dataset, e.g. "Meta AI / University of Bristol" */
  institution: string;
  /** Year of publication */
  year: number;
  /** Dataset size, e.g. "3,670 hours of video" */
  scale: string;
  /** License type, e.g. "CC BY-NC 4.0" */
  license: string;
  /** Data modalities available */
  modalities: string[];
}

export interface AcademicAltPageData extends ProgrammaticPageBase {
  /** The academic dataset being compared against */
  datasetName: string;

  /** Profile of the academic dataset */
  academicProfile: AcademicDatasetProfile;

  /** Specific limitations of the academic dataset */
  limitations: string[];

  /** Claru advantages over this dataset */
  claruAdvantages: string[];

  /** Key academic papers referenced */
  keyPapers: ProgrammaticCitation[];

  /** How Claru helps teams that outgrow this dataset */
  claruRelevance: string;
}
