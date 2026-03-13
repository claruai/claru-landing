'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ---------------------------------------------------------------------------
// Workforce stats constants
// ---------------------------------------------------------------------------

const WORKFORCE_STATS = [
  { target: 2000, suffix: '+', label: 'Annotators', decimals: 0, prefix: '' },
  { target: 14, suffix: '', label: 'Countries', decimals: 0, prefix: '' },
  { target: 3, suffix: 'M+', label: 'Annotations Delivered', decimals: 0, prefix: '' },
  { target: 0, suffix: '', label: 'QA Turnaround', decimals: 0, prefix: '', displayValue: 'Same-day' },
] as const;

type WorkforceStat = (typeof WORKFORCE_STATS)[number];

// ---------------------------------------------------------------------------
// Animated counter hook (adapted from CatalogPreview)
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
      // Cubic ease-out
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
  stat,
  isInView,
  index,
}: {
  stat: WorkforceStat;
  isInView: boolean;
  index: number;
}) {
  const animatedValue = useAnimatedCounter(stat.target, 1.5, isInView, stat.decimals);

  const displayNumber = 'displayValue' in stat && stat.displayValue
    ? stat.displayValue
    : `${stat.prefix}${animatedValue.toLocaleString()}${stat.suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center justify-center rounded-lg border border-[#2a2a28] bg-[#121210] px-4 py-6 md:py-8"
    >
      <span
        className="text-3xl md:text-4xl font-bold tracking-tight"
        style={{ color: '#92B090', fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
      >
        {displayNumber}
      </span>
      <p
        className="mt-2 text-xs md:text-sm uppercase tracking-widest"
        style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans, "Geist Sans", sans-serif)' }}
      >
        {stat.label}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// WorkforceStats
// ---------------------------------------------------------------------------

export default function WorkforceStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  return (
    <section
      ref={containerRef}
      className="w-full py-12 md:py-16"
      style={{ backgroundColor: '#0a0908' }}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 px-4 md:grid-cols-4 md:gap-4">
        {WORKFORCE_STATS.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} isInView={isInView} index={i} />
        ))}
      </div>
    </section>
  );
}
