import { BUILD_DATE } from "@/lib/constants";
import { ogImageUrl } from "@/lib/og";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multimodal Data Alignment for AI Training | Claru",
  description:
    "Frame-level video-text alignment, cross-modal synchronization, and temporal caption matching. Prepare multimodal datasets for video-language and vision-language models.",
  keywords: [
    "multimodal alignment",
    "video-text pairing",
    "cross-modal data",
    "temporal synchronization",
    "video-language models",
    "CLIP alignment",
    "caption-frame matching",
    "multimodal AI training",
  ],
  alternates: {
    canonical: "/pillars/prepare/multimodal-alignment",
  },
  openGraph: {
    title: "Multimodal Data Alignment | Claru",
    description:
      "Synchronize video, text, and audio data for AI training. Frame-level precision for video-language models.",
    url: "/pillars/prepare/multimodal-alignment",
    type: "website",
    images: [{ url: ogImageUrl("Multimodal Data Alignment", { category: "pillar" }), width: 1200, height: 630 }],
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Multimodal Data Alignment Services",
      serviceType: "Data Alignment",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Frame-level video-text alignment, cross-modal synchronization, and temporal caption matching for video-language and vision-language AI models.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType: "AI Research Labs, Video AI Companies",
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
            "@id": "https://claru.ai/pillars/prepare/multimodal-alignment",
            name: "Multimodal Alignment",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How precise is your video-text alignment?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We achieve sub-50ms temporal precision for video-text alignment. Each caption is synchronized to specific frame ranges with verified start and end timestamps. For dense captioning scenarios, we provide frame-level annotations where each individual frame can have associated text descriptions.",
          },
        },
        {
          "@type": "Question",
          name: "How do you handle temporal drift in long videos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Long videos accumulate synchronization errors from variable frame rates, audio drift, and caption timing inconsistencies. We use anchor point synchronization at scene boundaries, verify alignment using cross-modal embedding similarity, and apply human verification for ambiguous segments. Our pipeline detects and corrects drift rather than letting errors compound.",
          },
        },
        {
          "@type": "Question",
          name: "What quality metrics do you use for alignment verification?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We measure alignment quality using cross-modal similarity scores (CLIP-based), temporal overlap IoU between caption spans and visual content, and human verification sampling. Each aligned pair includes a confidence score indicating alignment reliability, enabling you to filter by quality threshold for your specific use case.",
          },
        },
      ],
    },
  ],
};

export default function MultimodalAlignmentLayout({
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
