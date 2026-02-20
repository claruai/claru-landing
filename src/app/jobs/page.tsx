import { getAllJobs } from "@/lib/jobs";
import JobBoard from "./JobBoard";

/**
 * /jobs -- Server component that loads all active job listings at build time
 * and passes them to the interactive client-side JobBoard.
 */
export default function JobsPage() {
  const jobs = getAllJobs();

  return <JobBoard jobs={jobs} />;
}
