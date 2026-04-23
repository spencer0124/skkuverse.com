import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const DESC =
  "스꾸버스 서비스 이용에 대해 가장 많이 묻는 질문과 답변을 모았습니다.";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: DESC,
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    url: "/faq",
    title: "자주 묻는 질문",
    description: DESC,
  },
  twitter: { title: "자주 묻는 질문", description: DESC },
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
