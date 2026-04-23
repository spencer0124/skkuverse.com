import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

// Universal-link fallback landing.
//
// On iOS/Android with the 스꾸버스 app installed, tapping skkuverse.com/p/transit
// is intercepted by the OS (via apple-app-site-association / assetlinks.json,
// configured app-side) and routed into the app's transit screen. When the app
// isn't installed — or when the user is on desktop — the navigation falls
// through to this static page, whose single job is to drive app installs.
//
// Noindex: this is a conversion endpoint, not a content page. We don't want
// it competing with /bus or the detail pages in brand search results.

export const metadata: Metadata = {
  title: "스꾸버스 앱에서 열기",
  description:
    "스꾸버스 앱을 설치하고 셔틀버스 실시간 도착정보와 학기별 시간표를 바로 확인하세요.",
  alternates: { canonical: "/p/transit" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/p/transit`,
    title: "스꾸버스 앱에서 열기",
    description:
      "스꾸버스 앱을 설치하고 셔틀버스 실시간 도착정보와 학기별 시간표를 바로 확인하세요.",
  },
};

export default function TransitLandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Mini top bar — just the brand logo; no full site nav so attention
          stays on the single download CTA below. */}
      <div className="mx-auto w-full max-w-[720px] px-6 py-6">
        <Link
          href="/"
          aria-label={`${SITE_NAME} 홈으로`}
          className="inline-flex items-center gap-2"
        >
          <Image
            src="/logo.svg"
            alt={`${SITE_NAME} 로고`}
            width={28}
            height={28}
            className="w-7 h-7 rounded-lg"
            unoptimized
            priority
          />
          <span className="text-t4 font-bold text-grey-900">{SITE_NAME}</span>
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center">
        <div className="mx-auto w-full max-w-[520px] px-6 py-10 text-center">
          <div
            aria-hidden
            className="mx-auto w-20 h-20 rounded-[22px] bg-brand text-white flex items-center justify-center text-[44px] font-bold leading-none mb-8 shadow-[0_12px_32px_rgba(31,61,47,0.22)]"
          >
            S
          </div>

          <h1 className="text-[32px] md:text-[44px] font-bold text-grey-900 leading-[1.2] tracking-tight mb-4 whitespace-pre-line">
            {"스꾸버스 앱에서\n열어주세요"}
          </h1>
          <p className="text-t5 md:text-t4 text-grey-600 leading-relaxed mb-10 whitespace-pre-line">
            {"셔틀버스 실시간 도착정보와\n학기별 시간표를 바로 확인할 수 있어요."}
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

          <Link
            href="/bus"
            className="inline-block mt-8 text-t6 text-grey-500 hover:text-grey-700 underline decoration-grey-300 underline-offset-4"
          >
            앱 없이 웹에서 보기 →
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[720px] px-6 py-8 text-center">
        <p className="text-t7 text-grey-400">© 2026 {SITE_NAME}</p>
      </div>
    </main>
  );
}
