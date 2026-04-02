export interface CrawledItem {
  url: string;
  urlHash: string;
  title: string;
  summary?: string;
  source: 'arxiv' | 'hn' | 'reddit' | 'rss';
  score: number;
  publishedAt: string;
}

export interface TopicSelection {
  topic: string;
  targetQuery: string;
  sourceItems: number[];
}

export interface BlogDraft {
  title: string;
  slug: string;
  excerpt: string;
  body_mdx: string;
  tags: string[];
  source_urls: string[];
  mentions?: Array<{ name: string; url: string }>;
}

// ---- Pipeline phase interfaces ----

export interface AnalystResult {
  query: string;
  angle: string;
  postType: 'keyword' | 'timely' | 'case_study';
  competitorGaps?: string[];
  serpFAQs?: string[];
  twitterHook?: string;
  researchBriefing: string;
  backlogId?: string;
}

export interface ResearchFindings {
  sources: string[];
  keyInsights: string[];
}

export interface ResearchBrief {
  topInsights: string[];
  keyNumbers: string[];
  citableSources: string[];
  faqQuestions: string[];
  recommendedAngle: string[];
  internalLinks: string[];
}

export interface EditorOutput {
  revisedBodyMdx: string;
  editorialNotes: string[];
  slopScore: number;
}

export interface SeoOutput {
  revisedBodyMdx: string;
  revisedExcerpt: string;
  seoNotes: string[];
  geoScore: number;
  citabilityScore: number;
}

export interface VisualDesignerOutput {
  videoUrl: string | null;
  compositionId: string | null;
  inputProps: Record<string, unknown> | null;
  visualConcept: string;
}

export interface AssemblyInput {
  analystResult: AnalystResult;
  draft: BlogDraft;
  editorOutput: EditorOutput;
  seoOutput: SeoOutput;
  visualOutput: VisualDesignerOutput;
  brief: ResearchBrief;
}

export interface PipelineResult {
  success: boolean;
  postId?: string;
  error?: string;
  runId?: string;
}
