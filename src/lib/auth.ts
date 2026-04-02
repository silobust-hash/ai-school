import { cookies } from "next/headers";

const SESSION_COOKIE = "admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "ai-school-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function login(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD || "0715";
  if (password !== adminPassword) return false;

  const sessionToken = await hashPassword(password + Date.now().toString());
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  const tokenHash = await hashPassword(sessionToken);
  cookieStore.set("admin-session-hash", tokenHash, {
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
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete("admin-session-hash");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const sessionHash = cookieStore.get("admin-session-hash");

  if (!session?.value || !sessionHash?.value) return false;

  const expectedHash = await hashPassword(session.value);
  return expectedHash === sessionHash.value;
}
