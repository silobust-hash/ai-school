"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface LessonInfo {
  id: string;
  title: string;
  hasOverride: boolean;
}

interface PhaseGroup {
  phase: number;
  phaseTitle: string;
  lessons: LessonInfo[];
}

interface DashboardClientProps {
  groupedLessons: PhaseGroup[];
  totalLessons: number;
  totalOverrides: number;
  accessCode: string;
  accessCodeDateCode: string;
  accessCodeExpiresAt: string;
}

export default function DashboardClient({
  groupedLessons,
  totalLessons,
  totalOverrides,
  accessCode,
  accessCodeDateCode,
  accessCodeExpiresAt,
}: DashboardClientProps) {
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">강의 관리</h1>
        <p className="text-sm text-slate-500 mt-1">
          강의 콘텐츠를 수정하고 관리합니다.
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          강의가 성공적으로 저장되었습니다.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-slate-800">{totalLessons}</div>
          <div className="text-sm text-slate-500">전체 강의</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-teal-600">{totalOverrides}</div>
          <div className="text-sm text-slate-500">수정된 강의</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-slate-400">
            {totalLessons - totalOverrides}
          </div>
          <div className="text-sm text-slate-500">기본 데이터 사용</div>
        </div>
        <div className="bg-slate-950 text-white rounded-xl border border-slate-900 p-5">
          <div className="text-xs font-bold text-teal-300">오늘 강의 접근 코드</div>
          <div className="text-2xl font-mono tracking-[0.25em] mt-2 mb-1">{accessCode}</div>
          <div className="text-xs text-slate-300">기준일: {accessCodeDateCode}</div>
          <div className="text-xs text-slate-400 mt-1">
            서울 기준 자정 만료 ({accessCodeExpiresAt})
          </div>
        </div>
      </div>

      {/* Lesson groups */}
      <div className="space-y-8">
        {groupedLessons.map((group) => (
          <div key={group.phase}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-teal-500 bg-teal-50 px-2.5 py-1 rounded-full">
                {group.phase}과
              </span>
              <h2 className="text-lg font-bold text-slate-800">
                {group.phaseTitle}
              </h2>
              <span className="text-xs text-slate-400">
                {group.lessons.length}개 강의
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {group.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-xs font-mono text-slate-400 w-8 shrink-0">
                      {lesson.id}
                    </span>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {lesson.title}
                    </span>
                    {lesson.hasOverride && (
                      <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full shrink-0">
                        수정됨
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <a
                      href={`/lessons/${lesson.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      미리보기
                    </a>
                    <Link
                      href={`/admin/edit/${lesson.id}`}
                      className="text-xs text-white bg-teal-600 hover:bg-teal-700 px-4 py-1.5 rounded-lg transition-colors"
                    >
                      수정
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
