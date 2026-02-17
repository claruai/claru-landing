"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Users, Shield } from "lucide-react";
import TextScramble from "../effects/TextScramble";

const offerings = [
  {
    number: "01",
    title: "The Golden Set",
    subtitle: "The Ruler for Your Reality.",
    description:
      "You can't improve what you can't measure. We build pristine, expert-verified \"Answer Keys\" that serve as the undeniable ground truth for your model's evaluation.",
    tagline: "Stop grading on a curve.",
    icon: Zap,
    ascii: "◆",
  },
  {
    number: "02",
    title: "The Embedded Squad",
    subtitle: "Aligned, Not Arms-Length.",
    description:
      'Lease a dedicated pod of pre-aligned experts who stay close to your team, share your context, and iterate fast. No "Project Managers" in the middle. Just engineers talking to experts.',
    tagline: "End the game of telephone.",
    icon: Users,
    ascii: "◇",
  },
  {
    number: "03",
    title: "The Frontier Standard",
    subtitle: "Battle-Tested Methodologies.",
    description:
      "We don't guess at quality. We install the exact operational playbooks, QA hierarchies, and dispute flows used to build the world's leading models.",
    tagline: "Skip the learning curve.",
    icon: Shield,
    ascii: "◈",
  },
];

export default function Wedge() {
  return (
    <section
      id="offerings"
      className="section relative overflow-hidden bg-transparent"
    >
      {/* ASCII decoration */}
      <div className="absolute top-8 left-8 text-[var(--accent-secondary)] opacity-10 font-mono text-xs hidden lg:block">
        <pre>{`┌─ OFFERINGS ─┐
│ 01 02 03    │
└─────────────┘`}</pre>
      </div>

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
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
            {"// WHAT WE DELIVER"}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            You don&apos;t need more data.{" "}
            <span className="italic text-[var(--accent-secondary)]">
              <TextScramble text="You need Truth." scrambleOnHover={true} />
            </span>
          </h2>
        </motion.div>

        {/* Offerings Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {offerings.map((offering, index) => (
            <OfferingCard
              key={offering.number}
              offering={offering}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface OfferingCardProps {
  offering: (typeof offerings)[0];
  index: number;
}

function OfferingCard({ offering, index }: OfferingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = offering.icon;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="h-full flex flex-col p-8 rounded-2xl bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] relative overflow-hidden group"
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-[-1px] rounded-2xl"
            style={{
              background: `linear-gradient(135deg, var(--accent-primary), transparent, var(--accent-primary))`,
              opacity: 0.5,
            }}
          />
        </div>

        {/* Background pattern on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(146, 176, 144, 0.1) 0%, transparent 50%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/20 flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
              </motion.div>
              <span className="font-mono text-xs text-[var(--accent-primary)]">
                {offering.ascii}
              </span>
            </div>
            <span className="font-mono text-sm text-[var(--text-muted)]">
              {offering.number}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            <TextScramble text={offering.title} scrambleOnHover={true} />
          </h3>

          {/* Subtitle */}
          <p className="text-[var(--accent-primary)] text-sm font-mono mb-4">
            {offering.subtitle}
          </p>

          {/* Description */}
          <p className="text-[var(--text-secondary)] mb-6 flex-grow text-sm leading-relaxed">
            {offering.description}
          </p>

          {/* Tagline */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <p className="text-sm text-[var(--text-tertiary)] italic">
              {offering.tagline}
            </p>
            <motion.span
              className="text-[var(--accent-primary)] font-mono text-xs"
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              →
            </motion.span>
          </div>
        </div>

        {/* Corner ASCII decoration */}
        <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[var(--accent-primary)] opacity-20">
          [{offering.number}]
        </div>
      </motion.div>
    </motion.div>
  );
}
