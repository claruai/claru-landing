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

export const humansignalComparison: ComparisonData = {
  slug: "humansignal-alternatives",
  competitor: {
    name: "HumanSignal",
    siteUrl: "https://humansignal.com",
    category: "Data labeling platform and services",
  },
  meta: {
    title: "HumanSignal Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare HumanSignal and Claru for physical AI training data. HumanSignal is home to Label Studio and provides data labeling tools and services. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "HumanSignal alternative",
      "HumanSignal alternatives",
      "HumanSignal vs Claru",
      "Label Studio enterprise",
      "data labeling platform",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "HumanSignal Alternatives",
    title: "HumanSignal Alternatives: Labeling Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://humansignal.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          HumanSignal
        </a>{" "}
        is home to Label Studio and provides data labeling tools and services. If
        you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "HumanSignal is home to Label Studio, a widely used open-source data labeling tool.",
      "The platform supports text, image, audio, video, and time series labeling.",
      "HumanSignal also provides enterprise tooling, services, and QA workflows.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose HumanSignal for labeling tools; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What HumanSignal Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: HumanSignal provides labeling tooling and services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        HumanSignal describes itself as the home of Label Studio, an open-source
        data labeling tool. {sourceLink("https://humansignal.com/", "[1]")}
      </>,
      <>
        Label Studio supports labeling across text, images, audio, video, and
        time series data. {sourceLink("https://humansignal.com/", "[2]")}
      </>,
      <>
        HumanSignal also highlights enterprise labeling services and workflows.
        {sourceLink("https://humansignal.com/", "[3]")}
      </>,
      "HumanSignal was founded to commercialize Label Studio, one of the most widely adopted open-source data labeling tools in the AI ecosystem. Label Studio gained traction through its flexibility, supporting a wide range of data types and annotation templates. HumanSignal raised venture funding to build an enterprise offering on top of the open-source foundation, adding features like team management, quality workflows, and deployment options that enterprise customers require. The company has grown to serve thousands of teams globally, from startups to large enterprises.",
      "For physical AI and robotics teams, Label Studio and HumanSignal provide strong annotation capabilities for data that already exists. However, the core challenge for many robotics programs is not annotation tooling but data acquisition. Robotics models built on imitation learning, diffusion policies, and vision-language-action architectures need egocentric video of human demonstrations, manipulation sequences, and multi-sensor recordings captured with specialized equipment and protocols. The gap between having annotation tools and having the physical-world data to annotate is the fundamental distinction that shapes provider selection for embodied AI teams.",
      "If your bottleneck is annotation tooling and QA workflows, HumanSignal is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "HumanSignal at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Label Studio and data labeling workflows.
                {sourceLink("https://humansignal.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Data types",
            value: (
              <>
                Text, image, audio, video, and time series labeling.
                {sourceLink("https://humansignal.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Services",
            value: (
              <>
                Enterprise tooling and labeling services.
                {sourceLink("https://humansignal.com/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing labeling tools and QA workflows",
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
        HumanSignal is home to Label Studio, an open-source labeling tool.
        {sourceLink("https://humansignal.com/", "[1]")}
      </>,
      <>
        Label Studio supports text, image, audio, video, and time series data.
        {sourceLink("https://humansignal.com/", "[2]")}
      </>,
      <>
        HumanSignal provides enterprise tooling and labeling services.
        {sourceLink("https://humansignal.com/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where HumanSignal Is Strong",
    intro:
      "Based on HumanSignal's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Labeling platform",
        description: (
          <>
            HumanSignal positions Label Studio as a central labeling platform.
            {sourceLink("https://humansignal.com/", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal labeling",
        description: (
          <>
            The platform supports text, image, audio, video, and time series.
            {sourceLink("https://humansignal.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Services and QA",
        description: (
          <>
            HumanSignal highlights enterprise services for labeling workflows.
            {sourceLink("https://humansignal.com/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "HumanSignal provides labeling tools. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "HumanSignal vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing HumanSignal's labeling platform strengths.",
    columns: [
      { key: "humansignal", label: "HumanSignal" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          humansignal: (
            <>
              Labeling platform and services (Label Studio).
              {sourceLink("https://humansignal.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          humansignal: (
            <>
              Text, image, audio, video, and time series labeling.
              {sourceLink("https://humansignal.com/", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Capture model",
        values: {
          humansignal: "Annotation tooling and services",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          humansignal: "Labeling and QA workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          humansignal: "Teams needing labeling tools and workflows",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: HumanSignal vs Claru",
    intro:
      "HumanSignal specializes in labeling tooling. Claru specializes in capture and enrichment for physical AI.",
    blocks: [
      {
        title: "Tools vs pipeline",
        paragraphs: [
          "HumanSignal delivers labeling tools and services through Label Studio.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "HumanSignal assumes teams already have data to label.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Robotics AI data requirements",
        paragraphs: [
          "Modern robotics AI models require training data with specific properties beyond what annotation tools alone can address: egocentric viewpoints matching robot sensor placements, manipulation sequences with hand-object interaction context, depth-aligned frames for spatial reasoning, and action-level temporal segmentation for policy learning. Label Studio can annotate these data types once they exist, but the data must first be captured through specialized collection programs.",
          "Claru provides the upstream capture infrastructure that generates this data, then enriches it with depth estimation, pose detection, instance segmentation, and optical flow before delivery in robotics-native formats. Teams can use Label Studio for additional annotation on top of Claru-delivered datasets if needed.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "HumanSignal is strong for annotation tooling and QA workflows, particularly for teams that have existing data across multiple modalities and need flexible, extensible labeling infrastructure with open-source foundations.",
          "Claru is stronger when capture and enrichment are the bottleneck, especially for robotics teams that need new task-specific data with multi-layer enrichment delivered in formats that integrate directly into training pipelines.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When HumanSignal Is a Fit",
    competitorBullets: [
      "You need a labeling platform that supports multiple data types.",
      "You already have data and need annotation workflows and QA.",
      "You want open-source tooling with enterprise support options.",
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
      "Choose HumanSignal when you need a labeling platform and QA workflows for existing data.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: HumanSignal for labeling tools, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is HumanSignal?",
        answer: (
          <>
            HumanSignal is the company behind Label Studio, one of the most widely adopted open-source data labeling tools in the AI ecosystem.{" "}
            {sourceLink("https://humansignal.com/", "[1]")}{" "}
            Founded to commercialize Label Studio, HumanSignal raised venture funding to build an enterprise offering with team management, quality workflows, and deployment options. The company serves thousands of teams globally, from startups to large enterprises, providing flexible annotation infrastructure across multiple data types and annotation templates.
          </>
        ),
      },
      {
        question: "What data types does HumanSignal support?",
        answer: (
          <>
            Label Studio supports text, image, audio, video, and time series labeling through its flexible annotation template system.{" "}
            {sourceLink("https://humansignal.com/", "[2]")}{" "}
            The open-source foundation allows custom annotation interfaces for specialized tasks, making Label Studio adaptable to a wide range of labeling needs. This flexibility has made it popular among research teams and organizations that need to customize their annotation workflows rather than use rigid pre-built interfaces.
          </>
        ),
      },
      {
        question: "Does HumanSignal offer services?",
        answer: (
          <>
            HumanSignal highlights enterprise services for labeling workflows alongside the open-source Label Studio tool.{" "}
            {sourceLink("https://humansignal.com/", "[3]")}{" "}
            Enterprise features include team management, role-based access control, advanced quality workflows, and dedicated support. These services are designed for organizations running production-scale annotation operations that need governance, compliance, and reliability beyond what the open-source version provides.
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. Label Studio and HumanSignal provide excellent annotation tooling for data you already have, but robotics teams often face an upstream challenge: they need new physical-world data collected for specific tasks. Claru provides the capture infrastructure, trained collector network, and enrichment pipeline including depth, pose, segmentation, and optical flow, all delivered in robotics-native formats like RLDS, WebDataset, and HDF5.",
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
    { label: "HumanSignal", url: "https://humansignal.com/" },
  ],
};
