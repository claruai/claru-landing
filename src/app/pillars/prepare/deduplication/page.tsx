"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  ChevronRight,
  ArrowRight,
  Database,
  Cpu,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";

export default function DeduplicationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "How do you handle near-duplicates vs exact duplicates?",
      answer: (
        <>
          <p className="mb-3">
            Near-duplicates and exact duplicates require fundamentally different
            detection methods. We use a layered approach because no single
            technique catches all duplicate types effectively.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Exact duplicates:
              </strong>{" "}
              Hash-based matching with SHA-256 or xxHash at the document level.
              Fast, deterministic, and catches identical documents regardless of
              corpus position.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Near-duplicates:
              </strong>{" "}
              MinHashLSH with configurable shingle size and similarity
              threshold. Documents with Jaccard similarity above threshold
              (typically 0.7-0.9) are flagged as duplicates.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Semantic duplicates:
              </strong>{" "}
              Embedding-based similarity using dense retrievers. Catches
              paraphrased content that word-based methods miss entirely.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Substring duplicates:
              </strong>{" "}
              Suffix array detection finds verbatim matches of 50+ tokens that
              appear across otherwise different documents.
            </li>
          </ul>
          <p>
            Each method has different precision-recall tradeoffs. We configure
            the combination based on your data characteristics and downstream
            requirements.
          </p>
        </>
      ),
    },
    {
      question: "What deduplication thresholds should I use?",
      answer: (
        <>
          <p className="mb-3">
            There is no universal optimal threshold. The right choice depends on
            your data distribution, model architecture, and training objectives.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Aggressive (0.7 Jaccard):
              </strong>{" "}
              Removes more content, reducing dataset size but potentially
              eliminating legitimate variations. Good for web corpora with high
              boilerplate.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Moderate (0.8 Jaccard):
              </strong>{" "}
              Balanced approach used by most production pipelines. Catches
              obvious duplicates while preserving content diversity.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Conservative (0.9 Jaccard):
              </strong>{" "}
              Preserves more content, leaving some near-duplicates but
              minimizing false positives. Better for curated domains where
              similar content may be intentionally distinct.
            </li>
          </ul>
          <p>
            We recommend empirical testing. Deliver multiple versions with
            different thresholds, train small models, and measure downstream
            performance before committing to a specific configuration.
          </p>
        </>
      ),
    },
    {
      question: "How fast can you process trillion-token datasets?",
      answer: (
        <>
          <p className="mb-3">
            Processing speed varies significantly based on deduplication scope
            and data complexity. Here are realistic timelines for trillion-scale
            work.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Throughput:
              </strong>{" "}
              Our distributed pipeline processes terabytes per day for
              MinHashLSH deduplication. Semantic deduplication is slower due to
              embedding computation.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Trillion-token timeline:
              </strong>{" "}
              Comprehensive multi-level deduplication (document + paragraph +
              line + semantic) for 1T+ tokens takes weeks with distributed
              infrastructure.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Memory efficiency:
              </strong>{" "}
              Standard MinHashLSH implementations fail at scale. We use LSHBloom
              variants that replace expensive hash table indexes with
              lightweight Bloom filters, enabling processing that naive
              approaches cannot handle.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Incremental processing:
              </strong>{" "}
              For ongoing data ingestion, we support incremental deduplication
              against existing index structures without full reprocessing.
            </li>
          </ul>
          <p>
            Timeline estimates depend on your specific requirements. We scope
            every project with concrete deliverable milestones.
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
            <span className="text-[var(--accent-primary)]">Deduplication</span>
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
                02.1
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Deduplication
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Remove Duplicates at
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Trillion-Token Scale
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Duplicates in training data cause memorization, waste compute, and
              contaminate benchmarks. At trillion-token scale, even 0.1%
              duplication means billions of wasted training examples.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              <Citation href="https://www.cerebras.ai/blog/slimpajama-a-627b-token-cleaned-and-deduplicated-version-of-redpajama">
                SlimPajama
              </Citation>{" "}
              achieved higher information density through extensive
              deduplication. We bring the same rigorous methodology to your
              datasets using MinHashLSH, semantic similarity, and multi-level
              matching.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Deduplicate Your Data <ArrowRight className="w-4 h-4" />
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
              Why Deduplication Is the Biggest Bottleneck
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://zilliz.com/blog/data-deduplication-at-trillion-scale-solve-the-biggest-bottleneck-of-llm-training">
                  Deduplication is the biggest bottleneck
                </Citation>{" "}
                of LLM training at trillion-token scale. When Kimi K2 tripled
                its dataset to 15.5 trillion tokens, the deduplication
                infrastructure became the critical path for the entire training
                pipeline.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The consequences of inadequate deduplication compound throughout
                training. Duplicated content causes models to memorize specific
                sequences rather than learning generalizable patterns. This
                reduces reasoning accuracy by up to 4% on benchmark tasks and
                increases privacy leakage in model outputs by 8x.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://aclanthology.org/2022.acl-long.577.pdf">
                  Research from ACL
                </Citation>{" "}
                found that web corpora contain massive duplication that
                single-method approaches miss. 77% of content flagged by fuzzy
                deduplication has exact substring matches of 50+ tokens embedded
                within. These overlapping duplicate types require multi-level
                detection.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Exact deduplication misses near-duplicates with minor edits.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Fuzzy deduplication misses paraphrased content with identical
                  meaning.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Document-level deduplication misses duplicated paragraphs
                  embedded in unique documents.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Standard implementations hit memory walls before reaching
                  trillion-token scale.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                The infrastructure challenge is immense.{" "}
                <Citation href="https://arxiv.org/html/2411.04257v3">
                  Naive LSH implementations
                </Citation>{" "}
                attempting to deduplicate 600GB datasets exhaust 64GB of memory,
                forcing single-process execution that takes hours per batch.
                Trillion-token datasets require purpose-built distributed
                systems.
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
              Multi-Level Deduplication Pipeline
            </h2>

            <p className="text-[var(--text-secondary)] text-lg mb-12">
              We use the same methodology that produced{" "}
              <Citation href="https://arxiv.org/abs/2306.01116">
                RefinedWeb
              </Citation>{" "}
              and{" "}
              <Citation href="https://www.cerebras.ai/blog/slimpajama-a-627b-token-cleaned-and-deduplicated-version-of-redpajama">
                SlimPajama
              </Citation>
              , scaled for your specific data and requirements.
            </p>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Document-Level Exact Deduplication",
                  description:
                    "Hash-based matching using SHA-256 or xxHash to identify and remove byte-identical documents. This fast first pass typically removes 10-20% of raw web data with zero false positives.",
                },
                {
                  step: "02",
                  title: "MinHashLSH Fuzzy Deduplication",
                  description:
                    "Locality-sensitive hashing detects near-duplicates at scale. We configure shingle size (typically 5-13 tokens), number of hash functions (128-256), and similarity threshold (0.7-0.9) based on your data characteristics. Our LSHBloom implementation uses Bloom filters instead of hash tables to handle trillion-token scale within memory constraints.",
                },
                {
                  step: "03",
                  title: "Paragraph and Line-Level Matching",
                  description:
                    "Many documents are unique at the document level but contain duplicated paragraphs or boilerplate text. We apply deduplication at multiple granularities to catch embedded duplicates that document-level approaches miss entirely.",
                },
                {
                  step: "04",
                  title: "Semantic Similarity Detection",
                  description:
                    "Embedding-based deduplication using dense retrievers catches paraphrased content where word overlap is low but meaning is identical. This is computationally expensive but critical for high-quality datasets.",
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
              Infrastructure for Scale
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Purpose-built deduplication infrastructure that handles
              trillion-token datasets without hitting memory walls.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scale</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Trillion-token datasets (RefinedWeb, RedPajama scale)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Terabytes per day throughput
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Distributed processing across clusters
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Incremental deduplication for ongoing ingestion
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Algorithms</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    MinHashLSH with configurable parameters
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    LSHBloom for memory-efficient indexing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Suffix arrays for substring detection
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Dense retriever embeddings for semantic dedup
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Configuration</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Shingle size: 5-13 tokens (tuned per domain)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Similarity threshold: 0.7-0.9 Jaccard
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Hash functions: 128-256 per signature
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Multi-level: document, paragraph, line
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Outputs</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Deduplicated dataset with full provenance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Duplicate cluster reports for analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Deduplication statistics and metrics
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Reproducible pipeline configuration
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
              When You Need Deduplication
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Every major dataset preparation effort requires rigorous
              deduplication. Here is where it matters most.
            </p>

            <div className="space-y-6">
              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      LLM Pre-Training Corpora
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      CommonCrawl, web scrapes, multi-source datasets
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Web-scale datasets contain 30%+ duplicate content from
                  boilerplate, syndicated articles, and scraped mirrors.{" "}
                  <Citation href="https://arxiv.org/abs/2306.01116">
                    RefinedWeb
                  </Citation>{" "}
                  demonstrated that rigorous deduplication produces datasets
                  where models trained on fewer tokens outperform models trained
                  on larger duplicated corpora.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Compute efficiency
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Memorization prevention
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Privacy compliance
                  </span>
                </div>
              </div>

              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Benchmark Curation
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Evaluation sets, held-out test data, benchmark suites
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Benchmark contamination is a critical problem. If evaluation
                  data appears in training corpora, benchmark scores become
                  meaningless. We identify and remove any overlap between your
                  training data and standard benchmarks or held-out evaluation
                  sets.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Contamination detection
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Evaluation integrity
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Benchmark curation
                  </span>
                </div>
              </div>

              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Multi-Source Data Aggregation
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Combining datasets, data marketplace purchases, web
                      scrapes
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Aggregating data from multiple sources creates massive
                  cross-source duplication. The same content appears in
                  different datasets under different formatting. Without
                  cross-source deduplication, you pay for and train on the same
                  information multiple times.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Cross-source matching
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Format normalization
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Cost optimization
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
              Ready to Clean Your Data?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Duplicates are silently degrading your model performance.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your dataset and training objectives. We will scope
              a deduplication pipeline tailored to your specific requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Start Deduplication <ArrowRight className="w-4 h-4" />
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
              href="/pillars/prepare/quality-scoring"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">02.2</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Quality Scoring
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Multi-signal scoring and filtering
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
