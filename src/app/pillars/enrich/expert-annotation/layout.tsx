import { BUILD_DATE } from "@/lib/constants";
import { ogImageUrl } from "@/lib/og";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Domain Annotation for AI Training | Claru",
  description:
    "PhD-level domain specialist annotation for AI training. STEM, medical, legal, and technical experts for high-stakes labeling where accuracy matters.",
  keywords: [
    "expert annotation",
    "domain specialist labeling",
    "PhD annotators",
    "specialized AI training",
    "medical annotation",
    "legal annotation",
    "STEM annotation",
    "domain expertise",
  ],
  alternates: {
    canonical: "/pillars/enrich/expert-annotation",
  },
  openGraph: {
    title: "Expert Domain Annotation for AI Training | Claru",
    description:
      "PhD-level specialists for high-stakes AI annotation. Medical, legal, STEM, and technical domains.",
    url: "/pillars/enrich/expert-annotation",
    type: "website",
    images: [{ url: ogImageUrl("Expert Domain Annotation for AI Training", { category: "pillar" }), width: 1200, height: 630 }],
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Expert Domain Annotation Services",
      serviceType: "Data Annotation Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "PhD-level domain specialist annotation services for AI training. Verified experts in STEM, medicine, law, and technical fields provide accurate labels for high-stakes applications.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType:
          "AI Research Labs, Healthcare AI, Legal Tech, Enterprise AI",
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
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": "https://claru.ai/pillars/enrich/expert-annotation",
            name: "Expert Annotation",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What credentials do your expert annotators have?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our expert annotators hold verified credentials in their respective fields. STEM annotators have PhDs from research institutions. Medical annotators are board-certified physicians. Legal annotators are licensed attorneys. We verify all credentials and require demonstrated expertise before allowing annotators to work on projects.",
          },
        },
        {
          "@type": "Question",
          name: "How much does expert annotation cost compared to crowdsourced annotation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Expert annotation typically costs 3-10x more than crowdsourced annotation on a per-label basis. However, expert annotation often requires fewer labels to achieve the same model performance due to higher accuracy and consistency. For tasks requiring genuine domain knowledge, the total cost of ownership is often lower with experts because you avoid expensive re-annotation and debugging cycles.",
          },
        },
        {
          "@type": "Question",
          name: "What domains do your expert annotators cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We maintain expert networks across STEM (mathematics, physics, chemistry, biology), medicine (physicians, radiologists, clinical researchers), law (practicing attorneys, compliance specialists), software engineering (senior developers, security researchers), and finance (CFA charterholders, quantitative analysts). For niche domains, we recruit and train custom expert teams with verified credentials.",
          },
        },
      ],
    },
  ],
};

export default function ExpertAnnotationLayout({
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
