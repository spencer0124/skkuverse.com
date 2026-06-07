/**
 * Mini-app share-link landing — the universal link `https://skkuverse.com/p/m/<slug>`
 * (in AASA `/p/m/*`). When the app is installed and the link is tapped from another
 * app, iOS opens the app BEFORE this renders. This page only shows when the app
 * isn't installed / in-Safari: offer "open in app" (custom scheme) + store CTAs.
 *
 * Generic for any slug (Cloudflare Pages Function, no per-slug prerender).
 */

const APP_STORE_URL = 'https://apps.apple.com/kr/app/skku-bus/id6446813434';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zoyoong.skkubus';
const SLUG_RE = /^[a-z0-9-]+$/;

export const onRequest: PagesFunction = async ({ params }) => {
  const segs = (params.slug as string[] | undefined) ?? [];
  const raw = (segs[segs.length - 1] ?? '').trim();
  const id = SLUG_RE.test(raw) ? raw : '';

  return new Response(page(id), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'noindex',
    },
  });
};

function page(id: string): string {
  const openBtn = id
    ? `<a class="cta" href="skkuverse://m/${escapeAttr(id)}">스꾸버스 앱에서 열기</a>`
    : '';
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>스꾸버스 앱에서 열기</title>
<meta name="robots" content="noindex" />
<link rel="icon" href="https://skkuverse.com/logo.png" />
<style>
:root{--fg:#191F28;--grey500:#8B95A1;--grey100:#F2F4F6;--accent:#1A8A5C;--bg:#fff}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;flex-direction:column;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--fg);-webkit-font-smoothing:antialiased;line-height:1.5}
.wrap{max-width:420px;margin:0 auto;padding:40px 24px;text-align:center}
img.logo{width:84px;height:84px;border-radius:20px;box-shadow:0 2px 12px rgba(0,0,0,.1)}
h1{font-size:24px;font-weight:800;margin:24px 0 8px}
p{color:var(--grey500);font-size:15px;margin:0 0 28px}
a{display:block;text-decoration:none;border-radius:14px;padding:15px;margin-bottom:10px;font-weight:700}
a.cta{background:var(--accent);color:#fff}
a.store{background:var(--grey100);color:var(--fg)}
</style>
</head>
<body>
<div class="wrap">
  <img class="logo" src="https://skkuverse.com/logo.png" alt="스꾸버스" />
  <h1>스꾸버스 앱에서 열어주세요</h1>
  <p>앱이 설치돼 있으면 자동으로 열려요.<br/>아직 없다면 아래에서 받아보세요.</p>
  ${openBtn}
  <a class="store" href="${APP_STORE_URL}">App Store에서 받기</a>
  <a class="store" href="${PLAY_STORE_URL}">Google Play에서 받기</a>
</div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
