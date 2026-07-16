import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import EducationChannelBar from "@/components/EducationChannelBar";
import SiteNav from "@/components/SiteNav";
import { lessons } from "@/data/lessons";
import {
  AI_SCHOOL_ORGANIZATION_ID,
  COURSE_ID,
  HANDONG_ORGANIZATION_ID,
  PERSON_ID,
  PERSON_SAME_AS,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/site";
import "./globals.css";
import { toSafeJsonLd } from "@/lib/jsonld";

const lessonCount = Object.keys(lessons).length;

export const metadata: Metadata = {
  verification: {
    google: [
      "bRgnvlb-svjtVk7G_TzQ4Upk4pjpA6VtOX4Mg1sTy9w",
      "jDjQK62YKg_1xwI2u6s_g0vlKnPswsoAdYUf_jnPQk8",
    ],
    other: {
      "naver-site-verification": "9ba643b70c9a976977e2e3f00918bbfebc1773d9",
    },
  },
  title: {
    default: "AI업무학교 | 비개발자를 위한 AI 실무 교육",
    template: "%s | AI업무학교",
  },
  description: `비개발자를 위한 AI 활용 교육. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 현업에서 직접 써보고 다듬은 내용을 6과 ${lessonCount}개 강의로 정리했습니다.`,
  keywords: ["AI 강의", "AI 교육", "프롬프트엔지니어링", "컨텍스트엔지니어링", "바이브코딩", "비개발자 AI", "AI 업무 자동화", "AI업무학교", "클로드 코드"],
  authors: [{ name: "박실로", url: "https://silronomu.com" }],
  creator: "박실로 공인노무사",
  publisher: "AI업무학교",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "AI업무학교",
    title: "AI업무학교 | 비개발자를 위한 AI 실무 교육",
    description: `비개발자를 위한 AI 업무 활용 과정. 현업에서 직접 써보고 다듬은 내용을 6과 ${lessonCount}개 강의로 정리했습니다.`,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI업무학교 | 문과 출신도 AI로 일하는 시대",
    description: `현업에서 직접 써보고 다듬은 비개발자 AI 업무 활용 과정, 6과 ${lessonCount}강.`,
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

const KNOWS_ABOUT = [
  "노동법",
  "근로기준법",
  "산업안전보건법",
  "Claude Code",
  "AI 업무 자동화",
  "프롬프트엔지니어링",
  "컨텍스트엔지니어링",
  "바이브코딩",
  "비개발자 AI 활용",
];

const aiSchoolOrganizationJsonLd = {
  "@type": "EducationalOrganization",
  "@id": AI_SCHOOL_ORGANIZATION_ID,
  name: "AI업무학교",
  alternateName: "AI Work School",
  url: SITE_URL,
  logo: `${SITE_URL}/og.png`,
  description: "비개발자를 위한 AI 업무 활용 교육 사이트",
  founder: { "@id": PERSON_ID },
  parentOrganization: { "@id": HANDONG_ORGANIZATION_ID },
};

const handongOrganizationJsonLd = {
  "@type": "Organization",
  "@id": HANDONG_ORGANIZATION_ID,
  name: "한동노무법인",
  url: "https://silronomu.com/",
  employee: { "@id": PERSON_ID },
  telephone: "+82-62-521-5678",
  address: {
    "@type": "PostalAddress",
    streetAddress: "금재로 27, 3층",
    addressLocality: "북구",
    addressRegion: "광주광역시",
    postalCode: "61239",
    addressCountry: "KR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 35.1741, longitude: 126.9123 },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  areaServed: { "@type": "Country", name: "대한민국" },
};

const personJsonLd = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "박실로",
  alternateName: ["박실로 노무사", "Park Silro", "실로노무사"],
  jobTitle: "공인노무사",
  worksFor: { "@id": HANDONG_ORGANIZATION_ID },
  affiliation: { "@id": AI_SCHOOL_ORGANIZATION_ID },
  knowsAbout: KNOWS_ABOUT,
  description: "노무 실무에 AI를 직접 적용하며 비개발자를 위한 AI 실무 교육 콘텐츠를 운영하는 공인노무사입니다.",
  url: "https://silronomu.com",
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "공인노무사",
    recognizedBy: { "@type": "GovernmentOrganization", name: "고용노동부" },
    identifier: { "@type": "PropertyValue", name: "공인노무사 직무개시등록번호", value: "제1243호" },
  },
  sameAs: PERSON_SAME_AS,
  subjectOf: {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#profile-page`,
    url: `${SITE_URL}/about`,
  },
};

const websiteJsonLd = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: "AI업무학교",
  description: "문과 출신도 AI로 일하는 시대. 프롬프트엔지니어링부터 에이전트엔지니어링까지.",
  inLanguage: "ko-KR",
  publisher: { "@id": AI_SCHOOL_ORGANIZATION_ID },
  about: [{ "@id": PERSON_ID }, { "@id": COURSE_ID }],
};

const siteGraphJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    aiSchoolOrganizationJsonLd,
    handongOrganizationJsonLd,
    websiteJsonLd,
    personJsonLd,
  ],
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
          // JSON-LD structured data graph for SEO — static content, no user input
          dangerouslySetInnerHTML={{ __html: toSafeJsonLd(siteGraphJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <EducationChannelBar />
        <SiteNav />
        <main>{children}</main>
        <Analytics />
        <footer className="relative overflow-hidden bg-mesh-dark bg-grain text-[var(--color-dark-text)] mt-24">
          <div className="bg-dotgrid-dark absolute inset-0 opacity-50" aria-hidden />
          <div className="relative max-w-6xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
              <div className="max-w-md">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-[var(--color-primary)] text-white text-base font-extrabold">
                    AI
                  </span>
                  <span className="text-lg font-extrabold tracking-tight">업무학교</span>
                </div>
                <p className="font-display text-2xl font-bold leading-snug keep-all">
                  문과 출신도 AI로 일하는 시대
                </p>
                <p className="mt-3 text-sm text-[var(--color-dark-text-soft)] leading-relaxed">
                  한동노무법인 · 대표 공인노무사 박실로
                </p>
              </div>

              <nav className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm" aria-label="사이트 링크">
                <a href="https://silronomu.com/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[var(--color-dark-text-soft)] hover:text-white transition-colors">홈페이지</a>
                <a href="https://ai-school.silronomu.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[var(--color-dark-text-soft)] hover:text-white transition-colors">AI업무학교</a>
                <a href="https://edu.silronomu.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[var(--color-dark-text-soft)] hover:text-white transition-colors">클로드 코드 강의</a>
                <a href="https://blog.silronomu.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[var(--color-dark-text-soft)] hover:text-white transition-colors">노무 실무 블로그</a>
              </nav>
            </div>

            <div className="mt-12 pt-6 border-t border-[var(--color-dark-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[var(--color-dark-text-soft)]">
              <p>© {new Date().getFullYear()} 한동노무법인. All rights reserved.</p>
              <p>프롬프트엔지니어링부터 에이전트엔지니어링까지</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
