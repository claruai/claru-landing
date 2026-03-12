import { BUILD_DATE } from "@/lib/constants";
import { ogImageUrl } from "@/lib/og";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Red Teaming & Data Validation | Claru",
  description:
    "Expert AI red teaming, benchmark curation, and bias detection services. Safety evaluation, adversarial testing, and quality validation for frontier AI labs.",
  keywords: [
    "AI red teaming",
    "data validation",
    "benchmark curation",
    "bias detection",
    "AI safety evaluation",
    "adversarial testing",
    "model validation",
    "EU AI Act compliance",
  ],
  alternates: {
    canonical: "/pillars/validate",
  },
  openGraph: {
    title: "AI Red Teaming & Data Validation | Claru",
    description:
      "Expert red teaming and validation services for frontier AI. Adversarial testing, benchmark curation, and bias detection.",
    url: "/pillars/validate",
    type: "website",
    images: [{ url: ogImageUrl("AI Red Teaming & Data Validation", { category: "pillar" }), width: 1200, height: 630 }],
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "AI Data Validation Services",
      serviceType: "AI Safety & Validation Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Expert red teaming, benchmark curation, bias detection, and post-training evaluation services for frontier AI labs.",
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
            "@id": "https://claru.ai/pillars/validate",
            name: "Validate",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What red teaming methodologies does Claru use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We employ multi-layered adversarial testing including automated jailbreak attempts, prompt injection testing, and expert human red teaming. Our approach covers 40+ vulnerability categories aligned with OWASP LLM Top 10 and NIST AI RMF frameworks.",
          },
        },
        {
          "@type": "Question",
          name: "How do you prevent benchmark contamination?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We create held-out golden test sets using novel data that has never appeared in public training corpora. We verify non-contamination through n-gram analysis, perplexity testing, and canary insertion techniques to ensure evaluation integrity.",
          },
        },
        {
          "@type": "Question",
          name: "What types of bias can you detect?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We test for demographic bias across protected attributes, representation bias in outputs, allocation bias in decision-making systems, and systematic error patterns. Our audits cover race, gender, age, disability, and intersectional biases.",
          },
        },
        {
          "@type": "Question",
          name: "How do you create golden evaluation sets?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Golden sets are curated from novel expert-generated content that has never been publicly released. We use domain specialists to create challenging evaluation cases, ensure diversity across difficulty levels, and maintain strict embargo protocols to prevent leakage.",
          },
        },
        {
          "@type": "Question",
          name: "Do you help with EU AI Act compliance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We provide documented red teaming and validation that satisfies EU AI Act requirements for high-risk AI systems, including bias testing, safety evaluation, and the technical documentation needed for regulatory compliance.",
          },
        },
      ],
    },
  ],
};

export default function ValidateLayout({
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
