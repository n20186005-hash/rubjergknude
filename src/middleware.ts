import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { defaultLocale, supportedLocales, type AppLocale } from './i18n/config';
import { TOPIC_ORDER, topicSlugForLocale } from '@/content/topics';

const intlMiddleware = createMiddleware(routing);

// Canonical host redirect: bare apex -> www.
// This is intentionally done here (exact hostname equality) instead of via
// `redirects()` in next.config.ts, because some deployment targets ignore the
// `has: [{ type: 'host' }]` condition and then redirect www -> www forever
// (ERR_TOO_MANY_REDIRECTS). Comparing for equality against the bare apex makes
// a self-redirect structurally impossible.
const APEX_HOST = 'rubjergknude.com';
const CANONICAL_HOST = 'www.rubjergknude.com';

function buildRedirectUrl(request: NextRequest, pathname: string) {
  const url = new URL(request.url);
  const hostname = (request.headers.get('host') ?? '').split(':')[0].toLowerCase();

  // Only pin the canonical host + https for real production traffic. On
  // localhost and preview deployments the redirect stays relative, so local
  // development does not end up on the live domain.
  if (hostname === APEX_HOST || hostname === CANONICAL_HOST) {
    url.protocol = 'https:';
    url.port = '';
    url.host = CANONICAL_HOST;
  }

  url.pathname = pathname;
  return url;
}

/**
 * `/` resolves to the default locale (Danish). No Accept-Language / IP based
 * redirect happens anywhere: the URL a crawler sees is always the same.
 */
function resolveRequestedPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { target: `/${defaultLocale}`, rewrite: null as string | null };
  }

  if (segments.length >= 2 && supportedLocales.includes(segments[0] as AppLocale)) {
    const locale = segments[0] as AppLocale;
    const slug = segments[1];
    const rest = segments.slice(2);
    const suffix = rest.length > 0 ? `/${rest.join('/')}` : '';

    const topic = TOPIC_ORDER.find((candidate) => candidate === slug || topicSlugForLocale(candidate, locale) === slug);

    if (topic) {
      const localized = topicSlugForLocale(topic, locale);
      // Localised slug -> internal (English) route folder, URL stays localised.
      if (slug !== topic) {
        return { target: pathname, rewrite: `/${locale}/${topic}${suffix}` };
      }
      // English slug on a localised locale -> 308 to the localised URL, so only
      // one URL per language is ever indexed.
      if (localized !== topic) {
        return { target: `/${locale}/${localized}${suffix}`, rewrite: null as string | null };
      }
    }
  }

  return { target: pathname, rewrite: null as string | null };
}

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { target, rewrite } = resolveRequestedPath(url.pathname);

  const hostHeader = request.headers.get('host');
  if (hostHeader) {
    const hostname = hostHeader.split(':')[0].toLowerCase();
    if (hostname === APEX_HOST) {
      return NextResponse.redirect(buildRedirectUrl(request, target), 308);
    }
  }

  if (rewrite) {
    const rewriteUrl = new URL(request.url);
    rewriteUrl.pathname = rewrite;
    return NextResponse.rewrite(rewriteUrl);
  }

  if (target !== url.pathname) {
    return NextResponse.redirect(buildRedirectUrl(request, target), 308);
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
