import Script from 'next/script';
import { getLocale, getMessages } from 'next-intl/server';
import { siteConfig, getLocalePath } from '@/i18n/config';

// Coordinates and address are the site's stable physical facts.
const GEO = { latitude: 57.4489, longitude: 9.7743 };
const ADDRESS = {
  streetAddress: 'Fyrvejen 110',
  addressLocality: 'Løkken',
  postalCode: '9800',
  addressCountry: 'DK',
};
const RATING = 4.7;
const REVIEW_COUNT = 8489;

export default async function TouristAttractionStructuredData() {
  const locale = await getLocale();
  const messages = (await getMessages()) as {
    meta?: { title?: string; description?: string };
  };

  const url = `${siteConfig.baseUrl}${getLocalePath(locale)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Rubjerg Knude',
    alternateName: 'Rubjerg Knude Fyr',
    description: messages.meta?.description,
    url,
    isAccessibleForFree: true,
    touristType: ['Nature', 'Coastal heritage', 'Lighthouse'],
    address: {
      '@type': 'PostalAddress',
      ...ADDRESS,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: RATING,
      reviewCount: REVIEW_COUNT,
      bestRating: 5,
    },
  };

  return (
    <Script
      id="tourist-attraction-structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
