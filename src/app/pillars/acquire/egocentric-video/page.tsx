"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Eye,
  Camera,
  Users,
  Globe,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Cpu,
  Navigation,
  Glasses,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";
import CaseStudyCallout from "@/app/components/ui/CaseStudyCallout";
import type { CaseStudyCalloutData } from "@/app/components/ui/CaseStudyCallout";

export default function EgocentricVideoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question:
        "What hardware and camera setups do you use for egocentric video collection?",
      answer: (
        <>
          <p className="mb-3">
            Our hardware selection depends on your specific requirements, but we
            typically deploy several categories of devices:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Head-mounted cameras:
              </strong>{" "}
              GoPro Hero series with adjustable mounts, similar to the setup
              used in{" "}
              <Citation href="https://epic-kitchens.github.io/">
                EPIC-KITCHENS
              </Citation>
              , capturing 1080p at 60fps with wide-angle lenses.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Smart glasses:
              </strong>{" "}
              Meta Aria glasses for lighter-weight collection with integrated
              eye tracking and IMU sensors, as used in Ego-Exo4D.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Stereo camera rigs:
              </strong>{" "}
              Custom dual-camera setups for depth perception data, essential for
              robotics applications requiring spatial understanding.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Multi-sensor packages:
              </strong>{" "}
              Combinations of video, IMU, eye tracking, and hand tracking for
              comprehensive embodied AI datasets.
            </li>
          </ul>
          <p>
            We calibrate all devices to your specifications and maintain
            consistent capture parameters across all collectors in a project.
          </p>
        </>
      ),
    },
    {
      question: "How do you handle privacy and consent in data collection?",
      answer: (
        <>
          <p className="mb-3">
            Privacy is fundamental to responsible egocentric data collection.
            Our protocols address multiple layers of consent and protection:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Participant consent:
              </strong>{" "}
              All camera wearers sign detailed consent forms explaining data
              use, retention, and their rights to withdraw.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Bystander protection:
              </strong>{" "}
              We implement automated face detection and blurring for
              non-consenting individuals who appear in footage, following the
              approach used by Ego4D.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Environment approval:
              </strong>{" "}
              Collection only occurs in pre-approved locations where we have
              appropriate permissions.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Data minimization:
              </strong>{" "}
              We collect only what is needed for your use case and delete raw
              footage after processing unless retention is required.
            </li>
          </ul>
          <p>
            Our processes comply with GDPR, CCPA, and other privacy regulations.
            We provide full audit documentation for enterprise legal teams.
          </p>
        </>
      ),
    },
    {
      question:
        "What scale of egocentric data can you collect, and how long does it take?",
      answer: (
        <>
          <p className="mb-3">
            Scale depends on your requirements and the complexity of the
            activities being captured. Reference benchmarks from major datasets:
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">Ego4D:</strong>{" "}
              <Citation href="https://ego4d-data.org/">
                3,670 hours from 931 collectors
              </Citation>{" "}
              across 9 countries, capturing daily life activities over
              approximately 18 months.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                EPIC-KITCHENS-100:
              </strong>{" "}
              <Citation href="https://epic-kitchens.github.io/">
                100 hours of kitchen activities
              </Citation>{" "}
              from 45 participants with dense action annotations.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Our range:</strong>{" "}
              Pilot projects start at 100-500 hours (4-8 weeks). Production
              datasets of 1,000-5,000+ hours typically require 3-12 months
              depending on environment diversity and annotation requirements.
            </li>
          </ul>
          <p>
            We maintain trained collector networks across North America, Europe,
            and Asia-Pacific, allowing parallel collection to accelerate
            timelines when geographic diversity is required.
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
            <span className="text-[var(--accent-primary)]">
              Egocentric Video
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
                ACQUIRE
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Egocentric Video
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              First-Person Video Data
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                At Scale
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Your embodied AI needs to see the world the way humans do.
              Third-person video misses the critical signals: where we look,
              what we reach for, how we navigate.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              We deploy trained collectors with wearable cameras to capture
              first-person video across real-world environments.{" "}
              <strong className="text-[var(--text-primary)]">
                The data robots and AR/VR systems actually need.
              </strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Start Your Collection <ArrowRight className="w-4 h-4" />
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
              Why Egocentric Video Is the Missing Link
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Every major breakthrough in embodied AI has been bottlenecked by
                data. Not compute. Not architecture.{" "}
                <strong className="text-[var(--text-primary)]">Data.</strong>
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Third-person video shows what happens from an observer&apos;s
                perspective. But robots need to understand the actor&apos;s
                perspective: where to focus attention, how to approach objects,
                what hand movements accomplish tasks. This is precisely what
                egocentric video captures.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The{" "}
                <Citation href="https://ego4d-data.org/">
                  Ego4D project
                </Citation>{" "}
                demonstrated what becomes possible with large-scale egocentric
                data: 3,670 hours of first-person video from 931 participants
                across 74 locations in 9 countries. This dataset enabled new
                benchmarks in episodic memory, hand-object interaction, and
                social understanding that were simply impossible before.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  The scale of egocentric data defines what embodied AI can
                  learn.
                </p>
                <p className="text-[var(--text-secondary)]">
                  <Citation href="https://link.springer.com/article/10.1007/s11263-021-01531-2">
                    EPIC-KITCHENS-100
                  </Citation>{" "}
                  showed that 100 hours of kitchen activities with dense
                  annotations enables action recognition, anticipation, and
                  object detection. But household robots need thousands of hours
                  across hundreds of environments.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The challenge is not technical. It is operational. Egocentric
                video requires trained collectors wearing cameras in real
                environments, following protocols, maintaining hardware, and
                ensuring consistent quality across months of collection. This is
                the infrastructure we provide.
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
              Our Collection Pipeline
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Protocol Design",
                  description:
                    "We work with your team to define what activities to capture, in which environments, with what metadata. This includes camera specifications, frame rates, sensor requirements, and annotation schemas.",
                  icon: Video,
                },
                {
                  step: "02",
                  title: "Collector Training",
                  description:
                    "Our collectors are trained on your specific protocols. This includes hardware setup, calibration procedures, activity guidelines, and quality checkpoints. We ensure consistency across all collectors in your project.",
                  icon: Users,
                },
                {
                  step: "03",
                  title: "Distributed Collection",
                  description:
                    "Collectors capture video across target environments: homes, offices, warehouses, outdoor spaces. We manage hardware logistics, daily uploads, and real-time quality monitoring.",
                  icon: Globe,
                },
                {
                  step: "04",
                  title: "Processing & Annotation",
                  description:
                    "Raw footage undergoes privacy filtering, temporal segmentation, and annotation. We deliver data in your preferred format with full metadata: timestamps, camera calibration, IMU readings, and activity labels.",
                  icon: Eye,
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
              Capture Parameters
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Our egocentric video collection supports the full range of
              specifications required by state-of-the-art embodied AI research.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Video Resolution",
                  specs: [
                    "1080p @ 30/60fps standard",
                    "4K @ 30fps available",
                    "Wide-angle (120-170 FOV)",
                    "Configurable aspect ratios",
                  ],
                },
                {
                  title: "Sensor Fusion",
                  specs: [
                    "6-DOF IMU (accelerometer + gyro)",
                    "GPS/location metadata",
                    "Eye tracking (select hardware)",
                    "Depth sensing (stereo pairs)",
                  ],
                },
                {
                  title: "Audio Capture",
                  specs: [
                    "Synchronized audio tracks",
                    "Multi-microphone arrays",
                    "Ambient + directional",
                    "Automatic speech detection",
                  ],
                },
                {
                  title: "Temporal Metadata",
                  specs: [
                    "Frame-accurate timestamps",
                    "NTP-synchronized clocks",
                    "Activity segment boundaries",
                    "Action-level annotations",
                  ],
                },
                {
                  title: "Calibration Data",
                  specs: [
                    "Intrinsic camera parameters",
                    "Extrinsic mount positioning",
                    "Distortion coefficients",
                    "Per-session calibration",
                  ],
                },
                {
                  title: "Delivery Formats",
                  specs: [
                    "MP4/H.264/H.265 video",
                    "JSON/COCO annotations",
                    "Parquet metadata tables",
                    "Custom schema support",
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
              Applications for Egocentric Video Data
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              First-person video unlocks capabilities that third-person data
              cannot provide.
            </p>

            <div className="space-y-8">
              {/* Robotics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Robotics & Manipulation
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Teaching robots to interact with the physical world
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Robotic manipulation requires understanding how humans grasp
                    objects, navigate spaces, and sequence multi-step tasks. The{" "}
                    <Citation href="https://robotics-transformer-x.github.io/">
                      Open X-Embodiment consortium
                    </Citation>{" "}
                    demonstrated that training on diverse human demonstration
                    data enables robots to generalize to new objects and
                    environments.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Egocentric video provides the natural viewpoint for
                    imitation learning: the robot learns from seeing exactly
                    what a human sees while performing tasks. This is why
                    projects like DROID collect thousands of manipulation
                    trajectories with wrist-mounted and head-mounted cameras.
                  </p>
                </div>
              </motion.div>

              {/* Autonomous Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Autonomous Navigation
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Indoor and outdoor wayfinding systems
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    Navigation AI needs to understand how humans move through
                    spaces: avoiding obstacles, following social conventions,
                    reading environmental cues. This requires massive amounts of
                    walking data across diverse environments.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Egocentric video captures the continuous decision-making of
                    navigation: where to look, how to adjust path, when to
                    pause. Combined with IMU data, this enables training systems
                    that navigate like humans do, whether for delivery robots,
                    assistive devices, or AR navigation aids.
                  </p>
                </div>
              </motion.div>

              {/* AR/VR Training */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Glasses className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">AR/VR Systems</h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Context-aware augmented reality and virtual environments
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-[var(--text-secondary)] mb-4">
                    AR glasses need to understand what the user is looking at,
                    what they are doing, and what information would be helpful.
                    This requires egocentric video paired with eye tracking and
                    activity recognition.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    The{" "}
                    <Citation href="https://ego-exo4d-data.org/">
                      Ego-Exo4D dataset
                    </Citation>{" "}
                    specifically addresses this by pairing egocentric video with
                    third-person views of the same activities, enabling systems
                    to understand both the user&apos;s perspective and the
                    broader context. This is essential for AR assistants that
                    can coach users through procedural tasks.
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
                  slug: "egocentric-video-collection",
                  headlineStat: "1,000+",
                  headlineStatLabel: "Hours of egocentric video collected",
                  title: "Egocentric Video Data Collection for Robotics and World Modeling",
                  teaser: "1,000+ hours of geographically diverse, research-grade egocentric video delivered under aggressive timelines — platform launched in days, full delivery in weeks.",
                }}
              />
              <CaseStudyCallout
                index={1}
                caseStudy={{
                  slug: "workplace-egocentric-data",
                  headlineStat: "Global pilot",
                  headlineStatLabel: "Workplace egocentric capture validated",
                  title: "Workplace Egocentric Video Data for General-Purpose Robotics",
                  teaser: "Piloted first-person video capture inside active workplaces globally — validating that real businesses can serve as a scalable, cost-efficient source of robotics training data.",
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
              Build the Dataset Your Embodied AI Needs
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Egocentric video is the foundation of next-generation robotics,
              AR/VR, and autonomous systems.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us what activities, environments, and scale you need.
              We&apos;ll design a collection pipeline that delivers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss Your Project <ArrowRight className="w-4 h-4" />
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
              href="/pillars/acquire/synthetic-data"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                ACQUIRE
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Synthetic Data Generation
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                When real data is scarce or expensive
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
                Copyright-safe training data
              </p>
            </Link>
            <Link
              href="/pillars/enrich"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                ENRICH
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Video Annotation
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Frame-level labeling at scale
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
