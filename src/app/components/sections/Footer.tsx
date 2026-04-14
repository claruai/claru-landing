"use client";

import Link from "next/link";

/* ─── Hub directory — SEO-crawlable links ─────────────── */

const hubLinks = [
  { href: "/glossary", label: "glossary" },
  { href: "/models", label: "models" },
  { href: "/training-data", label: "tasks" },
  { href: "/guides", label: "guides" },
  { href: "/datasets", label: "datasets" },
  { href: "/formats", label: "formats" },
  { href: "/industries", label: "industries" },
  { href: "/for", label: "labs" },
  { href: "/benchmarks", label: "benchmarks" },
  { href: "/compare", label: "compare" },
  { href: "/solutions", label: "solutions" },
];

/* ─── Footer columns ──────────────────────────────────── */

const columns = [
  {
    label: "SOLUTIONS",
    links: [
      { href: "/solutions/vla-training-data", label: "VLA Training Data" },
      { href: "/solutions/teleoperation-data", label: "Teleoperation Data" },
      { href: "/solutions/egocentric-video-data", label: "Egocentric Video" },
      {
        href: "/solutions/manipulation-trajectory-data",
        label: "Manipulation Data",
      },
    ],
  },
  {
    label: "RESOURCES",
    links: [
      { href: "/case-studies", label: "Case Studies" },
      { href: "/blog", label: "Blog" },
      { href: "/data-catalog", label: "Data Catalog" },
      { href: "/about", label: "About" },
      { href: "/jobs", label: "Jobs" },
    ],
  },
  {
    label: "COMPANY",
    links: [
      { href: "/for-annotators", label: "For Annotators" },
      { href: "/#contact", label: "Contact" },
      { href: "/legal", label: "Legal" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative z-10 mt-20">
      {/* ── Top accent line — matches ProofOfWork section style ── */}
      <div
        className="h-px mb-16"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(146,176,144,0.12) 30%, rgba(146,176,144,0.12) 70%, transparent 95%)",
        }}
      />

      <div className="container mx-auto max-w-[var(--container-max)] px-6 pt-28 pb-10">
        {/* ── Hub directory — SEO-crawlable links ────────────── */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-x-1 gap-y-1.5">
            {hubLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center font-mono text-[11px] text-white/20 transition-colors duration-200 hover:text-[var(--accent-primary)]"
              >
                <span className="text-white/10 group-hover:text-[var(--accent-primary)]/40 transition-colors duration-200">
                  /
                </span>
                {link.label}
                {i < hubLinks.length - 1 && (
                  <span className="ml-1 mr-0.5 inline-block h-2.5 w-px bg-white/[0.06]" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Columns — terminal comment headers ──────────── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          {columns.map((col) => (
            <div key={col.label}>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/15">
                {"// "}
                {col.label}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-mono text-[12px] text-white/25 transition-colors duration-200 hover:text-white/50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Contact block — right-aligned on desktop ──── */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:text-right">
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/15">
              {"// SIGNAL"}
            </h4>
            <a
              href="mailto:contact@claru.ai"
              className="block font-mono text-[12px] text-white/25 transition-colors duration-200 hover:text-[var(--accent-primary)]"
            >
              contact@claru.ai
            </a>
            <Link
              href="/#contact"
              className="mt-2.5 block font-mono text-[12px] text-white/25 transition-colors duration-200 hover:text-[var(--accent-primary)]"
            >
              Book a call
            </Link>
          </div>
        </div>

        {/* ── Terminal status line ─────────────────────────── */}
        <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: CLARU wordmark + copyright */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-[13px] font-bold tracking-[0.15em] text-white/30 transition-colors duration-200 hover:text-white/50"
            >
              CLARU
            </Link>
            <span className="inline-block h-3 w-px bg-white/[0.06]" />
            <span className="font-mono text-[10px] tracking-[0.1em] text-white/15">
              2026 Claru AI
            </span>
          </div>

          {/* Right: email */}
          <a
            href="mailto:contact@claru.ai"
            className="font-mono text-[10px] tracking-[0.1em] text-white/15 transition-colors duration-200 hover:text-[var(--accent-primary)]"
          >
            contact@claru.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
