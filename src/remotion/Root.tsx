import React from "react";
import { Composition } from "remotion";
import EgocentricPipeline from "./EgocentricPipeline";
import SensorFusionComposition from "./compositions/type-1/SensorFusionComposition";
import PairwiseArenaComposition from "./compositions/type-2/PairwiseArenaComposition";
import MultiGenGalleryComposition from "./compositions/type-3/MultiGenGalleryComposition";
import DetectionAnnotationComposition from "./compositions/type-4/DetectionAnnotationComposition";
import ClassificationPipelineComposition from "./compositions/type-5/ClassificationPipelineComposition";
import QualityRubricComposition from "./compositions/type-6/QualityRubricComposition";
import SafetyShieldComposition from "./compositions/type-7/SafetyShieldComposition";
import CinematicShowcaseComposition from "./compositions/type-8/CinematicShowcaseComposition";
import InfrastructureDetectionComposition from "./compositions/type-9/InfrastructureDetectionComposition";
import manifest from "../../scripts/composition-manifest.json";
import BlogStatCallout, { blogStatCalloutSchema } from "./blog-visuals/BlogStatCallout";
import BlogDataComparison, { blogDataComparisonSchema } from "./blog-visuals/BlogDataComparison";
import BlogTimeline, { blogTimelineSchema } from "./blog-visuals/BlogTimeline";
import BlogMetricReveal, { blogMetricRevealSchema } from "./blog-visuals/BlogMetricReveal";
import BlogProcessSteps, { blogProcessStepsSchema } from "./blog-visuals/BlogProcessSteps";
import DynamicVisual from "./blog-visuals/DynamicVisual";

// ---------------------------------------------------------------------------
// TYPE_MAP: composition type number -> React component
// ---------------------------------------------------------------------------
const TYPE_MAP: Record<number, React.FC<{ compositionId: string }>> = {
  1: SensorFusionComposition,
  2: PairwiseArenaComposition,
  3: MultiGenGalleryComposition,
  4: DetectionAnnotationComposition,
  5: ClassificationPipelineComposition,
  6: QualityRubricComposition,
  7: SafetyShieldComposition,
  8: CinematicShowcaseComposition,
  9: InfrastructureDetectionComposition,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Existing prototype composition — kept for backward compatibility */}
      <Composition
        id="EgocentricPipeline"
        component={EgocentricPipeline}
        durationInFrames={258}
        fps={30}
        width={1280}
        height={720}
      />

      {/* ── Blog-visuals compositions (5 parameterized templates) ── */}
      <Composition id="BlogStatCallout" component={BlogStatCallout} schema={blogStatCalloutSchema} durationInFrames={240} fps={30} width={1280} height={720} defaultProps={{ stat: '78%', label: 'policy success rate on held-out tasks', context: 'Source: Open X-Embodiment study, 2024' }} />
      <Composition id="BlogDataComparison" component={BlogDataComparison} schema={blogDataComparisonSchema} durationInFrames={300} fps={30} width={1280} height={720} defaultProps={{ title: 'Gig Worker vs. Structured Collection', rows: [{ label: 'Rejection rate', a: '40%', b: '< 8%' }, { label: 'Protocol consistency', a: 'Variable', b: 'Standardized' }, { label: 'Annotation depth', a: 'Basic labels', b: 'Full semantic tree' }, { label: 'Scale', a: 'High volume', b: 'Quality-gated' }] }} />
      <Composition id="BlogTimeline" component={BlogTimeline} schema={blogTimelineSchema} durationInFrames={360} fps={30} width={1280} height={720} defaultProps={{ events: [{ date: '2022', label: 'ACT paper — action chunking with transformers' }, { date: '2023', label: 'Open X-Embodiment: 22 datasets, 1M+ demos' }, { date: 'Jan 2024', label: 'Diffusion Policy scales to dexterous tasks' }, { date: 'Mar 2024', label: 'Physical Intelligence π0 demo' }, { date: '2025', label: 'Humanoid labs hit 10k+ daily demonstrations' }] }} />
      <Composition id="BlogMetricReveal" component={BlogMetricReveal} schema={blogMetricRevealSchema} durationInFrames={240} fps={30} width={1280} height={720} defaultProps={{ before: '40% rejection rate', after: '< 8% rejection rate', metric: 'with structured collection protocols' }} />
      <Composition id="BlogProcessSteps" component={BlogProcessSteps} schema={blogProcessStepsSchema} durationInFrames={300} fps={30} width={1280} height={720} defaultProps={{ steps: ['Define task specification with success criteria', 'Deploy structured data collection with protocol training', 'Run real-time QA with rejection thresholds', 'Enrich with semantic annotations and embeddings', 'Deliver with documentation for policy training'] }} />

      {/* ── DynamicVisual — AI-generated bespoke composition per blog post ── */}
      <Composition id="DynamicVisual" component={DynamicVisual} durationInFrames={240} fps={30} width={1280} height={720} />

      {/* 23 compositions registered from composition-manifest.json */}
      {manifest.compositions.map((entry) => {
        const Component = TYPE_MAP[entry.type];
        if (!Component) return null;

        return (
          <Composition
            key={entry.id}
            id={entry.id}
            component={Component}
            durationInFrames={entry.render.durationFrames}
            fps={entry.render.fps}
            width={entry.render.width}
            height={entry.render.height}
            defaultProps={{ compositionId: entry.id }}
          />
        );
      })}
    </>
  );
};
