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
  // English bodies from claiming inLanguage: es-MX in JobPosting schema,
  // and keeping the en↔es-MX↔pt-BR hreflang cluster equivalent-content.
  return getAllJobs()
    .filter((j) => j.status !== "closed" && hasTranslation(j.slug, "es-MX"))
    .map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug, "es-MX");
  if (!job) return { title: "Vacante no encontrada | Claru" };

  const title = `${job.title} | Trabajo remoto Claru`;
  const description = job.description.substring(0, 160);
  const isClosed = job.status === "closed";

  return {
    title,
    description,
    ...(isClosed ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: `/es-mx/jobs/${job.slug}`,
      languages: jobsHreflangAlternates(`/jobs/${job.slug}`, job.slug),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://claru.ai/es-mx/jobs/${job.slug}`,
      locale: "es_MX",
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

export default async function EsMxJobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug, "es-MX");
  // Defensive: even if a request hits a slug without a translation overlay,
  // 404 instead of rendering an English body that claims inLanguage=es-MX.
  if (!job || job.status === "closed" || !hasTranslation(slug, "es-MX")) {
    notFound();
  }

  const sentences = job.description.match(/[^.!?]+[.!?]+/g) || [];
  const answerSummary =
    sentences.slice(0, 2).join(" ").trim() ||
    job.description.substring(0, 200);
  const related = getJobsByCategory(job.category, "es-MX")
    .filter((j) => j.slug !== job.slug)
    .slice(0, 4);
  const postedDate = new Date(job.datePosted).toLocaleDateString("es-MX", {
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
        : { "@type": "Country" as const, name: "MX" },
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
    inLanguage: "es-MX",
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
        locale="es-MX"
        basePath="/es-mx/jobs"
        englishFallback={!hasTranslation(job.slug, "es-MX")}
      />
    </>
  );
}
