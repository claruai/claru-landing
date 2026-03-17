"use client";

// ---------------------------------------------------------------------------
// AnimatedMetrics — Client Component
// ---------------------------------------------------------------------------
// Displays a grid of metrics with counter animation triggered on scroll into
// view. Numbers animate from 0 to their target value using Framer Motion.
// Terminal aesthetic with JetBrains Mono for numbers and accent color.
// ---------------------------------------------------------------------------

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

interface Metric {
  value: string;
  label: string;
}

interface AnimatedMetricsProps {
  metrics: Metric[];
}

/**
 * Parse a metric value string into a numeric target and any prefix/suffix.
 * Examples:
 *   "386K+"   -> { prefix: "", number: 386, suffix: "K+" }
 *   "98.7%"   -> { prefix: "", number: 98.7, suffix: "%" }
 *   "~500"    -> { prefix: "~", number: 500, suffix: "" }
 *   "$1.2M"   -> { prefix: "$", number: 1.2, suffix: "M" }
 *   "50,000+" -> { prefix: "", number: 50000, suffix: "+" }
 */
function parseMetricValue(raw: string): {
  prefix: string;
  number: number;
  suffix: string;
  hasCommas: boolean;
  decimals: number;
} {
  // Extract leading non-numeric prefix (e.g. ~, $, <, >)
  const prefixMatch = raw.match(/^([^0-9]*)/);
  const prefix = prefixMatch?.[1] ?? "";
  const rest = raw.slice(prefix.length);

  // Extract trailing non-numeric suffix (e.g. K+, %, M, x)
  const suffixMatch = rest.match(/([^0-9.,]*)$/);
  const suffix = suffixMatch?.[1] ?? "";
  const numStr = rest.slice(0, rest.length - suffix.length);

  // Check if original had commas for formatting
  const hasCommas = numStr.includes(",");

  // Parse the number
  const cleanNum = numStr.replace(/,/g, "");
  const number = parseFloat(cleanNum) || 0;

  // Count decimal places
  const decimalMatch = cleanNum.match(/\.(\d+)/);
  const decimals = decimalMatch ? decimalMatch[1].length : 0;

  return { prefix, number, suffix, hasCommas, decimals };
}

function formatNumber(
  value: number,
  hasCommas: boolean,
  decimals: number,
): string {
  const fixed = value.toFixed(decimals);
  if (!hasCommas) return fixed;

  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}

function AnimatedNumber({ value }: { value: string }) {
  const parsed = parseMetricValue(value);
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1200; // ms
    const startTime = performance.now();
    const target = parsed.number;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayValue(target);
      }
    }

    requestAnimationFrame(tick);
  }, [parsed.number]);

  useEffect(() => {
    if (isInView) {
      animate();
    }
  }, [isInView, animate]);

  return (
    <span ref={ref} className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--accent-primary)]">
      {parsed.prefix}
      {formatNumber(displayValue, parsed.hasCommas, parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}

export default function AnimatedMetrics({ metrics }: AnimatedMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <AnimatedNumber value={metric.value} />
          <span className="block text-xs md:text-sm text-[var(--text-tertiary)] mt-1">
            {metric.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
