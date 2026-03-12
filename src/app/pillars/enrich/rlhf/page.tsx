"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  Users,
  Target,
  Layers,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";
import CaseStudyCallout from "@/app/components/ui/CaseStudyCallout";

export default function RLHFPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question:
        "How does expert RLHF differ from crowdsourced preference data?",
      answer: (
        <>
          <p className="mb-3">
            The difference lies in{" "}
            <strong className="text-[var(--text-primary)]">
              calibration quality
            </strong>
            . Crowdsourced annotators often rank responses based on surface
            features like length, formality, or keyword matching. Expert
            annotators rank based on actual correctness, completeness, and
            appropriate caveats.
          </p>
          <p className="mb-3">
            For technical domains, this distinction is critical. A physics PhD
            will notice when a response violates conservation laws or uses
            incorrect units. A practicing attorney will identify inapplicable
            precedents. Generic annotators miss these errors, and those errors
            propagate into your reward model.
          </p>
          <p>
            Research from{" "}
            <Citation href="https://arxiv.org/abs/2203.02155">
              OpenAI&apos;s InstructGPT research
            </Citation>{" "}
            shows that annotator expertise directly correlates with reward model
            quality. The investment in expert annotation pays off in model
            performance.
          </p>
        </>
      ),
    },
    {
      question: "What scale of RLHF data do frontier labs typically need?",
      answer: (
        <>
          <p className="mb-3">
            Scale requirements vary significantly by use case.{" "}
            <Citation href="https://arxiv.org/abs/2203.02155">
              InstructGPT
            </Citation>{" "}
            used approximately 36,000 preference comparisons for initial
            training, but modern frontier labs often collect 100,000+ preference
            pairs for comprehensive alignment.
          </p>
          <p className="mb-3">
            However,{" "}
            <Citation href="https://www.perle.ai/resources/2025-ai-training-data-trends-the-future-of-domain-specific-ai-rlhf-and-custom-tooling">
              active learning approaches to RLHF
            </Citation>{" "}
            can achieve comparable results with 6-7% of the annotation effort
            by focusing expert feedback on the hardest examples where the model
            is most uncertain.
          </p>
          <p>
            We help you determine the right scale for your specific model and
            use case, balancing coverage against efficiency. For most teams,
            starting with 10,000-50,000 high-quality expert comparisons provides
            a strong foundation.
          </p>
        </>
      ),
    },
    {
      question: "How do you handle disagreements between annotators?",
      answer: (
        <>
          <p className="mb-3">
            Disagreements are signal, not noise. When expert annotators
            disagree, it usually means one of three things: the response quality
            is genuinely borderline, the guidelines need clarification, or the
            task requires specialized expertise that some annotators lack.
          </p>
          <p className="mb-3">
            Our process captures disagreement data rather than discarding it.
            For reward model training, knowing that two responses are close in
            quality is valuable information. We provide disagreement analysis
            with every batch, breaking down <em>why</em> annotators disagreed
            and what the distribution of preferences looked like.
          </p>
          <p>
            For consistently controversial cases, we escalate to senior domain
            experts who can make authoritative judgments or flag items as
            genuinely ambiguous. This approach maintains data quality while
            capturing the full complexity of human preferences.
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
              href="/pillars/enrich"
              className="hover:text-[var(--text-primary)]"
            >
              Enrich
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--accent-primary)]">RLHF</span>
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
                ENRICH
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Preference Data
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble text="RLHF" scrambleOnHover={true} />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Human Judgment for AI Alignment
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Reinforcement Learning from Human Feedback transforms base models
              into aligned assistants. The quality of that feedback determines
              your model&apos;s ceiling.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              We provide{" "}
              <strong className="text-[var(--text-primary)]">
                expert preference data
              </strong>{" "}
              from domain specialists who understand what &quot;good&quot;
              actually means in your use case.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss RLHF Requirements <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/enrich" variant="secondary" size="lg">
                Back to Enrich
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
              Why Does RLHF Quality Matter More Than Quantity?
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The breakthrough behind ChatGPT, Claude, and every modern
                conversational AI wasn&apos;t just scale. It was{" "}
                <Citation href="https://arxiv.org/abs/2203.02155">
                  InstructGPT&apos;s insight
                </Citation>{" "}
                that human preferences could guide model behavior better than
                supervised learning alone. RLHF became the secret ingredient
                that transformed capable-but-unreliable base models into useful
                assistants.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                But here&apos;s what the papers don&apos;t emphasize:{" "}
                <strong className="text-[var(--text-primary)]">
                  RLHF quality is not uniformly distributed.
                </strong>{" "}
                When OpenAI trained InstructGPT, they used carefully selected
                labelers with extensive calibration and ongoing quality
                monitoring. The preference data that made their models helpful
                came from annotators who genuinely understood what helpfulness
                meant.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Most organizations don&apos;t have access to that level of
                annotation quality. They outsource RLHF to the lowest bidder,
                get preference data from generic crowdworkers, and wonder why
                their fine-tuned models still make obvious errors. The reward
                model learns what the annotators taught it: surface features,
                not actual quality.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Crowdsourced annotators optimize for speed. They rank longer
                  responses as better, formal language as more professional,
                  hedging as more safe.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Expert annotators optimize for correctness. They catch factual
                  errors, identify missing caveats, and recognize when brevity
                  serves the user better than verbosity.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                While techniques like{" "}
                <Citation href="https://www.anthropic.com/news/constitutional-ai-harmlessness-from-ai-feedback">
                  Constitutional AI
                </Citation>{" "}
                reduce annotation volume through AI self-critique, the remaining
                human preference data becomes even more critical — quality over
                quantity. Models trained on noisy preference data learn noisy
                preferences. Models trained on expert preferences learn nuanced
                quality judgments that generalize to new situations.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  Your model&apos;s alignment ceiling is set by your preference
                  data quality.
                </p>
                <p className="text-[var(--text-secondary)]">
                  No amount of scaling overcomes systematically biased human
                  feedback.
                </p>
              </div>
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
              How Does Claru&apos;s Expert RLHF Pipeline Work?
            </h2>

            <div className="space-y-12">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    1. Expert Ranker Selection
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Based on your model&apos;s domain, we match you with
                    qualified specialists. Code tasks get senior engineers.
                    Medical queries get licensed physicians. Mathematical
                    reasoning gets PhD mathematicians. We verify credentials and
                    require demonstrated expertise before any production work.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    For general-purpose RLHF, we use annotators with broad
                    knowledge and strong calibration on quality dimensions like
                    helpfulness, accuracy, and safety. Every annotator completes
                    extensive calibration rounds before touching your data.
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    2. Preference Collection
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    We support multiple comparison formats depending on your
                    reward model architecture. Pairwise comparisons (A vs B) are
                    most common, but we also handle ranked lists, Likert scales,
                    and multi-dimensional scoring. Each annotation captures the
                    preference itself, a confidence score, and optional
                    free-text rationale for difficult judgments.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    For chat models, we evaluate full conversations, not just
                    individual responses. This captures the quality of
                    multi-turn interactions, including how well the model
                    maintains context, handles follow-up questions, and recovers
                    from user corrections.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    3. Quality Assurance & Iteration
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Every batch includes embedded gold standard items with known
                    correct rankings. Annotators who consistently miss gold
                    items get flagged for retraining or removal. We track
                    inter-annotator agreement in real-time, investigating
                    disagreements rather than majority-voting them away.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Disagreement analysis often reveals edge cases where your
                    guidelines need refinement or where genuine ambiguity
                    exists. We provide detailed breakdowns of disagreement
                    patterns and work with your team to clarify scoring criteria
                    as needed.
                  </p>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    4. Reward Model Training Support
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    We deliver preference data in formats compatible with
                    standard RLHF frameworks: OpenAI&apos;s format,
                    Anthropic&apos;s HH-RLHF schema, and custom specifications.
                    Each delivery includes full annotator metadata so you can
                    incorporate annotator uncertainty into your reward model
                    training.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    For teams running iterative RLHF cycles, we support
                    continuous data collection pipelines. As your model
                    improves, we focus annotation effort on the new edge cases
                    where it still struggles — an{" "}
                    <Citation href="https://www.perle.ai/resources/2025-ai-training-data-trends-the-future-of-domain-specific-ai-rlhf-and-custom-tooling">
                      active learning approach
                    </Citation>{" "}
                    that achieves full performance with 6-7% of brute-force
                    annotation effort.
                  </p>
                </div>
              </motion.div>
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
              RLHF Data Formats & Quality Metrics
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Comparison Formats */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">
                  Comparison Formats
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Pairwise:
                      </strong>{" "}
                      A vs B preference with confidence scores (most common for
                      reward model training)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Ranked lists:
                      </strong>{" "}
                      Order N responses from best to worst (captures finer
                      preference gradients)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Multi-dimensional:
                      </strong>{" "}
                      Separate scores for helpfulness, accuracy, safety, tone
                      (for Constitutional AI approaches)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Multi-turn:
                      </strong>{" "}
                      Full conversation evaluation with turn-level annotations
                    </span>
                  </li>
                </ul>
              </div>

              {/* Quality Targets */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">Quality Targets</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Inter-annotator agreement:
                      </strong>{" "}
                      85%+ for objective quality dimensions, with documented
                      lower bounds for subjective tasks
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Krippendorff&apos;s Alpha:
                      </strong>{" "}
                      0.80+ for well-defined criteria, with full methodology
                      documentation
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Gold set accuracy:
                      </strong>{" "}
                      95%+ on embedded validation items
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Disagreement analysis:
                      </strong>{" "}
                      Root cause breakdown for all split decisions
                    </span>
                  </li>
                </ul>
              </div>

              {/* Throughput */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">
                  Throughput & Scale
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        General RLHF:
                      </strong>{" "}
                      1,000-5,000 comparisons/week with standard expert pools
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Domain-specific:
                      </strong>{" "}
                      500-2,000 comparisons/week (specialist availability
                      varies)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Burst capacity:
                      </strong>{" "}
                      10,000+ comparisons/week for time-sensitive projects
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Continuous pipelines:
                      </strong>{" "}
                      Ongoing annotation for iterative RLHF cycles
                    </span>
                  </li>
                </ul>
              </div>

              {/* Deliverables */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">Deliverables</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Preference data:
                      </strong>{" "}
                      JSON/JSONL in your preferred schema (OpenAI, HH-RLHF,
                      custom)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Annotator metadata:
                      </strong>{" "}
                      Anonymous IDs, expertise tags, confidence scores
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Quality report:
                      </strong>{" "}
                      IAA, alpha coefficients, gold accuracy, disagreement
                      analysis
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Guidelines document:
                      </strong>{" "}
                      Final annotator instructions with calibration examples
                    </span>
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
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// USE CASES"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Where Does Expert RLHF Make the Biggest Difference?
            </h2>

            <div className="space-y-8">
              {/* LLM Fine-Tuning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <h3 className="text-xl font-semibold mb-3">
                  LLM Fine-Tuning & Alignment
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  The original RLHF use case: transforming base models into
                  aligned assistants.{" "}
                  <Citation href="https://arxiv.org/abs/2203.02155">
                    OpenAI&apos;s InstructGPT research
                  </Citation>{" "}
                  demonstrated that 1.3B parameter models trained with expert
                  RLHF could outperform 175B parameter base models on user
                  preference metrics. Quality beats scale.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We provide preference data for helpfulness, harmlessness, and
                  honesty dimensions&mdash;the &quot;3H&quot; criteria that
                  define aligned model behavior. Our expert annotators
                  understand the nuance between genuinely helpful responses and
                  responses that merely appear helpful.
                </p>
              </motion.div>

              {/* Constitutional AI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Constitutional AI & Value Alignment
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  <Citation href="https://www.anthropic.com/news/constitutional-ai-harmlessness-from-ai-feedback">
                    Anthropic&apos;s Constitutional AI
                  </Citation>{" "}
                  approach uses AI self-critique (RLAIF) to reduce raw annotation
                  volume — but the human preference data that remains must be
                  higher quality than ever. Experts evaluate responses across
                  separate criteria: accuracy, safety, helpfulness, and
                  adherence to specific principles.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We support complex annotation schemas that capture these
                  multiple dimensions, enabling training of reward models that
                  balance competing values rather than optimizing for a single
                  metric.
                </p>
              </motion.div>

              {/* Code & Technical Domains */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Code & Technical Domain RLHF
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Code quality is not subjective. A senior engineer can
                  immediately identify whether code is correct, efficient,
                  secure, and maintainable. Generic annotators cannot make these
                  judgments reliably.
                </p>
                <p className="text-[var(--text-secondary)]">
                  Our engineering annotators evaluate code along multiple
                  dimensions: correctness, efficiency, security, readability,
                  and appropriate use of language features. This produces reward
                  models that genuinely improve code quality rather than just
                  optimizing for surface metrics like comment density or
                  variable naming.
                </p>
              </motion.div>

              {/* Chat Model Iteration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Iterative Chat Model Improvement
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Deployed chat models generate constant signal about where
                  they&apos;re failing. Iterative RLHF focuses annotation effort
                  on those failure modes, continuously improving the
                  model&apos;s weakest areas.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We support continuous RLHF pipelines where annotators evaluate
                  model outputs on your hardest queries, providing targeted
                  feedback that drives improvement where it matters most.
                </p>
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

      {/* See It In Practice */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// SEE IT IN PRACTICE"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Case Studies
            </h2>
            <div className="grid md:grid-cols-1 gap-6 max-w-xl">
              <CaseStudyCallout
                index={0}
                caseStudy={{
                  slug: "prompt-enhancement-benchmark",
                  headlineStat: "180",
                  headlineStatLabel: "Prompts benchmarked across modalities",
                  title: "Benchmarking Prompt Enhancement Quality Across Leading LLMs",
                  teaser: "180 prompts benchmarked across text and video generation — replacing guesswork with large-scale human evaluation to identify the best prompt enhancement solution for production.",
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Expert RLHF?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Your reward model is only as good as the human feedback that
              trained it.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your model and use case. We&apos;ll match you with
              domain experts who understand what quality looks like&mdash;and
              deliver preference data that moves your alignment metrics.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss RLHF Requirements <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                href="/pillars/enrich/expert-annotation"
                variant="secondary"
                size="lg"
              >
                Learn About Expert Annotation
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
              href="/pillars/enrich"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Pillar
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Enrich Overview
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                All annotation services
              </p>
            </Link>
            <Link
              href="/pillars/enrich/expert-annotation"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Cluster
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Expert Annotation
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                PhD-level domain specialists
              </p>
            </Link>
            <Link
              href="/pillars/enrich/video-annotation"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Cluster
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Video Annotation
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Frame-level temporal labeling
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
