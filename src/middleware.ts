import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { defaultLocale, supportedLocales } from './i18n/config';

const intlMiddleware = createMiddleware(routing);

// Canonical host redirect: bare apex -> www.
// This is intentionally done here (exact hostname equality) instead of via
// `redirects()` in next.config.ts, because some deployment targets ignore the
// `has: [{ type: 'host' }]` condition and then redirect www -> www forever
// (ERR_TOO_MANY_REDIRECTS). Comparing for equality against the bare apex makes
// a self-redirect structurally impossible.
const APEX_HOST = 'rubjergknude.com';
const CANONICAL_HOST = 'www.rubjergknude.com';
const PATH_PLACEHOLDER = '/:path*';

function buildRedirectUrl(request: NextRequest, pathname: string) {
  const url = new URL(request.url);
  url.protocol = 'https:';
  url.port = '';
  url.host = CANONICAL_HOST;
  url.pathname = pathname;
  return url;
}

function normalizePathname(pathname: string) {
  if (pathname === '/') {
    return `/${defaultLocale}`;
  }

  const localeWithPlaceholder = supportedLocales.find((locale) => pathname === `/${locale}${PATH_PLACEHOLDER}`);
  if (localeWithPlaceholder) {
    return `/${localeWithPlaceholder}`;
  }

  return pathname;
}

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const normalizedPathname = normalizePathname(url.pathname);
  const hostHeader = request.headers.get('host');
  if (hostHeader) {
    const hostname = hostHeader.split(':')[0].toLowerCase();
    if (hostname === APEX_HOST) {
      return NextResponse.redirect(buildRedirectUrl(request, normalizedPathname), 308);
    }
  }

  if (normalizedPathname !== url.pathname) {
    return NextResponse.redirect(buildRedirectUrl(request, normalizedPathname), 308);
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
