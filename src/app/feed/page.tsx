import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "피드",
  description: "스꾸버스 팀 공지, 개발기, 팀 이야기.",
};

export default function FeedIndexPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1140px] px-6">
          <h1 className="text-display font-bold text-grey-900">피드</h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
