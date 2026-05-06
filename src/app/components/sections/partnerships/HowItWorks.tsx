"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Step = {
  code: string;
  slug: string;
  title: string;
  body: string;
  meta: string;
  src: string;
  poster: string;
};

const STEPS: Step[] = [
  {
    code: "01",
    slug: "tell_us_business",
    title: "Tell us about your business.",
    body: "Submit the form. Describe what your team does, where you operate, and how many people. Takes 3 minutes. No deck required.",
    meta: "// form_submit",
    src: "/videos/howitworks/01_tell_us_business.mp4",
    poster: "/videos/howitworks/01_tell_us_business.jpg",
  },
  {
    code: "02",
    slug: "agree_earnings",
    title: "We agree on your earnings.",
    body: "30-min discovery call to scope the work, modality, and rate. We send a signed agreement before anything else moves.",
    meta: "// discovery_call",
    src: "/videos/howitworks/02_agree_earnings.mp4",
    poster: "/videos/howitworks/02_agree_earnings.jpg",
  },
  {
    code: "03",
    slug: "ship_cameras",
    title: "We ship the cameras.",
    body: "Lightweight headband action cams ship in a small box with cable, cleaning cloth, and a quick-start card. We set them up and walk your team through the rig.",
    meta: "// hardware_dispatch",
    src: "/videos/howitworks/03_ship_cameras.mp4",
    poster: "/videos/howitworks/03_ship_cameras.jpg",
  },
  {
    code: "04",
    slug: "you_capture",
    title: "You capture.",
    body: "Your team wears the rigs and does their normal work. No acting. No scripts. Cameras roll while you do what you already do.",
    meta: "// capture_active",
    src: "/videos/howitworks/04_you_capture.mp4",
    poster: "/videos/howitworks/04_you_capture.jpg",
  },
  {
    code: "05",
    slug: "you_upload",
    title: "You upload.",
    body: "Drag-and-drop in our secure mobile app or web portal. Automated review flags anything off-spec. Most partners upload straight from a phone.",
    meta: "// upload_review",
    src: "/videos/howitworks/05_you_upload.mp4",
    poster: "/videos/howitworks/05_you_upload.jpg",
  },
  {
    code: "06",
    slug: "get_paid",
    title: "You get paid.",
    body: "Net-15 on archive licenses. Weekly payouts on capture commissions. Direct deposit, ACH, or wire — your call.",
    meta: "// payout_clear",
    src: "/videos/howitworks/06_get_paid.mp4",
    poster: "/videos/howitworks/06_get_paid.jpg",
  },
];

function StepRow({ step, idx }: { step: Step; idx: number }) {
  const reversed = idx % 2 === 1;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tc, setTc] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setTc(v.currentTime);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const formatTC = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    const ff = Math.floor((s % 1) * 24).toString().padStart(2, "0");
    return `${mm}:${ss}:${ff}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center"
    >
      {/* VIDEO PANEL */}
      <div
        className={`relative overflow-hidden border border-[var(--border-subtle)] bg-black aspect-[16/10] ${
          reversed ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <video
          ref={videoRef}
          src={step.src}
          poster={step.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter:
              "saturate(0.75) contrast(1.05) brightness(0.92) hue-rotate(-3deg)",
          }}
        />

        {/* sage tint */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, rgba(146,176,144,0.06) 0%, rgba(10,9,8,0.40) 100%)",
          }}
        />

        {/* scanlines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* HUD: top-left tag */}
        <div className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85 flex items-center gap-2">
          <span className="text-[var(--accent-primary)]">{`// ${step.code}`}</span>
          <span>{step.slug}</span>
        </div>

        {/* HUD: top-right REC + TC */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75">
          <span className="flex items-center gap-1.5">
            <span
              className="block h-1.5 w-1.5 rounded-full bg-red-500"
              style={{ animation: "blinkRecHIW 1s steps(2, end) infinite" }}
            />
            REC
          </span>
          <span className="tabular-nums">{formatTC(tc)}</span>
        </div>

        {/* HUD: bottom-left meta */}
        <div className="absolute left-3 bottom-3 z-10 font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
          {step.meta}
        </div>

        {/* corner crosshairs */}
        {[
          "top-1.5 left-1.5",
          "top-1.5 right-1.5",
          "bottom-1.5 left-1.5",
          "bottom-1.5 right-1.5",
        ].map((pos, i) => (
          <span
            key={i}
            className={`pointer-events-none absolute ${pos} z-10 h-3 w-3 border-[var(--accent-primary)]/60`}
            style={{
              borderTopWidth: pos.includes("top") ? 1 : 0,
              borderBottomWidth: pos.includes("bottom") ? 1 : 0,
              borderLeftWidth: pos.includes("left") ? 1 : 0,
              borderRightWidth: pos.includes("right") ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* TEXT PANEL */}
      <div className={`flex flex-col gap-4 ${reversed ? "lg:order-1 lg:pr-6" : "lg:order-2 lg:pl-6"}`}>
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-5xl md:text-6xl font-bold text-[var(--accent-primary)]/40 tabular-nums leading-none">
            {step.code}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-primary)]/80">
            {step.meta}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          {step.title}
        </h3>

        <p className="text-base md:text-lg text-white/70 leading-relaxed">
          {step.body}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative py-20 md:py-32 border-t border-[var(--border-subtle)] overflow-hidden">
      {/* subtle ambient sage glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(146,176,144,0.035) 0%, rgba(146,176,144,0.01) 50%, transparent 90%)",
        }}
      />

      <div className="container relative">
        <div className="max-w-7xl mx-auto">
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent-primary)] mb-4">
              {"// 02 // how_it_works"}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Frictionless onboarding. We handle the hard parts.
            </h2>
            <p className="text-base md:text-lg text-white/65 max-w-2xl mx-auto">
              Most of our partners have never sold data before. Six steps from
              form to first payout — we walk you through every one.
            </p>
          </motion.div>

          {/* alternating two-panel rows */}
          <div className="flex flex-col gap-16 md:gap-24">
            {STEPS.map((step, i) => (
              <StepRow key={step.code} step={step} idx={i} />
            ))}
          </div>

          {/* reassurance strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 md:mt-28 relative border border-[var(--accent-primary)]/30 bg-[var(--bg-secondary)]/40 backdrop-blur-sm p-6 md:p-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(146,176,144,0.06) 0%, rgba(146,176,144,0.02) 50%, transparent 100%)",
            }}
          >
            {/* corner crosshairs */}
            {[
              "top-1.5 left-1.5",
              "top-1.5 right-1.5",
              "bottom-1.5 left-1.5",
              "bottom-1.5 right-1.5",
            ].map((pos, i) => (
              <span
                key={i}
                className={`pointer-events-none absolute ${pos} h-3 w-3 border-[var(--accent-primary)]`}
                style={{
                  borderTopWidth: pos.includes("top") ? 1 : 0,
                  borderBottomWidth: pos.includes("bottom") ? 1 : 0,
                  borderLeftWidth: pos.includes("left") ? 1 : 0,
                  borderRightWidth: pos.includes("right") ? 1 : 0,
                }}
              />
            ))}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="block h-2 w-2 rounded-full bg-[var(--accent-primary)]"
                  style={{
                    animation: "pulseDotHIW 1.6s ease-in-out infinite",
                  }}
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent-primary)]">
                  Partner success · online
                </span>
              </div>
              <p className="text-sm md:text-base text-white/80 leading-relaxed flex-1 md:max-w-3xl">
                A dedicated partner success rep walks you through setup, runs a
                pilot capture, and is on call for your first 30 days. You&apos;re
                not alone in this.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blinkRecHIW {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.2; }
        }
        @keyframes pulseDotHIW {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </section>
  );
}
