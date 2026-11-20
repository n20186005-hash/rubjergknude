import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import NearbyGuide from '@/components/NearbyGuide';
import { getNearbyCopy, getPlacePath, nearbyPlaces } from '@/content/nearby';
import labels from '@/content/nearby/labels';
import { getAlternateLanguageLinks, getLocalePath, siteConfig } from '@/i18n/config';
import { routing } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return nearbyPlaces.map(({ slug }) => ({ slug }));
}

async function resolvePage(params: Props['params']) {
  const { locale, slug } = await params;
  const place = nearbyPlaces.find((entry) => entry.slug === slug);
  if (!place || !hasLocale(routing.locales, locale)) notFound();
  return { locale, place };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, place } = await resolvePage(params);
  const path = getPlacePath(place.slug);
  const canonical = `${siteConfig.baseUrl}${getLocalePath(locale, path)}`;
  const title = `${place.name} · ${labels[locale].guide}`;
  const description = getNearbyCopy(place.slug, locale).history;

  return {
    title,
    description,
    alternates: { canonical, languages: getAlternateLanguageLinks(path) },
    openGraph: {
      title, description, url: canonical, type: 'article',
      ...(place.photo ? { images: [{ url: place.photo.url, alt: place.name }] } : {}),
    },
    twitter: {
      card: place.photo ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(place.photo ? { images: [place.photo.url] } : {}),
    },
  };
}

export default async function NearbyPlacePage({ params }: Props) {
  const { locale, place } = await resolvePage(params);
  setRequestLocale(locale);
  return <NearbyGuide locale={locale} place={place} />;
}
