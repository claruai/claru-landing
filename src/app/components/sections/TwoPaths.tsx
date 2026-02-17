"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Sparkles } from "lucide-react";
import Link from "next/link";
import TextScramble from "../effects/TextScramble";
import Button from "../ui/Button";

const paths = [
  {
    icon: Database,
    title: "Training Data",
    subtitle: "Source. Curate. License.",
    description:
      "Raw data for frontier models — egocentric video, manipulation trajectories, synthetic environments, and licensed datasets. Purpose-built, not scraped.",
    items: [
      "Egocentric & manipulation video capture",
      "Synthetic data generation (Unreal, Omniverse)",
      "Licensed dataset sourcing & curation",
      "Deduplication, alignment & quality scoring",
    ],
    href: "/data",
    cta: "Explore Data Services",
    gradient: "from-cyan-500/20 to-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "Expert Labeling",
    subtitle: "Annotate. Evaluate. Validate.",
    description:
      "Domain-specialist annotators embedded with your team. RLHF, video annotation, red teaming — with real-time feedback loops, not batch cycles.",
    items: [
      "RLHF & preference ranking",
      "Frame-level video & spatial annotation",
      "Red teaming & safety evaluation",
      "Benchmark curation & bias detection",
    ],
    href: "/labeling",
    cta: "Explore Labeling Services",
    gradient: "from-green-500/20 to-emerald-500/10",
  },
];

const modalities = ["Video AI", "Vision AI", "Robotics & Embodied AI"];

export default function TwoPaths() {
  return (
    <section id="services" className="section relative overflow-hidden bg-transparent">
      <div className="container relative z-10">
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
            {"// TWO SERVICES. ONE PARTNER."}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            Most labs buy data from one vendor{" "}
            <br className="hidden sm:block" />
            and hire another to label it.
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            We do both —{" "}
            <span className="italic text-[var(--accent-secondary)]">
              so nothing gets lost in translation.
            </span>
          </p>
        </motion.div>

        {/* Two Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
          {/* Center connector on desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--accent-primary)] flex items-center justify-center">
              <span className="font-mono text-xs text-[var(--accent-primary)]">+</span>
            </div>
          </div>

          {paths.map((path, index) => (
            <PathCard key={path.title} path={path} index={index} />
          ))}
        </div>

        {/* Modality line */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
            Across all three frontiers
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {modalities.map((mod) => (
              <span
                key={mod}
                className="text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-default"
              >
                {mod}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button href="#contact" variant="cta-glitch" size="md">
            Book a Call
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

interface PathCardProps {
  path: (typeof paths)[0];
  index: number;
}

function PathCard({ path, index }: PathCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = path.icon;

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
        className="h-full flex flex-col p-8 md:p-10 rounded-2xl bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] relative overflow-hidden group"
        whileHover={{ y: -6, scale: 1.01 }}
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
          className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/15 border border-[var(--border-accent)] flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
            </motion.div>
            <span className="font-mono text-xs text-[var(--accent-primary)] opacity-60">
              0{index + 1}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--text-primary)]">
            {isHovered ? (
              <TextScramble text={path.title} autoPlay delay={0} />
            ) : (
              path.title
            )}
          </h3>

          {/* Subtitle */}
          <p className="text-[var(--accent-primary)] text-sm font-mono mb-4">
            {path.subtitle}
          </p>

          {/* Description */}
          <p className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed">
            {path.description}
          </p>

          {/* Items */}
          <ul className="space-y-3 mb-8 flex-grow">
            {path.items.map((item, itemIndex) => (
              <motion.li
                key={item}
                className="flex items-start gap-3 text-[var(--text-secondary)]"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: itemIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.span
                  className="text-[var(--accent-primary)] font-mono text-sm mt-0.5"
                  animate={{ x: isHovered ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  +
                </motion.span>
                <span className="text-sm">{item}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Link */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <Link
              href={path.href}
              className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-mono text-sm hover:gap-3 transition-all duration-300"
            >
              {path.cta}
              <motion.span
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                &rarr;
              </motion.span>
            </Link>
          </div>
        </div>

        {/* Corner decoration */}
        <div className="absolute bottom-3 right-3 font-mono text-[10px] text-[var(--accent-primary)] opacity-20">
          [0{index + 1}]
        </div>
      </motion.div>
    </motion.div>
  );
}
