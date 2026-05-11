import { useTranslations, useMessages } from 'next-intl';

export default function Recommendations() {
  const t = useTranslations('recommendations');
  const messages = useMessages() as any;
  const attractions = (messages?.recommendations?.attractions || []) as Array<{ name: string; url: string }>;
  const tours = (messages?.recommendations?.tours || []) as Array<{ name: string; url: string }>;

  if (attractions.length === 0 && tours.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-10 mx-auto" style={{ background: 'var(--accent)' }} />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Nearby Attractions */}
          <div className="bg-white dark:bg-[#162d44] p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#1e3a54]">
            <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t('attractionsTitle')}
            </h3>
            <ul className="space-y-3">
              {attractions.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 hover:text-blue-600 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    <span className="group-hover:underline underline-offset-4 decoration-blue-300">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Tours */}
          <div className="bg-white dark:bg-[#162d44] p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#1e3a54]">
            <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
              </svg>
              {t('toursTitle')}
            </h3>
            <ul className="space-y-3">
              {tours.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 hover:text-blue-600 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    <span className="group-hover:underline underline-offset-4 decoration-blue-300 leading-snug">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}