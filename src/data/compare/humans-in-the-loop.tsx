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

export const humansInTheLoopComparison: ComparisonData = {
  slug: "humans-in-the-loop-alternatives",
  competitor: {
    name: "Humans in the Loop",
    siteUrl: "https://humansintheloop.org",
    category: "Managed data annotation services",
  },
  meta: {
    title: "Humans in the Loop Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Humans in the Loop and Claru for physical AI training data. Humans in the Loop provides managed annotation services across bounding box, polygon, keypoint, video, and 3D workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Humans in the Loop alternative",
      "Humans in the Loop alternatives",
      "Humans in the Loop vs Claru",
      "data annotation services",
      "computer vision labeling",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Humans in the Loop Alternatives",
    title: "Humans in the Loop Alternatives: Annotation Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://humansintheloop.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Humans in the Loop
        </a>{" "}
        provides managed annotation services across bounding box, polygon,
        keypoint, video, and 3D workflows. If you need physical-world capture
        and enrichment for robotics, Claru is built for physical AI from day
        one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Humans in the Loop provides managed annotation services for CV data.",
      "They list bounding box, polygon, keypoint, semantic segmentation, video, and 3D annotation workflows.",
      "They emphasize ethical data and human-driven labeling.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Humans in the Loop for labeling services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Humans in the Loop Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Humans in the Loop provides managed annotation services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Humans in the Loop highlights annotation services across bounding box,
        polygon, keypoint, semantic segmentation, video, and 3D annotation.
        {sourceLink("https://humansintheloop.org/", "[1]")}
      </>,
      <>
        The company positions itself as a partner for high-quality AI data with
        ethical and secure datasets. {sourceLink("https://humansintheloop.org/", "[2]")}
      </>,
      "If your bottleneck is managed CV annotation, Humans in the Loop is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Humans in the Loop at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Managed annotation services for CV data.
                {sourceLink("https://humansintheloop.org/", "[1]")}
              </>
            ),
          },
          {
            label: "Annotation types",
            value: (
              <>
                Bounding box, polygon, keypoint, segmentation, video, 3D.
                {sourceLink("https://humansintheloop.org/", "[1]")}
              </>
            ),
          },
          {
            label: "Positioning",
            value: (
              <>
                High-quality, ethical AI data partner.
                {sourceLink("https://humansintheloop.org/", "[2]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing managed annotation services",
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
        Humans in the Loop offers managed annotation services across multiple
        CV tasks. {sourceLink("https://humansintheloop.org/", "[1]")}
      </>,
      <>
        The company positions itself as a partner for high-quality, ethical AI
        data. {sourceLink("https://humansintheloop.org/", "[2]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Humans in the Loop Is Strong",
    intro:
      "Based on Humans in the Loop's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Multi-task annotation",
        description: (
          <>
            Services include bounding box, polygon, keypoint, segmentation,
            video, and 3D annotation. {sourceLink("https://humansintheloop.org/", "[1]")}
          </>
        ),
      },
      {
        title: "Managed delivery",
        description: (
          <>
            Humans in the Loop emphasizes managed, high-quality data delivery.
            {sourceLink("https://humansintheloop.org/", "[2]")}
          </>
        ),
      },
      {
        title: "Ethical data focus",
        description: (
          <>
            The company highlights ethical data practices and social impact.
            {sourceLink("https://humansintheloop.org/", "[2]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Humans in the Loop provides labeling services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying only on labeling services.",
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
    title: "Humans in the Loop vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Humans in the Loop's annotation services.",
    columns: [
      { key: "hitl", label: "Humans in the Loop" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          hitl: (
            <>
              Managed CV annotation services.
              {sourceLink("https://humansintheloop.org/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Annotation types",
        values: {
          hitl: (
            <>
              Bounding box, polygon, keypoint, segmentation, video, 3D.
              {sourceLink("https://humansintheloop.org/", "[1]")}
            </>
          ),
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Data capture",
        values: {
          hitl: "Managed labeling services",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Best fit",
        values: {
          hitl: "Teams needing managed annotation services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Humans in the Loop vs Claru",
    intro:
      "Humans in the Loop specializes in annotation services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Humans in the Loop delivers managed annotation services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Humans in the Loop focuses on labeling existing data.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Humans in the Loop is strong when you need managed annotation capacity.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Humans in the Loop Is a Fit",
    competitorBullets: [
      "You need managed annotation services for CV data.",
      "You already have data and need labeling throughput.",
      "You want an ethical, human-driven labeling partner.",
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
      "Choose Humans in the Loop when you need managed annotation services across CV tasks.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Humans in the Loop for labeling services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Humans in the Loop?",
        answer: (
          <>
            Humans in the Loop provides managed annotation services across CV
            tasks. {sourceLink("https://humansintheloop.org/", "[1]")}
          </>
        ),
      },
      {
        question: "What annotation types are supported?",
        answer: (
          <>
            The company lists bounding box, polygon, keypoint, segmentation,
            video, and 3D annotation. {sourceLink("https://humansintheloop.org/", "[1]")}
          </>
        ),
      },
      {
        question: "Is Humans in the Loop focused on ethical AI data?",
        answer: (
          <>
            Humans in the Loop highlights ethical and secure datasets.
            {sourceLink("https://humansintheloop.org/", "[2]")}
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
    { label: "Humans in the Loop", url: "https://humansintheloop.org/" },
  ],
};
