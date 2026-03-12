import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ogImageUrl } from "@/lib/og";
import { getAllJobs, getJobBySlug, getJobsByCategory } from "@/lib/jobs";
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

  return {
    title,
    description,
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

  // JobPosting JSON-LD structured data
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
    ...(job.locationRequirements && {
      applicantLocationRequirements: {
        "@type": "Country",
        name: job.locationRequirements,
      },
    }),
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
      {/* JSON-LD structured data */}
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
      />
    </>
  );
}
