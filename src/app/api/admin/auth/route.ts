import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_HASH_COOKIE,
  login,
  logout,
} from "@/lib/auth";

const MAX_FAILURES = 5;
const FAILURE_WINDOW_MS = 10 * 60 * 1000;

type FailureWindow = {
  failures: number;
  windowStart: number;
};

const failureMap = new Map<string, FailureWindow>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function shouldRateLimit(ip: string, now = Date.now()): {
  retryAfterSeconds: number | null;
  allowed: boolean;
} {
  const window = failureMap.get(ip);
  if (!window) {
    return { allowed: true, retryAfterSeconds: null };
  }

  if (now - window.windowStart >= FAILURE_WINDOW_MS) {
    failureMap.delete(ip);
    return { allowed: true, retryAfterSeconds: null };
  }

  if (window.failures < MAX_FAILURES) {
    return { allowed: true, retryAfterSeconds: null };
  }

  const retryAfterMs = FAILURE_WINDOW_MS - (now - window.windowStart);
  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
  };
}

function recordFailure(ip: string, now = Date.now()) {
  const window = failureMap.get(ip);

  if (!window || now - window.windowStart >= FAILURE_WINDOW_MS) {
    failureMap.set(ip, { failures: 1, windowStart: now });
    return;
  }

  window.failures += 1;
}

function clearFailures(ip: string) {
  failureMap.delete(ip);
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.set({ name: ADMIN_SESSION_COOKIE, value: "", maxAge: 0, path: "/" });
  response.cookies.set({
    name: ADMIN_SESSION_HASH_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
}

function makeNoStoreJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { ...init, headers });
}

function makeUnauthorized(message: string, init: ResponseInit = {}) {
  const response = makeNoStoreJson({ error: message }, init);
  clearSessionCookies(response);
  return response;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const now = Date.now();

  const rateLimit = shouldRateLimit(ip, now);
  if (!rateLimit.allowed) {
    const response = makeNoStoreJson(
      { error: "요청이 너무 빈번합니다. 잠시 후 다시 시도하세요." },
      { status: 429 },
    );
    clearSessionCookies(response);
    response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
    return response;
  }

  try {
    const { password } = await request.json();

    if (typeof password !== "string" || password.length === 0 || password.length > 256) {
      recordFailure(ip, now);
      return makeUnauthorized("요청 형식이 유효하지 않습니다.", { status: 400 });
    }

    if (!password) {
      recordFailure(ip, now);
      return makeUnauthorized("비밀번호를 입력해주세요.", { status: 400 });
    }

    const success = await login(password);

    if (!success) {
      recordFailure(ip, now);
      return makeUnauthorized("비밀번호가 올바르지 않습니다.", { status: 401 });
    }

    clearFailures(ip);
    return makeNoStoreJson({ success: true });
  } catch {
    recordFailure(ip, now);
    return makeUnauthorized("로그인 처리 중 오류가 발생했습니다.", { status: 500 });
  }
}

export async function DELETE() {
  try {
    await logout();
    const response = makeNoStoreJson({ success: true });
    clearSessionCookies(response);
    return response;
  } catch {
    return makeUnauthorized("로그아웃 처리 중 오류가 발생했습니다.", { status: 500 });
  }
}
