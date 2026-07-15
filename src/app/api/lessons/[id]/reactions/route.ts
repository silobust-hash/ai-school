import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { lessons } from "@/data/lessons";

// 강의 평가(좋아요·도움됐어요·어려워요) 카운트를 Supabase에 저장한다.
// publishable(공개) 키로 접근하되, 쓰기는 increment_lesson_reaction RPC(security definer)로만 가능 —
// RLS가 직접 쓰기를 막으므로 키가 코드에 있어도 안전하다. (테이블/함수는 edu-lesson-reactions-setup.sql 참고)

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://ewxprzxlleyzxdemmkmb.supabase.co";
const SUPABASE_KEY = "sb_publishable_jvHA1YI-cEDwnBR79qmM0w_HRwfE6Vv";
const SITE = "ai-school";
const REACTION_TYPES = new Set(["like", "helpful", "difficult"]);
const MAX_POST_FAILURES = 10;
const POST_WINDOW_MS = 60_000;

type ReactionBucket = {
  count: number;
  resetAt: number;
};

const postBuckets = new Map<string, ReactionBucket>();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const EMPTY = { like: 0, helpful: 0, difficult: 0 };

function getLessonIdKey(id: string) {
  return id in lessons;
}

function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return headers.get("x-real-ip") || "unknown";
}

function checkPostRateLimit(key: string, now = Date.now()) {
  const bucket = postBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    postBuckets.set(key, { count: 0, resetAt: now + POST_WINDOW_MS });
    return { ok: true };
  }

  if (bucket.count >= MAX_POST_FAILURES) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { ok: true };
}

function incPostAttempt(key: string, now = Date.now()) {
  const bucket = postBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    postBuckets.set(key, { count: 1, resetAt: now + POST_WINDOW_MS });
    return;
  }

  bucket.count += 1;
  postBuckets.set(key, bucket);
}

function jsonNoStore(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { ...init, headers });
}

function buildRateLimitResponse(message: string, retryAfter: number) {
  return jsonNoStore(
    { error: message },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

function buildErrorResponse(message: string, status: number) {
  return jsonNoStore({ error: message }, { status });
}

function shape(
  row: { like_count: number; helpful_count: number; difficult_count: number } | null
) {
  if (!row) return EMPTY;
  return { like: row.like_count, helpful: row.helpful_count, difficult: row.difficult_count };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getLessonIdKey(id)) {
    return buildErrorResponse("유효하지 않은 강의 ID입니다.", 400);
  }

  try {
    const { data, error } = await supabase
      .from("lesson_reactions")
      .select("like_count, helpful_count, difficult_count")
      .eq("site", SITE)
      .eq("lesson_id", id)
      .maybeSingle();

    if (error) {
      console.error("[lesson-reactions] fetch error", error);
      return buildErrorResponse("반응 조회에 실패했습니다.", 502);
    }

    if (!data) {
      return jsonNoStore(shape(null));
    }

    return jsonNoStore(shape(data));
  } catch (error) {
    console.error("[lesson-reactions] failed to fetch reaction", error);
    return buildErrorResponse("반응 조회에 실패했습니다.", 502);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getLessonIdKey(id)) {
    return buildErrorResponse("유효하지 않은 강의 ID입니다.", 400);
  }

  const ip = getClientIp(request);
  const key = `${ip}:${id}`;
  const rateLimit = checkPostRateLimit(key);
  if (!rateLimit.ok) {
    return buildRateLimitResponse(
      "요청이 과도합니다. 잠시 후 다시 시도하세요.",
      rateLimit.retryAfter ?? 1,
    );
  }
  incPostAttempt(key);

  let body: { type?: string };
  try {
    body = await request.json();
  } catch {
    return buildErrorResponse("요청 형식이 올바르지 않습니다.", 400);
  }

  const type = body.type;

  if (typeof type !== "string" || !REACTION_TYPES.has(type)) {
    return buildErrorResponse("유효하지 않은 반응 타입입니다.", 400);
  }

  try {
    const { data, error } = await supabase.rpc("increment_lesson_reaction", {
      p_site: SITE,
      p_lesson: id,
      p_type: type,
    });

    if (error) {
      console.error("[lesson-reactions] rpc error", error);
      return buildErrorResponse("반응 반영에 실패했습니다.", 500);
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      return buildErrorResponse("반응 반영 결과가 없습니다.", 502);
    }

    return jsonNoStore(shape(row));
  } catch (error) {
    console.error("[lesson-reactions] reaction request failed", error);
    return buildErrorResponse("반응 반영 중 오류가 발생했습니다.", 500);
  }
}
