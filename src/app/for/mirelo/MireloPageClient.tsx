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
const COMPANY_SLUG = "mirelo";
const COMPANY_NAME = "Mirelo";
const RECIPIENT_NAME = "CJ";

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
          Video Data &amp; Annotation{" "}
          <span style={{ color: accent }}>for Audio Models</span>
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
            &mdash;we built the annotation and data infrastructure behind{" "}
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
            Video-to-audio is a data-intensive problem &mdash; diverse video
            across environments, precise temporal alignment, quality at scale.
            We think we could help. Here&apos;s how.
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
    title: "Diverse Video Data",
    description:
      "We've captured thousands of hours of real-world video across 14 countries and dozens of environment types — kitchens, workshops, streets, offices, studios. If your models need diverse scenes with varied acoustic properties, we can source and deliver the raw video.",
  },
  {
    number: "02",
    title: "Temporal Annotation & Alignment",
    description:
      "Our annotation teams can label temporal relationships within video — event boundaries, scene transitions, action segments — at the precision your audio models need. We co-develop the labeling schema with your research team and run it at scale with structured QA.",
  },
  {
    number: "03",
    title: "Continuous Data Pipeline",
    description:
      "As your models improve and your data requirements evolve, we can run an ongoing collection and annotation pipeline — new environments, new scenarios, new edge cases — without you rebuilding the operation each time.",
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
      "We work as an extension of your team — co-developing guidelines, sitting in your Slack, iterating on edge cases together. Not a black-box vendor you throw tasks over the wall to.",
  },
  {
    title: "Built for AI Teams",
    description:
      "We came from an AI lab, so we understand the feedback loops between annotation quality and model performance. Our QA isn't just checking boxes — it's designed to catch the errors that actually hurt your model.",
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
            <CaseStudyCard slug="video-quality-at-scale" />
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

interface MireloPageClientProps {
  datasetSection: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Main page client component
// ---------------------------------------------------------------------------

export default function MireloPageClient({
  datasetSection,
}: MireloPageClientProps) {
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

        {/* Hero */}
        <SectionTracker companySlug={COMPANY_SLUG} sectionName="hero">
          <Hero />
        </SectionTracker>

        {/* How We Can Help */}
        <SectionTracker companySlug={COMPANY_SLUG} sectionName="how-we-help">
          <FadeInSection>
            <HowWeCanHelp />
          </FadeInSection>
        </SectionTracker>

        {/* What Makes Us Different + Selected Work */}
        <SectionTracker companySlug={COMPANY_SLUG} sectionName="differentiators">
          <FadeInSection>
            <HowWeWork />
          </FadeInSection>
        </SectionTracker>

        {/* Workforce Stats */}
        <SectionTracker companySlug={COMPANY_SLUG} sectionName="workforce-stats">
          <FadeInSection>
            <WorkforceStats />
          </FadeInSection>
        </SectionTracker>

        {/* Datasets */}
        <SectionTracker companySlug={COMPANY_SLUG} sectionName="datasets">
          <FadeInSection>
            <section className="px-6 py-12 md:px-8 md:py-16 lg:px-12">
              <div className="mx-auto max-w-[900px]">{datasetSection}</div>
            </section>
          </FadeInSection>
        </SectionTracker>

        {/* Book a Call */}
        <SectionTracker companySlug={COMPANY_SLUG} sectionName="book-a-call">
          <div id="book-a-call">
            <FadeInSection>
              <CalendlyEmbed />
            </FadeInSection>
          </div>
        </SectionTracker>

        {/* Footer */}
        <ProspectFooter />
      </ExpiryGate>
    </ProspectPageProvider>
  );
}
