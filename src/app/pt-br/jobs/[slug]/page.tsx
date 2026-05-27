import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImageUrl } from "@/lib/og";
import {
  getAllJobs,
  getJobBySlug,
  getJobsByCategory,
  hasTranslation,
} from "@/lib/jobs";
import { jobsHreflangAlternates } from "@/lib/jobs-hreflang";
import { JOB_CATEGORIES } from "@/types/job";
import JobDetailClient from "@/app/jobs/[slug]/JobDetailClient";

export async function generateStaticParams() {
  // Locale routes only exist for open roles WITH a translation overlay.
  // Untranslated and closed roles fall back to the EN route — preventing
  // English bodies from claiming inLanguage: pt-BR in JobPosting schema,
  // and keeping the en↔es-MX↔pt-BR hreflang cluster equivalent-content.
  return getAllJobs()
    .filter((j) => j.status !== "closed" && hasTranslation(j.slug, "pt-BR"))
    .map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug, "pt-BR");
  if (!job) return { title: "Vaga não encontrada | Claru" };

  const title = `${job.title} | Trabalho remoto Claru`;
  const description = job.description.substring(0, 160);
  const isClosed = job.status === "closed";

  return {
    title,
    description,
    ...(isClosed ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: `/pt-br/jobs/${job.slug}`,
      languages: jobsHreflangAlternates(`/jobs/${job.slug}`, job.slug),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://claru.ai/pt-br/jobs/${job.slug}`,
      locale: "pt_BR",
      images: [
        {
          url: ogImageUrl(job.title, { category: "job" }),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function PtBrJobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug, "pt-BR");
  if (!job || job.status === "closed" || !hasTranslation(slug, "pt-BR")) {
    notFound();
  }

  const sentences = job.description.match(/[^.!?]+[.!?]+/g) || [];
  const answerSummary =
    sentences.slice(0, 2).join(" ").trim() ||
    job.description.substring(0, 200);
  const related = getJobsByCategory(job.category, "pt-BR")
    .filter((j) => j.slug !== job.slug)
    .slice(0, 4);
  const postedDate = new Date(job.datePosted).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const categoryLabel =
    JOB_CATEGORIES[job.category as keyof typeof JOB_CATEGORIES] || job.category;

  // Closed roles are filtered out above (404), so we always emit JobPosting here.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: "Claru",
      sameAs: "https://claru.ai",
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements:
      job.targetCountries && job.targetCountries.length > 0
        ? job.targetCountries.length > 1
          ? job.targetCountries.map((c) => ({
              "@type": "Country" as const,
              name: c,
            }))
          : { "@type": "Country" as const, name: job.targetCountries[0] }
        : { "@type": "Country" as const, name: "BR" },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.compensationMin,
        maxValue: job.compensationMax,
        unitText: "HOUR",
      },
    },
    inLanguage: "pt-BR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobDetailClient
        job={job}
        answerSummary={answerSummary}
        postedDate={postedDate}
        categoryLabel={categoryLabel}
        relatedJobs={related}
        locale="pt-BR"
        basePath="/pt-br/jobs"
        englishFallback={!hasTranslation(job.slug, "pt-BR")}
        localeUrls={{
          en: `/jobs/${job.slug}`,
          ...(hasTranslation(job.slug, "es-MX")
            ? { "es-MX": `/es-mx/jobs/${job.slug}` }
            : {}),
          "pt-BR": `/pt-br/jobs/${job.slug}`,
        }}
      />
    </>
  );
}
