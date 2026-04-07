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

export const alignerrComparison: ComparisonData = {
  slug: "alignerr-alternatives",
  competitor: {
    name: "Alignerr",
    siteUrl: "https://www.alignerr.com",
    category: "AI data platform (public info limited)",
  },
  meta: {
    title: "Alignerr Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Alignerr and Claru for physical AI training data. Alignerr has limited public product details, with a public service status page listing platform components. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Alignerr alternative",
      "Alignerr alternatives",
      "Alignerr vs Claru",
      "AI data platform",
      "public product details limited",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Alignerr Alternatives",
    title: "Alignerr Alternatives: Limited Public Info vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.alignerr.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Alignerr
        </a>{" "}
        has limited public product details available. A public service status
        page lists platform components, but detailed product documentation is
        not readily available. If you need physical-world capture and enrichment
        for robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Alignerr has limited public product documentation on its main site.",
      "A public status page lists components such as Application Process, Interview & Assessment, Onboarding, and Persona API.",
      "The status page also references Persona Workflows, Webhooks, Inquiries & Collections, and Verifications.",
      "Without public docs, it is difficult to evaluate Alignerr's exact data capabilities.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Claru when you need capture + enrichment of robotics data and clear delivery specs.",
    ],
  },
  overview: {
    title: "What Alignerr Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Alignerr's public product details are limited. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Alignerr maintains a public service status page that lists platform
        components including Application Process, Interview & Assessment,
        Onboarding, and Persona API.
        {sourceLink("https://status.alignerr.com/", "[1]")}
      </>,
      <>
        The same status page references Persona Inquiries & Collections, Persona
        Workflows, Persona Webhooks, and Persona Verifications.
        {sourceLink("https://status.alignerr.com/", "[2]")}
      </>,
      "Alignerr is developed and operated by Labelbox, a well-funded data annotation platform company. The Alignerr platform connects organizations with expert AI talent who are carefully vetted through human and AI interviews with a reported 3 percent acceptance rate. Alignerrs are described as a community of highly skilled professionals specializing in AI model evaluation, data labeling, and data generation.",
      "Labelbox launched Alignerr Connect to complement its fully-managed labeling services, allowing organizations to discover and recruit qualified AI trainers with proven data labeling and model evaluation experience. This positions Alignerr primarily as a talent marketplace for AI training work rather than a capture-first physical data pipeline. The platform's focus on vetting and connecting expert annotators is valuable for LLM evaluation and text-based AI tasks, but may not address the upstream capture and enrichment needs of physical AI teams.",
      "If you are evaluating Alignerr, confirm workflows and deliverables directly with their team. If your bottleneck is capture and enrichment of physical-world data, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Alignerr at a Glance",
        items: [
          {
            label: "Focus",
            value: "Public product details are limited",
          },
          {
            label: "Public signals",
            value: (
              <>
                Status page listing platform components.
                {sourceLink("https://status.alignerr.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Unavailable from public sources",
          },
          {
            label: "Best fit",
            value: "Teams who can validate requirements directly with Alignerr",
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
        Alignerr maintains a public service status page listing platform
        components including Application Process, Interview & Assessment,
        Onboarding, and Persona API.
        {sourceLink("https://status.alignerr.com/", "[1]")}
      </>,
      <>
        The status page also references Persona Workflows, Webhooks, Inquiries &
        Collections, and Verifications.
        {sourceLink("https://status.alignerr.com/", "[2]")}
      </>,
      "Public product documentation was not readily available at time of research.",
    ],
  },
  strengths: {
    title: "Where Alignerr May Be Strong",
    intro:
      "Public product details are limited; reach out directly to Alignerr for confirmed capabilities.",
    cards: [
      {
        title: "Operational transparency",
        description: (
          <>
            A public status page exists for Alignerr&apos;s services and platform
            components.
            {sourceLink("https://status.alignerr.com/", "[1]")}
          </>
        ),
      },
      {
        title: "Potential platform breadth",
        description:
          "The status page suggests multiple platform modules (e.g., Persona API and workflows), which may indicate a broader system.",
      },
      {
        title: "Direct evaluation",
        description:
          "Given limited public details, a direct evaluation is recommended.",
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Claru provides a capture-and-enrichment pipeline with public specifications and delivery formats.",
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
    title: "Alignerr vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison highlights what is publicly available for Alignerr versus Claru&apos;s physical AI focus.",
    columns: [
      { key: "alignerr", label: "Alignerr" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          alignerr: "Public product details are limited",
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Public documentation",
        values: {
          alignerr: (
            <>
              Status page listing platform components.
              {sourceLink("https://status.alignerr.com/", "[1]")}
            </>
          ),
          claru: "Capture, enrichment, and delivery pipeline",
        },
      },
      {
        dimension: "Data capture",
        values: {
          alignerr: "Unknown from public sources",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          alignerr: "Unknown from public sources",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          alignerr: "Teams who can validate capabilities directly",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Alignerr vs Claru",
    intro:
      "Alignerr&apos;s public product details are limited; Claru provides a clear capture and enrichment pipeline.",
    blocks: [
      {
        title: "Public info gap",
        paragraphs: [
          "Alignerr does not provide extensive public product documentation.",
          "Claru&apos;s workflow and deliverables are clearly defined.",
        ],
      },
      {
        title: "Validation approach",
        paragraphs: [
          "For Alignerr, confirm workflows and deliverables directly with their team.",
          "For Claru, pipeline steps and outputs are documented and repeatable.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Alignerr may be a fit if it matches your needs and timelines.",
          "Claru is a fit when you need capture + enrichment for physical AI.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Alignerr Might Be a Fit",
    competitorBullets: [
      "You can validate capabilities directly with Alignerr.",
      "You have a defined scope and can run a pilot quickly.",
      "You are evaluating multiple providers with limited public info.",
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
        title: "Blomega Alternatives",
        desc: "Limited public info vs physical AI capture.",
        href: "/compare/blomega-alternatives",
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
      "Choose Alignerr only after confirming capabilities and delivery formats directly.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "If you need a clear, documented pipeline, Claru is the safer starting point.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Alignerr?",
        answer:
          "Alignerr is a platform developed by Labelbox that connects organizations with expert AI talent for data labeling, model evaluation, and data generation tasks. The platform vets contributors through human and AI interviews with a reported 3 percent acceptance rate. Labelbox launched Alignerr Connect to allow organizations to discover and hire proven AI trainers directly, complementing their fully-managed labeling services.",
      },
      {
        question: "Does Alignerr provide public documentation?",
        answer: (
          <>
            A public status page lists platform components and service status, including Application Process, Interview and Assessment, Onboarding, and Persona API modules. Labelbox also publishes documentation for Alignerr Connect that covers how organizations can access the expert talent marketplace. For detailed product capabilities beyond what is publicly documented, direct evaluation with the Alignerr team is recommended.{" "}
            {sourceLink("https://status.alignerr.com/", "[1]")}
          </>
        ),
      },
      {
        question: "Is Alignerr a physical AI data provider?",
        answer:
          "Alignerr is primarily positioned as an expert talent marketplace for AI model evaluation, data labeling, and data generation. Its focus appears to be on connecting organizations with vetted AI trainers rather than providing a capture-first physical data pipeline. Teams that need upstream data capture with wearable cameras, task-specific collection protocols, and enrichment layers like depth and pose estimation would benefit from a provider like Claru that specializes in physical AI data.",
      },
      {
        question: "What is the relationship between Alignerr and Labelbox?",
        answer:
          "Alignerr is owned and operated by Labelbox, a well-known data annotation platform company. Labelbox developed Alignerr as a talent marketplace that complements their annotation platform. While Labelbox provides the annotation tooling, Alignerr provides the vetted human talent to perform labeling, evaluation, and data generation tasks. Together they form an end-to-end annotation offering, though neither is focused on physical-world data capture for robotics.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need the full pipeline from physical-world data capture through enrichment and delivery of robotics-ready datasets. If your team needs to create new physical data from scratch rather than label existing datasets, Claru is purpose-built for that workflow with wearable camera networks, task-specific capture protocols, and enrichment layers including depth, pose, and optical flow.",
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
    { label: "Alignerr Status", url: "https://status.alignerr.com/" },
  ],
};
