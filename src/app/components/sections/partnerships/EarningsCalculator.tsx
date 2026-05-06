"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── PRICING MATRIX ──────────────────────────────────────────────────────────
// Hourly rate ranges (USD) by mode × region × tier.
// Residential = personal/household captures (smart-glasses on a parent, daily-life
// POV, etc.). Commercial = workforce capture inside a business.
type Region = {
  id: string;
  label: string;
  short: string;
  // multiplier off the residential US baseline
};

const REGIONS: Region[] = [
  { id: "asia_africa", label: "Asia & Africa", short: "Asia/Africa" },
  { id: "latam_eeu", label: "Latin America & E. Europe", short: "LatAm/E.EU" },
  { id: "us_eu_anz", label: "US, Western EU & ANZ", short: "US/EU/ANZ" },
];

const RESIDENTIAL_RATES: Record<string, { low: number; high: number }> = {
  asia_africa: { low: 5, high: 10 },
  latam_eeu: { low: 8, high: 15 },
  us_eu_anz: { low: 15, high: 25 },
};

type Tier = 1 | 2 | 3;

const COMMERCIAL_RATES: Record<string, Record<Tier, { low: number; high: number }>> = {
  asia_africa: {
    1: { low: 10, high: 20 },
    2: { low: 18, high: 35 },
    3: { low: 30, high: 55 },
  },
  latam_eeu: {
    1: { low: 15, high: 30 },
    2: { low: 28, high: 55 },
    3: { low: 45, high: 85 },
  },
  us_eu_anz: {
    1: { low: 25, high: 45 },
    2: { low: 50, high: 90 },
    3: { low: 80, high: 150 },
  },
};

type Vertical = {
  id: string;
  label: string;
  tier: Tier;
};

const VERTICALS: Vertical[] = [
  { id: "food_retail", label: "Food & Retail", tier: 1 },
  { id: "hospitality", label: "Hospitality & Cleaning", tier: 1 },
  { id: "agriculture", label: "Agriculture", tier: 1 },
  { id: "trades_auto", label: "Trades & Auto", tier: 2 },
  { id: "manufacturing", label: "Manufacturing", tier: 2 },
  { id: "logistics", label: "Logistics & Packaging", tier: 2 },
  { id: "healthcare", label: "Healthcare", tier: 3 },
  { id: "robotics", label: "Robotics & Specialized", tier: 3 },
];

const WORKER_STOPS = [1, 5, 25, 100];
const HOUR_STOPS = [1, 3, 8, 16];
const WEEKS_PER_MONTH = 4.3;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `$${Math.round(n / 1000)}K`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function useTickingNumber(target: number, active: boolean): number {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const fromRef = useRef<number>(target);
  const startRef = useRef<number>(0);
  const targetRef = useRef<number>(target);

  useEffect(() => {
    if (!active) {
      setDisplay(target);
      return;
    }
    fromRef.current = display;
    targetRef.current = target;
    startRef.current = performance.now();
    const duration = 600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const next = fromRef.current + (targetRef.current - fromRef.current) * eased;
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, active]);
  return display;
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Stepper({
  label,
  value,
  stops,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  stops: number[];
  onChange: (v: number) => void;
  unit: string;
}) {
  const idx = stops.indexOf(value);
  const canDec = idx > 0;
  const canInc = idx < stops.length - 1;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          {unit}
        </span>
      </div>
      <div className="flex items-stretch border border-[var(--border-subtle)] bg-black/30">
        <button
          type="button"
          onClick={() => canDec && onChange(stops[idx - 1])}
          disabled={!canDec}
          className="flex h-12 w-12 items-center justify-center font-mono text-lg text-white/70 transition-colors hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-25"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <div className="flex flex-1 items-center justify-center border-x border-[var(--border-subtle)] tabular-nums">
          <span className="font-mono text-2xl text-white">
            {value}
            {value === stops[stops.length - 1] ? "+" : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={() => canInc && onChange(stops[idx + 1])}
          disabled={!canInc}
          className="flex h-12 w-12 items-center justify-center font-mono text-lg text-white/70 transition-colors hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-25"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
      <div className="flex gap-1">
        {stops.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`flex-1 border py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              s === value
                ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                : "border-[var(--border-subtle)] text-white/45 hover:border-white/30 hover:text-white/70"
            }`}
          >
            {s}
            {s === stops[stops.length - 1] ? "+" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  columns = 3,
}: {
  options: { id: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  columns?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
        {label}
      </span>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`group relative px-3 py-2.5 text-left transition-all ${
              value === o.id
                ? "border-l-2 border-l-[var(--accent-primary)] border-y border-r border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/8 text-white"
                : "border-l-2 border-l-transparent border-y border-r border-[var(--border-subtle)] bg-black/20 text-white/65 hover:border-white/20 hover:text-white"
            }`}
          >
            <div className="text-sm font-medium leading-tight">{o.label}</div>
            {o.sub && (
              <div
                className={`mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${
                  value === o.id ? "text-[var(--accent-primary)]/80" : "text-white/35"
                }`}
              >
                {o.sub}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ModeToggle({
  value,
  onChange,
}: {
  value: "residential" | "commercial";
  onChange: (v: "residential" | "commercial") => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
        Capture type
      </span>
      <div className="grid grid-cols-2 gap-2 rounded-none border border-[var(--border-subtle)] bg-black/30 p-1">
        {(["residential", "commercial"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={`relative px-4 py-3 text-left transition-all ${
              value === m
                ? "bg-[var(--accent-primary)]/15 text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-primary)]/80">
              {m === "residential" ? "// 01" : "// 02"}
            </div>
            <div className="mt-1 text-base font-semibold capitalize">{m}</div>
            <div
              className={`mt-0.5 text-[11px] leading-tight ${
                value === m ? "text-white/65" : "text-white/40"
              }`}
            >
              {m === "residential"
                ? "Smart-glasses, household, daily-life POV"
                : "Workforce capture inside a business"}
            </div>
            {value === m && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent-primary)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function EarningsCalculator() {
  const [mode, setMode] = useState<"residential" | "commercial">("commercial");
  const [region, setRegion] = useState<string>("us_eu_anz");
  const [verticalId, setVerticalId] = useState<string>("trades_auto");
  const [workers, setWorkers] = useState<number>(5);
  const [hpw, setHpw] = useState<number>(3);
  const [hasArchive, setHasArchive] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const vertical = useMemo(
    () => VERTICALS.find((v) => v.id === verticalId) ?? VERTICALS[3],
    [verticalId]
  );

  const rate = useMemo(() => {
    // Defensive lookups — if a future state-source passes an invalid region
    // (URL state, A/B variant, etc.) we fall back to the most expensive band
    // rather than throw at render.
    const fallback = { low: 15, high: 25 };
    if (mode === "residential") {
      return RESIDENTIAL_RATES[region] ?? fallback;
    }
    const tierTable = COMMERCIAL_RATES[region];
    if (!tierTable) return fallback;
    return tierTable[vertical.tier] ?? fallback;
  }, [mode, region, vertical]);

  const { monthlyLow, monthlyHigh, annualLow, annualHigh } = useMemo(() => {
    const base = workers * hpw * WEEKS_PER_MONTH;
    const ml = Math.round((base * rate.low) / 100) * 100;
    const mh = Math.round((base * rate.high) / 100) * 100;
    return {
      monthlyLow: ml,
      monthlyHigh: mh,
      annualLow: ml * 12,
      annualHigh: mh * 12,
    };
  }, [workers, hpw, rate]);

  const tickedLow = useTickingNumber(monthlyLow, inView);
  const tickedHigh = useTickingNumber(monthlyHigh, inView);

  const regionLabel = REGIONS.find((r) => r.id === region)?.short ?? "";

  return (
    <section
      ref={sectionRef}
      id="estimator"
      className="relative border-t border-[var(--border-subtle)] py-20 md:py-28"
    >
      {/* Elevated section background — subtle radial sage glow + slight lift */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 30%, rgba(146,176,144,0.04) 0%, rgba(146,176,144,0.015) 40%, transparent 80%)",
        }}
      />
      {/* Faint scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-5xl">
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12"
          >
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent-primary)]">
              <span className="flex items-center gap-1.5">
                <span
                  className="block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]"
                  style={{ animation: "pulseLive 1.6s ease-in-out infinite" }}
                />
                LIVE
              </span>
              <span>{"// PARTNER_EARNINGS_ESTIMATOR"}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              See what your team could earn.
            </h2>
            <p className="max-w-2xl text-sm text-white/65 md:text-base">
              A directional range based on capture type, region, and your team
              size. Exact rates land on the discovery call.
            </p>
          </motion.div>

          {/* card frame */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm shadow-[0_0_60px_rgba(0,0,0,0.4)]"
          >
            {/* corner crosshairs */}
            {[
              "top-1.5 left-1.5",
              "top-1.5 right-1.5",
              "bottom-1.5 left-1.5",
              "bottom-1.5 right-1.5",
            ].map((pos, i) => (
              <span
                key={i}
                className={`pointer-events-none absolute ${pos} z-10 h-3 w-3 border-[var(--accent-primary)]/50`}
                style={{
                  borderTopWidth: pos.includes("top") ? 1 : 0,
                  borderBottomWidth: pos.includes("bottom") ? 1 : 0,
                  borderLeftWidth: pos.includes("left") ? 1 : 0,
                  borderRightWidth: pos.includes("right") ? 1 : 0,
                }}
              />
            ))}

            {/* HUD bar */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 md:px-7">
              <span className="flex items-center gap-1.5">
                <span className="block h-1 w-1 rounded-full bg-[var(--accent-primary)]" />
                INPUT
              </span>
              <span className="hidden md:inline">RATE_TABLE_v2</span>
              <span>OUTPUT ▸</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
              {/* INPUT panel */}
              <div className="flex flex-col gap-7 border-b border-[var(--border-subtle)] p-6 md:p-8 lg:border-b-0 lg:border-r">
                <ModeToggle value={mode} onChange={setMode} />

                <ChipGroup<string>
                  label="Region"
                  options={REGIONS.map((r) => ({
                    id: r.id,
                    label: r.label,
                    sub:
                      mode === "residential"
                        ? `$${RESIDENTIAL_RATES[r.id].low}–$${RESIDENTIAL_RATES[r.id].high}/hr`
                        : undefined,
                  }))}
                  value={region}
                  onChange={setRegion}
                  columns={3}
                />

                {mode === "commercial" && (
                  <ChipGroup<string>
                    label="Vertical"
                    options={VERTICALS.map((v) => ({
                      id: v.id,
                      label: v.label,
                      sub: `Tier ${v.tier}`,
                    }))}
                    value={verticalId}
                    onChange={setVerticalId}
                    columns={2}
                  />
                )}

                <div className="grid grid-cols-2 gap-5">
                  <Stepper
                    label={mode === "residential" ? "Capture devices" : "Workers capturing"}
                    value={workers}
                    stops={WORKER_STOPS}
                    onChange={setWorkers}
                    unit={mode === "residential" ? "people" : "people"}
                  />
                  <Stepper
                    label="Hours per week"
                    value={hpw}
                    stops={HOUR_STOPS}
                    onChange={setHpw}
                    unit="hrs / each"
                  />
                </div>

                {mode === "commercial" && (
                  <div className="border border-[var(--border-subtle)] bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                          Optional · existing footage
                        </div>
                        <div className="mt-1 text-sm text-white">
                          We have months of archive footage
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-white/40">
                          Adds a one-time license alongside capture earnings.
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={hasArchive}
                        onClick={() => setHasArchive((v) => !v)}
                        className={`relative h-6 w-11 flex-shrink-0 border transition-colors ${
                          hasArchive
                            ? "border-[var(--accent-primary)]/60 bg-[var(--accent-primary)]/20"
                            : "border-[var(--border-subtle)] bg-black/30"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 block h-4 w-4 transition-all ${
                            hasArchive
                              ? "left-[calc(100%-1.125rem)] bg-[var(--accent-primary)]"
                              : "left-0.5 bg-white/40"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* OUTPUT panel */}
              <div className="relative flex flex-col p-6 md:p-8">
                <div
                  className="pointer-events-none absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(146,176,144,0.04) 0px, rgba(146,176,144,0.04) 1px, transparent 1px, transparent 6px)",
                  }}
                />

                <div className="relative flex flex-1 flex-col">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
                    Estimated monthly partner revenue
                  </div>

                  <div className="mt-3 flex items-baseline gap-2 tabular-nums">
                    <span className="font-mono text-4xl font-bold text-[var(--accent-primary)] md:text-5xl">
                      {formatUSD(tickedLow)}
                    </span>
                    <span className="font-mono text-2xl text-white/40 md:text-3xl">
                      –
                    </span>
                    <span className="font-mono text-4xl font-bold text-[var(--accent-primary)] md:text-5xl">
                      {formatUSD(tickedHigh)}
                    </span>
                  </div>

                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                    / month · {regionLabel}
                  </div>

                  <div className="mt-4 flex flex-col gap-1 font-mono text-[11px] text-white/45">
                    <div className="flex justify-between">
                      <span>{workers} {mode === "residential" ? "captures" : "workers"} · {hpw} hrs/wk</span>
                      <span className="text-white/30">
                        ${rate.low}–${rate.high}/hr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="capitalize">
                        {mode === "commercial" ? vertical.label : "Residential"}
                      </span>
                      <span className="text-white/30">
                        ~{formatUSD(annualLow)}–{formatUSD(annualHigh)}/yr
                      </span>
                    </div>
                  </div>

                  {hasArchive && mode === "commercial" && (
                    <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-primary)]">
                        + Archive license
                      </div>
                      <div className="mt-1 font-mono text-2xl text-white">
                        $5K–$50K
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                        one-time, paid net-15
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-7">
                    <a
                      href="#apply"
                      className="btn-primary block w-full text-center font-mono text-sm py-3"
                    >
                      See if your business qualifies →
                    </a>
                    <p className="mt-3 font-mono text-[10px] leading-relaxed text-white/40">
                      Directional only. Actual rates depend on data quality, spec
                      match, and exclusivity. We confirm exact numbers on the
                      discovery call.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulseLive {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </section>
  );
}
