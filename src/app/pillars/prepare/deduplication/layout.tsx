import { BUILD_DATE } from "@/lib/constants";
import { ogImageUrl } from "@/lib/og";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Training Data Deduplication Services | Claru",
  description:
    "Trillion-token scale deduplication using MinHashLSH and semantic similarity. Remove duplicates that cause memorization, waste compute, and contaminate benchmarks.",
  keywords: [
    "data deduplication",
    "LLM training data",
    "MinHashLSH",
    "duplicate detection",
    "near-duplicate removal",
    "fuzzy deduplication",
    "semantic deduplication",
    "trillion-token scale",
  ],
  alternates: {
    canonical: "/pillars/prepare/deduplication",
  },
  openGraph: {
    title: "AI Training Data Deduplication | Claru",
    description:
      "Remove duplicates at trillion-token scale. MinHashLSH, semantic similarity, and multi-level matching for cleaner training data.",
    url: "/pillars/prepare/deduplication",
    type: "website",
    images: [{ url: ogImageUrl("AI Training Data Deduplication", { category: "pillar" }), width: 1200, height: 630 }],
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "AI Training Data Deduplication Services",
      serviceType: "Data Deduplication",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Trillion-token scale deduplication services using MinHashLSH, semantic similarity, and multi-level matching. Remove duplicates that cause memorization and benchmark contamination.",
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
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": "https://claru.ai/pillars/prepare/deduplication",
            name: "Deduplication",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do you handle near-duplicates vs exact duplicates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We use a multi-method approach. Exact duplicates are caught via hash-based matching. Near-duplicates require MinHashLSH for fuzzy matching at scale, which detects documents with high Jaccard similarity. For semantic duplicates with different wording but identical meaning, we use embedding-based similarity detection. Each method catches different duplicate types that single approaches miss.",
          },
        },
        {
          "@type": "Question",
          name: "What deduplication thresholds should I use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Optimal thresholds depend on your data characteristics and model goals. For MinHashLSH, typical similarity thresholds range from 0.7-0.9 Jaccard index. More aggressive thresholds (0.7) remove more content but risk removing legitimate similar documents. Conservative thresholds (0.9) preserve more content but leave near-duplicates. We recommend A/B testing different thresholds and measuring downstream model performance.",
          },
        },
        {
          "@type": "Question",
          name: "How fast can you process trillion-token datasets?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Processing speed depends on deduplication method and data complexity. Our distributed MinHashLSH pipeline processes terabytes per day using memory-efficient algorithms like LSHBloom. For trillion-token datasets comparable to RefinedWeb or RedPajama, expect weeks for comprehensive multi-level deduplication. We provide incremental deduplication for ongoing data ingestion without reprocessing existing data.",
          },
        },
      ],
    },
  ],
};

export default function DeduplicationLayout({
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
