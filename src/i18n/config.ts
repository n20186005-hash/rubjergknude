export const supportedLocales = ['zh', 'en', 'de', 'da', 'nl'] as const;

export type AppLocale = (typeof supportedLocales)[number];

export const defaultLocale: AppLocale = 'zh';

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

export function getAlternateLanguageLinks(pathname = '/') {
  return Object.fromEntries(
    supportedLocales.map((locale) => [locale, `${siteConfig.baseUrl}${getLocalePath(locale, pathname)}`]),
  );
}

export const GUIDES = [
  { ns: 'northJutland', path: '/north-jutland' },
  { ns: 'lonstrup', path: '/lonstrup' },
  { ns: 'lokken', path: '/lokken' },
  { ns: 'rabjergMile', path: '/rabjerg-mile' },
  { ns: 'hjorring', path: '/hjorring' },
] as const;
