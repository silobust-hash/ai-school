import { lessons } from "@/data/lessons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-school.silronomu.com";

// Stable lesson ordering: by course number, then by lesson number ("1-1" < "1-2" < "2-1").
function lessonSort(a: string, b: string): number {
  const [ac, al] = a.split("-").map((n) => parseInt(n, 10));
  const [bc, bl] = b.split("-").map((n) => parseInt(n, 10));
  return ac - bc || al - bl;
}

export function GET(): Response {
  const ids = Object.keys(lessons).sort(lessonSort);

  const lessonLines = ids
    .map((id) => `- ${lessons[id].title}: ${SITE_URL}/lessons/${id}`)
    .join("\n");

  const body = `# AI업무학교 (AI Work School)

> 박실로(19년차 공인노무사·한동노무법인 대표)가 비개발자 눈높이로 직접 만든 AI 활용 학습 로드맵. 프롬프트엔지니어링부터 하네스·에이전트엔지니어링까지 6과 ${ids.length}개 강의로 구성된 무료 교재형 사이트.

## 강사
- 박실로 (공인노무사·AI 교육자): https://silronomu.com
- Threads: https://www.threads.com/@silrobag

## 커리큘럼
- 전체 커리큘럼: ${SITE_URL}/curriculum
- 강의 목록: ${SITE_URL}/lessons

## 강의 (6과 ${ids.length}강)
${lessonLines}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
