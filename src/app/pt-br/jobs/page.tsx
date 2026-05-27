import { getAllJobs } from "@/lib/jobs";
import {
  buildJobsItemListJsonLd,
  buildJobsFaqJsonLd,
} from "@/lib/jobs-jsonld";
import JobBoard from "@/app/jobs/JobBoard";

export default function PtBrJobsPage() {
  const jobs = getAllJobs({ locale: "pt-BR" });
  const openJobs = jobs.filter((j) => j.status !== "closed");
  const itemList = buildJobsItemListJsonLd(openJobs, "pt-BR");
  const faq = buildJobsFaqJsonLd("pt-BR");

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
      <JobBoard jobs={jobs} locale="pt-BR" basePath="/pt-br/jobs" />
    </>
  );
}
