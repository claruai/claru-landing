import type { Metadata } from "next";
import { ogImageUrl } from "@/lib/og";

export const metadata: Metadata = {
  title: "Physical AI Data Catalog | Egocentric & Game Capture | Claru",
  description:
    "Off-the-shelf and on-request egocentric video and game capture datasets for physical AI, robotics, and world models. Filter by vertical, subcategory, and geographic coverage.",
  alternates: {
    canonical: "/catalog-physicalai",
  },
  openGraph: {
    title: "Physical AI Data Catalog | Egocentric & Game Capture | Claru",
    description:
      "Off-the-shelf and on-request egocentric video and game capture datasets for physical AI training.",
    images: [{ url: ogImageUrl("Physical AI Catalog", { category: "data-catalog" }), width: 1200, height: 630 }],
  },
  twitter: {
    title: "Physical AI Data Catalog | Egocentric & Game Capture | Claru",
    description:
      "Off-the-shelf and on-request egocentric video and game capture datasets for physical AI training.",
  },
};

export default function CatalogPhysicalAILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
