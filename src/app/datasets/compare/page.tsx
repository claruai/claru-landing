import type { Metadata } from "next";
import Link from "next/link";
import { fetchOSSDatasetBySlug } from "@/lib/oss-datasets";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import type { OSSDataset } from "@/types/oss-datasets";
import { formatCount } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Compare Physical AI Datasets | Claru",
  description: "Side-by-side comparison of open-source physical AI datasets.",
  robots: { index: false }, // Don't index comparison pages
};

// ---------------------------------------------------------------------------
// Comparison Row
// ---------------------------------------------------------------------------
function ComparisonRow({
  label,
  values,
  highlight = false,
}: {
  label: string;
  values: (string | null)[];
  highlight?: boolean;
}) {
  // Check if values differ
  const unique = new Set(values.filter(Boolean));
  const differs = unique.size > 1;

  return (
    <tr className="border-b border-white/5">
      <td
        className="py-3 pr-4 text-[11px] uppercase tracking-wider text-white/40 whitespace-nowrap align-top"
        style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
      >
        {label}
      </td>
      {values.map((val, i) => (
        <td
          key={i}
          className={`py-3 px-4 text-sm text-white/70 align-top ${
            differs && highlight ? "bg-[#92B090]/5" : ""
          }`}
        >
          {val || <span className="text-white/20">--</span>}
        </td>
      ))}
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Tags Row
// ---------------------------------------------------------------------------
function TagsRow({
  label,
  tagArrays,
}: {
  label: string;
  tagArrays: string[][];
}) {
  return (
    <tr className="border-b border-white/5">
      <td
        className="py-3 pr-4 text-[11px] uppercase tracking-wider text-white/40 whitespace-nowrap align-top"
        style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
      >
        {label}
      </td>
      {tagArrays.map((tags, i) => (
        <td key={i} className="py-3 px-4 align-top">
          <div className="flex flex-wrap gap-1">
            {tags.length > 0 ? (
              tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[#92B090]"
                  style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                >
                  {t}
                </span>
              ))
            ) : (
              <span className="text-sm text-white/20">--</span>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const SLUG_RE = /^[a-z0-9][a-z0-9._-]*$/;
  const slugs =
    ids
      ?.split(",")
      .filter(Boolean)
      .filter((s) => SLUG_RE.test(s))
      .slice(0, 3) ?? [];

  if (slugs.length < 2) {
    return (
      <GeoPageShell>
        <div className="mx-auto max-w-4xl px-6 pt-40 pb-24 text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">
            Compare Datasets
          </h1>
          <p className="text-white/50 mb-6">
            Select 2-3 datasets from the{" "}
            <Link href="/datasets" className="text-[#92B090] hover:underline">
              dataset directory
            </Link>{" "}
            to compare them side-by-side.
          </p>
        </div>
      </GeoPageShell>
    );
  }

  // Fetch all datasets in parallel
  const datasets: (OSSDataset | null)[] = await Promise.all(
    slugs.map((slug) => fetchOSSDatasetBySlug(slug)),
  );
  const validDatasets = datasets.filter(Boolean) as OSSDataset[];

  if (validDatasets.length < 2) {
    return (
      <GeoPageShell>
        <div className="mx-auto max-w-4xl px-6 pt-40 pb-24 text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">
            Datasets Not Found
          </h1>
          <p className="text-white/50 mb-6">
            Could not find the requested datasets. Please try selecting again
            from the{" "}
            <Link href="/datasets" className="text-[#92B090] hover:underline">
              dataset directory
            </Link>
            .
          </p>
        </div>
      </GeoPageShell>
    );
  }

  return (
    <GeoPageShell>
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40">
        {/* Breadcrumb */}
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
            <li>
              <Link href="/datasets" className="transition-colors hover:text-white">Datasets</Link>
            </li>
            <li aria-hidden="true" className="select-none">/</li>
            <li aria-current="page" style={{ color: "#92B090" }}>Compare</li>
          </ol>
        </nav>

        <h1 className="text-2xl font-semibold text-white mb-8">
          Dataset Comparison
        </h1>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.02]">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-left" />
                {validDatasets.map((ds) => (
                  <th key={ds.slug} className="py-4 px-4 text-left">
                    <Link
                      href={`/datasets/${ds.slug}`}
                      className="text-sm font-semibold text-white hover:underline"
                    >
                      {ds.name}
                    </Link>
                    {ds.author && (
                      <p className="text-[11px] text-white/40 mt-0.5">{ds.author}</p>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                label="Description"
                values={validDatasets.map((ds) => ds.description)}
              />
              <TagsRow
                label="Modalities"
                tagArrays={validDatasets.map((ds) => ds.modalities)}
              />
              <TagsRow
                label="Embodiments"
                tagArrays={validDatasets.map((ds) => ds.robot_embodiments)}
              />
              <ComparisonRow
                label="Action Space"
                values={validDatasets.map((ds) => ds.action_space)}
                highlight
              />
              <TagsRow
                label="Environment"
                tagArrays={validDatasets.map((ds) => ds.environment_type)}
              />
              <TagsRow
                label="Task Types"
                tagArrays={validDatasets.map((ds) => ds.task_types)}
              />
              <ComparisonRow
                label="Episodes"
                values={validDatasets.map((ds) => ds.num_episodes)}
                highlight
              />
              <ComparisonRow
                label="Hours"
                values={validDatasets.map((ds) => ds.total_hours)}
                highlight
              />
              <ComparisonRow
                label="Data Format"
                values={validDatasets.map((ds) => ds.data_format)}
                highlight
              />
              <TagsRow
                label="Annotations"
                tagArrays={validDatasets.map((ds) => ds.annotation_types)}
              />
              <ComparisonRow
                label="License"
                values={validDatasets.map((ds) => ds.license)}
                highlight
              />
              <ComparisonRow
                label="Year"
                values={validDatasets.map((ds) =>
                  ds.year_released ? String(ds.year_released) : null,
                )}
                highlight
              />
              <ComparisonRow
                label="Downloads"
                values={validDatasets.map((ds) => formatCount(ds.hf_downloads))}
                highlight
              />
              <ComparisonRow
                label="Citations"
                values={validDatasets.map((ds) =>
                  ds.citation_count ? String(ds.citation_count) : null,
                )}
                highlight
              />
              <tr className="border-b border-white/5">
                <td
                  className="py-3 pr-4 text-[11px] uppercase tracking-wider text-white/40 whitespace-nowrap align-top"
                  style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                >
                  Links
                </td>
                {validDatasets.map((ds) => (
                  <td key={ds.slug} className="py-3 px-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://huggingface.co/datasets/${ds.dataset_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-[#92B090] hover:underline"
                        style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                      >
                        HuggingFace
                      </a>
                      {ds.paper_url && (
                        <a
                          href={ds.paper_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] text-[#92B090] hover:underline"
                          style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                        >
                          Paper
                        </a>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/datasets"
            className="text-sm text-white/50 hover:text-white/80 transition-colors"
            style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
          >
            Back to dataset directory
          </Link>
        </div>
      </div>
    </GeoPageShell>
  );
}
