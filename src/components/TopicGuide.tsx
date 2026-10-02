import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { getLocalePath, siteConfig, defaultLocale, type AppLocale } from '@/i18n/config';
import { LAST_UPDATED, OFFICIAL_SOURCES } from '@/data/facts';
import { TOPIC_ORDER, getTopic, topicSlugForLocale, getTopicLabel } from '@/content/topics';
import type { TopicSlug } from '@/content/topics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateTopicMetadata(
  slug: TopicSlug,
  locale: string,
): Promise<Metadata> {
  const data = getTopic(slug, locale);
  const selfUrl = `${siteConfig.baseUrl}${getLocalePath(locale, `/${topicSlugForLocale(slug, locale)}`)}`;

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: selfUrl,
      languages: Object.fromEntries([
        ...routing.locales.map((alt) => [
          alt,
          `${siteConfig.baseUrl}${getLocalePath(alt, `/${topicSlugForLocale(slug, alt)}`)}`,
        ]),
        ['x-default', `${siteConfig.baseUrl}${getLocalePath(defaultLocale, `/${topicSlugForLocale(slug, defaultLocale)}`)}`],
      ]),
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: selfUrl,
      siteName: siteConfig.siteName,
      locale: siteConfig.openGraphLocale[locale as AppLocale],
      type: 'article',
    },
  };
}

export default async function TopicGuide({
  slug,
  params,
}: {
  slug: TopicSlug;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) {
    notFound();
  }
  setRequestLocale(locale);

  const data = getTopic(slug, locale);
  const t = await getTranslations({ locale, namespace: 'topicPage' });
  const htmlLang = siteConfig.htmlLang[locale as AppLocale];
  const url = `${siteConfig.baseUrl}${getLocalePath(locale, `/${topicSlugForLocale(slug, locale)}`)}`;
  const homeUrl = `${siteConfig.baseUrl}${getLocalePath(locale)}`;

  const related = TOPIC_ORDER.filter((candidate) => candidate !== slug).map((candidate) => ({
    slug: candidate,
    label: getTopicLabel(candidate, locale),
    href: getLocalePath(locale, `/${topicSlugForLocale(candidate, locale)}`),
  }));

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.h1,
    description: data.metaDescription,
    inLanguage: htmlLang,
    dateModified: LAST_UPDATED,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      url: siteConfig.baseUrl,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('homeCrumb'), item: homeUrl },
      { '@type': 'ListItem', position: 2, name: data.h1, item: url },
    ],
  };

  return (
    <>
      <Script
        id={`${slug}-article-jsonld`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id={`${slug}-faq-jsonld`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`${slug}-breadcrumb-jsonld`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main>
        <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16">
            <h1
              className="font-display text-3xl sm:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {data.h1}
            </h1>
            <p className="text-lg sm:text-xl" style={{ color: 'var(--text-secondary)' }}>
              {data.subtitle}
            </p>
          </div>
        </section>

        {/* Quick answer — the block mobile visitors see first. */}
        <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--accent)' }}
            >
              <h2
                className="font-display text-xl font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('quickAnswerTitle')}
              </h2>
              <ul className="space-y-3">
                {data.quickAnswer.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
                {t('updatedLabel')}: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {data.intro}
            </p>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
            {data.sections.map((section) => (
              <article key={section.id}>
                <h2
                  className="font-display text-2xl sm:text-3xl font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {section.heading}
                </h2>
                <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2
              className="font-display text-2xl sm:text-3xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('highlightsTitle')}
            </h2>
            <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.highlights.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl p-6"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {item.name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2
              className="font-display text-2xl sm:text-3xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('faqTitle')}
            </h2>
            <div className="space-y-4">
              {data.faq.map((item) => (
                <details
                  key={item.q}
                  className="rounded-xl p-5"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <summary
                    className="font-medium cursor-pointer"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.q}
                  </summary>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2
              className="font-display text-xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('sourcesTitle')}
            </h2>
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
        </section>

        <section className="section-padding text-center" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2
              className="font-display text-2xl sm:text-3xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('ctaTitle')}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              {t('ctaText')}
            </p>
            <a
              href={getLocalePath(locale, '/')}
              className="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {t('backHome')}
            </a>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2
              className="font-display text-xl sm:text-2xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('relatedTitle')}
            </h2>
            <div className="flex flex-wrap gap-3">
              {related.map((item) => (
                <a
                  key={item.slug}
                  href={item.href}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
