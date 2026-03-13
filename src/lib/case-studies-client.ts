/**
 * Client-safe subset of case study utilities.
 *
 * This module re-exports the lightweight metadata mapping and lookup helpers
 * from case-studies.ts WITHOUT the Node-dependent filesystem functions.
 * Safe to import from 'use client' components.
 *
 * The canonical data lives in src/lib/case-studies.ts — if you add or update a
 * case study, update it there and re-export here.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Metadata for a case study used in prospect pages and card components. */
export interface CaseStudyMeta {
  title: string;
  description: string;
  tags: string[];
  url: string;
}

/** All published case study slugs. */
export type CaseStudySlug =
  | 'red-teaming-moderation'
  | 'video-quality-at-scale'
  | 'video-content-classification'
  | 'prompt-enhancement-benchmark'
  | 'object-identity-persistence'
  | 'workplace-egocentric-data'
  | 'video-model-evaluation'
  | 'generative-ai-safety'
  | 'fashion-ai-annotation'
  | 'game-based-data-capture'
  | 'egocentric-video-collection';

// ---------------------------------------------------------------------------
// Static mapping (mirrors src/lib/case-studies.ts — keep in sync)
// ---------------------------------------------------------------------------

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudyMeta> = {
  'red-teaming-moderation': {
    title: 'Building and Red-Teaming an AI Content Moderation System',
    description:
      'How we built and stress-tested a production content moderation system achieving sub-2% rejection with full safety coverage.',
    tags: ['safety', 'content-moderation', 'red-teaming'],
    url: '/case-studies/red-teaming-moderation',
  },
  'video-quality-at-scale': {
    title: 'Video Quality Annotation at Scale for RLHF and Model Selection',
    description:
      '976K+ human quality assessments across motion, fidelity, interest, and alignment — enabling a frontier video generation lab to train reward models and optimize performance through RLHF.',
    tags: ['video', 'annotation', 'rlhf', 'evaluation'],
    url: '/case-studies/video-quality-at-scale',
  },
  'video-content-classification': {
    title: 'High-Confidence Video Content Classification at Scale',
    description:
      '105,000 video clips classified in 7 days with zero rework. A mid-project framework redesign eliminated annotator subjectivity with concrete decision paths and automated confidence tiers.',
    tags: ['video', 'annotation', 'classification'],
    url: '/case-studies/video-content-classification',
  },
  'prompt-enhancement-benchmark': {
    title: 'Benchmarking Prompt Enhancement Quality Across Leading LLMs',
    description:
      'A comprehensive evaluation of prompt enhancement solutions using 180 prompts assessed across text and video modalities, employing human evaluation with statistical significance testing.',
    tags: ['evaluation', 'llm', 'benchmarking'],
    url: '/case-studies/prompt-enhancement-benchmark',
  },
  'object-identity-persistence': {
    title: 'Preserving Object Identity Across Video Time',
    description:
      '1.07M+ cross-segment identity verifications using bounding boxes, facial keypoints, and human validation to teach video models to maintain object identity despite viewpoint changes, occlusion, and lighting shifts.',
    tags: ['video', 'annotation', 'object-tracking'],
    url: '/case-studies/object-identity-persistence',
  },
  'workplace-egocentric-data': {
    title: 'Workplace Egocentric Video Data for General-Purpose Robotics',
    description:
      'First-person video captured across 10 real workplace categories — barista stations, carpentry shops, tailoring studios, and more — producing 4K/60fps footage of genuine work environments for robotics training.',
    tags: ['robotics', 'egocentric', 'data-collection', 'video'],
    url: '/case-studies/workplace-egocentric-data',
  },
  'video-model-evaluation': {
    title: 'Human Evaluation of Video Generation Model Configurations',
    description:
      '39,000 pairwise human evaluations across 51 video models using ELO ranking to replace subjective selection with statistically defensible, evidence-based performance rankings.',
    tags: ['video', 'evaluation', 'model-selection'],
    url: '/case-studies/video-model-evaluation',
  },
  'generative-ai-safety': {
    title: 'Scaling Generative AI Safety Through Human-Led Data Labeling',
    description:
      '241,000+ safety annotations across text and video to measure residual risk in automated moderation systems, providing audit-ready evidence of safety performance.',
    tags: ['safety', 'annotation', 'content-moderation'],
    url: '/case-studies/generative-ai-safety',
  },
  'fashion-ai-annotation': {
    title: 'Large-Scale Image Annotation for Fashion AI',
    description:
      '1,000+ annotators labeling 3 million fashion images using structured taxonomy and multi-layer quality assurance, improving visual product recognition accuracy and SKU conditioning performance.',
    tags: ['fashion', 'annotation', 'image'],
    url: '/case-studies/fashion-ai-annotation',
  },
  'game-based-data-capture': {
    title: 'Game-Based Data Capture for Real-World Simulation',
    description:
      'A custom capture system recording 10,000+ hours of synchronized gameplay footage paired with precise, timestamped control data — enabling AI agents to learn human behavior in complex 3D environments.',
    tags: ['gaming', 'data-collection', 'simulation'],
    url: '/case-studies/game-based-data-capture',
  },
  'egocentric-video-collection': {
    title: 'Egocentric Video Data Collection for Robotics and World Modeling',
    description:
      '386K+ first-person video clips captured across three parallel pipelines — GoPro, smartphone, and activity-specific — with same-day QA and weekly delivery batches.',
    tags: ['robotics', 'egocentric', 'data-collection', 'video'],
    url: '/case-studies/egocentric-video-collection',
  },
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Look up case study metadata by slug.
 *
 * @returns The matching {@link CaseStudyMeta} or `undefined` if the slug is
 *   not found.
 */
export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES[slug as CaseStudySlug];
}
