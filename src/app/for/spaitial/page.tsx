import { Metadata } from "next";
import { Suspense } from "react";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import VideoShowcase from "@/app/components/prospect/VideoShowcase";
import SpaitialPageClient from "./SpaitialPageClient";

export const metadata: Metadata = {
  title: "SpAItial | Claru",
  robots: { index: false, follow: false },
};

const DATASET_IDS = [
  "bd2b40ca-458b-468a-bba4-90ac96672c86", // Video Captioning & QA Collection (70M)
  "4bda56db-59de-4794-9913-6738955c4f8c", // Video Quality Annotations (976K)
  "a1e380ff-d244-412e-b907-a8c9c4d59248", // Multimodal Video Chat (440K)
];

// Diverse 3D environment video samples
const VIDEO_SAMPLE_IDS = [
  "0e5b09d7-fbfc-4a53-930f-053a979bc689", // Furniture Assembly (spatial complexity)
  "98fa7945-6c66-41d7-b257-66c86755d886", // Carpentry (workshop environment)
  "4bfc4680-c3cf-4e7f-8c36-076bae7f600a", // Barista (commercial interior)
  "60689f31-4d0b-45e9-84b5-3ee19ae32839", // Clothing Shop - Steaming (retail space)
];

export default function SpaitialPage() {
  const datasetSection = (
    <Suspense fallback={null}>
      <DatasetShowcase datasetIds={DATASET_IDS} />
    </Suspense>
  );

  const videoSection = (
    <Suspense fallback={null}>
      <VideoShowcase
        sampleIds={VIDEO_SAMPLE_IDS}
        heading="Sample Data: Diverse 3D Environments"
        subheading="Egocentric video captured across varied real-world spaces — workshops, commercial interiors, retail environments. Rich spatial context with diverse layouts, lighting, and object arrangements."
      />
    </Suspense>
  );

  return (
    <SpaitialPageClient
      datasetSection={datasetSection}
      videoSection={videoSection}
    />
  );
}
