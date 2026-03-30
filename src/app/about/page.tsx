import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "About Claru — The Team Behind Physical AI Training Data",
  description:
    "Meet the team building purpose-built training data for robotics and physical AI. Founded by the Moonvalley co-founders.",
  keywords: [
    "Claru AI team",
    "physical AI training data company",
    "robotics data team",
    "Moonvalley founders",
    "AI training data startup",
    "embodied AI data",
  ],
  openGraph: {
    title: "About Claru — The Team Behind Physical AI Training Data",
    description:
      "Meet the team building purpose-built training data for robotics and physical AI. Founded by the Moonvalley co-founders.",
    type: "website",
    url: "https://claru.ai/about",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru — About the Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Claru — The Team Behind Physical AI Training Data",
    description:
      "Meet the team building purpose-built training data for robotics and physical AI.",
  },
  alternates: {
    canonical: "https://claru.ai/about",
  },
};

// =============================================================================
// JSON-LD: Organization + Person schemas for E-E-A-T
// =============================================================================

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Claru AI",
  legalName: "Reka AI Inc.",
  alternateName: "Claru",
  url: "https://claru.ai",
  logo: "https://claru.ai/images/claru-logo.png",
  description:
    "Purpose-built training datasets for frontier robotics, embodied AI, and world models. Real-world video capture, multi-model enrichment, and expert human annotation.",
  foundingDate: "2025",
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    minValue: 10,
    description:
      "Core engineering team plus a network of 10,000+ data collectors across 100+ cities",
  },
  knowsAbout: [
    "Robotics training data",
    "Physical AI",
    "Egocentric video datasets",
    "Computer vision",
    "Embodied AI",
    "Vision-language-action models",
    "RLHF data",
  ],
  founder: [
    { "@type": "Person", "@id": "https://claru.ai/about#john-thomas" },
    { "@type": "Person", "@id": "https://claru.ai/about#chad-birdsall" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@claru.ai",
    contactType: "sales",
    url: "https://claru.ai/#contact",
  },
  sameAs: ["https://twitter.com/claruai", "https://linkedin.com/company/claruai"],
};

const johnJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://claru.ai/about#john-thomas",
  name: "John Thomas",
  jobTitle: "Co-Founder & CEO",
  worksFor: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
  },
  knowsAbout: [
    "AI/ML infrastructure",
    "Training data systems",
    "Physical AI",
    "Robotics",
    "Video generation",
    "Data acquisition",
  ],
  alumniOf: [
    {
      "@type": "Organization",
      name: "Moonvalley",
      url: "https://moonvalley.com",
      description: "AI video generation company ($154M raised)",
    },
    {
      "@type": "Organization",
      name: "ContentFly",
      description: "Generative AI content platform (YC W21)",
    },
    {
      "@type": "Organization",
      name: "IBM Global Business Services",
      description: "Management consulting",
    },
    {
      "@type": "EducationalOrganization",
      name: "University of Toronto",
    },
  ],
  sameAs: ["https://linkedin.com/in/johnkthomas"],
};

const chadJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://claru.ai/about#chad-birdsall",
  name: "Chad Birdsall",
  jobTitle: "Co-Founder & Head of Operations",
  worksFor: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
  },
  knowsAbout: [
    "Operations",
    "Data pipeline operations",
    "Marketplace operations",
    "Multi-market scaling",
    "Data collection logistics",
  ],
  alumniOf: [
    {
      "@type": "Organization",
      name: "Moonvalley",
      url: "https://moonvalley.com",
      description: "AI video generation company",
    },
    {
      "@type": "Organization",
      name: "Uber",
      description: "Global ride-sharing and technology company",
    },
    {
      "@type": "Organization",
      name: "Bungalow",
      description: "Co-living real estate platform",
    },
  ],
  sameAs: ["https://linkedin.com/in/chadbirdsall"],
};

// =============================================================================
// DATA
// =============================================================================

const founders = [
  {
    name: "John Thomas",
    title: "Co-Founder & CEO",
    bio: "Previously Co-Founder & COO at Moonvalley ($154M raised from General Catalyst, Khosla Ventures, Bessemer, YC, CoreWeave), where he built the licensed data acquisition and operations infrastructure behind Marey — the first AI video model trained exclusively on owned and licensed footage. Before Moonvalley, co-founded ContentFly (YC W21), one of the first generative AI content platforms, serving Lenovo, Webflow, and Zapier. Started career as Management Consultant at IBM Global Business Services. Industrial Engineering, University of Toronto.",
    linkedin: "https://linkedin.com/in/johnkthomas",
    id: "john-thomas",
  },
  {
    name: "Chad Birdsall",
    title: "Co-Founder & Head of Operations",
    bio: "Previously led data and marketplace operations at Moonvalley and ContentFly. Scaled multi-market operations at Bungalow as Head of Market Operations over 4 years. Senior Manager at Uber (2015\u20132018), running Driver Partner Support Centers across Southeast and North Asia. Deep operator experience turning messy, high-volume data workflows into reliable pipelines. Marketing & Management, Ohio University.",
    linkedin: "https://linkedin.com/in/chadbirdsall",
    id: "chad-birdsall",
  },
];

const stats = [
  { value: "3.7M+", label: "Human annotations", detail: "Across video, robotics, and multimodal datasets" },
  { value: "25+", label: "Active datasets", detail: "Licensed for commercial AI training" },
  { value: "10K+", label: "Data collectors", detail: "Trained contributors with wearable cameras" },
  { value: "100+", label: "Cities worldwide", detail: "Diverse real-world environments on 6 continents" },
  { value: "5+", label: "Frontier lab partnerships", detail: "Working with leading AI research teams" },
];

// =============================================================================
// PAGE
// =============================================================================

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd, johnJsonLd, chadJsonLd]),
        }}
      />

      <GeoPageShell>
        {/* ── Hero / Mission ──────────────────────────────────────────── */}
        <section className="w-full pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-4xl px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <a href="/" className="transition-colors hover:text-white">
                    Home
                  </a>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  About
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Building the Data Infrastructure for Physical AI
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed md:text-xl text-white/70">
              We believe the next generation of AI &mdash; robots that can see,
              move, and manipulate the physical world &mdash; needs
              fundamentally different training data. Claru exists to build it.
            </p>
          </div>
        </section>

        {/* ── The Problem We Solve ────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              The Real-World Data Gap
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Large language models trained on internet text. Image models
                trained on web-scraped photos. But robots that need to pick up a
                coffee mug, navigate a warehouse, or fold laundry cannot learn
                from internet data. They need{" "}
                <Link
                  href="/egocentric-video-datasets"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  egocentric video
                </Link>{" "}
                of real humans performing real tasks in real environments
                &mdash; captured with depth, pose, and action labels at
                millisecond precision.
              </p>

              <p>
                This data does not exist on the internet. It cannot be
                synthesized in simulation without a crippling domain gap.
                Benchmarks like{" "}
                <a
                  href="https://ego4d-data.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Ego4D
                </a>{" "}
                and{" "}
                <a
                  href="https://robotics-transformer-x.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Open X-Embodiment
                </a>{" "}
                have demonstrated the value of large-scale real-world datasets,
                but every frontier robotics lab we have spoken to cites the same
                bottleneck:{" "}
                <strong className="text-white">
                  not compute, not algorithms &mdash; data
                </strong>
                .
              </p>

              <p>
                Claru closes that gap. We operate the capture infrastructure,
                enrichment pipelines, and annotation workforce to deliver{" "}
                <Link
                  href="/training-data-for-robotics"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  training-ready datasets for robotics
                </Link>{" "}
                and{" "}
                <Link
                  href="/physical-ai-training-data"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  physical AI
                </Link>{" "}
                &mdash; from brief to first delivery in days, not months.
              </p>
            </div>
          </div>
        </section>

        {/* ── Founding Team ───────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Founding Team
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Claru was incubated inside{" "}
              <a
                href="https://moonvalley.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors"
                style={{ color: "#92B090" }}
              >
                Moonvalley
              </a>
              &apos;s data procurement workflow. Building Marey &mdash; the
              first AI video model trained exclusively on owned and licensed
              footage &mdash; required solving licensed data capture at scale.
              That operational problem is exactly what Claru now productizes
              for other frontier AI labs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {founders.map((founder) => (
                <div
                  key={founder.id}
                  id={founder.id}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-mono font-bold mb-4"
                    style={{
                      backgroundColor: "rgba(146,176,144,0.15)",
                      color: "#92B090",
                    }}
                  >
                    {founder.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {founder.name}
                  </h3>
                  <p
                    className="text-sm font-medium mt-1 mb-4"
                    style={{ color: "#92B090" }}
                  >
                    {founder.title}
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {founder.bio}
                  </p>
                  {founder.linkedin && (
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium mt-4 transition-colors hover:underline"
                      style={{ color: "#92B090" }}
                    >
                      LinkedIn &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Team ────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              The Broader Team
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Our core engineering and research team includes ex-FAANG
                engineers and researchers with deep expertise in computer
                vision, robotics, and AI infrastructure. We have built
                large-scale data pipelines, trained production ML models, and
                shipped AI products used by millions. Our enrichment pipeline
                leverages foundation models including{" "}
                <a
                  href="https://depth-anything-v2.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Depth Anything V2
                </a>
                , ViTPose, and SAM3 to produce{" "}
                <Link
                  href="/embodied-ai-datasets"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  embodied AI datasets
                </Link>{" "}
                with six enrichment layers on every clip.
              </p>

              <p>
                Beyond the core team, Claru operates a global data collection
                network:{" "}
                <strong className="text-white">
                  10,000+ trained collectors across 100+ cities on 6 continents
                </strong>
                . Every collector is equipped with wearable cameras and follows
                structured capture protocols designed for each project. This
                network gives us the geographic and environmental diversity that
                physical AI models need to generalize beyond controlled lab
                settings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "Engineering",
                  description:
                    "Full-stack AI infrastructure: capture pipelines, multi-model enrichment (depth, pose, segmentation), vector search, and delivery systems built for petabyte-scale datasets.",
                },
                {
                  title: "Research",
                  description:
                    "Deep expertise in computer vision, embodied AI, and robot learning. We design annotation schemas and quality metrics in collaboration with each client's ML team.",
                },
                {
                  title: "Operations",
                  description:
                    "Global data collection at scale. Collector recruitment, training, quality assurance, and logistics across 100+ cities. Brief to first delivery in days.",
                },
              ].map((dept) => (
                <div
                  key={dept.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {dept.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {dept.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── By the Numbers ──────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Claru by the Numbers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                >
                  <div
                    className="text-3xl md:text-4xl font-bold font-mono mb-1"
                    style={{ color: "#92B090" }}
                  >
                    {item.value}
                  </div>
                  <div className="text-sm font-medium text-white mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Resources ───────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Explore Our Work
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Purpose-built datasets for robot learning: egocentric video, manipulation, teleoperation.",
                },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics and embodiment.",
                },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video data for visuomotor policies and embodied AI research.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Datasets for agents that perceive and act in the physical world.",
                },
                {
                  href: "/case-studies",
                  title: "Case Studies",
                  desc: "Real project outcomes with metrics and methodology documentation.",
                },
                {
                  href: "/data-catalog",
                  title: "Browse the Data Catalog",
                  desc: "Explore 25+ licensed datasets across robotics, video, and multimodal AI.",
                },
                {
                  href: "/compare/scale-ai-alternatives",
                  title: "Scale AI Alternatives",
                  desc: "How Claru compares to Scale AI for physical AI training data.",
                },
                {
                  href: "/compare/appen-alternatives",
                  title: "Appen Alternatives",
                  desc: "Why physical AI teams look beyond crowd-sourced labeling.",
                },
                {
                  href: "/compare/labelbox-alternatives",
                  title: "Labelbox Alternatives",
                  desc: "End-to-end data service vs. annotation platform for robotics.",
                },
                {
                  href: "/solutions",
                  title: "All Solutions",
                  desc: "Custom data pipelines for acquisition, enrichment, annotation, and validation.",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div>
                    <div
                      className="text-sm font-medium group-hover:underline"
                      style={{ color: "#92B090" }}
                    >
                      {link.title}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      {link.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact CTA ─────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Talk to Our Team
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Whether you are building a robotics foundation model, training
              VLAs, or need custom real-world datasets &mdash; we would like to
              hear about it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/claru-ai/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                style={{
                  backgroundColor: "#92B090",
                  color: "#0a0908",
                }}
              >
                Book a Call
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </section>
      </GeoPageShell>
    </>
  );
}
