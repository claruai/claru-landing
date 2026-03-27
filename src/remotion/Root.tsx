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
import PointCloudFlythrough from "./compositions/enrichment-viz/PointCloudFlythrough";
import HandMeshShowcase from "./compositions/enrichment-viz/HandMeshShowcase";
import TrellisReconstruction from "./compositions/enrichment-viz/TrellisReconstruction";
import HumanFoldMesh from "./compositions/enrichment-viz/HumanFoldMesh";
import StatReveal from "./compositions/social/StatReveal";
import TerminalQuery from "./compositions/social/TerminalQuery";
import NetworkStatus from "./compositions/social/NetworkStatus";
import BeforeAfterReveal from "./compositions/social/BeforeAfterReveal";
import SixViewGrid from "./compositions/social/SixViewGrid";
import QuoteReveal from "./compositions/social/QuoteReveal";
import FromTheLabClip from "./compositions/social/FromTheLabClip";
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

      {/* ----------------------------------------------------------------- */}
      {/* Enrichment Viz — 3D asset compositions for the enrichment scroll  */}
      {/* ----------------------------------------------------------------- */}
      <Composition
        id="enrichment-pointcloud-flythrough"
        component={PointCloudFlythrough}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ compositionId: "enrichment-pointcloud-flythrough" }}
      />
      <Composition
        id="enrichment-hand-mesh"
        component={HandMeshShowcase}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ compositionId: "enrichment-hand-mesh" }}
      />
      <Composition
        id="enrichment-trellis-reconstruction"
        component={TrellisReconstruction}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ compositionId: "enrichment-trellis-reconstruction" }}
      />
      <Composition
        id="enrichment-human-fold-mesh"
        component={HumanFoldMesh}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ compositionId: "enrichment-human-fold-mesh" }}
      />

      {/* ----------------------------------------------------------------- */}
      {/* Social Media — 1080x1080 square compositions for Twitter/LinkedIn */}
      {/* ----------------------------------------------------------------- */}
      <Composition
        id="social-stat-reveal"
        component={StatReveal}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          stat: "3,741,892",
          label: "human annotations completed",
          sublabel: "across 15 datasets",
        }}
      />
      <Composition
        id="social-terminal-query"
        component={TerminalQuery}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          lines: [
            { type: "query" as const, text: "SELECT COUNT(*) FROM clips;" },
            { type: "result" as const, text: "1,045,231" },
            { type: "query" as const, text: "SELECT DISTINCT category FROM datasets;" },
            { type: "array" as const, text: "egocentric, cinematic, traffic, workplace" },
            { type: "array" as const, text: "game_env, quality, safety, preference" },
            { type: "query" as const, text: "SELECT status FROM pipeline;" },
            { type: "result" as const, text: "ACTIVE \u2014 6 enrichment layers running" },
          ],
        }}
      />
      <Composition
        id="social-network-status"
        component={NetworkStatus}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          cities: [
            { name: "Nairobi", count: 420, active: true },
            { name: "Manila", count: 380, active: true },
            { name: "Lagos", count: 310, active: true },
            { name: "Dhaka", count: 290, active: false },
            { name: "Bogota", count: 250, active: true },
            { name: "Accra", count: 180, active: true },
            { name: "Hanoi", count: 160, active: false },
          ],
          total: "2,041",
        }}
      />
      <Composition
        id="social-before-after"
        component={BeforeAfterReveal}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          title: "Enrichment Pipeline",
          beforeLabel: "RAW CAPTURE",
          afterLabel: "ENRICHED",
          beforeSrc: "enrichment-assets/before-sample.mp4",
          afterSrc: "enrichment-assets/after-sample.mp4",
        }}
      />
      <Composition
        id="social-before-after-landscape"
        component={BeforeAfterReveal}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Enrichment Pipeline",
          beforeLabel: "RAW CAPTURE",
          afterLabel: "ENRICHED",
          beforeSrc: "enrichment-assets/before-sample.mp4",
          afterSrc: "enrichment-assets/after-sample.mp4",
        }}
      />
      <Composition
        id="social-six-view-grid"
        component={SixViewGrid}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          panels: [
            { label: "RGB", src: "enrichment-assets/rgb-sample.mp4", accent: "#e8e8e8" },
            { label: "Depth", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_01.png", accent: "#4a90d9" },
            { label: "Segmentation", src: "enrichment-assets/skeletons/33c400a3_skeleton_frame_01.jpg", accent: "#c084fc" },
            { label: "Pose", src: "enrichment-assets/skeletons/33c400a3_skeleton_frame_02.jpg", accent: "#92B090" },
            { label: "Flow", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_02.png", accent: "#f5a623" },
            { label: "3D Mesh", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_03.png", accent: "#38bdf8" },
          ],
        }}
      />
      <Composition
        id="social-six-view-grid-landscape"
        component={SixViewGrid}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          panels: [
            { label: "RGB", src: "enrichment-assets/rgb-sample.mp4", accent: "#e8e8e8" },
            { label: "Depth", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_01.png", accent: "#4a90d9" },
            { label: "Segmentation", src: "enrichment-assets/skeletons/33c400a3_skeleton_frame_01.jpg", accent: "#c084fc" },
            { label: "Pose", src: "enrichment-assets/skeletons/33c400a3_skeleton_frame_02.jpg", accent: "#92B090" },
            { label: "Flow", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_02.png", accent: "#f5a623" },
            { label: "3D Mesh", src: "enrichment-assets/depth-stills/33c400a3_marigold_frame_03.png", accent: "#38bdf8" },
          ],
        }}
      />
      <Composition
        id="social-quote-reveal"
        component={QuoteReveal}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          quote: "The bottleneck in frontier AI isn't compute. It's the quality of human signal in the training data.",
          attribution: "Claru AI",
        }}
      />
      <Composition
        id="social-from-the-lab"
        component={FromTheLabClip}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          videoSrc: "remotion-assets/samples/cs-egocentric.mp4",
          location: "Nairobi, Kenya",
          stat: "4,200 clips this week",
          sessionId: "session-4217",
          timestamp: "2026.03.27",
        }}
      />
      <Composition
        id="social-from-the-lab-landscape"
        component={FromTheLabClip}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoSrc: "remotion-assets/samples/cs-egocentric.mp4",
          location: "Nairobi, Kenya",
          stat: "4,200 clips this week",
          sessionId: "session-4217",
          timestamp: "2026.03.27",
        }}
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
