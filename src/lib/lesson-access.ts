import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getNextSeoulMidnight, getSecondsUntilNextSeoulMidnight } from "@/lib/seoul-time";

const ACCESS_COOKIE = "lesson-access-v2";
const ACCESS_SECRET = process.env.LESSON_ACCESS_SECRET;

type AttemptBucket = {
  count: number;
  resetAt: number;
};

const failBuckets = new Map<string, AttemptBucket>();
const MAX_FAILS = 5;
const WINDOW_MS = 60_000;

function getClientKey(ip: string | null) {
  return ip ? `ip:${ip}` : "ip:unknown";
}

export function buildSeoulDateCode(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  return `${year}${month}${day}`;
}

function signCode(seed: string, targetDateCode: string, secret = ACCESS_SECRET) {
  if (!secret) return "";
  return createHmac("sha256", secret).update(seed).update(targetDateCode).digest("hex");
}

export function deriveLessonAccessCode(dateCode: string, secret = ACCESS_SECRET) {
  if (!secret) return "";
  const digest = createHmac("sha256", secret)
    .update("lesson:code")
    .update(dateCode)
    .digest();
  return String(digest.readUInt32BE(0) % 1_000_000).padStart(6, "0");
}

export function getTodayAccessCode() {
  const dateCode = buildSeoulDateCode();
  return {
    code: deriveLessonAccessCode(dateCode),
    dateCode,
    expiresAt: `${new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      weekday: "short",
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      timeZoneName: "short",
    }).format(getNextSeoulMidnight())} 기준 자정 만료`
  };
}

export function isLessonAccessCodeValid(code: string, date = new Date()) {
  if (!/^\d{6}$/.test(code)) return false;
  const expected = deriveLessonAccessCode(buildSeoulDateCode(date));
  return expected.length === 6 && timingSafeEqualText(code, expected);
}

export async function isLessonAccessGranted(): Promise<boolean> {
  if (!ACCESS_SECRET) return false;

  const cookieStore = await cookies();
  const raw = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!raw) return false;

  const [dateCode, signature] = raw.split(":");
  if (!dateCode || !signature) return false;

  const expected = signCode("lesson:cookie", dateCode);
  if (!timingSafeEqualText(signature, expected)) {
    return false;
  }

  const validDateCode = buildSeoulDateCode();
  if (dateCode !== validDateCode) return false;
  return true;
}

export function checkRateLimitForClient(clientIp: string | null): { ok: boolean; retryAfter?: number } {
  const key = getClientKey(clientIp);
  const now = Date.now();
  const bucket = failBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    failBuckets.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (bucket.count >= MAX_FAILS) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { ok: true };
}

export function incrementFailForClient(clientIp: string | null) {
  const key = getClientKey(clientIp);
  const now = Date.now();
  const bucket = failBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    failBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.count += 1;
  failBuckets.set(key, bucket);
}

function timingSafeEqualText(a: string, b: string) {
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

export async function issueLessonAccessCookie() {
  if (!ACCESS_SECRET) {
    throw new Error("LESSON_ACCESS_SECRET is not configured");
  }
  const today = buildSeoulDateCode();
  const value = `${today}:${signCode("lesson:cookie", today)}`;
  const now = new Date();
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: getSecondsUntilNextSeoulMidnight(now),
    expires: getNextSeoulMidnight(now),
    path: "/",
  });
  return;
}

export function sanitizeLessonForPublic(lesson: Record<string, unknown>) {
  return {
    id: lesson.id,
    phase: lesson.phase,
    title: lesson.title,
    summary: lesson.summary,
    prev: lesson.prev,
    next: lesson.next,
  };
}

export function setNoCache(response: NextResponse) {
  response.headers.set("Cache-Control", "private, max-age=0, no-store");
  return response;
}
