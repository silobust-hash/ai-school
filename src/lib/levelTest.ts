export const LEVEL_TEST_QUESTION_COUNT = 20;

export const LEVEL_WEIGHTS = {
  concept: 25,
  tool: 25,
  work: 30,
  safety: 20,
} as const;

export const CATEGORY_WEIGHTS = LEVEL_WEIGHTS;

export type LevelCategory = keyof typeof LEVEL_WEIGHTS;

export type LevelTypeKey =
  | "beginner"
  | "prework"
  | "automation"
  | "architecture";

export type LevelType = {
  key: LevelTypeKey;
  title: string;
  description: string;
  nextSteps: string[];
  crossLinks: Array<{ label: string; url: string; tone: string }>;
};

export type TestOption = {
  label: string;
  point: 0 | 1 | 2 | 3;
};

export type TestQuestion = {
  id: string;
  category: LevelCategory;
  text: string;
  options: [TestOption, TestOption, TestOption, TestOption];
  safetyCritical?: "privacy" | "law" | "approval";
};

export type LevelTestAnswers = Array<number>;

export type LevelCategoryScore = {
  category: LevelCategory;
  score: number;
  maxScore: number;
  percentage: number;
};

export type LevelTestResult = {
  score: number;
  categoryScores: LevelCategoryScore[];
  type: LevelType;
  isSafeEssential: boolean;
  safeReason?: string;
  answeredCount: number;
  recommendedLessonUrls: string[];
  finishedAt: string;
};

export type PersistedLevelTestState = {
  version: number;
  answers: LevelTestAnswers;
  currentIndex: number;
  completed: boolean;
};

// 문항의 관찰 대상이 바뀌면 기존 점수의 의미도 바뀝니다. 이전 응답은 재채점하지 않습니다.
export const LEVEL_TEST_STORAGE_VERSION = 3;

const lessonTitlesById: Record<string, string> = {
  "1-1": "AI가 바꾸는 일하는 방식",
  "1-3": "좋은 프롬프트의 조건",
  "1-5": "AI와 대화하는 기술",
  "2-1": "컨텍스트가 전부다",
  "2-3": "시스템 프롬프트와 커스텀 지침",
  "3-2": "터미널과 친해지기",
  "3-4": "Claude Code 설치하기",
  "4-2": "MCP로 AI 능력 확장하기",
  "4-4": "자동화 워크플로우 설계",
  "5-1": "프론트엔드와 백엔드",
  "5-3": "데이터베이스 기초",
  "6-1": "프롬프트에서 루프까지: 5단 진화",
  "6-2": "2026 최신 모델·제품 지도: Claude Fable 5.1 · GPT-6 Astra",
  "5-5": "실무 자동화 기초",
  "6-4": "업무 루틴 자동화",
  "6-5": "루프 기반 AI 운영",
  "6-11": "에이전트 운영 체계",
  "6-15": "통합 설계 실습",
  "6-16": "코덱스는 채팅창이 아니라 실행형 업무 운영체계다",
};

export const LEVEL_QUESTIONS: readonly TestQuestion[] = [
  {
    id: "q1",
    category: "concept",
    text: "신입사원 대상 교육 안내문 초안을 AI에게 맡깁니다. 목적·대상·맥락·제약을 가장 잘 갖춘 요청은?",
    options: [
      { label: "교육 안내문을 멋지게 써줘.", point: 0 },
      { label: "이번 달 교육 안내문을 짧게 써줘.", point: 1 },
      { label: "신입사원에게 보낼 교육 안내문을 이메일 형식으로 써줘.", point: 2 },
      { label: "다음 주 신입사원 30명에게 교육 참여 목적을 알리는 이메일 초안을 250자 안으로 작성해줘. 일정 미확정 부분은 [확인 필요]로 표시해줘.", point: 3 },
    ],
  },
  {
    id: "q2",
    category: "concept",
    text: "노무 담당자가 AI에 ‘취업규칙 개정 안내문을 작성해줘’라고만 요청했습니다. 먼저 할 후속질문으로 가장 적절한 것은?",
    options: [
      { label: "예전 안내문과 같은 형식으로 바로 작성할게요.", point: 0 },
      { label: "개정 취지만 알려주시면 나머지는 일반적인 내용으로 채울게요.", point: 1 },
      { label: "수신자와 시행일만 확인하면 될까요?", point: 2 },
      { label: "확정된 개정 조항·시행일·적용 대상·확인한 근거·안내 목적과 수신자를 먼저 확인해 주세요.", point: 3 },
    ],
    safetyCritical: "law",
  },
  {
    id: "q3",
    category: "concept",
    text: "원문: ‘GPT-6 Astra는 9월 3일 발표됐고 제한된 조직에 단계적으로 제공된다.’ 이 원문을 읽은 뒤 가장 정확한 정리는?",
    options: [
      { label: "발표됐으므로 모든 계정에서 이미 사용할 수 있다는 사실이다.", point: 0 },
      { label: "발표일과 제한 제공은 적지만, 출처와 내 계정 제공 여부는 확인하지 않는다.", point: 1 },
      { label: "발표일과 제한·단계 제공은 원문 사실이고, 내 계정 사용 가능 여부는 아직 따로 확인해야 한다.", point: 2 },
      { label: "발표일과 제한·단계 제공은 원문 사실이며, 내 계정 사용 가능 여부는 제품 화면과 공식 안내로 별도 확인한다.", point: 3 },
    ],
  },
  {
    id: "q4",
    category: "concept",
    text: "원문: ‘외부 발송은 담당자 승인 후 진행한다. 다만 긴급 장애 공지는 사후 보고할 수 있다.’ 요약을 검토할 때 가장 먼저 확인할 것은?",
    options: [
      { label: "승인 원칙과 긴급 장애의 예외·사후 보고 조건이 함께 남았는지 원문과 대조한다.", point: 3 },
      { label: "요약이 짧고 단정적이면 예외를 빼도 된다.", point: 0 },
      { label: "예외가 있다는 것만 표시하고 사후 보고 조건은 생략한다.", point: 1 },
      { label: "예외와 사후 보고를 적되, 원문과 대조하지는 않는다.", point: 2 },
    ],
  },
  {
    id: "q5",
    category: "concept",
    text: "기존 자료에는 ‘GPT-6 Astra는 일반 제공’이라고 적혀 있습니다. 새 공식 공지에는 ‘제한된 조직에 단계적 제공’이라고 나옵니다. 다음 행동으로 가장 적절한 것은?",
    options: [
      { label: "기존 자료를 유지한다. 이미 한 번 작성했기 때문이다.", point: 0 },
      { label: "두 공지의 차이는 메모하지만, 추가 확인 전까지 기존 결론은 수정하지 않는다.", point: 1 },
      { label: "제공 범위를 단계적 제공으로 수정하고, 계정별 접근은 확인이 필요하다고 남긴다.", point: 3 },
      { label: "제공 범위를 단계적 제공으로 고치되, 계정별 접근 조건은 적지 않는다.", point: 2 },
    ],
  },
  {
    id: "q6",
    category: "tool",
    text: "새 모델 출시 소식을 보고 업무용 모델을 고르려 합니다. 가장 신뢰할 수 있는 첫 비교 방법은?",
    options: [
      { label: "발표 제목만 보고 가장 새 이름을 모든 업무의 기본값으로 정한다.", point: 0 },
      { label: "모델과 제품을 구분하고 계정 제공 조건을 확인한 뒤, 같은 비식별 과제로 결과·근거·검수 부담을 비교한다.", point: 3 },
      { label: "다른 사람의 한 번의 성공 사례만 보고 도입한다.", point: 1 },
      { label: "같은 과제를 비교하지만 계정 제공 조건과 근거 검토는 나중에 한다.", point: 2 },
    ],
  },
  {
    id: "q7",
    category: "tool",
    text: "프롬프트 라이브러리를 운영할 때 적절한 방식은?",
    options: [
      { label: "좋은 문장만 모아두고 버전 관리 안 한다", point: 1 },
      { label: "버전, 용도, 결과물을 함께 기록한다", point: 3 },
      { label: "필요할 때만 다시 만들어 쓴다", point: 0 },
      { label: "버전·용도·결과물은 기록하되, 접근 권한 검토는 실제 연결 전에 따로 한다", point: 2 },
    ],
  },
  {
    id: "q8",
    category: "tool",
    text: "MCP/외부 API 연동의 핵심은?",
    options: [
      { label: "속도 우선으로 인증을 생략한다", point: 0 },
      { label: "요청 제한·오류 처리·로깅을 함께 설계한다", point: 3 },
      { label: "키는 안전한 비밀 저장소에 두지만 교체·폐기 기준은 아직 정하지 않는다", point: 1 },
      { label: "데이터 스키마는 정하지만 필드별 유효성 검증과 예외 처리는 아직 보완하지 않는다", point: 2 },
    ],
    safetyCritical: "privacy",
  },
  {
    id: "q9",
    category: "tool",
    text: "자동화 워크플로우에서 테스트 전 선행은?",
    options: [
      { label: "직접 본 운영 데이터로 바로 실행", point: 0 },
      { label: "샘플 케이스로 시뮬레이션하고 실패 조건을 재현한다", point: 3 },
      { label: "문서화 없이 UI만 만든다", point: 1 },
      { label: "정상 흐름부터 시험하고, 운영 전 예외 규칙과 복구 방법을 보완한다", point: 2 },
    ],
  },
  {
    id: "q10",
    category: "tool",
    text: "반복 작업 자동화에서 가장 먼저 점검할 항목은?",
    options: [
      { label: "실행 빈도와 롤백 방법", point: 3 },
      { label: "결과물 배경색", point: 0 },
      { label: "알림 수신자만 정한다", point: 1 },
      { label: "완료 메시지만 넣는다", point: 2 },
    ],
  },
  {
    id: "q11",
    category: "work",
    text: "현재 업무에서 AI를 처음 적용할 때 적절한 시작점은?",
    options: [
      { label: "전 부서로 전면 배포 후 조정", point: 0 },
      { label: "반복 빈도 높은 작업을 파일럿으로 시작", point: 3 },
      { label: "매뉴얼 없이 개인 실험만 진행", point: 1 },
      { label: "반복 업무 파일럿을 하되 검증 기준은 나중에 정한다", point: 2 },
    ],
  },
  {
    id: "q12",
    category: "work",
    text: "업무 KPI를 정할 때 가장 효과적인 방식은?",
    options: [
      { label: "정성적 느낌만 기록", point: 0 },
      { label: "처리시간, 재작업률, 오탈자율 등 기준을 둔다", point: 3 },
      { label: "측정은 나중에 한다", point: 1 },
      { label: "성과 지표는 기록하지만 실패·재작업 원인 분석은 다음 점검으로 미룬다", point: 2 },
    ],
  },
  {
    id: "q13",
    category: "work",
    text: "AI 도움으로 만든 업무 요약을 동료에게 전달하기 전, 자기 판단을 점검하는 행동으로 가장 적절한 것은?",
    options: [
      { label: "AI가 만든 원고를 더 매끄럽게 외워서 그대로 읽는다.", point: 0 },
      { label: "결론만 자기 말로 말하고 근거는 원문을 보라고 한다.", point: 1 },
      { label: "결론과 근거는 설명하지만 반론·한계와 판단을 바꿀 조건은 생략한다.", point: 2 },
      { label: "결론 한 문장, 확인한 근거, 반론 또는 한계, 새 근거가 나오면 수정할 조건을 자기 말로 정리한다.", point: 3 },
    ],
  },
  {
    id: "q14",
    category: "work",
    text: "업무 적용 시 개인정보 처리는?",
    options: [
      { label: "민감정보는 마스킹하지 않으면 빠르다", point: 0 },
      { label: "처리 범위와 보관 기한을 선행 정한다", point: 3 },
      { label: "기본 UI 값으로 처리한다", point: 1 },
      { label: "처리 범위와 보관 기한은 정하지만 동의 이력의 확인 방법은 아직 정하지 않는다", point: 2 },
    ],
    safetyCritical: "privacy",
  },
  {
    id: "q15",
    category: "work",
    text: "외부 발송 업무를 AI로 설계할 때 첫 단계는?",
    options: [
      { label: "실수 방지용 승인 게이트를 둔다", point: 3 },
      { label: "내용 검토는 생략한다", point: 0 },
      { label: "발송 후 로그만 남긴다", point: 1 },
      { label: "보안 교육은 다음에 한다", point: 2 },
    ],
    safetyCritical: "approval",
  },
  {
    id: "q16",
    category: "safety",
    text: "법률 근거가 필요한 답변을 요청할 때 가장 바람직한지점은?",
    options: [
      { label: "근거 조항을 함께 제시하게 한다", point: 3 },
      { label: "결과만 빠르게 출력하게 한다", point: 0 },
      { label: "근거 출처를 임의로 추정", point: 1 },
      { label: "근거 조항과 AI 해석을 함께 받지만 최종 적용 판단 주체는 정하지 않는다", point: 2 },
    ],
    safetyCritical: "law",
  },
  {
    id: "q17",
    category: "safety",
    text: "민감문서 초안 점검에서 우선순위가 가장 높은 것은?",
    options: [
      { label: "요약 길이 최적화", point: 1 },
      { label: "정보 유출 경로와 권한범위 점검", point: 3 },
      { label: "디자인 정교함", point: 0 },
      { label: "메시지 톤 통일", point: 2 },
    ],
    safetyCritical: "privacy",
  },
  {
    id: "q18",
    category: "safety",
    text: "외부 API를 업무자동화에 붙일 때 기본 조건은?",
    options: [
      { label: "토큰/키 보관 위치와 사용 범위 제한을 정한다", point: 3 },
      { label: "키를 코드에 고정 후 공유", point: 0 },
      { label: "오류 처리 생략", point: 1 },
      { label: "작업에 필요한 권한만 고르지만 정기 권한 재검토 계획은 아직 없다", point: 2 },
    ],
    safetyCritical: "privacy",
  },
  {
    id: "q19",
    category: "safety",
    text: "검증 습관으로 가장 적절한 것은?",
    options: [
      { label: "출력 후 즉시 배포", point: 0 },
      { label: "샘플 검증, 동료 검토, 변경이력 기록", point: 3 },
      { label: "최종본만 저장", point: 1 },
      { label: "오류를 기록하고 알리지만 수정·재검증 담당과 기한은 아직 정하지 않는다", point: 2 },
    ],
  },
  {
    id: "q20",
    category: "safety",
    text: "외부로 발송되는 메시지를 처리할 때 최종 룰은?",
    options: [
      { label: "승인 체크리스트 없이 자동 전송", point: 0 },
      { label: "승인·저장·감사 로그를 남긴다", point: 3 },
      { label: "승인만 확인하고 저장·감사 기록은 남기지 않는다", point: 1 },
      { label: "승인·저장 기록은 남기지만 감사 내역 검토는 다음 점검으로 미룬다", point: 2 },
    ],
    safetyCritical: "approval",
  },
] as const;

const CATEGORY_COUNTS: Record<LevelCategory, number> = {
  concept: 5,
  tool: 5,
  work: 5,
  safety: 5,
};

const SAFE_ESSENTIAL_LESSON_URLS = [
  "/lessons/1-1",
  "/lessons/1-5",
  "/lessons/2-1",
  "/lessons/6-16",
];

const LEVEL_BOUNDARIES = [
  { key: "beginner", max: 44 },
  { key: "prework", max: 69 },
  { key: "automation", max: 84 },
  { key: "architecture", max: 101 },
] as const;

export const LEVEL_TYPES: Record<LevelTypeKey, LevelType> = {
  beginner: {
    key: "beginner",
    title: "입문형",
    description:
      "AI 개념과 기본 프롬프트 운영에 집중하면 빠르게 성과를 만들 수 있습니다. 1~3과를 중심으로 기초를 다집니다.",
    nextSteps: ["/lessons/1-1", "/lessons/1-3", "/lessons/1-5", "/lessons/2-1", "/lessons/6-16"],
    crossLinks: [
      { label: "AI업무학교 1~3과 보러가기", url: "/curriculum", tone: "기초 구성 확인" },
      { label: "실무 기반 확장 강의 시작", url: "/lessons/4-4", tone: "심화 안내" },
    ],
  },
  prework: {
    key: "prework",
    title: "실무준비형",
    description:
      "4~6과로 실무 적용이 시작됩니다. 동시에 edu 2~4단계(기초-중급 설계)로 넘어갈 준비가 가능합니다.",
    nextSteps: ["/lessons/3-2", "/lessons/3-4", "/lessons/4-2", "/lessons/4-4", "/lessons/6-16"],
    crossLinks: [
      { label: "실무 기반 강의 시작", url: "/lessons/4-2", tone: "심화 진입" },
      { label: "AI업무학교 4~6과 둘러보기", url: "/curriculum", tone: "다음 단계로 이동" },
      { label: "edu 실무 준비 심화로 이동", url: "https://edu.silronomu.com/lessons/2-1", tone: "타입별 심화 이동" },
    ],
  },
  automation: {
    key: "automation",
    title: "자동화실행형",
    description:
      "자동화 실행력을 빠르게 실전 적용할 수 있는 단계입니다. edu 5~12단계의 운영형 커리큘럼으로 깊이를 확장하세요.",
    nextSteps: ["/lessons/4-4", "/lessons/5-3", "/lessons/6-1", "/lessons/6-2", "/lessons/6-16"],
    crossLinks: [
      { label: "실무 자동화 프로젝트 보기", url: "/lessons/6-1", tone: "워크플로우 확장" },
      { label: "AI업무학교 6과 전체 보기", url: "/curriculum", tone: "연결 루트 확인" },
      { label: "edu 자동화 실무 단계로 이동", url: "https://edu.silronomu.com/lessons/5-1", tone: "실무 확장" },
    ],
  },
  architecture: {
    key: "architecture",
    title: "설계·운영형",
    description:
      "설계·운영 기반이 이미 안정된 단계입니다. edu 13~16단계로 확장해 에이전트 운영 체계를 완성해보세요.",
    nextSteps: ["/lessons/6-2", "/lessons/6-4", "/lessons/6-11", "/lessons/6-15", "/lessons/6-16"],
    crossLinks: [
      { label: "설계·운영 고급 루틴 확인", url: "/lessons/6-11", tone: "심화 경로" },
      { label: "AI업무학교 커리큘럼 복습", url: "/curriculum", tone: "고급 단계 연계" },
      { label: "edu 설계·운영 단계로 이동", url: "https://edu.silronomu.com/lessons/13-1", tone: "운영 확장" },
    ],
  },
};

function safeParseInt(value: unknown): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

export function validateLessonRecommendations(urls: string[]): string[] {
  return urls.filter((url) => {
    if (!url.startsWith("/")) return false;
    const lessonId = url.replace(/^\/lessons\//, "");
    return /^\d+-\d+$/.test(lessonId);
  });
}

export function getLessonTitle(lessonId: string): string {
  return lessonTitlesById[lessonId] ?? "강의";
}

export function isPublicLessonId(lessonId: string): boolean {
  return Object.hasOwn(lessonTitlesById, lessonId);
}

export function getPointForChoiceKey(question: TestQuestion, key: string): TestOption["point"] | null {
  if (!/^[1-4]$/.test(key)) return null;
  return question.options[Number(key) - 1]?.point ?? null;
}

export function parseLevelTestState(raw: string): PersistedLevelTestState | null {
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedLevelTestState>;
    if (
      !parsed
      || typeof parsed !== "object"
      || parsed.version !== LEVEL_TEST_STORAGE_VERSION
      || !Array.isArray(parsed.answers)
      || parsed.answers.length !== LEVEL_TEST_QUESTION_COUNT
    ) {
      return null;
    }

    const answers = parsed.answers as unknown[];
    if (
      !answers.every(
        (value) =>
          typeof value === "number" &&
          Number.isInteger(value) &&
          value >= -1 &&
          value <= 3,
      )
    ) {
      return null;
    }

    if (!Number.isInteger(parsed.currentIndex) || typeof parsed.currentIndex !== "number") {
      return null;
    }

    if (typeof parsed.completed !== "boolean") {
      return null;
    }

    const currentIndex = Math.max(0, Math.min(parsed.currentIndex, LEVEL_TEST_QUESTION_COUNT - 1));
    const completed = parsed.completed && (answers as number[]).every((value) => value >= 0 && value <= 3);

    return {
      version: LEVEL_TEST_STORAGE_VERSION,
      answers: answers as LevelTestAnswers,
      currentIndex,
      completed,
    };
  } catch {
    return null;
  }
}

function normalizeLessonIdFromUrl(url: string): string {
  return url.replace("/lessons/", "");
}

function dedupeUrls(urls: string[]) {
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    deduped.push(url);
  }
  return deduped;
}

function getCategoryScores(answers: LevelTestAnswers): LevelCategoryScore[] {
  const raw = LEVEL_QUESTIONS.reduce((acc, question, idx) => {
    const score = safeParseInt(answers[idx]);
    if (Number.isNaN(score)) return acc;
    acc[question.category] = (acc[question.category] ?? 0) + Math.max(0, Math.min(3, score));
    return acc;
  }, {} as Record<LevelCategory, number>);

  return (Object.keys(CATEGORY_COUNTS) as LevelCategory[]).map((category) => {
    const score = raw[category] ?? 0;
    const maxScore = CATEGORY_COUNTS[category] * 3;
    const percentage = Math.round((score / maxScore) * 1000) / 10;
    return {
      category,
      score,
      maxScore,
      percentage,
    };
  });
}

export function calculateLevelResult(
  answers: LevelTestAnswers,
  lessonExists: (id: string) => boolean,
): LevelTestResult {
  if (answers.length !== LEVEL_TEST_QUESTION_COUNT) {
    throw new Error("문항 20개 모두 응답해야 합니다.");
  }

  const invalid = answers.some((answer) => {
    const score = safeParseInt(answer);
    return Number.isNaN(score) || score < 0 || score > 3;
  });

  if (invalid) {
    throw new Error("답안 값이 올바르지 않습니다.");
  }

  const categoryScores = getCategoryScores(answers);
  const weightedScore =
    (categoryScores.find((item) => item.category === "concept")!.percentage * LEVEL_WEIGHTS.concept +
      categoryScores.find((item) => item.category === "tool")!.percentage * LEVEL_WEIGHTS.tool +
      categoryScores.find((item) => item.category === "work")!.percentage * LEVEL_WEIGHTS.work +
      categoryScores.find((item) => item.category === "safety")!.percentage * LEVEL_WEIGHTS.safety) /
    100;

  const typeKey = LEVEL_BOUNDARIES.find((boundary) => weightedScore <= boundary.max)!.key;
  const baseType = LEVEL_TYPES[typeKey];

  const safeFlags = LEVEL_QUESTIONS
    .map((question, index) => ({ question, score: safeParseInt(answers[index]) }))
    .filter((item) => item.question.safetyCritical)
    .some((item) => item.score === 0);

  const isSafeEssential = safeFlags;

  const validLessonUrls = validateLessonRecommendations(baseType.nextSteps).filter((url) => {
    const lessonId = normalizeLessonIdFromUrl(url);
    return lessonExists(lessonId);
  });
  const safeFoundation = SAFE_ESSENTIAL_LESSON_URLS.filter((url) => {
    const lessonId = normalizeLessonIdFromUrl(url);
    return lessonExists(lessonId);
  });
  const baseRecommendationPool = dedupeUrls([...validLessonUrls, ...safeFoundation]);

  if (validLessonUrls.length !== baseType.nextSteps.length) {
    const fallback = ["/lessons/1-1", "/lessons/2-1", "/lessons/3-2", "/lessons/4-1", "/lessons/5-1"];
    const fallbackValid = validateLessonRecommendations(fallback).filter((url) => {
      const lessonId = normalizeLessonIdFromUrl(url);
      return lessonExists(lessonId);
    });
    const merged = dedupeUrls([
      ...(isSafeEssential ? safeFoundation : []),
      ...baseRecommendationPool,
      ...fallbackValid,
    ]).slice(0, 5);
    return {
      score: Math.round(weightedScore),
      categoryScores,
      type: {
        ...baseType,
        nextSteps: fallbackValid.length >= 3 ? fallbackValid : baseType.nextSteps,
      },
      isSafeEssential,
      safeReason: isSafeEssential ? "개인정보·법률근거·승인 관련 핵심 항목에서 안전 기본 수칙 점검이 추가로 필요합니다." : undefined,
      answeredCount: answers.length,
      recommendedLessonUrls: merged,
      finishedAt: new Date().toISOString(),
    };
  }

  const fallback = ["/lessons/1-1", "/lessons/2-1", "/lessons/3-2", "/lessons/4-1", "/lessons/5-1"];
  const fallbackValid = validateLessonRecommendations(fallback).filter((url) => {
    const lessonId = normalizeLessonIdFromUrl(url);
    return lessonExists(lessonId);
  });
  const recommendedLessonUrls = dedupeUrls([
    ...(isSafeEssential ? safeFoundation : []),
    ...baseRecommendationPool,
    ...fallbackValid,
  ]).slice(0, 5);

  return {
    score: Math.round(weightedScore),
    categoryScores,
    type: baseType,
    isSafeEssential,
    safeReason: isSafeEssential ? "개인정보·법률근거·발송 승인 관련 핵심 항목에서 기본 위험점이 확인되어 안전기초부터 보완이 필요합니다." : undefined,
    answeredCount: answers.length,
    recommendedLessonUrls,
    finishedAt: new Date().toISOString(),
  };
}

export function restoreLevelTestResult(state: PersistedLevelTestState): LevelTestResult | null {
  if (!state.completed) return null;
  try {
    return calculateLevelResult(state.answers, isPublicLessonId);
  } catch {
    return null;
  }
}

export function getDefaultResultStorageKey(): string {
  return "level-test:v2";
}
