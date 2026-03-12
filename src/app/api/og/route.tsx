import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const VALID_CATEGORIES = [
  "default",
  "pillar",
  "case-study",
  "job",
  "data-catalog",
  "legal",
] as const;

type Category = (typeof VALID_CATEGORIES)[number];

const CATEGORY_CONFIG: Record<
  Category,
  { badge: string | null; borderColor: string; titlePrefix: string }
> = {
  default: { badge: null, borderColor: "#92B090", titlePrefix: "" },
  pillar: { badge: "CAPABILITY", borderColor: "#92B090", titlePrefix: "> " },
  "case-study": { badge: "CASE STUDY", borderColor: "#92B090", titlePrefix: "" },
  job: { badge: "NOW HIRING", borderColor: "#92B090", titlePrefix: "" },
  "data-catalog": { badge: "DATA", borderColor: "#92B090", titlePrefix: "" },
  legal: { badge: null, borderColor: "#666666", titlePrefix: "" },
};

// Google Fonts CDN URLs for woff format
const JETBRAINS_MONO_URL =
  "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FPpRFrDjcadYbKuGZOCIs.woff";
const GEIST_BOLD_URL =
  "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-700-normal.woff";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + "\u2026";
}

function isValidCategory(value: string): value is Category {
  return (VALID_CATEGORIES as readonly string[]).includes(value);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const subtitle = searchParams.get("subtitle") ?? searchParams.get("description") ?? "";
  const rawCategory = searchParams.get("category") ?? "default";

  // Validate required title param
  if (!title || title.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "Missing required query parameter: title" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const category: Category = isValidCategory(rawCategory) ? rawCategory : "default";
  const config = CATEGORY_CONFIG[category];

  // Truncate long text
  const displayTitle = truncate(title.trim(), 80);
  const displaySubtitle = truncate(subtitle.trim(), 120);

  // Load fonts - fetch in parallel, with graceful fallback
  let jetbrainsData: ArrayBuffer | null = null;
  let geistBoldData: ArrayBuffer | null = null;

  try {
    const [jetbrainsRes, geistRes] = await Promise.all([
      fetch(JETBRAINS_MONO_URL),
      fetch(GEIST_BOLD_URL),
    ]);

    if (jetbrainsRes.ok) jetbrainsData = await jetbrainsRes.arrayBuffer();
    if (geistRes.ok) geistBoldData = await geistRes.arrayBuffer();
  } catch {
    // Fonts will fallback to system monospace
  }

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[] = [];
  if (geistBoldData) {
    fonts.push({ name: "Geist", data: geistBoldData, weight: 700, style: "normal" });
  }
  if (jetbrainsData) {
    fonts.push({ name: "JetBrains Mono", data: jetbrainsData, weight: 400, style: "normal" });
  }

  const monoFamily = jetbrainsData ? "JetBrains Mono" : "monospace";
  const sansFamily = geistBoldData ? "Geist" : "system-ui, sans-serif";

  const isLegal = category === "legal";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0908",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left accent border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            backgroundColor: config.borderColor,
            display: "flex",
          }}
        />

        {/* Scanline overlay - subtle horizontal lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
            display: "flex",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "48px 60px 48px 64px",
          }}
        >
          {/* Top: CLARU branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: "28px",
                color: "#92B090",
                letterSpacing: "6px",
                fontWeight: 400,
              }}
            >
              CLARU
            </span>
            <div
              style={{
                width: "40px",
                height: "1px",
                backgroundColor: "#92B090",
                opacity: 0.4,
                display: "flex",
              }}
            />
          </div>

          {/* Center: Title and subtitle */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                fontFamily: sansFamily,
                fontSize: displayTitle.length > 50 ? "40px" : "48px",
                fontWeight: 700,
                color: isLegal ? "#999999" : "#FFFFFF",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                display: "flex",
              }}
            >
              {config.titlePrefix}
              {displayTitle}
            </div>

            {displaySubtitle && (
              <div
                style={{
                  fontFamily: sansFamily,
                  fontSize: "24px",
                  color: "#999999",
                  lineHeight: 1.4,
                  display: "flex",
                }}
              >
                {displaySubtitle}
              </div>
            )}
          </div>

          {/* Bottom: URL and category badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left: decorative line + URL */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "1px",
                  backgroundColor: "#92B090",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontFamily: monoFamily,
                  fontSize: "16px",
                  color: "#92B090",
                  letterSpacing: "1px",
                }}
              >
                claru.ai
              </span>
              <div
                style={{
                  width: "80px",
                  height: "1px",
                  backgroundColor: "rgba(146, 176, 144, 0.2)",
                  display: "flex",
                }}
              />
            </div>

            {/* Right: category badge */}
            {config.badge && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #92B090",
                  borderRadius: "4px",
                  padding: "6px 16px",
                }}
              >
                <span
                  style={{
                    fontFamily: monoFamily,
                    fontSize: "13px",
                    color: "#92B090",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  {config.badge}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    }
  );
}
