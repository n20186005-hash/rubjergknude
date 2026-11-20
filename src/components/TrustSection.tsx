import { getTranslations } from 'next-intl/server';
import { LAST_UPDATED, OFFICIAL_SOURCES, GOOGLE_SNAPSHOT } from '@/data/facts';

/**
 * Explicit "who is behind this" block. The domain exactly matches the
 * attraction name, so visitors must be able to see at a glance that this is an
 * independent guide, which sources it uses and when it was last reviewed.
 */
export default async function TrustSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'trust' });

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2
          className="font-display text-2xl sm:text-3xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <div className="space-y-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('independent')}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('editorial')}
          </p>

          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              {t('sourcesTitle')}
            </h3>
            <div className="flex flex-col gap-2">
              {OFFICIAL_SOURCES.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  {source.label}
                </a>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              {GOOGLE_SNAPSHOT.sourceLabel}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {GOOGLE_SNAPSHOT.ratingValue}/5 · {GOOGLE_SNAPSHOT.reviewCount.toLocaleString(locale)} ·{' '}
              {GOOGLE_SNAPSHOT.checked}
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {t('lastUpdatedLabel')}: {LAST_UPDATED}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
