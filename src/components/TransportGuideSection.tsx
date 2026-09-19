'use client';

import { useMessages, useTranslations } from 'next-intl';

const BLOCKS = ['air', 'public', 'taxi', 'car'] as const;

export default function TransportGuideSection() {
  const t = useTranslations('transportGuide');
  const messages = useMessages() as any;
  const guide = messages?.transportGuide || {};

  return (
    <section id="transportGuide" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />
        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="space-y-6">
          {BLOCKS.map((b, idx) => {
            const block = guide[b] || {};
            const steps = (block.steps || []) as string[];
            return (
              <div key={b} className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
                    {idx + 1}
                  </div>
                  <h3 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{block.title}</h3>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{block.intro}</p>
                <ul className="space-y-2 mb-4">
                  {steps.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                {block.note && (
                  <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>{block.note}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
