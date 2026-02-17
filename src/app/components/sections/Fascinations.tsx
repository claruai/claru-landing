"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Button from "../ui/Button";

// TLP Framework: 18+ Fascination bullets using varied filters
const fascinations = [
  // J1 - Mechanism
  {
    text: "How specialist annotators catch temporal drift across 10K+ frame sequences that crowdsourced reviewers miss entirely",
    filter: "mechanism",
  },
  // J2 - Statement
  {
    text: "Why video generation labs are hiring from post-production studios instead of annotation farms",
    filter: "statement",
  },
  // J3 - What
  {
    text: "What actually breaks when you scale robotics datasets without egocentric capture expertise",
    filter: "what",
  },
  // J4 - What never
  {
    text: "What never works for frame-level RLHF — and the embedded workflow that does",
    filter: "what-never",
  },
  // J5 - Embedded
  {
    text: "The difference between a vendor behind a portal and a team closely aligned with yours, resolving annotation edge cases in hours instead of weeks",
    filter: "embedded",
  },
  // J6 - Why
  {
    text: "Why motion continuity labeling requires annotators who think in sequences, not bounding boxes",
    filter: "why",
  },
  // J7 - When
  {
    text: "When to use synthetic generation vs. licensed egocentric capture for manipulation data",
    filter: "when",
  },
  // J8 - Specific Question
  {
    text: "Can your current vendor understand your architecture deeply enough to adjust guidelines the same day?",
    filter: "question",
  },
  // J9 - If/Then
  {
    text: "If your annotation team doesn't think in frame sequences, they can't label temporal consistency",
    filter: "if-then",
  },
  // J10 - Pipeline
  {
    text: "From egocentric video capture to red-teaming — the full pipeline most vendors can't touch",
    filter: "pipeline",
  },
  // J11 - Number
  {
    text: "3 places sim-to-real robotics datasets silently degrade (and how to catch them before training)",
    filter: "number",
  },
  // J12 - Big Promise
  {
    text: "How one lab went from zero training data to production-ready video dataset in 8 weeks with an embedded Claru team",
    filter: "big-promise",
  },
  // J13 - How
  {
    text: "How to iterate on annotation guidelines in real-time instead of waiting for the next batch cycle",
    filter: "how",
  },
  // J14 - Caution
  {
    text: "CAUTION: The scene-transition labeling errors that compound across long-form video generation",
    filter: "caution",
  },
  // J15 - Truth
  {
    text: "The truth about 'end-to-end data platforms' — and why video/robotics labs keep switching to embedded teams",
    filter: "truth",
  },
  // J16 - Best
  {
    text: "The single best signal that your annotation partner actually understands video: they ask about frame rate before label schema",
    filter: "best",
  },
  // J17 - Surprising
  {
    text: "Why the labs with the smallest datasets are shipping the best robotics models",
    filter: "surprising",
  },
  // J18 - Are you
  {
    text: "Are your annotators labeling each frame independently? That's why your video model hallucinates on transitions",
    filter: "are-you",
  },
];

export default function Fascinations() {
  return (
    <section
      id="fascinations"
      className="section relative overflow-hidden bg-transparent"
    >
      {/* Section divider */}
      <div className="section-divider mb-16 md:mb-24" />

      {/* ASCII decoration */}
      <div className="absolute top-8 right-8 text-[var(--accent-secondary)] opacity-10 font-mono text-xs hidden lg:block text-right">
        <pre>{`┌─ INSIGHTS ────┐
│ ★ EXCLUSIVE   │
│ ▶ LEARN MORE  │
└───────────────┘`}</pre>
      </div>

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-sm font-mono text-[var(--accent-secondary)] mb-4 uppercase tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {"// FROM THE FIELD"}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            What We See Inside{" "}
            <span className="italic text-[var(--accent-secondary)]">
              Video and Robotics Labs
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            Patterns from embedding with teams building at the frontier of
            multimodal AI.
          </p>
        </motion.div>

        {/* Fascinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-12">
          {fascinations.map((fascination, index) => (
            <FascinationCard
              key={index}
              fascination={fascination}
              index={index}
            />
          ))}
        </div>

        {/* CTA - TLP Framework */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-[var(--text-secondary)] mb-6 font-mono text-sm">
            Want to see how this applies to your stack?
          </p>
          <Button href="#contact" variant="cta-glitch" size="lg">
            Talk to Our Team
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

interface FascinationCardProps {
  fascination: { text: string; filter: string };
  index: number;
}

function FascinationCard({ fascination, index }: FascinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="h-full p-5 rounded-lg bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] relative overflow-hidden group cursor-default"
        whileHover={{
          borderColor: "var(--accent-primary)",
          backgroundColor: "rgba(146, 176, 144, 0.08)",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Hover glow */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10 flex items-start gap-3">
          <motion.div
            className="flex-shrink-0 w-6 h-6 rounded bg-[var(--accent-primary)]/15 flex items-center justify-center mt-0.5"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Zap className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </motion.div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
            {fascination.text}
          </p>
        </div>

        {/* Corner decoration */}
        <div className="absolute bottom-2 right-2 font-mono text-[8px] text-[var(--accent-primary)] opacity-20 group-hover:opacity-40 transition-opacity">
          [{String(index + 1).padStart(2, "0")}]
        </div>
      </motion.div>
    </motion.div>
  );
}
