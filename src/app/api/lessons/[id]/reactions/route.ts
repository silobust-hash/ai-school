import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

const REACTIONS_PREFIX = "reactions/";

interface Reactions {
  like: number;
  helpful: number;
  difficult: number;
}

async function getReactions(lessonId: string): Promise<Reactions> {
  try {
    const { blobs } = await list({ prefix: `${REACTIONS_PREFIX}${lessonId}.json` });
    if (blobs.length === 0) return { like: 0, helpful: 0, difficult: 0 };
    const response = await fetch(blobs[0].url, { cache: "no-store" });
    if (!response.ok) return { like: 0, helpful: 0, difficult: 0 };
    return await response.json();
  } catch {
    return { like: 0, helpful: 0, difficult: 0 };
  }
}

async function saveReactions(lessonId: string, reactions: Reactions): Promise<void> {
  await put(
    `${REACTIONS_PREFIX}${lessonId}.json`,
    JSON.stringify(reactions),
    { access: "public", contentType: "application/json", addRandomSuffix: false }
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reactions = await getReactions(id);
  return NextResponse.json(reactions);
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

  const reactions = await getReactions(id);
  reactions[type as keyof Reactions] += 1;
  await saveReactions(id, reactions);

  return NextResponse.json(reactions);
}
