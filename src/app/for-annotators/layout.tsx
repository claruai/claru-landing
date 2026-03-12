import type { Metadata } from "next";
import { ogImageUrl } from "@/lib/og";

export const metadata: Metadata = {
  title: "For Annotators | AI Annotation Jobs & Expert Data Labeling",
  description:
    "Join Claru's team of domain experts embedded with frontier AI labs. Remote AI annotation jobs, expert data labeling, RLHF, and more — apply today.",
  alternates: {
    canonical: "/for-annotators",
  },
  openGraph: {
    title: "For Annotators | Claru AI Annotation Jobs",
    description:
      "Join Claru's team of domain experts embedded with frontier AI labs. Remote AI annotation jobs, expert data labeling, and more.",
    images: [{ url: ogImageUrl("For Annotators", { subtitle: "AI Annotation Jobs & Expert Data Labeling" }), width: 1200, height: 630 }],
  },
  twitter: {
    title: "For Annotators | Claru AI Annotation Jobs",
    description:
      "Join Claru's team of domain experts embedded with frontier AI labs. Remote AI annotation jobs, expert data labeling, and more.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is data annotation work legitimate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Data annotation is essential work that powers every major AI system in production today. The global data annotation market is valued at over $2.26 billion and growing rapidly as AI labs scale their training pipelines. Companies like Google, Meta, and OpenAI all rely on human annotators to label training data, evaluate model outputs, and guide alignment. At Claru, you work directly with frontier AI research teams on real projects — not clickwork or microtasks.",
      },
    },
    {
      "@type": "Question",
      name: "How much do AI annotators make at Claru?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru pays $20–100 per hour depending on expertise and project complexity. Our tier system reflects your skills: Entry-level roles start at $20–35/hr for general annotation tasks, Standard roles pay $35–55/hr for experienced annotators handling complex modalities, and Expert roles pay $55–100/hr for specialists with deep domain knowledge in areas like RLHF, robotics, coding, or scientific reasoning. Rates increase as you gain experience and take on more specialized work.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need experience to apply?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not necessarily for entry-level roles. Some annotation tasks — like image classification or basic text labeling — require strong attention to detail but no prior annotation experience. However, expert-level roles in areas like RLHF, red teaming, or coding review require demonstrated domain depth. If you have subject-matter expertise in STEM, linguistics, law, medicine, or a similar field, that background is often more valuable than annotation-specific experience. We provide training and onboarding for every project.",
      },
    },
    {
      "@type": "Question",
      name: "What is RLHF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RLHF stands for Reinforcement Learning from Human Feedback. It's the process by which AI models learn to produce better, safer, and more helpful outputs based on human preferences. In practice, annotators compare pairs of model responses and rank which is better, provide corrections, or flag problematic content. This human judgment signal is then used to fine-tune the model. RLHF is one of the key techniques behind the quality of models like ChatGPT and Claude, and it's a core part of the work Claru does with AI labs.",
      },
    },
    {
      "@type": "Question",
      name: "How does Claru pay annotators?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Weekly via direct deposit. You receive reliable, consistent payments every week — no waiting for batch processing cycles or hitting minimum payout thresholds. We believe the people doing critical AI training work deserve predictable, timely compensation. Payment details and tax documentation are handled through our platform.",
      },
    },
    {
      "@type": "Question",
      name: "Can I work remotely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all Claru annotation roles are fully remote. You can work from anywhere with a reliable internet connection. Most projects also offer flexible scheduling — you choose when to work within project deadlines. Some specialized roles (like egocentric video capture) may require specific equipment or environments, but the majority of our work is done entirely online.",
      },
    },
    {
      "@type": "Question",
      name: "How is Claru different from other annotation platforms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru embeds annotators directly with AI research teams rather than routing anonymous tasks through a marketplace. You're not a gig worker picking from a task queue — you're part of the team, with context on the model you're training and direct communication with researchers. This means more meaningful work, better pay, longer engagements, and the opportunity to develop genuine expertise in frontier AI development.",
      },
    },
    {
      "@type": "Question",
      name: "What types of AI projects will I work on?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Video generation, vision-language models, robotics, and other frontier AI systems. Claru works with labs building the next generation of AI — not spam detection or ad targeting. Recent projects include training video generation models, evaluating multimodal reasoning, labeling manipulation data for robotic arms, and red-teaming large language models for safety. The specific projects available depend on your expertise and the current needs of our lab partners.",
      },
    },
  ],
};

export default function WorkWithUsLayout({
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
