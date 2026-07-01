import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-school.silronomu.com";
const PERSON_ID = "https://silronomu.com/#person";
const ORG_ID = "https://silronomu.com/#organization";

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
    default: "AI업무학교 | 문과 출신도 AI로 일하는 시대, 기초부터 고급까지",
    template: "%s | AI업무학교",
  },
  description: "비개발자를 위한 AI 활용 완전 정복. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 문과 출신 19년차 노무사가 6과 40개 강의로 AI 업무 활용법을 가르칩니다.",
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
    description: "비개발자를 위한 AI 활용 완전 정복. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 6과 40개 강의.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AI업무학교 — 문과 출신도 AI로 일하는 시대" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI업무학교 | 문과 출신도 AI로 일하는 시대",
    description: "비개발자를 위한 AI 활용 완전 정복. 프롬프트엔지니어링부터 에이전트엔지니어링까지, 6과 40개 강의.",
    images: ["/og.png"],
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

// Unified knowsAbout / sameAs definitions reused across the site graph.
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

const SAME_AS = [
  "https://silronomu.com/",
  "https://blog.silronomu.com/",
  "https://sanjae.silronomu.com/",
  "https://edu.silronomu.com/",
  "https://ai-school.silronomu.com/",
  "https://xn--hc0b21e4rq52a9zgfzlxub.com/",
  "https://xn--hc0b21et01ao2a.com/",
  "https://xn--hc0bn7fv7j9tf6rl.net/",
  "https://blog.naver.com/5215678",
  "https://silronomusa.blogspot.com/",
  "https://www.facebook.com/share/17SYegaFj5/",
  "https://www.instagram.com/silrobag/",
  "https://www.threads.net/@silrobag",
  "https://x.com/silrobag",
  "https://youtube.com/channel/UCAkNJ16PNf2cNfhXsVbh-gg",
  "https://www.linkedin.com/in/실로-박-385a1a104/",
];

const organizationJsonLd = {
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#org`,
  name: "한동노무법인",
  url: "https://silronomu.com",
  logo: `${SITE_URL}/og.png`,
  sameAs: SAME_AS,
  founder: { "@id": PERSON_ID },
  parentOrganization: { "@id": ORG_ID },
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
  alternateName: ["Park Silro", "실로노무사"],
  jobTitle: "공인노무사",
  worksFor: { "@id": ORG_ID },
  knowsAbout: KNOWS_ABOUT,
  description: "19년차 공인노무사이자 AI 활용 교육자. 비개발자 전문직을 위한 AI 교육을 진행합니다.",
  url: "https://silronomu.com",
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "공인노무사",
    recognizedBy: { "@type": "GovernmentOrganization", name: "고용노동부" },
    identifier: { "@type": "PropertyValue", name: "공인노무사 직무개시등록번호", value: "제1243호" },
  },
  sameAs: SAME_AS,
};

const websiteJsonLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "AI업무학교",
  description: "문과 출신도 AI로 일하는 시대. 프롬프트엔지니어링부터 에이전트엔지니어링까지.",
  inLanguage: "ko",
  publisher: { "@id": `${SITE_URL}/#org` },
  about: { "@id": PERSON_ID },
};

const siteGraphJsonLd = {
  "@context": "https://schema.org",
  "@graph": [organizationJsonLd, websiteJsonLd, personJsonLd],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphJsonLd) }}
        />
      </head>
      <body className="antialiased">
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
                <a href="https://silronomu.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-dark-text-soft)] hover:text-white transition-colors">홈페이지</a>
                <a href="https://ai-school.silronomu.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-dark-text-soft)] hover:text-white transition-colors">AI업무학교</a>
                <a href="https://edu.silronomu.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-dark-text-soft)] hover:text-white transition-colors">클로드 코드 강의</a>
                <a href="https://www.threads.com/@silrobag?hl=ko" target="_blank" rel="noopener noreferrer" className="text-[var(--color-dark-text-soft)] hover:text-white transition-colors">Threads</a>
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
