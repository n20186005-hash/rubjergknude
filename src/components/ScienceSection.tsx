'use client';

import { useMessages, useTranslations } from 'next-intl';

export default function ScienceSection() {
  const t = useTranslations('science');
  const messages = useMessages() as any;
  const topics = (messages?.science?.topics || []) as Array<{ title: string; body: string }>;
  const responsibility = (messages?.science?.responsibility || []) as string[];

  return (
    <section id="science" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />
        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="space-y-6 mb-10">
          {topics.map((topic, i) => (
            <div key={i} className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{topic.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{topic.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}>
          <h3 className="font-display text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{t('responsibilityTitle')}</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{t('responsibilityIntro')}</p>
          <ul className="space-y-2">
            {responsibility.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
