"use client";

import Logo from "../ui/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/data", label: "Training Data" },
  { href: "/labeling", label: "Expert Labeling" },
  { href: "/#testimonials", label: "Clients" },
  { href: "/#contact", label: "Contact" },
];

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/prohibited-use", label: "Prohibited Use Policy" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/job-applicant-privacy", label: "Job Applicant Privacy Policy" },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative py-16 md:py-24 bg-[var(--bg-secondary)]/80 backdrop-blur-sm z-10"
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <a href="/">
              <Logo size="md" className="text-[var(--text-primary)]" />
            </a>
            <p className="text-sm text-[var(--text-tertiary)]">
              Training data and expert labeling for frontier AI labs.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Navigation
            </h4>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Legal
            </h4>
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
          <p className="text-center text-sm text-[var(--text-muted)]">
            &copy; {currentYear} Claru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
