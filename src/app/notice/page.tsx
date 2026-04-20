import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AI 공지 - 스꾸버스",
  description: "성균관대 공지사항을 AI가 요약해 전달합니다.",
  robots: {
    index: false,
    follow: true,
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
