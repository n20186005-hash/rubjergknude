import Script from 'next/script';
import { getLocale, getMessages } from 'next-intl/server';
import { siteConfig, getLocalePath } from '@/i18n/config';
import { ATTRACTION, LAST_UPDATED, OFFICIAL_SOURCES } from '@/data/facts';

/**
 * Structured data for the home page.
 *
 * Deliberately no `aggregateRating`: the rating shown on the page is a Google
 * Maps listing snapshot and is presented as such, so it is not emitted as this
 * site's own review data.
 */
export default async function TouristAttractionStructuredData() {
  const locale = await getLocale();
  const messages = (await getMessages()) as {
    meta?: { title?: string; description?: string };
  };

  const url = `${siteConfig.baseUrl}${getLocalePath(locale)}`;
  const homeUrl = `${siteConfig.baseUrl}${getLocalePath(locale)}`;
  const image = `${siteConfig.baseUrl}/gallery/images%20(1).jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristAttraction',
        '@id': `${siteConfig.baseUrl}#attraction`,
        name: ATTRACTION.name,
        alternateName: ATTRACTION.alternateName,
        description: messages.meta?.description,
        url: homeUrl,
        image,
        telephone: ATTRACTION.telephone,
        isAccessibleForFree: true,
        publicAccess: true,
        touristType: ['Nature', 'Coastal heritage', 'Lighthouse'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: ATTRACTION.streetAddress,
          postalCode: ATTRACTION.postalCode,
          addressLocality: ATTRACTION.addressLocality,
          addressRegion: ATTRACTION.addressRegion,
          addressCountry: ATTRACTION.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: ATTRACTION.latitude,
          longitude: ATTRACTION.longitude,
        },
        hasMap: ATTRACTION.mapsUrl,
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            opens: '00:00',
            closes: '23:59',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
          },
        ],
        sameAs: OFFICIAL_SOURCES.map((source) => source.url),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.baseUrl}#website`,
        url: siteConfig.baseUrl,
        name: siteConfig.siteName,
        inLanguage: locale,
        publisher: { '@id': `${siteConfig.baseUrl}#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${siteConfig.baseUrl}#organization`,
        name: siteConfig.siteName,
        url: siteConfig.baseUrl,
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: messages.meta?.title,
        description: messages.meta?.description,
        isPartOf: { '@id': `${siteConfig.baseUrl}#website` },
        about: { '@id': `${siteConfig.baseUrl}#attraction` },
        dateModified: LAST_UPDATED,
        inLanguage: locale,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: messages.meta?.title ?? ATTRACTION.name,
            item: url,
          },
        ],
      },
    ],
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
