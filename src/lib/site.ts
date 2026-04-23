// Single source of truth for site-wide SEO/AI-search metadata.
// Imported by layout, per-page metadata exports, sitemap, robots,
// manifest, opengraph-image, and JSON-LD Organization/WebSite blocks.

export const SITE_URL = "https://skkuverse.com";
export const SITE_NAME = "스꾸버스";
export const SITE_TAGLINE = "성균관 유니버스";
export const SITE_DEFAULT_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;
export const SITE_DESCRIPTION =
  "성균관대 학생을 위한 AI 공지 요약·셔틀버스·캠퍼스 정보 플랫폼. 오늘의 공지부터 혜화역 셔틀, 자과캠 셔틀까지 한 곳에서.";
export const SITE_SHORT_DESCRIPTION = "오늘의 공지·셔틀·장소, 성대생이 함께";

export const SITE_LOCALE = "ko_KR";
export const SITE_LANGUAGE = "ko";

// Brand colors (kept in sync with globals.css @theme inline)
export const BRAND_COLOR = "#1f3d2e";
export const BRAND_BG = "#ffffff";

// AS-wide keyword seed — kept under 15 per SEO guidance to avoid dilution.
export const SITE_KEYWORDS = [
  "성균관대",
  "성균관대학교",
  "SKKU",
  "스꾸버스",
  "성대",
  "성균관대 셔틀버스",
  "혜화역 셔틀",
  "자과캠 셔틀",
  "인사캠",
  "자과캠",
  "AI 공지",
  "성대 공지",
  "캠퍼스맵",
];

// Used to construct Organization JSON-LD sameAs + Footer/support links.
export const APP_STORE_ID = "6446813434";
export const APP_STORE_URL = `https://apps.apple.com/kr/app/skku-bus/id${APP_STORE_ID}`;
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.zoyoong.skkubus";
export const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_cjxexdG/chat";
export const SUPPORT_EMAIL = "zoyoong124@gmail.com";

export type SitePage = {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  // When false, page opts out of sitemap/robots indexing.
  indexable: boolean;
};

// Central enumeration of public routes. Sitemap + llms.txt both read from this.
// Dynamic slugs (/notice/[slug], /feed/[slug]) are intentionally excluded —
// their `robots: { index: false }` status applies to the index too.
export const SITE_PAGES: SitePage[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0, indexable: true },
  { path: "/bus", changeFrequency: "monthly", priority: 0.9, indexable: true },
  {
    path: "/bus/insa",
    changeFrequency: "monthly",
    priority: 0.9,
    indexable: true,
  },
  {
    path: "/bus/inja",
    changeFrequency: "monthly",
    priority: 0.9,
    indexable: true,
  },
  { path: "/team", changeFrequency: "monthly", priority: 0.6, indexable: true },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6, indexable: true },
  {
    path: "/support",
    changeFrequency: "yearly",
    priority: 0.4,
    indexable: true,
  },
  {
    path: "/privacy",
    changeFrequency: "yearly",
    priority: 0.3,
    indexable: true,
  },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, indexable: true },
  // /notice and /feed are robots:noindex — excluded from sitemap.
];

// Build an absolute URL from a path (handles leading slash).
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p === "/" ? "" : p}`;
}

// Re-usable OG image descriptor — points at the Next.js file-convention OG
// route at app/opengraph-image.tsx, which emits an absolute URL at build time.
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
};
