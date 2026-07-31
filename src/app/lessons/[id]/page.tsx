import { lessons } from "@/data/lessons";
import { getLessonFromBlob } from "@/lib/storage";
import Link from "next/link";
import LessonReactions from "./LessonReactions";
import LessonPresentation from "@/components/LessonPresentation";
import LessonGate from "@/components/LessonGate";
import LessonActionKit from "@/components/LessonActionKit";
import LessonProgressTracker from "@/components/LessonProgressTracker";
import { toSafeJsonLd } from "@/lib/jsonld";
import { notFound } from "next/navigation";
import {
  AI_SCHOOL_ORGANIZATION_ID,
  COURSE_ID,
  PERSON_ID,
  SITE_URL,
} from "@/lib/site";
import type { Metadata } from "next";
import { isLessonAccessGranted, sanitizeLessonForPublic } from "@/lib/lesson-access";

const SITE_LAUNCH_DATE = "2026-04-02";

export const dynamic = "force-dynamic";

const lessonJsonLdFromLesson = (lesson: Record<string, unknown>, canAccess: boolean) => {
  const title = lesson.title as string;
  const summary = (lesson.summary as string) || "";
  const datePublished = (lesson.datePublished as string) || SITE_LAUNCH_DATE;
  const dateModified = (lesson.dateModified as string) || datePublished;
  const lessonUrl = `${SITE_URL}/lessons/${lesson.id}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${lessonUrl}#article`,
    url: lessonUrl,
    headline: title,
    description: summary,
    mainEntityOfPage: lessonUrl,
    image: `${SITE_URL}/og.png`,
    articleSection: lesson.phase,
    datePublished,
    dateModified,
    author: { "@id": PERSON_ID },
    publisher: {
      "@type": "EducationalOrganization",
      "@id": AI_SCHOOL_ORGANIZATION_ID,
      name: "AI업무학교",
    },
    isPartOf: {
      "@type": "Course",
      "@id": COURSE_ID,
      name: "AI업무학교",
    },
    educationalLevel: "Beginner",
    inLanguage: "ko-KR",
  };

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${lessonUrl}#learning-resource`,
    url: lessonUrl,
    name: title,
    description: summary,
    educationalLevel: "Beginner",
    inLanguage: "ko-KR",
    isPartOf: { "@id": COURSE_ID },
    author: { "@id": PERSON_ID },
    provider: { "@id": AI_SCHOOL_ORGANIZATION_ID },
    teaches: canAccess ? lesson.keyTakeaways : undefined,
    isAccessibleForFree: true,
    learningResourceType: "lesson",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "강의 목록", item: `${SITE_URL}/lessons` },
      { "@type": "ListItem", position: 3, name: title, item: lessonUrl },
    ],
  };

  const faqJsonLd = canAccess && Array.isArray(lesson.faq) && lesson.faq.length > 0
    ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (lesson.faq as Array<{ question: string; answer: string }>).map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    }
    : null;

  return {
    articleJsonLd,
    learningResourceJsonLd,
    breadcrumbJsonLd,
    faqJsonLd,
  };
};

function renderProtectedContent(lesson: Record<string, unknown>) {
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  const keyTakeaways = Array.isArray(lesson.keyTakeaways)
    ? lesson.keyTakeaways.filter((item): item is string => typeof item === "string")
    : [];
  const faq = Array.isArray(lesson.faq) ? lesson.faq : [];
  const relatedLinks = Array.isArray(lesson.relatedLinks) ? lesson.relatedLinks : [];
  return (
    <>
      <div className="mb-10">
        <LessonPresentation lesson={lesson as any} accent="#14b8a6" />
      </div>

      <LessonActionKit lesson={lesson as any} />

      <div className="prose prose-slate max-w-none">
        {(sections as Array<{ heading: string; content: string; code?: string; tip?: string }>).map((section, i) => (
          <div key={i} className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-slate-800">{section.heading}</h2>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line mb-4">{section.content}</div>
            {section.code && (
              <pre className="bg-slate-900 text-green-400 rounded-xl p-5 overflow-x-auto whitespace-pre-wrap break-words text-sm leading-relaxed mb-4 sm:whitespace-pre sm:break-normal">
                <code>{section.code}</code>
              </pre>
            )}
            {section.tip && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <span className="font-bold">TIP: </span>{section.tip}
              </div>
            )}
          </div>
        ))}
      </div>

      {keyTakeaways.length > 0 && (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mt-10">
          <h3 className="font-bold text-teal-800 mb-3">핵심 정리</h3>
          <ul className="space-y-2">
            {keyTakeaways.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-teal-700">
                <span className="shrink-0 mt-0.5">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {faq.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-6">
          <h3 className="font-bold text-slate-700 mb-4">자주 묻는 질문</h3>
          <div className="space-y-4">
            {faq.map((f: { question: string; answer: string }, i: number) => (
              <details key={i} className="group">
                <summary className="cursor-pointer font-medium text-slate-700 hover:text-teal-600 list-none flex items-center justify-between [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span className="text-teal-400 transition-transform group-open:rotate-45 shrink-0 ml-4">+</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {relatedLinks.length > 0 && (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mt-6">
          <h3 className="font-bold text-teal-800 mb-3">더 깊이 배우기</h3>
          <ul className="space-y-2">
            {relatedLinks.map((link: { label: string; url: string }, i: number) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:text-teal-800 hover:underline">
                  {link.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let lesson: Record<string, any> | null = null;
  try {
    lesson = await getLessonFromBlob(id);
  } catch {
    // no-op
  }

  if (!lesson) {
    lesson = lessons[id];
  }

  if (!lesson) notFound();

  const canAccess = await isLessonAccessGranted();
  const publicLesson = canAccess ? lesson : sanitizeLessonForPublic(lesson);

  const { articleJsonLd, learningResourceJsonLd, breadcrumbJsonLd, faqJsonLd } = lessonJsonLdFromLesson(
    publicLesson,
    canAccess,
  );

  const prevId = lesson.prev ? lesson.prev : null;
  const nextId = lesson.next ? lesson.next : null;
  const lessonCatalog = Object.keys(lessons)
    .sort((a, b) => a.localeCompare(b))
    .map((lessonId) => ({
      id: lessonId,
      title: lessons[lessonId].title,
    }));

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLd(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLd(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLd(faqJsonLd) }} />}

      <div className="mb-8">
        <Link href="/lessons" className="text-sm text-teal-500 hover:text-teal-700 transition-colors">
          ← 강의 목록으로
        </Link>
      </div>

      <div className="mb-6">
        <span className="text-xs font-bold text-teal-500 bg-teal-50 px-3 py-1 rounded-full">
          {publicLesson.phase}
        </span>
        <span className="text-xs text-slate-400 ml-2">{publicLesson.id}</span>
      </div>

      <h1 className="text-3xl font-bold mb-4 leading-tight break-words" style={{ overflowWrap: "anywhere" }}>{publicLesson.title}</h1>
      <p className="text-lg text-slate-500 mb-6 leading-relaxed break-words" style={{ overflowWrap: "anywhere" }}>{publicLesson.summary}</p>

      {canAccess ? (
        renderProtectedContent(lesson)
      ) : (
        <LessonGate accent="#14b8a6">
          <div className="mb-10 text-sm text-slate-500 text-center">
            상세 강의안은 인증이 필요합니다.
            <br />
            현재 공개되는 정보는 요약/개요이며, 본문은 오늘의 접근 코드로 열립니다.
          </div>
        </LessonGate>
      )}
      {canAccess ? (
        <LessonProgressTracker
          lessonId={id}
          lessonTitle={lesson.title as string}
          lessonCatalog={lessonCatalog}
        />
      ) : null}

      <LessonReactions lessonId={id} />

      <div className="flex justify-between mt-12 pt-8 border-t border-slate-200">
        {prevId ? (
          <Link href={`/lessons/${prevId}`} className="text-sm text-teal-500 hover:text-teal-700">
            ← 이전 강의
          </Link>
        ) : <div />}
        {nextId ? (
          <Link href={`/lessons/${nextId}`} className="text-sm text-teal-500 hover:text-teal-700">
            다음 강의 →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(lessons).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  let lesson: Record<string, unknown> | null = null;
  try {
    lesson = await getLessonFromBlob(id);
  } catch {
    // no-op
  }

  if (!lesson) {
    const staticLesson = lessons[id];
    if (!staticLesson) return { title: "강의를 찾을 수 없습니다" };
    return {
      title: staticLesson.title,
      description: staticLesson.summary,
      alternates: { canonical: `/lessons/${id}` },
      openGraph: {
        type: "article",
        title: `${staticLesson.title} | AI업무학교`,
        description: staticLesson.summary,
        url: `${SITE_URL}/lessons/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: staticLesson.title,
        description: staticLesson.summary,
      },
    };
  }

  const title = lesson.title as string;
  const summary = (lesson.summary as string) || undefined;
  return {
    title,
    description: summary,
    alternates: { canonical: `/lessons/${id}` },
    openGraph: {
      type: "article",
      title: `${title} | AI업무학교`,
      description: summary,
      url: `${SITE_URL}/lessons/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
    },
  };
}
