import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커리큘럼 | AI업무학교",
  description:
    "5과 27개 강의로 구성된 AI업무학교 전체 커리큘럼. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 비개발자를 위한 AI 활용 완전 정복 로드맵.",
  alternates: { canonical: "/curriculum" },
};

const courses = [
  {
    phase: "1과",
    title: "AI 입문 & 프롬프트엔지니어링",
    description:
      "AI 시대를 이해하고, AI에게 원하는 결과를 정확히 얻는 프롬프트 작성 기술을 배웁니다.",
    gradient: "from-amber-400 to-orange-500",
    badgeColor: "bg-amber-100 text-amber-700",
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
    phase: "2과",
    title: "컨텍스트엔지니어링",
    description:
      "AI에게 올바른 맥락을 제공하여 더 정확하고 유용한 결과를 얻는 방법을 배웁니다.",
    gradient: "from-sky-400 to-blue-500",
    badgeColor: "bg-sky-100 text-sky-700",
    lessons: [
      { id: "2-1", title: "컨텍스트가 전부다" },
      { id: "2-2", title: "긴 문서 다루기" },
      { id: "2-3", title: "시스템 프롬프트와 커스텀 지침" },
      { id: "2-4", title: "나만의 AI 비서 만들기" },
      { id: "2-5", title: "RAG와 지식 연결" },
    ],
  },
  {
    phase: "3과",
    title: "하네스엔지니어링 & 바이브코딩",
    description:
      "AI를 도구로 제어하고, 코딩 없이 대화로 웹사이트를 만들어 배포하는 방법을 배웁니다.",
    gradient: "from-emerald-400 to-teal-500",
    badgeColor: "bg-emerald-100 text-emerald-700",
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
    phase: "4과",
    title: "에이전트엔지니어링",
    description:
      "AI 에이전트를 이해하고, MCP, 스킬, 플러그인으로 자동화 워크플로우를 구축합니다.",
    gradient: "from-violet-400 to-purple-500",
    badgeColor: "bg-violet-100 text-violet-700",
    lessons: [
      { id: "4-1", title: "AI 에이전트란 무엇인가" },
      { id: "4-2", title: "MCP로 AI 능력 확장하기" },
      { id: "4-3", title: "Skills과 Plugins" },
      { id: "4-4", title: "자동화 워크플로우 설계" },
      { id: "4-5", title: "멀티에이전트와 미래" },
    ],
  },
  {
    phase: "5과",
    title: "개발 기초 교양",
    description:
      "개발 세계의 핵심 개념을 이해하여 AI와 더 효과적으로 소통합니다.",
    gradient: "from-rose-400 to-pink-500",
    badgeColor: "bg-rose-100 text-rose-700",
    lessons: [
      { id: "5-1", title: "프론트엔드와 백엔드" },
      { id: "5-2", title: "API란 무엇인가" },
      { id: "5-3", title: "데이터베이스 기초" },
      { id: "5-4", title: "클라우드와 서버" },
      { id: "5-5", title: "더 깊이 배우기" },
    ],
  },
];

export default function CurriculumPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-sm font-semibold mb-4">
          5과 27개 강의
        </div>
        <h1 className="text-4xl font-bold mb-4">5과 커리큘럼</h1>
        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
          프롬프트엔지니어링부터 에이전트엔지니어링까지,
          <br />
          기초부터 고급까지
        </p>
      </div>

      {/* Course Sections */}
      <div className="space-y-10">
        {courses.map((course, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Gradient top bar */}
            <div className={`h-1.5 bg-gradient-to-r ${course.gradient}`} />

            <div className="p-8">
              {/* Course header */}
              <div className="flex items-start gap-4 mb-6">
                <span
                  className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${course.badgeColor}`}
                >
                  {course.phase}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">
                    {course.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Lesson list */}
              <div className="space-y-2">
                {course.lessons.map((lesson, j) => (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-teal-200 transition-colors">
                      {i + 1}-{j + 1}
                    </div>
                    <span className="text-slate-700 font-medium group-hover:text-teal-700 transition-colors">
                      {lesson.title}
                    </span>
                    <span className="ml-auto text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      &#9658;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 text-center text-white">
        <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium mb-4">
          다음 단계
        </div>
        <h3 className="text-2xl font-bold mb-3">
          AI업무학교를 마치셨나요?
        </h3>
        <p className="text-slate-300 leading-relaxed mb-8">
          클로드 코드 심화 과정으로 이어가세요.
          <br />
          12단계 52개 강의로 Claude Code를 완전 정복합니다.
        </p>
        <a
          href="https://edu.silronomu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-400 transition-colors shadow-lg"
        >
          클로드 코드 심화 과정 보기 &rarr;
        </a>
      </div>
    </div>
  );
}
