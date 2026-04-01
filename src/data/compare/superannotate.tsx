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

export const superannotateComparison: ComparisonData = {
  slug: "superannotate-alternatives",
  competitor: {
    name: "SuperAnnotate",
    siteUrl: "https://www.superannotate.com",
    category: "Annotation platform and AI data services",
  },
  meta: {
    title: "SuperAnnotate Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare SuperAnnotate and Claru for physical AI training data. SuperAnnotate offers an annotation platform, AI data services, and multimodal labeling tools. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "SuperAnnotate alternative",
      "SuperAnnotate alternatives",
      "SuperAnnotate vs Claru",
      "annotation platform",
      "AI data services",
      "multimodal labeling",
      "SOC 2 compliance",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "SuperAnnotate Alternatives",
    title: "SuperAnnotate Alternatives: Annotation Platform vs Physical AI",
    subtitle: (
      <>
        <a
          href="https://www.superannotate.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          SuperAnnotate
        </a>{" "}
        offers an annotation platform and AI data services with multimodal
        support. If you need physical-world capture and enrichment for robotics,
        Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "SuperAnnotate highlights AI Data Services, an Expert Talent Network, and a software platform for AI teams.",
      "The platform supports multimodal data types including image, video, NLP, and audio.",
      "The annotation tool supports image, video, text, audio, and LLM annotation workflows.",
      "Computer vision tooling includes object detection, segmentation, tracking, and keypoint labeling.",
      "SuperAnnotate lists compliance and security claims such as SOC 2 Type II, ISO/IEC 27001:2022, GDPR, CCPA, and HIPAA.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose SuperAnnotate for annotation platform + services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What SuperAnnotate Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: SuperAnnotate offers an annotation platform plus AI data services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        SuperAnnotate highlights AI Data Services, an Expert Talent Network, and
        a software platform for AI teams.
        {sourceLink("https://www.superannotate.com/", "[1]")}
      </>,
      <>
        The platform lists multimodal data support including image, video, NLP,
        and audio.
        {sourceLink("https://www.superannotate.com/", "[2]")}
      </>,
      <>
        The annotation tool supports image, video, text, audio, and LLM
        annotation workflows.
        {sourceLink("https://www.superannotate.com/annotation-tool", "[3]")}
      </>,
      <>
        Computer vision tooling includes object detection, segmentation,
        tracking, and keypoint labeling.
        {sourceLink("https://www.superannotate.com/annotation-tool", "[4]")}
      </>,
      <>
        SuperAnnotate lists security and compliance claims including SOC 2 Type
        II, ISO/IEC 27001:2022, GDPR, CCPA, and HIPAA.
        {sourceLink("https://www.superannotate.com/", "[5]")}
      </>,
      "If your bottleneck is labeling workflows or managed annotation services, SuperAnnotate is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "SuperAnnotate at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                AI data services plus annotation platform.
                {sourceLink("https://www.superannotate.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Image, video, NLP, and audio.
                {sourceLink("https://www.superannotate.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Annotation tool",
            value: (
              <>
                Image, video, text, audio, and LLM annotation workflows.
                {sourceLink("https://www.superannotate.com/annotation-tool", "[3]")}
              </>
            ),
          },
          {
            label: "CV tooling",
            value: (
              <>
                Object detection, segmentation, tracking, keypoints.
                {sourceLink("https://www.superannotate.com/annotation-tool", "[4]")}
              </>
            ),
          },
          {
            label: "Compliance",
            value: (
              <>
                SOC 2 Type II, ISO/IEC 27001:2022, GDPR, CCPA, HIPAA.
                {sourceLink("https://www.superannotate.com/", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing a labeling platform or managed annotation",
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
        SuperAnnotate highlights AI Data Services, an Expert Talent Network, and
        a software platform.
        {sourceLink("https://www.superannotate.com/", "[1]")}
      </>,
      <>
        The platform lists multimodal data support including image, video, NLP,
        and audio.
        {sourceLink("https://www.superannotate.com/", "[2]")}
      </>,
      <>
        The annotation tool supports image, video, text, audio, and LLM
        annotation workflows.
        {sourceLink("https://www.superannotate.com/annotation-tool", "[3]")}
      </>,
      <>
        Computer vision tooling includes object detection, segmentation,
        tracking, and keypoint labeling.
        {sourceLink("https://www.superannotate.com/annotation-tool", "[4]")}
      </>,
      <>
        SuperAnnotate lists SOC 2 Type II, ISO/IEC 27001:2022, GDPR, CCPA, and
        HIPAA compliance claims.
        {sourceLink("https://www.superannotate.com/", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where SuperAnnotate Is Strong",
    intro:
      "SuperAnnotate emphasizes a full-service annotation platform with multimodal tooling and enterprise compliance.",
    cards: [
      {
        title: "Annotation platform",
        description: (
          <>
            SuperAnnotate&apos;s annotation tool supports image, video, text, audio,
            and LLM annotation workflows.
            {sourceLink("https://www.superannotate.com/annotation-tool", "[3]")}
          </>
        ),
      },
      {
        title: "Computer vision tooling",
        description: (
          <>
            The platform lists object detection, segmentation, tracking, and
            keypoint labeling for CV workflows.
            {sourceLink("https://www.superannotate.com/annotation-tool", "[4]")}
          </>
        ),
      },
      {
        title: "Enterprise compliance",
        description: (
          <>
            SuperAnnotate reports SOC 2 Type II and ISO/IEC 27001:2022 with GDPR,
            CCPA, and HIPAA compliance claims.
            {sourceLink("https://www.superannotate.com/", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "SuperAnnotate is a labeling platform and services provider. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "SuperAnnotate vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on annotation platforms versus a capture-first physical AI pipeline.",
    columns: [
      { key: "superannotate", label: "SuperAnnotate" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          superannotate: (
            <>
              Annotation platform and AI data services.
              {sourceLink("https://www.superannotate.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          superannotate: (
            <>
              Image, video, NLP, and audio support.
              {sourceLink("https://www.superannotate.com/", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Annotation tooling",
        values: {
          superannotate: (
            <>
              Image, video, text, audio, and LLM annotation workflows.
              {sourceLink("https://www.superannotate.com/annotation-tool", "[3]")}
            </>
          ),
          claru: "Capture protocols and enrichment QC built for robotics",
        },
      },
      {
        dimension: "Compliance",
        values: {
          superannotate: (
            <>
              SOC 2 Type II, ISO/IEC 27001:2022, GDPR, CCPA, HIPAA.
              {sourceLink("https://www.superannotate.com/", "[5]")}
            </>
          ),
          claru: "Secure capture workflows and training-ready delivery",
        },
      },
      {
        dimension: "Best fit",
        values: {
          superannotate: "Teams needing labeling platform + services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: SuperAnnotate vs Claru",
    intro:
      "SuperAnnotate provides labeling workflows and services. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "SuperAnnotate provides a labeling platform with managed services and multimodal support.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data ownership",
        paragraphs: [
          "SuperAnnotate assumes you already have data to annotate.",
          "Claru acquires new physical-world data and enriches it for training.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "SuperAnnotate is a strong fit for teams needing annotation tooling and services.",
          "Claru is better when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When SuperAnnotate Is a Fit",
    competitorBullets: [
      "You need a labeling platform plus managed annotation services.",
      "You already have data and need workflow orchestration.",
      "You need multimodal annotation with enterprise compliance controls.",
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
      "Choose SuperAnnotate when you need a labeling platform with managed annotation services and multimodal tooling.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: SuperAnnotate for labeling services, Claru for physical data capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is SuperAnnotate?",
        answer: (
          <>
            SuperAnnotate provides an annotation platform and AI data services.
            {sourceLink("https://www.superannotate.com/", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does SuperAnnotate support?",
        answer: (
          <>
            SuperAnnotate lists multimodal support for image, video, NLP, and
            audio.
            {sourceLink("https://www.superannotate.com/", "[2]")}
          </>
        ),
      },
      {
        question: "Does SuperAnnotate list compliance certifications?",
        answer: (
          <>
            SuperAnnotate reports SOC 2 Type II and ISO/IEC 27001:2022 and lists
            GDPR, CCPA, and HIPAA compliance claims.
            {sourceLink("https://www.superannotate.com/", "[5]")}
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
    { label: "SuperAnnotate", url: "https://www.superannotate.com/" },
    { label: "SuperAnnotate Annotation Tool", url: "https://www.superannotate.com/annotation-tool" },
  ],
};
