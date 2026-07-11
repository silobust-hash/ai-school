import type { MetadataRoute } from "next";
import { lessons } from "@/data/lessons";
import { SITE_URL } from "@/lib/site";

// Meaningful freshness anchors instead of build-time `new Date()`.
const SITE_LAUNCH_DATE = "2026-04-02";
// Most recent site structure or content update.
const LAST_CONTENT_UPDATE = "2026-07-11";

export default function sitemap(): MetadataRoute.Sitemap {
  const lessonEntries = Object.keys(lessons).map((id) => {
    const lesson = lessons[id];
    return {
      url: `${SITE_URL}/lessons/${id}`,
      // The shared lesson template and structured data changed on this date.
      lastModified: [
        lesson.dateModified ?? lesson.datePublished ?? SITE_LAUNCH_DATE,
        LAST_CONTENT_UPDATE,
      ].sort().at(-1),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [
    { url: SITE_URL, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/curriculum`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/lessons`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.6 },
    ...lessonEntries,
  ];
}
