import { put, list, del, get } from "@vercel/blob";

const DEFAULT_BLOB_PREFIX = "ai-school-lessons/";
const memoryLessonOverrides = new Map<string, Record<string, unknown>>();
const canUseBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const allowInMemoryStorage =
  process.env.ALLOW_IN_MEMORY_LESSON_STORAGE === "true" || process.env.NODE_ENV === "test";
const blobAccess = process.env.BLOB_ACCESS === "private" ? "private" : "public";

function getBlobPrefix() {
  const configuredPrefix = process.env.AI_SCHOOL_BLOB_PREFIX?.trim();
  const prefix = configuredPrefix || DEFAULT_BLOB_PREFIX;
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

function getLessonPathname(id: string) {
  return `${getBlobPrefix()}${id}.json`;
}

function lessonIdFromPathname(pathname: string): string | null {
  const prefix = getBlobPrefix();
  if (!pathname.startsWith(prefix) || !pathname.endsWith(".json")) return null;
  const id = pathname.slice(prefix.length, -".json".length);
  return id || null;
}

function throwIfStorageUnavailable(operation: "저장" | "초기화") {
  throw new Error(
    `${operation}은(는) BLOB 저장소 토큰(BLOB_READ_WRITE_TOKEN)이 필요합니다. 운영에서 영구 저장은 필수입니다.`,
  );
}

export async function getLessonFromBlob(
  id: string
): Promise<Record<string, unknown> | null> {
  if (memoryLessonOverrides.has(id)) {
    return memoryLessonOverrides.get(id) ?? null;
  }

  if (!canUseBlobStorage) {
    return null;
  }
  try {
    const { blobs } = await list({ prefix: getLessonPathname(id), limit: 1 });
    if (blobs.length === 0) return null;
    const blob = await get(blobs[0].pathname, {
      access: blobAccess,
      useCache: false,
    });
    if (!blob || blob.statusCode !== 200) return null;
    return await new Response(blob.stream).json();
  } catch {
    return null;
  }
}

export async function saveLessonToBlob(
  id: string,
  data: Record<string, unknown>
): Promise<string> {
  if (!canUseBlobStorage) {
    if (!allowInMemoryStorage) {
      throwIfStorageUnavailable("저장");
    }
    memoryLessonOverrides.set(id, data);
    return "";
  }
  const blob = await put(
    getLessonPathname(id),
    JSON.stringify(data, null, 2),
    {
      access: blobAccess,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    }
  );
  return blob.url;
}

export async function deleteLessonFromBlob(id: string): Promise<void> {
  if (!canUseBlobStorage) {
    if (allowInMemoryStorage) {
      memoryLessonOverrides.delete(id);
      return;
    }
    throwIfStorageUnavailable("초기화");
  }

  memoryLessonOverrides.delete(id);
  const { blobs } = await list({ prefix: getLessonPathname(id) });
  for (const blob of blobs) {
    await del(blob.pathname);
  }
}

export async function listBlobOverrides(): Promise<string[]> {
  const memoryOverrides = allowInMemoryStorage ? Array.from(memoryLessonOverrides.keys()) : [];
  if (!canUseBlobStorage) {
    return memoryOverrides;
  }
  try {
    const { blobs } = await list({ prefix: getBlobPrefix() });
    const blobOverrides = blobs
      .map((blob) => lessonIdFromPathname(blob.pathname))
      .filter((id): id is string => id !== null);
    return [...new Set([...blobOverrides, ...memoryOverrides])];
  } catch {
    return memoryOverrides;
  }
}
