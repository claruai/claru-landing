import { getAllJobs } from "@/lib/jobs";
import {
  buildJobsItemListJsonLd,
  buildJobsFaqJsonLd,
} from "@/lib/jobs-jsonld";
import JobBoard from "./JobBoard";

/**
 * /jobs -- Server component that loads all active job listings at build time
 * and passes them to the interactive client-side JobBoard.
 *
 * Emits ItemList (open roles only) + FAQPage JSON-LD for SEO/AEO. Closed
 * roles still render in the board UI but are excluded from the ItemList so
 * crawlers don't follow expired listings.
 */
export default function JobsPage() {
  const jobs = getAllJobs();
  const openJobs = jobs.filter((j) => j.status !== "closed");
  const itemList = buildJobsItemListJsonLd(openJobs, "en");
  const faq = buildJobsFaqJsonLd("en");

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
      <JobBoard jobs={jobs} />
    </>
  );
}
