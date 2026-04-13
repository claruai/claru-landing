import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import { getAllIndustryPages } from "@/data/programmatic/industries/index";

export const metadata: Metadata = {
  title: "Robotics Training Data by Industry | Claru",
  description:
    "Industry-specific robotics training data for healthcare, agriculture, warehousing, manufacturing, defense, and 10+ more verticals. Regulatory compliance, environment-specific data, and domain expertise.",
  keywords: [
    "industry robotics data",
    "healthcare robotics training data",
    "warehouse robotics data",
    "manufacturing robot data",
    "agricultural robotics dataset",
    "defense robotics data",
  ],
  openGraph: {
    title: "Robotics Training Data by Industry | Claru",
    description:
      "Industry-specific training data for 15 robotics verticals with regulatory compliance and domain expertise.",
    type: "website",
    url: "https://claru.ai/industries",
  },
  alternates: {
    canonical: "https://claru.ai/industries",
  },
};

export default function IndustriesHubPage() {
  const industries = getAllIndustryPages();

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
              <li aria-current="page" style={{ color: "#92B090" }}>Industries</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
            Robotics Training Data by Industry
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            Every industry has unique regulations, environments, and task requirements
            for robotics. Claru provides industry-specific training data with
            regulatory compliance, domain-expert annotations, and environment-appropriate
            collection protocols.
          </p>
          <p
            className="mt-3 text-sm"
            style={{
              fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              color: "#92B090",
            }}
          >
            {industries.length} industry verticals
          </p>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="w-full pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <h3 className="text-base font-semibold text-white group-hover:underline mb-2">
                  {ind.h1}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-4">
                  {ind.heroSubtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ind.regulations.slice(0, 2).map((reg) => (
                    <span
                      key={reg.name}
                      className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-xs"
                      style={{
                        color: "#92B090",
                        fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                      }}
                    >
                      {reg.name}
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
            Building Robots for Your Industry?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Claru provides training data tailored to your industry&apos;s regulatory
            requirements, environment characteristics, and task demands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
              style={{ backgroundColor: "#92B090", color: "#0a0908" }}
            >
              Discuss Your Needs
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
