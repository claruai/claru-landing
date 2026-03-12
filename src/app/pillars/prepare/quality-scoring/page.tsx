"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  ChevronRight,
  ArrowRight,
  Gauge,
  BarChart3,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";

export default function QualityScoringPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "How do you choose quality filtering thresholds?",
      answer: (
        <>
          <p className="mb-3">
            There is no universal optimal threshold. The right choice depends on
            your data distribution, domain characteristics, and downstream model
            requirements.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Data analysis:
              </strong>{" "}
              We analyze your data to understand quality distributions across
              content types. This reveals where thresholds will have the most
              impact.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Domain calibration:
              </strong>{" "}
              Perplexity thresholds that work for Wikipedia-style prose may
              incorrectly filter code, dialogue, or technical content. We
              calibrate thresholds per domain.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Empirical testing:
              </strong>{" "}
              For critical applications, we deliver multiple filtered versions
              with different thresholds so you can measure downstream model
              performance.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Iterative refinement:
              </strong>{" "}
              Initial thresholds are starting points. We refine based on model
              training results and feedback.
            </li>
          </ul>
          <p>
            Quality filtering is not a one-time preprocessing step. It is an
            ongoing calibration based on downstream model performance.
          </p>
        </>
      ),
    },
    {
      question:
        "How do you balance quality filtering with diversity preservation?",
      answer: (
        <>
          <p className="mb-3">
            Aggressive filtering can eliminate entire domains, writing styles,
            or content types. This reduces dataset diversity in ways that hurt
            model generalization. We monitor and preserve diversity throughout
            the filtering process.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Distribution monitoring:
              </strong>{" "}
              We track content distribution before and after filtering using
              clustering and topic analysis. Significant shifts are flagged for
              review.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Category coverage:
              </strong>{" "}
              We ensure representation across content categories (domains,
              languages, writing styles) and alert when filtering
              disproportionately affects specific categories.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Stratified thresholds:
              </strong>{" "}
              Different content types may need different thresholds. Code,
              dialogue, and technical writing each have different quality
              characteristics.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Diversity-aware sampling:
              </strong>{" "}
              When aggressive filtering is required, we can apply diversity
              constraints to preserve representation across categories.
            </li>
          </ul>
          <p>
            The goal is informed tradeoffs, not blind optimization for a single
            quality metric.
          </p>
        </>
      ),
    },
    {
      question: "Can quality scoring adapt to domain-specific data?",
      answer: (
        <>
          <p className="mb-3">
            Generic quality classifiers often misclassify domain-specific
            content. Code quality differs fundamentally from prose quality. We
            develop domain-appropriate scoring for your specific data types.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Custom classifiers:
              </strong>{" "}
              We train or fine-tune quality classifiers on domain-representative
              samples from your data. This produces classifiers that understand
              quality in context.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Calibrated perplexity:
              </strong>{" "}
              Perplexity depends on the reference model. We calibrate using
              domain-appropriate models so technical jargon is not penalized.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Custom heuristics:
              </strong>{" "}
              Some quality signals are domain-specific. Code needs syntax
              checks, scientific text needs citation patterns, dialogue needs
              conversational markers.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Validation sampling:
              </strong>{" "}
              We validate quality scoring accuracy on domain-specific samples
              through human review, ensuring the scoring actually captures
              domain quality.
            </li>
          </ul>
          <p>
            Domain adaptation is essential. Generic pipelines systematically
            mishandle specialized content.
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
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Acquire
                  </Link>
                  <Link
                    href="/pillars/prepare"
                    className="block px-3 py-2 text-sm text-[var(--accent-primary)] rounded hover:bg-[var(--bg-primary)]"
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
              href="/pillars/prepare"
              className="hover:text-[var(--text-primary)]"
            >
              Prepare
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--accent-primary)]">
              Quality Scoring
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
                02.2
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Quality Scoring
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Separate Signal from
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Noise at Scale
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Raw web data is 10-1000x larger than what you can train on.
              Quality filtering determines which content survives. Get it wrong
              and you waste compute on noise or lose valuable diversity.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              <Citation href="https://huggingface.co/datasets/HuggingFaceFW/fineweb">
                FineWeb
              </Citation>{" "}
              demonstrated that careful quality filtering produces datasets
              where models trained on fewer tokens outperform models trained on
              larger, unfiltered corpora. We bring the same rigorous methodology
              to your data.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Score Your Data <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/prepare" variant="secondary" size="lg">
                Back to Prepare
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
              What Is the Quality-Diversity Tradeoff in AI Training Data?
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Quality filtering creates brutal tradeoffs. Filter too
                aggressively and you eliminate valuable content diversity,
                biasing your model toward overrepresented styles and domains.
                Filter too loosely and noise compounds through training,
                degrading performance in ways that do not surface until
                evaluation.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://arxiv.org/abs/2306.01116">
                  RefinedWeb
                </Citation>{" "}
                achieved state-of-the-art performance by combining multiple
                quality signals: perplexity filtering, heuristic rules, and
                classifier-based scoring. The key insight is that no single
                quality metric captures everything. Different signals catch
                different quality problems.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://huggingface.co/datasets/HuggingFaceFW/fineweb">
                  FineWeb
                </Citation>{" "}
                extended this work with educational value filtering,
                demonstrating that domain-specific quality classifiers can
                dramatically improve downstream model performance on reasoning
                tasks.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Perplexity filtering alone misses toxicity and factual errors.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Classifier-based filtering requires domain-specific training
                  data.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Heuristic rules catch patterns but miss semantic quality.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  One-size-fits-all thresholds systematically bias filtered
                  data.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                The solution is multi-signal scoring with domain-specific
                calibration. Each quality signal contributes information that
                others miss. Thresholds must be tuned for your specific data
                distribution and model objectives.
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
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// HOW IT WORKS"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              How Does Claru&apos;s Multi-Signal Quality Pipeline Work?
            </h2>

            <p className="text-[var(--text-secondary)] text-lg mb-12">
              We combine multiple quality signals, each capturing different
              aspects of content quality, with configurable thresholds tuned for
              your specific use case.
            </p>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Perplexity Scoring",
                  description:
                    "Language model perplexity measures how surprising text is given a reference model. Low perplexity indicates coherent, well-formed text. High perplexity flags machine-generated garbage, garbled encoding, or highly specialized jargon. We calibrate thresholds using domain-appropriate reference models.",
                },
                {
                  step: "02",
                  title: "Quality Classifiers",
                  description:
                    "Trained classifiers predict content quality based on features learned from high-quality reference data. We use general web quality classifiers and train domain-specific classifiers when your data requires specialized assessment. Educational value, factual density, and writing quality can each be modeled.",
                },
                {
                  step: "03",
                  title: "Heuristic Filtering",
                  description:
                    "Rule-based filters catch patterns that model-based approaches miss: repetitive text, boilerplate, excessive punctuation, URL density, and formatting artifacts. These fast filters remove obvious noise before more expensive scoring.",
                },
                {
                  step: "04",
                  title: "Diversity Preservation",
                  description:
                    "Quality filtering can inadvertently remove entire content categories. We monitor distribution shifts throughout filtering, tracking coverage across topics, writing styles, and domains. Alerts flag when filtering disproportionately affects specific categories.",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scoring Dimensions & Configuration
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Configurable quality scoring across multiple dimensions with
              tunable thresholds for your specific requirements.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Gauge className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Signals</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Perplexity (language model confidence)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Fluency (grammar, coherence)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Educational value (reasoning, factual)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Toxicity (harmful content detection)
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Heuristic Filters
                </h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Repetition detection (n-gram, paragraph)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Boilerplate removal (headers, footers)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Format artifacts (encoding, HTML)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Length and structure constraints
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Configuration</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Per-signal threshold tuning
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Domain-specific calibration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Multi-version delivery (A/B testing)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Iterative threshold refinement
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Outputs</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Per-document quality scores
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Filtered datasets at threshold
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Distribution shift reports
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Coverage analysis by category
                  </li>
                </ul>
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
              Where Does Quality Scoring Matter Most?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Quality scoring is critical for web corpus filtering, instruction tuning data curation, and domain-specific corpora preparation. Different training objectives require different quality
              optimization strategies, and the right approach depends on your data distribution and model goals.
            </p>

            <div className="space-y-6">
              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Filter className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Web Corpus Filtering
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      CommonCrawl, web scrapes, multi-source aggregation
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Web data is inherently noisy. Most CommonCrawl content is
                  boilerplate, spam, or low-quality machine-generated text.
                  Quality filtering typically removes 90%+ of raw web data.{" "}
                  <Citation href="https://arxiv.org/abs/2306.01116">
                    RefinedWeb
                  </Citation>{" "}
                  demonstrated that aggressive filtering with the right signals
                  produces datasets where models trained on fewer tokens
                  outperform models trained on larger, unfiltered corpora.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    90%+ noise removal
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Multi-signal scoring
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Diversity preservation
                  </span>
                </div>
              </div>

              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Instruction Tuning Data
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      SFT datasets, chat data, task-specific corpora
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Instruction tuning data quality directly impacts model
                  helpfulness and harmlessness. Low-quality instructions teach
                  models bad habits. We score instruction-response pairs for
                  relevance, completeness, and safety. Educational value
                  classifiers identify content that teaches reasoning and
                  factual knowledge.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Instruction relevance
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Response quality
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Safety filtering
                  </span>
                </div>
              </div>

              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Gauge className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Domain-Specific Corpora
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Code, medical, legal, scientific text
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Domain-specific data requires domain-specific quality metrics.
                  Code quality involves syntax correctness and style compliance.
                  Medical text needs accuracy and citation verification. Legal
                  documents require structural completeness. Generic quality
                  classifiers misclassify domain content. We develop custom
                  scoring for specialized corpora.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Domain classifiers
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Calibrated thresholds
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Expert validation
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
              Ready to Improve Your Data Quality?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Noise in training data compounds through model training.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your data and training objectives. We will scope a
              quality scoring pipeline that balances signal quality with content
              diversity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Start Quality Scoring <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/prepare" variant="secondary" size="lg">
                Back to Prepare
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-12 border-t border-[var(--border-subtle)]">
        <div className="container">
          <p className="text-sm font-mono text-[var(--accent-primary)] mb-4">
            // RELATED PREPARE SERVICES
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/pillars/prepare/deduplication"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">02.1</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Deduplication
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Multi-level duplicate removal at scale
              </p>
            </Link>
            <Link
              href="/pillars/prepare/multimodal-alignment"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">02.3</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Multimodal Alignment
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Cross-modal synchronization
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
