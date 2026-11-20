import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NearbyDirectory from '@/components/NearbyDirectory';
import { nearbyPath } from '@/content/nearby';
import labels from '@/content/nearby/labels';
import { getAlternateLanguageLinks, getLocalePath, siteConfig } from '@/i18n/config';
import { routing } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = labels[locale];
  const canonical = `${siteConfig.baseUrl}${getLocalePath(locale, nearbyPath)}`;

  return {
    title: t.title,
    description: t.intro,
    alternates: { canonical, languages: getAlternateLanguageLinks(nearbyPath) },
    openGraph: { title: t.title, description: t.intro, url: canonical, type: 'website' },
  };
}

export default async function NearbyDirectoryPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <Header solid />
      <main className="pt-16"><NearbyDirectory locale={locale} directory /></main>
      <Footer />
    </>
  );
}
