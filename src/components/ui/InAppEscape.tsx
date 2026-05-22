"use client";

import { useEffect } from "react";

const INAPP_REGEX =
  /KAKAOTALK|kakaotalk|line\/|NAVER\(inapp|snapchat|instagram|everytimeapp|whatsApp|wadiz|FB_IAB|FB4A|FBAN|FBIOS|FBSS|DaumApps|kakaostory|band|twitter|TikTok/i;

export default function InAppEscape() {
  useEffect(() => {
    const ua = navigator.userAgent;
    if (!INAPP_REGEX.test(ua)) return;
    const url = location.href;
    const isIOS = /iPhone|iPad|iPod/.test(ua);

    if (/KAKAOTALK|kakaotalk/i.test(ua)) {
      location.href =
        "kakaotalk://web/openExternal?url=" + encodeURIComponent(url);
      setTimeout(() => {
        location.href = isIOS
          ? "kakaoweb://closeBrowser"
          : "kakaotalk://inappbrowser/close";
      }, 300);
      return;
    }

    if (/line\//i.test(ua)) {
      const sep = url.includes("?") ? "&" : "?";
      location.href = url + sep + "openExternalBrowser=1";
      return;
    }

    if (/Android/i.test(ua)) {
      const intentUrl = url.replace(/https?:\/\//i, "");
      location.href = `intent://${intentUrl}#Intent;scheme=https;end`;
    }
  }, []);

  return null;
}
