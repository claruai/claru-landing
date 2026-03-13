import { Metadata } from "next";
import { Suspense } from "react";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import VideoShowcase from "@/app/components/prospect/VideoShowcase";
import SereactPageClient from "./SereactPageClient";

export const metadata: Metadata = {
  title: "Sereact | Claru",
  robots: { index: false, follow: false },
};

const DATASET_IDS = [
  "bd2b40ca-458b-468a-bba4-90ac96672c86", // Video Captioning & QA Collection (70M)
  "4bda56db-59de-4794-9913-6738955c4f8c", // Video Quality Annotations (976K)
  "a1e380ff-d244-412e-b907-a8c9c4d59248", // Multimodal Video Chat (440K)
];

// Workplace egocentric video samples — manipulation tasks in real environments
const VIDEO_SAMPLE_IDS = [
  "0e5b09d7-fbfc-4a53-930f-053a979bc689", // Furniture Assembly
  "98fa7945-6c66-41d7-b257-66c86755d886", // Carpentry - Cutting & Handling Wood
  "4bfc4680-c3cf-4e7f-8c36-076bae7f600a", // Barista - Preparing Drinks
  "3de9f9b1-04a0-4ff8-b047-aeff7eaff4ca", // Tool Repair
];

export default function SereactPage() {
  const datasetSection = (
    <Suspense fallback={null}>
      <DatasetShowcase datasetIds={DATASET_IDS} />
    </Suspense>
  );

  const videoSection = (
    <Suspense fallback={null}>
      <VideoShowcase
        sampleIds={VIDEO_SAMPLE_IDS}
        heading="Sample Data: Workplace Manipulation Tasks"
        subheading="Egocentric video of hands-on manipulation in real workplaces — assembly, tool use, object handling. The kind of diverse physical interaction data that complements what your deployments capture."
      />
    </Suspense>
  );

  return (
    <SereactPageClient
      datasetSection={datasetSection}
      videoSection={videoSection}
    />
  );
}
