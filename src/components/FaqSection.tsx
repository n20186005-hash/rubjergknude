'use client';

import { useMessages, useTranslations } from 'next-intl';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  id: string;
  title: string;
  items: FaqItem[];
};

export default function FaqSection() {
  const t = useTranslations('faq');
  const messages = useMessages() as {
    faq?: {
      intro?: string;
      sections?: FaqSection[];
    };
  };

  const sections = messages.faq?.sections ?? [];

  return (
    <section id="faq" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.id}>
              <h3 className="font-display text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                {section.title}
              </h3>

              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <details
                    key={`${section.id}-${index}-${item.question}`}
                    className="rounded-2xl p-5"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}
                  >
                    <summary className="cursor-pointer select-none">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.question}
                      </span>
                    </summary>
                    <div className="mt-3 text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
