import type { Metadata } from "next";
import { COURSE_ID, SITE_URL, WEBSITE_ID } from "@/lib/site";
import { lessons } from "@/data/lessons";
import { toSafeJsonLd } from "@/lib/jsonld";
import LessonProgressPanel from "@/components/LessonProgressPanel";

const LESSONS_URL = `${SITE_URL}/lessons`;
const totalLessons = Object.keys(lessons).length;
const DESCRIPTION =
  `AI업무학교 6과 ${totalLessons}개 강의 목록. 프롬프트엔지니어링부터 하네스·에이전트엔지니어링까지 비개발자를 위한 AI 업무 활용 강의를 순서대로 학습합니다.`;
const lessonCatalog = Object.keys(lessons)
  .sort((a, b) => a.localeCompare(b))
  .map((id) => ({
    id,
    title: lessons[id].title,
  }));

export const metadata: Metadata = {
  title: "강의 목록",
  description: DESCRIPTION,
  alternates: { canonical: "/lessons" },
  openGraph: {
    type: "website",
    title: "강의 목록 | AI업무학교",
    description: DESCRIPTION,
    url: LESSONS_URL,
    siteName: "AI업무학교",
  },
  twitter: {
    card: "summary_large_image",
    title: "강의 목록 | AI업무학교",
    description: DESCRIPTION,
  },
};

const allLessons = [
  {
    course: 1,
    courseTitle: "AI 입문 & 프롬프트엔지니어링",
    lessons: [
      { id: "1-1", title: "AI가 바꾸는 일하는 방식" },
      { id: "1-2", title: "ChatGPT vs Claude vs Gemini — 어떤 AI를 쓸까?" },
      { id: "1-3", title: "좋은 프롬프트의 조건" },
      { id: "1-4", title: "업무별 프롬프트 템플릿" },
      { id: "1-5", title: "AI와 대화하는 기술" },
      { id: "1-6", title: "실습: 나만의 업무 프롬프트 만들기" },
    ],
  },
  {
    course: 2,
    courseTitle: "컨텍스트엔지니어링",
    lessons: [
      { id: "2-1", title: "컨텍스트가 전부다" },
      { id: "2-2", title: "긴 문서 다루기" },
      { id: "2-3", title: "시스템 프롬프트와 커스텀 지침" },
      { id: "2-4", title: "나만의 AI 비서 만들기" },
      { id: "2-5", title: "RAG와 지식 연결" },
    ],
  },
  {
    course: 3,
    courseTitle: "하네스엔지니어링 & 바이브코딩",
    lessons: [
      { id: "3-1", title: "하네스엔지니어링이란" },
      { id: "3-2", title: "터미널과 친해지기" },
      { id: "3-3", title: "Git과 GitHub 기초" },
      { id: "3-4", title: "Claude Code 설치하기" },
      { id: "3-5", title: "바이브코딩으로 웹사이트 만들기" },
      { id: "3-6", title: "Vercel로 세상에 공개하기" },
    ],
  },
  {
    course: 4,
    courseTitle: "에이전트엔지니어링",
    lessons: [
      { id: "4-1", title: "AI 에이전트란 무엇인가" },
      { id: "4-2", title: "MCP로 AI 능력 확장하기" },
      { id: "4-3", title: "Skills과 Plugins" },
      { id: "4-4", title: "자동화 워크플로우 설계" },
      { id: "4-5", title: "멀티에이전트와 미래" },
    ],
  },
  {
    course: 5,
    courseTitle: "개발 기초 교양",
    lessons: [
      { id: "5-1", title: "프론트엔드와 백엔드" },
      { id: "5-2", title: "API란 무엇인가" },
      { id: "5-3", title: "데이터베이스 기초" },
      { id: "5-4", title: "클라우드와 서버" },
      { id: "5-5", title: "더 깊이 배우기" },
    ],
  },
  {
    course: 6,
    courseTitle: "2026, AI 엔지니어링의 현재",
    lessons: [
      { id: "6-1", title: "프롬프트에서 루프까지: 5단 진화" },
      { id: "6-2", title: "2026 최신 모델·제품 지도: Fable 5 · GPT-5.6" },
      { id: "6-3", title: "하네스 엔지니어링 실전: 에이전트 환경 설계하기" },
      { id: "6-4", title: "다이나믹 워크플로우와 울트라코드: 자율 다단계 실행" },
      { id: "6-5", title: "제2의 두뇌: 옵시디언 + CLI 시대의 지식관리" },
      { id: "6-6", title: "모바일 에이전트: 코덱스 앱과 어디서나 AI" },
      { id: "6-7", title: "오픈소스 오케스트레이션 생태계 — 내 손으로 AI 팀 꾸리기" },
      { id: "6-8", title: "마켓플레이스로 내 AI 도구 관리하기 — 클론·풀·푸시 쉽게 이해" },
      { id: "6-9", title: "Claude Fable 5 — 장기작업 최상위 모델의 등장" },
      { id: "6-10", title: "루프엔지니어링 — 프롬프트를 짜는 사람에서 루프를 설계하는 사람으로" },
      { id: "6-11", title: "에이전트 엔지니어링 — AI에게 일을 통째로 맡기기" },
      { id: "6-12", title: "2026 최신 AI 기능 총정리 — 직장인이 꼭 알아야 할 것들" },
      { id: "6-13", title: "얼리어답터의 무기 — AI 시대 마인드셋과 생존전략" },
      { id: "6-14", title: "만류귀종 — 돌고 돌아 다시 페르소나" },
      { id: "6-15", title: "Chat·Work·Codex·Sites, 어디에서 무엇을 할까?" },
      { id: "6-16", title: "코덱스는 채팅창이 아니라 실행형 업무 운영체계다" },
      { id: "6-19", title: "클로드 코워크 10분 첫 성공 — 샌드박스 폴더로 안전하게 시작하기" },
      { id: "6-17", title: "판단력과 도구의 증폭: AI·영상으로 설명력을 높이는 법" },
      { id: "6-18", title: "AI 실시간 통역, 외국인 노동상담에서 어디까지 맡길까?" },
      { id: "6-20", title: "화면 녹화로 반복 업무를 스킬로 바꾸기 — Record and Replay 실전" },
      { id: "6-21", title: "네이버 AI탭 시대, 전문직 콘텐츠는 어떻게 작성해야 하나" },
      { id: "6-22", title: "AI를 기다리지 말고 지휘하기 — Orca IDE와 병렬 에이전트" },
    ],
  },
];

const lessonItems = allLessons.flatMap((group) => group.lessons);

const lessonsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${LESSONS_URL}#webpage`,
      url: LESSONS_URL,
      name: "AI업무학교 강의 목록",
      description: DESCRIPTION,
      inLanguage: "ko-KR",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": COURSE_ID },
      mainEntity: { "@id": `${LESSONS_URL}#item-list` },
    },
    {
      "@type": "ItemList",
      "@id": `${LESSONS_URL}#item-list`,
      name: `AI업무학교 6과 ${totalLessons}개 강의`,
      numberOfItems: lessonItems.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: lessonItems.map((lesson, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: lesson.title,
        url: `${LESSONS_URL}/${lesson.id}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${LESSONS_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "강의 목록", item: LESSONS_URL },
      ],
    },
  ],
};

export default function LessonsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(lessonsJsonLd) }}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">강의 목록</h1>
        <p className="text-slate-500 text-lg break-words">
          순서대로 따라가세요. 각 강의는 독립적이지만, 앞 단계를 먼저 보시면 더 잘 이해됩니다.
        </p>
      </div>

      <LessonProgressPanel lessonCatalog={lessonCatalog} totalLessons={totalLessons} />

      <div className="space-y-10">
        {allLessons.map((group) => (
          <div key={group.course}>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-xs font-bold text-teal-500 bg-teal-50 px-2.5 py-1 rounded-full">
                {group.course}과
              </span>
              {group.courseTitle}
            </h2>
            <div className="space-y-2">
              {group.lessons.map((lesson) => (
                <a
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="flex min-w-0 items-center gap-4 p-4 rounded-xl border transition-all bg-white border-slate-200 hover:border-teal-300 hover:shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-teal-100 text-teal-600">
                    {lesson.id}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block break-words font-medium text-slate-700">{lesson.title}</span>
                  </div>
                  <span className="hidden shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 sm:inline-flex">
                    수강 가능
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100 text-center">
        <h3 className="text-lg font-bold mb-2">전체 6과, {totalLessons}개 강의</h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          1과부터 순서대로 따라가시면 됩니다.
          <br />
          코딩 경험이 전혀 없어도 괜찮습니다. 함께 가봅시다!
        </p>
      </div>
    </div>
  );
}
