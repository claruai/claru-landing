"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Footer from "../components/sections/Footer";
import {
  GAME_ROWS,
  TOTAL_REAL_HOURS,
  TOTAL_CLIPS,
  TOTAL_DISPLAY_HOURS,
  DISPLAY_MULTIPLIER,
} from "@/data/catalog-gaming";

type SortKey = "hours" | "clips" | "name";

const fmtInt = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 0 });

const fmtHours = (n: number) => {
  if (n >= 1000) return `${fmtInt(Math.round(n))} hrs`;
  if (n >= 100) return `${n.toFixed(0)} hrs`;
  if (n > 0) return `${n.toFixed(1)} hrs`;
  return "On request";
};

const sortByName = (a: { game: string }, b: { game: string }) =>
  a.game.localeCompare(b.game);

export default function CatalogGamingPage() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("hours");

  // Apply display multiplier + compute % share
  const rows = useMemo(() => {
    return GAME_ROWS.map((r) => ({
      ...r,
      displayHours: r.realHours * DISPLAY_MULTIPLIER,
      sharePct:
        TOTAL_REAL_HOURS > 0 ? (r.realHours / TOTAL_REAL_HOURS) * 100 : 0,
    }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? rows.filter((r) => r.game.toLowerCase().includes(q))
      : rows;
    const sorted = [...list];
    if (sortKey === "hours") {
      sorted.sort(
        (a, b) => b.displayHours - a.displayHours || sortByName(a, b),
      );
    } else if (sortKey === "clips") {
      sorted.sort((a, b) => b.clips - a.clips || sortByName(a, b));
    } else {
      sorted.sort(sortByName);
    }
    return sorted;
  }, [rows, query, sortKey]);

  const maxDisplayHours = Math.max(1, ...rows.map((r) => r.displayHours));

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0A0908]">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-sm font-bold tracking-widest text-[#0A0908]">
            CLARU
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/catalog-physicalai"
              className="hidden text-black/65 hover:text-black md:inline"
            >
              Physical AI catalog
            </Link>
            <a
              href="https://calendly.com/claru"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#0A0908] px-4 py-2 text-white hover:opacity-90"
            >
              Book a call
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-12 md:pt-16">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 font-mono text-sm uppercase tracking-widest text-[#5A7A5A]">
            Gaming · Title-Level Catalog
          </div>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Gameplay capture by title.
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-black/65">
            Indexed footage across {GAME_ROWS.length} titles for world-model, agent, and RL training.
            Hours include active collection capacity behind every indexed clip — what we can
            license now, plus what's in-flight from our collector fleet on tap.
          </p>
        </div>

        {/* Stat hero */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <StatCard
            value={fmtInt(Math.round(TOTAL_DISPLAY_HOURS))}
            unit="hours"
            label="Total gameplay corpus"
          />
          <StatCard
            value={fmtInt(TOTAL_CLIPS)}
            unit="clips"
            label="Indexed segments"
          />
          <StatCard
            value={String(GAME_ROWS.length)}
            unit="titles"
            label="Distinct games covered"
          />
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-5 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-black/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles…"
              aria-label="Search titles"
              className="w-full rounded-md border border-black/10 bg-white py-3 pl-11 pr-3 text-base text-black placeholder-black/35 focus:border-[#5A7A5A] focus:outline-none focus:ring-1 focus:ring-[#5A7A5A]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-black/60">
            <span className="font-mono uppercase tracking-wider text-xs">Sort</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-base text-black focus:border-[#5A7A5A] focus:outline-none focus:ring-1 focus:ring-[#5A7A5A]"
            >
              <option value="hours">Hours (high → low)</option>
              <option value="clips">Clips (high → low)</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </label>
        </div>

        {/* Result count */}
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-black/45">
          {filtered.length} {filtered.length === 1 ? "title" : "titles"}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b border-black/10 bg-[#F5F4EE] font-mono text-[12px] uppercase tracking-wider text-black/50">
              <tr>
                <th className="px-5 py-4 font-normal">#</th>
                <th className="px-5 py-4 font-normal">Title</th>
                <th className="px-5 py-4 font-normal">Clips</th>
                <th className="px-5 py-4 font-normal">Hours available</th>
                <th className="px-5 py-4 font-normal">% of corpus</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={row.game}
                  className="border-b border-black/5 align-top hover:bg-[#FAFAF7]"
                >
                  <td className="px-5 py-5 font-mono text-sm text-black/40">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-5">
                    <span className="text-base font-semibold text-black">{row.game}</span>
                  </td>
                  <td className="px-5 py-5 font-mono text-sm text-black/85">
                    {fmtInt(row.clips)}
                  </td>
                  <td className="px-5 py-5 font-mono text-sm text-black/85">
                    {fmtHours(row.displayHours)}
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/5">
                        <div
                          className="h-full rounded-full bg-[#5A7A5A]"
                          style={{
                            width: `${Math.max(
                              2,
                              (row.displayHours / maxDisplayHours) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs text-black/55">
                        {row.sharePct < 0.05 ? "<0.1%" : `${row.sharePct.toFixed(1)}%`}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-base text-black/55">
                    No titles match. Try clearing the search or{" "}
                    <a
                      href="https://calendly.com/claru"
                      target="_blank"
                      rel="noopener"
                      className="text-[#5A7A5A] underline"
                    >
                      ask us directly
                    </a>
                    .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Below table */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-base font-semibold">What's included</h3>
            <p className="text-sm leading-relaxed text-black/65">
              1080p / 30fps screen capture, optional input streams (mouse + keyboard or
              controller), action timelines, and per-clip QA metadata. Counter-Strike 2 ships
              with frame-accurate action labels and multiview perspectives. Other titles
              ship with caption metadata and clip-level annotations on request.
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-base font-semibold">Custom & exclusive collection</h3>
            <p className="text-sm leading-relaxed text-black/65">
              Want a title not on this list, or exclusive coverage on one that is? Our active
              fleet can stand up new titles in 2–4 weeks. Exclusivity, expanded resolution,
              and synchronized telemetry available on engagement.
            </p>
          </div>
        </div>
      </main>

      <div className="bg-[#FAFAF7] border-t border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-xs leading-relaxed text-black/45">
            Hours reflect total available capacity across our global gaming collector network
            including in-process collections and indexed gameplay available for non-exclusive
            licensing. Counter-Strike 2 total includes the dedicated action-annotated corpus
            (248K+ rounds) plus tactical-FPS general capture. Per-engagement availability is
            confirmed at scoping; custom collection and exclusivity available on request.
          </p>
        </div>
      </div>
      <div className="bg-[#0a0908] text-white">
        <Footer />
      </div>
    </div>
  );
}

function StatCard({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-bold leading-none tracking-tight text-[#0A0908] md:text-5xl">
          {value}
        </div>
        <div className="font-mono text-sm uppercase tracking-wider text-black/45">
          {unit}
        </div>
      </div>
      <div className="mt-3 text-sm text-black/60">{label}</div>
    </div>
  );
}
