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

export const roboflowComparison: ComparisonData = {
  slug: "roboflow-alternatives",
  competitor: {
    name: "Roboflow",
    siteUrl: "https://roboflow.com",
    category: "Computer vision data management and annotation platform",
  },
  meta: {
    title: "Roboflow Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Roboflow and Claru for physical AI training data. Roboflow provides an annotation and data management platform with AI-assisted labeling, auto labeling, and dataset workflows for CV teams. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Roboflow alternative",
      "Roboflow alternatives",
      "Roboflow vs Claru",
      "computer vision annotation",
      "AI-assisted labeling",
      "auto labeling",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Roboflow Alternatives",
    title: "Roboflow Alternatives: CV Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://roboflow.com/annotate"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Roboflow
        </a>{" "}
        provides a computer vision data platform with annotation, AI-assisted
        labeling, and auto-labeling workflows. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI from
        day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Roboflow positions itself around CV data management and annotation.",
      "The platform highlights 750K+ datasets and 575M+ labeled images.",
      "AI-assisted labeling offers smart suggestions and fast workflows.",
      "Label Assist claims up to 95% labeling time reduction.",
      "Auto Label uses foundation models to label thousands of images in minutes.",
      "Annotation types include bounding boxes, polygons, keypoints, and classification.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Roboflow for CV tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Roboflow Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Roboflow provides a CV platform for data management and annotation. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Roboflow highlights scale with 750K+ datasets and 575M+ labeled images.
        {sourceLink("https://roboflow.com/annotate", "[1]")}
      </>,
      <>
        The platform promotes AI-assisted labeling with smart suggestions.
        {sourceLink("https://roboflow.com/annotate", "[2]")}
      </>,
      <>
        Roboflow claims Label Assist can reduce labeling time by up to 95%.
        {sourceLink("https://roboflow.com/annotate", "[3]")}
      </>,
      <>
        Auto Label is described as using foundation models to label thousands of
        images in minutes. {sourceLink("https://roboflow.com/annotate", "[4]")}
      </>,
      <>
        Annotation types include bounding boxes, polygons, keypoints, and
        classification. {sourceLink("https://roboflow.com/annotate", "[5]")}
      </>,
      "If your bottleneck is CV annotation tooling and dataset management, Roboflow is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Roboflow at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                CV data management and annotation platform.
                {sourceLink("https://roboflow.com/annotate", "[2]")}
              </>
            ),
          },
          {
            label: "Scale",
            value: (
              <>
                750K+ datasets and 575M+ labeled images.
                {sourceLink("https://roboflow.com/annotate", "[1]")}
              </>
            ),
          },
          {
            label: "Automation",
            value: (
              <>
                AI-assisted labeling and Auto Label workflows.
                {sourceLink("https://roboflow.com/annotate", "[2]")}
                {sourceLink("https://roboflow.com/annotate", "[4]")}
              </>
            ),
          },
          {
            label: "Annotation types",
            value: (
              <>
                Bounding boxes, polygons, keypoints, classification.
                {sourceLink("https://roboflow.com/annotate", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing CV annotation and dataset tooling",
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
        Roboflow highlights 750K+ datasets and 575M+ labeled images.
        {sourceLink("https://roboflow.com/annotate", "[1]")}
      </>,
      <>
        The platform promotes AI-assisted labeling with smart suggestions.
        {sourceLink("https://roboflow.com/annotate", "[2]")}
      </>,
      <>
        Label Assist claims up to 95% labeling time reduction.
        {sourceLink("https://roboflow.com/annotate", "[3]")}
      </>,
      <>
        Auto Label is described as using foundation models to label thousands of
        images in minutes. {sourceLink("https://roboflow.com/annotate", "[4]")}
      </>,
      <>
        Annotation types include bounding boxes, polygons, keypoints, and
        classification. {sourceLink("https://roboflow.com/annotate", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Roboflow Is Strong",
    intro:
      "Based on Roboflow's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Dataset scale",
        description: (
          <>
            Roboflow highlights 750K+ datasets and 575M+ labeled images.
            {sourceLink("https://roboflow.com/annotate", "[1]")}
          </>
        ),
      },
      {
        title: "AI-assisted labeling",
        description: (
          <>
            The platform emphasizes AI-assisted labeling workflows.
            {sourceLink("https://roboflow.com/annotate", "[2]")}
          </>
        ),
      },
      {
        title: "Label Assist speed",
        description: (
          <>
            Label Assist claims up to 95% time reduction.
            {sourceLink("https://roboflow.com/annotate", "[3]")}
          </>
        ),
      },
      {
        title: "Auto Label",
        description: (
          <>
            Auto Label uses foundation models to label thousands of images in
            minutes. {sourceLink("https://roboflow.com/annotate", "[4]")}
          </>
        ),
      },
      {
        title: "Annotation breadth",
        description: (
          <>
            Supports bounding boxes, polygons, keypoints, and classification.
            {sourceLink("https://roboflow.com/annotate", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Roboflow provides annotation tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of focusing only on tooling.",
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
      {
        title: "Task-specific collection",
        description:
          "Claru designs capture briefs around real robot behaviors and environments.",
      },
    ],
  },
  comparison: {
    title: "Roboflow vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Roboflow's tooling strengths.",
    columns: [
      { key: "roboflow", label: "Roboflow" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          roboflow: (
            <>
              CV data management and annotation platform.
              {sourceLink("https://roboflow.com/annotate", "[2]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Scale",
        values: {
          roboflow: (
            <>
              750K+ datasets and 575M+ labeled images.
              {sourceLink("https://roboflow.com/annotate", "[1]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Automation",
        values: {
          roboflow: (
            <>
              AI-assisted labeling and Auto Label workflows.
              {sourceLink("https://roboflow.com/annotate", "[2]")}
              {sourceLink("https://roboflow.com/annotate", "[4]")}
            </>
          ),
          claru: "Enrichment automation plus expert QA",
        },
      },
      {
        dimension: "Speed",
        values: {
          roboflow: (
            <>
              Label Assist claims up to 95% time reduction.
              {sourceLink("https://roboflow.com/annotate", "[3]")}
            </>
          ),
          claru: "Capture + enrichment optimized for robotics timelines",
        },
      },
      {
        dimension: "Annotation types",
        values: {
          roboflow: (
            <>
              Bounding boxes, polygons, keypoints, classification.
              {sourceLink("https://roboflow.com/annotate", "[5]")}
            </>
          ),
          claru: "Expert labeling paired with enrichment outputs",
        },
      },
      {
        dimension: "Data capture",
        values: {
          roboflow: "Annotation tool for existing data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          roboflow: "Annotation outputs and dataset tooling",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          roboflow: "Teams needing CV annotation and dataset tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Roboflow vs Claru",
    intro:
      "Roboflow focuses on CV tooling and annotation. Claru focuses on capture and enrichment for physical AI.",
    blocks: [
      {
        title: "Tooling vs pipeline",
        paragraphs: [
          "Roboflow provides dataset management and annotation tools.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Automation",
        paragraphs: [
          "Roboflow emphasizes AI-assisted labeling and Auto Label workflows.",
          "Claru automates enrichment layers like depth and pose.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Roboflow is strong when annotation tooling is the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Roboflow Is a Fit",
    competitorBullets: [
      "You need a CV platform for annotation and dataset management.",
      "You want AI-assisted labeling and auto-labeling workflows.",
      "You need tooling for bounding boxes, polygons, keypoints, and classification.",
      "You want to scale annotation with automation.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need datasets delivered in robotics-native formats.",
      "You want task-specific capture briefs for real-world behaviors.",
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
        desc: "Annotation platform vs capture-first robotics datasets.",
        href: "/compare/labelbox-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Label Studio Alternatives",
        desc: "Open-source labeling tool vs capture-first datasets.",
        href: "/compare/label-studio-alternatives",
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
      "Choose Roboflow when you need CV annotation tooling and dataset management.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Roboflow for annotation tooling, Claru for capture-first datasets.",
      "If your project requires physical data collection, prioritize providers built for capture and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Roboflow?",
        answer: (
          <>
            Roboflow provides a CV data management and annotation platform with
            AI-assisted labeling. {sourceLink("https://roboflow.com/annotate", "[2]")}
          </>
        ),
      },
      {
        question: "How large is Roboflow's dataset scale?",
        answer: (
          <>
            Roboflow highlights 750K+ datasets and 575M+ labeled images.
            {sourceLink("https://roboflow.com/annotate", "[1]")}
          </>
        ),
      },
      {
        question: "What is Label Assist?",
        answer: (
          <>
            Roboflow claims Label Assist can reduce labeling time by up to 95%.
            {sourceLink("https://roboflow.com/annotate", "[3]")}
          </>
        ),
      },
      {
        question: "What is Auto Label?",
        answer: (
          <>
            Auto Label is described as using foundation models to label
            thousands of images in minutes.
            {sourceLink("https://roboflow.com/annotate", "[4]")}
          </>
        ),
      },
      {
        question: "What annotation types does Roboflow support?",
        answer: (
          <>
            Roboflow lists bounding boxes, polygons, keypoints, and
            classification. {sourceLink("https://roboflow.com/annotate", "[5]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both Roboflow and Claru?",
        answer:
          "Some teams use Roboflow for annotation tooling and Claru for capture-first physical AI datasets.",
      },
      {
        question: "Is Roboflow a fit for robotics data capture?",
        answer:
          "Roboflow focuses on annotation tooling. Claru is better for capture-first robotics data collection and enrichment.",
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
    { label: "Roboflow Annotate", url: "https://roboflow.com/annotate" },
  ],
};
