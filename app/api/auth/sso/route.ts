import { NextResponse, type NextRequest } from "next/server";
import { verifySsoToken, createSession } from "@/lib/auth";

/**
 * SSO callback from YoctoCorp.
 *
 * YoctoCorp redirects here with ?token=<signed-jwt>.
 * We verify, create a session cookie, and redirect to /admin.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Missing token parameter" },
      { status: 400 },
    );
  }

  try {
    const user = await verifySsoToken(token);
    await createSession(user);

    // Redirect to admin dashboard
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  } catch (err) {
    console.error("[sso] Token verification failed:", err);
    return NextResponse.json(
      { error: "Invalid or expired SSO token" },
      { status: 401 },
    );
  }
}
