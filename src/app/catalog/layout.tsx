import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Catalog | Claru",
  description:
    "Browse 25+ curated video datasets with depth, pose, and segmentation enrichment. Commercially licensed training data for robotics and embodied AI.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
