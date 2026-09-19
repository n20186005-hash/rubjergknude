'use client';

import { useMessages, useTranslations } from 'next-intl';

export default function StoriesSection() {
  const t = useTranslations('stories');
  const messages = useMessages() as any;
  const items = (messages?.stories?.items || []) as Array<{ title: string; body: string }>;

  return (
    <section id="stories" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />
        <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="space-y-8">
          {items.map((item, i) => (
            <article key={i} className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 className="font-display text-xl sm:text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
