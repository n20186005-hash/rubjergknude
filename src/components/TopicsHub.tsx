import { getTranslations } from 'next-intl/server';
import { getLocalePath, type AppLocale } from '@/i18n/config';
import { TOPIC_ORDER, getTopic, getTopicLabel, topicSlugForLocale } from '@/content/topics';

/**
 * Home page hub: keeps only the short answer on the home page and routes each
 * search intent to its own page (parking / opening hours / the move / the dune /
 * the tractor / day trips).
 */
export default async function TopicsHub({ locale }: { locale: AppLocale | string }) {
  const t = await getTranslations({ locale, namespace: 'topics' });

  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          className="font-display text-2xl sm:text-3xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-6" style={{ background: 'var(--accent)' }} />
        <p className="text-base leading-relaxed mb-8 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPIC_ORDER.map((slug) => {
            const data = getTopic(slug, locale);
            return (
              <a
                key={slug}
                href={getLocalePath(locale, `/${topicSlugForLocale(slug, locale)}`)}
                className="block rounded-xl p-5 transition-shadow hover:shadow-md"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <h3
                  className="font-display text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {data.h1}
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {data.metaDescription}
                </p>
                <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  {getTopicLabel(slug, locale)} →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
