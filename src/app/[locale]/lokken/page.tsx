import { generateRegionalMetadata, RegionalGuide } from '@/components/RegionalGuide';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateRegionalMetadata('lokken', locale);
}

export default function LokkenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <RegionalGuide namespace="lokken" params={params} />;
}
