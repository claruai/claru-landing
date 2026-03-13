import { Metadata } from "next";
import { Suspense } from "react";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import VideoShowcase from "@/app/components/prospect/VideoShowcase";
import CoramAiPageClient from "./CoramAiPageClient";

export const metadata: Metadata = {
  title: "Coram AI | Claru",
  robots: { index: false, follow: false },
};

const DATASET_IDS = [
  "bd2b40ca-458b-468a-bba4-90ac96672c86", // Video Captioning & QA Collection (70M)
  "4bda56db-59de-4794-9913-6738955c4f8c", // Video Quality Annotations (976K)
  "a1e380ff-d244-412e-b907-a8c9c4d59248", // Multimodal Video Chat (440K)
];

// Real-world environment video samples — streets, walkways, facilities
const VIDEO_SAMPLE_IDS = [
  "d71a4139-054c-442d-85c6-d0c3d95c6cd1", // Traffic video
  "e6888e10-8704-43bf-9d8f-14746ae43253", // Traffic video
  "a4e8d67c-31e1-4d5b-9d24-c6d322c9b270", // Walking - outdoor
  "e2875e4b-851e-4a3c-a496-2c38c54d4284", // Move Forward - Outdoor
];

export default function CoramAiPage() {
  const datasetSection = (
    <Suspense fallback={null}>
      <DatasetShowcase datasetIds={DATASET_IDS} />
    </Suspense>
  );

  const videoSection = (
    <Suspense fallback={null}>
      <VideoShowcase
        sampleIds={VIDEO_SAMPLE_IDS}
        heading="Sample Data: Real-World Environments"
        subheading="Video from the kinds of environments security cameras monitor — streets, walkways, facilities. Diverse scenarios, lighting conditions, and activity types."
      />
    </Suspense>
  );

  return (
    <CoramAiPageClient
      datasetSection={datasetSection}
      videoSection={videoSection}
    />
  );
}
