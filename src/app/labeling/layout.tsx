import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Labeling | Claru — Annotation for Frontier AI",
  description:
    "Domain-specialist annotation for frontier video, vision, and robotics models. RLHF, frame-level video annotation, red teaming, and benchmark curation — built to your model's exact specifications.",
  openGraph: {
    title: "Expert Labeling | Claru",
    description:
      "Domain-specialist annotation for frontier AI. RLHF, frame-level video annotation, red teaming — precise, validated, production-ready.",
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
