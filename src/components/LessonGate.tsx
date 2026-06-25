"use client";

import Link from "next/link";
import { useState } from "react";

// 강의안(강의 상세 본문) 접근 게이트.
// 접근 코드 = 오늘 날짜 YYMMDD (예: 2026-06-25 → "260625"). 매일 자동으로 바뀐다.
// 통과는 그 페이지를 보는 동안만 유효(저장 안 함) — 떠나거나 새로고침하면 다시 묻는다. 커리큘럼·목록·홈은 게이트 밖이라 공개.

function todayCode(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

export default function LessonGate({
  children,
  accent = "#6366f1",
}: {
  children: React.ReactNode;
  accent?: string;
}) {
  const [authed, setAuthed] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim() === todayCode()) {
      setError(false);
      setAuthed(true);
    } else {
      setError(true);
    }
  }

  // 저장하지 않는다 — 페이지를 떠나거나 새로고침하면 다시 코드를 묻는다.
  if (authed) return <>{children}</>;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 0 8px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          boxShadow: "0 10px 40px rgba(15,23,42,0.08)",
          padding: "36px 28px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 10 }} aria-hidden>
          🔒
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
          수강생 전용 강의안
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#64748b", margin: "0 0 22px" }}>
          이 강의안은 오늘의 접근 코드가 있어야 볼 수 있습니다.
          <br />
          강사가 안내한 6자리 코드를 입력하세요.
        </p>
        <form onSubmit={onSubmit}>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            inputMode="numeric"
            autoFocus
            maxLength={6}
            aria-label="접근 코드"
            style={{
              width: "100%",
              boxSizing: "border-box",
              fontSize: 22,
              letterSpacing: 6,
              textAlign: "center",
              padding: "12px 14px",
              border: `2px solid ${error ? "#ef4444" : "#cbd5e1"}`,
              borderRadius: 12,
              outline: "none",
              marginBottom: 12,
            }}
          />
          {error && (
            <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 12px" }}>
              접근 코드가 올바르지 않습니다. 강사에게 오늘의 코드를 확인하세요.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              background: accent,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            강의안 열기
          </button>
        </form>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "18px 0 0" }}>
          커리큘럼은 코드 없이 볼 수 있습니다.{" "}
          <Link href="/curriculum" style={{ color: accent, fontWeight: 600 }}>
            커리큘럼 보기 →
          </Link>
        </p>
      </div>
    </div>
  );
}
