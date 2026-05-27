import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl } from "@/lib/og";
import { jobsHreflangAlternates } from "@/lib/jobs-hreflang";

export const metadata: Metadata = {
  title: "Remote AI Training Jobs — Pay in USD | Claru",
  description:
    "Remote contractor roles in egocentric video capture and gameplay capture for frontier AI labs. Flat geo-tiered pay in USD ($15/hr US, $10/hr Canada, $7/hr LATAM, $5/hr Asia), bi-weekly, fully remote.",
  keywords: [
    "ai training jobs",
    "remote ai jobs",
    "data labeling jobs",
    "ai data collection jobs",
    "data annotation work from home",
    "first person video data",
    "egocentric video capture",
    "gameplay capture jobs",
    "get paid to play games",
    "make money playing games",
    "outlier ai alternative",
    "scale ai jobs",
    "remotasks alternative",
  ],
  openGraph: {
    title: "Remote AI Training Jobs — Pay in USD | Claru",
    description:
      "Egocentric video capture and gameplay capture roles. Flat USD pay, bi-weekly, fully remote.",
    type: "website",
    url: "https://claru.ai/jobs",
    images: [
      {
        url: ogImageUrl("Remote AI Training Jobs", { category: "job" }),
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "/jobs",
    languages: jobsHreflangAlternates("/jobs"),
    types: {
      "application/rss+xml": [
        { url: "/jobs/feed.xml", title: "Claru AI Jobs" },
      ],
    },
  },
};

export default function JobsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
