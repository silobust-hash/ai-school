"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Section {
  heading: string;
  content: string;
  code?: string;
  tip?: string;
}

interface LessonData {
  id: string;
  phase: string;
  title: string;
  summary: string;
  prev: string | null;
  next: string | null;
  sections: Section[];
  keyTakeaways: string[];
}

interface LessonEditorProps {
  id: string;
  initialData: LessonData;
  source: string;
}

export default function LessonEditor({
  id,
  initialData,
  source,
}: LessonEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title || "");
  const [summary, setSummary] = useState(initialData.summary || "");
  const [sections, setSections] = useState<Section[]>(
    initialData.sections || []
  );
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(
    initialData.keyTakeaways || []
  );
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function updateSection(index: number, field: keyof Section, value: string) {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addSection() {
    setSections((prev) => [
      ...prev,
      { heading: "", content: "", code: "", tip: "" },
    ]);
  }

  function removeSection(index: number) {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  function moveSection(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    setSections((prev) => {
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  }

  function addTakeaway() {
    setKeyTakeaways((prev) => [...prev, ""]);
  }

  function removeTakeaway(index: number) {
    setKeyTakeaways((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTakeaway(index: number, value: string) {
    setKeyTakeaways((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }

  async function handleSave() {
    setError("");
    setSuccessMsg("");
    setSaving(true);

    try {
      // Clean up sections - remove empty optional fields
      const cleanedSections = sections.map((s) => {
        const cleaned: Section = {
          heading: s.heading,
          content: s.content,
        };
        if (s.code?.trim()) cleaned.code = s.code;
        if (s.tip?.trim()) cleaned.tip = s.tip;
        return cleaned;
      });

      const data = {
        id,
        phase: initialData.phase,
        title,
        summary,
        prev: initialData.prev,
        next: initialData.next,
        sections: cleanedSections,
        keyTakeaways: keyTakeaways.filter((t) => t.trim()),
      };

      const res = await fetch(`/api/admin/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "저장에 실패했습니다.");
      }

      router.push("/admin/dashboard?saved=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("정적 데이터로 초기화하시겠습니까? 수정한 내용이 모두 사라집니다.")) {
      return;
    }

    setResetting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/lessons/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("초기화에 실패했습니다.");
      }

      // Reload to get static data
      router.refresh();
      setSuccessMsg("정적 데이터로 초기화되었습니다. 페이지를 새로고침합니다.");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "초기화에 실패했습니다.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/dashboard"
              className="text-sm text-teal-500 hover:text-teal-700 transition-colors"
            >
              ← 대시보드로
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">강의 수정</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-mono text-slate-400">{id}</span>
            <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">
              {initialData.phase}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                source === "blob"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {source === "blob" ? "수정된 데이터" : "기본 데이터"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`/lessons/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
          >
            미리보기
          </a>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          {successMsg}
        </div>
      )}

      {/* Form */}
      <div className="space-y-8">
        {/* Title */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="강의 제목"
          />
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            요약
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
            placeholder="강의 요약 설명"
          />
        </div>

        {/* Sections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">섹션</h2>
            <button
              type="button"
              onClick={addSection}
              className="text-sm text-teal-600 hover:text-teal-700 px-4 py-2 rounded-lg border border-teal-200 hover:border-teal-300 transition-colors"
            >
              + 섹션 추가
            </button>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500">
                    섹션 {index + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-30 px-2 py-1 rounded border border-slate-200"
                      title="위로 이동"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                      className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-30 px-2 py-1 rounded border border-slate-200"
                      title="아래로 이동"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      disabled={sections.length <= 1}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-30 px-2 py-1 rounded border border-red-200"
                      title="섹션 삭제"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      제목 (heading)
                    </label>
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) =>
                        updateSection(index, "heading", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="섹션 제목"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      내용 (content)
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) =>
                        updateSection(index, "content", e.target.value)
                      }
                      rows={8}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y font-mono"
                      placeholder="섹션 내용"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      코드 (선택)
                    </label>
                    <textarea
                      value={section.code || ""}
                      onChange={(e) =>
                        updateSection(index, "code", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y font-mono bg-slate-50"
                      placeholder="코드 블록 (선택사항)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      팁 (선택)
                    </label>
                    <textarea
                      value={section.tip || ""}
                      onChange={(e) =>
                        updateSection(index, "tip", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                      placeholder="팁 (선택사항)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">핵심 정리</h2>
            <button
              type="button"
              onClick={addTakeaway}
              className="text-sm text-teal-600 hover:text-teal-700 px-4 py-2 rounded-lg border border-teal-200 hover:border-teal-300 transition-colors"
            >
              + 항목 추가
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            {keyTakeaways.length === 0 && (
              <p className="text-sm text-slate-400">
                핵심 정리 항목이 없습니다. 위 버튼으로 추가하세요.
              </p>
            )}
            {keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-sm text-teal-500 mt-2.5 shrink-0">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={takeaway}
                  onChange={(e) => updateTakeaway(index, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="핵심 정리 항목"
                />
                <button
                  type="button"
                  onClick={() => removeTakeaway(index)}
                  className="text-xs text-red-400 hover:text-red-600 px-3 py-1 rounded-lg border border-red-200 shrink-0"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <div className="flex gap-2">
            {source === "blob" && (
              <button
                type="button"
                onClick={handleReset}
                disabled={resetting}
                className="text-sm text-amber-600 hover:text-amber-700 px-4 py-2.5 rounded-lg border border-amber-200 hover:border-amber-300 disabled:opacity-50 transition-colors"
              >
                {resetting ? "초기화 중..." : "정적 데이터로 초기화"}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="text-sm text-slate-600 hover:text-slate-800 px-6 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              취소
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="text-sm text-white bg-teal-600 hover:bg-teal-700 px-8 py-2.5 rounded-lg disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
