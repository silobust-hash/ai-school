export default function EducationChannelBar() {
  return (
    <nav
      aria-label="교육 채널 전환"
      className="border-b border-white/15 bg-[var(--color-primary-deep)] text-white"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="hidden min-h-[60px] min-w-0 items-center border-r border-white/15 px-6 py-2 md:flex">
          <p className="text-xs font-semibold text-[#afd2cb]">두 채널 학습 경로</p>
        </div>

        <div
          aria-current="page"
          className="flex min-h-[60px] min-w-0 items-center border-r border-white/15 px-4 py-2 sm:px-6"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold leading-tight text-[#afd2cb] sm:text-xs">
              현재 채널 · 콘텐츠 설계
            </span>
            <strong className="mt-1 block text-sm font-extrabold leading-tight sm:text-[15px]">
              AI업무학교
            </strong>
          </span>
        </div>

        <a
          href="https://edu.silronomu.com"
          aria-label="Claude Code 실무 과정, 기술 구현과 측정 채널로 이동"
          className="group flex min-h-[60px] min-w-0 items-center justify-between gap-2 bg-[var(--color-accent)] px-4 py-2 text-[#24170d] transition-colors hover:bg-[#f09a58] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white sm:px-6"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold leading-tight text-[#5b3215] sm:text-xs">
              이동 · 기술 구현·측정
            </span>
            <strong className="mt-1 block text-[13px] font-extrabold leading-tight sm:text-[15px]">
              Claude Code 실무 과정
            </strong>
          </span>
          <span aria-hidden className="shrink-0 text-lg leading-none transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </nav>
  );
}
