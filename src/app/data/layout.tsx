import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Data | Claru — Sourced & Curated for Frontier AI",
  description:
    "Purpose-built training data for frontier video, vision, and robotics models. Egocentric video capture, manipulation trajectories, synthetic environments, and licensed datasets — from raw capture to production-ready.",
  openGraph: {
    title: "Training Data | Claru",
    description:
      "Purpose-built training data for frontier AI. Egocentric video, manipulation trajectories, synthetic environments — sourced, curated, and ready to train.",
  },
  twitter: {
    title: "Training Data | Claru",
    description:
      "Purpose-built training data for frontier video, vision, and robotics models. From raw capture to production-ready dataset.",
  },
};

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
