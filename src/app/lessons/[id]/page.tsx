import { lessons } from "@/data/lessons";
import { getLessonFromBlob } from "@/lib/storage";
import Link from "next/link";
import { notFound } from "next/navigation";
import LessonReactions from "./LessonReactions";

export const revalidate = 60; // Revalidate every 60 seconds for ISR

export function generateStaticParams() {
  return Object.keys(lessons).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let lesson: Record<string, unknown> | null = null;
  try {
    lesson = await getLessonFromBlob(id);
  } catch {
    // Fall back to static
  }

  if (!lesson) {
    const staticLesson = lessons[id];
    if (!staticLesson) return { title: "강의를 찾을 수 없습니다" };
    return {
      title: `${staticLesson.title} | AI업무학교`,
      description: staticLesson.summary,
      alternates: { canonical: `/lessons/${id}` },
    };
  }

  return {
    title: `${lesson.title} | AI업무학교`,
    description: (lesson.summary as string) || undefined,
    alternates: { canonical: `/lessons/${id}` },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Try blob first, fall back to static data
  let lesson: Record<string, any> | null = null;
  try {
    lesson = await getLessonFromBlob(id);
  } catch {
    // Blob not available, use static
  }

  if (!lesson) {
    lesson = lessons[id];
  }

  if (!lesson) notFound();

  const prevId = lesson.prev ? lesson.prev : null;
  const nextId = lesson.next ? lesson.next : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lesson.title,
    description: lesson.summary,
    author: { "@type": "Person", name: "박실로", jobTitle: "공인노무사" },
    publisher: { "@type": "Organization", name: "한동노무법인" },
    isPartOf: {
      "@type": "Course",
      name: "AI업무학교",
    },
    educationalLevel: "Beginner",
    inLanguage: "ko",
  };

  const faqJsonLd = lesson.faq && lesson.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lesson.faq.map((f: { question: string; answer: string }) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* JSON-LD: Article structured data (server-generated, trusted content) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="mb-8">
        <Link href="/lessons" className="text-sm text-teal-500 hover:text-teal-700 transition-colors">
          ← 강의 목록으로
        </Link>
      </div>

      <div className="mb-6">
        <span className="text-xs font-bold text-teal-500 bg-teal-50 px-3 py-1 rounded-full">
          {lesson.phase}
        </span>
        <span className="text-xs text-slate-400 ml-2">{lesson.id}</span>
      </div>

      <h1 className="text-3xl font-bold mb-4 leading-tight">{lesson.title}</h1>
      <p className="text-lg text-slate-500 mb-10 leading-relaxed">{lesson.summary}</p>

      <div className="prose prose-slate max-w-none">
        {lesson.sections.map((section: { heading: string; content: string; code?: string; tip?: string }, i: number) => (
          <div key={i} className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-slate-800">{section.heading}</h2>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line mb-4">{section.content}</div>
            {section.code && (
              <pre className="bg-slate-900 text-green-400 rounded-xl p-5 overflow-x-auto text-sm leading-relaxed mb-4">
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

      {lesson.keyTakeaways && (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mt-10">
          <h3 className="font-bold text-teal-800 mb-3">핵심 정리</h3>
          <ul className="space-y-2">
            {lesson.keyTakeaways.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-teal-700">
                <span className="shrink-0 mt-0.5">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.faq && lesson.faq.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-6">
          <h3 className="font-bold text-slate-700 mb-4">자주 묻는 질문</h3>
          <div className="space-y-4">
            {lesson.faq.map((f: { question: string; answer: string }, i: number) => (
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

      {lesson.relatedLinks && lesson.relatedLinks.length > 0 && (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mt-6">
          <h3 className="font-bold text-teal-800 mb-3">더 깊이 배우기</h3>
          <ul className="space-y-2">
            {lesson.relatedLinks.map((link: { label: string; url: string }, i: number) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:text-teal-800 hover:underline">
                  {link.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

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
