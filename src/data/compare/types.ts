import type { ReactNode } from "react";

export type ComparisonColumn = {
  key: string;
  label: string;
  highlight?: boolean;
};

export type ComparisonRow = {
  dimension: string;
  values: Record<string, ReactNode>;
};

export type ComparisonCard = {
  title: string;
  description: ReactNode;
};

export type ComparisonSnapshotItem = {
  label: string;
  value: ReactNode;
};

export type ComparisonSnapshotColumn = {
  title: string;
  items: ComparisonSnapshotItem[];
};

export type ComparisonLink = {
  title: string;
  desc: string;
  href: string;
};

export type ComparisonFaqItem = {
  question: string;
  answer: ReactNode;
};

export type ComparisonStep = {
  step: string;
  title: string;
  content: string;
};

export type ComparisonStat = {
  stat: string;
  label: string;
  context: string;
};

export type ComparisonData = {
  slug: string;
  competitor: {
    name: string;
    siteUrl: string;
    category: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    published: string;
    modified: string;
  };
  hero: {
    eyebrow: string;
    breadcrumbLabel: string;
    title: string;
    subtitle: ReactNode;
    lastUpdated: string;
  };
  tldr: {
    title: string;
    bullets: string[];
  };
  overview?: {
    title: string;
    paragraphs: ReactNode[];
  };
  snapshot?: {
    title: string;
    columns: ComparisonSnapshotColumn[];
  };
  keyClaims?: {
    title: string;
    claims: ReactNode[];
  };
  strengths: {
    title: string;
    intro: ReactNode;
    cards: ComparisonCard[];
  };
  alternatives: {
    title: string;
    intro: ReactNode;
    cards: ComparisonCard[];
  };
  comparison: {
    title: string;
    intro: ReactNode;
    columns: ComparisonColumn[];
    rows: ComparisonRow[];
  };
  deepDive?: {
    title: string;
    intro: string;
    blocks: Array<{
      title: string;
      paragraphs: string[];
    }>;
  };
  fit: {
    competitorTitle: string;
    competitorBullets: string[];
    claruTitle: string;
    claruBullets: string[];
  };
  pipeline: {
    title: string;
    intro: string;
    steps: ComparisonStep[];
  };
  proof: {
    title: string;
    stats: ComparisonStat[];
  };
  related: {
    title: string;
    intro: string;
    links: ComparisonLink[];
  };
  decision?: {
    title: string;
    paragraphs: ReactNode[];
  };
  faq: {
    title: string;
    items: ComparisonFaqItem[];
  };
  cta: {
    title: string;
    description: string;
    primary: {
      label: string;
      href: string;
    };
    secondary: {
      label: string;
      href: string;
    };
  };
  sources: Array<{
    label: string;
    url: string;
  }>;
};
