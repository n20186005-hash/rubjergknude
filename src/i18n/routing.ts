import { defineRouting } from 'next-intl/routing';
import { defaultLocale, supportedLocales } from './config';

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale,
  localePrefix: 'always',
  // Never redirect based on Accept-Language / IP: the URL must be stable for
  // crawlers, and visitors pick their language explicitly in the header.
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/privacy-policy': '/privacy-policy',
    '/terms-of-service': '/terms-of-service',
    '/cookie-settings': '/cookie-settings',
    '/north-jutland': '/north-jutland',
    '/lonstrup': '/lonstrup',
    '/lokken': '/lokken',
    '/rabjerg-mile': '/rabjerg-mile',
    '/hjorring': '/hjorring',
  },
});

export type Locale = (typeof routing.locales)[number];
