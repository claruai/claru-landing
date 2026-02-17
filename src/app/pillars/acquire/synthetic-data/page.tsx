"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Box,
  Layers,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Car,
  Factory,
  Cog,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";

export default function SyntheticDataPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question:
        "How realistic does synthetic data need to be for effective model training?",
      answer: (
        <>
          <p className="mb-3">
            The required level of realism depends on your application and
            training approach. There are three main strategies:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Photorealistic rendering:
              </strong>{" "}
              For applications where visual appearance matters (autonomous
              driving, retail, security), we use Unreal Engine 5 with ray
              tracing to achieve near-photorealistic quality.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Domain randomization:
              </strong>{" "}
              Research shows that{" "}
              <Citation href="https://arxiv.org/abs/1703.06907">
                training with diverse, non-realistic textures and conditions
              </Citation>{" "}
              can produce models that generalize better than those trained on
              photorealistic data alone.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Physics accuracy:
              </strong>{" "}
              For robotics sim-to-real transfer, accurate physics modeling
              matters more than visual realism. We tune friction, mass, damping
              parameters to match real-world behavior.
            </li>
          </ul>
          <p>
            We recommend starting with domain randomization and validating
            against real-world test sets to find the right balance for your
            application.
          </p>
        </>
      ),
    },
    {
      question: "How do you validate that synthetic data works for training?",
      answer: (
        <>
          <p className="mb-3">
            Validation is critical because synthetic data can embed biases or
            gaps that only become apparent in deployment. Our validation process
            includes:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Real-world benchmarks:
              </strong>{" "}
              We test synthetic-trained models against held-out real-world
              datasets to measure the sim-to-real gap before full deployment.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Human expert review:
              </strong>{" "}
              Domain experts evaluate synthetic samples for plausibility,
              catching edge cases that automated metrics miss.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Distribution analysis:
              </strong>{" "}
              We compare feature distributions between synthetic and real data
              to identify gaps in coverage.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Iterative refinement:
              </strong>{" "}
              Based on validation results, we adjust generation parameters to
              close identified gaps.
            </li>
          </ul>
          <p>
            Synthetic data is most effective when treated as a complement to
            real data, not a replacement. We help you find the right mix.
          </p>
        </>
      ),
    },
    {
      question: "What scale of synthetic data can you generate?",
      answer: (
        <>
          <p className="mb-3">
            Synthetic data generation scales with compute, not human labor. Once
            we have built your generation pipeline, we can produce virtually
            unlimited variations:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">Images:</strong>{" "}
              Millions of labeled images per week with automated rendering
              farms. Typical projects generate 1-10 million images.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Video sequences:
              </strong>{" "}
              Hundreds of thousands of clips with temporal consistency and
              frame-level annotations.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">3D scenes:</strong>{" "}
              Thousands of unique environment configurations with procedural
              generation.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Robot trajectories:
              </strong>{" "}
              Millions of simulated manipulation episodes for reinforcement
              learning.
            </li>
          </ul>
          <p>
            The bottleneck is usually pipeline development and validation, not
            generation itself. We invest upfront in building robust generation
            systems that can scale efficiently.
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
              href="/pillars/acquire"
              className="hover:text-[var(--text-primary)]"
            >
              Acquire
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--accent-primary)]">Synthetic Data</span>
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
                ACQUIRE
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Synthetic Data
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Generate Training Data
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                That Does Not Exist
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Real data is scarce, expensive, and never covers the edge cases
              that matter. Synthetic data generation fills the gaps with
              unlimited variations and perfect labels.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              We build custom generation pipelines using Unreal Engine, NVIDIA
              Omniverse, and domain randomization.{" "}
              <strong className="text-[var(--text-primary)]">
                Train on scenarios you could never capture in the wild.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Build Your Pipeline <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/acquire" variant="secondary" size="lg">
                Back to Acquire
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
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// THE PROBLEM"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why Real Data Is Not Enough
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The most critical scenarios for AI systems are the ones that
                rarely happen. An autonomous vehicle needs to handle a child
                running into the street, not just normal traffic. But you cannot
                ethically collect that data in the real world.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                This is the fundamental limitation of real-world data
                collection: the long tail of rare events is both the most
                important and the hardest to capture.{" "}
                <Citation href="https://www.gartner.com/en/newsroom/press-releases/2022-06-22-is-synthetic-data-the-future-of-ai">
                  Gartner predicts that by 2028, 80% of data used by AI will be
                  synthetic
                </Citation>
                , up from 20% in 2024.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  Synthetic data solves three problems at once.
                </p>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Scale:
                      </strong>{" "}
                      Generate millions of labeled examples without human
                      collection
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Coverage:
                      </strong>{" "}
                      Create rare scenarios, edge cases, and dangerous
                      situations safely
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Labels:
                      </strong>{" "}
                      Perfect ground truth automatically—no annotation errors or
                      ambiguity
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://www.nvidia.com/en-us/omniverse/synthetic-data/">
                  NVIDIA Omniverse
                </Citation>{" "}
                and other simulation platforms now enable physically accurate
                synthetic data at scale. Companies like Amazon, BMW, and Siemens
                use synthetic data to train perception systems for robotics,
                manufacturing, and autonomous vehicles.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                The challenge is not the tools—it is building pipelines that
                generate data your models can actually learn from. That requires
                careful domain randomization, validation against real-world
                benchmarks, and human expertise to close the sim-to-real gap.
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
            className="max-w-4xl mx-auto mb-16"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// HOW IT WORKS"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our Synthetic Data Pipeline
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Asset & Environment Creation",
                  description:
                    "We build or source 3D assets, environments, and physics simulations tailored to your domain. This includes CAD model import, procedural environment generation, and material library development.",
                  icon: Box,
                },
                {
                  step: "02",
                  title: "Domain Randomization Configuration",
                  description:
                    "We configure variation parameters: lighting conditions, textures, object positions, camera angles, weather, and physics properties. The goal is creating enough diversity that real-world conditions become just another variation.",
                  icon: RefreshCw,
                },
                {
                  step: "03",
                  title: "Rendering & Generation",
                  description:
                    "Our rendering farm generates data at scale with automatic ground truth labels: bounding boxes, segmentation masks, depth maps, surface normals, and instance IDs. All labels are pixel-perfect by construction.",
                  icon: Layers,
                },
                {
                  step: "04",
                  title: "Human Validation Layer",
                  description:
                    "Domain experts review synthetic samples for plausibility and coverage gaps. We validate against real-world benchmarks to ensure the sim-to-real gap is acceptable for your application.",
                  icon: Sparkles,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 p-6 rounded-xl bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)]"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-[var(--accent-primary)]">
                        {item.step}
                      </span>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                    </div>
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
              Generation Capabilities
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Our synthetic data pipelines leverage industry-leading tools and
              techniques for maximum quality and scale.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Rendering Engines",
                  specs: [
                    "Unreal Engine 5 (Nanite/Lumen)",
                    "NVIDIA Omniverse",
                    "Unity with HDRP",
                    "Custom ray tracers",
                  ],
                },
                {
                  title: "Output Formats",
                  specs: [
                    "RGB images (PNG, EXR, JPEG)",
                    "Depth maps (16/32-bit)",
                    "Segmentation masks",
                    "Surface normals",
                  ],
                },
                {
                  title: "Domain Randomization",
                  specs: [
                    "Texture/material variation",
                    "Lighting & weather",
                    "Camera intrinsics/extrinsics",
                    "Physics parameters",
                  ],
                },
                {
                  title: "Label Types",
                  specs: [
                    "2D/3D bounding boxes",
                    "Instance segmentation",
                    "Keypoint annotations",
                    "Pose estimation GT",
                  ],
                },
                {
                  title: "Resolution & Scale",
                  specs: [
                    "Up to 8K resolution",
                    "Millions of images/week",
                    "Video sequences (60fps)",
                    "Multi-view synchronized",
                  ],
                },
                {
                  title: "Physics Simulation",
                  specs: [
                    "Rigid body dynamics",
                    "Soft body/cloth",
                    "Fluid simulation",
                    "Accurate collision",
                  ],
                },
              ].map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.specs.map((spec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                      >
                        <CheckCircle className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
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
              Applications for Synthetic Data
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Synthetic data is transforming industries where real data is
              scarce, dangerous, or expensive to collect.
            </p>

            <div className="space-y-8">
              {/* Autonomous Vehicles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Autonomous Vehicles
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Perception, prediction, planning
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Self-driving systems need to handle rare but critical
                    scenarios: pedestrians appearing suddenly, unusual weather
                    conditions, construction zones, emergency vehicles. These
                    events are too infrequent in real driving data to train
                    robust models.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    <Citation href="https://lilianweng.github.io/posts/2019-05-05-domain-randomization/">
                      Domain randomization research
                    </Citation>{" "}
                    has shown that models trained with sufficient synthetic
                    variation can generalize to real-world conditions without
                    seeing them during training. We generate millions of
                    annotated driving scenarios with configurable weather,
                    traffic, and edge cases.
                  </p>
                </div>
              </motion.div>

              {/* Robotics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Cog className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Robotics Sim-to-Real
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Manipulation, locomotion, navigation
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Training robots in the real world is slow, expensive, and
                    potentially dangerous. Simulation enables millions of
                    training episodes without hardware wear or safety concerns.
                    The challenge is ensuring policies transfer from simulation
                    to reality.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    We address the{" "}
                    <Citation href="https://arxiv.org/abs/2009.13303">
                      sim-to-real gap
                    </Citation>{" "}
                    through physics parameter randomization, diverse environment
                    generation, and validation against real robot performance.
                    Our pipelines have enabled manipulation policies that
                    transfer with minimal real-world fine-tuning.
                  </p>
                </div>
              </motion.div>

              {/* Industrial/Manufacturing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Factory className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Industrial & Manufacturing
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Defect detection, quality control, automation
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Manufacturing defect detection requires training data for
                    defects that should not exist—scratches, cracks,
                    misalignments. Collecting real defect data means producing
                    defective parts, which is wasteful and may not cover all
                    failure modes.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Synthetic defect generation creates comprehensive training
                    sets with every possible defect type, severity, and
                    location. Combined with procedural variation in lighting and
                    camera angles, this enables inspection systems that
                    generalize across production conditions.
                  </p>
                </div>
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
              Generate the Data Your Models Need
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Stop waiting for rare events to happen. Build synthetic data
              pipelines that cover every scenario your AI might encounter.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us your domain, use case, and scale requirements. We will
              design a generation pipeline that delivers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss Your Pipeline <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/acquire" variant="secondary" size="lg">
                Back to Acquire
              </Button>
            </div>
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
              href="/pillars/acquire/egocentric-video"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                ACQUIRE
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Egocentric Video
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Real-world first-person capture
              </p>
            </Link>
            <Link
              href="/pillars/acquire/data-licensing"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                ACQUIRE
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Data Licensing
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Copyright-safe real data
              </p>
            </Link>
            <Link
              href="/pillars/validate"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                VALIDATE
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Quality Assurance
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Validate synthetic vs real performance
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
