/**
 * Mini-app "홈 화면에 추가" launcher — generic, Toss `service.toss.im/app-mini-home/shortcut`
 * style. The app opens this in EXTERNAL Safari with ?id=<slug>&title=<name>&iconUrl=<png>.
 *
 * This path is intentionally NOT in the AASA applinks, so the app's Linking.openURL
 * lands in Safari (not back in the app). Behavior:
 *   - In Safari (normal tab): show "공유 > 홈 화면에 추가" instructions. The icon/title
 *     come from the query, so the home-screen shortcut shows the mini-app's logo/name.
 *   - Standalone (home-icon launch): redirect to `skkuverse://m/<id>` (custom scheme always
 *     opens the app if installed) with a store fallback. This avoids relying on the
 *     unverified "standalone auto-fires the universal link" behavior.
 */

const APP_STORE_URL = 'https://apps.apple.com/kr/app/skku-bus/id6446813434';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zoyoong.skkubus';
const FALLBACK_ICON = 'https://skkuverse.com/logo.png';
const SLUG_RE = /^[a-z0-9-]+$/;

export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const rawId = (url.searchParams.get('id') ?? '').trim();
  const id = SLUG_RE.test(rawId) ? rawId : '';
  const title = (url.searchParams.get('title') ?? '미니앱').trim() || '미니앱';
  const iconParam = (url.searchParams.get('iconUrl') ?? '').trim();
  const iconUrl = iconParam.startsWith('https://') ? iconParam : FALLBACK_ICON;

  const html = page({ id, title, iconUrl });
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // No caching: per-mini-app meta is query-driven.
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};

function page({ id, title, iconUrl }: { id: string; title: string; iconUrl: string }): string {
  const t = escapeAttr(title);
  const icon = escapeAttr(iconUrl);
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${escapeHtml(title)}</title>
<meta name="robots" content="noindex" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="${t}" />
<link rel="apple-touch-icon" href="${icon}" />
<link rel="icon" href="${icon}" />
<style>
:root{--fg:#191F28;--grey600:#6B7684;--grey500:#8B95A1;--grey100:#F2F4F6;--accent:#1A8A5C;--blue:#3182F6;--bg:#fff}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--fg);-webkit-font-smoothing:antialiased;line-height:1.55}
.wrap{max-width:520px;margin:0 auto;padding:32px 24px 64px}
.app{display:flex;flex-direction:column;align-items:flex-start;gap:14px}
.app img{width:72px;height:72px;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.1)}
h1{font-size:26px;line-height:1.35;font-weight:800;margin:18px 0 28px}
ol{list-style:none;counter-reset:s;padding:0;margin:0;display:flex;flex-direction:column;gap:22px}
li{counter-increment:s;display:flex;align-items:center;gap:14px;font-size:18px;font-weight:600}
li::before{content:counter(s);color:var(--blue);font-weight:800;font-size:18px;min-width:14px}
.chip{display:inline-flex;align-items:center;gap:6px;background:var(--grey100);border-radius:10px;padding:6px 12px;font-weight:700;font-size:16px}
.ic{width:22px;height:22px;vertical-align:middle}
.note{margin-top:40px;color:var(--grey500);font-size:14px}
.fallback{display:none;margin-top:32px}
.fallback a{display:block;text-align:center;background:var(--accent);color:#fff;font-weight:700;text-decoration:none;border-radius:14px;padding:15px;margin-bottom:10px}
.fallback a.store{background:var(--grey100);color:var(--fg)}
</style>
</head>
<body>
<div class="wrap">
  <div class="app">
    <img src="${icon}" alt="${t}" />
  </div>
  <h1>${escapeHtml(title)}를<br/>휴대폰 홈 화면에 추가해보세요</h1>
  <ol>
    <li>오른쪽 아래 <span class="chip">${SHARE_ICON} 공유</span> 아이콘을 누르고,</li>
    <li>새로 뜬 창을 스크롤해서</li>
    <li><span class="chip">${PLUS_ICON} 홈 화면에 추가</span> 를 선택해주세요</li>
  </ol>
  <p class="note">홈 화면 아이콘을 누르면 스꾸버스 앱에서 ${escapeHtml(title)}가 바로 열려요.</p>

  <div class="fallback" id="fb">
    <a href="skkuverse://m/${escapeAttr(id)}">스꾸버스 앱에서 열기</a>
    <a class="store" href="${APP_STORE_URL}">App Store에서 받기</a>
    <a class="store" href="${PLAY_STORE_URL}">Google Play에서 받기</a>
  </div>
</div>
<script>
(function(){
  var id=${JSON.stringify(id)};
  var ua=navigator.userAgent||'';
  var store=/android/i.test(ua)?${JSON.stringify(PLAY_STORE_URL)}:${JSON.stringify(APP_STORE_URL)};
  var standalone=(window.navigator.standalone===true)||(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches);
  if(standalone && id){
    // Home-icon launch → open the app via custom scheme; fall back to the store
    // if nothing handled it (app not installed). pagehide cancels the fallback
    // once the app takes over.
    var fb=setTimeout(function(){location.href=store;},1500);
    window.addEventListener('pagehide',function(){clearTimeout(fb);});
    location.href='skkuverse://m/'+id;
  } else if(!id){
    // No/invalid slug → just offer the store + manual open.
    document.getElementById('fb').style.display='block';
  }
})();
</script>
</body>
</html>`;
}

const SHARE_ICON =
  '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#3182F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg>';
const PLUS_ICON =
  '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#191F28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';

function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
