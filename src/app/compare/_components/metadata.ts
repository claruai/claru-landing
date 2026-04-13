import type { Metadata } from "next";
import type { ComparisonData } from "@/data/compare/types";

export function buildComparisonMetadata(data: ComparisonData): Metadata {
  const url = `https://claru.ai/compare/${data.slug}`;

  return {
    title: data.meta.title,
    description: data.meta.description,
    keywords: data.meta.keywords,
    openGraph: {
      title: data.meta.title,
      description: data.meta.description,
      type: "article",
      url,
      siteName: "Claru",
      images: [
        {
          url: data.meta.ogImage,
          width: 1200,
          height: 630,
          alt: data.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta.title,
      description: data.meta.description,
      images: [data.meta.ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}
