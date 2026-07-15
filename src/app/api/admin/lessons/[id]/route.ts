import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { lessons } from "@/data/lessons";
import {
  getLessonFromBlob,
  saveLessonToBlob,
  deleteLessonFromBlob,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

const ALLOWED_KEYS = new Set([
  "id",
  "phase",
  "title",
  "summary",
  "datePublished",
  "dateModified",
  "prev",
  "next",
  "sections",
  "insights",
  "keyTakeaways",
  "faq",
  "relatedLinks",
]);

function isSection(value: unknown): value is { heading: string; content: string; code?: string; tip?: string } {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.heading === "string" &&
    typeof candidate.content === "string" &&
    (candidate.code === undefined || typeof candidate.code === "string") &&
    (candidate.tip === undefined || typeof candidate.tip === "string")
  );
}

function isLessonPayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const payload = value as Record<string, unknown>;
  const keys = Object.keys(payload);
  if (keys.some((key) => !ALLOWED_KEYS.has(key))) return false;

  if (typeof payload.title !== "string" || typeof payload.summary !== "string") return false;

  if (!Array.isArray(payload.sections) || payload.sections.length === 0) return false;
  if (!payload.sections.every(isSection)) return false;

  if (payload.keyTakeaways !== undefined && !Array.isArray(payload.keyTakeaways)) return false;
  if (payload.keyTakeaways && payload.keyTakeaways.some((item) => typeof item !== "string")) return false;

  if (payload.faq !== undefined) {
    if (!Array.isArray(payload.faq)) return false;
    for (const faq of payload.faq) {
      if (
        !faq ||
        typeof faq !== "object" ||
        typeof (faq as { question: unknown }).question !== "string" ||
        typeof (faq as { answer: unknown }).answer !== "string"
      ) {
        return false;
      }
    }
  }

  if (payload.insights !== undefined) {
    if (!Array.isArray(payload.insights)) return false;
    for (const item of payload.insights) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof (item as { heading: unknown }).heading !== "string" ||
        typeof (item as { content: unknown }).content !== "string" ||
        typeof (item as { source: unknown }).source !== "string"
      ) {
        return false;
      }
    }
  }

  if (payload.relatedLinks !== undefined) {
    if (!Array.isArray(payload.relatedLinks)) return false;
    for (const item of payload.relatedLinks) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof (item as { label: unknown }).label !== "string" ||
        typeof (item as { url: unknown }).url !== "string"
      ) {
        return false;
      }
    }
  }

  return true;
}

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
    const blobData = await getLessonFromBlob(id);
    if (blobData) {
      return NextResponse.json({
        lesson: blobData,
        source: "blob",
      });
    }

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
  const staticData = lessons[id];
  if (!staticData) {
    return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const body = await request.json();
    if (!isLessonPayload(body)) {
      return NextResponse.json(
        { error: "요청 형식이 유효하지 않습니다." },
        { status: 400 }
      );
    }

    if (body.id !== undefined && body.id !== id) {
      return NextResponse.json({ error: "요청한 ID와 일치하지 않습니다." }, { status: 400 });
    }

    const payload = {
      ...staticData,
      ...body,
      id,
      dateModified: new Date().toISOString().slice(0, 10),
      sections: body.sections,
      title: body.title,
      summary: body.summary,
      phase: body.phase || staticData.phase,
      prev: body.prev ?? staticData.prev,
      next: body.next ?? staticData.next,
      keyTakeaways: body.keyTakeaways ?? staticData.keyTakeaways,
      faq: body.faq ?? staticData.faq,
      insights: body.insights ?? staticData.insights,
      relatedLinks: body.relatedLinks ?? staticData.relatedLinks,
      datePublished: body.datePublished ?? staticData.datePublished,
    };

    const url = await saveLessonToBlob(id, payload);
    return NextResponse.json({ success: true, url });
  } catch {
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

  if (!lessons[id]) {
    return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    await deleteLessonFromBlob(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "강의를 초기화하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
