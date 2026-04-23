import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PrivacyContent from "@/components/privacy/PrivacyContent";

const DESC = "스꾸버스가 수집·이용하는 개인정보의 항목·목적·보유기간 안내.";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: DESC,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "개인정보처리방침",
    description: DESC,
  },
  twitter: { title: "개인정보처리방침", description: DESC },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[800px] px-6">
          <h1 className="text-display font-bold text-grey-900 mb-4">
            개인정보처리방침
          </h1>
          <PrivacyContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
