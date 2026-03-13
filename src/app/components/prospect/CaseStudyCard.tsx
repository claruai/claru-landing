'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getCaseStudy } from '@/lib/case-studies-client';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CaseStudyCardProps {
  slug: string;
}

// ---------------------------------------------------------------------------
// CaseStudyCard
// ---------------------------------------------------------------------------

/**
 * A rich card that displays case study metadata (title, description, tags)
 * with a link to the full case study page.
 *
 * Looks up metadata via the `CASE_STUDIES` mapping by slug. If the slug is
 * not found the card renders a graceful "Unavailable" state rather than
 * throwing.
 */
export default function CaseStudyCard({ slug }: CaseStudyCardProps) {
  const meta = getCaseStudy(slug);

  // -------------------------------------------------------------------------
  // Unavailable state
  // -------------------------------------------------------------------------

  if (!meta) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-center rounded-lg border p-8"
        style={{
          backgroundColor: '#121210',
          borderColor: '#2a2a28',
          color: '#FFFFFF',
        }}
      >
        <p
          className="text-sm opacity-50"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Case study unavailable
        </p>
      </motion.div>
    );
  }

  // -------------------------------------------------------------------------
  // Normal card
  // -------------------------------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group flex flex-col rounded-lg border p-6"
      style={{
        backgroundColor: '#121210',
        borderColor: '#2a2a28',
      }}
    >
      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-2">
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border px-2.5 py-0.5 text-xs"
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#92B090',
              borderColor: 'rgba(146, 176, 144, 0.3)',
              backgroundColor: 'rgba(146, 176, 144, 0.08)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3
        className="mb-2 text-base font-semibold leading-snug sm:text-lg"
        style={{ color: '#FFFFFF' }}
      >
        {meta.title}
      </h3>

      {/* Description */}
      <p
        className="mb-4 line-clamp-2 text-sm leading-relaxed"
        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
      >
        {meta.description}
      </p>

      {/* Spacer to push the link to the bottom */}
      <div className="mt-auto" />

      {/* Link */}
      <a
        href={meta.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
        style={{
          fontFamily: 'var(--font-mono)',
          color: '#92B090',
        }}
      >
        Read Case Study
        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </a>
    </motion.div>
  );
}
