import Script from 'next/script';
import { getMessages } from 'next-intl/server';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  id: string;
  title: string;
  items: FaqItem[];
};

export default async function FaqStructuredData() {
  const messages = (await getMessages()) as {
    faq?: {
      sections?: FaqSection[];
    };
  };

  const sections = messages.faq?.sections ?? [];
  const items = sections.flatMap((section) => section.items ?? []);

  if (items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

