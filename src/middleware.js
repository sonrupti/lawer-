import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

/**
 * Next.js Middleware — runs on every matched request BEFORE the page renders.
 *
 * Responsibilities:
 * 1. Refresh the Supabase session (required by @supabase/ssr on every request).
 * 2. Protect authenticated-only routes — redirect to /login if not signed in.
 * 3. Redirect already-authenticated users away from /login and /register.
 */
export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Build a Supabase server client that reads/writes cookies on the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Always call getUser() to refresh the session token.
  // Do NOT use getSession() here — it reads from cookies without verifying with Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Auth-only pages that require a logged-in user
  const protectedPaths = ['/select-language', '/settings'];

  // Auth pages that a logged-in user should not visit
  const authPages = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp'];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPages.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    // Not authenticated — redirect to login
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPage) {
    // Already authenticated — redirect to home
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
