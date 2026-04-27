"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Footer from "../components/sections/Footer";
import {
  ROWS,
  TIER_META,
  ALL_GEOS,
  type CatalogRow,
  type Tier,
  type Modality,
  type Vertical,
} from "@/data/catalog-physicalai";

type ModalityFilter = "all" | Modality;
type VerticalFilter = "all" | Vertical;
type TierFilter = "all" | Tier;

export default function CatalogPhysicalAIPage() {
  const [query, setQuery] = useState("");
  const [modality, setModality] = useState<ModalityFilter>("all");
  const [vertical, setVertical] = useState<VerticalFilter>("all");
  const [tier, setTier] = useState<TierFilter>("all");
  const [geo, setGeo] = useState<string>("all");
  const [imuOnly, setImuOnly] = useState(false);

  const filtered = useMemo(() => {
    return ROWS.filter((r) => {
      if (modality !== "all" && r.modality !== modality) return false;
      if (vertical !== "all" && r.vertical !== vertical) return false;
      if (tier !== "all" && r.tier !== tier) return false;
      if (imuOnly && !r.imu) return false;
      if (geo !== "all" && !r.geo.some((g) => g.toLowerCase().includes(geo.toLowerCase()))) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.subcategory.toLowerCase().includes(q) &&
          !r.description.toLowerCase().includes(q) &&
          !r.devices.some((d) => d.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const t = TIER_META[a.tier].order - TIER_META[b.tier].order;
      if (t !== 0) return t;
      return a.subcategory.localeCompare(b.subcategory);
    });
  }, [query, modality, vertical, tier, geo, imuOnly]);

  const counts = useMemo(() => {
    return {
      shelf: ROWS.filter((r) => r.tier === "shelf").length,
      request: ROWS.filter((r) => r.tier === "request").length,
      custom: ROWS.filter((r) => r.tier === "custom").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0A0908]">
      {/* Slim top bar — kept light for one-pager feel */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-sm font-bold tracking-widest text-[#0A0908]">
            CLARU
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="https://calendly.com/claru"
              target="_blank"
              rel="noopener"
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
            Physical AI · Data Availability
          </div>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Egocentric video & game capture catalog
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-black/65">
            What we have on the shelf, what our collector fleet can produce on request, and where we
            scope custom collection. Filter by vertical, subcategory, and geographic coverage.
          </p>
        </div>

        {/* Tier legend */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {(Object.keys(TIER_META) as Tier[]).map((t) => (
            <div
              key={t}
              className="rounded-lg border border-black/10 bg-white p-5 shadow-sm"
              style={{ borderLeftColor: TIER_META[t].color, borderLeftWidth: 4 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold">{TIER_META[t].label}</div>
                <div className="font-mono text-xs text-black/45">{counts[t]} categories</div>
              </div>
              <div className="mt-2 text-sm text-black/60">{TIER_META[t].sla}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-5 shadow-sm md:flex-row md:items-center md:flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-black/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subcategories, devices…"
              className="w-full rounded-md border border-black/10 bg-white py-3 pl-11 pr-3 text-base text-black placeholder-black/35 focus:border-[#5A7A5A] focus:outline-none focus:ring-1 focus:ring-[#5A7A5A]"
            />
          </div>
          <Select label="Modality" value={modality} onChange={(v) => setModality(v as ModalityFilter)}>
            <option value="all">All modalities</option>
            <option value="egocentric">Egocentric</option>
            <option value="game">Game capture</option>
          </Select>
          <Select label="Vertical" value={vertical} onChange={(v) => setVertical(v as VerticalFilter)}>
            <option value="all">All verticals</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="game">Game</option>
          </Select>
          <Select label="Tier" value={tier} onChange={(v) => setTier(v as TierFilter)}>
            <option value="all">All tiers</option>
            <option value="shelf">Available now</option>
            <option value="request">Available on request</option>
            <option value="custom">Custom</option>
          </Select>
          <Select label="Geo" value={geo} onChange={(v) => setGeo(v)}>
            <option value="all">All regions</option>
            {ALL_GEOS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
          <label className="flex items-center gap-2 text-sm text-black/70 cursor-pointer">
            <input
              type="checkbox"
              checked={imuOnly}
              onChange={(e) => setImuOnly(e.target.checked)}
              className="h-4 w-4 rounded border-black/20 accent-[#5A7A5A]"
            />
            <span>IMU available</span>
          </label>
        </div>

        {/* Result count */}
        <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-black/45">
          <span>{filtered.length} {filtered.length === 1 ? "category" : "categories"} match</span>
          <span className="flex items-center gap-1.5 normal-case tracking-normal">
            <span className="rounded border border-[#5A7A5A]/40 bg-[#EFF3EF] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#3F5F3F]">
              + IMU
            </span>
            <span>= gyro, accelerometer, GPS telemetry available with video</span>
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b border-black/10 bg-[#F5F4EE] font-mono text-[12px] uppercase tracking-wider text-black/50">
              <tr>
                <th className="px-5 py-4 font-normal">Category</th>
                <th className="px-5 py-4 font-normal">Vertical</th>
                <th className="px-5 py-4 font-normal">Tier</th>
                <th className="px-5 py-4 font-normal">Volume</th>
                <th className="px-5 py-4 font-normal">Capture devices</th>
                <th className="px-5 py-4 font-normal">Geographic coverage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <CatalogTableRow key={row.id} row={row} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-base text-black/55">
                    No categories match your filters. Adjust above or{" "}
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

      </main>

      <div className="bg-[#FAFAF7] border-t border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-xs leading-relaxed text-black/45">
            Volumes reflect total available capacity across our global collector network including in-process collections, partner-licensed footage, and indexed footage available for non-exclusive licensing. Final per-engagement availability is confirmed at scoping. Custom collections and exclusivity arrangements available on request.
          </p>
        </div>
      </div>
      <div className="bg-[#0a0908] text-white">
        <Footer />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-black/60">
      <span className="font-mono uppercase tracking-wider text-xs">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-base text-black focus:border-[#5A7A5A] focus:outline-none focus:ring-1 focus:ring-[#5A7A5A]"
      >
        {children}
      </select>
    </label>
  );
}

function CatalogTableRow({ row }: { row: CatalogRow }) {
  const meta = TIER_META[row.tier];
  return (
    <tr className="border-b border-black/5 align-top hover:bg-[#FAFAF7]">
      <td className="px-5 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-black">{row.subcategory}</span>
          {row.imu && (
            <span
              className="rounded border border-[#5A7A5A]/40 bg-[#EFF3EF] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#3F5F3F]"
              title="IMU telemetry (gyro, accelerometer, GPS) available alongside video"
            >
              + IMU
            </span>
          )}
        </div>
        <div className="mt-1.5 max-w-md text-sm leading-relaxed text-black/60">{row.description}</div>
        {row.notes && (
          <div className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-amber-700">
            ⚠ {row.notes}
          </div>
        )}
      </td>
      <td className="px-5 py-5 text-sm">
        <span className="rounded bg-black/5 px-2.5 py-1 capitalize text-black/70">
          {row.modality === "game" ? "Game" : row.vertical}
        </span>
      </td>
      <td className="px-5 py-5">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium"
          style={{
            background: `${meta.color}20`,
            color: meta.color === "#92B090" ? "#3F5F3F" : meta.color === "#D4A574" ? "#8B5A1F" : "#3D5168",
            border: `1px solid ${meta.color}55`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
          {meta.label}
        </span>
      </td>
      <td className="px-5 py-5 font-mono text-sm">
        <div className="text-black/85">{row.hours}</div>
        {row.clips && <div className="mt-1 text-black/45">{row.clips}</div>}
      </td>
      <td className="px-5 py-5 text-sm text-black/70">{row.devices.join(", ")}</td>
      <td className="px-5 py-5 text-sm text-black/70">{row.geo.join(", ")}</td>
    </tr>
  );
}
