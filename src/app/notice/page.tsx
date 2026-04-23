import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const DESC =
  "성균관대학교 공지사항을 AI가 요약해 보여드립니다. 한 줄 요약, 마감일, 대상 태그로 꼭 봐야 할 공지만 빠르게 확인하세요.";

export const metadata: Metadata = {
  title: "AI 공지",
  description: DESC,
  alternates: { canonical: "/notice" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: "/notice",
    title: "AI 공지",
    description: DESC,
  },
  twitter: {
    title: "AI 공지",
    description: DESC,
  },
};

export default function NoticeIndexPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1140px] px-6">
          <h1 className="text-display font-bold text-grey-900">AI 공지</h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
