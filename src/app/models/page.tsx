import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import { getAllModelPages } from "@/data/programmatic/models/index";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "Training Data for Robot Learning Models | Claru",
  description:
    "Data requirements and formats for 25 robot learning models: OpenVLA, RT-2, Octo, Diffusion Policy, ACT/ALOHA, pi-zero, GR00T N1, and more.",
  keywords: [
    "robot learning model data",
    "OpenVLA training data",
    "RT-2 data requirements",
    "Diffusion Policy dataset",
    "VLA model data format",
    "robot foundation model data",
  ],
  openGraph: {
    title: "Training Data for Robot Learning Models | Claru",
    description:
      "Data requirements and delivery formats for 25+ robot learning models. Claru delivers model-ready datasets.",
    type: "website",
    url: "https://claru.ai/models",
  },
};

// =============================================================================
// PAGE
// =============================================================================

export default function ModelsHub() {
  const pages = getAllModelPages();

  return (
    <GeoPageShell>
      <section className="w-full pt-32 pb-12 md:pt-40 md:pb-16" style={{ backgroundColor: "#0a0908" }}>
        <div className="mx-auto max-w-5xl px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            >
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><span aria-hidden="true" className="select-none">/</span></li>
              <li><span aria-current="page" style={{ color: "#92B090" }}>Models</span></li>
            </ol>
          </nav>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
            Training Data by Model
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
            Every robot learning model has specific data requirements. Browse data specifications, volume benchmarks, and format details for 25 leading models — and see how Claru delivers model-ready datasets.
          </p>
        </div>
      </section>

      <section className="w-full py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/models/${page.slug}`}
                className="group rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-semibold text-white group-hover:underline">
                    {page.modelName}
                  </h2>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>
                    {page.year}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: "#92B090" }}>
                  {page.organization}
                </p>
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {page.inputSpec.observationFormat} | {page.inputSpec.controlFrequency}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
            Need Data for a Different Model?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            We deliver datasets formatted for any robot learning architecture. Tell us your model and we will match the exact data specification.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
            style={{ backgroundColor: "#92B090", color: "#0a0908" }}
          >
            Get Data for Your Model
          </Link>
        </div>
      </section>
    </GeoPageShell>
  );
}
