import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { Job } from "@/types/job";

/** Absolute path to the directory containing job JSON files. */
const JOBS_DIR = path.join(process.cwd(), "src/data/jobs");

/**
 * POST /api/admin/jobs/[slug]/archive
 *
 * Toggles the `archived` boolean on the job identified by `slug`.
 * The route is protected by the root middleware which verifies the
 * `admin-token` JWT cookie before the handler is reached.
 *
 * Returns the full updated job object on success.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Sanitise the slug to prevent directory traversal attacks.
  const sanitised = path.basename(slug);
  const filePath = path.join(JOBS_DIR, `${sanitised}.json`);

  // ---- Read ----------------------------------------------------------------
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: `Job "${sanitised}" not found` },
      { status: 404 }
    );
  }

  let job: Job;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    job = JSON.parse(raw) as Job;
  } catch {
    return NextResponse.json(
      { error: "Failed to read job file" },
      { status: 500 }
    );
  }

  // ---- Toggle --------------------------------------------------------------
  job.archived = !job.archived;

  // ---- Write ---------------------------------------------------------------
  try {
    fs.writeFileSync(filePath, JSON.stringify(job, null, 2) + "\n", "utf-8");
  } catch {
    return NextResponse.json(
      { error: "Failed to write job file" },
      { status: 500 }
    );
  }

  return NextResponse.json(job);
}
