"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { TrendingUp, Target, Briefcase } from "lucide-react";
import TextScramble, { GlitchText } from "../effects/TextScramble";
import { RevealOnScroll } from "../effects/ScrollAnimations";

const testimonials = [
  {
    quote:
      "We needed egocentric video data that didn't exist yet and a team who could label it with robotics-grade precision. Claru handled both — from capture protocol design to frame-level annotation. Eight weeks from kickoff to production-ready dataset, zero vendor switching.",
    author: "Founder & CEO",
    backing: "Khosla Ventures & General Catalyst backed startup",
  },
  {
    quote:
      "The difference is night and day. With our previous vendor, we'd wait a week for labeled data, then spend another week fixing errors. With Claru, the team stays tightly aligned with ours. When there's an edge case, we work through it together in real-time.",
    author: "Senior Research Scientist",
    backing: "NVIDIA backed VLM lab",
  },
  {
    quote:
      "Most annotation vendors give you a portal and a prayer. Claru gave us a dedicated team who actually understood what we were building. They caught edge cases our internal QA missed and helped us define annotation guidelines that scaled.",
    author: "Principal Research Engineer",
    backing: "Bessemer Ventures backed company",
  },
  {
    quote:
      "We needed to go from zero training data to production-ready dataset in 8 weeks. Claru sourced the raw video, structured the annotation pipeline, and embedded reviewers who caught edge cases our internal QA missed. One team, end to end.",
    author: "Founder",
    backing: "YC backed company, Series A",
  },
];

const metrics = [
  {
    value: "8 wk",
    label: "avg. time from zero data to production dataset",
    icon: TrendingUp,
  },
  {
    value: "100%",
    label: "embedded — closely aligned with your eng team",
    icon: Target,
  },
  {
    value: "Full",
    label: "pipeline — from capture to red team",
    icon: Briefcase,
  },
];

export default function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      id="testimonials"
      className="section relative overflow-hidden bg-transparent"
    >
      {/* Section divider */}
      <div className="section-divider mb-16 md:mb-24" />

      {/* Background decoration */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[var(--accent-primary)]/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-[var(--accent-primary)]/3 blur-2xl" />
        </div>
      </motion.div>

      <div className="container relative">
        {/* Section Header */}
        <RevealOnScroll
          animation="slide-up"
          className="text-center mb-12 md:mb-16"
        >
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            {isInView ? (
              <GlitchText
                text="What it feels like to work with us"
                className="text-[var(--text-primary)]"
                glitchOnHover
              />
            ) : (
              <span className="text-[var(--text-primary)]">
                What it feels like to work with us
              </span>
            )}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            From labs training at the frontier.
          </p>
        </RevealOnScroll>

        {/* Metrics Section */}
        <RevealOnScroll animation="slide-up" className="mb-16 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {metrics.map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index} />
            ))}
          </div>
        </RevealOnScroll>

        {/* Testimonials - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author + index}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface MetricCardProps {
  metric: {
    value: string;
    label: string;
    icon: typeof TrendingUp;
  };
  index: number;
}

function MetricCard({ metric, index }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = metric.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative p-6 md:p-8 text-center border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden group"
        whileHover={{
          borderColor: "var(--accent-primary)",
          boxShadow: "0 0 40px rgba(146, 176, 144, 0.15)",
        }}
      >
        {/* Animated top line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Icon */}
        <motion.div
          className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>

        {/* Value */}
        <div className="mb-2">
          <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--accent-primary)] font-mono">
            {isHovered ? (
              <TextScramble text={metric.value} autoPlay delay={0} />
            ) : (
              metric.value
            )}
          </span>
        </div>

        {/* Label */}
        <p className="text-[var(--text-secondary)] text-sm md:text-base font-mono">
          {metric.label}
        </p>

        {/* Corner decoration */}
        <div className="absolute bottom-2 right-2 opacity-20">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-[var(--accent-primary)]"
          >
            <path
              d="M0 20L20 0M6 20L20 6M12 20L20 12"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <motion.div
        className="relative p-6 md:p-8 overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] h-full flex flex-col"
        whileHover={{
          borderColor: "var(--accent-primary)",
          boxShadow: "0 0 40px rgba(146, 176, 144, 0.1)",
        }}
      >
        {/* Scan line effect */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />

        {/* Large quotation mark - visible */}
        <div className="mb-4">
          <span className="text-4xl md:text-5xl font-serif text-[var(--accent-primary)] opacity-60 leading-none">
            &ldquo;
          </span>
        </div>

        {/* Quote Text */}
        <blockquote className="text-base md:text-lg leading-relaxed mb-6 text-[var(--text-secondary)] flex-grow">
          {testimonial.quote}
        </blockquote>

        {/* Attribution */}
        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
          {/* Avatar */}
          <motion.div
            className="w-10 h-10 flex items-center justify-center font-mono text-xs bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {testimonial.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </motion.div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-[var(--text-primary)] text-sm">
              {isHovered ? (
                <TextScramble text={testimonial.author} autoPlay delay={0} />
              ) : (
                testimonial.author
              )}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] font-mono truncate">
              {testimonial.backing}
            </p>
          </div>
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
