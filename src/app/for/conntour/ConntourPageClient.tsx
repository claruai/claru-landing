"use client";

import { motion } from "framer-motion";
import { ProspectPageProvider } from "../ProspectPageContext";
import ExpiryGate from "@/app/components/prospect/ExpiryGate";
import {
  ProspectTracking,
  SectionTracker,
} from "@/app/components/prospect/ProspectTracking";
import CaseStudyCard from "@/app/components/prospect/CaseStudyCard";
import WorkforceStats from "@/app/components/prospect/WorkforceStats";
import CalendlyEmbed from "@/app/components/prospect/CalendlyEmbed";
import ProspectFooter from "../ProspectFooter";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_CREATED = "2026-03-13";
const COMPANY_SLUG = "conntour";
const COMPANY_NAME = "Conntour";
const RECIPIENT_NAME = "Matan";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const mono = 'var(--font-mono, "JetBrains Mono", monospace)';
const accent = "#92B090";
const muted = "rgba(255, 255, 255, 0.55)";
const cardBg = "#121210";
const cardBorder = "#2a2a28";

// ---------------------------------------------------------------------------
// Fade-in wrapper
// ---------------------------------------------------------------------------

function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section: Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative px-6 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl"
          style={{ fontFamily: mono, color: "#FFFFFF" }}
        >
          Behavioral Video Data{" "}
          <span style={{ color: accent }}>for Camera Search</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[720px] space-y-4 text-base leading-relaxed md:text-lg"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          <p>
            We&apos;re{" "}
            <a
              href="https://claru.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#92B090]/40 underline-offset-2 transition-colors hover:text-[#92B090]"
              style={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              Claru
            </a>
            &mdash;we built the annotation and data
            infrastructure behind{" "}
            <a
              href="https://betakit.com/moonvalley-raises-additional-84-million-to-meet-demand-for-its-hollywood-friendly-ai-video-generator/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#92B090]/40 underline-offset-2 transition-colors hover:text-[#92B090]"
              style={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              Moonvalley
            </a>{" "}
            ($185M raised, YC/Khosla-backed), then spun it out for companies
            building with AI.
          </p>
          <p>
            We run a global annotator workforce of 2,000+ across 14 countries
            and have delivered over 3 million structured annotations across
            video, robotics, multimodal, and more. Our teams handle everything
            from data collection and labeling to quality assurance &mdash; so
            you can focus on building your product instead of annotation ops.
          </p>
          <p>
            Natural language camera search only works when the VLM has seen
            enough diverse, labeled examples of every type of behavior users
            might search for. We think we could help with that data challenge.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <a
            href="#book-a-call"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: accent, color: "#0a0908", fontFamily: mono }}
          >
            Book a Call
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: How We Can Help
// ---------------------------------------------------------------------------

const WAYS_WE_HELP = [
  {
    number: "01",
    title: "Diverse Behavioral Video",
    description:
      "We've captured thousands of hours of real-world video across varied environments \u2014 workplaces, streets, retail spaces, facilities \u2014 with people performing a wide range of activities. The kind of diverse behavioral footage that trains VLMs to recognize what users search for.",
  },
  {
    number: "02",
    title: "Behavioral Annotation",
    description:
      "Our annotation teams can label video with activity categories, event boundaries, object interactions, and scene descriptions at the granularity your VLM needs. We co-develop the taxonomy with your team.",
  },
  {
    number: "03",
    title: "Scaling Across Environments",
    description:
      "Each new customer deployment means new types of behaviors and environments your model needs to understand. We can run ongoing capture and annotation campaigns as you expand into new verticals \u2014 security, retail, industrial, government.",
  },
];

function HowWeCanHelp() {
  return (
    <section className="px-6 py-12 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <h2
          className="mb-3 text-2xl font-semibold tracking-tight md:text-3xl"
          style={{ fontFamily: mono, color: "#FFFFFF" }}
        >
          How We Can Help
        </h2>
        <p className="mb-10 text-sm" style={{ color: muted }}>
          A few ways we could support what you&apos;re building.
        </p>

        <div className="space-y-6">
          {WAYS_WE_HELP.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-lg border p-6"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <div className="mb-3 flex items-baseline gap-3">
                <span
                  className="text-xs font-medium"
                  style={{ color: accent, fontFamily: mono }}
                >
                  {item.number}
                </span>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#FFFFFF", fontFamily: mono }}
                >
                  {item.title}
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.75)" }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: What Makes Us Different
// ---------------------------------------------------------------------------

const DIFFERENTIATORS = [
  {
    title: "Embedded, Not Outsourced",
    description:
      "We work as an extension of your team \u2014 co-developing guidelines, sitting in your Slack, iterating on edge cases together. Not a black-box vendor you throw tasks over the wall to.",
  },
  {
    title: "Built for AI Teams",
    description:
      "We came from an AI lab, so we understand the feedback loops between annotation quality and model performance. Our QA isn\u2019t just checking boxes \u2014 it\u2019s designed to catch the errors that actually hurt your model.",
  },
  {
    title: "Global Workforce, Central Management",
    description:
      "2,000+ annotators across 14 countries, managed by a single dedicated project lead on our side. You get the geographic reach without the coordination overhead.",
  },
];

function HowWeWork() {
  return (
    <section className="px-6 py-12 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <h2
          className="mb-3 text-2xl font-semibold tracking-tight md:text-3xl"
          style={{ fontFamily: mono, color: "#FFFFFF" }}
        >
          What Makes Us Different
        </h2>
        <p className="mb-10 text-sm" style={{ color: muted }}>
          We built this for ourselves first. That changes how we operate.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {DIFFERENTIATORS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-lg border p-5"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <h3
                className="mb-2 text-sm font-semibold"
                style={{ color: accent, fontFamily: mono }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14">
          <h3
            className="mb-6 text-sm font-medium uppercase tracking-widest"
            style={{ fontFamily: mono, color: accent }}
          >
            Selected Work
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <CaseStudyCard slug="video-content-classification" />
            <CaseStudyCard slug="egocentric-video-collection" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ConntourPageClientProps {
  datasetSection: React.ReactNode;
  videoSection: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Main page client component
// ---------------------------------------------------------------------------

export default function ConntourPageClient({
  datasetSection,
  videoSection,
}: ConntourPageClientProps) {
  return (
    <ProspectPageProvider
      value={{
        companyName: COMPANY_NAME,
        recipientName: RECIPIENT_NAME,
        createdAt: PAGE_CREATED,
      }}
    >
      <ExpiryGate createdAt={PAGE_CREATED}>
        <ProspectTracking
          companySlug={COMPANY_SLUG}
          companyName={COMPANY_NAME}
        />

        <SectionTracker companySlug={COMPANY_SLUG} sectionName="hero">
          <Hero />
        </SectionTracker>

        <SectionTracker companySlug={COMPANY_SLUG} sectionName="how-we-help">
          <FadeInSection>
            <HowWeCanHelp />
          </FadeInSection>
        </SectionTracker>

        {/* Sample Videos */}
        <SectionTracker companySlug={COMPANY_SLUG} sectionName="video-samples">
          <FadeInSection>
            {videoSection}
          </FadeInSection>
        </SectionTracker>

        <SectionTracker companySlug={COMPANY_SLUG} sectionName="differentiators">
          <FadeInSection>
            <HowWeWork />
          </FadeInSection>
        </SectionTracker>

        <SectionTracker companySlug={COMPANY_SLUG} sectionName="workforce-stats">
          <FadeInSection>
            <WorkforceStats />
          </FadeInSection>
        </SectionTracker>

        <SectionTracker companySlug={COMPANY_SLUG} sectionName="datasets">
          <FadeInSection>
            <section className="px-6 py-12 md:px-8 md:py-16 lg:px-12">
              <div className="mx-auto max-w-[900px]">{datasetSection}</div>
            </section>
          </FadeInSection>
        </SectionTracker>

        <SectionTracker companySlug={COMPANY_SLUG} sectionName="book-a-call">
          <div id="book-a-call">
            <FadeInSection>
              <CalendlyEmbed />
            </FadeInSection>
          </div>
        </SectionTracker>

        <ProspectFooter />
      </ExpiryGate>
    </ProspectPageProvider>
  );
}
