export const BLOG_VISUAL_COMPOSITION_IDS = [
  'BlogStatCallout',
  'BlogDataComparison',
  'BlogTimeline',
  'BlogMetricReveal',
  'BlogProcessSteps',
] as const;

export type BlogVisualCompositionId = typeof BLOG_VISUAL_COMPOSITION_IDS[number];
