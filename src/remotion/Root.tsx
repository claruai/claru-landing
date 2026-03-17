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
import manifest from "../../scripts/composition-manifest.json";

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

      {/* 22 compositions registered from composition-manifest.json */}
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
