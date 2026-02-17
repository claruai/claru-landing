"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Database,
  Scale,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Target,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import CapabilityCard from "@/app/components/ui/CapabilityCard";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";

export default function ValidatePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const capabilities = [
    {
      icon: ShieldCheck,
      title: "Red Teaming",
      description:
        "Adversarial testing to find vulnerabilities before deployment",
      details: [
        "Multi-vector jailbreak attempts",
        "Prompt injection testing",
        "Safety boundary probing",
        "Automated + human hybrid attacks",
      ],
    },
    {
      icon: Database,
      title: "Benchmark Curation",
      description: "Clean evaluation sets free from training contamination",
      details: [
        "Golden test set creation",
        "Contamination verification",
        "Difficulty stratification",
        "Domain-specific eval design",
      ],
    },
    {
      icon: Scale,
      title: "Bias Detection",
      description: "Systematic audits for fairness and representation",
      details: [
        "Demographic parity testing",
        "Representation analysis",
        "Intersectional bias audits",
        "Allocation fairness checks",
      ],
    },
    {
      icon: CheckCircle,
      title: "Post-Training Evaluation",
      description: "Production readiness assessment before deployment",
      details: [
        "Regression detection",
        "Performance benchmarking",
        "Safety threshold verification",
        "Deployment gate checks",
      ],
    },
  ];

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "What red teaming methodologies does Claru use?",
      answer: (
        <>
          <p className="mb-3">
            We employ a multi-layered approach combining automated attacks with
            expert human red teaming. Our methodology covers{" "}
            <Citation href="https://www.giskard.ai/knowledge/best-ai-red-teaming-tools-2025-comparison-features">
              40+ vulnerability categories
            </Citation>{" "}
            aligned with industry frameworks:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Automated scanning:
              </strong>{" "}
              Multi-turn jailbreaks, encoding obfuscations, prompt injection
              variants, and adaptive attack sequences that probe safety
              boundaries systematically.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Expert human testing:
              </strong>{" "}
              Security researchers who understand model architectures, find
              novel attack vectors, and evaluate nuanced failure modes that
              automated tools miss.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Framework alignment:
              </strong>{" "}
              Tests mapped to OWASP LLM Top 10, NIST AI RMF, and EU AI Act
              requirements so results translate directly to compliance
              documentation.
            </li>
          </ul>
          <p>
            Results include severity scoring, reproducible attack chains, and
            prioritized remediation recommendations.
          </p>
        </>
      ),
    },
    {
      question: "How do you prevent benchmark contamination?",
      answer: (
        <>
          <p className="mb-3">
            Benchmark contamination undermines evaluation validity.{" "}
            <Citation href="https://arxiv.org/html/2502.06215v1">
              Research shows
            </Citation>{" "}
            some benchmarks have 100% leakage ratios, with models scoring 4.9x
            higher on leaked samples than non-leaked ones. We ensure clean
            evaluation through:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Novel data creation:
              </strong>{" "}
              Golden test sets built from expert-generated content that has
              never appeared in public training corpora or web crawls.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Contamination verification:
              </strong>{" "}
              N-gram analysis, perplexity testing, and canary insertion to
              verify test sets haven&apos;t leaked into training data.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Embargo protocols:
              </strong>{" "}
              Strict access controls, time-limited evaluation windows, and
              rotation schedules to prevent future contamination.
            </li>
          </ul>
          <p>Your benchmarks measure actual capability, not memorization.</p>
        </>
      ),
    },
    {
      question: "What types of bias can you detect?",
      answer: (
        <>
          <p className="mb-3">
            AI bias manifests in multiple forms.{" "}
            <Citation href="https://www.technologyreview.com/2025/03/11/1113000/two-new-measures-show-where-ai-models-fail-on-fairness/">
              Recent research
            </Citation>{" "}
            found AI models recommending salaries up to $120K lower for equally
            qualified female candidates in negotiation scenarios. We test for:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Demographic bias:
              </strong>{" "}
              Differential treatment across race, gender, age, disability, and
              intersectional combinations.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Representation bias:
              </strong>{" "}
              Stereotypical outputs, underrepresentation of groups, and harmful
              associations in generated content.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Allocation bias:
              </strong>{" "}
              Unfair resource distribution in recommendation, ranking, and
              decision-making systems.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Systematic errors:
              </strong>{" "}
              Pattern analysis to identify consistent failure modes across
              demographic segments.
            </li>
          </ul>
          <p>
            Audits include quantitative metrics (statistical parity, equalized
            odds) and qualitative assessment of failure severity.
          </p>
        </>
      ),
    },
    {
      question: "How do you create golden evaluation sets?",
      answer: (
        <>
          <p className="mb-3">
            Golden sets are the foundation of trustworthy evaluation. We build
            them through a rigorous process:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Expert generation:
              </strong>{" "}
              Domain specialists create novel test cases that challenge model
              capabilities without duplicating existing benchmarks.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Difficulty stratification:
              </strong>{" "}
              Cases calibrated across easy, medium, and hard tiers so you can
              track capability curves, not just aggregate scores.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Ground truth validation:
              </strong>{" "}
              Multi-annotator verification with inter-annotator agreement
              thresholds to ensure answer quality.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Embargo management:
              </strong>{" "}
              Access controls, rotation schedules, and refresh cycles to
              maintain evaluation integrity over time.
            </li>
          </ul>
          <p>
            Golden sets remain private and are periodically refreshed to prevent
            optimization-through-leakage.
          </p>
        </>
      ),
    },
    {
      question: "Do you help with EU AI Act compliance?",
      answer: (
        <>
          <p className="mb-3">
            Yes. The{" "}
            <Citation href="https://artificialintelligenceact.eu/implementation-timeline/">
              EU AI Act
            </Citation>{" "}
            requires documented red teaming and bias testing for high-risk AI
            systems, with full enforcement starting August 2026. We provide:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Documented red teaming:
              </strong>{" "}
              Structured adversarial testing with audit trails that satisfy
              Article 9 risk management requirements.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Bias audits:
              </strong>{" "}
              Fairness testing across protected attributes with quantitative
              metrics for non-discrimination compliance.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Technical documentation:
              </strong>{" "}
              Reports formatted for regulatory review, including methodology,
              findings, and remediation evidence.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Ongoing monitoring:
              </strong>{" "}
              Post-deployment evaluation frameworks for continuous compliance as
              models evolve.
            </li>
          </ul>
          <p>
            Non-compliance penalties reach EUR 35 million or 7% of global
            turnover. Proper validation is cheaper than fines.
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
                    className="block px-3 py-2 text-sm text-[var(--accent-primary)] rounded hover:bg-[var(--bg-primary)]"
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
            <span className="text-[var(--accent-primary)]">Validate</span>
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
                04
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Data Validation
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble text="VALIDATE" scrambleOnHover={true} />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Ship Broken Models, Break User Trust.
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Your model passed internal benchmarks. Your safety tests came back
              green. Then it went live.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              Six hours later, someone found a jailbreak. A week later, a bias
              audit made headlines. The contaminated benchmark that showed 90%
              accuracy? Real-world performance was 60%.{" "}
              <strong className="text-[var(--text-primary)]">
                Validation isn&apos;t a checkbox. It&apos;s the last line of
                defense.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Start Your Validation <ArrowRight className="w-4 h-4" />
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
              The Hidden Quality Crisis
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Most AI failures don&apos;t happen because teams ship knowingly
                broken models. They happen because{" "}
                <strong className="text-[var(--text-primary)]">
                  validation itself is broken
                </strong>
                .
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Red teaming efforts that look comprehensive leave gaps.{" "}
                <Citation href="https://venturebeat.com/security/red-teaming-llms-harsh-truth-ai-security-arms-race">
                  Research shows
                </Citation>{" "}
                in adversarial machine learning, adaptive attacks can achieve
                high success rates against defenses initially reported as
                robust. The arms race between attacks and defenses moves faster
                than most internal security teams can track.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Benchmark scores look impressive—until you realize the test set
                leaked into training data.{" "}
                <Citation href="https://arxiv.org/html/2502.14425v2">
                  A comprehensive survey
                </Citation>{" "}
                documents how pervasive contamination has become across popular
                benchmarks, with models consistently scoring far higher on
                leaked data than on novel inputs. Your 90% accuracy might be
                60% on genuinely unseen samples.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                Bias compounds silently.{" "}
                <Citation href="https://www.technologyreview.com/2025/03/11/1113000/two-new-measures-show-where-ai-models-fail-on-fairness/">
                  2025 research
                </Citation>{" "}
                found LLMs recommending salaries up to $120K lower for equally
                qualified female candidates. These aren&apos;t edge
                cases—they&apos;re systematic failures that existing fairness
                benchmarks miss.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t red team with yesterday&apos;s attack catalog.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t trust benchmarks that existed before your
                  training data was collected.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t assume bias testing that passed six months ago
                  still holds.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Validation must be continuous, adversarial, and
                  uncontaminated.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The regulatory environment is accelerating this reality. The{" "}
                <Citation href="https://artificialintelligenceact.eu/implementation-timeline/">
                  EU AI Act
                </Citation>{" "}
                now requires documented red teaming for high-risk systems, with
                penalties up to EUR 35 million or 7% of global turnover.
                Validation isn&apos;t optional anymore.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  The labs that validate rigorously ship confidently.
                </p>
                <p className="text-[var(--text-secondary)]">
                  The rest ship scared—and eventually get caught.
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
              Why Validation Is the New Deployment Gate
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                AI safety and validation have become non-negotiable. The shift
                from &quot;nice to have&quot; to &quot;mandatory&quot; happened
                fast:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://www.weforum.org/stories/2025/06/red-teaming-and-safer-ai/">
                      Red teaming has become industry standard
                    </Citation>
                    —Anthropic, OpenAI, Google DeepMind, and Meta all now
                    conduct pre-deployment adversarial testing, with frameworks
                    like NIST AI RMF requiring documented security evaluation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://arxiv.org/html/2502.14425v2">
                      Benchmark contamination
                    </Citation>{" "}
                    is now recognized as a critical evaluation threat, with
                    researchers developing detection methods including n-gram
                    analysis, canary insertion, and perturbation testing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    The{" "}
                    <Citation href="https://artificialintelligenceact.eu/">
                      EU AI Act
                    </Citation>{" "}
                    entered full enforcement in August 2025 for GPAI models,
                    with high-risk system requirements taking effect August
                    2026—including mandatory bias testing and risk documentation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://futureoflife.org/ai-safety-index-summer-2025/">
                      The 2025 AI Safety Index
                    </Citation>{" "}
                    tracks safety practices across major labs, creating public
                    accountability for evaluation rigor and transparency in
                    safety methodologies
                  </span>
                </li>
              </ul>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The attack surface keeps expanding. LLM vulnerabilities span
                prompt injection, jailbreaking, data extraction, and emergent
                misuse patterns that only appear at scale. Video and multimodal
                models introduce new failure modes around deepfakes, harmful
                content generation, and bias in visual outputs.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                This isn&apos;t validation you can automate once and forget.
                It&apos;s{" "}
                <strong className="text-[var(--text-primary)]">
                  continuous adversarial pressure
                </strong>{" "}
                from teams who understand both how models fail and how attackers
                think.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Section - Proof before capabilities */}
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
              to discuss your specific validation needs.
            </p>

            {/* Placeholder cards for future case studies */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-[var(--accent-primary)] opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-tertiary)]">
                  Foundation Model Company
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Pre-deployment red teaming that identified 47 critical
                  vulnerabilities before public release.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Scale className="w-5 h-5 text-[var(--accent-primary)] opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-tertiary)]">
                  Enterprise AI Team
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Comprehensive bias audit for HR decision system achieving EU
                  AI Act compliance.
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
              How We Validate
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Four specialized pipelines for finding what your internal testing
              missed.
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
              Our Validation Process
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Scope Definition",
                  description:
                    "We assess your model type, deployment context, and risk profile to design a validation strategy. This defines attack categories, bias dimensions, and evaluation metrics.",
                },
                {
                  step: "02",
                  title: "Test Design",
                  description:
                    "Based on scope, we create custom red team scenarios, build or source clean benchmarks, and design bias test cases that match your specific use case and regulatory requirements.",
                },
                {
                  step: "03",
                  title: "Evaluation Execution",
                  description:
                    "Systematic testing across all defined vectors. Automated scanning combined with expert human testing to find vulnerabilities that tools miss. Continuous documentation throughout.",
                },
                {
                  step: "04",
                  title: "Reporting & Remediation",
                  description:
                    "Detailed findings with severity scoring, reproducible examples, and prioritized remediation recommendations. We validate fixes and provide re-testing until issues are resolved.",
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
              Explore Our Validation Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/pillars/validate/red-teaming"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Target className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Red Teaming
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Adversarial testing and jailbreak vulnerability discovery
                </p>
              </Link>
              <Link
                href="/pillars/validate/benchmark-curation"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Database className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Benchmark Curation
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Contamination-free golden datasets for model evaluation
                </p>
              </Link>
              <Link
                href="/pillars/validate/bias-detection"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Scale className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Bias Detection
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Systematic fairness evaluation and representation analysis
                </p>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section - Expanded */}
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
              Validation for Frontier Applications
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Each AI domain has unique validation challenges. Here&apos;s what
              rigorous testing requires.
            </p>

            <div className="space-y-8">
              {/* LLM Safety Evaluation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      LLM Safety Evaluation
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      GPT, Claude, Llama, Gemini
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Large language models face an evolving threat landscape.{" "}
                    <Citation href="https://cset.georgetown.edu/article/ai-red-teaming-design-threat-models-and-tools/">
                      CSET research
                    </Citation>{" "}
                    identifies multiple attack categories: prompt injection,
                    jailbreaking, data extraction, and emergent misuse. Each
                    requires different testing methodologies and attack
                    strategies.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Defenses that block one attack often fail against variants.
                    Jailbreaks that worked yesterday may not work today—but new
                    ones emerge constantly. You need red teamers who stay ahead
                    of the attack curve, not behind it.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        40+
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Vulnerability categories
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Multi-turn
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Attack sequences
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Human+Auto
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Hybrid testing
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        NIST/OWASP
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Framework aligned
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Benchmark Integrity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Benchmark Integrity
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Evaluation sets, golden test data
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Benchmark contamination is more pervasive than most teams
                    realize.{" "}
                    <Citation href="https://arxiv.org/abs/2502.06215">
                      LessLeak-Bench research
                    </Citation>{" "}
                    found some popular benchmarks have 100% leakage ratios, with
                    models scoring 4.9x higher on leaked samples. If your
                    training data touched the test set, your accuracy numbers
                    are meaningless.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Public benchmarks become contaminated the moment
                    they&apos;re released. Web crawls pick them up. Training
                    datasets include them. You need private evaluation sets with
                    verified non-contamination and rigorous embargo protocols.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Novel data
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Never-public content
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        N-gram verified
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Contamination checks
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Stratified
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Difficulty levels
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Rotation
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Periodic refresh
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bias & Fairness Audits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Scale className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Bias & Fairness Audits
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Representation, allocation, systematic errors
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Bias detection has lagged behind capability development.{" "}
                    <Citation href="https://www.mdpi.com/2413-4155/6/1/3">
                      Academic research
                    </Citation>{" "}
                    shows bias can emerge at every stage: data collection, model
                    training, and deployment context. Models that pass standard
                    fairness benchmarks can still exhibit harmful differential
                    treatment.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Existing benchmarks focus on easily measurable
                    disparities—but miss intersectional bias, context-dependent
                    unfairness, and representational harms. You need audits that
                    test what your use case actually does, not generic fairness
                    metrics.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Intersectional
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Multi-attribute testing
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Quantitative
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Statistical parity
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Qualitative
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Harm assessment
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Regulatory
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        EU AI Act ready
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
              Don&apos;t Ship Until You&apos;re Sure
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Your model is only as trustworthy as its validation.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us what you&apos;re building. We&apos;ll scope a validation
              strategy that catches problems before your users—or regulators—do.
            </p>
            <Button href="/#contact" variant="cta-glitch" size="lg">
              Discuss Your Validation Needs <ArrowRight className="w-4 h-4" />
            </Button>
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
              href="/pillars/acquire"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">01</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Acquire
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Data acquisition & sourcing
              </p>
            </Link>
            <Link
              href="/pillars/prepare"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">02</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Prepare
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Data preparation & deduplication
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
                Expert annotation & labeling
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
