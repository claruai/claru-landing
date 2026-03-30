"use client";

import LenisProvider from "./components/providers/LenisProvider";
import NavPill from "./v2/components/ui/NavPill";
import HeroV2 from "./v2/components/sections/HeroV2";
import CatalogShowcase from "./v2/components/sections/CatalogShowcase";
import EnrichmentPipeline from "./v2/components/sections/EnrichmentPipeline";
import CollectionNetwork from "./v2/components/sections/CollectionNetwork";
import ProofOfWork from "./v2/components/sections/ProofOfWork";
import FinalCTAV2 from "./v2/components/sections/FinalCTAV2";

export default function HomeContent() {
  return (
    <LenisProvider>
      <NavPill />
      <div className="v2-dot-grid relative min-h-screen bg-[var(--bg-primary)] text-white">
        <main>
          {/* 1. HERO — "Training data for [physical/robotics/video] AI" */}
          <HeroV2 />
          {/* Anchor aliases for pillar page links (/#capabilities, /#services) */}
          <div id="capabilities" />
          <div id="services" />
          {/* 2. CATALOG — "Look at all this data" */}
          <CatalogShowcase />
          {/* 3. WORKFORCE — "We have a massive global operation" */}
          <CollectionNetwork />
          {/* 4. ENRICHMENT — "Everything ships enriched" */}
          <EnrichmentPipeline />
          {/* 5. PROOF — Stats + case studies + testimonials + investors */}
          <ProofOfWork />
          {/* 6. CTA — "Tell us what you're training" */}
          <FinalCTAV2 />
        </main>
      </div>
    </LenisProvider>
  );
}
