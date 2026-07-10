'use client';

import { useMessages, useTranslations } from 'next-intl';

type PracticalCard = {
  title: string;
  description: string;
};

export default function PracticalInfoSection() {
  const t = useTranslations('practicalInfo');
  const messages = useMessages() as {
    practicalInfo?: {
      cards?: PracticalCard[];
    };
  };
  const cards = messages.practicalInfo?.cards ?? [];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {cards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-4"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {index + 1}
              </div>
              <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                {card.description}
              </p>
            </article>
          ))}
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {t('warningTitle')}
          </h3>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
            {t('warningText')}
          </p>
        </div>
      </div>
    </section>
  );
}
