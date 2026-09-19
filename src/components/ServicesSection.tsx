'use client';

import { useMessages, useTranslations } from 'next-intl';

const ICONS = [
  // WC / toilets
  (
    <svg key="wc" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2v6M6 8h4M8 2v6M6 14h4l-1 8M16 2c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5zM14.5 16l1.5 8" />
    </svg>
  ),
  // parking
  (
    <svg key="parking" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 17V7h3.5a3 3 0 0 1 0 6H9" />
    </svg>
  ),
  // dining
  (
    <svg key="dining" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 2v7a2 2 0 0 0 4 0V2M7 2v20M17 2c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5zM14.5 16l1.5 8" />
    </svg>
  ),
  // accommodation
  (
    <svg key="stay" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
  ),
  // supermarket / groceries
  (
    <svg key="shop" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18l-1.5 13a2 2 0 0 1-2 1.8H6.5a2 2 0 0 1-2-1.8L3 6z" />
      <path d="M8 6V4a2 2 0 0 1 4 0v2M14 6V4a2 2 0 0 1 4 0v2" />
    </svg>
  ),
  // fuel / EV charging
  (
    <svg key="fuel" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 22V4a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v18M14 9h3a2 2 0 0 1 2 2v9a1 1 0 0 1-1 1h-4" />
      <path d="M9 8l-2 4h3l-2 4" />
    </svg>
  ),
];

export default function ServicesSection() {
  const t = useTranslations('services');
  const messages = useMessages() as any;
  const items = (messages?.services?.items || []) as Array<{ name: string; desc: string; where: string }>;

  return (
    <section id="services" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />
        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {items.map((item, i) => (
            <article key={`${item.name}-${i}`} className="rounded-2xl p-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)', color: '#fff' }}>
                  {ICONS[i % ICONS.length]}
                </div>
                <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              <p className="text-xs mt-3 pt-3" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)' }}>
                <span className="font-medium">{t('whereLabel')}:</span> {item.where}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-xl p-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('tip')}</p>
        </div>
      </div>
    </section>
  );
}
