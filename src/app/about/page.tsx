import type { Metadata } from "next";
import { toSafeJsonLd } from "@/lib/jsonld";
import {
  OFFICIAL_FIRM_MEMBERS_URL,
  OFFICIAL_FIRM_URL,
  PERSON_ID,
  PERSON_INDUSTRIAL_SAFETY_BLOG_LABEL,
  PERSON_INDUSTRIAL_SAFETY_BLOG_URL,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "AI업무학교의 교육 방향과 운영 기준. 현업 적용, 보안, 사실 검증, 결과 확인을 중심으로 구성한 비개발자 AI 실무 교육입니다.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: "교육 방향과 운영 기준 | AI업무학교",
    description:
      "현업에서 직접 써보고 검증한 AI 활용법을 비개발자 눈높이로 정리합니다.",
    url: `${SITE_URL}/about`,
    siteName: "AI업무학교",
  },
};

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#profile-page`,
  url: `${SITE_URL}/about`,
  name: "AI업무학교 교육 방향과 운영 기준",
  inLanguage: "ko-KR",
  mainEntity: { "@id": PERSON_ID },
};

const principles = [
  {
    title: "업무 적용",
    description:
      "노무 업무에 AI를 직접 적용하며 확인한 시행착오와 작업 순서를 정리합니다.",
  },
  {
    title: "검증 우선",
    description:
      "빠른 생성보다 보안, 사실 확인, 결과 검수를 먼저 익히도록 구성합니다.",
  },
  {
    title: "선택 학습",
    description:
      "처음부터 순서대로 듣지 않아도 수준진단을 통해 필요한 강의부터 시작할 수 있습니다.",
  },
];

const officialChannels = [
  { label: "한동노무법인 공식 사이트", href: OFFICIAL_FIRM_URL },
  { label: "박실로 노무사 · 한동노무법인 구성원", href: OFFICIAL_FIRM_MEMBERS_URL },
  { label: "박실로 노무사 홈페이지", href: "https://silronomu.com" },
  { label: "노무 실무 블로그", href: "https://blog.silronomu.com" },
  { label: PERSON_INDUSTRIAL_SAFETY_BLOG_LABEL, href: PERSON_INDUSTRIAL_SAFETY_BLOG_URL },
];

export default function AboutPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(profilePageJsonLd) }}
      />

      <section className="relative overflow-hidden bg-mesh-dark bg-grain text-[var(--color-dark-text)]">
        <div className="bg-dotgrid-dark absolute inset-0 opacity-50" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-20">
          <p className="text-sm font-semibold text-[var(--color-accent-soft)]">
            교육 운영 안내
          </p>
          <h1 className="font-display mt-4 max-w-2xl text-3xl md:text-5xl font-extrabold leading-tight keep-all">
            현업에서 검증한 방법을
            <br className="hidden sm:block" /> 필요한 수준부터 배웁니다
          </h1>
          <p className="mt-6 max-w-2xl text-[var(--color-dark-text-soft)] text-base md:text-lg leading-relaxed keep-all">
            AI업무학교는 기능을 많이 소개하는 것보다, 실제 업무에 적용하고
            결과를 확인하는 과정을 중요하게 봅니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--color-dark-text)]">
            <span className="font-bold">박실로 공인노무사</span>
            <span
              className="hidden h-1 w-1 rounded-full bg-[var(--color-accent)] sm:block"
              aria-hidden
            />
            <span className="text-[var(--color-dark-text-soft)]">AI업무학교 운영</span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <section>
          <h2 className="text-2xl font-bold text-[var(--color-ink)]">
            이 교육을 만든 이유
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="border-t-2 border-[var(--color-primary)] pt-5"
              >
                <h3 className="font-bold text-[var(--color-ink)]">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)] keep-all">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--color-border)] pt-12">
          <h2 className="text-2xl font-bold text-[var(--color-ink)]">
            두 교육 사이트의 역할
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-card)] p-6 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-bold text-[var(--color-primary-dark)]">
                입문과 공통 기초
              </p>
              <h3 className="mt-2 text-lg font-bold text-[var(--color-ink)]">
                AI업무학교
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)] keep-all">
                프롬프트와 컨텍스트 설계, 업무 자동화의 기본 원리와 안전한 사용
                습관을 다룹니다.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-card)] p-6">
              <p className="text-xs font-bold text-[var(--color-ink-soft)]">
                기술 구현·측정
              </p>
              <h3 className="mt-2 text-lg font-bold text-[var(--color-ink)]">
                Claude Code 실무 과정
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)] keep-all">
                터미널과 파일 작업, 검증 절차, 업무 도구 제작과 웹 서비스
                배포까지 단계별로 실습합니다.
              </p>
              <a
                href="https://edu.silronomu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-primary-dark)]"
              >
                심화 과정 보기 <span className="ml-1" aria-hidden>→</span>
              </a>
            </article>
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--color-border)] pt-12">
          <h2 className="text-2xl font-bold text-[var(--color-ink)]">공식 채널</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)] keep-all">
            박실로 노무사의 공식 소속과 공개 교육·노무 콘텐츠는 아래 연결된 채널에서 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {officialChannels.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 px-5 py-2.5 rounded-lg border border-[var(--color-border-strong)] text-[var(--color-ink)] text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-soft)]/50 transition-colors"
              >
                {link.label}
                <span className="text-[var(--color-ink-faint)] text-xs" aria-hidden>
                  →
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
