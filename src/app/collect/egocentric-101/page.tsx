"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/app/components/ui/Logo";

/**
 * Egocentric Capture 101 — an English-language explainer that teaches what
 * first-person ("egocentric") video capture is, why AI labs pay for it, and
 * what good capture looks like, then hands off to the live household-capture
 * project page (`/br/collect/captura-domestica`).
 *
 * Deliberately educational, not a signup funnel: there's no form and no app
 * download/invite-code here. The single conversion action is "start the
 * project", which links to the project LP where the actual recruiting lives.
 */

// The project this 101 leads into. Kept as a const so every CTA points at one place.
const PROJECT_URL = "/br/collect/captura-domestica";

// Real egocentric clips from the Claru dataset catalog. clip_1 is a generic
// first-person walking POV (used to *define* egocentric); clip_2–4 are the
// three household task buckets this project actually collects.
const POV_CLIP = {
  src: "/videos/catalog/egocentric/clip_1.mp4",
  poster: "/videos/catalog/egocentric/clip_1-poster.jpg",
  label: "First-person POV",
};

const TASK_CLIPS = [
  {
    src: "/videos/catalog/egocentric/clip_2.mp4",
    poster: "/videos/catalog/egocentric/clip_2-poster.jpg",
    label: "Dishes",
    note: "Kitchen tidy-up",
  },
  {
    src: "/videos/catalog/egocentric/clip_3.mp4",
    poster: "/videos/catalog/egocentric/clip_3-poster.jpg",
    label: "Folding laundry",
    note: "Laundry tasks",
  },
  {
    src: "/videos/catalog/egocentric/clip_4.mp4",
    poster: "/videos/catalog/egocentric/clip_4-poster.jpg",
    label: "Mopping",
    note: "Household tasks",
  },
] as const;

export default function EgocentricOneOhOnePage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Minimal top bar — reads like a guide, not a marketing site. */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" aria-label="Claru home" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <Link
            href={PROJECT_URL}
            data-testid="cta-project-topbar"
            className="text-xs font-mono tracking-wide px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: "rgba(146, 176, 144, 0.12)",
              color: "var(--accent-primary)",
              border: "1px solid rgba(146, 176, 144, 0.3)",
            }}
          >
            View the project →
          </Link>
        </div>
      </header>

      <SectionNav />

      {/* HERO */}
      <section className="px-5 sm:px-8 pt-12 sm:pt-20 pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-mono"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.75)",
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
              Capture guide · 4 min read
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-white"
            >
              Egocentric capture,{" "}
              <span style={{ color: "var(--accent-primary)" }}>explained.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl"
            >
              &ldquo;Egocentric&rdquo; just means filming from your own point of
              view: the world as your eyes see it, hands and all. It&apos;s the
              exact footage AI labs need to teach robots how to do everyday
              tasks. Here&apos;s the short version of what it is, why it pays,
              and how to film it right.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
            >
              <Link
                href={PROJECT_URL}
                data-testid="cta-project-hero"
                className="px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:opacity-90 inline-flex items-center justify-center"
                style={{
                  background: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                  boxShadow: "0 8px 40px rgba(146, 176, 144, 0.45)",
                }}
              >
                Start the household project →
              </Link>
              <a
                href="#what"
                className="px-7 py-4 rounded-full font-medium text-sm text-white/80 border border-white/15 hover:border-white/30 hover:text-white transition-all inline-flex items-center justify-center"
              >
                What is egocentric capture?
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-10 pt-6 border-t border-white/[0.06]"
            >
              <p className="text-xs sm:text-sm font-mono text-white/55 leading-relaxed">
                0.5x wide · Both hands in frame · Landscape 1080p / 30fps
              </p>
              <p className="mt-3 text-xs text-white/40">
                A{" "}
                <a
                  href="https://reka.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white/65 transition-colors"
                >
                  Reka AI
                </a>{" "}
                company. Backed by NVIDIA.
              </p>
            </motion.div>
          </div>

          {/* Hero mosaic — one generic POV clip + three real household tasks. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <ClipTile clip={POV_CLIP} delay={0} />
              {TASK_CLIPS.map((clip, i) => (
                <ClipTile key={clip.src} clip={clip} delay={(i + 1) * 0.08} />
              ))}
            </div>
            <div className="mt-3 flex justify-center">
              <span
                className="inline-block px-3 py-1.5 rounded-full font-mono text-[10px] sm:text-xs backdrop-blur"
                style={{
                  background: "rgba(10, 9, 8, 0.85)",
                  border: "1px solid rgba(146, 176, 144, 0.35)",
                  color: "var(--accent-primary)",
                }}
              >
                Real clips from the Claru catalog
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS EGOCENTRIC CAPTURE */}
      <section
        id="what"
        className="px-5 sm:px-8 py-16 border-t border-white/[0.05] scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start">
          <div>
            <SectionLabel>The basics</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              First person, not third person
            </h2>
            <p className="mt-4 text-white/65 leading-relaxed">
              Most video is shot <em>about</em> someone. The camera points at a
              person across the room. Egocentric video is shot{" "}
              <em>as</em> someone. The camera sits at your eye level (on a head
              or chest mount) and looks out at whatever you&apos;re doing, so
              your own hands move through the frame.
            </p>
            <p className="mt-4 text-white/65 leading-relaxed">
              That tiny difference is everything. A robot learning to load a
              dishwasher needs to see the plates, the rack, and a pair of hands{" "}
              <em>from the position it will actually work from</em>, not from a
              tripod in the corner. Your point of view is the training signal.
            </p>
          </div>

          {/* Third-person vs egocentric contrast */}
          <div className="grid sm:grid-cols-2 gap-4">
            <ContrastCard
              tone="muted"
              tag="Third person"
              title="Camera watches you"
              points={[
                "Phone on a tripod across the room",
                "You're in the shot, head to toe",
                "Hands are small and far away",
                "Not what we collect",
              ]}
            />
            <ContrastCard
              tone="accent"
              tag="Egocentric"
              title="Camera is your eyes"
              points={[
                "Phone mounted on your head or chest",
                "You never appear, only your hands do",
                "Hands fill the lower frame, up close",
                "Exactly what we collect",
              ]}
            />
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section
        id="why"
        className="px-5 sm:px-8 py-16 border-t border-white/[0.05] scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Why labs pay for it</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            You&apos;re teaching robots to do chores
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl">
            Household robots can&apos;t learn folding or wiping from text. They
            learn by watching thousands of real people do the task from a
            first-person view. There&apos;s almost none of this footage in the
            world, which is why it&apos;s worth paying for.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-5">
            <WhyCard
              n="01"
              title="The world isn't filmed this way"
              body="YouTube is full of third-person video. Almost nobody films chores from their own eyes with their hands in frame. The data simply doesn't exist yet."
            />
            <WhyCard
              n="02"
              title="Hands are the lesson"
              body="A manipulation model learns from how your hands grip, lift, place, and adjust. That's why both hands need to stay in frame. They're the part the robot is copying."
            />
            <WhyCard
              n="03"
              title="Everyday tasks are the hard part"
              body="Folding a shirt or wiping a counter is trivial for you and brutal for a robot. Ordinary chores are exactly the frontier these models are trying to cross."
            />
          </div>
        </div>
      </section>

      {/* WHAT GOOD LOOKS LIKE */}
      <section
        id="examples"
        className="px-5 sm:px-8 py-16 border-t border-white/[0.05] scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>What good looks like</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Three real clips, and why they work
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl">
            These are actual egocentric clips from the Claru catalog. Notice
            what they have in common: shot at 0.5x so the whole task is in view,
            landscape, steady, with hands doing the work up close.
          </p>

          <AnnotatedFrame />

          <p className="mt-12 text-xs font-mono uppercase tracking-[0.15em] text-white/45">
            Three more, one per task type
          </p>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {TASK_CLIPS.map((clip) => (
              <ShowcaseClip key={clip.src} clip={clip} />
            ))}
          </div>

          <div
            className="mt-6 rounded-xl p-5 sm:p-6"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-[0.15em] text-white/55">
                Every good clip checks these boxes:
              </span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-white/75">
              <CheckLine text="Filmed at 0.5x (or 0.6x) ultrawide" />
              <CheckLine text="Both hands visible 90% of the time" />
              <CheckLine text="Landscape, 1080p, 30fps" />
              <CheckLine text="One task per clip, 2–30 minutes long" />
            </ul>
          </div>
        </div>
      </section>

      {/* SET UP YOUR SHOT */}
      <section
        id="setup"
        className="px-5 sm:px-8 py-16 border-t border-white/[0.05] scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Set up your shot</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Mount the phone, then find 0.5x
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl">
            Two things stand between you and a clean clip: where the phone sits,
            and which lens it&apos;s using. Sort both once and the rest is just
            doing the chore.
          </p>

          {/* Mount */}
          <h3 className="mt-10 text-sm font-mono uppercase tracking-[0.15em] text-white/55">
            1 · Go hands-free
          </h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <MountCard
              variant="head"
              title="Head mount: phone at eye level"
              body="Closest to true first-person. Best when you look down at your hands, like dishes or folding. A $10–$20 clip or strap holds the phone steady on your forehead or a cap."
            />
            <MountCard
              variant="chest"
              title="Chest mount: phone on your torso"
              body="Comfier for long sessions and walking around. The angle sits a little lower but still catches both hands. A simple chest harness does the job."
            />
          </div>
          <p className="mt-4 text-sm text-white/50">
            Either works. The non-negotiable is hands-free and steady. Hold the
            phone yourself and one hand is always missing from the frame.
          </p>

          {/* 0.5x */}
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <h3 className="text-sm font-mono uppercase tracking-[0.15em] text-white/55">
              2 · Switch to the ultrawide lens
            </h3>
            <div className="flex items-center gap-3">
              <ZoomPill />
              <span className="text-xs text-white/45 font-mono">
                tap .5 before you start
              </span>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            <PhoneZoomCard
              phone="iPhone (11+)"
              zoomLabel="0.5x"
              steps="Open Camera. Just above the shutter, tap the .5 button so it locks to the ultrawide lens."
            />
            <PhoneZoomCard
              phone="Pixel (6+)"
              zoomLabel="0.5x"
              steps="Open Camera, switch to Video, then tap 0.5x on the zoom row near the shutter."
            />
            <PhoneZoomCard
              phone="Galaxy (S21+)"
              zoomLabel="0.6x"
              steps="Open Camera and tap the 0.6x (tree icon) zoom option to drop onto the ultrawide lens."
            />
          </div>
        </div>
      </section>

      {/* THE FOUR RULES */}
      <section
        id="rules"
        className="px-5 sm:px-8 py-16 border-t border-white/[0.05] scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>The four rules</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Get these right and your clip passes
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl">
            The whole spec comes down to four things. Memorize them and you
            never have to guess whether a recording is usable.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <Rule
              k="01"
              title="Clip length"
              value="2–30 minutes"
              body="One task per clip. Long enough to capture the whole activity, short enough to stay focused. Don't stitch unrelated chores together."
            />
            <Rule
              k="02"
              title="Hands visibility"
              value="Both hands, 90% of the time"
              body="Your hands are the lesson. Keep both of them inside the frame for almost the entire clip. If a hand drops out of view, that stretch of footage is wasted."
            />
            <Rule
              k="03"
              title="Video format"
              value="Landscape · 1080p · 30fps"
              body="Phone held sideways (landscape), recording at 1080p and 30 frames per second. Most phones default to this. Just double-check it in your camera settings."
            />
            <Rule
              k="04"
              title="Camera zoom"
              value="0.5x or 0.6x ultrawide"
              body="Open the camera and tap 0.5x near the shutter. The wide angle keeps the whole task and both hands in frame from a head or chest mount."
            />
          </div>

          {/* Phone requirements callout */}
          <div
            className="mt-6 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex-shrink-0">
              <div className="text-xs font-mono uppercase tracking-[0.15em] text-white/55">
                Phone requirement
              </div>
              <p className="mt-1.5 text-sm text-white/65 max-w-xs leading-relaxed">
                You need a phone with a true 0.5x ultrawide lens. These models
                qualify:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <PhoneChip text="iPhone 11 or newer" />
              <PhoneChip text="Google Pixel 6 or newer" />
              <PhoneChip text="Samsung Galaxy S21 or newer" />
            </div>
          </div>
        </div>
      </section>

      {/* DO THIS / NOT THIS */}
      <section className="px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Do this, not that</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            The same scene, right and wrong
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl">
            Most rejected clips fail for the same handful of reasons. Here&apos;s
            what passes versus what gets sent back.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <DoCard />
            <DontCard />
          </div>

          {/* Pre-record checklist */}
          <div
            className="mt-6 rounded-xl p-5 sm:p-6"
            style={{
              background: "rgba(146, 176, 144, 0.05)",
              border: "1px solid rgba(146, 176, 144, 0.25)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-[0.15em] text-white/55">
                Run this in your head before you hit record:
              </span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-white/80">
              <CheckLine text="Phone sideways (landscape)" />
              <CheckLine text="0.5x (or 0.6x) selected" />
              <CheckLine text="Mount stable at eye or chest level" />
              <CheckLine text="Both hands will stay in frame" />
              <CheckLine text="Room is bright enough" />
              <CheckLine text="One task, 2–30 minutes" />
            </ul>
          </div>
        </div>
      </section>

      {/* THE PROJECT — CATEGORIES */}
      <section
        id="project"
        className="px-5 sm:px-8 py-16 border-t border-white/[0.05] scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>The project</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Household capture: what to film
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl">
            Get paid to record yourself doing everyday residential activities:
            laundry, tidying the kitchen, organizing a room, and more.
          </p>

          <LiveProjectCard />

          <h3 className="mt-12 text-sm font-mono uppercase tracking-[0.15em] text-white/55">
            Pick a category to film
          </h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <Category
              title="Laundry tasks"
              examples="Folding clothes, sorting laundry, loading the washer or dryer."
            />
            <Category
              title="Kitchen tidy-up (not cooking)"
              examples="Wiping counters, washing dishes, loading/unloading the dishwasher, putting dishes away, organizing the pantry."
            />
            <Category
              title="Organize a single room"
              examples="Making the bed, bedroom organization, closet organization, shelf organization."
            />
            <Category
              title="Other household tasks"
              examples="Vacuuming, sweeping, mopping, cleaning mirrors, and similar chores."
            />
          </div>
        </div>
      </section>

      {/* SPEC SUMMARY */}
      <section className="px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-10">
          <div>
            <SectionLabel>Quick reference</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              The whole spec on one card
            </h2>
            <p className="mt-3 text-white/60">
              Screenshot this. It&apos;s everything you need to remember before
              you hit record.
            </p>
          </div>

          <div
            className="rounded-xl p-6 font-mono text-sm"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <SpecRow k="CAMERA" v="0.5x or 0.6x ultrawide, landscape" />
            <SpecRow k="QUALITY" v="1080p resolution, 30fps" />
            <SpecRow k="MOUNT" v="Head-mounted or chest-mounted, stable" />
            <SpecRow k="FRAMING" v="Both hands visible in 90% of frames" />
            <SpecRow k="LENGTH" v="2 to 30 minutes, one task per clip" />
            <SpecRow
              k="PHONE"
              v="iPhone 11+, Pixel 6+, or Galaxy S21+"
              last
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Quick answers
          </h2>

          <div className="mt-10 space-y-3">
            <FaqItem
              q="Why does it have to be 0.5x?"
              a="The 0.5x ultrawide lens captures the whole task and both of your hands from a head or chest mount. At 1x the frame is too tight, so hands and objects keep dropping out of view, which makes the clip unusable for training."
            />
            <FaqItem
              q="Why both hands the whole time?"
              a="The model is learning from how your hands move: how you grip, lift, fold, and place things. If a hand leaves the frame, that part of the demonstration is lost. Keeping both hands in view for ~90% of the clip is the single most important rule."
            />
            <FaqItem
              q="Does my face appear in the video?"
              a="No. The camera points outward from your head or chest, so you only ever film your hands and the task in front of you. These clips train manipulation and activity models, not face recognition."
            />
            <FaqItem
              q={
                <>
                  How do I actually get started and get paid?
                </>
              }
              a={
                <>
                  Head to the household capture project page. It walks you
                  through signing up, recording your first clip, and getting
                  paid in USD.{" "}
                  <Link
                    href={PROJECT_URL}
                    className="underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Open the project →
                  </Link>
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Now you know egocentric capture
          </h2>
          <p className="mt-4 text-white/65">
            You&apos;ve got the what, the why, and the how. The household
            project is where you put it to work and actually get paid.
          </p>
          <Link
            href={PROJECT_URL}
            data-testid="cta-project-final"
            className="mt-8 inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:opacity-90"
            style={{
              background: "var(--accent-primary)",
              color: "var(--bg-primary)",
              boxShadow: "0 8px 40px rgba(146, 176, 144, 0.45)",
            }}
          >
            Go to the household project →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 sm:px-8 py-10 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/45">
          <div>
            A{" "}
            <a
              href="https://reka.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white/70 transition-colors"
            >
              Reka AI
            </a>{" "}
            company · Backed by NVIDIA
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="hover:text-white/70 transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- presentational helpers ---

// Sticky in-page nav. Anchors live on the section tags below (each carries a
// matching id + scroll-mt so the jump clears this bar).
const NAV_ITEMS = [
  { href: "#what", label: "Basics" },
  { href: "#why", label: "Why" },
  { href: "#examples", label: "Examples" },
  { href: "#setup", label: "Setup" },
  { href: "#rules", label: "Rules" },
  { href: "#project", label: "Project" },
] as const;

function SectionNav() {
  return (
    <nav
      className="sticky top-0 z-30 backdrop-blur border-b border-white/[0.06]"
      style={{ background: "rgba(10, 9, 8, 0.82)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <ul className="flex flex-wrap gap-1 py-2.5 text-xs font-mono">
          {NAV_ITEMS.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="inline-block whitespace-nowrap px-3 py-1.5 rounded-full text-white/55 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// A real catalog frame with overlaid callouts — the single most useful teaching
// asset on the page. Uses the static poster (not the video) so labels stay put.
function AnnotatedFrame() {
  return (
    <figure className="mt-8">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/videos/catalog/egocentric/clip_2-poster.jpg"
          alt="A good egocentric frame: washing dishes at 0.5x, landscape, with a hand working in view"
          className="w-full aspect-video object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,9,8,0.55), rgba(10,9,8,0.05) 45%, rgba(10,9,8,0.55))",
          }}
        />
        <Callout className="top-3 left-3" text="0.5x ultrawide" />
        <Callout className="top-3 right-3" text="Landscape (16:9)" />
        <Callout className="bottom-3 left-3" text="Hand in frame, up close" />
        <Callout className="bottom-3 right-3" text="Task fills the view" />
      </div>
      <figcaption className="mt-2 text-center text-[11px] font-mono text-white/40">
        Real catalog frame, annotated
      </figcaption>
    </figure>
  );
}

function Callout({ className, text }: { className: string; text: string }) {
  return (
    <span
      className={`absolute inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-[11px] backdrop-blur ${className}`}
      style={{
        background: "rgba(10, 9, 8, 0.78)",
        border: "1px solid rgba(146, 176, 144, 0.4)",
        color: "var(--accent-primary)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
      {text}
    </span>
  );
}

// Schematic SVG: phone position (eye level vs chest) is the only thing that
// changes between variants. The label carries the meaning; the diagram anchors it.
function MountDiagram({ variant }: { variant: "head" | "chest" }) {
  const head = variant === "head";
  // Phone + view-cone origin moves down for the chest mount.
  const phone = head ? { x: 80, y: 36 } : { x: 74, y: 84 };
  const coneFrom = head ? { x: 92, y: 46 } : { x: 96, y: 90 };
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-full h-auto"
      role="img"
      aria-label={head ? "Head-mounted phone at eye level" : "Chest-mounted phone at torso level"}
    >
      {/* body */}
      <circle cx="60" cy="42" r="20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <path
        d="M40 122 Q40 80 60 78 Q80 80 80 122"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* view cone */}
      <path
        d={`M${coneFrom.x} ${coneFrom.y} L168 104 L120 134 Z`}
        fill="rgba(146,176,144,0.08)"
        stroke="rgba(146,176,144,0.4)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      {/* phone */}
      <rect
        x={phone.x}
        y={phone.y}
        width={head ? 9 : 22}
        height={head ? 20 : 11}
        rx="2.5"
        fill="var(--accent-primary)"
      />
      {/* hands zone */}
      <rect x="116" y="106" width="62" height="30" rx="7" fill="rgba(146,176,144,0.1)" stroke="rgba(146,176,144,0.45)" strokeWidth="1.5" />
      <text x="147" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--accent-primary)">
        HANDS
      </text>
    </svg>
  );
}

function MountCard({
  variant,
  title,
  body,
}: {
  variant: "head" | "chest";
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--bg-secondary)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="rounded-lg p-2 mb-4" style={{ background: "rgba(0,0,0,0.25)" }}>
        <MountDiagram variant={variant} />
      </div>
      <h3 className="text-white font-medium text-[0.95rem]">{title}</h3>
      <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{body}</p>
    </div>
  );
}

// Mock of the in-camera zoom selector with 0.5x active.
function ZoomPill() {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-1"
      style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-semibold"
        style={{ background: "var(--accent-primary)", color: "var(--bg-primary)" }}
      >
        .5
      </span>
      <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono text-white/55">
        1&times;
      </span>
      <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono text-white/35">
        2
      </span>
    </div>
  );
}

function PhoneZoomCard({
  phone,
  steps,
  zoomLabel,
}: {
  phone: string;
  steps: string;
  zoomLabel: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--bg-secondary)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-white font-medium text-[0.95rem]">{phone}</h3>
        <span
          className="font-mono text-[11px] px-2 py-0.5 rounded-full"
          style={{ background: "rgba(146,176,144,0.12)", color: "var(--accent-primary)", border: "1px solid rgba(146,176,144,0.3)" }}
        >
          {zoomLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/60 leading-relaxed">{steps}</p>
    </div>
  );
}

function DoCard() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-secondary)", border: "1px solid rgba(146,176,144,0.35)" }}
    >
      <div className="relative aspect-video">
        <video
          src="/videos/catalog/egocentric/clip_2.mp4"
          poster="/videos/catalog/egocentric/clip_2-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span
          className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px]"
          style={{ background: "rgba(10,9,8,0.8)", color: "var(--accent-primary)", border: "1px solid rgba(146,176,144,0.4)" }}
        >
          ✓ Do this
        </span>
      </div>
      <ul className="px-5 py-4 space-y-2 text-sm text-white/75">
        <CheckLine text="Landscape, held steady" />
        <CheckLine text="0.5x ultrawide selected" />
        <CheckLine text="Both hands working in frame" />
        <CheckLine text="Bright enough to see detail" />
      </ul>
    </div>
  );
}

const BAD = "rgb(214, 102, 102)";

function DontCard() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-secondary)", border: `1px solid ${BAD}55` }}
    >
      <div className="relative aspect-video flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
        {/* Same real frame, forced into a dark portrait crop to show the wrong way. */}
        <div className="relative h-full aspect-[3/4] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/videos/catalog/egocentric/bad-example-poster.jpg"
            alt="The wrong way: vertical, dark, motion-blurred, hand out of frame"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.5)" }}
          />
        </div>
        <span
          className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px]"
          style={{ background: "rgba(10,9,8,0.8)", color: BAD, border: `1px solid ${BAD}66` }}
        >
          ✕ Avoid this
        </span>
      </div>
      <ul className="px-5 py-4 space-y-2 text-sm text-white/75">
        <XLine text="Portrait (vertical) video" />
        <XLine text="1× zoom, too tight, hands clip out" />
        <XLine text="Hands drifting out of frame" />
        <XLine text="Dark, blurry, or shaky footage" />
      </ul>
    </div>
  );
}

function XLine({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
        style={{ background: `${BAD}22`, border: `1px solid ${BAD}88` }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={BAD} strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </span>
      {text}
    </li>
  );
}

function ClipTile({
  clip,
  delay,
}: {
  clip: { src: string; label: string; poster: string };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="relative aspect-[4/3] rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "var(--bg-secondary)",
      }}
    >
      <video
        src={clip.src}
        poster={clip.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,9,8,0) 55%, rgba(10,9,8,0.85) 100%)",
        }}
      />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/85">
          {clip.label}
        </span>
        <span className="text-[10px] font-mono text-white/50">0.5x</span>
      </div>
    </motion.div>
  );
}

function ShowcaseClip({
  clip,
}: {
  clip: { src: string; label: string; poster: string; note: string };
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="relative aspect-[4/3]">
        <video
          src={clip.src}
          poster={clip.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,9,8,0) 60%, rgba(10,9,8,0.8) 100%)",
          }}
        />
        <span
          className="absolute top-2 left-2 inline-block px-2 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider"
          style={{
            background: "rgba(10, 9, 8, 0.8)",
            border: "1px solid rgba(146, 176, 144, 0.35)",
            color: "var(--accent-primary)",
          }}
        >
          {clip.note}
        </span>
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-white/85 font-medium">{clip.label}</span>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
          0.5x · hands in frame
        </span>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs font-mono uppercase tracking-[0.15em]"
      style={{ color: "rgba(255, 255, 255, 0.55)" }}
    >
      {children}
    </span>
  );
}

function CheckLine({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(146, 176, 144, 0.2)",
          border: "1px solid rgba(146, 176, 144, 0.5)",
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {text}
    </li>
  );
}

function ContrastCard({
  tone,
  tag,
  title,
  points,
}: {
  tone: "muted" | "accent";
  tag: string;
  title: string;
  points: string[];
}) {
  const accent = tone === "accent";
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: accent ? "rgba(146, 176, 144, 0.06)" : "var(--bg-secondary)",
        border: accent
          ? "1px solid rgba(146, 176, 144, 0.3)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="inline-block text-[10px] font-mono uppercase tracking-[0.15em]"
        style={{
          color: accent ? "var(--accent-primary)" : "rgba(255,255,255,0.45)",
        }}
      >
        {tag}
      </span>
      <h3 className="mt-2 text-white font-semibold text-[0.95rem]">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-white/60">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <span
              className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
              style={{
                background: accent
                  ? "var(--accent-primary)"
                  : "rgba(255,255,255,0.35)",
              }}
            />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhyCard({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="font-mono text-xs"
        style={{ color: "rgba(255, 255, 255, 0.55)" }}
      >
        {n}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/65 leading-relaxed">{body}</p>
    </div>
  );
}

function Rule({
  k,
  title,
  value,
  body,
}: {
  k: string;
  title: string;
  value: string;
  body: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-baseline gap-3">
        <span
          className="font-mono text-xs"
          style={{ color: "rgba(255, 255, 255, 0.55)" }}
        >
          {k}
        </span>
        <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
          {title}
        </span>
      </div>
      <p
        className="mt-3 text-lg font-semibold"
        style={{ color: "var(--accent-primary)" }}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-white/65 leading-relaxed">{body}</p>
    </div>
  );
}

function PhoneChip({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-full font-mono text-xs"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.8)",
      }}
    >
      {text}
    </span>
  );
}

// The live recruiting card — pay terms + head-mount reimbursement, links to
// the project page where signup actually happens.
function LiveProjectCard() {
  return (
    <div
      className="mt-8 rounded-2xl p-6 sm:p-8"
      style={{
        background: "rgba(146, 176, 144, 0.06)",
        border: "1px solid rgba(146, 176, 144, 0.3)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ background: "var(--accent-primary)" }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: "var(--accent-primary)" }}
          />
        </span>
        <span
          className="text-xs font-mono uppercase tracking-[0.15em]"
          style={{ color: "var(--accent-primary)" }}
        >
          Active project · now recruiting
        </span>
      </div>

      <h3 className="mt-3 text-2xl font-semibold text-white">
        Household Capture
      </h3>
      <p className="mt-1.5 text-sm text-white/60 max-w-lg">
        Our live collection project. Film the tasks below and get paid in USD
        for every approved clip.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
        <Stat big="$6" unit="/ hour" />
        <Stat big="10 hrs" unit="/ week min" />
        <Stat big="≈ $60" unit="/ week" />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          href={PROJECT_URL}
          data-testid="cta-project-card"
          className="px-7 py-3.5 rounded-full font-medium text-sm transition-all duration-300 hover:opacity-90 inline-flex items-center justify-center flex-shrink-0"
          style={{
            background: "var(--accent-primary)",
            color: "var(--bg-primary)",
            boxShadow: "0 8px 30px rgba(146, 176, 144, 0.35)",
          }}
        >
          Start the project →
        </Link>
        <p className="text-xs text-white/55 max-w-xs leading-relaxed">
          No head mount yet? Order one from Amazon (around $10–20) and we&apos;ll
          reimburse it once you&apos;re recording.
        </p>
      </div>
    </div>
  );
}

function Stat({ big, unit }: { big: string; unit: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="text-2xl font-semibold" style={{ color: "var(--accent-primary)" }}>
        {big}
      </div>
      <div className="mt-0.5 text-[11px] font-mono text-white/50 uppercase tracking-wider">
        {unit}
      </div>
    </div>
  );
}

function Category({ title, examples }: { title: string; examples: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(146, 176, 144, 0.15)" }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-medium text-[0.95rem] leading-snug">
            {title}
          </h3>
          <p className="mt-1.5 text-sm text-white/60 leading-relaxed">
            {examples}
          </p>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      className={`grid grid-cols-[110px_1fr] gap-3 py-3 ${
        last ? "" : "border-b border-white/[0.05]"
      }`}
    >
      <div className="text-white/40 uppercase tracking-wider text-[11px] pt-0.5">
        {k}
      </div>
      <div className="text-white/85 leading-relaxed">{v}</div>
    </div>
  );
}

function FaqItem({ q, a }: { q: React.ReactNode; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <span className="text-white font-medium text-[0.95rem] pr-4">{q}</span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform"
          style={{
            background: "rgba(255,255,255,0.04)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-white/70 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}
