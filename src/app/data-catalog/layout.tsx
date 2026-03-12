import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Catalog | Training Data for Frontier AI Labs | Claru",
  description:
    "Browse Claru's catalog of purpose-built AI training datasets — egocentric video, manipulation trajectories, game environments, cinematic footage, and more. Request access to evaluate samples for your pipeline.",
  alternates: {
    canonical: "/data-catalog",
  },
  openGraph: {
    title: "Data Catalog | Training Data for Frontier AI Labs | Claru",
    description:
      "Purpose-built AI training datasets for frontier video, robotics, and vision models. Egocentric video, manipulation trajectories, game capture, and licensed cinematic footage.",
  },
  twitter: {
    title: "Data Catalog | Training Data for Frontier AI Labs | Claru",
    description:
      "Browse Claru's catalog of purpose-built AI training datasets. Egocentric video, manipulation trajectories, game environments, and more.",
  },
};

export default function DataCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
