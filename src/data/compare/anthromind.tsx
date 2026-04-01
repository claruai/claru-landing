import type { ComparisonData } from "@/data/compare/types";
import { claruPipelineSteps, claruProofStats } from "@/data/compare/shared";

const sourceLink = (href: string, label: string) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-[var(--accent-primary)] underline underline-offset-2"
  >
    {label}
  </a>
);

export const anthromindComparison: ComparisonData = {
  slug: "anthromind-alternatives",
  competitor: {
    name: "Anthromind",
    siteUrl: "https://www.anthromind.com",
    category: "LLM oversight, evaluation, and fine-tuning data",
  },
  meta: {
    title: "Anthromind Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Anthromind and Claru for physical AI training data. Anthromind focuses on LLM evaluation, fine-tuning, and expert-in-the-loop oversight. Claru delivers capture, enrichment, and robotics-ready datasets.",
    keywords: [
      "Anthromind alternative",
      "Anthromind alternatives",
      "Anthromind vs Claru",
      "LLM evaluation",
      "LLM fine-tuning data",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Anthromind Alternatives",
    title: "Anthromind Alternatives: LLM Oversight vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.anthromind.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Anthromind
        </a>{" "}
        focuses on LLM oversight, evaluation, and fine-tuning data. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one. This page compares the two approaches.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Anthromind focuses on LLM evaluation, custom assessments, and fine-tuning data.",
      "Anthromind positions itself as scalable oversight for post-training evaluation and RLHF.",
      "Claru is purpose-built for physical AI data capture and enrichment.",
      "Choose Anthromind when your priority is LLM evaluation or domain-specific fine-tuning data.",
      "Choose Claru when you need robotics-ready datasets captured from the physical world.",
    ],
  },
  overview: {
    title: "What Anthromind Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Anthromind is a post-training evaluation and oversight partner for LLM workflows. Claru is a physical AI data pipeline focused on capture and enrichment for robotics training.",
      <>
        Anthromind highlights scalable oversight for model post-training
        evaluation and RLHF, with a focus on evaluating LLM outputs and
        workflows. {sourceLink("https://www.anthromind.com/", "[1]")}
      </>,
      <>
        The company also emphasizes fine-tuning and RAG enhancement using
        domain-specific data and expert evaluation. {" "}
        {sourceLink("https://www.anthromind.com/", "[2]")}
      </>,
      "If your bottleneck is LLM evaluation or specialized fine-tuning data, Anthromind is a strong fit. If your bottleneck is physical-world data capture, you need a different pipeline.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Anthromind at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Post-training evaluation, RLHF oversight, and fine-tuning data. {" "}
                {sourceLink("https://www.anthromind.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Core services",
            value: (
              <>
                LLM evaluation workflows and custom fine-tuning data. {" "}
                {sourceLink("https://www.anthromind.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Evaluation results, expert data, and fine-tuning datasets",
          },
          {
            label: "Best fit",
            value: "LLM teams needing evaluation and fine-tuning support",
          },
        ],
      },
      {
        title: "Claru at a Glance",
        items: [
          {
            label: "Focus",
            value: "Physical AI training data for robotics and world models",
          },
          {
            label: "Capture",
            value: "Wearable camera network plus task-specific collection",
          },
          {
            label: "Enrichment",
            value: "Depth, pose, segmentation, optical flow, aligned captions",
          },
          {
            label: "Best fit",
            value: "Robotics teams that need capture + enrichment",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Anthromind positions itself around post-training evaluation and RLHF
        oversight. {sourceLink("https://www.anthromind.com/", "[1]")}
      </>,
      <>
        Anthromind highlights evaluation of LLM outputs and workflows. {" "}
        {sourceLink("https://www.anthromind.com/", "[2]")}
      </>,
      <>
        Anthromind emphasizes fine-tuning and RAG enhancement with
        domain-specific data. {sourceLink("https://www.anthromind.com/", "[3]")}
      </>,
      <>
        Anthromind states it provides training data creation and expert
        evaluations. {sourceLink("https://www.anthromind.com/", "[4]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Anthromind Is Strong",
    intro:
      "Based on Anthromind’s public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "LLM evaluation workflows",
        description: (
          <>
            Anthromind focuses on evaluating LLM outputs and workflows. {" "}
            {sourceLink("https://www.anthromind.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Fine-tuning and RAG support",
        description: (
          <>
            The site describes fine-tuning and RAG enhancement using domain
            data. {sourceLink("https://www.anthromind.com/", "[3]")}
          </>
        ),
      },
      {
        title: "Training data creation",
        description: (
          <>
            Anthromind notes support from training data creation to expert
            evaluations. {sourceLink("https://www.anthromind.com/", "[4]")}
          </>
        ),
      },
      {
        title: "Custom evaluations",
        description: (
          <>
            Enterprise AI pages highlight custom evaluations for specific
            applications. {sourceLink("https://www.anthromind.com/enterprise-ai", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics teams often need capture and enrichment of physical-world data — not just LLM evaluation workflows.",
    cards: [
      {
        title: "Capture-first pipelines",
        description:
          "Physical AI models require real-world data collection with task-specific capture programs.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, segmentation, and motion signals are critical for robotics training.",
      },
      {
        title: "Training-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Anthromind vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Anthromind’s LLM evaluation focus.",
    columns: [
      { key: "anthromind", label: "Anthromind" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          anthromind: (
            <>
              LLM evaluation and post-training oversight. {" "}
              {sourceLink("https://www.anthromind.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Core output",
        values: {
          anthromind: "Evaluation results and fine-tuning datasets",
          claru: "Training-ready physical datasets with enrichment layers",
        },
      },
      {
        dimension: "Data capture",
        values: {
          anthromind: "Not positioned as capture-first for physical datasets",
          claru: "Collector network plus teleoperation and task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          anthromind: "Evaluation and fine-tuning data for LLMs",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          anthromind: "LLM teams needing evaluation and fine-tuning support",
          claru: "Robotics teams needing capture + enrichment",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Anthromind vs Claru",
    intro:
      "Anthromind is built around LLM oversight and evaluation. Claru is built around physical-world data capture.",
    blocks: [
      {
        title: "LLM oversight vs physical capture",
        paragraphs: [
          "Anthromind focuses on evaluation workflows and post-training oversight for LLM systems.",
          "Claru focuses on capturing and enriching real-world physical data for robotics and embodied AI.",
        ],
      },
      {
        title: "Fine-tuning data vs robotics datasets",
        paragraphs: [
          "Anthromind emphasizes fine-tuning and RAG enhancement with domain data.",
          "Claru delivers datasets enriched with depth, pose, and motion signals for robotics training.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Anthromind is ideal for LLM evaluation and fine-tuning initiatives.",
          "Claru is ideal for teams that need physical-world capture and enrichment.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Anthromind Is a Fit",
    competitorBullets: [
      "You need LLM evaluation workflows and post-training oversight.",
      "You want domain-specific fine-tuning data or RAG enhancement.",
      "Your focus is model evaluation rather than physical-world capture.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need new physical-world data captured for robotics tasks.",
      "Your model depends on enrichment layers like depth, pose, and motion.",
      "You want datasets delivered in robotics-native formats.",
    ],
  },
  pipeline: {
    title: "How Claru Delivers Physical AI Data",
    intro:
      "Claru provides an end-to-end pipeline so physical AI teams can move from brief to training-ready data quickly.",
    steps: claruPipelineSteps,
  },
  proof: {
    title: "Claru by the Numbers",
    stats: claruProofStats,
  },
  related: {
    title: "Other Alternatives Worth Considering",
    intro:
      "If you are mapping the data provider landscape, these comparisons cover adjacent options.",
    links: [
      {
        title: "Appen Alternatives",
        desc: "Global data services vs physical AI specialization.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Surge AI Alternatives",
        desc: "Expert RLHF vs physical AI capture.",
        href: "/compare/surge-ai-alternatives",
      },
      {
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "If you need LLM evaluation, fine-tuning, or post-training oversight, Anthromind is designed for that scope.",
      "If you need capture and enrichment of physical-world data for robotics training, Claru is a better fit.",
      "Some teams use both: Anthromind for evaluation, Claru for physical datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Anthromind?",
        answer: (
          <>
            Anthromind positions itself around scalable oversight for LLM
            evaluation and post-training workflows. {" "}
            {sourceLink("https://www.anthromind.com/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Anthromind provide fine-tuning data?",
        answer: (
          <>
            Anthromind highlights fine-tuning and RAG enhancement with
            domain-specific data. {" "}
            {sourceLink("https://www.anthromind.com/", "[2]")}
          </>
        ),
      },
      {
        question: "Is Anthromind a physical AI data provider?",
        answer:
          "Anthromind focuses on LLM evaluation and fine-tuning rather than physical-world data capture.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
    ],
  },
  cta: {
    title: "Need Physical AI Data That Ships Fast?",
    description:
      "Tell us what you are training. We will scope a capture plan and deliver a pilot dataset in days.",
    primary: { label: "Book a call", href: "/contact" },
    secondary: { label: "Explore data catalog", href: "/data-catalog" },
  },
  sources: [
    { label: "Anthromind", url: "https://www.anthromind.com/" },
    { label: "Anthromind Enterprise AI", url: "https://www.anthromind.com/enterprise-ai" },
  ],
};
