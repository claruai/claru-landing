import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl } from "@/lib/og";

export const metadata: Metadata = {
  title: "Case Studies | How We've Built Training Data for Frontier AI Labs | Claru",
  description:
    "386K egocentric video clips. 976K quality annotations. 1M+ identity verifications. See how we've delivered production-ready training data for Khosla, NVIDIA, and YC-backed AI labs.",
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
    title: "Case Studies | How We've Built Training Data for Frontier AI Labs | Claru",
    description:
      "386K egocentric video clips. 976K quality annotations. 1M+ identity verifications. Production-ready training data for frontier AI labs.",
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
