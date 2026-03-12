import { BUILD_DATE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Synthetic Data Generation for AI Training | Claru",
  description:
    "Generate unlimited, perfectly labeled training data using Unreal Engine, procedural generation, and domain randomization. Fill data gaps for autonomous vehicles, robotics, and computer vision.",
  keywords: [
    "synthetic data generation",
    "AI training data",
    "Unreal Engine data",
    "procedural data",
    "domain randomization",
    "sim-to-real",
    "computer vision training",
    "NVIDIA Omniverse",
  ],
  alternates: {
    canonical: "/pillars/acquire/synthetic-data",
  },
  openGraph: {
    title: "Synthetic Data Generation for AI | Claru",
    description:
      "Generate training data that does not exist in the real world. Unlimited variations, perfect labels, no privacy concerns.",
    url: "/pillars/acquire/synthetic-data",
    type: "website",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Synthetic Data Generation",
      serviceType: "AI Training Data Generation",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Professional synthetic data generation services using Unreal Engine, procedural generation, and domain randomization for training computer vision, robotics, and autonomous systems.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType:
          "AI Research Labs, Autonomous Vehicle Companies, Robotics Developers",
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
            "@id": "https://claru.ai/pillars/acquire/synthetic-data",
            name: "Synthetic Data",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the sim-to-real gap and how do you address it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The sim-to-real gap refers to the performance drop when AI models trained on synthetic data are deployed in the real world. We address this through domain randomization (varying textures, lighting, physics parameters), photorealistic rendering, and human validation layers that verify synthetic data quality against real-world benchmarks.",
          },
        },
        {
          "@type": "Question",
          name: "How does synthetic data compare to real data for AI training?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Synthetic data offers advantages in scale, label accuracy, and coverage of rare scenarios. Gartner predicts that by 2028, 80% of data used by AI will be synthetic. However, synthetic data works best when combined with real data, using techniques like domain adaptation to bridge the gap between simulated and real environments.",
          },
        },
        {
          "@type": "Question",
          name: "What rendering engines and tools do you use for synthetic data?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We use Unreal Engine 5 for photorealistic rendering, NVIDIA Omniverse for physics-accurate simulations, Unity for rapid prototyping, and custom procedural generation pipelines. The choice depends on your requirements for visual fidelity, physics accuracy, and generation speed.",
          },
        },
      ],
    },
  ],
};

export default function SyntheticDataLayout({
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
