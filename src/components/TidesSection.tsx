import { getLocale, getTranslations } from 'next-intl/server';

// Rubjerg Knude / Løkken coast
const LAT = 57.45;
const LON = 9.78;
const TIDE_ENDPOINT = 'https://api.openwaters.io/tides/extremes';

type Extreme = {
  time: string;
  level: number;
  high: boolean;
  low: boolean;
  label: string;
};

type TideResponse = {
  station?: { name?: string };
  distance?: number;
  extremes?: Extreme[];
};

async function getTides(): Promise<TideResponse | null> {
  try {
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const url = `${TIDE_ENDPOINT}?latitude=${LAT}&longitude=${LON}&start=${encodeURIComponent(
      start,
    )}&end=${encodeURIComponent(end)}`;
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as TideResponse;
    if (!data.extremes || data.extremes.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function TidesSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'tides' });
  const tides = await getTides();

  const fmtTime = (iso: string) =>
    new Intl.DateTimeFormat(locale, {
      timeZone: 'Europe/Copenhagen',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  const fmtDay = (iso: string) =>
    new Intl.DateTimeFormat(locale, {
      timeZone: 'Europe/Copenhagen',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(new Date(iso));

  const safety = (t.raw('safety') as string[]) || [];
  const facts = [
    { title: t('patternTitle'), desc: t('patternDesc') },
    { title: t('lowTitle'), desc: t('lowDesc') },
    { title: t('highTitle'), desc: t('highDesc') },
    { title: t('bestTitle'), desc: t('bestDesc') },
  ];

  return (
    <section id="tides" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />
        <p
          className="text-lg leading-relaxed mb-10 max-w-3xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('intro')}
        </p>

        {tides ? (
          <div
            className="rounded-2xl p-6 mb-10"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <h3
              className="font-display text-xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('liveTitle')}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {t('liveNote', {
                station: tides.station?.name ?? '',
                distance: Math.round(tides.distance ?? 0),
              })}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tides.extremes.slice(0, 6).map((e, i) => (
                <div
                  key={`${e.time}-${i}`}
                  className="rounded-xl p-4"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                >
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {fmtDay(e.time)}
                  </div>
                  <div
                    className="text-2xl font-display font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {fmtTime(e.time)}
                  </div>
                  <div
                    className="mt-1 text-sm font-medium"
                    style={{ color: e.high ? 'var(--accent)' : 'var(--text-secondary)' }}
                  >
                    {e.high ? t('high') : t('low')}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {t('level')}: {e.level >= 0 ? '+' : ''}
                    {e.level.toFixed(2)} m
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-6 mb-10"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('error')}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {facts.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <h3
                className="font-display text-xl font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {f.desc}
              </p>
            </article>
          ))}
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <h3
            className="font-display text-xl font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('safetyTitle')}
          </h3>
          <ul className="space-y-2">
            {safety.map((s, i) => (
              <li
                key={`${i}`}
                className="text-sm leading-relaxed flex gap-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span style={{ color: 'var(--accent)' }}>•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
