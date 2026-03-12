import { BUILD_DATE } from "@/lib/constants";
import { ogImageUrl } from "@/lib/og";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Preparation Services for AI Labs | Claru",
  description:
    "Expert ML data preparation at scale. Deduplication, quality filtering, format normalization, and multimodal alignment for trillion-token datasets and frontier AI training.",
  keywords: [
    "data preparation",
    "ML datasets",
    "deduplication",
    "multimodal alignment",
    "data quality filtering",
    "LLM training data",
    "data normalization",
    "data preprocessing",
  ],
  alternates: {
    canonical: "/pillars/prepare",
  },
  openGraph: {
    title: "Data Preparation Services for Frontier AI | Claru",
    description:
      "Transform raw data into training-ready datasets. Deduplication, quality filtering, and multimodal alignment at trillion-token scale.",
    url: "/pillars/prepare",
    type: "website",
    images: [{ url: ogImageUrl("Data Preparation Services for Frontier AI", { category: "pillar" }), width: 1200, height: 630 }],
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "AI Data Preparation Services",
      serviceType: "Data Preparation Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Expert data preparation services for frontier AI labs. Deduplication, quality filtering, format normalization, and multimodal alignment at scale.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType: "AI Research Labs, ML Engineering Teams",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": "https://claru.ai",
            name: "Home",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": "https://claru.ai/pillars/prepare",
            name: "Prepare",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What deduplication methods do you use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We use multi-level deduplication including MinHashLSH for fuzzy matching at scale, embedding-based semantic deduplication for near-duplicates, and exact substring matching. Our pipeline operates at document, paragraph, and line levels to catch duplicates that single-level approaches miss.",
          },
        },
        {
          "@type": "Question",
          name: "How do you handle quality vs. quantity tradeoffs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Quality filtering is not one-size-fits-all. We configure domain-specific thresholds based on your model architecture and use case. Our approach preserves diversity while removing low-quality content, using perplexity scoring, fluency metrics, and custom classifiers tuned to your requirements.",
          },
        },
        {
          "@type": "Question",
          name: "Can you process multimodal data?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We specialize in cross-modal alignment for video-text, audio-text, and image-text datasets. Our pipelines handle temporal synchronization, caption-frame matching, and cross-modal embedding alignment with sub-50ms precision for video applications.",
          },
        },
        {
          "@type": "Question",
          name: "What scale can you handle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We process trillion-token datasets using distributed infrastructure. Our deduplication pipeline handles petabyte-scale data with throughput measured in terabytes per day. We've processed datasets comparable to RefinedWeb (5T tokens) and RedPajama (30T tokens).",
          },
        },
        {
          "@type": "Question",
          name: "How do you ensure data lineage and versioning?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every transformation is tracked with full provenance documentation. We maintain audit trails from raw input to final output, enabling reproducibility and compliance. Version control ensures you can trace any sample back to its source and understand every processing step applied.",
          },
        },
      ],
    },
  ],
};

export default function PrepareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
