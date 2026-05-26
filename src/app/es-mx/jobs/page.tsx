import { getAllJobs } from "@/lib/jobs";
import {
  buildJobsItemListJsonLd,
  buildJobsFaqJsonLd,
} from "@/lib/jobs-jsonld";
import JobBoard from "@/app/jobs/JobBoard";

export default function EsMxJobsPage() {
  const jobs = getAllJobs({ locale: "es-MX" });
  const openJobs = jobs.filter((j) => j.status !== "closed");
  const itemList = buildJobsItemListJsonLd(openJobs, "es-MX");
  const faq = buildJobsFaqJsonLd("es-MX");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <JobBoard jobs={jobs} locale="es-MX" basePath="/es-mx/jobs" />
    </>
  );
}
