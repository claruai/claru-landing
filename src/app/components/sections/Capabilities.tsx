"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { Video, Eye, Bot } from "lucide-react";
import TextScramble from "../effects/TextScramble";
import Button from "../ui/Button";

const SectionAsciiShader = dynamic(
  () =>
    import("../effects/ShaderBackground").then((mod) => mod.SectionAsciiShader),
  { ssr: false },
);

const capabilities = [
  {
    icon: Video,
    title: "Video AI",
    description:
      "Specialist annotators who think in frame sequences — including VFX and post-production professionals. Temporal consistency, motion continuity, and action recognition labeled with real expertise.",
    asciiIcon: `
    ┌─────────┐
    │ ▶ ◼ ⏸  │
    │ ══════ │
    │ frame→ │
    └─────────┘
    `,
    items: [
      "Frame-level temporal annotation",
      "Scene transition & continuity labeling",
      "RLHF for video generation models",
    ],
    gradient: "from-cyan-500/20 to-blue-500/10",
  },
  {
    icon: Eye,
    title: "Vision AI",
    description:
      "Segmentation, spatial reasoning, and visual QA — from annotators closely aligned with your team. Guidelines iterate in real-time, not on the next batch cycle.",
    asciiIcon: `
    ┌─────────┐
    │  ◉   ◉  │
    │ ┌─────┐ │
    │ │pixel│ │
    └─┴─────┴─┘
    `,
    items: [
      "Dense segmentation & object detection",
      "Visual question-answer pair curation",
      "Spatial relationship & affordance labeling",
    ],
    gradient: "from-green-500/20 to-emerald-500/10",
  },
  {
    icon: Bot,
    title: "Robotics & Embodied AI",
    description:
      "Egocentric capture, manipulation sequences, sim-to-real bridging. We source the data, label it, and validate it — end to end, from capture to red team.",
    asciiIcon: `
    ┌─────────┐
    │  [═══]  │
    │   ╱╲    │
    │  ╱  ╲   │
    │ ═    ═  │
    └─────────┘
    `,
    items: [
      "Egocentric manipulation annotation",
      "Sim-to-real validation & benchmarking",
      "Physical reasoning & affordance datasets",
    ],
    gradient: "from-purple-500/20 to-pink-500/10",
  },
];

export default function Capabilities() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section
      id="capabilities"
      className="relative bg-transparent py-24 md:py-32 overflow-hidden"
    >
      {/* ASCII shader background */}
      <SectionAsciiShader />

      {/* Section divider */}
      <div className="section-divider" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Three Modalities.{" "}
            {isInView ? (
              <TextScramble
                text="One Embedded Team."
                className="text-[var(--accent-primary)]"
                autoPlay
                delay={500}
              />
            ) : (
              <span className="text-[var(--accent-primary)]">
                One Embedded Team.
              </span>
            )}
          </h2>
          <p className="text-xl text-[var(--text-secondary)] font-mono max-w-2xl mx-auto">
            Domain-specialist annotators aligned with your team, not behind a portal.
          </p>
        </motion.div>

        {/* Three-column grid on desktop, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.title}
              capability={capability}
              index={index}
            />
          ))}
        </div>

        {/* CTA - TLP Framework */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button href="#contact" variant="cta-glitch" size="md">
            Embed a Team for Your Modality →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

interface CapabilityCardProps {
  capability: (typeof capabilities)[0];
  index: number;
}

function CapabilityCard({ capability, index }: CapabilityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="card h-full flex flex-col relative overflow-hidden"
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 border border-[var(--accent-primary)] opacity-0"
          animate={{ opacity: isHovered ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Scan line effect on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "left" }}
        />

        {/* Icon Header */}
        <div className="mb-6 relative z-10">
          {/* Lucide Icon */}
          <motion.div
            className="absolute -top-2 -right-2 w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <capability.icon className="w-6 h-6 text-[var(--accent-primary)]" />
          </motion.div>

          {/* ASCII Icon with animation */}
          <motion.pre
            className="font-mono text-[10px] text-[var(--text-tertiary)] leading-tight transition-colors duration-300"
            animate={{
              color: isHovered
                ? "var(--accent-primary)"
                : "var(--text-tertiary)",
            }}
          >
            {capability.asciiIcon}
          </motion.pre>
        </div>

        {/* Title with scramble effect */}
        <h3 className="text-xl font-bold mb-3 relative z-10 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
          {isHovered ? (
            <TextScramble text={capability.title} autoPlay delay={0} />
          ) : (
            capability.title
          )}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] mb-6 relative z-10 leading-relaxed">
          {capability.description}
        </p>

        {/* Items */}
        <ul className="space-y-3 flex-grow relative z-10">
          {capability.items.map((item, itemIndex) => (
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
                &gt;
              </motion.span>
              <span className="text-sm">{item}</span>
            </motion.li>
          ))}
        </ul>

        {/* Bottom accent line with animation */}
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] relative z-10">
          <motion.div
            className="h-0.5 bg-[var(--accent-primary)]"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? "100%" : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Corner decoration */}
        <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="font-mono text-xs text-[var(--accent-primary)]">
            0{index + 1}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
