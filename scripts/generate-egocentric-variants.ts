/**
 * Generate 40 egocentric role variants: 10 sub-categories × 4 geos.
 *
 * Each role gets:
 *  - flat geo-floor pay (US $15, CA $10, LATAM $7, Asia $5) in USD/hr
 *  - geo-specific targetCountries (single-geo)
 *  - sub-category-specific description + skills + FAQs
 *  - geo-specific copy block woven into the description so each file is
 *    distinct enough to avoid duplicate-content penalties
 *  - seo annotation with the EN keyword target (from goals/jobs-page-refocus.md)
 *
 * Re-running is idempotent: it overwrites by deterministic slug. If you change
 * the per-sub-cat / per-geo content blocks here, all 40 files refresh.
 *
 * Run with:  npx tsx scripts/generate-egocentric-variants.ts
 */

import fs from "node:fs";
import path from "node:path";

const JOBS_DIR = path.join(process.cwd(), "src/data/jobs");
const TODAY = new Date().toISOString().slice(0, 10);
const VALID_DAYS = 90;
const VALID_THROUGH = new Date(Date.now() + VALID_DAYS * 86400000)
  .toISOString()
  .slice(0, 10);

interface SubCat {
  key: string; // slug fragment
  label: string; // human readable
  axis: "commercial" | "residential";
  subcategory: string; // JSON `subcategory` field
  shortBrief: string; // 1-sentence hook for the title
  body: string; // 2-3 paragraph description (sub-cat-specific)
  skills: string[];
  faqs: { question: string; answer: string }[];
  primaryKeyword: string;
  monthlyVol: number;
}

interface Geo {
  key: string; // slug fragment
  label: string; // human readable, used in title suffix
  countries: string[]; // ISO-3166 codes for targetCountries
  locationRequirements: string; // human-readable location restriction
  pay: number; // flat USD/hr
  copyParagraph: string; // geo-specific copy block woven into description
  payNote: string; // FAQ-friendly pay sentence
}

const SUBCATS: SubCat[] = [
  {
    key: "retail",
    label: "Retail Store",
    axis: "commercial",
    subcategory: "commercial-retail",
    shortBrief: "Capture first-person video walking through retail stores",
    body: `As a Retail Store Capture contributor, you will record first-person video while walking, browsing, and interacting inside grocery stores, pharmacies, big-box retailers, and convenience stores. Your footage trains AI systems that need to understand product placement, shelf navigation, and shopper behavior.

A typical shift is 30–60 minutes of recording across one or two stores. You'll capture aisle traversal, product pickups, checkout flow, and natural pauses to read labels. We provide a brief listing the scenes we need; you choose stores and times that work for your schedule.

You'll use a smartphone or a wearable camera (we accept both). Recordings are uploaded the same day. The data feeds models that power smart-cart, planogram, and inventory tools.`,
    skills: [
      "Smartphone or wearable camera",
      "Comfort recording in public retail spaces",
      "Reliable internet for upload",
      "Ability to follow a brief precisely",
      "Same-day turnaround on assigned scenes",
    ],
    faqs: [
      {
        question: "Do I need to ask store permission to record?",
        answer:
          "We provide guidance per store chain. Most general aisle footage in big-box stores is acceptable; some specialty retailers require explicit permission, and the brief tells you which.",
      },
      {
        question: "What happens to footage with other shoppers in frame?",
        answer:
          "Our review pipeline blurs incidental faces before training. You don't need to do anything special during capture — just record naturally.",
      },
    ],
    primaryKeyword: "retail video recording job",
    monthlyVol: 0,
  },
  {
    key: "restaurant",
    label: "Restaurant & QSR",
    axis: "commercial",
    subcategory: "commercial-restaurant",
    shortBrief: "Capture first-person video inside restaurants and quick-service kitchens",
    body: `As a Restaurant Capture contributor, you record first-person video of restaurant operations — front-of-house dining, drive-thru, line preparation, plating, and customer interactions. The footage trains AI systems used in QSR back-of-house tooling, drive-thru ordering, and restaurant inventory.

Shifts are typically 45–90 minutes spanning a meal service. We need both eat-in scenes (your perspective as a diner, including ordering and table service) and back-of-house captures when arranged with the venue.

This work pairs well with people who already work in or frequent restaurants — you blend in naturally and the recording feels invisible.`,
    skills: [
      "Smartphone or wearable camera",
      "Comfort recording in food-service environments",
      "Willingness to dine and capture across multiple visits",
      "Reliable internet for upload",
      "Ability to follow scene briefs precisely",
    ],
    faqs: [
      {
        question: "Can I capture during my regular shift if I work in a restaurant?",
        answer:
          "Yes, provided the operator approves. We have a one-page consent template you can share with management. Approved shifts pay the same rate as our standard captures.",
      },
      {
        question: "Does drive-thru count?",
        answer:
          "Yes. Drive-thru ordering, payment, and food handoff are some of our highest-value scene types.",
      },
    ],
    primaryKeyword: "restaurant video recording",
    monthlyVol: 0,
  },
  {
    key: "warehouse",
    label: "Warehouse & Fulfillment",
    axis: "commercial",
    subcategory: "commercial-warehouse",
    shortBrief: "Capture first-person video in warehouse and fulfillment environments",
    body: `As a Warehouse Capture contributor, you record first-person video while moving through warehouses, fulfillment centers, and inventory rooms. The data trains robotic picking systems, autonomous forklift navigation, and warehouse-management AI.

Scenes include pallet navigation, shelf scanning, package handling, and item retrieval. We work with people who already have warehouse access through their day job, plus self-employed contractors who run their own micro-fulfillment.

A typical capture session is 30–45 minutes during normal warehouse operations.`,
    skills: [
      "Access to a warehouse, stockroom, or fulfillment space",
      "Smartphone or wearable camera",
      "Comfort recording while walking through industrial environments",
      "Safety awareness around forklifts and moving equipment",
      "Reliable internet for upload",
    ],
    faqs: [
      {
        question: "I work at a warehouse — can I record during my shift?",
        answer:
          "Yes, with employer consent. We provide a consent template. Many warehouse workers earn meaningful extra income recording during their regular shifts.",
      },
      {
        question: "Do I need a hard hat or PPE on camera?",
        answer:
          "Whatever your warehouse normally requires — we want footage that matches real operating conditions, PPE and all.",
      },
    ],
    primaryKeyword: "warehouse video",
    monthlyVol: 90,
  },
  {
    key: "office",
    label: "Office & Coworking",
    axis: "commercial",
    subcategory: "commercial-office",
    shortBrief: "Capture first-person video of office, meeting, and desk-work scenes",
    body: `As an Office Capture contributor, you record first-person video of meeting rooms, hot desks, coworking spaces, and informal collaboration. The footage trains AI assistants that need to understand office work — calendar tools, meeting transcription, document handling, and collaboration software.

Typical scenes include walking into a meeting room, sitting down, opening a laptop, navigating between paper and screen, and side-of-desk conversations. Sessions run 30–60 minutes.

This pairs naturally with knowledge workers, freelancers, and anyone using coworking memberships.`,
    skills: [
      "Access to an office, coworking space, or shared work environment",
      "Smartphone or wearable camera",
      "Comfort recording during meetings and desk work",
      "Reliable internet for upload",
      "Ability to follow scene briefs precisely",
    ],
    faqs: [
      {
        question: "What about recording coworkers without consent?",
        answer:
          "Our review pipeline blurs incidental faces before training. For scenes featuring identifiable colleagues, we provide a short consent form they can sign — captures with signed consent pay a premium.",
      },
      {
        question: "Can I capture remote work-from-home office scenes?",
        answer:
          "Yes — home office captures fall under our Residential Indoor category instead.",
      },
    ],
    primaryKeyword: "data annotation work from home",
    monthlyVol: 70,
  },
  {
    key: "hospitality",
    label: "Hospitality (Hotel, Gym, Salon)",
    axis: "commercial",
    subcategory: "commercial-hospitality",
    shortBrief: "Capture first-person video in hotels, gyms, salons, and service settings",
    body: `As a Hospitality Capture contributor, you record first-person video inside hotels (check-in, room navigation, amenities), gyms (equipment use, locker rooms, classes), salons, dental offices, and similar service environments. The data trains AI systems used in concierge tools, equipment-use detection, and customer-experience analytics.

Scenes are short and specific — checking into a hotel room, completing a gym circuit, sitting in a salon chair. A typical session is 20–45 minutes, often during normal use of the service.

This works particularly well for frequent travelers and gym regulars.`,
    skills: [
      "Smartphone or wearable camera",
      "Comfort recording in semi-public service settings",
      "Active use of hotels, gyms, or other hospitality services",
      "Reliable internet for upload",
      "Ability to follow scene briefs precisely",
    ],
    faqs: [
      {
        question: "Are locker rooms okay to record?",
        answer:
          "Generally no — we focus on equipment, lobby, and class areas. The brief specifies excluded zones for every capture.",
      },
      {
        question: "Do hotels need to know I'm recording?",
        answer:
          "Public-area recordings (lobby, fitness center, breakfast area) typically don't require notice. In-room captures don't require notice. Spa and treatment areas do require explicit consent.",
      },
    ],
    primaryKeyword: "ai data collection jobs",
    monthlyVol: 50,
  },
  {
    key: "kitchen",
    label: "Kitchen & Cooking",
    axis: "residential",
    subcategory: "residential-kitchen",
    shortBrief: "Capture first-person video of home cooking and kitchen tasks",
    body: `As a Kitchen Capture contributor, you record first-person video of cooking, meal prep, cleanup, and kitchen tool use in your home kitchen. The footage trains AI systems used in cooking assistants, recipe tools, and kitchen robotics.

Scenes include knife work, stovetop cooking, oven loading, dishwashing, and food storage. Each capture is one full cooking task (a single recipe or meal prep block), typically 20–60 minutes.

This is one of our most popular sub-categories — flexible scheduling, work-from-home, and the cooking you'd be doing anyway.`,
    skills: [
      "Own a functional home kitchen",
      "Smartphone or wearable camera",
      "Comfort cooking on camera",
      "Reliable internet for upload",
      "Ability to follow scene briefs precisely",
    ],
    faqs: [
      {
        question: "Do I need to cook a specific recipe?",
        answer:
          "Each brief includes recipe categories (e.g. 'one-pot meals', 'breakfast', 'baking') with room to pick within them. We rarely require a specific recipe.",
      },
      {
        question: "Can I include kids or family members in the kitchen?",
        answer:
          "Children in frame complicate post-processing. We prefer adult-only captures. Captures featuring children require a separate consent flow.",
      },
    ],
    primaryKeyword: "kitchen pov video",
    monthlyVol: 0,
  },
  {
    key: "household",
    label: "Household Chores",
    axis: "residential",
    subcategory: "residential-household",
    shortBrief: "Capture first-person video of cleaning, laundry, and household tasks",
    body: `As a Household Capture contributor, you record first-person video of common home chores — cleaning, laundry, vacuuming, organizing, and small repairs. The data trains household robotics and smart-home AI.

Scenes are typically 15–45 minutes each, focused on a single task (e.g. one room cleaning pass, one laundry cycle from start to fold). We need real, lived-in scenes — not staged perfection.

Pairs well with anyone managing their own household, including stay-at-home parents and remote workers.`,
    skills: [
      "Live in a household where you handle chores",
      "Smartphone or wearable camera",
      "Comfort recording day-to-day home activity",
      "Reliable internet for upload",
      "Ability to follow scene briefs precisely",
    ],
    faqs: [
      {
        question: "Do I need to clean my whole house?",
        answer:
          "No — each capture is a single task. You might record one bathroom clean today and a vacuum pass next week.",
      },
      {
        question: "Can I record while doing laundry across multiple loads?",
        answer:
          "Yes — multi-load laundry sessions are explicitly requested in some briefs.",
      },
    ],
    primaryKeyword: "ai data collection jobs",
    monthlyVol: 50,
  },
  {
    key: "garage",
    label: "Garage & DIY",
    axis: "residential",
    subcategory: "residential-garage",
    shortBrief: "Capture first-person video of garage work, DIY, and tool use",
    body: `As a Garage & DIY Capture contributor, you record first-person video of vehicle maintenance, tool use, hobbyist projects, and workshop tasks. The data trains AI systems for power-tool safety, vehicle diagnostics, and home-improvement assistants.

Scenes include oil changes, basic auto work, woodworking, electrical projects, and tool storage organization. A typical session is one project, 30–90 minutes long.

Strong fit for hobbyists, gearheads, and anyone with regular workshop time.`,
    skills: [
      "Access to a garage, workshop, or DIY space",
      "Smartphone or wearable camera",
      "Familiarity with hand and power tools",
      "Reliable internet for upload",
      "Ability to follow scene briefs precisely",
    ],
    faqs: [
      {
        question: "Do I need expensive tools?",
        answer:
          "No — we need real-world tool use, not professional setups. A basic socket set, drill, and saw covers most briefs.",
      },
      {
        question: "Can I record dangerous tasks like grinding or welding?",
        answer:
          "Only if you have the safety equipment you'd normally use. PPE in frame is a feature, not a bug — we want realistic safety practices captured.",
      },
    ],
    primaryKeyword: "ai data collection jobs",
    monthlyVol: 50,
  },
  {
    key: "indoor",
    label: "Indoor Activity",
    axis: "residential",
    subcategory: "residential-indoor",
    shortBrief: "Capture general first-person video of indoor home activity",
    body: `As an Indoor Activity Capture contributor, you record first-person video of everyday indoor scenes that don't fall into the more specific household, kitchen, or garage categories. Reading, watching TV, gaming on a console, working at a home office, eating, hosting friends — all are in scope.

Sessions are typically 15–60 minutes. We need ambient, naturalistic footage. The data trains general-purpose home AI assistants that need to understand the full breadth of indoor activity.

This is a great catch-all category if you spend a lot of time at home.`,
    skills: [
      "Smartphone or wearable camera",
      "Comfort recording your normal indoor routines",
      "Reliable internet for upload",
      "Ability to follow scene briefs precisely",
    ],
    faqs: [
      {
        question: "Can I record while watching TV or movies?",
        answer:
          "Yes — TV-watching and gaming scenes are explicitly requested. Copyrighted content on screen is acceptable for training; we don't redistribute it.",
      },
      {
        question: "What counts as 'indoor activity'?",
        answer:
          "Anything happening inside your home that isn't kitchen, household chores, or garage work. Reading, TV, hobbies, eating, hosting, working from home, etc.",
      },
    ],
    primaryKeyword: "first person video",
    monthlyVol: 140,
  },
  {
    key: "garden",
    label: "Garden & Outdoor Home",
    axis: "residential",
    subcategory: "residential-garden",
    shortBrief: "Capture first-person video of yard work, gardening, and outdoor home tasks",
    body: `As a Garden & Outdoor Capture contributor, you record first-person video of lawn mowing, gardening, planting, pruning, outdoor cleaning, and general yard maintenance. The data trains AI systems for robotic mowers, plant-identification tools, and outdoor home robotics.

Scenes are typically 20–60 minutes of one task — one mow, one weeding session, one round of planting. Seasonal variation matters; we collect across spring, summer, fall, and winter where applicable.

Best fit for homeowners and renters with garden access.`,
    skills: [
      "Access to a yard, garden, or outdoor home space",
      "Smartphone or wearable camera",
      "Comfort recording while doing outdoor work",
      "Reliable internet for upload",
      "Ability to follow scene briefs precisely",
    ],
    faqs: [
      {
        question: "What if I live in an apartment without a yard?",
        answer:
          "Balcony gardens and container plantings count. Community-garden plots also count.",
      },
      {
        question: "Does mowing the lawn pay well per minute?",
        answer:
          "Lawn-care captures are among our most consistently requested. A 30-minute mow at the flat geo rate is a typical good-value capture.",
      },
    ],
    primaryKeyword: "ai data collection jobs",
    monthlyVol: 50,
  },
];

const GEOS: Geo[] = [
  {
    key: "us",
    label: "United States",
    countries: ["US"],
    locationRequirements: "US",
    pay: 15,
    copyParagraph: `This variant is open to contributors based in the United States. Pay is $15/hour USD, fixed flat rate, paid via direct deposit (ACH) on a bi-weekly cadence. US contributors typically run two to four captures per week and complete the first paid batch within 7–10 days of approval.`,
    payNote: "US contributors are paid $15/hour USD flat, via ACH, bi-weekly.",
  },
  {
    key: "canada",
    label: "Canada",
    countries: ["CA"],
    locationRequirements: "CA",
    pay: 10,
    copyParagraph: `This variant is open to contributors based in Canada. Pay is $10/hour USD, fixed flat rate, paid via international wire or Wise transfer on a bi-weekly cadence. Canadian contributors typically run two to four captures per week.`,
    payNote:
      "Canadian contributors are paid $10/hour USD flat, via wire or Wise, bi-weekly.",
  },
  {
    key: "latam",
    label: "LATAM",
    countries: ["MX", "BR", "AR", "CO", "CL", "PE"],
    locationRequirements: "MX, BR, AR, CO, CL, PE",
    pay: 7,
    copyParagraph: `This variant is open to contributors across Latin America — Mexico, Brazil, Argentina, Colombia, Chile, and Peru. Pay is $7/hour USD, fixed flat rate, paid via international transfer (Wise, Payoneer, or local equivalent) on a bi-weekly cadence. USD purchasing power makes this a meaningful supplemental income across the region.`,
    payNote:
      "LATAM contributors (MX, BR, AR, CO, CL, PE) are paid $7/hour USD flat, via Wise/Payoneer, bi-weekly.",
  },
  {
    key: "asia",
    label: "Asia",
    countries: ["IN", "PH", "ID", "VN"],
    locationRequirements: "IN, PH, ID, VN",
    pay: 5,
    copyParagraph: `This variant is open to contributors across Asia — India, the Philippines, Indonesia, and Vietnam. Pay is $5/hour USD, fixed flat rate, paid via international transfer (Wise, Payoneer, or local equivalent) on a bi-weekly cadence. We're actively building a contributor base across these markets and onboarding is fast.`,
    payNote:
      "Asian contributors (IN, PH, ID, VN) are paid $5/hour USD flat, via Wise/Payoneer, bi-weekly.",
  },
];

function buildRole(sub: SubCat, geo: Geo) {
  const slug = `${sub.key}-capture-${geo.key}`;
  const title = `${sub.label} Video Capture — ${geo.label}`;
  const description =
    `${sub.body}\n\n${geo.copyParagraph}\n\nClaru contractors are independent — no fixed hours, no minimum commitment. You take captures that fit your schedule and skip the ones that don't.`;
  const faqs = [
    ...sub.faqs,
    {
      question: `How much does ${sub.label} capture pay in ${geo.label}?`,
      answer: geo.payNote,
    },
    {
      question: "When do I get paid?",
      answer:
        "Bi-weekly. The first batch typically lands 7–10 days after your first approved capture.",
    },
  ];
  return {
    slug,
    title,
    category: "video-capture",
    subcategory: sub.subcategory,
    description,
    skills: sub.skills,
    compensationMin: geo.pay,
    compensationMax: geo.pay,
    employmentType: "CONTRACTOR" as const,
    locationType: "TELECOMMUTE" as const,
    locationRequirements: geo.locationRequirements,
    targetCountries: geo.countries,
    datePosted: TODAY,
    validThrough: VALID_THROUGH,
    featured: false,
    archived: false,
    status: "open" as const,
    seo: {
      primaryKeyword: sub.primaryKeyword,
      locales: {
        en: {
          keyword: sub.primaryKeyword,
          monthlySearchVolume: sub.monthlyVol,
        },
      },
    },
    faqs,
  };
}

function main() {
  let written = 0;
  for (const sub of SUBCATS) {
    for (const geo of GEOS) {
      const role = buildRole(sub, geo);
      const filePath = path.join(JOBS_DIR, `${role.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(role, null, 2) + "\n");
      written++;
    }
  }
  console.log(`Wrote ${written} egocentric variant files.`);
}

main();
