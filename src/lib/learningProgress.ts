const STORAGE_VERSION = 1;

export const LESSON_PROGRESS_STORAGE_VERSION = STORAGE_VERSION;
export const LESSON_PROGRESS_STORAGE_KEY = "ai-school-learning-progress-v1";

export type LessonCatalogItem = {
  id: string;
  title: string;
};

export type LessonProgressLastVisited = {
  id: string;
  title: string;
  at: string;
};

export type LessonLearningProgress = {
  version: number;
  completedLessonIds: string[];
  lastVisited?: LessonProgressLastVisited | null;
};

export type LessonProgressInput = {
  id: string;
  title: string;
  at?: string;
};

export function getAllowedLessonIdSet(lessons: LessonCatalogItem[]): Set<string> {
  return new Set(lessons.map((lesson) => lesson.id));
}

export function isValidLessonId(id: string): boolean {
  return /^\d+-\d+$/.test(id);
}

export function sanitizeCompletedLessons(rawIds: unknown[], allowed: Set<string>): string[] {
  const next = new Set<string>();

  for (const value of rawIds) {
    if (typeof value !== "string") continue;
    if (!isValidLessonId(value)) continue;
    if (!allowed.has(value)) continue;
    next.add(value);
  }

  return [...next];
}

export function parseLessonProgress(raw: string | null, allowed: Set<string>): LessonLearningProgress {
  if (!raw) {
    return {
      version: LESSON_PROGRESS_STORAGE_VERSION,
      completedLessonIds: [],
      lastVisited: null,
    };
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      throw new Error("invalid payload");
    }

    const version = typeof parsed.version === "number" ? parsed.version : NaN;
    if (version !== LESSON_PROGRESS_STORAGE_VERSION) {
      throw new Error("invalid version");
    }

    const completedLessonIds = Array.isArray(parsed.completedLessonIds)
      ? sanitizeCompletedLessons(parsed.completedLessonIds.filter((value) => typeof value === "string"), allowed)
      : [];

    let lastVisited: LessonProgressLastVisited | null = null;
    const rawLastVisited = parsed.lastVisited;
    if (typeof rawLastVisited === "object" && rawLastVisited !== null) {
      const visited = rawLastVisited as Record<string, unknown>;
      const id = typeof visited.id === "string" ? visited.id : "";
      const title = typeof visited.title === "string" ? visited.title : "";
      const at = typeof visited.at === "string" ? visited.at : "";
      const atMs = at ? Date.parse(at) : NaN;
      const atValid = Number.isFinite(atMs) && atMs > 0;
      if (id && title && isValidLessonId(id) && allowed.has(id) && atValid) {
        lastVisited = { id, title, at: new Date(atMs).toISOString() };
      }
    }

    return {
      version: LESSON_PROGRESS_STORAGE_VERSION,
      completedLessonIds,
      lastVisited,
    };
  } catch {
    return {
      version: LESSON_PROGRESS_STORAGE_VERSION,
      completedLessonIds: [],
      lastVisited: null,
    };
  }
}

export function buildLessonProgressState(input: {
  completedLessonIds: string[];
  lastVisited?: LessonProgressLastVisited | null;
}): LessonLearningProgress {
  return {
    version: LESSON_PROGRESS_STORAGE_VERSION,
    completedLessonIds: input.completedLessonIds,
    lastVisited: input.lastVisited ?? null,
  };
}

export function serializeLessonProgress(progress: LessonLearningProgress): string {
  return JSON.stringify(progress);
}

export function getCompletedCount(progress: LessonLearningProgress): number {
  return progress.completedLessonIds.length;
}

export function hasCompletedLesson(progress: LessonLearningProgress, lessonId: string): boolean {
  return progress.completedLessonIds.includes(lessonId);
}

export function withVisitedAt(
  progress: LessonLearningProgress,
  item: LessonProgressInput,
  allowed: Set<string>,
): LessonLearningProgress {
  if (!allowed.has(item.id) || !isValidLessonId(item.id) || !item.id) {
    return progress;
  }
  const atMs = item.at ? Date.parse(item.at) : Date.now();
  if (!Number.isFinite(atMs) || atMs <= 0) {
    return progress;
  }

  return {
    ...progress,
    lastVisited: {
      id: item.id,
      title: item.title,
      at: new Date(atMs).toISOString(),
    },
  };
}

export function withLessonCompletion(
  progress: LessonLearningProgress,
  lessonId: string,
  checked: boolean,
  allowed: Set<string>,
): LessonLearningProgress {
  if (!allowed.has(lessonId) || !isValidLessonId(lessonId)) {
    return progress;
  }

  const set = new Set(progress.completedLessonIds);
  if (checked) {
    set.add(lessonId);
  } else {
    set.delete(lessonId);
  }

  return {
    ...progress,
    completedLessonIds: [...set],
  };
}

export function getLessonProgressTitle(lessonId: string, lessonCatalog: LessonCatalogItem[]): string {
  return lessonCatalog.find((item) => item.id === lessonId)?.title || "강의";
}
