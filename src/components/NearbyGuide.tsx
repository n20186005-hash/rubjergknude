import type { ReactNode } from 'react';
import { areaNames, getNearbyCopy, getPlaceMap, getPlacePath, managers, nearbyPath, nearbyPlaces, nearbyReviewed, type NearbyPlace } from '@/content/nearby';
import labels from '@/content/nearby/labels';
import { getLocalePath, siteConfig, type AppLocale } from '@/i18n/config';
import { ATTRACTION } from '@/data/facts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b py-6" style={{ borderColor: 'var(--border-color)' }}>
      <h2 className="font-display mb-2 text-2xl font-semibold">{title}</h2>
      <div className="space-y-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
    </section>
  );
}

export default function NearbyGuide({ locale, place }: { locale: AppLocale; place: NearbyPlace }) {
  const t = labels[locale];
  const data = getNearbyCopy(place.slug, locale);
  const map = getPlaceMap(place);
  const manager = place.manager ? managers[place.manager] : null;
  const photo = place.photo;
  const nearby = nearbyPlaces.filter((other) => other.group === place.group && other.slug !== place.slug);
  const faq = [...data.faq, { q: t.placeMap, a: `${place.name}, ${place.locality}, Danmark` }];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: data.history,
    url: `${siteConfig.baseUrl}${getLocalePath(locale, getPlacePath(place.slug))}`,
    ...(photo ? { image: photo.url } : {}),
    hasMap: map.place,
    address: { '@type': 'PostalAddress', addressLocality: place.locality.split(', ').at(-1), addressCountry: 'DK' },
  };

  return (
    <>
      <Header solid />
      <main>
        <div className="border-b px-4 pb-9 pt-24 sm:px-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="mx-auto max-w-5xl">
            <nav aria-label={t.back} className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-sm" style={{ color: 'var(--accent)' }}>
              <a className="hover:underline" href={getLocalePath(locale)}>{t.home}</a>
              <a className="hover:underline" href={getLocalePath(locale, nearbyPath)}>{t.menu}</a>
              <a className="hover:underline" href={`${getLocalePath(locale, nearbyPath)}#${place.group}`}>{areaNames[place.group]}</a>
            </nav>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">{place.name}</h1>
            <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>{place.locality}</p>
            <a className="mt-4 inline-block font-medium underline" href={map.place} style={{ color: 'var(--accent)' }}>{t.placeMap}</a>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
          <Section title={t.manager}>
            {manager ? <a className="underline" href={manager.url}>{manager.name}</a> : <p>{t.managerPending}</p>}
            <p className="text-sm">{t.reviewed} <time dateTime={nearbyReviewed}>{nearbyReviewed}</time></p>
          </Section>
          <div className="grid gap-x-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div>
              <Section title={t.history}><p>{data.history}</p></Section>
              <Section title={t.visit}><p>{data.visit}</p></Section>
              <Section title={t.access}><p>{data.access}</p></Section>
              <Section title={t.photo}>
                <p>{data.photoTip}</p>
                {photo ? (
                  <figure>
                    {/* Original photograph and its provenance remain linked together. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={place.name} loading="lazy" referrerPolicy="no-referrer" className="max-h-96 w-full rounded-xl object-contain" />
                    <figcaption className="mt-2 text-sm">
                      {t.photosBy} · <a className="underline" href={photo.source}>{photo.author}</a> · <a className="underline" href={photo.licenseUrl}>{photo.license}</a>
                    </figcaption>
                  </figure>
                ) : (
                  <p className="rounded-xl border px-4 py-8 text-center text-sm" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>{t.photoPending}</p>
                )}
              </Section>
              <Section title={t.faq}>
                <dl className="space-y-4">
                  {faq.map(({ q, a }) => <div key={q}><dt className="font-semibold">{q}</dt><dd>{a}</dd></div>)}
                </dl>
              </Section>
            </div>
            <aside>
              <Section title={t.maps}>
                <iframe title={`${t.placeMap} · ${place.name}`} src={map.embed} className="h-56 w-full rounded-xl border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                <ul className="space-y-2">
                  <li><a className="underline" href={map.place}>{t.placeMap} · {place.name}</a></li>
                  <li><a className="underline" href={map.area}>{t.areaMap} · {areaNames[place.group]}</a></li>
                  <li><a className="underline" href={ATTRACTION.mapsUrl}>{t.home}</a></li>
                </ul>
              </Section>
              <Section title={t.related}>
                <ul className="space-y-2">
                  {nearby.map((other) => <li key={other.slug}><a className="underline" href={getLocalePath(locale, getPlacePath(other.slug))}>{other.name}</a></li>)}
                </ul>
              </Section>
              <Section title={t.sources}>
                <ul className="space-y-2 break-words">
                  {place.sources.map((source) => {
                    const url = new URL(source);
                    return <li key={source}><a className="underline" href={source}>{url.hostname.replace(/^www\./, '')}</a></li>;
                  })}
                </ul>
              </Section>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
