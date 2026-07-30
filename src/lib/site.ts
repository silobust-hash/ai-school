const DEFAULT_SITE_URL = "https://ai-school.silronomu.com";

export const OFFICIAL_FIRM_URL = "https://xn--2q1bm94d.com";
export const OFFICIAL_FIRM_MEMBERS_URL = `${OFFICIAL_FIRM_URL}/members`;
export const PERSON_INDUSTRIAL_SAFETY_BLOG_URL = "https://sanjae.silronomu.com/";
export const PERSON_INDUSTRIAL_SAFETY_BLOG_LABEL = "산재·산업안전 전문 블로그";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
).replace(/\/+$/, "");

export const PERSON_ID = "https://silronomu.com/#person";
export const HANDONG_ORGANIZATION_ID = `${OFFICIAL_FIRM_URL}/#organization`;
export const AI_SCHOOL_ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const COURSE_ID = `${SITE_URL}/#course`;

// Profiles that identify the same person. Topic sites belong in subjectOf, not sameAs.
export const PERSON_SAME_AS = [
  "https://blog.naver.com/5215678",
  "https://silronomusa.blogspot.com/",
  "https://www.facebook.com/people/박실로/100063776575717/",
  "https://www.instagram.com/silrobag/",
  "https://www.threads.com/@silrobag",
  "https://www.youtube.com/@코딩하는노무사",
  "https://www.linkedin.com/in/%EC%8B%A4%EB%A1%9C-%EB%B0%95-385a1a104",
];
