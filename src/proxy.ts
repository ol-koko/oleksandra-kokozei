import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './features/i18n/routing';
import { legacyOverlayUrl } from './features/overlay/legacyOverlayUrl';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // Old overlay links (`/?work=ces`) moved to clean paths for good, so shared links keep working.
  const target = legacyOverlayUrl(request.nextUrl);
  if (target) return NextResponse.redirect(target, 308);
  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next.js internals, Vercel internals, and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
