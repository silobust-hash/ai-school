import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import net from "node:net";
import { spawn } from "node:child_process";
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

before(async () => {
  if (baseUrl) return;

  const port = await getFreePort();
  baseUrl = `http://127.0.0.1:${port}`;
  devServer = spawn(
    "npm",
    ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      env: { ...process.env, NEXT_PUBLIC_SITE_URL: baseUrl },
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

after(async () => {
  if (!devServer || devServer.exitCode != null) return;
  devServer.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => devServer.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
});

test("공개 HTML 페이지는 self-canonical과 단일 H1을 사용한다", async () => {
  const paths = ["/", "/about", "/curriculum", "/lessons", "/lessons/1-1", "/lessons/6-14"];

  for (const path of paths) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, `${path} 응답 상태`);
    const html = await response.text();
    const canonicals = extractAll(
      html,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/gi,
    );
    const h1s = extractAll(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);

    assert.deepEqual(canonicals, [`${baseUrl}${path === "/" ? "" : path}`], `${path} canonical`);
    assert.equal(h1s.length, 1, `${path} H1 개수`);
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
  assert.deepEqual(person.jobTitle, ["공인노무사", "AI 교육자"]);
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
  assert.match(llms, new RegExp(`\\[강의 목록\\]\\(${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/lessons\\)`));
  assert.equal(extractAll(llms, /^- \[\d+-\d+\./gm).length, 42);
  assert.match(robots, /User-Agent: OAI-SearchBot/i);
  assert.match(robots, /User-Agent: Perplexity-User/i);
  assert.doesNotMatch(robots, /anthropic-ai|Claude-Web/i);
  assert.match(robots, new RegExp(`Sitemap: ${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`));
  assert.equal(extractAll(sitemap, /<loc>([^<]+)<\/loc>/g).length, 46);
  assert.match(sitemap, new RegExp(`<loc>${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/lessons</loc>`));
});
