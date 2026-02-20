"use client";

import { motion } from "framer-motion";

// --------------------------------------------------------
// Approximate (x%, y%) positions on an equirectangular map
// where 0,0 = top-left and 100,100 = bottom-right.
// --------------------------------------------------------
interface MapDot {
  id: string;
  label: string;
  x: number; // percent
  y: number; // percent
}

const dots: MapDot[] = [
  { id: "us-west", label: "US West", x: 14, y: 38 },
  { id: "us-east", label: "US East", x: 22, y: 36 },
  { id: "canada", label: "Canada", x: 18, y: 28 },
  { id: "mexico", label: "Mexico", x: 16, y: 44 },
  { id: "brazil", label: "Brazil", x: 31, y: 62 },
  { id: "uk", label: "UK", x: 47, y: 27 },
  { id: "germany", label: "Germany", x: 51, y: 28 },
  { id: "kenya", label: "Kenya", x: 56, y: 54 },
  { id: "south-africa", label: "South Africa", x: 54, y: 68 },
  { id: "pakistan", label: "Pakistan", x: 65, y: 38 },
  { id: "india", label: "India", x: 69, y: 42 },
  { id: "japan", label: "Japan", x: 84, y: 34 },
  { id: "south-korea", label: "South Korea", x: 81, y: 36 },
  { id: "philippines", label: "Philippines", x: 80, y: 48 },
  { id: "australia", label: "Australia", x: 83, y: 68 },
];

interface RegionLabel {
  id: string;
  label: string;
  x: number;
  y: number;
  hideMobile?: boolean;
}

const regionLabels: RegionLabel[] = [
  { id: "na", label: "NORTH AMERICA", x: 16, y: 22 },
  { id: "sa", label: "SOUTH AMERICA", x: 28, y: 72 },
  { id: "eu", label: "EUROPE", x: 49, y: 20, hideMobile: true },
  { id: "af", label: "AFRICA", x: 50, y: 60, hideMobile: true },
  { id: "south-asia", label: "SOUTH ASIA", x: 67, y: 34, hideMobile: true },
  { id: "ea", label: "EAST ASIA", x: 82, y: 26 },
  { id: "oc", label: "OCEANIA", x: 85, y: 76 },
];

// Simplified continent outlines as SVG paths on a 1000x500 viewBox
// (equirectangular projection, heavily simplified for weight)
const continentPaths = [
  // North America
  "M80,100 L100,90 L130,80 L160,75 L200,80 L230,90 L250,100 L260,120 L270,140 L260,160 L250,180 L240,200 L230,210 L210,220 L200,230 L190,230 L180,220 L170,230 L155,230 L140,220 L130,200 L120,180 L110,160 L100,140 L90,120 Z",
  // South America
  "M230,280 L240,270 L260,265 L280,270 L300,280 L320,300 L330,320 L335,340 L330,360 L320,380 L300,390 L280,385 L260,370 L250,350 L240,330 L235,310 L230,290 Z",
  // Europe
  "M440,80 L460,75 L480,78 L500,85 L520,80 L540,85 L550,100 L545,120 L535,135 L520,145 L500,150 L480,145 L465,135 L450,120 L445,100 Z",
  // Africa
  "M440,210 L460,200 L480,205 L510,210 L530,220 L550,240 L560,260 L570,290 L575,320 L570,350 L555,370 L535,380 L510,375 L490,360 L475,340 L465,310 L455,280 L445,250 L440,230 Z",
  // Asia
  "M560,70 L590,65 L630,60 L670,55 L710,60 L740,70 L770,80 L800,90 L830,100 L850,115 L860,135 L855,155 L840,170 L820,180 L800,185 L780,190 L760,195 L740,200 L720,210 L700,215 L680,210 L660,200 L640,190 L620,180 L600,165 L580,145 L565,120 L560,95 Z",
  // India subcontinent
  "M640,200 L660,195 L680,200 L700,215 L710,235 L705,255 L690,270 L670,275 L655,265 L645,245 L640,225 Z",
  // Southeast Asia / Philippines area
  "M760,195 L780,190 L800,200 L810,215 L815,235 L810,250 L795,260 L775,255 L765,240 L760,220 Z",
  // Australia
  "M780,320 L800,310 L830,305 L860,310 L880,325 L885,345 L875,365 L855,375 L830,380 L805,375 L790,360 L785,340 Z",
  // Japan / Korea
  "M820,100 L835,95 L845,100 L850,115 L845,130 L835,138 L825,132 L820,118 Z",
];

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.3 + i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const pulseVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: [1, 2.5, 3],
    opacity: [0.5, 0.15, 0],
    transition: {
      delay: 0.3 + i * 0.08,
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1.5,
      ease: "easeOut" as const,
    },
  }),
};

const labelVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: 0.6 + i * 0.1,
      duration: 0.6,
    },
  }),
};

export default function GlobeMap() {
  return (
    <div className="w-full">
      {/* Map container */}
      <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="World map showing Claru contributor locations across 14 countries"
        >
          {/* Continent outlines */}
          <g>
            {continentPaths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="var(--accent-primary)"
                fillOpacity={0.06}
                stroke="var(--accent-primary)"
                strokeOpacity={0.08}
                strokeWidth={0.5}
              />
            ))}
          </g>

          {/* Dots with pulse animation */}
          <motion.g
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {dots.map((dot, i) => {
              const cx = (dot.x / 100) * 1000;
              const cy = (dot.y / 100) * 500;
              return (
                <g key={dot.id}>
                  {/* Pulse ring */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="var(--accent-primary)"
                    fillOpacity={0.4}
                    custom={i}
                    variants={pulseVariants}
                  />
                  {/* Glow */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="var(--accent-primary)"
                    fillOpacity={0.15}
                    custom={i}
                    variants={dotVariants}
                  />
                  {/* Solid dot */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill="var(--accent-primary)"
                    custom={i}
                    variants={dotVariants}
                  />
                </g>
              );
            })}
          </motion.g>

          {/* Region labels */}
          <motion.g
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {regionLabels.map((region, i) => {
              const x = (region.x / 100) * 1000;
              const y = (region.y / 100) * 500;
              return (
                <motion.text
                  key={region.id}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className={`font-mono ${region.hideMobile ? "hidden md:block" : ""}`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    fill: "var(--text-muted)",
                    display: region.hideMobile ? undefined : undefined,
                  }}
                  custom={i}
                  variants={labelVariants}
                >
                  {region.label}
                </motion.text>
              );
            })}
          </motion.g>
        </svg>

        {/* Mobile-hidden labels handled via CSS on the SVG text elements */}
        {/* We use a secondary overlay for mobile-responsive label hiding */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="relative w-full h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {regionLabels
              .filter((r) => r.hideMobile)
              .map((region, i) => (
                <motion.span
                  key={`overlay-${region.id}`}
                  className="absolute hidden md:block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider -translate-x-1/2"
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                  }}
                  custom={i}
                  variants={labelVariants}
                  aria-hidden="true"
                />
              ))}
          </motion.div>
        </div>
      </div>

      {/* Stats line */}
      <motion.p
        className="text-center font-mono text-sm text-[var(--accent-secondary)] mt-6 tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Contributors across 14+ countries
      </motion.p>
    </div>
  );
}
