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

export const centaurComparison: ComparisonData = {
  slug: "centaur-labs-alternatives",
  competitor: {
    name: "Centaur Labs",
    siteUrl: "https://centaurlabs.com",
    category: "Expert medical data labeling and health AI annotation",
  },
  meta: {
    title: "Centaur Labs Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Centaur Labs and Claru for physical AI training data. Centaur Labs provides expert medical data labeling with a large SME network and multi-modal health data coverage. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Centaur Labs alternative",
      "Centaur Labs alternatives",
      "Centaur Labs vs Claru",
      "medical data annotation",
      "expert labeling",
      "health AI training data",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Centaur Labs Alternatives",
    title: "Centaur Labs Alternatives: Medical Labeling vs Physical AI Capture",
    subtitle: (
      <>
        <a
          href="https://info.centaurlabs.com/overview"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Centaur Labs
        </a>{" "}
        provides expert medical data labeling with large-scale subject matter
        expert networks and healthcare-focused workflows. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Centaur Labs combines expert medical knowledge with an algorithmic quality system to label medical data.",
      "The company reports 177MM total labels completed, 2MM labels per week, and 20,000+ labeling subject matter experts.",
      "Centaur Labs supports multiple health data types including text, audio, waveform (EEG/ECG), 2D images, 3D images, and video.",
      "The platform emphasizes expert-quality annotation with Gold Standard cases and pay-for-performance incentives.",
      "Centaur highlights HIPAA and SOC 2 Type II compliance for healthcare data labeling.",
      "MIT News describes Centaur&apos;s DiagnosUs app for gathering expert medical opinions at scale.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Centaur Labs for medical expert labeling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Centaur Labs Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Centaur Labs focuses on expert medical labeling and health data workflows. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Centaur Labs highlights expert medical labeling with algorithmic quality
        systems to combine expert opinions at scale.
        {sourceLink("https://info.centaurlabs.com/overview", "[1]")}
      </>,
      <>
        The company reports 177MM total labels completed, 2MM labels per week,
        and 20,000+ labeling subject matter experts.
        {sourceLink("https://info.centaurlabs.com/overview", "[2]")}
      </>,
      <>
        Centaur Labs supports multimodal health data types including text,
        audio, waveform (EEG/ECG), 2D images, 3D images, and video.
        {sourceLink("https://info.centaurlabs.com/overview", "[3]")}
      </>,
      <>
        The health data labeling solution emphasizes Gold Standard cases and
        pay-for-performance incentives to measure annotator accuracy.
        {sourceLink("https://info.centaurlabs.com/healthdatalabeling", "[4]")}
      </>,
      <>
        Centaur Labs notes HIPAA and SOC 2 Type II compliance and healthcare
        labeling tools like digital pathology and DICOM viewers.
        {sourceLink("https://info.centaurlabs.com/healthdatalabeling", "[5]")}
      </>,
      <>
        MIT News describes Centaur&apos;s DiagnosUs mobile app for collecting expert
        medical opinions on biomedical data at scale.
        {sourceLink("https://news.mit.edu/2023/gamifying-medical-data-labeling-ai-0628", "[6]")}
      </>,
      "If your bottleneck is expert medical labeling and healthcare workflows, Centaur Labs is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Centaur Labs at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Expert medical data labeling with algorithmic quality systems.
                {sourceLink("https://info.centaurlabs.com/overview", "[1]")}
              </>
            ),
          },
          {
            label: "Scale",
            value: (
              <>
                177MM total labels, 2MM labels per week, 20,000+ SMEs.
                {sourceLink("https://info.centaurlabs.com/overview", "[2]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Text, audio, waveform, 2D/3D images, video.
                {sourceLink("https://info.centaurlabs.com/overview", "[3]")}
              </>
            ),
          },
          {
            label: "Quality controls",
            value: (
              <>
                Gold Standard cases and pay-for-performance incentives.
                {sourceLink("https://info.centaurlabs.com/healthdatalabeling", "[4]")}
              </>
            ),
          },
          {
            label: "Compliance",
            value: (
              <>
                HIPAA and SOC 2 Type II for healthcare data workflows.
                {sourceLink("https://info.centaurlabs.com/healthdatalabeling", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Healthcare and high-stakes medical AI labeling",
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
        Centaur Labs combines expert medical labeling with algorithmic quality
        systems and on-demand expert networks.
        {sourceLink("https://info.centaurlabs.com/overview", "[1]")}
      </>,
      <>
        The company reports 177MM total labels completed, 2MM labels per week,
        and 20,000+ labeling subject matter experts.
        {sourceLink("https://info.centaurlabs.com/overview", "[2]")}
      </>,
      <>
        Centaur Labs supports multimodal data types including text, audio,
        waveform (EEG/ECG), 2D/3D images, and video.
        {sourceLink("https://info.centaurlabs.com/overview", "[3]")}
      </>,
      <>
        Health data labeling includes Gold Standard cases, pay-for-performance
        incentives, and HIPAA/SOC 2 Type II compliance.
        {sourceLink("https://info.centaurlabs.com/healthdatalabeling", "[4]")}
        {sourceLink("https://info.centaurlabs.com/healthdatalabeling", "[5]")}
      </>,
      <>
        MIT News describes Centaur&apos;s DiagnosUs app for gathering expert medical
        opinions on biomedical data.
        {sourceLink("https://news.mit.edu/2023/gamifying-medical-data-labeling-ai-0628", "[6]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Centaur Labs Is Strong",
    intro:
      "Centaur Labs focuses on expert medical labeling with strong quality systems and healthcare-specific workflows.",
    cards: [
      {
        title: "Expert medical labeling",
        description: (
          <>
            Centaur Labs uses expert networks and algorithmic quality controls
            for medical data labeling.
            {sourceLink("https://info.centaurlabs.com/overview", "[1]")}
          </>
        ),
      },
      {
        title: "Healthcare compliance",
        description: (
          <>
            The health data labeling solution emphasizes HIPAA and SOC 2 Type II
            compliance and specialized medical viewers.
            {sourceLink("https://info.centaurlabs.com/healthdatalabeling", "[5]")}
          </>
        ),
      },
      {
        title: "Scale of expert opinions",
        description: (
          <>
            Centaur Labs reports 2MM labels per week with 20,000+ SMEs.
            {sourceLink("https://info.centaurlabs.com/overview", "[2]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics teams often need capture and enrichment of physical-world data, not just medical labeling workflows.",
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
    title: "Centaur Labs vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Centaur Labs&apos; expert medical labeling model.",
    columns: [
      { key: "centaur", label: "Centaur Labs" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          centaur: (
            <>
              Expert medical data labeling and quality systems.
              {sourceLink("https://info.centaurlabs.com/overview", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Scale",
        values: {
          centaur: (
            <>
              177MM labels completed, 2MM per week, 20,000+ SMEs.
              {sourceLink("https://info.centaurlabs.com/overview", "[2]")}
            </>
          ),
          claru: "Specialized capture network focused on physical tasks",
        },
      },
      {
        dimension: "Modalities",
        values: {
          centaur: (
            <>
              Text, audio, waveform, 2D/3D images, video.
              {sourceLink("https://info.centaurlabs.com/overview", "[3]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Compliance",
        values: {
          centaur: (
            <>
              HIPAA and SOC 2 Type II compliant healthcare workflows.
              {sourceLink("https://info.centaurlabs.com/healthdatalabeling", "[5]")}
            </>
          ),
          claru: "Secure capture workflows and training-ready delivery",
        },
      },
      {
        dimension: "Best fit",
        values: {
          centaur: "Healthcare and high-stakes medical AI labeling",
          claru: "Robotics teams needing capture + enrichment",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Centaur Labs vs Claru",
    intro:
      "Centaur Labs focuses on expert medical labeling. Claru focuses on capture and enrichment for physical AI.",
    blocks: [
      {
        title: "Expert labeling vs capture pipelines",
        paragraphs: [
          "Centaur Labs emphasizes expert medical labeling with quality systems.",
          "Claru emphasizes real-world capture and enrichment for robotics training.",
        ],
      },
      {
        title: "Healthcare data vs physical-world data",
        paragraphs: [
          "Centaur Labs is optimized for clinical and biomedical data types.",
          "Claru is optimized for physical-world tasks and robotic manipulation.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Centaur Labs is a strong fit for healthcare labeling needs.",
          "Claru is a better fit when you need robotics-ready datasets.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Centaur Labs Is a Fit",
    competitorBullets: [
      "You need expert labeling for medical imaging or clinical data.",
      "You require HIPAA- and SOC 2-aligned healthcare workflows.",
      "You need multimodal medical data labeled at scale.",
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
        title: "Keymakr Alternatives",
        desc: "Managed annotation services vs physical AI capture.",
        href: "/compare/keymakr-alternatives",
      },
      {
        title: "SuperAnnotate Alternatives",
        desc: "Annotation platform vs physical AI data pipelines.",
        href: "/compare/superannotate-alternatives",
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
      "If you need expert medical labeling with healthcare compliance, Centaur Labs is designed for that scope.",
      "If you need capture and enrichment of physical-world data for robotics training, Claru is a better fit.",
      "Some teams use both: Centaur Labs for medical labeling, Claru for physical datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Centaur Labs?",
        answer: (
          <>
            Centaur Labs provides expert medical data labeling with algorithmic
            quality systems.
            {sourceLink("https://info.centaurlabs.com/overview", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does Centaur Labs support?",
        answer: (
          <>
            Centaur Labs lists text, audio, waveform, 2D/3D images, and video
            data types for medical labeling.
            {sourceLink("https://info.centaurlabs.com/overview", "[3]")}
          </>
        ),
      },
      {
        question: "How does Centaur Labs scale expert labeling?",
        answer: (
          <>
            The company reports 2MM labels per week and 20,000+ SMEs to scale
            expert annotation.
            {sourceLink("https://info.centaurlabs.com/overview", "[2]")}
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
    { label: "Centaur Labs Overview", url: "https://info.centaurlabs.com/overview" },
    { label: "Centaur Labs Health Data Labeling", url: "https://info.centaurlabs.com/healthdatalabeling" },
    { label: "MIT News: DiagnosUs", url: "https://news.mit.edu/2023/gamifying-medical-data-labeling-ai-0628" },
  ],
};
