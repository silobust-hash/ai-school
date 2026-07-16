"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/curriculum", label: "커리큘럼" },
  { href: "/lessons", label: "강의 목록" },
  { href: "/level-test", label: "수준진단" },
  { href: "/about", label: "소개" },
];

/**
 * Scroll-aware sticky navigation.
 * - Transparent-ish at top, gains a solid blurred surface + hairline on scroll.
 * - Mobile: collapsible menu.
 * Copy and route targets are unchanged from the original layout.
 */
export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-bg)]/85 backdrop-blur-xl border-b border-[var(--color-border)] shadow-[0_1px_0_rgba(22,32,30,0.03)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white text-[15px] font-extrabold shadow-sm transition-transform group-hover:-rotate-6">
              AI
            </span>
            <span className="text-[17px] font-extrabold tracking-tight text-[var(--color-ink)]">
              업무학교
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 min-h-[44px] rounded-lg text-sm font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-soft)]/60 transition-colors flex items-center"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://edu.silronomu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-lg text-sm font-semibold text-white bg-[var(--color-primary-deep)] hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              클로드 코드 심화
              <span aria-hidden className="text-[var(--color-accent)]">→</span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden grid place-items-center w-11 h-11 min-h-[44px] rounded-lg text-[var(--color-ink)] hover:bg-[var(--color-primary-soft)]/60 transition-colors"
          >
            <span className="relative block w-5 h-[14px]">
              <span
                className={`absolute left-0 block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-[2px] w-full bg-current rounded-full transition-all duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 min-h-[44px] rounded-lg text-[15px] font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-primary-soft)]/60 transition-colors flex items-center"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://edu.silronomu.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg text-[15px] font-semibold text-white bg-[var(--color-primary-deep)]"
          >
            클로드 코드 심화
            <span aria-hidden className="text-[var(--color-accent)]">→</span>
          </a>
          </div>
        </div>
      )}
    </nav>
  );
}
