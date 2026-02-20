import { getAllJobs } from "@/lib/jobs";
import AdminJobsTable from "../components/AdminJobsTable";
import AdminJobsHeader from "../components/AdminJobsHeader";

/**
 * Admin jobs dashboard (server component).
 *
 * Loads every job listing from disk (including archived ones) and hands the
 * data to the interactive client-side table for sorting, searching, and
 * future archive/unarchive actions.
 *
 * Protected by middleware -- only accessible with a valid admin-token cookie.
 */
export default function AdminJobsPage() {
  const jobs = getAllJobs({ includeArchived: true });

  return (
    <div className="min-h-screen">
      <AdminJobsHeader />
      <AdminJobsTable jobs={jobs} />
    </div>
  );
}
