import { put, list, del } from "@vercel/blob";

const BLOB_PREFIX = "ai-school-lessons/";

export async function getLessonFromBlob(
  id: string
): Promise<Record<string, unknown> | null> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${id}.json` });
    if (blobs.length === 0) return null;
    const response = await fetch(blobs[0].url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function saveLessonToBlob(
  id: string,
  data: Record<string, unknown>
): Promise<string> {
  const blob = await put(
    `${BLOB_PREFIX}${id}.json`,
    JSON.stringify(data, null, 2),
    { access: "public", contentType: "application/json", addRandomSuffix: false }
  );
  return blob.url;
}

export async function deleteLessonFromBlob(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${BLOB_PREFIX}${id}.json` });
  for (const blob of blobs) {
    await del(blob.url);
  }
}

export async function listBlobOverrides(): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    return blobs
      .map((blob) => {
        const match = blob.pathname.match(/^ai-school-lessons\/(.+)\.json$/);
        return match ? match[1] : null;
      })
      .filter((id): id is string => id !== null);
  } catch {
    return [];
  }
}
