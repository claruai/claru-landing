"use client";

import LenisProvider from "../components/providers/LenisProvider";
import HeroV2 from "./components/sections/HeroV2";
import DataGap from "./components/sections/DataGap";
import ThreeModes from "./components/sections/ThreeModes";
import CatalogShowcase from "./components/sections/CatalogShowcase";
import EnrichmentPipeline from "./components/sections/EnrichmentPipeline";
import CollectionNetwork from "./components/sections/CollectionNetwork";
import GameCapture from "./components/sections/GameCapture";
import WhyClaru from "./components/sections/WhyClaru";
import SocialProofV2 from "./components/sections/SocialProofV2";
import FinalCTAV2 from "./components/sections/FinalCTAV2";

export default function V2Content() {
  return (
    <LenisProvider>
      <div className="v2-dot-grid relative min-h-screen bg-[var(--bg-primary)] text-white">
        <main>
          <HeroV2 />
          <DataGap />
          <ThreeModes />
          <CatalogShowcase />
          <EnrichmentPipeline />
          <CollectionNetwork />
          <GameCapture />
          <WhyClaru />
          <SocialProofV2 />
          <FinalCTAV2 />
        </main>
      </div>
    </LenisProvider>
  );
}
