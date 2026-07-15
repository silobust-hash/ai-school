import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { lessons } from "@/data/lessons";
import { listBlobOverrides } from "@/lib/storage";
import { getTodayAccessCode } from "@/lib/lesson-access";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

const PHASE_TITLES: Record<number, string> = {
  1: "AI 입문 & 프롬프트엔지니어링",
  2: "컨텍스트엔지니어링",
  3: "하네스엔지니어링 & 바이브코딩",
  4: "에이전트엔지니어링",
  5: "개발 기초 교양",
  6: "2026, AI 엔지니어링의 현재",
};

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

  const groupedLessons = Object.entries(lessons)
    .reduce<Record<number, { id: string; title: string; hasOverride: boolean }[]>>((acc, [id, lesson]) => {
      const phase = Number.parseInt(String((lesson as { phase: string }).phase).replace("과", ""));
      if (!acc[phase]) acc[phase] = [];
      acc[phase].push({
        id,
        title: (lesson as { title: string }).title,
        hasOverride: overrideSet.has(id),
      });
      return acc;
    }, {});

  const groupedLessonList = Object.keys(groupedLessons)
    .map((phase) => Number.parseInt(phase, 10))
    .sort((a, b) => a - b)
    .map((phase) => {
      const lessonsInPhase = groupedLessons[phase].sort((a, b) => {
        const aOrder = Number.parseInt(a.id.split("-")[1], 10);
        const bOrder = Number.parseInt(b.id.split("-")[1], 10);
        return aOrder - bOrder;
      });

      return {
        phase,
        phaseTitle: PHASE_TITLES[phase] || `${phase}과`,
        lessons: lessonsInPhase,
      };
    });

  const totalLessons = Object.keys(lessons).length;
  const totalOverrides = overrides.length;
  const todayAccess = getTodayAccessCode();

  return (
    <DashboardClient
      groupedLessons={groupedLessonList}
      totalLessons={totalLessons}
      totalOverrides={totalOverrides}
      accessCode={todayAccess.code}
      accessCodeDateCode={todayAccess.dateCode}
      accessCodeExpiresAt={todayAccess.expiresAt}
    />
  );
}
