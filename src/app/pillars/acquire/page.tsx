"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Video,
  Globe,
  Cpu,
  FileCheck,
  ChevronRight,
  ArrowRight,
  Camera,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import CapabilityCard from "@/app/components/ui/CapabilityCard";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";

export default function AcquirePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const capabilities = [
    {
      icon: Video,
      title: "Human Data Collection",
      description: "Capture real-world data through expert human collectors",
      details: [
        "Egocentric video capture at scale",
        "Physical world interaction data",
        "Expert-guided data gathering",
        "Multi-environment scenario coverage",
      ],
    },
    {
      icon: Globe,
      title: "Web-Scale Harvesting",
      description: "Ethically sourced, properly licensed internet-scale data",
      details: [
        "Adaptive scraping infrastructure",
        "Copyright-safe content licensing",
        "Structured data extraction",
        "Multi-format support",
      ],
    },
    {
      icon: Cpu,
      title: "Synthetic Generation",
      description: "AI-augmented data creation with human validation",
      details: [
        "Unreal Engine environments",
        "Generative AI outputs",
        "Physics-accurate simulations",
        "Human quality validation",
      ],
    },
    {
      icon: FileCheck,
      title: "Data Licensing",
      description: "Navigate complex data rights with full provenance",
      details: [
        "Content rights negotiation",
        "Provenance documentation",
        "Compliance frameworks",
        "Audit-ready data trails",
      ],
    },
  ];

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "What types of data can Claru acquire?",
      answer: (
        <>
          <p className="mb-3">
            We acquire four categories of training data, each with different
            collection methodologies:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Human-collected data:
              </strong>{" "}
              Egocentric video from wearable cameras, physical manipulation
              recordings, task demonstrations with teleoperation rigs—data that
              requires trained collectors in real environments.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Web-scale harvesting:
              </strong>{" "}
              Structured extraction from public sources with proper licensing,
              including text corpora, image-caption pairs, and video datasets
              with copyright clearance.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Synthetic generation:
              </strong>{" "}
              Physics-accurate data from Unreal Engine, Unity, and NVIDIA
              Omniverse, plus AI-generated content validated by human reviewers.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Licensed content:
              </strong>{" "}
              Negotiated access to proprietary datasets from publishers, content
              creators, and enterprise data holders.
            </li>
          </ul>
          <p>
            All data includes full provenance documentation—source, collection
            method, processing steps, and license terms.
          </p>
        </>
      ),
    },
    {
      question: "How do you ensure data quality during acquisition?",
      answer: (
        <>
          <p className="mb-3">
            Quality issues compound quickly at scale. A 1% error rate across 10
            million samples means 100,000 bad examples polluting your training
            distribution.{" "}
            <Citation href="https://lakefs.io/blog/data-quality-for-ml-model-development-and-training/">
              Poor data quality is one of the top reasons AI projects fail
            </Citation>
            . We catch problems early through multi-stage validation:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Schema validation:
              </strong>{" "}
              Automated checks that incoming data matches expected formats,
              resolutions, frame rates, and metadata structure.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Statistical monitoring:
              </strong>{" "}
              Distribution tracking to catch drift, outliers, and anomalies
              before they propagate.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Expert review:
              </strong>{" "}
              Human validators sample data streams in real-time, flagging
              quality issues and providing feedback to collectors.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Completeness checks:
              </strong>{" "}
              Ensuring all required fields, annotations, and metadata are
              present before data enters your pipeline.
            </li>
          </ul>
          <p>
            We split deliveries into training, validation, and test sets with
            verified non-overlap—preventing data leakage that could invalidate
            your benchmarks.
          </p>
        </>
      ),
    },
    {
      question: "Can you acquire data for specialized domains?",
      answer: (
        <>
          <p className="mb-3">
            Yes. Generic crowdsourcing fails for specialized domains—you
            can&apos;t have non-experts label medical imaging or legal
            documents. We maintain networks of domain specialists:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">Medical:</strong>{" "}
              Board-certified physicians, radiologists, and clinical researchers
              for diagnostic imaging, clinical notes, and medical dialogue.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Legal:</strong>{" "}
              Licensed attorneys for contract analysis, case law annotation, and
              regulatory compliance data.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                STEM & Technical:
              </strong>{" "}
              PhD-level scientists and engineers for research papers, code
              repositories, and technical documentation.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Robotics:</strong>{" "}
              Trained operators with teleoperation experience for manipulation
              trajectories and embodied AI demonstrations.
            </li>
          </ul>
          <p>
            For niche domains without existing specialist networks, we recruit
            and train custom teams with subject matter experts who define
            collection protocols and quality standards.
          </p>
        </>
      ),
    },
    {
      question: "How do you handle data licensing and compliance?",
      answer: (
        <>
          <p className="mb-3">
            The{" "}
            <Citation href="https://kaptur.co/the-hidden-economy-behind-ai-data-licensing-takes-center-stage/">
              AI data licensing market
            </Citation>{" "}
            is projected to reach $11B+ by 2030—reflecting how critical (and
            complex) data rights have become. Every dataset we deliver includes:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                License documentation:
              </strong>{" "}
              Clear terms specifying permitted uses, geographic restrictions,
              model types, and commercial rights.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Provenance records:
              </strong>{" "}
              Full chain of custody from original source through every
              processing step—audit-ready for enterprise legal teams.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Regulatory compliance:
              </strong>{" "}
              GDPR data subject rights, CCPA disclosure requirements, and
              jurisdiction-specific privacy regulations built into collection
              protocols.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Rights negotiation:
              </strong>{" "}
              Direct licensing agreements with content owners, publishers, and
              data holders—not scraped content with uncertain provenance.
            </li>
          </ul>
          <p>
            We handle the complexity so your legal team gets clean documentation
            and your researchers get usable data.
          </p>
        </>
      ),
    },
    {
      question: "What scale can you deliver, and how fast?",
      answer: (
        <>
          <p className="mb-3">
            Scale depends on data type and complexity. Reference points from the
            industry:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Video clips:
              </strong>{" "}
              Millions of annotated clips per project.{" "}
              <Citation href="https://arxiv.org/html/2503.09642v1">
                Open-Sora 2.0
              </Citation>{" "}
              used 85M videos; we can source and process at comparable scale
              with proper licensing.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Robot trajectories:
              </strong>{" "}
              Tens of thousands to hundreds of thousands of demonstrations.{" "}
              <Citation href="https://droid-dataset.github.io/">DROID</Citation>{" "}
              collected 76K trajectories over 12 months; we can accelerate with
              parallel collection teams.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Text-image pairs:
              </strong>{" "}
              Hundreds of millions of aligned examples with human-validated
              captions.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Specialized annotation:
              </strong>{" "}
              Thousands to tens of thousands of expert-labeled examples for
              domain-specific applications.
            </li>
          </ul>
          <p>
            Timeline varies by complexity. Simple web harvesting: weeks.
            Large-scale human collection: months. We scope every project with
            realistic timelines before starting.
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
                    className="block px-3 py-2 text-sm text-[var(--accent-primary)] rounded hover:bg-[var(--bg-primary)]"
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
            <span className="text-[var(--accent-primary)]">Acquire</span>
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
                01
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Data Acquisition
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble text="ACQUIRE" scrambleOnHover={true} />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                80% of ML Time Goes to Data. Make It Count.
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              The web corpus that powered GPT-3 and CLIP? Everyone has it now.
              Table stakes.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              Your next breakthrough needs data that doesn&apos;t exist yet:
              egocentric video, robot manipulation trajectories,
              physics-accurate synthetic environments.{" "}
              <strong className="text-[var(--text-primary)]">
                You can&apos;t scrape this from the internet. We collect it.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Start Your Data Partnership <ArrowRight className="w-4 h-4" />
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
              The Data Wall
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Here&apos;s the math.{" "}
                <Citation href="https://venturebeat.com/ai/why-data-remains-the-greatest-challenge-for-machine-learning-projects">
                  80% of ML project time
                </Citation>{" "}
                goes to data work. Not architecture experiments. Not
                hyperparameter tuning. Not training runs.{" "}
                <strong className="text-[var(--text-primary)]">Data.</strong>
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                And the easy data is gone. Not &quot;getting scarce.&quot; Gone.{" "}
                <Citation href="https://www.weforum.org/stories/2025/12/data-ai-training-synthetic/">
                  AI now consumes data faster than humanity generates it
                </Citation>
                . The corpus that built GPT-3? Picked clean. LAION-5B? Legal
                minefield. Common Crawl? Everyone has it.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                Which means your differentiator isn&apos;t architecture anymore.
                It&apos;s data nobody else has.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t scrape robot manipulation trajectories from the
                  internet.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t download egocentric video of humans doing
                  household tasks at scale.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  You can&apos;t license physics-consistent video sequences from
                  stock libraries.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  This data must be collected. Deliberately. At scale.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The race is already on.{" "}
                <Citation href="https://restofworld.org/2026/china-robots-training-centers-workers/">
                  China announced 40+ state-funded data collection centers
                </Citation>{" "}
                by end of 2025—workers in VR headsets generating manipulation
                trajectories 12 hours a day. The{" "}
                <Citation href="https://robotics-transformer-x.github.io/">
                  Open X-Embodiment consortium
                </Citation>{" "}
                pooled resources from 21+ research institutions to assemble 1M robot
                episodes. That&apos;s still not enough for general-purpose
                manipulation.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  The labs that solve data acquisition will define the next
                  generation of AI.
                </p>
                <p className="text-[var(--text-secondary)]">
                  The rest will train on whatever&apos;s left.
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
              Why Data Acquisition Is the New Moat
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The race for training data has become the defining competition
                in AI. Consider the scale of recent investments:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://restofworld.org/2026/china-robots-training-centers-workers/">
                      China announced 40+ robot data collection centers
                    </Citation>{" "}
                    by December 2025, with workers performing tasks in VR
                    headsets to generate manipulation trajectories
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    The{" "}
                    <Citation href="https://robotics-transformer-x.github.io/">
                      Open X-Embodiment dataset
                    </Citation>{" "}
                    aggregated 1M+ real robot trajectories from 21 research
                    labs—yet this represents only a fraction of what&apos;s
                    needed for general-purpose robotics
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    <Citation href="https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends/2026/physical-ai-humanoid-robots.html">
                      VCs invested $7.2B in robotics in 2025
                    </Citation>
                    —up from $3.1B in 2023—with data infrastructure as a primary
                    focus
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1">+</span>
                  <span className="text-[var(--text-secondary)]">
                    The AI data licensing market is projected to reach{" "}
                    <Citation href="https://kaptur.co/the-hidden-economy-behind-ai-data-licensing-takes-center-stage/">
                      $11.16B by 2030
                    </Citation>
                    , as companies seek copyright-safe, properly licensed
                    training data
                  </span>
                </li>
              </ul>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Video generation models like SkyReels and Sora require{" "}
                <strong className="text-[var(--text-primary)]">
                  millions of video clips
                </strong>{" "}
                with temporal consistency—every frame must make physical sense
                in relation to the last. Robotics models need real-world
                manipulation data across thousands of scenarios. Multimodal
                systems require precisely aligned text-image-audio-video
                annotations.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                This isn&apos;t data you can buy off the shelf. It must be{" "}
                <strong className="text-[var(--text-primary)]">
                  purposefully acquired
                </strong>{" "}
                by teams who understand both the technical requirements of
                frontier models and the operational complexity of large-scale
                data collection.
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
              to discuss your specific data acquisition needs.
            </p>

            {/* Placeholder cards for future case studies */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Video className="w-5 h-5 text-[var(--accent-primary)] opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-tertiary)]">
                  Video Generation Lab
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  How we sourced 2M+ licensed video clips for a frontier video
                  generation model.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5 text-[var(--accent-primary)] opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-tertiary)]">
                  Robotics Startup
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Building a manipulation dataset from scratch: 500K
                  trajectories in 90 days.
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
              How We Acquire Data
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Four specialized pipelines, each designed for different data
              acquisition challenges.
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
              Our Acquisition Process
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Requirements Discovery",
                  description:
                    "We start by understanding your model architecture, target capabilities, and data gaps. This shapes collection protocols, quality thresholds, and delivery formats.",
                },
                {
                  step: "02",
                  title: "Pipeline Design",
                  description:
                    "Based on your requirements, we design a custom acquisition pipeline—whether that means deploying human collectors, building scraping infrastructure, or setting up synthetic generation environments.",
                },
                {
                  step: "03",
                  title: "Collection & Validation",
                  description:
                    "Data flows through multi-stage validation as it's collected. Expert reviewers catch quality issues early, before they compound into dataset-wide problems.",
                },
                {
                  step: "04",
                  title: "Delivery & Integration",
                  description:
                    "Clean data is delivered in your preferred format with full provenance documentation. We support direct integration with your training pipeline.",
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
              Explore Our Acquisition Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/pillars/acquire/egocentric-video"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Camera className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Egocentric Video
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  First-person video capture for robotics and embodied AI
                  training
                </p>
              </Link>
              <Link
                href="/pillars/acquire/synthetic-data"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <Cpu className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Synthetic Data
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Procedurally generated training data with human validation
                </p>
              </Link>
              <Link
                href="/pillars/acquire/data-licensing"
                className="p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all group bg-[var(--bg-primary)]"
              >
                <FileCheck className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  Data Licensing
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Licensed content with full provenance and compliance
                  documentation
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
              Data Acquisition for Frontier Applications
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Each frontier AI domain has unique data requirements. Here&apos;s
              what it takes to train at the cutting edge.
            </p>

            <div className="space-y-8">
              {/* Video Generation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Video Generation</h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Sora, Runway, Veo, HunyuanVideo
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Video generation isn&apos;t like generating single
                    images—it&apos;s creating sequences where every frame must
                    make physical sense in relation to the last.{" "}
                    <Citation href="https://arxiv.org/html/2503.09642v1">
                      Open-Sora 2.0
                    </Citation>{" "}
                    trained on <strong>85 million videos</strong> across three
                    stages, with clips constrained to 2-8 seconds and captions
                    averaging 75+ words covering subject, action, environment,
                    lighting, camera movement, and style.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Web-scraped video is noisy—generic captions, inconsistent
                    quality, copyright issues. Stock libraries don&apos;t have
                    the diversity or scale. You need millions of clips with
                    precise temporal annotations, physics-accurate motion, and
                    clear licensing.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        16+ fps
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Minimum frame rate
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        2-8 sec
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Optimal clip length
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        75+ words
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Caption density
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        6 aspects
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Per-clip annotation
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Robotics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Robotics & Embodied AI
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Manipulation, locomotion, humanoids
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Robotics models need real-world manipulation
                    trajectories—not simulated, not scripted. The{" "}
                    <Citation href="https://droid-dataset.github.io/">
                      DROID dataset
                    </Citation>{" "}
                    collected <strong>76,000 trajectories</strong> across 564
                    scenes and 86 tasks using stereo cameras and teleoperation
                    rigs. That took 50 collectors across three continents over
                    12 months.{" "}
                    <Citation href="https://github.com/OpenDriveLab/AgiBot-World">
                      AgiBot World
                    </Citation>{" "}
                    pushed further with <strong>1M+ trajectories</strong> for
                    bimanual manipulation.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Most robotics datasets are lab-only—far from real-world
                    conditions. You need diverse environments (homes,
                    warehouses, offices), multiple camera angles with
                    calibration data, and natural language task descriptions.
                    This requires physical infrastructure and trained operators.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        3+ cameras
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Stereo + wrist views
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        6-DOF
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Action trajectories
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        500+ scenes
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Environment diversity
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        NL labels
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Task descriptions
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Multimodal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Multimodal Models</h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      CLIP, LLaVA, GPT-4V, Gemini
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Multimodal systems must align different vector spaces so
                    &quot;cat,&quot; an image of a cat, and the sound of a meow
                    all map to the same concept.{" "}
                    Multimodal models need{" "}
                    <strong>orders of magnitude more training data</strong> than
                    single-modality systems. CLIP trained on hundreds of
                    millions of image-text pairs—and web-scale corpora are
                    notoriously noisy.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">
                    <strong className="text-[var(--text-primary)]">
                      The challenge:
                    </strong>{" "}
                    Misalignment between modalities is garbage-in, garbage-out.
                    Facial expressions must sync with spoken words. Image
                    captions must describe what&apos;s actually in the frame.
                    Creating well-aligned datasets across text, image, audio,
                    and video is a bottleneck that requires expert annotation.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        10-100x
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        More data than unimodal
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Sub-frame
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Sync precision
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        4+ modalities
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Text/image/audio/video
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--accent-primary)] font-mono text-lg">
                        Semantic
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Cross-modal alignment
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
              Stop Waiting for Data That Won&apos;t Appear
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Your researchers shouldn&apos;t spend 80% of their time on data
              logistics.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us what you&apos;re training. We&apos;ll scope a collection
              pipeline that delivers the quality, scale, and provenance your
              models need.
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
