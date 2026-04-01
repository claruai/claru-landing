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

export const cvatComparison: ComparisonData = {
  slug: "cvat-alternatives",
  competitor: {
    name: "CVAT",
    siteUrl: "https://www.cvat.ai",
    category: "Open-source data annotation platform",
  },
  meta: {
    title: "CVAT Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare CVAT and Claru for physical AI training data. CVAT is an open-source data annotation platform for images, video, and 3D data. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "CVAT alternative",
      "CVAT alternatives",
      "CVAT vs Claru",
      "open source data annotation",
      "computer vision labeling",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "CVAT Alternatives",
    title: "CVAT Alternatives: Open-Source Labeling vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.cvat.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          CVAT
        </a>{" "}
        is an open-source data annotation platform for images, video, and 3D
        data. If you need physical-world capture and enrichment for robotics,
        Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "CVAT is an open-source data annotation platform for images, video, and 3D data.",
      "It supports a wide range of annotation tasks and tooling for CV teams.",
      "CVAT offers cloud and enterprise deployments plus labeling services.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose CVAT for annotation tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What CVAT Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: CVAT is an annotation platform for CV data. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        CVAT positions itself as an open-source data annotation platform for
        images, video, and 3D data. {sourceLink("https://www.cvat.ai/", "[1]")}
      </>,
      <>
        The platform highlights support for a broad set of annotation tasks and
        tools for computer vision workflows. {sourceLink("https://www.cvat.ai/", "[2]")}
      </>,
      <>
        CVAT also offers cloud/enterprise deployments and labeling services.
        {sourceLink("https://www.cvat.ai/", "[3]")}
      </>,
      "If your bottleneck is annotation tooling and workflow management, CVAT is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "CVAT at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Open-source data annotation platform. {sourceLink("https://www.cvat.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Data types",
            value: (
              <>
                Images, video, and 3D data annotation. {sourceLink("https://www.cvat.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Delivery",
            value: (
              <>
                Cloud/enterprise deployments and labeling services.
                {sourceLink("https://www.cvat.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams that need a flexible labeling platform",
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
        CVAT is an open-source annotation platform for images, video, and 3D
        data. {sourceLink("https://www.cvat.ai/", "[1]")}
      </>,
      <>
        CVAT supports a broad set of annotation tools for CV workflows.
        {sourceLink("https://www.cvat.ai/", "[2]")}
      </>,
      <>
        CVAT offers cloud/enterprise deployments and labeling services.
        {sourceLink("https://www.cvat.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where CVAT Is Strong",
    intro:
      "Based on CVAT's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Open-source flexibility",
        description: (
          <>
            CVAT emphasizes open-source deployment for annotation workflows.
            {sourceLink("https://www.cvat.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal annotation",
        description: (
          <>
            The platform supports images, video, and 3D data annotation.
            {sourceLink("https://www.cvat.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Cloud + services",
        description: (
          <>
            CVAT offers hosted deployments and labeling services.
            {sourceLink("https://www.cvat.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "CVAT is a labeling platform. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of focusing only on labeling tools.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, and motion signals are generated as first-class outputs.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "CVAT vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing CVAT's labeling platform strengths.",
    columns: [
      { key: "cvat", label: "CVAT" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          cvat: (
            <>
              Open-source annotation platform. {sourceLink("https://www.cvat.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          cvat: (
            <>
              Images, video, and 3D data annotation. {sourceLink("https://www.cvat.ai/", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Capture model",
        values: {
          cvat: "Annotation tooling and labeling services",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          cvat: "Annotation and QA workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          cvat: "Teams needing flexible annotation tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: CVAT vs Claru",
    intro:
      "CVAT specializes in annotation tooling. Claru specializes in capture and enrichment for physical AI.",
    blocks: [
      {
        title: "Tooling vs pipeline",
        paragraphs: [
          "CVAT delivers annotation tooling and optional labeling services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "CVAT assumes teams already have data to label.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "CVAT is strong when you need a flexible open-source labeling stack.",
          "Claru is stronger when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When CVAT Is a Fit",
    competitorBullets: [
      "You need an open-source annotation platform for CV data.",
      "You want flexible tools for images, video, and 3D labeling.",
      "You already have data and need annotation workflows.",
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
        title: "Label Studio Alternatives",
        desc: "Open-source labeling platform vs physical AI specialization.",
        href: "/compare/label-studio-alternatives",
      },
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
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose CVAT when you need flexible annotation tooling for CV datasets.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: CVAT for labeling tools, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is CVAT?",
        answer: (
          <>
            CVAT is an open-source data annotation platform for images, video,
            and 3D data. {sourceLink("https://www.cvat.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does CVAT support?",
        answer: (
          <>
            CVAT highlights image, video, and 3D data annotation.
            {sourceLink("https://www.cvat.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Does CVAT offer services or hosting?",
        answer: (
          <>
            CVAT offers cloud/enterprise deployments and labeling services.
            {sourceLink("https://www.cvat.ai/", "[3]")}
          </>
        ),
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
    { label: "CVAT", url: "https://www.cvat.ai/" },
  ],
};
