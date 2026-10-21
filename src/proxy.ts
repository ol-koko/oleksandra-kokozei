import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import {
  detectLocale,
  hasLocalePrefix,
  withLocalePrefix,
  withoutDisabledLocale,
} from './features/i18n/localeDetection';
import { routing } from './features/i18n/routing';
import { legacyOverlayUrl } from './features/overlay/legacyOverlayUrl';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // 1. A disabled locale (`/uk/…`) falls back to English for now, so the redirect is temporary.
  const disabled = withoutDisabledLocale(request.nextUrl);
  const source = disabled ?? request.nextUrl;

  // 2. Old overlay links (`/?work=ces`) moved to clean paths for good, so shared links keep working.
  const legacy = legacyOverlayUrl(source);
  const url = legacy ?? source;

  // 3. An unprefixed URL is English nobody chose: send the visitor to their saved or
  //    country locale. Prefixed URLs are an explicit choice and never redirect, so no loops.
  const locale = hasLocalePrefix(url.pathname) ? null : detectLocale(request);
  if (locale) {
    const response = NextResponse.redirect(withLocalePrefix(url, locale), 307);
    // The target depends on the visitor, so no shared cache may keep it.
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
  if (disabled) return NextResponse.redirect(url, 307);
  if (legacy) return NextResponse.redirect(legacy, 308);

  // 4. Locale routing.
  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next.js internals, Vercel internals, and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
