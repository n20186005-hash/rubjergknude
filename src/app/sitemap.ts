import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig, getLocalePath } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const pathnames = Object.values(routing.pathnames);

  return routing.locales.flatMap((locale) =>
    pathnames.map((pathname) => {
      const url = `${siteConfig.baseUrl}${getLocalePath(locale, pathname)}`;
      return {
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: pathname === '/' ? 1 : 0.4,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alt) => [alt, `${siteConfig.baseUrl}${getLocalePath(alt, pathname)}`]),
          ),
        },
      };
    }),
  );
}
