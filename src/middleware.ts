import { NextRequest, NextResponse } from "next/server";
const SESSION_PREFIX = "admin:v2:";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_CLOCK_SKEW_MS = 60_000;
const ADMIN_SESSION_COOKIE = "admin-session-v2";
const ADMIN_SESSION_HASH_COOKIE = "admin-session-hash";

function hexToBytes(value: string): ArrayBuffer | null {
  if (!/^[0-9a-f]{64}$/i.test(value)) return null;
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }
  return bytes.buffer;
}

function parseSession(value: string | undefined) {
  if (!value?.startsWith(SESSION_PREFIX)) return null;
  const raw = value.slice(SESSION_PREFIX.length);
  const [issuedAtText, nonce, signature] = raw.split(".");
  if (!issuedAtText || !/^[0-9a-f]{32}$/i.test(nonce) || !signature) return null;

  const issuedAt = Number.parseInt(issuedAtText, 10);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) return null;
  const signatureBytes = hexToBytes(signature);
  if (!signatureBytes) return null;

  return { issuedAt, payload: `${issuedAtText}.${nonce}`, signatureBytes };
}

async function verifySession(value: string | undefined, now = Date.now()) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const parsed = parseSession(value);
  if (!secret || !parsed) return false;
  if (now - parsed.issuedAt > SESSION_MAX_AGE_MS || parsed.issuedAt - now > MAX_CLOCK_SKEW_MS) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify(
    "HMAC",
    key,
    parsed.signatureBytes,
    new TextEncoder().encode(parsed.payload),
  );
}

function clearAdminSessionCookies(response: NextResponse) {
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  response.cookies.delete(ADMIN_SESSION_HASH_COOKIE);
}

function clearLegacySessionCookie(response: NextResponse) {
  response.cookies.delete(ADMIN_SESSION_HASH_COOKIE);
}

function isProtectedAdminRoute(pathname: string) {
  return pathname.startsWith("/admin") && pathname !== "/admin";
}

function isProtectedAdminApiRoute(pathname: string) {
  return pathname.startsWith("/api/admin") && pathname !== "/api/admin/auth";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminRoute(pathname) && !isProtectedAdminApiRoute(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const legacyHashToken = request.cookies.get(ADMIN_SESSION_HASH_COOKIE)?.value;
  const isValid = await verifySession(sessionToken);

  if (isValid) {
    if (legacyHashToken) {
      const response = NextResponse.next();
      clearLegacySessionCookie(response);
      return response;
    }
    return NextResponse.next();
  }

  if (isProtectedAdminRoute(pathname)) {
    const response = NextResponse.redirect(new URL("/admin", request.url));
    clearAdminSessionCookies(response);
    return response;
  }

  const response = NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  clearAdminSessionCookies(response);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
