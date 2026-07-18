"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setMessage("");

    try {
      const res = await fetch("/api/lesson/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(true);
        setMessage(data.error || "코드가 올바르지 않습니다.");
        return;
      }

      setAuthed(true);
      setMessage("코드가 확인되어 강의안 열람이 허용됩니다.");
      window.location.reload();
    } catch {
      setError(true);
      setMessage("요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  if (authed) return <>{children}</>;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 0 8px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",
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
            onChange={(event) => {
              setValue(event.target.value.replace(/\D/g, "").slice(0, 6));
              setError(false);
              setMessage("");
            }}
            inputMode="numeric"
            pattern="[0-9]{6}"
            minLength={6}
            required
            autoFocus
            maxLength={6}
            aria-label="수강생 접근 코드"
            aria-invalid={error || undefined}
            aria-describedby="lesson-access-help lesson-access-status"
            style={{
              width: "100%",
              boxSizing: "border-box",
              fontSize: 22,
              letterSpacing: 6,
              textAlign: "center",
              padding: "14px 14px",
              border: `2px solid ${error ? "#ef4444" : "#cbd5e1"}`,
              borderRadius: 12,
              outline: "none",
              marginBottom: 12,
            }}
          />
          <p id="lesson-access-help" className="sr-only">
            강의 접근 코드는 강사가 안내한 6자리 숫자 코드입니다.
          </p>
          <div id="lesson-access-live-region" role="status" aria-live="polite" className="sr-only">
            {message}
          </div>
          <p
            id="lesson-access-status"
            role="status"
            aria-live="polite"
            style={{
              color: error ? "#ef4444" : "#16a34a",
              fontSize: 13,
              margin: "0 0 12px",
              minHeight: 20,
              visibility: message ? "visible" : "hidden",
            }}
          >
            {message}
          </p>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              minHeight: 44,
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
            {loading ? "확인 중..." : "강의안 열기"}
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
