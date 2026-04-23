import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TermsContent from "@/components/terms/TermsContent";

const DESC =
  "스꾸버스 서비스 이용약관. 서비스 성격, 정보 제공의 한계, 책임한계와 법적고지 등 이용자가 알아야 할 사항을 정리했습니다.";

export const metadata: Metadata = {
  title: "이용약관",
  description: DESC,
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "/terms",
    title: "이용약관",
    description: DESC,
  },
  twitter: { title: "이용약관", description: DESC },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[800px] px-6">
          <h1 className="text-display font-bold text-grey-900 mb-10">
            이용약관
          </h1>
          <TermsContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
