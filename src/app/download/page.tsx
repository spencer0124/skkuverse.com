import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import DownloadClient from "./DownloadClient";

export const metadata: Metadata = {
  title: "스꾸버스 앱 다운로드",
  description:
    "스꾸버스 앱을 설치하고 셔틀버스 실시간 도착정보, 공지, 학사 일정을 한 번에 확인하세요.",
  alternates: { canonical: "/download" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/download`,
    title: "스꾸버스 앱 다운로드",
    description:
      "스꾸버스 앱을 설치하고 셔틀버스 실시간 도착정보, 공지, 학사 일정을 한 번에 확인하세요.",
  },
};

export default function DownloadPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="mx-auto w-full max-w-[720px] px-6 py-6">
        <Link
          href="/"
          aria-label={`${SITE_NAME} 홈으로`}
          className="inline-flex items-center gap-2"
        >
          <Image
            src="/logo.png"
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

      <DownloadClient />

      <div className="mx-auto w-full max-w-[720px] px-6 py-8 text-center">
        <p className="text-t7 text-grey-400">© 2026 {SITE_NAME}</p>
      </div>
    </main>
  );
}
