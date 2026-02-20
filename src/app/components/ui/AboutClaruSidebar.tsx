"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface AboutClaruSidebarProps {
  className?: string;
}

const sidebarLinks = [
  { label: "Learn more", href: "/", ariaLabel: "Learn more about Claru" },
  { label: "All positions", href: "/jobs", ariaLabel: "View all open positions" },
  { label: "Our services", href: "/data", ariaLabel: "View Claru services" },
] as const;

export default function AboutClaruSidebar({
  className = "",
}: AboutClaruSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 ${className}`}
      aria-label="About Claru"
    >
      {/* Logo */}
      <div
        className="font-mono text-lg font-bold tracking-wider text-[var(--accent-primary)]"
        style={{ textShadow: "0 0 20px rgba(146, 176, 144, 0.2)" }}
      >
        CLARU
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-[var(--border-subtle)]" />

      {/* Company description */}
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        Claru embeds domain-expert annotators directly with frontier AI research
        teams. We&apos;re not a marketplace — we&apos;re a team that&apos;s
        trained frontier models across video generation, robotics, and
        multimodal AI.
      </p>

      {/* Key stat */}
      <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3">
        <span className="block font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
          Status
        </span>
        <span className="mt-1 block font-mono text-sm text-[var(--accent-primary)]">
          Working with frontier AI labs
        </span>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-[var(--border-subtle)]" />

      {/* Links */}
      <nav aria-label="Claru links">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-label={link.ariaLabel}
                className="group flex items-center justify-between rounded-lg px-3 py-2.5 font-mono text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--accent-primary)]"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
}
