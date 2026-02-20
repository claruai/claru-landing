import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Remote AI Annotation Jobs | Claru",
  description:
    "Browse remote data annotation jobs at Claru. Join frontier AI labs as a contractor — RLHF, red teaming, coding review, vision annotation, and more. AI training jobs with expert-tier pay ($20\u2013100/hr).",
  keywords: [
    "data annotation jobs remote",
    "AI training jobs",
    "remote annotation work",
    "RLHF jobs",
    "AI labeling jobs",
    "data labeling remote",
    "machine learning annotation",
    "AI safety jobs",
    "red teaming jobs",
    "coding review jobs",
  ],
  openGraph: {
    title: "Remote AI Annotation Jobs | Claru",
    description:
      "Browse remote data annotation jobs at Claru. Join frontier AI labs as a contractor with expert-tier pay.",
    type: "website",
    url: "https://claru.ai/jobs",
  },
  alternates: {
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
