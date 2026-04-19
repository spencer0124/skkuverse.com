"use client";

import { useState, useSyncExternalStore } from "react";
import LogoMark from "@/components/ui/LogoMark";

const INAPP_REGEX =
  /KAKAOTALK|kakaotalk|line\/|NAVER\(inapp|snapchat|instagram|everytimeapp|whatsApp|wadiz|FB_IAB|FB4A|FBAN|FBIOS|FBSS|DaumApps|kakaostory|band|twitter|TikTok/i;

const APP_STORE_URL = "https://apps.apple.com/app/id6446813434";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.zoyoong.skkubus";

type BannerConfig = { show: boolean; storeUrl: string };

const HIDDEN: BannerConfig = { show: false, storeUrl: "" };

function computeBannerConfig(): BannerConfig {
  const ua = navigator.userAgent;

  // 인앱 브라우저면 숨김 (InAppEscape가 처리)
  if (INAPP_REGEX.test(ua)) return HIDDEN;

  // Safari면 숨김 (네이티브 Smart Banner 사용)
  // iOS에서 모든 브라우저가 WebKit 기반이라 UA에 Safari가 포함됨
  // 실제 Safari만 판별하려면 3rd party 토큰이 없어야 함
  const isSafari =
    /Safari/.test(ua) &&
    !/Chrome|CriOS|FxiOS|EdgiOS|NAVER|naver|Whale|OPiOS|DuckDuckGo|GSA|YaBrowser/.test(
      ua
    );
  if (isSafari) return HIDDEN;

  // 세션 중 닫은 적 있으면 숨김
  if (sessionStorage.getItem("app-banner-dismissed")) return HIDDEN;

  const isIOS = /iPhone|iPad|iPod/.test(ua);
  return { show: true, storeUrl: isIOS ? APP_STORE_URL : PLAY_STORE_URL };
}

// Stable identity required by useSyncExternalStore — cache per-tab.
let clientSnapshot: BannerConfig | undefined;
function getClientSnapshot(): BannerConfig {
  clientSnapshot ??= computeBannerConfig();
  return clientSnapshot;
}
const getServerSnapshot = () => HIDDEN;
const subscribe = () => () => {};

export default function AppBanner() {
  const config = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const [dismissed, setDismissed] = useState(false);

  const dismiss = () => {
    sessionStorage.setItem("app-banner-dismissed", "1");
    setDismissed(true);
  };

  if (!config.show || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-grey-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-[1140px] px-4 py-3 flex items-center gap-3">
        {/* App icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
          <LogoMark className="w-6 h-6 text-white" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-t7 font-bold text-grey-900 truncate">스꾸버스</p>
          <p className="text-[11px] text-grey-500">앱에서 더 편리하게</p>
        </div>

        {/* Open button */}
        <a
          href={config.storeUrl}
          className="flex-shrink-0 bg-brand text-white text-t7 font-bold px-4 py-2 rounded-full"
        >
          열기
        </a>

        {/* Close button */}
        <button
          onClick={dismiss}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-grey-400 hover:text-grey-600"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
