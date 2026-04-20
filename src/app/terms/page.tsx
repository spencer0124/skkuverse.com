import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "이용약관 - 스꾸버스",
  description: "스꾸버스 서비스 이용약관.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[800px] px-6">
          <h1 className="text-display font-bold text-grey-900">이용약관</h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
