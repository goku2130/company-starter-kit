/* ═══════════════════════════════════════════════════════════════════
   SSO Auth — JWT verification + session cookies.

   Flow:
   1. User clicks "Admin" on YoctoCorp dashboard
   2. YoctoCorp signs a JWT with { sub, email, name, companyId, role }
   3. Redirects to /api/auth/sso?token=<jwt>
   4. We verify, set a httpOnly session cookie, redirect to /admin
   ═══════════════════════════════════════════════════════════════════ */

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "csk_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  companyId: string;
  role: "owner" | "admin" | "viewer";
}

/* ─── SSO token verification ──────────────────────────────────── */

function getSsoSecret(): Uint8Array {
  const secret = process.env.YOCTO_SSO_SECRET;
  if (!secret) throw new Error("YOCTO_SSO_SECRET is not set");
  return new TextEncoder().encode(secret);
}

function getSessionSecret(): Uint8Array {
  // Derive session secret from SSO secret + salt
  const secret = process.env.YOCTO_SSO_SECRET;
  if (!secret) throw new Error("YOCTO_SSO_SECRET is not set");
  return new TextEncoder().encode(secret + "__session__");
}

/** Verify the SSO token from YoctoCorp. */
export async function verifySsoToken(token: string): Promise<SessionUser> {
  const { payload } = await jwtVerify(token, getSsoSecret(), {
    algorithms: ["HS256"],
    maxTokenAge: "5m", // SSO tokens expire fast
  });

  return {
    id: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string,
    companyId: payload.companyId as string,
    role: (payload.role as SessionUser["role"]) ?? "viewer",
  };
}

/* ─── Session management ──────────────────────────────────────── */

/** Create a session cookie for the verified user. */
export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    companyId: user.companyId,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return token;
}

/** Read and verify the session from the cookie. Returns null if invalid. */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });

    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      companyId: payload.companyId as string,
      role: payload.role as SessionUser["role"],
    };
  } catch {
    return null;
  }
}

/** Clear the session cookie. */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
