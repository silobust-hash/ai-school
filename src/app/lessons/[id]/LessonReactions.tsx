"use client";

import { useEffect, useState } from "react";

interface Reactions {
  like: number;
  helpful: number;
  difficult: number;
}

const reactionConfig = [
  { type: "like" as const, emoji: "👍", label: "좋아요" },
  { type: "helpful" as const, emoji: "💡", label: "도움됐어요" },
  { type: "difficult" as const, emoji: "🤔", label: "어려워요" },
];

export default function LessonReactions({ lessonId }: { lessonId: string }) {
  const [reactions, setReactions] = useState<Reactions>({ like: 0, helpful: 0, difficult: 0 });
  const [clicked, setClicked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}/reactions`)
      .then((res) => res.json())
      .then(setReactions)
      .catch(() => {});

    const stored = localStorage.getItem(`reactions-${lessonId}`);
    if (stored) setClicked(new Set(JSON.parse(stored)));
  }, [lessonId]);

  const handleReaction = async (type: keyof Reactions) => {
    if (clicked.has(type) || loading) return;

    setLoading(type);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const updated = await res.json();
      setReactions(updated);

      const newClicked = new Set(clicked);
      newClicked.add(type);
      setClicked(newClicked);
      localStorage.setItem(`reactions-${lessonId}`, JSON.stringify([...newClicked]));
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-10">
      <h3 className="font-bold text-slate-700 mb-4 text-center">이 강의가 어떠셨나요?</h3>
      <div className="flex justify-center gap-4">
        {reactionConfig.map(({ type, emoji, label }) => (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={clicked.has(type) || loading === type}
            className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl transition-all ${
              clicked.has(type)
                ? "bg-teal-100 border-2 border-teal-300 scale-105"
                : "bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md hover:scale-105"
            } ${loading === type ? "opacity-50" : ""}`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs font-medium text-slate-600">{label}</span>
            <span className="text-xs font-bold text-teal-600">{reactions[type]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
