import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl } from "@/lib/og";

export const metadata: Metadata = {
  title: "Case Studies | AI Training Data Projects at Scale | Claru",
  description:
    "AI training data case studies from Claru. Real projects with frontier AI labs — egocentric video collection, model evaluation, safety annotation, and more. See the methodology and results.",
  keywords: [
    "AI training data case studies",
    "data annotation case studies",
    "egocentric video collection",
    "AI safety annotation",
    "model evaluation",
    "robotics data collection",
    "RLHF case study",
    "data labeling at scale",
  ],
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies | AI Training Data Projects at Scale | Claru",
    description:
      "Real projects with frontier AI labs — egocentric video, model evaluation, safety annotation, and more.",
    type: "website",
    url: "https://claru.ai/case-studies",
    images: [{ url: ogImageUrl("Case Studies", { subtitle: "AI Training Data Projects at Scale", category: "case-study" }), width: 1200, height: 630 }],
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
