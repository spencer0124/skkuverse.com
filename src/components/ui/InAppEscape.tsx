"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";

const INAPP_REGEX =
  /KAKAOTALK|kakaotalk|line\/|NAVER\(inapp|snapchat|instagram|everytimeapp|whatsApp|wadiz|FB_IAB|FB4A|FBAN|FBIOS|FBSS|DaumApps|kakaostory|band|twitter|TikTok/i;

type EscapeKind = "idle" | "kakao" | "line" | "android" | "manual-ios";
type EscapeConfig = { kind: EscapeKind; isIOS: boolean };

const IDLE: EscapeConfig = { kind: "idle", isIOS: false };

function classify(ua: string): EscapeConfig {
  if (!INAPP_REGEX.test(ua)) return IDLE;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  if (/KAKAOTALK|kakaotalk/i.test(ua)) return { kind: "kakao", isIOS };
  if (/line\//i.test(ua)) return { kind: "line", isIOS };
  if (/Android/i.test(ua)) return { kind: "android", isIOS };
  if (isIOS) return { kind: "manual-ios", isIOS };
  return IDLE;
}

// Stable identity required by useSyncExternalStore — cache per-tab.
let clientSnapshot: EscapeConfig | undefined;
function getClientSnapshot(): EscapeConfig {
  clientSnapshot ??= classify(navigator.userAgent);
  return clientSnapshot;
}
const getServerSnapshot = () => IDLE;
const subscribe = () => () => {};

export default function InAppEscape() {
  const { kind, isIOS } = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (kind === "idle") return;
    const currentUrl = location.href;

    if (kind === "kakao") {
      location.href =
        "kakaotalk://web/openExternal?url=" + encodeURIComponent(currentUrl);
      setTimeout(() => {
        location.href = isIOS
          ? "kakaoweb://closeBrowser"
          : "kakaotalk://inappbrowser/close";
      }, 300);
      return;
    }

    if (kind === "line") {
      const separator = currentUrl.includes("?") ? "&" : "?";
      location.href = currentUrl + separator + "openExternalBrowser=1";
      return;
    }

    if (kind === "android") {
      const intentUrl = currentUrl.replace(/https?:\/\//i, "");
      location.href = `intent://${intentUrl}#Intent;scheme=https;end`;
      return;
    }

    if (kind === "manual-ios") {
      navigator.clipboard.writeText(currentUrl).catch(() => {
        // clipboard API 실패 시 fallback
        const textarea = document.createElement("textarea");
        textarea.value = currentUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      });
    }
  }, [kind, isIOS]);

  if (kind === "idle") return null;

  // 자동 탈출 중 로딩 화면
  if (kind !== "manual-ios") {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-t5 text-grey-700 font-medium">
          브라우저로 이동 중...
        </p>
      </div>
    );
  }

  // iOS 수동 탈출 안내 화면 — 진입 시 optimistic하게 복사 완료 UI 표시
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center px-8">
      <Image
        src="/logo.svg"
        alt="스꾸버스 로고"
        width={64}
        height={64}
        className="w-16 h-16 rounded-2xl mb-6"
        unoptimized
      />

      <h2 className="text-t3 font-bold text-grey-900 text-center mb-3">
        Safari에서 열어주세요
      </h2>

      <p className="text-t5 text-grey-500 text-center leading-relaxed mb-8">
        이 앱의 브라우저에서는 일부 기능이
        <br />
        제한될 수 있어요.
      </p>

      <div className="w-full max-w-sm space-y-4">
        <div className="bg-grey-50 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand text-white text-t7 font-bold flex items-center justify-center">
              1
            </span>
            <p className="text-t6 text-grey-700 pt-0.5">
              주소가 <span className="font-bold text-brand">복사되었어요</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand text-white text-t7 font-bold flex items-center justify-center">
              2
            </span>
            <p className="text-t6 text-grey-700 pt-0.5">
              <span className="font-bold">Safari</span>를 열고 주소창을 길게 터치한 뒤
              <br />
              <span className="font-bold">&apos;붙여놓기 및 이동&apos;</span>을 눌러주세요
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            location.href = "x-web-search://?";
          }}
          className="w-full bg-brand text-white text-t5 font-bold py-4 rounded-2xl"
        >
          Safari 열기
        </button>
      </div>
    </div>
  );
}
