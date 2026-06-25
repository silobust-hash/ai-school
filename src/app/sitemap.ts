import type { MetadataRoute } from "next";
import { lessons } from "@/data/lessons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-school.silronomu.com";

// Meaningful freshness anchors instead of build-time `new Date()`.
const SITE_LAUNCH_DATE = "2026-04-02";
// Most recent content update (6과 39강 — Fable 5 · 루프엔지니어링 추가).
const LAST_CONTENT_UPDATE = "2026-06-25";

export default function sitemap(): MetadataRoute.Sitemap {
  const lessonEntries = Object.keys(lessons).map((id) => {
    const lesson = lessons[id];
    return {
      url: `${SITE_URL}/lessons/${id}`,
      lastModified: lesson.dateModified ?? lesson.datePublished ?? SITE_LAUNCH_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [
    { url: SITE_URL, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/curriculum`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/lessons`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.6 },
    ...lessonEntries,
  ];
}
