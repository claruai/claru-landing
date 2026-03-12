import { BUILD_DATE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Data Annotation for AI Labs | Claru",
  description:
    "Expert RLHF annotation, PhD-level specialists, frame-level video labeling, and red teaming services for frontier AI labs building aligned, high-performance models.",
  keywords: [
    "data annotation",
    "RLHF",
    "expert labeling",
    "AI training data",
    "human feedback",
    "preference data",
    "video annotation",
    "red teaming",
    "AI safety",
  ],
  alternates: {
    canonical: "/pillars/enrich",
  },
  openGraph: {
    title: "Expert Data Annotation for Frontier AI | Claru",
    description:
      "PhD-level annotators, RLHF preference data, frame-level video labeling, and adversarial red teaming for AI labs.",
    url: "/pillars/enrich",
    type: "website",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Expert Data Annotation Services",
      serviceType: "Data Annotation Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Expert data annotation services for frontier AI labs. RLHF preference data, PhD-level domain specialists, frame-level video annotation, and adversarial red teaming.",
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
            "@id": "https://claru.ai/pillars/enrich",
            name: "Enrich",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What makes expert annotators different from crowdsourced workers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Expert annotators bring domain credentials (PhDs, professional licenses) and deep subject knowledge. For RLHF, they understand nuance that generic workers miss. For specialized domains like medicine or law, they provide accurate annotations that crowdsourced workers simply cannot.",
          },
        },
        {
          "@type": "Question",
          name: "How do you ensure annotation quality at scale?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We use multi-annotator consensus, inter-annotator agreement metrics (targeting 85%+ IAA), gold standard validation sets, and continuous quality monitoring. Every batch is validated against known-good examples before delivery.",
          },
        },
        {
          "@type": "Question",
          name: "What domains do your expert annotators cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our specialist networks cover STEM (mathematics, physics, chemistry, biology), medicine (licensed physicians, radiologists), law (practicing attorneys), software engineering (senior developers), and creative fields. For niche domains, we recruit and train custom teams.",
          },
        },
        {
          "@type": "Question",
          name: "How does your RLHF process work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We generate response pairs from your model, have expert annotators rank them by quality, and deliver preference datasets for reward model training. Our process includes calibration rounds, disagreement resolution, and quality metrics like Krippendorff's Alpha above 0.80.",
          },
        },
        {
          "@type": "Question",
          name: "What quality metrics do you report?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We report inter-annotator agreement (targeting 85%+ for straightforward tasks), Krippendorff's Alpha (above 0.80 for complex judgments), gold set accuracy, and detailed disagreement analysis. All metrics come with full methodology documentation.",
          },
        },
      ],
    },
  ],
};

export default function EnrichLayout({
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
