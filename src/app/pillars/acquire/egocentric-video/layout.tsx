import { BUILD_DATE } from "@/lib/constants";
import { ogImageUrl } from "@/lib/og";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Egocentric Video Data Collection for AI | Claru",
  description:
    "Professional first-person video capture services for embodied AI training. Wearable camera data collection with expert collectors for robotics, AR/VR, and autonomous systems.",
  keywords: [
    "egocentric video",
    "first-person video data",
    "embodied AI training",
    "POV data collection",
    "wearable camera data",
    "robotics training data",
    "Ego4D",
    "EPIC-KITCHENS",
  ],
  alternates: {
    canonical: "/pillars/acquire/egocentric-video",
  },
  openGraph: {
    title: "Egocentric Video Data Collection | Claru",
    description:
      "Capture first-person video at scale for embodied AI. Expert collectors, wearable cameras, real-world environments.",
    url: "/pillars/acquire/egocentric-video",
    type: "website",
    images: [{ url: ogImageUrl("Egocentric Video Data Collection", { category: "pillar" }), width: 1200, height: 630 }],
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Egocentric Video Data Collection",
      serviceType: "AI Training Data Collection",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Professional first-person video capture services using wearable cameras and expert collectors for training embodied AI, robotics, and AR/VR systems.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType: "AI Research Labs, Robotics Companies, AR/VR Developers",
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
            "@id": "https://claru.ai/pillars/acquire/egocentric-video",
            name: "Egocentric Video",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is egocentric video data and why is it important for AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Egocentric video is first-person footage captured from wearable cameras that shows the world from the perspective of the person wearing the device. This data is critical for training embodied AI systems, robots, and AR/VR applications because it captures natural human attention patterns, hand-object interactions, and real-world navigation in ways that third-person video cannot.",
          },
        },
        {
          "@type": "Question",
          name: "How do you ensure privacy and consent in egocentric video collection?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All our egocentric data collection follows strict privacy protocols. We obtain informed consent from all participants and bystanders, implement face detection and blurring for non-consenting individuals, collect only in approved environments, and maintain full chain-of-custody documentation. Our processes comply with GDPR, CCPA, and other privacy regulations.",
          },
        },
        {
          "@type": "Question",
          name: "What scale of egocentric video data can you collect?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We can scale from pilot projects of hundreds of hours to large-scale collections of thousands of hours across multiple geographies. For reference, the Ego4D dataset contains 3,670 hours from 931 collectors across 9 countries. We deploy trained collector networks with consistent hardware and protocols to achieve similar or greater scale based on your project requirements.",
          },
        },
      ],
    },
  ],
};

export default function EgocentricVideoLayout({
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
