import { areaNames, getPlacePath, nearbyPath, nearbyPlaces } from '@/content/nearby';
import labels from '@/content/nearby/labels';
import { getLocalePath, type AppLocale } from '@/i18n/config';

export default function NearbyDirectory({ locale, directory = false }: { locale: AppLocale; directory?: boolean }) {
  const t = labels[locale];
  const Heading = directory ? 'h1' : 'h2';
  const GroupHeading = directory ? 'h2' : 'h3';

  return (
    <section id="nearby" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="mx-auto max-w-6xl">
        <Heading className="font-display mb-3 text-3xl font-semibold sm:text-4xl">{t.title}</Heading>
        <p className="mb-6 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.intro}</p>
        {!directory && (
          <a className="mb-6 inline-block font-semibold underline" href={getLocalePath(locale, nearbyPath)} style={{ color: 'var(--accent)' }}>
            {t.back}
          </a>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(areaNames).map(([key, name]) => (
            <section key={key} id={directory ? key : undefined} className="scroll-mt-20 rounded-xl border p-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <GroupHeading className="font-display mb-3 text-xl font-semibold">{name}</GroupHeading>
              {directory ? (
                <ul className="space-y-2">
                  {nearbyPlaces.filter((place) => place.group === key).map((place) => (
                    <li key={place.slug}>
                      <a className="hover:underline" href={getLocalePath(locale, getPlacePath(place.slug))}>{place.name}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <a className="underline" aria-label={`${t.menu} · ${name}`} href={`${getLocalePath(locale, nearbyPath)}#${key}`}>{t.menu} →</a>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
