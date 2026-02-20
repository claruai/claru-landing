"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";
import Footer from "./components/sections/Footer";
import { SectionSkeleton } from "./components/ui/Skeleton";

// Dynamic imports for below-the-fold sections with loading skeletons
const ProblemAgitation = dynamic(
  () => import("./components/sections/ProblemAgitation"),
  { ssr: false, loading: () => <SectionSkeleton /> },
);

const TwoPaths = dynamic(() => import("./components/sections/TwoPaths"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Origin = dynamic(() => import("./components/sections/Origin"), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="min-h-[30vh]" />,
});

const GlobalReach = dynamic(
  () => import("./components/sections/GlobalReach"),
  { ssr: false, loading: () => <SectionSkeleton /> },
);

const ProofOfWork = dynamic(
  () => import("./components/sections/ProofOfWork"),
  { ssr: false, loading: () => <SectionSkeleton /> },
);

const Testimonials = dynamic(
  () => import("./components/sections/Testimonials"),
  { ssr: false, loading: () => <SectionSkeleton minHeight="min-h-[40vh]" /> },
);

const FinalCTA = dynamic(() => import("./components/sections/FinalCTA"), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="min-h-[50vh]" />,
});

const AnimatedLogo = dynamic(
  () => import("./components/sections/AnimatedLogo"),
  { ssr: false },
);

// Dynamic imports for effects and providers
const LenisProvider = dynamic(
  () => import("./components/providers/LenisProvider"),
  { ssr: false },
);

const HeroBackground = dynamic(
  () => import("./components/effects/HeroBackground"),
  { ssr: false },
);

function SectionBridge({ text }: { text: string }) {
  return (
    <motion.div
      className="py-6 md:py-8 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-mono text-sm text-[var(--text-tertiary)] tracking-wide">
        {text}
      </p>
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <LenisProvider>
      {/* Canvas ASCII animation - robots on desktop, matrix rain on mobile */}
      <HeroBackground />

      {/* Noise overlay for texture */}
      <div className="noise-overlay-animated" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <ProblemAgitation />
        <SectionBridge text="So we built something different." />
        <Origin />
        <TwoPaths />
        <GlobalReach />
        <ProofOfWork />
        <Testimonials />
        <FinalCTA />
        <AnimatedLogo />
      </main>

      {/* Footer */}
      <Footer />
    </LenisProvider>
  );
}
