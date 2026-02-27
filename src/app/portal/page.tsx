import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FolderOpen,
  MessageSquarePlus,
  CalendarClock,
  Database,
  Layers,
  Clock,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Lead,
  Dataset,
  LeadDatasetAccess,
  DatasetCategory,
} from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Data Fetching
// ---------------------------------------------------------------------------

async function getPortalData() {
  const supabase = await createSupabaseServerClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  // Fetch the lead record for this user
  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("supabase_user_id", user.id)
    .single<Lead>();

  if (!lead) {
    redirect("/portal/login");
  }

  // Fetch granted dataset access (with dataset info) ordered by most recent
  const { data: accessGrants } = await supabase
    .from("lead_dataset_access")
    .select(
      `
      id,
      lead_id,
      dataset_id,
      granted_at,
      granted_by,
      datasets (
        id,
        name,
        slug,
        type,
        subcategory,
        total_samples,
        total_duration_hours,
        category_id,
        dataset_categories ( id, name, slug )
      )
    `
    )
    .eq("lead_id", lead.id)
    .order("granted_at", { ascending: false });

  // Count total samples across all granted datasets
  const totalSamples =
    (accessGrants ?? []).reduce((sum, grant) => {
      const ds = grant.datasets as unknown as Dataset | null;
      return sum + (ds?.total_samples ?? 0);
    }, 0);

  // Fetch booking URL from settings (if configured)
  const { data: bookingSetting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "booking_url")
    .single<{ value: string }>();

  return {
    lead,
    accessGrants: accessGrants ?? [],
    totalDatasets: (accessGrants ?? []).length,
    totalSamples,
    bookingUrl: bookingSetting?.value ?? null,
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function PortalDashboardPage() {
  const { lead, accessGrants, totalDatasets, totalSamples, bookingUrl } =
    await getPortalData();

  // Recent activity: latest 6 grants
  const recentGrants = accessGrants.slice(0, 6);

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding)] py-12">
      {/* Welcome */}
      <section className="mb-12">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
          <span className="text-[var(--accent-primary)]">$</span> portal
          dashboard
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Welcome back,{" "}
          <span className="text-[var(--accent-primary)]">{lead.name}</span>
        </h1>
        <p className="mt-2 text-sm font-mono text-[var(--text-muted)]">
          {lead.company}
        </p>
      </section>

      {/* Quick Stats */}
      <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-primary)]/10">
              <Database
                className="h-5 w-5 text-[var(--accent-primary)]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {totalDatasets}
              </p>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                datasets available
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-primary)]/10">
              <Layers
                className="h-5 w-5 text-[var(--accent-primary)]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {totalSamples.toLocaleString()}
              </p>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                total samples
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NavCard
          href="/portal/catalog"
          icon={FolderOpen}
          title="Browse Catalog"
          description="Explore your granted datasets and samples"
        />
        <NavCard
          href="/portal/request"
          icon={MessageSquarePlus}
          title="Request Data"
          description="Submit a custom data request"
        />
        {bookingUrl ? (
          <NavCard
            href={bookingUrl}
            icon={CalendarClock}
            title="Book a Call"
            description="Schedule time with our data team"
            external
          />
        ) : (
          <NavCard
            href="/portal/request"
            icon={CalendarClock}
            title="Contact Us"
            description="Reach out to our data team"
          />
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="mb-4 text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">
          <span className="text-[var(--accent-primary)]">#</span> recent
          activity
        </h2>

        {recentGrants.length === 0 ? (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-8 text-center">
            <p className="text-sm font-mono text-[var(--text-muted)]">
              No datasets granted yet. Your catalog is being prepared.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentGrants.map((grant) => {
              const ds = grant.datasets as unknown as
                | (Dataset & {
                    dataset_categories: Pick<
                      DatasetCategory,
                      "id" | "name" | "slug"
                    > | null;
                  })
                | null;
              if (!ds) return null;

              return (
                <Link
                  key={grant.id}
                  href={`/portal/catalog/${ds.id}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-5 py-4 transition-all duration-200 hover:border-[var(--border-accent)] hover:bg-[var(--bg-card-hover)]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--accent-primary)]/10">
                      <Database
                        className="h-4 w-4 text-[var(--accent-primary)]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {ds.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {ds.dataset_categories && (
                          <span className="text-xs font-mono text-[var(--accent-primary)]">
                            {ds.dataset_categories.name}
                          </span>
                        )}
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          {ds.total_samples.toLocaleString()} samples
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    {formatRelativeDate(grant.granted_at)}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NavCard({
  href,
  icon: Icon,
  title,
  description,
  external = false,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  external?: boolean;
}) {
  const classes =
    "group flex flex-col gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 transition-all duration-200 hover:border-[var(--border-accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(146,176,144,0.06)]";

  const content = (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-primary)]/10 transition-colors duration-200 group-hover:bg-[var(--accent-primary)]/20">
        <Icon
          className="h-5 w-5 text-[var(--accent-primary)]"
          strokeWidth={1.5}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-200">
          {title}
        </h3>
        <p className="mt-1 text-xs font-mono text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
