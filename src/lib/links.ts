export const APP_STORE_URL =
  "https://apps.apple.com/kr/app/skku-bus/id6446813434";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.zoyoong.skkubus";

// Returns the correct store URL for the current mobile browser.
// iPadOS 13+ reports itself as "Macintosh" in UA, so we also check for touch.
export function getMobileStoreUrl(): string {
  if (typeof navigator === "undefined") return PLAY_STORE_URL;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return APP_STORE_URL;
  if (
    typeof document !== "undefined" &&
    /Mac/i.test(ua) &&
    "ontouchend" in document
  ) {
    return APP_STORE_URL;
  }
  return PLAY_STORE_URL;
}
