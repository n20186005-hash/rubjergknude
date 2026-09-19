import { getLocale, getTranslations } from 'next-intl/server';

const LAT = 57.4489;
const LON = 9.7743;

const INTL_LOCALE: Record<string, string> = {
  en: 'en-GB',
  de: 'de-DE',
  da: 'da-DK',
  nl: 'nl-NL',
  zh: 'zh-CN',
};

function condKey(code: number): string {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partlyCloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'thunder';
  return 'cloudy';
}

// Beaufort level from a wind speed given in km/h.
function beaufort(kmh: number): number {
  const ms = kmh / 3.6;
  const limits = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5];
  let b = 0;
  for (let i = 0; i < limits.length; i++) if (ms >= limits[i]) b = i + 1;
  return b;
}

type Advice = { travel: string[]; activity: string[]; essentials: string[]; risk: string[] };

function buildAdvice(input: {
  code: number;
  maxTemp: number;
  minTemp: number;
  prob: number;
  uv: number;
  windKmh: number;
}): Advice {
  const { code, maxTemp, minTemp, prob, uv, windKmh } = input;
  const travel = new Set<string>();
  const activity = new Set<string>();
  const essentials = new Set<string>();
  const risk = new Set<string>();

  const add = (set: Set<string>, key: string) => set.add(key);

  const isFog = code === 45 || code === 48;
  const isThunder = code >= 95;
  const isHeavyRain = code === 65 || code === 66 || code === 67 || code === 81 || code === 82;
  const isModerateRain = code === 63 || code === 64 || code === 80;
  const isLightRain = (code >= 51 && code <= 57) || code === 61 || code === 62;

  const b = beaufort(windKmh);
  const windModerate = b >= 5 && b <= 6;
  const windStrong = b >= 7;

  // --- Condition base (travel + activity) ---
  if (code === 0) {
    add(travel, 'sunnyGood');
    add(activity, 'sunriseSunset');
  } else if (code <= 2) {
    add(travel, 'sunnyGood');
  } else if (code === 3) {
    add(travel, 'cloudyPhoto');
    add(activity, 'longOutdoor');
  }

  // --- Rain / precipitation ---
  if (isThunder) {
    add(risk, 'thunderSafety');
    add(activity, 'waterClosed');
    add(essentials, 'raincoat');
  } else if (isHeavyRain) {
    add(risk, 'heavyRainAvoid');
    add(activity, 'noOutdoor');
    add(essentials, 'raincoat');
  } else if (isModerateRain) {
    add(travel, 'lightRainSlip');
    add(activity, 'openPoor');
    if (prob >= 60) add(essentials, 'foldUmbrella');
  } else if (isLightRain) {
    add(travel, 'lightRainSlip');
    if (prob >= 60) {
      add(travel, 'rainLikely');
      add(activity, 'rainIndoor');
      add(essentials, 'foldUmbrella');
    }
  } else if (prob >= 60) {
    add(travel, 'rainLikely');
    add(activity, 'rainIndoor');
    add(essentials, 'foldUmbrella');
  }

  // --- Heat & UV ---
  if (maxTemp >= 32) {
    add(travel, 'highTempNoon');
    add(activity, 'shortenOutdoor');
    add(essentials, 'sunProtectWater');
  }
  if (uv >= 5) {
    add(travel, 'uvStrong');
    add(essentials, 'uvGear');
  }

  // --- Cold & temperature swing ---
  if (maxTemp - minTemp > 8) add(travel, 'bigDiffJacket');
  if (maxTemp <= 10) {
    add(travel, 'lowTempCold');
    add(essentials, 'warmGear');
  }

  // --- Wind ---
  if (windStrong) {
    add(risk, 'windStrong');
    add(activity, 'seaClosed');
  } else if (windModerate) {
    add(travel, 'windModerate');
    add(activity, 'coastalStop');
    add(essentials, 'hatBlows');
  }

  // --- Fog ---
  if (isFog) {
    add(risk, 'fogVisibility');
    add(essentials, 'mask');
  }

  return {
    travel: [...travel],
    activity: [...activity],
    essentials: [...essentials],
    risk: [...risk],
  };
}

function WeatherIcon({ name }: { name: string }) {
  const common = { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'clear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
      );
    case 'partlyCloudy':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3" />
          <path d="M8 2v1M2 8h1M14 4l.7.7M3.3 3.3L4 4" />
          <path d="M17 19H8a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.3A3.5 3.5 0 0 1 17 19z" />
        </svg>
      );
    case 'cloudy':
    case 'fog':
      return (
        <svg {...common}>
          <path d="M17 18H7a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.3A3.5 3.5 0 0 1 17 18z" />
          {name === 'fog' && <path d="M5 21h9M8 21h7" />}
        </svg>
      );
    case 'drizzle':
    case 'rain':
      return (
        <svg {...common}>
          <path d="M17 14H7a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.3A3.5 3.5 0 0 1 17 14z" />
          <path d={name === 'rain' ? 'M8 18l-1 3M12 18l-1 3M16 18l-1 3' : 'M9 18l-.5 1.5M13 18l-.5 1.5M17 18l-.5 1.5'} />
        </svg>
      );
    case 'snow':
      return (
        <svg {...common}>
          <path d="M17 14H7a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.3A3.5 3.5 0 0 1 17 14z" />
          <path d="M9 18v.01M12 20v.01M15 18v.01" />
        </svg>
      );
    case 'thunder':
      return (
        <svg {...common}>
          <path d="M17 14H7a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.3A3.5 3.5 0 0 1 17 14z" />
          <path d="M12 16l-2 4h3l-2 4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M17 18H7a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.3A3.5 3.5 0 0 1 17 18z" />
        </svg>
      );
  }
}

function AdviceIcon({ name }: { name: 'travel' | 'activity' | 'essentials' }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, style: { color: 'var(--accent)' } };
  if (name === 'travel')
    return (
      <svg {...common}>
        <path d="M20 12.5V19a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6.5l1.5-4.5A2 2 0 0 1 7.4 6h9.2a2 2 0 0 1 1.9 1.3l1.5 4.5z" />
        <circle cx="7.5" cy="16.5" r="1.5" />
        <circle cx="16.5" cy="16.5" r="1.5" />
      </svg>
    );
  if (name === 'activity')
    return (
      <svg {...common}>
        <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function Check() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', flex: '0 0 auto' }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
      <path d="M12 3 2 20h20L12 3z" />
      <path d="M12 9v5M12 17v.5" />
    </svg>
  );
}

export default async function WeatherForecast() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'weather' });
  const ta = await getTranslations({ locale, namespace: 'weatherTips' });
  const intl = INTL_LOCALE[locale] ?? 'en-GB';

  let data: any = null;
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,uv_index` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max` +
        `&timezone=auto&forecast_days=7`,
      { next: { revalidate: 1800 } },
    );
    if (res.ok) data = await res.json();
  } catch {
    data = null;
  }

  if (!data?.current || !data?.daily) {
    return (
      <section id="weather" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            {t('title')}
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {t('error')}
          </p>
        </div>
      </section>
    );
  }

  const cur = data.current;
  const daily = data.daily;
  const curKey = condKey(cur.weather_code);
  const todayProb = daily.precipitation_probability_max?.[0] ?? 0;
  const todayMax = Math.round(daily.temperature_2m_max?.[0] as number);
  const todayMin = Math.round(daily.temperature_2m_min?.[0] as number);
  const todayUv = Math.round((cur.uv_index as number) ?? (daily.uv_index_max?.[0] as number) ?? 0);
  const todayWind = Math.round(cur.wind_speed_10m as number);

  const advice = buildAdvice({
    code: cur.weather_code as number,
    maxTemp: todayMax,
    minTemp: todayMin,
    prob: todayProb,
    uv: todayUv,
    windKmh: todayWind,
  });

  const weekdayFmt = new Intl.DateTimeFormat(intl, { weekday: 'short', timeZone: 'UTC' });
  const dateFmt = new Intl.DateTimeFormat(intl, { day: 'numeric', month: 'short', timeZone: 'UTC' });

  const days = (daily.time as string[]).map((d: string, i: number) => ({
    weekday: weekdayFmt.format(new Date(`${d}T00:00:00Z`)),
    date: dateFmt.format(new Date(`${d}T00:00:00Z`)),
    code: daily.weather_code[i] as number,
    max: Math.round(daily.temperature_2m_max[i] as number),
    min: Math.round(daily.temperature_2m_min[i] as number),
    prob: (daily.precipitation_probability_max?.[i] as number) ?? 0,
  }));

  const adviceGrid: { key: 'travel' | 'activity' | 'essentials'; title: string; items: string[] }[] = [
    { key: 'travel', title: ta('travelTitle'), items: advice.travel },
    { key: 'activity', title: ta('activityTitle'), items: advice.activity },
    { key: 'essentials', title: ta('essentialsTitle'), items: advice.essentials },
  ];

  return (
    <section id="weather" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div style={{ color: 'var(--accent)' }}>
                <WeatherIcon name={curKey} />
              </div>
              <div>
                <div className="font-display text-4xl sm:text-5xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {Math.round(cur.temperature_2m)}°
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t(`cond.${curKey}`)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>{t('feelsLike')}: {Math.round(cur.apparent_temperature)}°</span>
              <span>{t('humidity')}: {cur.relative_humidity_2m}%</span>
              <span>{t('wind')}: {todayWind} km/h</span>
              <span>{t('precip')}: {todayProb}%</span>
              <span>{t('uv')}: {todayUv}</span>
            </div>
          </div>
        </div>

        {advice.risk.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-6 flex items-start gap-3"
            style={{ background: 'rgba(229,62,62,0.10)', border: '1px solid rgba(229,62,62,0.45)', color: 'var(--text-primary)' }}
          >
            <div style={{ color: '#e53e3e' }} className="mt-0.5"><AlertIcon /></div>
            <div>
              <div className="font-display text-base font-semibold mb-1" style={{ color: '#e53e3e' }}>{ta('riskTitle')}</div>
              <ul className="space-y-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                {advice.risk.map((k) => (
                  <li key={k}>{ta(`adv.${k}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {adviceGrid.map((col) =>
            col.items.length === 0 ? null : (
              <div key={col.key} className="rounded-2xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <AdviceIcon name={col.key} />
                  <h3 className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{col.title}</h3>
                </div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {col.items.map((k) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className="mt-0.5"><Check /></span>
                      <span>{ta(`adv.${k}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>

        <h3 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('forecast')}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
          {days.map((d, i) => {
            const key = condKey(d.code);
            return (
              <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{i === 0 ? t('today') : d.weekday}</div>
                <div className="text-[10px] mb-1" style={{ color: 'var(--text-secondary)' }}>{d.date}</div>
                <div className="flex justify-center my-1" style={{ color: 'var(--accent)' }}>
                  <WeatherIcon name={key} />
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{d.max}°/{d.min}°</div>
                <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{d.prob}%</div>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>{t('updated')}</p>
      </div>
    </section>
  );
}
