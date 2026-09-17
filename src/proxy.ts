import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  // 1. Update session (handles auth redirects and setting cookies)
  const response = await updateSession(request);

  // If updateSession returned a redirect, we should just return it directly
  if (response.headers.get('Location')) {
    return response;
  }

  // 2. Subdomain routing logic
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Only rewrite if it's the root path (so we don't break /login or API routes)
  if (url.pathname === '/') {
    if (hostname.includes('admin.bwrf.com')) {
      url.pathname = '/BWRF-admin';
      return NextResponse.rewrite(url, {
        headers: response.headers,
      });
    } else if (hostname.includes('member.bwrf.com')) {
      url.pathname = '/BWRF-member';
      return NextResponse.rewrite(url, {
        headers: response.headers,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
