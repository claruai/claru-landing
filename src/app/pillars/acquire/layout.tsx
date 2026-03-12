import { BUILD_DATE } from "@/lib/constants";
import { ogImageUrl } from "@/lib/og";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Acquisition Services for AI Labs | Claru",
  description:
    "Expert AI training data acquisition. Human data collection, web-scale harvesting, synthetic generation, and data licensing for frontier AI labs building video generation, robotics, and multimodal models.",
  keywords: [
    "AI training data",
    "data acquisition",
    "ML datasets",
    "egocentric video data",
    "robotics training data",
    "data licensing",
    "synthetic data",
    "human data collection",
  ],
  alternates: {
    canonical: "/pillars/acquire",
  },
  openGraph: {
    title: "Data Acquisition Services for Frontier AI | Claru",
    description:
      "Source diverse, high-quality training data at any scale. From egocentric video capture to licensed web-scale datasets.",
    url: "/pillars/acquire",
    type: "website",
    images: [{ url: ogImageUrl("Data Acquisition Services for Frontier AI", { category: "pillar" }), width: 1200, height: 630 }],
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "AI Training Data Acquisition",
      serviceType: "Data Acquisition Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Expert data acquisition services for frontier AI labs. Human data collection, web-scale harvesting, synthetic generation, and data licensing.",
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
            "@id": "https://claru.ai/pillars/acquire",
            name: "Acquire",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What types of data can Claru acquire?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We specialize in human-collected data (egocentric video, physical world interactions), web-scale datasets with proper licensing, and synthetic data generated through game engines and AI models. All data comes with full provenance documentation.",
          },
        },
        {
          "@type": "Question",
          name: "How do you ensure data quality during acquisition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Quality starts at the source. Our expert collectors follow rigorous protocols, and all data passes through multi-stage validation. We maintain detailed metadata and provenance records, enabling full traceability from raw capture to final dataset.",
          },
        },
        {
          "@type": "Question",
          name: "Can you acquire data for specialized domains?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We have domain specialist networks covering medical, legal, STEM, robotics, and creative fields. For niche domains, we build custom collection pipelines with subject matter experts who understand the specific requirements of your AI application.",
          },
        },
        {
          "@type": "Question",
          name: "How do you handle data licensing and compliance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every dataset we deliver includes comprehensive licensing documentation. We navigate GDPR, CCPA, and copyright requirements, negotiate content rights with publishers, and provide audit trails that satisfy enterprise legal and compliance teams.",
          },
        },
      ],
    },
  ],
};

export default function AcquireLayout({
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
