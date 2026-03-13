import { Metadata } from "next";
import { Suspense } from "react";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import VideoShowcase from "@/app/components/prospect/VideoShowcase";
import GeneralIntuitionPageClient from "./GeneralIntuitionPageClient";

export const metadata: Metadata = {
  title: "General Intuition | Claru",
  robots: { index: false, follow: false },
};

const DATASET_IDS = [
  "bd2b40ca-458b-468a-bba4-90ac96672c86", // Video Captioning & QA Collection (70M)
  "4bda56db-59de-4794-9913-6738955c4f8c", // Video Quality Annotations (976K)
  "a1e380ff-d244-412e-b907-a8c9c4d59248", // Multimodal Video Chat (440K)
];

// Everyday physical task video samples
const VIDEO_SAMPLE_IDS = [
  "44979405-f0a2-4bc9-9d3a-898e63ebfed8", // Fold Clothes
  "3486e6a3-8f4c-488d-8893-020168ec0c90", // Pour Liquid
  "632cf981-d66e-4023-a6ef-2fbaec23a111", // Pick Up Object
  "2f842ae5-0548-4e39-8926-8b9442bc7d78", // Open Door
];

export default function GeneralIntuitionPage() {
  const datasetSection = (
    <Suspense fallback={null}>
      <DatasetShowcase datasetIds={DATASET_IDS} />
    </Suspense>
  );

  const videoSection = (
    <Suspense fallback={null}>
      <VideoShowcase
        sampleIds={VIDEO_SAMPLE_IDS}
        heading="Sample Data: Everyday Physical Tasks"
        subheading="First-person video of common human actions — folding, pouring, grasping, navigating. The real-world grounding data that bridges game-trained agents to physical environments."
      />
    </Suspense>
  );

  return (
    <GeneralIntuitionPageClient
      datasetSection={datasetSection}
      videoSection={videoSection}
    />
  );
}
