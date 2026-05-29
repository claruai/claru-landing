import type { Metadata } from "next";

/**
 * Route-level metadata for the BR collector LP.
 *
 * The page itself is a client component (`"use client"`) so it cannot export
 * `metadata`; without this it inherits the root layout's English title
 * ("Claru — Training Data for Physical AI"), which TikTok's in-app browser and
 * link previews surface to a 100% pt-BR paid audience. This overrides title +
 * OG/Twitter with Portuguese copy and a pt_BR locale.
 */
export const metadata: Metadata = {
  title: "Receba em dólar gravando tarefas de casa — Claru",
  description:
    "Um laboratório de IA dos EUA paga por vídeos de tarefas domésticas pra treinar robôs. Cadastro de 30 segundos, resposta em 24h. Sem taxa.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://claru.ai/br/collect/captura-domestica",
    siteName: "Claru",
    title: "Receba em dólar gravando tarefas de casa — Claru",
    description:
      "Um laboratório de IA dos EUA paga por vídeos de tarefas domésticas pra treinar robôs. Cadastro de 30 segundos, resposta em 24h. Sem taxa.",
    images: [
      {
        url: "/images/og-v3.png",
        width: 1200,
        height: 630,
        alt: "Claru — pesquisa de IA com tarefas domésticas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Receba em dólar gravando tarefas de casa — Claru",
    description:
      "Um laboratório de IA dos EUA paga por vídeos de tarefas domésticas pra treinar robôs. Cadastro de 30 segundos, resposta em 24h. Sem taxa.",
    images: ["/images/og-v3.png"],
  },
  alternates: {
    canonical: "/br/collect/captura-domestica",
  },
};

export default function BrCollectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
