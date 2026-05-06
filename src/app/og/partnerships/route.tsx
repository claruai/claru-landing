import { ImageResponse } from "next/og";

export const runtime = "edge";

const JETBRAINS_MONO_URL =
  "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FPpRFrDjcadYbKuGZOCIs.woff";
const GEIST_BOLD_URL =
  "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-700-normal.woff";

const HEADLINE = "Your team already makes the data AI labs are paying for.";
const FOOTER = "claru.ai/partnerships";

export async function GET() {
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
    // graceful fallback to system fonts
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
        {/* left accent border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            backgroundColor: "#92B090",
            display: "flex",
          }}
        />

        {/* scanline overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
            display: "flex",
          }}
        />

        {/* main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "56px 64px 48px 72px",
          }}
        >
          {/* top: CLARU + eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
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
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: "14px",
                color: "rgba(146,176,144,0.7)",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              // PARTNERSHIPS
            </span>
          </div>

          {/* center: headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "1040px",
            }}
          >
            <div
              style={{
                fontFamily: sansFamily,
                fontSize: "60px",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                display: "flex",
              }}
            >
              {HEADLINE}
            </div>
          </div>

          {/* bottom: URL footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
                {FOOTER}
              </span>
              <div
                style={{
                  width: "120px",
                  height: "1px",
                  backgroundColor: "rgba(146, 176, 144, 0.2)",
                  display: "flex",
                }}
              />
            </div>

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
                NET-15 · WEEKLY PAYOUTS
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    },
  );
}
