import { Metadata } from "next";
import { Suspense } from "react";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import VideoShowcase from "@/app/components/prospect/VideoShowcase";
import CerrionPageClient from "./CerrionPageClient";

export const metadata: Metadata = {
  title: "Cerrion | Claru",
  robots: { index: false, follow: false },
};

const DATASET_IDS = [
  "bd2b40ca-458b-468a-bba4-90ac96672c86", // Video Captioning & QA Collection (70M)
  "4bda56db-59de-4794-9913-6738955c4f8c", // Video Quality Annotations (976K)
  "a1e380ff-d244-412e-b907-a8c9c4d59248", // Multimodal Video Chat (440K)
];

// Industrial & workshop activity video samples
const VIDEO_SAMPLE_IDS = [
  "98fa7945-6c66-41d7-b257-66c86755d886", // Carpentry - workshop
  "3de9f9b1-04a0-4ff8-b047-aeff7eaff4ca", // Tool Repair
  "60689f31-4d0b-45e9-84b5-3ee19ae32839", // Clothing Shop - Steaming
  "0e5b09d7-fbfc-4a53-930f-053a979bc689", // Furniture Assembly
];

export default function CerrionPage() {
  const datasetSection = (
    <Suspense fallback={null}>
      <DatasetShowcase datasetIds={DATASET_IDS} />
    </Suspense>
  );

  const videoSection = (
    <Suspense fallback={null}>
      <VideoShowcase
        sampleIds={VIDEO_SAMPLE_IDS}
        heading="Sample Data: Industrial & Workshop Activity"
        subheading="Real-world video from workshops and production environments — carpentry, tool repair, assembly, textile processing. The kind of workplace footage that trains manufacturing monitoring models."
      />
    </Suspense>
  );

  return (
    <CerrionPageClient
      datasetSection={datasetSection}
      videoSection={videoSection}
    />
  );
}
