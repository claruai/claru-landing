import type { Metadata } from "next";
import Link from "next/link";
import { ogImageUrl } from "@/lib/og";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import { getAllBenchmarkPages } from "@/data/programmatic/benchmarks/index";

export const metadata: Metadata = {
  title: "Robotics Benchmarks: Real-World Data for Sim-to-Real Transfer | Claru",
  description:
    "How real-world training data bridges the sim-to-real gap for 15 major robotics benchmarks including RLBench, CALVIN, ManiSkill, Habitat, and more.",
  alternates: {
    canonical: "/benchmarks",
  },
  openGraph: {
    title: "Robotics Benchmarks: Real-World Data for Sim-to-Real Transfer | Claru",
    description:
      "How real-world training data bridges the sim-to-real gap for 15 major robotics benchmarks.",
    type: "website",
    url: "https://claru.ai/benchmarks",
    images: [
      {
        url: ogImageUrl("Robotics Benchmarks", { category: "benchmark" }),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function BenchmarksHub() {
  const pages = getAllBenchmarkPages();

  return (
    <GeoPageShell>
      <article>
        <section
          className="w-full pt-32 pb-12 md:pt-40 md:pb-16"
          style={{ backgroundColor: "#0a0908" }}
        >
          <div className="mx-auto max-w-4xl px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex items-center gap-1.5 text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily:
                    "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="select-none">
                    /
                  </span>
                  <span aria-current="page" style={{ color: "#92B090" }}>
                    Benchmarks
                  </span>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Robotics Benchmarks
            </h1>
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Every robotics benchmark measures performance in simulation. Real-world
              data reveals whether those scores transfer to physical robots. Explore
              how purpose-collected data bridges the sim-to-real gap for each benchmark.
            </p>
          </div>
        </section>

        <section className="w-full py-14 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/benchmarks/${page.slug}`}
                  className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <h2 className="text-lg font-semibold text-white mb-2 group-hover:underline">
                    {page.benchmarkName}
                  </h2>
                  <p
                    className="text-sm leading-relaxed line-clamp-3"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {page.benchmarkDescription.slice(0, 200)}...
                  </p>
                  <span
                    className="inline-block mt-3 text-sm font-medium"
                    style={{ color: "#92B090" }}
                  >
                    View benchmark &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Bridge the Sim-to-Real Gap
            </h2>
            <p
              className="text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Talk to our team about purpose-built real-world data that validates
              and improves simulation-trained robot policies.
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
      </article>
    </GeoPageShell>
  );
}
