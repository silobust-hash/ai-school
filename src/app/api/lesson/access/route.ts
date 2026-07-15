import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimitForClient,
  incrementFailForClient,
  isLessonAccessCodeValid,
  issueLessonAccessCookie,
  setNoCache,
} from "@/lib/lesson-access";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = forwardedFor || request.headers.get("x-real-ip") || "unknown";

  const quota = checkRateLimitForClient(clientIp);
  if (!quota.ok) {
    return setNoCache(
      NextResponse.json(
        { error: "요청이 너무 많습니다.", retryAfter: quota.retryAfter },
        { status: 429 },
      ),
    );
  }

  try {
    const { code } = await request.json();
    if (typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
      incrementFailForClient(clientIp);
      return setNoCache(NextResponse.json({ error: "6자리 숫자 코드를 입력해주세요." }, { status: 400 }));
    }

    const isValid = isLessonAccessCodeValid(code.trim());
    if (!isValid) {
      incrementFailForClient(clientIp);
      return setNoCache(
        NextResponse.json(
          { error: "코드가 일치하지 않습니다. 강사에게 오늘의 코드를 확인하세요." },
          { status: 401 },
        ),
      );
    }

    await issueLessonAccessCookie();
    return setNoCache(
      NextResponse.json(
        { success: true },
        { status: 200 },
      ),
    );
  } catch {
    incrementFailForClient(clientIp);
    return setNoCache(
      NextResponse.json(
        { error: "인증 처리 중 오류가 발생했습니다." },
        { status: 500 },
      ),
    );
  }
}

export async function GET() {
  return setNoCache(NextResponse.json({ error: "POST only" }, { status: 405 }));
}
