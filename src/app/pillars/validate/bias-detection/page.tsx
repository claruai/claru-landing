"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  ChevronRight,
  ArrowRight,
  Users,
  BarChart3,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";

export default function BiasDetectionPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "What types of bias do you test for?",
      answer: (
        <>
          <p className="mb-3">
            AI bias manifests in multiple forms, and comprehensive testing must
            address each category:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Demographic bias:
              </strong>{" "}
              Differential treatment or outcomes across protected attributes
              like race, gender, age, disability status, and their
              intersections.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Representation bias:
              </strong>{" "}
              Stereotypical associations, underrepresentation of groups in
              generated content, or harmful characterizations in model outputs.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Allocation bias:
              </strong>{" "}
              Unfair distribution of resources, opportunities, or
              recommendations across demographic groups in decision-making
              systems.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Systematic errors:
              </strong>{" "}
              Consistent failure patterns that disproportionately affect
              specific populations, even when overall accuracy appears
              acceptable.
            </li>
          </ul>
          <p>
            We design test suites specific to your use case, focusing on bias
            types most relevant to your deployment context and regulatory
            requirements.
          </p>
        </>
      ),
    },
    {
      question: "How do you measure fairness quantitatively?",
      answer: (
        <>
          <p className="mb-3">
            Fairness isn&apos;t a single metric - different fairness criteria
            can conflict, and the right measure depends on your application. We
            use multiple approaches:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Demographic parity:
              </strong>{" "}
              Positive outcomes should occur at similar rates across groups.
              Important for resource allocation systems.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Equalized odds:
              </strong>{" "}
              True positive and false positive rates should be similar across
              groups. Critical for classification systems with real
              consequences.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Calibration:
              </strong>{" "}
              Predicted probabilities should be equally accurate across groups.
              Essential for risk scoring applications.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Individual fairness:
              </strong>{" "}
              Similar individuals should receive similar treatment. Measured
              through counterfactual testing.
            </li>
          </ul>
          <p>
            We help you select appropriate metrics based on your use case,
            regulatory requirements, and the specific harms you need to prevent.
          </p>
        </>
      ),
    },
    {
      question: "Can bias audits help with EU AI Act compliance?",
      answer: (
        <>
          <p className="mb-3">
            Yes. The EU AI Act imposes specific requirements for high-risk AI
            systems, and bias testing is central to compliance:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Article 10:
              </strong>{" "}
              Requires training data to be examined for bias and appropriate
              measures taken to address representativeness issues.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Article 15:
              </strong>{" "}
              Mandates that high-risk systems minimize biased outputs that
              affect natural persons, particularly for protected attributes.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Documentation requirements:
              </strong>{" "}
              Technical documentation must include information about bias
              testing methodology and results.
            </li>
          </ul>
          <p className="mb-3">
            Our audits produce documentation formatted for regulatory review,
            including methodology description, quantitative metrics, findings,
            and remediation evidence. Non-compliance penalties reach EUR 35
            million or 7% of global turnover for the most serious violations.
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
            <span className="text-[var(--accent-primary)]">Bias Detection</span>
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
                Bias Detection
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble
                text="Find Systematic Errors"
                scrambleOnHover={true}
              />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Before They Compound
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Your model performs well on aggregate metrics. Accuracy looks
              great. Users seem satisfied. Everything checks out.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              Until someone notices your hiring AI recommends lower salaries to
              women. Or your content moderation flags minority voices more
              often. Or your medical assistant underperforms for certain
              demographics.{" "}
              <strong className="text-[var(--text-primary)]">
                Aggregate metrics hide systematic failures. Bias compounds
                silently until it becomes a headline.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Start Bias Audit <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                See Our Methodology
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
              What Is the Hidden Bias Problem in AI Systems?
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                AI bias isn&apos;t just an ethical concern anymore - it&apos;s a
                business risk, a legal liability, and increasingly a regulatory
                violation.{" "}
                <Citation href="https://www.technologyreview.com/2025/03/11/1113000/two-new-measures-show-where-ai-models-fail-on-fairness/">
                  Recent research
                </Citation>{" "}
                found that LLMs recommend salaries $120,000 lower for equally
                qualified female candidates compared to male candidates. These
                aren&apos;t edge cases - they&apos;re systematic failures that
                standard evaluations miss.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The challenge is that bias can emerge at any stage of the AI
                pipeline.{" "}
                <Citation href="https://www.mdpi.com/2413-4155/6/1/3">
                  Academic research
                </Citation>{" "}
                documents bias in training data, model architecture choices,
                fine-tuning processes, and deployment contexts. A model trained
                on unrepresentative data will learn unrepresentative patterns. A
                model fine-tuned on biased human feedback will amplify those
                biases. And a model deployed in contexts it wasn&apos;t designed
                for will fail in unpredictable ways.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Standard fairness benchmarks provide only partial coverage.{" "}
                <Citation href="https://arxiv.org/abs/2402.01789">
                  Comprehensive surveys
                </Citation>{" "}
                show that models can pass simplified bias tests while still
                exhibiting harmful differential treatment in real-world
                scenarios. Testing for individual protected attributes misses
                intersectional bias. Testing with synthetic prompts misses
                context-dependent failures. Testing once misses bias that
                emerges as models drift or contexts change.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The{" "}
                <Citation href="https://artificialintelligenceact.eu/">
                  EU AI Act
                </Citation>{" "}
                now requires documented bias testing for high-risk AI systems.
                Article 10 mandates that training data be examined for bias.
                Article 15 requires that high-risk systems minimize biased
                outputs. Non-compliance can result in penalties up to EUR 35
                million or 7% of global turnover.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  Bias testing isn&apos;t about perfection. It&apos;s about
                  knowing where your model fails and for whom.
                </p>
                <p className="text-[var(--text-secondary)]">
                  You can&apos;t mitigate what you haven&apos;t measured.
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
              How Does Claru Detect Bias in AI Systems?
            </h2>

            <div className="space-y-8 mb-12">
              {[
                {
                  step: "01",
                  title: "Context & Scope Definition",
                  description:
                    "We start by understanding your model's use case, user base, and risk profile. What decisions does your model influence? Who are the affected populations? What regulatory requirements apply? This defines which bias types to prioritize and which fairness metrics matter most.",
                },
                {
                  step: "02",
                  title: "Test Design & Data Collection",
                  description:
                    "Based on scope, we design bias tests specific to your application. This includes demographic probing (testing across protected attributes), counterfactual testing (varying single attributes to measure impact), representation analysis (examining output distributions), and systematic error detection (finding consistent failure patterns).",
                },
                {
                  step: "03",
                  title: "Quantitative Evaluation",
                  description:
                    "We run systematic tests measuring demographic parity, equalized odds, calibration, and individual fairness across relevant subgroups. We analyze intersectional combinations - bias affecting people at the intersection of multiple attributes often exceeds single-attribute effects.",
                },
                {
                  step: "04",
                  title: "Qualitative Assessment",
                  description:
                    "Numbers don't capture everything. We assess severity of failures, potential for harm, and real-world impact. A model that's 2% less accurate for a minority group may cause more harm than one that's 10% less accurate overall if that group is already disadvantaged.",
                },
                {
                  step: "05",
                  title: "Reporting & Remediation",
                  description:
                    "We deliver findings with severity scoring, reproducible examples, and prioritized remediation recommendations. Reports are formatted for both technical teams (who need to fix issues) and compliance teams (who need documentation). We provide re-testing to verify fixes.",
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
              Bias Testing Framework
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Demographic Testing
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Race and ethnicity probing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Gender and gender identity testing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Age discrimination analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Disability status evaluation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Intersectional combination testing
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Fairness Metrics</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Demographic parity / statistical parity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Equalized odds (TPR/FPR parity)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Predictive parity / calibration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Individual fairness measures
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Counterfactual fairness testing
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Harm Categories</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Allocation harms (resource/opportunity)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Quality of service disparities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Stereotyping and representation harms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Denigration and toxicity patterns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Erasure and underrepresentation
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <FileCheck className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Compliance Frameworks
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    EU AI Act Article 10 & 15 alignment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    EEOC/employment discrimination standards
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Fair lending/ECOA requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    NIST AI RMF fairness guidelines
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    NYC Local Law 144 (automated hiring)
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-subtle)]">
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  Intersectional
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Multi-attribute testing
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  Quantitative
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Statistical metrics
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  Qualitative
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Harm assessment
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  Compliant
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Regulatory ready
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
              When Are Bias Audits Critical for AI Systems?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Bias audits are critical for any AI system that makes consequential decisions about people, including hiring, lending, healthcare, and content moderation. Some AI applications carry higher stakes and face greater
              scrutiny, and rigorous bias testing is increasingly a legal requirement under frameworks like the EU AI Act.
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  HR & Hiring Systems
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Automated hiring tools face intense regulatory scrutiny. NYC
                  Local Law 144 requires annual bias audits for automated
                  employment decision tools. The EEOC applies disparate impact
                  standards to AI hiring decisions. Bias in resume screening,
                  candidate ranking, or interview assessment can expose
                  organizations to discrimination lawsuits and regulatory
                  enforcement.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Resume screening
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Candidate ranking
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Compensation recommendations
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Financial Services & Lending
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Credit decisions have been regulated for bias since the Equal
                  Credit Opportunity Act. AI-powered lending, insurance pricing,
                  and fraud detection must demonstrate non-discrimination across
                  protected attributes. Fair lending requirements apply
                  regardless of whether bias is intentional - disparate impact
                  alone can trigger enforcement.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Credit scoring
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Insurance underwriting
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Fraud detection
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">Healthcare AI</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Medical AI can perpetuate or amplify health disparities.
                  Diagnostic tools trained on non-representative populations may
                  underperform for minority groups. Treatment recommendations
                  may reflect historical patterns of unequal care. The stakes
                  are patient safety and health equity - errors can cause direct
                  harm to already underserved populations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Diagnostic assistance
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Treatment recommendations
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Risk stratification
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Content Moderation
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Content moderation systems can disproportionately silence
                  certain communities. Reclaiming language, cultural context,
                  and dialect variations may be misclassified as violations.
                  Overmoderation of minority voices reduces representation while
                  undermoderation of harassment targeting those groups amplifies
                  harm.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Hate speech detection
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Toxicity classification
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Policy enforcement
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
              Know Where Your Model Fails
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Bias doesn&apos;t announce itself. You need systematic testing to
              find systematic failures.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your AI system and deployment context. We&apos;ll
              design a bias audit that tests what matters for your use case and
              regulatory requirements.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Start Bias Audit <ArrowRight className="w-4 h-4" />
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
              href="/pillars/validate/benchmark-curation"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Related
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Benchmark Curation
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Contamination-free evaluation sets
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
