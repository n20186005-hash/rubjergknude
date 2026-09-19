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
  return generateRegionalMetadata('hjorring', locale);
}

export default function HjorringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <RegionalGuide namespace="hjorring" params={params} />;
}
