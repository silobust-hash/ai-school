import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { lessons } from "@/data/lessons";
import { PERSON_ID, SITE_URL } from "@/lib/site";
import { toSafeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "소개",
  description:
    "박실로 노무사 소개. 19년차 공인노무사이자 AI 활용 교육자. 비개발자 전문직을 위한 AI 교육을 진행합니다.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: "박실로 소개 | AI업무학교",
    description:
      "19년차 공인노무사이자 AI 교육자 박실로가 비개발자 전문직을 위한 AI 교육을 진행합니다.",
    url: `${SITE_URL}/about`,
    siteName: "AI업무학교",
  },
};

// Reference the canonical Park Sillo Person node instead of creating a local duplicate.
const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#profile-page`,
  url: `${SITE_URL}/about`,
  name: "박실로 공인노무사·AI 교육자 소개",
  inLanguage: "ko-KR",
  mainEntity: { "@id": PERSON_ID },
};
const lessonCount = Object.keys(lessons).length;

export default function AboutPage() {
  const jsonLdString = toSafeJsonLd(profilePageJsonLd);
  return (
    <div className="bg-[var(--color-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* ===== Profile header — ink hero ===== */}
      <section className="relative overflow-hidden bg-mesh-dark bg-grain text-[var(--color-dark-text)] -mt-16 pt-16">
        <div className="bg-dotgrid-dark absolute inset-0 opacity-50" aria-hidden />
        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
          <Reveal>
            <div className="mx-auto mb-7 grid place-items-center w-24 h-24 rounded-2xl bg-white/10 ring-1 ring-white/15 text-4xl font-extrabold backdrop-blur-sm shadow-[var(--shadow-lg)]">
              박
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold">박실로</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
              <span className="text-[var(--color-dark-text)]">공인노무사</span>
              <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" aria-hidden />
              <span className="text-[var(--color-dark-text)]">AI 교육자</span>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-[var(--color-dark-text-soft)] text-lg leading-relaxed keep-all">
              &ldquo;AI로 일하고, 전문가로서 판단합니다&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* ===== Why a labor attorney teaches AI ===== */}
        <Reveal>
          <section className="mb-16">
            <h2 className="text-xl font-bold text-[var(--color-ink)] mb-7 flex items-center gap-3">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] text-sm font-extrabold shrink-0">
                1
              </span>
              왜 노무사가 AI 교육을?
            </h2>
            <div className="space-y-5 pl-11">
              {[
                "19년간 노동법 전문가로 일하면서, AI가 전문직의 업무 방식을 근본적으로 바꾸고 있다는 것을 체감했습니다.",
                "직접 Claude Code로 업무 도구를 만들고, 플러그인을 개발하고, 웹앱을 배포하면서 배운 것들을 정리했습니다.",
                "비개발자로서 AI를 배운 경험이야말로, 같은 입장의 분들에게 가장 공감가는 교육이 될 수 있다고 믿습니다.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="relative flex items-start gap-3 text-[var(--color-ink-soft)] text-[15px] leading-relaxed keep-all"
                >
                  <span className="mt-[0.6em] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shrink-0" aria-hidden />
                  {text}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ===== Courses offered ===== */}
        <Reveal>
          <section className="mb-16">
            <h2 className="text-xl font-bold text-[var(--color-ink)] mb-7 flex items-center gap-3">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] text-sm font-extrabold shrink-0">
                2
              </span>
              운영하는 교육 과정
            </h2>
            <div className="pl-11 space-y-4">
              {/* AI School — highlighted */}
              <div className="relative overflow-hidden rounded-2xl border border-[var(--color-primary)]/25 bg-[var(--color-card)] p-6 shadow-[var(--shadow-sm)]">
                <span
                  className="absolute left-0 top-0 h-full w-1"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--color-primary), #15b8a6)",
                  }}
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] rounded-full">
                        이 사이트
                      </span>
                      <h3 className="font-bold text-[var(--color-ink)]">AI업무학교</h3>
                    </div>
                    <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed keep-all">
                      AI 기초부터 고급까지 6과 {lessonCount}개 강의. 프롬프트엔지니어링,
                      컨텍스트엔지니어링, 바이브코딩, 에이전트엔지니어링.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-primary-dark)] bg-[var(--color-primary-soft)] px-3 py-1.5 rounded-full shrink-0">
                    6과 · {lessonCount}강
                  </span>
                </div>
              </div>

              {/* Claude Code Course */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-[var(--color-border)] text-[var(--color-ink-soft)] rounded-full">
                        심화 과정
                      </span>
                      <h3 className="font-bold text-[var(--color-ink)]">클로드 코드 강의</h3>
                    </div>
                    <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed keep-all">
                      Claude Code 심화 16단계 73개 강의.
                      AI업무학교를 마친 후 자연스럽게 연결됩니다.
                    </p>
                    <a
                      href="https://edu.silronomu.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm text-[var(--color-primary-dark)] hover:gap-2 transition-all font-semibold"
                    >
                      edu.silronomu.com <span aria-hidden>→</span>
                    </a>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-ink-soft)] bg-[var(--color-border)] px-3 py-1.5 rounded-full shrink-0">
                    16단계 · 73강
                  </span>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ===== Links ===== */}
        <Reveal>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-ink)] mb-7 flex items-center gap-3">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] text-sm font-extrabold shrink-0">
                3
              </span>
              링크
            </h2>
            <div className="pl-11">
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
                    className="inline-flex min-h-11 items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-ink-soft)] text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-soft)]/50 transition-all"
                  >
                    {link.label}
                    <span className="text-[var(--color-ink-faint)] text-xs" aria-hidden>→</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
