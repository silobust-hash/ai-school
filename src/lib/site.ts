const DEFAULT_SITE_URL = "https://ai-school.silronomu.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
).replace(/\/+$/, "");

export const PERSON_ID = "https://silronomu.com/#person";
export const HANDONG_ORGANIZATION_ID = "https://silronomu.com/#organization";
export const AI_SCHOOL_ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const COURSE_ID = `${SITE_URL}/#course`;

// Profiles that identify the same person. Topic sites belong in subjectOf, not sameAs.
export const PERSON_SAME_AS = [
  "https://blog.naver.com/5215678",
  "https://silronomusa.blogspot.com/",
  "https://www.facebook.com/profile.php?id=100063776575717",
  "https://www.instagram.com/silrobag/",
  "https://www.threads.com/@silrobag",
  "https://www.youtube.com/channel/UCAkNJ16PNf2cNfhXsVbh-gg",
  "https://www.linkedin.com/in/%EC%8B%A4%EB%A1%9C-%EB%B0%95-385a1a104",
];
