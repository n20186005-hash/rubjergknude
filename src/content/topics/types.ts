import type { AppLocale } from '@/i18n/config';

export type TopicSlug =
  | 'parking'
  | 'opening-hours'
  | 'lighthouse-move'
  | 'wandering-dune'
  | 'tractor'
  | 'day-trips';

export type TopicSection = {
  id: string;
  heading: string;
  body: string;
};

export type TopicHighlight = {
  name: string;
  desc: string;
};

export type TopicFaq = {
  q: string;
  a: string;
};

export type TopicContent = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  intro: string;
  /** Short "quick answer" bullets shown above the fold on mobile. */
  quickAnswer: string[];
  sections: TopicSection[];
  highlights: TopicHighlight[];
  faq: TopicFaq[];
};

export type TopicLocalized = Record<AppLocale, TopicContent>;

/**
 * Localised URL slugs. The physical Next.js route folder uses the English slug
 * (see `TOPIC_ROUTES`); middleware rewrites the localised slug onto it and
 * 308-redirects the English slug back to the localised one.
 */
export const TOPIC_PATHS: Record<TopicSlug, Record<AppLocale, string>> = {
  parking: { da: 'parkering', de: 'parken', en: 'parking', nl: 'parkeren', zh: 'parking' },
  'opening-hours': {
    da: 'aabningstider',
    de: 'oeffnungszeiten',
    en: 'opening-hours',
    nl: 'openingstijden',
    zh: 'opening-hours',
  },
  'lighthouse-move': {
    da: 'flytning',
    de: 'leuchtturm-versetzt',
    en: 'lighthouse-move',
    nl: 'verplaatsing',
    zh: 'lighthouse-move',
  },
  'wandering-dune': {
    da: 'vandreklit',
    de: 'wanderduene',
    en: 'wandering-dune',
    nl: 'wandelduin',
    zh: 'wandering-dune',
  },
  tractor: { da: 'traktor', de: 'traktor', en: 'tractor', nl: 'tractor', zh: 'tractor' },
  'day-trips': { da: 'dagsture', de: 'tagesausfluege', en: 'day-trips', nl: 'dagtrips', zh: 'day-trips' },
};

/** Route folder name -> topic slug (they are identical: English slug). */
export const TOPIC_ROUTES: Record<TopicSlug, TopicSlug> = {
  parking: 'parking',
  'opening-hours': 'opening-hours',
  'lighthouse-move': 'lighthouse-move',
  'wandering-dune': 'wandering-dune',
  tractor: 'tractor',
  'day-trips': 'day-trips',
};

export function topicSlugForLocale(slug: TopicSlug, locale: AppLocale | string): string {
  return TOPIC_PATHS[slug][locale as AppLocale] ?? TOPIC_PATHS[slug].en;
}

export function topicHref(slug: TopicSlug, locale: AppLocale | string): string {
  return `/${locale}/${topicSlugForLocale(slug, locale)}`;
}
