import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getJobBySlug } from "@/lib/jobs";
import type { Job, JobCategory } from "@/types/job";
import { JOB_CATEGORIES } from "@/types/job";

/** Absolute path to the directory containing job JSON files. */
const JOBS_DIR = path.join(process.cwd(), "src/data/jobs");

/** Valid category slugs for validation. */
const VALID_CATEGORIES = Object.keys(JOB_CATEGORIES) as JobCategory[];

/**
 * PUT /api/admin/jobs/[slug]
 *
 * Updates an existing job listing on disk. The request body should contain
 * the editable fields. Slug and datePosted are preserved from the existing
 * file and cannot be changed.
 *
 * Protected by admin-token cookie verification.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  /* ---- Auth check ---------------------------------------------------- */
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("admin-token");

  if (!tokenCookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isValid = await verifyAdminToken(tokenCookie.value);
  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ---- Resolve slug -------------------------------------------------- */
  const { slug } = await params;
  const existingJob = getJobBySlug(slug);

  if (!existingJob) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  /* ---- Parse body ---------------------------------------------------- */
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  /* ---- Validation ---------------------------------------------------- */
  const errors: Record<string, string> = {};

  // Title: required, non-empty string
  const title =
    typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    errors.title = "Title is required";
  }

  // Category: must be a valid category slug
  const category = body.category as string;
  if (!VALID_CATEGORIES.includes(category as JobCategory)) {
    errors.category = "Invalid category";
  }

  // Description
  const description =
    typeof body.description === "string" ? body.description : "";

  // Skills: 1-5 strings
  const skills = Array.isArray(body.skills) ? body.skills : [];
  if (skills.length < 1) {
    errors.skills = "At least 1 skill is required";
  } else if (skills.length > 5) {
    errors.skills = "Maximum 5 skills allowed";
  }

  // Compensation: min must be less than max
  const compensationMin = Number(body.compensationMin);
  const compensationMax = Number(body.compensationMax);

  if (isNaN(compensationMin) || compensationMin < 0) {
    errors.compensationMin = "Valid minimum compensation is required";
  }
  if (isNaN(compensationMax) || compensationMax < 0) {
    errors.compensationMax = "Valid maximum compensation is required";
  }
  if (
    !errors.compensationMin &&
    !errors.compensationMax &&
    compensationMin >= compensationMax
  ) {
    errors.compensationMin =
      "Minimum compensation must be less than maximum";
  }

  // validThrough: optional ISO date string
  const validThrough =
    typeof body.validThrough === "string"
      ? body.validThrough
      : existingJob.validThrough;

  // locationRequirements: optional string
  const locationRequirements =
    typeof body.locationRequirements === "string"
      ? body.locationRequirements
      : existingJob.locationRequirements;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, {
      status: 422,
    });
  }

  /* ---- Merge and write ----------------------------------------------- */
  const updatedJob: Job = {
    ...existingJob,
    title,
    category: category as JobCategory,
    description,
    skills: skills as string[],
    compensationMin,
    compensationMax,
    validThrough,
    locationRequirements: locationRequirements || undefined,
  };

  const filePath = path.join(JOBS_DIR, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(updatedJob, null, 2) + "\n", "utf-8");

  return NextResponse.json(updatedJob);
}
