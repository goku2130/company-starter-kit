import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware — protects /admin routes by verifying the session cookie.
 *
 * Note: We can't use lib/auth.ts here because middleware runs on the
 * Edge runtime and `cookies()` from next/headers isn't available.
 * Instead we read the cookie directly from the request.
 */

const SESSION_COOKIE = "csk_session";

function getSessionSecret(): Uint8Array {
  const secret = process.env.YOCTO_SSO_SECRET;
  if (!secret) {
    // In dev without SSO configured, allow pass-through
    return new Uint8Array(0);
  }
  return new TextEncoder().encode(secret + "__session__");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // No SSO secret configured = dev mode, allow through
  if (!process.env.YOCTO_SSO_SECRET) {
    return NextResponse.next();
  }

  if (!token) {
    // Not authenticated — redirect to home with a message
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("auth", "required");
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    return NextResponse.next();
  } catch {
    // Invalid / expired session — clear cookie and redirect
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("auth", "expired");
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
