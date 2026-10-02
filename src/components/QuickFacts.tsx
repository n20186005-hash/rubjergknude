'use client';

import { useTranslations, useMessages } from 'next-intl';
import { ATTRACTION } from '@/data/facts';

type FactItem = { label: string; value: string };

/**
 * Above-the-fold decision strip. 89% of clicks come from mobile, so the first
 * screen has to answer parking / entry / opening hours / walking distance
 * before any background prose.
 */
export default function QuickFacts() {
  const t = useTranslations('quickFacts');
  const messages = useMessages() as { quickFacts?: { items?: FactItem[] } };
  const items = messages.quickFacts?.items ?? [];

  return (
    <section
      className="px-4 sm:px-6 py-8 sm:py-10"
      style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}
      aria-label={t('title')}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="sr-only">{t('title')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                {item.label}
              </p>
              <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <a
            href={ATTRACTION.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {ATTRACTION.streetAddress}, {ATTRACTION.postalCode} {ATTRACTION.addressLocality}
          </a>
          <a
            href={`tel:${ATTRACTION.telephone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {ATTRACTION.telephone}
          </a>
        </div>
      </div>
    </section>
  );
}
