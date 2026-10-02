import type { AppLocale } from '@/i18n/config';
import type { TopicContent, TopicSlug } from './types';
import { TOPIC_PATHS, topicSlugForLocale, topicHref } from './types';
import { parking } from './parking';
import { openingHours } from './opening-hours';
import { lighthouseMove } from './lighthouse-move';
import { wanderingDune } from './wandering-dune';
import { tractor } from './tractor';
import { dayTrips } from './day-trips';

export const TOPICS: Record<TopicSlug, Record<AppLocale, TopicContent>> = {
  parking,
  'opening-hours': openingHours,
  'lighthouse-move': lighthouseMove,
  'wandering-dune': wanderingDune,
  tractor,
  'day-trips': dayTrips,
};

/** Display order used by the home hub, topic pages and the footer. */
export const TOPIC_ORDER: TopicSlug[] = [
  'parking',
  'opening-hours',
  'lighthouse-move',
  'wandering-dune',
  'tractor',
  'day-trips',
];

export const TOPIC_LABELS: Record<TopicSlug, Record<AppLocale, string>> = {
  parking: { da: 'Parkering', de: 'Parken', en: 'Parking', nl: 'Parkeren', zh: '停车与交通' },
  'opening-hours': {
    da: 'Åbningstider og entré',
    de: 'Öffnungszeiten',
    en: 'Opening hours',
    nl: 'Openingstijden',
    zh: '开放时间与门票',
  },
  'lighthouse-move': {
    da: 'Flytningen i 2019',
    de: 'Versetzung 2019',
    en: 'The 2019 move',
    nl: 'Verplaatsing 2019',
    zh: '2019 年搬迁',
  },
  'wandering-dune': {
    da: 'Vandreklitten',
    de: 'Wanderdüne',
    en: 'Wandering dune',
    nl: 'Wandelduin',
    zh: '移动沙丘',
  },
  tractor: {
    da: 'Traktoren og gåturen',
    de: 'Traktor und Fußweg',
    en: 'Tractor and the walk',
    nl: 'Tractor en wandeling',
    zh: '拖拉机与步行',
  },
  'day-trips': { da: 'Dagsture', de: 'Tagesausflüge', en: 'Day trips', nl: 'Dagtrips', zh: '周边一日路线' },
};

export function getTopic(slug: TopicSlug, locale: AppLocale | string): TopicContent {
  return TOPICS[slug][locale as AppLocale] ?? TOPICS[slug].en;
}

export function getTopicLabel(slug: TopicSlug, locale: AppLocale | string): string {
  return TOPIC_LABELS[slug][locale as AppLocale] ?? TOPIC_LABELS[slug].en;
}

export function isTopicSlug(value: string): value is TopicSlug {
  return Object.prototype.hasOwnProperty.call(TOPICS, value);
}

export { TOPIC_PATHS, topicSlugForLocale, topicHref };
export type { TopicContent, TopicSlug } from './types';
