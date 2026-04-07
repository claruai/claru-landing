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

export const ocularComparison: ComparisonData = {
  slug: "ocular-ai-alternatives",
  competitor: {
    name: "Ocular AI",
    siteUrl: "https://www.useocular.com",
    category: "Data annotation platform",
  },
  meta: {
    title: "Ocular AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Ocular AI and Claru for physical AI training data. Ocular AI provides a data annotation platform with project management and QA workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Ocular AI alternative",
      "Ocular AI alternatives",
      "Ocular AI vs Claru",
      "data annotation platform",
      "dataset versioning",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Ocular AI Alternatives",
    title: "Ocular AI Alternatives: Annotation Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.useocular.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Ocular AI
        </a>{" "}
        provides a data annotation platform with project management and QA
        workflows. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Ocular AI provides a data annotation platform with project management and QA features.",
      "Ocular AI highlights annotation tools for computer vision use cases.",
      "Claru is purpose-built for physical AI data capture and enrichment.",
      "Choose Ocular AI when you need a labeling platform for existing data.",
      "Choose Claru when you need robotics-ready datasets captured from the physical world.",
    ],
  },
  overview: {
    title: "What Ocular AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Ocular AI is a data annotation platform. Claru is a physical AI pipeline focused on capture and enrichment for robotics.",
      <>
        Ocular AI highlights annotation tools and workflows, including project
        management, QA, and collaboration features. {" "}
        {sourceLink("https://www.useocular.com/data-labelling/annotation", "[1]")}
      </>,
      <>
        Ocular’s docs outline platform setup and workflow configuration for
        labeling projects. {sourceLink("https://docs.useocular.com/getting-started/quickstart", "[2]")}
      </>,
      "Ocular AI operates in the data annotation platform space alongside established players like Labelbox, Scale AI, and V7. The platform targets computer vision teams that need managed annotation workflows with project management, quality assurance, and collaboration features. Ocular AI is positioned as a self-serve and team-oriented labeling tool rather than a managed services provider, which makes it attractive for teams that want control over their annotation process.",
      "For physical AI and robotics teams, the fundamental question is whether annotation tooling alone addresses the data pipeline bottleneck. Embodied AI models require task-specific data captured in real-world environments, not just labels applied to existing imagery. Robotics training depends on enrichment layers such as monocular depth, human pose estimation, instance segmentation, and optical flow, all temporally aligned with the source video and delivered in formats compatible with robotics training frameworks. Annotation platforms handle the labeling step but do not provide the capture infrastructure or enrichment processing that physical AI demands.",
      "If your bottleneck is labeling existing data, Ocular AI is a strong fit. If your bottleneck is physical-world capture and robotics enrichment, you need a specialized pipeline.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Ocular AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data annotation platform with project management and QA. {" "}
                {sourceLink("https://www.useocular.com/data-labelling/annotation", "[1]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Labeled datasets and annotation workflows",
          },
          {
            label: "Best fit",
            value: "Teams that already have data and need labeling tooling",
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
        Ocular AI highlights annotation tools and workflows on its platform. {" "}
        {sourceLink("https://www.useocular.com/data-labelling/annotation", "[1]")}
      </>,
      <>
        The platform emphasizes project management and QA features. {" "}
        {sourceLink("https://www.useocular.com/data-labelling/annotation", "[2]")}
      </>,
      <>
        Ocular’s documentation details setup and project configuration for
        labeling workflows. {sourceLink("https://docs.useocular.com/getting-started/quickstart", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Ocular AI Is Strong",
    intro:
      "Based on Ocular AI’s public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Annotation tooling",
        description: (
          <>
            Ocular AI highlights annotation tools and workflows on its
            platform. {sourceLink("https://www.useocular.com/data-labelling/annotation", "[1]")}
          </>
        ),
      },
      {
        title: "Project management + QA",
        description: (
          <>
            The platform emphasizes project management and QA features. {" "}
            {sourceLink("https://www.useocular.com/data-labelling/annotation", "[2]")}
          </>
        ),
      },
      {
        title: "Developer setup",
        description: (
          <>
            Ocular’s docs cover onboarding and configuration for labeling
            projects. {sourceLink("https://docs.useocular.com/getting-started/quickstart", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics teams often need capture and enrichment of physical-world data — not just labeling tools.",
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
    title: "Ocular AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Ocular AI’s platform-first model.",
    columns: [
      { key: "ocular", label: "Ocular AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          ocular: (
            <>
              Annotation platform and workflows. {" "}
              {sourceLink("https://www.useocular.com/data-labelling/annotation", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Core output",
        values: {
          ocular: "Labeled datasets and labeling workflows",
          claru: "Training-ready physical datasets with enrichment layers",
        },
      },
      {
        dimension: "Data capture",
        values: {
          ocular: "Not positioned as capture-first",
          claru: "Collector network plus teleoperation and task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          ocular: "Annotation layers based on client schema",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          ocular: "Teams needing labeling tooling and QA workflows",
          claru: "Robotics teams needing capture + enrichment",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Ocular AI vs Claru",
    intro:
      "Ocular AI is a labeling platform. Claru is a physical AI data pipeline.",
    blocks: [
      {
        title: "Platform-first vs dataset-first",
        paragraphs: [
          "Ocular AI emphasizes tooling for labeling workflows and QA.",
          "Claru delivers training-ready datasets with capture and enrichment built in.",
        ],
      },
      {
        title: "Existing data vs new capture",
        paragraphs: [
          "Ocular AI is ideal when you already have data and need labeling tools.",
          "Claru is ideal when you need to capture new real-world data for robotics training.",
        ],
      },
      {
        title: "Robotics data requirements",
        paragraphs: [
          "Training embodied AI systems requires more than labeled images or video. Physical AI models depend on dense enrichment layers including monocular depth estimation, human pose tracking, instance segmentation, and optical flow. These signals serve as direct model inputs during training and must be generated alongside capture to ensure temporal alignment and format consistency across the dataset.",
          "Annotation platforms like Ocular AI handle the labeling step well. Claru addresses the full pipeline from capture through enrichment to delivery, generating depth, pose, and motion signals as first-class outputs alongside expert annotations in robotics-native formats.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Ocular AI is a strong fit for teams that already have data and need labeling workflows with project management and QA features. The platform provides the tooling to manage annotation teams, define schemas, and review outputs across computer vision projects.",
          "Claru is a better fit when the bottleneck is not labeling tooling but rather the absence of task-specific physical-world data and the enrichment layers needed to make it training-ready for robotics and world models.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Ocular AI Is a Fit",
    competitorBullets: [
      "You already have data and need labeling tooling.",
      "You want project management and QA workflows for annotation.",
      "You want a platform to manage labeling teams.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need new physical-world data captured for robotics tasks.",
      "Your model depends on enrichment layers like depth and motion.",
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
      "If you need labeling tooling and QA workflows, Ocular AI is designed for that scope.",
      "If you need capture and enrichment of physical-world data for robotics training, Claru is a better fit.",
      "Some teams use both: Ocular AI for labeling workflows, Claru for physical datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Ocular AI?",
        answer: (
          <>
            Ocular AI is a data annotation platform that provides tooling for labeling workflows, project management, and quality assurance. The platform targets computer vision teams that need to manage annotation projects with features for collaboration, schema definition, and review processes. Ocular AI operates in the annotation platform space alongside tools like Labelbox, V7, and Roboflow, offering a self-serve approach to data labeling.
            {sourceLink("https://www.useocular.com/data-labelling/annotation", "[1]")}
          </>
        ),
      },
      {
        question: "Does Ocular AI provide labeling workflows?",
        answer: (
          <>
            Yes. Ocular AI highlights annotation workflows and project management features as core parts of its platform. These workflows enable teams to define labeling schemas, assign tasks to annotators, manage review cycles, and track project progress. The platform is designed for teams that already have data and need organized tooling to apply labels efficiently with quality controls in place.
            {sourceLink("https://www.useocular.com/data-labelling/annotation", "[2]")}
          </>
        ),
      },
      {
        question: "Is Ocular AI a physical AI data provider?",
        answer:
          "Ocular AI focuses on labeling workflows and annotation tooling rather than capture-first physical-world data for robotics. The platform does not position itself as a data capture provider or enrichment pipeline. Teams building embodied AI systems that need task-specific video capture, enrichment layers like depth and pose estimation, and delivery in robotics-native formats should evaluate providers designed specifically for physical AI data pipelines rather than general annotation platforms.",
      },
      {
        question: "How does Ocular AI compare to Claru for robotics data?",
        answer:
          "Ocular AI provides annotation tooling for existing datasets, while Claru provides an end-to-end pipeline that starts with physical-world capture and adds enrichment layers before delivery. For robotics teams, the difference is significant: annotation platforms help you label data you already have, while capture-first providers like Claru help you collect the task-specific data your model needs in the first place, then enrich it with depth maps, pose tracks, and segmentation masks.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when your primary need is capturing new physical-world data and enriching it for robotics training. This includes scenarios where you need egocentric video from specific environments, dense enrichment layers such as monocular depth, pose estimation, segmentation, and optical flow, and delivery in robotics-native formats like WebDataset, HDF5, or RLDS. If you already have data and primarily need labeling tooling with QA workflows, Ocular AI may be the more appropriate choice.",
      },
      {
        question: "Can teams use both Ocular AI and Claru?",
        answer:
          "Yes. Some teams use annotation platforms like Ocular AI for labeling tasks on existing datasets while using Claru for capture-first physical AI data with enrichment layers. This combination works well when a team has both general annotation needs for standard computer vision projects and specialized requirements for robotics training data that demands capture in real-world environments with dense enrichment.",
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
    { label: "Ocular AI Annotation", url: "https://www.useocular.com/data-labelling/annotation" },
    { label: "Ocular Docs", url: "https://docs.useocular.com/getting-started/quickstart" },
  ],
};
