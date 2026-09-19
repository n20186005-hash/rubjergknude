import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Canonical host redirect: bare apex -> www.
// This is intentionally done here (exact hostname equality) instead of via
// `redirects()` in next.config.ts, because some deployment targets ignore the
// `has: [{ type: 'host' }]` condition and then redirect www -> www forever
// (ERR_TOO_MANY_REDIRECTS). Comparing for equality against the bare apex makes
// a self-redirect structurally impossible.
const APEX_HOST = 'rubjergknude.com';
const CANONICAL_HOST = 'www.rubjergknude.com';

export default function middleware(request: NextRequest) {
  const hostHeader = request.headers.get('host');
  if (hostHeader) {
    const hostname = hostHeader.split(':')[0].toLowerCase();
    if (hostname === APEX_HOST) {
      const url = new URL(request.url);
      url.protocol = 'https:';
      url.port = '';
      url.host = CANONICAL_HOST;
      return NextResponse.redirect(url, 308);
    }
  }
  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
