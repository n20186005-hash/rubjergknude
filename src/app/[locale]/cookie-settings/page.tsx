import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import CookieSettingsClient from './CookieSettingsClient';
import { getAlternateLanguageLinks, getLocalePath, siteConfig } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const selfUrl = `${siteConfig.baseUrl}${getLocalePath(locale, '/cookie-settings')}`;

  return {
    alternates: {
      canonical: selfUrl,
      languages: {
        ...getAlternateLanguageLinks('/cookie-settings'),
        'x-default': `${siteConfig.baseUrl}${getLocalePath('zh', '/cookie-settings')}`,
      },
    },
  };
}

export default async function CookiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookieSettingsClient />;
}
