import Link from "next/link";
import {
  Briefcase,
  Users,
  Database,
  Settings,
  ArrowRight,
} from "lucide-react";
import { getAllJobs } from "@/lib/jobs";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminDashboardPage() {
  // Fetch stats from each module
  const jobs = getAllJobs({ includeArchived: true });
  const jobCount = jobs.length;
  const activeJobCount = jobs.filter((j) => !j.archived).length;

  let leadTotal = 0;
  let leadPending = 0;
  let datasetCount = 0;

  try {
    const supabase = createSupabaseAdminClient();

    const { count: lTotal } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });
    leadTotal = lTotal ?? 0;

    const { count: lPending } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    leadPending = lPending ?? 0;

    const { count: dCount } = await supabase
      .from("datasets")
      .select("*", { count: "exact", head: true });
    datasetCount = dCount ?? 0;
  } catch {
    // Supabase may not be set up yet — graceful fallback
  }

  const modules = [
    {
      href: "/admin/jobs",
      icon: Briefcase,
      title: "Job Board",
      description: "Manage job listings, archive positions, edit content",
      stat: `${activeJobCount} active / ${jobCount} total`,
      color: "text-blue-400",
    },
    {
      href: "/admin/leads",
      icon: Users,
      title: "Leads",
      description:
        "Review access requests, approve or reject, grant dataset access",
      stat: leadPending > 0 ? `${leadPending} pending` : `${leadTotal} total`,
      highlight: leadPending > 0,
      color: "text-[var(--accent-primary)]",
    },
    {
      href: "/admin/catalog",
      icon: Database,
      title: "Data Catalog",
      description: "Manage datasets, upload samples, organize categories",
      stat: `${datasetCount} datasets`,
      color: "text-purple-400",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      title: "Settings",
      description:
        "Configure booking URL, preview email templates, manage system settings",
      stat: "",
      color: "text-[var(--text-tertiary)]",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-[var(--accent-primary)]">
              claru
            </span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="font-mono text-sm text-[var(--text-secondary)]">
              admin
            </span>
          </div>
          <Link
            href="/api/admin/logout"
            className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
          >
            [logout]
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <p className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider mb-2">
            {"// ADMIN PORTAL"}
          </p>
          <h1 className="text-2xl font-bold mb-2">Welcome back.</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Manage your job board, data catalog, leads, and settings.
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 hover:border-[var(--accent-primary)]/40 transition-all duration-300 hover:translate-y-[-2px]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center ${mod.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-base mb-1">{mod.title}</h3>
                <p className="text-[var(--text-tertiary)] text-sm mb-3 leading-relaxed">
                  {mod.description}
                </p>
                {mod.stat && (
                  <span
                    className={`font-mono text-xs ${
                      "highlight" in mod && mod.highlight
                        ? "text-[var(--warning)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {mod.stat}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
