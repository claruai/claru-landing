import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl } from "@/lib/og";
import { jobsHreflangAlternates } from "@/lib/jobs-hreflang";
import { jobsI18n } from "@/lib/jobs-i18n";

const t = jobsI18n("pt-BR");

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    type: "website",
    url: "https://claru.ai/pt-br/jobs",
    locale: "pt_BR",
    images: [
      {
        url: ogImageUrl("Trabalho remoto em IA", { category: "job" }),
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "/pt-br/jobs",
    languages: jobsHreflangAlternates("/jobs"),
  },
};

export default function PtBrJobsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
