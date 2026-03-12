import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Catalog | Training Data for Frontier AI Labs | Claru",
  description:
    "Browse Claru's catalog of purpose-built AI training datasets — egocentric video, manipulation trajectories, game environments, cinematic footage, and more. Request access to evaluate samples for your pipeline.",
  alternates: {
    canonical: "/data-catalog",
  },
  openGraph: {
    title: "Data Catalog | Training Data for Frontier AI Labs | Claru",
    description:
      "Purpose-built AI training datasets for frontier video, robotics, and vision models. Egocentric video, manipulation trajectories, game capture, and licensed cinematic footage.",
  },
  twitter: {
    title: "Data Catalog | Training Data for Frontier AI Labs | Claru",
    description:
      "Browse Claru's catalog of purpose-built AI training datasets. Egocentric video, manipulation trajectories, game environments, and more.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What datasets does Claru offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru's data catalog spans egocentric video, manipulation trajectories, game environments, cinematic footage, workplace activities, and more. Datasets cover 20+ activity domains captured across 14+ countries. We offer both off-the-shelf licensed datasets curated to your model's specifications and fully bespoke collection built from scratch to meet your exact training requirements.",
      },
    },
    {
      "@type": "Question",
      name: "How can I request a custom dataset?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Book a call with our team and describe what you're training. Claru designs the capture protocol, builds the collection pipeline, deploys our global annotator network, and delivers training-ready data on your timeline. We handle everything from participant recruitment and device logistics to annotation, quality assurance, and delivery in your preferred format.",
      },
    },
    {
      "@type": "Question",
      name: "How does Claru ensure dataset quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every dataset goes through multi-stage quality assurance — from structured capture protocols and real-time validation during collection to expert review and automated consistency checks. Our annotators are embedded directly with AI research teams, giving them full context on labeling requirements. This results in higher inter-annotator agreement and fewer downstream errors than marketplace-sourced data.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Claru's data different from public datasets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru datasets are purpose-built for frontier AI labs — not scraped or recycled from the open web. Our data features geographic diversity across 14+ countries and 6 continents, demographic representation across age, gender, and ethnicity, and environmental variety spanning indoor, outdoor, urban, and rural settings. Every dataset is fully licensed and rights-cleared for commercial model training.",
      },
    },
    {
      "@type": "Question",
      name: "Can I preview dataset samples before licensing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can browse sample coverage from the catalog and request access to evaluate representative samples for your pipeline. This lets you verify data quality, format compatibility, and relevance to your training objectives before committing. Contact our team to schedule a walkthrough or request sample access for any dataset in the catalog.",
      },
    },
  ],
};

export default function DataCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
