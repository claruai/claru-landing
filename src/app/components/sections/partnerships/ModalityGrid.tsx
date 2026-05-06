"use client";

import { motion } from "framer-motion";

const MODALITIES = [
  {
    code: "01",
    title: "Hands-on work in real environments",
    description:
      "Kitchens, workshops, salons, mechanic bays, packaging lines, farms, retail floors. POV, fixed-camera, or smart-glasses. Hands in frame. Long takes.",
    examples: [
      "POV cooking, prep, plating",
      "Workshop, trades, mechanic, repair",
      "Packaging, fulfillment, manufacturing line",
      "Farm work, harvest, livestock",
    ],
  },
  {
    code: "02",
    title: "Footage you already have — or footage we'll capture for you",
    description:
      "If you already record for QA, training, or security, we license the archive. If you don't, we ship the rigs and pay you per hour. Months of footage = days of revenue.",
    examples: [
      "Security / QA / training archives",
      "POV smart-glasses creators with reels",
      "Drone, dash, body-cam, fixed-mount footage",
      "No cameras yet? We send them.",
    ],
  },
  {
    code: "03",
    title: "Capture teams + creators",
    description:
      "Active shooters with rigs, drones, smart-glasses, action-sports archives. We pay per hour of usable raw.",
    examples: [
      "Per-hour capture commissions",
      "Action sports, action POV",
      "Regional collection partners",
      "Smart-glasses + body-mount creators",
    ],
  },
  {
    code: "04",
    title: "Robotics + manipulation",
    description:
      "Teleop, exoskeleton, multi-camera + depth + IMU. For partners with engineering teams.",
    examples: [
      "VLA pretraining data",
      "Teleoperation demonstrations",
      "Exoskeleton + glove capture",
      "Multi-camera + depth + IMU rigs",
    ],
  },
];

export default function ModalityGrid() {
  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)]">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent-primary)] mb-4">
              {"// 01"}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              If your business looks like this, labs want it.
            </h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              We pay for footage of real work in real environments. Below is
              what&apos;s selling now.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {MODALITIES.map((mod, i) => (
              <motion.div
                key={mod.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card group hover:border-[var(--accent-primary)]/40 transition-colors"
              >
                <div className="font-mono text-xs text-[var(--accent-primary)] mb-3">
                  {`// ${mod.code}`}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {mod.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                  {mod.description}
                </p>
                <ul className="space-y-2">
                  {mod.examples.map((ex) => (
                    <li
                      key={ex}
                      className="font-mono text-xs text-[var(--text-muted)] flex items-start gap-2"
                    >
                      <span className="text-[var(--accent-primary)]/40 mt-0.5">›</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
