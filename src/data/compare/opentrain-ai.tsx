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

export const opentrainAiComparison: ComparisonData = {
  slug: "opentrain-ai-alternatives",
  competitor: {
    name: "OpenTrain AI",
    siteUrl: "https://www.opentrain.ai",
    category: "AI trainer hiring and operations platform",
  },
  meta: {
    title: "OpenTrain AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare OpenTrain AI and Claru for physical AI training data. OpenTrain AI provides a platform to hire, manage, and pay AI trainers and data labelers with integrations into existing tools. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "OpenTrain AI alternative",
      "OpenTrain AI alternatives",
      "OpenTrain AI vs Claru",
      "AI trainer marketplace",
      "data labeling workforce",
      "managed labeling operations",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "OpenTrain AI Alternatives",
    title: "OpenTrain AI Alternatives: Trainer Ops vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.opentrain.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          OpenTrain AI
        </a>{" "}
        provides a platform to hire, manage, and pay AI trainers and data
        labelers while integrating into existing annotation tools. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "OpenTrain AI positions itself as a platform to hire, manage, and pay AI trainers and data labelers while working in your existing tools.",
      "The site lists data labeling solutions across document processing, image labeling, segmentation, video labeling, text labeling, speech, and time-series.",
      "OpenTrain highlights pre-vetted experts, with AI screening resumes, testing skills, and interviewing before hiring.",
      "The platform emphasizes integrating new hires into existing data labeling tools and avoiding tool migration or lock-in.",
      "OpenTrain describes self-service hiring and a managed service model that recruits, onboards, trains, schedules, and manages QA in your tools.",
      "OpenTrain mentions a network of vetted data labeling vendors alongside its trainer platform.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose OpenTrain AI for trainer operations; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What OpenTrain AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: OpenTrain AI provides hiring and operations tooling for AI trainers. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        OpenTrain AI describes a platform to hire, manage, and pay AI trainers
        and data labelers while working in the tools teams already use.
        {sourceLink("https://www.opentrain.ai/", "[1]")}
      </>,
      <>
        The site lists data labeling solutions across document processing, image
        labeling, segmentation, video labeling, text labeling, speech, and
        time-series.
        {sourceLink("https://www.opentrain.ai/", "[2]")}
      </>,
      <>
        OpenTrain highlights pre-vetted experts with AI screening, skills
        testing, and interview steps before hiring.
        {sourceLink("https://www.opentrain.ai/", "[3]")}
      </>,
      <>
        The platform emphasizes integrating hires into existing data labeling
        tools and avoiding tool migration or lock-in.
        {sourceLink("https://www.opentrain.ai/", "[4]")}
      </>,
      <>
        OpenTrain outlines self-service hiring and a managed service that
        recruits, onboards, schedules, trains, and manages QA inside your
        tools.
        {sourceLink("https://www.opentrain.ai/", "[5]")}
      </>,
      "If your bottleneck is staffing and operations for AI trainers, OpenTrain AI is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "OpenTrain AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Hire, manage, and pay AI trainers and data labelers.
                {sourceLink("https://www.opentrain.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Solutions",
            value: (
              <>
                Document, image, segmentation, video, text, speech, and
                time-series labeling.
                {sourceLink("https://www.opentrain.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Vetting",
            value: (
              <>
                Pre-vetted experts with AI screening and skill testing.
                {sourceLink("https://www.opentrain.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Integration",
            value: (
              <>
                Integrates hires into existing labeling tools; no tool
                migration.
                {sourceLink("https://www.opentrain.ai/", "[4]")}
              </>
            ),
          },
          {
            label: "Service model",
            value: (
              <>
                Self-service hiring or managed service with recruiting,
                training, scheduling, and QA.
                {sourceLink("https://www.opentrain.ai/", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing trainer operations and workforce scaling",
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
        OpenTrain AI provides a platform to hire, manage, and pay AI trainers
        and data labelers while working in existing tools.
        {sourceLink("https://www.opentrain.ai/", "[1]")}
      </>,
      <>
        The platform lists data labeling solutions for document, image,
        segmentation, video, text, speech, and time-series tasks.
        {sourceLink("https://www.opentrain.ai/", "[2]")}
      </>,
      <>
        OpenTrain highlights pre-vetted experts with AI screening, skills
        testing, and interview processes.
        {sourceLink("https://www.opentrain.ai/", "[3]")}
      </>,
      <>
        OpenTrain emphasizes integrating hires into existing labeling tools and
        avoiding tool migration.
        {sourceLink("https://www.opentrain.ai/", "[4]")}
      </>,
      <>
        The platform describes a managed service that recruits, onboards,
        schedules, trains, and manages QA inside client tools.
        {sourceLink("https://www.opentrain.ai/", "[5]")}
      </>,
      <>
        OpenTrain mentions a network of vetted data labeling vendors.
        {sourceLink("https://www.opentrain.ai/", "[6]")}
      </>,
    ],
  },
  strengths: {
    title: "Where OpenTrain AI Is Strong",
    intro:
      "OpenTrain AI focuses on AI trainer operations, staffing, and integration into existing labeling tools.",
    cards: [
      {
        title: "Trainer operations",
        description: (
          <>
            OpenTrain AI focuses on hiring, managing, and paying AI trainers and
            data labelers.
            {sourceLink("https://www.opentrain.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Tool integration",
        description: (
          <>
            The platform emphasizes integrating hires into existing annotation
            tools without migration.
            {sourceLink("https://www.opentrain.ai/", "[4]")}
          </>
        ),
      },
      {
        title: "Managed service",
        description: (
          <>
            OpenTrain offers managed service options covering recruiting,
            onboarding, scheduling, training, and QA.
            {sourceLink("https://www.opentrain.ai/", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "OpenTrain AI provides trainer operations. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of focusing on trainer staffing.",
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
    title: "OpenTrain AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison highlights trainer operations versus a capture-first physical AI pipeline.",
    columns: [
      { key: "opentrain", label: "OpenTrain AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          opentrain: (
            <>
              Hire, manage, and pay AI trainers and data labelers.
              {sourceLink("https://www.opentrain.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Solutions",
        values: {
          opentrain: (
            <>
              Document, image, segmentation, video, text, speech, and
              time-series labeling.
              {sourceLink("https://www.opentrain.ai/", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Integration",
        values: {
          opentrain: (
            <>
              Integrates hires into existing tools without migration.
              {sourceLink("https://www.opentrain.ai/", "[4]")}
            </>
          ),
          claru: "Capture protocols and enrichment QC built for robotics",
        },
      },
      {
        dimension: "Service model",
        values: {
          opentrain: (
            <>
              Self-service or managed service with recruiting and QA.
              {sourceLink("https://www.opentrain.ai/", "[5]")}
            </>
          ),
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "Best fit",
        values: {
          opentrain: "Teams needing trainer operations and staffing",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: OpenTrain AI vs Claru",
    intro:
      "OpenTrain AI specializes in trainer operations. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Staffing vs datasets",
        paragraphs: [
          "OpenTrain AI focuses on recruiting and managing AI trainers and data labelers.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Integration-first",
        paragraphs: [
          "OpenTrain integrates workers into your existing annotation stack.",
          "Claru builds data pipelines optimized for robotics capture and enrichment.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "OpenTrain AI is strong when staffing and trainer operations are the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When OpenTrain AI Is a Fit",
    competitorBullets: [
      "You need a platform to hire and manage AI trainers or data labelers.",
      "You want to keep your existing labeling tools without migration.",
      "You need managed services for recruiting, training, and QA.",
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
        title: "Clickworker Alternatives",
        desc: "Crowd data services vs physical AI capture.",
        href: "/compare/clickworker-alternatives",
      },
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
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose OpenTrain AI when you need staffing and operations for AI trainer programs.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: OpenTrain AI for trainer operations, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is OpenTrain AI?",
        answer: (
          <>
            OpenTrain AI provides a platform to hire, manage, and pay AI
            trainers and data labelers.
            {sourceLink("https://www.opentrain.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "Does OpenTrain integrate with existing labeling tools?",
        answer: (
          <>
            Yes. OpenTrain highlights integration into existing tools without
            migration or lock-in.
            {sourceLink("https://www.opentrain.ai/", "[4]")}
          </>
        ),
      },
      {
        question: "Does OpenTrain offer managed services?",
        answer: (
          <>
            OpenTrain describes a managed service covering recruiting,
            onboarding, training, scheduling, and QA.
            {sourceLink("https://www.opentrain.ai/", "[5]")}
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
    { label: "OpenTrain AI", url: "https://www.opentrain.ai/" },
  ],
};
