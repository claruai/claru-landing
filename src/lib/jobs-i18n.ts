/**
 * UI chrome translations for the /jobs board across locales.
 *
 * Translations cover hero, filter labels, CTAs, and status text. Per-role
 * titles + descriptions stay in English for now and will be translated in a
 * follow-up — the JobDetailClient renders a banner noting this so candidates
 * are not surprised.
 */

import type { JobLocale } from "@/types/job";

export interface JobsI18n {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubcopy: string;
  searchPlaceholder: string;
  filterCountryLabel: string;
  filterCountryAll: string;
  filterCategoryAll: string;
  countLabelShowing: string; // "Showing"
  countLabelOf: string; // "of"
  countLabelPositions: string; // "positions" / "puestos" / "vagas"
  clearFilters: string;
  loadMore: string;
  loadMoreRemaining: (n: number) => string;
  emptyTitle: string;
  emptyBody: string;
  emptyReset: string;
  closedChip: string;
  closedDetailNote: string;
  applyNow: string;
  applyGenerally: string;
  generalCtaEyebrow: string;
  generalCtaHeadline: string;
  generalCtaBody: string;
  englishOnlyBanner: string;
  defaultCountry: string;
  countryLabels: Record<string, string>;
  openPositionsEyebrow: string;
  openPositionsHeading: string;
  pastRolesEyebrow: string;
  pastRolesHeading: string;
  showPastRoles: (n: number) => string;
  hidePastRoles: string;
}

export const JOBS_I18N: Record<JobLocale, JobsI18n> = {
  en: {
    metaTitle: "Remote AI Training Jobs — $20–90/hr | Claru",
    metaDescription:
      "Remote contractor roles in egocentric video capture and gameplay capture for frontier AI labs. Pay in USD ($20–90/hr), bi-weekly, fully remote.",
    heroEyebrow: "// OPEN POSITIONS",
    heroHeadline: "Find your role in",
    heroHeadlineHighlight: "frontier AI.",
    heroSubcopy:
      "Remote, contractor-based roles for domain experts. Browse open positions and apply in minutes.",
    searchPlaceholder: "Search by keyword, skill, or title...",
    filterCountryLabel: "Country:",
    filterCountryAll: "All countries",
    filterCategoryAll: "All",
    countLabelShowing: "Showing",
    countLabelOf: "of",
    countLabelPositions: "positions",
    clearFilters: "Clear filters",
    loadMore: "Load more positions",
    loadMoreRemaining: (n) => `(${n} remaining)`,
    emptyTitle: "No positions found",
    emptyBody: "Try adjusting your search or filters.",
    emptyReset: "Reset all filters",
    closedChip: "Closed",
    closedDetailNote:
      "This role isn't open right now. Apply generally and we'll match you when projects fit your background.",
    applyNow: "Apply Now",
    applyGenerally: "Apply generally",
    generalCtaEyebrow: "// DON'T SEE THE RIGHT FIT?",
    generalCtaHeadline: "Submit a general application",
    generalCtaBody:
      "New roles open every week. Apply now and we will match you with projects that fit your expertise.",
    englishOnlyBanner: "",
    defaultCountry: "US",
    countryLabels: {
      US: "United States",
      CA: "Canada",
      MX: "Mexico",
      BR: "Brazil",
      AR: "Argentina",
      CO: "Colombia",
      CL: "Chile",
      PE: "Peru",
      IN: "India",
      PH: "Philippines",
      ID: "Indonesia",
      VN: "Vietnam",
    },
    openPositionsEyebrow: "// OPEN POSITIONS",
    openPositionsHeading: "Open positions hiring now",
    pastRolesEyebrow: "// PAST ROLES",
    pastRolesHeading: "Roles we've hired for previously",
    showPastRoles: (n) => `Show ${n} past roles`,
    hidePastRoles: "Hide past roles",
  },
  "es-MX": {
    metaTitle: "Trabajo remoto grabando video para IA — Pago en USD | Claru",
    metaDescription:
      "Vacantes remotas por contrato grabando video en primera persona y capturando gameplay para laboratorios de IA. Pago en USD ($7/hora en LATAM), quincenal, 100% remoto. Abiertas a México, Brasil, Argentina, Colombia, Chile y Perú.",
    heroEyebrow: "// VACANTES ABIERTAS",
    heroHeadline: "Encuentra tu rol en",
    heroHeadlineHighlight: "IA de frontera.",
    heroSubcopy:
      "Trabajo desde casa, por contrato, para expertos en su dominio. Pagos en dólares y postulación en minutos.",
    searchPlaceholder: "Busca por palabra clave, habilidad o título...",
    filterCountryLabel: "País:",
    filterCountryAll: "Todos los países",
    filterCategoryAll: "Todas",
    countLabelShowing: "Mostrando",
    countLabelOf: "de",
    countLabelPositions: "vacantes",
    clearFilters: "Limpiar filtros",
    loadMore: "Ver más vacantes",
    loadMoreRemaining: (n) => `(${n} restantes)`,
    emptyTitle: "No se encontraron vacantes",
    emptyBody: "Ajusta tu búsqueda o filtros.",
    emptyReset: "Restablecer filtros",
    closedChip: "Cerrada",
    closedDetailNote:
      "Esta vacante no está abierta ahora. Postula de forma general y te contactaremos cuando haya un proyecto compatible con tu perfil.",
    applyNow: "Postular ahora",
    applyGenerally: "Postular en general",
    generalCtaEyebrow: "// ¿NO VES LA VACANTE IDEAL?",
    generalCtaHeadline: "Envía una postulación general",
    generalCtaBody:
      "Abrimos nuevas vacantes cada semana. Postula ahora y te conectaremos con proyectos acordes a tu experiencia.",
    englishOnlyBanner:
      "Los detalles específicos de cada vacante están en inglés mientras completamos la traducción.",
    defaultCountry: "MX",
    countryLabels: {
      US: "Estados Unidos",
      CA: "Canadá",
      MX: "México",
      BR: "Brasil",
      AR: "Argentina",
      CO: "Colombia",
      CL: "Chile",
      PE: "Perú",
      IN: "India",
      PH: "Filipinas",
      ID: "Indonesia",
      VN: "Vietnam",
    },
    openPositionsEyebrow: "// VACANTES ABIERTAS",
    openPositionsHeading: "Vacantes abiertas ahora",
    pastRolesEyebrow: "// VACANTES ANTERIORES",
    pastRolesHeading: "Vacantes que hemos cubierto antes",
    showPastRoles: (n) => `Ver ${n} vacantes anteriores`,
    hidePastRoles: "Ocultar vacantes anteriores",
  },
  "pt-BR": {
    metaTitle: "Trabalho remoto gravando vídeo para IA — Pago em USD | Claru",
    metaDescription:
      "Vagas remotas por contrato gravando vídeo em primeira pessoa e gameplay para laboratórios de IA. Pagamento em USD ($7/hora no Brasil/LATAM), quinzenal, 100% remoto. Abertas para Brasil, Argentina, Colômbia, Chile e Peru.",
    heroEyebrow: "// VAGAS ABERTAS",
    heroHeadline: "Encontre seu papel em",
    heroHeadlineHighlight: "IA de fronteira.",
    heroSubcopy:
      "Trabalho remoto, por contrato, para especialistas em seu domínio. Pagamento em dólares e candidatura em minutos.",
    searchPlaceholder: "Busque por palavra-chave, habilidade ou título...",
    filterCountryLabel: "País:",
    filterCountryAll: "Todos os países",
    filterCategoryAll: "Todas",
    countLabelShowing: "Mostrando",
    countLabelOf: "de",
    countLabelPositions: "vagas",
    clearFilters: "Limpar filtros",
    loadMore: "Ver mais vagas",
    loadMoreRemaining: (n) => `(${n} restantes)`,
    emptyTitle: "Nenhuma vaga encontrada",
    emptyBody: "Ajuste sua busca ou filtros.",
    emptyReset: "Redefinir filtros",
    closedChip: "Encerrada",
    closedDetailNote:
      "Esta vaga não está aberta no momento. Candidate-se de forma geral e entraremos em contato quando houver projeto compatível com seu perfil.",
    applyNow: "Candidatar agora",
    applyGenerally: "Candidatura geral",
    generalCtaEyebrow: "// NÃO VÊ A VAGA IDEAL?",
    generalCtaHeadline: "Envie uma candidatura geral",
    generalCtaBody:
      "Abrimos novas vagas toda semana. Candidate-se agora e conectaremos você a projetos compatíveis com sua experiência.",
    englishOnlyBanner:
      "Os detalhes específicos de cada vaga estão em inglês enquanto finalizamos a tradução.",
    defaultCountry: "BR",
    countryLabels: {
      US: "Estados Unidos",
      CA: "Canadá",
      MX: "México",
      BR: "Brasil",
      AR: "Argentina",
      CO: "Colômbia",
      CL: "Chile",
      PE: "Peru",
      IN: "Índia",
      PH: "Filipinas",
      ID: "Indonésia",
      VN: "Vietnã",
    },
    openPositionsEyebrow: "// VAGAS ABERTAS",
    openPositionsHeading: "Vagas abertas agora",
    pastRolesEyebrow: "// VAGAS ANTERIORES",
    pastRolesHeading: "Vagas que já preenchemos",
    showPastRoles: (n) => `Ver ${n} vagas anteriores`,
    hidePastRoles: "Ocultar vagas anteriores",
  },
};

export function jobsI18n(locale: JobLocale): JobsI18n {
  return JOBS_I18N[locale] ?? JOBS_I18N.en;
}
