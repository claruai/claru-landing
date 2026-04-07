import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import { getAllFormatPages } from "@/data/programmatic/formats/index";

export const metadata: Metadata = {
  title: "Robotics Data Formats & Standards Guide | Claru",
  description:
    "Complete guide to 15 robotics data formats: RLDS, HDF5, WebDataset, LeRobot, zarr, ROS bag, MCAP, nuScenes, KITTI, BOP, COCO, and more. Schema details, framework compatibility, and conversion guides.",
  keywords: [
    "robotics data formats",
    "RLDS format",
    "HDF5 robotics",
    "WebDataset",
    "LeRobot format",
    "robot data standards",
  ],
  openGraph: {
    title: "Robotics Data Formats & Standards Guide | Claru",
    description:
      "15 robotics data formats explained: schema, framework compatibility, conversion, and Claru delivery options.",
    type: "website",
    url: "https://claru.ai/formats",
  },
  alternates: {
    canonical: "https://claru.ai/formats",
  },
};

export default function FormatsHubPage() {
  const formats = getAllFormatPages();

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
              <li aria-current="page" style={{ color: "#92B090" }}>Formats</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
            Robotics Data Formats &amp; Standards
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            Every robotics framework expects data in a specific format. This guide covers
            the schema, compatibility, and conversion paths for {formats.length} formats
            used in robot learning. Claru delivers data in any of these formats.
          </p>
          <p
            className="mt-3 text-sm"
            style={{
              fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              color: "#92B090",
            }}
          >
            {formats.length} formats documented
          </p>
        </div>
      </section>

      {/* Format Grid */}
      <section className="w-full pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formats.map((fmt) => (
              <Link
                key={fmt.slug}
                href={`/formats/${fmt.slug}`}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-white group-hover:underline">
                    {fmt.h1.replace(": Complete Guide for Robotics Data", "")}
                  </h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-4">
                  {fmt.metaDescription}
                </p>
                <div className="flex flex-wrap gap-2">
                  {fmt.fileExtensions.map((ext) => (
                    <span
                      key={ext}
                      className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-xs"
                      style={{
                        color: "#92B090",
                        fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                      }}
                    >
                      {ext}
                    </span>
                  ))}
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
            Need Data in a Specific Format?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Claru handles all format conversion as part of the delivery pipeline.
            Tell us your framework and we will deliver data ready to load.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
              style={{ backgroundColor: "#92B090", color: "#0a0908" }}
            >
              Get in Touch
            </Link>
            <Link
              href="/datasets"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
            >
              Browse Datasets
            </Link>
          </div>
        </div>
      </section>
    </GeoPageShell>
  );
}
