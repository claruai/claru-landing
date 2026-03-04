import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getAnthropicClient } from "@/lib/deck-builder/ai-agent";
import type { SlideData, SlideLayout } from "@/types/deck-builder";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 4096;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GenerateRequest {
  company_type: string;
  stage: string;
  pain_point: string;
  modalities: string[];
}

interface RawSlide {
  title: string;
  body: string;
  layout: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_LAYOUTS: SlideLayout[] = [
  "title",
  "title-body",
  "two-column",
  "image-left",
  "image-right",
  "quote",
  "blank",
];

function isValidLayout(layout: string): layout is SlideLayout {
  return VALID_LAYOUTS.includes(layout as SlideLayout);
}

function buildPrompt(input: GenerateRequest): string {
  const modalityList = input.modalities.join(", ");

  return `You are a world-class B2B sales copywriter and presentation strategist. Your task is to generate a complete sales deck for Claru, a company that provides purpose-built training data for frontier AI labs.

TARGET AUDIENCE PROFILE:
- Company type: ${input.company_type}
- Company stage: ${input.stage}
- Primary pain point: ${input.pain_point}
- Data modalities they need: ${modalityList}

---

ABOUT CLARU (use this as the foundation for all content):

Claru provides purpose-built training data for frontier AI labs. We deliver expert human intelligence for video, robotics, multimodal, and vision model training. Our key differentiator is data quality — not just quantity.

Core value props:
- Expert human annotators with deep domain expertise (not crowdsourced gig workers)
- Custom annotation pipelines engineered for each specific modality and use case
- Glass-box transparency: full data provenance, quality metrics, and audit trails
- Dedicated partnership model with embedded teams per client
- Measurable impact on model performance benchmarks

We serve frontier AI research labs building video generation models, robotics systems, autonomous vehicles, multimodal foundation models, and computer vision applications. Our buyers are technical leaders — VPs of ML, research directors, heads of data — who are skeptical of generic data vendors and care about measurable improvements.

---

POSITIONING-ANGLES FRAMEWORK:

Find a contrarian or unique mechanism angle. Don't lead with "we have data." Lead with WHY existing data approaches fail for this specific audience (${input.company_type} at ${input.stage} stage dealing with "${input.pain_point}").

Strong angles to consider:
- "The data bottleneck isn't volume — it's specificity" (for teams drowning in low-quality data)
- "Your model is only as good as your worst annotation" (for quality-obsessed labs)
- "Generic data vendors are why your benchmarks plateau" (for teams stuck at performance ceilings)
- "The hidden cost of cheap data: more compute, worse models" (for cost-conscious teams)

Choose the angle that best resonates with the stated pain point and company context.

---

MESSAGE-ARCHITECTURE FRAMEWORK:

Structure the narrative as follows — each slide should advance this arc:

1. HOOK — A bold, specific opening claim that creates curiosity and tension. Make it about the audience's world, not about Claru. Use a statistic, provocative question, or contrarian statement.

2. PROBLEM / PAIN — Name the specific challenge they face. Be concrete. Reference their pain point: "${input.pain_point}". Quantify the cost where possible (wasted GPU hours, failed benchmarks, delayed launches, team frustration).

3. AGITATION (Cost of Inaction) — What happens if they don't solve this? Show the compounding consequences. Make the status quo feel unacceptable. Use contrast between where they are and where they could be.

4. SOLUTION (Claru's Approach) — Present Claru as the inevitable answer. Lead with the methodology, not the company. Show HOW we solve the problem differently. Emphasize the "glass box" approach vs. the industry's "black box" norm.

5. PROOF (Capabilities Per Modality) — For each selected modality (${modalityList}), create a dedicated slide showing specific capabilities, annotation types, and outcomes. Be technical and specific — this audience respects depth.

6. PROCESS (How It Works) — Remove friction. Show the clear path from first call to production data pipeline. Make engagement feel structured and low-risk. Steps: Discovery Call → Pilot Project → Custom Pipeline Design → Production Scale.

7. CTA (Next Steps) — Clear, single, low-friction ask. Not "buy now" — instead "schedule a technical deep-dive" or "start a pilot project." Give them a reason to act now.

---

DIRECT-RESPONSE-COPY FRAMEWORK:

Apply these copywriting rules to every slide:

1. HEADLINES: Specific and benefit-driven. Use numbers when possible. Lead with the outcome, not the feature. Maximum 10 words. Use contrast framing ("From X to Y" or "Not X — Y").

2. BODY COPY: Scannable. Use bullet points with bold lead-ins. Each bullet is a mini-argument. No filler words. Every sentence must earn its place.

3. CONTRAST: Create before/after or old way/new way comparisons. "Most labs → Claru clients" framing makes the choice feel obvious.

4. SPECIFICITY: Replace vague claims with concrete details. Not "better data" but "23% fewer training iterations to reach target BLEU scores." Not "faster" but "pilot to production in 6 weeks."

5. CTAs: Low-friction, specific, and benefit-framed. Not "Contact us" but "Book a 30-minute technical deep-dive — we'll analyze your current data pipeline."

---

SLIDE STRUCTURE:

Generate exactly this sequence of slides:

1. Title/hook slide — layout: "title" — Bold opening claim tailored to their pain point
2. Problem statement — layout: "title-body" — Their specific pain, quantified
3. Old way vs new way — layout: "two-column" — Split body with "---" delimiter between left (old way/status quo) and right (new way/Claru approach)
4. Claru solution overview — layout: "title-body" — Our approach and methodology
${input.modalities.map((mod, i) => `${5 + i}. ${mod} capabilities — layout: "title-body" — Specific ${mod} data capabilities, annotation types, and outcomes`).join("\n")}
${5 + input.modalities.length}. Social proof / results — layout: "quote" — A compelling results statement or testimonial-style proof point
${6 + input.modalities.length}. How it works / process — layout: "title-body" — The engagement process, step by step
${7 + input.modalities.length}. CTA / next steps — layout: "title" — Clear call to action with urgency

---

OUTPUT FORMAT:

Return ONLY a JSON array of slide objects. No markdown, no explanation, no wrapping text. Each object must have exactly these fields:
- "title": string (the slide headline)
- "body": string (the slide body content — use markdown: **bold**, *italic*, - bullet lists)
- "layout": string (one of: "title", "title-body", "two-column", "quote")

For the two-column slide (old way vs new way), separate the left and right columns with "---" in the body field.

Example format:
[
  { "title": "Your Headline Here", "body": "Body content with **bold** and - bullets", "layout": "title" },
  { "title": "Problem Title", "body": "- Point one\\n- Point two\\n- Point three", "layout": "title-body" }
]`;
}

function mapToSlideData(rawSlides: RawSlide[]): SlideData[] {
  return rawSlides.map((raw, index) => ({
    id: crypto.randomUUID(),
    order: index,
    layout: isValidLayout(raw.layout) ? raw.layout : "title-body",
    title: raw.title || "",
    body: raw.body || "",
    background: {
      type: "solid" as const,
      value: "#050505",
    },
    metadata: {},
  }));
}

function extractJsonArray(text: string): RawSlide[] {
  // Try parsing the whole text directly
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not valid JSON directly — try to extract array
  }

  // Find the first [ and last ] in the text
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON array found in response");
  }

  const jsonStr = text.slice(start, end + 1);
  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed)) {
    throw new Error("Parsed content is not an array");
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// POST /api/admin/deck-builder/[id]/generate
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // -- Auth ----------------------------------------------------------------
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // We read `id` from params even though we don't fetch the template,
  // to maintain consistency with the route structure and allow future use.
  await params;

  // -- Parse request body --------------------------------------------------
  let body: GenerateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate required fields
  if (!body.company_type || typeof body.company_type !== "string") {
    return NextResponse.json(
      { error: "company_type is required" },
      { status: 400 }
    );
  }
  if (!body.stage || typeof body.stage !== "string") {
    return NextResponse.json({ error: "stage is required" }, { status: 400 });
  }
  if (
    !body.pain_point ||
    typeof body.pain_point !== "string" ||
    body.pain_point.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "pain_point is required (minimum 10 characters)" },
      { status: 400 }
    );
  }
  if (
    !Array.isArray(body.modalities) ||
    body.modalities.length === 0 ||
    !body.modalities.every((m) => typeof m === "string")
  ) {
    return NextResponse.json(
      { error: "modalities must be a non-empty array of strings" },
      { status: 400 }
    );
  }

  // -- Build prompt and call Claude ----------------------------------------
  const prompt = buildPrompt(body);
  const anthropic = getAnthropicClient();

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text content from the response
    const textBlocks = response.content.filter(
      (block) => block.type === "text"
    );
    if (textBlocks.length === 0) {
      return NextResponse.json(
        { error: "No text content in AI response" },
        { status: 500 }
      );
    }

    const rawText = textBlocks
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    // Parse JSON from the response
    let rawSlides: RawSlide[];
    try {
      rawSlides = extractJsonArray(rawText);
    } catch (parseError) {
      console.error(
        "[generate] Failed to parse Claude response as JSON:",
        parseError
      );
      console.error("[generate] Raw response:", rawText.slice(0, 500));
      return NextResponse.json(
        { error: "Failed to parse AI-generated content" },
        { status: 500 }
      );
    }

    // Validate that we got a reasonable number of slides
    if (rawSlides.length < 4 || rawSlides.length > 20) {
      console.error(
        `[generate] Unexpected slide count: ${rawSlides.length}`
      );
      return NextResponse.json(
        { error: `AI generated ${rawSlides.length} slides (expected 8-12)` },
        { status: 500 }
      );
    }

    // Map to proper SlideData objects
    const slides = mapToSlideData(rawSlides);

    return NextResponse.json({ slides });
  } catch (err) {
    console.error("[generate] Anthropic API error:", err);
    return NextResponse.json(
      { error: "AI generation failed. Please try again." },
      { status: 500 }
    );
  }
}
