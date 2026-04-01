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

export const clarifaiComparison: ComparisonData = {
  slug: "clarifai-alternatives",
  competitor: {
    name: "Clarifai",
    siteUrl: "https://www.clarifai.com",
    category: "Enterprise AI platform for computer vision",
  },
  meta: {
    title: "Clarifai Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Clarifai and Claru for physical AI training data. Clarifai provides a computer vision platform with image recognition, video analysis, OCR, and automated data labeling. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Clarifai alternative",
      "Clarifai alternatives",
      "Clarifai vs Claru",
      "computer vision platform",
      "automated data labeling",
      "video analysis",
      "OCR",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Clarifai Alternatives",
    title: "Clarifai Alternatives: AI Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.clarifai.com/computer-vision"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Clarifai
        </a>{" "}
        is a computer vision platform for image recognition, video analysis,
        OCR, and data labeling workflows. If you need physical-world capture and
        multi-layer enrichment for robotics, Claru is built for physical AI from
        day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Clarifai provides a computer vision platform for image recognition, video analysis, and OCR.",
      "It offers data labeling tools, including automated and AI-assisted labeling.",
      "Auto-annotation supports classification, bounding boxes, polygons, and text tasks.",
      "Clarifai supports hybrid deployment options like Local Runners on private hardware.",
      "Enterprise compute orchestration includes self-managed VPC, on-prem, and full platform deployments.",
      "Claru is purpose-built for physical AI capture, enrichment, and robotics-ready delivery.",
      "Choose Clarifai for AI platform tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Clarifai Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Clarifai is an AI platform for computer vision. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Clarifai highlights computer vision capabilities such as image
        recognition, video content analysis, OCR, and data labeling tools.
        {sourceLink("https://www.clarifai.com/computer-vision", "[1]")}
      </>,
      <>
        Its video analysis tooling applies classification, detection, and
        segmentation across video and supports tracking objects across frames.
        {sourceLink("https://www.clarifai.com/computer-vision", "[2]")}
      </>,
      <>
        Clarifai also promotes OCR workflows that turn text in images into
        machine-encoded text and can be chained in workflow graphs.
        {sourceLink("https://www.clarifai.com/computer-vision", "[3]")}
      </>,
      <>
        For labeling, Clarifai documents auto-annotation that supports
        classification, bounding boxes, polygons for images, and text data.
        {sourceLink("https://docs.clarifai.com/create/labeling/ui/tasks/auto/", "[4]")}
      </>,
      <>
        Clarifai markets automated data labeling with AI models and human
        review, plus support for imagery, video, and text formats.
        {sourceLink("https://www.clarifai.com/products/automated-data-labeling", "[5]")}
      </>,
      <>
        Clarifai Local Runners let teams run models on local machines, on-prem
        servers, or private cloud clusters while connecting to the Clarifai
        platform. {sourceLink("https://docs.clarifai.com/compute/local-runners/", "[6]")}
      </>,
      <>
        For enterprise deployments, Clarifai documents options like
        self-managed VPC, on-premises, and full platform deployment,
        including air-gapped setups. {sourceLink("https://docs.clarifai.com/compute/overview/", "[7]")}
      </>,
      "If your bottleneck is AI platform tooling and labeling workflows, Clarifai is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Clarifai at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Computer vision platform for image, video, OCR, and labeling.
                {sourceLink("https://www.clarifai.com/computer-vision", "[1]")}
              </>
            ),
          },
          {
            label: "Labeling",
            value: (
              <>
                Auto-annotation and AI-assisted labeling with human review.
                {sourceLink("https://docs.clarifai.com/create/labeling/ui/tasks/auto/", "[4]")}
                {sourceLink("https://www.clarifai.com/products/automated-data-labeling", "[5]")}
              </>
            ),
          },
          {
            label: "Deployment",
            value: (
              <>
                Local Runners on private hardware and enterprise compute
                orchestration options.
                {sourceLink("https://docs.clarifai.com/compute/local-runners/", "[6]")}
                {sourceLink("https://docs.clarifai.com/compute/overview/", "[7]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing AI platform tooling and labeling workflows",
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
        Clarifai provides computer vision tooling for image recognition, video
        analysis, OCR, and labeling workflows.
        {sourceLink("https://www.clarifai.com/computer-vision", "[1]")}
      </>,
      <>
        Auto-annotation supports classification, bounding boxes, polygons, and
        text data. {sourceLink("https://docs.clarifai.com/create/labeling/ui/tasks/auto/", "[4]")}
      </>,
      <>
        Clarifai markets automated data labeling with AI models and human
        review. {sourceLink("https://www.clarifai.com/products/automated-data-labeling", "[5]")}
      </>,
      <>
        Local Runners enable running models on local or on-prem hardware while
        connecting to Clarifai. {sourceLink("https://docs.clarifai.com/compute/local-runners/", "[6]")}
      </>,
      <>
        Enterprise deployments include self-managed VPC, on-premises, and full
        platform deployment options. {sourceLink("https://docs.clarifai.com/compute/overview/", "[7]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Clarifai Is Strong",
    intro:
      "Based on Clarifai's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Computer vision + video analysis",
        description: (
          <>
            Clarifai highlights image recognition, video analysis, and OCR
            workflows. {sourceLink("https://www.clarifai.com/computer-vision", "[1]")}
          </>
        ),
      },
      {
        title: "Auto-annotation for labeling",
        description: (
          <>
            Auto-annotation supports classification, bounding boxes, polygons,
            and text data. {sourceLink("https://docs.clarifai.com/create/labeling/ui/tasks/auto/", "[4]")}
          </>
        ),
      },
      {
        title: "AI-assisted labeling services",
        description: (
          <>
            Clarifai markets automated data labeling with AI models and human
            review. {sourceLink("https://www.clarifai.com/products/automated-data-labeling", "[5]")}
          </>
        ),
      },
      {
        title: "Hybrid deployment options",
        description: (
          <>
            Local Runners enable model execution on local or private hardware.
            {sourceLink("https://docs.clarifai.com/compute/local-runners/", "[6]")}
          </>
        ),
      },
      {
        title: "Enterprise compute orchestration",
        description: (
          <>
            Clarifai documents self-managed VPC, on-prem, and full platform
            deployment options. {sourceLink("https://docs.clarifai.com/compute/overview/", "[7]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Clarifai provides AI platform tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of focusing only on software tooling.",
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
    title: "Clarifai vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Clarifai's AI platform strengths.",
    columns: [
      { key: "clarifai", label: "Clarifai" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          clarifai: (
            <>
              Computer vision platform for analysis and labeling.
              {sourceLink("https://www.clarifai.com/computer-vision", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Core workflows",
        values: {
          clarifai: (
            <>
              Image recognition, video analysis, OCR, and labeling tools.
              {sourceLink("https://www.clarifai.com/computer-vision", "[1]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Labeling approach",
        values: {
          clarifai: (
            <>
              Auto-annotation plus AI-assisted labeling with human review.
              {sourceLink("https://docs.clarifai.com/create/labeling/ui/tasks/auto/", "[4]")}
              {sourceLink("https://www.clarifai.com/products/automated-data-labeling", "[5]")}
            </>
          ),
          claru: "Expert labeling paired with enrichment outputs",
        },
      },
      {
        dimension: "Deployment",
        values: {
          clarifai: (
            <>
              Local Runners plus self-managed VPC and on-prem deployment options.
              {sourceLink("https://docs.clarifai.com/compute/local-runners/", "[6]")}
              {sourceLink("https://docs.clarifai.com/compute/overview/", "[7]")}
            </>
          ),
          claru: "Secure dataset delivery to your storage or pipelines",
        },
      },
      {
        dimension: "Data capture",
        values: {
          clarifai: "Platform tooling for existing data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          clarifai: "Labeling outputs and model inference",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          clarifai: "Teams needing AI platform tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Clarifai vs Claru",
    intro:
      "Clarifai specializes in AI platform tooling. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "Clarifai provides tooling for model inference, labeling, and workflow management.",
          "Claru provides capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Labeling and automation",
        paragraphs: [
          "Clarifai supports auto-annotation and AI-assisted labeling workflows.",
          "Claru pairs expert annotation with depth, pose, and motion enrichment.",
        ],
      },
      {
        title: "Deployment and governance",
        paragraphs: [
          "Clarifai offers local runners and enterprise deployment options for compute control.",
          "Claru focuses on secure dataset delivery and lifecycle support.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Clarifai assumes teams already have data to analyze and label.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Clarifai Is a Fit",
    competitorBullets: [
      "You need a computer vision platform for image, video, and OCR workflows.",
      "You want auto-annotation and AI-assisted labeling tools.",
      "You plan to run models on local or private infrastructure.",
      "You need enterprise deployment options like VPC or on-prem.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need datasets delivered in robotics-native formats.",
      "You want a capture partner that can design task-specific collection.",
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
      "Choose Clarifai when you need a computer vision platform with labeling, OCR, and video analysis workflows.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Clarifai for AI platform tooling and model operations, Claru for capture-first datasets.",
      "If your project starts with physical-world data capture, prioritize providers built for collection and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Clarifai?",
        answer: (
          <>
            Clarifai is a computer vision platform offering image recognition,
            video analysis, OCR, and labeling tools.
            {sourceLink("https://www.clarifai.com/computer-vision", "[1]")}
          </>
        ),
      },
      {
        question: "Does Clarifai support video analysis?",
        answer: (
          <>
            Clarifai documents video analysis that applies classification,
            detection, and segmentation across video.
            {sourceLink("https://www.clarifai.com/computer-vision", "[2]")}
          </>
        ),
      },
      {
        question: "Does Clarifai provide OCR?",
        answer: (
          <>
            Clarifai highlights OCR workflows that transform text in images into
            machine-encoded text.
            {sourceLink("https://www.clarifai.com/computer-vision", "[3]")}
          </>
        ),
      },
      {
        question: "Does Clarifai offer automated data labeling?",
        answer: (
          <>
            Clarifai markets automated data labeling with AI models and human
            review. {sourceLink("https://www.clarifai.com/products/automated-data-labeling", "[5]")}
          </>
        ),
      },
      {
        question: "What label types does Clarifai auto-annotation support?",
        answer: (
          <>
            Clarifai documents auto-annotation support for classification,
            bounding boxes, polygons for images, and text data.
            {sourceLink("https://docs.clarifai.com/create/labeling/ui/tasks/auto/", "[4]")}
          </>
        ),
      },
      {
        question: "Can Clarifai run on on-prem or private hardware?",
        answer: (
          <>
            Clarifai Local Runners allow models to run on local machines,
            on-prem servers, or private cloud clusters while connecting to the
            Clarifai platform.
            {sourceLink("https://docs.clarifai.com/compute/local-runners/", "[6]")}
          </>
        ),
      },
      {
        question: "What enterprise deployment options does Clarifai offer?",
        answer: (
          <>
            Clarifai documents self-managed VPC, on-premises, and full platform
            deployments including air-gapped environments.
            {sourceLink("https://docs.clarifai.com/compute/overview/", "[7]")}
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
    { label: "Clarifai Computer Vision", url: "https://www.clarifai.com/computer-vision" },
    { label: "Clarifai Auto-Annotation", url: "https://docs.clarifai.com/create/labeling/ui/tasks/auto/" },
    { label: "Clarifai Automated Data Labeling", url: "https://www.clarifai.com/products/automated-data-labeling" },
    { label: "Clarifai Local Runners", url: "https://docs.clarifai.com/compute/local-runners/" },
    { label: "Clarifai Compute Orchestration", url: "https://docs.clarifai.com/compute/overview/" },
  ],
};
