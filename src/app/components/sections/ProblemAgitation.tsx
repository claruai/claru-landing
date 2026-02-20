"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { AlertTriangle, Database, Clock } from "lucide-react";
import FadeIn from "../effects/FadeIn";

const SectionAsciiShader = dynamic(
  () =>
    import("../effects/ShaderBackground").then((mod) => mod.SectionAsciiShader),
  { ssr: false },
);

interface PainPoint {
  number: string;
  icon: typeof AlertTriangle;
  title: string;
  description: string;
}

const painPoints: PainPoint[] = [
  {
    number: "01",
    icon: Database,
    title: "The data you need doesn't exist yet",
    description:
      "Egocentric video, manipulation trajectories, sim-to-real environments — you can't scrape this from the internet. Someone has to design the capture, build the pipeline, and collect it.",
  },
  {
    number: "02",
    icon: AlertTriangle,
    title: "Your vendor has never seen your model",
    description:
      "Upload data, wait a week, fix labels, then build the pipeline to make it training-ready. Vendors who never see your model can't understand your edge cases.",
  },
  {
    number: "03",
    icon: Clock,
    title: "One bad frame breaks the trajectory",
    description:
      "Robotics and video models don't tolerate noise. Egocentric capture, manipulation sequences, sim-to-real validation — this data is scarce, expensive, and unforgiving of error.",
  },
];

export default function ProblemAgitation() {
  return (
    <section
      id="problem"
      className="section relative overflow-hidden bg-transparent"
    >
      {/* ASCII shader background */}
      <SectionAsciiShader />

      {/* ASCII decoration */}
      <div className="absolute top-8 left-8 text-[var(--accent-secondary)] opacity-10 font-mono text-xs hidden lg:block">
        <pre>{`┌─ CHALLENGE ──┐
│ ▲ WARNING    │
└──────────────┘`}</pre>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-16 md:mb-20">
          <motion.span
            className="inline-block text-sm font-mono text-[var(--accent-secondary)] mb-4 uppercase tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {"// THE PROBLEM"}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            Video and robotics AI need{" "}
            <span className="italic text-[var(--accent-secondary)]">
              a different kind of data team.
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            You can&apos;t outsource this to a ticket queue. You need people
            close enough to understand what your model is actually learning.
          </p>
        </FadeIn>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {painPoints.map((point, index) => (
            <PainPointCard key={point.number} point={point} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PainPointCardProps {
  point: PainPoint;
  index: number;
}

function PainPointCard({ point, index }: PainPointCardProps) {
  const Icon = point.icon;

  return (
    <FadeIn delay={index * 0.15}>
      <motion.div
        className="h-full flex flex-col p-6 md:p-8 rounded-2xl bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] relative overflow-hidden group"
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Warning stripe accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-tertiary)] via-[var(--accent-primary)] to-[var(--accent-tertiary)] opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Background pattern on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(146, 176, 144, 0.08) 0%, transparent 50%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/15 border border-[var(--border-accent)] flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
            </motion.div>
            <span className="font-mono text-sm text-[var(--text-muted)]">
              {point.number}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-[var(--text-primary)] leading-tight">
            {point.title}
          </h3>

          {/* Description */}
          <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed">
            {point.description}
          </p>
        </div>

        {/* Corner decoration */}
        <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[var(--accent-primary)] opacity-20">
          [{point.number}]
        </div>
      </motion.div>
    </FadeIn>
  );
}
