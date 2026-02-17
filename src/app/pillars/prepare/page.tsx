"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  FileText,
  Cpu,
  Filter,
  Video,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import CapabilityCard from "@/app/components/ui/CapabilityCard";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";

export default function PreparePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const capabilities = [
    {
      icon: Layers,
      title: "Deduplication",
      description: "Multi-level deduplication from documents to n-grams",
      details: [
        "MinHashLSH at trillion-token scale",
        "Embedding-based semantic dedup",
        "Paragraph and line-level matching",
        "Cross-document detection",
      ],
    },
    {
      icon: Filter,
      title: "Quality Filtering",
      description: "Configurable thresholds that balance quality and diversity",
      details: [
        "Perplexity and fluency scoring",
        "Domain-specific classifiers",
        "Toxicity and safety filters",
        "Configurable threshold tuning",
      ],
    },
    {
      icon: FileText,
      title: "Format Normalization",
      description: "Standardization and noise removal at petabyte scale",
      details: [
        "Schema standardization",
        "Encoding normalization",
        "Metadata extraction",
        "Format conversion pipelines",
      ],
    },
    {
      icon: Cpu,
      title: "Multimodal Alignment",
      description: "Cross-modal synchronization for video, audio, and text",
      details: [
        "Temporal alignment",
        "Caption-frame matching",
        "Audio-video sync",
        "Cross-modal embeddings",
      ],
    },
  ];

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "What deduplication methods do you use?",
      answer: (
        <>
          <p className="mb-3">
            We use a multi-level deduplication approach because single-method
            approaches miss different types of duplicates.{" "}
            <Citation href="https://zilliz.com/blog/data-deduplication-at-trillion-scale-solve-the-biggest-bottleneck-of-llm-training">
              Research shows deduplication is the biggest bottleneck
            </Citation>{" "}
            in LLM training at trillion-token scale.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                MinHashLSH:
              </strong>{" "}
              Probabilistic fuzzy matching that scales to trillions of tokens.
              We tune shingle size and threshold based on your data
              characteristics.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Semantic deduplication:
              </strong>{" "}
              Embedding-based similarity detection catches near-duplicates that
              differ in formatting or minor wording but convey identical
              information.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Multi-level matching:
              </strong>{" "}
              Document-level, paragraph-level, and line-level deduplication each
              catch different patterns. Using all three together is more
              effective than any single level.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Exact substring:
              </strong>{" "}
              Suffix array-based detection finds verbatim matches of 50+ tokens
              that other methods miss.
            </li>
          </ul>
          <p>
            The right combination depends on your data source and model
            architecture. We configure the pipeline based on your specific
            requirements.
          </p>
        </>
      ),
    },
    {
      question: "How do you handle quality vs. quantity tradeoffs?",
      answer: (
        <>
          <p className="mb-3">
            Aggressive filtering removes low-quality content but can eliminate
            valuable diversity. Under-filtering keeps noise that degrades model
            performance. The right threshold is domain-specific.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Configurable thresholds:
              </strong>{" "}
              We don&apos;t apply one-size-fits-all filters. Thresholds for
              perplexity, fluency, and content classifiers are tuned based on
              your data distribution and model goals.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Domain-specific classifiers:
              </strong>{" "}
              Code quality differs from prose quality differs from dialogue
              quality. We use specialized classifiers for each content type.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Diversity preservation:
              </strong>{" "}
              We monitor distribution shifts during filtering to ensure
              you&apos;re not inadvertently removing entire categories of useful
              content.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                A/B testing support:
              </strong>{" "}
              We can deliver multiple filtered versions with different
              thresholds so you can empirically test which works best for your
              model.
            </li>
          </ul>
          <p>
            Quality filtering is not a preprocessing step you set and
            forget—it&apos;s an ongoing calibration based on downstream model
            performance.
          </p>
        </>
      ),
    },
    {
      question: "Can you process multimodal data?",
      answer: (
        <>
          <p className="mb-3">
            Yes. Multimodal alignment is one of our core capabilities, and
            it&apos;s increasingly critical as models move beyond text.{" "}
            <Citation href="https://arxiv.org/html/2503.09081v1">
              Cross-modal alignment
            </Citation>{" "}
            requires precise synchronization—misaligned data teaches models the
            wrong associations.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Video-text alignment:
              </strong>{" "}
              Frame-level caption matching with sub-50ms temporal precision.
              Essential for video generation and understanding models.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Audio-video sync:
              </strong>{" "}
              Speech-to-lip synchronization, sound event alignment, and
              multi-track audio normalization.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Cross-modal embeddings:
              </strong>{" "}
              Verification that different modalities map to consistent semantic
              representations.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Resolution normalization:
              </strong>{" "}
              Handling variable frame rates, aspect ratios, and quality levels
              across source datasets.
            </li>
          </ul>
          <p>
            For video-language models like those powering Sora or Runway, the
            quality of multimodal alignment directly impacts generation quality.
          </p>
        </>
      ),
    },
    {
      question: "What scale can you handle?",
      answer: (
        <>
          <p className="mb-3">
            We process trillion-token datasets using distributed infrastructure
            designed for this specific problem.{" "}
            <Citation href="https://arxiv.org/abs/2306.01116">
              RefinedWeb
            </Citation>{" "}
            processed 5 trillion tokens;{" "}
            <Citation href="https://github.com/togethercomputer/RedPajama-Data">
              RedPajama-V2
            </Citation>{" "}
            scaled to 30 trillion. We operate at comparable scale.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Throughput:
              </strong>{" "}
              Terabytes per day for deduplication and filtering pipelines, with
              horizontal scaling for larger jobs.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Memory-efficient algorithms:
              </strong>{" "}
              Standard LSH implementations hit memory walls at scale. We use
              optimized variants like LSHBloom that replace expensive indexes
              with lightweight Bloom filters.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Distributed processing:
              </strong>{" "}
              Parallelized pipelines across multiple nodes with careful handling
              of cross-shard deduplication.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Incremental processing:
              </strong>{" "}
              For ongoing data ingestion, we support incremental deduplication
              against existing datasets without reprocessing everything.
            </li>
          </ul>
          <p>
            Timeline varies by data type and complexity. Text deduplication at
            trillion-token scale: weeks. Multimodal alignment for millions of
            video clips: months. We scope every project with realistic
            estimates.
          </p>
        </>
      ),
    },
    {
      question: "How do you ensure data lineage and versioning?",
      answer: (
        <>
          <p className="mb-3">
            Reproducibility is essential for debugging training issues and
            meeting compliance requirements. Every transformation we apply is
            tracked with full provenance documentation.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Source tracking:
              </strong>{" "}
              Every sample in the final dataset traces back to its original
              source with complete metadata about collection date, source URL,
              and raw format.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Transformation logs:
              </strong>{" "}
              Each processing step—deduplication, filtering, normalization—is
              logged with parameters used and samples affected.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Version control:
              </strong>{" "}
              Dataset versions are immutable snapshots. If you need to
              understand why a model behaves differently between training runs,
              you can diff the exact datasets used.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Audit trails:
              </strong>{" "}
              For regulated industries or enterprise compliance, we provide
              documentation that satisfies legal and security review
              requirements.
            </li>
          </ul>
          <p>
            When a training run produces unexpected results, the first question
            is always &quot;what changed in the data?&quot; Our lineage
            documentation gives you the answer.
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
              href="/#services"
              className="hover:text-[var(--text-primary)]"
            >
              Services
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--accent-primary)]">Prepare</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 relative overflow-hidden">
        {/* Background decoration */}
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
                02
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Data Preparation
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble text="PREPARE" scrambleOnHover={true} />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Raw Data Is Worthless. Prepared Data Is Everything.
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              <Citation href="https://venturebeat.com/ai/why-data-remains-the-greatest-challenge-for-machine-learning-projects">
                80% of ML project time
              </Citation>{" "}
              goes to data work. Most of it fighting duplicates, noise, and
              format chaos.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              Frontier models train on trillions of tokens. At that scale, a 1%
              duplicate rate means 10 billion wasted training examples. A loose
              quality filter lets millions of garbage samples through.{" "}
              <strong className="text-[var(--text-primary)]">
                We turn petabytes of noise into training-ready signal.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Transform Your Pipeline <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="#capabilities" variant="secondary" size="lg">
                Explore Capabilities
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
              The Preparation Bottleneck
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Data preparation isn&apos;t a preprocessing step—it&apos;s the
                main event.{" "}
                <Citation href="https://venturebeat.com/ai/why-data-remains-the-greatest-challenge-for-machine-learning-projects">
                  Data scientists spend 80% of their time
                </Citation>{" "}
                on data preparation and management. At trillion-token scale, the
                complexity explodes.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://zilliz.com/blog/data-deduplication-at-trillion-scale-solve-the-biggest-bottleneck-of-llm-training">
                  Deduplication is the biggest bottleneck
                </Citation>{" "}
                of LLM training. When Kimi K2 tripled its dataset to 15.5
                trillion tokens, even 0.1% duplication wastes $150K+ in compute.
                Duplicated data reduces accuracy by 4% on reasoning tasks and
                increases privacy leakage 8x in model outputs.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                Quality filtering creates brutal tradeoffs. Filter too
                aggressively and you lose diversity—eliminating entire domains
                or writing styles. Filter too loosely and noise compounds
                through training, degrading model performance in ways that
                don&apos;t surface until evaluation.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t just run naive deduplication on trillion
                  tokens—standard implementations hit memory walls.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t use one-size-fits-all quality
                  thresholds—optimal filtering varies by domain.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t ignore multimodal alignment—mismatched
                  video-caption pairs teach wrong associations.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t skip data versioning—debugging training
                  failures requires knowing exactly what changed.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The infrastructure requirements are immense.{" "}
                <Citation href="https://arxiv.org/html/2411.04257v3">
                  Standard LSH-based deduplication
                </Citation>{" "}
                fails at scale—initial attempts on 600GB datasets exhaust 64GB
                of memory, forcing single-process execution that takes hours per
                batch.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  The labs with rigorous data preparation ship better models.
                </p>
                <p className="text-[var(--text-secondary)]">
                  The rest debug training failures for months.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Context Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why Data Preparation Is the Hidden Multiplier
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The scale of modern training data has made preparation a
                make-or-break capability. Consider what frontier labs are
                processing:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://arxiv.org/abs/2306.01116">
                      RefinedWeb
                    </Citation>{" "}
                    extracted 5 trillion tokens from CommonCrawl using strict
                    deduplication, achieving removal rates far higher than
                    previous datasets
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://github.com/togethercomputer/RedPajama-Data">
                      RedPajama-V2
                    </Citation>{" "}
                    scaled to 30 trillion tokens with 40+ quality signals for
                    filtering, setting a new standard for web datasets
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://aclanthology.org/2022.acl-long.577.pdf">
                      Research shows
                    </Citation>{" "}
                    web corpora contain massive duplication—77% of content
                    flagged by fuzzy dedup has exact substring matches of 50+
                    tokens
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://www.cerebras.ai/blog/slimpajama-a-627b-token-cleaned-and-deduplicated-version-of-redpajama">
                      SlimPajama
                    </Citation>{" "}
                    achieved higher information density through extensive
                    deduplication—same compute budget yields higher accuracy
                  </span>
                </li>
              </ul>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Video and robotics models face additional challenges.{" "}
                <Citation href="https://arxiv.org/html/2405.04682v4">
                  Time-aligned captions
                </Citation>{" "}
                require precise temporal synchronization—each frame needs
                matching text at the right timestamp. Sensor data from multiple
                robots must be normalized across different embodiments and
                action spaces.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                This isn&apos;t work you can outsource to generic data
                pipelines. It must be{" "}
                <strong className="text-[var(--text-primary)]">
                  purposefully configured
                </strong>{" "}
                by teams who understand both the infrastructure requirements of
                petabyte-scale processing and the downstream effects on model
                training.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// PROOF"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Results From the Field
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Detailed case studies coming soon. In the meantime,{" "}
              <Link
                href="/#contact"
                className="text-[var(--accent-primary)] hover:underline"
              >
                contact us
              </Link>{" "}
              to discuss your specific data preparation needs.
            </p>

            {/* Placeholder cards for future case studies */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5 text-[var(--accent-primary)] opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-tertiary)]">
                  Foundation Model Lab
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  10T+ tokens deduplicated and quality-filtered for pre-training
                  pipeline.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5 text-[var(--accent-primary)] opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-tertiary)]">
                  Video AI Startup
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Cross-modal alignment pipeline for 5M video-caption pairs with
                  frame-level precision.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// CAPABILITIES"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How We Prepare Data
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Four specialized pipelines for transforming raw data into ML-ready
              datasets.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((cap, index) => (
              <CapabilityCard key={cap.title} {...cap} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our Preparation Process
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Data Audit",
                  description:
                    "We analyze your raw data to understand formats, quality distribution, and preparation requirements. This shapes deduplication strategies and filtering thresholds.",
                },
                {
                  step: "02",
                  title: "Pipeline Configuration",
                  description:
                    "Based on your model architecture and data characteristics, we configure deduplication, filtering, and normalization stages with domain-specific tuning.",
                },
                {
                  step: "03",
                  title: "Processing & Validation",
                  description:
                    "Data flows through multi-stage processing with continuous quality monitoring. We validate outputs against expected distributions and catch anomalies early.",
                },
                {
                  step: "04",
                  title: "Delivery & Integration",
                  description:
                    "Clean, deduplicated, properly formatted data delivered in your preferred format with full lineage documentation for reproducibility.",
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

      {/* Deep Dive Section */}
      <section className="py-16 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// DEEP DIVE"}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Explore Our Preparation Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/pillars/prepare/deduplication"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Layers className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Deduplication
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Multi-level duplicate removal at trillion-token scale
                </p>
              </Link>
              <Link
                href="/pillars/prepare/multimodal-alignment"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Video className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Multimodal Alignment
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Cross-modal synchronization for video-text and image-audio
                </p>
              </Link>
              <Link
                href="/pillars/prepare/quality-scoring"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Filter className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Quality Scoring
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Multi-signal quality filtering with diversity preservation
                </p>
              </Link>
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
              Data Preparation for Frontier Applications
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Each frontier AI domain has unique preparation requirements.
              Here&apos;s what rigorous data preparation looks like at the
              cutting edge.
            </p>

            <div className="space-y-8">
              {/* LLM Pre-Training */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">LLM Pre-Training</h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      GPT, Llama, Mistral
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Large language models train on datasets measured in
                    trillions of tokens.{" "}
                    <Citation href="https://arxiv.org/abs/2306.01116">
                      RefinedWeb
                    </Citation>{" "}
                    extracted <strong>5 trillion tokens</strong> from
                    CommonCrawl—and that was 2023. Modern datasets push 10-30T
                    tokens with increasingly stringent quality requirements.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Web corpora are riddled with duplicates—not just exact
                    matches, but near-duplicates, boilerplate, and templated
                    content. Deduplication typically removes 30%+ of raw data.
                    Quality filtering removes another 10x. What remains must
                    still preserve linguistic diversity.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        30%+
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Typical dedup removal
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        10x
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Quality filter ratio
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        TB/day
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Processing throughput
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Full
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Lineage tracking
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Video-Language Models */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Video-Language Models
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Sora, Runway, Veo
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Video generation requires datasets where every caption
                    precisely describes what&apos;s happening at each moment.{" "}
                    <Citation href="https://arxiv.org/html/2405.04682v4">
                      Time-aligned captions
                    </Citation>{" "}
                    must synchronize text descriptions with visual content
                    across multiple scenes—a caption saying &quot;the ball
                    bounces&quot; must align with the exact frames where
                    bouncing occurs.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Most video-text datasets have loose alignment—captions
                    describe entire clips rather than specific moments.
                    Multi-scene videos need per-scene descriptions with temporal
                    boundaries. Audio tracks must sync with visual events.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        &lt;50ms
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Sync tolerance
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Frame
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Alignment level
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Multi-res
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Resolution handling
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Dense
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Caption density
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Robotics Datasets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Robotics Datasets</h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      RT-X, OpenVLA
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Robotics models must generalize across different robot
                    embodiments and environments. The{" "}
                    <Citation href="https://robotics-transformer-x.github.io/">
                      Open X-Embodiment
                    </Citation>{" "}
                    dataset aggregates trajectories from 34 research labs—but
                    each lab collected data with different robots, sensors, and
                    action representations.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Action spaces vary between robots. Camera calibrations
                    differ. Sensor noise profiles are inconsistent.
                    Cross-embodiment training requires normalizing all of this
                    into a unified representation while preserving the
                    information needed for policy learning.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        6-DOF
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Action normalization
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Multi
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Sensor fusion
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Cross
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Platform support
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        NL
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Task labels
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
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
      <section id="contact" className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Fighting Your Data Pipeline
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Your researchers shouldn&apos;t spend 80% of their time on data
              logistics.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us what you&apos;re training. We&apos;ll scope a preparation
              pipeline that delivers clean, deduplicated, properly formatted
              data your models need.
            </p>
            <Button href="/#contact" variant="cta-glitch" size="lg">
              Discuss Your Data Requirements <ArrowRight className="w-4 h-4" />
            </Button>
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
              href="/pillars/acquire"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">01</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Acquire
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Custom data collection & licensing
              </p>
            </Link>
            <Link
              href="/pillars/enrich"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">03</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Enrich
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Expert annotation & RLHF
              </p>
            </Link>
            <Link
              href="/pillars/validate"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">04</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Validate
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Red teaming & quality assurance
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
