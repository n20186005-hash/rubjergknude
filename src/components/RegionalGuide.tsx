import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getLocalePath, siteConfig, GUIDES } from '@/i18n/config';
import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WeatherForecast from '@/components/WeatherForecast';
import TidesSection from '@/components/TidesSection';

export type RegionalGuideMessages = {
  meta: { title: string; description: string };
  hero: { title: string; subtitle: string };
  intro: string;
  sections: { id: string; title: string; body: string }[];
  highlightsTitle: string;
  highlights: { name: string; desc: string }[];
  ctaTitle: string;
  ctaText: string;
  backHome: string;
  relatedTitle: string;
};

function pathForNs(ns: string): string {
  return GUIDES.find((g) => g.ns === ns)?.path ?? `/${ns}`;
}

export async function generateRegionalMetadata(
  namespace: string,
  locale: string,
): Promise<Metadata> {
  const messages = (await import(`@/messages/${locale}.json`)).default as Record<string, any>;
  const data = messages[namespace] as RegionalGuideMessages | undefined;
  if (!data) return {};
  const path = pathForNs(namespace);
  const selfUrl = `${siteConfig.baseUrl}${getLocalePath(locale, path)}`;

  return {
    title: data.meta.title,
    description: data.meta.description,
    alternates: {
      canonical: selfUrl,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${siteConfig.baseUrl}${getLocalePath(l, path)}`]),
        ),
        'x-default': `${siteConfig.baseUrl}${getLocalePath('zh', path)}`,
      },
    },
    openGraph: {
      title: data.meta.title,
      description: data.meta.description,
      url: selfUrl,
      siteName: siteConfig.siteName,
      locale: siteConfig.openGraphLocale[locale as keyof typeof siteConfig.openGraphLocale],
      type: 'article',
    },
  };
}

export default async function RegionalGuide({
  namespace,
  params,
}: {
  namespace: string;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = (await getMessages()) as Record<string, any>;
  const data = messages[namespace] as RegionalGuideMessages;
  if (!data) {
    notFound();
  }
  const htmlLang = siteConfig.htmlLang[locale as keyof typeof siteConfig.htmlLang];
  const url = `${siteConfig.baseUrl}${getLocalePath(locale, pathForNs(namespace))}`;

  const related = await Promise.all(
    GUIDES.filter((g) => g.ns !== namespace).map(async (g) => {
      const t = await getTranslations({ locale, namespace: g.ns });
      return { path: g.path, label: t('footerLink') };
    }),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.meta.title,
    description: data.meta.description,
    inLanguage: htmlLang,
    url,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      url: siteConfig.baseUrl,
    },
  };

  return (
    <>
      <Script
        id={`${namespace}-article-structured-data`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 text-center">
            <h1
              className="font-display text-4xl sm:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {data.hero.title}
            </h1>
            <p className="text-lg sm:text-xl" style={{ color: 'var(--text-secondary)' }}>
              {data.hero.subtitle}
            </p>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {data.intro}
            </p>
          </div>
        </section>

        <WeatherForecast />
        <TidesSection />

        <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-10">
              {data.sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white/5 p-8 rounded-2xl border border-white/10"
                >
                  <h2
                    className="font-display text-2xl sm:text-3xl font-semibold mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {data.highlightsTitle}
            </h2>
            <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.highlights.map((h) => (
                <div
                  key={h.name}
                  className="rounded-xl p-6"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {h.name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding text-center" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {data.ctaTitle}
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              {data.ctaText}
            </p>
            <a
              href={getLocalePath(locale, '/')}
              className="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {data.backHome}
            </a>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2
              className="font-display text-2xl sm:text-3xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {data.relatedTitle}
            </h2>
            <div className="flex flex-wrap gap-3">
              {related.map((r) => (
                <a
                  key={r.path}
                  href={getLocalePath(locale, r.path)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  {r.label}
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
