import type { AppLocale } from '@/i18n/config';
import placesJson from './places.json';
import da from './da.json';
import de from './de.json';
import en from './en.json';
import nl from './nl.json';
import zh from './zh.json';

export const nearbyPath = '/nearby';
export const nearbyReviewed = '2026-11-20';

export const areaNames = {
  rubjerg: 'Rubjerg · Lønstrup',
  loekken: 'Løkken · Børglum',
  hjoerring: 'Hjørring',
  hirtshals: 'Hirtshals · Tornby',
  tversted: 'Tversted · Uggerby · Mosbjerg',
} as const;

const areaMapTargets: Record<keyof typeof areaNames, string> = {
  rubjerg: 'Lønstrup, Hjørring, Denmark',
  loekken: 'Løkken, Hjørring, Denmark',
  hjoerring: 'Hjørring, Denmark',
  hirtshals: 'Hirtshals, Hjørring, Denmark',
  tversted: 'Tversted, Hjørring, Denmark',
};

export const managers = {
  agency: { name: 'Naturstyrelsen', url: 'https://naturstyrelsen.dk/kontakt-os-lokalt/vendsyssel' },
  'skallerup-parish': { name: 'Skallerup–Vennebjerg–Mårup Pastorat', url: 'https://www.svmpastorat.dk/' },
  abbey: { name: 'Børglum Kloster', url: 'https://www.boerglumkloster.dk/' },
  art: { name: 'Vendsyssel Kunstmuseum', url: 'https://vkm.dk/' },
  history: { name: 'Vendsyssel Historiske Museum', url: 'https://vhm.dk/museerne/' },
  'hjoerring-parish': { name: 'Hjørring Bykirker', url: 'https://www.hjorringbykirker.dk/sct-catharina-kirke' },
  'loekken-museum': { name: 'Løkken Museum', url: 'https://www.loekkenmuseum.dk/' },
  'fyr-foundation': { name: 'Hirtshals Fyr Fond', url: 'https://www.proff.dk/firma/hirtshals-fyr-fond/hirtshals/historiske-steder-og-bygninger/0IP2NDI10NY' },
  'tornby-institution': { name: 'Tornby Gamle Købmandsgård', url: 'https://tornby.info/vi-tilbyder/oplevelser-et-besoeg-vaerd/tornby-gl-koebmandsgaard-og-sognearkiv/' },
  oceanarium: { name: 'Nordsøen Oceanarium', url: 'https://nordsoenoceanarium.dk/' },
} as const;

type Photo = {
  url: string;
  source: string;
  author: string;
  license: string;
  licenseUrl: string;
};

export type NearbyPlace = {
  slug: string;
  group: keyof typeof areaNames;
  name: string;
  locality: string;
  kind: 'nature' | 'beach' | 'museum' | 'heritage';
  manager: keyof typeof managers | null;
  sources: string[];
  photo: Photo | null;
};

type PlaceCopy = {
  history: string;
  visit: string;
  access: string;
  photoTip: string;
  faq: { q: string; a: string }[];
};

export const nearbyPlaces = placesJson as NearbyPlace[];
const copy: Record<AppLocale, Record<string, PlaceCopy>> = { da, de, en, nl, zh };

export function getNearbyCopy(slug: string, locale: AppLocale) {
  return copy[locale][slug];
}

export function getPlacePath(slug: string) {
  return `${nearbyPath}/${slug}`;
}

export function getPlaceMap(place: NearbyPlace) {
  const query = `${place.name}, ${place.locality}, Denmark`;
  return {
    place: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    area: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(areaMapTargets[place.group])}`,
    embed: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`,
  };
}
