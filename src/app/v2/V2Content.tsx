"use client";

import LenisProvider from "../components/providers/LenisProvider";
import NavPill from "./components/ui/NavPill";
import HeroV2 from "./components/sections/HeroV2";
import CatalogShowcase from "./components/sections/CatalogShowcase";
import EnrichmentPipeline from "./components/sections/EnrichmentPipeline";
import CollectionNetwork from "./components/sections/CollectionNetwork";
import ProofOfWork from "./components/sections/ProofOfWork";
import FinalCTAV2 from "./components/sections/FinalCTAV2";

export default function V2Content() {
  return (
    <LenisProvider>
      <NavPill />
      <div className="v2-dot-grid relative min-h-screen bg-[var(--bg-primary)] text-white">
        <main>
          {/* 1. HERO — "Training data for [physical/robotics/video] AI" */}
          <HeroV2 />
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
