import { BUILD_DATE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RLHF Data Services for LLM Alignment | Claru",
  description:
    "Expert RLHF preference data collection for reward model training. Human feedback at scale from domain specialists for LLM fine-tuning and alignment.",
  keywords: [
    "RLHF services",
    "preference data",
    "human feedback AI",
    "reward model training",
    "LLM alignment",
    "reinforcement learning",
    "preference ranking",
    "AI fine-tuning",
  ],
  alternates: {
    canonical: "/pillars/enrich/rlhf",
  },
  openGraph: {
    title: "RLHF Data Services for LLM Alignment | Claru",
    description:
      "Expert preference data collection for reward model training. Human feedback at scale from domain specialists.",
    url: "/pillars/enrich/rlhf",
    type: "website",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "RLHF Data Services",
      serviceType: "AI Training Data Services",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Expert RLHF preference data collection for reward model training. Pairwise comparisons, ranked lists, and multi-turn evaluation from domain specialists.",
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
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": "https://claru.ai/pillars/enrich/rlhf",
            name: "RLHF",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is RLHF and why does it matter for LLM alignment?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Reinforcement Learning from Human Feedback (RLHF) is the process of training AI models using human preferences rather than just supervised learning. Human annotators compare model outputs and rank them by quality, which trains a reward model that guides the AI toward more helpful, harmless, and honest responses. The quality of RLHF data directly determines how well an LLM follows instructions and avoids harmful outputs.",
          },
        },
        {
          "@type": "Question",
          name: "How do expert annotators improve RLHF quality compared to crowdsourced workers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Expert annotators bring domain knowledge that crowdsourced workers lack. They can evaluate technical accuracy, identify subtle errors, and make nuanced quality judgments. Studies show that RLHF from domain experts produces reward models with better calibration and fewer systematic biases. For specialized domains like code, medicine, or law, expert annotators are essential for accurate preference rankings.",
          },
        },
        {
          "@type": "Question",
          name: "What formats of preference data do you collect for RLHF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We support multiple RLHF data formats: pairwise comparisons (A vs B rankings), ranked lists (ordering multiple responses), Likert scale ratings, multi-dimensional scoring, and free-text explanations for disagreements. Our annotation platform captures confidence scores alongside rankings and supports multi-turn conversation evaluation for chat models.",
          },
        },
      ],
    },
  ],
};

export default function RLHFLayout({
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
