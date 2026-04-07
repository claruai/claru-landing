import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import { getAllDatasetPages } from "@/data/programmatic/datasets/index";

export const metadata: Metadata = {
  title: "Robotics Training Datasets | Claru",
  description:
    "Browse 25+ purpose-built robotics training datasets: egocentric video, teleoperation trajectories, RGB-D, multi-view, and synthetic data for VLA models, manipulation policies, and embodied AI.",
  keywords: [
    "robotics training datasets",
    "robot manipulation data",
    "egocentric video dataset",
    "teleoperation dataset",
    "VLA training data",
    "embodied AI datasets",
  ],
  openGraph: {
    title: "Robotics Training Datasets | Claru",
    description:
      "25+ purpose-built datasets for training robots: egocentric video, teleoperation trajectories, RGB-D, multi-view, and synthetic data.",
    type: "website",
    url: "https://claru.ai/datasets",
  },
  alternates: {
    canonical: "https://claru.ai/datasets",
  },
};

export default function DatasetsHubPage() {
  const datasets = getAllDatasetPages();

  const categories = [
    { label: "Egocentric Video", filter: "egocentric" },
    { label: "Teleoperation", filter: "teleoperation" },
    { label: "RGB-D & Depth", filter: "rgbd" },
    { label: "Multi-View & Multi-Sensor", filter: "multi" },
    { label: "Synthetic & Game", filter: "synthetic,game" },
    { label: "Specialized", filter: "dashcam,aerial,thermal,stereo,point-cloud" },
  ];

  return (
    <GeoPageShell>
      {/* Hero */}
      <section className="w-full pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="mx-auto max-w-5xl px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol
              className="flex items-center gap-1.5 text-sm"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              }}
            >
              <li>
                <Link href="/" className="transition-colors hover:text-white">Home</Link>
              </li>
              <li aria-hidden="true" className="select-none">/</li>
              <li aria-current="page" style={{ color: "#92B090" }}>Datasets</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
            Robotics Training Datasets
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            Purpose-built datasets for training robot manipulation policies, VLA models,
            world models, and embodied AI systems. Each dataset includes dense annotations
            and delivery in your preferred format.
          </p>
          <p
            className="mt-3 text-sm"
            style={{
              fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              color: "#92B090",
            }}
          >
            {datasets.length} datasets available
          </p>
        </div>
      </section>

      {/* Dataset Grid */}
      <section className="w-full pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((ds) => (
              <Link
                key={ds.slug}
                href={`/datasets/${ds.slug}`}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <h3 className="text-base font-semibold text-white group-hover:underline mb-2">
                  {ds.h1}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-4">
                  {ds.heroSubtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ds.datasetProfile.modalities.slice(0, 3).map((mod) => (
                    <span
                      key={mod}
                      className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-xs"
                      style={{
                        color: "#92B090",
                        fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                      }}
                    >
                      {mod}
                    </span>
                  ))}
                  <span
                    className="inline-flex items-center text-xs"
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

      {/* CTA */}
      <section className="w-full py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
            Need a Custom Dataset?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Claru builds custom datasets for any robotics application. Tell us your model
            architecture, target environment, and data requirements.
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
