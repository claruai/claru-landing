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

// Everyday physical task video samples (clips table UUIDs)
const VIDEO_SAMPLE_IDS = [
  "b4dee803-c226-4e0b-9291-7ff3843f83dc", // Fold Clothes
  "20438f6e-014e-41cb-a114-380ea618bb69", // Pour Liquid
  "c7aaf5f5-3ec0-48f8-9b89-6c5c0c8f5400", // Pick Up Object
  "deea2d6b-8393-41dd-8667-86e167a49cf4", // Open Door
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
