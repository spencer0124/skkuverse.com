/**
 * Notice viewer — Cloudflare Pages Function for /p/notices/<sourceId>/<articleNo>.
 *
 * This Function takes precedence over the Next.js static export at the same path
 * (Pages Functions outrank static assets in Cloudflare Pages routing). It serves
 * as the universal-link fallback: when a recipient taps a shared notice URL but
 * does NOT have the mobile app installed, AASA delegates fall through to the
 * browser, which lands here.
 *
 * Pipeline:
 *   1. Validate path segments (sourceId regex, articleNo numeric).
 *   2. Normalize cache key (strip tracking params, GET-only Request) — without
 *      this, viral KakaoTalk/Slack shares with `?utm_source=...` fragment one
 *      hot notice across N cache slots and the "absorb unfurl spikes" cost
 *      model collapses.
 *   3. Cache-first lookup; on miss, fetch from skkuverse-server API with a 3s
 *      AbortSignal.timeout (don't return 5xx to crawlers — they retry-storm).
 *   4. Render HTML with OG meta (title/description/url/image) for unfurl
 *      previews + iOS smart banner (apple-itunes-app meta, requires App Store
 *      ID in env) + Android JS CTA fallback (Play Store deep link).
 *   5. Status-specific Cache-Control: 200=public,max-age=300,s-maxage=3600
 *      (5min browser, 1hr edge), 404=public,max-age=60,s-maxage=300 (short
 *      cache absorbs bot retries without hiding fresh re-creations),
 *      5xx-fallback=no-store (don't pin transient outage through recovery).
 *   6. cache.put via ctx.waitUntil for 200 + 404; SKIP for 5xx-fallback.
 */

import { marked } from 'marked';

interface Env {
  /** Optional override; defaults to https://api.skkuverse.com */
  API_BASE?: string;
  /** Numeric App Store ID (e.g., "1234567890"). If unset, smart banner is omitted. */
  APPLE_APP_STORE_ID?: string;
  /** Android package, defaults to com.zoyoong.skkubus */
  ANDROID_PACKAGE_NAME?: string;
}

interface NoticeSummary {
  oneLiner?: string | null;
  type?: 'action_required' | 'event' | 'informational' | null;
}

interface NoticeData {
  id: string;
  sourceId: string;
  articleNo: number;
  title: string;
  category?: string | null;
  author?: string | null;
  department?: string | null;
  date: string;
  contentMarkdown?: string | null;
  sourceUrl: string;
  summary?: NoticeSummary | null;
}

interface NoticeApiResponse {
  meta?: { lang?: string };
  data: NoticeData;
}

const SOURCE_ID_RE = /^[a-z0-9-]+$/;
const ARTICLE_NO_RE = /^\d+$/;
const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
];

const DEFAULT_API_BASE = 'https://api.skkuverse.com';
const DEFAULT_ANDROID_PACKAGE = 'com.zoyoong.skkubus';
const FETCH_TIMEOUT_MS = 3000;
const OG_DESCRIPTION_LIMIT = 200;

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, params, env, waitUntil } = ctx;

  // ── 1. Validate path ─────────────────────────────────────────────
  const segments = (params.catchall as string[] | undefined) ?? [];
  if (segments.length !== 2) {
    return Response.redirect(new URL('/', request.url).toString(), 302);
  }
  const [sourceId, articleNoStr] = segments;
  if (!SOURCE_ID_RE.test(sourceId) || !ARTICLE_NO_RE.test(articleNoStr)) {
    return Response.redirect(new URL('/', request.url).toString(), 302);
  }
  const articleNo = Number(articleNoStr);

  // ── 2. Build normalized cache key ────────────────────────────────
  const url = new URL(request.url);
  for (const p of TRACKING_PARAMS) url.searchParams.delete(p);
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  // `caches.default` is Workers-specific; DOM's CacheStorage shadows the
  // Workers type when both lib: ["dom"] and @cloudflare/workers-types are
  // active. This cast resolves the conflict at compile time; runtime is
  // unaffected (Pages Functions runtime always provides .default).
  const cache = (caches as unknown as { default: Cache }).default;

  // ── 3. Cache-first lookup ────────────────────────────────────────
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  // ── 4. API fetch with timeout ────────────────────────────────────
  const apiBase = env.API_BASE ?? DEFAULT_API_BASE;
  const apiUrl = `${apiBase}/notices/${sourceId}/${articleNo}`;
  let apiResponse: Response;
  try {
    apiResponse = await fetch(apiUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });
  } catch {
    // Network failure / timeout — graceful fallback page, NOT cached.
    // Returning 5xx to unfurl crawlers triggers retry storms; 200 with a
    // plain "couldn't load" page is friendlier and is overridden on next
    // user attempt (no-store).
    return notFoundResponse(request.url, env, /* isTransient */ true);
  }

  if (apiResponse.status === 404) {
    const response = notFoundResponse(request.url, env, /* isTransient */ false);
    waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  if (!apiResponse.ok) {
    // 5xx or unexpected — same fallback as network failure, also not cached.
    return notFoundResponse(request.url, env, /* isTransient */ true);
  }

  let envelope: NoticeApiResponse;
  try {
    envelope = (await apiResponse.json()) as NoticeApiResponse;
  } catch {
    return notFoundResponse(request.url, env, /* isTransient */ true);
  }
  const notice = envelope.data;
  if (!notice || notice.sourceId !== sourceId || notice.articleNo !== articleNo) {
    // Sanity check — defends against API drift returning a different notice.
    return notFoundResponse(request.url, env, /* isTransient */ true);
  }

  // ── 5. Render + cache ────────────────────────────────────────────
  const html = noticeHtml(notice, request.url, env);
  const response = new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
  waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};

// ── Renderers ──────────────────────────────────────────────────────

function noticeHtml(notice: NoticeData, requestUrl: string, env: Env): string {
  const canonical = canonicalUrl(notice.sourceId, notice.articleNo);
  const description = ogDescription(notice);
  const bodyHtml = notice.contentMarkdown
    ? (marked.parse(notice.contentMarkdown, { gfm: true, breaks: true, async: false }) as string)
    : '<p class="empty">본문이 없는 공지예요.</p>';
  const meta = headMeta({
    title: notice.title,
    description,
    canonical,
    requestUrl,
    appStoreId: env.APPLE_APP_STORE_ID,
  });
  const banner = androidCta(notice.sourceId, notice.articleNo, env);
  const dateLine = [notice.department, formatDate(notice.date)].filter(Boolean).join(' · ');
  return `<!DOCTYPE html>
<html lang="ko">
<head>
${meta}
<style>${baseStyles()}</style>
</head>
<body>
<main class="container">
  <header class="hero">
    <a class="back" href="/">← skkuverse.com</a>
    <h1>${escapeHtml(notice.title)}</h1>
    <div class="meta">${escapeHtml(dateLine)}</div>
    ${notice.summary?.oneLiner ? `<p class="oneliner">${escapeHtml(notice.summary.oneLiner)}</p>` : ''}
  </header>
  <article class="content">${bodyHtml}</article>
  <footer class="cta">
    <a class="open-source" href="${escapeAttr(notice.sourceUrl)}" rel="noopener noreferrer" target="_blank">원본 페이지 열기</a>
    ${banner}
  </footer>
</main>
</body>
</html>`;
}

function notFoundResponse(requestUrl: string, env: Env, isTransient: boolean): Response {
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>공지를 찾을 수 없어요 · skkuverse</title>
${env.APPLE_APP_STORE_ID ? `<meta name="apple-itunes-app" content="app-id=${escapeAttr(env.APPLE_APP_STORE_ID)}">` : ''}
<style>${baseStyles()}</style>
</head>
<body>
<main class="container">
  <div class="empty-state">
    <h1>공지를 찾을 수 없어요</h1>
    <p>${isTransient ? '잠시 후 다시 시도해 주세요.' : '이 공지는 삭제되었거나 이동했을 수 있어요.'}</p>
    <a class="cta-link" href="/">홈으로 가기</a>
  </div>
</main>
</body>
</html>`;
  // Transient (5xx-fallback or network error): no-store. Don't pin a
  // temporary outage through the recovery window.
  // Permanent 404: short-cache to absorb bot retries without hiding a
  // freshly-crawled re-creation longer than 5min.
  return new Response(html, {
    status: isTransient ? 200 : 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': isTransient ? 'no-store' : 'public, max-age=60, s-maxage=300',
    },
  });
}

// ── HTML helpers ───────────────────────────────────────────────────

function headMeta(opts: {
  title: string;
  description: string;
  canonical: string;
  requestUrl: string;
  appStoreId: string | undefined;
}): string {
  const { title, description, canonical, appStoreId } = opts;
  const ogImage = 'https://skkuverse.com/logo.svg'; // TODO: replace with PNG og-default
  const smartBanner = appStoreId
    ? `<meta name="apple-itunes-app" content="app-id=${escapeAttr(appStoreId)}, app-argument=${escapeAttr(canonical)}">`
    : '';
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · skkuverse</title>
<link rel="canonical" href="${escapeAttr(canonical)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeAttr(title)}">
<meta property="og:description" content="${escapeAttr(description)}">
<meta property="og:url" content="${escapeAttr(canonical)}">
<meta property="og:image" content="${escapeAttr(ogImage)}">
<meta property="og:site_name" content="skkuverse">
<meta name="twitter:card" content="summary_large_image">
${smartBanner}`;
}

function androidCta(sourceId: string, articleNo: number, env: Env): string {
  const pkg = env.ANDROID_PACKAGE_NAME ?? DEFAULT_ANDROID_PACKAGE;
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}`;
  const appUrl = `https://skkuverse.com/p/notices/${encodeURIComponent(sourceId)}/${articleNo}`;
  // No <meta name="google-play-app"> — that's a third-party JS-library
  // convention, not a Chrome native feature. We render a CTA button
  // instead and let the user choose.
  return `<a class="open-app" href="${escapeAttr(appUrl)}" data-android-fallback="${escapeAttr(playStoreUrl)}">앱에서 보기</a>
<script>
(function () {
  var btn = document.querySelector('.open-app');
  if (!btn) return;
  var ua = navigator.userAgent;
  if (/Android/i.test(ua)) {
    btn.addEventListener('click', function (e) {
      // Try opening the universal link; if app isn't installed the browser
      // stays on this page. Falls through to Play Store after a short
      // delay.
      setTimeout(function () {
        window.location.href = btn.dataset.androidFallback;
      }, 600);
    });
  } else if (!/iPhone|iPad|iPod/i.test(ua)) {
    // Desktop: hide the CTA, let the iOS smart banner handle iOS Safari.
    btn.style.display = 'none';
  }
})();
</script>`;
}

function ogDescription(notice: NoticeData): string {
  const oneLiner = notice.summary?.oneLiner;
  if (oneLiner) return clip(oneLiner, OG_DESCRIPTION_LIMIT);
  if (notice.contentMarkdown) {
    return clip(stripMarkdown(notice.contentMarkdown), OG_DESCRIPTION_LIMIT);
  }
  return notice.title;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // images + links → alt/text
    .replace(/[#*_`>~]/g, '')
    .replace(/^\s*[-+*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clip(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…';
}

function canonicalUrl(sourceId: string, articleNo: number): string {
  return `https://skkuverse.com/p/notices/${encodeURIComponent(sourceId)}/${articleNo}`;
}

function formatDate(date: string): string {
  // Server returns YYYY-MM-DD. Render as YYYY.MM.DD for consistency with app.
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.replace(/-/g, '.') : date;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function baseStyles(): string {
  return `
:root { --fg: #191F28; --muted: #4E5968; --bg: #F9FAFB; --accent: #1A8A5C; --border: #E5E8EB; }
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--fg); line-height: 1.6; }
.container { max-width: 720px; margin: 0 auto; padding: 24px 20px 80px; }
.back { display: inline-block; color: var(--muted); text-decoration: none; font-size: 14px; margin-bottom: 16px; }
.hero h1 { margin: 0 0 8px; font-size: 24px; font-weight: 700; line-height: 1.35; }
.meta { color: var(--muted); font-size: 14px; }
.oneliner { background: #F0FAF6; border-left: 3px solid var(--accent); padding: 12px 16px; margin: 20px 0 0; color: #03B26C; font-weight: 500; border-radius: 0 8px 8px 0; }
.content { margin-top: 32px; font-size: 16px; }
.content h1, .content h2, .content h3 { margin-top: 32px; margin-bottom: 12px; line-height: 1.4; }
.content h1 { font-size: 22px; }
.content h2 { font-size: 19px; }
.content h3 { font-size: 17px; }
.content p { margin: 12px 0; }
.content a { color: var(--accent); text-decoration: underline; }
.content img { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; }
.content blockquote { margin: 12px 0; padding: 8px 16px; border-left: 3px solid var(--border); color: var(--muted); }
.content code { background: #F2F4F6; padding: 1px 4px; border-radius: 3px; font-size: 0.9em; }
.content pre { background: #F2F4F6; padding: 12px; border-radius: 6px; overflow-x: auto; }
.content ul, .content ol { padding-left: 24px; }
.content li { margin: 4px 0; }
.empty { color: var(--muted); }
.cta { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; }
.open-source { display: block; padding: 14px 20px; border: 1px solid var(--border); border-radius: 10px; text-align: center; color: var(--fg); text-decoration: none; font-weight: 500; }
.open-app { display: block; padding: 14px 20px; background: var(--accent); color: #fff; border-radius: 10px; text-align: center; text-decoration: none; font-weight: 600; }
.empty-state { text-align: center; padding: 80px 20px; }
.empty-state h1 { margin: 0 0 12px; font-size: 22px; }
.empty-state p { color: var(--muted); margin: 0 0 32px; }
.cta-link { display: inline-block; padding: 12px 24px; background: var(--accent); color: #fff; border-radius: 10px; text-decoration: none; font-weight: 500; }
`;
}
