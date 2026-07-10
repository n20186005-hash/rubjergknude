'use client';

import { useMessages, useTranslations } from 'next-intl';

export default function BasicInfo() {
  const t = useTranslations('basicInfo');
  const messages = useMessages() as {
    basicInfo?: {
      items?: Array<{ label: string; value: string }>;
    };
  };
  const items = messages.basicInfo?.items ?? [];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={`${item.label}-${index}`} className={index === items.length - 1 ? 'md:col-span-2 lg:col-span-3' : ''}>
              <InfoCard title={item.label} value={item.value} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
    >
      <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{title}</p>
      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}
