"use client";

import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_WEIGHTS,
  calculateLevelResult,
  getDefaultResultStorageKey,
  getLessonTitle,
  getPointForChoiceKey,
  isPublicLessonId,
  LEVEL_QUESTIONS,
  type LevelTestAnswers,
  type LevelTestResult,
  parseLevelTestState,
  restoreLevelTestResult,
  LEVEL_TEST_STORAGE_VERSION,
} from "@/lib/levelTest";
import GrowthPath from "@/components/GrowthPath";

const STORAGE_KEY = getDefaultResultStorageKey();
const LEGACY_STORAGE_KEYS = ["level-test:v1"];
const CATEGORY_LABELS: Record<string, string> = {
  concept: "개념이해",
  tool: "도구숙련",
  work: "업무적용",
  safety: "검증·보안습관",
};

const MAX = LEVEL_QUESTIONS.length;

type Persisted = {
  version: number;
  answers: Array<number>;
  currentIndex: number;
  completed: boolean;
};

export default function LevelTestClient() {
  const [answers, setAnswers] = useState<Array<number>>(Array.from({ length: MAX }, () => -1));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<LevelTestResult | null>(null);
  const [started, setStarted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const answeredCount = useMemo(() => answers.filter((value) => value >= 0 && value <= 3).length, [answers]);
  const canGoNext = answers[currentIndex] >= 0 && answers[currentIndex] <= 3;
  const canSubmit = answers.every((value) => value >= 0 && value <= 3);
  const currentQuestion = LEVEL_QUESTIONS[currentIndex] ?? LEVEL_QUESTIONS[0];

  useEffect(() => {
    // 문항 의미가 바뀐 이전 진단은 새 문항의 답으로 해석하지 않습니다.
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = parseLevelTestState(raw);
      if (!parsed || parsed.version !== LEVEL_TEST_STORAGE_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const normalized = parsed.answers.map((item) => (Number.isInteger(item) ? item : -1));
      const filled = [...Array.from({ length: MAX }, () => -1)];
      for (let i = 0; i < Math.min(MAX, normalized.length); i++) {
        filled[i] = normalized[i] as number;
      }

      setAnswers(filled);
      setCurrentIndex(parsed.currentIndex);
      const restoredResult = restoreLevelTestResult(parsed);
      if (restoredResult) {
        setResult(restoredResult);
        setStarted(false);
      } else {
        setStarted(parsed.currentIndex > 0 || filled.some((value) => value >= 0));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: Persisted = {
      version: LEVEL_TEST_STORAGE_VERSION,
      answers,
      currentIndex,
      completed: result !== null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [answers, currentIndex, hydrated, result]);

  function setAnswer(value: number) {
    if (value < 0 || value > 3) return;

    setStatusMessage("");
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = value;
      return next;
    });
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLElement>) {
    const point = getPointForChoiceKey(currentQuestion, event.key);
    if (point !== null) {
      event.preventDefault();
      setAnswer(point);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      setCurrentIndex((value) => Math.max(0, value - 1));
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (!canGoNext) return;
      if (currentIndex + 1 >= MAX) return;
      setCurrentIndex((value) => Math.min(MAX - 1, value + 1));
    }

    if (event.key === "Enter" && canGoNext) {
      if (currentIndex + 1 >= MAX) {
        submit();
      } else {
        setCurrentIndex((value) => value + 1);
      }
    }
  }

  function next() {
    if (!canGoNext) {
      setStatusMessage("현재 문항을 먼저 선택해 주세요.");
      return;
    }

    if (currentIndex + 1 >= MAX) {
      submit();
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  function prev() {
    setStatusMessage("");
    setCurrentIndex((value) => Math.max(0, value - 1));
  }

  function submit() {
    if (!canSubmit) {
      setStatusMessage("모든 문항에 응답해야 결과를 볼 수 있습니다.");
      return;
    }

    try {
      const resolved = calculateLevelResult(
        answers as LevelTestAnswers,
        isPublicLessonId,
      );
      setResult(resolved);
      setStarted(false);
      setStatusMessage("진단 결과를 확인했습니다.");
    } catch {
      setStatusMessage("채점 중 오류가 발생했습니다. 페이지를 새로고침 후 다시 진행해 주세요.");
    }
  }

  function restart() {
    setResult(null);
    setAnswers(Array.from({ length: MAX }, () => -1));
    setCurrentIndex(0);
    setStarted(false);
    setStatusMessage("새로 시작합니다.");
    localStorage.removeItem(STORAGE_KEY);
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">수준진단 결과</h1>
            <p className="text-sm text-slate-500 mb-6">{new Date(result.finishedAt).toLocaleString("ko-KR")}</p>

            {result.isSafeEssential && (
              <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800" role="status">
                <p className="font-semibold">안전기초 필수</p>
                <p>{result.safeReason}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">총점</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{result.score} / 100</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">유형</p>
                <p className="mt-2 text-2xl font-extrabold text-teal-700">{result.type.title}</p>
                <p className="mt-1 text-sm text-slate-600">{result.type.description}</p>
              </div>
            </div>

            <section className="mb-6" aria-label="영역별 점수">
              <h2 className="font-semibold text-slate-900 mb-3">영역별 진단</h2>
              <div className="space-y-3">
                {result.categoryScores.map((item) => {
                  const width = Number.isFinite(item.percentage) ? item.percentage : 0;
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{CATEGORY_LABELS[item.category]}</span>
                        <span className="text-slate-500">{item.score}/{item.maxScore}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-teal-500 transition-all"
                          style={{ width: `${Math.max(0, Math.min(100, width))}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{Math.round(width)}%</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mb-6" aria-label="추천 강의">
              <h2 className="font-semibold text-slate-900 mb-3">지금 시작할 강의</h2>
              <ul className="space-y-2">
                {result.recommendedLessonUrls.slice(0, 5).map((url) => {
                  const lessonId = url.replace(/^\/lessons\//, "");
                  return (
                    <li key={url}>
                      <a
                        href={url}
                        className="inline-flex items-center min-h-[44px] gap-2 text-sm text-teal-700 hover:underline"
                        aria-label={`${getLessonTitle(lessonId)} 강의로 바로가기`}
                      >
                        {getLessonTitle(lessonId)}
                        <span aria-hidden>→</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="mb-6 rounded-xl border border-teal-200 bg-teal-50 p-4" aria-label="질문 읽기 설명 연습">
              <h2 className="font-semibold text-slate-900 mb-2">30초 판단 설명 연습</h2>
              <p className="text-sm leading-relaxed text-slate-700">
                이 진단 점수와 별도로, 방금 다룬 업무 하나를 소리 내어 설명해 보세요. 말의 속도·유창함은 채점하지 않고, 근거를 읽고 판단을 조정하는지 스스로 점검하는 연습입니다.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700 list-disc pl-5">
                <li>누구에게 어떤 한 가지를 알리고, 다음에 어떤 판단·행동을 요청할지 정합니다.</li>
                <li>결론 1문장 · 핵심어 3개 · 확인한 근거 2개를 말합니다.</li>
                <li>반론 또는 한계 1개와, 어떤 새 근거가 나오면 유지·수정·유보할지 말합니다.</li>
              </ul>
              <p className="mt-3 text-sm text-slate-700">
                같은 내용을 30초·1분·3분으로 길이만 바꿔 설명해 보세요. 원고를 더 매끄럽게 외우는 것보다 질문 → 근거 읽기 → 자기 언어 설명 → 반론·조건 변화 대응의 흐름이 남는지가 기준입니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link href="/lessons/1-3" className="text-teal-700 hover:underline">좋은 프롬프트의 조건 →</Link>
                <Link href="/lessons/1-5" className="text-teal-700 hover:underline">AI와 대화하는 기술 →</Link>
                <Link href="/lessons/6-17" className="text-teal-700 hover:underline">판단력과 도구의 증폭 →</Link>
              </div>
            </section>

            <section className="mb-6" aria-label="교차 안내">
              <h2 className="font-semibold text-slate-900 mb-3">추천 진입 경로</h2>
              <ul className="space-y-2">
                {result.type.crossLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center min-h-[44px] gap-2 text-sm text-slate-700 hover:text-slate-900 hover:underline"
                    >
                      {link.label}
                      <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <GrowthPath compact />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={restart}
                className="min-h-[44px] px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold"
              >
                다시하기
              </button>
              <a
                href="/curriculum"
                className="min-h-[44px] inline-flex items-center px-5 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                커리큘럼 바로가기
              </a>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <section className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">AI업무능력 수준진단</h1>
          <p className="text-slate-600 leading-relaxed">
            총 20문항으로 질문 설계, 근거 읽기, 업무 적용, 검증·보안습관을 살피고
            지금 바로 시작할 추천 강의 루트를 제안합니다. 교육용 간이진단이므로 실제 구술 능력이나 말의 속도·유창함을 측정하지 않습니다. 답변은 브라우저의 localStorage에만 저장되며 서버로 전송되지 않습니다.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
            <p>완성 기준: 20문항 완성</p>
            <p>영역 비중: 개념이해 25%, 도구숙련 25%, 업무적용 30%, 검증·보안습관 20%</p>
            <p>결과 뒤에는 질문 → 근거 읽기 → 자기 언어 설명 → 반론·조건 변화 대응을 30초로 연습합니다.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStarted(true);
              setStatusMessage("");
            }}
            className="mt-6 min-h-[44px] inline-flex items-center px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold"
          >
            진단 시작
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-5 md:p-7">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <p>
            {currentIndex + 1} / {MAX} 문항
          </p>
          <p>완료 {answeredCount}문항</p>
        </div>

        <div className="h-2 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={MAX} aria-valuenow={answeredCount}>
          <div className="h-full bg-teal-500" style={{ width: `${(answeredCount / MAX) * 100}%` }} />
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-6 mb-4">{currentQuestion.text}</h1>

        <fieldset onKeyDown={handleQuestionKeyDown} className="mt-6 space-y-3" aria-live="polite" aria-label={`현재 문항: ${currentIndex + 1}번`}>
          <div className="sr-only">숫자 1~4 또는 화살표, Enter 키로도 조작할 수 있습니다.</div>
          {currentQuestion.options.map((option, optionIndex) => {
            const selected = answers[currentIndex] === option.point;
            return (
              <button
                key={`${currentQuestion.id}-${optionIndex}`}
                type="button"
                onClick={() => setAnswer(option.point)}
                className={`w-full text-left rounded-xl border p-4 min-h-[56px] transition-all ${
                  selected
                    ? "bg-teal-50 border-teal-300 text-teal-900"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
                aria-pressed={selected}
              >
                <span className="font-medium text-slate-900 mr-2">{optionIndex + 1}.</span>
                <span className="text-slate-700">{option.label}</span>
              </button>
            );
          })}
        </fieldset>

        {statusMessage && (
          <p role="status" className="mt-4 text-sm text-red-600" aria-live="assertive">
            {statusMessage}
          </p>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            className="min-h-[44px] px-5 py-3 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40"
          >
            이전
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentIndex >= MAX}
            className="min-h-[44px] px-5 py-3 rounded-lg bg-teal-600 text-white font-semibold disabled:opacity-50"
          >
            {currentIndex + 1 >= MAX ? "결과 보기" : "다음"}
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          키보드: 1~4 점수 선택, Enter(다음), 방향키 이동
        </p>
      </div>
    </div>
  );
}
