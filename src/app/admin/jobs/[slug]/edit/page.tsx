import { notFound } from "next/navigation";
import { getJobBySlug } from "@/lib/jobs";
import AdminJobForm from "@/app/admin/components/AdminJobForm";

interface EditJobPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Admin job edit page (server component).
 *
 * Loads the job by slug from disk and passes it to the client-side form.
 * Returns a 404 if the slug does not match any existing job file.
 *
 * Protected by middleware -- only accessible with a valid admin-token cookie.
 */
export default async function EditJobPage({ params }: EditJobPageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-mono font-semibold tracking-tight">
          claru
          <span className="text-[var(--accent-primary)]">/</span>
          admin
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-secondary)]">jobs</span>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-tertiary)]">edit</span>
        </h1>
      </header>

      <AdminJobForm job={job} />
    </div>
  );
}
