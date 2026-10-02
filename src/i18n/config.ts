export const supportedLocales = ['zh', 'en', 'de', 'da', 'nl'] as const;

export type AppLocale = (typeof supportedLocales)[number];

/**
 * Root-domain entry language. Danish is the largest search market for this
 * attraction (~63% of impressions) and Germany second (~19%), so `/` must not
 * resolve to a language that carries almost no traffic.
 */
export const defaultLocale: AppLocale = 'da';

/** Language served on `/` and used for hreflang x-default. */
export const xDefaultLocale: AppLocale = 'da';

export const siteConfig = {
  baseUrl: 'https://www.rubjergknude.com',
  siteName: 'Rubjerg Knude',
  localeLabels: {
    zh: '中文',
    en: 'English',
    de: 'Deutsch',
    da: 'Dansk',
    nl: 'Nederlands',
  } as Record<AppLocale, string>,
  htmlLang: {
    zh: 'zh-CN',
    en: 'en',
    de: 'de',
    da: 'da',
    nl: 'nl',
  } as Record<AppLocale, string>,
  openGraphLocale: {
    zh: 'zh_CN',
    en: 'en_US',
    de: 'de_DE',
    da: 'da_DK',
    nl: 'nl_NL',
  } as Record<AppLocale, string>,
};

export function getLocalePath(locale: AppLocale | string, pathname = '/') {
  const normalizedPath = pathname === '/' ? '' : pathname;
  return `/${locale}${normalizedPath}`;
}

/**
 * hreflang map for a given pathname. Always absolute, always on the www host,
 * and always including an explicit x-default so Google never has to guess.
 */
export function getAlternateLanguageLinks(pathname = '/') {
  return {
    ...Object.fromEntries(
      supportedLocales.map((locale) => [locale, `${siteConfig.baseUrl}${getLocalePath(locale, pathname)}`]),
    ),
    'x-default': `${siteConfig.baseUrl}${getLocalePath(xDefaultLocale, pathname)}`,
  };
}

export const GUIDES = [
  { ns: 'northJutland', path: '/north-jutland' },
  { ns: 'lonstrup', path: '/lonstrup' },
  { ns: 'lokken', path: '/lokken' },
  { ns: 'rabjergMile', path: '/rabjerg-mile' },
  { ns: 'hjorring', path: '/hjorring' },
] as const;
