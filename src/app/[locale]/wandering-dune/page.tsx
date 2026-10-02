import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import TopicGuide, { generateTopicMetadata } from '@/components/TopicGuide';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateTopicMetadata('wandering-dune', locale);
}

export default function WanderingDunePage({ params }: { params: Promise<{ locale: string }> }) {
  return <TopicGuide slug="wandering-dune" params={params} />;
}
