"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Joystick,
  Gamepad2,
  Layers,
  Box,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import TextScramble from "../effects/TextScramble";

const projects = [
  {
    icon: Video,
    title: "Egocentric Video Capture",
    metric: "Global collection, multi-device, real-world environments",
    description:
      "First-person video data captured by domain specialists wearing head-mounted cameras in real-world environments.",
    slug: "egocentric-video-collection",
  },
  {
    icon: Joystick,
    title: "Manipulation Trajectory Data",
    metric: "Fine-grained kinematic capture and task decomposition",
    description:
      "Granular robotic manipulation recordings with full kinematic annotations and task decomposition.",
    slug: "data-engine-world-models",
  },
  {
    icon: Gamepad2,
    title: "Game Environment Capture",
    metric: "Proprietary capture platform, on-demand volume",
    description:
      "Structured gameplay data from our proprietary capture platform across diverse game environments.",
    slug: "game-based-data-capture",
  },
  {
    icon: Layers,
    title: "Multi-Modal Annotation",
    metric: "Frame-level video, spatial, and preference annotation",
    description:
      "Expert-labeled datasets combining video, spatial, and preference annotations with continuous quality assurance.",
    slug: "fashion-ai-annotation",
  },
  {
    icon: Box,
    title: "Synthetic Data Pipelines",
    metric: "Unreal and Omniverse, sim-to-real validated",
    description:
      "Photorealistic synthetic data generation with domain-randomization and validated sim-to-real transfer.",
    slug: "video-model-evaluation",
  },
  {
    icon: Shield,
    title: "AI Safety & Red Teaming",
    metric: "Multi-modal content moderation and adversarial testing",
    description:
      "Content moderation systems built, calibrated, and stress-tested across text and video for production generative AI.",
    slug: "generative-ai-safety",
  },
];

export default function ProofOfWork() {
  return (
    <section
      id="proof-of-work"
      className="section relative overflow-hidden bg-transparent"
    >
      {/* Section divider */}
      <div className="section-divider mb-16 md:mb-24" />

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
            {"// WHAT WE'VE SHIPPED"}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            Built for labs training at the frontier.
          </h2>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* Bottom Link */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-mono text-sm hover:gap-3 transition-all duration-300 group"
            >
              View all case studies
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="hidden sm:inline text-[var(--text-muted)] font-mono text-xs">|</span>
            <Link
              href="/data-catalog"
              className="inline-flex items-center gap-2 text-[var(--text-secondary)] font-mono text-sm hover:text-[var(--accent-primary)] hover:gap-3 transition-all duration-300 group"
            >
              Explore data catalog
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: (typeof projects)[0];
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = project.icon;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="h-full flex flex-col p-6 md:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] relative overflow-hidden group"
        whileHover={{
          y: -6,
          borderColor: "var(--accent-primary)",
          boxShadow: "0 0 40px rgba(146, 176, 144, 0.15)",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated top line on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon + Index */}
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/15 border border-[var(--border-accent)] flex items-center justify-center"
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
            </motion.div>
            <span className="font-mono text-[10px] text-[var(--accent-primary)] opacity-40">
              0{index + 1}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold mb-2 text-[var(--text-primary)]">
            {isHovered ? (
              <TextScramble text={project.title} autoPlay delay={0} />
            ) : (
              project.title
            )}
          </h3>

          {/* Metric */}
          <p className="text-xs font-mono text-[var(--accent-secondary)] mb-3 leading-relaxed">
            {project.metric}
          </p>

          {/* Description */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-grow mb-4">
            {project.description}
          </p>

          {/* Case study link */}
          <Link
            href={`/case-studies/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-primary)] hover:gap-2.5 transition-all duration-300"
          >
            Read case study
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Corner decoration */}
        <div className="absolute bottom-3 right-3 opacity-20">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-[var(--accent-primary)]"
          >
            <path
              d="M0 16L16 0M5 16L16 5M10 16L16 10"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
