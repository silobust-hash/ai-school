"use client";

const STORAGE_KEY = "ai-school-next-action-v1";

export const growthPath = {
  id: "ai-school-learning-to-practice",
  name: "AI업무학교 학습·실무화 경로",
  read_url: "https://ai-school.silronomu.com/curriculum",
  prepare_url: "https://edu.silronomu.com/level-test",
  request_url: "https://silropanda.com/products/ai-lecture-request",
  follow_url: "https://ai-school.silronomu.com/lessons",
} as const;

const steps = [
  {
    number: "01",
    title: "내 출발점 확인",
    description: "수준진단으로 지금 바로 시작할 강의를 확인합니다.",
    href: "/level-test",
    label: "수준진단 하기",
  },
  {
    number: "02",
    title: "기초를 실무 언어로 익히기",
    description: "커리큘럼에서 내 업무에 필요한 학습 순서를 고릅니다.",
    href: growthPath.read_url,
    label: "전체 커리큘럼 보기",
  },
  {
    number: "03",
    title: "직접 구현해 보기",
    description: "Claude Code 실무 과정에서 설치·실행·검증까지 이어갑니다.",
    href: growthPath.prepare_url,
    label: "실행형 수준진단 하기",
  },
  {
    number: "04",
    title: "강의·업무화 상담으로 연결",
    description: "혼자 풀기 어려운 과제는 기존 AI 강의 의뢰 상세에서 범위를 확인합니다.",
    href: growthPath.request_url,
    label: "AI 강의 의뢰 상세 보기",
  },
  {
    number: "05",
    title: "다음 강의로 이어가기",
    description: "남긴 결과물을 바탕으로 다음 강의와 실습을 계속 진행합니다.",
    href: growthPath.follow_url,
    label: "전체 강의 계속 보기",
  },
] as const;

function isExternal(href: string) {
  return href.startsWith("https://");
}

export default function GrowthPath({ compact = false }: { compact?: boolean }) {
  function remember(label: string) {
    try {
      window.localStorage.setItem(STORAGE_KEY, label);
    } catch {
      // 개인정보나 서버 추적 없이, 저장이 거부된 브라우저에서도 동선을 유지한다.
    }
  }

  return (
    <section
      aria-labelledby="growth-path-title"
      className={`rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-sm)] md:p-8 ${compact ? "mt-6" : ""}`}
    >
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          Next Action Path
        </p>
        <h2 id="growth-path-title" className="mt-2 text-2xl font-extrabold text-[var(--color-ink)] md:text-3xl">
          배운 것을 실무 결과와 다음 상담까지 연결하세요
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)] md:text-base">
          학습 기록은 회원가입이나 서버 전송 없이 이 브라우저에만 선택적으로 남습니다.
        </p>
      </div>

      <ol className="mt-6 grid gap-3 md:grid-cols-5">
        {steps.map((step) => (
          <li key={step.number}>
            <a
              href={step.href}
              {...(isExternal(step.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => remember(step.title)}
              className="group flex h-full min-h-44 flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/50 hover:shadow-[var(--shadow-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <span className="text-xs font-extrabold text-[var(--color-primary)]">{step.number}</span>
              <h3 className="mt-3 text-sm font-bold leading-snug text-[var(--color-ink)]">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-soft)]">{step.description}</p>
              <span className="mt-auto pt-4 text-xs font-bold text-[var(--color-primary-dark)]">
                {step.label} <span aria-hidden>→</span>
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-ink-faint)]">
        완성한 홈페이지·콘텐츠의 AI 검색 노출을 별도로 살피고 싶다면{" "}
        <a href="https://xn--hc0b21et01ao2a.com/diagnose" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--color-primary-dark)] underline underline-offset-2">
          AEO·GEO 무료 진단
        </a>{" "}
        을 선택할 수 있습니다.
      </p>
    </section>
  );
}
