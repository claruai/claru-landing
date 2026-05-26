/**
 * Translate open job role bodies (title, description, skills, FAQs) into
 * es-MX and pt-BR using Gemini Flash, and write the translations as overlay
 * JSON files under `src/data/jobs-translations/{locale}/{slug}.json`.
 *
 * English remains the source of truth in `src/data/jobs/`. Translations are
 * an overlay applied at request time by the locale-aware job loaders in
 * `src/lib/jobs.ts`.
 *
 * Idempotent: skips files that already exist unless `--force` is passed.
 * Concurrency limited to 5 with exponential backoff on rate-limit errors.
 *
 * Run with:
 *   npx tsx scripts/translate-jobs.ts [--force] [--slug <slug>] [--locale es-MX|pt-BR]
 */

import fs from "node:fs";
import path from "node:path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as dotenvConfig } from "dotenv";

// .env.local is the canonical secrets file in this project (per Next.js convention).
dotenvConfig({ path: ".env.local" });
dotenvConfig(); // fall back to .env if some keys live there

const JOBS_DIR = path.join(process.cwd(), "src/data/jobs");
const OUT_ROOT = path.join(process.cwd(), "src/data/jobs-translations");

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const SLUG_FILTER = args[args.indexOf("--slug") + 1] || "";
const LOCALE_FILTER = args[args.indexOf("--locale") + 1] || "";

const LOCALES = (["es-MX", "pt-BR"] as const).filter(
  (l) => !LOCALE_FILTER || l === LOCALE_FILTER,
);
type Locale = (typeof LOCALES)[number];

const LOCALE_NAMES: Record<Locale, string> = {
  "es-MX": "Mexican Spanish (es-MX)",
  "pt-BR": "Brazilian Portuguese (pt-BR)",
};

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

interface JobInput {
  slug: string;
  title: string;
  description: string;
  skills: string[];
  faqs: { question: string; answer: string }[];
  status?: string;
}

interface TranslationOutput {
  title: string;
  description: string;
  skills: string[];
  faqs: { question: string; answer: string }[];
}

function buildPrompt(job: JobInput, locale: Locale): string {
  return `You are a professional translator localizing a Claru job listing into ${LOCALE_NAMES[locale]}.

Rules:
- Preserve brand and proper nouns exactly: Claru, Wise, Payoneer, ACH, USD, Reka AI.
- Preserve country codes (US, CA, MX, BR, AR, CO, CL, PE, IN, PH, ID, VN) and pay literals like "$15/hour USD" or "$5/hr".
- Preserve the geographic suffix in the title (e.g. "— LATAM", "— Asia") exactly.
- Keep tone direct, concrete, and natural for a contractor audience. No corporate jargon.
- Do NOT translate words that are well-known in tech contexts in the target language (e.g. "smartphone" stays "smartphone" in pt-BR/es-MX; "gameplay" stays "gameplay").
- Preserve paragraph breaks ("\\n\\n") in the description exactly.
- Maintain the same number of skills and FAQ entries; do not add, remove, or reorder.

Return ONLY valid JSON matching this exact shape (no markdown fences, no commentary):
{
  "title": "...",
  "description": "...",
  "skills": ["...", "..."],
  "faqs": [{"question": "...", "answer": "..."}, ...]
}

Source (English):
${JSON.stringify(
  {
    title: job.title,
    description: job.description,
    skills: job.skills,
    faqs: job.faqs,
  },
  null,
  2,
)}`;
}

function stripCodeFence(s: string): string {
  return s
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

async function translateOne(
  job: JobInput,
  locale: Locale,
): Promise<TranslationOutput> {
  const prompt = buildPrompt(job, locale);

  let attempt = 0;
  while (true) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      });
      const text = stripCodeFence(result.response.text());
      const parsed = JSON.parse(text) as TranslationOutput;
      // Shape validation
      if (
        typeof parsed.title !== "string" ||
        typeof parsed.description !== "string" ||
        !Array.isArray(parsed.skills) ||
        !Array.isArray(parsed.faqs)
      ) {
        throw new Error("Translation JSON missing required fields");
      }
      if (parsed.skills.length !== job.skills.length) {
        throw new Error(
          `Skill count mismatch: src=${job.skills.length} got=${parsed.skills.length}`,
        );
      }
      if (parsed.faqs.length !== job.faqs.length) {
        throw new Error(
          `FAQ count mismatch: src=${job.faqs.length} got=${parsed.faqs.length}`,
        );
      }
      return parsed;
    } catch (err) {
      attempt++;
      const msg = err instanceof Error ? err.message : String(err);
      if (attempt >= 3) {
        throw new Error(
          `Translate failed for ${job.slug} (${locale}) after ${attempt} attempts: ${msg}`,
        );
      }
      const backoff = 2 ** attempt * 1000;
      console.warn(
        `  retry ${attempt}/3 for ${job.slug} (${locale}) — ${msg}; sleeping ${backoff}ms`,
      );
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
}

// Tiny concurrency limiter (no extra dep).
async function pLimit<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  concurrency = 5,
): Promise<void> {
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx]);
    }
  });
  await Promise.all(workers);
}

async function main() {
  // Load open roles only — closed roles aren't user-facing in the disclosure
  // bodies (no description shown), so translation isn't needed for them now.
  const allFiles = fs.readdirSync(JOBS_DIR).filter((f) => f.endsWith(".json"));
  const openJobs: JobInput[] = [];
  for (const f of allFiles) {
    const j = JSON.parse(
      fs.readFileSync(path.join(JOBS_DIR, f), "utf-8"),
    ) as JobInput;
    if (j.status === "closed") continue;
    if (SLUG_FILTER && j.slug !== SLUG_FILTER) continue;
    openJobs.push(j);
  }

  // Ensure output dirs exist.
  for (const locale of LOCALES) {
    fs.mkdirSync(path.join(OUT_ROOT, locale), { recursive: true });
  }

  // Build the work queue: (job, locale) pairs, skipping existing files unless --force.
  const queue: { job: JobInput; locale: Locale }[] = [];
  for (const job of openJobs) {
    for (const locale of LOCALES) {
      const outPath = path.join(OUT_ROOT, locale, `${job.slug}.json`);
      if (!FORCE && fs.existsSync(outPath)) continue;
      queue.push({ job, locale });
    }
  }

  console.log(
    `Translating ${queue.length} (job, locale) pairs across ${openJobs.length} open roles${FORCE ? " — FORCE rewrite" : ""}…`,
  );

  let done = 0;
  let failed = 0;
  const startedAt = Date.now();

  await pLimit(queue, async ({ job, locale }) => {
    try {
      const out = await translateOne(job, locale);
      const outPath = path.join(OUT_ROOT, locale, `${job.slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
      done++;
      if (done % 10 === 0 || done + failed === queue.length) {
        const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
        console.log(`  ${done}/${queue.length} done (${elapsed}s elapsed)`);
      }
    } catch (err) {
      failed++;
      console.error(
        `  FAILED ${job.slug} (${locale}): ${err instanceof Error ? err.message : err}`,
      );
    }
  });

  console.log(
    `Done. translated=${done} failed=${failed} skipped=${openJobs.length * LOCALES.length - queue.length}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
