"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CalendlyContext } from "../providers/CalendlyProvider";
import Button from "../ui/Button";

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------

function useAnimatedCounter(
  target: number,
  duration: number,
  isInView: boolean,
  decimals: number = 0,
) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, target, duration, decimals]);

  return value;
}

// ---------------------------------------------------------------------------
// Stat item
// ---------------------------------------------------------------------------

function StatItem({
  target,
  suffix,
  label,
  decimals,
  isInView,
}: {
  target: number;
  suffix: string;
  label: string;
  decimals?: number;
  isInView: boolean;
}) {
  const value = useAnimatedCounter(target, 1.5, isInView, decimals);

  return (
    <div className="text-center">
      <span className="text-3xl md:text-5xl font-bold text-white">
        {value}
        {suffix}
      </span>
      <p className="font-mono text-xs text-[var(--text-tertiary)] mt-2">
        {label}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Domain pills
// ---------------------------------------------------------------------------

const domains = [
  "Video Evaluation",
  "Computer Vision",
  "Speech & Audio",
  "Code & Math",
  "Document Understanding",
  "Image Generation",
  "Safety & Moderation",
  "Large-Scale Pretraining",
  "Multimodal Chat",
  "E-commerce",
  "Egocentric Video",
  "Game Capture",
];

// ---------------------------------------------------------------------------
// Featured datasets — two rows, strongest originals
// ---------------------------------------------------------------------------

const row1Datasets = [
  {
    id: "r1-0",
    category: "E-COMMERCE",
    name: "Product Image Data",
    teaser: "395K+ SKU images with structured product taxonomy",
    description:
      "E-commerce product imagery with structured annotations including product and lifestyle image classification, detailed captions, bounding boxes, brand identification, category labels, shot type, and quality assessment.",
    badge: null,
  },
  {
    id: "r1-1",
    category: "EGOCENTRIC VIDEO",
    name: "Egocentric Activity Capture",
    teaser: "386K+ first-person video samples across 14 countries",
    description:
      "Large-scale first-person video capture of everyday activities, object manipulation, workplace tasks, and transportation scenes. Collected via GoPro, DJI, smartphone, and dashcam cameras across diverse global environments.",
    badge: null,
  },
  {
    id: "r1-2",
    category: "DOCUMENT UNDERSTANDING",
    name: "Synthetic OCR & Rendered Text",
    teaser: "20M+ rendered text images for OCR training",
    description:
      "Millions of synthetically rendered text images with character-level and line-level annotations. Includes diverse fonts, rotations, lighting conditions, and background textures for robust OCR model training.",
    badge: "SYNTHETIC",
  },
];

const row2Datasets = [
  {
    id: "r2-0",
    category: "SPEECH & AUDIO",
    name: "Text-to-Speech Training Data",
    teaser: "6.5M+ text-audio pairs across diverse content",
    description:
      "Large-scale text-audio paired data for training text-to-speech and speech understanding models. Covers diverse reading styles, pacing, and content domains derived from long-form spoken content.",
    badge: "SYNTHETIC",
  },
  {
    id: "r2-1",
    category: "CODE & MATH",
    name: "Code Instruction Tuning",
    teaser: "3.6M+ code generation and comprehension samples",
    description:
      "High-quality instruction-following data for code generation, comprehension, SQL queries, and programming tasks across multiple languages and difficulty levels.",
    badge: "SYNTHETIC",
  },
  {
    id: "r2-2",
    category: "GAME CAPTURE",
    name: "Game Environment Capture",
    teaser: "66K+ screen-captured gameplay from 3D worlds",
    description:
      "Screen-captured gameplay footage from first-person shooter environments and interactive 3D worlds. Proprietary capture platform enables on-demand volume for simulation and world model training.",
    badge: null,
  },
];

type FeaturedDataset = (typeof row1Datasets)[number];

// ---------------------------------------------------------------------------
// Marquee card (compact, accordion)
// ---------------------------------------------------------------------------

function MarqueeCard({
  dataset,
  isOpen,
  onToggle,
}: {
  dataset: FeaturedDataset;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const calendly = useContext(CalendlyContext);

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[320px]">
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--accent-primary)]/30 transition-colors duration-200">
        <button
          type="button"
          onClick={onToggle}
          className="w-full text-left px-4 py-3 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[9px] text-[var(--accent-primary)] uppercase tracking-wider">
                  {dataset.category}
                </span>
                {dataset.badge && (
                  <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-px rounded-full border border-[var(--accent-primary)]/20 text-[var(--accent-primary)]/60 bg-[var(--accent-primary)]/5">
                    {dataset.badge}
                  </span>
                )}
              </div>
              <h4 className="text-[13px] font-semibold text-white leading-snug">
                {dataset.name}
              </h4>
              <p className="font-mono text-[10px] text-[var(--text-tertiary)] mt-0.5">
                {dataset.teaser}
              </p>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="mt-0.5 flex-shrink-0"
            >
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 border-t border-[var(--border-subtle)]/50">
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-2.5 mb-2.5">
                  {dataset.description}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    calendly?.openCalendly();
                  }}
                  className="font-mono text-[10px] text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80 transition-colors cursor-pointer"
                >
                  Request Access &rarr;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auto-scrolling marquee row
// ---------------------------------------------------------------------------

function MarqueeRow({
  datasets,
  direction,
  openCard,
  onToggle,
  isPaused,
  onPause,
  onResume,
}: {
  datasets: FeaturedDataset[];
  direction: "left" | "right";
  openCard: string | null;
  onToggle: (id: string) => void;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
}) {
  // Duplicate the array for seamless loop
  const items = [...datasets, ...datasets];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
    >
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `marquee-${direction} ${datasets.length * 12}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {items.map((dataset, i) => (
          <MarqueeCard
            key={`${dataset.id}-${i}`}
            dataset={dataset}
            isOpen={openCard === `${dataset.id}-${i}`}
            onToggle={() => onToggle(`${dataset.id}-${i}`)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CatalogPreview() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.5 });
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="section relative overflow-hidden bg-transparent py-16 md:py-24">
      {/* Marquee keyframes */}
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Section label */}
          <motion.span
            className="block font-mono text-sm text-[var(--accent-primary)] mb-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {"// DATA LIBRARY"}
          </motion.span>

          {/* Animated stat counters */}
          <motion.div
            ref={statsRef}
            className="grid grid-cols-3 gap-6 mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <StatItem
              target={3.7}
              suffix="M+"
              label="human annotations"
              decimals={1}
              isInView={isInView}
            />
            <StatItem
              target={25}
              suffix="+"
              label="datasets"
              isInView={isInView}
            />
            <StatItem
              target={8}
              suffix=""
              label="modalities"
              isInView={isInView}
            />
          </motion.div>

          {/* Domain pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {domains.map((domain, i) => (
              <motion.span
                key={domain}
                className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)] transition-all duration-200 cursor-default"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
              >
                {domain}
              </motion.span>
            ))}
          </motion.div>

          {/* Copy line */}
          <motion.p
            className="text-center text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-10 md:mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Purpose-built and synthetic training data spanning every modality
            frontier labs need — from raw capture to training-ready shards.
          </motion.p>
        </div>

        {/* Two-row auto-scrolling marquee */}
        <motion.div
          className="space-y-3 mb-12 md:mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Row 1 — scrolls left */}
          <MarqueeRow
            datasets={row1Datasets}
            direction="left"
            openCard={openCard}
            onToggle={(id) => setOpenCard(openCard === id ? null : id)}
            isPaused={isPaused}
            onPause={() => setIsPaused(true)}
            onResume={() => {
              setOpenCard(null);
              setIsPaused(false);
            }}
          />

          {/* Row 2 — scrolls right */}
          <MarqueeRow
            datasets={row2Datasets}
            direction="right"
            openCard={openCard}
            onToggle={(id) => setOpenCard(openCard === id ? null : id)}
            isPaused={isPaused}
            onPause={() => setIsPaused(true)}
            onResume={() => {
              setOpenCard(null);
              setIsPaused(false);
            }}
          />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button href="/data-catalog">Explore Full Catalog</Button>
          <Button variant="secondary" calendly>
            Book a Call
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
