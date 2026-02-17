"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface CapabilityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  index: number;
}

export default function CapabilityCard({
  icon: Icon,
  title,
  description,
  details,
  index,
}: CapabilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="p-6 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
    >
      <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent-primary)]/20 transition-colors">
        <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] mb-4">{description}</p>
      <ul className="space-y-2">
        {details.map((detail, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-[var(--text-tertiary)]"
          >
            <span className="text-[var(--accent-primary)] mt-0.5">+</span>
            {detail}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
