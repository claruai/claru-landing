"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  ChevronRight,
  ArrowRight,
  Target,
  BarChart3,
  Lock,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";

export default function BenchmarkCurationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "How do you detect if a benchmark has been contaminated?",
      answer: (
        <>
          <p className="mb-3">
            We use multiple detection methods because no single technique
            catches all contamination types:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                N-gram analysis:
              </strong>{" "}
              We check for exact and near-exact matches between benchmark
              content and known training corpora. Even 8-gram overlaps can
              indicate leakage.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Perplexity testing:
              </strong>{" "}
              Models show abnormally low perplexity on memorized content. We
              compare perplexity distributions across benchmark items to
              identify outliers.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Canary insertion:
              </strong>{" "}
              We embed unique, trackable strings in test sets. If these appear
              in model outputs, we know the benchmark leaked into training data.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Perturbation testing:
              </strong>{" "}
              We create semantically equivalent variants of benchmark questions.
              Large performance drops on variants suggest memorization rather
              than genuine capability.
            </li>
          </ul>
        </>
      ),
    },
    {
      question: "How often should benchmarks be refreshed?",
      answer: (
        <>
          <p className="mb-3">
            Refresh frequency depends on your evaluation cadence and the public
            visibility of your benchmarks:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Private benchmarks:
              </strong>{" "}
              With strict access controls, annual rotation is typically
              sufficient. We recommend refreshing 20-30% of items each cycle to
              maintain trend comparability while reducing contamination risk.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Semi-public benchmarks:
              </strong>{" "}
              If results are published or shared with multiple parties, refresh
              every 6 months. Leakage risk increases with each disclosure.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                High-stakes evaluation:
              </strong>{" "}
              For capability testing that informs deployment decisions, we
              recommend fresh benchmarks for each major evaluation to eliminate
              contamination concerns entirely.
            </li>
          </ul>
          <p>
            We provide versioned benchmark management with audit trails so you
            can track changes and maintain historical comparability.
          </p>
        </>
      ),
    },
    {
      question: "Can you create benchmarks for specialized domains?",
      answer: (
        <>
          <p className="mb-3">
            Yes. Domain-specific benchmarks require domain expertise to create
            meaningful evaluation cases. Our process for specialized benchmarks:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Expert recruitment:
              </strong>{" "}
              We source domain specialists (medical, legal, scientific, code) to
              create evaluation cases that test genuine capability, not surface
              pattern matching.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Difficulty calibration:
              </strong>{" "}
              Cases are stratified across difficulty levels so you can track
              capability curves, not just aggregate scores. Experts annotate
              expected difficulty and reasoning complexity.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Ground truth validation:
              </strong>{" "}
              Multiple experts verify answers with inter-annotator agreement
              metrics. Ambiguous cases are resolved or excluded to ensure
              evaluation clarity.
            </li>
          </ul>
          <p>
            We&apos;ve built benchmarks for medical diagnosis, legal reasoning,
            scientific research, code generation, and multimodal understanding.
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
            <Link
              href="/pillars/validate"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Validate
            </Link>
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
              href="/pillars/validate"
              className="hover:text-[var(--text-primary)]"
            >
              Validate
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--accent-primary)]">
              Benchmark Curation
            </span>
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
                VALIDATE
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Benchmark Curation
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble text="Evaluation Data" scrambleOnHover={true} />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                You Can Actually Trust
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Your model scores 90% on the benchmark. Leadership is impressed.
              Engineering celebrates. Deployment gets the green light.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              Then real-world performance comes in at 60%. Users complain. The
              benchmark was contaminated. Your training data included test
              examples.{" "}
              <strong className="text-[var(--text-primary)]">
                You weren&apos;t measuring capability. You were measuring
                memorization.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Get Clean Benchmarks <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                See Our Process
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
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              The Contamination Crisis
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Benchmark contamination isn&apos;t a theoretical concern.
                It&apos;s an active, documented problem undermining AI
                evaluation across the industry.{" "}
                <Citation href="https://arxiv.org/abs/2502.06215">
                  LessLeak-Bench research
                </Citation>{" "}
                found that some popular benchmarks have 100% leakage ratios,
                with models scoring 4.9 times higher on leaked samples compared
                to non-leaked ones.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The contamination pathway is straightforward: benchmarks get
                published, web crawlers index them, and they end up in training
                datasets. Even benchmarks that try to stay private often leak
                through research papers, blog posts, or third-party
                reproductions. Once test data touches training data, your
                evaluation measures memorization, not capability.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://arxiv.org/html/2502.14425v2">
                  A comprehensive survey
                </Citation>{" "}
                of data contamination in LLMs documents the scope: contamination
                affects reasoning benchmarks, factual knowledge tests, and code
                evaluation alike. Standard benchmarks like MMLU, GSM8K, and
                HumanEval all show contamination evidence in various models.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The{" "}
                <Citation href="https://crfm.stanford.edu/helm/">
                  HELM benchmark project
                </Citation>{" "}
                at Stanford addresses this by creating standardized, transparent
                evaluation infrastructure. But even carefully managed public
                benchmarks face contamination pressure. The only reliable
                solution is private, continuously refreshed evaluation data with
                verified non-contamination.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  If your benchmark existed before your training data was
                  collected, assume it&apos;s contaminated.
                </p>
                <p className="text-[var(--text-secondary)]">
                  Clean evaluation requires fresh data with verified provenance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// METHODOLOGY"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              How We Build Clean Benchmarks
            </h2>

            <div className="space-y-8 mb-12">
              {[
                {
                  step: "01",
                  title: "Novel Content Generation",
                  description:
                    "We create benchmark content from scratch using domain experts. This isn't rephrased public data or variations on existing benchmarks. It's genuinely new content that has never appeared in any public corpus, web crawl, or training dataset. Expert annotators generate questions, scenarios, and evaluation cases specific to your capability targets.",
                },
                {
                  step: "02",
                  title: "Contamination Verification",
                  description:
                    "Before deployment, every benchmark item undergoes contamination testing. We check n-gram overlap against known training corpora, run perplexity analysis to detect memorization signatures, and use canary insertion to track potential leakage paths. Items that show any contamination signal are excluded or regenerated.",
                },
                {
                  step: "03",
                  title: "Difficulty Stratification",
                  description:
                    "Benchmarks are calibrated across difficulty tiers: easy, medium, and hard. This stratification lets you track capability curves rather than just aggregate scores. You can identify where your model's performance breaks down, distinguish between models that plateau at different difficulty levels, and measure meaningful progress over time.",
                },
                {
                  step: "04",
                  title: "Ground Truth Validation",
                  description:
                    "Multiple domain experts verify every answer with explicit inter-annotator agreement targets. Ambiguous cases are resolved through structured adjudication or excluded from the benchmark. We document reasoning chains for complex items so evaluation disputes can be resolved systematically.",
                },
                {
                  step: "05",
                  title: "Embargo & Rotation Management",
                  description:
                    "Deployed benchmarks use strict access controls: need-to-know access, secure evaluation environments, and audit trails for every query. We establish rotation schedules based on your evaluation cadence, refreshing benchmark subsets periodically to maintain long-term evaluation integrity.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <span className="font-mono text-2xl text-[var(--accent-primary)]">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
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
              {"// TECHNICAL SPECIFICATIONS"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Benchmark Infrastructure
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Target className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Contamination Detection
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    N-gram overlap analysis (8-gram minimum)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Perplexity distribution analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Canary string insertion and tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Semantic perturbation testing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Cross-corpus similarity matching
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Quality Metrics</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Inter-annotator agreement thresholds
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Difficulty stratification (easy/medium/hard)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Domain coverage verification
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Answer ambiguity scoring
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Reasoning chain documentation
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Access Controls</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Need-to-know access policies
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Secure evaluation environments
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Query-level audit trails
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Time-limited evaluation windows
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Encrypted storage at rest
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <RefreshCw className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Rotation & Versioning
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Scheduled refresh cycles (quarterly/annual)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Partial rotation for trend continuity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Version control with change tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Historical comparison support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Emergency rotation capability
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-subtle)]">
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  Novel
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Never-public content
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  Verified
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Contamination-free
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  Stratified
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Difficulty calibrated
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  Managed
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Rotation & access
                </p>
              </div>
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
              When Clean Benchmarks Matter Most
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Different evaluation contexts have different contamination risks
              and integrity requirements.
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Model Capability Assessment
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Before deployment, you need to know what your model can
                  actually do. Contaminated benchmarks inflate scores and hide
                  capability gaps. Clean benchmarks give you honest assessment
                  of reasoning, knowledge, and task completion across domains
                  that matter for your use case.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Pre-deployment evaluation
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Capability gap analysis
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Go/no-go decisions
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Progress Tracking Over Time
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Measuring improvement between model versions requires
                  consistent, uncontaminated evaluation. If test data leaks into
                  later training runs, you can&apos;t distinguish genuine
                  capability improvement from memorization. Managed benchmarks
                  with rotation schedules let you track real progress while
                  maintaining evaluation integrity.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Version comparison
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Training effectiveness
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Capability curves
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Regulatory & Compliance Documentation
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  The EU AI Act and sector-specific regulations increasingly
                  require documented capability assessment. Regulators want
                  evidence that evaluation was rigorous and unbiased. Our
                  benchmarks come with methodology documentation, contamination
                  verification records, and audit trails that satisfy compliance
                  requirements.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    EU AI Act compliance
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Audit documentation
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Evaluation transparency
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Competitive Benchmarking
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Comparing your model against competitors requires evaluation
                  data that neither party has seen in training. Public
                  benchmarks are useless for this purpose since all models have
                  likely been exposed. Private benchmarks with verified
                  non-contamination give you honest relative performance
                  assessment.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Model comparison
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Vendor evaluation
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Build vs buy decisions
                  </span>
                </div>
              </div>
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
      <section id="contact" className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Know What Your Model Can Actually Do
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Contaminated benchmarks give you false confidence. Clean
              benchmarks give you truth.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your evaluation needs. We&apos;ll design benchmarks
              that measure genuine capability in the domains that matter for
              your deployment.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Get Clean Benchmarks <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                href="/pillars/validate/red-teaming"
                variant="secondary"
                size="lg"
              >
                Explore Red Teaming
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-12 border-t border-[var(--border-subtle)]">
        <div className="container">
          <p className="text-sm font-mono text-[var(--accent-primary)] mb-4">
            {"// RELATED SERVICES"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/pillars/validate"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Parent
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Validate
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                All validation services
              </p>
            </Link>
            <Link
              href="/pillars/validate/red-teaming"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Related
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Red Teaming
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Adversarial security testing
              </p>
            </Link>
            <Link
              href="/pillars/validate/bias-detection"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Related
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Bias Detection
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Fairness evaluation & audits
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
