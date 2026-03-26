"use client";

import LenisProvider from "../components/providers/LenisProvider";
import HeroV2 from "./components/sections/HeroV2";
import ThreeModes from "./components/sections/ThreeModes";
import CatalogShowcase from "./components/sections/CatalogShowcase";
import EnrichmentPipeline from "./components/sections/EnrichmentPipeline";
import CollectionNetwork from "./components/sections/CollectionNetwork";
import SocialProofV2 from "./components/sections/SocialProofV2";
import FinalCTAV2 from "./components/sections/FinalCTAV2";

function SectionDivider() {
  return <div className="v2-section-divider" />;
}

export default function V2Content() {
  return (
    <LenisProvider>
      <div className="v2-dot-grid relative min-h-screen bg-[var(--bg-primary)] text-white">
        <main>
          <HeroV2 />
          <SectionDivider />
          <EnrichmentPipeline />
          <SectionDivider />
          <CatalogShowcase />
          <SectionDivider />
          <ThreeModes />
          <SectionDivider />
          <CollectionNetwork />
          <SectionDivider />
          <SocialProofV2 />
          <SectionDivider />
          <FinalCTAV2 />
        </main>
      </div>
    </LenisProvider>
  );
}
