import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개 | AI업무학교",
  description:
    "박실로 노무사 소개. 19년차 공인노무사이자 AI 활용 교육자. 비개발자 전문직을 위한 AI 교육을 진행합니다.",
  alternates: { canonical: "/about" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "박실로",
  alternateName: ["Park Silro", "실로노무사"],
  jobTitle: "공인노무사",
  worksFor: { "@type": "Organization", name: "한동노무법인" },
  knowsAbout: [
    "노동법",
    "근로기준법",
    "산업안전보건법",
    "Claude Code",
    "AI 업무 자동화",
    "프롬프트엔지니어링",
    "컨텍스트엔지니어링",
    "바이브코딩",
    "비개발자 AI 활용",
  ],
  description:
    "19년차 공인노무사이자 AI 활용 교육자. 비개발자 전문직을 위한 AI 교육을 진행합니다.",
  url: "https://silronomu.com",
  sameAs: [
    "https://blog.silronomu.com",
    "https://edu.silronomu.com",
    "https://ai-school.silronomu.com",
    "https://www.threads.com/@silrobag",
  ],
};

export default function AboutPage() {
  const jsonLdString = JSON.stringify(personJsonLd);
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* Profile section */}
      <div className="text-center mb-16">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          박
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">박실로</h1>
        <p className="text-teal-600 font-semibold mb-3">공인노무사 · AI 교육자</p>
        <p className="text-slate-500 text-lg leading-relaxed">
          &ldquo;AI로 일하고, 전문가로서 판단합니다&rdquo;
        </p>
      </div>

      {/* Why a labor attorney teaches AI */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold shrink-0">
            1
          </span>
          왜 노무사가 AI 교육을?
        </h2>
        <div className="space-y-4 pl-10">
          {[
            "19년간 노동법 전문가로 일하면서, AI가 전문직의 업무 방식을 근본적으로 바꾸고 있다는 것을 체감했습니다.",
            "직접 Claude Code로 업무 도구를 만들고, 플러그인을 개발하고, 웹앱을 배포하면서 배운 것들을 정리했습니다.",
            "비개발자로서 AI를 배운 경험이야말로, 같은 입장의 분들에게 가장 공감가는 교육이 될 수 있다고 믿습니다.",
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-slate-600 leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2.5 shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Courses offered */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold shrink-0">
            2
          </span>
          운영하는 교육 과정
        </h2>
        <div className="pl-10 space-y-4">
          {/* AI School */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full">
                    이 사이트
                  </span>
                  <h3 className="font-bold text-slate-800">AI업무학교</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  AI 기초부터 고급까지 5과 27개 강의. 프롬프트엔지니어링,
                  컨텍스트엔지니어링, 바이브코딩, 에이전트엔지니어링.
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-3 py-1.5 rounded-full shrink-0">
                5과 · 27강
              </span>
            </div>
          </div>

          {/* Claude Code Course */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 bg-slate-200 text-slate-600 rounded-full">
                    심화 과정
                  </span>
                  <h3 className="font-bold text-slate-800">클로드 코드 강의</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Claude Code 심화 12단계 52개 강의.
                  AI업무학교를 마친 후 자연스럽게 연결됩니다.
                </p>
                <a
                  href="https://edu.silronomu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  edu.silronomu.com →
                </a>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-3 py-1.5 rounded-full shrink-0">
                12단계 · 52강
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold shrink-0">
            3
          </span>
          링크
        </h2>
        <div className="pl-10">
          <div className="flex flex-wrap gap-3">
            {[
              { label: "홈페이지", href: "https://silronomu.com" },
              { label: "블로그", href: "https://blog.silronomu.com" },
              { label: "Threads", href: "https://www.threads.com/@silrobag" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-all"
              >
                {link.label}
                <span className="text-slate-400 text-xs">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
