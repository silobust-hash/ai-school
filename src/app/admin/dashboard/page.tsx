import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { lessons } from "@/data/lessons";
import { listBlobOverrides } from "@/lib/storage";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

// Course grouping matching the lessons page structure
const courseGroups = [
  { phase: 1, phaseTitle: "AI 입문 & 프롬프트엔지니어링", prefix: "1-" },
  { phase: 2, phaseTitle: "컨텍스트엔지니어링", prefix: "2-" },
  { phase: 3, phaseTitle: "하네스엔지니어링 & 바이브코딩", prefix: "3-" },
  { phase: 4, phaseTitle: "에이전트엔지니어링", prefix: "4-" },
  { phase: 5, phaseTitle: "개발 기초 교양", prefix: "5-" },
];

export default async function DashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  let overrides: string[] = [];
  try {
    overrides = await listBlobOverrides();
  } catch {
    // Blob storage might not be configured yet
  }

  const overrideSet = new Set(overrides);

  const groupedLessons = courseGroups.map((group) => {
    const groupLessons = Object.entries(lessons)
      .filter(([id]) => id.startsWith(group.prefix))
      .sort(([a], [b]) => {
        const numA = parseInt(a.split("-")[1]);
        const numB = parseInt(b.split("-")[1]);
        return numA - numB;
      })
      .map(([id, lesson]) => ({
        id,
        title: (lesson as { title: string }).title,
        hasOverride: overrideSet.has(id),
      }));

    return {
      ...group,
      lessons: groupLessons,
    };
  }).filter((group) => group.lessons.length > 0);

  const totalLessons = Object.keys(lessons).length;
  const totalOverrides = overrides.length;

  return (
    <DashboardClient
      groupedLessons={groupedLessons}
      totalLessons={totalLessons}
      totalOverrides={totalOverrides}
    />
  );
}
