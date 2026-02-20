"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface CaseStudyCalloutData {
  slug: string;
  headlineStat: string;
  headlineStatLabel: string;
  title: string;
  teaser: string;
}

interface CaseStudyCalloutProps {
  caseStudy: CaseStudyCalloutData;
  index?: number;
}

export default function CaseStudyCallout({
  caseStudy,
  index = 0,
}: CaseStudyCalloutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        href={`/case-studies/${caseStudy.slug}`}
        className="block p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 hover:border-[var(--accent-primary)]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.08)] group"
      >
        <div className="flex items-baseline gap-3 mb-3">
          <span className="font-mono text-2xl md:text-3xl text-[var(--accent-primary)] font-bold leading-none">
            {caseStudy.headlineStat}
          </span>
          <span className="text-xs text-[var(--text-tertiary)] font-mono uppercase tracking-wider">
            {caseStudy.headlineStatLabel}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors leading-snug">
          {caseStudy.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 leading-relaxed">
          {caseStudy.teaser}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-primary)] group-hover:gap-2.5 transition-all">
          Read case study <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </motion.div>
  );
}
