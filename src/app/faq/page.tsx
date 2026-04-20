import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "자주 묻는 질문 - 스꾸버스",
  description: "스꾸버스 서비스 이용에 대한 자주 묻는 질문.",
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[800px] px-6">
          <h1 className="text-display font-bold text-grey-900">
            자주 묻는 질문
          </h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
