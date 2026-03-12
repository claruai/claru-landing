import { BUILD_DATE } from "@/lib/constants";
import { ogImageUrl } from "@/lib/og";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Benchmark & Golden Dataset Curation | Claru",
  description:
    "Expert benchmark curation services for AI evaluation. Contamination-free golden datasets, held-out test sets, and rigorous evaluation infrastructure for trustworthy model assessment.",
  keywords: [
    "AI benchmark curation",
    "golden datasets",
    "evaluation sets",
    "benchmark contamination",
    "held-out test sets",
    "model evaluation",
    "HELM benchmarks",
    "AI assessment",
  ],
  alternates: {
    canonical: "/pillars/validate/benchmark-curation",
  },
  openGraph: {
    title: "AI Benchmark & Golden Dataset Curation | Claru",
    description:
      "Contamination-free benchmarks and golden evaluation sets for trustworthy AI assessment. Expert-curated test data that measures real capability.",
    url: "/pillars/validate/benchmark-curation",
    type: "website",
    images: [{ url: ogImageUrl("AI Benchmark & Golden Dataset Curation", { category: "pillar" }), width: 1200, height: 630 }],
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "AI Benchmark Curation Services",
      serviceType: "AI Evaluation & Assessment Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Expert benchmark curation and golden dataset creation for AI evaluation. Contamination-free test sets with verified non-leakage and difficulty stratification.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType:
          "AI Research Labs, ML Engineering Teams, Model Evaluation",
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
            "@id": "https://claru.ai/pillars/validate",
            name: "Validate",
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": "https://claru.ai/pillars/validate/benchmark-curation",
            name: "Benchmark Curation",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is benchmark contamination and why does it matter?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Benchmark contamination occurs when test data leaks into training sets, causing models to memorize answers rather than demonstrate genuine capability. Research shows some benchmarks have 100% leakage ratios, with models scoring 4.9x higher on leaked samples. Contaminated benchmarks give false confidence in model performance.",
          },
        },
        {
          "@type": "Question",
          name: "How do you ensure benchmarks remain uncontaminated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We create novel content that has never appeared in public training corpora, verify non-contamination through n-gram analysis and perplexity testing, use canary insertion techniques, and maintain strict embargo protocols with access controls and rotation schedules to prevent future leakage.",
          },
        },
        {
          "@type": "Question",
          name: "Can you create custom benchmarks for specific domains?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We design domain-specific evaluation sets with expert-generated content tailored to your use case. This includes difficulty stratification across easy/medium/hard tiers, coverage across relevant capability dimensions, and ground truth validation by domain specialists.",
          },
        },
      ],
    },
  ],
};

export default function BenchmarkCurationLayout({
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
