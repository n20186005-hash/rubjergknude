'use client';

import { useMessages, useTranslations } from 'next-intl';

type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

export default function HistoryTimeline() {
  const t = useTranslations('historyTimeline');
  const messages = useMessages() as {
    historyTimeline?: {
      intro?: string;
      events?: TimelineEvent[];
    };
  };
  const events = messages.historyTimeline?.events ?? [];

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 hidden sm:block" style={{ background: 'var(--border-color)' }} />

          <div className="space-y-6">
            {events.map((event, index) => (
              <article key={`${event.year}-${index}`} className="relative sm:pl-16">
                <div
                  className="hidden sm:flex absolute left-0 top-1 w-10 h-10 rounded-full items-center justify-center text-sm font-semibold"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {index + 1}
                </div>

                <div
                  className="rounded-2xl p-6"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <p className="text-sm font-semibold mb-2 tracking-wide uppercase" style={{ color: 'var(--accent)' }}>
                    {event.year}
                  </p>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {event.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {event.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
