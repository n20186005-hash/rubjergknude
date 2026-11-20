/**
 * Single source of truth for the physical / official facts about Rubjerg Knude.
 * Anything that can change (Google rating snapshot) carries an explicit
 * "checked" date so the UI never shows a stale number as if it were live.
 */

export const ATTRACTION = {
  name: 'Rubjerg Knude',
  alternateName: 'Rubjerg Knude Fyr',
  streetAddress: 'Fyrvejen 110',
  postalCode: '9800',
  addressLocality: 'Løkken',
  addressRegion: 'Nordjylland',
  addressCountry: 'DK',
  latitude: 57.4490318,
  longitude: 9.775481,
  plusCode: 'CQXG+J5 Løkken, Denmark',
  telephone: '+45 72 54 36 53',
  mapsUrl: 'https://maps.app.goo.gl/cVkELswJnWGKDpTs7',
  parkingLatitude: 57.4479,
  parkingLongitude: 9.7790,
} as const;

/**
 * Google Maps public listing snapshot. Shown on-page only, with attribution and
 * a "checked" date. It is deliberately NOT emitted as our own AggregateRating
 * in structured data.
 */
export const GOOGLE_SNAPSHOT = {
  ratingValue: 4.8,
  reviewCount: 9156,
  checked: '2026-11-20',
  sourceLabel: 'Google Maps',
} as const;

/** Editorial "last reviewed" stamp rendered next to practical information. */
export const LAST_UPDATED = '2026-10-02';

export const OFFICIAL_SOURCES = [
  {
    label: 'Naturstyrelsen – Rubjerg Knude og Rubjerg Klitplantage',
    url: 'https://naturstyrelsen.dk/find-et-naturomraade/naturguider/thy-og-vendsyssel/rubjerg-knude-og-rubjerg-klitplantage/praktisk',
  },
  {
    label: 'VisitNordvestkysten – Rubjerg Knude',
    url: 'https://www.visitnordvestkysten.dk/nordvestkysten/planlaeg-din-tur/rubjerg-knude-gdk597384',
  },
  {
    label: 'VisitDenmark',
    url: 'https://www.visitdenmark.com/',
  },
] as const;
