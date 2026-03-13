'use client';

import { motion } from 'framer-motion';

interface ChallengesSolutionsProps {
  items: Array<{ challenge: string; solution: string }>;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function ChallengesSolutions({ items }: ChallengesSolutionsProps) {
  return (
    <section className="py-20 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-2xl font-semibold tracking-tight md:text-3xl"
          style={{ fontFamily: "var(--font-mono)", color: '#FFFFFF' }}
        >
          Your Challenges{' '}
          <span style={{ color: '#92B090' }}>&rarr;</span>{' '}
          How We&apos;d Approach It
        </motion.h2>

        {/* Column Headers (desktop only) */}
        <div className="mb-6 hidden md:grid md:grid-cols-[1fr_48px_1fr] md:gap-0">
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}
          >
            Your Challenge
          </span>
          <span />
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: 'rgba(146,176,144,0.6)' }}
          >
            Our Approach
          </span>
        </div>

        {/* Rows */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col gap-4"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={rowVariants}
              className="group grid grid-cols-1 gap-4 rounded-lg border p-5 transition-colors md:grid-cols-[1fr_48px_1fr] md:gap-0 md:p-6"
              style={{
                background: '#121210',
                borderColor: '#2a2a28',
              }}
            >
              {/* Challenge */}
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 shrink-0 text-sm"
                  style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p
                  className="text-sm leading-relaxed md:text-base"
                  style={{ fontFamily: 'var(--font-mono)', color: '#e8e8e8' }}
                >
                  {item.challenge}
                </p>
              </div>

              {/* Connecting Arrow */}
              <div className="flex items-center justify-center">
                {/* Mobile: horizontal line + arrow */}
                <div
                  className="flex items-center gap-1 md:hidden"
                  style={{ color: 'rgba(146,176,144,0.5)' }}
                >
                  <div
                    className="h-px w-8"
                    style={{ background: 'rgba(146,176,144,0.3)' }}
                  />
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M7 1v12M7 13l4-4M7 13l-4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div
                    className="h-px w-8"
                    style={{ background: 'rgba(146,176,144,0.3)' }}
                  />
                </div>
                {/* Desktop: horizontal arrow */}
                <div
                  className="hidden items-center md:flex"
                  style={{ color: 'rgba(146,176,144,0.5)' }}
                >
                  <div
                    className="h-px w-4"
                    style={{ background: 'rgba(146,176,144,0.3)' }}
                  />
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M1 8h14M15 8l-4-4M15 8l-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div
                    className="h-px w-4"
                    style={{ background: 'rgba(146,176,144,0.3)' }}
                  />
                </div>
              </div>

              {/* Solution */}
              <div className="flex items-start">
                <p
                  className="text-sm leading-relaxed md:text-base"
                  style={{ color: '#92B090' }}
                >
                  {item.solution}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
