import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// 강의 평가(좋아요·도움됐어요·어려워요) 카운트를 Supabase에 저장한다.
// publishable(공개) 키로 접근하되, 쓰기는 increment_lesson_reaction RPC(security definer)로만 가능 —
// RLS가 직접 쓰기를 막으므로 키가 코드에 있어도 안전하다. (테이블/함수는 edu-lesson-reactions-setup.sql 참고)

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://ewxprzxlleyzxdemmkmb.supabase.co";
const SUPABASE_KEY = "sb_publishable_jvHA1YI-cEDwnBR79qmM0w_HRwfE6Vv";
const SITE = "ai-school";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const EMPTY = { like: 0, helpful: 0, difficult: 0 };

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
  const { data } = await supabase
    .from("lesson_reactions")
    .select("like_count, helpful_count, difficult_count")
    .eq("site", SITE)
    .eq("lesson_id", id)
    .maybeSingle();
  return NextResponse.json(shape(data));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { type } = await request.json();

  if (!["like", "helpful", "difficult"].includes(type)) {
    return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("increment_lesson_reaction", {
    p_site: SITE,
    p_lesson: id,
    p_type: type,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const row = Array.isArray(data) ? data[0] : data;
  return NextResponse.json(shape(row));
}
