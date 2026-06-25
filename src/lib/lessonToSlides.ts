// 강의 데이터(sections/keyTakeaways/insights)를 현장 발표용 슬라이드 배열로 변환한다.
// 순수 함수 — 서버/클라이언트 어디서든 동일 결과. 발표 컴포넌트가 이 결과를 렌더한다.

export type SlideBlock =
  | { type: "para"; text: string }
  | { type: "list"; items: string[] };

export type Slide =
  | { kind: "title"; phase: string; title: string; summary?: string; lessonId?: string }
  | { kind: "section"; heading: string; part?: string; blocks: SlideBlock[]; tip?: string }
  | { kind: "code"; heading: string; code: string }
  | { kind: "insight"; heading: string; blocks: SlideBlock[]; source?: string }
  | { kind: "takeaways"; points: string[] };

const BULLET_RE = /^(\s*([-*•]|\[|\d+[.)]|\d+단계|[①-⑳]))/;

// 한 덩어리의 content 문자열을 단락/리스트 블록으로 파싱한다.
export function parseContent(content: string): SlideBlock[] {
  if (!content) return [];
  const paras = content
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return paras.map((p): SlideBlock => {
    const lines = p
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const bulletLines = lines.filter((l) => BULLET_RE.test(l));
    // 단락 안의 절반 이상이 글머리표 패턴이면 리스트로 본다.
    if (bulletLines.length >= 2 && bulletLines.length >= lines.length * 0.5) {
      return {
        type: "list",
        items: lines.map((l) => l.replace(/^\s*([-*•]\s*)/, "").trim()),
      };
    }
    return { type: "para", text: lines.join(" ") };
  });
}

// 블록이 많은 섹션은 발표 화면에 다 안 들어가므로 청크로 쪼갠다.
function chunkBlocks(blocks: SlideBlock[], maxPerSlide = 4): SlideBlock[][] {
  if (blocks.length <= maxPerSlide) return [blocks];
  const chunks: SlideBlock[][] = [];
  for (let i = 0; i < blocks.length; i += maxPerSlide) {
    chunks.push(blocks.slice(i, i + maxPerSlide));
  }
  return chunks;
}

export interface LessonLike {
  id?: string;
  phase?: string;
  title?: string;
  summary?: string;
  sections?: { heading: string; content: string; code?: string; tip?: string }[];
  insights?: { heading: string; content: string; source?: string }[];
  keyTakeaways?: string[];
}

export function lessonToSlides(lesson: LessonLike): Slide[] {
  const slides: Slide[] = [];

  // 1) 표지
  slides.push({
    kind: "title",
    phase: lesson.phase ?? "",
    title: lesson.title ?? "",
    summary: lesson.summary,
    lessonId: lesson.id,
  });

  // 2) 본문 섹션 → 슬라이드(필요 시 분할), code는 별도 슬라이드, tip은 해당 섹션 마지막 슬라이드에
  for (const section of lesson.sections ?? []) {
    const blocks = parseContent(section.content);
    const chunks = chunkBlocks(blocks);
    chunks.forEach((chunk, ci) => {
      slides.push({
        kind: "section",
        heading: section.heading,
        part: chunks.length > 1 ? `${ci + 1}/${chunks.length}` : undefined,
        blocks: chunk,
        // tip은 마지막 청크에만 붙인다.
        tip: ci === chunks.length - 1 ? section.tip : undefined,
      });
    });
    if (section.code) {
      slides.push({ kind: "code", heading: section.heading, code: section.code });
    }
  }

  // 3) 현장 인사이트(옵시디언 독서·AI 노트에서 녹인 것)
  for (const ins of lesson.insights ?? []) {
    slides.push({
      kind: "insight",
      heading: ins.heading,
      blocks: parseContent(ins.content),
      source: ins.source,
    });
  }

  // 4) 핵심 정리
  if (lesson.keyTakeaways && lesson.keyTakeaways.length) {
    slides.push({ kind: "takeaways", points: lesson.keyTakeaways });
  }

  return slides;
}
