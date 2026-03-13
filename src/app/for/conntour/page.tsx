import { Metadata } from "next";
import { Suspense } from "react";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import VideoShowcase from "@/app/components/prospect/VideoShowcase";
import ConntourPageClient from "./ConntourPageClient";

export const metadata: Metadata = {
  title: "Conntour | Claru",
  robots: { index: false, follow: false },
};

const DATASET_IDS = [
  "bd2b40ca-458b-468a-bba4-90ac96672c86", // Video Captioning & QA Collection (70M)
  "4bda56db-59de-4794-9913-6738955c4f8c", // Video Quality Annotations (976K)
  "a1e380ff-d244-412e-b907-a8c9c4d59248", // Multimodal Video Chat (440K)
];

// Diverse activities & environments video samples
const VIDEO_SAMPLE_IDS = [
  "4bfc4680-c3cf-4e7f-8c36-076bae7f600a", // Barista - Preparing Drinks
  "a4e8d67c-31e1-4d5b-9d24-c6d322c9b270", // Walking
  "d71a4139-054c-442d-85c6-d0c3d95c6cd1", // Traffic
  "632cf981-d66e-4023-a6ef-2fbaec23a111", // Pick Up Object
];

export default function ConntourPage() {
  const datasetSection = (
    <Suspense fallback={null}>
      <DatasetShowcase datasetIds={DATASET_IDS} />
    </Suspense>
  );

  const videoSection = (
    <Suspense fallback={null}>
      <VideoShowcase
        sampleIds={VIDEO_SAMPLE_IDS}
        heading="Sample Data: Diverse Activities & Environments"
        subheading="Video spanning indoor and outdoor settings — workplaces, streets, commercial spaces. The diversity of behaviors and environments that a camera search model needs to understand."
      />
    </Suspense>
  );

  return (
    <ConntourPageClient
      datasetSection={datasetSection}
      videoSection={videoSection}
    />
  );
}
