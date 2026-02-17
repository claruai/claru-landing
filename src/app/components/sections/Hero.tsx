"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import TextScramble from "../effects/TextScramble";

const worksWith = [
  "Video Generation",
  "Vision-Language Models",
  "Robotics & Manipulation",
  "Embodied AI",
  "Autonomous Systems",
  "Egocentric Video",
];

const rotatingTerms = [
  "video",
  "robotics",
  "multimodal",
  "vision",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-transparent"
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--text-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Animated corner accents */}
      <div className="absolute top-20 left-8 opacity-20 hidden lg:block">
        <motion.div
          className="text-[var(--accent-secondary)] font-mono text-xs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span className="block">{"// INIT SEQUENCE"}</span>
          <span className="block text-[var(--text-tertiary)]">
            {"// LOADING..."}
          </span>
          <span className="block">
            {">"} <span className="cursor" />
          </span>
        </motion.div>
      </div>

      <div className="absolute bottom-20 right-8 opacity-20 hidden lg:block">
        <motion.div
          className="text-[var(--accent-secondary)] font-mono text-xs text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="block">v2.0.25</span>
          <span className="block text-[var(--text-tertiary)]">
            STATUS: ACTIVE
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="container relative z-20"
        style={{ opacity: contentOpacity }}
      >
        <div className="max-w-3xl mx-auto text-center px-4 lg:px-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Logo size="lg" className="text-[var(--text-primary)]" />
          </motion.div>

          {/* Primer - TLP Framework */}
          <motion.p
            className="text-sm md:text-base font-mono text-[var(--accent-secondary)] mb-4 uppercase tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            Source. Label. Ship.
          </motion.p>

          {/* Headline with rotating text */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-[var(--text-primary)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Purpose-built data for
            <br className="hidden sm:block" />{" "}
            frontier{" "}
            <span className="text-[var(--accent-secondary)] italic">
              <RotatingText terms={rotatingTerms} interval={3500} />
            </span>{" "}
            labs.
          </motion.h1>

          {/* Subheadline - End-to-end value prop */}
          <motion.p
            className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Training data built to your model&apos;s exact specifications
            —{" "}
            <span className="text-[var(--text-primary)]">
              from raw capture to production-ready dataset.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button href="#contact" variant="cta-glitch" size="lg">
              Request a Sample
            </Button>
            <Button href="#contact" variant="secondary" size="lg">
              Book a Call
            </Button>
          </motion.div>

          {/* Trust Line */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-sm text-[var(--text-tertiary)] font-mono uppercase tracking-wider">
              We work with teams building
            </p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              {worksWith.map((area) => (
                <motion.span
                  key={area}
                  className="text-[var(--text-secondary)] text-sm opacity-60 hover:opacity-100 transition-opacity cursor-default"
                  whileHover={{ scale: 1.05 }}
                >
                  <TextScramble text={area} scrambleOnHover={true} />
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-mono">
            Scroll
          </span>
          <motion.div
            className="w-6 h-10 border border-[var(--border-medium)] rounded-full flex items-start justify-center p-2"
            whileHover={{ borderColor: "var(--accent-primary)" }}
          >
            <motion.div
              className="w-1 h-2 bg-[var(--accent-secondary)] rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade to dark */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[var(--bg-primary)]/80 to-transparent pointer-events-none" />
    </section>
  );
}

function RotatingText({ terms, interval = 3500 }: { terms: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState(terms[0]);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = "!<>-_\\/[]{}=+*^?#________";

  const scrambleTo = useCallback((newText: string) => {
    setIsScrambling(true);
    const length = Math.max(displayText.length, newText.length);
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];

    for (let i = 0; i < length; i++) {
      const from = displayText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      queue.push({ from, to, start, end });
    }

    let frame = 0;
    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          queue[i].char = char;
          output += char;
        } else {
          output += from;
        }
      }

      setDisplayText(output);

      if (complete === queue.length) {
        setDisplayText(newText);
        setIsScrambling(false);
      } else {
        frame++;
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [displayText, chars]);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % terms.length;
      setIndex(nextIndex);
      scrambleTo(terms[nextIndex]);
    }, interval);

    return () => clearInterval(timer);
  }, [index, terms, interval, scrambleTo]);

  return <span className="font-mono">{displayText}</span>;
}
