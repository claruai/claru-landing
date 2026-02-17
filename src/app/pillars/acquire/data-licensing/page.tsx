"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileCheck,
  Shield,
  Scale,
  FileText,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Building2,
  Newspaper,
  Globe,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";

export default function DataLicensingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "How much does properly licensed training data cost?",
      answer: (
        <>
          <p className="mb-3">
            Licensing costs vary dramatically based on content type, scale, and
            intended use:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Text corpora:
              </strong>{" "}
              Major publishers like the New York Times, AP, and academic
              publishers have established licensing programs. Costs range from
              thousands for limited datasets to millions for comprehensive
              archives.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Image collections:
              </strong>{" "}
              Stock photography companies offer AI training licenses at
              per-image or bulk rates. Specialized domains (medical, industrial)
              command premium pricing.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Video content:
              </strong>{" "}
              Broadcast archives and stock footage libraries negotiate based on
              duration, exclusivity, and use case.
            </li>
          </ul>
          <p>
            We help you understand the cost-benefit tradeoffs and identify the
            most cost-effective sources for your specific training needs. In
            many cases, the cost of licensing is far less than the legal risk of
            using unlicensed content.
          </p>
        </>
      ),
    },
    {
      question:
        "What happens if AI copyright law changes after I have trained my model?",
      answer: (
        <>
          <p className="mb-3">
            This is a real risk given the unsettled state of AI copyright law.
            Our approach is to minimize exposure regardless of how courts
            ultimately rule:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Explicit licenses:
              </strong>{" "}
              We negotiate licenses that explicitly permit AI training, removing
              reliance on fair use arguments that may or may not hold.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Provenance records:
              </strong>{" "}
              Complete documentation of what data was used and under what terms,
              enabling you to demonstrate compliance with any future
              requirements.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Contractual protections:
              </strong>{" "}
              Where possible, we negotiate indemnification and representations
              from content providers.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Flexible agreements:
              </strong>{" "}
              Licenses that can be amended or extended as regulations evolve.
            </li>
          </ul>
          <p>
            No approach eliminates all legal risk, but proper licensing
            dramatically reduces exposure compared to scraping or relying on
            ambiguous fair use claims.
          </p>
        </>
      ),
    },
    {
      question: "How do you handle international data licensing?",
      answer: (
        <>
          <p className="mb-3">
            Copyright and data protection laws vary significantly by
            jurisdiction, creating complexity for global AI training:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">EU:</strong> The{" "}
              <Citation href="https://artificialintelligenceact.eu/article/53/">
                EU AI Act
              </Citation>{" "}
              requires GPAI providers to publish training data summaries and
              comply with copyright obligations. We ensure datasets meet these
              transparency requirements.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">US:</strong> Fair
              use doctrine is being tested in ongoing litigation. We negotiate
              explicit licenses that do not rely on fair use determinations.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">UK:</strong>{" "}
              Post-Brexit, the UK is developing its own AI copyright framework.
              We track developments and structure licenses accordingly.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Japan/Singapore:
              </strong>{" "}
              More permissive frameworks exist but still require careful
              navigation for commercial use.
            </li>
          </ul>
          <p>
            We help you understand where your training data can legally be used
            and structure licenses that work across your target markets.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <span className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1">
                Services
                <ChevronRight className="w-3 h-3 rotate-90 group-hover:rotate-[270deg] transition-transform" />
              </span>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-2 min-w-[160px] shadow-xl">
                  <Link
                    href="/pillars/acquire"
                    className="block px-3 py-2 text-sm text-[var(--accent-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Acquire
                  </Link>
                  <Link
                    href="/pillars/prepare"
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Prepare
                  </Link>
                  <Link
                    href="/pillars/enrich"
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Enrich
                  </Link>
                  <Link
                    href="/pillars/validate"
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Validate
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/#capabilities"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Capabilities
            </Link>
            <Link
              href="/#contact"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Contact
            </Link>
          </nav>
          <Button href="/#contact" variant="cta-glitch" size="sm">
            Get Started
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-20 border-b border-[var(--border-subtle)]">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <Link href="/" className="hover:text-[var(--text-primary)]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/pillars/acquire"
              className="hover:text-[var(--text-primary)]"
            >
              Acquire
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--accent-primary)]">Data Licensing</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--accent-primary)] to-transparent" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-sm text-[var(--accent-primary)]">
                ACQUIRE
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Data Licensing
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Legal, Licensed
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Training Data
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              The era of scraping first and asking questions later is over.
              High-profile lawsuits and new regulations have made data
              provenance a board-level concern.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              We negotiate content rights, document provenance, and deliver
              datasets that satisfy enterprise legal teams.{" "}
              <strong className="text-[var(--text-primary)]">
                Build AI on solid legal ground.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss Licensing Needs <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/acquire" variant="secondary" size="lg">
                Back to Acquire
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// THE PROBLEM"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              The Legal Reckoning for AI Training Data
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                In December 2023, the New York Times filed suit against OpenAI
                and Microsoft, alleging that ChatGPT was trained on millions of
                copyrighted articles without permission.{" "}
                <Citation href="https://www.npr.org/2025/03/26/nx-s1-5288157/new-york-times-openai-copyright-case-goes-forward">
                  A federal judge allowed the case to proceed
                </Citation>
                , rejecting OpenAI&apos;s motion to dismiss the core copyright
                claims.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                This is not an isolated case.{" "}
                <Citation href="https://www.taylorwessing.com/en/insights-and-events/insights/2025/07/getty-v-stability">
                  Getty Images sued Stability AI
                </Citation>{" "}
                over training data for image generation models. Authors have
                filed class actions against AI companies. The legal landscape
                for AI training data is fundamentally changing.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <p className="text-xl font-semibold">
                    The risks of unlicensed training data are escalating.
                  </p>
                </div>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Legal liability:
                      </strong>{" "}
                      Statutory damages for copyright infringement can reach
                      $150,000 per work
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Model destruction:
                      </strong>{" "}
                      Courts could order deletion of models trained on
                      infringing data
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Regulatory requirements:
                      </strong>{" "}
                      EU AI Act mandates training data transparency and
                      copyright compliance
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Meanwhile, the{" "}
                <Citation href="https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/european-commission-releases-mandatory-template-for-public-disclosure-of-ai-training-data">
                  EU AI Act now requires
                </Citation>{" "}
                providers of general-purpose AI models to publish detailed
                summaries of their training data, including measures to respect
                copyrights. Non-compliance can result in fines up to 15 million
                euros or 3% of global revenue.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                The companies that invest in properly licensed data now will
                have a significant advantage as regulations tighten and
                competitors face legal challenges.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// HOW IT WORKS"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our Licensing Process
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Content Partnership Development",
                  description:
                    "We maintain relationships with publishers, content creators, and data holders across text, image, video, and audio domains. We identify the right sources for your specific training needs and initiate licensing discussions.",
                  icon: Building2,
                },
                {
                  step: "02",
                  title: "Rights Negotiation",
                  description:
                    "We negotiate licenses specifically for AI training use, covering permitted model types, commercial rights, geographic restrictions, and attribution requirements. We structure agreements that protect both parties.",
                  icon: Scale,
                },
                {
                  step: "03",
                  title: "Provenance Documentation",
                  description:
                    "Every piece of licensed content comes with complete chain-of-custody documentation: original source, rights holder, license terms, processing steps, and permitted uses. This documentation is designed for enterprise legal review.",
                  icon: FileText,
                },
                {
                  step: "04",
                  title: "Compliance-Ready Delivery",
                  description:
                    "We deliver datasets in formats compatible with your training pipeline, accompanied by documentation that satisfies regulatory requirements like EU AI Act transparency obligations.",
                  icon: Shield,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 p-6 rounded-xl bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)]"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-[var(--accent-primary)]">
                        {item.step}
                      </span>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// CONTENT TYPES"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Licensable Content Categories
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              We license content across all modalities required for modern AI
              training.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Text Content",
                  specs: [
                    "News articles & archives",
                    "Books & publications",
                    "Academic papers",
                    "Web content (with consent)",
                  ],
                },
                {
                  title: "Image Collections",
                  specs: [
                    "Stock photography",
                    "Medical/scientific imaging",
                    "Industrial/technical",
                    "Creative commons (verified)",
                  ],
                },
                {
                  title: "Video & Audio",
                  specs: [
                    "Stock footage libraries",
                    "Broadcast archives",
                    "Music licensing",
                    "Speech/podcast content",
                  ],
                },
                {
                  title: "License Types",
                  specs: [
                    "AI training rights",
                    "Commercial use permitted",
                    "Model distribution rights",
                    "Derivative work rights",
                  ],
                },
                {
                  title: "Documentation",
                  specs: [
                    "Source identification",
                    "Chain of custody",
                    "Usage restrictions",
                    "Attribution requirements",
                  ],
                },
                {
                  title: "Compliance Support",
                  specs: [
                    "EU AI Act templates",
                    "GDPR documentation",
                    "Copyright clearance",
                    "Audit trail records",
                  ],
                },
              ].map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.specs.map((spec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                      >
                        <CheckCircle className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// USE CASES"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Who Needs Licensed Training Data
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Proper data licensing is essential for organizations where legal
              risk tolerance is low.
            </p>

            <div className="space-y-8">
              {/* Media Companies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Media & Publishing Companies
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Building AI on your own content
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Media companies building AI products face a unique
                    challenge: using their own content is straightforward, but
                    competitive models require broader training data. We help
                    media companies license complementary content from
                    non-competing sources.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    We also help content owners monetize their archives through
                    AI training licenses, creating new revenue streams while
                    maintaining control over how their content is used.
                  </p>
                </div>
              </motion.div>

              {/* Enterprise AI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Enterprise AI Teams
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Corporate AI with compliance requirements
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Enterprise legal and compliance teams increasingly require
                    documentation of training data provenance before approving
                    AI deployments. Questions like where did this data come
                    from? and do we have the right to use it? block projects
                    built on scraped or ambiguously licensed data.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    We provide the documentation enterprise legal teams need:
                    clear license terms, usage restrictions, audit trails, and
                    chain-of-custody records that satisfy due diligence
                    requirements.
                  </p>
                </div>
              </motion.div>

              {/* Regulated Industries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Regulated Industries
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Healthcare, finance, government
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Regulated industries face additional scrutiny around AI
                    systems. Financial services must explain model decisions to
                    regulators. Healthcare AI requires documented data sources
                    for FDA submissions. Government contractors need to
                    demonstrate compliance with acquisition rules.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Our documentation is designed for regulatory review, with
                    the level of detail and audit trails that satisfy examiners
                    across industries.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// FAQ"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Common Questions
            </h2>

            <div className="divide-y divide-[var(--border-subtle)]">
              {faqs.map((faq, index) => (
                <FAQItem key={index} {...faq} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Build AI on a Solid Legal Foundation
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              The cost of proper licensing is far less than the risk of
              litigation or regulatory action.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us what content you need for training. We will identify
              sources, negotiate rights, and deliver data your legal team can
              approve.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss Licensing Needs <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/acquire" variant="secondary" size="lg">
                Back to Acquire
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-12 border-t border-[var(--border-subtle)]">
        <div className="container">
          <p className="text-sm font-mono text-[var(--accent-primary)] mb-4">
            // RELATED SERVICES
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/pillars/acquire/egocentric-video"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                ACQUIRE
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Egocentric Video
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                First-party data collection
              </p>
            </Link>
            <Link
              href="/pillars/acquire/synthetic-data"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                ACQUIRE
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Synthetic Data
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                No copyright concerns
              </p>
            </Link>
            <Link
              href="/pillars/validate"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                VALIDATE
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Compliance Testing
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                EU AI Act readiness
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-subtle)]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>
            <nav className="flex items-center gap-6 text-sm text-[var(--text-tertiary)]">
              <Link
                href="/privacy"
                className="hover:text-[var(--text-primary)]"
              >
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[var(--text-primary)]">
                Terms
              </Link>
              <Link
                href="/#contact"
                className="hover:text-[var(--text-primary)]"
              >
                Contact
              </Link>
            </nav>
            <p className="text-sm text-[var(--text-tertiary)]">
              &copy; {new Date().getFullYear()} Claru. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
