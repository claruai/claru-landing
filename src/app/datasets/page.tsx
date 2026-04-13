import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import { getAllDatasetPages } from "@/data/programmatic/datasets/index";
import { fetchAllOSSDatasets } from "@/lib/oss-datasets";
import DatasetsHubClient from "./components/DatasetsHubClient";

export const revalidate = 3600; // ISR: 1 hour

export const metadata: Metadata = {
  title: "Physical AI Datasets | 400+ Open-Source Robotics Datasets | Claru",
  description:
    "Browse 400+ open-source physical AI and robotics datasets. Filter by modality, robot embodiment, environment, task type, and data format. The most comprehensive directory for training robot manipulation policies, VLA models, and embodied AI.",
  keywords: [
    "physical AI datasets",
    "robotics training datasets",
    "robot manipulation data",
    "open source robotics datasets",
    "embodied AI datasets",
    "VLA training data",
    "HuggingFace robotics",
    "LeRobot datasets",
  ],
  openGraph: {
    title: "Physical AI Datasets | 400+ Open-Source Robotics Datasets | Claru",
    description:
      "The most comprehensive directory of open-source physical AI datasets. Filter by modality, embodiment, environment, and task type.",
    type: "website",
    url: "https://claru.ai/datasets",
  },
  alternates: {
    canonical: "https://claru.ai/datasets",
  },
};

export default async function DatasetsHubPage() {
  const [ossDatasets, claruDatasets] = await Promise.all([
    fetchAllOSSDatasets(),
    Promise.resolve(getAllDatasetPages()),
  ]);

  // JSON-LD DataCatalog schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: "Physical AI Datasets | Claru",
    description:
      "Comprehensive directory of 400+ open-source physical AI and robotics datasets, curated for researchers and engineers building embodied AI systems.",
    url: "https://claru.ai/datasets",
    provider: {
      "@type": "Organization",
      name: "Claru AI",
      url: "https://claru.ai",
    },
    dataset: ossDatasets.slice(0, 50).map((ds) => ({
      "@type": "Dataset",
      name: ds.name,
      url: `https://claru.ai/datasets/${ds.slug}`,
      description: ds.description,
    })),
  };

  return (
    <GeoPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e") }}
      />

      {/* Hero */}
      <section className="w-full pt-32 pb-8 md:pt-40 md:pb-12">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol
              className="flex items-center gap-1.5 text-sm"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              }}
            >
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="select-none">
                /
              </li>
              <li aria-current="page" style={{ color: "#92B090" }}>
                Datasets
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
            Physical AI Datasets
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/70">
            The most comprehensive directory of open-source datasets for training
            robot manipulation policies, VLA models, world models, and embodied
            AI systems. Search by modality, robot platform, environment, and
            task type.
          </p>
          <p
            className="mt-3 text-sm"
            style={{
              fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              color: "#92B090",
            }}
          >
            {ossDatasets.length} open-source datasets
          </p>
        </div>
      </section>

      {/* OSS Dataset Hub (client-side filter/search) */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6 py-20 text-center text-white/30">
            Loading datasets...
          </div>
        }
      >
        <DatasetsHubClient initialDatasets={ossDatasets} />
      </Suspense>

      {/* Claru Custom Collection — visually distinct from OSS research catalog */}
      {claruDatasets.length > 0 && (
        <section className="w-full py-16 border-t border-white/5 bg-[#92B090]/[0.03]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="rounded border border-[#92B090]/30 px-2 py-0.5 text-[11px] text-[#92B090]"
                style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
              >
                Claru collection
              </span>
              <span className="text-white/30 text-sm">·</span>
              <span className="text-white/30 text-sm">Not open-source — available on request</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Purpose-Built Datasets by Claru
            </h2>
            <p className="text-white/50 text-sm mb-8 max-w-2xl">
              These are not open-source datasets. Claru collects custom physical AI training data
              with dense human annotations. Contact us to request samples or discuss collection.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {claruDatasets.map((ds) => (
                <Link
                  key={ds.slug}
                  href={`/datasets/${ds.slug}`}
                  className="group rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <h3 className="text-[15px] font-semibold text-white group-hover:underline mb-1.5">
                    {ds.h1}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-3">
                    {ds.heroSubtitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ds.datasetProfile.modalities.slice(0, 3).map((mod) => (
                      <span
                        key={mod}
                        className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-[11px]"
                        style={{
                          color: "#92B090",
                          fontFamily:
                            "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                        }}
                      >
                        {mod}
                      </span>
                    ))}
                    <span
                      className="inline-flex items-center text-[11px]"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {ds.datasetProfile.totalClips} clips
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="w-full py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
            Need Custom Physical AI Data?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Claru builds custom datasets for any robotics application. Tell us
            your model architecture, target environment, and data requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
              style={{ backgroundColor: "#92B090", color: "#0a0908" }}
            >
              Request a Sample Pack
            </Link>
            <Link
              href="/data-catalog"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
            >
              Browse the Data Catalog
            </Link>
          </div>
        </div>
      </section>
    </GeoPageShell>
  );
}
