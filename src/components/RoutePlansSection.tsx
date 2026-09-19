'use client';

import { useMessages, useTranslations } from 'next-intl';

export default function RoutePlansSection() {
  const t = useTranslations('routePlans');
  const messages = useMessages() as any;
  const plans = (messages?.routePlans?.plans || []) as Array<{ name: string; audience: string; steps: string[] }>;

  return (
    <section id="routePlans" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />
        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {plans.map((plan, i) => (
            <div key={i} className="rounded-2xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-4" style={{ background: 'var(--accent)', color: '#fff' }}>
                {i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
              <p className="text-xs font-medium mb-4" style={{ color: 'var(--accent)' }}>{plan.audience}</p>
              <ol className="space-y-2">
                {plan.steps.map((s: string, j: number) => (
                  <li key={j} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>{j + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent)' }}>
          <h3 className="font-display text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>{t('generalTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t('halfTitle')}</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('halfDesc')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t('fullTitle')}</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('fullDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
