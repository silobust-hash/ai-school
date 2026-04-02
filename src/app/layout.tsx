import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-school.silronomu.com";

export const metadata: Metadata = {
  title: {
    default: "AI업무학교 | 문과 출신도 AI로 일하는 시대, 기초부터 고급까지",
    template: "%s | AI업무학교",
  },
  description: "비개발자를 위한 AI 활용 완전 정복. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 문과 출신 19년차 노무사가 5과 27개 강의로 AI 업무 활용법을 가르칩니다.",
  keywords: ["AI 강의", "AI 교육", "프롬프트엔지니어링", "컨텍스트엔지니어링", "바이브코딩", "비개발자 AI", "AI 업무 자동화", "AI업무학교", "클로드 코드"],
  authors: [{ name: "박실로", url: "https://silronomu.com" }],
  creator: "박실로 (공인노무사)",
  publisher: "한동노무법인",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "AI업무학교",
    title: "AI업무학교 | 문과 출신도 AI로 일하는 시대, 기초부터 고급까지",
    description: "비개발자를 위한 AI 활용 완전 정복. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 5과 27개 강의.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI업무학교 | 문과 출신도 AI로 일하는 시대",
    description: "비개발자를 위한 AI 활용 완전 정복. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 5과 27개 강의.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "박실로",
  alternateName: ["Park Silro", "실로노무사"],
  jobTitle: "공인노무사",
  worksFor: {
    "@type": "Organization",
    name: "한동노무법인",
  },
  knowsAbout: [
    "노동법", "근로기준법", "Claude Code", "AI 업무 자동화",
    "프롬프트엔지니어링", "컨텍스트엔지니어링", "바이브코딩",
    "비개발자 AI 활용",
  ],
  description: "19년차 공인노무사이자 AI 활용 교육자. 비개발자 전문직을 위한 AI 교육을 진행합니다.",
  url: "https://silronomu.com",
  sameAs: [
    "https://blog.silronomu.com",
    "https://edu.silronomu.com",
    "https://ai-school.silronomu.com",
    "https://www.threads.com/@silrobag",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI업무학교",
  url: SITE_URL,
  description: "문과 출신도 AI로 일하는 시대. 프롬프트엔지니어링부터 에이전트엔지니어링까지.",
  author: { "@type": "Person", name: "박실로" },
  publisher: { "@type": "Organization", name: "한동노무법인" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-teal-600">
              AI업무학교
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/curriculum" className="hover:text-teal-600 transition-colors">커리큘럼</Link>
              <Link href="/lessons" className="hover:text-teal-600 transition-colors">강의 목록</Link>
              <Link href="/about" className="hover:text-teal-600 transition-colors">소개</Link>
              <a href="https://edu.silronomu.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors flex items-center gap-1">
                클로드 코드 심화 →
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <Analytics />
        <footer className="border-t border-slate-200 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-10 text-center text-sm text-slate-500">
            <p className="font-medium text-slate-600">한동노무법인 | 대표 공인노무사 박실로</p>
            <p className="mt-1">문과 출신도 AI로 일하는 시대</p>
            <div className="flex justify-center gap-4 mt-3">
              <a href="https://silronomu.com/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">홈페이지</a>
              <span className="text-slate-300">|</span>
              <a href="https://ai-school.silronomu.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">AI업무학교</a>
              <span className="text-slate-300">|</span>
              <a href="https://edu.silronomu.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">클로드 코드 강의</a>
              <span className="text-slate-300">|</span>
              <a href="https://www.threads.com/@silrobag?hl=ko" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">Threads</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
