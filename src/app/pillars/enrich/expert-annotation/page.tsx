"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Shield,
  Target,
  Stethoscope,
  Scale,
  Code,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";
import CaseStudyCallout from "@/app/components/ui/CaseStudyCallout";

// Domain card component
function DomainCard({
  icon: Icon,
  title,
  description,
  credentials,
  index,
}: {
  icon: typeof Users;
  title: string;
  description: string;
  credentials: string[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="p-6 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
    >
      <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent-primary)]/20 transition-colors">
        <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] mb-4">{description}</p>
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          Required credentials:
        </p>
        <ul className="space-y-1">
          {credentials.map((credential, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[var(--text-tertiary)]"
            >
              <span className="text-[var(--accent-primary)] mt-0.5">+</span>
              {credential}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function ExpertAnnotationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const domains = [
    {
      icon: FlaskConical,
      title: "STEM",
      description:
        "Mathematics, physics, chemistry, and biology annotation for scientific AI applications.",
      credentials: [
        "PhD from research institution",
        "Publication record in field",
        "Active research experience",
      ],
    },
    {
      icon: Stethoscope,
      title: "Medical",
      description:
        "Clinical annotation for healthcare AI, medical imaging, and diagnostic systems.",
      credentials: [
        "Board certification (MD/DO)",
        "Active medical license",
        "Clinical practice experience",
      ],
    },
    {
      icon: Scale,
      title: "Legal",
      description:
        "Contract analysis, case law annotation, and regulatory compliance for legal AI.",
      credentials: [
        "JD from accredited law school",
        "Active bar membership",
        "Practice area expertise",
      ],
    },
    {
      icon: Code,
      title: "Software Engineering",
      description:
        "Code review, bug detection, and technical documentation for code AI models.",
      credentials: [
        "5+ years professional experience",
        "Senior or staff level roles",
        "Open source contributions",
      ],
    },
  ];

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "How do you find and verify expert annotators?",
      answer: (
        <>
          <p className="mb-3">
            Expert recruitment is our core competency. We source annotators
            through professional networks, academic institutions, and
            specialized talent platforms. But sourcing is just the
            start&mdash;verification is where we differentiate.
          </p>
          <ul className="space-y-2 mb-3">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Credential verification:
                </strong>{" "}
                We verify degrees, licenses, and certifications directly with
                issuing institutions. For physicians, we check medical board
                certifications. For attorneys, we verify bar membership status.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Skills assessment:
                </strong>{" "}
                Beyond credentials, we administer domain-specific tests to
                verify working knowledge. A PhD doesn&apos;t guarantee
                competence on every task within a field.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Calibration rounds:
                </strong>{" "}
                Before production work, annotators complete calibration tasks
                with known correct answers. This identifies individuals who have
                credentials but lack practical annotation skill.
              </span>
            </li>
          </ul>
          <p>
            The result: annotators who have both the domain knowledge and the
            annotation skills to produce accurate, consistent labels at scale.
          </p>
        </>
      ),
    },
    {
      question:
        "How does expert annotation quality compare to crowdsourced annotation?",
      answer: (
        <>
          <p className="mb-3">
            For tasks requiring domain knowledge, the quality gap is massive.{" "}
            <Citation href="https://arxiv.org/abs/2306.08997">
              Research on LLM evaluation
            </Citation>{" "}
            shows that expert annotators catch subtle errors that crowdsourced
            workers consistently miss, particularly in technical and specialized
            domains.
          </p>
          <p className="mb-3">
            The{" "}
            <Citation href="https://www.theverge.com/2024/5/2/24147012/elon-musk-xai-grok-contract-workers-texas">
              xAI pivot to specialists
            </Citation>{" "}
            in 2024 illustrated this clearly: after initially using crowdsourced
            workers, xAI shifted to recruiting experts with advanced degrees
            specifically because annotation quality for technical content
            required genuine domain understanding.
          </p>
          <p className="mb-3">Quantitatively, we typically see:</p>
          <ul className="space-y-2 mb-3">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  20-40% higher accuracy
                </strong>{" "}
                on tasks involving factual correctness in specialized domains
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  50%+ improvement in IAA
                </strong>{" "}
                for nuanced judgments like code quality or medical accuracy
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  3-5x fewer re-annotation cycles
                </strong>{" "}
                due to catching errors during initial labeling
              </span>
            </li>
          </ul>
          <p>
            The cost per label is higher, but the total cost of achieving target
            data quality is often lower with experts.
          </p>
        </>
      ),
    },
    {
      question:
        "What domains can you cover for niche or specialized applications?",
      answer: (
        <>
          <p className="mb-3">
            Our core networks cover the high-demand domains: STEM, medicine,
            law, software engineering, and finance. But AI applications span far
            beyond these traditional areas.
          </p>
          <p className="mb-3">
            For niche domains, we recruit custom expert teams. Recent examples
            include:
          </p>
          <ul className="space-y-2 mb-3">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Pharmaceutical research:
                </strong>{" "}
                Medicinal chemists and pharmacologists for drug discovery AI
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Climate science:
                </strong>{" "}
                Atmospheric scientists and ecologists for environmental modeling
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Agricultural technology:
                </strong>{" "}
                Agronomists and plant pathologists for precision farming AI
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Aerospace engineering:
                </strong>{" "}
                Flight test engineers and aerodynamicists for aviation AI
              </span>
            </li>
          </ul>
          <p>
            Custom recruitment typically takes 2-4 weeks depending on domain
            specificity. We handle sourcing, verification, and training so you
            can focus on your AI development.
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
            <span className="text-[var(--accent-primary)]">
              Expert Annotation
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
                ENRICH
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Domain Specialists
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble text="EXPERT ANNOTATION" scrambleOnHover={true} />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Domain Experts, Not Crowds
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Some labeling tasks require genuine expertise. Medical accuracy.
              Legal reasoning. Scientific validity. Code correctness.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              We provide{" "}
              <strong className="text-[var(--text-primary)]">
                PhD-level domain specialists
              </strong>{" "}
              with verified credentials for annotation tasks where accuracy
              isn&apos;t optional.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss Expert Requirements <ArrowRight className="w-4 h-4" />
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
              Why Generic Annotators Fail on Specialized Tasks
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                There&apos;s a fundamental mismatch in how AI companies source
                annotation labor. Crowdsourcing platforms optimize for scale and
                cost, not expertise. The result: annotators who can identify
                cats in photos but can&apos;t distinguish valid medical
                diagnoses from dangerous misinformation.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The frontier labs have figured this out.{" "}
                <Citation href="https://www.theverge.com/2024/5/2/24147012/elon-musk-xai-grok-contract-workers-texas">
                  xAI&apos;s 2024 pivot
                </Citation>{" "}
                to recruiting specialists with advanced degrees signaled a
                broader industry shift. Generic crowdworkers couldn&apos;t
                reliably evaluate technical content. The company needed
                annotators who actually understood the domains they were
                labeling.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://sacra.com/c/micro1/">
                  Platforms like micro1 now accept only the top 1% of applicants
                </Citation>{" "}
                for RLHF and expert annotation work. The market has recognized
                that annotation quality scales with annotator
                expertise&mdash;but the supply of genuine experts is severely
                constrained.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  A crowdworker labels what they see. An expert labels what
                  matters.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  A generic annotator flags obvious errors. A specialist catches
                  subtle mistakes that cascade into model failures.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Crowdsourced annotation scales easily. Expert annotation
                  scales with recruitment and verification effort.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The bottleneck isn&apos;t annotation tooling or project
                management. It&apos;s{" "}
                <strong className="text-[var(--text-primary)]">
                  access to humans with genuine domain expertise
                </strong>{" "}
                who are willing to do annotation work. These experts exist, but
                they&apos;re not on typical crowdsourcing platforms.
                They&apos;re in academic institutions, professional practices,
                and specialized consulting firms.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  For high-stakes domains, expert annotation isn&apos;t a
                  luxury. It&apos;s a requirement.
                </p>
                <p className="text-[var(--text-secondary)]">
                  Models trained on incorrect medical labels make incorrect
                  medical predictions.
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
              Expert Annotation Process
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
                    <GraduationCap className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    1. Expert Recruitment & Verification
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    We source experts through academic networks, professional
                    associations, and specialized talent platforms. Every expert
                    undergoes credential verification: we check degrees with
                    issuing institutions, verify professional licenses, and
                    confirm active practice in the relevant field.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Beyond credentials, we assess working knowledge through
                    domain-specific evaluations. A credential proves you passed
                    an exam; an assessment proves you can apply that knowledge
                    to annotation tasks.
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
                    <Target className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    2. Domain Matching & Calibration
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    We match experts to tasks based on specific subdomain
                    expertise. A cardiologist annotates cardiac imaging; an
                    oncologist reviews cancer screening data. Generic
                    &quot;medical&quot; expertise isn&apos;t sufficient for
                    specialized applications.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Before production annotation, experts complete calibration
                    rounds on pre-labeled examples. This ensures they understand
                    your specific guidelines and quality requirements, and
                    surfaces any misalignments between their expertise and your
                    task definition.
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
                    <Shield className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    3. Specialized Tooling & Support
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Expert annotators need tools designed for their domains.
                    Medical annotators use DICOM viewers with appropriate
                    measurement tools. Legal annotators access document
                    comparison and citation lookup. Code reviewers have IDE
                    integration and syntax highlighting.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    We also provide domain-specific support: medical annotation
                    projects have clinical consultants available for edge cases,
                    legal projects have senior attorneys for complex judgments.
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
                    <Users className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    4. Quality Assurance & Expert Consensus
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Complex expert tasks often require multi-annotator
                    consensus. When two physicians disagree on a diagnosis
                    label, we don&apos;t just majority-vote; we escalate to
                    senior specialists who can make authoritative judgments and
                    document the reasoning.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Quality metrics include gold standard accuracy, inter-expert
                    agreement, and detailed disagreement analysis. For ambiguous
                    cases, we provide the full spectrum of expert opinions
                    rather than forcing artificial consensus.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Domain Coverage Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// DOMAIN COVERAGE"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Expert Networks by Domain
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              We maintain active expert networks across high-demand domains,
              with custom recruitment for specialized applications.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {domains.map((domain, index) => (
                <DomainCard key={domain.title} {...domain} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-20">
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
              Quality Standards & Verification
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Credential Requirements */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">
                  Credential Requirements
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Academic credentials:
                      </strong>{" "}
                      Verified directly with issuing institutions
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Professional licenses:
                      </strong>{" "}
                      Active status confirmed with licensing boards
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Work experience:
                      </strong>{" "}
                      Employment history verified for senior roles
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Skills assessment:
                      </strong>{" "}
                      Domain-specific testing beyond credential verification
                    </span>
                  </li>
                </ul>
              </div>

              {/* Quality Metrics */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">Quality Metrics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Inter-expert agreement:
                      </strong>{" "}
                      Targeting 85%+ on well-defined tasks
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Gold standard accuracy:
                      </strong>{" "}
                      95%+ on embedded validation items
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Calibration scores:
                      </strong>{" "}
                      Performance tracking against known-correct examples
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Disagreement analysis:
                      </strong>{" "}
                      Full documentation of expert disagreements
                    </span>
                  </li>
                </ul>
              </div>

              {/* Throughput */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">
                  Throughput by Domain
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        STEM annotation:
                      </strong>{" "}
                      500-2,000 items/week per expert
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Medical review:
                      </strong>{" "}
                      200-500 cases/week depending on complexity
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Legal annotation:
                      </strong>{" "}
                      100-300 documents/week per attorney
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Code review:
                      </strong>{" "}
                      300-1,000 code samples/week per engineer
                    </span>
                  </li>
                </ul>
              </div>

              {/* Pricing Model */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">Pricing Factors</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Domain scarcity:
                      </strong>{" "}
                      Specialized experts command premium rates
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Task complexity:
                      </strong>{" "}
                      Simple labeling vs. nuanced judgment
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Multi-expert consensus:
                      </strong>{" "}
                      Additional annotators per item
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Custom recruitment:
                      </strong>{" "}
                      Timeline and effort for niche domains
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
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
              Where Expert Annotation Is Essential
            </h2>

            <div className="space-y-8">
              {/* Medical AI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Medical AI & Diagnostics
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Medical AI systems must be accurate. Incorrect labels
                  don&apos;t just degrade model performance; they can lead to
                  misdiagnosis and patient harm.{" "}
                  <Citation href="https://www.nature.com/articles/s41746-019-0169-5">
                    Studies show
                  </Citation>{" "}
                  that AI diagnostic tools trained on low-quality annotations
                  produce unreliable outputs, regardless of model architecture.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We provide board-certified physicians for medical imaging
                  annotation, clinical text analysis, and diagnostic labeling.
                  Every annotation is made by someone qualified to make that
                  clinical judgment in practice.
                </p>
              </motion.div>

              {/* Legal Tech */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Legal Document Analysis
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Legal AI for contract analysis, case law research, and
                  regulatory compliance requires attorneys who understand the
                  law. A clause that seems standard might have critical
                  implications depending on jurisdiction, industry, or
                  regulatory context.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We match legal annotation tasks to attorneys with relevant
                  practice experience. Contract review goes to transactional
                  lawyers. Litigation analysis goes to litigators. Regulatory
                  annotation goes to compliance specialists.
                </p>
              </motion.div>

              {/* Scientific Research */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Scientific Research AI
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  AI systems for scientific literature analysis, hypothesis
                  generation, and research assistance need annotations from
                  practicing scientists. Understanding which experimental
                  results are significant, which methodologies are sound, and
                  which conclusions are well-supported requires active research
                  experience.
                </p>
                <p className="text-[var(--text-secondary)]">
                  Our STEM annotators are active researchers with publication
                  records in their fields. They evaluate scientific content the
                  way peer reviewers do, not the way crowdworkers do.
                </p>
              </motion.div>

              {/* Code Review */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Code Quality & Security
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Training AI code assistants on low-quality code produces
                  low-quality suggestions.{" "}
                  <Citation href="https://arxiv.org/abs/2107.03374">
                    Code quality annotation
                  </Citation>{" "}
                  requires engineers who can evaluate correctness, efficiency,
                  security, and maintainability&mdash;not just syntax validity.
                </p>
                <p className="text-[var(--text-secondary)]">
                  Our engineering annotators are senior developers with
                  production experience. They evaluate code the way code
                  reviewers at top tech companies do, identifying not just
                  what&apos;s wrong but why it&apos;s wrong and how to fix it.
                </p>
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

      {/* See It In Practice */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
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
            <div className="grid md:grid-cols-2 gap-6">
              <CaseStudyCallout
                index={0}
                caseStudy={{
                  slug: "fashion-ai-annotation",
                  headlineStat: "3M+",
                  headlineStatLabel: "Fashion images annotated",
                  title: "Large-Scale Image Annotation for Fashion AI",
                  teaser: "Deployed 1,000+ trained annotators to label 3M+ fashion and lifestyle images with structured taxonomy and multi-layer QA — materially improving model robustness and recognition accuracy.",
                }}
              />
              <CaseStudyCallout
                index={1}
                caseStudy={{
                  slug: "video-content-classification",
                  headlineStat: "105K",
                  headlineStatLabel: "Video clips classified in 7 days",
                  title: "High-Confidence Video Content Classification at Scale",
                  teaser: "105,000 video clips classified in just seven days — after rapidly redesigning the annotation framework mid-project to eliminate subjectivity and deliver zero downstream rework.",
                }}
              />
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
              Ready for Expert-Level Annotation?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              For high-stakes domains, annotation quality determines model
              quality.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your domain and task requirements. We&apos;ll match
              you with verified experts who have the credentials and skills to
              produce accurate, consistent labels.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss Expert Requirements <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/enrich/rlhf" variant="secondary" size="lg">
                Learn About RLHF
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
              href="/pillars/enrich/rlhf"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Cluster
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                RLHF
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Human feedback for LLM alignment
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
