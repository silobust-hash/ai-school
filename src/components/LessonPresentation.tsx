"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { lessonToSlides, type LessonLike, type Slide, type SlideBlock } from "@/lib/lessonToSlides";

// 현장 강의용 풀스크린 발표 모드.
// 강의 데이터를 슬라이드로 변환해 빔프로젝터에 띄우고 키보드로 넘긴다.
// accent: 사이트별 강조색(edu=indigo, ai-school=teal 등). 인라인 스타일이라 Tailwind 안 탐.

export default function LessonPresentation({
  lesson,
  accent = "#6366f1",
}: {
  lesson: LessonLike;
  accent?: string;
}) {
  const slides = useMemo(() => lessonToSlides(lesson), [lesson]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  const total = slides.length;
  const clamp = useCallback((n: number) => Math.max(0, Math.min(total - 1, n)), [total]);
  const next = useCallback(() => setIdx((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIdx((i) => clamp(i - 1)), [clamp]);

  const start = useCallback(() => {
    setIdx(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          setIdx(0);
          break;
        case "End":
          e.preventDefault();
          setIdx(total - 1);
          break;
        case "Escape":
          // 전체화면 중이면 브라우저가 먼저 해제하므로, 오버레이는 다음 Esc에 닫힘
          if (!document.fullscreenElement) close();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev, close, toggleFullscreen, total]);

  return (
    <>
      <button
        onClick={start}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: `1px solid ${accent}`,
          color: accent,
          background: "transparent",
          borderRadius: 9999,
          padding: "8px 18px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
        }}
        aria-label="발표 모드로 강의 보기"
      >
        <span aria-hidden>🖥</span> 발표 모드
      </button>

      {open && (
        <div
          ref={overlayRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#0b1220",
            color: "#f1f5f9",
            display: "flex",
            flexDirection: "column",
            fontFamily:
              "system-ui, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* 진행바 */}
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", flexShrink: 0 }}>
            <div
              style={{
                height: "100%",
                width: `${((idx + 1) / total) * 100}%`,
                background: accent,
                transition: "width 0.2s ease",
              }}
            />
          </div>

          {/* 슬라이드 영역 */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(28px, 6vw, 96px)",
            }}
            onClick={(e) => {
              // 오른쪽 절반 클릭 = 다음, 왼쪽 = 이전 (현장에서 마우스/포인터로도 넘김)
              const x = e.clientX;
              if (x > window.innerWidth / 2) next();
              else prev();
            }}
          >
            <SlideView slide={slides[idx]} accent={accent} />
          </div>

          {/* 하단 컨트롤 */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px clamp(16px, 4vw, 48px)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
              {lesson.id ? `${lesson.id} · ` : ""}
              {idx + 1} / {total}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <CtrlBtn onClick={prev} disabled={idx === 0}>← 이전</CtrlBtn>
              <CtrlBtn onClick={next} disabled={idx === total - 1}>다음 →</CtrlBtn>
              <CtrlBtn onClick={toggleFullscreen}>⛶ 전체화면</CtrlBtn>
              <CtrlBtn onClick={close}>✕ 닫기 (Esc)</CtrlBtn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CtrlBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.06)",
        color: "#f1f5f9",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Blocks({ blocks, accent }: { blocks: SlideBlock[]; accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 22px)" }}>
      {blocks.map((b, i) =>
        b.type === "para" ? (
          <p
            key={i}
            style={{
              fontSize: "clamp(1.05rem, 2.1vw, 1.7rem)",
              lineHeight: 1.55,
              color: "#e2e8f0",
              margin: 0,
            }}
          >
            {b.text}
          </p>
        ) : (
          <ul key={i} style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "clamp(8px, 1.4vw, 16px)" }}>
            {b.items.map((it, j) => (
              <li
                key={j}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  fontSize: "clamp(1.05rem, 2.05vw, 1.6rem)",
                  lineHeight: 1.5,
                  color: "#e2e8f0",
                }}
              >
                <span style={{ color: accent, flexShrink: 0, fontWeight: 800 }} aria-hidden>›</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

function SlideView({ slide, accent }: { slide: Slide; accent: string }) {
  const maxW = { maxWidth: 1100, width: "100%", margin: "0 auto" } as const;

  if (slide.kind === "title") {
    return (
      <div style={maxW}>
        {slide.phase && (
          <div
            style={{
              display: "inline-block",
              border: `1px solid ${accent}`,
              color: accent,
              borderRadius: 9999,
              padding: "6px 16px",
              fontSize: "clamp(0.8rem, 1.4vw, 1rem)",
              fontWeight: 700,
              marginBottom: 28,
            }}
          >
            {slide.phase}
          </div>
        )}
        <h2
          style={{
            fontSize: "clamp(2rem, 5.2vw, 4.2rem)",
            lineHeight: 1.12,
            fontWeight: 800,
            margin: 0,
            color: "#f8fafc",
          }}
        >
          {slide.title}
        </h2>
        {slide.summary && (
          <p
            style={{
              marginTop: 28,
              fontSize: "clamp(1.05rem, 2.2vw, 1.7rem)",
              lineHeight: 1.5,
              color: "#94a3b8",
            }}
          >
            {slide.summary}
          </p>
        )}
      </div>
    );
  }

  if (slide.kind === "code") {
    return (
      <div style={maxW}>
        <SlideHeading accent={accent}>{slide.heading}</SlideHeading>
        <pre
          style={{
            background: "#020617",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "clamp(16px, 2.5vw, 32px)",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            color: "#86efac",
            fontSize: "clamp(0.85rem, 1.5vw, 1.25rem)",
            lineHeight: 1.6,
            fontFamily: "'SF Mono', Menlo, Consolas, monospace",
            margin: 0,
          }}
        >
          <code>{slide.code}</code>
        </pre>
      </div>
    );
  }

  if (slide.kind === "insight") {
    return (
      <div style={maxW}>
        <div
          style={{
            display: "inline-block",
            background: accent,
            color: "#0b1220",
            borderRadius: 9999,
            padding: "5px 14px",
            fontSize: "clamp(0.78rem, 1.3vw, 0.95rem)",
            fontWeight: 800,
            marginBottom: 20,
          }}
        >
          💡 현장 인사이트
        </div>
        <SlideHeading accent={accent}>{slide.heading}</SlideHeading>
        <Blocks blocks={slide.blocks} accent={accent} />
        {slide.source && (
          <p style={{ marginTop: 24, fontSize: "clamp(0.85rem, 1.4vw, 1.05rem)", color: "#64748b", fontStyle: "italic" }}>
            — {slide.source}
          </p>
        )}
      </div>
    );
  }

  if (slide.kind === "takeaways") {
    return (
      <div style={maxW}>
        <SlideHeading accent={accent}>핵심 정리</SlideHeading>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 22px)" }}>
          {slide.points.map((p, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                fontSize: "clamp(1.05rem, 2.1vw, 1.6rem)",
                lineHeight: 1.5,
                color: "#e2e8f0",
              }}
            >
              <span style={{ color: accent, flexShrink: 0, fontWeight: 800 }} aria-hidden>✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // section
  return (
    <div style={maxW}>
      <SlideHeading accent={accent} part={slide.part}>
        {slide.heading}
      </SlideHeading>
      <Blocks blocks={slide.blocks} accent={accent} />
      {slide.tip && (
        <div
          style={{
            marginTop: "clamp(20px, 3vw, 34px)",
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            borderRadius: 12,
            padding: "clamp(12px, 1.8vw, 20px)",
            fontSize: "clamp(0.9rem, 1.6vw, 1.2rem)",
            lineHeight: 1.5,
            color: "#fcd34d",
          }}
        >
          <span style={{ fontWeight: 800 }}>TIP </span>
          {slide.tip}
        </div>
      )}
    </div>
  );
}

function SlideHeading({
  children,
  accent,
  part,
}: {
  children: React.ReactNode;
  accent: string;
  part?: string;
}) {
  return (
    <h2
      style={{
        fontSize: "clamp(1.5rem, 3.6vw, 2.8rem)",
        lineHeight: 1.2,
        fontWeight: 800,
        margin: "0 0 clamp(20px, 3vw, 36px) 0",
        color: "#f8fafc",
        borderLeft: `5px solid ${accent}`,
        paddingLeft: 18,
      }}
    >
      {children}
      {part && (
        <span style={{ fontSize: "0.5em", color: "#64748b", fontWeight: 600, marginLeft: 12 }}>
          ({part})
        </span>
      )}
    </h2>
  );
}
