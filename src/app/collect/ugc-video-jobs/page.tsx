"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/app/components/ui/Logo";
import { trackRedditEvent, getCtaUrl } from "@/lib/tracking/reddit";

/**
 * UGC video jobs landing page — US + Canada, household activity capture.
 * Slug targets the "ugc jobs" keyword (~2,900/mo, LOW competition).
 *
 * This page is a pure top-of-funnel LP. The actual signup form lives at
 * `app.claru.ai/signup` (different subdomain → cookies do not carry, so
 * attribution is forwarded through the CTA link's query string).
 *
 * Events fired here:
 *   - Reddit Pixel `PageVisit` (auto, from layout.tsx)
 *   - Reddit Pixel `ViewContent` on LP mount (retargeting signal)
 *   - Reddit Pixel `Lead` on CTA click (intent signal)
 * The actual `SignUp` / conversion events fire from app.claru.ai.
 */

const APP_SIGNUP_URL = "https://app.claru.ai/signup";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

// Real egocentric capture clips from the Claru dataset catalog. These sit in
// the Claru catalog already; shipping them on this LP gives applicants a
// direct preview of the exact framing we'll ask them to match.
const SAMPLE_CLIPS = [
  {
    src: "/videos/catalog/egocentric/clip_1.mp4",
    poster: "/videos/catalog/egocentric/clip_1-poster.jpg",
    label: "Cooking",
  },
  {
    src: "/videos/catalog/egocentric/clip_2.mp4",
    poster: "/videos/catalog/egocentric/clip_2-poster.jpg",
    label: "Dishes",
  },
  {
    src: "/videos/catalog/egocentric/clip_3.mp4",
    poster: "/videos/catalog/egocentric/clip_3-poster.jpg",
    label: "Folding",
  },
  {
    src: "/videos/catalog/egocentric/clip_4.mp4",
    poster: "/videos/catalog/egocentric/clip_4-poster.jpg",
    label: "Cleaning",
  },
] as const;

function PageInner() {
  const searchParams = useSearchParams();

  const utm = useMemo(() => {
    const out: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = searchParams.get(k);
      if (v) out[k] = v;
    });
    return out;
  }, [searchParams]);

  // Fire ViewContent once on mount for audience retargeting.
  useEffect(() => {
    trackRedditEvent("ViewContent", undefined, {
      content_name: "ugc-video-jobs-lp",
      ...utm,
    });
  }, [utm]);

  const ctaHref = useMemo(
    () => getCtaUrl(APP_SIGNUP_URL, searchParams.toString()),
    [searchParams],
  );

  const onCtaClick = useCallback(() => {
    trackRedditEvent("Lead", undefined, {
      content_name: "ugc-video-jobs-lp",
      ...utm,
    });
  }, [utm]);

  return (
    <main
      className="min-h-screen"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Simple top bar. Deliberately minimal so the page reads like a real offer, not a marketing site. */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" aria-label="Claru home" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <a
            href={ctaHref}
            onClick={onCtaClick}
            data-testid="cta-apply-topbar"
            className="text-xs font-mono tracking-wide px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: "rgba(146, 176, 144, 0.12)",
              color: "var(--accent-primary)",
              border: "1px solid rgba(146, 176, 144, 0.3)",
            }}
          >
            Apply →
          </a>
        </div>
      </header>

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
              Now hiring in the US &amp; Canada
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-white"
            >
              Film your everyday life.{" "}
              <span style={{ color: "var(--accent-primary)" }}>
                Get paid by the hour.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl"
            >
              Record short clips of everyday stuff around your house —
              cooking, dishes, laundry, cleanup — on your phone. Earn
              hourly from home, on your own schedule. No experience
              needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
            >
              <a
                href={ctaHref}
                onClick={onCtaClick}
                data-testid="cta-apply-primary"
                className="px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:opacity-90 inline-flex items-center justify-center"
                style={{
                  background: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                  boxShadow: "0 8px 40px rgba(146, 176, 144, 0.45)",
                }}
              >
                Apply now
              </a>
              <a
                href="#how"
                className="px-7 py-4 rounded-full font-medium text-sm text-white/80 border border-white/15 hover:border-white/30 hover:text-white transition-all inline-flex items-center justify-center"
              >
                See how it works
              </a>
            </motion.div>

            {/* Trust strip. Soft claims only — the exact rate is shown on the signup page. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-10 pt-6 border-t border-white/[0.06]"
            >
              <p className="text-xs sm:text-sm font-mono text-white/55 leading-relaxed">
                Hourly pay · Direct deposit · US &amp; Canada · No upfront fee · No cap
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

          {/* Hero video mosaic. 2x2 grid of real egocentric clips from our catalog. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {SAMPLE_CLIPS.map((clip, i) => (
                <ClipTile key={clip.src} clip={clip} delay={i * 0.08} />
              ))}
            </div>
            {/* Caption strip below the mosaic (not absolutely positioned, avoids overlap). */}
            <div className="mt-3 flex justify-center">
              <span
                className="inline-block px-3 py-1.5 rounded-full font-mono text-[10px] sm:text-xs backdrop-blur"
                style={{
                  background: "rgba(10, 9, 8, 0.85)",
                  border: "1px solid rgba(146, 176, 144, 0.35)",
                  color: "var(--accent-primary)",
                }}
              >
                0.5x wide · Hands in frame · Landscape
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU NEED */}
      <section className="px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Before you apply</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            What you need. Be honest with yourself.
          </h2>
          <p className="mt-3 text-white/60 max-w-xl">
            Four things. If you have three and can grab the fourth off
            Amazon tonight, you qualify. You&apos;ll confirm each of these
            on the signup form.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <Requirement
              title="A phone with a 0.5x ultrawide camera"
              body={`Open your camera app and look for "0.5x" near the shutter. iPhone 11 and newer, Samsung Galaxy S10 and newer, Google Pixel 4 and newer, and most recent flagship Androids all work. If the widest option is 1x, this phone won't work for the job.`}
            />
            <Requirement
              title="A head mount or chest strap"
              body={`A simple clip that holds your phone at eye level, hands-free. Around $10–$20 on Amazon if you don't already have one. We'll link the exact model we recommend inside the filming guide.`}
            />
            <Requirement
              title="A US or Canadian address and bank account"
              body="We pay by direct deposit. You'll need a checking account in your own name in the US or Canada. Open to collectors in all 50 states and every Canadian province."
            />
            <Requirement
              title="10 minutes to film a pilot clip"
              body="We tell you exactly what to film and how to frame it. If your pilot passes review, you're cleared for full paid sessions."
            />
          </div>

          {/* Explicit self-confirmation block. This mirrors the four checkboxes on
              the signup form so there are zero surprises after click-through. */}
          <div
            className="mt-8 rounded-xl p-5 sm:p-6"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-mono uppercase tracking-[0.15em]"
                style={{ color: "rgba(255, 255, 255, 0.55)" }}
              >
                On the signup form, you&apos;ll confirm:
              </span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-white/75">
              <CheckLine text="My phone has a 0.5x ultrawide camera" />
              <CheckLine text="I live in the US or Canada" />
              <CheckLine text="I have (or will buy) a head or chest mount" />
              <CheckLine text="I'll follow the framing spec (hands in frame, landscape)" />
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="px-5 sm:px-8 py-16 border-t border-white/[0.05]"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Three steps. One pilot clip.
          </h2>

          <ol className="mt-10 grid md:grid-cols-3 gap-5">
            <Step
              n="01"
              title="Sign up"
              time="2 min"
              body="Answer four eligibility questions and tell us where to send your filming guide."
            />
            <Step
              n="02"
              title="Film a 10-minute pilot clip"
              time="10 min"
              body="We send you the framing guide and one accepted example. You film yourself doing dishes, laundry, or bedroom cleanup at 0.5x wide, landscape, head- or chest-mounted."
            />
            <Step
              n="03"
              title="Get paid"
              time="After QA"
              body="If your pilot passes review, we release payment to your US or Canadian bank account and clear you for full paid sessions. Exact payout cadence is confirmed in writing before you record a single session."
            />
          </ol>
        </div>
      </section>

      {/* RECORDING SPEC */}
      <section className="px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-10">
          <div>
            <SectionLabel>Recording spec</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              The short version
            </h2>
            <p className="mt-3 text-white/60">
              We send the full guide after you sign up. This is the
              summary so you know what you&apos;re walking into.
            </p>
          </div>

          <div
            className="rounded-xl p-6 font-mono text-sm"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <SpecRow k="CAMERA" v="0.5x wide angle, landscape orientation" />
            <SpecRow k="MOUNT" v="Head-mounted or chest-mounted, stable" />
            <SpecRow k="FRAMING" v="Both hands visible in 90% of frames" />
            <SpecRow k="LENGTH" v="1 to 15 minutes per clip" />
            <SpecRow
              k="CATEGORIES"
              v="Kitchen (cooking, dishes, appliances), cleaning (sweep, mop, vacuum, dust, trash), laundry, bedroom (bed, wardrobe, packing)"
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
            The three questions everyone asks
          </h2>

          <div className="mt-10 space-y-3">
            <FaqItem
              q="Is this actually legit, or a scam?"
              a={
                <>
                  Claru is a{" "}
                  <a
                    href="https://reka.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Reka AI
                  </a>{" "}
                  company, backed by NVIDIA and trusted by frontier AI
                  labs. Payment is by direct deposit to your US or Canadian
                  bank account after your clip passes review. There is no
                  upfront fee, ever — we pay you, you don&apos;t pay us.
                </>
              }
            />
            <FaqItem
              q={`What does "accepted" mean, and what's the acceptance rate?`}
              a="Roughly 4 in 5 sessions pass review when you follow the framing guide (0.5x wide, landscape, both hands in frame, steady mount). Before you film your pilot, we'll show you one accepted example so you know exactly what good looks like."
            />
            <FaqItem
              q="Where does the footage go? Is my face or address exposed?"
              a="Footage is used to train household robots — loading dishwashers, folding towels, tidying rooms. It's used for manipulation and activity models, not face recognition or identity. You film your hands and the tasks, not your face."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Ready to film your first clip?
          </h2>
          <p className="mt-4 text-white/65">
            Two minutes to apply. We handle the rest.
          </p>
          <a
            href={ctaHref}
            onClick={onCtaClick}
            data-testid="cta-apply-secondary"
            className="mt-8 inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:opacity-90"
            style={{
              background: "var(--accent-primary)",
              color: "var(--bg-primary)",
              boxShadow: "0 8px 40px rgba(146, 176, 144, 0.45)",
            }}
          >
            Apply now
          </a>
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
            company · Hiring in the US &amp; Canada
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
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

// --- small presentational helpers ---

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
      className="relative aspect-[4/3] rounded-xl overflow-hidden group"
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
      {/* Gradient scrim for label legibility. */}
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

function Requirement({ title, body }: { title: string; body: string }) {
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
          style={{
            background: "rgba(146, 176, 144, 0.15)",
          }}
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
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  time,
  body,
}: {
  n: string;
  title: string;
  time: string;
  body: string;
}) {
  return (
    <li
      className="rounded-xl p-6"
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
          {n}
        </span>
        <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
          {time}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/65 leading-relaxed">{body}</p>
    </li>
  );
}

function SpecRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      className={`grid grid-cols-[120px_1fr] gap-3 py-3 ${
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
        <span className="text-white font-medium text-[0.95rem] pr-4">
          {q}
        </span>
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

export default function UgcVideoJobsPage() {
  return (
    <Suspense fallback={null}>
      <PageInner />
    </Suspense>
  );
}
