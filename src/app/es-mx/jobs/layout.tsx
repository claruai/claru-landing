import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl } from "@/lib/og";
import { jobsHreflangAlternates } from "@/lib/jobs-hreflang";
import { jobsI18n } from "@/lib/jobs-i18n";

const t = jobsI18n("es-MX");

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    type: "website",
    url: "https://claru.ai/es-mx/jobs",
    locale: "es_MX",
    images: [
      {
        url: ogImageUrl("Trabajo remoto en IA", { category: "job" }),
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "/es-mx/jobs",
    languages: jobsHreflangAlternates("/jobs"),
  },
};

export default function EsMxJobsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
