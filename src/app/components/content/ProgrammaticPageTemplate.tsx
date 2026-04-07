// ---------------------------------------------------------------------------
// ProgrammaticPageTemplate — Server Component
// ---------------------------------------------------------------------------
// Renders any programmatic SEO page (glossary deep, guides, etc.) using the
// shared ProgrammaticPageBase data shape. Wraps in GeoPageShell for consistent
// Header/Footer chrome. Sections render conditionally by type.
// ---------------------------------------------------------------------------

import Link from "next/link";
import GeoPageShell from "./GeoPageShell";
import ContentFAQ from "./ContentFAQ";
import type {
  ProgrammaticPageBase,
  PageSection,
  GlossaryDeepPageData,
  GuidePageData,
  TaskPageData,
  ModelPageData,
  AcademicAltPageData,
  ProgrammaticCitation,
} from "@/data/programmatic/types";

// ---------------------------------------------------------------------------
// Section Renderers
// ---------------------------------------------------------------------------

function ProseSection({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          {heading}
        </h2>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardsSection({ heading, cards }: { heading: string; cards: { title: string; description: string; icon?: string }[] }) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-8">
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
            >
              {card.icon && <span className="text-2xl mb-3 block">{card.icon}</span>}
              <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonTableSection({
  heading,
  description,
  columns,
  rows,
}: {
  heading: string;
  description?: string;
  columns: string[];
  rows: Record<string, string>[];
}) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-4">
          {heading}
        </h2>
        {description && (
          <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
            {description}
          </p>
        )}
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(146,176,144,0.1)" }}>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left font-medium"
                    style={{ color: "#92B090", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-white/5">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {row[col] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ heading, stats }: { heading?: string; stats: { value: string; label: string }[] }) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        {heading && (
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-8">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold md:text-4xl" style={{ color: "#92B090" }}>
                {stat.value}
              </div>
              <div className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PipelineSection({ heading, steps }: { heading: string; steps: { stepNumber: number; title: string; description: string }[] }) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-8">
          {heading}
        </h2>
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.stepNumber} className="flex gap-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: "rgba(146,176,144,0.15)", color: "#92B090", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
              >
                {step.stepNumber}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CitationListSection({ heading, citations }: { heading: string; citations: ProgrammaticCitation[] }) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          {heading}
        </h2>
        <ol className="list-none space-y-4">
          {citations.map((c, i) => (
            <li key={c.id} className="text-sm leading-relaxed md:text-base">
              <span
                className="mr-2 font-bold"
                style={{ color: "#92B090", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
              >
                [{i + 1}]
              </span>
              <span style={{ color: "rgba(255,255,255,0.8)" }}>
                {c.authors}. <span className="italic">&ldquo;{c.title}.&rdquo;</span>{" "}
                {c.venue}, {c.year}.
              </span>
              {c.url && (
                <>
                  {" "}
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium transition-opacity hover:opacity-80"
                    style={{ color: "#92B090" }}
                  >
                    Link <span aria-hidden="true">&rarr;</span>
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function renderSection(section: PageSection, index: number) {
  switch (section.type) {
    case "prose":
      return <ProseSection key={index} heading={section.heading} paragraphs={section.paragraphs} />;
    case "cards":
      return <CardsSection key={index} heading={section.heading} cards={section.cards} />;
    case "comparison-table":
      return (
        <ComparisonTableSection
          key={index}
          heading={section.heading}
          description={section.description}
          columns={section.columns}
          rows={section.rows}
        />
      );
    case "stats":
      return <StatsSection key={index} heading={section.heading} stats={section.stats} />;
    case "pipeline":
      return <PipelineSection key={index} heading={section.heading} steps={section.steps} />;
    case "citation-list":
      return <CitationListSection key={index} heading={section.heading} citations={section.citations} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Glossary-specific sections
// ---------------------------------------------------------------------------

function GlossaryDeepContent({ page }: { page: GlossaryDeepPageData }) {
  return (
    <>
      {/* Long definition */}
      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
            What Is {page.h1.replace(/:.*/,"")}?
          </h2>
          <div className="space-y-4">
            {page.longDefinition.split("\n\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Historical context */}
      <section className="w-full py-10 md:py-14 bg-white/[0.02]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
            Historical Context
          </h2>
          <div className="space-y-4">
            {page.historicalContext.split("\n\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Practical implications */}
      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
            Practical Implications
          </h2>
          <div className="space-y-4">
            {page.practicalImplications.split("\n\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Common misconceptions */}
      {page.commonMisconceptions.length > 0 && (
        <section className="w-full py-10 md:py-14 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-8">
              Common Misconceptions
            </h2>
            <div className="space-y-6">
              {page.commonMisconceptions.map((m, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-red-400 font-bold text-sm mt-0.5" style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>MYTH</span>
                    <p className="text-base font-medium text-white">{m.misconception}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-sm mt-0.5" style={{ color: "#92B090", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>FACT</span>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{m.correction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key papers */}
      {page.keyPapers.length > 0 && (
        <CitationListSection heading="Key Papers" citations={page.keyPapers} />
      )}

      {/* Claru relevance */}
      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
            How Claru Supports This
          </h2>
          <div className="space-y-4">
            {page.claruRelevance.split("\n\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Guide-specific sections
// ---------------------------------------------------------------------------

function GuideContent({ page }: { page: GuidePageData }) {
  return (
    <>
      {/* Prerequisites & metadata */}
      <section className="w-full py-8 md:py-10">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Difficulty</span>
              <span className="text-sm font-medium capitalize" style={{ color: "#92B090" }}>{page.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Time</span>
              <span className="text-sm font-medium" style={{ color: "#92B090" }}>{page.estimatedTime}</span>
            </div>
          </div>
          {page.prerequisites.length > 0 && (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 mb-8">
              <h3 className="text-base font-semibold text-white mb-3">Prerequisites</h3>
              <ul className="space-y-2">
                {page.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span style={{ color: "#92B090" }} aria-hidden="true">&#8226;</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Steps */}
      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-10">
            {page.steps.map((step) => (
              <div key={step.stepNumber} className="relative">
                <div className="flex gap-5">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: "rgba(146,176,144,0.15)", color: "#92B090", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    {step.stepNumber}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <div className="space-y-3">
                      {step.description.split("\n\n").map((p, i) => (
                        <p key={i} className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                          {p}
                        </p>
                      ))}
                    </div>
                    {step.tools && step.tools.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {step.tools.map((tool) => (
                          <span
                            key={tool}
                            className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs"
                            style={{ color: "#92B090", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                    {step.tips && step.tips.length > 0 && (
                      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                        {step.tips.map((tip, i) => (
                          <p key={i} className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                            <span style={{ color: "#92B090" }}>Tip: </span>{tip}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools overview */}
      {page.tools.length > 0 && (
        <section className="w-full py-10 md:py-14 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
              Tools & Technologies
            </h2>
            <div className="flex flex-wrap gap-3">
              {page.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key papers */}
      {page.keyPapers.length > 0 && (
        <CitationListSection heading="References" citations={page.keyPapers} />
      )}

      {/* Claru relevance */}
      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
            How Claru Can Help
          </h2>
          <div className="space-y-4">
            {page.claruRelevance.split("\n\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Task-specific sections
// ---------------------------------------------------------------------------

function TaskContent({ page }: { page: TaskPageData }) {
  return (
    <>
      {/* Data requirements summary */}
      <section className="w-full py-8 md:py-10">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-base font-semibold text-white mb-4">Data Requirements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Modality</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.dataRequirements.modality}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Volume Range</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.dataRequirements.volumeRange}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Temporal Resolution</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.dataRequirements.temporalResolution}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Key Annotations</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {page.dataRequirements.keyAnnotations.map((a) => (
                    <span key={a} className="inline-flex items-center rounded-full border border-white/10 px-2.5 py-0.5 text-xs" style={{ color: "#92B090" }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Relevant models & environments */}
          <div className="flex flex-wrap gap-6 mt-6">
            {page.relevantModels.length > 0 && (
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Compatible Models</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {page.relevantModels.map((m) => (
                    <span key={m} className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{m}</span>
                  ))}
                </div>
              </div>
            )}
            {page.environmentTypes.length > 0 && (
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Environment Types</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {page.environmentTypes.map((e) => (
                    <span key={e} className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Claru relevance */}
      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
            How Claru Supports This Task
          </h2>
          <div className="space-y-4">
            {page.claruRelevance.split("\n\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Model-specific sections
// ---------------------------------------------------------------------------

function ModelContent({ page }: { page: ModelPageData }) {
  return (
    <>
      {/* Model metadata */}
      <section className="w-full py-8 md:py-10">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Organization</span>
              <span className="text-sm font-medium" style={{ color: "#92B090" }}>{page.organization}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Year</span>
              <span className="text-sm font-medium" style={{ color: "#92B090" }}>{page.year}</span>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-base font-semibold text-white mb-4">Input/Output Specification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Observation</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.inputSpec.observationFormat}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Action</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.inputSpec.actionFormat}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Language</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.inputSpec.languageConditioning}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Control Freq</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.inputSpec.controlFrequency}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claru integration */}
      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
            How Claru Data Integrates with {page.modelName}
          </h2>
          <div className="space-y-4">
            {page.claruIntegration.split("\n\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Academic alternative-specific sections
// ---------------------------------------------------------------------------

function AcademicAltContent({ page }: { page: AcademicAltPageData }) {
  return (
    <>
      {/* Dataset profile */}
      <section className="w-full py-8 md:py-10">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-base font-semibold text-white mb-4">{page.datasetName} Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Institution</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.academicProfile.institution}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Year</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.academicProfile.year}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Scale</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.academicProfile.scale}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>License</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{page.academicProfile.license}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>Modalities</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {page.academicProfile.modalities.map((m) => (
                  <span key={m} className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claru relevance */}
      <section className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
            How Claru Helps Teams Beyond {page.datasetName}
          </h2>
          <div className="space-y-4">
            {page.claruRelevance.split("\n\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Cross-links
// ---------------------------------------------------------------------------

function CrossLinks({
  relatedGlossaryTerms,
  relatedGuidePages,
  relatedSolutionSlugs,
}: Pick<ProgrammaticPageBase, "relatedGlossaryTerms" | "relatedGuidePages" | "relatedSolutionSlugs">) {
  const hasLinks =
    relatedGlossaryTerms.length > 0 ||
    relatedGuidePages.length > 0 ||
    relatedSolutionSlugs.length > 0;

  if (!hasLinks) return null;

  return (
    <section className="w-full py-10 md:py-14 bg-white/[0.02]">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-xl font-semibold text-white mb-6">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {relatedGlossaryTerms.map((slug) => (
            <Link
              key={slug}
              href={`/glossary/${slug}`}
              className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>
                  Glossary
                </span>
                <div className="text-sm font-medium group-hover:underline mt-1" style={{ color: "#92B090" }}>
                  {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} &rarr;
                </div>
              </div>
            </Link>
          ))}
          {relatedGuidePages.map((slug) => (
            <Link
              key={slug}
              href={`/guides/${slug}`}
              className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>
                  Guide
                </span>
                <div className="text-sm font-medium group-hover:underline mt-1" style={{ color: "#92B090" }}>
                  {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} &rarr;
                </div>
              </div>
            </Link>
          ))}
          {relatedSolutionSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/solutions/${slug}`}
              className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div>
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>
                  Solution
                </span>
                <div className="text-sm font-medium group-hover:underline mt-1" style={{ color: "#92B090" }}>
                  {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main Template
// ---------------------------------------------------------------------------

interface ProgrammaticPageTemplateProps {
  page: ProgrammaticPageBase;
  /** Page variant determines which specialized content sections to render */
  variant: "glossary-deep" | "guide" | "task" | "model" | "academic-alt";
}

export default function ProgrammaticPageTemplate({
  page,
  variant,
}: ProgrammaticPageTemplateProps) {
  return (
    <GeoPageShell>
      <article>
        {/* Hero with breadcrumbs */}
        <section className="w-full pt-32 pb-12 md:pt-40 md:pb-16" style={{ backgroundColor: "#0a0908" }}>
          <div className="mx-auto max-w-4xl px-6">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-sm"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
              >
                {page.breadcrumbs.map((crumb, i) => (
                  <li key={crumb.href} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden="true" className="select-none">/</span>}
                    {i === page.breadcrumbs.length - 1 ? (
                      <span aria-current="page" style={{ color: "#92B090" }}>{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="transition-colors hover:text-white">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* H1 */}
            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              {page.h1}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
              {page.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Variant-specific content */}
        {variant === "glossary-deep" && <GlossaryDeepContent page={page as GlossaryDeepPageData} />}
        {variant === "guide" && <GuideContent page={page as GuidePageData} />}
        {variant === "task" && <TaskContent page={page as TaskPageData} />}
        {variant === "model" && <ModelContent page={page as ModelPageData} />}
        {variant === "academic-alt" && <AcademicAltContent page={page as AcademicAltPageData} />}

        {/* Generic sections */}
        {page.sections.map((section, i) => renderSection(section, i))}

        {/* FAQ */}
        {page.faqs.length > 0 && (
          <ContentFAQ
            faqs={page.faqs.map((f) => ({ question: f.question, answer: f.answer }))}
          />
        )}

        {/* Cross-links */}
        <CrossLinks
          relatedGlossaryTerms={page.relatedGlossaryTerms}
          relatedGuidePages={page.relatedGuidePages}
          relatedSolutionSlugs={page.relatedSolutionSlugs}
        />

        {/* CTA */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              {page.ctaHeading}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
              {page.ctaDescription}
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
                href="/data-catalog"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
              >
                Browse the Data Catalog
              </Link>
            </div>
          </div>
        </section>
      </article>
    </GeoPageShell>
  );
}
