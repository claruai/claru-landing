import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import { getAllTaskPages } from "@/data/programmatic/tasks/index";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "Training Data for Robotics by Task | Claru",
  description:
    "Browse Claru's training data catalog by task: manipulation, grasping, navigation, assembly, and 25+ more robotics task categories with custom data collection.",
  keywords: [
    "robotics training data",
    "robot manipulation data",
    "physical AI datasets",
    "task-specific training data",
    "robot learning data by task",
  ],
  openGraph: {
    title: "Training Data for Robotics by Task | Claru",
    description:
      "Browse 30+ task categories of robotics training data. Custom data collection for manipulation, grasping, navigation, assembly, and more.",
    type: "website",
    url: "https://claru.ai/training-data",
  },
};

// =============================================================================
// PAGE
// =============================================================================

export default function TrainingDataHub() {
  const pages = getAllTaskPages();

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
              <li><span aria-current="page" style={{ color: "#92B090" }}>Training Data</span></li>
            </ol>
          </nav>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
            Training Data by Task
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
            Browse our catalog of robotics training data organized by task category. Each page covers data requirements, compatible models, and how Claru delivers production-ready datasets.
          </p>
        </div>
      </section>

      <section className="w-full py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/training-data/${page.slug}`}
                className="group rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <h2 className="text-base font-semibold text-white group-hover:underline mb-2">
                  {page.h1.replace(/ Training Data$/, "")}
                </h2>
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {page.metaDescription}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {page.relevantModels.slice(0, 3).map((m) => (
                    <span key={m} className="text-xs rounded-full border border-white/10 px-2 py-0.5" style={{ color: "#92B090" }}>
                      {m}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
            Need Data for a Different Task?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            We collect custom datasets for any robotics task. Tell us what you need and we will scope a collection plan.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
            style={{ backgroundColor: "#92B090", color: "#0a0908" }}
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </GeoPageShell>
  );
}
