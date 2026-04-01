// ---------------------------------------------------------------------------
// ContentHero — Server Component
// ---------------------------------------------------------------------------
// Renders the hero section for a content page: breadcrumb navigation,
// H1 (primary keyword target), and subtitle paragraph.
// No animations — SSR-first for crawlers.
// ---------------------------------------------------------------------------

import Link from "next/link";

interface ContentHeroProps {
  /** H1 text */
  title: string;
  /** Lead paragraph under H1 */
  subtitle: string;
  /** Short label for the last breadcrumb segment */
  breadcrumbLabel: string;
}

export default function ContentHero({
  title,
  subtitle,
  breadcrumbLabel,
}: ContentHeroProps) {
  return (
    <section
      id="hero"
      className="w-full pt-32 pb-16 md:pt-40 md:pb-20"
      style={{ backgroundColor: "#0a0908" }}
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol
            className="flex flex-wrap items-center gap-1.5 text-sm"
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-white"
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="select-none">
              /
            </li>
            <li>
              <Link
                href="/solutions"
                className="transition-colors hover:text-white"
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                Solutions
              </Link>
            </li>
            <li aria-hidden="true" className="select-none">
              /
            </li>
            <li aria-current="page" style={{ color: "#92B090" }}>
              {breadcrumbLabel}
            </li>
          </ol>
        </nav>

        {/* H1 — primary keyword target */}
        <h1
          className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl"
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-sans)",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
