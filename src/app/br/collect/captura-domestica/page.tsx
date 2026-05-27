"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import Logo from "@/app/components/ui/Logo";
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
import InterestForm from "./InterestForm";

/**
 * UGC household-capture LP — Brazil. v2 rebuild for paid TikTok traffic.
 *
 * Audience reality: 95%+ mobile, in-app browser, cold, scam-skeptical.
 * Page is dollar-dominant, anti-positions vs the BR scam category, and
 * compresses the funnel: WhatsApp + optional email above the fold.
 *
 * PT/EN switching is kept (?lang=en) but the visible toggle is removed —
 * 100% of paid spend is BR/PT.
 */

type Lang = "pt" | "en";

const HERO_CLIP = {
  src: "/videos/catalog/egocentric/clip_2.mp4",
  poster: "/videos/catalog/egocentric/clip_2-poster.jpg",
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const COPY = {
  pt: {
    antiChip: "Não é renda extra. Não é curso. Não é app de vídeo curto.",
    payAmount: "$300",
    payUnit: "USD / semana",
    payBrl: "≈ R$1.500 · pago em dólar via Wise, PayPal ou transferência bancária",
    heroSub: "para filmar tarefas de casa com o celular.",
    mechanism:
      "Um laboratório de IA dos EUA precisa de vídeos de pessoas reais fazendo tarefas domésticas pra treinar robôs. Você grava, eles pagam em dólar.",
    formNote: "Cadastro de 30 segundos. Resposta em 24h por e-mail.",
    stickyCta: "Quero ganhar em USD →",

    trustHeader: "Quem está pagando",
    trustLine: "Pagamento internacional em USD. Sem taxa, nunca.",
    trustClaru:
      "Claru AI é uma empresa Reka AI, apoiada pela NVIDIA. Treinamos os robôs domésticos da próxima geração.",

    antiScamLabel: "Importante",
    antiScamH: "Você não paga nada. Nunca.",
    antiScamB:
      "Nós pagamos você depois que seu clipe piloto passa na revisão. Sem taxa de inscrição. Sem curso pago. Sem MLM. Sem grupo de Telegram cobrando entrada. Se alguém te pedir dinheiro em nome da Claru, é golpe.",
    antiScamBullets: [
      "Você nunca paga nada pra começar",
      "Pagamento sai depois do piloto aprovado",
      "Em dólar, na conta no seu nome",
    ],

    payHeader: "O que você ganha",
    payCards: [
      { big: "$6", unit: "USD/hora", sub: "≈ R$30" },
      { big: "$40", unit: "USD/dia", sub: "6–7h gravando · ≈ R$200" },
      { big: "$300", unit: "USD/semana", sub: "no tempo livre · ≈ R$1.500" },
    ],
    payNote:
      "Pago via Wise, PayPal ou transferência bancária. Sem taxa inicial. Sem limite de horas.",

    reqLabel: "O que precisa",
    reqH: "Quatro coisas. Honesto.",
    reqIntro:
      "Se você tem três e consegue a quarta hoje, está dentro. Confirma cada uma no formulário.",
    req: [
      {
        t: "Celular com câmera 0.5x grande angular",
        b: "Abra a câmera e procure 0.5x perto do botão de gravar. iPhone 11+, Galaxy S21+, Pixel 6+ e a maioria dos Androids recentes servem.",
      },
      {
        t: "Suporte de cabeça ou peito pro celular",
        b: "Clipe simples que segura o celular na altura dos olhos, mãos livres. R$50–R$100 no Mercado Livre.",
      },
      {
        t: "Conta no seu nome (Wise, PayPal ou banco BR)",
        b: "Pagamos em dólar pra conta no seu nome. Aberto pra todo o Brasil.",
      },
      {
        t: "10 minutos pra gravar o clipe piloto",
        b: "A gente manda o guia e um exemplo aceito. Piloto passa = você é liberado.",
      },
    ],

    howLabel: "Como funciona",
    howH: "Três passos.",
    how: [
      {
        n: "01",
        time: "30 seg",
        t: "Cadastro",
        b: "Manda seu WhatsApp. A gente responde com o guia.",
      },
      {
        n: "02",
        time: "10 min",
        t: "Grava o piloto",
        b: "Louça, lavanderia ou organização. 0.5x, com suporte.",
      },
      {
        n: "03",
        time: "Após QA",
        t: "Recebe em USD",
        b: "Piloto aprovado = pagamento liberado + sessões pagas.",
      },
    ],

    specLabel: "Especificações",
    specH: "Resumo rápido.",
    specIntro: "Guia completo depois do cadastro. Isso é o resumo.",
    specRows: [
      { k: "CÂMERA", v: "0.5x grande angular, horizontal" },
      { k: "SUPORTE", v: "Cabeça ou peito, estável" },
      { k: "ENQUADRAMENTO", v: "Ambas as mãos visíveis em 90% dos quadros" },
      { k: "DURAÇÃO", v: "2 a 30 min por clipe, uma tarefa por clipe" },
    ],

    faqLabel: "Perguntas",
    faqH: "Os três 'e se?' que todo mundo faz.",
    faq: [
      {
        q: "Como sei que não é golpe?",
        a: "Você nunca paga nada. A Claru é uma empresa Reka AI, apoiada pela NVIDIA. Pagamento sai em dólar via Wise, PayPal ou transferência bancária pra conta no SEU nome, depois que o clipe passa na revisão. Se quiser confirmar antes, dá uma googlada: 'Reka AI NVIDIA' e 'Claru AI'.",
      },
      {
        q: "Qual a taxa de aceitação? E se meu vídeo for reprovado?",
        a: "Cerca de 4 em 5 sessões passam quando você segue o guia (0.5x, horizontal, mãos no quadro, suporte estável). Antes do piloto a gente manda um exemplo aceito. Se reprovar, manda outro — sem custo.",
      },
      {
        q: "Pra onde vão os vídeos? Meu rosto aparece?",
        a: "Os clipes treinam robôs domésticos — carregar lava-louças, dobrar toalha, arrumar quarto. É pra modelos de manipulação, não reconhecimento facial. Você filma suas mãos e as tarefas, não o seu rosto.",
      },
    ],

    finalH: "Pronto pra ganhar em dólar?",
    finalSub: "30 segundos pra se cadastrar. A gente cuida do resto.",
    footerCo: (
      <>
        Uma empresa{" "}
        <a
          href="https://reka.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white/70 transition-colors"
        >
          Reka AI
        </a>{" "}
        · Vagas abertas no Brasil
      </>
    ),
    footerPrivacy: "Privacidade",
    footerTerms: "Termos",
  },
  en: {
    antiChip: "Not a side hustle. Not a course. Not another short-video app.",
    payAmount: "$300",
    payUnit: "USD / week",
    payBrl: "≈ R$1,500 · paid in USD via Wise, PayPal, or bank transfer",
    heroSub: "to film household chores on your phone.",
    mechanism:
      "A US AI lab needs videos of real people doing household tasks to train robots. You film, they pay in USD.",
    formNote: "30-second signup. Reply by email within 24h.",
    stickyCta: "Start earning in USD →",

    trustHeader: "Who's paying",
    trustLine: "International payment in USD. No fee, ever.",
    trustClaru:
      "Claru AI is a Reka AI company, backed by NVIDIA. We're training the next generation of household robots.",

    antiScamLabel: "Important",
    antiScamH: "You never pay anything. Ever.",
    antiScamB:
      "We pay you after your pilot clip passes review. No signup fee. No paid course. No MLM. No Telegram group asking for entry. If anyone asks you for money on Claru's behalf, it's a scam.",
    antiScamBullets: [
      "You never pay anything to start",
      "Payment goes out after the pilot is approved",
      "In USD, to an account in your name",
    ],

    payHeader: "What you earn",
    payCards: [
      { big: "$6", unit: "USD/hour", sub: "≈ R$30" },
      { big: "$40", unit: "USD/day", sub: "6–7h filming · ≈ R$200" },
      { big: "$300", unit: "USD/week", sub: "on the side · ≈ R$1,500" },
    ],
    payNote:
      "Paid via Wise, PayPal, or direct bank transfer. No upfront fee. No cap on hours.",

    reqLabel: "What you need",
    reqH: "Four things. Be honest.",
    reqIntro:
      "If you have three and can grab the fourth today, you qualify. You'll confirm each on the form.",
    req: [
      {
        t: "A phone with 0.5x ultrawide camera",
        b: "Open your camera and look for 0.5x near the shutter. iPhone 11+, Galaxy S21+, Pixel 6+ and most recent Androids work.",
      },
      {
        t: "Head or chest mount for the phone",
        b: "A simple clip that holds your phone at eye level, hands-free. About R$50–R$100 on Mercado Livre.",
      },
      {
        t: "Account in your name (Wise, PayPal, or BR bank)",
        b: "We pay USD into an account in your name. Open to collectors across Brazil.",
      },
      {
        t: "10 minutes to film a pilot clip",
        b: "We send the guide and an accepted example. Pilot passes = you're cleared.",
      },
    ],

    howLabel: "How it works",
    howH: "Three steps.",
    how: [
      {
        n: "01",
        time: "30 sec",
        t: "Sign up",
        b: "Drop your WhatsApp. We reply with the guide.",
      },
      {
        n: "02",
        time: "10 min",
        t: "Film the pilot",
        b: "Dishes, laundry, or tidying up. 0.5x, with a mount.",
      },
      {
        n: "03",
        time: "After QA",
        t: "Get paid in USD",
        b: "Pilot approved = payment released + full paid sessions.",
      },
    ],

    specLabel: "Spec",
    specH: "The short version.",
    specIntro: "Full guide after signup. This is the summary.",
    specRows: [
      { k: "CAMERA", v: "0.5x wide angle, landscape" },
      { k: "MOUNT", v: "Head or chest, stable" },
      { k: "FRAMING", v: "Both hands visible in 90% of frames" },
      { k: "LENGTH", v: "2 to 30 min per clip, one task per clip" },
    ],

    faqLabel: "FAQ",
    faqH: "The three 'what if?' questions everyone asks.",
    faq: [
      {
        q: "How do I know this isn't a scam?",
        a: "You never pay anything. Claru is a Reka AI company, backed by NVIDIA. Payment lands in USD via Wise, PayPal, or direct bank transfer into an account in YOUR name, after your clip passes review. Want to verify? Google 'Reka AI NVIDIA' and 'Claru AI'.",
      },
      {
        q: "What's the acceptance rate? What if my clip gets rejected?",
        a: "Roughly 4 in 5 sessions pass when you follow the guide (0.5x, landscape, hands in frame, steady mount). Before the pilot we send you one accepted example. If it gets rejected, send another — no cost.",
      },
      {
        q: "Where does the footage go? Is my face visible?",
        a: "The clips train household robots — loading dishwashers, folding towels, tidying rooms. It's for manipulation models, not face recognition. You film your hands and the tasks, not your face.",
      },
    ],

    finalH: "Ready to earn in USD?",
    finalSub: "30 seconds to sign up. We handle the rest.",
    footerCo: (
      <>
        A{" "}
        <a
          href="https://reka.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white/70 transition-colors"
        >
          Reka AI
        </a>{" "}
        company · Now hiring in Brazil
      </>
    ),
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
  },
} as const;

function PageInner() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    const fromQuery = searchParams.get("lang");
    if (fromQuery === "en" || fromQuery === "pt") setLang(fromQuery);
  }, [searchParams]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    }
  }, [lang]);

  const utm = useMemo(() => {
    const out: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = searchParams.get(k);
      if (v) out[k] = v;
    });
    return out;
  }, [searchParams]);

  useEffect(() => {
    // Identify the anonymous visitor first so TikTok stitches this
    // ViewContent to the same external_id used later on form submit.
    void identifyTikTokUser({ externalId: getVisitorId() });
    trackTikTokEvent("ViewContent", {
      contents: [PIXEL_CONTENT],
      extra: { lang, ...utm },
    });
    trackRedditEvent("ViewContent", undefined, {
      content_name: "br-collect-captura-domestica",
      ...utm,
    });
  }, [lang, utm]);

  // Sticky mobile CTA only appears after the hero form scrolls off-screen.
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const el = document.getElementById("hero-form-sentinel");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const t = COPY[lang];
  const ttPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  // Suppress unused-var lint for lang setter (lang is set via query param only).
  void setLang;

  return (
    <main
      className="min-h-screen"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {ttPixelId && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${ttPixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* HEADER — slim, just brand + jump-to-form */}
      <header className="border-b border-white/[0.06] sticky top-0 z-30 backdrop-blur" style={{ background: "rgba(10,9,8,0.78)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-13 sm:h-14 flex items-center justify-between py-2">
          <Link href="/" aria-label="Claru home" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <a
            href="#apply"
            data-testid="cta-apply-topbar"
            className="text-[11px] sm:text-xs font-mono tracking-wide px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(146, 176, 144, 0.12)",
              color: "var(--accent-primary)",
              border: "1px solid rgba(146, 176, 144, 0.3)",
            }}
          >
            {lang === "pt" ? "Cadastrar →" : "Apply →"}
          </a>
        </div>
      </header>

      {/* HERO — mobile-first, dollar-dominant, inline form */}
      <section className="px-5 sm:px-8 pt-6 sm:pt-10 pb-10 sm:pb-14 relative overflow-hidden">
        {/* Subtle background glow */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[60%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(146,176,144,0.10), transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-start relative">
          {/* LEFT — pay, mechanism, form */}
          <div className="order-1">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[11px] sm:text-xs font-mono"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "rgba(255, 255, 255, 0.80)",
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
              {t.antiChip}
            </motion.div>

            {/* DOLLAR-DOMINANT pay treatment */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="leading-none"
            >
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span
                  className="font-semibold tracking-tight tabular-nums"
                  style={{
                    fontSize: "clamp(4.2rem, 18vw, 8rem)",
                    color: "#ffffff",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    textShadow: "0 0 60px rgba(146,176,144,0.25)",
                  }}
                >
                  {t.payAmount}
                </span>
                <span
                  className="font-mono uppercase tracking-wider text-[var(--accent-primary)]"
                  style={{
                    fontSize: "clamp(0.95rem, 3.5vw, 1.35rem)",
                  }}
                >
                  {t.payUnit}
                </span>
              </div>
              <div
                className="mt-2 text-sm sm:text-base font-mono text-white/55 tabular-nums"
              >
                {t.payBrl}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-6 text-[1.55rem] sm:text-3xl lg:text-[2.1rem] font-semibold leading-[1.15] tracking-tight text-white"
            >
              {t.heroSub}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-[15px] sm:text-base text-white/65 leading-relaxed max-w-[34rem]"
            >
              {t.mechanism}
            </motion.p>

            {/* INLINE FORM — above the fold on mobile */}
            <motion.div
              id="apply"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <InterestForm lang={lang} utm={utm} variant="hero" />
              <div id="hero-form-sentinel" aria-hidden="true" />
            </motion.div>
          </div>

          {/* RIGHT — single 9:16 vertical clip */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="order-2 max-w-[200px] sm:max-w-[260px] lg:max-w-none w-full mx-auto lg:mx-0"
          >
            <div
              className="relative w-full rounded-2xl overflow-hidden mx-auto"
              style={{
                aspectRatio: "9 / 16",
                maxWidth: 360,
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow:
                  "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(146,176,144,0.18)",
              }}
            >
              <video
                src={HERO_CLIP.src}
                poster={HERO_CLIP.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,9,8,0.25) 0%, rgba(10,9,8,0) 25%, rgba(10,9,8,0) 70%, rgba(10,9,8,0.85) 100%)",
                }}
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(0,0,0,0.55)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "white",
                  }}
                >
                  REC · 0.5x
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/85">
                  {lang === "pt" ? "Exemplo aceito" : "Accepted example"}
                </span>
                <span className="text-[10px] font-mono text-white/55">
                  9:16
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAND — under hero, mid-density */}
      <section className="px-5 sm:px-8 py-7 sm:py-9 border-y border-white/[0.06]" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/45 text-center mb-4">
            {t.trustLine}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 sm:gap-x-10 gap-y-3">
            <Wordmark>NVIDIA</Wordmark>
            <WordmarkDivider />
            <Wordmark>REKA AI</Wordmark>
            <WordmarkDivider />
            <Wordmark>WISE</Wordmark>
            <WordmarkDivider />
            <Wordmark>PAYPAL</Wordmark>
            <WordmarkDivider />
            <Wordmark>BANK</Wordmark>
          </div>
          <p className="mt-5 text-center text-xs sm:text-sm text-white/55 max-w-xl mx-auto leading-relaxed">
            {t.trustClaru}
          </p>
        </div>
      </section>

      {/* ANTI-SCAM CARD — prominent, dedicated panel */}
      <section className="px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(146,176,144,0.08) 0%, rgba(146,176,144,0.02) 100%)",
              border: "1px solid rgba(146,176,144,0.35)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded"
                style={{
                  background: "rgba(146,176,144,0.18)",
                  color: "var(--accent-primary)",
                  border: "1px solid rgba(146,176,144,0.4)",
                }}
              >
                {t.antiScamLabel}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
              {t.antiScamH}
            </h2>
            <p className="mt-4 text-[15px] sm:text-base text-white/75 leading-relaxed">
              {t.antiScamB}
            </p>
            <ul className="mt-6 space-y-2.5">
              {t.antiScamBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm sm:text-[15px] text-white/85"
                >
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(146,176,144,0.20)" }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent-primary)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PAY DETAIL */}
      <section className="px-5 sm:px-8 py-12 sm:py-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>{t.payHeader}</SectionLabel>
          <div className="mt-6 grid sm:grid-cols-3 gap-3 sm:gap-4">
            {t.payCards.map((c, i) => (
              <PayCard key={i} big={c.big} unit={c.unit} sub={c.sub} />
            ))}
          </div>
          <p className="mt-6 text-sm text-white/55 max-w-2xl leading-relaxed">
            {t.payNote}
          </p>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="px-5 sm:px-8 py-12 sm:py-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>{t.reqLabel}</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            {t.reqH}
          </h2>
          <p className="mt-3 text-white/60 max-w-xl text-[15px]">
            {t.reqIntro}
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-3 sm:gap-4">
            {t.req.map((r, i) => (
              <Requirement key={i} title={r.t} body={r.b} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="px-5 sm:px-8 py-12 sm:py-16 border-t border-white/[0.05]"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>{t.howLabel}</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            {t.howH}
          </h2>
          <ol className="mt-8 grid md:grid-cols-3 gap-3 sm:gap-4">
            {t.how.map((s) => (
              <Step
                key={s.n}
                n={s.n}
                title={s.t}
                time={s.time}
                body={s.b}
              />
            ))}
          </ol>
        </div>
      </section>

      {/* SPEC */}
      <section className="px-5 sm:px-8 py-12 sm:py-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-10">
          <div>
            <SectionLabel>{t.specLabel}</SectionLabel>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
              {t.specH}
            </h2>
            <p className="mt-3 text-white/60 text-[15px]">{t.specIntro}</p>
          </div>
          <div
            className="rounded-xl p-5 sm:p-6 font-mono text-sm"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {t.specRows.map((row, i, arr) => (
              <SpecRow
                key={row.k}
                k={row.k}
                v={row.v}
                last={i === arr.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 sm:px-8 py-12 sm:py-16 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>{t.faqLabel}</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            {t.faqH}
          </h2>
          <div className="mt-8 space-y-3">
            {t.faq.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL FORM */}
      <section
        id="apply-bottom"
        className="px-5 sm:px-8 py-12 sm:py-16 border-t border-white/[0.05]"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            {t.finalH}
          </h2>
          <p className="mt-3 text-white/65 text-[15px]">{t.finalSub}</p>
        </div>
        <div className="max-w-xl mx-auto mt-8">
          <InterestForm lang={lang} utm={utm} variant="full" />
        </div>
      </section>

      <footer className="px-5 sm:px-8 py-8 sm:py-10 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/45 pb-16 sm:pb-0">
          <div>{t.footerCo}</div>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="hover:text-white/70 transition-colors"
            >
              {t.footerPrivacy}
            </Link>
            <Link
              href="/terms"
              className="hover:text-white/70 transition-colors"
            >
              {t.footerTerms}
            </Link>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA — appears after hero form scrolls off-screen */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.75rem",
          background:
            "linear-gradient(180deg, rgba(10,9,8,0) 0%, rgba(10,9,8,0.92) 35%, rgba(10,9,8,0.98) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <a
          href="#apply"
          data-testid="cta-sticky-mobile"
          className="block w-full text-center px-6 py-3.5 rounded-full font-semibold text-base"
          style={{
            background: "#ffffff",
            color: "#0a0908",
            boxShadow: "0 12px 32px rgba(146,176,144,0.35)",
          }}
        >
          {t.stickyCta}
        </a>
      </div>
    </main>
  );
}

// --- presentational helpers ---

function Wordmark({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono uppercase tracking-[0.18em] text-white/75"
      style={{ fontSize: "0.82rem", letterSpacing: "0.18em" }}
    >
      {children}
    </span>
  );
}

function WordmarkDivider() {
  return (
    <span className="text-white/20 font-mono select-none" aria-hidden="true">
      ·
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[11px] font-mono uppercase tracking-[0.16em]"
      style={{ color: "rgba(255, 255, 255, 0.55)" }}
    >
      {children}
    </span>
  );
}

function PayCard({
  big,
  unit,
  sub,
}: {
  big: string;
  unit: string;
  sub: string;
}) {
  return (
    <div
      className="rounded-xl p-5 sm:p-6"
      style={{
        background: "rgba(146, 176, 144, 0.06)",
        border: "1px solid rgba(146, 176, 144, 0.22)",
      }}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="font-semibold tabular-nums tracking-tight"
          style={{
            color: "#ffffff",
            fontSize: "clamp(2rem, 6vw, 2.6rem)",
            lineHeight: 1,
          }}
        >
          {big}
        </span>
        <span
          className="font-mono text-xs sm:text-[13px] uppercase tracking-wider"
          style={{ color: "var(--accent-primary)" }}
        >
          {unit}
        </span>
      </div>
      <p className="mt-2 text-[12px] font-mono text-white/45">{sub}</p>
    </div>
  );
}

function Requirement({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(146, 176, 144, 0.15)" }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-medium text-[0.95rem] leading-snug">
            {title}
          </h3>
          <p className="mt-1.5 text-sm text-white/60 leading-relaxed">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  time,
  body,
}: {
  n: string;
  title: string;
  time: string;
  body: string;
}) {
  return (
    <li
      className="rounded-xl p-5 sm:p-6"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-baseline gap-3">
        <span
          className="font-mono text-xs"
          style={{ color: "rgba(255, 255, 255, 0.45)" }}
        >
          {n}
        </span>
        <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
          {time}
        </span>
      </div>
      <h3 className="mt-3 text-base sm:text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-white/65 leading-relaxed">{body}</p>
    </li>
  );
}

function SpecRow({
  k,
  v,
  last,
}: {
  k: string;
  v: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-3 py-3 ${
        last ? "" : "border-b border-white/[0.05]"
      }`}
    >
      <div className="text-white/40 uppercase tracking-wider text-[10px] sm:text-[11px] pt-0.5">
        {k}
      </div>
      <div className="text-white/85 leading-relaxed text-sm">{v}</div>
    </div>
  );
}

function FaqItem({
  q,
  a,
}: {
  q: React.ReactNode;
  a: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <span className="text-white font-medium text-[0.95rem] pr-4">
          {q}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform"
          style={{
            background: "rgba(255,255,255,0.04)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-white/70 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function BrCapturaDomesticaPage() {
  return (
    <Suspense fallback={null}>
      <PageInner />
    </Suspense>
  );
}
