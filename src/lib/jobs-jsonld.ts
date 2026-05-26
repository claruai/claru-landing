/**
 * JSON-LD builders for the /jobs index page.
 *
 * - ItemList lists every open JobPosting URL — helps Google index discovery
 *   and gives AI engines a clean catalog to cite.
 * - FAQ targets the four People-Also-Ask questions captured in
 *   `goals/jobs-page-refocus.md` §4.4.
 *
 * Localized variants take a `locale` arg so es-MX and pt-BR pages can drop in
 * the same builders with translated question/answer bodies.
 */

import type { Job, JobLocale } from "@/types/job";

const SITE_ORIGIN = "https://claru.ai";

function jobsRoot(locale: JobLocale): string {
  if (locale === "es-MX") return `${SITE_ORIGIN}/es-mx/jobs`;
  if (locale === "pt-BR") return `${SITE_ORIGIN}/pt-br/jobs`;
  return `${SITE_ORIGIN}/jobs`;
}

export function buildJobsItemListJsonLd(
  openJobs: Job[],
  locale: JobLocale = "en",
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Claru Open Positions",
    url: jobsRoot(locale),
    numberOfItems: openJobs.length,
    itemListElement: openJobs.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${jobsRoot(locale)}/${job.slug}`,
      name: job.title,
    })),
  };
}

const FAQS: Record<JobLocale, { question: string; answer: string }[]> = {
  en: [
    {
      question: "Do Claru's AI training jobs actually pay?",
      answer:
        "Yes. Claru pays contractors $20–$90/hr in USD via international bank transfer, with bi-weekly payment cycles. Pay band is set per role and visible on every listing.",
    },
    {
      question: "Can I work remotely as an AI trainer with Claru?",
      answer:
        "Every Claru role is fully remote and contractor-based. Most roles accept applicants in the US, Canada, Mexico, and Brazil. Roles with stricter geo requirements are labeled on each listing.",
    },
    {
      question: "What jobs can I get without prior AI experience?",
      answer:
        "Egocentric video capture and gameplay capture roles require no prior AI experience — just a smartphone, a willingness to record household or gameplay scenes per a brief, and reliable internet. Annotation and quality-review roles benefit from familiarity with structured data work but are not gated on a CS background.",
    },
    {
      question: "How fast can I start once I apply?",
      answer:
        "Applications are reviewed within 3–5 business days. Approved contractors are onboarded into an active project the same week, with the first paid batch typically completed within 7–10 days of approval.",
    },
  ],
  // Spanish + Portuguese stubs — translated copy lands when the locale routes ship.
  "es-MX": [
    {
      question: "¿Los trabajos de entrenamiento de IA de Claru realmente pagan?",
      answer:
        "Sí. Claru paga a contratistas entre $20–$90 USD/hora por transferencia bancaria internacional, en ciclos quincenales. El rango está visible en cada vacante.",
    },
    {
      question: "¿Puedo trabajar de forma remota con Claru?",
      answer:
        "Todas las posiciones son 100% remotas y por contrato. La mayoría acepta postulantes en México, Estados Unidos, Canadá y Brasil. Las restricciones geográficas se indican en cada vacante.",
    },
    {
      question: "¿Necesito experiencia previa en IA?",
      answer:
        "Los roles de captura de video en primera persona y de gameplay no requieren experiencia previa en IA — solo un smartphone, disposición para grabar escenas según un guion, e internet estable.",
    },
    {
      question: "¿Qué tan rápido puedo empezar después de postular?",
      answer:
        "Las postulaciones se revisan en 3–5 días hábiles. Los contratistas aprobados ingresan a un proyecto activo la misma semana.",
    },
  ],
  "pt-BR": [
    {
      question: "Os trabalhos de treinamento de IA da Claru pagam mesmo?",
      answer:
        "Sim. A Claru paga contratados entre $20–$90 USD/hora por transferência bancária internacional, em ciclos quinzenais. A faixa salarial está visível em cada vaga.",
    },
    {
      question: "Posso trabalhar remotamente com a Claru?",
      answer:
        "Todas as posições são 100% remotas e por contrato. A maioria aceita candidatos no Brasil, Estados Unidos, Canadá e México. Restrições geográficas estão indicadas em cada vaga.",
    },
    {
      question: "Preciso ter experiência prévia em IA?",
      answer:
        "Os papéis de captura de vídeo em primeira pessoa e de gameplay não exigem experiência prévia em IA — basta um smartphone, disposição para gravar cenas conforme um roteiro, e internet estável.",
    },
    {
      question: "Quão rápido posso começar depois de me candidatar?",
      answer:
        "As candidaturas são revisadas em 3–5 dias úteis. Contratados aprovados entram em um projeto ativo na mesma semana.",
    },
  ],
};

export function buildJobsFaqJsonLd(locale: JobLocale = "en") {
  const faqs = FAQS[locale];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
