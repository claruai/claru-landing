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

// Garment & textile handling video samples
const VIDEO_SAMPLE_IDS = [
  "44979405-f0a2-4bc9-9d3a-898e63ebfed8", // Fold Clothes
  "aa0fc7ad-e307-4cb2-bd79-99de411bcb4e", // Loading clothes, folding clothes
  "f13002bd-7fc2-4186-9ba3-660765dc7848", // Folding Clothes
  "3740caa3-d14e-4a43-a7c3-2d90c1604bfa", // Hang Clothes
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
