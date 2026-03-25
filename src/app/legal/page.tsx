import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";
import { FileText, Shield, Lock, Users, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal - Claru",
  description:
    "Legal agreements, policies, and terms for Claru AI.",
  alternates: {
    canonical: "/legal",
  },
  openGraph: {
    title: "Legal - Claru",
    description:
      "Legal agreements, policies, and terms for Claru AI.",
    type: "website",
  },
};

const legalDocs = [
  {
    href: "/terms",
    title: "Terms of Service",
    description:
      "The terms governing your access to and use of our websites, applications, and services.",
    icon: FileText,
    updated: "January 2025",
  },
  {
    href: "/privacy",
    title: "Privacy Policy",
    description:
      "How we collect, use, disclose, and safeguard your personal information.",
    icon: Lock,
    updated: "January 16, 2026",
  },
  {
    href: "/prohibited-use",
    title: "Prohibited Use Policy",
    description:
      "Guidelines on prohibited content and activities across our services.",
    icon: Shield,
    updated: "January 2025",
  },
  {
    href: "/job-applicant-privacy",
    title: "Job Applicant Privacy Policy",
    description:
      "How we handle personal data of job applicants under UK, Canada, and US data protection laws.",
    icon: Users,
    updated: "January 2025",
  },
  {
    href: "/annotator-agreement",
    title: "Annotator Services Agreement",
    description:
      "Master services agreement for annotators and service providers on the Claru AI platform.",
    icon: Briefcase,
    updated: "March 2026",
  },
];

export default function Legal() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      <main className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Legal</h1>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-12">
              Our legal agreements and policies that govern the use of Claru
              services and platforms.
            </p>

            <div className="space-y-4">
              {legalDocs.map((doc) => (
                <a
                  key={doc.href}
                  href={doc.href}
                  className="group block p-6 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-secondary)]/50 hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-secondary)] transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center group-hover:bg-[var(--accent-primary)]/15 transition-colors">
                      <doc.icon
                        size={18}
                        className="text-[var(--accent-primary)]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                          {doc.title}
                        </h2>
                        <span className="flex-shrink-0 text-xs font-mono text-[var(--text-muted)]">
                          {doc.updated}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-12 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm">
              <p className="text-[var(--text-tertiary)]">
                Questions about our legal terms? Contact us at{" "}
                <a
                  href="mailto:support@claru.ai"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  support@claru.ai
                </a>
              </p>
            </div>

            {/* Back link */}
            <div className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
              <a
                href="/"
                className="font-mono text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                &larr; Back to Home
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
