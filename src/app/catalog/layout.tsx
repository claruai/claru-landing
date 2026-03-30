import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Catalog | Claru",
  description:
    "Browse 25+ curated video datasets with depth, pose, and segmentation enrichment. Commercially licensed training data for robotics and embodied AI.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://claru.ai/catalog",
    siteName: "Claru",
    title: "Data Catalog | Claru",
    description:
      "Browse 25+ curated video datasets with depth, pose, and segmentation enrichment for robotics and embodied AI.",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru Data Catalog — Training Data for Physical AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Catalog | Claru",
    description:
      "Browse 25+ curated video datasets with depth, pose, and segmentation enrichment for robotics and embodied AI.",
    images: ["/images/og-v2.webp"],
  },
  alternates: {
    canonical: "/catalog",
  },
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
