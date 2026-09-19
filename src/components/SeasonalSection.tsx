'use client';

import { useTranslations } from 'next-intl';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
const ROWS = ['weather', 'windSand', 'activities', 'caution'] as const;

export default function SeasonalSection() {
  const t = useTranslations('seasonal');

  return (
    <section id="seasonal" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />
        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left p-3" style={{ color: 'var(--text-secondary)' }}>{t('category')}</th>
                {SEASONS.map((s) => (
                  <th key={s} className="text-left p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{t(`${s}Name`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td className="p-3 font-medium align-top" style={{ color: 'var(--accent)' }}>{t(`${row}Label`)}</td>
                  {SEASONS.map((s) => (
                    <td key={s} className="p-3 align-top leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {t(`${s}.${row}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
