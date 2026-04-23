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
  // When false, page opts out of sitemap inclusion. Must stay in sync with
  // the page file's `robots: { index: false }` meta — source of truth for
  // search engines is the meta tag; this field documents intent here.
  indexable: boolean;
  // Repo-relative path used by sitemap.ts to derive per-page lastmod from
  // `git log -1`. Shared components aren't tracked — last page-file commit
  // is a good-enough proxy. Omitted → build time date is used as fallback.
  sourceFile?: string;
};

// Central enumeration of public routes (including intentionally noindex'd
// ones — kept in this list for documentation so future contributors can see
// the full inventory, not a silent omission). The sitemap generator filters
// by `indexable === true`.
export const SITE_PAGES: SitePage[] = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1.0,
    indexable: true,
    sourceFile: "src/app/page.tsx",
  },
  {
    path: "/bus",
    changeFrequency: "monthly",
    priority: 0.9,
    indexable: true,
    sourceFile: "src/app/bus/page.tsx",
  },
  {
    path: "/bus/insa",
    changeFrequency: "monthly",
    priority: 0.9,
    indexable: true,
    sourceFile: "src/app/bus/insa/page.tsx",
  },
  {
    path: "/bus/inja",
    changeFrequency: "monthly",
    priority: 0.9,
    indexable: true,
    sourceFile: "src/app/bus/inja/page.tsx",
  },
  {
    path: "/team",
    changeFrequency: "monthly",
    priority: 0.6,
    indexable: true,
    sourceFile: "src/app/team/page.tsx",
  },
  {
    path: "/faq",
    changeFrequency: "monthly",
    priority: 0.6,
    indexable: true,
    sourceFile: "src/app/faq/page.tsx",
  },
  {
    path: "/support",
    changeFrequency: "yearly",
    priority: 0.4,
    indexable: true,
    sourceFile: "src/app/support/page.tsx",
  },
  {
    path: "/privacy",
    changeFrequency: "yearly",
    priority: 0.3,
    indexable: true,
    sourceFile: "src/app/privacy/page.tsx",
  },
  {
    path: "/terms",
    changeFrequency: "yearly",
    priority: 0.3,
    indexable: true,
    sourceFile: "src/app/terms/page.tsx",
  },
  // Placeholder routes: indexable:false keeps them out of sitemap; the page
  // files themselves carry `robots: { index: false }` meta. Flip both fields
  // together once real content ships.
  {
    path: "/notice",
    changeFrequency: "weekly",
    priority: 0.3,
    indexable: false,
    sourceFile: "src/app/notice/page.tsx",
  },
  {
    path: "/feed",
    changeFrequency: "weekly",
    priority: 0.3,
    indexable: false,
    sourceFile: "src/app/feed/page.tsx",
  },
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
