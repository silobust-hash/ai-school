"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllowedLessonIdSet,
  getCompletedCount,
  hasCompletedLesson,
  LESSON_PROGRESS_STORAGE_KEY,
  parseLessonProgress,
  serializeLessonProgress,
  withLessonCompletion,
  withVisitedAt,
  type LessonCatalogItem,
  type LessonLearningProgress,
} from "@/lib/learningProgress";

type LessonProgressTrackerProps = {
  lessonId: string;
  lessonTitle: string;
  lessonCatalog: LessonCatalogItem[];
};

const fallback: LessonLearningProgress = {
  version: 1,
  completedLessonIds: [],
  lastVisited: null,
};

export default function LessonProgressTracker({
  lessonId,
  lessonTitle,
  lessonCatalog,
}: LessonProgressTrackerProps) {
  const allowed = useMemo(() => getAllowedLessonIdSet(lessonCatalog), [lessonCatalog]);
  const [progress, setProgress] = useState<LessonLearningProgress>(() => fallback);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LESSON_PROGRESS_STORAGE_KEY);
    const parsed = parseLessonProgress(raw, allowed);
    const withVisit = withVisitedAt(
      parsed,
      { id: lessonId, title: lessonTitle, at: new Date().toISOString() },
      allowed,
    );
    setProgress(withVisit);
    setInitialized(true);
  }, [allowed, lessonId, lessonTitle]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(LESSON_PROGRESS_STORAGE_KEY, serializeLessonProgress(progress));
  }, [progress, initialized]);

  const checked = hasCompletedLesson(progress, lessonId);

  return (
    <section className="mt-8 rounded-2xl border border-teal-100 bg-white p-5 md:p-6" aria-live="polite">
      <h2 className="text-sm font-bold text-slate-900 mb-4">학습 완료</h2>
      <label
        htmlFor="lesson-complete-toggle"
        className="inline-flex min-h-[44px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100"
      >
        <input
          id="lesson-complete-toggle"
          type="checkbox"
          checked={checked}
          aria-label={`${lessonTitle} 학습 완료로 표시`}
          className="h-5 w-5 text-teal-600 border-slate-300 rounded shrink-0"
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setProgress((prev) => {
              const next = withLessonCompletion(prev, lessonId, target.checked, allowed);
              return withVisitedAt(
                next,
                {
                  id: lessonId,
                  title: lessonTitle,
                  at: new Date().toISOString(),
                },
                allowed,
              );
            });
          }}
        />
        <span className="text-sm text-slate-700">현재 강의 학습 완료로 표시</span>
      </label>

      <p className="text-xs text-slate-500 mt-3">현재까지 완료: {getCompletedCount(progress)}개</p>
    </section>
  );
}
