import { defineRouting } from 'next-intl/routing';
import { defaultLocale, supportedLocales } from './config';

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale,
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/privacy-policy': '/privacy-policy',
    '/terms-of-service': '/terms-of-service',
    '/cookie-settings': '/cookie-settings',
  },
});

export type Locale = (typeof routing.locales)[number];
