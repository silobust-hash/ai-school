import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import GrowthPath from "@/components/GrowthPath";
import { lessons } from "@/data/lessons";
import {
  AI_SCHOOL_ORGANIZATION_ID,
  COURSE_ID,
  PERSON_ID,
  SITE_URL,
} from "@/lib/site";
import { toSafeJsonLd } from "@/lib/jsonld";


export const metadata: Metadata = {
  title: "AI업무학교 | 비개발자를 위한 AI 실무 교육",
  description:
    "비개발자를 위한 AI 업무 활용 과정. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 실행 프롬프트와 검수 기준을 함께 익힙니다.",
  alternates: { canonical: "/" },
};
const lessonCount = Object.keys(lessons).length;

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": COURSE_ID,
  name: "AI업무학교: 문과 출신도 AI로 일하는 시대",
  description:
    "프롬프트엔지니어링부터 에이전트엔지니어링까지, 비개발자를 위한 AI 활용 전체 로드맵과 실습 결과물 중심 교육",
  courseCode: "AISCHOOL",
  isAccessibleForFree: true,
  provider: {
    "@type": "EducationalOrganization",
    "@id": AI_SCHOOL_ORGANIZATION_ID,
    name: "AI업무학교",
    url: SITE_URL,
  },
  instructor: { "@id": PERSON_ID },
  educationalLevel: "Beginner",
  inLanguage: "ko-KR",
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
        text: "네, 코딩 경험이 전혀 없는 분을 위해 설계되었습니다. 엑셀 정도 다룰 줄 안다면 충분하며, 노무 실무에 AI를 직접 적용하며 정리한 내용을 비개발자 눈높이에서 차근차근 설명합니다.",
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
    accent: "#e8843a",
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
    subtitle: "모델·제품별 한도를 이해하는 AI 활용법",
    emoji: "📚",
    color: "from-sky-400 to-blue-500",
    accent: "#2e8bc0",
    lessons: [
      "컨텍스트란? — AI의 기억과 이해 구조",
      "장문 컨텍스트 — 필요한 문서를 선별해 넣기",
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
    accent: "#0c7a6e",
    lessons: [
      "하네스엔지니어링이란? — AI 활용 환경 구성",
      "바이브코딩 기초 — 대화로 코드 만들기",
      "HTML/CSS 기초 — AI가 설명하니까 쉽습니다",
      "Next.js 웹사이트 구성과 배포",
      "Vercel 배포 — 내가 만든 사이트를 세상에",
    ],
  },
  {
    phase: "4과",
    title: "에이전트엔지니어링",
    subtitle: "AI 에이전트와 자동화 워크플로우",
    emoji: "🤖",
    color: "from-violet-400 to-purple-500",
    accent: "#7c5cda",
    lessons: [
      "AI 에이전트란? — 스스로 생각하고 행동하는 AI",
      "MCP 서버로 업무 도구 연동하기",
      "Gmail, 캘린더, 노션과 AI 연결",
      "자동화 워크플로우 설계와 구축",
      "에이전트 파이프라인 설계 — 반복 업무 줄이기",
      "클로드 코드 심화 과정으로 연결",
    ],
  },
  {
    phase: "5과",
    title: "개발 기초 교양",
    subtitle: "개발자 언어를 이해하는 비개발자",
    emoji: "💡",
    color: "from-rose-400 to-pink-500",
    accent: "#d6557f",
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
    accent: "#4f6bd8",
    lessons: [
      "프롬프트에서 하네스까지 — 3년의 진화",
      "2026 최신 모델·제품 지도 — Fable 5와 GPT-5.6",
      "하네스 엔지니어링 실전 — 에이전트 환경 설계",
      "다이나믹 워크플로우와 자율 다단계 실행",
      "제2의 두뇌 — 옵시디언 + CLI 지식관리",
      "모바일 에이전트 — 어디서나 AI",
      "오픈소스 오케스트레이션 — AI 팀 꾸리기",
      "마켓플레이스로 내 AI 도구 관리하기",
      "Chat·Work·Codex·Sites 구분하기",
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
    desc: "용량보다 중요한 정보 선별·구조화·검증 방법을 배웁니다.",
  },
  {
    icon: "🚀",
    title: "바이브코딩",
    desc: "코딩 경험이 없어도 AI와 대화하며 웹사이트 제작과 배포를 실습합니다.",
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

const practiceFlow = [
  {
    step: "01",
    title: "개념을 업무 언어로 번역",
    desc: "프롬프트, 컨텍스트, API 같은 말을 내 업무 사례로 다시 설명합니다.",
  },
  {
    step: "02",
    title: "AI에게 맡길 단위로 쪼개기",
    desc: "보고서, 상담 메모, 자료 정리처럼 바로 맡길 수 있는 작은 작업으로 바꿉니다.",
  },
  {
    step: "03",
    title: "복붙 가능한 프롬프트 확보",
    desc: "강의마다 업무에 바로 붙여넣을 수 있는 요청문과 검수 기준을 남깁니다.",
  },
];

// Bento layout sizing — varied tile spans for an asymmetric grid.
// Index order matches `features`; copy is untouched.
const bentoSpans = [
  "lg:col-span-3 lg:row-span-2", // 프롬프트엔지니어링 — hero tile
  "lg:col-span-3",               // 컨텍스트엔지니어링
  "lg:col-span-2",               // 바이브코딩
  "lg:col-span-2 lg:row-span-2", // 에이전트엔지니어링 — tall
  "lg:col-span-2",               // MCP & 도구 연동
  "lg:col-span-2",               // 개발 기초 교양
  "lg:col-span-2",               // 클로드 코드 심화 연결
];

export default function Home() {
  return (
    <div className="bg-[var(--color-bg)]">
      <script
        type="application/ld+json"
        // JSON-LD structured data for SEO — static content, no user input
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        // JSON-LD structured data for SEO — static content, no user input
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(faqJsonLd) }}
      />

      {/* ============ HERO — asymmetric, type-forward ============ */}
      <section className="relative overflow-hidden -mt-16 pt-16">
        {/* layered background: line grid + dot grid, masked fade */}
        <div className="absolute inset-0 bg-linegrid mask-fade-b" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[34rem] w-[34rem] rounded-full opacity-60 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(12,122,110,0.22), transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            {/* Left — headline */}
            <div className="lg:col-span-8">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[13px] font-semibold text-[var(--color-ink-soft)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  </span>
                  AI 시대의 새로운 업무 역량
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="font-display mt-7 max-w-full text-[var(--color-ink)] text-[clamp(2.15rem,1.35rem+5.8vw,5.5rem)] font-extrabold">
                  <span className="block">
                    코딩 경험이 없어도
                    <br />
                    시작할 수 있습니다.
                  </span>
                  <span className="mt-1 block">
                    <span className="relative inline-block">
                      <span className="relative z-10 bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[#15b8a6] bg-clip-text text-transparent">
                        AI를 업무에 연결하는 법
                      </span>
                      {/* ember underline */}
                      <span
                        className="absolute left-0 -bottom-1 h-[0.18em] w-full rounded-full opacity-90"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--color-accent), transparent)",
                        }}
                        aria-hidden
                      />
                    </span>
                    <span className="block text-[var(--color-ink)] sm:inline">을 배웁니다.</span>
                  </span>
                </h1>
              </Reveal>
            </div>

            {/* Right — supporting copy + CTAs */}
            <div className="lg:col-span-4">
              <Reveal delay={240}>
                <p className="max-w-full break-keep text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
                  현업에서 직접 써보고 다듬은 AI 활용 교육 과정.
                  프롬프트 설계의 기초부터 업무 자동화 실습까지 단계별로 다룹니다.
                </p>
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:flex sm:flex-wrap">
                  <Link
                    href="/level-test"
                    className="btn-glow inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--color-primary-deep)] text-white font-semibold shadow-[var(--shadow-md)] sm:w-auto"
                  >
                    수준진단 시작
                    <span aria-hidden className="text-[var(--color-accent)]">→</span>
                  </Link>
                  <Link
                    href="/curriculum"
                    className="inline-flex w-full items-center justify-center px-7 py-3.5 rounded-xl bg-[var(--color-bg-elevated)] text-[var(--color-ink)] font-semibold border border-[var(--color-border-strong)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors sm:w-auto"
                  >
                    커리큘럼 보기
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Stat strip — editorial rhythm */}
          <Reveal delay={420}>
            <dl className="mt-16 md:mt-20 grid grid-cols-3 max-w-2xl divide-x divide-[var(--color-border)]">
              {[
                { n: "6과", l: "체계적 커리큘럼" },
                { n: `${lessonCount}강`, l: "단계별 실전 강의" },
                { n: "0원", l: "누구나 무료 수강" },
              ].map((s) => (
                <div key={s.l} className="px-5 first:pl-0">
                  <dt className="font-display text-3xl md:text-4xl font-extrabold text-[var(--color-ink)] tabular-nums">
                    {s.n}
                  </dt>
                  <dd className="mt-1 text-sm text-[var(--color-ink-faint)] font-medium">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ============ WHO IS THIS FOR ============ */}
      <section className="relative max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <p className="text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-primary)]">
            For You
          </p>
          <h2 className="font-display mt-3 text-[var(--color-ink)] text-[var(--step-fluid-h2)] font-extrabold">
            이런 분을 위해 만들었습니다
          </h2>
          <p className="mt-4 text-[var(--color-ink-soft)] text-lg keep-all">
            &ldquo;AI 써보고 싶은데, 어디서부터 시작해야 할지 모르겠어요&rdquo;
          </p>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            {
              num: "01",
              title: "AI 써보고 싶은데...",
              desc: "ChatGPT 한번 써봤는데, 업무에 어떻게 연결해야 할지 모르는 분",
            },
            {
              num: "02",
              title: "코딩은 전혀 모르지만",
              desc: "엑셀 정도는 다루는, 새로운 도구에 열린 마음을 가진 분",
            },
            {
              num: "03",
              title: "업무 효율을 높이고 싶은",
              desc: "반복 업무를 줄이고 핵심 업무에 집중하고 싶은 분",
            },
          ].map((item, i) => (
            <Reveal key={item.num} delay={i * 90}>
              <article className="group relative h-full rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-7 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300">
                <span className="font-display text-5xl font-extrabold text-[var(--color-primary-soft)] group-hover:text-[var(--color-primary)]/30 transition-colors tabular-nums">
                  {item.num}
                </span>
                <h3 className="mt-4 text-lg font-bold text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed keep-all">
                  {item.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PRACTICE FLOW ============ */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 md:p-10 shadow-[var(--shadow-sm)]">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
              <div>
                <p className="text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-primary)]">
                  Practice Loop
                </p>
                <h2 className="font-display mt-3 text-3xl font-extrabold text-[var(--color-ink)] md:text-4xl">
                  듣고 끝나지 않게,
                  <br />
                  매 강의마다 작은 결과물을 남깁니다
                </h2>
                <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed keep-all">
                  비개발자에게 필요한 건 이론 암기가 아니라, 오늘 업무에 붙일 수 있는
                  실행 단위입니다. 각 강의는 복습 프롬프트와 검수 기준까지 이어집니다.
                </p>
              </div>

              <div className="grid gap-3">
                {practiceFlow.map((item) => (
                  <article
                    key={item.step}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-sm font-extrabold text-[var(--color-primary-dark)]">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-bold text-[var(--color-ink)]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-soft)] keep-all">
                        {item.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ FEATURES — BENTO GRID ============ */}
      <section className="relative bg-[var(--color-bg-elevated)] border-y border-[var(--color-border)]">
        <div className="bg-dotgrid absolute inset-0 opacity-70" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-primary)]">
                  Curriculum Highlights
                </p>
                <h2 className="font-display mt-3 text-[var(--color-ink)] text-[var(--step-fluid-h2)] font-extrabold">
                  AI업무학교에서 배우는 것들
                </h2>
              </div>
              <Link
                href="/curriculum"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-dark)] hover:gap-2.5 transition-all"
              >
                전체 커리큘럼
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(0,1fr)] gap-4">
            {features.map((f, i) => {
              const isHero = i === 0;
              return (
                <Reveal
                  key={f.title}
                  delay={i * 70}
                  className={bentoSpans[i]}
                >
                  <article
                    className={`group relative h-full overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                      isHero
                        ? "bg-mesh-dark bg-grain text-[var(--color-dark-text)] border-transparent shadow-[var(--shadow-lg)]"
                        : "bg-[var(--color-card)] border-[var(--color-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary)]/40"
                    }`}
                  >
                    {isHero && (
                      <div className="bg-dotgrid-dark absolute inset-0 opacity-50" aria-hidden />
                    )}
                    <div className="relative flex h-full flex-col">
                      {/* index badge — consistent, restrained (replaces emoji clutter) */}
                      <span
                        className={`inline-grid place-items-center w-10 h-10 rounded-xl text-sm font-extrabold tabular-nums ${
                          isHero
                            ? "bg-white/10 text-[var(--color-dark-text)] ring-1 ring-white/15"
                            : "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]"
                        }`}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <h3
                        className={`mt-5 font-bold ${
                          isHero
                            ? "text-2xl md:text-[1.7rem] font-display"
                            : "text-lg"
                        }`}
                      >
                        {f.title}
                      </h3>
                      <p
                        className={`mt-2 leading-relaxed keep-all ${
                          isHero
                            ? "text-[var(--color-dark-text-soft)] text-base max-w-sm"
                            : "text-sm text-[var(--color-ink-soft)]"
                        }`}
                      >
                        {f.desc}
                      </p>

                      {isHero && (
                        <div className="mt-auto pt-8 flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-text)]">
                          <span className="h-px w-10 bg-[var(--color-accent)]" />
                          모든 과정의 출발점
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CURRICULUM PREVIEW — editorial list ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-primary)]">
              Full Roadmap
            </p>
            <h2 className="font-display mt-3 text-[var(--color-ink)] text-[var(--step-fluid-h2)] font-extrabold">
              6과 커리큘럼
            </h2>
            <p className="mt-4 text-[var(--color-ink-soft)] text-lg keep-all max-w-2xl mx-auto">
              AI를 처음 만나는 순간부터, 나만의 자동화 워크플로우를 완성하는 날까지
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-2 gap-x-12 gap-y-2">
          {courses.map((course, i) => (
            <Reveal key={course.phase} delay={(i % 2) * 90}>
              <article
                className="group relative grid grid-cols-[auto_1fr] gap-x-5 py-7 border-t border-[var(--color-border)] transition-colors hover:border-[var(--color-primary)]/40"
                style={{ ["--c" as string]: course.accent }}
              >
                {/* big index */}
                <div className="pt-1">
                  <span className="font-display text-2xl font-extrabold text-[var(--color-ink-faint)] group-hover:text-[var(--c)] transition-colors tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-[var(--color-ink)]">
                      {course.title}
                    </h3>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        color: course.accent,
                        backgroundColor: `${course.accent}1a`,
                      }}
                    >
                      {course.phase}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[var(--color-ink-faint)]">
                    {course.subtitle}
                  </p>

                  {/* lessons — wrap as quiet chips so the list breathes */}
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {course.lessons.map((lesson, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)] leading-relaxed keep-all"
                      >
                        <span
                          className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: course.accent }}
                          aria-hidden
                        />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* hover accent rail */}
                <span
                  className="absolute left-0 top-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: course.accent }}
                  aria-hidden
                />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 text-center">
            <Link
              href="/curriculum"
              className="btn-glow inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--color-primary-deep)] text-white font-semibold shadow-[var(--shadow-md)]"
            >
              전체 커리큘럼 자세히 보기
              <span aria-hidden className="text-[var(--color-accent)]">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <GrowthPath />
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-[var(--color-bg-elevated)] border-y border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-primary)]">
                FAQ
              </p>
              <h2 className="font-display mt-3 text-[var(--color-ink)] text-[var(--step-fluid-h2)] font-extrabold">
                자주 묻는 질문
              </h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 50}>
                <details className="group rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] open:shadow-[var(--shadow-md)] open:border-[var(--color-primary)]/30 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-bold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden list-none">
                    <span className="keep-all pr-4">{faq.question}</span>
                    <span
                      className="grid place-items-center shrink-0 w-7 h-7 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] text-xl leading-none transition-transform duration-300 group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[var(--color-ink-soft)] leading-relaxed keep-all">
                    {faq.answer}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA — dark ink section ============ */}
      <section className="relative overflow-hidden bg-mesh-dark bg-grain text-[var(--color-dark-text)]">
        <div className="bg-dotgrid-dark absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-96 w-[40rem] rounded-full opacity-50 blur-[110px] animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(232,132,58,0.28), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <Reveal>
            <h2 className="font-display text-[clamp(2.1rem,1.3rem+3vw,3.4rem)] font-extrabold leading-tight keep-all">
              지금 시작해보세요
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 text-[var(--color-dark-text-soft)] text-lg leading-relaxed keep-all max-w-xl mx-auto">
              개발 경험이 없어도 시작할 수 있습니다.
              수준진단을 통해 지금 필요한 강의부터 차근차근 실습해보세요.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10">
              <Link
                href="/lessons"
                className="btn-glow inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-[var(--color-primary-deep)] font-bold text-lg shadow-[var(--shadow-lg)]"
              >
                첫 번째 강의 시작
                <span aria-hidden className="text-[var(--color-accent)]">→</span>
              </Link>
              <Link
                href="/level-test"
                className="inline-flex items-center gap-2 mt-4 md:mt-0 px-10 py-4 rounded-xl bg-transparent text-white border border-white/50 font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                내 학습 유형 진단받기
                <span aria-hidden className="text-[var(--color-accent)]">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
