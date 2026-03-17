"use client";

// ---------------------------------------------------------------------------
// ProcessTimeline — Client Component
// ---------------------------------------------------------------------------
// Displays process steps with staggered reveal animation and connecting line
// draw effect. Horizontal on desktop, vertical on mobile. Replaces the
// simpler ProcessFlow component on case study pages with video compositions.
// ---------------------------------------------------------------------------

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TimelineStep {
  label: string;
  description?: string;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
}

function DesktopTimeline({ steps }: { steps: TimelineStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="hidden md:block mt-10">
      {/* Connecting line */}
      <div className="relative flex items-start">
        {/* Horizontal connecting line drawn behind steps */}
        <motion.div
          className="absolute top-[20px] left-[20px] right-[20px] h-[2px] bg-[var(--accent-primary)]/30 origin-left"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Steps */}
        <div className="relative flex w-full justify-between">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center flex-1 min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                delay: 0.3 + i * 0.15,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Step number circle */}
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-[var(--accent-primary)] bg-[var(--bg-primary)] flex items-center justify-center mb-3 flex-shrink-0 relative z-10"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{
                  delay: 0.3 + i * 0.15,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <span className="font-mono text-sm font-bold text-[var(--accent-primary)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>

              {/* Label */}
              <span className="font-mono text-sm font-semibold text-[var(--text-primary)] mb-1">
                {step.label}
              </span>

              {/* Description */}
              {step.description && (
                <span className="text-xs text-[var(--text-tertiary)] leading-snug px-2 max-w-[180px]">
                  {step.description}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTimeline({ steps }: { steps: TimelineStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="flex md:hidden flex-col mt-10 relative">
      {/* Vertical connecting line */}
      <motion.div
        className="absolute left-[17px] top-[20px] bottom-[20px] w-[2px] bg-[var(--accent-primary)]/30 origin-top"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="flex items-start gap-4 w-full mb-6 last:mb-0 relative"
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{
            delay: 0.3 + i * 0.12,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Step number circle */}
          <motion.div
            className="w-9 h-9 rounded-full border-2 border-[var(--accent-primary)] bg-[var(--bg-primary)] flex items-center justify-center flex-shrink-0 relative z-10"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{
              delay: 0.3 + i * 0.12,
              duration: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.div>

          <div className="pt-1">
            <span className="font-mono text-sm font-semibold text-[var(--text-primary)] block">
              {step.label}
            </span>
            {step.description && (
              <span className="text-xs text-[var(--text-tertiary)] leading-snug block mt-0.5">
                {step.description}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <>
      <DesktopTimeline steps={steps} />
      <MobileTimeline steps={steps} />
    </>
  );
}
