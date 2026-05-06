"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import TextScramble from "../../effects/TextScramble";
import { useLazyVideo } from "../../../hooks/useLazyVideo";

type Tile = {
  code: string;
  slug: string;
  title: string;
  blurb: string;
  loc: string;
  src: string;
};

const TILES: Tile[] = [
  {
    code: "01",
    slug: "textile_garment",
    title: "Textile & Garment",
    blurb:
      "Sewing lines, cut-and-sew floors, embroidery, knitwear, denim, leather. POV at the machine.",
    loc: "Production floor",
    src: "/videos/wall/01_wall_textile_sewing.mp4",
  },
  {
    code: "02",
    slug: "auto_mechanic",
    title: "Auto Mechanic",
    blurb:
      "Engine bays, brake jobs, bodywork, oil and lube. Hands on tools, real shop conditions.",
    loc: "Independent garage",
    src: "/videos/wall/02_wall_mechanic_garage.mp4",
  },
  {
    code: "03",
    slug: "agriculture",
    title: "Agriculture & Harvest",
    blurb:
      "Fields, greenhouses, livestock, post-harvest sorting. Outdoor capture across regions.",
    loc: "Market garden",
    src: "/videos/wall/03_wall_farm_harvest.mp4",
  },
  {
    code: "04",
    slug: "auto_assembly",
    title: "Manufacturing Line",
    blurb:
      "Assembly, welding, torque, paint, QA. Industrial environments, repetitive precision.",
    loc: "Auto assembly",
    src: "/videos/wall/04_wall_auto_assembly.mp4",
  },
  {
    code: "05",
    slug: "retail_cashier",
    title: "Retail & Hospitality",
    blurb:
      "Cashier, host stand, packaging, customer interaction. Cameras already running.",
    loc: "Convenience store",
    src: "/videos/wall/05_wall_convenience_cashier.mp4",
  },
  {
    code: "06",
    slug: "cleaning_service",
    title: "Cleaning & Janitorial",
    blurb:
      "Office turnover, hospitality housekeeping, deep-clean crews, window wash, sanitation.",
    loc: "Commercial cleaning",
    src: "/videos/wall/06_wall_cleaning_service.mp4",
  },
];

function WorkforceTile({
  tile,
  idx,
  hovered,
  onHover,
  onLeave,
}: {
  tile: Tile;
  idx: number;
  hovered: number | null;
  onHover: () => void;
  onLeave: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const [scrambleKey, setScrambleKey] = useState(0);

  useLazyVideo(videoRef, { tcRef });

  const isDimmed = hovered !== null && hovered !== idx;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: idx * 0.08 }}
      onMouseEnter={() => {
        onHover();
        setScrambleKey((k) => k + 1);
      }}
      onMouseLeave={onLeave}
      className="group relative cursor-pointer overflow-hidden border border-[var(--border-subtle)] bg-black aspect-[4/5] md:aspect-[16/10] transition-[filter,opacity,border-color] duration-400 hover:border-[var(--border-accent)]"
      style={{
        filter: isDimmed ? "brightness(0.5) saturate(0.6)" : "none",
        opacity: isDimmed ? 0.65 : 1,
      }}
    >
      <video
        ref={videoRef}
        src={tile.src}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.04]"
        style={{
          filter:
            "saturate(0.7) contrast(1.05) brightness(0.92) hue-rotate(-3deg)",
        }}
      />

      {/* sage tint */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          background:
            "linear-gradient(180deg, rgba(146,176,144,0.06) 0%, rgba(10,9,8,0.45) 100%)",
        }}
      />

      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* HUD: top-left tag */}
      <div className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85 flex items-center gap-2">
        <span className="text-[var(--accent-primary)]">{`// ${tile.code}`}</span>
        <TextScramble key={scrambleKey} text={tile.slug} />
      </div>

      {/* HUD: top-right REC + TC */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75">
        <span className="flex items-center gap-1.5">
          <span
            className="block h-1.5 w-1.5 rounded-full bg-red-500"
            style={{ animation: "blinkRec 1s steps(2, end) infinite" }}
          />
          REC
        </span>
        <span ref={tcRef} className="tabular-nums">00:00:00</span>
      </div>

      {/* HUD: bottom-left location */}
      <div className="absolute left-3 bottom-3 z-10 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
        {tile.loc}
      </div>

      {/* HUD: bottom-right TRACK */}
      <div className="absolute right-3 bottom-3 z-10 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
        ◉ TRACK
      </div>

      {/* corner crosshairs */}
      {[
        "top-1.5 left-1.5",
        "top-1.5 right-1.5",
        "bottom-1.5 left-1.5",
        "bottom-1.5 right-1.5",
      ].map((pos, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute ${pos} z-10 h-3 w-3 border-[var(--accent-primary)]/60`}
          style={{
            borderTopWidth: pos.includes("top") ? 1 : 0,
            borderBottomWidth: pos.includes("bottom") ? 1 : 0,
            borderLeftWidth: pos.includes("left") ? 1 : 0,
            borderRightWidth: pos.includes("right") ? 1 : 0,
          }}
        />
      ))}

      {/* caption block */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
        <div className="translate-y-2 transition-transform duration-500 ease-out group-hover:translate-y-0">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {tile.title}
          </h3>
          <p className="mt-1 max-w-md text-xs md:text-sm text-white/75 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
            {tile.blurb}
          </p>
        </div>
      </div>

      {/* edge glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: "inset 0 0 80px rgba(146,176,144,0.2)",
        }}
      />

      <style jsx>{`
        @keyframes blinkRec {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default function WorkforceWall() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)]">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16 text-center"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent-primary)] mb-4">
              {"// 01"}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              If your business looks like any of these, we want it.
            </h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              A few of the verticals we&apos;re actively buying. Far from the
              full list — if your team does work that a camera can capture,
              there&apos;s a deal here.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {TILES.map((t, i) => (
              <WorkforceTile
                key={t.slug}
                tile={t}
                idx={i}
                hovered={hovered}
                onHover={() => setHovered(i)}
                onLeave={() => setHovered(null)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 md:mt-14 relative border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 backdrop-blur-sm p-6 md:p-8"
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
                className={`pointer-events-none absolute ${pos} h-3 w-3 border-[var(--accent-primary)]/50`}
                style={{
                  borderTopWidth: pos.includes("top") ? 1 : 0,
                  borderBottomWidth: pos.includes("bottom") ? 1 : 0,
                  borderLeftWidth: pos.includes("left") ? 1 : 0,
                  borderRightWidth: pos.includes("right") ? 1 : 0,
                }}
              />
            ))}

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-primary)] mb-2">
                  {"// + 60_more_verticals"}
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
                  And many more categories beyond these six.
                </h3>
                <p className="text-sm md:text-base text-white/65 leading-relaxed">
                  Logistics dispatchers, dental hygienists, daycare staff,
                  trucking fleets, smart-glasses creators, drone teams, robotics
                  teleop, security/QA archives — if your team does work, we&apos;re
                  probably already buying it.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-shrink-0 md:items-end">
                <a
                  href="#apply"
                  className="btn-primary font-mono text-sm px-6 py-3 text-center whitespace-nowrap"
                >
                  See if we work with your category →
                </a>
                <a
                  href="mailto:partners@claru.ai"
                  className="font-mono text-[11px] text-white/45 hover:text-[var(--accent-primary)] transition-colors text-center md:text-right"
                >
                  Or email{" "}
                  <span className="text-[var(--accent-primary)]/80">
                    partners@claru.ai
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
