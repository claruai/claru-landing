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

export const cinderComparison: ComparisonData = {
  slug: "cinder-alternatives",
  competitor: {
    name: "Cinder",
    siteUrl: "https://www.cinder.co",
    category: "Trust & Safety and data labeling platform",
  },
  meta: {
    title: "Cinder Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Cinder and Claru for physical AI training data. Cinder provides a Trust & Safety platform with data labeling and QA workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Cinder alternative",
      "Cinder alternatives",
      "Cinder vs Claru",
      "trust and safety data labeling",
      "data annotation platform",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Cinder Alternatives",
    title: "Cinder Alternatives: Trust & Safety Ops vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.cinder.co"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Cinder
        </a>{" "}
        delivers a Trust & Safety platform with labeling, QA, and policy
        workflows. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Cinder is an operations platform for Trust & Safety with integrated data labeling and QA workflows.",
      "Cinder supports multi-modal human review and labeling across text, image, video, and audio content.",
      "Cinder is strong for moderation and policy enforcement pipelines.",
      "Claru is purpose-built for physical AI data capture and enrichment, not Trust & Safety ops tooling.",
      "Choose Cinder for moderation + labeling workflows; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Cinder Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Cinder is an operations platform for Trust & Safety with integrated labeling and QA. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Cinder positions itself as a platform that unifies Trust & Safety
        workflows, policies, and data labeling in one system. {sourceLink("https://www.cinder.co/", "[1]")}
      </>,
      <>
        Cinder highlights real-time data annotation and model QA workflows, plus
        human review tooling that supports multi-modal content. {sourceLink("https://www.cinder.co/ai-development", "[2]")}
      </>,
      <>
        The human review and case management product includes data labeling
        tools and configurable content views for images, video, text, and audio. {sourceLink("https://www.cinder.co/product/human-review-case-management", "[3]")}
      </>,
      "If your bottleneck is moderation, policy enforcement, and QA for content or platform safety, Cinder is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Cinder at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Trust & Safety operations with labeling and QA. {sourceLink("https://www.cinder.co/", "[1]")}
              </>
            ),
          },
          {
            label: "Annotation",
            value: (
              <>
                Real-time data annotation and model QA workflows. {sourceLink("https://www.cinder.co/ai-development", "[2]")}
              </>
            ),
          },
          {
            label: "Content types",
            value: (
              <>
                Human review supports text, images, video, and audio. {sourceLink("https://www.cinder.co/product/human-review-case-management", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Trust & Safety teams running moderation pipelines",
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
            value: "Teams that need capture + enrichment for embodied AI",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Cinder unifies Trust & Safety workflows, policies, and data labeling in
        one platform. {sourceLink("https://www.cinder.co/", "[1]")}
      </>,
      <>
        Cinder provides real-time data annotation and model QA workflows. {sourceLink("https://www.cinder.co/ai-development", "[2]")}
      </>,
      <>
        Human review tooling supports multi-modal content and data labeling. {sourceLink("https://www.cinder.co/product/human-review-case-management", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Cinder Is Strong",
    intro:
      "Based on Cinder's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Trust & Safety operations",
        description: (
          <>
            Cinder positions itself as a platform for Trust & Safety workflows
            and policy enforcement. {sourceLink("https://www.cinder.co/", "[1]")}
          </>
        ),
      },
      {
        title: "Integrated labeling + QA",
        description: (
          <>
            Cinder highlights real-time data annotation and model QA tools. {sourceLink("https://www.cinder.co/ai-development", "[2]")}
          </>
        ),
      },
      {
        title: "Multi-modal review",
        description: (
          <>
            Human review workflows support text, images, video, and audio. {sourceLink("https://www.cinder.co/product/human-review-case-management", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Cinder is an operations platform for safety and moderation. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on existing content streams.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, and motion signals are generated as first-class outputs, not add-ons.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Cinder vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Cinder's Trust & Safety strengths.",
    columns: [
      { key: "cinder", label: "Cinder" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          cinder: (
            <>
              Trust & Safety operations with labeling and QA. {sourceLink("https://www.cinder.co/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Annotation",
        values: {
          cinder: (
            <>
              Real-time data annotation workflows. {sourceLink("https://www.cinder.co/ai-development", "[2]")}
            </>
          ),
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          cinder: "Ingests platform content for labeling",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          cinder: "Labeling and QA in ops workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          cinder: "Trust & Safety and content moderation teams",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Cinder vs Claru",
    intro:
      "Cinder is an ops platform for safety workflows. Claru specializes in physical AI data capture and enrichment.",
    blocks: [
      {
        title: "Ops workflows vs data pipeline",
        paragraphs: [
          "Cinder centralizes policy enforcement, human review, and labeling for safety operations.",
          "Claru focuses on collecting and enriching physical-world data for robotics training.",
        ],
      },
      {
        title: "Annotation context",
        paragraphs: [
          "Cinder labels content already flowing through a platform or moderation pipeline.",
          "Claru creates new datasets designed around robotic tasks and environments.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Cinder is a strong fit for Trust & Safety and moderation teams.",
          "Claru is better when you need capture and enrichment for physical AI models.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Cinder Is a Fit",
    competitorBullets: [
      "You run Trust & Safety or moderation operations.",
      "You need integrated labeling, QA, and policy enforcement.",
      "You want a single platform for safety workflows.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need datasets delivered in robotics-native formats.",
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
        desc: "Global data services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs physical AI specialization.",
        href: "/compare/labelbox-alternatives",
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
      "Choose Cinder when your core need is Trust & Safety operations and moderation workflows.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Cinder for safety operations, Claru for physical dataset capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Cinder?",
        answer: (
          <>
            Cinder is a Trust & Safety operations platform with labeling and QA
            workflows. {sourceLink("https://www.cinder.co/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Cinder support data labeling?",
        answer: (
          <>
            Yes. Cinder highlights real-time data annotation and labeling
            workflows. {sourceLink("https://www.cinder.co/ai-development", "[2]")}
          </>
        ),
      },
      {
        question: "Is Cinder a physical AI data provider?",
        answer:
          "Cinder focuses on moderation and labeling workflows rather than capture-first physical data pipelines.",
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
    { label: "Cinder Platform", url: "https://www.cinder.co/" },
    { label: "Cinder AI Development", url: "https://www.cinder.co/ai-development" },
    { label: "Cinder Human Review", url: "https://www.cinder.co/product/human-review-case-management" },
  ],
};
