type LessonActionSource = {
  id?: string;
  phase?: string;
  title?: string;
  summary?: string;
  keyTakeaways?: string[];
};

function firstTakeaway(lesson: LessonActionSource) {
  return lesson.keyTakeaways?.[0] ?? lesson.summary ?? "오늘 배운 내용을 내 업무에 적용한다.";
}

export default function LessonActionKit({ lesson }: { lesson: LessonActionSource }) {
  const title = lesson.title ?? "이번 강의";
  const takeaway = firstTakeaway(lesson);
  const prompt = `나는 비개발자 실무자입니다. "${title}" 강의를 들었습니다.

내 업무 상황:
- 반복해서 시간이 걸리는 업무:
- 지금 막히는 지점:
- 오늘 30분 안에 만들고 싶은 결과물:

요청:
1. 이 강의의 핵심을 내 업무 기준으로 3줄 요약해줘.
2. 바로 실행할 수 있는 첫 작업 3개를 순서대로 정리해줘.
3. 내가 AI에게 붙여넣을 최종 프롬프트를 하나 만들어줘.
4. 결과물을 검수할 체크리스트를 5개로 만들어줘.`;

  const checkpoints = [
    "오늘 만들 결과물이 한 문장으로 정리됐는가",
    "AI에게 맡길 일과 사람이 판단할 일이 분리됐는가",
    "민감정보를 제거하거나 가명 처리했는가",
    "결과물을 복사해 실제 업무 파일에 붙일 수 있는가",
  ];

  return (
    <section className="mt-10 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
            Practice Kit
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            수업 후 바로 남길 결과물
          </h2>
        </div>
        <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
          {lesson.phase ?? "실습"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          ["1", "핵심 재정리", takeaway],
          ["2", "내 업무 연결", "반복 업무 하나를 골라 AI에게 맡길 단위로 쪼갭니다."],
          ["3", "작은 산출물", "요약문, 체크리스트, 초안, 자동화 지시문 중 하나를 완성합니다."],
        ].map(([num, heading, body]) => (
          <article key={heading} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-600 text-xs font-bold text-white">
              {num}
            </span>
            <h3 className="mt-3 text-sm font-bold text-slate-800">{heading}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{body}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-950 p-5">
        <p className="mb-3 text-sm font-bold text-teal-200">AI에게 붙여넣을 복습 프롬프트</p>
        <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
          <code>{prompt}</code>
        </pre>
      </div>

      <div className="mt-5 rounded-xl bg-teal-50 p-4">
        <h3 className="text-sm font-bold text-teal-800">검수 기준</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {checkpoints.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-teal-800">
              <span className="mt-0.5 text-teal-500" aria-hidden>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
