"use client";

import React from "react";
import StatCard from "./components/StatCard";
import QuoteCard from "./components/QuoteCard";
import DataTypeCard from "./components/DataTypeCard";
import BeforeAfterCard from "./components/BeforeAfterCard";
import GlobalScaleCard from "./components/GlobalScaleCard";

/* ──────────────────────────────────────────────
   Sample data for preview
   ────────────────────────────────────────────── */

const CITIES = [
  "San Francisco",
  "Toronto",
  "London",
  "Berlin",
  "Tokyo",
  "Singapore",
  "Sydney",
  "Nairobi",
  "Sao Paulo",
  "Seoul",
  "Mumbai",
  "Lagos",
  "Stockholm",
  "Dubai",
  "Austin",
  "Montreal",
  "Zurich",
  "Amsterdam",
  "Taipei",
  "Bangalore",
  "Warsaw",
  "Helsinki",
  "Cape Town",
  "Jakarta",
  "Mexico City",
  "Vancouver",
  "Paris",
  "Tel Aviv",
];

const ACCENT = {
  sage: "#92B090",
  blue: "#4A9EDE",
  orange: "#DE8A4A",
  purple: "#9E6ADE",
  green: "#4ADE80",
};

type Size = { width: number; height: number; label: string };

const SIZES: Size[] = [
  { width: 1200, height: 675, label: "Twitter (1200 x 675)" },
  { width: 1200, height: 627, label: "LinkedIn (1200 x 627)" },
];

/* ──────────────────────────────────────────────
   Section heading helper
   ────────────────────────────────────────────── */

function SectionHeading({ title }: { title: string }) {
  return (
    <h2
      style={{
        fontFamily:
          "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontSize: 14,
        fontWeight: 500,
        color: "#92B090",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 32,
        paddingBottom: 12,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {title}
    </h2>
  );
}

function SizeLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        fontFamily:
          "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontSize: 11,
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.06em",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main preview page
   ────────────────────────────────────────────── */

export default function SocialCardsPage() {
  return (
    <div
      style={{
        backgroundColor: "#050505",
        minHeight: "100vh",
        padding: "48px 40px 120px",
        fontFamily:
          "var(--font-jetbrains), 'JetBrains Mono', monospace",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 64 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          Social Card Templates
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.02em",
          }}
        >
          Screenshot any card below at its rendered pixel size for Twitter or
          LinkedIn. All cards use the Claru terminal aesthetic.
        </p>
      </div>

      {/* ── 1. STAT CARDS ── */}
      <section style={{ marginBottom: 80 }}>
        <SectionHeading title="01 / Stat Cards" />

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {/* Primary stat — sage green */}
          {SIZES.map((size) => (
            <div key={`stat-primary-${size.label}`}>
              <SizeLabel label={size.label} />
              <StatCard
                stat="3,241,087"
                label="human annotations completed"
                sublabel="Across video, vision, robotics, and text modalities"
                accent={ACCENT.sage}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* Egocentric stat — blue */}
          {SIZES.map((size) => (
            <div key={`stat-ego-${size.label}`}>
              <SizeLabel label={size.label} />
              <StatCard
                stat="386,241"
                label="egocentric clips captured"
                sublabel="First-person manipulation data for embodied AI"
                accent={ACCENT.blue}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* Quality stat — orange */}
          {SIZES.map((size) => (
            <div key={`stat-quality-${size.label}`}>
              <SizeLabel label={size.label} />
              <StatCard
                stat="976,482"
                label="video quality assessments"
                accent={ACCENT.orange}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. QUOTE CARDS ── */}
      <section style={{ marginBottom: 80 }}>
        <SectionHeading title="02 / Quote Cards" />

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {/* Short quote */}
          {SIZES.map((size) => (
            <div key={`quote-short-${size.label}`}>
              <SizeLabel label={size.label} />
              <QuoteCard
                quote="The frontier isn't about more data. It's about the right data, captured by humans who understand what the model needs."
                accent={ACCENT.sage}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* With attribution */}
          {SIZES.map((size) => (
            <div key={`quote-attr-${size.label}`}>
              <SizeLabel label={size.label} />
              <QuoteCard
                quote="We don't scrape the internet and call it training data. Every frame is purpose-captured, every label is expert-validated."
                attribution="Claru Engineering"
                accent={ACCENT.purple}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* Longer quote */}
          {SIZES.map((size) => (
            <div key={`quote-long-${size.label}`}>
              <SizeLabel label={size.label} />
              <QuoteCard
                quote="Most annotation companies optimize for throughput. We optimize for what your loss function actually needs. The difference shows up in eval, every time."
                attribution="Data Quality Team"
                accent={ACCENT.blue}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. DATA TYPE CARDS ── */}
      <section style={{ marginBottom: 80 }}>
        <SectionHeading title="03 / Data Type Cards" />

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {/* Egocentric */}
          {SIZES.map((size) => (
            <div key={`dtype-ego-${size.label}`}>
              <SizeLabel label={size.label} />
              <DataTypeCard
                category="Egocentric Capture"
                stat="386,241"
                statLabel="clips captured"
                description="First-person manipulation footage from controlled environments. Diverse hand morphologies, object interactions, and task completions for embodied AI training."
                accent={ACCENT.sage}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* Game environments */}
          {SIZES.map((size) => (
            <div key={`dtype-game-${size.label}`}>
              <SizeLabel label={size.label} />
              <DataTypeCard
                category="Game Environments"
                stat="66,140"
                statLabel="environment frames"
                description="Controlled 3D environments with full camera metadata, depth maps, and semantic segmentation ground truth."
                accent={ACCENT.green}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* Content safety */}
          {SIZES.map((size) => (
            <div key={`dtype-safety-${size.label}`}>
              <SizeLabel label={size.label} />
              <DataTypeCard
                category="Content Safety"
                stat="241,830"
                statLabel="safety classifications"
                description="Multi-taxonomy content safety annotations across violence, CSAM, self-harm, and hate speech categories. Expert-labeled with inter-annotator agreement scores."
                accent={ACCENT.orange}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. BEFORE / AFTER CARDS ── */}
      <section style={{ marginBottom: 80 }}>
        <SectionHeading title="04 / Before-After Cards" />

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {/* Depth estimation */}
          {SIZES.map((size) => (
            <div key={`ba-depth-${size.label}`}>
              <SizeLabel label={size.label} />
              <BeforeAfterCard
                title="Depth Estimation"
                beforeLabel="RGB Source"
                afterLabel="Depth Map"
                accent={ACCENT.blue}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* Pose estimation */}
          {SIZES.map((size) => (
            <div key={`ba-pose-${size.label}`}>
              <SizeLabel label={size.label} />
              <BeforeAfterCard
                title="Pose Estimation"
                beforeLabel="Raw"
                afterLabel="Skeleton Overlay"
                accent={ACCENT.purple}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* Segmentation */}
          {SIZES.map((size) => (
            <div key={`ba-seg-${size.label}`}>
              <SizeLabel label={size.label} />
              <BeforeAfterCard
                title="Semantic Segmentation"
                beforeLabel="Source Frame"
                afterLabel="Segmentation Mask"
                accent={ACCENT.sage}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. GLOBAL SCALE CARDS ── */}
      <section style={{ marginBottom: 80 }}>
        <SectionHeading title="05 / Global Scale Cards" />

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {SIZES.map((size) => (
            <div key={`global-${size.label}`}>
              <SizeLabel label={size.label} />
              <GlobalScaleCard
                cities={CITIES}
                stat="28"
                label="cities with active annotation teams"
                accent={ACCENT.sage}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}

          {/* Variant with fewer cities, different accent */}
          {SIZES.map((size) => (
            <div key={`global-small-${size.label}`}>
              <SizeLabel label={size.label} />
              <GlobalScaleCard
                cities={[
                  "Toronto",
                  "Nairobi",
                  "Manila",
                  "Sao Paulo",
                  "Dhaka",
                  "Mumbai",
                  "Lagos",
                  "Bogota",
                  "Hanoi",
                  "Cairo",
                  "Accra",
                  "Karachi",
                ]}
                stat="12"
                label="capture regions active this quarter"
                accent={ACCENT.green}
                width={size.width}
                height={size.height}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
