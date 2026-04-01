"use client";

import Link from "next/link";
import Logo from "../ui/Logo";

const footerColumns = [
  {
    title: "Solutions",
    links: [
      { href: "/solutions/egocentric-video-data", label: "Egocentric Video Data" },
      { href: "/solutions/vla-training-data", label: "VLA Training Data" },
      { href: "/solutions/teleoperation-data", label: "Teleoperation Data" },
      { href: "/solutions/manipulation-trajectory-data", label: "Manipulation Trajectories" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/compare/claru-vs-luel", label: "Claru vs Luel" },
      { href: "/compare/scale-ai-alternatives", label: "Scale AI Alternatives" },
      { href: "/compare/appen-alternatives", label: "Appen Alternatives" },
      { href: "/compare/labelbox-alternatives", label: "Labelbox Alternatives" },
      { href: "/compare/surge-ai-alternatives", label: "Surge AI Alternatives" },
      { href: "/compare/encord-alternatives", label: "Encord Alternatives" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/training-data-for-robotics", label: "Training Data for Robotics" },
      { href: "/physical-ai-training-data", label: "Physical AI Data" },
      { href: "/egocentric-video-datasets", label: "Egocentric Datasets" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/data-catalog", label: "Data Catalog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/jobs", label: "Jobs" },
      { href: "/for-annotators", label: "For Annotators" },
      { href: "/#contact", label: "Contact" },
      { href: "/legal", label: "Legal" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative py-16 md:py-24 bg-[var(--bg-secondary)]/80 backdrop-blur-sm z-10"
    >
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col items-start gap-3">
              <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo size="sm" className="text-[var(--text-primary)]" />
            </Link>
            <p className="text-sm text-[var(--text-muted)]">
              &copy; 2026 Claru AI. All rights reserved.
            </p>
          </div>
          <a
            href="mailto:contact@claru.ai"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
          >
            contact@claru.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
