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

export const superbAiComparison: ComparisonData = {
  slug: "superb-ai-alternatives",
  competitor: {
    name: "Superb AI",
    siteUrl: "https://superb-ai.com",
    category: "Computer vision platform for labeling, training, and deployment",
  },
  meta: {
    title: "Superb AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Superb AI and Claru for physical AI training data. Superb AI offers a CV platform with data curation, labeling automation, model training, and deployment. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Superb AI alternative",
      "Superb AI alternatives",
      "Superb AI vs Claru",
      "computer vision platform",
      "auto labeling",
      "MLOps for CV",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Superb AI Alternatives",
    title: "Superb AI Alternatives: CV Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://superb-ai.com/en/products/platform"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Superb AI
        </a>{" "}
        provides an end-to-end computer vision platform spanning data
        curation, labeling automation, model training, deployment, and
        monitoring. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    paragraphs: [
      "Superb AI was founded in 2018 in South Korea and has built an integrated computer vision platform spanning data curation, automated labeling, model training, and deployment. The company raised over $30 million in funding and differentiates itself from pure annotation tools by offering the full MLOps lifecycle for CV applications. Superb AI has attracted customers in manufacturing, autonomous driving, and retail who need to move quickly from raw image data to deployed models with automated labeling features like Auto-Edit segmentation and custom auto-labeling from as few as 100 training images.",
      "While Superb AI provides a comprehensive CV platform, it is optimized for teams that already have data and need to accelerate the label-to-deploy cycle. Robotics and embodied AI teams face a different challenge: they need to acquire physical-world demonstrations, egocentric video, and manipulation sequences from real environments before any labeling or model training can begin. Additionally, robotics models require enrichment layers like depth estimation, 3D pose reconstruction, and optical flow that go beyond what annotation platforms produce. Claru addresses this upstream gap with a capture-first pipeline designed specifically for physical AI workloads.",
    ],
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Superb Platform positions itself as an end-to-end solution from data design and collection to model training, deployment, and monitoring.",
      "Superb Curate highlights automatic key data extraction and dataset distribution visualization.",
      "Superb Label lists Auto-Edit segmentation, integrated project management, custom auto-labeling with as few as 100 images, and automatic object tracking.",
      "Superb Model emphasizes automated model training, continuous evaluation, and no-code deployment.",
      "Superb Apps highlight data processing and automated workflows to connect processes.",
      "Superb AI lists AES-256 encryption, role-based access control, and security certifications including SOC and ISO 27001.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Superb AI for CV platform tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Superb AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Superb AI provides a CV platform spanning data curation, labeling automation, and model deployment. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Superb Platform is positioned as an end-to-end solution covering data
        design, collection, processing, model training, deployment, and
        monitoring.
        {sourceLink("https://superb-ai.com/en/products/platform", "[1]")}
      </>,
      <>
        Superb Curate lists automatic key data extraction and data distribution
        visualization to prioritize what needs labeling.
        {sourceLink("https://superb-ai.com/en/products/platform", "[2]")}
      </>,
      <>
        Superb Label highlights Auto-Edit segmentation, integrated project
        management, custom auto-labeling with as few as 100 images, and
        automatic object tracking across frames.
        {sourceLink("https://superb-ai.com/en/products/platform", "[3]")}
      </>,
      <>
        Superb Model describes automated model training, continuous evaluation,
        and no-code deployments.
        {sourceLink("https://superb-ai.com/en/products/platform", "[4]")}
      </>,
      <>
        Superb Apps highlight efficient data processing and automated workflows
        that connect platform functions and external alerts.
        {sourceLink("https://superb-ai.com/en/products/platform", "[5]")}
      </>,
      <>
        Superb AI&apos;s security page notes AES-256 encryption, role-based access
        control, and global security certifications like SOC and ISO 27001.
        {sourceLink("https://superb-ai.com/en/company/security", "[6]")}
      </>,
      "If your bottleneck is CV platform tooling and automation, Superb AI is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Superb AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                End-to-end CV platform from data curation to deployment.
                {sourceLink("https://superb-ai.com/en/products/platform", "[1]")}
              </>
            ),
          },
          {
            label: "Curation",
            value: (
              <>
                Automatic key data extraction and data distribution
                visualization.
                {sourceLink("https://superb-ai.com/en/products/platform", "[2]")}
              </>
            ),
          },
          {
            label: "Labeling",
            value: (
              <>
                Auto-Edit segmentation, auto-labeling, tracking, and workflow
                management.
                {sourceLink("https://superb-ai.com/en/products/platform", "[3]")}
              </>
            ),
          },
          {
            label: "Model ops",
            value: (
              <>
                Automated training, evaluation, and no-code deployment.
                {sourceLink("https://superb-ai.com/en/products/platform", "[4]")}
              </>
            ),
          },
          {
            label: "Security",
            value: (
              <>
                AES-256 encryption, role-based access control, SOC and ISO 27001
                certifications.
                {sourceLink("https://superb-ai.com/en/company/security", "[6]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing CV platform automation and deployment",
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
        Superb Platform positions itself as an end-to-end CV platform from data
        design to deployment and monitoring.
        {sourceLink("https://superb-ai.com/en/products/platform", "[1]")}
      </>,
      <>
        Superb Curate lists automatic key data extraction and data distribution
        visualization.
        {sourceLink("https://superb-ai.com/en/products/platform", "[2]")}
      </>,
      <>
        Superb Label highlights Auto-Edit segmentation, custom auto-labeling
        with as few as 100 images, and automatic tracking across frames.
        {sourceLink("https://superb-ai.com/en/products/platform", "[3]")}
      </>,
      <>
        Superb Model describes automated training, evaluation, and no-code
        deployments.
        {sourceLink("https://superb-ai.com/en/products/platform", "[4]")}
      </>,
      <>
        Security claims include AES-256 encryption, RBAC, and SOC/ISO 27001
        certifications.
        {sourceLink("https://superb-ai.com/en/company/security", "[6]")}
      </>,
      <>
        Superb AI positions its annotation platform as infrastructure with
        automation and visibility to improve label quality and workforce
        performance.
        {sourceLink("https://info.superb-ai.com/automated-computer-vision-labeling-platform", "[7]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Superb AI Is Strong",
    intro:
      "Superb AI emphasizes an integrated CV platform with labeling automation, dataset curation, and model deployment tooling.",
    cards: [
      {
        title: "Labeling automation",
        description: (
          <>
            Auto-Edit segmentation, custom auto-labeling with as few as 100
            images, and automatic object tracking are highlighted in Superb
            Label.
            {sourceLink("https://superb-ai.com/en/products/platform", "[3]")}
          </>
        ),
      },
      {
        title: "Dataset curation",
        description: (
          <>
            Superb Curate focuses on automatic key data extraction and dataset
            distribution visualization.
            {sourceLink("https://superb-ai.com/en/products/platform", "[2]")}
          </>
        ),
      },
      {
        title: "Model deployment tooling",
        description: (
          <>
            Superb Model provides automated training, continuous evaluation, and
            no-code deployments.
            {sourceLink("https://superb-ai.com/en/products/platform", "[4]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Superb AI is a CV platform. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Superb AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on CV platform tooling versus a capture-first physical AI pipeline.",
    columns: [
      { key: "superb", label: "Superb AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          superb: (
            <>
              End-to-end CV platform spanning labeling to deployment.
              {sourceLink("https://superb-ai.com/en/products/platform", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Labeling automation",
        values: {
          superb: (
            <>
              Auto-Edit segmentation, auto-labeling, and auto-tracking.
              {sourceLink("https://superb-ai.com/en/products/platform", "[3]")}
            </>
          ),
          claru: "Capture protocols and enrichment QC built for robotics",
        },
      },
      {
        dimension: "Curation",
        values: {
          superb: (
            <>
              Automatic key data extraction and distribution visualization.
              {sourceLink("https://superb-ai.com/en/products/platform", "[2]")}
            </>
          ),
          claru: "Task-specific capture with enrichment layers",
        },
      },
      {
        dimension: "Model ops",
        values: {
          superb: (
            <>
              Automated training, evaluation, and no-code deployment.
              {sourceLink("https://superb-ai.com/en/products/platform", "[4]")}
            </>
          ),
          claru: "Robotics-ready datasets delivered for training",
        },
      },
      {
        dimension: "Best fit",
        values: {
          superb: "Teams needing CV platform automation",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Superb AI vs Claru",
    intro:
      "Superb AI emphasizes CV platform tooling. Claru emphasizes capture and enrichment for physical AI datasets.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "Superb AI delivers a platform for data curation, labeling automation, and deployment.",
          "Claru delivers capture, enrichment, and training-ready physical datasets.",
        ],
      },
      {
        title: "Automation focus",
        paragraphs: [
          "Superb AI highlights auto-labeling and auto-tracking to reduce labeling overhead.",
          "Claru emphasizes physical capture and enrichment outputs like depth and motion.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Superb AI is a fit when platform automation and model ops are the bottleneck.",
          "Claru is a fit when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Superb AI Is a Fit",
    competitorBullets: [
      "You need a CV platform with automated labeling and model deployment.",
      "You want data curation and workflow management in one system.",
      "You already have data and need to accelerate labeling throughput.",
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
        title: "SuperAnnotate Alternatives",
        desc: "Annotation platform vs physical AI data pipelines.",
        href: "/compare/superannotate-alternatives",
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
      "Choose Superb AI when you need a CV platform with labeling automation and model deployment tooling.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Superb AI for CV platform tooling, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Superb AI?",
        answer: (
          <>
            Superb AI provides an end-to-end computer vision platform spanning data curation, automated labeling, model training, and deployment. Founded in 2018 in South Korea, the company has raised over $30 million in funding and serves customers in manufacturing, autonomous driving, and retail. The platform differentiates from pure annotation tools by offering the complete MLOps lifecycle for CV applications, including automated dataset curation with distribution visualization and no-code model deployment capabilities.
            {sourceLink("https://superb-ai.com/en/products/platform", "[1]")}
          </>
        ),
      },
      {
        question: "Does Superb AI offer labeling automation?",
        answer: (
          <>
            Yes. Superb Label highlights Auto-Edit segmentation, custom auto-labeling with as few as 100 training images, and automatic object tracking across video frames. These automation features are designed to reduce the manual effort required for repetitive labeling tasks in computer vision workflows. The platform integrates labeling automation with project management tools so teams can track progress, manage quality, and coordinate annotators within the same system.
            {sourceLink("https://superb-ai.com/en/products/platform", "[3]")}
          </>
        ),
      },
      {
        question: "What security certifications does Superb AI mention?",
        answer: (
          <>
            Superb AI notes security certifications like SOC and ISO 27001, along with AES-256 encryption and role-based access control. These security measures are designed for enterprise customers who need to ensure their data annotation and model training workflows meet strict compliance requirements. The security infrastructure supports controlled access to datasets and model artifacts across team members with different permission levels.
            {sourceLink("https://superb-ai.com/en/company/security", "[6]")}
          </>
        ),
      },
      {
        question: "Can Superb AI be used for robotics data?",
        answer:
          "Superb AI can label video frames with segmentation masks and track objects across frames, which is useful for some robotics applications. However, robotics training data also requires upstream capture of physical-world demonstrations and enrichment layers like monocular depth estimation, 3D pose reconstruction, and optical flow that are computed rather than manually labeled. For teams whose primary bottleneck is acquiring new physical-world data with these enrichment signals, a capture-first provider is a better fit.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. If your team needs to acquire egocentric video, manipulation demonstrations, or task-specific sequences from real environments, and then enrich that data with depth, pose, segmentation, and optical flow layers, Claru provides the complete pipeline from physical collection through multi-layer enrichment to training-ready delivery.",
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
    { label: "Superb Platform", url: "https://superb-ai.com/en/products/platform" },
    { label: "Superb AI Security", url: "https://superb-ai.com/en/company/security" },
    { label: "Superb Annotation Platform", url: "https://info.superb-ai.com/automated-computer-vision-labeling-platform" },
  ],
};
