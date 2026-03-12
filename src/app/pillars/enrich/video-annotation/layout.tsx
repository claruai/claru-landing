import { BUILD_DATE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frame-Level Video Annotation Services | Claru",
  description:
    "Expert frame-level video annotation for AI training. Temporal segmentation, action recognition, object tracking, and scene understanding at scale.",
  keywords: [
    "video annotation",
    "frame-level labeling",
    "temporal annotation",
    "video AI training",
    "action recognition",
    "object tracking",
    "temporal segmentation",
    "video understanding",
  ],
  alternates: {
    canonical: "/pillars/enrich/video-annotation",
  },
  openGraph: {
    title: "Frame-Level Video Annotation Services | Claru",
    description:
      "Expert video annotation with temporal consistency. Frame-level labeling for AI training at scale.",
    url: "/pillars/enrich/video-annotation",
    type: "website",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Video Annotation Services",
      serviceType: "Data Annotation Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Frame-level video annotation services for AI training. Temporal segmentation, action recognition, object tracking, and scene boundary detection with expert annotators.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType:
          "AI Research Labs, Autonomous Vehicle Companies, Video AI Teams",
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
            "@id": "https://claru.ai/pillars/enrich/video-annotation",
            name: "Video Annotation",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why is video annotation more complex than image annotation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Video annotation adds temporal complexity. A 10-minute video at 30 fps contains 18,000 frames that must be labeled consistently. Annotators must track objects across frames, identify when actions begin and end, and maintain label consistency through occlusions and scene changes. Unlike images, video requires understanding of motion, physics, and temporal relationships.",
          },
        },
        {
          "@type": "Question",
          name: "What annotation density do you support for video data?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We support multiple density levels depending on your needs: keyframe annotation (every 1-5 seconds) with interpolation for efficiency, dense annotation (every frame at 30 fps) for precision-critical applications, and adaptive density that annotates more frequently during complex actions and less during static scenes.",
          },
        },
        {
          "@type": "Question",
          name: "How do you ensure temporal consistency across frames?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Temporal consistency comes from specialized tooling and trained annotators. We use interpolation-aware annotation platforms that propagate labels across frames, employ annotators trained on temporal consistency requirements, and run automated QA checks that flag frame-to-frame inconsistencies. Multi-annotator consensus resolves ambiguous boundaries.",
          },
        },
      ],
    },
  ],
};

export default function VideoAnnotationLayout({
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
