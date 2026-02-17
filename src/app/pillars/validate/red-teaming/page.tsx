"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";

export default function RedTeamingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question:
        "What is the difference between automated and human red teaming?",
      answer: (
        <>
          <p className="mb-3">
            Automated tools execute known attack patterns at scale, covering
            broad vulnerability categories quickly. They excel at regression
            testing and finding variants of established attacks. However, they
            miss creative combinations and context-dependent failures.
          </p>
          <p className="mb-3">
            Human red teamers understand model architectures, adapt attacks
            based on responses, and discover novel failure modes. They can chain
            multiple techniques, exploit subtle context shifts, and identify
            emergent misuse patterns that no catalog covers.
          </p>
          <p>
            We combine both approaches: automated scanning for coverage and
            consistency, human expertise for depth and creativity. The hybrid
            approach catches more vulnerabilities than either method alone.
          </p>
        </>
      ),
    },
    {
      question: "How do you stay ahead of evolving attack techniques?",
      answer: (
        <>
          <p className="mb-3">
            Jailbreak research moves fast. What worked last month may be patched
            today, but new techniques emerge weekly. Our red team maintains
            active research programs:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Research tracking:
              </strong>{" "}
              We monitor academic publications, security conferences, and
              underground communities where new techniques surface.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Internal R&D:
              </strong>{" "}
              Our team develops novel attack methodologies, testing them against
              current defenses to understand emerging threat surfaces.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Cross-client learning:
              </strong>{" "}
              Patterns discovered in one engagement inform testing strategies
              across all clients (without sharing proprietary details).
            </li>
          </ul>
          <p>
            When you engage us, you get attacks from this week, not last
            year&apos;s catalog.
          </p>
        </>
      ),
    },
    {
      question: "What deliverables do you provide after red team testing?",
      answer: (
        <>
          <p className="mb-3">
            Every engagement produces comprehensive documentation suitable for
            both technical remediation and regulatory compliance:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Vulnerability report:
              </strong>{" "}
              Each finding includes severity rating, attack chain description,
              reproducible examples, and success rate metrics.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Remediation guidance:
              </strong>{" "}
              Prioritized recommendations with implementation complexity and
              expected effectiveness for each mitigation.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Compliance documentation:
              </strong>{" "}
              Reports formatted for EU AI Act, NIST AI RMF, and other regulatory
              frameworks requiring documented adversarial testing.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Re-testing support:
              </strong>{" "}
              We validate fixes and provide verification testing to confirm
              vulnerabilities are resolved.
            </li>
          </ul>
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
            <span className="text-[var(--accent-primary)]">Red Teaming</span>
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
                Red Teaming
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble
                text="Find Vulnerabilities"
                scrambleOnHover={true}
              />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Before Attackers Do
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Your safety filters passed internal testing. Your alignment team
              signed off. Everything looked secure.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              Then someone on Reddit found a jailbreak. It spread in hours. Your
              model was generating content you specifically trained it not to.{" "}
              <strong className="text-[var(--text-primary)]">
                Automated testing catches the attacks you know about. Human red
                teaming catches the ones you don&apos;t.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Start Red Team Assessment <ArrowRight className="w-4 h-4" />
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
              The Arms Race You&apos;re Losing
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                AI safety is not a solved problem. It&apos;s an active
                battlefield where attackers constantly develop new techniques
                and defenders scramble to keep up.{" "}
                <Citation href="https://venturebeat.com/security/red-teaming-llms-harsh-truth-ai-security-arms-race">
                  Research shows
                </Citation>{" "}
                adaptive attacks achieve over 90% success rates against defenses
                that were initially reported as nearly impenetrable.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The problem is structural. Defenses that block specific attacks
                often fail against slight variations. A jailbreak using base64
                encoding gets patched; the next day someone uses rot13.
                Role-playing attacks get blocked; attackers switch to
                hypothetical framing. Each fix is a whack-a-mole game against an
                adversary with infinite creativity.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://cset.georgetown.edu/article/ai-red-teaming-design-threat-models-and-tools/">
                  CSET&apos;s research
                </Citation>{" "}
                on AI red teaming identifies core challenges: attack taxonomies
                that map vulnerability categories, threat modeling that
                prioritizes realistic risks, and evaluation methods that
                distinguish genuine safety from surface-level robustness. Most
                internal testing skips these fundamentals.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The{" "}
                <Citation href="https://www.nist.gov/itl/ai-risk-management-framework">
                  NIST AI Risk Management Framework
                </Citation>{" "}
                now explicitly recommends adversarial testing as part of AI risk
                assessment. The{" "}
                <Citation href="https://artificialintelligenceact.eu/">
                  EU AI Act
                </Citation>{" "}
                requires documented red teaming for high-risk systems. What was
                once best practice is becoming legal requirement.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  You can&apos;t defend against attacks you haven&apos;t seen.
                </p>
                <p className="text-[var(--text-secondary)]">
                  Red teaming shows you what attackers will find before they
                  find it.
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
              How Our Red Teaming Works
            </h2>

            <div className="space-y-8 mb-12">
              {[
                {
                  step: "01",
                  title: "Threat Modeling",
                  description:
                    "We start by understanding your model's deployment context, user base, and risk profile. This defines which attack categories matter most: a customer service chatbot faces different threats than a code generation assistant. We build a prioritized threat model that focuses testing on realistic attack surfaces.",
                },
                {
                  step: "02",
                  title: "Attack Taxonomy Development",
                  description:
                    "Based on threat modeling, we develop a custom attack taxonomy covering relevant vulnerability categories. This includes jailbreak variants (multi-turn, encoding, role-play), prompt injection patterns, data extraction attempts, and emergent misuse scenarios specific to your use case.",
                },
                {
                  step: "03",
                  title: "Automated Scanning",
                  description:
                    "We run automated attack suites covering 40+ vulnerability categories aligned with OWASP LLM Top 10. Automated testing provides broad coverage and baseline metrics, identifying known attack patterns and their variants at scale.",
                },
                {
                  step: "04",
                  title: "Human Red Team Testing",
                  description:
                    "Security experts probe for vulnerabilities that automated tools miss. They chain attack techniques, exploit subtle context windows, and discover novel failure modes. Human testers adapt based on model responses, finding creative paths to bypass safety measures.",
                },
                {
                  step: "05",
                  title: "Severity Scoring & Reporting",
                  description:
                    "Each vulnerability gets severity scored based on exploitability, impact, and remediation complexity. We provide reproducible attack chains, success rate metrics, and prioritized remediation recommendations with implementation guidance.",
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
              Attack Categories & Coverage
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Jailbreak Testing
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Multi-turn conversation attacks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Encoding obfuscations (base64, rot13, unicode)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Role-playing and persona manipulation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Context window exploitation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Hypothetical and fictional framing
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Target className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Prompt Injection</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Direct instruction override attempts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Indirect injection via external content
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    System prompt extraction
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    RAG poisoning vectors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Tool-use manipulation
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Data Extraction</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Training data memorization probes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    PII extraction attempts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Model inversion attacks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Membership inference testing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Side-channel information leakage
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Safety Boundaries
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Harmful content generation attempts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Misinformation/disinformation vectors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Illegal activity assistance probes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Bias amplification testing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      +
                    </span>
                    Emergent misuse discovery
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-subtle)]">
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  40+
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Vulnerability categories
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  OWASP
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  LLM Top 10 aligned
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  NIST
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  AI RMF compliant
                </p>
              </div>
              <div className="text-center">
                <p className="text-[var(--accent-primary)] font-mono text-2xl mb-1">
                  EU AI Act
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Documentation ready
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
              When Red Teaming Matters Most
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Different deployment contexts face different threat profiles.
              Here&apos;s where rigorous adversarial testing delivers the most
              value.
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Pre-Deployment Safety Gates
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Before any major model release, red teaming identifies
                  vulnerabilities that internal testing missed. Anthropic,
                  OpenAI, and Google DeepMind all conduct pre-deployment
                  adversarial testing as standard practice. For foundation
                  models, this isn&apos;t optional-it&apos;s the difference
                  between controlled discovery and public embarrassment.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Foundation models
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Major version releases
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Public-facing deployments
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Regulatory Compliance
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  The EU AI Act requires documented adversarial testing for
                  high-risk AI systems. NIST AI RMF recommends red teaming as
                  part of risk assessment. Financial services and healthcare
                  face additional sector-specific requirements. Our reports
                  provide the documentation regulators expect, with methodology
                  transparency and remediation evidence.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    EU AI Act compliance
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    High-risk systems
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Regulated industries
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <h3 className="text-xl font-semibold mb-3">
                  Ongoing Security Monitoring
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Attack techniques evolve weekly. A model that passed red
                  teaming six months ago may be vulnerable to techniques
                  discovered since. Continuous red teaming provides ongoing
                  security assurance, catching new vulnerabilities as the threat
                  landscape shifts. This is especially critical for models with
                  RAG or tool-use capabilities where attack surfaces expand over
                  time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Production systems
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    RAG applications
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                    Agent systems
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
              Find Vulnerabilities on Your Terms
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Better to discover weaknesses in a controlled assessment than in a
              viral Twitter thread.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your model and deployment context. We&apos;ll scope
              a red team engagement that tests what matters for your specific
              threat profile.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Start Red Team Assessment <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                href="/pillars/validate/benchmark-curation"
                variant="secondary"
                size="lg"
              >
                Explore Benchmark Curation
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
