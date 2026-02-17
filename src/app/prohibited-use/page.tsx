import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";

export const metadata: Metadata = {
  title: "Prohibited Use Policy - Claru",
  description:
    "Prohibited Use Policy for Claru - Expert Human Intelligence for AI Labs",
};

export default function ProhibitedUsePolicy() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      {/* Content */}
      <main className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Prohibited Use Policy</h1>
          <p className="text-[var(--text-tertiary)] font-mono mb-12">
            Last updated: January 2025
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This Prohibited Use Policy applies to all users of our services
                and is incorporated into our{" "}
                <a
                  href="/terms"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  Terms of Service
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Prohibited Content
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You may not use our services to create, upload, or share content
                that:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
                <li>Violates any law or regulation</li>
                <li>Infringes intellectual property rights</li>
                <li>Contains malware, viruses, or malicious code</li>
                <li>Is fraudulent, deceptive, or misleading</li>
                <li>Is harassing, threatening, or promotes violence</li>
                <li>
                  Discriminates based on race, gender, religion, sexual
                  orientation, or other protected characteristics
                </li>
                <li>
                  Contains child sexual abuse material (CSAM) or exploits minors
                </li>
                <li>
                  Is pornographic or sexually explicit without proper consent
                </li>
                <li>Promotes self-harm or suicide</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Prohibited Uses
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You may not:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
                <li>Use our services to engage in illegal activities</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Reverse engineer or decompile our software</li>
                <li>
                  Use automated means to scrape or collect data without
                  authorization
                </li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Use our services to send spam or unsolicited messages</li>
                <li>Circumvent any access restrictions or rate limits</li>
                <li>Use our services to develop competing products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Reporting Violations
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If you become aware of any violations of this policy, please
                report them to us at{" "}
                <a
                  href="mailto:support@claru.ai"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  support@claru.ai
                </a>
                . We will investigate all reports and take appropriate action,
                which may include suspension or termination of accounts.
              </p>
            </section>
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
