"use client";

import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";
import Hero from "../components/sections/partnerships/Hero";
import EarningsCalculator from "../components/sections/partnerships/EarningsCalculator";
import WorkforceWall from "../components/sections/partnerships/WorkforceWall";
import HowItWorks from "../components/sections/partnerships/HowItWorks";
import DealTypes from "../components/sections/partnerships/DealTypes";
import FitCriteria from "../components/sections/partnerships/FitCriteria";
import FAQ, { PARTNERSHIPS_FAQS } from "../components/sections/partnerships/FAQ";
import PartnershipsForm from "../components/form/PartnershipsForm";
import PartnershipsAmbient from "../components/sections/partnerships/PartnershipsAmbient";

const SITE_ORIGIN = "https://claru.ai";
const PAGE_URL = `${SITE_ORIGIN}/partnerships`;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PARTNERSHIPS_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Claru Data Partnership Program",
  serviceType: "AI training data sourcing and licensing",
  provider: {
    "@type": "Organization",
    name: "Claru",
    url: SITE_ORIGIN,
  },
  areaServed: "Worldwide",
  description:
    "Claru buys footage of real work from operators, creators, and capture teams for frontier AI labs. If your business runs cameras — kitchens, lines, floors, fields, bays, registers — frontier labs pay for it. Three deal structures: archive license ($5K–$50K), paid commission ($40–$120/hr), and co-supply with our 10,000+ collector workforce.",
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    url: PAGE_URL,
    priceCurrency: "USD",
    lowPrice: 5000,
    highPrice: 50000,
    offerCount: 3,
    priceSpecification: [
      {
        "@type": "PriceSpecification",
        name: "Archive license",
        minPrice: 5000,
        maxPrice: 50000,
        priceCurrency: "USD",
        description: "One-time license on existing footage, paid net-15 on signed agreement.",
      },
      {
        "@type": "UnitPriceSpecification",
        name: "Paid capture rate",
        minPrice: 40,
        maxPrice: 120,
        priceCurrency: "USD",
        unitText: "HUR",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "HUR",
        },
        description: "Per-hour capture rate by modality, paid weekly.",
      },
    ],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Claru partnership deal types",
    itemListElement: [
      {
        "@type": "Offer",
        "@id": `${PAGE_URL}#archive-license`,
        name: "Archive License",
        description:
          "License existing footage to Claru for AI training. Non-exclusive. You keep your reels, channels, and recordings. Paid net-15 on signed agreement.",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 5000,
          maxPrice: 50000,
          priceCurrency: "USD",
        },
        availability: "https://schema.org/InStock",
        url: `${PAGE_URL}#apply`,
      },
      {
        "@type": "Offer",
        "@id": `${PAGE_URL}#paid-capture`,
        name: "Paid Capture (Commission)",
        description:
          "We send the spec, you shoot, we pay weekly. Per-hour rates by modality. We can ship cameras if you don't have them. Review and rejection handled by us.",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: 40,
          maxPrice: 120,
          priceCurrency: "USD",
          unitText: "HUR",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitCode: "HUR",
          },
        },
        availability: "https://schema.org/InStock",
        url: `${PAGE_URL}#apply`,
      },
      {
        "@type": "Offer",
        "@id": `${PAGE_URL}#co-supply`,
        name: "Co-Supply Partnership",
        description:
          "Bring your workforce. We bring everything else — cameras, spec, QC, payout rail. Revenue share or per-hour. Best for operators with 50+ workers doing visible work.",
        availability: "https://schema.org/InStock",
        url: `${PAGE_URL}#apply`,
      },
    ],
  },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to become a Claru data partner",
  description:
    "License existing footage of your team's work, get paid to capture new footage on spec, or co-supply with Claru's 10,000+ collector workforce.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Submit the partner intake form",
      text: "Fill out the partner application on claru.ai/partnerships with your business type, geography, the work your team does on camera, and which deal structure fits — license your archive, get paid to capture, or co-supply.",
      url: `${PAGE_URL}#apply`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Wait for review (5 business days)",
      text: "We review every submission within 5 business days. If the work your team does fits an active lab priority, we reach out to set up a 30-minute scoping call.",
      url: `${PAGE_URL}#apply`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Sign and ship",
      text: "Archive licenses pay $5K–$50K net-15 on signed agreement. Paid capture pays $40–$120/hr weekly via wire, PayPal, or local rail (GCash, DANA, UPI for SEA partners). Co-supply partnerships are scoped per engagement.",
      url: `${PAGE_URL}#apply`,
    },
  ],
};

const VERTICALS_ITEM_LIST = [
  {
    name: "Textile & Garment",
    serviceType: "Textile and garment production footage capture",
    description:
      "Sewing lines, cut-and-sew floors, embroidery, knitwear, denim, leather. POV at the machine. Production-floor footage for AI training datasets.",
  },
  {
    name: "Auto Mechanic",
    serviceType: "Auto mechanic and garage footage capture",
    description:
      "Engine bays, brake jobs, bodywork, oil and lube. Hands on tools, real shop conditions. Independent garage footage for AI training datasets.",
  },
  {
    name: "Agriculture & Harvest",
    serviceType: "Agriculture and farming footage capture",
    description:
      "Fields, greenhouses, livestock, post-harvest sorting. Outdoor capture across regions. Market-garden and farm footage for AI training datasets.",
  },
  {
    name: "Manufacturing Line",
    serviceType: "Manufacturing and assembly footage capture",
    description:
      "Assembly, welding, torque, paint, QA. Industrial environments, repetitive precision. Auto-assembly and factory footage for AI training datasets.",
  },
  {
    name: "Retail & Hospitality",
    serviceType: "Retail and hospitality footage capture",
    description:
      "Cashier, host stand, packaging, customer interaction. Cameras already running. Convenience-store and hospitality footage for AI training datasets.",
  },
  {
    name: "Cleaning & Janitorial",
    serviceType: "Cleaning and janitorial footage capture",
    description:
      "Office turnover, hospitality housekeeping, deep-clean crews, window wash, sanitation. Commercial-cleaning footage for AI training datasets.",
  },
];

const verticalsItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Workforce verticals Claru is actively buying footage from",
  description:
    "Six business verticals where Claru pays operators for footage of work — license existing archives or get paid to capture.",
  numberOfItems: VERTICALS_ITEM_LIST.length,
  itemListElement: VERTICALS_ITEM_LIST.map((v, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: v.name,
      serviceType: v.serviceType,
      description: v.description,
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: SITE_ORIGIN,
      },
      areaServed: "Worldwide",
      url: PAGE_URL,
    },
  })),
};

export default function PartnershipsContent() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(verticalsItemListJsonLd) }}
      />

      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Header opaque />

        <main>
          <Hero />
          <div className="relative">
            <PartnershipsAmbient />
            <div className="relative z-10">
              <EarningsCalculator />
              <WorkforceWall />
              <HowItWorks />
              <DealTypes />
              <FitCriteria />

          <section
            id="apply"
            className="py-20 md:py-32 border-t border-[var(--border-subtle)] scroll-mt-24"
          >
            <div className="container">
              <div className="max-w-4xl mx-auto mb-12 text-center">
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent-primary)] mb-4">
                  {"// 04"}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  Apply to partner
                </h2>
                <p className="text-base md:text-lg text-[var(--text-secondary)]">
                  Five fields. Sixty seconds. Five-day review. Sample link
                  optional — but it&apos;s the fastest qualifier.
                </p>
              </div>
              <PartnershipsForm />
            </div>
          </section>

              <FAQ />

              <section className="py-16 border-t border-[var(--border-subtle)]">
                <div className="container">
                  <div className="max-w-3xl mx-auto text-center">
                    <p className="font-mono text-sm text-[var(--text-muted)]">
                      Prefer email? Reach us at{" "}
                      <a
                        href="mailto:partners@claru.ai"
                        className="text-[var(--accent-primary)] hover:underline"
                      >
                        partners@claru.ai
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
