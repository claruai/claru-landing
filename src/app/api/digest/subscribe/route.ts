import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { email } = body;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 },
    );
  }

  try {
    // 1. Create Resend contact + add to digest segment (non-fatal)
    try {
      const contact = await getResend().contacts.create({ email, unsubscribed: false });
      const contactId = contact.data?.id;
      const segmentId = process.env.RESEND_DIGEST_SEGMENT_ID;
      if (contactId && segmentId) {
        await fetch(`https://api.resend.com/contacts/${contactId}/segments/${segmentId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        });
      }
    } catch {
      console.warn("[POST /api/digest/subscribe] Failed to create Resend contact", email);
    }

    // 2. Upsert into digest_subscribers via Supabase service role
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      await supabase
        .from("digest_subscribers")
        .upsert(
          { email, source: "datasets_page" },
          { onConflict: "email" },
        );
    } catch {
      console.warn("[POST /api/digest/subscribe] Failed to upsert subscriber", email);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/digest/subscribe]", err);
    return NextResponse.json({ success: true }); // Don't leak errors to client
  }
}
