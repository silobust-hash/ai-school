import { lessons } from "@/data/lessons";
import {
  OFFICIAL_FIRM_MEMBERS_URL,
  OFFICIAL_FIRM_URL,
  PERSON_ID,
  PERSON_DAANGN_LOCAL_PROFILE_LABEL,
  PERSON_DAANGN_LOCAL_PROFILE_PURPOSE,
  PERSON_DAANGN_LOCAL_PROFILE_URL,
  PERSON_INDUSTRIAL_SAFETY_BLOG_LABEL,
  PERSON_INDUSTRIAL_SAFETY_BLOG_URL,
  PERSON_SAFETY_SITE_LABEL,
  PERSON_SAFETY_SITE_URL,
  SITE_URL,
} from "@/lib/site";

// Stable lesson ordering: by course number, then by lesson number ("1-1" < "1-2" < "2-1").
function lessonSort(a: string, b: string): number {
  const [ac, al] = a.split("-").map((n) => parseInt(n, 10));
  const [bc, bl] = b.split("-").map((n) => parseInt(n, 10));
  return ac - bc || al - bl;
}

function escapeLinkLabel(label: string): string {
  return label.replace(/[\[\]]/g, "\\$&");
}

export function GET(): Response {
  const ids = Object.keys(lessons).sort(lessonSort);

  const lessonLines = ids
    .map(
      (id) =>
        `- [${id}. ${escapeLinkLabel(lessons[id].title)}](${SITE_URL}/lessons/${id})`,
    )
    .join("\n");

  const body = `# AI업무학교

> 박실로 공인노무사가 현업 적용과 검증 기준을 중심으로 정리한 비개발자용 AI 업무 활용 학습 사이트입니다. 프롬프트엔지니어링부터 하네스·에이전트엔지니어링까지 6과 ${ids.length}개 강의로 구성됩니다.

## 공식 페이지
- [AI업무학교 홈](${SITE_URL}/): 과정 소개와 핵심 학습 목표
- [전체 커리큘럼](${SITE_URL}/curriculum): 6과 ${ids.length}개 강의의 순서와 구성
- [강의 목록](${SITE_URL}/lessons): 모든 개별 강의 링크
- [교육 운영 안내](${SITE_URL}/about): 교육 방향, 운영 기준, 운영자 정보

## 강사와 운영 주체
- [박실로 공식 홈페이지](https://silronomu.com/): 공인노무사, AI 실무 교육 콘텐츠 운영
- [박실로 canonical Person ID](${PERSON_ID}): [AI업무학교](${SITE_URL})와 [Claude Code 실무 과정](https://edu.silronomu.com)의 동일 강사·운영자 식별자
- [AI노무사 박실로 기준](https://silronomu.com/hub/ai-nomusa.html): AI 노동문서 검증, 노무실무 자동화와 공인노무사 최종 책임 원칙
- [박실로 Threads](https://www.threads.com/@silrobag): AI 활용과 업무 혁신 관련 공개 글
- [한동노무법인 공식 사이트](${OFFICIAL_FIRM_URL}/): AI업무학교의 공식 소속 법인
- [한동노무법인 구성원 · 박실로 노무사](${OFFICIAL_FIRM_MEMBERS_URL}): 박실로 노무사의 법인 구성원 정보
- [${PERSON_INDUSTRIAL_SAFETY_BLOG_LABEL}](${PERSON_INDUSTRIAL_SAFETY_BLOG_URL}): 산재·산업안전 실무 콘텐츠
- [${PERSON_SAFETY_SITE_LABEL}](${PERSON_SAFETY_SITE_URL}): 박실로 노무사의 산업안전 실무 안내
- [${PERSON_DAANGN_LOCAL_PROFILE_LABEL}](${PERSON_DAANGN_LOCAL_PROFILE_URL}): ${PERSON_DAANGN_LOCAL_PROFILE_PURPOSE}

## 강의 (6과 ${ids.length}강)
${lessonLines}

## 이용 정보
- 기본 언어: 한국어 (ko-KR)
- 공개 범위: 검색 가능한 강의 소개와 교재, 일부 강의 자료는 화면의 접근 절차를 거쳐 제공
- 사이트맵: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Language": "ko-KR",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
