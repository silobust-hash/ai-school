import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { lessons } from "@/data/lessons";
import { getLessonFromBlob, listBlobOverrides } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const overrides = await listBlobOverrides();
    const overrideSet = new Set(overrides);

    const mergedLessons: Record<string, unknown> = {};

    for (const [id, staticData] of Object.entries(lessons)) {
      if (overrideSet.has(id)) {
        const blobData = await getLessonFromBlob(id);
        mergedLessons[id] = {
          ...(blobData || staticData),
          _source: "blob",
        };
      } else {
        mergedLessons[id] = {
          ...staticData,
          _source: "static",
        };
      }
    }

    return NextResponse.json({ lessons: mergedLessons, overrides });
  } catch (error) {
    console.error("강의 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "강의 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
