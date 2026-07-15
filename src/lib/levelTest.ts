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

export const LEVEL_TEST_STORAGE_VERSION = 2;

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
  "6-2": "2026 최신 모델·제품 지도: Fable 5 · GPT-5.6",
  "5-5": "실무 자동화 기초",
  "6-4": "업무 루틴 자동화",
  "6-5": "루프 기반 AI 운영",
  "6-11": "에이전트 운영 체계",
  "6-15": "통합 설계 실습",
};

export const LEVEL_QUESTIONS: readonly TestQuestion[] = [
  {
    id: "q1",
    category: "concept",
    text: "AI에게 작업 지시를 할 때 가장 먼저 정하는 것이 가장 중요하다고 보는 것은?",
    options: [
      { label: "민감한 정보 유무를 점검하고 제외한다", point: 3 },
      { label: "문맥보다 출력 형식만 정한다", point: 1 },
      { label: "목표, 제약, 대상 독자를 한 번에 정의한다", point: 2 },
      { label: "결과물이 완성되면 바로 공개 공유한다", point: 0 },
    ],
  },
  {
    id: "q2",
    category: "concept",
    text: "개념 적용 시 가장 바람직한 접근은?",
    options: [
      { label: "요구사항에서 핵심 조건과 확인 항목을 생략한다", point: 0 },
      { label: "요구사항만 전달하고 반영 조건은 나중에 본다", point: 1 },
      { label: "검증 항목은 정의하되 수행 시점은 미루어 둔다", point: 2 },
      { label: "요구사항·제약·검증 기준을 명시하고 반복 피드백한다", point: 3 },
    ],
    safetyCritical: "law",
  },
  {
    id: "q3",
    category: "concept",
    text: "프롬프트에서 가장 먼저 점검할 항목은?",
    options: [
      { label: "단어 선택의 화려함", point: 2 },
      { label: "입력 데이터의 신뢰도", point: 3 },
      { label: "시스템 요구를 지연하지 않기 위해 비우기", point: 0 },
      { label: "출력 길이만 줄이기", point: 1 },
    ],
  },
  {
    id: "q4",
    category: "concept",
    text: "업무용 AI 응답의 신뢰도를 높이는 방식은?",
    options: [
      { label: "근거 출처, 날짜, 가정 조건을 함께 받는다", point: 3 },
      { label: "길고 상세한 답변만 요구한다", point: 1 },
      { label: "검토 없이 바로 승인한다", point: 0 },
      { label: "출력 템플릿은 생략한다", point: 2 },
    ],
  },
  {
    id: "q5",
    category: "concept",
    text: "실무 적용 전, AI 출력 확인 기준은?",
    options: [
      { label: "작성자는 보통 잘 하니까 검토 불필요", point: 0 },
      { label: "법령·규정·사실관계를 최소 한 번 교차 확인", point: 3 },
      { label: "오타만 없으면 충분하다", point: 1 },
      { label: "결과의 일관성만 체크한다", point: 2 },
    ],
  },
  {
    id: "q6",
    category: "tool",
    text: "도구 조합 설계 시 가장 우선할 기준은?",
    options: [
      { label: "한 번에 가능한 도구를 모두 합친다", point: 1 },
      { label: "업무 단계별 실패 지점과 복구 계획을 본다", point: 3 },
      { label: "기본 설정만으로 시작", point: 2 },
      { label: "도구가 없으면 바로 수동 처리", point: 0 },
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
      { label: "보안/권한은 나중에 정한다", point: 2 },
    ],
  },
  {
    id: "q8",
    category: "tool",
    text: "MCP/외부 API 연동의 핵심은?",
    options: [
      { label: "속도 우선으로 인증을 생략한다", point: 0 },
      { label: "요청 제한·오류 처리·로깅을 함께 설계한다", point: 3 },
      { label: "한 번 성공한 키를 영구 보관한다", point: 1 },
      { label: "데이터 스키마는 생략 가능", point: 2 },
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
      { label: "예외 규칙은 필요 없다고 본다", point: 2 },
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
      { label: "결과 책임을 AI에 맡기고 승인 생략", point: 0 },
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
      { label: "좋은 점수만 공개하고 실패는 제외", point: 2 },
    ],
  },
  {
    id: "q13",
    category: "work",
    text: "동료와 협업할 때 AI 산출물을 전달할 때 가장 적절한 태도는?",
    options: [
      { label: "사실 검증 없이 전달", point: 0 },
      { label: "원본 근거·한계·검토 포인트를 함께 전달", point: 3 },
      { label: "최종본처럼 보이기 위해 부연하지 않는다", point: 1 },
      { label: "피드백 창구를 닫아둔다", point: 2 },
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
      { label: "동의 이력은 선택사항", point: 2 },
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
      { label: "해석은 모두 AI 판단으로 확정", point: 2 },
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
      { label: "권한은 넓어도 괜찮다", point: 2 },
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
      { label: "오류가 보여도 사용자 책임이라 공지", point: 2 },
    ],
  },
  {
    id: "q20",
    category: "safety",
    text: "외부로 발송되는 메시지를 처리할 때 최종 룰은?",
    options: [
      { label: "승인 체크리스트 없이 자동 전송", point: 0 },
      { label: "승인·저장·감사 로그를 남긴다", point: 3 },
      { label: "로그는 나중에 일괄 생성", point: 2 },
      { label: "실수 로그는 삭제한다", point: 1 },
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
    nextSteps: ["/lessons/1-1", "/lessons/1-3", "/lessons/1-5", "/lessons/2-1", "/lessons/2-3"],
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
    nextSteps: ["/lessons/3-2", "/lessons/3-4", "/lessons/4-2", "/lessons/4-4", "/lessons/5-1"],
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
    nextSteps: ["/lessons/4-4", "/lessons/5-3", "/lessons/5-5", "/lessons/6-1", "/lessons/6-2"],
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
    nextSteps: ["/lessons/6-2", "/lessons/6-4", "/lessons/6-5", "/lessons/6-11", "/lessons/6-15"],
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
  return "level-test:v1";
}
