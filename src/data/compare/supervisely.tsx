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

export const superviselyComparison: ComparisonData = {
  slug: "supervisely-alternatives",
  competitor: {
    name: "Supervisely",
    siteUrl: "https://supervisely.com",
    category: "Computer vision annotation and model development platform",
  },
  meta: {
    title: "Supervisely Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Supervisely and Claru for physical AI training data. Supervisely offers a computer vision platform with labeling toolboxes for images, video, LiDAR/3D point clouds, and DICOM, plus AI-assisted labeling, data management, QA, and model training. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Supervisely alternative",
      "Supervisely alternatives",
      "Supervisely vs Claru",
      "computer vision annotation",
      "LiDAR annotation",
      "DICOM labeling",
      "AI-assisted labeling",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Supervisely Alternatives",
    title: "Supervisely Alternatives: CV Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://supervisely.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Supervisely
        </a>{" "}
        positions itself as an all-in-one computer vision platform with labeling
        toolboxes for images, video, LiDAR/3D point clouds, and DICOM, plus
        AI-assisted labeling, data management, QA, and model training. If you
        need physical-world capture and enrichment for robotics, Claru is built
        for physical AI from day one.
      </>
    ),
    paragraphs: [
      "Supervisely has been operating since 2017 as an end-to-end computer vision platform that covers annotation, data management, neural network training, and deployment. The platform distinguishes itself from lighter-weight annotation tools by supporting complex modalities including LiDAR/3D point cloud sensor fusion and DICOM volumetric medical imaging alongside standard image and video labeling. Supervisely offers both cloud and self-hosted enterprise deployment options, making it attractive to organizations in autonomous driving, healthcare, and agriculture that require on-premise data handling for regulatory or security reasons.",
      "While Supervisely provides strong tooling for annotating existing datasets across multiple modalities, it does not address the upstream challenge of acquiring new physical-world data for robotics training. Embodied AI systems require task-specific capture programs that produce egocentric video, manipulation demonstrations, and human activity sequences from diverse real-world environments. These datasets must then be enriched with depth estimation, human pose detection, optical flow, and temporal action segmentation before they are suitable for training policies. Supervisely can process data after collection, but Claru provides the complete capture-to-delivery pipeline that physical AI teams need.",
    ],
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Supervisely offers labeling toolboxes for images, videos, LiDAR/3D point clouds, and DICOM datasets.",
      "It highlights labeling automation with AI-assisted labeling and custom labeling UIs.",
      "The platform includes data management, quality assurance, user collaboration, and security controls.",
      "Supervisely also promotes model workflows like train, serve, and apply.",
      "An on-premise Enterprise option and a self-hosted deployment model are marketed for scale.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Supervisely for CV platform tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Supervisely Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Supervisely provides a computer vision platform for annotation and model workflows. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Supervisely lists labeling toolboxes for image labeling, video labeling,
        3D clouds/LiDAR sensor fusion, and DICOM/volumetric medical scans.
        {sourceLink("https://supervisely.com/", "[1]")}
      </>,
      <>
        The platform highlights labeling automation, including AI-assisted
        labeling and custom labeling UIs. {sourceLink("https://supervisely.com/", "[2]")}
      </>,
      <>
        Supervisely emphasizes data management, quality assurance, user
        collaboration, and security/permissions. {sourceLink("https://supervisely.com/", "[3]")}
      </>,
      <>
        It also lists neural network workflows like train, serve, and apply.
        {sourceLink("https://supervisely.com/", "[4]")}
      </>,
      <>
        Supervisely advertises an on-premise Enterprise edition and describes
        cloud and self-hosted deployment options. {sourceLink("https://supervisely.com/", "[5]")}
      </>,
      "If your bottleneck is annotation tooling and CV platform management, Supervisely is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Supervisely at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                CV platform with labeling toolboxes and model workflows.
                {sourceLink("https://supervisely.com/", "[1]")}
                {sourceLink("https://supervisely.com/", "[4]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Images, video, LiDAR/3D point clouds, DICOM.
                {sourceLink("https://supervisely.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Automation",
            value: (
              <>
                AI-assisted labeling and custom labeling UIs.
                {sourceLink("https://supervisely.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Operations",
            value: (
              <>
                Data management, QA, collaboration, security.
                {sourceLink("https://supervisely.com/", "[3]")}
              </>
            ),
          },
          {
            label: "Deployment",
            value: (
              <>
                Enterprise edition with cloud and self-hosted options.
                {sourceLink("https://supervisely.com/", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing CV annotation and model tooling",
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
        Supervisely supports labeling toolboxes for images, video, LiDAR/3D point
        clouds, and DICOM datasets. {sourceLink("https://supervisely.com/", "[1]")}
      </>,
      <>
        The platform highlights AI-assisted labeling and custom labeling UIs.
        {sourceLink("https://supervisely.com/", "[2]")}
      </>,
      <>
        Supervisely lists data management, QA, collaboration, and
        security/permissions. {sourceLink("https://supervisely.com/", "[3]")}
      </>,
      <>
        Supervisely highlights train, serve, and apply neural network workflows.
        {sourceLink("https://supervisely.com/", "[4]")}
      </>,
      <>
        Enterprise edition includes on-premise and self-hosted deployment
        options. {sourceLink("https://supervisely.com/", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Supervisely Is Strong",
    intro:
      "Based on Supervisely's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Multi-modal annotation",
        description: (
          <>
            Supervisely supports images, video, LiDAR/3D point cloud, and DICOM
            workflows. {sourceLink("https://supervisely.com/", "[1]")}
          </>
        ),
      },
      {
        title: "AI-assisted labeling",
        description: (
          <>
            The platform highlights AI-assisted labeling and automation.
            {sourceLink("https://supervisely.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Operations and QA",
        description: (
          <>
            Data management, QA, collaboration, and security controls are
            included. {sourceLink("https://supervisely.com/", "[3]")}
          </>
        ),
      },
      {
        title: "Model workflows",
        description: (
          <>
            Supervisely lists train, serve, and apply neural network workflows.
            {sourceLink("https://supervisely.com/", "[4]")}
          </>
        ),
      },
      {
        title: "Enterprise deployment",
        description: (
          <>
            Enterprise edition includes cloud and self-hosted options.
            {sourceLink("https://supervisely.com/", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Supervisely provides annotation and model tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Supervisely vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Supervisely's platform strengths.",
    columns: [
      { key: "supervisely", label: "Supervisely" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          supervisely: (
            <>
              CV platform for annotation and model workflows.
              {sourceLink("https://supervisely.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          supervisely: (
            <>
              Images, video, LiDAR/3D point clouds, DICOM.
              {sourceLink("https://supervisely.com/", "[1]")}
            </>
          ),
          claru: "Egocentric video, depth, pose, and multi-sensor data",
        },
      },
      {
        dimension: "Automation",
        values: {
          supervisely: (
            <>
              AI-assisted labeling and custom labeling UIs.
              {sourceLink("https://supervisely.com/", "[2]")}
            </>
          ),
          claru: "Enrichment automation plus expert QA",
        },
      },
      {
        dimension: "Operations",
        values: {
          supervisely: (
            <>
              Data management, QA, collaboration, and security.
              {sourceLink("https://supervisely.com/", "[3]")}
            </>
          ),
          claru: "Capture operations and enrichment pipelines",
        },
      },
      {
        dimension: "Model workflows",
        values: {
          supervisely: (
            <>
              Train, serve, and apply neural network workflows.
              {sourceLink("https://supervisely.com/", "[4]")}
            </>
          ),
          claru: "Robotics-ready datasets delivered to your stack",
        },
      },
      {
        dimension: "Deployment",
        values: {
          supervisely: (
            <>
              Enterprise edition with cloud and self-hosted options.
              {sourceLink("https://supervisely.com/", "[5]")}
            </>
          ),
          claru: "Secure dataset delivery to your storage or pipelines",
        },
      },
      {
        dimension: "Data capture",
        values: {
          supervisely: "Platform tooling for existing data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Best fit",
        values: {
          supervisely: "Teams needing CV annotation and model tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Supervisely vs Claru",
    intro:
      "Supervisely focuses on tooling for annotation and model workflows. Claru focuses on capture and enrichment.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "Supervisely provides labeling toolboxes and model workflows.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Automation",
        paragraphs: [
          "Supervisely emphasizes AI-assisted labeling and custom labeling UIs.",
          "Claru automates enrichment layers like depth and pose.",
        ],
      },
      {
        title: "Operations",
        paragraphs: [
          "Supervisely includes data management, QA, and collaboration tools.",
          "Claru includes capture operations and dataset delivery pipelines.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Supervisely is strong when CV platform tooling is the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Supervisely Is a Fit",
    competitorBullets: [
      "You need a CV platform with labeling toolboxes for multiple modalities.",
      "You want AI-assisted labeling and custom labeling UI automation.",
      "You need data management, QA, collaboration, and security controls.",
      "You want integrated model workflows like train, serve, and apply.",
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
        title: "Appen Alternatives",
        desc: "Managed labeling services vs capture-first robotics datasets.",
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
      "Choose Supervisely when you need a CV platform for annotation, QA, and model workflows.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Supervisely for tooling, Claru for capture-first datasets.",
      "If your project requires task-specific physical data collection, prioritize providers built for capture and enrichment.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Supervisely?",
        answer: (
          <>
            Supervisely is an end-to-end computer vision platform offering labeling toolboxes and model workflows across modalities. Operating since 2017, the platform covers annotation, data management, neural network training, and deployment. Supervisely supports complex data types including LiDAR/3D point cloud sensor fusion and DICOM volumetric medical imaging, making it suitable for teams in autonomous driving, healthcare, and agriculture who need to annotate specialized datasets.
            {sourceLink("https://supervisely.com/", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does Supervisely support?",
        answer: (
          <>
            Supervisely lists images, video, LiDAR/3D point clouds, and DICOM datasets. The image labeling toolbox supports standard annotation types including bounding boxes, polygons, and segmentation masks. The LiDAR/3D toolbox enables sensor fusion workflows where point cloud data is combined with camera images for autonomous driving and robotics perception tasks. DICOM support handles volumetric medical scans with specialized viewing and annotation tools.
            {sourceLink("https://supervisely.com/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Supervisely offer AI-assisted labeling?",
        answer: (
          <>
            Supervisely highlights AI-assisted labeling and custom labeling UIs as part of its automation capabilities. AI-assisted features can pre-label data to reduce manual effort, and the platform supports building custom labeling interfaces tailored to specific project requirements. These automation features help teams scale annotation throughput for large datasets, though they operate on existing data rather than generating new enrichment layers like depth estimation or optical flow.
            {sourceLink("https://supervisely.com/", "[2]")}
          </>
        ),
      },
      {
        question: "What operational features does Supervisely include?",
        answer: (
          <>
            The platform includes data management, quality assurance, collaboration, and security controls. Data management handles dataset versioning, organization, and storage. QA features include review workflows, consensus scoring, and annotation validation. Collaboration tools enable teams to coordinate across annotators, reviewers, and project managers with role-based permissions and activity tracking.
            {sourceLink("https://supervisely.com/", "[3]")}
          </>
        ),
      },
      {
        question: "Does Supervisely support model workflows?",
        answer: (
          <>
            Supervisely lists train, serve, and apply neural network workflows that allow teams to train models on annotated data, deploy them for inference, and apply predictions back to datasets for iterative improvement. This closed-loop approach supports active learning where model predictions guide the selection of data that most needs human annotation, improving labeling efficiency over time.
            {sourceLink("https://supervisely.com/", "[4]")}
          </>
        ),
      },
      {
        question: "Is there an on-premise option?",
        answer: (
          <>
            Supervisely advertises an on-premise Enterprise edition and self-hosted deployment options. This is important for organizations in regulated industries or with strict data sovereignty requirements who cannot send sensitive data to cloud services. The self-hosted option gives teams full control over their data and infrastructure while still accessing the platform annotation and model training features.
            {sourceLink("https://supervisely.com/", "[5]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. If your primary bottleneck is acquiring new physical-world data with task-specific demonstrations, egocentric perspectives, and enrichment layers like depth estimation, pose detection, and optical flow, Claru provides the end-to-end pipeline from physical collection through enrichment to training-ready delivery.",
      },
      {
        question: "Can teams use both Supervisely and Claru?",
        answer:
          "Some teams use Supervisely for annotation tooling and Claru for capture-first physical AI datasets. In this workflow, Claru handles the upstream capture and enrichment pipeline to produce data with depth, pose, and motion layers, while Supervisely can provide additional annotation workflows for specific labeling tasks that require human judgment beyond what enrichment pipelines produce automatically.",
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
    { label: "Supervisely", url: "https://supervisely.com/" },
  ],
};
