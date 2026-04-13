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

export const samasourceComparison: ComparisonData = {
  slug: "samasource-alternatives",
  competitor: {
    name: "Sama",
    siteUrl: "https://www.sama.com",
    category: "Managed data annotation services",
  },
  meta: {
    title: "Samasource Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Sama (Samasource) and Claru for physical AI training data. Sama provides managed data annotation, validation, and model evaluation services across modalities. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Samasource alternative",
      "Samasource alternatives",
      "Sama vs Claru",
      "data annotation services",
      "data validation",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Samasource Alternatives",
    title: "Samasource Alternatives: Annotation Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.sama.com/data-annotation-solution"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Sama
        </a>{" "}
        provides managed data annotation, validation, and model evaluation
        services across modalities. If you need physical-world capture and
        enrichment for robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Sama provides managed data annotation, validation, and model evaluation services.",
      "Services cover image, video, 3D point cloud, and text annotation workflows.",
      "Sama emphasizes human-in-the-loop quality and managed delivery.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Sama for annotation services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Sama Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Sama provides managed annotation and evaluation services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Sama highlights data annotation services along with data validation and
        model evaluation. {sourceLink("https://www.sama.com/data-annotation-solution", "[1]")}
      </>,
      <>
        The company supports multiple modalities, including image, video, 3D
        point cloud, and text annotation. {sourceLink("https://www.sama.com/data-annotation-solution", "[2]")}
      </>,
      <>
        Sama positions its workflows around human-in-the-loop quality and
        managed delivery. {sourceLink("https://www.sama.com/data-annotation-solution", "[3]")}
      </>,
      "Sama, formerly known as Samasource, was founded in 2008 as a social enterprise providing digital work to marginalized communities in East Africa. The company has since evolved into a significant managed data annotation provider, serving major technology companies including Google, Microsoft, and Meta. Sama has built a workforce of thousands of trained annotators and emphasizes ethical sourcing practices alongside enterprise-grade delivery. The company is publicly traded on the Toronto Stock Exchange and positions itself as a premium managed services provider with strong compliance and quality standards.",
      "For physical AI and robotics teams, the key consideration when evaluating Sama is whether managed annotation services address the full data pipeline requirement. Embodied AI models need task-specific data captured in real-world environments with dense enrichment layers like depth estimation, pose tracking, instance segmentation, and optical flow. These signals serve as direct training inputs and must be temporally aligned with the source video. Managed annotation providers can label existing data but typically do not provide the capture infrastructure and enrichment processing that physical AI training demands.",
      "If your bottleneck is annotation services and QA, Sama is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Sama at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Managed data annotation, validation, and evaluation services.
                {sourceLink("https://www.sama.com/data-annotation-solution", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Image, video, 3D point cloud, and text annotation.
                {sourceLink("https://www.sama.com/data-annotation-solution", "[2]")}
              </>
            ),
          },
          {
            label: "Delivery",
            value: (
              <>
                Human-in-the-loop quality and managed services.
                {sourceLink("https://www.sama.com/data-annotation-solution", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing managed annotation and validation services",
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
        Sama provides data annotation services plus validation and model
        evaluation. {sourceLink("https://www.sama.com/data-annotation-solution", "[1]")}
      </>,
      <>
        Sama supports image, video, 3D point cloud, and text annotation.
        {sourceLink("https://www.sama.com/data-annotation-solution", "[2]")}
      </>,
      <>
        Sama emphasizes managed delivery and human-in-the-loop quality.
        {sourceLink("https://www.sama.com/data-annotation-solution", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Sama Is Strong",
    intro:
      "Based on Sama's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Managed annotation services",
        description: (
          <>
            Sama highlights managed data annotation and validation services.
            {sourceLink("https://www.sama.com/data-annotation-solution", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            The platform supports image, video, 3D point cloud, and text
            annotation workflows. {sourceLink("https://www.sama.com/data-annotation-solution", "[2]")}
          </>
        ),
      },
      {
        title: "Human-in-the-loop QA",
        description: (
          <>
            Sama emphasizes human-in-the-loop quality and managed delivery.
            {sourceLink("https://www.sama.com/data-annotation-solution", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Sama provides annotation services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on existing datasets.",
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
    title: "Sama vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Sama's annotation services model.",
    columns: [
      { key: "sama", label: "Sama" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          sama: (
            <>
              Managed annotation, validation, and model evaluation services.
              {sourceLink("https://www.sama.com/data-annotation-solution", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          sama: (
            <>
              Image, video, 3D point cloud, and text annotation.
              {sourceLink("https://www.sama.com/data-annotation-solution", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Capture model",
        values: {
          sama: "Managed labeling services and QA workflows",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          sama: "Annotation and validation workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          sama: "Teams needing managed annotation and validation services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Sama vs Claru",
    intro:
      "Sama specializes in annotation services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Sama delivers managed annotation, validation, and evaluation services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Sama helps teams label existing data across modalities.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Sama is strong when you need large-scale annotation and QA.",
          "Claru is stronger when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Sama Is a Fit",
    competitorBullets: [
      "You need managed annotation and validation services across modalities.",
      "You already have data and need labeling throughput and QA.",
      "You want human-in-the-loop quality workflows.",
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
      "Choose Sama when you need managed annotation, validation, and evaluation services.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Sama for labeling services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Sama?",
        answer: (
          <>
            Sama, formerly known as Samasource, is a managed data annotation provider founded in 2008. Originally a social enterprise providing digital work opportunities in East Africa, Sama has evolved into an enterprise-grade annotation services company serving major technology clients including Google, Microsoft, and Meta. The company provides managed data annotation, validation, and model evaluation services across image, video, 3D point cloud, and text modalities, with a strong emphasis on ethical sourcing and quality standards.
            {sourceLink("https://www.sama.com/data-annotation-solution", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does Sama support?",
        answer: (
          <>
            Sama supports image, video, 3D point cloud, and text annotation as part of its managed services portfolio. This multi-modal coverage enables enterprise teams to consolidate annotation work with a single provider across different data types. For physical AI teams, the key consideration is whether annotation services for these modalities are sufficient or whether task-specific capture and enrichment layers like depth estimation and pose tracking are also needed.
            {sourceLink("https://www.sama.com/data-annotation-solution", "[2]")}
          </>
        ),
      },
      {
        question: "Does Sama emphasize human-in-the-loop QA?",
        answer: (
          <>
            Yes. Sama positions its workflows around human-in-the-loop quality and managed delivery. The company has built quality assurance processes across its annotation workforce, with multiple review stages and consistency checks designed to maintain label accuracy at scale. This emphasis on QA is particularly important for enterprise clients with strict accuracy requirements for production AI systems.
            {sourceLink("https://www.sama.com/data-annotation-solution", "[3]")}
          </>
        ),
      },
      {
        question: "Is Sama a fit for robotics data capture?",
        answer:
          "Sama focuses on managed annotation services rather than capture-first physical AI data. While the company can annotate video and 3D point cloud data, it does not position itself as a data capture pipeline for robotics training. Teams building embodied AI systems that need task-specific video capture in real-world environments, enrichment layers like depth and pose estimation, and delivery in robotics-native formats should evaluate providers designed specifically for physical AI data pipelines.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when your primary need is capturing new physical-world data and enriching it for robotics training. This includes scenarios where you need egocentric video from specific environments, enrichment layers such as monocular depth, pose estimation, segmentation, and optical flow, and delivery in formats like WebDataset, HDF5, or RLDS. If you already have data and need managed annotation with enterprise-grade QA, Sama may be the more appropriate choice.",
      },
      {
        question: "Can teams use both Sama and Claru?",
        answer:
          "Yes. Some teams use Sama for managed annotation services on existing datasets while using Claru for capture-first physical AI data with enrichment layers. This combination works well when a team needs both high-volume annotation throughput for existing data and specialized capture with enrichment for robotics training. Sama handles the labeling operations, while Claru provides the capture pipeline and enrichment processing that physical AI models require.",
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
    { label: "Sama Data Annotation", url: "https://www.sama.com/data-annotation-solution" },
  ],
};
