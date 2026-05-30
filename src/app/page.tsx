import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-school.silronomu.com";

export const metadata: Metadata = {
  title: "AI업무학교 | 문과 출신도 AI로 일하는 시대, 기초부터 고급까지",
  description:
    "비개발자를 위한 AI 활용 완전 정복. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 19년차 노무사가 6과 35개 강의로 가르칩니다.",
  alternates: { canonical: "/" },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": `${SITE_URL}/#course`,
  name: "AI업무학교: 문과 출신도 AI로 일하는 시대",
  description:
    "프롬프트엔지니어링부터 에이전트엔지니어링까지, 비개발자를 위한 AI 활용 전체 로드맵",
  courseCode: "AISCHOOL",
  isAccessibleForFree: true,
  provider: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#org`,
    name: "한동노무법인",
    url: "https://silronomu.com",
  },
  instructor: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "박실로",
    jobTitle: "공인노무사",
  },
  educationalLevel: "Beginner",
  inLanguage: "ko",
  numberOfCredits: 6,
  about: [
    "프롬프트엔지니어링",
    "컨텍스트엔지니어링",
    "하네스엔지니어링",
    "에이전트엔지니어링",
  ],
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT30H",
    url: `${SITE_URL}/curriculum`,
  },
  teaches: [
    "프롬프트엔지니어링 기초와 실전",
    "컨텍스트엔지니어링과 AI 커스터마이징",
    "바이브코딩과 웹사이트 배포",
    "AI 에이전트와 자동화 워크플로우",
    "프론트엔드/백엔드/API 기초 교양",
    "하네스엔지니어링 실전과 2026 AI 에이전트 생태계",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AI업무학교는 비개발자도 들을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 코딩 경험이 전혀 없는 분을 위해 설계되었습니다. 엑셀 정도 다룰 줄 안다면 충분하며, 19년차 노무사가 비개발자 눈높이에서 처음부터 차근차근 설명합니다.",
      },
    },
    {
      "@type": "Question",
      name: "프롬프트엔지니어링이 뭔가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI에게 더 정확한 답변을 얻기 위해 질문을 체계적으로 설계하는 기술입니다. 같은 내용을 물어봐도 어떻게 물어보느냐에 따라 결과가 크게 달라지는데, 그 방법론을 배우는 과정입니다.",
      },
    },
    {
      "@type": "Question",
      name: "바이브코딩이 뭔가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI와 대화하면서 코딩하는 새로운 방식입니다. 코드를 직접 쓸 필요 없이 AI와 주고받는 대화만으로 웹사이트를 만들고 배포할 수 있습니다. 코딩 지식이 없어도 결과물을 만들 수 있는 게 핵심입니다.",
      },
    },
    {
      "@type": "Question",
      name: "강의를 완료하면 무엇을 할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI 프롬프트 작성, 커스텀 AI 비서 만들기, 웹사이트 제작 및 배포, AI 에이전트 설계, Gmail·캘린더·노션과 AI 연동, 그리고 반복 업무를 자동화하는 워크플로우 구축이 가능합니다.",
      },
    },
    {
      "@type": "Question",
      name: "클로드 코드 강의와 어떤 관계인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI업무학교는 AI 활용의 기초를 다루고, 클로드 코드 강의는 심화 과정입니다. AI업무학교에서 프롬프트엔지니어링과 바이브코딩 기초를 익힌 후, 클로드 코드 강의로 자연스럽게 연결됩니다.",
      },
    },
  ],
};

const faqs = faqJsonLd.mainEntity.map((q) => ({
  question: q.name,
  answer: q.acceptedAnswer.text,
}));

const courses = [
  {
    phase: "1과",
    title: "AI 입문 & 프롬프트엔지니어링",
    subtitle: "AI에게 원하는 것을 얻는 기술",
    emoji: "🌟",
    color: "from-amber-400 to-orange-500",
    lessons: [
      "AI 시대, 문과 출신의 새로운 기회",
      "ChatGPT vs Claude — 어떤 AI를 어떻게 쓸까",
      "프롬프트엔지니어링 기초 — 질문 설계의 원리",
      "역할 부여와 맥락 제공으로 답변 품질 높이기",
      "실전: 업무 이메일, 보고서, 문서 작성 자동화",
      "프롬프트 라이브러리 만들기",
    ],
  },
  {
    phase: "2과",
    title: "컨텍스트엔지니어링",
    subtitle: "100만 토큰 시대의 AI 활용법",
    emoji: "📚",
    color: "from-sky-400 to-blue-500",
    lessons: [
      "컨텍스트란? — AI의 기억과 이해 구조",
      "100만 토큰 시대 — 문서 전체를 AI에 넣기",
      "CLAUDE.md로 나만의 AI 비서 세팅하기",
      "시스템 프롬프트와 페르소나 설계",
      "멀티턴 대화 전략 — 긴 작업을 AI와 함께하기",
    ],
  },
  {
    phase: "3과",
    title: "하네스엔지니어링 & 바이브코딩",
    subtitle: "AI와 대화하며 웹사이트 만들기",
    emoji: "🚀",
    color: "from-emerald-400 to-teal-500",
    lessons: [
      "하네스엔지니어링이란? — AI 활용 환경 구성",
      "바이브코딩 기초 — 대화로 코드 만들기",
      "HTML/CSS 기초 — AI가 설명하니까 쉽습니다",
      "Next.js로 웹사이트 뚝딱 만들기",
      "Vercel 배포 — 내가 만든 사이트를 세상에",
    ],
  },
  {
    phase: "4과",
    title: "에이전트엔지니어링",
    subtitle: "AI 에이전트와 자동화 워크플로우",
    emoji: "🤖",
    color: "from-violet-400 to-purple-500",
    lessons: [
      "AI 에이전트란? — 스스로 생각하고 행동하는 AI",
      "MCP 서버로 업무 도구 연동하기",
      "Gmail, 캘린더, 노션과 AI 연결",
      "자동화 워크플로우 설계와 구축",
      "에이전트 파이프라인 완성 — 반복 업무 끝",
      "클로드 코드 심화 과정으로 연결",
    ],
  },
  {
    phase: "5과",
    title: "개발 기초 교양",
    subtitle: "개발자 언어를 이해하는 비개발자",
    emoji: "💡",
    color: "from-rose-400 to-pink-500",
    lessons: [
      "프론트엔드 vs 백엔드 — 웹이 작동하는 방식",
      "API란? — 서비스들이 대화하는 방법",
      "데이터베이스 기초 — 정보를 저장하고 불러오기",
      "Git & GitHub — 변경 이력 관리의 이유",
      "개발자와 협업하기 — 소통을 위한 최소 지식",
    ],
  },
  {
    phase: "6과",
    title: "2026, AI 엔지니어링의 현재",
    subtitle: "하네스·에이전트 생태계의 최신 지형",
    emoji: "🧭",
    color: "from-indigo-400 to-blue-600",
    lessons: [
      "프롬프트에서 하네스까지 — 3년의 진화",
      "2026 최신 모델 지도 — Opus·GPT·Gemini",
      "하네스 엔지니어링 실전 — 에이전트 환경 설계",
      "다이나믹 워크플로우와 자율 다단계 실행",
      "제2의 두뇌 — 옵시디언 + CLI 지식관리",
      "모바일 에이전트 — 어디서나 AI",
      "오픈소스 오케스트레이션 — AI 팀 꾸리기",
      "마켓플레이스로 내 AI 도구 관리하기",
    ],
  },
];

const features = [
  {
    icon: "🎯",
    title: "프롬프트엔지니어링",
    desc: "AI에게 원하는 결과를 정확히 얻는 질문 기술을 배웁니다.",
  },
  {
    icon: "📚",
    title: "컨텍스트엔지니어링",
    desc: "100만 토큰 시대, AI에게 올바른 맥락을 제공하는 방법.",
  },
  {
    icon: "🚀",
    title: "바이브코딩",
    desc: "코딩 몰라도 OK. AI와 대화하면서 웹사이트를 만들고 배포합니다.",
  },
  {
    icon: "🤖",
    title: "에이전트엔지니어링",
    desc: "AI 에이전트를 설계하고 업무 자동화 워크플로우를 구축합니다.",
  },
  {
    icon: "🔗",
    title: "MCP & 도구 연동",
    desc: "Gmail, 캘린더, 노션 등 업무 도구와 AI를 연결합니다.",
  },
  {
    icon: "💡",
    title: "개발 기초 교양",
    desc: "프론트엔드, 백엔드, API, 데이터베이스 — 개발자 언어를 이해합니다.",
  },
  {
    icon: "🎓",
    title: "클로드 코드 심화 연결",
    desc: "기초를 마치면 클로드 코드 심화 과정으로 자연스럽게 이어집니다.",
  },
];

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        // JSON-LD structured data for SEO — static content, no user input
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        // JSON-LD structured data for SEO — static content, no user input
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-sm font-medium mb-6">
            AI 시대의 새로운 업무 역량
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            코딩 몰라도 괜찮아요.
            <br />
            <span className="text-amber-300">AI로 일하는 법</span>을 배우세요.
          </h1>
          <p className="text-lg md:text-xl text-teal-100 max-w-2xl mb-10 leading-relaxed">
            19년차 노무사가 직접 만든 AI 활용 교육 과정.
            <br />
            프롬프트엔지니어링부터 에이전트엔지니어링까지, 기초부터 고급까지.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/curriculum"
              className="px-8 py-3.5 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
            >
              커리큘럼 보기
            </Link>
            <Link
              href="/lessons"
              className="px-8 py-3.5 bg-white/15 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/25 transition-colors border border-white/20"
            >
              바로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">이런 분을 위해 만들었습니다</h2>
          <p className="text-slate-500 text-lg">
            &ldquo;AI 써보고 싶은데, 어디서부터 시작해야 할지 모르겠어요&rdquo;
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🤔",
              title: "AI 써보고 싶은데...",
              desc: "ChatGPT 한번 써봤는데, 업무에 어떻게 연결해야 할지 모르는 분",
            },
            {
              emoji: "💻",
              title: "코딩은 전혀 모르지만",
              desc: "엑셀 정도는 다루는, 새로운 도구에 열린 마음을 가진 분",
            },
            {
              emoji: "⏰",
              title: "업무 효율을 높이고 싶은",
              desc: "반복 업무를 줄이고 핵심 업무에 집중하고 싶은 분",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            AI업무학교에서 배우는 것들
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">6과 커리큘럼</h2>
          <p className="text-slate-500 text-lg">
            AI를 처음 만나는 순간부터, 나만의 자동화 워크플로우를 완성하는 날까지
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{course.emoji}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {course.phase}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{course.subtitle}</p>
                <ul className="space-y-2">
                  {course.lessons.map((lesson, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-teal-400 mt-0.5 shrink-0">&#9658;</span>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/curriculum"
            className="inline-block px-8 py-3.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            전체 커리큘럼 자세히 보기
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-semibold text-slate-800 [&::-webkit-details-marker]:hidden list-none">
                {faq.question}
                <span className="text-teal-400 transition-transform group-open:rotate-45 shrink-0 ml-4 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 시작해보세요</h2>
          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            코딩을 몰라도 됩니다. 개발 경험이 없어도 됩니다.
            <br />
            AI업무학교가 처음부터 끝까지 함께합니다.
          </p>
          <Link
            href="/lessons"
            className="inline-block px-10 py-4 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-lg text-lg"
          >
            첫 번째 강의 시작
          </Link>
        </div>
      </section>
    </div>
  );
}
