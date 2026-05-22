"use client";

import { useEffect, useSyncExternalStore } from "react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/links";

type Platform = "loading" | "ios" | "android" | "unknown";

function detect(): Platform {
  const ua = navigator.userAgent;
  // iPadOS 13+ reports as "Macintosh"; treat Mac + touch as iPad.
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Mac/i.test(ua) && "ontouchend" in document) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "unknown";
}

let clientSnapshot: Platform | undefined;
function getClientSnapshot(): Platform {
  clientSnapshot ??= detect();
  return clientSnapshot;
}
const getServerSnapshot = (): Platform => "loading";
const subscribe = () => () => {};

export default function DownloadClient() {
  const platform = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (platform === "ios") location.replace(APP_STORE_URL);
    else if (platform === "android") location.replace(PLAY_STORE_URL);
  }, [platform]);

  const showChoices = platform === "unknown";

  return (
    <div className="flex-1 flex items-center">
      <div className="mx-auto w-full max-w-[520px] px-6 py-10 text-center">
        <div
          aria-hidden
          className="mx-auto w-20 h-20 rounded-[22px] bg-brand text-white flex items-center justify-center text-[44px] font-bold leading-none mb-8 shadow-[0_12px_32px_rgba(31,61,47,0.22)]"
        >
          S
        </div>

        {showChoices ? (
          <>
            <h1 className="text-[32px] md:text-[44px] font-bold text-grey-900 leading-[1.2] tracking-tight mb-4 whitespace-pre-line">
              {"스꾸버스 앱\n다운로드"}
            </h1>
            <p className="text-t5 md:text-t4 text-grey-600 leading-relaxed mb-10 whitespace-pre-line">
              {"사용 중인 기기에 맞춰\n스토어로 이동해 주세요."}
            </p>

            <div className="flex flex-col gap-3 max-w-[320px] mx-auto">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener external"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-brand text-white text-t5 font-bold hover:bg-brand/90 transition-colors"
              >
                App Store에서 받기
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener external"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-grey-100 text-grey-900 text-t5 font-bold hover:bg-grey-200 transition-colors"
              >
                Google Play에서 받기
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-[28px] md:text-[36px] font-bold text-grey-900 leading-[1.2] tracking-tight mb-4">
              스토어로 이동 중...
            </h1>
            <p className="text-t5 md:text-t4 text-grey-600 leading-relaxed">
              잠시만 기다려주세요.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
