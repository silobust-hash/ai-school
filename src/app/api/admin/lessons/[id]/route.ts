import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { lessons } from "@/data/lessons";
import {
  getLessonFromBlob,
  saveLessonToBlob,
  deleteLessonFromBlob,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Try blob first
    const blobData = await getLessonFromBlob(id);
    if (blobData) {
      return NextResponse.json({
        lesson: blobData,
        source: "blob",
      });
    }

    // Fall back to static
    const staticData = lessons[id];
    if (!staticData) {
      return NextResponse.json(
        { error: "강의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      lesson: staticData,
      source: "static",
    });
  } catch (error) {
    console.error("강의 조회 오류:", error);
    return NextResponse.json(
      { error: "강의를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.summary || !data.sections) {
      return NextResponse.json(
        { error: "제목, 요약, 섹션은 필수 항목입니다." },
        { status: 400 }
      );
    }

    // Ensure the id field matches
    data.id = id;

    // Preserve prev/next from static data if not provided
    const staticData = lessons[id];
    if (staticData) {
      if (data.prev === undefined) data.prev = staticData.prev;
      if (data.next === undefined) data.next = staticData.next;
      if (data.phase === undefined) data.phase = staticData.phase;
    }

    const url = await saveLessonToBlob(id, data);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("강의 저장 오류:", error);
    return NextResponse.json(
      { error: "강의를 저장하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteLessonFromBlob(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("강의 초기화 오류:", error);
    return NextResponse.json(
      { error: "강의를 초기화하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
