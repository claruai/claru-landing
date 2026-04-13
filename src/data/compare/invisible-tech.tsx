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

export const invisibleTechComparison: ComparisonData = {
  slug: "invisible-tech-alternatives",
  competitor: {
    name: "Invisible Technologies",
    siteUrl: "https://www.invisible.co",
    category: "AI data services and annotation platform",
  },
  meta: {
    title: "Invisible Tech Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Invisible Technologies and Claru for physical AI training data. Invisible offers AI data services and annotation workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Invisible Tech alternative",
      "Invisible Technologies alternatives",
      "Invisible vs Claru",
      "AI data services",
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
    breadcrumbLabel: "Invisible Tech Alternatives",
    title: "Invisible Tech Alternatives: Data Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.invisible.co"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Invisible Technologies
        </a>{" "}
        offers AI data services and annotation workflows. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
    paragraphs: [
      "Invisible Technologies was founded in 2015 by Francis Pedraza and has grown into a prominent AI data services company headquartered in San Francisco. The company has raised significant venture capital and built an operations platform that combines human intelligence with AI-assisted workflows to deliver training data, content moderation, and process automation at scale. Invisible has served enterprise clients across industries including technology, finance, and healthcare, positioning itself as a partner for teams that need managed human review layered on top of automated pipelines.",
      "For physical AI teams evaluating Invisible as a potential data partner, it is important to understand that the company's core strength lies in annotation throughput and workflow orchestration rather than real-world data capture. Invisible does not operate a field collection network, does not generate egocentric video from wearable cameras, and does not produce enrichment layers like depth estimation, human pose extraction, or optical flow. Teams building robotics foundation models, embodied manipulation policies, or world models for physical simulation will find that Invisible's service model addresses downstream labeling but not the upstream capture and enrichment bottlenecks that define physical AI data pipelines.",
    ],
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Invisible provides AI data services and annotation workflows for training data teams.",
      "The company highlights scaled training data services and custom annotation setups.",
      "Invisible is a services-plus-platform model rather than a capture-first robotics pipeline.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Invisible for AI data services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Invisible Technologies Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Invisible Technologies provides data services and annotation workflows. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Invisible highlights training data services and annotation workflows for
        AI programs. {sourceLink("https://www.invisible.co/scale-training-data", "[1]")}
      </>,
      <>
        The company emphasizes custom annotation interfaces and scaled delivery
        for training data pipelines. {sourceLink("https://www.invisible.co/scale-training-data", "[2]")}
      </>,
      "If your bottleneck is scaled annotation throughput and workflow setup, Invisible is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Invisible at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Training data services and annotation workflows. {sourceLink("https://www.invisible.co/scale-training-data", "[1]")}
              </>
            ),
          },
          {
            label: "Workflow",
            value: (
              <>
                Custom annotation interface and scaled delivery. {sourceLink("https://www.invisible.co/scale-training-data", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Labeled datasets and managed annotation services",
          },
          {
            label: "Best fit",
            value: "Teams needing scaled annotation throughput",
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
        Invisible positions itself as a training data services provider. {sourceLink("https://www.invisible.co/scale-training-data", "[1]")}
      </>,
      <>
        The company highlights custom annotation interfaces and scaled delivery. {sourceLink("https://www.invisible.co/scale-training-data", "[2]")}
      </>,
      <>
        Invisible promotes a managed approach to training data pipelines. {sourceLink("https://www.invisible.co/scale-training-data", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Invisible Is Strong",
    intro:
      "Based on Invisible's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Training data services",
        description: (
          <>
            Invisible highlights training data services for AI programs. {sourceLink("https://www.invisible.co/scale-training-data", "[1]")}
          </>
        ),
      },
      {
        title: "Custom annotation workflows",
        description: (
          <>
            The platform emphasizes custom annotation interfaces. {sourceLink("https://www.invisible.co/scale-training-data", "[2]")}
          </>
        ),
      },
      {
        title: "Scaled delivery",
        description: (
          <>
            Invisible highlights scaled delivery for training data pipelines. {sourceLink("https://www.invisible.co/scale-training-data", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Invisible provides annotation services. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Invisible vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Invisible's data services model.",
    columns: [
      { key: "invisible", label: "Invisible" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          invisible: (
            <>
              Training data services and annotation workflows. {sourceLink("https://www.invisible.co/scale-training-data", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Workflow",
        values: {
          invisible: (
            <>
              Custom annotation interfaces with scaled delivery. {sourceLink("https://www.invisible.co/scale-training-data", "[2]")}
            </>
          ),
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          invisible: "Annotation services for existing data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          invisible: "Annotation workflows and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          invisible: "Teams needing scaled annotation services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Invisible vs Claru",
    intro:
      "Invisible focuses on annotation services. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Invisible provides managed annotation workflows and delivery capacity. The company operates as a services layer that sits on top of existing data, applying human intelligence to labeling, classification, and quality review tasks at scale.",
          "Claru provides capture, enrichment, and training-ready datasets. Rather than starting with customer-provided data, Claru deploys its own collector network to generate new physical-world recordings and then layers enrichment signals on top.",
        ],
      },
      {
        title: "Data ownership",
        paragraphs: [
          "Invisible assumes data already exists and focuses on labeling throughput. This works well when teams have large pools of unlabeled data but lack the internal headcount to annotate it quickly enough to keep model training pipelines fed.",
          "Claru creates new physical-world datasets tailored to robotic tasks. For teams building manipulation policies or navigation models, the bottleneck is usually the absence of task-specific video from real environments, not a shortage of annotation labor.",
        ],
      },
      {
        title: "Robotics AI readiness",
        paragraphs: [
          "Robotics foundation models like RT-2, Octo, and OpenVLA require training data that combines egocentric video with dense spatial signals such as depth maps, human pose skeletons, and optical flow fields. Invisible's annotation services can label objects and actions in existing footage, but they do not generate these spatial enrichment layers as part of the delivery pipeline.",
          "Claru produces these signals automatically during its enrichment phase, outputting per-frame depth, pose, segmentation masks, and motion vectors that align directly with the video timeline. This means physical AI teams receive datasets that are ready to ingest into training frameworks without additional preprocessing steps.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Invisible is a strong fit when annotation services are the bottleneck. If you have terabytes of unlabeled data and need classification, bounding boxes, or text labeling at high throughput, Invisible's managed workforce and automation platform can deliver reliably.",
          "Claru is better when capture and enrichment are the bottleneck. If your training pipeline is starved for real-world manipulation video, kitchen activity footage, or warehouse navigation recordings with aligned spatial signals, Claru addresses that gap directly.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Invisible Is a Fit",
    competitorBullets: [
      "You need scaled annotation services and workflow setup.",
      "You already have data and need labeling throughput.",
      "You want a managed data services partner.",
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
      "Choose Invisible when you need managed annotation services at scale.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Invisible for labeling throughput, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Invisible Technologies?",
        answer: (
          <>
            Invisible Technologies is an AI data services company founded in 2015 and headquartered in San Francisco. The company combines human intelligence with AI-assisted workflows to deliver training data, content moderation, and process automation at scale. Invisible has raised significant venture funding and serves enterprise clients across technology, finance, and healthcare verticals, positioning itself as a managed partner for teams that need annotation throughput and quality review layered onto automated pipelines. {sourceLink("https://www.invisible.co/scale-training-data", "[1]")}
          </>
        ),
      },
      {
        question: "Does Invisible provide custom annotation workflows?",
        answer: (
          <>
            Yes. Invisible highlights custom annotation interfaces and scaled delivery as core capabilities. The platform enables teams to design task-specific labeling workflows that combine automated pre-labeling with multi-stage human review, which is particularly useful for high-volume classification and tagging workloads. However, these workflows operate on customer-provided data rather than generating new physical-world captures. {sourceLink("https://www.invisible.co/scale-training-data", "[2]")}
          </>
        ),
      },
      {
        question: "Is Invisible a physical AI data provider?",
        answer:
          "Invisible focuses on annotation services rather than capture-first physical data pipelines. The company does not operate a field collection network or produce enrichment layers like depth estimation, human pose extraction, or optical flow. For teams building robotics foundation models or embodied AI systems that need egocentric video paired with spatial signals, a capture-first provider like Claru is better suited to the workflow.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. If your training pipeline requires real-world manipulation video, egocentric activity footage, or task-specific recordings with aligned depth, pose, and segmentation signals, Claru addresses that need directly. The platform handles everything from field capture through enrichment to delivery in robotics-native formats like RLDS or HDF5.",
      },
      {
        question: "Can Invisible Technologies handle robotics training data?",
        answer:
          "Invisible can annotate existing robotics-related footage with bounding boxes, classifications, or text labels. However, it does not capture new physical-world data, generate spatial enrichment layers, or deliver datasets in robotics-native training formats. Teams with robotics-specific requirements typically need a provider that covers capture and enrichment in addition to annotation.",
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
  sources: [{ label: "Invisible Training Data", url: "https://www.invisible.co/scale-training-data" }],
};
