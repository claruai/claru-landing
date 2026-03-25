import { Metadata } from "next";
import { Suspense } from "react";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import VideoShowcase from "@/app/components/prospect/VideoShowcase";
import ParametricPageClient from "./ParametricPageClient";

export const metadata: Metadata = {
  title: "Parametric | Claru",
  robots: { index: false, follow: false },
};

const DATASET_IDS = [
  "bd2b40ca-458b-468a-bba4-90ac96672c86", // Video Captioning & QA Collection (70M)
  "4bda56db-59de-4794-9913-6738955c4f8c", // Video Quality Annotations (976K)
  "a1e380ff-d244-412e-b907-a8c9c4d59248", // Multimodal Video Chat (440K)
];

// Garment & textile handling video samples (clips table UUIDs)
const VIDEO_SAMPLE_IDS = [
  "b4dee803-c226-4e0b-9291-7ff3843f83dc", // Fold Clothes
  "f0593ef3-c9e4-4f5b-8b6d-9b4d851c3a32", // Loading clothes, folding clothes
  "119341c8-0479-40a4-986c-f079b625ffc6", // Folding Clothes
  "ed9b4ba5-8285-4a29-9111-e6d516a7b9a4", // Hang Clothes
];

export default function ParametricPage() {
  const datasetSection = (
    <Suspense fallback={null}>
      <DatasetShowcase datasetIds={DATASET_IDS} />
    </Suspense>
  );

  const videoSection = (
    <Suspense fallback={null}>
      <VideoShowcase
        sampleIds={VIDEO_SAMPLE_IDS}
        heading="Sample Data: Garment & Textile Handling"
        subheading="First-person video of folding, loading, hanging, and handling clothes and textiles — captured across different environments and techniques. Directly relevant to what your robots are learning."
      />
    </Suspense>
  );

  return (
    <ParametricPageClient
      datasetSection={datasetSection}
      videoSection={videoSection}
    />
  );
}
