import { BUILD_DATE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Training Data Licensing Services | Claru",
  description:
    "Navigate AI data rights with confidence. Properly licensed training data, copyright compliance, provenance documentation, and audit trails for enterprise AI development.",
  keywords: [
    "AI data licensing",
    "training data rights",
    "licensed datasets",
    "copyright compliant AI data",
    "data provenance",
    "AI copyright",
    "EU AI Act compliance",
    "enterprise AI data",
  ],
  alternates: {
    canonical: "/pillars/acquire/data-licensing",
  },
  openGraph: {
    title: "AI Training Data Licensing | Claru",
    description:
      "Build AI on solid legal ground. Licensed content, clear rights, full provenance for enterprise compliance.",
    url: "/pillars/acquire/data-licensing",
    type: "website",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "AI Training Data Licensing",
      serviceType: "Data Licensing and Rights Management",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Professional data licensing services for AI training. We negotiate content rights, ensure copyright compliance, and provide full provenance documentation for enterprise AI development.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType:
          "Enterprise AI Teams, Media Companies, Regulated Industries",
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
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": "https://claru.ai/pillars/acquire/data-licensing",
            name: "Data Licensing",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why is proper data licensing important for AI training?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "High-profile lawsuits like NYT v. OpenAI and Getty v. Stability AI have made data provenance a critical concern. Improperly licensed training data creates legal liability, reputational risk, and potential requirements to retrain models. The EU AI Act now requires transparency about training data sources, making proper licensing essential for compliance.",
          },
        },
        {
          "@type": "Question",
          name: "What types of content can you license for AI training?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We license text corpora (news, books, academic papers), image collections (stock photography, specialized domains), video content (stock footage, broadcast archives), and audio (music, speech, sound effects). We work directly with content owners and publishers to negotiate rights specifically for AI training use.",
          },
        },
        {
          "@type": "Question",
          name: "How do you document data provenance for compliance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every dataset we deliver includes comprehensive documentation: original source identification, license terms and restrictions, processing chain records, permitted use cases, geographic limitations, and attribution requirements. This documentation is designed to satisfy enterprise legal teams and regulatory requirements like the EU AI Act.",
          },
        },
      ],
    },
  ],
};

export default function DataLicensingLayout({
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
