import type { Metadata } from "next";
import Link from "next/link";
import { ogImageUrl } from "@/lib/og";
import { getAllLabPages } from "@/data/programmatic/labs/index";

// Override parent layout's noindex for this programmatic SEO hub page
export const metadata: Metadata = {
  title: "Training Data for Robotics Labs | Claru",
  description:
    "How Claru's real-world training data supports 20 leading robotics labs and companies — from Figure AI and Boston Dynamics to Stanford SAIL and CMU.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/for",
  },
  openGraph: {
    title: "Training Data for Robotics Labs | Claru",
    description:
      "How Claru's real-world training data supports 20 leading robotics labs and companies.",
    type: "website",
    url: "https://claru.ai/for",
    images: [
      {
        url: ogImageUrl("Training Data for Robotics Labs", { category: "lab" }),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function LabsHub() {
  const pages = getAllLabPages();

  // Group by category
  const companies = pages.filter(
    (p) =>
      ![
        "berkeley-autolab",
        "stanford-sail",
        "mit-csail-robotics",
        "cmu-robotics",
        "kaist-robotics",
        "tsinghua-robotics",
      ].includes(p.slug)
  );
  const universities = pages.filter((p) =>
    [
      "berkeley-autolab",
      "stanford-sail",
      "mit-csail-robotics",
      "cmu-robotics",
      "kaist-robotics",
      "tsinghua-robotics",
    ].includes(p.slug)
  );

  return (
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
                  Labs
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
            Training Data for Robotics Labs
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Each lab faces unique data challenges shaped by their robots, research
            focus, and deployment targets. Explore how purpose-collected real-world
            data addresses the specific needs of leading robotics organizations.
          </p>
        </div>
      </section>

      {/* Companies */}
      <section className="w-full py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold text-white mb-8">
            Companies & Corporate Labs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((page) => (
              <Link
                key={page.slug}
                href={`/for/${page.slug}`}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.05]"
              >
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:underline">
                  {page.companyName}
                </h3>
                <p
                  className="text-xs mb-3"
                  style={{
                    color: "#92B090",
                    fontFamily:
                      "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                  }}
                >
                  {page.keyProducts.join(" / ")}
                </p>
                <p
                  className="text-sm leading-relaxed line-clamp-2"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {page.companyDescription.slice(0, 160)}...
                </p>
                <span
                  className="inline-block mt-3 text-sm font-medium"
                  style={{ color: "#92B090" }}
                >
                  View data profile &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Universities */}
      <section className="w-full py-14 md:py-20 bg-white/[0.02]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold text-white mb-8">
            University Research Labs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {universities.map((page) => (
              <Link
                key={page.slug}
                href={`/for/${page.slug}`}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.05]"
              >
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:underline">
                  {page.companyName}
                </h3>
                <p
                  className="text-xs mb-3"
                  style={{
                    color: "#92B090",
                    fontFamily:
                      "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                  }}
                >
                  {page.keyProducts.join(" / ")}
                </p>
                <p
                  className="text-sm leading-relaxed line-clamp-2"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {page.companyDescription.slice(0, 160)}...
                </p>
                <span
                  className="inline-block mt-3 text-sm font-medium"
                  style={{ color: "#92B090" }}
                >
                  View data profile &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
            Your Lab Not Listed?
          </h2>
          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Claru provides purpose-built training data for any robotics
            application. Talk to us about your specific data requirements.
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
  );
}
