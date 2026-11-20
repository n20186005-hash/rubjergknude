import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig, getLocalePath, defaultLocale } from '@/i18n/config';
import { TOPIC_ORDER, topicSlugForLocale } from '@/content/topics';
import type { TopicSlug } from '@/content/topics';
import { LAST_UPDATED } from '@/data/facts';
import { getPlacePath, nearbyPath, nearbyPlaces, nearbyReviewed } from '@/content/nearby';

const lastModified = new Date(LAST_UPDATED);

/** Topic URLs are localised per language; every other path is shared. */
function localizedPath(locale: string, basePath: string) {
  const slug = basePath.replace(/^\//, '');
  if (TOPIC_ORDER.includes(slug as TopicSlug)) {
    return `/${topicSlugForLocale(slug as TopicSlug, locale)}`;
  }
  return basePath;
}

const nearbyPaths = [nearbyPath, ...nearbyPlaces.map(({ slug }) => getPlacePath(slug))];
const basePaths = [...Object.values(routing.pathnames), ...TOPIC_ORDER.map((slug) => `/${slug}`), ...nearbyPaths];

export default function sitemap(): MetadataRoute.Sitemap {
  return basePaths.flatMap((basePath) =>
    routing.locales.map((locale) => {
      const path = localizedPath(locale, basePath);
      return {
        url: `${siteConfig.baseUrl}${getLocalePath(locale, path)}`,
        lastModified: nearbyPaths.includes(basePath) ? new Date(nearbyReviewed) : lastModified,
        changeFrequency: 'monthly' as const,
        priority: basePath === '/' ? 1 : 0.6,
        alternates: {
          languages: {
            ...Object.fromEntries(
              routing.locales.map((alt) => [
                alt,
                `${siteConfig.baseUrl}${getLocalePath(alt, localizedPath(alt, basePath))}`,
              ]),
            ),
            'x-default': `${siteConfig.baseUrl}${getLocalePath(defaultLocale, localizedPath(defaultLocale, basePath))}`,
          },
        },
      };
    }),
  );
}
