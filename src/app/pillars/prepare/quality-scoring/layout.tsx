import { BUILD_DATE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ML Data Quality Scoring & Filtering | Claru",
  description:
    "Multi-signal quality scoring using perplexity, classifiers, and semantic analysis. Filter training data to balance quality and diversity for optimal model performance.",
  keywords: [
    "data quality scoring",
    "ML data filtering",
    "training data quality",
    "perplexity filtering",
    "quality classifiers",
    "data curation",
    "LLM data quality",
    "semantic scoring",
  ],
  alternates: {
    canonical: "/pillars/prepare/quality-scoring",
  },
  openGraph: {
    title: "ML Data Quality Scoring & Filtering | Claru",
    description:
      "Separate signal from noise in your training data. Multi-signal scoring with configurable thresholds that preserve diversity.",
    url: "/pillars/prepare/quality-scoring",
    type: "website",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "ML Data Quality Scoring Services",
      serviceType: "Data Quality Scoring",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Multi-signal quality scoring using perplexity, classifiers, and semantic analysis for ML training data. Configurable thresholds that balance quality and diversity.",
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
            "@id": "https://claru.ai/pillars/prepare/quality-scoring",
            name: "Quality Scoring",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do you choose quality filtering thresholds?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Optimal thresholds depend on your data distribution, domain, and model architecture. We analyze your data to understand quality distributions, then recommend thresholds based on empirical testing. For critical applications, we deliver multiple filtered versions with different thresholds so you can measure downstream model performance before committing to a configuration.",
          },
        },
        {
          "@type": "Question",
          name: "How do you balance quality filtering with diversity preservation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Aggressive filtering can eliminate entire domains or writing styles, reducing dataset diversity. We monitor distribution shifts during filtering using clustering analysis, track coverage across content categories, and flag when filtering disproportionately affects specific topics or styles. This enables informed tradeoffs between quality and diversity.",
          },
        },
        {
          "@type": "Question",
          name: "Can quality scoring adapt to domain-specific data?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Generic quality classifiers often misclassify domain-specific content. Code quality differs from prose quality differs from dialogue quality. We train or fine-tune classifiers on domain-representative samples, calibrate perplexity thresholds using domain-appropriate reference models, and develop custom heuristics for specialized content types.",
          },
        },
      ],
    },
  ],
};

export default function QualityScoringLayout({
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
