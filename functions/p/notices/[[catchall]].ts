/**
 * Notice viewer — Cloudflare Pages Function for /p/notices/<sourceId>/<articleNo>.
 *
 * Mirrors the mobile NoticeDetailScreen as closely as the web platform allows:
 *   - Hero: title + meta row (date · author · views) + type chip
 *   - AI Summary card (sparkle + summary.text) — same grey background as mobile
 *   - Meta card (period rows / location rows / detail rows)
 *   - Markdown body via marked, with custom image renderer:
 *       - parseDimHint({WxH}) → <img width=N height=N> for CLS prevention
 *       - src rewritten through files.skkuverse.com/notices/proxy/attachment
 *         (mode=inline) so the proxy injects the source-page Referer that
 *         SKKU's image server requires. Browser <img> can't set arbitrary
 *         Referer, so the proxy hop is the only option.
 *   - Attachment list with preview / download buttons via the same proxy
 *     (mode=inline for previewable, mode=download for hwp/doc/etc.)
 *   - Open-original button + Android JS CTA for app install
 *
 * iOS smart banner via apple-itunes-app meta (when env.APPLE_APP_STORE_ID set);
 * Android falls back to JS CTA — no <meta name="google-play-app"> (that's a
 * third-party JS-library convention, not a Chrome native feature).
 *
 * Cache pipeline:
 *   1. Strip tracking params (utm_*, fbclid, gclid) from URL → cache key
 *   2. GET-only `Request` for the cache key (avoids method/header fingerprint)
 *   3. cache.put wrapped in try/catch (silent rejection visible in logs)
 *   4. Status-specific Cache-Control:
 *      200 = public,max-age=300,s-maxage=3600
 *      404 = public,max-age=60,s-maxage=300 (absorb bot retries)
 *      5xx-fallback = no-store (no cache.put — don't pin transient outage)
 *   5. X-Cache: HIT/MISS marker (cf-cache-status tracks Cloudflare's
 *      static-asset cache layer, not Workers Cache API; X-Cache is the
 *      only reliable signal)
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

// ── API response shapes ────────────────────────────────────────────

type SummaryType = 'action_required' | 'event' | 'informational';

interface NoticePeriod {
  label: string | null;
  startDate: string | null;
  startTime: string | null;
  endDate: string | null;
  endTime: string | null;
}

interface NoticeLocation {
  label: string | null;
  detail: string;
}

interface NoticeSummaryDetails {
  target: string | null;
  action: string | null;
  host: string | null;
  impact: string | null;
}

interface NoticeDetailSummary {
  text: string | null;
  oneLiner: string | null;
  type: SummaryType | null;
  periods: NoticePeriod[];
  locations: NoticeLocation[];
  details: NoticeSummaryDetails | null;
}

interface NoticeAttachment {
  name: string;
  url: string;
  referer?: string;
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
  views?: number;
  contentMarkdown?: string | null;
  attachments?: NoticeAttachment[];
  sourceUrl: string;
  summary?: NoticeDetailSummary | null;
}

interface NoticeApiResponse {
  meta?: { lang?: string };
  data: NoticeData;
}

// ── Constants ──────────────────────────────────────────────────────

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

const PROXY_BASE = 'https://files.skkuverse.com/notices/proxy/attachment';

// File extensions that the attachment proxy can't preview inline (Office
// formats / archives). Mobile UI shows the preview button as disabled +
// "이 파일 형식은 미리보기를 지원하지 않아요" toast; web mirrors by hiding
// the preview button entirely and only showing download.
const NO_PREVIEW_EXTS = new Set([
  '.hwp', '.hwpx', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip',
]);

// Type chip removed — mobile NoticeDetailScreen does not render a type
// chip on the detail page (only the deadline pill on NoticeRow in lists),
// and the goal is web-detail to mirror mobile-detail exactly. SummaryType
// is still used as a NoticeData field type so the import stays.

// ── Entry ──────────────────────────────────────────────────────────

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, params, env, waitUntil } = ctx;

  // 1. Validate path
  const segments = (params.catchall as string[] | undefined) ?? [];
  if (segments.length !== 2) {
    return Response.redirect(new URL('/', request.url).toString(), 302);
  }
  const [sourceId, articleNoStr] = segments;
  if (!SOURCE_ID_RE.test(sourceId) || !ARTICLE_NO_RE.test(articleNoStr)) {
    return Response.redirect(new URL('/', request.url).toString(), 302);
  }
  const articleNo = Number(articleNoStr);

  // 2. Build normalized cache key
  const url = new URL(request.url);
  for (const p of TRACKING_PARAMS) url.searchParams.delete(p);
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const cache = (caches as unknown as { default: Cache }).default;

  // 3. Cache-first lookup
  const cached = await cache.match(cacheKey);
  if (cached) {
    const h = new Headers(cached.headers);
    h.set('X-Cache', 'HIT');
    return new Response(cached.body, {
      status: cached.status,
      statusText: cached.statusText,
      headers: h,
    });
  }

  // 4. API fetch with timeout
  const apiBase = env.API_BASE ?? DEFAULT_API_BASE;
  const apiUrl = `${apiBase}/notices/${sourceId}/${articleNo}`;
  let apiResponse: Response;
  try {
    apiResponse = await fetch(apiUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });
  } catch {
    return notFoundResponse(env, /* isTransient */ true);
  }

  if (apiResponse.status === 404) {
    const response = notFoundResponse(env, /* isTransient */ false);
    waitUntil(safeCachePut(cache, cacheKey, response));
    return response;
  }

  if (!apiResponse.ok) {
    return notFoundResponse(env, /* isTransient */ true);
  }

  let envelope: NoticeApiResponse;
  try {
    envelope = (await apiResponse.json()) as NoticeApiResponse;
  } catch {
    return notFoundResponse(env, /* isTransient */ true);
  }
  const notice = envelope.data;
  if (!notice || notice.sourceId !== sourceId || notice.articleNo !== articleNo) {
    return notFoundResponse(env, /* isTransient */ true);
  }

  // 5. Render + cache
  const html = noticeHtml(notice, request.url, env);
  const response = new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
      'X-Cache': 'MISS',
    },
  });
  waitUntil(safeCachePut(cache, cacheKey, response));
  return response;
};

async function safeCachePut(cache: Cache, key: Request, response: Response): Promise<void> {
  try {
    await cache.put(key, response.clone());
  } catch (e) {
    console.error('cache.put failed', e instanceof Error ? e.message : String(e));
  }
}

// ── Top-level renderer ─────────────────────────────────────────────

function noticeHtml(notice: NoticeData, requestUrl: string, env: Env): string {
  const canonical = canonicalUrl(notice.sourceId, notice.articleNo);
  const description = ogDescription(notice);
  const summary = notice.summary;

  // Hero mirrors mobile NoticeDetailScreen exactly: title + meta row (date ·
  // author · views). No type chip (mobile detail doesn't render one), no
  // department in meta (mobile metaRow only shows date/author/views).
  const heroMeta = renderHeroMeta(notice);
  const aiSummary = summary?.text ? renderAiSummary(summary.text) : '';
  const metaCard = summary ? renderMetaCard(summary) : '';
  const bodyHtml = notice.contentMarkdown
    ? renderMarkdown(notice.contentMarkdown, notice.sourceUrl)
    : '<p class="empty">본문이 없는 공지예요.</p>';
  const attachments = renderAttachments(notice.attachments ?? [], notice.sourceUrl);
  const banner = androidCta(notice.sourceId, notice.articleNo, env);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
${headMeta({
  title: notice.title,
  description,
  canonical,
  appStoreId: env.APPLE_APP_STORE_ID,
})}
<style>${baseStyles()}</style>
</head>
<body>
${inAppEscapeScript()}
<main class="container">
  <a class="back" href="/notice">← AI 공지</a>
  <header class="hero">
    <h1>${escapeHtml(notice.title)}</h1>
    ${heroMeta}
  </header>
  ${aiSummary}
  ${metaCard}
  <article class="content">${bodyHtml}</article>
  ${attachments}
  <footer class="cta">
    <a class="open-source" href="${escapeAttr(notice.sourceUrl)}" rel="noopener noreferrer" target="_blank">원본 페이지 열기</a>
    ${banner}
  </footer>
</main>
</body>
</html>`;
}

// ── Hero meta + type chip ──────────────────────────────────────────

function renderHeroMeta(notice: NoticeData): string {
  // Mirror mobile NoticeDetailScreen.metaRow exactly: date · author · views.
  // department is intentionally NOT rendered here even though the API ships
  // it — mobile detail's metaRow doesn't show it, and the saved-list row
  // (NoticeRow with showDepartment) is a different surface. Keeping web in
  // visual lock-step with mobile detail avoids "this looks slightly different
  // on the web" friction for users who tap a shared link.
  const parts: string[] = [];
  if (notice.date) parts.push(escapeHtml(formatDisplayDate(notice.date)));
  if (notice.author) parts.push(escapeHtml(notice.author));
  if (typeof notice.views === 'number' && notice.views > 0) {
    parts.push(`조회 ${notice.views.toLocaleString('ko-KR')}`);
  }
  if (parts.length === 0) return '';
  return `<div class="meta">${parts.join(' <span class="dot">·</span> ')}</div>`;
}

// ── AI summary card (matches mobile SummaryCard "Card 1") ──────────

function renderAiSummary(text: string): string {
  return `<section class="ai-summary">
  <div class="ai-header">
    <svg class="sparkle" viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M8 0l1.6 4.4L14 6 9.6 7.6 8 12 6.4 7.6 2 6l4.4-1.6L8 0zm5 9l.7 1.9L16 11.6l-2.3.7L13 14.6l-.7-2.3L10 11.6l2.3-.7L13 9z"/>
    </svg>
    <span>AI 요약</span>
  </div>
  <p>${escapeHtml(text)}</p>
</section>`;
}

// ── Meta card (matches mobile SummaryCard "Card 2") ────────────────

function renderMetaCard(summary: NoticeDetailSummary): string {
  const rows: { label: string; value: string }[] = [];

  for (const period of summary.periods) {
    const line = formatPeriod(period);
    if (!line) continue;
    rows.push({ label: period.label ?? '기간', value: line });
  }

  for (const loc of summary.locations) {
    rows.push({
      label: '장소',
      value: loc.label ? `${loc.label}: ${loc.detail}` : loc.detail,
    });
  }

  if (summary.details) {
    if (summary.details.target) rows.push({ label: '대상', value: summary.details.target });
    if (summary.details.action) rows.push({ label: '해야 할 일', value: summary.details.action });
    if (summary.details.host) rows.push({ label: '주최', value: summary.details.host });
    if (summary.details.impact) rows.push({ label: '참고', value: summary.details.impact });
  }

  if (rows.length === 0) return '';

  const items = rows
    .map(
      (r) => `<div class="meta-row">
  <span class="meta-label">${escapeHtml(r.label)}</span>
  <span class="meta-value">${escapeHtml(r.value)}</span>
</div>`,
    )
    .join('\n');

  return `<section class="meta-card">${items}</section>`;
}

function formatPeriod(p: NoticePeriod): string | null {
  const { startDate, startTime, endDate, endTime } = p;
  if (!startDate && !endDate) return null;

  if (startDate && endDate) {
    if (startDate === endDate) {
      if (startTime && endTime) {
        return `${formatDisplayDate(startDate)} ${startTime} ~ ${endTime}`;
      }
      if (startTime) return `${formatDisplayDate(startDate)} ${startTime}`;
      return formatDisplayDate(startDate);
    }
    return `${joinDateTime(startDate, startTime)} ~ ${joinDateTime(endDate, endTime)}`;
  }

  if (endDate) return `~${joinDateTime(endDate, endTime)}`;
  return `${joinDateTime(startDate!, startTime)}~`;
}

function joinDateTime(date: string, time: string | null): string {
  const d = formatDisplayDate(date);
  return time ? `${d} ${time}` : d;
}

// ── Markdown body with proxied images ──────────────────────────────

function renderMarkdown(markdown: string, sourceUrl: string): string {
  const renderer = new marked.Renderer();

  // Image override: proxy through files.skkuverse.com so the proxy injects
  // the Referer header SKKU's image server requires. parseDimHint extracts
  // crawler-injected {WxH}/{wN}/{hN} prefixes from alt — passed as width/
  // height attrs so modern browsers can reserve aspect ratio (CLS=0) before
  // image load completes.
  renderer.image = (token) => {
    const href: string = token.href;
    const text: string = token.text ?? '';
    const { width, height, cleanAlt } = parseDimHint(text);
    const proxied = buildProxyUrl(href, sourceUrl, 'inline');
    const dimAttrs =
      width && height
        ? ` width="${width}" height="${height}"`
        : width
          ? ` width="${width}"`
          : '';
    const altAttr = cleanAlt ? ` alt="${escapeAttr(cleanAlt)}"` : ' alt=""';
    return `<img src="${escapeAttr(proxied)}"${altAttr}${dimAttrs} loading="lazy" />`;
  };

  // Link override: external links open in new tab + noopener.
  renderer.link = (token) => {
    const href: string = token.href;
    const inner = (marked.parser as unknown as (toks: unknown[]) => string)(
      token.tokens ?? [],
    );
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
    }
    // mailto:, tel:, etc. — render as-is, browser handles the protocol.
    return `<a href="${escapeAttr(href)}">${inner}</a>`;
  };

  return marked.parse(markdown, {
    renderer,
    gfm: true,
    breaks: true,
    async: false,
  }) as string;
}

/** Parse `{WxH}`, `{wN}`, `{hN}` prefix from crawler-injected alt text.
 *  Mirrors mobile NoticeMarkdownView.parseDimHint. */
function parseDimHint(alt: string | undefined): {
  width?: number;
  height?: number;
  cleanAlt: string;
} {
  if (!alt) return { cleanAlt: '' };
  // [\s\S] instead of /s flag (the latter requires ES2018+; tsconfig is on ES2017).
  const full = alt.match(/^\{(\d+)x(\d+)\}\s?([\s\S]*)/);
  if (full) return { width: +full[1], height: +full[2], cleanAlt: full[3] };
  const wOnly = alt.match(/^\{w(\d+)\}\s?([\s\S]*)/);
  if (wOnly) return { width: +wOnly[1], cleanAlt: wOnly[2] };
  const hOnly = alt.match(/^\{h(\d+)\}\s?([\s\S]*)/);
  if (hOnly) return { height: +hOnly[1], cleanAlt: hOnly[2] };
  return { cleanAlt: alt };
}

function buildProxyUrl(
  url: string,
  sourceUrl: string,
  mode: 'inline' | 'download',
  name?: string,
): string {
  const params = new URLSearchParams({ url, referer: sourceUrl, mode });
  if (name) params.set('name', name);
  return `${PROXY_BASE}?${params.toString()}`;
}

// ── Attachment list ────────────────────────────────────────────────

function renderAttachments(
  attachments: NoticeAttachment[],
  sourceUrl: string,
): string {
  if (!attachments || attachments.length === 0) return '';

  const rows = attachments
    .map((a) => {
      const previewable = canPreview(a.name);
      const previewUrl = buildProxyUrl(a.url, a.referer ?? sourceUrl, 'inline', a.name);
      const downloadUrl = buildProxyUrl(a.url, a.referer ?? sourceUrl, 'download', a.name);
      const previewBtn = previewable
        ? `<a class="att-btn att-preview" href="${escapeAttr(previewUrl)}" target="_blank" rel="noopener noreferrer">미리보기</a>`
        : '';
      return `<li class="att-item">
  <div class="att-name">
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M9.5 1.5a3 3 0 0 1 3 3v7.25A4.25 4.25 0 0 1 8.25 16 4.25 4.25 0 0 1 4 11.75V4.5a.75.75 0 0 1 1.5 0v7.25a2.75 2.75 0 0 0 5.5 0V4.5a1.5 1.5 0 0 0-3 0v7a.5.5 0 0 0 1 0v-6a.75.75 0 0 1 1.5 0v6A2 2 0 0 1 8 13.5a2 2 0 0 1-2-2v-7a3 3 0 0 1 3-3z"/></svg>
    <span>${escapeHtml(a.name)}</span>
  </div>
  <div class="att-actions">
    ${previewBtn}
    <a class="att-btn att-download" href="${escapeAttr(downloadUrl)}">다운로드</a>
  </div>
</li>`;
    })
    .join('\n');

  return `<section class="attachments">
  <h2>첨부파일</h2>
  <ul>${rows}</ul>
</section>`;
}

function canPreview(name: string): boolean {
  const ext = (name.match(/\.[^.]+$/) ?? [''])[0].toLowerCase();
  return !NO_PREVIEW_EXTS.has(ext);
}

// ── Smart banner / Android CTA / 404 ───────────────────────────────

function notFoundResponse(env: Env, isTransient: boolean): Response {
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
${inAppEscapeScript()}
<main class="container">
  <div class="empty-state">
    <h1>공지를 찾을 수 없어요</h1>
    <p>${isTransient ? '잠시 후 다시 시도해 주세요.' : '이 공지는 삭제되었거나 이동했을 수 있어요.'}</p>
    <a class="cta-link" href="/notice">AI 공지로 가기</a>
  </div>
</main>
</body>
</html>`;
  return new Response(html, {
    status: isTransient ? 200 : 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': isTransient ? 'no-store' : 'public, max-age=60, s-maxage=300',
      'X-Cache': 'MISS',
    },
  });
}

function headMeta(opts: {
  title: string;
  description: string;
  canonical: string;
  appStoreId: string | undefined;
}): string {
  const { title, description, canonical, appStoreId } = opts;
  const ogImage = 'https://skkuverse.com/logo.svg';
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

/**
 * In-app browser escape — mirrors the homepage's React `InAppEscape`
 * component (`src/components/ui/InAppEscape.tsx`) but inlined as vanilla JS
 * so it works on Pages Function HTML which never goes through Next.js
 * rendering. Same UA regex + same 4-way branch (kakao / line / android /
 * manual-ios). Idle path is a no-op (overlay stays hidden, no flash).
 *
 * Why escape: KakaoTalk/Instagram/Naver in-app webviews break universal
 * links (app-installed users would land in the webview instead of the
 * native app), session cookies, and some auth flows. Forcing the system
 * browser restores parity with the homepage and the rest of the share UX.
 */
function inAppEscapeScript(): string {
  return `<div id="iae-overlay" hidden></div>
<script>
(function () {
  var INAPP = /KAKAOTALK|kakaotalk|line\\/|NAVER\\(inapp|snapchat|instagram|everytimeapp|whatsApp|wadiz|FB_IAB|FB4A|FBAN|FBIOS|FBSS|DaumApps|kakaostory|band|twitter|TikTok/i;
  var ua = navigator.userAgent;
  if (!INAPP.test(ua)) return;
  var isIOS = /iPhone|iPad|iPod/.test(ua);
  var url = location.href;
  var overlay = document.getElementById('iae-overlay');
  if (!overlay) return;

  function showLoading() {
    overlay.innerHTML = '<div class="iae-card"><div class="iae-spin"></div><p class="iae-msg">브라우저로 이동 중...</p></div>';
    overlay.removeAttribute('hidden');
  }
  function showManualIOS() {
    overlay.innerHTML =
      '<div class="iae-manual">' +
        '<h2>Safari에서 열어주세요</h2>' +
        '<p class="iae-sub">이 앱의 브라우저에서는 일부 기능이<br>제한될 수 있어요.</p>' +
        '<div class="iae-steps">' +
          '<div class="iae-step"><span class="iae-num">1</span><p>주소가 <strong>복사되었어요</strong></p></div>' +
          '<div class="iae-step"><span class="iae-num">2</span><p><strong>Safari</strong>를 열고 주소창을 길게 터치한 뒤<br><strong>붙여놓기 및 이동</strong>을 눌러주세요</p></div>' +
        '</div>' +
        '<button class="iae-btn" type="button">Safari 열기</button>' +
      '</div>';
    overlay.removeAttribute('hidden');
    var btn = overlay.querySelector('.iae-btn');
    if (btn) btn.addEventListener('click', function () { location.href = 'x-web-search://?'; });
  }

  if (/KAKAOTALK|kakaotalk/i.test(ua)) {
    showLoading();
    location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(url);
    setTimeout(function () {
      location.href = isIOS ? 'kakaoweb://closeBrowser' : 'kakaotalk://inappbrowser/close';
    }, 300);
    return;
  }
  if (/line\\//i.test(ua)) {
    showLoading();
    location.href = url + (url.indexOf('?') > -1 ? '&' : '?') + 'openExternalBrowser=1';
    return;
  }
  if (/Android/i.test(ua)) {
    showLoading();
    var path = url.replace(/^https?:\\/\\//i, '');
    location.href = 'intent://' + path + '#Intent;scheme=https;end';
    return;
  }
  if (isIOS) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(function () {});
    } else {
      try {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) {}
    }
    showManualIOS();
    return;
  }
})();
</script>`;
}

function androidCta(sourceId: string, articleNo: number, env: Env): string {
  const pkg = env.ANDROID_PACKAGE_NAME ?? DEFAULT_ANDROID_PACKAGE;
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}`;
  const appUrl = `https://skkuverse.com/p/notices/${encodeURIComponent(sourceId)}/${articleNo}`;
  return `<a class="open-app" href="${escapeAttr(appUrl)}" data-android-fallback="${escapeAttr(playStoreUrl)}">앱에서 보기</a>
<script>
(function () {
  var btn = document.querySelector('.open-app');
  if (!btn) return;
  var ua = navigator.userAgent;
  if (/Android/i.test(ua)) {
    btn.addEventListener('click', function () {
      setTimeout(function () { window.location.href = btn.dataset.androidFallback; }, 600);
    });
  } else if (!/iPhone|iPad|iPod/i.test(ua)) {
    btn.style.display = 'none';
  }
})();
</script>`;
}

// ── OG description / format helpers ────────────────────────────────

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
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
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

function formatDisplayDate(date: string): string {
  // Mirror mobile: "2026-04-25" → "26.04.25"
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.slice(2).replace(/-/g, '.') : date;
}

function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Styles ─────────────────────────────────────────────────────────

function baseStyles(): string {
  return `
:root {
  --fg: #191F28; --grey900: #191F28; --grey800: #333D4B; --grey700: #4E5968;
  --grey600: #6B7684; --grey500: #8B95A1; --grey400: #B0B8C1; --grey200: #E5E8EB;
  --grey100: #F2F4F6; --grey50: #F9FAFB;
  --bg: #FFFFFF; --accent: #1A8A5C; --blue500: #3182F6;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--grey900); line-height: 1.6; -webkit-font-smoothing: antialiased; }
.container { max-width: 720px; margin: 0 auto; padding: 16px 20px 80px; }
.back { display: inline-block; color: var(--grey500); text-decoration: none; font-size: 14px; margin-bottom: 12px; }
.back:hover { color: var(--grey700); }

.hero { margin-bottom: 16px; }
.hero h1 { margin: 4px 0 8px; font-size: 24px; font-weight: 700; line-height: 1.4; word-break: keep-all; }
.meta { color: var(--grey500); font-size: 14px; }
.meta .dot { color: var(--grey400); margin: 0 2px; }

/* In-app browser escape overlay (mirrors src/components/ui/InAppEscape.tsx). */
#iae-overlay { position: fixed; inset: 0; z-index: 9999; background: #fff; display: flex; align-items: center; justify-content: center; padding: 32px 24px; }
#iae-overlay[hidden] { display: none; }
.iae-card { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.iae-spin { width: 40px; height: 40px; border: 3px solid var(--accent); border-top-color: transparent; border-radius: 50%; animation: iae-spin 1s linear infinite; }
@keyframes iae-spin { to { transform: rotate(360deg); } }
.iae-msg { font-size: 15px; font-weight: 500; color: var(--grey700); margin: 0; }
.iae-manual { width: 100%; max-width: 360px; display: flex; flex-direction: column; align-items: center; }
.iae-manual h2 { font-size: 22px; font-weight: 700; color: var(--grey900); text-align: center; margin: 24px 0 12px; }
.iae-sub { font-size: 14px; color: var(--grey500); text-align: center; line-height: 1.6; margin: 0 0 32px; }
.iae-steps { background: var(--grey50); border-radius: 16px; padding: 20px; width: 100%; }
.iae-step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.iae-step:last-child { margin-bottom: 0; }
.iae-step .iae-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; }
.iae-step p { margin: 0; padding-top: 2px; font-size: 14px; color: var(--grey700); line-height: 1.55; }
.iae-step strong { font-weight: 700; color: var(--accent); }
.iae-step:nth-child(2) strong { color: var(--grey900); }
.iae-btn { width: 100%; max-width: 360px; margin-top: 16px; padding: 16px; background: var(--accent); color: #fff; font-size: 15px; font-weight: 700; border: 0; border-radius: 16px; cursor: pointer; }

.ai-summary { background: var(--grey50); border-radius: 10px; padding: 14px; margin: 12px 0 8px; }
.ai-summary .ai-header { display: flex; align-items: center; gap: 6px; color: var(--grey600); font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.ai-summary .sparkle { opacity: 0.7; }
.ai-summary p { margin: 0; color: var(--grey700); font-size: 14px; line-height: 1.7; }

.meta-card { border: 1px solid var(--grey100); border-radius: 10px; overflow: hidden; margin: 4px 0 16px; }
.meta-row { display: flex; align-items: flex-start; padding: 12px 14px; gap: 12px; border-top: 1px solid var(--grey100); }
.meta-row:first-child { border-top: 0; }
.meta-label { width: 70px; flex-shrink: 0; color: var(--grey500); font-size: 13px; }
.meta-value { flex: 1; color: var(--grey800); font-size: 13px; word-break: keep-all; }

.content { font-size: 16px; color: var(--grey800); margin-top: 8px; }
.content h1, .content h2, .content h3, .content h4, .content h5, .content h6 { color: var(--grey900); margin: 24px 0 8px; line-height: 1.4; word-break: keep-all; }
.content h1 { font-size: 22px; }
.content h2 { font-size: 20px; }
.content h3 { font-size: 18px; }
.content h4 { font-size: 16px; }
.content p { margin: 6px 0; line-height: 1.7; }
.content a { color: var(--blue500); text-decoration: underline; word-break: break-all; }
.content img { display: block; max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; }
.content blockquote { margin: 8px 0; padding: 4px 12px; border-left: 3px solid var(--grey200); color: var(--grey600); }
.content code { background: var(--grey50); color: var(--grey800); padding: 1px 4px; border-radius: 3px; font-size: 0.9em; font-family: SFMono-Regular, Menlo, monospace; }
.content pre { background: var(--grey50); padding: 12px; border-radius: 6px; overflow-x: auto; }
.content pre code { background: transparent; padding: 0; }
.content ul, .content ol { padding-left: 24px; margin: 8px 0; }
.content li { margin: 2px 0; }
.content table { border-collapse: collapse; border: 1px solid var(--grey200); margin: 8px 0; width: 100%; }
.content th, .content td { padding: 6px 10px; border: 1px solid var(--grey200); text-align: left; }
.content th { background: var(--grey50); }
.content hr { border: 0; border-top: 1px solid var(--grey200); margin: 16px 0; }
.content .empty { color: var(--grey500); }

.attachments { margin-top: 18px; padding: 14px; border-radius: 10px; background: var(--grey50); }
.attachments h2 { margin: 0 0 10px; font-size: 14px; font-weight: 600; color: var(--grey800); }
.attachments ul { list-style: none; padding: 0; margin: 0; }
.att-item { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; padding: 6px 0; gap: 8px; }
.att-name { display: flex; align-items: center; gap: 8px; flex: 1 1 60%; min-width: 0; color: var(--grey800); font-size: 13px; word-break: break-all; }
.att-name svg { color: var(--grey600); flex-shrink: 0; }
.att-actions { display: flex; gap: 8px; align-items: center; margin-left: 22px; }
.att-btn { font-size: 13px; color: var(--blue500); text-decoration: none; padding: 4px 0; }
.att-btn:hover { text-decoration: underline; }

.cta { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--grey100); display: flex; flex-direction: column; gap: 10px; }
.open-source { display: block; padding: 14px 20px; border: 1px solid var(--grey200); border-radius: 10px; text-align: center; color: var(--grey800); text-decoration: none; font-weight: 500; }
.open-source:hover { background: var(--grey50); }
.open-app { display: block; padding: 14px 20px; background: var(--accent); color: #fff; border-radius: 10px; text-align: center; text-decoration: none; font-weight: 600; }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-state h1 { margin: 0 0 12px; font-size: 22px; }
.empty-state p { color: var(--grey500); margin: 0 0 32px; }
.cta-link { display: inline-block; padding: 12px 24px; background: var(--accent); color: #fff; border-radius: 10px; text-decoration: none; font-weight: 500; }
`;
}
