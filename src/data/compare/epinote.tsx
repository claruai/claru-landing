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

export const epinoteComparison: ComparisonData = {
  slug: "epinote-alternatives",
  competitor: {
    name: "Epinote",
    siteUrl: "https://epinote.io",
    category: "AI data workflows and annotation",
  },
  meta: {
    title: "Epinote Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Epinote and Claru for physical AI training data. Epinote positions itself as a platform for data collection, annotation, and QA workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Epinote alternative",
      "Epinote alternatives",
      "Epinote vs Claru",
      "data annotation platform",
      "data collection workflows",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Epinote Alternatives",
    title: "Epinote Alternatives: Annotation Workflows vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://epinote.io"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Epinote
        </a>{" "}
        positions itself as a platform for data collection, annotation, and QA.
        If you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Epinote highlights data collection, annotation, and QA workflows for AI teams.",
      "The platform emphasizes human-in-the-loop workflows and workforce management.",
      "Epinote is a workflow platform rather than a capture-first robotics pipeline.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Epinote for annotation workflows; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Epinote Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Epinote provides workflow tooling for data collection and annotation. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Epinote describes a platform for data collection, annotation, and QA
        workflows. {sourceLink("https://epinote.io/", "[1]")}
      </>,
      <>
        The company highlights human-in-the-loop and workforce management
        capabilities. {sourceLink("https://epinote.io/", "[2]")}
      </>,
      "If your bottleneck is workflow orchestration for annotation projects, Epinote is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Epinote at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data collection, annotation, and QA workflows. {sourceLink("https://epinote.io/", "[1]")}
              </>
            ),
          },
          {
            label: "Workflow",
            value: (
              <>
                Human-in-the-loop and workforce management. {sourceLink("https://epinote.io/", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Managed annotation workflows and labeled datasets",
          },
          {
            label: "Best fit",
            value: "Teams needing workflow orchestration for annotation",
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
        Epinote describes a platform for data collection, annotation, and QA
        workflows. {sourceLink("https://epinote.io/", "[1]")}
      </>,
      <>
        The platform highlights human-in-the-loop workflows. {sourceLink("https://epinote.io/", "[2]")}
      </>,
      <>
        Epinote references workforce management for data tasks. {sourceLink("https://epinote.io/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Epinote Is Strong",
    intro:
      "Based on Epinote's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Workflow orchestration",
        description: (
          <>
            Epinote emphasizes workflow tooling for data collection and
            annotation. {sourceLink("https://epinote.io/", "[1]")}
          </>
        ),
      },
      {
        title: "Human-in-the-loop",
        description: (
          <>
            The platform highlights human-in-the-loop workflows. {sourceLink("https://epinote.io/", "[2]")}
          </>
        ),
      },
      {
        title: "Workforce management",
        description: (
          <>
            Epinote references workforce management for data tasks. {sourceLink("https://epinote.io/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Epinote provides workflow tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on existing datasets.",
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
    title: "Epinote vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Epinote's workflow strengths.",
    columns: [
      { key: "epinote", label: "Epinote" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          epinote: (
            <>
              Data collection, annotation, and QA workflows. {sourceLink("https://epinote.io/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Workflow",
        values: {
          epinote: (
            <>
              Human-in-the-loop and workforce management tools. {sourceLink("https://epinote.io/", "[2]")}
            </>
          ),
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          epinote: "Coordinate tasks across a workforce",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          epinote: "Annotation workflows and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          epinote: "Teams needing annotation workflow tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Epinote vs Claru",
    intro:
      "Epinote provides workflow tools. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "Epinote orchestrates data collection, annotation, and QA workflows.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Workforce model",
        paragraphs: [
          "Epinote emphasizes workforce management for annotation tasks.",
          "Claru runs a trained collector network for physical-world data capture.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Epinote is a strong fit for workflow orchestration.",
          "Claru is better when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Epinote Is a Fit",
    competitorBullets: [
      "You need workflow tooling for annotation and QA.",
      "You want workforce management for data tasks.",
      "You already have data and need annotation orchestration.",
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
      "Choose Epinote when you need workflow tooling for annotation and QA.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Epinote for workflow orchestration, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Epinote?",
        answer: (
          <>
            Epinote describes a platform for data collection, annotation, and QA
            workflows. {sourceLink("https://epinote.io/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Epinote provide workforce management?",
        answer: (
          <>
            The platform references workforce management for data tasks. {sourceLink("https://epinote.io/", "[2]")}
          </>
        ),
      },
      {
        question: "Is Epinote a physical AI data provider?",
        answer:
          "Epinote focuses on annotation workflows rather than capture-first physical data pipelines.",
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
  sources: [{ label: "Epinote", url: "https://epinote.io/" }],
};
