import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import net from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { after, before, test } from "node:test";

let baseUrl = process.env.TEST_BASE_URL?.replace(/\/+$/, "");
let devServer;
let serverOutput = "";

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (devServer?.exitCode != null) {
      throw new Error(`개발 서버가 조기 종료되었습니다.\n${serverOutput.slice(-4000)}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still compiling.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`개발 서버 시작 시간 초과\n${serverOutput.slice(-4000)}`);
}

function extractAll(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function buildSeoulDateCode(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  return `${year}${month}${day}`;
}

function expectedLessonAccessCode(dateCode) {
  return dateCode;
}

before(async () => {
  process.env.ADMIN_PASSWORD ||= "integration-admin-password";
  process.env.ADMIN_SESSION_SECRET ||= "integration-admin-session-secret-change-me";
  process.env.LESSON_ACCESS_SECRET ||= "integration-lesson-access-secret-change-me";
  process.env.ALLOW_IN_MEMORY_LESSON_STORAGE ||= "true";

  if (baseUrl) return;

  const port = await getFreePort();
  baseUrl = `http://127.0.0.1:${port}`;
  devServer = spawn(
    "npm",
    ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_URL: baseUrl,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  devServer.stdout.on("data", (chunk) => {
    serverOutput += chunk;
  });
  devServer.stderr.on("data", (chunk) => {
    serverOutput += chunk;
  });
  await waitForServer(baseUrl);
}, { timeout: 120_000 });

function extractSetCookieHeader(response) {
  return response.headers.getSetCookie?.() ?? [];
}

async function getAdminCookieHeader() {
  const res = await fetch(`${baseUrl}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
  });
  assert.equal(res.status, 200, "관리자 로그인 상태코드");
  const cookieHeader = extractSetCookieHeader(res).join("; ");
  assert.ok(cookieHeader.includes("admin-session-v2"), "관리자 세션 쿠키 설정");
  return cookieHeader;
}

function forgeAdminSessionCookie(secret, issuedAt = Date.now()) {
  const nonce = "0".repeat(32);
  const payload = `${issuedAt}.${nonce}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `admin:v2:${payload}.${signature}`;
}

async function loginAdminWithIp(ip) {
  return fetch(`${baseUrl}/api/admin/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
  });
}

function lessonDataCountFromLlms(llms) {
  return extractAll(llms, /^- \[\d+-\d+\./gm).length;
}

after(async () => {
  if (!devServer || devServer.exitCode != null) return;
  devServer.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => devServer.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
});

test("공개 HTML 페이지는 self-canonical과 단일 H1을 사용한다", async () => {
  const paths = ["/", "/about", "/curriculum", "/lessons", "/lessons/1-1", "/lessons/6-14", "/level-test"];

  for (const path of paths) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, `${path} 응답 상태`);
    const html = await response.text();
    const canonicals = extractAll(
      html,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/gi,
    );
    const h1s = extractAll(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
    const mainCount = html.match(/<main\b/gi)?.length ?? 0;

    assert.deepEqual(canonicals, [`${baseUrl}${path === "/" ? "" : path}`], `${path} canonical`);
    assert.equal(h1s.length, 1, `${path} H1 개수`);
    assert.equal(mainCount, 1, `${path} main 개수`);
    assert.match(html, /aria-label="교육 채널 전환"/, `${path} 교육 채널 전환 내비게이션`);
    assert.match(html, /두 채널 학습 경로/, `${path} 데스크톱 학습 경로 안내`);
    assert.match(html, /현재 채널 · 콘텐츠 설계/, `${path} 현재 채널 역할`);
    assert.match(html, /Claude Code 실무 과정, 기술 구현과 측정 채널로 이동/, `${path} 연결 채널 접근성 이름`);
    assert.match(html, /href="https:\/\/edu\.silronomu\.com"/, `${path} 연결 채널 URL`);
    assert.doesNotMatch(html, /\| AI업무학교 \| AI업무학교/);
  }

  const presentationSource = await readFile(
    new URL("../src/components/LessonPresentation.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(presentationSource, /<h1\b/);
});

test("JSON-LD는 파싱 가능하며 사람·학교·법인 엔티티를 분리한다", async () => {
  const response = await fetch(`${baseUrl}/lessons`);
  const html = await response.text();
  const blocks = extractAll(
    html,
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  ).map((block) => JSON.parse(block));
  const graph = blocks.flatMap((block) => block["@graph"] ?? [block]);

  assert.ok(graph.some((node) => node["@type"] === "EducationalOrganization" && node.name === "AI업무학교"));
  assert.ok(graph.some((node) => node["@type"] === "Organization" && node.name === "한동노무법인"));
  const person = graph.find((node) => node["@type"] === "Person" && node.name === "박실로");
  assert.ok(person);
  assert.equal(person.jobTitle, "공인노무사");
  assert.ok(person.sameAs.every((url) => !/threads\.net|x\.com|facebook\.com\/share\//.test(url)));
  assert.ok(graph.some((node) => node["@type"] === "CollectionPage"));
});

test("llms.txt·robots.txt·sitemap.xml은 공개 경로와 강의 수를 일치시킨다", async () => {
  const [faviconResponse, llmsResponse, robotsResponse, sitemapResponse] = await Promise.all([
    fetch(`${baseUrl}/favicon.ico`),
    fetch(`${baseUrl}/llms.txt`),
    fetch(`${baseUrl}/robots.txt`),
    fetch(`${baseUrl}/sitemap.xml`),
  ]);
  assert.equal(faviconResponse.status, 200);
  assert.equal(faviconResponse.headers.get("content-type"), "image/png");
  assert.equal(llmsResponse.status, 200);
  assert.equal(robotsResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);

  const [llms, robots, sitemap] = await Promise.all([
    llmsResponse.text(),
    robotsResponse.text(),
    sitemapResponse.text(),
  ]);
  const lessonCount = lessonDataCountFromLlms(llms);

  assert.match(llms, new RegExp(`\\[강의 목록\\]\\(${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/lessons\\)`));
  assert.ok(lessonCount > 0);
  assert.match(robots, /User-Agent: OAI-SearchBot/i);
  assert.match(robots, /User-Agent: Perplexity-User/i);
  assert.doesNotMatch(robots, /anthropic-ai|Claude-Web/i);
  assert.match(robots, new RegExp(`Sitemap: ${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`));
  assert.equal(extractAll(sitemap, /<loc>([^<]+)<\/loc>/g).length, lessonCount + 4);
  assert.match(sitemap, new RegExp(`<loc>${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/lessons</loc>`));
});

test("공개 강의 페이지는 비인증 시 보호 본문을 노출하지 않는다", async () => {
  const response = await fetch(`${baseUrl}/lessons/1-1`);
  assert.equal(response.status, 200, "강의 페이지 응답");
  const html = await response.text();

  assert.doesNotMatch(
    html,
    /AI, 이제 선택이 아니라 필수입니다|핵심 정리|자주 묻는 질문|MCPBot/i,
  );
});

test("강의 접근 API 6자리 코드로 쿠키 기반 열람이 동작한다", async () => {
  assert.ok(process.env.LESSON_ACCESS_SECRET, "LESSON_ACCESS_SECRET 설정");
  const lessonCode = expectedLessonAccessCode(buildSeoulDateCode());
  assert.equal(lessonCode.length, 6, "강의 접근 코드 길이");
  assert.match(lessonCode, /^\d{6}$/, "강의 접근 코드는 숫자 6자리");

  const response = await fetch(`${baseUrl}/api/lesson/access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: lessonCode }),
  });
  assert.equal(response.status, 200, "강의 접근 API 성공");
  const accessCookie = extractSetCookieHeader(response).find((value) => value.startsWith("lesson-access-v2="));
  assert.ok(accessCookie, "접근 쿠키 발급");
  const maxAge = Number(accessCookie.match(/Max-Age=(\d+)/i)?.[1]);
  assert.ok(maxAge >= 1 && maxAge <= 86_400, "접근 쿠키는 다음 서울 자정 안에 만료");

  const lessonResponse = await fetch(`${baseUrl}/lessons/1-1`, {
    headers: { Cookie: accessCookie.split(";")[0] },
  });
  assert.equal(lessonResponse.status, 200, "보호 강의 재요청 성공");
  const authedHtml = await lessonResponse.text();
  assert.ok(/핵심 정리/.test(authedHtml), "인증 쿠키로 보호 본문 접근 가능");
});

test("강의 상세는 운영 쿠키 판정을 위해 강제 동적 렌더링한다", async () => {
  const source = await readFile(new URL("../src/app/lessons/[id]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /export const dynamic = ["']force-dynamic["']/);
  assert.doesNotMatch(source, /export const revalidate\s*=/);
});

test("강의 접근 쿠키 만료는 다음 서울 자정까지의 초를 계산한다", async () => {
  const lessonAccessModule = await import(new URL("../src/lib/seoul-time.ts", import.meta.url));
  assert.equal(
    lessonAccessModule.getSecondsUntilNextSeoulMidnight(new Date("2026-07-15T14:59:00.000Z")),
    60,
    "서울 23:59에는 자정까지 60초",
  );
  assert.equal(
    lessonAccessModule.getSecondsUntilNextSeoulMidnight(new Date("2026-07-15T15:00:00.000Z")),
    86_400,
    "서울 자정 직후에는 다음 자정까지 24시간",
  );
});

test("강의 접근 API 응답에 코드 값이 노출되지 않는다", async () => {
  const lessonCode = expectedLessonAccessCode(buildSeoulDateCode());

  const response = await fetch(`${baseUrl}/api/lesson/access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: lessonCode }),
  });
  assert.equal(response.status, 200, "강의 접근 API 성공");
  const body = await response.json();
  assert.ok(!("accessCode" in body), "응답 본문에 accessCode 없음");
  assert.equal(body.success, true, "성공 플래그 유지");
});

test("관리자 대시보드는 오늘의 접근 코드와 서울 자정 만료 정보를 노출한다", async () => {
  const adminCookie = await getAdminCookieHeader();
  const response = await fetch(`${baseUrl}/admin/dashboard`, {
    headers: { Cookie: adminCookie },
  });
  assert.equal(response.status, 200, "관리자 대시보드 응답");
  const html = await response.text();
  const expectedDateCode = buildSeoulDateCode();
  const expectedCode = expectedLessonAccessCode(expectedDateCode);

  assert.ok(html.includes(expectedCode), "오늘 접근 코드 노출");
  assert.ok(html.includes(expectedDateCode), "오늘 코드 기준일 노출");
  assert.ok(html.includes("자정 만료"), "자정 만료 안내 노출");
});

test("관리자 API는 존재하지 않는 ID와 잘못된 payload를 거부한다", async () => {
  const adminCookie = await getAdminCookieHeader();

  const headers = {
    "Content-Type": "application/json",
    Cookie: adminCookie,
  };

  const payload = {
    id: "1-1",
    title: "통합 테스트용 타이틀",
    summary: "요약",
    sections: [{ heading: "h", content: "c" }],
    keyTakeaways: ["a"],
  };

  const missingIdResponse = await fetch(`${baseUrl}/api/admin/lessons/9-99`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  assert.equal(missingIdResponse.status, 404, "없는 ID는 404");

  const invalidPayloadResponse = await fetch(`${baseUrl}/api/admin/lessons/1-1`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      id: "1-1",
      title: 1234,
      summary: "요약",
      sections: [],
    }),
  });
  assert.equal(invalidPayloadResponse.status, 400, "잘못된 payload는 400");
});

test("강의 관리자 저장은 핵심 필드 보존을 유지한다", async () => {
  const adminCookie = await getAdminCookieHeader();
  const headers = {
    "Content-Type": "application/json",
    Cookie: adminCookie,
  };

  const beforeResponse = await fetch(`${baseUrl}/api/admin/lessons/1-1`, {
    headers,
  });
  assert.equal(beforeResponse.status, 200, "관리자 조회 응답");
  const beforeJson = await beforeResponse.json();
  const beforeLesson = beforeJson.lesson;
  const originalDatePublished = beforeLesson.datePublished;
  const originalFaq = beforeLesson.faq;
  const originalInsights = beforeLesson.insights;
  const originalRelatedLinks = beforeLesson.relatedLinks;

  const payload = {
    id: beforeLesson.id,
    title: beforeLesson.title,
    summary: beforeLesson.summary,
    phase: beforeLesson.phase,
    prev: beforeLesson.prev,
    next: beforeLesson.next,
    sections: beforeLesson.sections,
    keyTakeaways: beforeLesson.keyTakeaways,
  };

  const updateResponse = await fetch(`${baseUrl}/api/admin/lessons/1-1`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  assert.equal(updateResponse.status, 200, "관리자 저장 응답");

  const afterResponse = await fetch(`${baseUrl}/api/admin/lessons/1-1`, { headers });
  assert.equal(afterResponse.status, 200, "관리자 재조회 응답");
  const afterJson = await afterResponse.json();
  const afterLesson = afterJson.lesson;

  assert.equal(afterLesson.datePublished, originalDatePublished, "datePublished 보존");
  assert.deepEqual(afterLesson.faq, originalFaq, "faq 보존");
  assert.deepEqual(afterLesson.insights, originalInsights, "insights 보존");
  assert.deepEqual(afterLesson.relatedLinks, originalRelatedLinks, "relatedLinks 보존");
});

test("admin 목록 API는 6과 정합과 전체 강의 수를 제공한다", async () => {
  const llmsResponse = await fetch(`${baseUrl}/llms.txt`);
  assert.equal(llmsResponse.status, 200, "llms.txt 응답");
  const expectedLessonCount = lessonDataCountFromLlms(await llmsResponse.text());

  const adminCookie = await getAdminCookieHeader();
  const response = await fetch(`${baseUrl}/api/admin/lessons`, {
    headers: { Cookie: adminCookie },
  });
  assert.equal(response.status, 200, "관리자 목록 응답");
  const body = await response.json();
  const lessons = body.lessons;

  const lessonCount = Object.keys(lessons).length;
  const phases = new Set(Object.values(lessons).map((lesson) => lesson.phase));
  assert.equal(lessonCount, expectedLessonCount, "전체 강의 수");
  assert.ok(phases.has("1과"), "1과 존재");
  assert.ok(phases.has("6과"), "6과 존재");
  assert.equal(phases.size, 6, "6개 과 정합");
});

test("수준진단 모듈은 20문항·영역 가중치·타입 경계·안전기초 규칙을 충족한다", async () => {
  const levelTestModule = await import(new URL("../src/lib/levelTest.ts", import.meta.url));
  const lessonExists = (id) => /^\d+-\d+$/.test(id);
  const levelTestClientSource = await readFile(new URL("../src/app/level-test/LevelTestClient.tsx", import.meta.url), "utf8");

  assert.equal(levelTestModule.LEVEL_TEST_QUESTION_COUNT, 20, "문항 수 20개");
  assert.equal(levelTestModule.LEVEL_QUESTIONS[1].text, "개념 적용 시 가장 바람직한 접근은?", "q2 문항 텍스트");
  assert.equal(levelTestModule.LEVEL_QUESTIONS[1].options[0].point, 0, "q2 1번은 조건/검증 생략");
  assert.equal(levelTestModule.LEVEL_QUESTIONS[1].options[1].point, 1, "q2 2번은 선행 조건 부재");
  assert.equal(levelTestModule.LEVEL_QUESTIONS[1].options[2].point, 2, "q2 3번은 검증 타이밍 지연");
  assert.equal(levelTestModule.LEVEL_QUESTIONS[1].options[3].point, 3, "q2 4번은 규격/반복 피드백(안전)");
  assert.ok(levelTestModule.LEVEL_TYPES?.prework?.crossLinks.some((item) => item.url.includes("https://edu.silronomu.com/lessons/2-1")), "실무준비형 교차링크에 edu 2-1");
  assert.ok(levelTestModule.LEVEL_TYPES?.automation?.crossLinks.some((item) => item.url.includes("https://edu.silronomu.com/lessons/5-1")), "자동화실행형 교차링크에 edu 5-1");
  assert.ok(levelTestModule.LEVEL_TYPES?.architecture?.crossLinks.some((item) => item.url.includes("https://edu.silronomu.com/lessons/13-1")), "설계·운영형 교차링크에 edu 13-1");
  assert.match(levelTestClientSource, /target=\"_blank\"/g, "결과 교차 링크 새 창 속성");
  assert.match(levelTestClientSource, /rel=\"noopener noreferrer\"/g, "결과 교차 링크 rel 안전 속성");

  const totalWeight = Object.values(levelTestModule.LEVEL_WEIGHTS).reduce((sum, value) => sum + value, 0);
  assert.equal(totalWeight, 100, "영역 가중치 합계 100");

  const toAnswers = (value) => Array.from(
    { length: levelTestModule.LEVEL_TEST_QUESTION_COUNT },
    () => value,
  );

  const beginner = levelTestModule.calculateLevelResult(
    toAnswers(0),
    lessonExists,
  );
  assert.equal(beginner.type.key, "beginner", "최저점은 입문형");

  const prework = levelTestModule.calculateLevelResult(
    toAnswers(2),
    lessonExists,
  );
  assert.equal(prework.type.key, "prework", "중간 점수는 실무준비형");

  const architecture = levelTestModule.calculateLevelResult(
    toAnswers(3),
    lessonExists,
  );
  assert.equal(architecture.type.key, "architecture", "최고 점수는 설계·운영형");

  const safeCritical = toAnswers(3);
  safeCritical[1] = 0;
  const safeResult = levelTestModule.calculateLevelResult(safeCritical, lessonExists);
  assert.equal(safeResult.isSafeEssential, true, "안전기초 필수 플래그");
  assert.ok(safeResult.type.key, "타입 계산은 유지");

  assert.ok(safeResult.recommendedLessonUrls.every((url) => /^\/lessons\//.test(url)), "추천 강의 URL는 강의 경로");
  assert.ok(safeResult.recommendedLessonUrls.length >= 3, "추천 강의 3개 이상");
  assert.ok(safeResult.categoryScores.length === 4, "영역 점수 4개");
});

test("수준진단 키보드 번호는 화면 선택지 순서의 실제 점수로 저장된다", async () => {
  const levelTestModule = await import(new URL("../src/lib/levelTest.ts", import.meta.url));
  const q1 = levelTestModule.LEVEL_QUESTIONS[0];
  assert.equal(q1.options[0].point, 3, "q1 첫 선택지는 안전 행동");
  assert.equal(levelTestModule.getPointForChoiceKey(q1, "1"), 3, "숫자 1은 첫 선택지의 3점");
  assert.equal(levelTestModule.getPointForChoiceKey(q1, "4"), 0, "숫자 4는 네 번째 선택지의 0점");
  assert.equal(levelTestModule.getPointForChoiceKey(q1, "5"), null, "범위 밖 키 무시");
});

test("수준진단 저장 결과는 무시하고 검증된 답변으로 안전하게 재계산한다", async () => {
  const levelTestModule = await import(new URL("../src/lib/levelTest.ts", import.meta.url));
  const answers = Array.from({ length: levelTestModule.LEVEL_TEST_QUESTION_COUNT }, () => 3);
  const parsed = levelTestModule.parseLevelTestState(JSON.stringify({
    version: levelTestModule.LEVEL_TEST_STORAGE_VERSION,
    answers,
    currentIndex: 999,
    completed: true,
    result: {
      recommendedLessonUrls: ["javascript:alert(1)", "https://attacker.invalid/lesson"],
      type: { crossLinks: [{ label: "조작 링크", url: "https://attacker.invalid" }] },
    },
  }));

  assert.ok(parsed, "검증 가능한 답변 상태 복원");
  assert.equal(parsed.currentIndex, levelTestModule.LEVEL_TEST_QUESTION_COUNT - 1, "문항 인덱스 상한 clamp");
  assert.equal(Object.hasOwn(parsed, "result"), false, "저장된 result 폐기");
  const restored = levelTestModule.restoreLevelTestResult(parsed);
  assert.ok(restored, "답변으로 결과 재계산");
  assert.doesNotMatch(JSON.stringify(restored), /attacker\.invalid|javascript:/, "조작 링크 미포함");
  assert.ok(restored.recommendedLessonUrls.every((url) => /^\/lessons\/\d+-\d+$/.test(url)), "추천 링크 허용 형식");
});

test("학습 진도 파싱은 버전 불일치 시 기본값으로 되돌리고 lastVisited 타임스탬프를 검증한다", async () => {
  const progressModule = await import(new URL("../src/lib/learningProgress.ts", import.meta.url));
  const allowed = progressModule.getAllowedLessonIdSet([
    { id: "1-1", title: "강의" },
    { id: "1-2", title: "강의2" },
  ]);

  const parsedOld = progressModule.parseLessonProgress(
    JSON.stringify({
      version: 999,
      completedLessonIds: ["1-1", "bad-id", "2-2"],
      lastVisited: {
        id: "1-1",
        title: "강의",
        at: "2020-01-01T00:00:00.000Z",
      },
    }),
    allowed,
  );
  assert.equal(parsedOld.version, progressModule.LESSON_PROGRESS_STORAGE_VERSION, "버전 불일치면 기본 버전 복원");
  assert.equal(parsedOld.completedLessonIds.length, 0, "버전 불일치면 완료 목록 비움");
  assert.equal(parsedOld.lastVisited, null, "버전 불일치면 lastVisited 초기화");

  const parsedWithInvalidAt = progressModule.parseLessonProgress(
    JSON.stringify({
      version: progressModule.LESSON_PROGRESS_STORAGE_VERSION,
      completedLessonIds: ["1-1", "1-2", "2-2"],
      lastVisited: {
        id: "1-1",
        title: "강의",
        at: "not-a-date",
      },
    }),
    allowed,
  );
  assert.equal(parsedWithInvalidAt.lastVisited, null, "lastVisited에서 유효하지 않은 at은 무시");

  const parsedWithValidAt = progressModule.parseLessonProgress(
    JSON.stringify({
      version: progressModule.LESSON_PROGRESS_STORAGE_VERSION,
      completedLessonIds: ["1-1", "1-2", "2-2"],
      lastVisited: {
        id: "1-1",
        title: "강의",
        at: "2026-06-01T12:00:00.000Z",
      },
    }),
    allowed,
  );
  assert.equal(parsedWithValidAt.lastVisited?.id, "1-1", "유효한 at은 ID 보존");
  assert.equal(parsedWithValidAt.completedLessonIds.join(","), "1-1,1-2", "허용되지 않은 ID 제거");
});

test("storage 메모리 fallback는 테스트/플래그가 없으면 불가", async () => {
  const script = `
    import { saveLessonToBlob } from './src/lib/storage.ts';
    try {
      await saveLessonToBlob('storage-test', { id: 'storage-test' });
      console.log('save-success');
      process.exit(1);
    } catch (error) {
      if (!String(error).includes('BLOB 저장소 토큰')) process.exit(2);
      process.exit(0);
    }
  `;

  const failed = spawnSync("node", ["--input-type=module", "-e", script], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "production",
      BLOB_READ_WRITE_TOKEN: "",
      ALLOW_IN_MEMORY_LESSON_STORAGE: "false",
    },
  });

  assert.equal(failed.status, 0, "운영 모드에서는 토큰 없을 때 오류");

  const passed = spawnSync("node", ["--input-type=module", "-e", `
    import { saveLessonToBlob } from './src/lib/storage.ts';
    const data = await saveLessonToBlob('storage-test', { id: 'storage-test' });
    console.log(data === '' ? 'ok' : 'bad');
  `], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "test",
      BLOB_READ_WRITE_TOKEN: "",
      ALLOW_IN_MEMORY_LESSON_STORAGE: "true",
    },
  });

  assert.equal(passed.status, 0, "테스트 모드 플래그 시 메모리 fallback 허용");
  assert.match(String(passed.stdout), /ok/, "메모리 fallback 수행");
});

test("Blob 저장소는 전용 prefix와 덮어쓰기 저장 옵션을 사용한다", async () => {
  const source = await readFile(new URL("../src/lib/storage.ts", import.meta.url), "utf8");
  const envExample = await readFile(new URL("../.env.example", import.meta.url), "utf8");
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  assert.match(source, /AI_SCHOOL_BLOB_PREFIX/, "전용 prefix 환경변수 사용");
  assert.match(source, /allowOverwrite:\s*true/, "동일 pathname 강의 JSON 덮어쓰기 허용");
  assert.match(source, /cacheControlMaxAge:\s*0/, "관리자 저장 JSON 캐시 최소화");
  assert.match(source, /BLOB_ACCESS/, "public/private Blob 접근 모드 지원");
  assert.match(source, /get\(blobs\[0\]\.pathname/, "SDK get으로 Blob 본문 조회");
  assert.match(envExample, /AI_SCHOOL_BLOB_PREFIX=ai-school\/production\/lessons\//);
  assert.match(readme, /AI_SCHOOL_BLOB_PREFIX/);
});

test("수준진단 페이지가 존재하고 결과 화면 진입 포인트가 노출된다", async () => {
  const response = await fetch(`${baseUrl}/level-test`);
  assert.equal(response.status, 200, "/level-test 응답");
  const html = await response.text();
  assert.match(html, /수준진단|level-test/);
  assert.match(html, /진단 시작/);
});

test("관리자 인증 토큰은 만료 시 접근이 거부되고 레거시 쿠키가 제거된다", async () => {
  assert.ok(process.env.ADMIN_SESSION_SECRET, "ADMIN_SESSION_SECRET 설정");

  const expired = forgeAdminSessionCookie(process.env.ADMIN_SESSION_SECRET, Date.now() - 26 * 60 * 60 * 1000);
  const legacyHash = "legacy-hash";

  const response = await fetch(`${baseUrl}/admin/dashboard`, {
    redirect: "manual",
    headers: {
      Cookie: `admin-session-v2=${expired}; admin-session-hash=${legacyHash}`,
    },
  });

  assert.equal(response.status, 307, "만료 토큰은 리디렉션");
  const redirect = response.headers.get("location");
  assert.ok(redirect, "리디렉션 위치 존재");
  const redirectPath = new URL(redirect, baseUrl).pathname;
  assert.equal(redirectPath, "/admin", "로그인 화면 이동");

  const clearedCookies = extractSetCookieHeader(response).join("; ");
  assert.ok(clearedCookies.includes("admin-session-v2=;"), "세션 쿠키 삭제");
  assert.ok(clearedCookies.includes("admin-session-hash=;"), "레거시 해시 쿠키 삭제");
});

test("관리자 미들웨어와 서버 가드는 유효시간 내 위조 토큰도 거부한다", async () => {
  const forged = `admin:v2:${Date.now()}.${"0".repeat(32)}.${"0".repeat(64)}`;
  const pageResponse = await fetch(`${baseUrl}/admin/dashboard`, {
    redirect: "manual",
    headers: { Cookie: `admin-session-v2=${forged}` },
  });
  assert.equal(pageResponse.status, 307, "위조 토큰 페이지 접근 거부");
  assert.equal(new URL(pageResponse.headers.get("location"), baseUrl).pathname, "/admin");

  const apiResponse = await fetch(`${baseUrl}/api/admin/lessons`, {
    headers: { Cookie: `admin-session-v2=${forged}` },
  });
  assert.equal(apiResponse.status, 401, "위조 토큰 API 접근 거부");

  const middlewareSource = await readFile(new URL("../src/middleware.ts", import.meta.url), "utf8");
  const adminApiSource = await readFile(new URL("../src/app/api/admin/lessons/route.ts", import.meta.url), "utf8");
  assert.match(middlewareSource, /crypto\.subtle\.verify/, "미들웨어 HMAC 서명 검증");
  assert.match(adminApiSource, /isAuthenticated\(\)/, "API 서버 가드 유지");
});

test("관리자 로그인은 IP 기반 실패 제한과 성공 시 버킷 초기화를 적용한다", async () => {
  const ip = "203.0.113.10";

  for (let i = 0; i < 5; i += 1) {
    const response = await fetch(`${baseUrl}/api/admin/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify({ password: "wrong-password" }),
    });
    assert.equal(response.status, 401, "틀린 비밀번호는 401");
  }

  const blocked = await fetch(`${baseUrl}/api/admin/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ password: "wrong-password" }),
  });

  assert.equal(blocked.status, 429, "5회 초과 시 429");
  assert.equal(blocked.headers.get("cache-control"), "no-store", "캐시 차단");
  assert.ok(blocked.headers.get("retry-after"), "Retry-After 존재");

  const resetIp = "203.0.113.11";
  const wrongResponse = await fetch(`${baseUrl}/api/admin/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": resetIp,
    },
    body: JSON.stringify({ password: "wrong-password" }),
  });
  assert.equal(wrongResponse.status, 401, "실패 카운트 확인");

  const loginResponse = await loginAdminWithIp(resetIp);
  assert.equal(loginResponse.status, 200, "정상 로그인");

  const afterSuccess = await fetch(`${baseUrl}/api/admin/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": resetIp,
    },
    body: JSON.stringify({ password: "wrong-password" }),
  });

  assert.equal(afterSuccess.status, 401, "성공 후 재시도는 새 카운트");
});

test("반응 API는 유효 lesson-id 검증과 과도한 요청 제한을 수행한다", async () => {
  const invalidId = "99-99";
  const invalidGet = await fetch(`${baseUrl}/api/lessons/${invalidId}/reactions`);
  assert.equal(invalidGet.status, 400, "invalid lesson id GET 검증");
  assert.equal(invalidGet.headers.get("cache-control"), "no-store", "반응 API 400 no-store");

  const validGet = await fetch(`${baseUrl}/api/lessons/1-1/reactions`);
  assert.equal(validGet.status, 200, "유효 lesson id GET 성공");
  assert.equal(validGet.headers.get("cache-control"), "no-store", "반응 API GET no-store");

  const ip = "198.51.100.77";
  let blocked = false;

  for (let i = 0; i < 12; i += 1) {
    const response = await fetch(`${baseUrl}/api/lessons/1-1/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify({ type: "bad" }),
    });

    if (response.status === 429) {
      blocked = true;
      assert.equal(response.headers.get("cache-control"), "no-store", "반응 API 429 no-store");
      assert.ok(response.headers.get("retry-after"), "Retry-After 존재");
      break;
    }

    if (i >= 10) {
      assert.fail("과도한 POST 제한이 동작하지 않음");
    }
  }

  assert.equal(blocked, true, "과도한 POST 제한 동작");

  const invalidPost = await fetch(`${baseUrl}/api/lessons/1-1/reactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ type: "bad" }),
  });
  assert.equal(invalidPost.headers.get("cache-control"), "no-store", "반응 API 400 no-store");
});

test("관리자 로그인은 비밀번호 길이 제한을 적용한다", async () => {
  const response = await fetch(`${baseUrl}/api/admin/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.20",
    },
    body: JSON.stringify({ password: "a".repeat(300) }),
  });

  assert.equal(response.status, 400, "비밀번호 길이 초과는 400");
  assert.equal(response.headers.get("cache-control"), "no-store", "관리자 로그인 실패 no-store");
});

test("관리자 로그인 성공 응답에 no-store 적용", async () => {
  const response = await loginAdminWithIp("203.0.113.30");
  assert.equal(response.status, 200, "관리자 로그인 성공");
  assert.equal(response.headers.get("cache-control"), "no-store", "관리자 로그인 성공 no-store");
});

test("전환 띠·헤더·footer·소개 버튼형 링크는 44px 최소 터치영역을 선언한다", async () => {
  const [channelBarSource, siteNavSource, layoutSource, aboutSource] = await Promise.all([
    readFile(new URL("../src/components/EducationChannelBar.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/SiteNav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/about/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(channelBarSource, /grid-cols-2 md:grid-cols-\[/, "모바일 2열·데스크톱 3열 구조");
  assert.match(channelBarSource, /hidden min-h-\[60px\].*md:flex/, "안내 열은 모바일에서 숨김");
  assert.match(channelBarSource, /group flex min-h-\[60px\]/, "교육 채널 이동 링크");
  assert.match(siteNavSource, /group inline-flex min-h-11 items-center/, "헤더 브랜드 링크");
  assert.equal(
    [...layoutSource.matchAll(/inline-flex min-h-11 items-center text-\[var\(--color-dark-text-soft\)\]/g)].length,
    4,
    "footer 내비게이션 링크 4개",
  );
  assert.match(aboutSource, /inline-flex min-h-11 items-center gap-1\.5 px-5 py-2\.5/, "소개 버튼형 링크");
});
