"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Video,
  Users,
  Shield,
  ChevronRight,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import CapabilityCard from "@/app/components/ui/CapabilityCard";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";

export default function EnrichPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const capabilities = [
    {
      icon: Sparkles,
      title: "RLHF & Preference Data",
      description: "Human rankings that teach your model what good looks like",
      details: [
        "Pairwise preference comparisons",
        "Reward model training data",
        "Expert judgment at scale",
        "Multi-turn conversation evaluation",
      ],
    },
    {
      icon: Video,
      title: "Frame-Level Video Annotation",
      description: "Temporal labeling that captures how actions unfold",
      details: [
        "Temporal action segmentation",
        "Object tracking across frames",
        "Physics-aware motion annotation",
        "Multi-resolution labeling",
      ],
    },
    {
      icon: Users,
      title: "Expert Domain Annotation",
      description: "PhD-level specialists for high-stakes domains",
      details: [
        "STEM: math, physics, chemistry, biology",
        "Medical: licensed physicians, radiologists",
        "Legal: practicing attorneys, compliance experts",
        "Software: senior engineers, security researchers",
      ],
    },
    {
      icon: Shield,
      title: "Red Teaming & Adversarial",
      description: "Find vulnerabilities before your users do",
      details: [
        "Jailbreak attempt generation",
        "Safety boundary testing",
        "Prompt injection probing",
        "Culturally-aware adversarial testing",
      ],
    },
  ];

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question:
        "What makes expert annotators different from crowdsourced workers?",
      answer: (
        <>
          <p className="mb-3">
            The difference is domain expertise, not just accuracy. Crowdsourced
            workers can label objects in images reliably. But when the task
            requires{" "}
            <strong className="text-[var(--text-primary)]">judgment</strong>
            —ranking the quality of two code explanations, identifying medical
            misinformation, evaluating legal reasoning—generic workers fail.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Credentials matter:
              </strong>{" "}
              Our STEM annotators hold PhDs from research institutions. Medical
              annotators are licensed physicians. Legal annotators are
              practicing attorneys. These aren&apos;t marketing claims—we verify
              credentials.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Nuance detection:
              </strong>{" "}
              Expert annotators catch subtle errors that crowdsourced workers
              miss. A physics PhD will flag incorrect units or violated
              conservation laws. A practicing attorney will identify
              inapplicable precedents.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                RLHF quality:
              </strong>{" "}
              <Citation href="https://www.perle.ai/resources/2025-ai-training-data-trends-the-future-of-domain-specific-ai-rlhf-and-custom-tooling">
                RLHF data from domain experts
              </Citation>{" "}
              produces better reward models because experts consistently rank
              responses based on actual quality, not surface features.
            </li>
          </ul>
          <p>
            Expert annotation costs more per label. But lower-quality data
            requires more labels to achieve the same model performance—and often
            caps out at worse performance regardless of scale.
          </p>
        </>
      ),
    },
    {
      question: "How do you ensure annotation quality at scale?",
      answer: (
        <>
          <p className="mb-3">
            Quality at scale requires systems, not just good intentions. We use
            multiple overlapping quality controls:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Multi-annotator consensus:
              </strong>{" "}
              Complex tasks get multiple independent annotations. We measure
              inter-annotator agreement (IAA) and investigate disagreements
              rather than just majority-voting them away.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Gold standard validation:
              </strong>{" "}
              Every batch includes pre-labeled &quot;gold&quot; examples with
              known correct answers. Annotators who miss gold items get flagged
              for retraining or removal.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Statistical monitoring:
              </strong>{" "}
              We track annotation distributions in real-time. Sudden shifts in
              label frequency often indicate annotator confusion or guideline
              ambiguity.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Expert spot-checks:
              </strong>{" "}
              Senior domain experts randomly sample annotations to catch subtle
              quality issues that automated metrics miss.
            </li>
          </ul>
          <p>
            Our target:{" "}
            <Citation href="https://keymakr.com/blog/measuring-inter-annotator-agreement-building-trustworthy-datasets/">
              85%+ inter-annotator agreement
            </Citation>{" "}
            for objective tasks, with full disagreement analysis for subjective
            judgments.
          </p>
        </>
      ),
    },
    {
      question: "What domains do your expert annotators cover?",
      answer: (
        <>
          <p className="mb-3">
            We maintain active specialist networks across high-value domains:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                STEM & Technical:
              </strong>{" "}
              PhD-level scientists for mathematics, physics, chemistry, and
              biology. Research experience required—not just degree holders.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Medical:</strong>{" "}
              Board-certified physicians across specialties, radiologists for
              imaging tasks, clinical researchers for literature review.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Legal:</strong>{" "}
              Licensed attorneys from multiple jurisdictions for contract
              analysis, case law annotation, and regulatory compliance.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Software Engineering:
              </strong>{" "}
              Senior developers and security researchers for code review, bug
              identification, and technical documentation.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Finance:</strong>{" "}
              CFA charterholders, quantitative analysts, and compliance
              professionals for financial data annotation.
            </li>
          </ul>
          <p>
            For niche domains not covered by existing networks, we recruit
            custom teams with verified credentials and domain-specific
            onboarding.{" "}
            <Citation href="https://sacra.com/c/micro1/">
              Expert STEM annotation
            </Citation>{" "}
            commands $40+ per hour—reflecting the scarcity and value of genuine
            domain expertise.
          </p>
        </>
      ),
    },
    {
      question: "How does your RLHF annotation process work?",
      answer: (
        <>
          <p className="mb-3">
            RLHF annotation follows a structured pipeline designed to maximize
            signal quality:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Response generation:
              </strong>{" "}
              We generate response pairs from your model (or multiple models)
              for the same prompts, creating comparison sets.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Calibration rounds:
              </strong>{" "}
              Before production annotation, annotators complete calibration
              tasks with known rankings. This surfaces guideline ambiguities and
              aligns annotator judgment.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Preference ranking:
              </strong>{" "}
              Expert annotators rank response pairs based on your criteria—
              helpfulness, accuracy, safety, or custom dimensions. We capture
              confidence scores alongside rankings.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Disagreement analysis:
              </strong>{" "}
              Rather than discarding disagreements, we analyze them. Genuine
              disagreement often reflects response quality closer to the
              decision boundary—valuable signal for reward models.
            </li>
          </ul>
          <p>
            Output: preference datasets with Krippendorff&apos;s Alpha above
            0.80 for well-defined criteria, plus full annotator metadata for
            your reward model training.
          </p>
        </>
      ),
    },
    {
      question: "What quality metrics do you report?",
      answer: (
        <>
          <p className="mb-3">
            We provide comprehensive quality metrics because what gets measured
            gets managed:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Inter-annotator agreement (IAA):
              </strong>{" "}
              Percentage agreement across annotators on the same items. Target:
              85%+ for objective tasks, with lower thresholds acceptable for
              inherently subjective judgments.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Krippendorff&apos;s Alpha:
              </strong>{" "}
              A chance-corrected agreement metric that works across different
              annotation types. Target: above 0.80 for most tasks, with
              documentation for lower values.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Gold set accuracy:
              </strong>{" "}
              Performance on known-correct validation items embedded in the
              annotation stream. Annotators must maintain 95%+ gold accuracy.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Disagreement analysis:
              </strong>{" "}
              Breakdown of where annotators disagree, with root cause analysis.
              Often reveals guideline gaps rather than annotator errors.
            </li>
          </ul>
          <p>
            All metrics come with methodology documentation—how we calculated
            them, what thresholds we used, and how to interpret edge cases.{" "}
            <Citation href="https://www.innovatiana.com/en/post/inter-annotator-agreement">
              IAA metrics
            </Citation>{" "}
            are context-dependent; we help you understand what &quot;good&quot;
            looks like for your specific task.
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
                    className="block px-3 py-2 text-sm text-[var(--accent-primary)] rounded hover:bg-[var(--bg-primary)]"
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
            <span className="text-[var(--accent-primary)]">Enrich</span>
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
                03
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Expert Annotation
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble text="ENRICH" scrambleOnHover={true} />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Your Model Is Only as Smart as Its Teachers.
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Generic crowdsourced annotations train generic models. Expert
              judgment creates differentiation.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              RLHF, domain-specific labeling, video annotation, red
              teaming—every task that requires{" "}
              <strong className="text-[var(--text-primary)]">
                human intelligence, not just human time
              </strong>
              . We provide PhD-level specialists, not click-farm workers.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Upgrade Your Annotation <ArrowRight className="w-4 h-4" />
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
              The Annotation Quality Gap
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Here&apos;s an uncomfortable truth.{" "}
                <Citation href="https://www.gartner.com/en/newsroom/press-releases/2025-02-26-lack-of-ai-ready-data-puts-ai-projects-at-risk">
                  Gartner predicts 30% of GenAI projects will be abandoned
                </Citation>{" "}
                by the end of 2025 due to poor data quality. Not compute
                constraints. Not architecture problems.{" "}
                <strong className="text-[var(--text-primary)]">
                  Bad training data.
                </strong>
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Most annotation gets outsourced to the lowest bidder.
                Crowdsourced workers optimize for speed, not accuracy. They
                label what they see, not what matters. And the errors compound:
                a reward model trained on noisy preferences teaches your LLM the
                wrong lessons.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                The gap is especially severe for tasks requiring judgment.
                Labeling a bounding box is mechanical. Ranking which code
                explanation is more helpful? That requires understanding the
                code.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Generic annotators miss subtle factual errors that experts
                  catch instantly.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  RLHF from non-experts trains reward models on surface
                  features, not actual quality.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Video annotation without temporal understanding produces
                  inconsistent frame labels.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Red teaming by script-followers misses the creative attacks
                  that matter.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The market is responding.{" "}
                <Citation href="https://foundationcapital.com/metas-bet-on-scale-the-new-ai-data-paradigm/">
                  Meta&apos;s acquisition of Scale AI
                </Citation>{" "}
                signaled that frontier labs see annotation quality as a
                competitive moat. And expert
                annotation is becoming scarce:{" "}
                <Citation href="https://sacra.com/c/micro1/">
                  platforms accepting only the top 1% of applicants
                </Citation>{" "}
                for RLHF work.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  The labs that invest in expert annotation build better models.
                </p>
                <p className="text-[var(--text-secondary)]">
                  The rest wonder why more data doesn&apos;t help.
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
              Why Expert Annotation Is the New Bottleneck
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The annotation market is undergoing a fundamental shift. As
                models become more capable, the bar for useful training data
                rises with them:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://www.perle.ai/resources/2025-ai-training-data-trends-the-future-of-domain-specific-ai-rlhf-and-custom-tooling">
                      Targeted human feedback approaches
                    </Citation>{" "}
                    achieve full human-annotation performance with only{" "}
                    <strong className="text-[var(--text-primary)]">
                      6-7% of the annotation effort
                    </strong>
                    —but only when that feedback comes from genuine experts who
                    can identify hard cases
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    The{" "}
                    <Citation href="https://foundationcapital.com/metas-bet-on-scale-the-new-ai-data-paradigm/">
                      Meta-Scale AI acquisition
                    </Citation>{" "}
                    raised concerns among OpenAI, Google, and xAI about sharing
                    proprietary data with a Meta-affiliated vendor
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://www.hackerone.com/product/ai-red-teaming">
                      AI red teaming has become standard practice
                    </Citation>
                    —HackerOne now maintains 750+ AI-focused security
                    researchers for adversarial testing at Anthropic, Snap, and
                    Adobe
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    Video annotation at scale remains a{" "}
                    <Citation href="https://labelyourdata.com/articles/data-annotation/video-segmentation">
                      major bottleneck
                    </Citation>
                    —a 10-minute video at 30fps contains 18,000 frames,
                    requiring sophisticated temporal consistency that generic
                    annotators struggle to maintain
                  </span>
                </li>
              </ul>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The constraint isn&apos;t tooling—annotation platforms have
                scaled their software infrastructure. The constraint is{" "}
                <strong className="text-[var(--text-primary)]">
                  access to humans who can do the work that matters
                </strong>
                : RLHF ranking, code evaluation, safety testing, domain-specific
                labeling. The technical bottleneck is human.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                This creates an opportunity. Labs that secure access to expert
                annotators build training data advantages that compound over
                time—better data produces better models, which attract more
                users, which fund more expert annotation.
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
              to discuss your specific annotation requirements.
            </p>

            {/* Placeholder cards for future case studies */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-[var(--accent-primary)] opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-tertiary)]">
                  Frontier LLM Lab
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  RLHF preference data from PhD-level annotators, achieving
                  Krippendorff&apos;s Alpha above 0.85 for code quality
                  judgments.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-[var(--accent-primary)] opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-tertiary)]">
                  Safety Research Team
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Red teaming dataset of 50K+ adversarial prompts across 12
                  attack categories, generated by security researchers.
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
              How We Enrich Data
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Four specialized annotation services, each requiring genuine human
              expertise.
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
              Our Annotation Process
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Requirements Discovery",
                  description:
                    "We understand your task, quality criteria, and edge cases. This shapes annotator selection, guideline design, and quality metrics.",
                },
                {
                  step: "02",
                  title: "Annotator Matching",
                  description:
                    "Based on your domain requirements, we match you with qualified specialists. STEM tasks get PhD annotators. Medical tasks get licensed physicians. No compromises.",
                },
                {
                  step: "03",
                  title: "Annotation & QA",
                  description:
                    "Annotators complete calibration rounds, then production work with embedded gold standard checks. Multi-annotator consensus for complex judgments.",
                },
                {
                  step: "04",
                  title: "Delivery & Iteration",
                  description:
                    "Clean annotations delivered with full quality metrics: IAA, Krippendorff's Alpha, gold accuracy. We iterate on disagreements and refine guidelines as needed.",
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
              Explore Our Enrichment Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/pillars/enrich/rlhf"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Sparkles className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  RLHF Services
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Expert preference ranking for LLM alignment and reward
                  modeling
                </p>
              </Link>
              <Link
                href="/pillars/enrich/video-annotation"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Video className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Video Annotation
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Frame-level labeling with temporal consistency for video AI
                </p>
              </Link>
              <Link
                href="/pillars/enrich/expert-annotation"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Users className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Expert Annotation
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  PhD-level domain specialists for STEM, medical, and legal AI
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
              Expert Annotation for Frontier Applications
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Different applications require different types of expertise.
              Here&apos;s what quality annotation looks like at the cutting
              edge.
            </p>

            <div className="space-y-8">
              {/* RLHF for LLMs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">RLHF for LLMs</h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      ChatGPT, Claude, Gemini
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Reinforcement Learning from Human Feedback is what separates
                    a base model from a useful assistant.{" "}
                    <Citation href="https://blog.ml.cmu.edu/2025/06/01/rlhf-101-a-technical-tutorial-on-reinforcement-learning-from-human-feedback/">
                      RLHF requires human annotators
                    </Citation>{" "}
                    to rank model outputs—and the quality of those rankings
                    directly determines the quality of your reward model.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Generic annotators rank based on surface features—response
                    length, formality, keyword matching. Experts rank based on
                    actual quality—correctness, completeness, appropriate
                    caveats. The difference shows up in your model&apos;s
                    behavior.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        85%+ IAA
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Inter-annotator agreement
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        0.80+ alpha
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Krippendorff&apos;s Alpha
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        PhD-level
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Domain expertise
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Full audit
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Annotator metadata
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Video Understanding */}
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
                      Video Understanding
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Temporal AI, action recognition, video search
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Video annotation adds a dimension that images
                    don&apos;t—time.{" "}
                    <Citation href="https://averroes.ai/blog/video-segmentation-guide">
                      Temporal segmentation
                    </Citation>{" "}
                    requires annotators to track when actions begin and end, how
                    objects move through frames, and what constitutes a
                    meaningful scene boundary. Frame-by-frame annotation of a
                    10-minute video means labeling 18,000 images with temporal
                    consistency.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Inconsistent annotations produce flickering labels and
                    broken object tracks. Annotators need to understand what
                    they&apos;re labeling—physics-aware judgment about when a
                    &quot;throw&quot; starts, when a &quot;catch&quot; ends,
                    what counts as a single &quot;action&quot; vs. a sequence.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Frame-level
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Temporal precision
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        30 fps
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        High-density annotation
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        94%+ acc
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Segmentation accuracy
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Consistent
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Cross-frame tracking
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Safety & Alignment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Safety & Alignment
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Red teaming, jailbreak testing, adversarial evaluation
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Before deployment, models need adversarial testing by people
                    who think like attackers.{" "}
                    <Citation href="https://venturebeat.com/security/red-teaming-llms-harsh-truth-ai-security-arms-race/">
                      Red teaming research shows
                    </Citation>{" "}
                    that over 90% of published defenses can be bypassed with
                    adaptive attacks—meaning your safety evaluations need
                    creative humans, not just automated scanners.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Script-following testers generate predictable attacks your
                    model has already seen. Real adversaries try novel
                    approaches: multi-turn jailbreaks, encoding tricks, roleplay
                    scenarios, logic traps. Effective red teaming requires
                    security researchers who understand both the technology and
                    the adversarial mindset.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        12+ types
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Attack categories
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Multi-turn
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Conversation attacks
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Cultural
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Multi-context testing
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Expert
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Security researchers
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
              Stop Settling for Generic Annotation
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Your model&apos;s capabilities are bounded by your training
              data&apos;s quality.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us what you&apos;re building. We&apos;ll match you with
              annotators who actually understand the domain—and deliver data
              that moves your metrics.
            </p>
            <Button href="/#contact" variant="cta-glitch" size="lg">
              Discuss Your Annotation Needs <ArrowRight className="w-4 h-4" />
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
              href="/pillars/validate"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">04</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Validate
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Red teaming & safety evaluation
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
