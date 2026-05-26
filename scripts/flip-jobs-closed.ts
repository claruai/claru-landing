/**
 * One-shot: flip every role outside the focus categories (video-capture,
 * gaming) to `status: 'closed'` and backdate `validThrough` to today so
 * Google Jobs treats them as expired.
 *
 * Open roles are left untouched apart from setting their `status: 'open'`
 * explicitly so the field is present in every file going forward.
 *
 * Run with:  npx tsx scripts/flip-jobs-closed.ts
 */

import fs from "node:fs";
import path from "node:path";

const JOBS_DIR = path.join(process.cwd(), "src/data/jobs");
const OPEN_CATEGORIES = new Set(["video-capture", "gaming"]);
const TODAY = new Date().toISOString().slice(0, 10);
const OPEN_VALID_DAYS = 90;
const OPEN_VALID_THROUGH = new Date(
  Date.now() + OPEN_VALID_DAYS * 24 * 60 * 60 * 1000,
)
  .toISOString()
  .slice(0, 10);

function main() {
  const files = fs.readdirSync(JOBS_DIR).filter((f) => f.endsWith(".json"));
  let opened = 0;
  let closed = 0;
  let untouched = 0;

  for (const file of files) {
    const filePath = path.join(JOBS_DIR, file);
    const job = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const shouldBeOpen = OPEN_CATEGORIES.has(job.category) && !job.archived;
    const targetStatus = shouldBeOpen ? "open" : "closed";

    let mutated = false;

    if (job.status !== targetStatus) {
      job.status = targetStatus;
      mutated = true;
      if (targetStatus === "closed") closed++;
      else opened++;
    }

    if (targetStatus === "closed" && job.validThrough !== TODAY) {
      job.validThrough = TODAY;
      mutated = true;
    }

    // Keep open roles indexable in Google Jobs by extending validThrough when
    // it's already in the past.
    if (targetStatus === "open" && job.validThrough < TODAY) {
      job.validThrough = OPEN_VALID_THROUGH;
      mutated = true;
    }

    if (!mutated) {
      untouched++;
      continue;
    }

    fs.writeFileSync(filePath, JSON.stringify(job, null, 2) + "\n");
  }

  console.log(
    `Done. opened=${opened} closed=${closed} untouched=${untouched} total=${files.length}`,
  );
}

main();
