import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin-session-v2";
export const ADMIN_SESSION_HASH_COOKIE = "admin-session-hash";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE * 1000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;
const SESSION_PREFIX = "admin:v2:";

function signSessionPayload(payload: string): string {
  return ADMIN_SESSION_SECRET
    ? createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("hex")
    : "";
}

function timingSafeEqualHex(a: string, b: string) {
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

function clearLegacySessionCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.delete(ADMIN_SESSION_HASH_COOKIE);
}

function parseSessionToken(value: string | undefined): {
  issuedAt: number;
  nonce: string;
  signature: string;
} | null {
  if (!value || !value.startsWith(SESSION_PREFIX)) return null;

  const raw = value.slice(SESSION_PREFIX.length);
  const [issuedAtText, nonce, signature] = raw.split(".");
  if (!issuedAtText || !nonce || !signature) return null;

  const issuedAt = Number.parseInt(issuedAtText, 10);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) return null;

  return { issuedAt, nonce, signature };
}

function isExpired(issuedAt: number, now = Date.now()) {
  return now - issuedAt > SESSION_MAX_AGE_MS;
}

function isSessionTokenValid(value: string): boolean {
  if (!ADMIN_SESSION_SECRET) return false;

  const parsed = parseSessionToken(value);
  if (!parsed) return false;

  const { issuedAt, nonce, signature } = parsed;
  if (isExpired(issuedAt)) return false;

  const payload = `${issuedAt}.${nonce}`;
  const expectedSignature = signSessionPayload(payload);
  if (!expectedSignature) return false;

  return timingSafeEqualHex(expectedSignature, signature);
}

export function createAdminSessionToken() {
  const issuedAt = Date.now().toString();
  const nonce = randomBytes(16).toString("hex");
  const payload = `${issuedAt}.${nonce}`;
  const signature = signSessionPayload(payload);
  return `${SESSION_PREFIX}${payload}.${signature}`;
}

export async function clearAdminSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_HASH_COOKIE);
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function login(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD || !ADMIN_SESSION_SECRET) {
    return false;
  }

  const safePasswordMatch =
    password.length === ADMIN_PASSWORD.length &&
    timingSafeEqualHex(password, ADMIN_PASSWORD);
  if (!safePasswordMatch) return false;

  const cookieStore = await cookies();

  clearLegacySessionCookies(cookieStore);

  const sessionToken = createAdminSessionToken();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return true;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  // Rotate to force old sessions to become invalid immediately.
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  cookieStore.delete(ADMIN_SESSION_HASH_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  if (!ADMIN_SESSION_SECRET) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  if (!session?.value) return false;

  return isSessionTokenValid(session.value);
}

export function isValidAdminSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  return isSessionTokenValid(value);
}
