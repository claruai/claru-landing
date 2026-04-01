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

export const labellerrComparison: ComparisonData = {
  slug: "labellerr-alternatives",
  competitor: {
    name: "Labellerr",
    siteUrl: "https://www.labellerr.com",
    category: "Data annotation platform",
  },
  meta: {
    title: "Labellerr Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Labellerr and Claru for physical AI training data. Labellerr offers a data annotation platform with automation. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Labellerr alternative",
      "Labellerr alternatives",
      "Labellerr vs Claru",
      "data annotation platform",
      "labeling automation",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Labellerr Alternatives",
    title: "Labellerr Alternatives: Annotation Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.labellerr.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Labellerr
        </a>{" "}
        provides a data annotation platform with automation features. If you
        need physical-world capture and enrichment for robotics, Claru is built
        for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Labellerr offers a data annotation platform with labeling automation features.",
      "The platform supports multiple data types and labeling workflows.",
      "Labellerr is a labeling platform rather than a capture-first robotics pipeline.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Labellerr for labeling workflows; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Labellerr Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Labellerr provides an annotation platform with automation. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Labellerr highlights a data annotation platform with labeling workflows
        and automation. {sourceLink("https://www.labellerr.com/data-annotate", "[1]")}
      </>,
      <>
        The platform supports multiple data types and annotation tasks. {sourceLink("https://www.labellerr.com/data-annotate", "[2]")}
      </>,
      "If your bottleneck is labeling workflow tooling, Labellerr is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Labellerr at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data annotation platform with automation. {sourceLink("https://www.labellerr.com/data-annotate", "[1]")}
              </>
            ),
          },
          {
            label: "Data types",
            value: (
              <>
                Supports multiple data types and annotation tasks. {sourceLink("https://www.labellerr.com/data-annotate", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Labeled datasets and annotation workflows",
          },
          {
            label: "Best fit",
            value: "Teams needing annotation workflows and automation",
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
        Labellerr provides a data annotation platform with automation. {sourceLink("https://www.labellerr.com/data-annotate", "[1]")}
      </>,
      <>
        The platform supports multiple data types and annotation tasks. {sourceLink("https://www.labellerr.com/data-annotate", "[2]")}
      </>,
      <>
        Labellerr positions itself as a labeling platform for AI teams. {sourceLink("https://www.labellerr.com/data-annotate", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Labellerr Is Strong",
    intro:
      "Based on Labellerr's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Annotation platform",
        description: (
          <>
            Labellerr highlights an annotation platform with automation. {sourceLink("https://www.labellerr.com/data-annotate", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal support",
        description: (
          <>
            The platform supports multiple data types and annotation tasks. {sourceLink("https://www.labellerr.com/data-annotate", "[2]")}
          </>
        ),
      },
      {
        title: "Workflow automation",
        description: (
          <>
            Labellerr emphasizes automation within labeling workflows. {sourceLink("https://www.labellerr.com/data-annotate", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Labellerr is a labeling platform. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Labellerr vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Labellerr's platform strengths.",
    columns: [
      { key: "labellerr", label: "Labellerr" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          labellerr: (
            <>
              Data annotation platform with automation. {sourceLink("https://www.labellerr.com/data-annotate", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          labellerr: "Multi-modal labeling workflows",
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          labellerr: "Bring-your-own data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          labellerr: "Annotation workflows and automation",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          labellerr: "Teams needing labeling workflows and automation",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Labellerr vs Claru",
    intro:
      "Labellerr focuses on annotation workflows. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "Labellerr delivers labeling workflows and automation.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Labellerr assumes you already have data to annotate.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Labellerr is a strong fit for labeling workflow tooling.",
          "Claru is better when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Labellerr Is a Fit",
    competitorBullets: [
      "You need a labeling platform with automation features.",
      "You already have data and need labeling workflows.",
      "You want multi-modal annotation tooling.",
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
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs physical AI specialization.",
        href: "/compare/labelbox-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Appen Alternatives",
        desc: "Global data services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
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
      "Choose Labellerr when you need a labeling platform with automation features.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Labellerr for labeling workflows, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Labellerr?",
        answer: (
          <>
            Labellerr provides a data annotation platform with automation. {sourceLink("https://www.labellerr.com/data-annotate", "[1]")}
          </>
        ),
      },
      {
        question: "Does Labellerr support multiple data types?",
        answer: (
          <>
            Yes. Labellerr highlights support for multiple data types and tasks. {sourceLink("https://www.labellerr.com/data-annotate", "[2]")}
          </>
        ),
      },
      {
        question: "Is Labellerr a physical AI data provider?",
        answer:
          "Labellerr focuses on labeling workflows rather than capture-first physical data pipelines.",
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
    { label: "Labellerr Data Annotation", url: "https://www.labellerr.com/data-annotate" },
  ],
};
