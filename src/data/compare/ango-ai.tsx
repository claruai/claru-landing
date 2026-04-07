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

export const angoAiComparison: ComparisonData = {
  slug: "ango-ai-alternatives",
  competitor: {
    name: "Ango AI",
    siteUrl: "https://ango.ai",
    category: "Data annotation platform",
  },
  meta: {
    title: "Ango AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Ango AI and Claru for physical AI training data. Ango AI provides a data annotation platform and workflow tools for AI data operations. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Ango AI alternative",
      "Ango AI alternatives",
      "Ango AI vs Claru",
      "data annotation platform",
      "AI data operations",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Ango AI Alternatives",
    title: "Ango AI Alternatives: Annotation Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://ango.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Ango AI
        </a>{" "}
        provides a data annotation platform and workflow tools. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Ango AI provides a data annotation platform and workflow tools for AI data operations.",
      "The platform highlights data labeling, workforce orchestration, and QA workflows.",
      "Ango AI positions itself around scalable data operations for AI teams.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Ango AI for annotation tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Ango AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Ango AI provides data annotation tooling. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Ango AI positions itself as a data annotation platform for AI teams.
        {sourceLink("https://ango.ai/", "[1]")}
      </>,
      <>
        The platform highlights workflows for labeling, quality control, and
        workforce orchestration. {sourceLink("https://ango.ai/", "[2]")}
      </>,
      <>
        Ango AI emphasizes scalable data operations for AI programs.
        {sourceLink("https://ango.ai/", "[3]")}
      </>,
      "Ango AI (now Ango Hub) was founded in 2020 by Gokhan Urul and Gokalp Urul, with offices in San Francisco and Ankara. The company raised 720 thousand dollars in seed funding led by 500 Global, with additional investment from QNBEYOND Ventures and e2vc. In October 2023, Ango Hub was acquired by iMerit, a larger data annotation company, bringing their annotation tooling under the iMerit umbrella.",
      "The platform provides 2D and 3D annotation tools including bounding boxes, polylines, polygons, key points, landmarks, and semantic segmentation across text, image, audio, video, and 3D sensor data. Ango Hub also features sophisticated consensus and review capabilities that allow multiple annotators to work on the same asset while calculating inter-annotator agreement. Unique tooling includes rotated bounding boxes, nested conditional questions, label relations, and table-based labeling for complex annotation tasks.",
      "For physical AI teams, Ango Hub provides capable annotation tooling that could be used to label robotics datasets. However, the platform is designed around managing and labeling existing data rather than capturing new physical-world data from scratch. Teams that need upstream data capture with wearable cameras, task-specific collection protocols, and enrichment layers like depth estimation and pose extraction will need a provider like Claru that specializes in the capture-to-delivery pipeline.",
      "If your bottleneck is annotation tooling and workflow management, Ango AI is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Ango AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data annotation platform for AI teams.
                {sourceLink("https://ango.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Workflows",
            value: (
              <>
                Labeling, QA, and workforce orchestration.
                {sourceLink("https://ango.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Positioning",
            value: (
              <>
                Scalable data operations for AI programs.
                {sourceLink("https://ango.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing annotation tooling and workflow control",
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
        Ango AI provides a data annotation platform for AI teams.
        {sourceLink("https://ango.ai/", "[1]")}
      </>,
      <>
        The platform highlights labeling, QA, and workforce orchestration.
        {sourceLink("https://ango.ai/", "[2]")}
      </>,
      <>
        Ango AI emphasizes scalable data operations.
        {sourceLink("https://ango.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Ango AI Is Strong",
    intro:
      "Based on Ango AI's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Annotation tooling",
        description: (
          <>
            Ango AI positions itself as a data annotation platform.
            {sourceLink("https://ango.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Workflow control",
        description: (
          <>
            The platform highlights labeling and QA workflow orchestration.
            {sourceLink("https://ango.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Scalable operations",
        description: (
          <>
            Ango AI emphasizes scalable data operations for AI programs.
            {sourceLink("https://ango.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Ango AI provides annotation tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of only providing labeling tools.",
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
    title: "Ango AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Ango AI's tooling focus.",
    columns: [
      { key: "ango", label: "Ango AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          ango: (
            <>
              Data annotation platform for AI teams.
              {sourceLink("https://ango.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Workflow",
        values: {
          ango: (
            <>
              Labeling, QA, and workforce orchestration.
              {sourceLink("https://ango.ai/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Data capture",
        values: {
          ango: "Manage and label existing datasets",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          ango: "Annotation and QA workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          ango: "Teams needing annotation tooling and workflow control",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Ango AI vs Claru",
    intro:
      "Ango AI specializes in annotation tooling. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Tooling vs pipeline",
        paragraphs: [
          "Ango AI delivers annotation tooling and workflow management.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Ango AI assumes teams already have data to label.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Ango AI is strong when annotation workflow management is the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Ango AI Is a Fit",
    competitorBullets: [
      "You need a data annotation platform with workflow control.",
      "You already have data and need QA and workforce management.",
      "You want scalable data operations tooling.",
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
      "Choose Ango AI when you need annotation tooling and workflow management.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Ango AI for tooling, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Ango AI?",
        answer: (
          <>
            Ango AI, now operating as Ango Hub under iMerit, is a data annotation platform founded in 2020 by Gokhan and Gokalp Urul. The company raised seed funding led by 500 Global and was acquired by iMerit in October 2023. The platform provides 2D and 3D annotation tools including bounding boxes, polylines, polygons, key points, and semantic segmentation across text, image, audio, video, and 3D sensor data.{" "}
            {sourceLink("https://ango.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What workflows does Ango AI support?",
        answer: (
          <>
            The platform supports labeling, quality assurance, and workforce orchestration workflows. It features sophisticated consensus and review capabilities that allow multiple annotators to work on the same asset while calculating inter-annotator agreement. Unique tooling includes rotated bounding boxes, unlimited conditional nested questions, label relations, and table-based labeling for complex annotation tasks. The platform can handle point cloud frames with substantial data volumes.{" "}
            {sourceLink("https://ango.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Was Ango AI acquired?",
        answer:
          "Yes. Ango Hub was acquired by iMerit in October 2023. iMerit is a larger data annotation company, and the acquisition brought Ango Hub's annotation tooling under the iMerit umbrella. This gives Ango Hub access to iMerit's managed workforce and enterprise relationships while maintaining its platform capabilities.",
      },
      {
        question: "Is Ango AI focused on data operations?",
        answer: (
          <>
            Ango AI emphasizes scalable data operations for AI programs, including support for 3D sensor data annotation. The platform is designed around managing and labeling existing data rather than capturing new physical-world data. For teams that already have raw data and need powerful annotation tooling with quality control workflows, Ango Hub is a strong option. For teams that need upstream data capture, a different provider is needed.{" "}
            {sourceLink("https://ango.ai/", "[3]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need the full pipeline from physical-world data capture through enrichment and delivery of robotics-ready datasets. If your team does not yet have raw data and needs to create it from scratch with wearable cameras, task-specific collection protocols, and enrichment layers like depth, pose, and optical flow, Claru is designed for that workflow.",
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
    { label: "Ango AI", url: "https://ango.ai/" },
  ],
};
