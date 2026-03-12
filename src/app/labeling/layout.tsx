import type { Metadata } from "next";
import { ogImageUrl } from "@/lib/og";

export const metadata: Metadata = {
  title: "Expert Labeling | Claru — Annotation for Frontier AI",
  description:
    "Domain-specialist annotation for frontier video, vision, and robotics models. RLHF, frame-level video annotation, red teaming, and benchmark curation — built to your model's exact specifications.",
  alternates: {
    canonical: "/labeling",
  },
  openGraph: {
    title: "Expert Labeling | Claru",
    description:
      "Domain-specialist annotation for frontier AI. RLHF, frame-level video annotation, red teaming — precise, validated, production-ready.",
    images: [{ url: ogImageUrl("Expert Labeling", { subtitle: "Annotation for Frontier AI" }), width: 1200, height: 630 }],
  },
  twitter: {
    title: "Expert Labeling | Claru",
    description:
      "Domain-specialist annotation for frontier video, vision, and robotics models. RLHF, video annotation, red teaming, and benchmark curation.",
  },
};

export default function LabelingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
