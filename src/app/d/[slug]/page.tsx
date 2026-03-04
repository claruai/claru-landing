import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShareSettings {
  enabled: boolean;
  slug: string | null;
  expiry: string | null;
  gate_type: "none" | "email" | "password";
  gate_value: string | null;
  cta_enabled: boolean;
  cta_text: string | null;
  cta_url: string | null;
  show_branding: boolean;
}

interface TemplateRow {
  id: string;
  name: string;
  description: string | null;
  share_settings: ShareSettings;
}

// ---------------------------------------------------------------------------
// Helper: fetch template by share slug
// ---------------------------------------------------------------------------

async function getTemplateBySlug(slug: string): Promise<TemplateRow | null> {
  const supabase = createSupabaseAdminClient();

  // Query for templates where share_settings->>slug matches and enabled is true
  const { data } = await supabase
    .from("slide_templates")
    .select("id, name, description, share_settings")
    .filter("share_settings->>slug", "eq", slug)
    .filter("share_settings->>enabled", "eq", "true")
    .limit(1)
    .single();

  return data as TemplateRow | null;
}

// ---------------------------------------------------------------------------
// Helper: validate token from ?t= query param
// ---------------------------------------------------------------------------

interface TokenValidation {
  valid: boolean;
  tokenId: string | null;
  email: string | null;
}

async function validateToken(
  token: string,
  templateId: string,
): Promise<TokenValidation> {
  const supabase = createSupabaseAdminClient();

  const { data } = await supabase
    .from("deck_share_tokens")
    .select("id, email, template_id, expires_at")
    .eq("token", token)
    .single();

  if (!data) {
    return { valid: false, tokenId: null, email: null };
  }

  // Check template match
  if (data.template_id !== templateId) {
    return { valid: false, tokenId: null, email: null };
  }

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, tokenId: null, email: null };
  }

  return { valid: true, tokenId: data.id, email: data.email };
}

// ---------------------------------------------------------------------------
// Dynamic Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    return { title: "Deck Not Found" };
  }

  return {
    title: template.name,
    description: template.description || `View the ${template.name} presentation`,
    openGraph: {
      title: template.name,
      description: template.description || `View the ${template.name} presentation`,
      type: "website",
    },
  };
}

// ---------------------------------------------------------------------------
// Page Component (Server Component)
// ---------------------------------------------------------------------------

export default async function SharedDeckPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  // Check expiry
  if (template.share_settings.expiry) {
    const expiryDate = new Date(template.share_settings.expiry);
    if (expiryDate < new Date()) {
      return <ExpiredPage deckName={template.name} />;
    }
  }

  // US-007: Token validation and attribution
  const tokenParam = typeof resolvedSearchParams.t === "string" ? resolvedSearchParams.t : null;
  let tokenContext: { token: string; tokenId: string; email: string } | null = null;

  if (tokenParam) {
    const validation = await validateToken(tokenParam, template.id);
    if (validation.valid && validation.tokenId && validation.email) {
      tokenContext = {
        token: tokenParam,
        tokenId: validation.tokenId,
        email: validation.email,
      };
    }
    // If invalid/expired, render as anonymous (no attribution) — don't block
  }

  // For gate_type 'none', render the deck directly
  // (Future: gate_type 'email' and 'password' will be handled in US-004)
  if (template.share_settings.gate_type === "none") {
    return (
      <DeckViewer
        templateId={template.id}
        deckName={template.name}
        tokenContext={tokenContext}
      />
    );
  }

  // Fallback for gate types not yet implemented — render deck anyway
  return (
    <DeckViewer
      templateId={template.id}
      deckName={template.name}
      tokenContext={tokenContext}
    />
  );
}

// ---------------------------------------------------------------------------
// Expired Page
// ---------------------------------------------------------------------------

function ExpiredPage({ deckName }: { deckName: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0a0908",
        color: "#e8e8e8",
        fontFamily: "'JetBrains Mono', monospace",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          color: "#92B090",
          opacity: 0.4,
        }}
      >
        //
      </div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        This link has expired
      </h1>
      <p style={{ color: "#888", fontSize: "0.9rem", maxWidth: "400px", lineHeight: 1.6 }}>
        The shared link for <strong style={{ color: "#e8e8e8" }}>{deckName}</strong> is
        no longer available. Please contact the sender for a new link.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Deck Viewer — full-screen iframe to the present route
// ---------------------------------------------------------------------------

function DeckViewer({
  templateId,
  deckName,
  tokenContext,
}: {
  templateId: string;
  deckName: string;
  tokenContext: { token: string; tokenId: string; email: string } | null;
}) {
  const presentUrl = `/api/slide/${templateId}/present`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0908",
        overflow: "hidden",
      }}
    >
      {/* Hidden data for tracking script (US-006 will use this) */}
      <div
        id="deck-context"
        data-template-id={templateId}
        data-deck-name={deckName}
        data-token={tokenContext?.token ?? ""}
        data-token-id={tokenContext?.tokenId ?? ""}
        style={{ display: "none" }}
      />
      <iframe
        src={presentUrl}
        title={deckName}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "#0a0908",
        }}
        allowFullScreen
      />
    </div>
  );
}
