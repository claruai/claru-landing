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

export const dataloopComparison: ComparisonData = {
  slug: "dataloop-alternatives",
  competitor: {
    name: "Dataloop",
    siteUrl: "https://dataloop.ai",
    category: "AI data platform and annotation suite",
  },
  meta: {
    title: "Dataloop Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Dataloop and Claru for physical AI training data. Dataloop offers an AI data platform and annotation workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Dataloop alternative",
      "Dataloop alternatives",
      "Dataloop vs Claru",
      "data annotation platform",
      "AI data platform",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Dataloop Alternatives",
    title: "Dataloop Alternatives: AI Data Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://dataloop.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Dataloop
        </a>{" "}
        provides an AI data platform with annotation workflows and automation.
        If you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Dataloop provides an AI data platform with data annotation workflows.",
      "The platform emphasizes automation, QA, and collaboration for labeling teams.",
      "Dataloop supports multiple data types and dataset management features.",
      "Claru is purpose-built for physical AI capture and enrichment, not just annotation tooling.",
      "Choose Dataloop for an annotation platform; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Dataloop Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Dataloop is an AI data platform for annotation and dataset operations. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Dataloop positions its offering as a data annotation platform with
        automation, QA, and collaboration features for labeling teams. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[1]")}
      </>,
      <>
        Dataloop documentation covers data annotation workflows and dataset
        management across multiple data types. {sourceLink("https://docs.dataloop.ai/docs/data-annotation-overview", "[2]")}
      </>,
      "If your bottleneck is labeling workflow and dataset management, Dataloop is a strong fit. If your bottleneck is capture and enrichment of physical-world data, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Dataloop at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                AI data annotation platform and workflows. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[1]")}
              </>
            ),
          },
          {
            label: "Platform",
            value: (
              <>
                Annotation workflows with automation and QA. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Labeled datasets and managed annotation workflows",
          },
          {
            label: "Best fit",
            value: "Teams needing an AI data platform for existing datasets",
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
        Dataloop provides a data annotation platform with automation and QA
        features. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[1]")}
      </>,
      <>
        Dataloop documentation details annotation workflows and dataset
        management. {sourceLink("https://docs.dataloop.ai/docs/data-annotation-overview", "[2]")}
      </>,
      <>
        The platform emphasizes collaboration and workflow orchestration for
        labeling teams. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Dataloop Is Strong",
    intro:
      "Based on Dataloop's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Annotation workflows",
        description: (
          <>
            Dataloop emphasizes annotation workflows with automation and QA. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[1]")}
          </>
        ),
      },
      {
        title: "Dataset operations",
        description: (
          <>
            Documentation covers dataset management and annotation tools. {sourceLink("https://docs.dataloop.ai/docs/data-annotation-overview", "[2]")}
          </>
        ),
      },
      {
        title: "Team collaboration",
        description: (
          <>
            The platform highlights collaboration features for labeling teams. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Dataloop is a data annotation platform. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Dataloop vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Dataloop's platform strengths.",
    columns: [
      { key: "dataloop", label: "Dataloop" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          dataloop: (
            <>
              AI data annotation platform. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data workflow",
        values: {
          dataloop: (
            <>
              Annotation workflows with automation and QA. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[2]")}
            </>
          ),
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          dataloop: "Bring-your-own data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          dataloop: "Annotation and workflow tooling",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          dataloop: "Teams needing an AI data platform",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Dataloop vs Claru",
    intro:
      "Dataloop focuses on annotation workflows. Claru focuses on physical AI capture and enrichment.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "Dataloop provides a platform for labeling operations and QA.",
          "Claru provides capture, enrichment, and delivery for robotics teams.",
        ],
      },
      {
        title: "Data ownership",
        paragraphs: [
          "Dataloop assumes you already have data to annotate.",
          "Claru acquires new physical-world data and enriches it for training.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Dataloop is a strong fit for teams building labeling pipelines.",
          "Claru is a better fit when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Dataloop Is a Fit",
    competitorBullets: [
      "You need a platform to manage annotation workflows and QA.",
      "You already have data and need labeling orchestration.",
      "You want automation features to speed up annotation.",
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
        desc: "Enterprise annotation vs physical AI capture pipelines.",
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
      "Choose Dataloop when you need an annotation platform with workflow automation and QA.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Dataloop for internal labeling, Claru for physical data capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Dataloop?",
        answer: (
          <>
            Dataloop provides a data annotation platform with automation and QA
            workflows. {sourceLink("https://dataloop.ai/solutions/data-annotation/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Dataloop support dataset management?",
        answer: (
          <>
            Dataloop documentation covers data annotation workflows and dataset
            management. {sourceLink("https://docs.dataloop.ai/docs/data-annotation-overview", "[2]")}
          </>
        ),
      },
      {
        question: "Is Dataloop a data capture provider?",
        answer:
          "Dataloop focuses on annotation workflows; it does not provide a capture-first physical data pipeline.",
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
    { label: "Dataloop Data Annotation", url: "https://dataloop.ai/solutions/data-annotation/" },
    { label: "Dataloop Docs - Data Annotation Overview", url: "https://docs.dataloop.ai/docs/data-annotation-overview" },
  ],
};
