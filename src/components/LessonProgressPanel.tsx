"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getAllowedLessonIdSet,
  getCompletedCount,
  getLessonProgressTitle,
  LESSON_PROGRESS_STORAGE_KEY,
  parseLessonProgress,
  serializeLessonProgress,
  type LessonCatalogItem,
  type LessonLearningProgress,
} from "@/lib/learningProgress";

type LessonProgressPanelProps = {
  lessonCatalog: LessonCatalogItem[];
  totalLessons: number;
};

const fallback: LessonLearningProgress = {
  version: 1,
  completedLessonIds: [],
  lastVisited: null,
};

function formatVisitedAt(dateText?: string) {
  if (!dateText) return "최근";
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "최근";
  return date.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LessonProgressPanel({ lessonCatalog, totalLessons }: LessonProgressPanelProps) {
  const allowed = useMemo(() => getAllowedLessonIdSet(lessonCatalog), [lessonCatalog]);
  const [progress, setProgress] = useState<LessonLearningProgress>(() => fallback);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LESSON_PROGRESS_STORAGE_KEY);
      const parsed = parseLessonProgress(raw, allowed);
      setProgress(parsed);
    } catch {
      setProgress(fallback);
    } finally {
      setInitialized(true);
    }
  }, [allowed]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(LESSON_PROGRESS_STORAGE_KEY, serializeLessonProgress(progress));
  }, [progress, initialized]);

  return (
    <section className="rounded-2xl border border-teal-100 bg-white p-5 md:p-6 mb-8" aria-live="polite">
      <p className="text-sm text-slate-500">학습 완료</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">완료 {getCompletedCount(progress)} / {totalLessons}</p>

      {progress.lastVisited ? (
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-medium text-slate-700">마지막 본 강의로 이어보기</span>
          :{" "}
          <Link
            href={`/lessons/${progress.lastVisited.id}`}
            className="text-teal-600 hover:text-teal-700 underline-offset-2 hover:underline"
          >
            {getLessonProgressTitle(progress.lastVisited.id, lessonCatalog)}
          </Link>
          <span className="text-slate-400"> ({formatVisitedAt(progress.lastVisited.at)})</span>
        </p>
      ) : null}
    </section>
  );
}
