import { BUILD_DATE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Bias Detection & Fairness Evaluation | Claru",
  description:
    "Comprehensive AI bias detection and fairness auditing services. Demographic parity testing, representation analysis, and EU AI Act compliance for high-risk AI systems.",
  keywords: [
    "AI bias detection",
    "fairness evaluation",
    "ML bias testing",
    "representation analysis",
    "demographic parity",
    "EU AI Act compliance",
    "algorithmic fairness",
    "bias audits",
  ],
  alternates: {
    canonical: "/pillars/validate/bias-detection",
  },
  openGraph: {
    title: "AI Bias Detection & Fairness Evaluation | Claru",
    description:
      "Systematic bias audits for AI systems. Find demographic disparities, representation issues, and systematic errors before they cause harm.",
    url: "/pillars/validate/bias-detection",
    type: "website",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "AI Bias Detection Services",
      serviceType: "AI Fairness & Compliance Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Expert bias detection and fairness evaluation for AI systems. Demographic parity testing, intersectional analysis, and regulatory compliance documentation.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType: "AI Research Labs, Enterprise AI, Regulated Industries",
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
            "@id": "https://claru.ai/pillars/validate/bias-detection",
            name: "Bias Detection",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What types of bias can your audits detect?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We test for demographic bias (differential treatment across race, gender, age, disability), representation bias (stereotypes and underrepresentation in outputs), allocation bias (unfair resource distribution in recommendations and decisions), and systematic errors (consistent failure patterns across demographic segments).",
          },
        },
        {
          "@type": "Question",
          name: "How do you measure fairness in AI systems?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We use multiple quantitative metrics including demographic parity, equalized odds, calibration across groups, and individual fairness measures. We combine these with qualitative assessment of harm severity and context-dependent fairness analysis tailored to your specific use case.",
          },
        },
        {
          "@type": "Question",
          name: "Do your bias audits satisfy EU AI Act requirements?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Our audits produce documentation that satisfies EU AI Act Article 10 requirements for bias testing in high-risk systems. We provide quantitative metrics, methodology documentation, and remediation evidence formatted for regulatory review. Non-compliance penalties reach EUR 35 million or 7% of global turnover.",
          },
        },
      ],
    },
  ],
};

export default function BiasDetectionLayout({
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
