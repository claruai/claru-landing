import { Metadata } from "next";
import { Suspense } from "react";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import RimePageClient from "./RimePageClient";

export const metadata: Metadata = {
  title: "Prepared for Rime | Claru",
  robots: { index: false, follow: false },
};

const DATASET_IDS = [
  "d69f4c6d-ca1d-45d9-ba7f-d793918480d7", // Text-to-Speech Training
  "787da5ed-ad55-4030-ac57-dd73805f0101", // Speech-to-Speech Training
  "b5aa74b5-6a5b-458d-92ae-b0da34a19f5c", // Audio Understanding Collection
];

export default function RimePage() {
  const datasetSection = (
    <Suspense fallback={null}>
      <DatasetShowcase datasetIds={DATASET_IDS} />
    </Suspense>
  );

  return <RimePageClient datasetSection={datasetSection} />;
}
