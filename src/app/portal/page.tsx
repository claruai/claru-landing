import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FolderOpen,
  CalendarClock,
  Database,
  Layers,
  ShieldX,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OtherDatasets } from "./catalog/OtherDatasets";
import { PortalIdentify } from "../components/portal/PortalIdentify";
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
    return { noAccess: true as const, email: user.email ?? "" };
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

  // Count total dataset size across all granted datasets
  const totalSamples =
    (accessGrants ?? []).reduce((sum, grant) => {
      const ds = grant.datasets as unknown as Dataset | null;
      return sum + (ds?.total_samples ?? 0);
    }, 0);

  // Count actual viewable clips (rows in dataset_clips for granted datasets)
  const grantedDatasetIds = (accessGrants ?? [])
    .map((g) => (g.datasets as unknown as Dataset | null)?.id)
    .filter(Boolean) as string[];

  let viewableSamples = 0;
  if (grantedDatasetIds.length > 0) {
    const { count } = await supabase
      .from("dataset_clips")
      .select("id", { count: "exact", head: true })
      .in("dataset_id", grantedDatasetIds);
    viewableSamples = count ?? 0;
  }

  // Fetch booking URL from settings (if configured)
  const { data: bookingSetting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "booking_url")
    .single<{ value: string }>();

  // Fetch other published datasets via anon client (bypasses authenticated RLS)
  const grantedIds = (accessGrants ?? [])
    .map((g) => (g.datasets as unknown as Dataset | null)?.id)
    .filter(Boolean) as string[];

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: allPublished } = await anonClient
    .from("datasets")
    .select("id, name, description, total_samples, source_type, dataset_categories(name)")
    .eq("is_published", true)
    .order("total_samples", { ascending: false });

  const otherDatasets = (allPublished ?? [])
    .filter((d) => !grantedIds.includes(d.id))
    .map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      total_samples: d.total_samples,
      source_type: d.source_type,
      category_name: (d.dataset_categories as unknown as { name: string } | null)?.name ?? null,
    }));

  return {
    noAccess: false as const,
    lead,
    accessGrants: accessGrants ?? [],
    totalDatasets: (accessGrants ?? []).length,
    totalSamples,
    viewableSamples,
    bookingUrl: bookingSetting?.value ?? null,
    otherDatasets,
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function PortalDashboardPage() {
  const data = await getPortalData();

  if (data.noAccess) {
    return <NoAccessView email={data.email} />;
  }

  const { lead, accessGrants, totalDatasets, totalSamples, viewableSamples, bookingUrl, otherDatasets } = data;

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding)] py-12">
      {/* PostHog identify — ties anonymous session to this lead */}
      <PortalIdentify
        email={lead.email}
        name={lead.name}
        company={lead.company}
        leadStatus={lead.status}
        datasetsCount={totalDatasets}
      />

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
      <section className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                total assets
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-primary)]/10">
              <FolderOpen
                className="h-5 w-5 text-[var(--accent-primary)]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {viewableSamples}
              </p>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                samples to explore
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NavCard
          href="/portal/catalog"
          icon={FolderOpen}
          title="Browse Catalog"
          description="Explore your granted datasets and samples"
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
            href="mailto:team@claru.ai"
            icon={CalendarClock}
            title="Contact Us"
            description="Reach out to our data team"
            external
          />
        )}
      </section>

      {/* Your Datasets */}
      <section>
        <h2 className="mb-4 text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">
          <span className="text-[var(--accent-primary)]">#</span> your
          datasets
        </h2>

        {accessGrants.length === 0 ? (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-8 text-center">
            <p className="text-sm font-mono text-[var(--text-muted)]">
              No datasets granted yet. Your catalog is being prepared.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {accessGrants.map((grant) => {
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
                          {ds.total_samples.toLocaleString()} assets
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Other available datasets */}
      {otherDatasets.length > 0 && (
        <OtherDatasets datasets={otherDatasets} bookingUrl={bookingUrl ?? "mailto:team@claru.ai"} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// No Access View
// ---------------------------------------------------------------------------

function NoAccessView({ email }: { email: string }) {
  return (
    <div className="mx-auto max-w-md px-[var(--container-padding)] py-24 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--error)]/10">
        <ShieldX
          className="h-7 w-7 text-[var(--error)]"
          strokeWidth={1.5}
        />
      </div>
      <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] mb-2">
        Access not authorized
      </h1>
      <p className="text-sm font-mono text-[var(--text-muted)] leading-relaxed mb-2">
        <span className="text-[var(--text-secondary)]">{email}</span> is not
        associated with an active portal account.
      </p>
      <p className="text-sm font-mono text-[var(--text-muted)] leading-relaxed mb-8">
        If you believe this is an error, please contact your Claru representative
        or reach out to{" "}
        <a
          href="mailto:team@claru.ai"
          className="text-[var(--accent-primary)] hover:underline"
        >
          team@claru.ai
        </a>
        .
      </p>
      <a
        href="/portal/login"
        className="inline-block px-5 py-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-sm font-mono text-[var(--text-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-card-hover)] transition-colors duration-200"
      >
        sign in with a different email
      </a>
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

