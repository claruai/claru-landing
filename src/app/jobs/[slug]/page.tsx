import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ogImageUrl } from "@/lib/og";
import { getAllJobs, getJobBySlug, getJobsByCategory } from "@/lib/jobs";
import { jobsHreflangAlternates } from "@/lib/jobs-hreflang";
import { JOB_CATEGORIES } from "@/types/job";
import JobDetailClient from "./JobDetailClient";

/* ==========================================================================
   STATIC GENERATION
   ========================================================================== */

export async function generateStaticParams() {
  const jobs = getAllJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

/* ==========================================================================
   DYNAMIC METADATA
   ========================================================================== */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found | Claru AI Jobs",
    };
  }

  const title = `${job.title} | Claru AI Jobs`;
  const description = job.description.substring(0, 160);
  const isClosed = job.status === "closed";

  return {
    title,
    description,
    ...(isClosed ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: `/jobs/${job.slug}`,
      languages: jobsHreflangAlternates(`/jobs/${job.slug}`),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://claru.ai/jobs/${job.slug}`,
      images: [{ url: ogImageUrl(job.title, { category: "job" }), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ==========================================================================
   PAGE (SERVER COMPONENT)
   ========================================================================== */

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  // Build the answer block: first 2 sentences of the description
  const sentences = job.description.match(/[^.!?]+[.!?]+/g) || [];
  const answerSummary =
    sentences.slice(0, 2).join(" ").trim() ||
    job.description.substring(0, 200);

  // Related positions: same category, exclude current, max 4
  const related = getJobsByCategory(job.category)
    .filter((j) => j.slug !== job.slug)
    .slice(0, 4);

  // Format posted date for display
  const postedDate = new Date(job.datePosted).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Category label
  const categoryLabel =
    JOB_CATEGORIES[job.category as keyof typeof JOB_CATEGORIES] || job.category;

  // JobPosting JSON-LD structured data — emitted only for open roles so Google
  // Jobs doesn't surface closed listings as expired.
  const isClosed = job.status === "closed";
  const jsonLd = isClosed
    ? null
    : {
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
        ...(() => {
          const countries = (job.locationRequirements ?? "")
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
          if (countries.length === 0) return {};
          const toEntry = (name: string) => ({
            "@type": "Country" as const,
            name,
          });
          return {
            applicantLocationRequirements:
              countries.length > 1
                ? countries.map(toEntry)
                : toEntry(countries[0]),
          };
        })(),
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
      };

  return (
    <>
      {/* JSON-LD structured data — open roles only */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <JobDetailClient
        job={job}
        answerSummary={answerSummary}
        postedDate={postedDate}
        categoryLabel={categoryLabel}
        relatedJobs={related}
      />
    </>
  );
}
