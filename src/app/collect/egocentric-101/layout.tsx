import type { Metadata } from "next";
import { ogImageUrl } from "@/lib/og";

const TITLE =
  "Egocentric Capture 101 — How to Film First-Person Video for AI | Claru";
const DESCRIPTION =
  "A plain-English guide to egocentric capture: what first-person video is, why AI labs pay for it, and exactly how to film it — 0.5x wide, both hands in frame, landscape 1080p. See real examples, then start the household capture project. A Reka AI company, backed by NVIDIA.";
const PATH = "/collect/egocentric-101";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: `https://claru.ai${PATH}`,
    images: [
      {
        url: ogImageUrl("Egocentric Capture 101", {
          category: "jobs",
        }),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function EgocentricyOneOhOneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
