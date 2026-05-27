"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  trackTikTokEvent,
  identifyTikTokUser,
  getVisitorId,
} from "@/lib/tracking/tiktok";
import { trackRedditEvent } from "@/lib/tracking/reddit";

const PIXEL_CONTENT = {
  content_id: "br-collect-captura-domestica",
  content_type: "product" as const,
  content_name: "Captura doméstica BR",
};

/** Estimated value of a signed-up BR collector. Tune later from real data. */
const CONVERSION_VALUE_USD = 50;

type Lang = "pt" | "en";

const T = {
  pt: {
    email: "E-mail",
    emailPlaceholder: "voce@exemplo.com",
    whatsapp: "WhatsApp (opcional)",
    whatsappPlaceholder: "(11) 91234-5678",
    submit: "Quero ganhar em USD →",
    submitting: "Enviando…",
    microcopy: "Sem taxa. Sem pegadinha. Resposta em 24h por e-mail.",
    // Non-LATAM (generic): we've got the lead, we'll follow up by email.
    successHeader: "Recebemos. Pode fechar essa aba tranquilo.",
    successBody:
      "Vamos te enviar o guia de gravação e um exemplo aceito em até 24 horas por e-mail. Sem taxa. Sem curso. Sem MLM.",
    // LATAM: project is live, push them to signup now.
    successLiveHeader: "Recebemos. O projeto já está aberto.",
    successLiveBody:
      "Crie sua conta agora pra liberar o guia de gravação e o clipe piloto. Também te mandamos o link por e-mail. Sem taxa, em nenhum momento.",
    successLiveCta: "Criar conta na Claru →",
    errorEmailRequired: "Coloque seu e-mail pra continuar.",
    errorEmailInvalid: "Confere o e-mail.",
    errorWhatsapp: "Confere o número do WhatsApp (DDD + 9 dígitos).",
    errorSend: "Algo deu errado. Tenta de novo em alguns segundos.",
  },
  en: {
    email: "Email",
    emailPlaceholder: "you@example.com",
    whatsapp: "WhatsApp (optional)",
    whatsappPlaceholder: "(11) 91234-5678",
    submit: "Start earning in USD →",
    submitting: "Sending…",
    microcopy: "No fee. No catch. Reply by email within 24h.",
    successHeader: "Got it. You can close this tab.",
    successBody:
      "We'll email you the filming guide and an accepted example within 24 hours. No fee. No course. No MLM.",
    successLiveHeader: "Got it. The project is live.",
    successLiveBody:
      "Create your account now to unlock the filming guide and the pilot clip. We've also emailed you the link. No fee, ever.",
    successLiveCta: "Create my Claru account →",
    errorEmailRequired: "Add your email to continue.",
    errorEmailInvalid: "Check your email.",
    errorWhatsapp: "Check your WhatsApp number (area code + 9 digits).",
    errorSend: "Something went wrong. Try again in a few seconds.",
  },
} as const;

/**
 * Per-submit dedup id shared with the TikTok server-side event so the
 * pixel and the CAPI call are deduplicated.
 */
function makeEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Format a digits-only Brazilian mobile number as `(11) 91234-5678`.
 * Strips +55 if present so we don't double-prefix the visible adornment.
 */
function formatBrPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length > 11) digits = digits.slice(2);
  digits = digits.slice(0, 11); // DDD (2) + mobile (9)
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function whatsappDigitsValid(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  // BR mobile: 2-digit DDD + 9-digit mobile = 11 digits.
  return digits.length >= 10 && digits.length <= 11;
}

export default function InterestForm({
  lang,
  utm,
  variant = "hero",
}: {
  lang: Lang;
  utm: Record<string, string>;
  variant?: "hero" | "full";
}) {
  const t = T[lang];

  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLatamConversion, setIsLatamConversion] = useState(false);
  const [signupUrl, setSignupUrl] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg(t.errorEmailRequired);
      setState("error");
      return;
    }
    // Cheap email shape check — server is authoritative.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg(t.errorEmailInvalid);
      setState("error");
      return;
    }
    // WhatsApp is optional now; only validate if provided.
    if (whatsapp.trim() && !whatsappDigitsValid(whatsapp)) {
      setErrorMsg(t.errorWhatsapp);
      setState("error");
      return;
    }

    setState("submitting");
    setErrorMsg(null);

    const digits = whatsapp.replace(/\D/g, "");
    const fallbackName = trimmedEmail.split("@")[0] || "Collector";
    const phonePayload = digits ? `+55${digits}` : "";
    // Generated client-side so the server can dedupe its CAPI event
    // with whatever the browser pixel fires.
    const eventId = makeEventId();
    const visitorId = getVisitorId();

    // Identify BEFORE the track calls so TikTok stitches the events to
    // the same advanced-matching user. All fields hashed client-side.
    await identifyTikTokUser({
      email: trimmedEmail,
      phone: phonePayload || undefined,
      externalId: visitorId || undefined,
    });

    // Dev-only: forward ?dev_geo through to the API so the geo gate can
    // be exercised in the browser locally (the API helper ignores it in
    // production).
    const devGeo =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("dev_geo")
        : null;
    const submitUrl = devGeo
      ? `/api/collect/interest?dev_geo=${encodeURIComponent(devGeo)}`
      : "/api/collect/interest";

    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fallbackName,
          email: trimmedEmail,
          whatsapp: phonePayload,
          country: "BR",
          source: "br-collect-captura-domestica",
          lang,
          event_id: eventId,
          visitor_id: visitorId,
          ...utm,
        }),
      });

      if (!res.ok) {
        setErrorMsg(t.errorSend);
        setState("error");
        return;
      }

      const json: {
        success?: boolean;
        is_latam_conversion?: boolean;
        signup_url?: string | null;
      } = await res.json().catch(() => ({}));

      const latam = !!json.is_latam_conversion;
      setIsLatamConversion(latam);
      setSignupUrl(json.signup_url ?? null);

      // Reddit Lead fires for every successful submit — it's our generic
      // funnel signal, not the paid-channel conversion gate.
      trackRedditEvent("Lead", undefined, {
        content_name: "br-collect-captura-domestica",
        ...utm,
      });

      // TikTok conversions fire ONLY for the LATAM cohort — the audience
      // we pay to acquire. Keeps the pixel learning clean. event_id is
      // shared with the server-side CAPI call for dedup.
      if (latam) {
        const conversionParams = {
          contents: [PIXEL_CONTENT],
          value: CONVERSION_VALUE_USD,
          currency: "USD",
          event_id: eventId,
          extra: utm,
        };
        trackTikTokEvent("SubmitForm", conversionParams);
        trackTikTokEvent("CompleteRegistration", conversionParams);
        // Lead fires too — TikTok's diagnostics flag "missing Lead event"
        // for non-ecom verticals so this satisfies that signal-coverage
        // warning without duplicating the conversion value (TikTok
        // dedupes Lead vs CompleteRegistration server-side on event_id).
        trackTikTokEvent("Lead", conversionParams);
      }

      setState("success");
    } catch {
      setErrorMsg(t.errorSend);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 sm:p-8"
        style={{
          background: "rgba(146, 176, 144, 0.10)",
          border: "1px solid rgba(146, 176, 144, 0.45)",
        }}
        data-testid="form-success"
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-1 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(146, 176, 144, 0.22)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div className="w-full">
            <h3
              className="text-lg sm:text-xl font-semibold"
              style={{ color: "var(--accent-primary)" }}
            >
              {isLatamConversion ? t.successLiveHeader : t.successHeader}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
              {isLatamConversion ? t.successLiveBody : t.successBody}
            </p>
            {isLatamConversion && signupUrl && (
              <a
                href={signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="cta-signup-latam"
                className="mt-4 inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-base transition-all duration-200 hover:opacity-95 active:scale-[0.99]"
                style={{
                  background: "#ffffff",
                  color: "#0a0908",
                  boxShadow:
                    "0 10px 36px rgba(146, 176, 144, 0.30), 0 0 0 1px rgba(255,255,255,0.08) inset",
                }}
              >
                {t.successLiveCta}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  const compact = variant === "hero";

  return (
    <form
      onSubmit={onSubmit}
      className={
        compact
          ? "rounded-2xl p-4 sm:p-5"
          : "rounded-2xl p-6 sm:p-8"
      }
      style={{
        background: compact
          ? "rgba(255,255,255,0.04)"
          : "var(--bg-secondary)",
        border: compact
          ? "1px solid rgba(255,255,255,0.10)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: compact ? "blur(8px)" : undefined,
      }}
    >
      <div className="space-y-3">
        {/* Email — primary identifier, required */}
        <label className="block">
          <span className="block text-[11px] font-mono uppercase tracking-[0.12em] text-white/55 mb-1.5">
            {t.email}
            <span style={{ color: "var(--accent-primary)" }}> *</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            enterKeyHint="send"
            placeholder={t.emailPlaceholder}
            data-testid="input-email"
            className="w-full rounded-lg px-3 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.03]"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          />
        </label>

        {/* WhatsApp — optional, lighter visual weight */}
        <label className="block">
          <span className="block text-[11px] font-mono uppercase tracking-[0.12em] text-white/45 mb-1.5">
            {t.whatsapp}
          </span>
          <div
            className="flex items-stretch rounded-lg overflow-hidden"
            style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <span
              aria-hidden="true"
              className="flex items-center px-3 font-mono text-white/65 text-sm border-r"
              style={{ borderColor: "rgba(255,255,255,0.10)" }}
            >
              +55
            </span>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatBrPhone(e.target.value))}
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={t.whatsappPlaceholder}
              data-testid="input-whatsapp"
              className="flex-1 bg-transparent px-3 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.03]"
            />
          </div>
        </label>
      </div>

      {errorMsg && (
        <p
          className="mt-3 text-sm font-mono"
          style={{ color: "#e58a8a" }}
          role="alert"
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        data-testid="cta-apply-br"
        className="mt-4 w-full px-6 py-4 rounded-full font-semibold text-base sm:text-[17px] transition-all duration-200 hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: "#ffffff",
          color: "#0a0908",
          boxShadow:
            "0 10px 36px rgba(146, 176, 144, 0.30), 0 0 0 1px rgba(255,255,255,0.08) inset",
        }}
      >
        {state === "submitting" ? t.submitting : t.submit}
      </button>

      <p className="mt-3 text-[12px] sm:text-[13px] text-white/55 leading-relaxed text-center">
        {t.microcopy}
      </p>
    </form>
  );
}
