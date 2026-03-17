import { NextRequest, NextResponse } from "next/server";
import { getS3SignedUrl } from "@/lib/s3/presigner";

/**
 * Fields to strip from annotation JSON before returning to leads/prospects.
 * These contain internal cost, payment, and PII data.
 */
const SENSITIVE_TOP_LEVEL_KEYS = new Set([
  "userId",
  "reviewerId",
  "payoutId",
  "amount",
  "paymentStatus",
  "paymentDate",
  "cost",
  "browserMetadata",
  "rejectionReason",
  "rejectionCount",
  "rejectedAt",
  "isTestTemplate",
  "annotationIndex",
]);

const SENSITIVE_PROJECT_KEYS = new Set([
  "annotationCost",
  "annotationCostType",
  "reviewCost",
  "isCompleted",
  "isActive",
  "projectGuideLink",
  "slackChannel",
  "generalDataSchema",
  "templateData",
  "configuration",
]);

function stripSensitiveFields(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_TOP_LEVEL_KEYS.has(key)) continue;

    if (key === "project" && value && typeof value === "object") {
      const project: Record<string, unknown> = {};
      for (const [pk, pv] of Object.entries(value as Record<string, unknown>)) {
        if (!SENSITIVE_PROJECT_KEYS.has(pk)) {
          project[pk] = pv;
        }
      }
      cleaned[key] = project;
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Public annotation endpoint for prospect pages and portal.
 * Fetches annotation JSON from S3, strips sensitive fields, and returns it.
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  // Only allow annotation-data.json and data.json files
  if (!key.endsWith("/annotation-data.json") && !key.endsWith("/data.json")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  try {
    const url = await getS3SignedUrl(key);
    if (!url) {
      return NextResponse.json({ error: "Failed to sign URL" }, { status: 500 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = await response.json();
    const cleaned = stripSensitiveFields(data);
    return NextResponse.json(cleaned);
  } catch {
    return NextResponse.json({ error: "Failed to fetch annotation" }, { status: 500 });
  }
}
